import React from 'react';

const HOME_TYPES = [
  { value: 'house', icon: '🏠', label: 'House', desc: 'Single-family home' },
  { value: 'condo', icon: '🏙', label: 'Condo', desc: 'Condominium unit' },
  { value: 'apartment', icon: '🏢', label: 'Apartment', desc: 'Apartment unit' },
];

export default function StepHome({ value, onChange }) {
  return (
    <div>
      <h2 className="step-title">What type of home do you live in?</h2>
      <p className="step-desc">This helps determine if solar is a good fit for your property.</p>

      <div className="option-grid option-grid-3">
        {HOME_TYPES.map(opt => (
          <button
            key={opt.value}
            className={`option-card ${value === opt.value ? 'selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="option-icon">{opt.icon}</span>
            <div className="option-label">{opt.label}</div>
            <div className="option-desc">{opt.desc}</div>
          </button>
        ))}
      </div>

      {value === 'apartment' && (
        <div className="home-warning">
          ⚠️ Apartment units typically can't install rooftop solar. However, community solar programs may be available in your area.
        </div>
      )}

      <style>{`
        .home-warning {
          margin-top: 16px;
          padding: 12px 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 10px;
          font-size: 13px;
          color: #9a3412;
        }
      `}</style>
    </div>
  );
}
