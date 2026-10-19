import { NextRequest, NextResponse } from 'next/server';
import { CAREERS, AI_CAREER_RESPONSES } from '@/lib/data';

// AI chat endpoint with robust profiling and natural conversational responses
export async function POST(req: NextRequest) {
  const { message, lang = 'en', profile = {}, conversationHistory = [] } = await req.json();
  
  const msgLower = message.toLowerCase();
  
  let updatedProfile = { ...profile };
  let responseText = '';
  let suggestedCareers: string[] = [];
  const profileFields: Record<string, string> = {};
  
  // 1. Detect Class / Grade
  // Matches "in 12th", "12th", "class 12", "12 standard", "12th grade", "कक्षा 12", "12वीं"
  const classRegexList = [
    /\b(?:class|grade|standard|कक्षा|std)\s*([0-9]{1,2})(?:th|st|nd|rd)?\b/i,
    /\b(?:in|of)\s*([0-9]{1,2})(?:th|st|nd|rd)\b/i,
    /\b([0-9]{1,2})(?:th|st|nd|rd)\b/i,
    /(?:कक्षा\s*([0-9]{1,2}))|([0-9]{1,2})वीं/i,
  ];

  for (const regex of classRegexList) {
    const match = msgLower.match(regex);
    if (match) {
      const num = match[1] || match[2];
      if (num && parseInt(num, 10) >= 5 && parseInt(num, 10) <= 12) {
        profileFields.currentClass = `Class ${num}`;
        break;
      }
    }
  }

  if (!profileFields.currentClass && !updatedProfile.currentClass) {
    if (msgLower.includes('iti')) profileFields.currentClass = 'ITI';
    else if (msgLower.includes('polytechnic') || msgLower.includes('diploma')) profileFields.currentClass = 'Polytechnic / Diploma';
    else if (msgLower.includes('btech') || msgLower.includes('b.tech') || msgLower.includes('engineering student')) profileFields.currentClass = 'B.Tech / Engineering';
    else if (msgLower.includes('college') || msgLower.includes('bca') || msgLower.includes('bba') || msgLower.includes('bsc') || msgLower.includes('bcom') || msgLower.includes('graduate')) profileFields.currentClass = 'College Student';
  }

  // 2. Detect Name
  // e.g. "I'm Palak", "My name is Palak", "i am Palak", "मेरा नाम पलक है"
  const nameMatch = message.match(/(?:my name is|i am|i'm|name is|मेरा नाम|नाम है)\s+([A-Za-z\u0900-\u097F]+)/i);
  if (nameMatch) {
    const rawName = nameMatch[1].replace(/[^a-zA-Z\u0900-\u097F]/g, '').trim();
    const blacklist = ['a', 'an', 'in', 'from', 'studying', 'interested', 'here', 'looking', 'good', 'just', 'currently', 'pursuing', 'also'];
    if (rawName && !blacklist.includes(rawName.toLowerCase())) {
      profileFields.name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    }
  }

  // 3. Detect State / Region
  const statePatterns: [string, string][] = [
    ['delhi', 'Delhi NCR'], ['new delhi', 'Delhi NCR'], ['ncr', 'Delhi NCR'],
    ['uttar pradesh', 'Uttar Pradesh'], ['up', 'Uttar Pradesh'],
    ['bihar', 'Bihar'],
    ['rajasthan', 'Rajasthan'], ['jaipur', 'Rajasthan'],
    ['madhya pradesh', 'Madhya Pradesh'], ['mp', 'Madhya Pradesh'], ['bhopal', 'Madhya Pradesh'], ['indore', 'Madhya Pradesh'],
    ['maharashtra', 'Maharashtra'], ['mumbai', 'Maharashtra'], ['pune', 'Maharashtra'],
    ['gujarat', 'Gujarat'], ['ahmedabad', 'Gujarat'],
    ['west bengal', 'West Bengal'], ['kolkata', 'West Bengal'], ['bengal', 'West Bengal'],
    ['karnataka', 'Karnataka'], ['bangalore', 'Karnataka'], ['bengaluru', 'Karnataka'],
    ['tamil nadu', 'Tamil Nadu'], ['chennai', 'Tamil Nadu'], ['tamil', 'Tamil Nadu'],
    ['telangana', 'Telangana'], ['hyderabad', 'Telangana'],
    ['andhra pradesh', 'Andhra Pradesh'], ['andhra', 'Andhra Pradesh'],
    ['kerala', 'Kerala'],
    ['haryana', 'Haryana'], ['gurgaon', 'Haryana'], ['gurugram', 'Haryana'],
    ['punjab', 'Punjab'], ['chandigarh', 'Punjab / Chandigarh'],
    ['odisha', 'Odisha'], ['orissa', 'Odisha'],
    ['jharkhand', 'Jharkhand'], ['ranchi', 'Jharkhand'],
    ['chhattisgarh', 'Chhattisgarh'],
    ['uttarakhand', 'Uttarakhand'], ['dehradun', 'Uttarakhand'],
    ['himachal pradesh', 'Himachal Pradesh'], ['himachal', 'Himachal Pradesh'],
    ['assam', 'Assam'], ['guwahati', 'Assam'],
    ['goa', 'Goa'],
    ['jammu', 'Jammu & Kashmir'], ['kashmir', 'Jammu & Kashmir'],
  ];

  for (const [pattern, stateName] of statePatterns) {
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    if (regex.test(message)) {
      profileFields.state = stateName;
      break;
    }
  }

  // 4. Detect Stream / Subject Interests
  const detectedInterests: string[] = [];

  // Academic streams
  if (/\bpcm\b/i.test(message) || /\bphysics[\s,]+chemistry[\s,]+math/i.test(message)) {
    detectedInterests.push('Math', 'Science', 'Technology');
    if (!profileFields.goals && !updatedProfile.goals) profileFields.goals = 'Engineering & Technology';
  }
  if (/\bpcb\b/i.test(message) || /\bphysics[\s,]+chemistry[\s,]+bio/i.test(message)) {
    detectedInterests.push('Biology', 'Healthcare', 'Science');
    if (!profileFields.goals && !updatedProfile.goals) profileFields.goals = 'Medical & Healthcare';
  }
  if (/\bpcmb\b/i.test(message)) {
    detectedInterests.push('Science', 'Math', 'Healthcare', 'Technology');
  }
  if (/\bcommerce\b/i.test(msgLower)) {
    detectedInterests.push('Business', 'Finance', 'Accounting');
    if (!profileFields.goals && !updatedProfile.goals) profileFields.goals = 'Commerce & Business';
  }
  if (/\barts\b|\bhumanities\b/i.test(msgLower)) {
    detectedInterests.push('Design', 'Social Work', 'Teaching');
  }

  // General subject / vocational interest keywords
  const keywordMappings: [string, string][] = [
    ['computer', 'Computer'], ['coding', 'Programming'], ['software', 'Software'],
    ['tech', 'Technology'], ['math', 'Math'], ['maths', 'Math'],
    ['science', 'Science'], ['farming', 'Agriculture'], ['agri', 'Agriculture'],
    ['art', 'Art & Design'], ['design', 'Design'], ['drawing', 'Creative Art'],
    ['teach', 'Teaching'], ['doctor', 'Healthcare'], ['nurse', 'Healthcare'],
    ['health', 'Healthcare'], ['business', 'Business'], ['electric', 'Electrician'],
    ['repair', 'Electronics Repair'], ['mechanic', 'Automotive'],
  ];

  for (const [kw, label] of keywordMappings) {
    if (new RegExp(`\\b${kw}`, 'i').test(message)) {
      if (!detectedInterests.includes(label)) detectedInterests.push(label);
    }
  }

  if (detectedInterests.length > 0) {
    const existing = updatedProfile.interests ? updatedProfile.interests.split(', ') : [];
    const combined = Array.from(new Set([...existing, ...detectedInterests]));
    profileFields.interests = combined.join(', ');
  }

  // 5. Detect Goals
  const goalMatch = message.match(/(?:want to be|want to become|goal is|aim is|aspire to|dream is|बनना चाहता|बनना चाहती|लक्ष्य है|सपना है|career goal)\s*(?:to be|a|an)?\s*([a-zA-Z\u0900-\u097F\s]+)/i);
  if (goalMatch) {
    const rawGoal = goalMatch[1].trim().replace(/[.,!?]+$/, '');
    if (rawGoal.length > 2 && rawGoal.length < 50) {
      profileFields.goals = rawGoal.charAt(0).toUpperCase() + rawGoal.slice(1);
    }
  }

  // Merge into updated profile
  updatedProfile = { ...updatedProfile, ...profileFields };

  // Compute matched careers
  const allMatches = new Set<string>();
  const searchText = `${JSON.stringify(updatedProfile)} ${message}`.toLowerCase();
  Object.entries(AI_CAREER_RESPONSES).forEach(([keyword, careerIds]) => {
    if (searchText.includes(keyword)) {
      careerIds.forEach(id => allMatches.add(id));
    }
  });

  if (allMatches.size === 0) {
    AI_CAREER_RESPONSES.default.forEach(id => allMatches.add(id));
  }

  suggestedCareers = Array.from(allMatches).slice(0, 5);
  const matchedCareers = suggestedCareers.map(id => CAREERS.find(c => c.id === id)).filter(Boolean);

  // 6. Generate Contextual AI Response
  const name = updatedProfile.name;
  const currentClass = updatedProfile.currentClass;
  const state = updatedProfile.state;
  const interests = updatedProfile.interests;

  const greetings = ['hello', 'hi', 'namaste', 'नमस्ते', 'हेलो', 'start', 'begin'];
  const isGreetingOnly = greetings.some(g => msgLower.trim() === g);

  if (isGreetingOnly && conversationHistory.length === 0) {
    responseText = lang === 'hi'
      ? `नमस्ते! 🙏 मैं विद्यासेतु AI हूं। मैं आपको आपके सपनों का करियर खोजने में मदद करूंगा।\n\nआप मुझे बताइए:\n• आप अभी किस कक्षा में हैं?\n• आप किस राज्य से हैं?\n• आपको क्या करना पसंद है?`
      : `Namaste! 🙏 I'm VidyaSetu AI. I'm here to help you discover your ideal career path.\n\nTell me about yourself:\n• Which class are you currently in?\n• Which state are you from?\n• What do you enjoy doing most?`;
  } else if (currentClass && (interests || name)) {
    // If student provided their class + stream/name (like Palak did)
    if (lang === 'hi') {
      responseText = `नमस्ते${name ? ` ${name}` : ''}! 🙏 आपसे मिलकर बहुत खुशी हुई।\n\n` +
        `मैंने आपकी प्रोफाइल नोट कर ली है:\n` +
        `• **कक्षा:** ${currentClass}\n` +
        (state ? `• **राज्य:** ${state}\n` : '') +
        (interests ? `• **स्ट्रीम / रुचियां:** ${interests}\n` : '') +
        `\n🌟 आपकी पृष्ठभूमि के आधार पर, ये करियर और सीखने के रास्ते आपके लिए सबसे उपयुक्त हैं:\n\n` +
        `${matchedCareers.map(c => `${c!.icon} **${c!.titleHi}** (${c!.category}) — ${c!.avgSalary}`).join('\n')}\n\n` +
        `क्या आप इनमें से किसी करियर का पूरा रोडमैप या सरकारी छात्रवृत्तियां देखना चाहते हैं? 🚀`;
    } else {
      responseText = `Namaste${name ? ` ${name}` : ''}! 🙏 Wonderful to meet you.\n\n` +
        `I've updated your profile:\n` +
        `• **Class / Grade:** ${currentClass}\n` +
        (state ? `• **State / Region:** ${state}\n` : '') +
        (interests ? `• **Stream & Interests:** ${interests}\n` : '') +
        `\n🌟 Based on your background, here are top tailored career pathways for you:\n\n` +
        `${matchedCareers.map(c => `${c!.icon} **${c!.title}** (${c!.category}) — ${c!.avgSalary}`).join('\n')}\n\n` +
        `Would you like to explore the step-by-step roadmap for one of these, or check eligible government scholarships? 🚀`;
    }
  } else if (!currentClass) {
    responseText = lang === 'hi'
      ? `बहुत अच्छा! आप अभी किस कक्षा या कोर्स में पढ़ रहे हैं? (जैसे: कक्षा 10, 12वीं PCM/PCB, ITI या कॉलेज)`
      : `That's great! Which class or course are you currently studying in? (e.g., Class 10, Class 12 PCM/PCB, ITI, or College)`;
  } else if (!interests) {
    responseText = lang === 'hi'
      ? `अच्छा! अब मुझे बताइए — आपको क्या करना सबसे ज़्यादा पसंद है या आपकी स्ट्रीम क्या है? (जैसे: PCM, कंप्यूटर, खेती, कला, मेडिकल)`
      : `Great! Now tell me — what subjects or activities do you enjoy most, or what is your stream? (e.g. PCM, Computers, Farming, Arts, Healthcare)`;
  } else {
    if (lang === 'hi') {
      responseText = `बहुत बढ़िया! 🌟 आपकी प्रोफाइल के आधार पर ये करियर विकल्प आपके लिए बेहतरीन हैं:\n\n${matchedCareers.map(c => `${c!.icon} **${c!.titleHi}** — ${c!.avgSalary}`).join('\n')}\n\nइनमें से कौन सा आपको सबसे ज़्यादा पसंद है?`;
    } else {
      responseText = `Excellent! 🌟 Based on your profile, here are top recommended career options:\n\n${matchedCareers.map(c => `${c!.icon} **${c!.title}** — ${c!.avgSalary}`).join('\n')}\n\nWhich one would you like to explore first?`;
    }
  }

  return NextResponse.json({
    response: responseText,
    profile: updatedProfile,
    suggestedCareers,
    profileFields,
  });
}
