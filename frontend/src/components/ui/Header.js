import React, { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change / outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        background: scrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(0,0,0,0.06)' : '#f3f4f6'}`,
        transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.05)' : 'none',
      }}>
        <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src="/logo-horizontal-light.svg"
              alt="MySolarWidget"
              style={{ height: 44, width: 'auto' }}
            />
          </a>

          {/* Desktop nav — hidden on mobile */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="header-desktop-nav">
            {navLinks.map(item => (
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
                  whiteSpace: 'nowrap',
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
                color: '#1e40af',
                padding: '7px 16px',
                borderRadius: 9,
                border: '1.5px solid #1e40af',
                background: 'transparent',
                textDecoration: 'none',
                transition: 'background 0.12s, color 0.12s',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e40af'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1e40af'; }}
            >
              Get Solar Widget
            </a>
          </nav>

          {/* Mobile right side — "Get Solar Widget" + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="header-mobile-nav">
            <a
              href="/for-installers"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1e40af',
                padding: '5px 10px',
                borderRadius: 8,
                border: '1.5px solid #1e40af',
                background: 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
              }}
            >
              Get Solar Widget
            </a>

            {/* Hamburger button */}
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
              aria-label="Toggle menu"
              style={{
                width: 38,
                height: 38,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                background: 'none',
                border: '1.5px solid #e5e7eb',
                borderRadius: 9,
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            >
              <span style={{ display: 'block', width: 16, height: 1.5, background: '#374151', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
              <span style={{ display: 'block', width: 16, height: 1.5, background: '#374151', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.15s' }} />
              <span style={{ display: 'block', width: 16, height: 1.5, background: '#374151', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 99,
            background: '#ffffff',
            borderBottom: '1px solid #f3f4f6',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            padding: '8px 24px 16px',
          }}
          className="header-mobile-menu"
        >
          {navLinks.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 500,
                color: '#111827',
                padding: '12px 0',
                borderBottom: '1px solid #f9fafb',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* CSS to toggle desktop/mobile nav visibility */}
      <style>{`
        @media (min-width: 640px) {
          .header-desktop-nav { display: flex !important; }
          .header-mobile-nav  { display: none  !important; }
          .header-mobile-menu { display: none  !important; }
        }
        @media (max-width: 639px) {
          .header-desktop-nav { display: none  !important; }
          .header-mobile-nav  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
