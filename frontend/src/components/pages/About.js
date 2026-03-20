import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SunIcon, BoltIcon, WrenchIcon, DollarSignIcon } from '../ui/Icons';

const DOMAIN = 'https://www.mysolarwidget.com';

export default function About() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Helmet>
        <title>About MySolarWidget — Free Solar Savings Calculator</title>
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

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <img src="/android-chrome-192x192.png" alt="MySolarWidget logo" style={{ width: 56, height: 56, borderRadius: 12 }} />
            <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
              MySolar<span style={{ color: '#f59e0b' }}>Widget</span>
            </span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
            About MySolarWidget
          </h1>
          <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>
            We built the solar calculator we wished existed when we were researching solar — honest, fast, and backed by real data.
          </p>
        </div>

        {/* Mission */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Our Mission</h2>
          <p style={pStyle}>
            Going solar is one of the biggest financial decisions a homeowner can make — yet most people walk into installer sales meetings with no idea what a fair price looks like. Installers charge anywhere from $2.50 to $4.50 per watt for the exact same equipment, and the difference can be $10,000 or more.
          </p>
          <p style={pStyle}>
            MySolarWidget exists to level the playing field. Our free calculator gives you an independent, data-driven estimate <em>before</em> you talk to a single installer. Armed with that number, you can negotiate from a position of knowledge, compare quotes confidently, and avoid getting taken advantage of.
          </p>
        </section>

        {/* How it's built */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Built on Real Data</h2>
          <p style={pStyle}>Unlike other calculators that use rough averages, our estimates are powered by the same data sources that professional solar engineers use:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 24 }}>
            {[
              {
                icon: <SunIcon size={28} />,
                title: 'NREL PVWatts API',
                desc: "When you enter a ZIP code, we query the National Renewable Energy Laboratory's PVWatts database for your exact location's peak sun hours and irradiance. This is the same dataset used by professional installers."
              },
              {
                icon: <BoltIcon size={28} />,
                title: 'EIA Electricity Rates',
                desc: "We use real residential electricity rates from the U.S. Energy Information Administration (EIA) for each state, updated regularly. Your savings estimate reflects what you actually pay per kWh."
              },
              {
                icon: <WrenchIcon size={28} />,
                title: 'Market Installation Costs',
                desc: "Our installation cost estimates ($2.50–$3.50/watt) are based on current national averages from SEIA and Lawrence Berkeley National Laboratory's Tracking the Sun report."
              },
              {
                icon: <DollarSignIcon size={28} />,
                title: 'Federal Tax Credit',
                desc: "We apply the current 30% Investment Tax Credit (ITC) and project savings over 30 years with a 4% annual electricity rate increase, consistent with historical averages."
              }
            ].map(item => (
              <div key={item.title} style={{ background: '#f8fafc', borderRadius: 14, padding: 24 }}>
                <div style={{ marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For installers */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Also Built for Solar Installers</h2>
          <p style={pStyle}>
            In addition to the free public calculator, MySolarWidget offers a white-label embeddable widget that solar installers can add to their own websites. Installers get a branded calculator pre-configured with their service area, pricing, and lead routing — turning website visitors into qualified leads automatically.
          </p>
          <a
            href="/for-installers"
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '10px 22px',
              background: '#1e40af',
              color: 'white',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none'
            }}
          >
            Learn about the Installer Widget →
          </a>
        </section>

        {/* Accuracy */}
        <section style={{ marginBottom: 56, background: '#fffbeb', borderRadius: 16, padding: '28px 32px', border: '1px solid #fde68a' }}>
          <h2 style={{ ...h2Style, marginTop: 0 }}>A Note on Accuracy</h2>
          <p style={pStyle}>
            Our estimates are within <strong>10–20% of real installer quotes</strong> for most homes. With a ZIP code we typically hit 10–15%. That's accurate enough to know whether solar makes financial sense for you and to spot an overpriced quote — but not precise enough to replace an on-site assessment.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            For a final price, you'll always need a site visit from a licensed installer who can assess your roof, shade, electrical panel, and local permitting costs. Our goal isn't to replace that — it's to make sure you go into it informed.
          </p>
        </section>

        {/* Contact CTA */}
        <section style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Questions or Feedback?</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>We're a small team and we read every message.</p>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#0f172a',
              color: 'white',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none'
            }}
          >
            Contact Us
          </a>
        </section>

      </div>
    </div>
  );
}

const h2Style = { fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 16 };
const pStyle = { fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 16 };
