import React from 'react';

const links = {
  Resources: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'How We Calculate Your Estimate', href: '/how-we-calculate-solar-costs' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Solar Blog', href: '/blog' },
    { label: 'Solar Incentives', href: '/blog/category/solar-incentives' },
    { label: 'Solar Costs', href: '/blog/category/solar-costs' },
  ],
  'Cost Guides': [
    { label: 'Cost by System Size', href: '/solar-panels/solar-system-size-cost' },
    { label: 'Cost by Roof Type', href: '/solar-panels/solar-cost-by-roof-type' },
    { label: 'Tesla Powerwall Cost', href: '/solar-panels/tesla-powerwall-cost' },
    { label: 'Cost in California', href: '/solar-cost/california' },
    { label: 'Cost in Texas', href: '/solar-cost/texas' },
    { label: 'Cost in Florida', href: '/solar-cost/florida' },
  ],
  'For Installers': [
    { label: 'Dashboard', href: '/installer' },
    { label: 'Embed Calculator', href: '/for-installers' },
    { label: 'Pricing', href: '/for-installers#pricing' },
  ],
  'Partner Program': [
    { label: 'Become a Partner', href: '/partner-with-us' },
    { label: 'Exclusive City Placement', href: '/partner-with-us' },
    { label: 'Partner Pricing', href: '/partner-with-us#apply' },
    { label: 'Apply Now', href: '/partner-with-us#apply' },
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
              <img src="/logo-icon-dark.svg" alt="Solar Cost Predictor" style={{ height: 48, width: 'auto' }} />
            </a>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>
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
                      style={{ fontSize: 13.5, color: '#64748b', transition: 'color 0.12s', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#d1d5db'}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
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
          <p style={{ fontSize: 12.5, color: '#475569' }}>
            © {new Date().getFullYear()} Solar Cost Predictor · Estimates are for informational purposes only ·{' '}
            <a href="/privacy-policy" style={{ color: '#64748b' }}>Privacy</a>
            {' · '}
            <a href="/terms-of-service" style={{ color: '#64748b' }}>Terms</a>
          </p>
          <p style={{ fontSize: 12.5, color: '#475569' }}>
            Solar data powered by{' '}
            <a
              href="https://developer.nrel.gov/docs/solar/pvwatts/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#64748b' }}
            >
              NREL PVWatts
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
