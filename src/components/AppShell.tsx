'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', icon: '🏠', label: 'Home', labelHi: 'होम' },
  { href: '/discover', icon: '🎙️', label: 'Discover', labelHi: 'खोजें' },
  { href: '/learn', icon: '🗺️', label: 'Learn', labelHi: 'सीखें' },
  { href: '/opportunities', icon: '🌟', label: 'Opportunities', labelHi: 'अवसर' },
  { href: '/connect', icon: '🤝', label: 'Connect & Earn', labelHi: 'जुड़ें और कमाएं' },
  { href: '/facilitator', icon: '👩‍🏫', label: 'Facilitator', labelHi: 'सुविधाकर्ता' },
];

interface AppShellProps {
  children: React.ReactNode;
  lang?: 'en' | 'hi';
  onLangChange?: (lang: 'en' | 'hi') => void;
}

export default function AppShell({ children, lang = 'en', onLangChange }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="app-layout">
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
              <div style={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>VidyaSetu</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>विद्यासेतु</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{lang === 'hi' ? item.labelHi : item.label}</span>
              {pathname === item.href && (
                <div style={{
                  marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--primary-light)',
                }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bg-glass-border)' }}>
          <button
            onClick={() => onLangChange?.(lang === 'en' ? 'hi' : 'en')}
            style={{
              width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)',
              color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            🌐 {lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
          </button>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>RK</div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Ravi Kumar</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class 10 • UP</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile top bar */}
        <div style={{
          display: 'none',
          background: 'var(--bg-secondary)', padding: '12px 16px',
          borderBottom: '1px solid var(--bg-glass-border)',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }} id="mobile-header">
          <button onClick={() => setMobileOpen(true)} style={{
            background: 'none', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer',
          }}>☰</button>
          <span style={{ fontWeight: 700 }}>VidyaSetu</span>
          <button
            onClick={() => onLangChange?.(lang === 'en' ? 'hi' : 'en')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
            🌐 {lang === 'en' ? 'हिं' : 'EN'}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
