import React from 'react';

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

export default function StepLocation({ zip, state, onZipChange, onStateChange }) {
  return (
    <div>
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

      <div className="location-note">
        <span className="note-icon">🌞</span>
        <span>States like California, Arizona, and Texas get more sun hours — meaning higher solar production and bigger savings.</span>
      </div>

      <style>{`
        .location-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
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
          border-color: #1e40af;
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
        }
        .note-icon {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
