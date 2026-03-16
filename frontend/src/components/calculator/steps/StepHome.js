import React from 'react';

const HOME_TYPES = [
  { value: 'house', icon: '🏠', label: 'House', desc: 'Single-family home' },
  { value: 'condo', icon: '🏙', label: 'Condo', desc: 'Condominium unit' },
  { value: 'apartment', icon: '🏢', label: 'Apartment', desc: 'Apartment unit' },
];

export default function StepHome({ homeType, ownsHome, onHomeTypeChange, onOwnsHomeChange }) {
  const isDisqualified = homeType === 'apartment' || homeType === 'condo' || ownsHome === false;

  return (
    <div>
      <h2 className="step-title">What type of home do you live in?</h2>
      <p className="step-desc">This helps determine if solar is a good fit for your property.</p>

      <div className="option-grid option-grid-3">
        {HOME_TYPES.map(opt => (
          <button
            key={opt.value}
            className={`option-card ${homeType === opt.value ? 'selected' : ''}`}
            onClick={() => { onHomeTypeChange(opt.value); onOwnsHomeChange(null); }}
          >
            <span className="option-icon">{opt.icon}</span>
            <div className="option-label">{opt.label}</div>
            <div className="option-desc">{opt.desc}</div>
          </button>
        ))}
      </div>

      {homeType === 'house' && ownsHome === null && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Do you own or rent this home?</p>
          <div className="option-grid option-grid-2">
            <button
              className={`option-card ${ownsHome === true ? 'selected' : ''}`}
              onClick={() => onOwnsHomeChange(true)}
            >
              <span className="option-icon">🔑</span>
              <div className="option-label">I own it</div>
            </button>
            <button
              className={`option-card ${ownsHome === false ? 'selected' : ''}`}
              onClick={() => onOwnsHomeChange(false)}
            >
              <span className="option-icon">📄</span>
              <div className="option-label">I rent it</div>
            </button>
          </div>
        </div>
      )}

      {isDisqualified && (
        <div className="disqualify-box">
          {(homeType === 'apartment' || homeType === 'condo') ? (
            <>
              <div className="disqualify-icon">🏙️</div>
              <h4>Solar isn't available for {homeType} units</h4>
              <p>Rooftop solar requires ownership of a single-family home. However, <strong>community solar programs</strong> let you subscribe to a local solar farm and get credits on your electric bill — no rooftop needed.</p>
            </>
          ) : (
            <>
              <div className="disqualify-icon">🔑</div>
              <h4>You need to own your home to go solar</h4>
              <p>Solar panels are a permanent home improvement that require owner approval. If you're planning to buy, come back when you're ready — this calculator will still be here.</p>
            </>
          )}
        </div>
      )}

      <style>{`
        .disqualify-box {
          margin-top: 20px;
          padding: 20px;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 12px;
          text-align: center;
          color: #92400e;
        }
        .disqualify-icon { font-size: 28px; margin-bottom: 8px; }
        .disqualify-box h4 { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
        .disqualify-box p { font-size: 13px; line-height: 1.6; margin: 0; }
        .option-grid-2 { grid-template-columns: 1fr 1fr; }
      `}</style>
    </div>
  );
}
