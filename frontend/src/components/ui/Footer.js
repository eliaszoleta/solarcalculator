import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '40px 24px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>☀️</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: 'white' }}>
                Solar<span style={{ color: '#f59e0b' }}>Calc</span>
              </span>
            </div>
            <p style={{ fontSize: 13, maxWidth: 260, lineHeight: 1.6 }}>
              Free solar savings calculator for homeowners. Estimates based on real solar data.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resources</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#how-it-works" style={{ fontSize: 13, color: '#94a3b8' }}>How It Works</a>
                <a href="#faq" style={{ fontSize: 13, color: '#94a3b8' }}>FAQ</a>
                <a href="#" style={{ fontSize: 13, color: '#94a3b8' }}>Solar Incentives</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>For Installers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="/installer" style={{ fontSize: 13, color: '#94a3b8' }}>Dashboard</a>
                <a href="#embed" style={{ fontSize: 13, color: '#94a3b8' }}>Embed Widget</a>
                <a href="#pricing" style={{ fontSize: 13, color: '#94a3b8' }}>Pricing</a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12 }}>© {new Date().getFullYear()} SolarCalc. Estimates are for informational purposes only.</p>
          <p style={{ fontSize: 12 }}>Solar production data powered by <a href="https://developer.nrel.gov/docs/solar/pvwatts/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>NREL PVWatts</a></p>
        </div>
      </div>
    </footer>
  );
}
