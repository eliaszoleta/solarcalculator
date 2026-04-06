import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ClipboardIcon, LinkIcon, ChartBarIcon, PaintBrushIcon, DollarSignIcon, MapPinIcon, BatteryIcon, RulerIcon, SunIcon, BoltIcon, HomeIcon, TrendingDownIcon, WrenchIcon, CreditCardIcon } from '../ui/Icons';

export default function InstallerLanding() {
  return (
    <>
      <Helmet>
        <title>Solar Calculator Widget for Installers | MySolarWidget</title>
        <meta name="description" content="Embed a branded solar savings calculator on your website in minutes. Capture leads, show instant estimates, and close more solar deals. Free trial for solar installers." />
        <link rel="canonical" href="https://www.mysolarwidget.com/for-installers" />
        <meta property="og:title" content="Solar Calculator Widget for Installers | MySolarWidget" />
        <meta property="og:description" content="Embed a branded solar savings calculator on your website. Capture leads and close more deals. Free trial available." />
        <meta property="og:url" content="https://www.mysolarwidget.com/for-installers" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MySolarWidget" />
        <meta property="og:image" content="https://www.mysolarwidget.com/android-chrome-512x512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solar Calculator Widget for Installers | MySolarWidget" />
        <meta name="twitter:description" content="Embed a branded solar savings calculator on your website. Capture leads and close more deals." />
        <meta name="twitter:image" content="https://www.mysolarwidget.com/android-chrome-512x512.png" />
      </Helmet>
      <div style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#0f172a', overflowX: 'hidden' }}>
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
      <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 1, minWidth: 0, overflow: 'hidden' }}>
          <img src="/logo-horizontal-light.svg" alt="MySolarWidget" style={{ height: 44, width: 'auto', maxWidth: '100%' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <a href="/installer" style={{
            fontSize: 14, color: '#2563eb', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
            padding: '8px 18px', border: '1.5px solid #2563eb', borderRadius: 8,
            transition: 'background 0.15s, color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2563eb'; }}
          >
            Log in
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)',
      padding: '72px 24px 64px',
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

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Give every homeowner<br />
          <span style={{ color: '#f59e0b' }}>an instant solar estimate</span><br />
          on your website
        </h1>

        <p style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#93c5fd', lineHeight: 1.65, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
          Embed a fully branded, real-data solar savings calculator on your site in minutes.
          Capture leads automatically — no developer needed.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/installer" style={{
            padding: '13px 28px', background: '#2563eb',
            color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 15,
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
            transition: 'transform 0.15s',
          }}>
            Start 7-Day Free Trial
          </a>
          <a href="#how-it-works" style={{
            padding: '13px 24px', background: 'rgba(255,255,255,0.1)',
            color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 15,
            textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)',
          }}>
            See how it works
          </a>
        </div>

        <p style={{ fontSize: 13, color: '#64748b', marginTop: 20 }}>
          $159/mo after 7 days · Cancel anytime
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
    { value: '85–90%', label: 'Accurate vs. real installer quotes' },
    { value: '7 days', label: 'Free trial' },
  ];
  return (
    <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '28px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#2563eb' }}>{s.value}</div>
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
      icon: <ClipboardIcon size={24} />, iconBg: '#dbeafe', iconColor: '#2563eb',
      title: 'Create your account',
      desc: 'Sign up in 60 seconds. Set your pricing per watt, service area, battery costs, and company branding — all from a simple dashboard.',
    },
    {
      num: '02',
      icon: <LinkIcon size={24} />, iconBg: '#fef3c7', iconColor: '#d97706',
      title: 'Paste one line of code',
      desc: 'Copy the embed snippet from your dashboard and paste it anywhere on your website. The calculator appears instantly, fully branded to your business.',
    },
    {
      num: '03',
      icon: <ChartBarIcon size={24} />, iconBg: '#dcfce7', iconColor: '#16a34a',
      title: 'Receive qualified leads',
      desc: 'Every homeowner who completes the calculator submits their name, email, phone, timeline, and payment preference — sent straight to your leads dashboard.',
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: '72px 24px', background: 'white' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <SectionLabel>How It Works</SectionLabel>
          <h2 style={sectionTitle}>From signup to live on your site in minutes</h2>
          <p style={sectionSub}>No developers. No complex setup. Just copy, paste, and watch leads come in.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 40 }}>
          {steps.map(s => (
            <div key={s.num} style={{ position: 'relative' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', letterSpacing: '0.1em', marginBottom: 16, opacity: 0.5 }}>STEP {s.num}</div>
              <div style={{ width: 52, height: 52, background: s.iconBg, color: s.iconColor, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
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
      icon: <PaintBrushIcon size={26} />,
      iconBg: '#fef3c7', iconColor: '#d97706',
      title: 'Fully white-labeled',
      desc: 'Your company name, your colors, your font, your CTA. Homeowners see your brand — not ours. Customize the headline, subtext, phone number, and button that appear after the estimate.',
    },
    {
      icon: <DollarSignIcon size={26} />,
      iconBg: '#dcfce7', iconColor: '#16a34a',
      title: 'Your pricing, your margin',
      desc: 'Set your own price per watt ($2.50–$4.00 typical), roof surcharges for tile/metal/flat, battery costs, and system size limits. Every estimate reflects your real quote structure.',
    },
    {
      icon: <MapPinIcon size={26} />,
      iconBg: '#ffedd5', iconColor: '#ea580c',
      title: 'Service area control',
      desc: "Restrict the calculator to your service states. Homeowners outside your area are told you don't serve their location — so you only get leads you can actually close.",
    },
    {
      icon: <BatteryIcon size={26} />,
      iconBg: '#f3e8ff', iconColor: '#9333ea',
      title: 'Battery storage options',
      desc: 'Let homeowners compare estimates with no battery, one Powerwall, or two. Configure your exact installed battery costs so estimates match your actual proposals.',
    },
    {
      icon: <ChartBarIcon size={26} />,
      iconBg: '#dbeafe', iconColor: '#2563eb',
      title: 'Live leads dashboard',
      desc: 'Every lead — name, email, phone, system size, annual savings, payment preference, and timeline — appears in your dashboard the moment someone submits the calculator.',
    },
    {
      icon: <WrenchIcon size={26} />,
      iconBg: '#fef9c3', iconColor: '#ca8a04',
      title: 'Custom question steps',
      desc: 'Add your own questions between the standard calculator steps — checkboxes, radio buttons, or open text. Collect the exact qualifying info your sales team needs, before the first call.',
    },
  ];

  return (
    <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <SectionLabel>Features</SectionLabel>
          <h2 style={sectionTitle}>Everything you need. Nothing you don't.</h2>
          <p style={sectionSub}>Built specifically for solar installers who want leads — not a full CRM.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 40 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'white', borderRadius: 16, padding: '28px 24px', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: f.iconColor }}>
                {f.icon}
              </div>
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
      icon: <SunIcon size={20} />, iconBg: '#fef9c3', iconColor: '#ca8a04',
      title: 'Real irradiance data from NREL',
      desc: 'When a homeowner enters their ZIP code, the calculator calls the NREL PVWatts API — the same dataset used by the US Department of Energy — to get precise solar production estimates for their exact location.',
    },
    {
      icon: <BoltIcon size={20} />, iconBg: '#fef3c7', iconColor: '#d97706',
      title: 'EIA electricity rates by state',
      desc: 'Monthly bills are converted to kWh usage using the US Energy Information Administration\'s latest average electricity rates by state — not guesses.',
    },
    {
      icon: <HomeIcon size={20} />, iconBg: '#ffedd5', iconColor: '#ea580c',
      title: 'Right-sized for each home',
      desc: 'The calculator targets 85% energy offset, accounting for roof type, sun exposure, shading, and your min/max system size settings. Panel count is calculated at 400W per panel.',
    },
    {
      icon: <TrendingDownIcon size={20} />, iconBg: '#dcfce7', iconColor: '#16a34a',
      title: '30-year savings projection',
      desc: 'Savings are modeled at a 4%/year utility rate increase — a conservative assumption based on the historical EIA trend. Financed estimates include a 25-year loan at 5.99% APR as a reference point.',
    },
  ];

  return (
    <section style={{ padding: '72px 24px', background: 'white' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <SectionLabel>Accuracy</SectionLabel>
          <h2 style={sectionTitle}>Estimates homeowners can trust</h2>
          <p style={sectionSub}>
            Our estimates are <strong>85–90% accurate</strong> compared to real installer quotes for the same home. On a typical $25,000 system, that's within $2,500–$3,500 of what an installer would actually propose — close enough to set real expectations and compelling enough to get homeowners to call.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 40 }}>
          {items.map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
          <p style={{ fontSize: 14, color: '#2563eb', lineHeight: 1.7, margin: 0 }}>
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
    { icon: <BoltIcon size={16} />, label: 'Monthly electric bill' },
    { icon: <MapPinIcon size={16} />, label: 'ZIP code & state' },
    { icon: <HomeIcon size={16} />, label: 'Home type & ownership' },
    { icon: <WrenchIcon size={16} />, label: 'Roof type & sun exposure' },
    { icon: <BatteryIcon size={16} />, label: 'Battery storage preference' },
    { icon: <CreditCardIcon size={16} />, label: 'Timeline & payment method' },
  ];

  return (
    <section style={{ padding: '72px 24px', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel light>The Calculator Experience</SectionLabel>
        <h2 style={{ ...sectionTitle, color: 'white', marginBottom: 12 }}>6 built-in steps + your custom questions.</h2>
        <p style={{ ...sectionSub, color: '#93c5fd', marginBottom: 56, margin: '0 auto 56px' }}>
          Homeowners complete the flow in under 2 minutes — then see a full savings breakdown with 30-year projection, before submitting their contact info to you. Add your own questions anywhere in the flow.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 48 }}>
          {steps.map((s, i) => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 50, padding: '10px 18px',
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{s.icon}</span>
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
    <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <SectionLabel>Business Impact</SectionLabel>
          <h2 style={sectionTitle}>What it actually does for your pipeline</h2>
          <p style={sectionSub}>More than a widget — a 24/7 lead qualification machine for your solar business.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
          {benefits.map(b => (
            <div key={b.title} style={{
              background: 'white', borderRadius: 14, padding: '24px 28px',
              border: '1px solid #e2e8f0',
              display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{b.desc}</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#2563eb' }}>{b.stat}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, maxWidth: 120 }}>{b.statLabel}</div>
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
  const features = [
    'Unlimited calculator sessions',
    'White-label branding & custom colors',
    'Lead capture dashboard',
    'Pricing & margin controls',
    'Embeddable calculator on your website',
    'CSV export & API access',
    'Priority support',
    'Cancel anytime — no contracts',
  ];
  return (
    <section id="pricing" style={{ padding: '80px 24px', background: '#f0f7ff' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel>Pricing</SectionLabel>
        <h2 style={sectionTitle}>Simple, transparent pricing</h2>
        <p style={{ ...sectionSub, margin: '0 auto 36px' }}>One plan. Everything included. No surprises.</p>

        <div style={{ background: 'white', border: '2px solid #2563eb', borderRadius: 20, padding: '38px 34px', boxShadow: '0 8px 40px rgba(37,99,235,0.12)', textAlign: 'left' }}>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 54, fontWeight: 900, color: '#0f172a', letterSpacing: '-2px' }}>$159</span>
            <span style={{ fontSize: 17, color: '#64748b' }}>/month</span>
          </div>
          <div style={{ color: '#16a34a', fontWeight: 600, fontSize: 14, marginBottom: 28, textAlign: 'center' }}>$159/mo after 7 days · Cancel anytime</div>

          {/* Features */}
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
            {features.map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11, fontSize: 14.5, color: '#374151' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <a href="/installer" style={{
            display: 'block', background: '#2563eb', color: 'white',
            padding: '15px 0', borderRadius: 10, textDecoration: 'none',
            fontWeight: 700, fontSize: 16, textAlign: 'center',
          }}>
            Start Free Trial →
          </a>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 11, textAlign: 'center' }}>
            Credit card required. Cancel before 7 days and you won't be charged.
          </p>
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
        <SectionLabel>Get Started</SectionLabel>
        <h2 style={{ ...sectionTitle, fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 16 }}>
          Your competitors' websites<br />have a contact form.<br />
          <span style={{ color: '#2563eb' }}>Yours will have a solar calculator.</span>
        </h2>
        <p style={{ ...sectionSub, margin: '0 auto 36px' }}>
          Start your 7-day free trial today. Be live on your website today.
        </p>
        <a href="/installer" style={{
          display: 'inline-block', padding: '13px 32px',
          background: '#2563eb',
          color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 15,
          textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
          letterSpacing: '-0.01em',
        }}>
          Get Started Free
        </a>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 16 }}>
          $159/mo after 7 days · Cancel anytime
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────── */
function LandingFooter() {
  return (
    <footer style={{ background: '#0f172a', padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <img src="/logo-horizontal-dark.svg" alt="MySolarWidget" style={{ height: 44, width: 'auto' }} />
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
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: light ? '#93c5fd' : '#2563eb',
      background: light ? 'rgba(147,197,253,0.12)' : '#eff6ff',
      border: `1px solid ${light ? 'rgba(147,197,253,0.25)' : 'rgba(37,99,235,0.15)'}`,
      borderRadius: 999,
      padding: '4px 12px',
      marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

const sectionTitle = {
  fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0f172a',
  lineHeight: 1.2, marginBottom: 10, letterSpacing: '-0.02em',
};

const sectionSub = {
  fontSize: 15, color: '#64748b', lineHeight: 1.65, maxWidth: 540, margin: '0 auto',
};

const ctaBtn = {
  padding: '9px 16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)',
  color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 13,
  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
};

const footerLink = { fontSize: 13, color: '#64748b', textDecoration: 'none' };
