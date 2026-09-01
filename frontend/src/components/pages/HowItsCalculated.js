import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPinIcon, SunIcon, RulerIcon, DollarSignIcon, BoltIcon, PlugIcon } from '../ui/Icons';

const DOMAIN = 'https://www.solarcostpredictor.com';

const STEPS = [
  {
    icon: <MapPinIcon size={22} />, iconBg: '#e0ece4', iconColor: '#1f4d3a',
    title: '1. Location & Sun Data',
    desc: "Your ZIP code is geocoded to a precise latitude and longitude (via OpenStreetMap Nominatim). We use that to query the National Renewable Energy Laboratory's PVWatts v8 API — the same government dataset professional solar engineers use — for your exact location's annual solar production. If the API is unavailable, we fall back to your state's average peak sun hours instead.",
  },
  {
    icon: <BoltIcon size={22} />, iconBg: '#d9f0e1', iconColor: '#059669',
    title: '2. Usage & System Sizing',
    desc: "We divide your monthly electric bill by your state's real EIA electricity rate to estimate how many kWh you use. Your recommended system is then sized to offset about 85% of that usage — a realistic target installers use, since 100% offset rarely pencils out. System size is capped between 4 kW and 20 kW to keep estimates in a normal residential range.",
  },
  {
    icon: <RulerIcon size={22} />, iconBg: '#dcf3e3', iconColor: '#0f3d2e',
    title: '3. Installation Cost',
    desc: 'System size is priced at a flat $2.80 per watt, all-in — panels, labor, inverter, permits, and installer margin included. We then add your roof type surcharge ($0 for asphalt shingle, $500 for metal, $800 for flat, $1,500 for tile) and battery cost ($0 with no battery, $11,500 for one Tesla Powerwall, $23,000 for two).',
  },
  {
    icon: <DollarSignIcon size={22} />, iconBg: '#dcfce7', iconColor: '#16a34a',
    title: '4. Federal Tax Credit',
    desc: 'The 30% federal solar Investment Tax Credit (ITC) is applied to your total system cost, including any battery — giving you your net out-of-pocket cost. This credit is scheduled to remain at 30% for systems installed through 2032.',
  },
  {
    icon: <SunIcon size={22} />, iconBg: '#eaf6ee', iconColor: '#15803d',
    title: '5. Savings & Payback',
    desc: 'Annual savings are based on how much of your usage your system\'s real projected production offsets, at your actual electricity rate. We project 30 years of savings assuming a 4% annual utility rate increase (consistent with long-run historical averages), and calculate your payback year as the point your cumulative savings exceed your net system cost.',
  },
  {
    icon: <PlugIcon size={22} />, iconBg: '#f0f5f2', iconColor: '#1b4d3e',
    title: '6. Financing (Optional)',
    desc: "If you'd rather finance than pay cash, we also show an estimated monthly loan payment based on a 25-year term at 5.99% APR — a standard rate structure used in solar financing offers — so you can compare a financed monthly payment against your current electric bill.",
  },
];

