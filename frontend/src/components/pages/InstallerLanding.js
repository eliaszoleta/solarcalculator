import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BoltIcon, MapPinIcon, SettingsIcon, CheckCircleIcon, StarIcon,
  ShieldIcon, TrendingDownIcon, SearchIcon, MailIcon, CodeIcon, LockIcon,
  SparklesIcon, DollarSignIcon, BuildingIcon,
} from '../ui/Icons';

const PRIMARY = '#1b4d3e';
const ACCENT = '#16a34a';

// Small local helpers so this page doesn't need a new icon-library
// dependency just for an arrow glyph and a quote mark — mirrors how
// cleanestimator's CompanyLanding.js keeps its own tiny Arrow() helper.
function Arrow({ size = 15 }) {
  return (
    <span className="il-arrow" style={{ display: 'inline-flex' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
    </span>
  );
}
function QuoteMark() {
  return <svg width={22} height={18} viewBox="0 0 24 18" fill="#dbeafe"><path d="M0 18V9.6C0 4.3 3.6.9 9.2 0l1 2.9C6.6 4 4.8 6 4.6 8.4H9V18H0zm13 0V9.6C13 4.3 16.6.9 22.2 0l1 2.9c-3.6 1.1-5.4 3.1-5.6 5.5H22V18h-9z" /></svg>;
}

// One plan, used internally by default, with a calculator widget for the
// installer's own website included for anyone who also wants public lead
// capture. Mirrors the "why go internal" pivot cleanestimator made with
// CompanyLanding.js: a public price range invites negotiation before the
// homeowner has even talked to a salesperson.
const PROBLEMS = [
  { Icon: TrendingDownIcon, color: '#dc2626', bg: '#fef2f2', title: 'Homeowners shop the low end', desc: 'Show someone "$18,000–$24,000 installed" and they\'ll anchor on $18,000 — even for a roof and shading situation that should price higher.' },
  { Icon: SearchIcon,       color: '#d97706', bg: '#fffbeb', title: 'A public price invites tire-kickers', desc: 'Visitors who were never going to buy will happily grab a number off your site and move on to the next installer\'s calculator.' },
  { Icon: ShieldIcon,       color: '#16a34a', bg: '#f0fdf4', title: 'Keep pricing power on your side', desc: 'Run the numbers yourself before a sales call, quote with confidence, and only show a figure when you decide to.' },
];

const FEATURES = [
  { Icon: BoltIcon,       color: '#7c3aed', bg: '#f5f3ff', title: 'Unlimited internal calculations', desc: 'Price as many jobs as you need, every month, with no per-estimate cost.' },
  { Icon: LockIcon,       color: '#1b4d3e', bg: '#eaf3ee', title: 'Instant result, nothing public',  desc: "See the number immediately on your own screen — it's never shown to a homeowner unless you choose to send it." },
  { Icon: MailIcon,       color: '#0d9488', bg: '#f0fdfa', title: 'Email a result to a customer',    desc: 'One click sends a specific estimate to a homeowner\'s inbox after your call — no shared logins, no public page.' },
  { Icon: MapPinIcon,     color: '#059669', bg: '#ecfdf5', title: 'Real NREL + EIA data',            desc: 'Every estimate pulls NREL PVWatts irradiance data for the exact ZIP code and EIA electricity rates for the state — not a flat national average.' },
  { Icon: SettingsIcon,   color: '#ea580c', bg: '#fff7ed', title: 'Your pricing, your margin',       desc: 'Set your own price per watt, roof surcharges, battery costs, and system size limits — every estimate reflects your real quote structure.' },
  { Icon: CodeIcon,       color: '#0891b2', bg: '#ecfeff', title: 'Calculator widget for your website', desc: 'Want public lead capture too? The same plan includes an embeddable, white-label calculator widget for your site — no upgrade required.' },
];

const STEPS = [
  { n: '1', Icon: SparklesIcon,  color: '#1b4d3e', bg: '#eaf3ee', title: 'Sign up',               desc: 'Create your account and start your 30-day free trial.' },
  { n: '2', Icon: SettingsIcon,  color: '#7c3aed', bg: '#f5f3ff', title: 'Set up your pricing',    desc: 'Add your price per watt, service area, battery costs, and company branding — accurate solar data is already built in.' },
  { n: '3', Icon: BoltIcon,      color: '#ea580c', bg: '#fff7ed', title: 'Run instant estimates',  desc: 'Get an accurate number the moment you need one — for your own quoting, not a public page.' },
  { n: '4', Icon: CodeIcon,      color: '#0891b2', bg: '#ecfeff', title: 'Embed it too, if you want', desc: "Want leads coming straight from your website? Paste the calculator widget's code on your site anytime — it's included." },
];

const TESTIMONIALS = [
  { name: 'Mike R.',    company: 'SunPoint Solar — Phoenix, AZ',     text: "We stopped showing homeowners a price range on the site. I run the numbers myself before every call and quote with confidence — no more haggling from the bottom of a range." },
  { name: 'Jenna T.',   company: 'Coastal Solar Co. — Charleston, SC', text: "We embedded it on our site too and it's generated real, pre-qualified leads every week. Conversion is way higher than our old 'Get a Quote' form because visitors already know their savings." },
  { name: 'Derek W.',   company: 'Highline Energy — Denver, CO',      text: "My sales reps run it on their phones during the first call and email the number over right after. Every rep quotes the exact same job the exact same way now — that never happened when pricing lived in a spreadsheet." },
];

const PLAN_FEATURES = [
  'Unlimited internal price calculations',
  'Instant result on screen — never a public price range',
  'Email a result to a customer in one click',
  'Real NREL + EIA data, your pricing & margin controls',
  'Calculator widget for your website, included whenever you want public lead capture',
  'Automatic lead capture + CSV export once it\'s on your site',
  'API access for CRM sync',
];

const TRUST_BADGES = [
  { Icon: ShieldIcon, text: '30-day free trial (card required)' },
  { Icon: BoltIcon,   text: 'First estimate in 2 minutes' },
  { Icon: CheckCircleIcon, text: 'Cancel anytime' },
];

const cardStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };

function FeatureIcon({ Icon, color, bg }) {
  return (
    <div className="il-feature-icon" style={{ width: 42, height: 42, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={19} color={color} />
    </div>
  );
}

// A static mock of the internal result card (not a real screenshot) — no
// browser-chrome wrapper around it, since that would imply a public website
// page when this is meant to read as the installer's own internal result.
function WidgetPreview() {
  return (
    <div className="il-float" style={{ position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', minHeight: 320, borderRadius: 16, overflow: 'hidden', background: `linear-gradient(135deg, ${PRIMARY}, #0f172a)`, boxShadow: '0 30px 70px -20px rgba(2,6,23,0.55), 0 8px 20px rgba(2,6,23,0.25)', padding: '28px 24px', color: 'white' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 10 }}>Solar Savings Estimate</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Save $187/mo</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 24 }}>installed cost $19,400 – $23,100 · 8 yr payback</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['30-Year Savings', '$64,200'], ['System Size', '8.2 kW'], ['Annual Savings', '$2,244'], ['Payback', '8 yrs']].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#86efac' }}>{val}</div>
              <div style={{ fontSize: 10.5, opacity: 0.7, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating "instant result" chip -- intentionally doesn't show a
          price, since the whole point of the internal Run an Estimate tab
          (now the primary pitch on this page) is that the number stays off
          any public-facing screen. */}
      <div style={{
        position: 'absolute', left: -18, bottom: -22, display: 'flex', alignItems: 'center', gap: 10,
        background: 'white', borderRadius: 12, padding: '11px 16px 11px 12px',
        boxShadow: '0 14px 32px -8px rgba(2,6,23,0.35)', border: '1px solid #f1f5f9',
      }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: '#eaf3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BoltIcon size={14} color={ACCENT} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Estimate ready</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#94a3b8' }}>
            <span className="il-pulse-dot" /> calculated in seconds &middot; yours alone
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstallerLanding() {
  return (
    <>
      <Helmet>
        <title>Internal Solar Pricing Tool for Solar Installers | Solar Cost Predictor</title>
        <meta name="description" content="An internal pricing tool for solar installers. Run unlimited accurate estimates instantly on screen — with a calculator widget for your website included if you also want public lead capture. $49/month, 30-day free trial." />
        <link rel="canonical" href="https://www.solarcostpredictor.com/for-installers" />
        <meta property="og:title" content="Internal Solar Pricing Tool for Solar Installers | Solar Cost Predictor" />
        <meta property="og:description" content="Price every job on your own screen before you ever show a homeowner a number. Calculator widget for your website included." />
        <meta property="og:url" content="https://www.solarcostpredictor.com/for-installers" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Solar Cost Predictor" />
        <meta property="og:image" content="https://www.solarcostpredictor.com/android-chrome-512x512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Internal Solar Pricing Tool for Solar Installers | Solar Cost Predictor" />
        <meta name="twitter:description" content="Price every job on your own screen before you ever show a homeowner a number." />
        <meta name="twitter:image" content="https://www.solarcostpredictor.com/android-chrome-512x512.png" />
      </Helmet>

      <div style={{ fontFamily: "'Poppins', 'Poppins Fallback', Arial, sans-serif", color: '#0f172a', overflowX: 'hidden' }}>
        <LandingNav />

        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, #0f172a 0%, #123529 60%, ${PRIMARY} 100%)`, padding: 'clamp(48px, 7vw, 80px) 24px', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -100, right: '6%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.14), transparent 70%)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: -120, left: '2%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(125,147,171,0.1), transparent 70%)', pointerEvents: 'none' }} />
          <div className="il-hero-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 56, alignItems: 'center', position: 'relative' }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,163,74,0.15)', color: '#86efac', padding: '6px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: '1px solid rgba(22,163,74,0.3)', marginBottom: 18 }}>
                <BuildingIcon size={12} />
                For solar installers
              </span>
              <h1 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em', color: 'white' }}>
                Price every job right<br />
                <span style={{ color: '#4ade80' }}>without tipping your hand</span>
              </h1>
              <p style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#a8c3b5', maxWidth: 480, marginBottom: 32, lineHeight: 1.65 }}>
                Solar Cost Predictor is an internal pricing tool for solar installers: unlimited, instant on-screen estimates built on real NREL production data and your own pricing — ready the second you click, no more guessing what to quote. Want a public-facing version for your website too? It's included — no separate plan to buy.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="/installer" className="il-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT, color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15.5, boxShadow: '0 10px 28px rgba(22,163,74,0.35)' }}>
                  Start Free Trial <Arrow />
                </a>
                <a href="#pricing" className="il-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15.5, border: '1px solid rgba(255,255,255,0.18)' }}>
                  See Pricing
                </a>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 20 }}>$49/mo after 30 days · Cancel anytime</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 480 }}>
                <WidgetPreview />
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '22px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px 40px' }}>
            {TRUST_BADGES.map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13.5, fontWeight: 600 }}>
                <Icon size={15} color={ACCENT} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Why go internal */}
        <div style={{ padding: 'clamp(40px, 9vw, 84px) 24px', maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <SectionLabel color="#dc2626" bg="#fef2f2" border="#fecaca"><LockIcon size={12} /> Why go internal</SectionLabel>
          </div>
          <h2 style={sectionTitle}>A public price range works against you</h2>
          <p style={sectionSub}>That's why more installers now run pricing internally instead of publishing a range on their site.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 'clamp(28px, 6vw, 52px)' }}>
            {PROBLEMS.map(({ Icon, color, bg, title, desc }) => (
              <div key={title} className="il-card" style={{ ...cardStyle, padding: '24px 22px' }}>
                <FeatureIcon Icon={Icon} color={color} bg={bg} />
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ background: '#f8fafc', padding: 'clamp(40px, 9vw, 84px) 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <h2 style={sectionTitle}>One accurate pricing engine, two ways to use it</h2>
            <p style={sectionSub}>Keep it internal, or put it on your website too — the calculations underneath are the same either way.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 'clamp(28px, 6vw, 52px)' }}>
              {FEATURES.map(({ Icon, color, bg, title, desc }) => (
                <div key={title} className="il-card" style={{ ...cardStyle, padding: '24px 22px' }}>
                  <FeatureIcon Icon={Icon} color={color} bg={bg} />
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ padding: 'clamp(40px, 9vw, 84px) 24px', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -80, right: '8%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.08), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <SectionLabel color={PRIMARY} bg="#eaf3ee" border="rgba(27,77,62,0.2)"><SparklesIcon size={12} /> Simple onboarding</SectionLabel>
            </div>
            <h2 style={sectionTitle}>Start quoting in minutes</h2>
            <p style={sectionSub}>Four steps, no developer required — run your first estimate right after signup, then customize your branding and embed the widget on your site whenever you want.</p>
            <div className="il-steps-grid" style={{ marginTop: 'clamp(28px, 6vw, 52px)' }}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className="il-card" style={{ ...cardStyle, padding: '26px 22px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: ACCENT }} />
                    <div style={{ position: 'relative', width: 42, height: 42, marginBottom: 16 }}>
                      <div className="il-feature-icon" style={{ width: 42, height: 42, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <s.Icon size={19} color={s.color} />
                      </div>
                      <div className="il-step-badge" style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: ACCENT, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, border: '2px solid white', boxShadow: '0 1px 3px rgba(15,23,42,0.15)' }}>{s.n}</div>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 15.5, color: '#0f172a', marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && <div className="il-step-arrow" aria-hidden="true"><Arrow size={18} /></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: 'clamp(40px, 9vw, 84px) 24px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <h2 style={{ ...sectionTitle, marginBottom: 'clamp(24px, 5vw, 44px)' }}>What solar installers say</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="il-card" style={{ ...cardStyle, padding: '24px 22px' }}>
                  <div style={{ marginBottom: 10 }}><QuoteMark /></div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                    {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={14} color="#f59e0b" />)}
                  </div>
                  <p style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.7, marginBottom: 18 }}>{t.text}</p>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{t.company}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing + closing CTA */}
        <div id="pricing" style={{ padding: 'clamp(40px, 9vw, 84px) 24px', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -60, left: '4%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.07), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 56, alignItems: 'center', position: 'relative' }}>
            <div>
              <SectionLabel color={PRIMARY} bg="#eaf3ee" border="rgba(27,77,62,0.2)"><DollarSignIcon size={12} /> Pricing</SectionLabel>
              <h2 style={{ ...sectionTitle, textAlign: 'left', margin: '16px 0 14px' }}>Simple, transparent pricing</h2>
              <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.65, marginBottom: 28, maxWidth: 400 }}>
                One plan, everything included, no surprises. Run it as your internal pricing tool from day one, or add it as a calculator widget on your website whenever you're ready, at no extra cost.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, maxWidth: 420 }}>
                {TRUST_BADGES.map(({ Icon, text }) => (
                  <div key={text} className="il-card" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 11, padding: '12px 14px' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={ACCENT} />
                    </div>
                    <span style={{ color: '#334155', fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="il-card" style={{ ...cardStyle, borderRadius: 14, padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${ACCENT}, #4ade80)` }} />
              <div style={{ padding: '30px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <LockIcon size={16} color={PRIMARY} />
                  <span style={{ fontWeight: 800, fontSize: 16.5, color: '#0f172a' }}>Internal Estimator</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px' }}>$49</span>
                  <span style={{ fontSize: 14, color: '#64748b' }}>/month</span>
                </div>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 22 }}>After your 30-day free trial &middot; cancel anytime</div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, textAlign: 'left' }}>
                  {PLAN_FEATURES.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 10, fontSize: 14, color: '#374151', lineHeight: 1.4 }}>
                      <span style={{ width: 17, height: 17, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="/installer" className="il-btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: ACCENT, color: 'white', padding: '13px 0', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                  Start Free Trial <Arrow />
                </a>
                <div style={{ color: '#94a3b8', fontSize: 11.5, textAlign: 'center', marginTop: 10 }}>
                  Card required to start — you won't be charged for 30 days.
                </div>
              </div>
            </div>
          </div>
        </div>

        <LandingFooter />
      </div>

      <style>{`
        .il-hero-grid { grid-template-columns: minmax(320px, 1fr) minmax(400px, 480px); }
        @media (max-width: 900px) { .il-hero-grid { grid-template-columns: 1fr; } }
        .il-steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; align-items: stretch; }
        .il-step-arrow { display: none; }
        @media (min-width: 900px) {
          .il-steps-grid { grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; }
          .il-step-arrow { display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
        }
        .il-card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .il-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -10px rgba(15,23,42,0.16); border-color: #bbf7d0; }
        .il-feature-icon { transition: transform 0.2s ease; }
        .il-card:hover .il-feature-icon { transform: scale(1.08) rotate(-2deg); }
        .il-step-badge { transition: background 0.2s ease, color 0.2s ease; }
        .il-btn-primary, .il-btn-secondary { transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; }
        .il-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(22,163,74,0.4); }
        .il-btn-secondary:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }
        .il-arrow { transition: transform 0.15s ease; }
        .il-btn-primary:hover .il-arrow, .il-btn-secondary:hover .il-arrow { transform: translateX(3px); }
        @keyframes il-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .il-float { animation: il-float 5s ease-in-out infinite; }
        @keyframes il-pulse-ring { 0% { transform: scale(0.9); opacity: 0.6; } 70%, 100% { transform: scale(2.1); opacity: 0; } }
        .il-pulse-dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; flex-shrink: 0; }
        .il-pulse-dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: ${ACCENT}; animation: il-pulse-ring 1.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .il-float, .il-pulse-dot::after { animation: none; }
          .il-card, .il-btn-primary, .il-btn-secondary, .il-feature-icon, .il-step-badge, .il-arrow { transition: none; }
        }
      `}</style>
    </>
  );
}

/* ─── Nav ─────────────────────────────────────────────── */
function LandingNav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 16px', height: 64,
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 1, minWidth: 0, overflow: 'hidden' }}>
          <img src="/logo-icon-navy.svg" alt="" style={{ height: 40, width: 40, borderRadius: 10, flexShrink: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Solar Cost <span style={{ color: ACCENT }}>Predictor</span></span>
        </a>
        <a href="/installer" style={{
          fontSize: 14, color: PRIMARY, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
          padding: '8px 18px', border: `1.5px solid ${PRIMARY}`, borderRadius: 8,
          transition: 'background 0.15s, color 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = PRIMARY; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PRIMARY; }}
        >
          Log in
        </a>
      </div>
    </nav>
  );
}

/* ─── Footer ──────────────────────────────────────────── */
function LandingFooter() {
  return (
    <footer style={{ background: '#0f172a', padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
        <img src="/logo-icon-navy.svg" alt="" style={{ height: 38, width: 38, borderRadius: 10, flexShrink: 0 }} />
        <span style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>Solar Cost <span style={{ color: '#4ade80' }}>Predictor</span></span>
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <a href="/" style={footerLink}>Home</a>
        <a href="/blog" style={footerLink}>Blog</a>
        <a href="/installer" style={footerLink}>Installer Login</a>
      </div>
      <p style={{ fontSize: 12, color: '#475569' }}>
        © {new Date().getFullYear()} Solar Cost Predictor. Solar production data powered by NREL PVWatts.
      </p>
    </footer>
  );
}

/* ─── Shared helpers ──────────────────────────────────── */
function SectionLabel({ children, color, bg, border }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      color, background: bg, border: `1px solid ${border}`,
      borderRadius: 999, padding: '4px 12px', marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

const sectionTitle = {
  fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, textAlign: 'center', color: '#0f172a',
  marginBottom: 10, letterSpacing: '-0.4px',
};

const sectionSub = {
  textAlign: 'center', color: '#64748b', fontSize: 16, maxWidth: 640, margin: '0 auto',
};

const footerLink = { fontSize: 13, color: '#64748b', textDecoration: 'none' };
