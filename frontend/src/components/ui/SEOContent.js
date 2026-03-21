import React from 'react';
import { BoltIcon, SunIcon, RulerIcon, DollarSignIcon, CategoryIcon, getCategoryColors } from './Icons';
import { CATEGORIES } from '../../data/blogPosts';

export default function SEOContent() {
  return (
    <div style={{ background: '#ffffff' }}>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '96px 24px', background: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#92400e', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '4px 14px', marginBottom: 20 }}>
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em', marginBottom: 14 }}>
              Built on real data. Not guesses.
            </h2>
            <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              We use the same formulas solar installers use — powered by real sunlight data and current electricity rates.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
            {[
              { icon: <BoltIcon size={22} />, iconBg: '#fef3c7', iconColor: '#d97706', title: 'Your Electric Bill', desc: 'We calculate exactly how much electricity your home uses based on your monthly bill and your state\'s electricity rate.' },
              { icon: <SunIcon size={22} />, iconBg: '#fef9c3', iconColor: '#ca8a04', title: 'Sunlight Data', desc: 'Enter your ZIP code and we pull real irradiance data from the NREL PVWatts API for your exact location.' },
              { icon: <RulerIcon size={22} />, iconBg: '#dbeafe', iconColor: '#2563eb', title: 'System Sizing', desc: 'We recommend the ideal system size to offset your usage, then calculate the real installation cost based on current market rates.' },
              { icon: <DollarSignIcon size={22} />, iconBg: '#dcfce7', iconColor: '#16a34a', title: 'Savings Projection', desc: 'We project 30 years of savings accounting for 4% annual utility rate increases, tax credits, and your financing options.' },
            ].map((item, i) => (
              <div key={item.title} style={{ padding: '28px 24px', background: '#ffffff', borderRadius: 18, border: '1px solid #e5e7eb', transition: 'box-shadow 0.15s', position: 'relative' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#d1d5db', letterSpacing: '0.08em', marginBottom: 20 }}>0{i + 1}</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, letterSpacing: '-0.02em' }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Average Costs by State */}
      <section style={{ padding: '80px 24px', background: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 10, letterSpacing: '-0.025em' }}>
            Solar Installation Cost by State (2026)
          </h2>
          <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 15 }}>
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
              <div key={item.state} style={{ background: '#ffffff', padding: '16px 18px', borderRadius: 14, border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 700, color: '#0a0a0a', marginBottom: 4, fontSize: 14 }}>{item.state}</div>
                <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>{item.cost}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{item.rate} · {item.saving}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
            *After federal 30% Investment Tax Credit. Costs vary by system size, roof type, and installer. Use our calculator above for a personalized estimate.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '96px 24px', background: '#ffffff', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 48, letterSpacing: '-0.03em' }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            {
              q: 'How accurate is this solar calculator?',
              a: 'Our estimates are 80–90% accurate compared to real installer quotes. On a typical $25,000 system, that means your estimate is within $2,500–$5,000 of what an installer would actually propose — close enough to know whether solar makes financial sense and to spot an overpriced quote. We use real irradiance data from the NREL PVWatts API for your exact ZIP code, EIA electricity rates by state, and current market installation costs ($2.50–$3.50/watt). For a final price, you\'ll still need a site visit from a certified installer.',
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
        </div>
      </section>

      {/* Browse by Category */}
      <section style={{ padding: '96px 24px', background: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em', marginBottom: 12 }}>
              Browse by Category
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              Explore our solar guides by topic — from costs and financing to installation and savings.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(c => {
              const colors = getCategoryColors(c.slug);
              return (
                <a
                  key={c.slug}
                  href={`/blog/category/${c.slug}`}
                  style={{
                    borderRadius: 16,
                    padding: 22,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: colors.bg,
                    border: `1.5px solid ${colors.border}`,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: colors.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CategoryIcon slug={c.slug} size={24} color={colors.iconColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.01em' }}>{c.label}</div>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55, margin: 0 }}>{c.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{q}</span>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: open ? '#0a0a0a' : '#f3f4f6', color: open ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, lineHeight: 1, transition: 'all 0.2s' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingBottom: 18 }}>{a}</p>
      )}
    </div>
  );
}
