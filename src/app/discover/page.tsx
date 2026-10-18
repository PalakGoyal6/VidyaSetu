'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { CAREERS } from '@/lib/data';

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

export default function DiscoverPage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState<Profile>({});
  const [suggestedCareers, setSuggestedCareers] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const greetedRef = useRef(false);

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
    const SpeechRec = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
            <h4 style={{ marginBottom: 16 }}>{lang === 'hi' ? '📋 आपकी प्रोफाइल' : '📋 Your Profile'}</h4>
            
            {/* Completion */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {lang === 'hi' ? 'प्रोफाइल पूर्णता' : 'Profile Completion'}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-light)' }}>{profileCompletion}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>

            {/* Profile fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {Object.entries(profileLabels).map(([key, [en, hi]]) => {
                const val = (profile as Record<string, string | undefined>)[key];
                return (
                  <div key={key} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: val ? 'rgba(99,102,241,0.1)' : 'var(--bg-glass)',
                    border: `1px solid ${val ? 'rgba(99,102,241,0.3)' : 'var(--bg-glass-border)'}`,
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                      {lang === 'hi' ? hi : en}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: val ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: val ? 600 : 400 }}>
                      {val || (lang === 'hi' ? 'अभी तक नहीं' : 'Not yet shared')}
                    </div>
                  </div>
                );
              })}
            </div>
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
    </AppShell>
  );
}
