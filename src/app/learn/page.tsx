'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { CAREERS, EXAMS } from '@/lib/data';

interface PathwayPhase {
  phase: number;
  title: string;
  titleHi: string;
  duration: string;
  icon: string;
  steps: { title: string; platform: string; free: boolean }[];
  milestone: string;
}

interface Pathway {
  careerId: string;
  careerTitle: string;
  careerTitleHi: string;
  icon: string;
  estimatedTime: string;
  avgSalary: string;
  demand: string;
  phases: PathwayPhase[];
  courses: { name: string; platform: string; free: boolean; link: string; duration: string }[];
  exams: string[];
  skills: string[];
  schemesApplicable: string[];
}

function LearnPageContent() {
  const [lang, setLang] = useState<string>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const searchParams = useSearchParams();
  const [selectedCareerId, setSelectedCareerId] = useState(searchParams.get('career') || '');
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePhase, setActivePhase] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const categories = ['All', 'Technology', 'Vocational', 'Healthcare', 'Agriculture', 'Creative', 'Education', 'Commerce'];

  const filteredCareers = CAREERS.filter(c => {
    const matchesQuery = searchQuery === '' || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleHi.includes(searchQuery);
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  useEffect(() => {
    if (selectedCareerId) fetchPathway(selectedCareerId);
  }, [selectedCareerId]);

  const fetchPathway = async (careerId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerId, profile: { currentClass: '10' } }),
      });
      const data = await res.json();
      setPathway(data.pathway);
      setActivePhase(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCareer = CAREERS.find(c => c.id === selectedCareerId);
  const relevantExams = EXAMS.filter(e => selectedCareer?.exams.some(ex => e.name.includes(ex) || ex.includes(e.id)));

  return (
    <AppShell lang={lang} onLangChange={setLang}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Career List Sidebar */}
        <div style={{ width: 300, borderRight: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
          <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--bg-glass-border)' }}>
            <h3 style={{ marginBottom: 12, fontSize: '0.95rem' }}>
              {lang === 'hi' ? '🎯 करियर चुनें' : '🎯 Choose a Career'}
            </h3>
            <input
              type="text"
              className="input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'करियर खोजें...' : 'Search careers...'}
              style={{ fontSize: '0.875rem', padding: '8px 12px' }}
            />
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
              {categories.slice(0, 5).map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                  padding: '4px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: categoryFilter === cat ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                  color: categoryFilter === cat ? 'white' : 'var(--text-muted)',
                }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {filteredCareers.map(career => (
              <button key={career.id} onClick={() => setSelectedCareerId(career.id)} style={{
                width: '100%', textAlign: 'left',
                background: selectedCareerId === career.id ? '#ffffff' : 'transparent',
                border: `1px solid ${selectedCareerId === career.id ? 'var(--primary)' : 'transparent'}`,
                boxShadow: selectedCareerId === career.id ? 'var(--shadow-sm)' : 'none',
                borderRadius: 10, padding: '10px 12px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10,
              }}
                onMouseEnter={e => { if (selectedCareerId !== career.id) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(234,88,12,0.06)'; }}
                onMouseLeave={e => { if (selectedCareerId !== career.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <span style={{ fontSize: '1.3rem' }}>{career.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? career.titleHi : career.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{career.category}</span>
                    {' '}{career.demand === 'Very High' ? '🔥' : career.demand === 'High' ? '⭐' : '📈'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!selectedCareerId && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
              <div style={{ fontSize: '4rem' }}>🗺️</div>
              <h2 style={{ textAlign: 'center' }}>
                {lang === 'hi' ? 'अपना करियर चुनकर सीखना शुरू करें' : 'Select a career to get your learning path'}
              </h2>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400 }}>
                {lang === 'hi' 
                  ? 'बाईं ओर से कोई भी करियर चुनें और AI आपका पूरा सीखने का रोडमैप बनाएगा।'
                  : 'Choose any career from the left panel and AI will generate your complete personalized learning roadmap.'}
              </p>
              <Link href="/discover" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'var(--gradient-accent)', border: 'none', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                  🎙️ {lang === 'hi' ? 'AI से पूछें' : 'Ask AI to Suggest'}
                </button>
              </Link>
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid var(--bg-glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>{lang === 'hi' ? 'AI आपका रास्ता बना रहा है...' : 'AI generating your pathway...'}</p>
              </div>
            </div>
          )}

          {pathway && !loading && (
            <div style={{ padding: '28px 32px' }}>
              {/* Career Hero */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                borderRadius: 20, padding: '28px', marginBottom: 24, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-primary)' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                  <div style={{ fontSize: '3rem' }}>{pathway.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ marginBottom: 4 }}>
                      {lang === 'hi' ? pathway.careerTitleHi : pathway.careerTitle}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                      {lang === 'hi' ? 'आपका व्यक्तिगत सीखने का रोडमैप' : 'Your personalized learning roadmap'}
                    </p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="badge badge-success">💰 {pathway.avgSalary}</span>
                      <span className="badge badge-accent">⏱️ {pathway.estimatedTime}</span>
                      <span className="badge badge-primary">📈 {pathway.demand} Demand</span>
                      <button
                        onClick={() => handleSpeak(`${pathway.careerTitle}. Estimated time: ${pathway.estimatedTime}. Average salary: ${pathway.avgSalary}. Key skills required: ${pathway.skills.join(', ')}.`)}
                        style={{
                          background: isSpeaking ? 'var(--accent)' : 'var(--bg-glass)',
                          border: '1px solid var(--bg-glass-border)', borderRadius: 20,
                          padding: '4px 12px', color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                        }}>
                        <span>{isSpeaking ? '⏹️' : '🔊'}</span>
                        <span>{isSpeaking ? 'Stop Voice' : 'Listen Roadmap'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Skills needed */}
                <div style={{ marginTop: 20 }}>
                  <div className="section-label">{lang === 'hi' ? 'जरूरी कौशल' : 'Key Skills'}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {pathway.skills.map((s, i) => <span key={i} className="chip" style={{ fontSize: '0.8rem' }}>{s}</span>)}
                  </div>
                </div>
              </div>

              {/* Phase Tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-card)', borderRadius: 12, padding: 4 }}>
                {pathway.phases.map((p, i) => (
                  <button key={i} onClick={() => setActivePhase(i)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem',
                    background: activePhase === i ? 'var(--gradient-primary)' : 'transparent',
                    color: activePhase === i ? 'white' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}>
                    {p.icon} Phase {p.phase}
                    <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{lang === 'hi' ? p.titleHi : p.title}</div>
                  </button>
                ))}
              </div>

              {/* Active Phase */}
              {(() => {
                const phase = pathway.phases[activePhase];
                return (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <div style={{ fontSize: '2rem' }}>{phase.icon}</div>
                      <div>
                        <h3>{lang === 'hi' ? phase.titleHi : phase.title}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱️ {phase.duration}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {phase.steps.map((step, j) => (
                        <div key={j} style={{
                          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                          background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--bg-glass-border)',
                        }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, color: 'white',
                          }}>{j + 1}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{step.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              📱 {step.platform}
                              {step.free && <span style={{ color: 'var(--success)', marginLeft: 8 }}>✓ Free</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>🏆 Milestone: {phase.milestone}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Courses & Exams */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 16, padding: 20 }}>
                  <h4 style={{ marginBottom: 14, fontSize: '0.95rem' }}>📚 {lang === 'hi' ? 'फ्री कोर्सेज' : 'Free Courses'}</h4>
                  {pathway.courses.map((c, i) => (
                    <a key={i} href={c.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '10px 0', borderBottom: i < pathway.courses.length - 1 ? '1px solid var(--bg-glass-border)' : 'none', display: 'flex', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.platform} • {c.duration}</div>
                        </div>
                        <span className="badge badge-success" style={{ fontSize: '0.65rem', height: 'fit-content' }}>Free</span>
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 16, padding: 20 }}>
                  <h4 style={{ marginBottom: 14, fontSize: '0.95rem' }}>📝 {lang === 'hi' ? 'परीक्षाएं' : 'Key Exams'}</h4>
                  {relevantExams.length > 0 ? relevantExams.map((e, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: i < relevantExams.length - 1 ? '1px solid var(--bg-glass-border)' : 'none' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{e.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>📅 {e.date}</div>
                    </div>
                  )) : pathway.exams.map((ex, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: i < pathway.exams.length - 1 ? '1px solid var(--bg-glass-border)' : 'none' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{ex}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <Link href="/opportunities" style={{ textDecoration: 'none', flex: 1 }}>
                  <button style={{
                    width: '100%', background: 'var(--gradient-accent)', border: 'none',
                    color: 'white', padding: '14px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 700, fontSize: '0.95rem',
                  }}>🌟 {lang === 'hi' ? 'छात्रवृत्ति और अवसर' : 'Find Scholarships & Opportunities'}</button>
                </Link>
                <Link href="/connect" style={{ textDecoration: 'none', flex: 1 }}>
                  <button style={{
                    width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)',
                    color: 'var(--text-primary)', padding: '14px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: '0.95rem',
                  }}>🤝 {lang === 'hi' ? 'मेंटर खोजें' : 'Find a Mentor'}</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>}>
      <LearnPageContent />
    </Suspense>
  );
}
