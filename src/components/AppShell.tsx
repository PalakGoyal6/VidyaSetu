'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BHASHINI_LANGUAGES, TRANSLATIONS } from '@/lib/data';

const NAV_ITEMS = [
  { href: '/', icon: '🏠', key: 'home' },
  { href: '/discover', icon: '🎙️', key: 'discover' },
  { href: '/learn', icon: '🗺️', key: 'learn' },
  { href: '/opportunities', icon: '🌟', key: 'opportunities' },
  { href: '/connect', icon: '🤝', key: 'connect' },
  { href: '/facilitator', icon: '👩‍🏫', key: 'facilitator' },
];

interface AppShellProps {
  children: React.ReactNode;
  lang?: string;
  onLangChange?: (lang: string) => void;
}

export default function AppShell({ children, lang = 'en', onLangChange }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const currentLangObj = BHASHINI_LANGUAGES.find(l => l.id === lang) || BHASHINI_LANGUAGES[0];

  useEffect(() => {
    setMobileOpen(false);
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pathname]);

  const toggleDataSaver = () => {
    const nextState = !dataSaver;
    setDataSaver(nextState);
    if (nextState) {
      document.body.classList.add('data-saver');
    } else {
      document.body.classList.remove('data-saver');
    }
  };

  return (
    <div className="app-layout">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: 'linear-gradient(90deg, #b45309, #d97706)',
          color: 'white', padding: '6px 16px', fontSize: '0.8rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          <span>📶</span>
          <span>{t.offlineNotice || 'Offline Mode Active • Saved locally for low-bandwidth rural connectivity'}</span>
          <span style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem' }}>
            Syncing Queued
          </span>
        </div>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99,
          backdropFilter: 'blur(4px)',
        }} />
      )}

      {/* Sidebar */}
      <aside className="sidebar" style={{
        transform: mobileOpen ? 'translateX(0)' : undefined,
        display: 'flex',
        marginTop: !isOnline ? 32 : 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid var(--bg-glass-border)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: 'white', fontSize: '1rem',
            }}>V</div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>VidyaSetu</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>विद्यासेतु • AI Platform</div>
            </div>
          </Link>
          <div style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(21, 128, 61, 0.08)', border: '1px solid rgba(21, 128, 61, 0.25)',
            padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', color: 'var(--success)', fontWeight: 600,
          }}>
            <span>🗣️</span>
            <span>BHASHINI AI Multi-Voice</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{t[item.key] || item.key}</span>
              {pathname === item.href && (
                <div style={{
                  marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--primary)',
                }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Data Saver Mode & BHASHINI Language Switcher */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Low Bandwidth Toggle */}
          <button
            onClick={toggleDataSaver}
            style={{
              width: '100%', background: dataSaver ? 'rgba(21, 128, 61, 0.12)' : '#ffffff',
              border: `1px solid ${dataSaver ? 'var(--success)' : 'var(--bg-glass-border)'}`,
              color: dataSaver ? 'var(--success)' : 'var(--text-secondary)',
              padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
            }}>
            <span>📶 {dataSaver ? 'Data Saver: ON' : 'Data Saver: OFF'}</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{dataSaver ? '2G/3G Lite' : 'Standard'}</span>
          </button>

          {/* BHASHINI Regional Languages Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                width: '100%', background: '#ffffff', border: '1px solid var(--bg-glass-border)',
                color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 8,
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
              }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🌐</span>
                <span style={{ fontWeight: 600 }}>{currentLangObj.native}</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BHASHINI ▾</span>
            </button>

            {showLangMenu && (
              <div style={{
                position: 'absolute', bottom: '105%', left: 0, right: 0,
                background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                borderRadius: 10, padding: 6, zIndex: 100, boxShadow: 'var(--shadow-md)',
                maxHeight: 220, overflowY: 'auto',
              }}>
                <div style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--bg-glass-border)' }}>
                  Bhashini Language Mission
                </div>
                {BHASHINI_LANGUAGES.map(l => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onLangChange?.(l.id);
                      setShowLangMenu(false);
                    }}
                    style={{
                      width: '100%', background: lang === l.id ? 'rgba(234,88,12,0.1)' : 'transparent',
                      border: 'none', color: lang === l.id ? 'var(--primary)' : 'var(--text-primary)', padding: '8px 10px',
                      borderRadius: 6, cursor: 'pointer', textAlign: 'left', fontSize: '0.82rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontWeight: lang === l.id ? 600 : 400,
                    }}>
                    <span>{l.native}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User profile pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>RK</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Ravi Kumar</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class 10 • UP (Govt School)</div>
            </div>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isOnline ? 'var(--success)' : 'var(--warning)',
            }} title={isOnline ? 'Online' : 'Offline'} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ marginTop: !isOnline ? 32 : 0 }}>
        {/* Mobile top bar */}
        <div style={{
          display: 'none',
          background: 'var(--bg-secondary)', padding: '12px 16px',
          borderBottom: '1px solid var(--bg-glass-border)',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }} id="mobile-header">
          <button onClick={() => setMobileOpen(true)} style={{
            background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.3rem', cursor: 'pointer',
          }}>☰</button>
          <span style={{ fontWeight: 700 }}>VidyaSetu</span>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
            🌐 {currentLangObj.flag}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
