import React, { useState } from 'react';
import { SunIcon } from '../../ui/Icons';

const TIMELINES = [
  { value: 'asap', label: 'ASAP', desc: 'Ready to move forward now' },
  { value: '3months', label: 'Within 3 months', desc: 'Actively researching' },
  { value: '6months', label: 'Within 6 months', desc: 'Planning ahead' },
  { value: 'exploring', label: 'Just exploring', desc: 'Curious about solar' },
];

export default function StepTimeline({ timeline, onTimelineChange, onSubmit, loading, requireContact, embedded, primaryColor, formBgColor }) {
  const [error, setError] = useState(null);
  const accentColor = primaryColor || '#1c3a5e';

  const handleSubmit = e => {
    e.preventDefault();
    if (!timeline) { setError('Please select a timeline'); return; }
    onSubmit();
  };

  return (
    <div style={formBgColor ? { background: formBgColor, borderRadius: 12, padding: embedded ? '8px 4px' : '12px 4px' } : {}}>
      <h2 className="step-title">Almost there!</h2>
      <p className="step-desc">When are you looking to go solar?</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: embedded ? 6 : 10 }}>
        <div>
          <div className="option-grid option-grid-2">
            {TIMELINES.map(t => (
              <button
                key={t.value}
                type="button"
                className={`option-card option-card-sm${timeline === t.value ? ' st-selected' : ''}`}
                onClick={() => { onTimelineChange(t.value); setError(null); }}
              >
                <div className="option-label">{t.label}</div>
                <div className="option-desc">{t.desc}</div>
              </button>
            ))}
          </div>
          {error && <div className="field-error">{error}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-cta"
          disabled={loading}
          style={{
            marginTop: 4,
            background: accentColor,
            boxShadow: `0 4px 14px ${accentColor}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {loading ? 'Calculating...' : <><SunIcon size={14} style={{ marginRight: 7, flexShrink: 0 }} />Show My Free Estimate →</>}
        </button>
      </form>

      {requireContact && (
        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 10 }}>
          No spam. No commitment. One call with a certified installer.
        </p>
      )}

      <style>{`
        .field-error { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .option-card-sm { padding: ${embedded ? '6px 8px' : '9px 12px'}; }
        .option-grid-2 { grid-template-columns: 1fr 1fr; gap: ${embedded ? '6px' : '8px'}; }
        .st-selected { border-color: ${accentColor} !important; background: ${accentColor} !important; }
        .st-selected .option-label, .st-selected .option-desc { color: white; }
        .btn-cta:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
