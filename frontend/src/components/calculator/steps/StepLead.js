import React, { useState } from 'react';
import { SunIcon } from '../../ui/Icons';

const TIMELINES = [
  { value: 'asap', label: 'ASAP', desc: 'Ready to move forward now' },
  { value: '3months', label: 'Within 3 months', desc: 'Actively researching' },
  { value: '6months', label: 'Within 6 months', desc: 'Planning ahead' },
  { value: 'exploring', label: 'Just exploring', desc: 'Curious about solar' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', desc: 'Pay upfront, own it outright' },
  { value: 'loan', label: 'Solar loan', desc: '$0 down, monthly payments' },
  { value: 'lease', label: 'Lease / PPA', desc: 'Low monthly, no ownership' },
  { value: 'unsure', label: 'Not sure yet', desc: 'Help me decide' },
];

export default function StepLead({ onSubmit, loading, requireContact }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', timeline: '', paymentMethod: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (requireContact) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
      if (!form.phone.trim()) e.phone = 'Phone number is required';
    }
    if (!form.timeline) e.timeline = 'Please select a timeline';
    if (!form.paymentMethod) e.paymentMethod = 'Please select a payment preference';
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
      <h2 className="step-title">
        {requireContact ? "You're one step away from your estimate" : 'Almost there!'}
      </h2>
      <p className="step-desc">
        {requireContact
          ? 'Where should we send your personalized solar savings report?'
          : 'Tell us a bit about your solar plans to get your free estimate.'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {requireContact && (
          <>
            <div>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: null })); }}
                className="sl-input"
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
                className="sl-input"
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
                className="sl-input"
                style={{ width: '100%' }}
              />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>
          </>
        )}

        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>How are you planning to pay?</p>
          <div className="option-grid option-grid-2">
            {PAYMENT_METHODS.map(t => (
              <button
                key={t.value}
                type="button"
                className={`option-card option-card-sm ${form.paymentMethod === t.value ? 'selected' : ''}`}
                onClick={() => { setForm(p => ({ ...p, paymentMethod: t.value })); setErrors(p => ({ ...p, paymentMethod: null })); }}
              >
                <div className="option-label">{t.label}</div>
                <div className="option-desc">{t.desc}</div>
              </button>
            ))}
          </div>
          {errors.paymentMethod && <div className="field-error">{errors.paymentMethod}</div>}
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
          {loading ? 'Calculating...' : <><SunIcon size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Show My Free Estimate →</>}
        </button>
      </form>

      {requireContact && (
        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 10 }}>
          No spam. No commitment. One call with a certified installer.
        </p>
      )}

      <style>{`
        .sl-input {
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #1e293b;
          background: white;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.12s;
        }
        .sl-input:focus { border-color: #1e40af; }
        .sl-input::placeholder { color: #94a3b8; }
        .field-error { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .option-card-sm { padding: 10px 12px; }
        .option-grid-2 { grid-template-columns: 1fr 1fr; }
      `}</style>
    </div>
  );
}
