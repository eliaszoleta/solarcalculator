import React from 'react';
import {
  FullSunIllustration,
  PartialShadeIllustration,
  MostlyShadeIllustration,
  AsphaltShinglesIllustration,
  MetalRoofIllustration,
  TileRoofIllustration,
  FlatRoofIllustration,
} from './Illustrations';

const SUN_OPTIONS = [
  { value: 'full',         Illustration: FullSunIllustration,     color: '#d97706', bg: '#fffbeb', label: 'Full Sun',      desc: 'Most of roof in direct sun' },
  { value: 'partial',      Illustration: PartialShadeIllustration, color: '#ea580c', bg: '#fff7ed', label: 'Partial Shade', desc: 'Some shading from trees/buildings' },
  { value: 'mostly_shade', Illustration: MostlyShadeIllustration,  color: '#64748b', bg: '#f1f5f9', label: 'Mostly Shade',  desc: 'Heavy shade most of day' },
];

const ROOF_TYPES = [
  { value: 'asphalt', Illustration: AsphaltShinglesIllustration, color: '#2563eb', bg: '#eff6ff', label: 'Asphalt Shingles', desc: 'Most common, easiest install', extra: '' },
  { value: 'metal',   Illustration: MetalRoofIllustration,       color: '#475569', bg: '#f1f5f9', label: 'Metal Roof',       desc: 'Standing seam metal',          extra: '+$500' },
  { value: 'tile',    Illustration: TileRoofIllustration,        color: '#0d9488', bg: '#f0fdfa', label: 'Tile Roof',        desc: 'Clay or concrete tile',         extra: '+$1,500' },
  { value: 'flat',    Illustration: FlatRoofIllustration,        color: '#4f46e5', bg: '#eef2ff', label: 'Flat Roof',        desc: 'Requires tilt mounting',        extra: '+$800' },
];

export default function StepRoof({ sunExposure, roofType, onExposureChange, onRoofChange }) {
  return (
    <div>
      <h2 className="step-title">Tell us about your roof</h2>
      <p className="step-desc">Roof exposure and type affect system efficiency and installation cost.</p>

      <div className="roof-section-label">How much sun does your roof get?</div>
      <div className="option-grid option-grid-3" style={{ marginBottom: 24 }}>
        {SUN_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`option-card illus-card ${sunExposure === opt.value ? 'selected' : ''}`}
            onClick={() => onExposureChange(opt.value)}
            style={sunExposure === opt.value ? { borderColor: opt.color, background: opt.bg } : {}}
          >
            <span className="option-icon illus-icon">
              <opt.Illustration />
            </span>
            <div className="option-label">{opt.label}</div>
            <div className="option-desc">{opt.desc}</div>
          </button>
        ))}
      </div>

      <div className="roof-section-label">What type of roof do you have?</div>
      <div className="option-grid option-grid-2">
        {ROOF_TYPES.map(opt => (
          <button
            key={opt.value}
            className={`option-card illus-card-compact ${roofType === opt.value ? 'selected' : ''}`}
            onClick={() => onRoofChange(opt.value)}
            style={roofType === opt.value ? { borderColor: opt.color, background: opt.bg } : {}}
          >
            <span className="option-icon illus-icon illus-icon-compact">
              <opt.Illustration />
            </span>
            <div className="option-label" style={{ fontSize: 12 }}>{opt.label}</div>
            <div className="option-desc" style={{ fontSize: 11 }}>{opt.desc}</div>
            {opt.extra && <div className="option-price" style={{ fontSize: 11 }}>{opt.extra}</div>}
          </button>
        ))}
      </div>

      <style>{`
        .roof-section-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .illus-card { padding: 10px 8px 12px; }
        .illus-card-compact { padding: 8px 8px 10px; text-align: center; }
        .illus-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
          border-radius: 8px;
          overflow: hidden;
        }
        .illus-icon svg { display: block; border-radius: 8px; }
        .illus-icon-compact { margin-bottom: 6px; }
        .illus-icon-compact svg { width: 100%; height: auto; }
        .embed-content .illus-card { padding: 8px 6px 10px; }
        .embed-content .illus-icon svg { width: 70px; height: 52px; }
        .embed-content .illus-icon-compact svg { width: 58px; height: 45px; }
      `}</style>
    </div>
  );
}
