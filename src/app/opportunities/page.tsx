'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

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
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'schemes' | 'apprenticeship' | 'exams'>('schemes');

  const categories = ['all', 'Scholarship', 'Skill Training', 'Apprenticeship', 'Entrepreneurship', 'Micro Finance', 'Startup', 'Learning'];

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

  const categoryColors: Record<string, string> = {
    'Scholarship': 'var(--primary-light)',
    'Skill Training': 'var(--accent)',
    'Apprenticeship': 'var(--success)',
    'Entrepreneurship': '#f59e0b',
    'Micro Finance': '#a78bfa',
    'Startup': '#ec4899',
    'Learning': '#34d399',
    'Agriculture Finance': '#84cc16',
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
                <h2>{lang === 'hi' ? 'अवसर और योजनाएं' : 'Opportunities & Schemes'}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {lang === 'hi' ? 'आपके लिए सरकारी छात्रवृत्ति, अप्रेंटिसशिप और योजनाएं' : 'Government scholarships, apprenticeships & schemes matched for you'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-success">✓ {lang === 'hi' ? 'AI-मिलान' : 'AI-Matched'}</span>
              <span className="badge badge-primary">📊 10+ {lang === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginTop: 20, background: 'var(--bg-glass)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
            {[
              { key: 'schemes', label: lang === 'hi' ? '📜 योजनाएं' : '📜 Schemes' },
              { key: 'apprenticeship', label: lang === 'hi' ? '🏭 अप्रेंटिसशिप' : '🏭 Apprenticeships' },
              { key: 'exams', label: lang === 'hi' ? '📝 परीक्षाएं' : '📝 Exams' },
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ height: 200, borderRadius: 16 }} className="skeleton" />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                  {schemes.map(scheme => (
                    <div key={scheme.id} style={{
                      background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                      borderRadius: 16, padding: '20px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = categoryColors[scheme.category] || 'var(--primary)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bg-glass-border)';
                        (e.currentTarget as HTMLDivElement).style.transform = '';
                      }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${categoryColors[scheme.category] || 'var(--primary)'}, transparent)` }} />
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                        <span style={{ fontSize: '2rem' }}>{scheme.icon}</span>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{lang === 'hi' ? scheme.nameHi : scheme.name}</h4>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                            color: categoryColors[scheme.category] || 'var(--primary-light)',
                            background: `${categoryColors[scheme.category] || 'var(--primary)'}20`,
                          }}>{scheme.category}</span>
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                        {scheme.description}
                      </p>
                      
                      <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'hi' ? 'राशि / लाभ' : 'Amount / Benefit'}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>{scheme.amount}</div>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{lang === 'hi' ? 'पात्रता' : 'Eligibility'}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{scheme.eligibility}</div>
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {scheme.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="chip" style={{ fontSize: '0.7rem', padding: '3px 10px' }}>{tag}</span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                          <button style={{
                            width: '100%', background: 'var(--gradient-primary)', border: 'none',
                            color: 'white', padding: '10px', borderRadius: 8, cursor: 'pointer',
                            fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                          }}>
                            {lang === 'hi' ? 'आवेदन करें →' : 'Apply Now →'}
                          </button>
                        </a>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                          <div style={{ color: scheme.deadline === 'Rolling' ? 'var(--success)' : 'var(--warning)' }}>
                            📅 {scheme.deadline}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Apprenticeships Tab */}
          {activeTab === 'apprenticeship' && (
            <>
              <div style={{ padding: '12px 16px', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 10, marginBottom: 20 }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  💡 <strong style={{ color: 'var(--primary-light)' }}>{lang === 'hi' ? 'NAPS के बारे में:' : 'About NAPS:'}</strong>{' '}
                  {lang === 'hi' ? 'सरकार 25% स्टाइपेंड देती है। कंपनी बाकी 75% देती है। आपको एक साल की ट्रेनिंग और NCVT सर्टिफिकेट मिलता है।' : 'Government pays 25% of stipend, company pays 75%. You get 1-year industry training & NCVT certificate.'}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                {apprenticeships.map((a, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                    borderRadius: 16, padding: '20px', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--success)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bg-glass-border)'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{ fontSize: '2rem' }}>{a.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.company}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      {[
                        ['💰 Stipend', a.stipend],
                        ['⏱️ Duration', a.duration],
                        ['📍 Location', a.location],
                        ['🪑 Seats', a.seats.toString()],
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
                        }}>{lang === 'hi' ? 'आवेदन करें' : 'Apply via NAPS'}</button>
                      </a>
                      <div style={{ fontSize: '0.75rem', color: a.deadline === 'Rolling' ? 'var(--success)' : 'var(--warning)' }}>
                        📅 {a.deadline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
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
                    {[['📅 Date', e.date], ['🎓 Eligibility', e.eligibility], ['🪑 Seats', e.seats]].map(([l, v], j) => (
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
                    }}>{lang === 'hi' ? 'जानकारी देखें →' : 'View Details →'}</button>
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
