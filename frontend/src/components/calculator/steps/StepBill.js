import React from 'react';
import { LightBulbIcon, BoltIcon } from '../../ui/Icons';

export default function StepBill({ value, onChange, primaryColor }) {
  const accent = primaryColor || '#1b4d3e';
  const percent = ((value - 50) / (500 - 50)) * 100;

  return (
    <div className="sb-fade-in">
      <div className="sb-medallion" style={{ background: `${accent}14`, border: `1.5px solid ${accent}30` }}>
        <BoltIcon size={20} color={accent} />
      </div>
      <h2 className="step-title">What's your average monthly electric bill?</h2>
      <p className="step-desc">This is the most important factor for sizing your solar system.</p>

      <div className="bill-display" style={{ background: `radial-gradient(circle, ${accent}10 0%, ${accent}00 72%)` }}>
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
        style={{ background: `linear-gradient(to right, ${accent} ${percent}%, #e2e8f0 ${percent}%)` }}
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
        .sb-medallion {
          width: 40px; height: 40px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
          animation: sb-in 0.3s ease;
        }
        .bill-display {
          text-align: center;
          margin: 16px 0 8px;
          padding: 18px 0 14px;
          border-radius: 20px;
          animation: sb-in 0.35s ease 0.05s backwards;
          transition: background 0.2s;
        }
        .bill-amount {
          font-size: 56px;
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
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          margin: 16px 0 8px;
          transition: background 0.1s;
        }
        .bill-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${accent};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(15,23,42,0.35);
          cursor: pointer;
          transition: transform 0.12s;
        }
        .bill-slider::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .bill-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${accent};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(15,23,42,0.35);
          cursor: pointer;
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
