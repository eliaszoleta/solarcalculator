import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SunIcon, BoltIcon, WrenchIcon, DollarSignIcon } from '../ui/Icons';

const DOMAIN = 'https://www.mysolarwidget.com';

export default function About() {
  return (
    <div style={{ background: 'var(--bg, #f1f5f9)', minHeight: '100vh' }}>
      <Helmet>
        <title>About MySolarWidget | Free Solar Savings Calculator</title>
        <meta name="description" content="MySolarWidget is a free solar savings calculator for US homeowners. We use NREL PVWatts data and real electricity rates to estimate your solar costs and savings in under 2 minutes." />
        <link rel="canonical" href={`${DOMAIN}/about`} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MySolarWidget",
          "url": DOMAIN,
          "description": "Free solar savings calculator for US homeowners. Powered by NREL PVWatts real sunlight data.",
          "logo": {
            "@type": "ImageObject",
            "url": `${DOMAIN}/android-chrome-512x512.png`,
            "width": 512,
            "height": 512
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "hello@mysolarwidget.com",
            "url": `${DOMAIN}/contact`
          },
          "sameAs": []
        })}</script>
      </Helmet>

      {/* Page Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)',
        padding: '64px 24px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', filter: 'blur(50px)' }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(147,197,253,0.12)', border: '1px solid rgba(147,197,253,0.25)', borderRadius: 999, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>About Us</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
            About MySolarWidget
          </h1>
          <p style={{ fontSize: 17, color: '#93c5fd', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            We built the solar calculator we wished existed — honest, fast, and backed by real government data.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Mission */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={h2Style}>Our Mission</h2>
            <p style={pStyle}>
              Going solar is one of the biggest financial decisions a homeowner can make — yet most people walk into installer sales meetings with no idea what a fair price looks like. Installers charge anywhere from $2.50 to $4.50 per watt for the exact same equipment, and the difference can be $10,000 or more.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              MySolarWidget exists to level the playing field. Our free calculator gives you an independent, data-driven estimate <em>before</em> you talk to a single installer. Armed with that number, you can negotiate from a position of knowledge, compare quotes confidently, and avoid getting taken advantage of.
            </p>
          </div>
        </section>

        {/* How it's built */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ ...h2Style, paddingLeft: 4 }}>Built on Real Data</h2>
          <p style={{ ...pStyle, paddingLeft: 4, marginBottom: 20 }}>Unlike other calculators that use rough averages, our estimates are powered by the same data sources that professional solar engineers use:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              {
                icon: <SunIcon size={24} />, iconBg: '#fef9c3', iconColor: '#ca8a04',
                title: 'NREL PVWatts API',
                desc: "When you enter a ZIP code, we query the National Renewable Energy Laboratory's PVWatts database for your exact location's peak sun hours and irradiance — the same dataset used by professional installers."
              },
              {
                icon: <BoltIcon size={24} />, iconBg: '#fef3c7', iconColor: '#d97706',
                title: 'EIA Electricity Rates',
                desc: "We use real residential electricity rates from the U.S. Energy Information Administration (EIA) for each state, updated regularly. Your savings estimate reflects what you actually pay per kWh."
              },
              {
                icon: <WrenchIcon size={24} />, iconBg: '#ffedd5', iconColor: '#ea580c',
                title: 'Market Installation Costs',
                desc: "Our installation cost estimates ($2.50–$3.50/watt) are based on current national averages from SEIA and Lawrence Berkeley National Laboratory's Tracking the Sun report."
              },
              {
                icon: <DollarSignIcon size={24} />, iconBg: '#dcfce7', iconColor: '#16a34a',
                title: 'Federal Tax Credit',
                desc: "We apply the current 30% Investment Tax Credit (ITC) and project savings over 30 years with a 4% annual electricity rate increase, consistent with historical averages."
              }
            ].map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: 14, padding: '22px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accuracy note */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: '#fffbeb', borderRadius: 16, padding: '28px 32px', border: '1px solid #fde68a' }}>
            <h2 style={{ ...h2Style, marginTop: 0 }}>A Note on Accuracy</h2>
            <p style={pStyle}>
              Our estimates are <strong>80–90% accurate</strong> compared to real installer quotes. On a typical $25,000 system, that's within $2,500–$5,000 of what an installer would actually propose. That's accurate enough to know whether solar makes financial sense for you and to spot an overpriced quote — but not a substitute for an on-site assessment.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              For a final price, you'll always need a site visit from a licensed installer who can assess your roof, shade, electrical panel, and local permitting costs. Our goal isn't to replace that — it's to make sure you go into it informed.
            </p>
          </div>
        </section>

        {/* For installers */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 32px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ ...h2Style, marginTop: 0 }}>Also Built for Solar Installers</h2>
            <p style={pStyle}>
              In addition to the free public calculator, MySolarWidget offers a white-label embeddable widget that solar installers can add to their own websites. Installers get a branded calculator pre-configured with their service area, pricing, and lead routing — turning website visitors into qualified leads automatically.
            </p>
            <a
              href="/for-installers"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                background: '#2563eb',
                color: 'white',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              Learn about the Installer Widget
            </a>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          borderRadius: 20,
          padding: '40px 32px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.01em' }}>Questions or Feedback?</h2>
          <p style={{ color: '#93c5fd', marginBottom: 24, fontSize: 15, lineHeight: 1.6 }}>We're a small team and we read every message.</p>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 28px',
              background: 'white',
              color: '#0f172a',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
            }}
          >
            Contact Us
          </a>
        </section>

      </div>
    </div>
  );
}

const h2Style = { fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.01em' };
const pStyle = { fontSize: 14.5, color: '#374151', lineHeight: 1.8, marginBottom: 14 };
