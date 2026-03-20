import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://www.mysolarcalculator.com';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Question', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    // Mailto fallback — opens email client. Can be swapped for an API endpoint later.
    const subject = encodeURIComponent(`[MySolarWidget] ${form.subject}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hello@mysolarcalculator.com?subject=${subject}&body=${body}`;
    setStatus('sent');
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Helmet>
        <title>Contact Us — MySolarWidget</title>
        <meta name="description" content="Contact MySolarWidget with questions about our free solar savings calculator, installer widget, or your solar estimate. We read every message." />
        <link rel="canonical" href={`${DOMAIN}/contact`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: '#64748b', fontSize: 16, marginBottom: 48 }}>
          We're a small team and we read every message. Expect a reply within 1–2 business days.
        </p>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { icon: '✉️', label: 'General Inquiries', value: 'hello@mysolarcalculator.com', href: 'mailto:hello@mysolarcalculator.com' },
            { icon: '🔒', label: 'Privacy & Data', value: 'privacy@mysolarcalculator.com', href: 'mailto:privacy@mysolarcalculator.com' },
            { icon: '🏗️', label: 'Installer Partnerships', value: 'installers@mysolarcalculator.com', href: 'mailto:installers@mysolarcalculator.com' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: 'block',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'border-color 0.15s'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#1e40af' }}>{item.value}</div>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div style={{ background: '#f8fafc', borderRadius: 16, padding: '32px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Send Us a Message</h2>

          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Your email client should open</p>
              <p style={{ fontSize: 14, color: '#64748b' }}>If it didn't, email us directly at <a href="mailto:hello@mysolarcalculator.com" style={{ color: '#1e40af' }}>hello@mysolarcalculator.com</a></p>
              <button onClick={() => setStatus(null)} style={{ marginTop: 16, padding: '8px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle} htmlFor="contact-name">Name *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="contact-email">Email *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="contact-subject">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  style={inputStyle}
                >
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
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  padding: '12px 28px',
                  background: '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                  alignSelf: 'flex-start'
                }}
              >
                {status === 'sending' ? 'Opening email...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* FAQ links */}
        <div style={{ marginTop: 40, padding: '24px', background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: 14, color: '#1e40af', fontWeight: 600, marginBottom: 8 }}>Looking for quick answers?</p>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
            Check our <a href="/#faq" style={{ color: '#1e40af', fontWeight: 600 }}>FAQ section</a> on the homepage, or browse our <a href="/blog" style={{ color: '#1e40af', fontWeight: 600 }}>Solar Blog</a> for in-depth guides on costs, savings, tax credits, and more.
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
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: 14,
  color: '#0f172a',
  background: 'white',
  outline: 'none',
  boxSizing: 'border-box'
};
