import React from 'react';
import { AlertTriangleIcon } from '../../ui/Icons';
import {
  HouseIllustration,
  CondoIllustration,
  ApartmentIllustration,
  OwnsHomeIllustration,
  RentsHomeIllustration,
} from './Illustrations';

const HOME_TYPES = [
  { value: 'house',     Illustration: HouseIllustration,     color: '#1c3a5e', bg: '#e3eaf3', label: 'House',     desc: 'Single-family home' },
  { value: 'condo',     Illustration: CondoIllustration,     color: '#4f46e5', bg: '#eef2ff', label: 'Condo',     desc: 'Condominium unit' },
  { value: 'apartment', Illustration: ApartmentIllustration, color: '#7c3aed', bg: '#f5f3ff', label: 'Apartment', desc: 'Apartment unit' },
];

const OWN_OPTIONS = [
  { value: true,  Illustration: OwnsHomeIllustration,  color: '#059669', bg: '#ecfdf5', label: 'I own it' },
  { value: false, Illustration: RentsHomeIllustration, color: '#64748b', bg: '#f1f5f9', label: 'I rent it' },
];

export default function StepHome({ homeType, ownsHome, onHomeTypeChange, onOwnsHomeChange }) {
  const isDisqualified = homeType === 'apartment' || homeType === 'condo' || ownsHome === false;

  return (
    <div>
      <h2 className="step-title">What type of home do you live in?</h2>
      <p className="step-desc">This helps determine if solar is a good fit for your property.</p>

      <div className="option-grid option-grid-3">
        {HOME_TYPES.map((opt, i) => (
          <button
            key={opt.value}
            className={`option-card illus-card sh-card ${homeType === opt.value ? 'selected' : ''}`}
            onClick={() => { onHomeTypeChange(opt.value); onOwnsHomeChange(null); }}
            style={{
              ...(homeType === opt.value ? { borderColor: opt.color, background: opt.bg } : {}),
              animationDelay: `${i * 45}ms`,
            }}
          >
            <span className="option-icon illus-icon">
              <opt.Illustration />
            </span>
            <div className="option-label">{opt.label}</div>
            <div className="option-desc">{opt.desc}</div>
          </button>
        ))}
      </div>

      {homeType === 'house' && ownsHome === null && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 10 }}>Do you own or rent this home?</p>
          <div className="option-grid option-grid-2">
            {OWN_OPTIONS.map((opt, i) => (
              <button
                key={String(opt.value)}
                className={`option-card illus-card sh-card ${ownsHome === opt.value ? 'selected' : ''}`}
                onClick={() => onOwnsHomeChange(opt.value)}
                style={{
                  ...(ownsHome === opt.value ? { borderColor: opt.color, background: opt.bg } : {}),
                  animationDelay: `${i * 45}ms`,
                }}
              >
                <span className="option-icon illus-icon">
                  <opt.Illustration />
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

      <style>{`
        @keyframes sh-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sh-card { animation: sh-in 0.3s ease backwards; }
        .illus-card { padding: 10px 8px 12px; }
        .illus-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
          border-radius: 8px;
          overflow: hidden;
        }
        .illus-icon svg { display: block; border-radius: 8px; width: 80px; height: 60px; }
        .embed-content .illus-card { padding: 8px 6px 10px; }
        .embed-content .illus-icon svg { width: 70px; height: 52px; }
      `}</style>
    </div>
  );
}