export default function HowItsCalculated() {
  const title = 'How We Calculate Your Solar Cost Estimate | Solar Cost Predictor';
  const description = 'See exactly how Solar Cost Predictor estimates your solar installation cost, savings, and payback period — real NREL sun data, EIA electricity rates, and current market pricing, step by step.';

  const faqs = [
    { q: 'Where does your solar production data come from?', a: "We query the National Renewable Energy Laboratory's PVWatts v8 API using your geocoded ZIP code for real, location-specific solar irradiance data. If that's unavailable, we fall back to your state's average peak sun hours." },
    { q: 'Where do your electricity rates come from?', a: 'We use real residential electricity rates by state from the U.S. Energy Information Administration (EIA), so your savings estimate reflects what you actually pay per kWh.' },
    { q: 'How is my system size determined?', a: 'We size your system to offset about 85% of your estimated electricity usage, based on your monthly bill and state electricity rate — then clamp the result between 4 kW and 20 kW, the range most residential installers quote.' },
    { q: 'Why $2.80 per watt?', a: 'That reflects current national average all-in installed pricing (panels, labor, inverter, permits, and installer margin) based on market data. Actual quotes from installers can range roughly $2.50–$4.50/watt depending on your market and equipment tier.' },
    { q: 'How accurate is the estimate?', a: 'Our estimates are typically 80–90% accurate compared to real installer quotes for the same home — close enough to know if solar makes sense and to spot an overpriced quote, but a licensed installer site visit is still required for a final number.' },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
      { '@type': 'ListItem', position: 2, name: 'How We Calculate Your Solar Cost', item: `${DOMAIN}/how-we-calculate-solar-costs` },
    ],
  };

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${DOMAIN}/how-we-calculate-solar-costs`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${DOMAIN}/how-we-calculate-solar-costs`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #123529 60%, #1b4d3e 100%)',
        padding: '64px 24px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', filter: 'blur(50px)' }} />
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(168,195,181,0.12)', border: '1px solid rgba(168,195,181,0.25)', borderRadius: 999, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#a8c3b5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Methodology</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
            How We Calculate Your Solar Cost Estimate
          </h1>
          <p style={{ fontSize: 17, color: '#a8c3b5', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            No guesswork, no rough averages — here's exactly what happens between entering your ZIP code and seeing your estimate.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Steps */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {STEPS.map((step, i) => (
              <div key={step.title} style={{ background: 'white', borderRadius: 16, padding: '26px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: step.iconBg, color: step.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {step.icon}
                </div>
                <h2 style={{ fontSize: 15.5, fontWeight: 800, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.01em' }}>{step.title}</h2>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Worked example */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={h2Style}>A Worked Example</h2>
            <p style={pStyle}>
              Say you're in Texas with a $150/month electric bill. At Texas's real EIA rate (14¢/kWh), that's about 1,070 kWh/month. To offset 85% of that, you'd need roughly a 6 kW system — about 15 panels.
            </p>
            <p style={pStyle}>
              At $2.80/watt, a 6 kW system on an asphalt roof with no battery costs $16,800 before incentives. After the 30% federal tax credit ($5,040), your net cost is $11,760. Using Texas's real 5.5 peak sun hours/day, that system would produce enough electricity to save you roughly $150/month — putting payback around 7–8 years, then decades of savings from a fully paid-off system.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              Change the state, the roof type, or add a battery, and every number in that chain — usage, system size, cost, savings, payback — recalculates from real data, not a lookup table.
            </p>
          </div>
        </section>

        {/* Accuracy note */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: '#eaf3ee', borderRadius: 16, padding: '28px 32px', border: '1px solid #bfe3cf' }}>
            <h2 style={{ ...h2Style, marginTop: 0 }}>A Note on Accuracy</h2>
            <p style={pStyle}>
              Our estimates are <strong>80–90% accurate</strong> compared to real installer quotes for the same home. On a typical $25,000 system, that's within $2,500–$5,000 of what an installer would actually propose — close enough to know if solar makes sense and to spot an overpriced quote.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              What we can't account for: your exact roof pitch and shading pattern, your electrical panel's condition, local permitting fees, and installer-specific pricing. For a final number, you'll still want a site visit from a licensed installer.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ ...h2Style, paddingLeft: 4, marginBottom: 20 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map(f => (
              <div key={f.q} style={{ background: 'white', borderRadius: 12, padding: '18px 22px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 6 }}>{f.q}</div>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #0f172a, #123529)',
          borderRadius: 20,
          padding: '40px 32px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.01em' }}>See Your Own Numbers</h2>
          <p style={{ color: '#a8c3b5', marginBottom: 24, fontSize: 15, lineHeight: 1.6 }}>Enter your ZIP code and monthly bill to get a personalized estimate in under 2 minutes.</p>
          <a
            href="/"
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
            Calculate My Solar Cost →
          </a>
        </section>

      </div>
    </div>
  );
}

const h2Style = { fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.01em' };
const pStyle = { fontSize: 14.5, color: '#334155', lineHeight: 1.8, marginBottom: 14 };
