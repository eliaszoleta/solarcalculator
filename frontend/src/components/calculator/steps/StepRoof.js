import React from 'react';
import { SunIcon, SunCloudIcon, CloudIcon, HomeIcon, LayersIcon, LayoutIcon, MinusSquareIcon } from '../../ui/Icons';

const SUN_OPTIONS = [
  { value: 'full', icon: <SunIcon size={24} />, label: 'Full Sun', desc: 'Most of roof in direct sun' },
  { value: 'partial', icon: <SunCloudIcon size={24} />, label: 'Partial Shade', desc: 'Some shading from trees/buildings' },
  { value: 'mostly_shade', icon: <CloudIcon size={24} />, label: 'Mostly Shade', desc: 'Heavy shade most of day' },
];

const ROOF_TYPES = [
  { value: 'asphalt', icon: <HomeIcon size={24} />, label: 'Asphalt Shingles', desc: 'Most common, easiest install', extra: '' },
  { value: 'metal', icon: <LayersIcon size={24} />, label: 'Metal Roof', desc: 'Standing seam metal', extra: '+$500' },
  { value: 'tile', icon: <LayoutIcon size={24} />, label: 'Tile Roof', desc: 'Clay or concrete tile', extra: '+$1,500' },
  { value: 'flat', icon: <MinusSquareIcon size={24} />, label: 'Flat Roof', desc: 'Requires tilt mounting', extra: '+$800' },
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
            className={`option-card ${sunExposure === opt.value ? 'selected' : ''}`}
            onClick={() => onExposureChange(opt.value)}
          >
            <span className="option-icon">{opt.icon}</span>
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
            className={`option-card ${roofType === opt.value ? 'selected' : ''}`}
            onClick={() => onRoofChange(opt.value)}
          >
            <span className="option-icon">{opt.icon}</span>
            <div className="option-label">{opt.label}</div>
            <div className="option-desc">{opt.desc}</div>
            {opt.extra && <div className="option-price">{opt.extra}</div>}
          </button>
        ))}
      </div>

      <style>{`
        .roof-section-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
