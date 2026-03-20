import React from 'react';
import { LightBulbIcon } from '../../ui/Icons';

export default function StepBill({ value, onChange }) {
  return (
    <div>
      <h2 className="step-title">What's your average monthly electric bill?</h2>
      <p className="step-desc">This is the most important factor for sizing your solar system.</p>

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
        {[100, 150, 200, 300, 400].map(v => (
          <button
            key={v}
            className={`preset-btn ${value === v ? 'active' : ''}`}
            onClick={() => onChange(v)}
          >
            ${v}
          </button>
        ))}
      </div>

      <p className="bill-hint">
        <LightBulbIcon size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Tip: Find your average on your utility bill or account portal.
      </p>

      <style>{`
        .bill-display {
          text-align: center;
          margin: 16px 0 8px;
        }
        .bill-amount {
          font-size: 52px;
          font-weight: 800;
          color: #1e40af;
          line-height: 1;
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
          accent-color: #f59e0b;
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
          transition: all 0.12s;
        }
        .preset-btn:hover, .preset-btn.active {
          border-color: #1e40af;
          background: #eff6ff;
          color: #1e40af;
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
