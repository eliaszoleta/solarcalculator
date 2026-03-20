import React, { useState } from 'react';

export default function InstallerLanding() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#0f172a', overflowX: 'hidden' }}>
      <LandingNav />
      <Hero />
      <LogoBar />
      <HowItWorks />
      <Features />
      <AccuracySection />
      <CalculatorPreview />
      <WhatItDoesForYou />
      <Pricing />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}

/* ─── Nav ─────────────────────────────────────────────── */
function LandingNav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: 64,
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="/android-chrome-192x192.png" alt="MySolarWidget" style={{ width: 38, height: 38, borderRadius: 8 }} />
        <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
          MySolar<span style={{ color: '#f59e0b' }}>Widget</span>
        </span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/installer" style={{ fontSize: 14, color: '#64748b', fontWeight: 500, textDecoration: 'none' }}>
          Log in
        </a>
        <a href="/installer" style={ctaBtn}>
          Start Free Trial
        </a>
      </div>
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)',
      padding: '96px 24px 80px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blur orbs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(60px)' }} />

      <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 28,
        }}>
          <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 600 }}>For Solar Installers</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
          Give every homeowner<br />
          <span style={{ color: '#f59e0b' }}>an instant solar estimate</span><br />
          on your website
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: '#93c5fd', lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
          Embed a fully branded, real-data solar savings calculator on your site in minutes.
          Capture leads automatically — no developer needed.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/installer" style={{
            padding: '16px 36px', background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: 'white', borderRadius: 12, fontWeight: 800, fontSize: 17,
            textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
            transition: 'transform 0.15s',
          }}>
            Start 30-Day Free Trial →
          </a>
          <a href="#how-it-works" style={{
            padding: '16px 28px', background: 'rgba(255,255,255,0.1)',
            color: 'white', borderRadius: 12, fontWeight: 600, fontSize: 16,
            textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)',
          }}>
            See how it works
          </a>
        </div>

        <p style={{ fontSize: 13, color: '#64748b', marginTop: 20 }}>
          No credit card required. 30-day free trial.
        </p>
      </div>
    </section>
  );
}

