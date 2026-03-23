import React from 'react';
import { SunIcon, SunCloudIcon, CloudIcon, HomeIcon, LayersIcon, LayoutIcon, MinusSquareIcon } from '../../ui/Icons';

const SUN_OPTIONS = [
  { value: 'full',         Icon: SunIcon,       color: '#d97706', bg: '#fffbeb', label: 'Full Sun',      desc: 'Most of roof in direct sun' },
  { value: 'partial',      Icon: SunCloudIcon,  color: '#ea580c', bg: '#fff7ed', label: 'Partial Shade', desc: 'Some shading from trees/buildings' },
  { value: 'mostly_shade', Icon: CloudIcon,     color: '#64748b', bg: '#f1f5f9', label: 'Mostly Shade',  desc: 'Heavy shade most of day' },
];

const ROOF_TYPES = [
  { value: 'asphalt', Icon: HomeIcon,        color: '#2563eb', bg: '#eff6ff', label: 'Asphalt Shingles', desc: 'Most common, easiest install', extra: '' },
  { value: 'metal',   Icon: LayersIcon,      color: '#475569', bg: '#f1f5f9', label: 'Metal Roof',       desc: 'Standing seam metal',          extra: '+$500' },
  { value: 'tile',    Icon: LayoutIcon,      color: '#0d9488', bg: '#f0fdfa', label: 'Tile Roof',        desc: 'Clay or concrete tile',         extra: '+$1,500' },
  { value: 'flat',    Icon: MinusSquareIcon, color: '#4f46e5', bg: '#eef2ff', label: 'Flat Roof',        desc: 'Requires tilt mounting',        extra: '+$800' },
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
            style={sunExposure === opt.value ? { borderColor: opt.color, background: opt.bg } : {}}
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

      <div className="roof-section-label">What type of roof do you have?</div>
      <div className="option-grid option-grid-2">
        {ROOF_TYPES.map(opt => (
          <button
            key={opt.value}
            className={`option-card ${roofType === opt.value ? 'selected' : ''}`}
            onClick={() => onRoofChange(opt.value)}
            style={roofType === opt.value ? { borderColor: opt.color, background: opt.bg } : {}}
          >
            <span className="option-icon">
              <IconTile color={opt.color} bg={opt.bg}>
                <opt.Icon size={22} />
              </IconTile>
            </span>
            <div className="option-label">{opt.label}</div>
            <div className="option-desc">{opt.desc}</div>
            {opt.extra && <div className="option-price">{opt.extra}</div>}
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
      `}</style>
    </div>
  );
}
