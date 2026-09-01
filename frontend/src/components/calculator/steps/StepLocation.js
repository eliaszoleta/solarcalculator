import React from 'react';
import { MapPinIcon, SunIcon } from '../../ui/Icons';
import { getAllStates } from '../../../data/statePricing';

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ['DC','Washington D.C.'],
];

export default function StepLocation({ zip, state, onZipChange, onStateChange, serviceStates }) {
  const isOutOfArea = serviceStates && serviceStates.length > 0 && state && !serviceStates.includes(state);
  const stateData = state ? getAllStates().find(s => s.code === state) : null;

  return (
    <div className="sloc-fade-in">
      <div className="sloc-medallion"><MapPinIcon size={20} color="#1b4d3e" /></div>
      <h2 className="step-title">Where is your home located?</h2>
      <p className="step-desc">Your location determines sunlight availability, electricity rates, and solar incentives.</p>

      <div className="location-fields">
        <div className="field-group">
          <label className="field-label">ZIP Code <span className="optional">(optional — improves accuracy)</span></label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="e.g. 78701"
            value={zip}
            onChange={e => onZipChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="field-input"
          />
        </div>

        <div className="field-divider">or</div>

        <div className="field-group">
          <label className="field-label">State</label>
          <select
            value={state}
            onChange={e => onStateChange(e.target.value)}
            className="field-input"
          >
            <option value="">Select your state...</option>
            {US_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {isOutOfArea ? (
        <div style={{
          marginTop: 14,
          padding: '8px 12px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          color: '#92400e',
        }}>
          <MapPinIcon size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, lineHeight: 1.5 }}>
            <strong>We don't currently serve {state}.</strong> This installer operates in a specific service area — try a different state or contact them directly.
          </span>
        </div>
      ) : stateData ? (
        <div className="location-note sloc-note-live">
          <span className="note-icon"><SunIcon size={16} /></span>
          <span>
            <strong>{stateData.name}</strong> gets <strong>{stateData.sunHours} peak sun hours/day</strong> and averages <strong>{(stateData.electricityRate * 100).toFixed(1)}&cent;/kWh</strong> — both factor directly into your system size and savings estimate.
          </span>
        </div>
      ) : (
        <div className="location-note">
          <span className="note-icon"><SunIcon size={16} /></span>
          <span>States like California, Arizona, and Texas get more sun hours — meaning higher solar production and bigger savings.</span>
        </div>
      )}

      <style>{`
        @keyframes sloc-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sloc-fade-in { animation: sloc-in 0.3s ease; }
        .sloc-medallion {
          width: 40px; height: 40px; border-radius: 11px;
          background: #eaf3ee; border: 1.5px solid #c7d2e0;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
          animation: sloc-in 0.3s ease;
        }
        .sloc-note-live { animation: sloc-in 0.25s ease; background: #eaf3ee !important; color: #123529 !important; }
        .sloc-note-live .note-icon { color: #1b4d3e; }
        .location-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          animation: sloc-in 0.35s ease 0.05s backwards;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }
        .optional {
          font-weight: 400;
          color: #9ca3af;
          font-size: 12px;
        }
        .field-input {
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #1e293b;
          background: white;
          transition: border-color 0.12s;
          outline: none;
          width: 100%;
        }
        .field-input:focus {
          border-color: #1b4d3e;
          box-shadow: 0 0 0 3px rgba(28,58,94,0.08);
        }
        .field-divider {
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
        }
        .location-note {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 12px 14px;
          background: #fef3c7;
          border-radius: 10px;
          font-size: 13px;
          color: #78350f;
          animation: sloc-in 0.35s ease 0.1s backwards;
        }
        .note-icon {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
