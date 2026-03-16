import React from 'react';

export default function SEOContent() {
  return (
    <div style={{ background: 'white' }}>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '64px 24px', maxWidth: 840, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 12 }}>
          How Our Solar Calculator Works
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          We use the same formulas solar installers use — powered by real sunlight data and current electricity rates.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {[
            { icon: '⚡', title: 'Your Electric Bill', desc: 'We calculate exactly how much electricity your home uses based on your monthly bill and your state\'s electricity rate.' },
            { icon: '🌞', title: 'Sunlight Data', desc: 'Enter your ZIP code and we pull real irradiance data from the NREL PVWatts API for your exact location. Without a ZIP, we use NREL peak sun hour averages by state.' },
            { icon: '📐', title: 'System Sizing', desc: 'We recommend the ideal system size to offset your usage, then calculate the real installation cost based on current market rates.' },
            { icon: '💰', title: 'Savings Projection', desc: 'We project 30 years of savings accounting for 4% annual utility rate increases, tax credits, and your financing options.' },
          ].map(item => (
            <div key={item.title} style={{ padding: 24, background: '#f8fafc', borderRadius: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Average Costs by State */}
      <section style={{ padding: '64px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            Solar Installation Cost by State (2025)
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32 }}>
            Solar installation costs vary significantly by state due to labor costs, electricity rates, and local incentives. Here are average costs for popular solar states.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { state: 'California', cost: '$19,000–$25,000', rate: '$0.32/kWh', saving: 'High savings' },
              { state: 'Texas', cost: '$14,000–$20,000', rate: '$0.14/kWh', saving: 'Great solar' },
              { state: 'Florida', cost: '$15,000–$21,000', rate: '$0.145/kWh', saving: 'No state tax' },
              { state: 'Arizona', cost: '$14,000–$19,000', rate: '$0.13/kWh', saving: 'Most sun hours' },
              { state: 'Nevada', cost: '$14,000–$20,000', rate: '$0.12/kWh', saving: 'State rebates' },
              { state: 'New York', cost: '$17,000–$24,000', rate: '$0.22/kWh', saving: 'NY-Sun program' },
            ].map(item => (
              <div key={item.state} style={{ background: 'white', padding: '16px 18px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{item.state}</div>
                <div style={{ fontSize: 13, color: '#1e40af', fontWeight: 600 }}>{item.cost}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.rate} • {item.saving}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
            *After federal 30% Investment Tax Credit. Costs vary by system size, roof type, and installer. Use our calculator above for a personalized estimate.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '64px 24px', maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 40 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            {
              q: 'How accurate is this solar calculator?',
              a: 'Our estimates are within 10–20% of real installer quotes for most homes. When you enter a ZIP code, we use real irradiance data from the NREL PVWatts API for your exact location, which improves accuracy to roughly 10–15%. Without a ZIP we use NREL state averages (15–20% range). We also use EIA electricity rates by state and current market installation costs ($2.50–$3.50/watt). For an exact price, you\'ll still need a site visit from a certified installer.',
            },
            {
              q: 'How much does solar save on average?',
              a: 'The average US homeowner saves $1,000–$1,500 per year with solar. Over 25 years, that\'s $25,000–$40,000 in savings. The exact amount depends on your electricity rate, sunlight hours, and system size.',
            },
            {
              q: 'What is the 30% federal solar tax credit?',
              a: 'The Investment Tax Credit (ITC) lets you deduct 30% of your total solar installation cost from your federal income taxes. For a $20,000 system, you\'d get a $6,000 tax credit, reducing your net cost to $14,000. This applies to systems installed through 2032.',
            },
            {
              q: 'How long does it take for solar to pay itself off?',
              a: 'The average payback period in the US is 7–12 years depending on your state, electricity rate, and system cost. After payback, all solar production is essentially free electricity.',
            },
            {
              q: 'Do I need a battery for solar panels?',
              a: 'Most grid-tied solar systems don\'t require a battery. Without one, your home uses solar during the day and draws from the grid at night. A battery like the Tesla Powerwall ($10,000–$14,000 installed) adds backup power during outages and maximizes self-consumption.',
            },
            {
              q: 'How many solar panels does an average home need?',
              a: 'A typical US home using 10,000 kWh per year needs a 6–9 kW solar system, which is roughly 15–22 panels (400W each). Our calculator automatically sizes the system for your specific usage and location.',
            },
            {
              q: 'Does my roof need to face south for solar?',
              a: 'South-facing roofs are ideal, but east or west-facing roofs still produce 80–85% of a south-facing system\'s output. North-facing roofs are not ideal. Our calculator accounts for shading loss in the "roof sun exposure" step.',
            },
          ].map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '18px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{q}</span>
        <span style={{ fontSize: 20, color: '#94a3b8', flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingBottom: 18 }}>{a}</p>
      )}
    </div>
  );
}
