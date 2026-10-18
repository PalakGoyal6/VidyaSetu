import { NextRequest, NextResponse } from 'next/server';
import { CAREERS, AI_CAREER_RESPONSES } from '@/lib/data';

// Mock AI chat endpoint - simulates Gemini/LLM responses with profiling
export async function POST(req: NextRequest) {
  const { message, lang = 'en', profile = {}, conversationHistory = [] } = await req.json();
  
  const msgLower = message.toLowerCase();
  
  // Determine profile fields from conversation
  let updatedProfile = { ...profile };
  let responseText = '';
  let suggestedCareers: string[] = [];
  let profileFields: Record<string, string> = {};
  
  // AI profiling logic - extract info from user messages
  const greetings = ['hello', 'hi', 'namaste', 'नमस्ते', 'हेलो', 'start', 'begin'];
  const isGreeting = greetings.some(g => msgLower.includes(g));
  
  // Detect profile data
  const classMatch = msgLower.match(/class\s*(\d+)|(\d+)(?:th|st|nd|rd)?\s*class|कक्षा\s*(\d+)/i);
  if (classMatch) {
    const classNum = classMatch[1] || classMatch[2] || classMatch[3];
    profileFields.currentClass = `Class ${classNum}`;
  }

  const statePatterns: [string, string][] = [
    ['rajasthan', 'Rajasthan'], ['up', 'Uttar Pradesh'], ['uttar pradesh', 'Uttar Pradesh'],
    ['bihar', 'Bihar'], ['mp', 'Madhya Pradesh'], ['madhya pradesh', 'Madhya Pradesh'],
    ['maharashtra', 'Maharashtra'], ['gujarat', 'Gujarat'], ['west bengal', 'West Bengal'],
    ['karnataka', 'Karnataka'], ['tamil', 'Tamil Nadu'], ['kerala', 'Kerala'],
    ['haryana', 'Haryana'], ['punjab', 'Punjab'], ['odisha', 'Odisha'],
  ];
  for (const [pattern, state] of statePatterns) {
    if (msgLower.includes(pattern)) { profileFields.state = state; break; }
  }

  const interestKeywords = ['like', 'love', 'enjoy', 'good at', 'interest', 'पसंद', 'अच्छा', 'मुझे'];
  if (interestKeywords.some(k => msgLower.includes(k))) {
    const foundInterests: string[] = [];
    Object.keys(AI_CAREER_RESPONSES).forEach(keyword => {
      if (msgLower.includes(keyword)) foundInterests.push(keyword);
    });
    if (foundInterests.length > 0) profileFields.interests = foundInterests.join(', ');
  }

  updatedProfile = { ...updatedProfile, ...profileFields };
  
  // Generate contextual AI response
  const historyLength = conversationHistory.length;
  
  if (isGreeting && historyLength === 0) {
    if (lang === 'hi') {
      responseText = `नमस्ते! 🙏 मैं विद्यासेतु AI हूं। मैं आपको आपके सपनों का करियर खोजने में मदद करूंगा।\n\nआप मुझे बताइए:\n• आप अभी किस कक्षा में हैं?\n• आप किस राज्य से हैं?\n• आपको क्या करना पसंद है?`;
    } else {
      responseText = `Namaste! 🙏 I'm VidyaSetu AI. I'm here to help you discover your ideal career path.\n\nTell me about yourself:\n• Which class are you currently in?\n• Which state are you from?\n• What do you enjoy doing most?`;
    }
  } else if (historyLength <= 2 && !updatedProfile.currentClass) {
    responseText = lang === 'hi' 
      ? `बहुत अच्छा! आप किस कक्षा में पढ़ रहे हैं? (जैसे: कक्षा 9, 10, 11, 12 या कॉलेज में)`
      : `That's great! Which class/grade are you currently studying in? (e.g., Class 9, 10, 11, 12, or College)`;
  } else if (!updatedProfile.interests) {
    responseText = lang === 'hi'
      ? `अच्छा! अब मुझे बताइए — आपको सबसे ज़्यादा क्या करना पसंद है? जैसे:\n🎨 कला/रचनात्मक काम\n💻 कंप्यूटर/तकनीक\n🌾 खेती/प्रकृति\n🏥 स्वास्थ्य/लोगों की मदद\n🔧 मशीन/मरम्मत\n📚 पढ़ाना/लिखना`
      : `Great! Now tell me — what do you enjoy most?\n🎨 Art & creative work\n💻 Computers & technology\n🌾 Farming & nature\n🏥 Health & helping people\n🔧 Machines & repairs\n📚 Teaching & writing`;
  } else {
    // Match careers from interests
    const allMatches = new Set<string>();
    Object.entries(AI_CAREER_RESPONSES).forEach(([keyword, careerIds]) => {
      const searchText = JSON.stringify(updatedProfile).toLowerCase();
      if (searchText.includes(keyword)) {
        careerIds.forEach(id => allMatches.add(id));
      }
    });
    
    if (allMatches.size === 0) {
      AI_CAREER_RESPONSES.default.forEach(id => allMatches.add(id));
    }
    
    suggestedCareers = Array.from(allMatches).slice(0, 5);
    const matchedCareers = suggestedCareers.map(id => CAREERS.find(c => c.id === id)).filter(Boolean);
    
    if (lang === 'hi') {
      responseText = `बहुत बढ़िया! 🌟 आपकी रुचि और पृष्ठभूमि के आधार पर, ये करियर विकल्प आपके लिए बेहतरीन हो सकते हैं:\n\n${matchedCareers.map(c => `${c!.icon} **${c!.titleHi}** — ${c!.avgSalary}`).join('\n')}\n\nइनमें से कौन सा आपको सबसे ज़्यादा पसंद है? मैं उसके लिए पूरा सीखने का रास्ता बताऊंगा! 🚀`;
    } else {
      responseText = `Excellent! 🌟 Based on your interests and background, here are the best career options for you:\n\n${matchedCareers.map(c => `${c!.icon} **${c!.title}** — ${c!.avgSalary}`).join('\n')}\n\nWhich one interests you most? I'll create your complete personalized learning path! 🚀`;
    }
  }

  return NextResponse.json({
    response: responseText,
    profile: updatedProfile,
    suggestedCareers,
    profileFields,
  });
}
