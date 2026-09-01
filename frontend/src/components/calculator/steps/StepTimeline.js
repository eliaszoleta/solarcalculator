import React, { useState } from 'react';
import { SunIcon, ClockIcon, CalendarIcon, SparklesIcon } from '../../ui/Icons';

const TIMELINES = [
  { value: 'asap', Icon: ClockIcon,     label: 'ASAP', desc: 'Ready to move forward now' },
  { value: '3months', Icon: CalendarIcon, label: 'Within 3 months', desc: 'Actively researching' },
  { value: '6months', Icon: CalendarIcon, label: 'Within 6 months', desc: 'Planning ahead' },
  { value: 'exploring', Icon: SparklesIcon, label: 'Just exploring', desc: 'Curious about solar' },
];

export default function StepTimeline({ timeline, onTimelineChange, onSubmit, loading, requireContact, embedded, primaryColor, formBgColor }) {
  const [error, setError] = useState(null);
  const accentColor = primaryColor || '#1b4d3e';

  const handleSubmit = e => {
    e.preventDefault();
    if (!timeline) { setError('Please select a timeline'); return; }
    onSubmit();
  };

  return (
    <div className="st-fade-in" style={formBgColor ? { background: formBgColor, borderRadius: 12, padding: embedded ? '8px 4px' : '12px 4px' } : {}}>
      <h2 className="step-title">When are you looking to go solar?</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: embedded ? 6 : 10 }}>
        <div>
          <div className="option-grid option-grid-2">
            {TIMELINES.map((t, i) => (
              <button
                key={t.value}
                type="button"
                className={`option-card option-card-sm st-card${timeline === t.value ? ' st-selected' : ''}`}
                onClick={() => { onTimelineChange(t.value); setError(null); }}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <t.Icon size={15} className="st-card-icon" style={{ marginBottom: 4 }} />
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
        @keyframes st-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .st-fade-in { animation: st-in 0.3s ease; }
        .st-card { animation: st-in 0.3s ease backwards; }
        .st-card-icon { color: #94a3b8; transition: color 0.15s; }
        .st-selected .st-card-icon { color: white; }
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
