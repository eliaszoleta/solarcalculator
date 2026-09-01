import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BoltIcon, SunIcon, RulerIcon, DollarSignIcon, CategoryIcon, getCategoryColors } from './Icons';
import { CATEGORIES } from '../../data/blogPosts';
import { getAllFaqs } from '../../data/faqs';
import { getFeaturedStates } from '../../data/statePricing';

function formatPrice(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function SEOContent() {
  const faqs = getAllFaqs();
  const featuredStates = getFeaturedStates();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div style={{ background: '#ffffff' }}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '96px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#92400e', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '4px 14px', marginBottom: 20 }}>
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em', marginBottom: 14 }}>
              Built on real data. Not guesses.
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              We use the same formulas solar installers use — powered by real sunlight data and current electricity rates.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
            {[
              { icon: <BoltIcon size={22} />, iconBg: '#fef3c7', iconColor: '#d97706', title: 'Your Electric Bill', desc: 'We calculate exactly how much electricity your home uses based on your monthly bill and your state\'s electricity rate.' },
              { icon: <SunIcon size={22} />, iconBg: '#fef9c3', iconColor: '#ca8a04', title: 'Sunlight Data', desc: 'Enter your ZIP code and we pull real irradiance data from the NREL PVWatts API for your exact location.' },
              { icon: <RulerIcon size={22} />, iconBg: '#e2e7ed', iconColor: '#1c3a5e', title: 'System Sizing', desc: 'We recommend the ideal system size to offset your usage, then calculate the real installation cost based on current market rates.' },
              { icon: <DollarSignIcon size={22} />, iconBg: '#dcfce7', iconColor: '#16a34a', title: 'Savings Projection', desc: 'We project 30 years of savings accounting for 4% annual utility rate increases, tax credits, and your financing options.' },
            ].map((item, i) => (
              <div key={item.title} style={{ padding: '28px 24px', background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', transition: 'box-shadow 0.15s', position: 'relative' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#d1d5db', letterSpacing: '0.08em', marginBottom: 20 }}>0{i + 1}</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, letterSpacing: '-0.02em' }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/how-we-calculate-solar-costs" style={{ fontSize: 14, fontWeight: 700, color: '#1c3a5e', textDecoration: 'none' }}>
              See the full methodology, step by step →
            </a>
          </div>
        </div>
      </section>

      {/* Average Costs by State */}
      <section style={{ padding: '80px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 10, letterSpacing: '-0.025em' }}>
            Solar Installation Cost by State (2026)
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15 }}>
            Our installed price per watt is the same nationwide — what actually changes by state is your electricity rate and sun hours, which change how big a system you need. That's why a state with expensive electricity (like California) often needs a <em>smaller</em>, cheaper system to offset the same bill than a state with cheap electricity. For a $150/month bill:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {featuredStates.map(s => (
              <a key={s.code} href={`/solar-cost/${s.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#ffffff', padding: '16px 18px', borderRadius: 14, border: '1px solid #e2e8f0', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ fontWeight: 700, color: '#0a0a0a', marginBottom: 4, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: '#1c3a5e', fontWeight: 600 }}>{formatPrice(s.estimate.netCostLow)}–{formatPrice(s.estimate.netCostHigh)}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{s.estimate.systemSizeKw} kW system · {s.estimate.paybackYears}-yr payback</div>
                </div>
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
            *Net cost after the federal 30% Investment Tax Credit, for a representative $150/month bill, full sun exposure, asphalt roof, no battery. Your actual system size, cost, and payback depend on your real usage, roof, and location — use our calculator above for a personalized estimate.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '96px 24px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 48, letterSpacing: '-0.03em' }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
        </div>
      </section>

      {/* Solar Financing Options */}
      <section style={{ padding: '80px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 10, letterSpacing: '-0.025em' }}>
            Solar Financing Options: How to Pay for Solar Panels
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15, maxWidth: 640 }}>
            Most US homeowners choose to finance their residential solar installation rather than pay cash. Here are the four main options and how they compare.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
            {[
              {
                title: 'Cash Purchase',
                tag: 'Best overall savings',
                tagColor: '#16a34a', tagBg: '#dcfce7',
                desc: 'Pay upfront, own the system outright. You keep the full 30% federal tax credit and all electricity savings. Typical payback: 7–10 years, then free electricity for 15+ years.',
              },
              {
                title: 'Solar Loan',
                tag: 'Most popular',
                tagColor: '#1c3a5e', tagBg: '#e2e7ed',
                desc: 'Borrow to buy. You own the system and keep the ITC. Terms run 5–20 years at 4–8% APR. Monthly loan payment is typically less than your current electric bill.',
              },
              {
                title: 'Solar Lease',
                tag: '$0 down',
                tagColor: '#d97706', tagBg: '#fef3c7',
                desc: 'Rent the solar panels from a company. No upfront cost, predictable monthly payments. You do not own the system and do not receive the federal tax credit.',
              },
              {
                title: 'Solar PPA',
                tag: 'Pay per kWh',
                tagColor: '#9333ea', tagBg: '#f3e8ff',
                desc: 'Power Purchase Agreement — you pay only for the electricity the panels produce, often at a rate below your utility. No ownership, no maintenance costs.',
              },
            ].map(item => (
              <div key={item.title} style={{ background: '#ffffff', padding: '20px 18px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: item.tagColor, background: item.tagBg, borderRadius: 20, padding: '3px 10px', marginBottom: 12 }}>{item.tag}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0a0a0a', marginBottom: 8 }}>{item.title}</div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar Incentives */}
      <section style={{ padding: '80px 24px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 10, letterSpacing: '-0.025em' }}>
            Solar Incentives &amp; Tax Credits in 2026
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15, maxWidth: 640 }}>
            Federal and state solar incentives can cut your installation cost by 30–50%. Here are the key programs available to US homeowners in 2026.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {[
              {
                title: '30% Federal Solar Tax Credit (ITC)',
                desc: 'The Investment Tax Credit lets you deduct 30% of your total solar installation cost from your federal income taxes. For a $20,000 system, that\'s a $6,000 credit. Applies to systems installed through 2032.',
                color: '#1c3a5e', bg: '#eef1f5',
              },
              {
                title: 'Net Metering',
                desc: 'Most states require utilities to credit you for excess solar power you send to the grid. Full retail net metering (credit = what you pay per kWh) maximizes your return. Check your state\'s policy.',
                color: '#16a34a', bg: '#f0fdf4',
              },
              {
                title: 'State & Utility Rebates',
                desc: 'Many states add their own incentives: NY-Sun (New York), SMART (Massachusetts), SGIP battery rebates (California), Xcel Solar Rewards (Colorado), and more. Stack with the federal ITC for maximum savings.',
                color: '#d97706', bg: '#fffbeb',
              },
              {
                title: 'Property & Sales Tax Exemptions',
                desc: 'Over 30 states exempt the added home value from solar from property taxes. Florida, Texas, Arizona, and New York also offer full sales tax exemptions on solar equipment purchases.',
                color: '#9333ea', bg: '#faf5ff',
              },
            ].map(item => (
              <div key={item.title} style={{ background: item.bg, padding: '20px 18px', borderRadius: 14, border: `1px solid ${item.color}22` }}>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: item.color, marginBottom: 8 }}>{item.title}</div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20 }}>
            *Our solar savings calculator automatically includes the 30% ITC in all cost estimates. State incentives vary — consult a local installer for exact amounts.
          </p>
        </div>
      </section>

      {/* Key Features for Businesses */}
      <section style={{ padding: '80px 24px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0a0a0a', marginBottom: 10, letterSpacing: '-0.025em' }}>
            Key Features for Businesses
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15, maxWidth: 640 }}>
            Solar installers can grow their pipeline with Solar Cost Predictor in two ways — get exclusive local leads, or put our calculator on your own site.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              {
                title: 'Local Partner Program',
                desc: 'Exclusive, one-installer-per-city placement on every solar estimate result for homeowners in your service area — $350/month per city.',
                href: '/partner-with-us',
                cta: 'Become a Partner',
              },
              {
                title: 'Website Integration',
                desc: 'Embed the branded solar calculator widget on your own installer website to capture leads directly — $159/month after a 7-day free trial.',
                href: '/for-installers',
                cta: 'Embed the Widget',
              },
              {
                title: 'No Signup Needed for Homeowners',
                desc: 'Homeowners get an instant, accurate solar cost and savings estimate with no account, email, or phone number required — reducing friction and increasing lead quality for you.',
                href: '/',
                cta: 'Try the Calculator',
              },
            ].map(item => (
              <div key={item.title} style={{ background: '#f8fafc', padding: '24px 22px', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#0a0a0a', marginBottom: 10 }}>{item.title}</div>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, margin: '0 0 16px' }}>{item.desc}</p>
                <a href={item.href} style={{ fontSize: 13.5, fontWeight: 700, color: '#1c3a5e', textDecoration: 'none' }}>{item.cta} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section style={{ padding: '96px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em', marginBottom: 12 }}>
              Browse by Category
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
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
    <div style={{ borderBottom: '1px solid #f1f5f9' }}>
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
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: open ? '#0a0a0a' : '#f1f5f9', color: open ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, lineHeight: 1, transition: 'all 0.2s' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, paddingBottom: 18 }}>{a}</p>
      )}
    </div>
  );
}
