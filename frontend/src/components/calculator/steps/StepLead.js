import React, { useState } from 'react';

const TIMELINES = [
  { value: 'asap', label: 'ASAP', desc: 'Ready to move forward now' },
  { value: '3months', label: 'Within 3 months', desc: 'Actively researching' },
  { value: '6months', label: 'Within 6 months', desc: 'Planning ahead' },
  { value: 'exploring', label: 'Just exploring', desc: 'Curious about solar' },
];

export default function StepLead({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', timeline: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.timeline) e.timeline = 'Please select a timeline';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit(form);
  };

  return (
    <div>
      <h2 className="step-title">You're one step away from your estimate</h2>
      <p className="step-desc">Where should we send your personalized solar savings report?</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: null })); }}
            className="lead-input"
            style={{ width: '100%' }}
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: null })); }}
            className="lead-input"
            style={{ width: '100%' }}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: null })); }}
            className="lead-input"
            style={{ width: '100%' }}
          />
          {errors.phone && <div className="field-error">{errors.phone}</div>}
        </div>

        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>When are you looking to go solar?</p>
          <div className="option-grid option-grid-2">
            {TIMELINES.map(t => (
              <button
                key={t.value}
                type="button"
                className={`option-card option-card-sm ${form.timeline === t.value ? 'selected' : ''}`}
                onClick={() => { setForm(p => ({ ...p, timeline: t.value })); setErrors(p => ({ ...p, timeline: null })); }}
              >
                <div className="option-label">{t.label}</div>
                <div className="option-desc">{t.desc}</div>
              </button>
            ))}
          </div>
          {errors.timeline && <div className="field-error">{errors.timeline}</div>}
        </div>

        <button type="submit" className="btn btn-cta" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Calculating...' : '☀️ Show My Free Estimate →'}
        </button>
      </form>

      <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 10 }}>
        No spam. No commitment. One call with a certified installer.
      </p>

      <style>{`
        .field-error { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .option-card-sm { padding: 10px 12px; }
        .option-grid-2 { grid-template-columns: 1fr 1fr; }
      `}</style>
    </div>
  );
}
