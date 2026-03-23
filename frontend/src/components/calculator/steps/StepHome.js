import React from 'react';
import { HomeIcon, BuildingIcon, KeyIcon, FileTextIcon, AlertTriangleIcon } from '../../ui/Icons';

const HOME_TYPES = [
  { value: 'house',     Icon: HomeIcon,     color: '#2563eb', bg: '#eff6ff', label: 'House',     desc: 'Single-family home' },
  { value: 'condo',     Icon: BuildingIcon, color: '#4f46e5', bg: '#eef2ff', label: 'Condo',     desc: 'Condominium unit' },
  { value: 'apartment', Icon: BuildingIcon, color: '#7c3aed', bg: '#f5f3ff', label: 'Apartment', desc: 'Apartment unit' },
];

const OWN_OPTIONS = [
  { value: true,  Icon: KeyIcon,      color: '#059669', bg: '#ecfdf5', label: 'I own it' },
  { value: false, Icon: FileTextIcon, color: '#64748b', bg: '#f1f5f9', label: 'I rent it' },
];

function IconTile({ color, bg, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 48, height: 48, borderRadius: 12,
      background: bg, transition: 'all 0.15s',
    }}>
      {React.cloneElement(children, { color })}
    </span>
  );
}

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
            style={homeType === opt.value ? { borderColor: opt.color, background: opt.bg } : {}}
          >
            <span className="option-icon">
              <IconTile color={opt.color} bg={opt.bg}>
                <opt.Icon size={22} />
              </IconTile>
            </span>
            <div className="option-label">{opt.label}</div>
            <div className="option-desc">{opt.desc}</div>
          </button>
        ))}
      </div>

      {homeType === 'house' && ownsHome === null && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Do you own or rent this home?</p>
          <div className="option-grid option-grid-2">
            {OWN_OPTIONS.map(opt => (
              <button
                key={String(opt.value)}
                className={`option-card ${ownsHome === opt.value ? 'selected' : ''}`}
                onClick={() => onOwnsHomeChange(opt.value)}
                style={ownsHome === opt.value ? { borderColor: opt.color, background: opt.bg } : {}}
              >
                <span className="option-icon">
                  <IconTile color={opt.color} bg={opt.bg}>
                    <opt.Icon size={22} />
                  </IconTile>
                </span>
                <div className="option-label">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isDisqualified && (
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
          <AlertTriangleIcon size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, lineHeight: 1.5 }}>
            {(homeType === 'apartment' || homeType === 'condo') ? (
              <><strong>Solar isn't available for {homeType} units.</strong> However, <strong>community solar programs</strong> let you subscribe to a local solar farm and get credits on your bill — no rooftop needed.</>
            ) : (
              <><strong>You need to own your home to go solar.</strong> Solar panels are a permanent improvement requiring owner approval.</>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
