import React from 'react';

const EQUIPMENT_OPTIONS = [
  {
    value: 'basic',
    icon: '⚡',
    label: 'Basic',
    brand: 'JinkoSolar Panels',
    desc: 'Reliable tier-1 panels. Great value for budget-conscious homeowners.',
    efficiency: '20–21%',
    warranty: '12 yr product',
    priceNote: 'Most affordable',
  },
  {
    value: 'standard',
    icon: '☀️',
    label: 'Standard',
    brand: 'Qcells Panels',
    desc: 'Best-selling panels in the US. Excellent balance of price and performance.',
    efficiency: '21–22%',
    warranty: '25 yr product',
    priceNote: 'Best value',
    popular: true,
  },
  {
    value: 'premium',
    icon: '🌟',
    label: 'Premium',
    brand: 'SunPower Panels',
    desc: 'Highest efficiency panels available. Maximum power from limited roof space.',
    efficiency: '22–23%',
    warranty: '40 yr combined',
    priceNote: 'Top performance',
  },
];

export default function StepEquipment({ value, onChange }) {
  return (
    <div>
      <h2 className="step-title">Which equipment tier fits your needs?</h2>
      <p className="step-desc">We automatically size your system — just choose your quality preference.</p>

      <div className="option-grid">
        {EQUIPMENT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`option-card equip-card ${value === opt.value ? 'selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.popular && <span className="popular-badge">Recommended</span>}
            <div className="equip-row">
              <span className="option-icon" style={{ fontSize: 22, marginBottom: 0 }}>{opt.icon}</span>
              <div className="equip-info">
                <div className="equip-header">
                  <span className="option-label">{opt.label}</span>
                  <span className="equip-brand">{opt.brand}</span>
                </div>
                <div className="option-desc">{opt.desc}</div>
                <div className="equip-specs">
                  <span>⚡ {opt.efficiency} efficiency</span>
                  <span>🛡 {opt.warranty}</span>
                </div>
              </div>
              <div className="equip-price-note">{opt.priceNote}</div>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .equip-card {
          text-align: left;
          padding: 14px 16px;
          position: relative;
        }
        .equip-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .equip-info {
          flex: 1;
        }
        .equip-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 3px;
        }
        .equip-brand {
          font-size: 12px;
          color: #64748b;
        }
        .equip-specs {
          display: flex;
          gap: 12px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .equip-specs span {
          font-size: 11px;
          color: #64748b;
        }
        .equip-price-note {
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          white-space: nowrap;
          padding-top: 2px;
        }
        .popular-badge {
          position: absolute;
          top: -1px;
          right: 12px;
          background: #1e40af;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 0 0 6px 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
