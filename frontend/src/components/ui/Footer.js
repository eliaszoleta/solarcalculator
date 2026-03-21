import React from 'react';

const links = {
  Resources: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Solar Blog', href: '/blog' },
    { label: 'Solar Incentives', href: '/blog/category/solar-incentives' },
    { label: 'Solar Costs', href: '/blog/category/solar-costs' },
  ],
  'For Installers': [
    { label: 'Dashboard', href: '/installer' },
    { label: 'Embed Widget', href: '/for-installers' },
    { label: 'Pricing', href: '/for-installers#pricing' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0a0a',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px 40px' }}>

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div style={{ maxWidth: 260 }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 16, textDecoration: 'none' }}>
              <img src="/logo-horizontal-light.svg" alt="MySolarWidget" style={{ height: 36, width: 'auto' }} />
            </a>
            <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65 }}>
              Free solar savings calculator for US homeowners — powered by real NREL data and EIA electricity rates.
            </p>
          </div>

          {/* Link columns */}
          <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
            {Object.entries(links).map(([section, items]) => (
              <div key={section}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                  {section}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <a
                      key={item.href}
                      href={item.href}
                      style={{ fontSize: 13.5, color: '#6b7280', transition: 'color 0.12s', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#d1d5db'}
                      onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12.5, color: '#4b5563' }}>
            © {new Date().getFullYear()} MySolarWidget · Estimates are for informational purposes only ·{' '}
            <a href="/privacy-policy" style={{ color: '#6b7280' }}>Privacy</a>
            {' · '}
            <a href="/terms-of-service" style={{ color: '#6b7280' }}>Terms</a>
          </p>
          <p style={{ fontSize: 12.5, color: '#4b5563' }}>
            Solar data powered by{' '}
            <a
              href="https://developer.nrel.gov/docs/solar/pvwatts/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6b7280' }}
            >
              NREL PVWatts
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
