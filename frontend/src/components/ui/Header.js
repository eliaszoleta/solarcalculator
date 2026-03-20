import React, { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      background: scrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: `1px solid ${scrolled ? 'rgba(0,0,0,0.06)' : '#f3f4f6'}`,
      transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.05)' : 'none',
    }}>
      <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <img
            src="/favicon-192x192.png"
            alt="MySolarWidget logo"
            style={{ width: 32, height: 32, borderRadius: 8 }}
          />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
            MySolar<span style={{ color: '#f59e0b' }}>Widget</span>
          </span>
        </a>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Blog', href: '/blog' },
            { label: 'FAQ', href: '#faq' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#4b5563',
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'color 0.12s, background 0.12s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.background = 'transparent'; }}
            >
              {item.label}
            </a>
          ))}

          <a
            href="/for-installers"
            style={{
              marginLeft: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#0a0a0a',
              padding: '7px 16px',
              borderRadius: 9,
              border: '1.5px solid #e5e7eb',
              background: '#ffffff',
              textDecoration: 'none',
              transition: 'border-color 0.12s, background 0.12s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#ffffff'; }}
          >
            For Installers
          </a>
        </nav>
      </div>
    </header>
  );
}
