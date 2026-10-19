'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { AISHE_INSTITUTIONS, AISHE_METRICS, BHASHINI_LANGUAGES } from '@/lib/data';

interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  icon: string;
  amount: string;
  eligibility: string;
  deadline: string;
  link: string;
  tags: string[];
  description: string;
}

export default function OpportunitiesPage() {
  const [lang, setLang] = useState<string>('en');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'schemes' | 'apprenticeship' | 'exams' | 'aishe'>('schemes');
  const [aisheState, setAisheState] = useState('All');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const categories = ['all', 'Scholarship', 'Skill Training', 'Apprenticeship', 'Entrepreneurship', 'Micro Finance', 'Startup', 'Learning'];
  const aisheStates = ['All', 'Uttar Pradesh', 'Rajasthan', 'Bihar', 'Madhya Pradesh', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'West Bengal'];

  useEffect(() => {
    fetchSchemes();
  }, [category, searchQuery]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (searchQuery) params.set('q', searchQuery);
      const res = await fetch(`/api/schemes?${params}`);
      const data = await res.json();
      setSchemes(data.schemes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = BHASHINI_LANGUAGES.find(l => l.id === lang);
    utterance.lang = langObj ? langObj.code : 'en-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const apprenticeships = [
    { company: 'Tata Motors', icon: '🚗', role: 'Automotive Technician Apprentice', stipend: '₹8,000/mo', duration: '1 Year', location: 'Pune / Multiple Locations', seats: 200, deadline: 'Nov 30, 2026', via: 'NAPS' },
    { company: 'Infosys Foundation', icon: '💻', role: 'Digital Literacy Trainer Apprentice', stipend: '₹6,000/mo', duration: '6 Months', location: 'Remote / State Centers', seats: 500, deadline: 'Rolling', via: 'NAPS' },
    { company: 'Narayana Health', icon: '🏥', role: 'Healthcare Assistant Apprentice', stipend: '₹7,500/mo', duration: '1 Year', location: 'Bengaluru & Tier-2 Cities', seats: 150, deadline: 'Dec 15, 2026', via: 'NAPS' },
    { company: 'Mother Dairy', icon: '🥛', role: 'Food Processing Technician Apprentice', stipend: '₹5,500/mo', duration: '8 Months', location: 'Delhi NCR & UP', seats: 80, deadline: 'Nov 15, 2026', via: 'NAPS' },
    { company: 'BSNL Telecom', icon: '📡', role: 'Telecom Field Technician Apprentice', stipend: '₹7,000/mo', duration: '1 Year', location: 'PAN India', seats: 1000, deadline: 'Rolling', via: 'NAPS' },
    { company: 'State Bank of India', icon: '🏦', role: 'Banking Correspondent Apprentice', stipend: '₹6,500/mo', duration: '6 Months', location: 'Rural Branches PAN India', seats: 800, deadline: 'Dec 31, 2026', via: 'NAPS' },
  ];

  const upcomingExams = [
    { name: 'SSC CHSL 2026', date: 'March 2027', category: 'Govt Job', eligibility: 'Class 12 Pass', seats: '5000+', link: 'ssc.nic.in' },
    { name: 'IBPS RRB Clerk', date: 'August 2027', category: 'Banking', eligibility: 'Any Graduate', seats: '8000+', link: 'ibps.in' },
    { name: 'CTET December 2026', date: 'December 2026', category: 'Teaching', eligibility: 'B.Ed/D.El.Ed', seats: 'Unlimited', link: 'ctet.nic.in' },
    { name: 'Railway NTPC', date: 'January 2027', category: 'Railway', eligibility: 'Class 12', seats: '35000+', link: 'indianrailways.gov.in' },
  ];

  const filteredAishe = AISHE_INSTITUTIONS.filter(inst => {
    const matchesState = aisheState === 'All' || inst.state === aisheState;
    const matchesQuery = searchQuery === '' ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.coursesOffered.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesState && matchesQuery;
  });

  const categoryColors: Record<string, string> = {
    'Scholarship': 'var(--primary-light)',
    'Skill Training': 'var(--accent)',
    'Apprenticeship': 'var(--success)',
    'Entrepreneurship': '#f59e0b',
    'Micro Finance': '#ec4899',
    'Startup': '#8b5cf6',
    'Learning': '#06b6d4',
  };

  return (
    <AppShell lang={lang} onLangChange={setLang}>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.8rem' }}>🌟</span>
                <h1>{lang === 'hi' ? 'अवसर केंद्र' : 'Opportunity Hub'}</h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {lang === 'hi'
                  ? 'सरकारी योजनाएं, छात्रवृत्ति, NAPS अप्रेंटिसशिप और AISHE से मान्यता प्राप्त कॉलेज।'
                  : 'Central & State Government Schemes, Scholarships, NAPS Apprenticeships, and AISHE-Accredited Colleges.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-success">✓ {lang === 'hi' ? 'AI-सत्यापित' : 'Govt Grounded'}</span>
              <span className="badge badge-primary">🏛️ AISHE + NAPS</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginTop: 20, background: 'var(--bg-glass)', borderRadius: 10, padding: 4, width: 'fit-content', flexWrap: 'wrap' }}>
            {[
              { key: 'schemes', label: lang === 'hi' ? '📜 योजनाएं व छात्रवृत्ति' : '📜 Schemes & Scholarships' },
              { key: 'apprenticeship', label: lang === 'hi' ? '🏭 NAPS अप्रेंटिसशिप' : '🏭 NAPS Apprenticeships' },
              { key: 'aishe', label: lang === 'hi' ? '🏛️ AISHE उच्च शिक्षा कॉलेज' : '🏛️ AISHE Higher Ed Colleges' },
              { key: 'exams', label: lang === 'hi' ? '📝 प्रतियोगी परीक्षाएं' : '📝 Competitive Exams' },
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
          {/* Schemes Tab */}
          {activeTab === 'schemes' && (
            <>
              {/* Search & Filter */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'hi' ? '🔍 योजना खोजें...' : '🔍 Search schemes...'}
                  style={{ maxWidth: 300 }}
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} style={{
                      padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      background: category === cat ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                      color: category === cat ? 'white' : 'var(--text-muted)',
                      transition: 'all 0.2s',
                    }}>{cat === 'all' ? (lang === 'hi' ? 'सभी' : 'All') : cat}</button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ height: 200, borderRadius: 16 }} className="skeleton" />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                  {schemes.map(scheme => (
                    <div key={scheme.id} style={{
                      background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                      borderRadius: 16, padding: '20px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${categoryColors[scheme.category] || 'var(--primary)'}, transparent)` }} />
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '2rem' }}>{scheme.icon}</span>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: 2 }}>{lang === 'hi' ? scheme.nameHi : scheme.name}</h4>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                              color: categoryColors[scheme.category] || 'var(--primary-light)',
                              background: `${categoryColors[scheme.category] || 'var(--primary)'}20`,
                            }}>{scheme.category}</span>
                          </div>
                        </div>
                        {/* Audio Speak button */}
                        <button
                          onClick={() => handleSpeak(scheme.id, `${scheme.name}. ${scheme.description}. Benefit: ${scheme.amount}`)}
                          style={{
                            background: speakingId === scheme.id ? 'var(--accent)' : 'var(--bg-glass)',
                            border: '1px solid var(--bg-glass-border)', borderRadius: 20,
                            padding: '4px 10px', color: 'white', cursor: 'pointer', fontSize: '0.75rem',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}
                          title="Listen with BHASHINI Voice">
                          <span>{speakingId === scheme.id ? '⏹️' : '🔊'}</span>
                          <span>{speakingId === scheme.id ? 'Stop' : 'Listen'}</span>
                        </button>
                      </div>
                      
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                        {scheme.description}
                      </p>

                      <div style={{ background: 'var(--bg-glass)', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>💰 Benefit</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>{scheme.amount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👥 Eligibility</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '65%', textAlign: 'right' }}>{scheme.eligibility}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {scheme.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <button style={{
                            background: 'var(--gradient-primary)', border: 'none', color: 'white',
                            padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                          }}>
                            {lang === 'hi' ? 'पोर्टल खोलें ↗' : 'Apply on Portal ↗'}
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* AISHE Colleges Tab */}
          {activeTab === 'aishe' && (
            <div>
              {/* AISHE Survey Metrics Bar */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(234,88,12,0.06), rgba(21,128,61,0.06))',
                border: '1px solid rgba(234,88,12,0.2)', borderRadius: 16, padding: '18px 20px',
                marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16,
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>National Survey Source</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>AISHE 2023-24</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Ministry of Education</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rural Colleges Share</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{AISHE_METRICS.ruralCollegesPct}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>27,500+ Rural Colleges</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rural GER Index</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{AISHE_METRICS.ruralGrossEnrollmentRatio}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Target: 50% by 2035</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Vocational & ITI Seats</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>{AISHE_METRICS.vocationalSeatsAvailable}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>B.Voc & Diploma</div>
                </div>
              </div>

              {/* State Filter */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Filter State:</span>
                {aisheStates.map(st => (
                  <button key={st} onClick={() => setAisheState(st)} style={{
                    padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    background: aisheState === st ? 'var(--gradient-primary)' : 'var(--bg-card)',
                    color: aisheState === st ? 'white' : 'var(--text-secondary)',
                    boxShadow: 'var(--shadow-sm)',
                    border: `1px solid ${aisheState === st ? 'transparent' : 'var(--bg-glass-border)'}`,
                    transition: 'all 0.2s',
                  }}>{st}</button>
                ))}
              </div>

              {/* Institutions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
                {filteredAishe.map(inst => (
                  <div key={inst.aisheCode} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                    borderRadius: 16, padding: '20px', transition: 'all 0.2s', position: 'relative',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                          background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', marginRight: 6,
                        }}>AISHE: {inst.aisheCode}</span>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                          background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
                        }}>NAAC {inst.naacGrade}</span>
                      </div>
                      <button
                        onClick={() => handleSpeak(inst.aisheCode, `${inst.name} in ${inst.district}, ${inst.state}. Annual Fee: ${inst.annualFee}. Key highlight: ${inst.highlight}`)}
                        style={{
                          background: speakingId === inst.aisheCode ? 'var(--accent)' : 'var(--bg-glass)',
                          border: 'none', borderRadius: 12, padding: '2px 8px', color: 'white',
                          cursor: 'pointer', fontSize: '0.7rem',
                        }}>
                        {speakingId === inst.aisheCode ? '⏹️' : '🔊 Listen'}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>{lang === 'hi' ? inst.nameHi : inst.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                      📍 {inst.district}, {inst.state} • <span style={{ color: 'var(--text-secondary)' }}>{inst.type}</span>
                    </div>

                    <div style={{ background: 'var(--bg-glass)', borderRadius: 10, padding: '10px 12px', marginBottom: 12, fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Annual Fee:</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{inst.annualFee}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Rural Quota:</span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Verified Government Seat</span>
                      </div>
                      <div style={{ color: 'var(--accent-light)', fontSize: '0.75rem', marginTop: 4 }}>
                        💡 {inst.highlight}
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Courses Offered:</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {inst.coursesOffered.map((c, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px',
                            borderRadius: 6, color: 'var(--text-secondary)',
                          }}>{c}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        DBT: {inst.scholarshipsAccepted.join(', ')}
                      </span>
                      <a href={inst.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button style={{
                          background: 'var(--gradient-primary)', border: 'none', color: 'white',
                          padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                          College Info ↗
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apprenticeships Tab */}
          {activeTab === 'apprenticeship' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {apprenticeships.map((a, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                  borderRadius: 16, padding: '20px', transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: '2rem' }}>{a.icon}</span>
                    <div>
                      <h4 style={{ fontSize: '0.95rem' }}>{a.role}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.company}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 14 }}>
                    {[
                      ['💰 Monthly Stipend', a.stipend],
                      ['⏳ Duration', a.duration],
                      ['📍 Location', a.location],
                      ['🪑 Open Seats', a.seats.toString()],
                    ].map(([label, value], j) => (
                      <div key={j}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <a href="https://apprenticeshipindia.org" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                      <button style={{
                        width: '100%', background: 'var(--gradient-success)', border: 'none',
                        color: 'white', padding: '10px', borderRadius: 8, cursor: 'pointer',
                        fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                      }}>{lang === 'hi' ? 'NAPS पर आवेदन करें' : 'Apply via NAPS Portal'}</button>
                    </a>
                    <div style={{ fontSize: '0.75rem', color: a.deadline === 'Rolling' ? 'var(--success)' : 'var(--warning)' }}>
                      📅 {a.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {upcomingExams.map((e, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                  borderRadius: 16, padding: '20px', transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h4 style={{ fontSize: '0.95rem' }}>{e.name}</h4>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{e.category}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    {[['📅 Exam Date', e.date], ['🎓 Eligibility', e.eligibility], ['🪑 Seats', e.seats]].map(([l, v], j) => (
                      <div key={j}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <a href={`https://${e.link}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)',
                      color: 'var(--text-primary)', padding: '10px', borderRadius: 8, cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                    }}>{lang === 'hi' ? 'आधिकारिक पोर्टल देखें →' : 'Official Portal →'}</button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
