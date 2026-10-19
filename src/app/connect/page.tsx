'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  background: string;
  expertise: string[];
  languages: string[];
  availability: string;
  sessions: number;
  rating: number;
  avatar: string;
  tags: string[];
  careerIds: string[];
  matchScore?: number;
}

export default function ConnectPage() {
  const [lang, setLang] = useState<string>('en');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [activeTab, setActiveTab] = useState<'mentors' | 'employers' | 'ngos'>('mentors');
  const [requestSent, setRequestSent] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerIds: ['software-dev', 'agri-tech', 'nurse'], languages: ['Hindi', 'English'] }),
      });
      const data = await res.json();
      setMentors(data.mentors);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const employers = [
    { name: 'Jio Platforms', icon: '📡', sector: 'Telecom/Tech', opportunities: ['Digital Literacy Trainer', 'Customer Support', 'Field Tech'], hiring: true, rural: true },
    { name: 'AMUL Cooperative', icon: '🥛', sector: 'FMCG / Dairy', opportunities: ['Field Sales Officer', 'Quality Inspector', 'Logistics Coordinator'], hiring: true, rural: true },
    { name: 'Bajaj Finance', icon: '💰', sector: 'Finance / NBFC', opportunities: ['Rural Business Correspondent', 'Loan Officer', 'Sales Manager'], hiring: true, rural: true },
    { name: 'Bayer CropScience', icon: '🌾', sector: 'Agriculture', opportunities: ['Agri Sales Manager', 'Crop Specialist', 'Demo Farmer'], hiring: false, rural: true },
    { name: 'HCL Foundation', icon: '🖥️', sector: 'CSR / Technology', opportunities: ['Community Trainer', 'Project Coordinator', 'Data Analyst'], hiring: true, rural: false },
    { name: 'Apollo Hospitals', icon: '🏥', sector: 'Healthcare', opportunities: ['Community Health Worker', 'Lab Assistant', 'Receptionist'], hiring: true, rural: false },
  ];

  const ngos = [
    { name: 'Pratham Education', icon: '📚', focus: 'Education', programs: ['Teaching volunteer', 'Digital literacy trainer', 'Assessment support'], states: 'PAN India', fellowships: true },
    { name: 'iDE India', icon: '🌿', focus: 'Agriculture', programs: ['Field agronomist', 'Market linkage officer', 'Farmer trainer'], states: 'UP, Bihar, Odisha', fellowships: true },
    { name: 'Teach For India', icon: '🎓', focus: 'Education', programs: ['Fellowship teacher (2 yrs)', 'Alumni leadership program'], states: 'Urban + Rural', fellowships: true },
    { name: 'Smile Foundation', icon: '😊', focus: 'Child Development', programs: ['Livelihood trainer', 'Healthcare worker', 'Community mobilizer'], states: '25 States', fellowships: false },
    { name: 'Digital Empowerment Foundation', icon: '💻', focus: 'Digital Literacy', programs: ['Rural tech trainer', 'Content creator', 'BPO trainer'], states: 'Rural India', fellowships: true },
    { name: 'SEWA (Women Workers)', icon: '👩', focus: "Women's Empowerment", programs: ['Self-Help Group facilitator', 'Vocational trainer', 'Finance literacy educator'], states: 'Gujarat + 10 States', fellowships: false },
  ];

  return (
    <AppShell lang={lang} onLangChange={setLang}>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.8rem' }}>🤝</span>
                <h2>{lang === 'hi' ? 'जुड़ें और कमाएं' : 'Connect & Earn'}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {lang === 'hi' ? 'मेंटर, नियोक्ता और NGO से जुड़ें' : 'Connect with mentors, employers, and NGOs who can open doors for you'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, marginTop: 20, background: 'var(--bg-glass)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
            {[
              { key: 'mentors', label: lang === 'hi' ? '🧑‍💼 मेंटर' : '🧑‍💼 Mentors' },
              { key: 'employers', label: lang === 'hi' ? '🏢 नियोक्ता' : '🏢 Employers' },
              { key: 'ngos', label: lang === 'hi' ? '🤲 NGO' : '🤲 NGOs' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 600, fontSize: '0.85rem',
                background: activeTab === tab.key ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="section">
          {/* Mentors Tab */}
          {activeTab === 'mentors' && (
            <div style={{ display: 'grid', gridTemplateColumns: selectedMentor ? '1fr 380px' : '1fr', gap: 24 }}>
              <div>
                {loading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ height: 240, borderRadius: 16 }} className="skeleton" />)}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                    {mentors.map(mentor => (
                      <div key={mentor.id} onClick={() => setSelectedMentor(selectedMentor?.id === mentor.id ? null : mentor)} style={{
                        background: 'var(--bg-card)', border: `1px solid ${selectedMentor?.id === mentor.id ? 'var(--primary)' : 'var(--bg-glass-border)'}`,
                        borderRadius: 16, padding: '20px', cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: selectedMentor?.id === mentor.id ? '0 4px 20px rgba(234, 88, 12, 0.2)' : 'var(--shadow-sm)',
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                          <div className="avatar avatar-lg" style={{ background: 'var(--gradient-primary)', flexShrink: 0 }}>{mentor.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, marginBottom: 2 }}>{mentor.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{mentor.role}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mentor.company}</div>
                          </div>
                          {mentor.matchScore !== undefined && (
                            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)' }}>{mentor.matchScore}%</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>match</div>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          {mentor.tags.map((tag, i) => (
                            <span key={i} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{tag}</span>
                          ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{mentor.sessions}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Sessions</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, color: '#fbbf24' }}>⭐{mentor.rating}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Rating</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.8rem' }}>{mentor.availability}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Available</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                          {mentor.languages.map((l, i) => <span key={i} className="chip" style={{ fontSize: '0.7rem', padding: '3px 10px' }}>🌐 {l}</span>)}
                        </div>

                        <button
                          onClick={e => { e.stopPropagation(); setRequestSent(mentor.id); setTimeout(() => setRequestSent(null), 3000); }}
                          style={{
                            width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                            padding: '10px', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem',
                            background: requestSent === mentor.id ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                            color: 'white', transition: 'all 0.3s',
                          }}>
                          {requestSent === mentor.id
                            ? (lang === 'hi' ? '✓ अनुरोध भेजा गया!' : '✓ Request Sent!')
                            : (lang === 'hi' ? 'मेंटरशिप माँगें' : 'Request Mentorship')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mentor Detail Panel */}
              {selectedMentor && (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                  borderRadius: 16, padding: '24px', height: 'fit-content',
                  position: 'sticky', top: 20,
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div className="avatar avatar-lg" style={{ background: 'var(--gradient-accent)', margin: '0 auto 12px', fontSize: '1.5rem' }}>
                      {selectedMentor.avatar}
                    </div>
                    <h3 style={{ marginBottom: 4 }}>{selectedMentor.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{selectedMentor.role} at {selectedMentor.company}</p>
                  </div>
                  <div className="divider" />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                    {selectedMentor.background}
                  </p>
                  <div className="section-label">{lang === 'hi' ? 'विशेषज्ञता' : 'Expertise'}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 16px' }}>
                    {selectedMentor.expertise.map((e, i) => <span key={i} className="chip" style={{ fontSize: '0.78rem' }}>{e}</span>)}
                  </div>
                  <button onClick={() => { setRequestSent(selectedMentor.id); setTimeout(() => setRequestSent(null), 3000); }} style={{
                    width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: '1rem',
                    background: requestSent === selectedMentor.id ? 'var(--gradient-success)' : 'var(--gradient-accent)',
                    color: 'white',
                  }}>
                    {requestSent === selectedMentor.id ? '✓ Sent!' : (lang === 'hi' ? '📩 मेंटरशिप अनुरोध भेजें' : '📩 Send Mentorship Request')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Employers Tab */}
          {activeTab === 'employers' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {employers.map((emp, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                  borderRadius: 16, padding: '20px', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bg-glass-border)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: '2rem' }}>{emp.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{emp.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.sector}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      {emp.hiring && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>🟢 Hiring</span>}
                      {emp.rural && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>🌾 Rural</span>}
                    </div>
                  </div>
                  <div className="section-label" style={{ marginBottom: 8 }}>{lang === 'hi' ? 'अवसर' : 'Open Roles'}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {emp.opportunities.map((opp, j) => (
                      <div key={j} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                        {opp}
                      </div>
                    ))}
                  </div>
                  <button style={{
                    marginTop: 16, width: '100%', background: emp.hiring ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                    border: emp.hiring ? 'none' : '1px solid var(--bg-glass-border)',
                    color: emp.hiring ? 'white' : 'var(--text-muted)',
                    padding: '10px', borderRadius: 8, cursor: emp.hiring ? 'pointer' : 'default',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    {emp.hiring ? (lang === 'hi' ? 'अभी आवेदन करें →' : 'Apply Now →') : (lang === 'hi' ? 'जल्द आ रहा है' : 'Opening Soon')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* NGOs Tab */}
          {activeTab === 'ngos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {ngos.map((ngo, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                  borderRadius: 16, padding: '20px', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#a78bfa'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bg-glass-border)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: '2rem' }}>{ngo.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{ngo.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focus: {ngo.focus}</div>
                    </div>
                    {ngo.fellowships && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>🏅 Fellowship</span>}
                  </div>
                  <div className="section-label" style={{ marginBottom: 8 }}>Programs</div>
                  {ngo.programs.map((p, j) => (
                    <div key={j} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
                      {p}
                    </div>
                  ))}
                  <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {ngo.states}</div>
                  <button style={{
                    marginTop: 14, width: '100%', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    border: 'none', color: 'white',
                    padding: '10px', borderRadius: 8, cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                  }}>{lang === 'hi' ? 'जुड़ें →' : 'Connect →'}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
