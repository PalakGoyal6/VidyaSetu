'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TRANSLATIONS } from '@/lib/data';

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const t = TRANSLATIONS[lang];

  const stats = [
    { value: '600M+', label: lang === 'hi' ? 'ग्रामीण युवा' : 'Rural Youth in India', icon: '👥' },
    { value: '38', label: lang === 'hi' ? 'करियर विकल्प' : 'Career Pathways', icon: '🎯' },
    { value: '10+', label: lang === 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes', icon: '📜' },
    { value: '9', label: lang === 'hi' ? 'भाषाएं (जल्द)' : 'Languages (Soon)', icon: '🗣️' },
  ];

  const features = [
    {
      icon: '🎙️',
      title: lang === 'hi' ? 'आवाज़ से खोजें' : 'Discover by Voice',
      desc: lang === 'hi' ? 'अपनी भाषा में बोलें। AI आपका करियर प्रोफाइल बनाएगा।' : 'Speak in your language. AI builds your career profile through conversation.',
      href: '/discover',
      color: 'var(--accent)',
      badge: lang === 'hi' ? 'हिंदी / English' : 'Hindi / English',
    },
    {
      icon: '🗺️',
      title: lang === 'hi' ? 'व्यक्तिगत सीखने का रास्ता' : 'Personalized Learning Path',
      desc: lang === 'hi' ? 'AI आपके लिए चरण-दर-चरण सीखने का रास्ता बनाता है।' : 'AI creates your step-by-step learning roadmap with free government resources.',
      href: '/learn',
      color: 'var(--primary-light)',
      badge: lang === 'hi' ? 'SWAYAM • DIKSHA' : 'SWAYAM • DIKSHA',
    },
    {
      icon: '🌟',
      title: lang === 'hi' ? 'छात्रवृत्ति और अवसर' : 'Scholarships & Opportunities',
      desc: lang === 'hi' ? 'सरकारी योजनाएं, छात्रवृत्ति और NAPS अप्रेंटिसशिप।' : 'Find scholarships, NAPS apprenticeships & govt schemes you\'re eligible for.',
      href: '/opportunities',
      color: 'var(--success)',
      badge: lang === 'hi' ? 'NAPS • NSP' : 'NAPS • NSP',
    },
    {
      icon: '🤝',
      title: lang === 'hi' ? 'मेंटर से जुड़ें' : 'Connect with Mentors',
      desc: lang === 'hi' ? 'अपने जैसे सफल लोगों से सीखें जो आपकी भाषा बोलते हैं।' : 'Learn from successful professionals who speak your language and share your roots.',
      href: '/connect',
      color: '#a78bfa',
      badge: lang === 'hi' ? 'NGO • Corporate' : 'NGO • Corporate',
    },
    {
      icon: '👩‍🏫',
      title: lang === 'hi' ? 'शिक्षक डैशबोर्ड' : 'Facilitator Dashboard',
      desc: lang === 'hi' ? 'शिक्षक छात्रों को खोजें, ट्रेक करें, और अपने मॉड्यूल बनाएं।' : 'Teachers can discover student talent, recommend them, and build paid modules.',
      href: '/facilitator',
      color: '#34d399',
      badge: lang === 'hi' ? 'शिक्षक हेतु' : 'For Teachers',
    },
    {
      icon: '📶',
      title: lang === 'hi' ? 'कम बैंडविड्थ ऑफलाइन' : 'Low-bandwidth & Offline',
      desc: lang === 'hi' ? 'धीमे इंटरनेट पर काम करता है। ऑफलाइन सीखें, बाद में सिंक करें।' : 'Works on slow 2G/3G connections. Learn offline, sync when connected.',
      href: '/discover',
      color: '#fbbf24',
      badge: lang === 'hi' ? 'PWA • ऑफलाइन' : 'PWA • Offline First',
    },
  ];

  const govtPartners = [
    { name: 'DIKSHA', icon: '📖', color: '#4f46e5' },
    { name: 'SWAYAM', icon: '🎓', color: '#7c3aed' },
    { name: 'AISHE', icon: '🏛️', color: '#0ea5e9' },
    { name: 'Skill India', icon: '🛠️', color: '#f97316' },
    { name: 'NAPS', icon: '🏭', color: '#10b981' },
    { name: 'NSP', icon: '📜', color: '#3b82f6' },
    { name: 'BHASHINI', icon: '🗣️', color: '#8b5cf6' },
    { name: 'PMKVY', icon: '⚡', color: '#f59e0b' },
    { name: 'MUDRA', icon: '💳', color: '#ec4899' },
  ];

  const journeySteps = [
    { step: '01', icon: '🎙️', title: lang === 'hi' ? 'बात करें' : 'Talk', desc: lang === 'hi' ? 'अपनी भाषा में AI से बात करें' : 'Chat with AI in your language' },
    { step: '02', icon: '🧠', title: lang === 'hi' ? 'AI विश्लेषण' : 'AI Profiles', desc: lang === 'hi' ? 'आपकी रुचि, कौशल, लक्ष्य' : 'Your interests, skills & goals' },
    { step: '03', icon: '🗺️', title: lang === 'hi' ? 'रास्ता मिलता है' : 'Path Created', desc: lang === 'hi' ? 'व्यक्तिगत करियर रोडमैप' : 'Personalized career roadmap' },
    { step: '04', icon: '🚀', title: lang === 'hi' ? 'सफलता' : 'Succeed', desc: lang === 'hi' ? 'करियर शुरू करें और कमाएं' : 'Launch your career & earn' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(79,70,229,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(249,115,22,0.08) 0%, transparent 50%)',
      }} />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bg-glass-border)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800, color: 'white',
          }}>V</div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{t.appName}</span>
            {lang === 'hi' && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>VidyaSetu</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            style={{
              background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)',
              color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            🌐 {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
          <Link href="/discover" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            {t.startJourney} →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 32px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="badge badge-accent" style={{ marginBottom: 24, display: 'inline-flex' }}>
            🇮🇳 {lang === 'hi' ? 'ग्रामीण भारत के लिए AI' : 'AI for Rural India'}
          </div>

          <h1 style={{ marginBottom: 20, lineHeight: 1.15 }}>
            <span className="gradient-text">{lang === 'hi' ? 'ज्ञान का सेतु' : 'Bridge Every'}</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>
              {lang === 'hi' ? 'रोजगार का सेतु' : 'Student\'s Dream'}
            </span>
            <br />
            <span className="gradient-text-accent">
              {lang === 'hi' ? 'विद्यासेतु' : 'to Livelihood'}
            </span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            {lang === 'hi'
              ? 'AI से संचालित मंच जो हर ग्रामीण छात्र को उनकी भाषा में करियर मार्गदर्शन, सीखने का रास्ता और रोजगार के अवसर देता है।'
              : 'An AI-powered platform that gives every rural student in India career guidance, learning pathways, and livelihood opportunities — in their own language.'}
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/discover" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--gradient-accent)', color: 'white',
              padding: '16px 32px', borderRadius: 14, fontWeight: 700, fontSize: '1.05rem',
              textDecoration: 'none', boxShadow: '0 4px 25px rgba(249,115,22,0.4)',
              transition: 'all 0.2s ease',
            }}>
              🎙️ {lang === 'hi' ? 'आवाज़ से शुरू करें' : 'Start with Voice'}
            </Link>
            <Link href="/facilitator" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-glass)', color: 'var(--text-primary)',
              padding: '16px 32px', borderRadius: 14, fontWeight: 600, fontSize: '1.05rem',
              textDecoration: 'none', border: '1px solid var(--bg-glass-border)',
              transition: 'all 0.2s ease',
            }}>
              👩‍🏫 {lang === 'hi' ? 'शिक्षक हूं' : 'I\'m a Teacher'}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 32px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
              borderRadius: 16, padding: '20px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>{lang === 'hi' ? 'यह कैसे काम करता है' : 'How it works'}</p>
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>
            {lang === 'hi' ? '4 आसान कदम' : '4 Simple Steps'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 40, left: '12%', right: '12%',
              height: 2, background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              opacity: 0.3,
            }} />
            {journeySteps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--bg-card)', border: '2px solid var(--bg-glass-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', margin: '0 auto 16px', position: 'relative', zIndex: 1,
                  boxShadow: '0 0 20px rgba(99,102,241,0.2)',
                }}>{s.icon}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>STEP {s.step}</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="section-label" style={{ textAlign: 'center' }}>{lang === 'hi' ? 'मुख्य सुविधाएं' : 'Platform Features'}</p>
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>
            {lang === 'hi' ? 'सब कुछ एक जगह' : 'Everything in One Place'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <Link key={i} href={f.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                  borderRadius: 16, padding: '24px', height: '100%',
                  transition: 'all 0.25s ease', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = f.color;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${f.color}22`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bg-glass-border)';
                    (e.currentTarget as HTMLDivElement).style.transform = '';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                  }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${f.color}22`, border: `1px solid ${f.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', marginBottom: 16,
                  }}>{f.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <h4 style={{ flex: 1, fontSize: '1rem', color: 'var(--text-primary)' }}>{f.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>{f.desc}</p>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
                    color: f.color, background: `${f.color}15`,
                    padding: '4px 10px', borderRadius: 100, border: `1px solid ${f.color}33`,
                  }}>{f.badge}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Govt Partners */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 32px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label">{lang === 'hi' ? 'सरकारी भागीदार' : 'Government Partners'}</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
            {lang === 'hi' ? 'भारत सरकार की डिजिटल पहलों से जुड़े' : 'Integrated with India\'s Digital Education Initiatives'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {govtPartners.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                borderRadius: 100, padding: '8px 20px', fontSize: '0.9rem', fontWeight: 600,
                color: 'var(--text-secondary)',
              }}>
                {p.icon} {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 32px 80px' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
          borderRadius: 24, padding: '48px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--success))',
          }} />
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚀</div>
          <h2 style={{ marginBottom: 12 }}>
            {lang === 'hi' ? 'अपनी यात्रा आज शुरू करें' : 'Start Your Journey Today'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            {lang === 'hi'
              ? 'मुफ़्त में। अपनी भाषा में। अपने सपने की दिशा में।'
              : 'Free. In your language. Towards your dream career.'}
          </p>
          <Link href="/discover" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--gradient-primary)', color: 'white',
            padding: '16px 40px', borderRadius: 14, fontWeight: 700, fontSize: '1.1rem',
            textDecoration: 'none', boxShadow: '0 4px 25px rgba(79,70,229,0.4)',
          }}>
            🎙️ {lang === 'hi' ? 'अभी शुरू करें — मुफ़्त है' : 'Start Now — It\'s Free'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--bg-glass-border)',
        padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>VidyaSetu</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>विद्यासेतु</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          🇮🇳 {lang === 'hi' ? 'भारत के ग्रामीण छात्रों के लिए बनाया गया' : 'Built for Rural India'} • Open Source
        </p>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem' }}>
          {['discover', 'learn', 'opportunities', 'connect', 'facilitator'].map(path => (
            <Link key={path} href={`/${path}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'capitalize' }}>
              {path}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
