import React from 'react';

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
  const accentColor = primaryColor || '#1c3a5e';
  const accentBg = accentColor + '18';
  const gap = embedded ? 6 : 10;

  const phoneInvalid = phone.trim() && phone.replace(/\D/g, '').length < 10;

  return (
    <div style={formBgColor ? { background: formBgColor, borderRadius: 12, padding: embedded ? '8px 4px' : '12px 4px' } : {}}>
      <h2 className="step-title">
        {requireContact ? "You're one step away from your estimate" : 'Almost there!'}
      </h2>
      <p className="step-desc">
        {requireContact
          ? 'Where should we send your personalized solar savings report?'
          : 'Tell us a bit about your solar plans to get your free estimate.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {requireContact && (
          <>
            {/* Name + Phone side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap }}>
              <div>
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
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={e => onPhoneChange(e.target.value)}
                  className="sl-input"
                  style={{ width: '100%' }}
                />
                {phoneInvalid && <div className="field-error">Enter a valid 10-digit phone number</div>}
              </div>
            </div>

            {/* Email full width */}
            <div>
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
            {PAYMENT_METHODS.map(t => (
              <button
                key={t.value}
                type="button"
                className={`option-card option-card-sm${paymentMethod === t.value ? ' sl-selected' : ''}`}
                onClick={() => onPaymentMethodChange(t.value)}
              >
                <div className="option-label">{t.label}</div>
                <div className="option-desc">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sl-input {
          padding: ${embedded ? '8px 10px' : '11px 14px'};
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          color: #1e293b;
          background: white;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.12s;
        }
        .sl-input:focus { border-color: ${accentColor}; }
        .sl-input::placeholder { color: #94a3b8; }
        .field-error { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .option-card-sm { padding: ${embedded ? '6px 8px' : '9px 12px'}; }
        .option-grid-2 { grid-template-columns: 1fr 1fr; gap: ${embedded ? '6px' : '8px'}; }
        .sl-selected { border-color: ${accentColor} !important; background: ${accentBg} !important; }
      `}</style>
    </div>
  );
}
