import React from 'react';
import { PlugIcon, BatteryIcon, BoltIcon } from '../../ui/Icons';

const BATTERY_OPTIONS = [
  {
    value: 'none',
    icon: <PlugIcon size={24} />,
    label: 'No Battery',
    desc: 'Grid-tied system. Power from grid at night.',
    price: 'Included',
    popular: false,
  },
  {
    value: 'one',
    icon: <BatteryIcon size={24} />,
    label: '1 Battery',
    desc: 'Tesla Powerwall or similar. Backup power + night use.',
    price: '+$11,500',
    popular: true,
  },
  {
    value: 'two',
    icon: <BoltIcon size={24} />,
    label: '2 Batteries',
    desc: 'Maximum storage. Nearly full energy independence.',
    price: '+$23,000',
    popular: false,
  },
];

export default function StepBattery({ value, onChange }) {
  return (
    <div>
      <h2 className="step-title">Do you want battery storage?</h2>
      <p className="step-desc">Battery storage lets you use solar energy at night and during grid outages.</p>

      <div className="option-grid">
        {BATTERY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`option-card battery-card ${value === opt.value ? 'selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.popular && <span className="popular-badge">Most Popular</span>}
            <div className="battery-row">
              <span className="option-icon" style={{ marginBottom: 0 }}>{opt.icon}</span>
              <div className="battery-info">
                <div className="option-label">{opt.label}</div>
                <div className="option-desc">{opt.desc}</div>
              </div>
              <div className="battery-price">{opt.price}</div>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .battery-card {
          text-align: left;
          padding: 14px 16px;
          position: relative;
        }
        .battery-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .battery-info {
          flex: 1;
        }
        .battery-price {
          font-size: 13px;
          font-weight: 700;
          color: #1e40af;
          white-space: nowrap;
        }
        .popular-badge {
          position: absolute;
          top: -1px;
          right: 12px;
          background: #f59e0b;
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
