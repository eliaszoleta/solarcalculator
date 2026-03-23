import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MailIcon, LockIcon, WrenchIcon, CheckCircleIcon } from '../ui/Icons';

const DOMAIN = 'https://www.mysolarwidget.com';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Question', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    const subject = encodeURIComponent(`[MySolarWidget] ${form.subject}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hello@mysolarwidget.com?subject=${subject}&body=${body}`;
    setStatus('sent');
  };

  return (
    <div style={{ background: 'var(--bg, #f1f5f9)', minHeight: '100vh' }}>
      <Helmet>
        <title>Contact Us — MySolarWidget</title>
        <meta name="description" content="Contact MySolarWidget with questions about our free solar savings calculator, installer widget, or your solar estimate. We read every message." />
        <link rel="canonical" href={`${DOMAIN}/contact`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Page Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)',
        padding: '64px 24px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(50px)' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(147,197,253,0.12)', border: '1px solid rgba(147,197,253,0.25)', borderRadius: 999, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Get in Touch</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.02em' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: 16, color: '#93c5fd', lineHeight: 1.65, maxWidth: 400, margin: '0 auto' }}>
            We're a small team and we read every message. Expect a reply within 1–2 business days.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { icon: <MailIcon size={22} />, iconBg: '#dbeafe', iconColor: '#2563eb', label: 'General Inquiries', value: 'hello@mysolarwidget.com', href: 'mailto:hello@mysolarwidget.com' },
            { icon: <LockIcon size={22} />, iconBg: '#f3e8ff', iconColor: '#9333ea', label: 'Privacy & Data', value: 'privacy@mysolarwidget.com', href: 'mailto:privacy@mysolarwidget.com' },
            { icon: <WrenchIcon size={22} />, iconBg: '#dcfce7', iconColor: '#16a34a', label: 'Installer Partnerships', value: 'installers@mysolarwidget.com', href: 'mailto:installers@mysolarwidget.com' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: 'block',
                padding: '18px 16px',
                background: 'white',
                borderRadius: 14,
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: item.iconBg, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 500 }}>{item.value}</div>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Send Us a Message</h2>
          </div>

          <div style={{ padding: '24px 28px 28px' }}>
            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ marginBottom: 12, color: '#16a34a', display: 'flex', justifyContent: 'center' }}><CheckCircleIcon size={40} /></div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Your email client should open</p>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>If it didn't, email us directly at <a href="mailto:hello@mysolarwidget.com" style={{ color: '#2563eb', fontWeight: 600 }}>hello@mysolarwidget.com</a></p>
                <button onClick={() => setStatus(null)} style={{ padding: '9px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle} htmlFor="contact-name">Name *</label>
                    <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="contact-email">Email *</label>
                    <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle} htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange} style={inputStyle}>
                    <option>General Question</option>
                    <option>Calculator Feedback</option>
                    <option>Installer Partnership</option>
                    <option>Privacy / Data Request</option>
                    <option>Bug Report</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle} htmlFor="contact-message">Message *</label>
                  <textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="How can we help?" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    padding: '12px 28px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    opacity: status === 'sending' ? 0.7 : 1,
                    alignSelf: 'flex-start',
                    transition: 'background 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {status === 'sending' ? 'Opening email...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ links */}
        <div style={{ marginTop: 24, padding: '20px 24px', background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: 13.5, color: '#1d4ed8', fontWeight: 700, marginBottom: 6 }}>Looking for quick answers?</p>
          <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.7, margin: 0 }}>
            Check our <a href="/#faq" style={{ color: '#2563eb', fontWeight: 600 }}>FAQ section</a> on the homepage, or browse our <a href="/blog" style={{ color: '#2563eb', fontWeight: 600 }}>Solar Blog</a> for in-depth guides on costs, savings, tax credits, and more.
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 14,
  color: '#0f172a',
  background: '#fafafa',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
};
