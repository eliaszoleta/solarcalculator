import React from 'react';

export default function ProgressBar({ current, total, steps, embedded, primaryColor }) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100);

  return (
    <div style={{ padding: embedded ? '20px 24px 10px' : '22px 32px 14px' }}>

      {/* Thin fill bar */}
      <div style={{
        height: 4,
        borderRadius: 999,
        background: '#e9ecef',
        marginBottom: embedded ? 10 : 14,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 999,
          background: '#94a3b8',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Step label + counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>{steps[current - 1]?.icon}</span>
          {steps[current - 1]?.label}
        </span>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
          {current} of {total}
        </span>
      </div>
    </div>
  );
}
