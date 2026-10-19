'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { CAREERS, AI_CAREER_RESPONSES } from '@/lib/data';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface Profile {
  currentClass?: string;
  state?: string;
  interests?: string;
  name?: string;
  goals?: string;
}

function getSuggestedCareersForProfile(prof: Profile): string[] {
  const allMatches = new Set<string>();
  const searchText = `${prof.interests || ''} ${prof.goals || ''}`.toLowerCase();
  Object.entries(AI_CAREER_RESPONSES).forEach(([keyword, careerIds]) => {
    if (searchText.includes(keyword)) {
      careerIds.forEach(id => allMatches.add(id));
    }
  });
  if (allMatches.size === 0) {
    AI_CAREER_RESPONSES.default.forEach(id => allMatches.add(id));
  }
  return Array.from(allMatches).slice(0, 5);
}

export default function DiscoverPage() {
  const [lang, setLang] = useState<string>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState<Profile>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Profile>({});
  const [suggestedCareers, setSuggestedCareers] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        const matches = getSuggestedCareersForProfile(parsed);
        if (matches.length > 0) setSuggestedCareers(matches);
      }
    } catch {
      // ignore storage error
    }
  }, []);

  useEffect(() => {
    // Auto-start with greeting (guard against StrictMode double-invoke)
    if (!greetedRef.current) {
      greetedRef.current = true;
      handleSend('hello');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fields = ['currentClass', 'state', 'interests', 'name', 'goals'];
    const filled = fields.filter(f => (profile as Record<string, unknown>)[f]).length;
    setProfileCompletion(Math.round((filled / fields.length) * 100));
    try {
      if (Object.keys(profile).length > 0) {
        localStorage.setItem('vidyasetu_profile', JSON.stringify(profile));
      }
    } catch {
      // ignore storage error
    }
  }, [profile]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    if (text !== 'hello') {
      setMessages(prev => [...prev, userMsg]);
    }
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang, profile, conversationHistory }),
      });
      const data = await res.json();
      
      setProfile(prev => ({ ...prev, ...data.profile }));
      if (data.suggestedCareers?.length > 0) {
        setSuggestedCareers(data.suggestedCareers);
      }
      setConversationHistory(prev => [...prev, text, data.response]);
      
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);

      // TTS
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // stop any previous utterance
        const utterance = new SpeechSynthesisUtterance(data.response.replace(/[*#]/g, ''));
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.9;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: (Date.now() + 2).toString(), role: 'ai',
        text: lang === 'hi' ? 'माफ़ करें, कुछ गड़बड़ हुई। फिर से कोशिश करें।' : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(lang === 'hi' ? 'आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता।' : 'Voice input not supported in your browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const quickResponses = lang === 'hi'
    ? ['मुझे कंप्यूटर पसंद है', 'मैं खेती में रुचि रखता हूं', 'मुझे पढ़ाना पसंद है', 'मैं व्यापार करना चाहता हूं', 'मुझे कला पसंद है', 'स्वास्थ्य में काम करना चाहता हूं']
    : ['I love computers', 'I\'m interested in farming', 'I enjoy teaching others', 'I want to start a business', 'I love art & design', 'I want to work in healthcare'];

  const openEditModal = () => {
    setEditForm({ ...profile });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    const updated = { ...editForm };
    setProfile(updated);
    const newSuggested = getSuggestedCareersForProfile(updated);
    if (newSuggested.length > 0) {
      setSuggestedCareers(newSuggested);
    }
    setIsEditModalOpen(false);

    const summaryParts = [
      updated.name ? `${updated.name}` : '',
      updated.currentClass ? `${updated.currentClass}` : '',
      updated.state ? `${updated.state}` : '',
      updated.interests ? `${updated.interests}` : '',
    ].filter(Boolean).join(', ');

    const confirmationText = lang === 'hi'
      ? `धन्यवाद! आपकी प्रोफाइल (${summaryParts}) अपडेट हो गई है। मैंने आपके लिए उपयुक्त करियर मैच और रोडमैप तैयार कर दिए हैं! 🎯`
      : `Thank you! Your profile (${summaryParts}) has been updated. I've refreshed your personalized career matches and roadmaps! 🎯`;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ai',
      text: confirmationText,
      timestamp: new Date()
    }]);
  };

  const applySample = (type: 'tech' | 'agri' | 'health') => {
    const samples: Record<'tech' | 'agri' | 'health', Profile> = {
      tech: {
        name: 'Ravi Kumar',
        currentClass: 'Class 10',
        state: 'Uttar Pradesh',
        interests: 'computer, math, coding',
        goals: 'Software Developer'
      },
      agri: {
        name: 'Mohan Lal',
        currentClass: 'Class 11',
        state: 'Madhya Pradesh',
        interests: 'farming, agriculture, science',
        goals: 'Agricultural Technologist'
      },
      health: {
        name: 'Priya Sharma',
        currentClass: 'Class 12',
        state: 'Rajasthan',
        interests: 'health, doctor, biology',
        goals: 'Nursing Professional'
      }
    };
    setEditForm(samples[type]);
  };

  const profileLabels: Record<string, [string, string]> = {
    name: ['Name', 'नाम'],
    currentClass: ['Class', 'कक्षा'],
    state: ['State', 'राज्य'],
    interests: ['Interests', 'रुचियां'],
    goals: ['Goals', 'लक्ष्य'],
  };

  return (
    <AppShell lang={lang} onLangChange={setLang}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Chat Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--bg-glass-border)' }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg-glass-border)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--gradient-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
              }}>🤖</div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>
                  {lang === 'hi' ? 'विद्यासेतु AI सलाहकार' : 'VidyaSetu AI Advisor'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                    {lang === 'hi' ? 'ऑनलाइन • हिंदी/अंग्रेज़ी में बात करें' : 'Online • Chat in Hindi or English'}
                  </span>
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                {isSpeaking ? (
                  <button
                    onClick={stopVoice}
                    title={lang === 'hi' ? 'आवाज़ बंद करें' : 'Stop voice'}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                      color: '#f87171', padding: '5px 14px', borderRadius: 100,
                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'inherit', animation: 'fadeIn 0.2s ease',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.3)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)';
                    }}
                  >
                    {/* pulsing dot */}
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#f87171', display: 'inline-block',
                      animation: 'voicePulse 1.2s infinite',
                    }} />
                    {lang === 'hi' ? 'आवाज़ बंद करें' : 'Stop Voice'}
                  </button>
                ) : (
                  <span className="badge badge-accent">🎙️ {lang === 'hi' ? 'वॉयस चालू' : 'Voice On'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  maxWidth: '75%',
                  background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-card)',
                  border: msg.role === 'ai' ? '1px solid var(--bg-glass-border)' : 'none',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  lineHeight: 1.6, fontSize: '0.95rem',
                  animation: 'fadeInUp 0.3s ease',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, padding: '0 4px' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                  background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                }}>
                  <div className="typing-dots">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Responses */}
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8, flexWrap: 'wrap', overflowX: 'auto' }}>
            {quickResponses.slice(0, 4).map((qr, i) => (
              <button key={i} onClick={() => handleSend(qr)} className="chip" style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--bg-glass-border)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={toggleVoice}
                className={`btn-voice ${isListening ? 'listening' : ''}`}
                style={{
                  width: 44, height: 44, fontSize: '1.1rem',
                  flexShrink: 0, borderRadius: 12,
                  boxShadow: isListening ? '0 0 0 0 rgba(249,115,22,0.7)' : undefined,
                }}
                title={lang === 'hi' ? 'बोलें' : 'Speak'}>
                {isListening ? '🔴' : '🎙️'}
              </button>
              <input
                type="text"
                className="input"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(inputText)}
                placeholder={lang === 'hi' ? 'यहाँ टाइप करें या माइक दबाएं...' : 'Type here or tap the mic...'}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim()}
                style={{
                  background: 'var(--gradient-primary)', border: 'none',
                  color: 'white', width: 44, height: 44, borderRadius: 12,
                  cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0,
                  opacity: inputText.trim() ? 1 : 0.5,
                }}>→</button>
            </div>
            {/* Speaking indicator + stop button */}
            {isSpeaking && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 8, padding: '7px 12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, animation: 'fadeIn 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#f87171' }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#f87171', display: 'inline-block',
                    animation: 'voicePulse 1.2s infinite', flexShrink: 0,
                  }} />
                  {lang === 'hi' ? 'AI बोल रहा है...' : 'AI is speaking...'}
                </div>
                <button
                  onClick={stopVoice}
                  style={{
                    background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.35)',
                    color: '#f87171', padding: '4px 12px', borderRadius: 8,
                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.35)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)'; }}
                >
                  ⏹ {lang === 'hi' ? 'रोकें' : 'Stop'}
                </button>
              </div>
            )}
            {/* Listening indicator */}
            {isListening && (
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.8rem', color: 'var(--accent)', animation: 'fadeIn 0.3s' }}>
                🔴 {lang === 'hi' ? 'सुन रहा हूं...' : 'Listening...'}
              </div>
            )}
          </div>
        </div>

        {/* Profile Panel */}
        <div style={{ width: 320, background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                📋 {lang === 'hi' ? 'आपकी प्रोफाइल' : 'Your Profile'}
              </h4>
              <button
                onClick={openEditModal}
                style={{
                  background: 'rgba(234, 88, 12, 0.1)',
                  border: '1px solid rgba(234, 88, 12, 0.25)',
                  color: 'var(--primary)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}>
                ✏️ {lang === 'hi' ? 'भरें / बदलें' : 'Fill / Edit'}
              </button>
            </div>
            
            {/* Completion */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {lang === 'hi' ? 'प्रोफाइल पूर्णता' : 'Profile Completion'}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: profileCompletion === 100 ? 'var(--success)' : 'var(--primary)' }}>
                  {profileCompletion}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${profileCompletion}%`, background: profileCompletion === 100 ? 'var(--success)' : undefined }} />
              </div>
            </div>

            {/* Profile fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {Object.entries(profileLabels).map(([key, [en, hi]]) => {
                const val = (profile as Record<string, string | undefined>)[key];
                return (
                  <div
                    key={key}
                    onClick={openEditModal}
                    title={lang === 'hi' ? 'बदलने के लिए क्लिक करें' : 'Click to edit'}
                    style={{
                      padding: '10px 12px', borderRadius: 8,
                      background: val ? 'var(--bg-glass)' : 'var(--bg-card)',
                      border: `1px solid ${val ? 'var(--primary-light)' : 'var(--bg-glass-border)'}`,
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                      <span>{lang === 'hi' ? hi : en}</span>
                      <span style={{ opacity: 0.6 }}>✏️</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: val ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: val ? 600 : 400 }}>
                      {val || (lang === 'hi' ? 'अभी तक नहीं (क्लिक करें)' : 'Not yet shared (click to add)')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick helper note */}
            {profileCompletion < 100 && (
              <div style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(249,115,22,0.08)',
                border: '1px dashed rgba(249,115,22,0.3)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: 16,
                lineHeight: 1.5,
              }}>
                💡 {lang === 'hi'
                  ? 'सुझाव: AI से बोलें "मेरा नाम रवि है, कक्षा 10, राजस्थान से, मुझे कंप्यूटर पसंद है" या ऊपर "भरें / बदलें" दबाएं।'
                  : 'Tip: Speak to AI or click "Fill / Edit" above to complete your profile & unlock scholarships!'}
              </div>
            )}
          </div>

          {/* Career Suggestions */}
          {suggestedCareers.length > 0 && (
            <div style={{ padding: '0 20px', flex: 1 }}>
              <div className="divider" />
              <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>
                🎯 {lang === 'hi' ? 'AI सुझाए करियर' : 'AI Career Matches'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {suggestedCareers.slice(0, 5).map(id => {
                  const career = CAREERS.find(c => c.id === id);
                  if (!career) return null;
                  return (
                    <Link key={id} href={`/learn?career=${id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        padding: '10px 12px', borderRadius: 10,
                        background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                        display: 'flex', alignItems: 'center', gap: 10,
                        transition: 'all 0.2s', cursor: 'pointer',
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--primary-light)';
                          (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card-hover)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bg-glass-border)';
                          (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card)';
                        }}>
                        <span style={{ fontSize: '1.3rem' }}>{career.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {lang === 'hi' ? career.titleHi : career.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {career.avgSalary} • {career.demand} demand
                          </div>
                        </div>
                        <span style={{ color: 'var(--primary-light)', fontSize: '0.75rem' }}>→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Link href="/learn" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', marginTop: 12, background: 'var(--gradient-primary)',
                  border: 'none', color: 'white', padding: '12px', borderRadius: 10,
                  cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
                }}>
                  {lang === 'hi' ? '🗺️ सीखने का रास्ता देखें' : '🗺️ View Learning Path'}
                </button>
              </Link>
            </div>
          )}

          <div style={{ padding: 20 }}>
            <Link href="/opportunities" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', background: 'var(--bg-glass)',
                border: '1px solid var(--bg-glass-border)', color: 'var(--text-secondary)',
                padding: '10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '0.85rem',
              }}>
                🌟 {lang === 'hi' ? 'छात्रवृत्ति खोजें' : 'Find Scholarships'}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 20,
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
            borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(60,40,20,0.18)',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--bg-glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                  📋 {lang === 'hi' ? 'प्रोफाइल भरें / संपादित करें' : 'Fill / Edit Your Profile'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {lang === 'hi' ? 'यह विवरण आपके लिए सटीक करियर और छात्रवृत्ति खोजने में मदद करता है' : 'This helps AI match you with the right careers & scholarships'}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  fontSize: '1.2rem', cursor: 'pointer', padding: 4,
                }}>
                ✕
              </button>
            </div>

            <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Quick Presets */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  ⚡ {lang === 'hi' ? 'त्वरित डेमो प्रोफाइल चुनें:' : 'Quick Demo Presets:'}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => applySample('tech')}
                    style={{
                      background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.3)',
                      color: 'var(--primary)', padding: '5px 10px', borderRadius: 6,
                      fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
                    }}>
                    💻 Tech (Ravi, Class 10)
                  </button>
                  <button
                    type="button"
                    onClick={() => applySample('agri')}
                    style={{
                      background: 'rgba(21,128,61,0.1)', border: '1px solid rgba(21,128,61,0.3)',
                      color: 'var(--success)', padding: '5px 10px', borderRadius: 6,
                      fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
                    }}>
                    🌾 Agri (Mohan, Class 11)
                  </button>
                  <button
                    type="button"
                    onClick={() => applySample('health')}
                    style={{
                      background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)',
                      color: '#0d9488', padding: '5px 10px', borderRadius: 6,
                      fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
                    }}>
                    🏥 Health (Priya, Class 12)
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {lang === 'hi' ? 'नाम (Name)' : 'Name'}
                </label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder={lang === 'hi' ? 'जैसे: रवि कुमार' : 'e.g. Ravi Kumar'}
                  className="input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {lang === 'hi' ? 'कक्षा / शिक्षा स्तर (Class / Grade)' : 'Class / Grade'}
                </label>
                <input
                  type="text"
                  value={editForm.currentClass || ''}
                  onChange={e => setEditForm({ ...editForm, currentClass: e.target.value })}
                  placeholder={lang === 'hi' ? 'जैसे: Class 10, Class 12, ITI' : 'e.g. Class 10, Class 12, ITI'}
                  className="input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {lang === 'hi' ? 'राज्य (State)' : 'State'}
                </label>
                <input
                  type="text"
                  value={editForm.state || ''}
                  onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                  placeholder={lang === 'hi' ? 'जैसे: Uttar Pradesh, Rajasthan, Bihar' : 'e.g. Uttar Pradesh, Rajasthan, Bihar'}
                  className="input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {lang === 'hi' ? 'रुचियां / पसंदीदा विषय (Interests)' : 'Interests'}
                </label>
                <input
                  type="text"
                  value={editForm.interests || ''}
                  onChange={e => setEditForm({ ...editForm, interests: e.target.value })}
                  placeholder={lang === 'hi' ? 'जैसे: Computer, Math, Farming, Design' : 'e.g. Computer, Math, Farming, Design'}
                  className="input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {lang === 'hi' ? 'करियर लक्ष्य (Career Goals)' : 'Career Goals'}
                </label>
                <input
                  type="text"
                  value={editForm.goals || ''}
                  onChange={e => setEditForm({ ...editForm, goals: e.target.value })}
                  placeholder={lang === 'hi' ? 'जैसे: Software Developer, Electrician' : 'e.g. Software Developer, Electrician'}
                  className="input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8 }}
                />
              </div>
            </div>

            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--bg-glass-border)',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
            }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="btn btn-primary btn-sm"
              >
                💾 {lang === 'hi' ? 'सहेजें' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