/* ─── Logo bar ────────────────────────────────────────── */
function LogoBar() {
  const stats = [
    { value: '< 2 min', label: 'Setup time' },
    { value: 'NREL', label: 'Powered by real solar data' },
    { value: '±10%', label: 'Margin vs. real installer quotes' },
    { value: '30 days', label: 'Free trial' },
  ];
  return (
    <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '28px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1e40af' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── How It Works ────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: '📋',
      title: 'Create your account',
      desc: 'Sign up in 60 seconds. Set your pricing per watt, service area, battery costs, and company branding — all from a simple dashboard.',
    },
    {
      num: '02',
      icon: '🔗',
      title: 'Paste one line of code',
      desc: 'Copy the embed snippet from your dashboard and paste it anywhere on your website. The calculator appears instantly, fully branded to your business.',
    },
    {
      num: '03',
      icon: '📊',
      title: 'Receive qualified leads',
      desc: 'Every homeowner who completes the calculator submits their name, email, phone, timeline, and payment preference — sent straight to your leads dashboard.',
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: '96px 24px', background: 'white' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionLabel>How It Works</SectionLabel>
        <h2 style={sectionTitle}>From signup to live on your site in minutes</h2>
        <p style={sectionSub}>No developers. No complex setup. Just copy, paste, and watch leads come in.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginTop: 56 }}>
          {steps.map(s => (
            <div key={s.num} style={{ position: 'relative' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#1e40af', letterSpacing: '0.1em', marginBottom: 16, opacity: 0.5 }}>STEP {s.num}</div>
              <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: '🎨',
      title: 'Fully white-labeled',
      desc: 'Your company name, your colors, your CTA. Homeowners see your brand — not ours. Customize the headline, subtext, phone number, and button that appear after the estimate.',
    },
    {
      icon: '💰',
      title: 'Your pricing, your margin',
      desc: 'Set your own price per watt ($2.50–$4.00 typical), roof surcharges for tile/metal/flat, battery costs, and system size limits. Every estimate reflects your real quote structure.',
    },
    {
      icon: '📍',
      title: 'Service area control',
      desc: "Restrict the calculator to your service states. Homeowners outside your area are told you don't serve their location — so you only get leads you can actually close.",
    },
    {
      icon: '🔋',
      title: 'Battery storage options',
      desc: 'Let homeowners compare estimates with no battery, one Powerwall, or two. Configure your exact installed battery costs so estimates match your actual proposals.',
    },
    {
      icon: '📊',
      title: 'Live leads dashboard',
      desc: 'Every lead — name, email, phone, system size, annual savings, payment preference, and timeline — appears in your dashboard the moment someone submits the calculator.',
    },
    {
      icon: '📐',
      title: 'Auto-resizing iframe',
      desc: 'The embedded calculator automatically resizes to fit its content on any device. No scrollbars, no fixed heights to maintain. Just drop it in and it works.',
    },
  ];

  return (
    <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionLabel>Features</SectionLabel>
        <h2 style={sectionTitle}>Everything you need. Nothing you don't.</h2>
        <p style={sectionSub}>Built specifically for solar installers who want leads — not a full CRM.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 56 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'white', borderRadius: 16, padding: '28px 24px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Accuracy / How calculation works ───────────────── */
function AccuracySection() {
  const items = [
    {
      icon: '☀️',
      title: 'Real irradiance data from NREL',
      desc: 'When a homeowner enters their ZIP code, the calculator calls the NREL PVWatts API — the same dataset used by the US Department of Energy — to get precise solar production estimates for their exact location.',
    },
    {
      icon: '⚡',
      title: 'EIA electricity rates by state',
      desc: 'Monthly bills are converted to kWh usage using the US Energy Information Administration\'s latest average electricity rates by state — not guesses.',
    },
    {
      icon: '🏠',
      title: 'Right-sized for each home',
      desc: 'The calculator targets 85% energy offset, accounting for roof type, sun exposure, shading, and your min/max system size settings. Panel count is calculated at 400W per panel.',
    },
    {
      icon: '📉',
      title: '30-year savings projection',
      desc: 'Savings are modeled at a 4%/year utility rate increase — a conservative assumption based on the historical EIA trend. Financed estimates include a 25-year loan at 5.99% APR as a reference point.',
    },
  ];

  return (
    <section style={{ padding: '96px 24px', background: 'white' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionLabel>Accuracy</SectionLabel>
        <h2 style={sectionTitle}>Estimates homeowners can trust</h2>
        <p style={sectionSub}>
          Our estimates consistently land <strong>within 10–15% of what installers actually quote</strong> for the same home — tight enough to set real expectations, and compelling enough to get homeowners to pick up the phone.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, marginTop: 52 }}>
          {items.map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: '#eff6ff', borderRadius: 16, padding: '24px 28px', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: 14, color: '#1e40af', lineHeight: 1.7, margin: 0 }}>
            <strong>Why not 100% accurate?</strong> A precise quote requires a roof inspection, shading analysis, and utility interconnection review that only a site visit can provide. The calculator's job is to give homeowners a confident starting point — and give you a warm, pre-qualified lead who already understands solar's value before they speak to you.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Calculator preview steps ───────────────────────── */
function CalculatorPreview() {
  const steps = [
    { icon: '⚡', label: 'Monthly electric bill' },
    { icon: '📍', label: 'ZIP code & state' },
    { icon: '🏠', label: 'Home type & ownership' },
    { icon: '🏗', label: 'Roof type & sun exposure' },
    { icon: '🔋', label: 'Battery storage preference' },
    { icon: '💳', label: 'Timeline & payment method' },
  ];

  return (
    <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel light>The Calculator Experience</SectionLabel>
        <h2 style={{ ...sectionTitle, color: 'white', marginBottom: 12 }}>6 questions. Instant results.</h2>
        <p style={{ ...sectionSub, color: '#93c5fd', marginBottom: 56, margin: '0 auto 56px' }}>
          Homeowners complete the flow in under 2 minutes — then see a full savings breakdown with 30-year projection, before submitting their contact info to you.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 48 }}>
          {steps.map((s, i) => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 50, padding: '10px 18px',
            }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{i + 1}. {s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 560, margin: '0 auto' }}>
          {[
            { label: 'Monthly savings', example: '$187/mo' },
            { label: '30-year savings', example: '$68,400' },
            { label: 'System size', example: '8.2 kW' },
            { label: 'Payback period', example: '8 years' },
          ].map(r => (
            <div key={r.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#f59e0b' }}>{r.example}</div>
              <div style={{ fontSize: 12, color: '#93c5fd', marginTop: 4 }}>{r.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#475569', marginTop: 16 }}>Example output — results vary by location and usage</p>
      </div>
    </section>
  );
}

/* ─── What it does for your business ─────────────────── */
function WhatItDoesForYou() {
  const benefits = [
    {
      title: 'Turn cold website traffic into warm leads',
      desc: 'Visitors who use your calculator already know their savings potential before they talk to you. They\'re not asking "is solar worth it?" — they\'re asking "when can you come out?"',
      stat: '3–5×',
      statLabel: 'higher conversion vs. generic contact forms',
    },
    {
      title: 'Pre-qualify leads automatically',
      desc: 'You know their bill, their roof type, their timeline, and how they want to pay — before the first call. No time wasted on renters, apartments, or people "just curious."',
      stat: '100%',
      statLabel: 'of leads are homeowners who want solar',
    },
    {
      title: 'Build trust before the sales call',
      desc: 'A branded solar calculator signals expertise. Homeowners who see real data on your site trust you more than competitors with just a "Get a Quote" form.',
      stat: '< 2 min',
      statLabel: 'average time to complete',
    },
  ];

  return (
    <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionLabel>Business Impact</SectionLabel>
        <h2 style={sectionTitle}>What it actually does for your pipeline</h2>
        <p style={sectionSub}>More than a widget — a 24/7 lead qualification machine for your solar business.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 52 }}>
          {benefits.map(b => (
            <div key={b.title} style={{
              background: 'white', borderRadius: 18, padding: '32px 36px',
              border: '1px solid #e2e8f0',
              display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{b.desc}</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: 140 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#1e40af' }}>{b.stat}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, maxWidth: 130 }}>{b.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─────────────────────────────────────────── */
function Pricing() {
  return (
    <section id="pricing" style={{ padding: '96px 24px', background: 'white' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel>Pricing</SectionLabel>
        <h2 style={sectionTitle}>Simple, transparent pricing</h2>
        <p style={sectionSub}>One plan. Everything included. Cancel anytime.</p>

        <div style={{
          marginTop: 48, background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          borderRadius: 24, padding: '48px 40px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', filter: 'blur(40px)' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
              30-Day Free Trial
            </div>

            <div style={{ fontSize: 56, fontWeight: 900, color: 'white', lineHeight: 1 }}>
              $0
            </div>
            <div style={{ fontSize: 16, color: '#93c5fd', marginTop: 4, marginBottom: 32 }}>
              for 30 days, then subscribe to continue
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginBottom: 36 }}>
              {[
                'Unlimited calculator usage during trial',
                'Full dashboard access (pricing, branding, leads)',
                'Embeddable calculator on your website',
                'All leads captured and stored',
                'Cancel anytime — no contracts',
                'Reactivate instantly after subscribing',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#34d399', fontSize: 16, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: '#cbd5e1' }}>{item}</span>
                </div>
              ))}
            </div>

            <a href="/installer" style={{
              display: 'block', padding: '16px', textAlign: 'center',
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: 'white', borderRadius: 12, fontWeight: 800, fontSize: 17,
              textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
            }}>
              Start Free Trial — No Card Required
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ───────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: '80px 24px', background: '#f8fafc', textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.2, marginBottom: 16 }}>
          Your competitors' websites have a contact form.<br />
          <span style={{ color: '#1e40af' }}>Yours will have a solar calculator.</span>
        </h2>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 36, lineHeight: 1.7 }}>
          Start your 30-day free trial today. Be live on your website today.
        </p>
        <a href="/installer" style={{
          display: 'inline-block', padding: '18px 48px',
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          color: 'white', borderRadius: 14, fontWeight: 800, fontSize: 18,
          textDecoration: 'none', boxShadow: '0 10px 30px rgba(245,158,11,0.3)',
        }}>
          Get Started Free →
        </a>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 16 }}>
          No credit card · 30-day free trial · Cancel anytime
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────── */
function LandingFooter() {
  return (
    <footer style={{ background: '#0f172a', padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
        <img src="/android-chrome-192x192.png" alt="MySolarWidget" style={{ width: 32, height: 32, borderRadius: 7 }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>
          MySolar<span style={{ color: '#f59e0b' }}>Widget</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <a href="/" style={footerLink}>Home</a>
        <a href="/blog" style={footerLink}>Blog</a>
        <a href="/installer" style={footerLink}>Installer Login</a>
      </div>
      <p style={{ fontSize: 12, color: '#475569' }}>
        © {new Date().getFullYear()} MySolarWidget. Solar production data powered by NREL PVWatts.
      </p>
    </footer>
  );
}

/* ─── Shared helpers ──────────────────────────────────── */
function SectionLabel({ children, light }) {
  return (
    <div style={{
      display: 'inline-block',
      fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      color: light ? '#60a5fa' : '#1e40af',
      marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

const sectionTitle = {
  fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 900, color: '#0f172a',
  lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.02em',
};

const sectionSub = {
  fontSize: 16, color: '#64748b', lineHeight: 1.7, maxWidth: 560,
};

const ctaBtn = {
  padding: '10px 22px', background: 'linear-gradient(135deg, #f59e0b, #f97316)',
  color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 14,
  textDecoration: 'none',
};

const footerLink = { fontSize: 13, color: '#64748b', textDecoration: 'none' };
