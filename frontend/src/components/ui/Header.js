import React from 'react';

export default function Header() {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #f1f5f9',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/favicon-192x192.png" alt="MySolarWidget logo" style={{ width: 42, height: 42, borderRadius: 8 }} />
        <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          MySolar<span style={{ color: '#f59e0b' }}>Widget</span>
        </span>
      </div>
      <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <a href="#how-it-works" style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>How It Works</a>
        <a href="/blog" style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Blog</a>
        <a href="#faq" style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>FAQ</a>
        <a href="/for-installers" style={{
          fontSize: 13,
          fontWeight: 600,
          background: '#f1f5f9',
          color: '#1e40af',
          padding: '6px 14px',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
        }}>Installer Login</a>
      </nav>
    </header>
  );
}
