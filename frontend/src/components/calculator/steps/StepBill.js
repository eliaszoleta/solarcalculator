import React from 'react';
import { LightBulbIcon, ClockIcon, ShieldIcon, BoltIcon } from '../../ui/Icons';

const TRUST_ITEMS = [
  { Icon: ClockIcon, label: '2-minute estimate' },
  { Icon: ShieldIcon, label: 'No account needed' },
  { Icon: BoltIcon,  label: 'Instant results' },
];

export default function StepBill({ value, onChange, primaryColor }) {
  const accent = primaryColor || '#1c3a5e';
  return (
    <div className="sb-fade-in">
      <h2 className="step-title">What's your average monthly electric bill?</h2>
      <p className="step-desc">This is the most important factor for sizing your solar system.</p>

      <div className="sb-trust-row">
        {TRUST_ITEMS.map(({ Icon, label }) => (
          <div key={label} className="sb-trust-item">
            <Icon size={13} color={accent} strokeWidth={2} /> {label}
          </div>
        ))}
      </div>

      <div className="bill-display">
        <span className="bill-amount">${value}</span>
        <span className="bill-label">/month</span>
      </div>

      <input
        type="range"
        min={50}
        max={500}
        step={10}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="bill-slider"
      />

      <div className="slider-labels">
        <span>$50</span>
        <span>$150</span>
        <span>$250</span>
        <span>$350</span>
        <span>$500+</span>
      </div>

      <div className="bill-presets">
        {[100, 150, 200, 300, 400].map((v, i) => (
          <button
            key={v}
            className={`preset-btn ${value === v ? 'active' : ''}`}
            onClick={() => onChange(v)}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            ${v}
          </button>
        ))}
      </div>

      <p className="bill-hint">
        <LightBulbIcon size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Tip: Find your average on your utility bill or account portal.
      </p>

      <style>{`
        @keyframes sb-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sb-fade-in { animation: sb-in 0.3s ease; }
        .sb-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 16px;
          margin-bottom: 14px;
        }
        .sb-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .bill-display {
          text-align: center;
          margin: 16px 0 8px;
          animation: sb-in 0.35s ease 0.05s backwards;
        }
        .bill-amount {
          font-size: 52px;
          font-weight: 800;
          color: ${accent};
          line-height: 1;
          transition: color 0.15s;
        }
        .bill-label {
          font-size: 20px;
          color: #64748b;
          margin-left: 4px;
        }
        .bill-slider {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          accent-color: ${accent};
          margin: 16px 0 8px;
        }
        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 20px;
        }
        .bill-presets {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
        }
        .preset-btn {
          padding: 6px 16px;
          border-radius: 999px;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: border-color 0.12s, background 0.12s, color 0.12s, transform 0.12s;
          animation: sb-in 0.3s ease backwards;
        }
        .preset-btn:active { transform: scale(0.95); }
        .preset-btn:hover {
          border-color: ${accent};
          background: ${accent}12;
          color: ${accent};
        }
        .preset-btn.active {
          border-color: ${accent};
          background: ${accent};
          color: white;
        }
        .bill-hint {
          font-size: 13px;
          color: #94a3b8;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
