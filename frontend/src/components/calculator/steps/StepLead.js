import React from 'react';
import { UserIcon, PhoneIcon, MailIcon } from '../../ui/Icons';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', desc: 'Pay upfront, own it outright' },
  { value: 'loan', label: 'Solar loan', desc: '$0 down, monthly payments' },
  { value: 'lease', label: 'Lease / PPA', desc: 'Low monthly, no ownership' },
  { value: 'unsure', label: 'Not sure yet', desc: 'Help me decide' },
];

export default function StepLead({
  name, email, phone, paymentMethod,
  onNameChange, onEmailChange, onPhoneChange, onPaymentMethodChange,
  requireContact, embedded, primaryColor, formBgColor,
}) {
  const accentColor = primaryColor || '#1b4d3e';
  const gap = embedded ? 6 : 10;

  const phoneInvalid = phone.trim() && phone.replace(/\D/g, '').length < 10;

  return (
    <div className="sl-fade-in" style={formBgColor ? { background: formBgColor, borderRadius: 12, padding: embedded ? '8px 4px' : '12px 4px' } : {}}>
      <h2 className="step-title">
        {requireContact ? "You're one step away from your estimate" : 'Tell us a bit about your solar plans'}
      </h2>
      {requireContact && (
        <p className="step-desc">Where should we send your personalized solar savings report?</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {requireContact && (
          <>
            {/* Name + Phone side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap }}>
              <div className="sl-field">
                <UserIcon size={15} className="sl-field-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => onNameChange(e.target.value)}
                  className="sl-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <div className="sl-field">
                  <PhoneIcon size={15} className="sl-field-icon" />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={e => onPhoneChange(e.target.value)}
                    className="sl-input"
                    style={{ width: '100%' }}
                  />
                </div>
                {phoneInvalid && <div className="field-error">Enter a valid 10-digit phone number</div>}
              </div>
            </div>

            {/* Email full width */}
            <div className="sl-field">
              <MailIcon size={15} className="sl-field-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => onEmailChange(e.target.value)}
                className="sl-input"
                style={{ width: '100%' }}
              />
            </div>
          </>
        )}

        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: embedded ? 4 : 8 }}>How are you planning to pay?</p>
          <div className="option-grid option-grid-2">
            {PAYMENT_METHODS.map((t, i) => (
              <button
                key={t.value}
                type="button"
                className={`option-card option-card-sm sl-pm-card${paymentMethod === t.value ? ' sl-selected' : ''}`}
                onClick={() => onPaymentMethodChange(t.value)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="option-label">{t.label}</div>
                <div className="option-desc">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sl-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sl-fade-in { animation: sl-in 0.3s ease; }
        .sl-field { position: relative; display: flex; align-items: center; }
        .sl-field-icon { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .sl-field .sl-input { padding-left: 36px; }
        .sl-input {
          padding: ${embedded ? '8px 10px' : '11px 14px'};
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          color: #1e293b;
          background: white;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.12s, box-shadow 0.12s;
        }
        .sl-input:focus { border-color: ${accentColor}; box-shadow: 0 0 0 3px ${accentColor}15; }
        .sl-input::placeholder { color: #94a3b8; }
        .field-error { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .option-card-sm { padding: ${embedded ? '6px 8px' : '9px 12px'}; }
        .sl-pm-card { animation: sl-in 0.3s ease backwards; }
        .option-grid-2 { grid-template-columns: 1fr 1fr; gap: ${embedded ? '6px' : '8px'}; }
        .sl-selected { border-color: ${accentColor} !important; background: ${accentColor} !important; }
        .sl-selected .option-label, .sl-selected .option-desc { color: white; }
      `}</style>
    </div>
  );
}
