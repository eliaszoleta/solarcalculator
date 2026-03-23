import React from 'react';

export default function ProgressBar({ current, total, steps, embedded, primaryColor }) {
  const accent = primaryColor || '#2563eb';
  const progressStep = current - 1; // 0-based index of current step
  const pct = total > 1 ? (progressStep / (total - 1)) * 100 : 0;

  return (
    <div style={{
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      padding: embedded ? '12px 16px' : '14px 24px',
    }}>
      {/* Step labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {steps.map((s, i) => (
          <span key={s.label} style={{
            fontSize: 12,
            fontWeight: 600,
            color: i <= progressStep ? accent : '#94a3b8',
            transition: 'color 0.3s ease',
          }}>
            {s.label}
          </span>
        ))}
      </div>

      {/* Fill bar */}
      <div style={{ height: 3, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: accent,
          borderRadius: 2,
          transition: 'width 0.35s ease',
        }} />
      </div>
    </div>
  );
}
