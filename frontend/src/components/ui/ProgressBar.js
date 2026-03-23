import React from 'react';

export default function ProgressBar({ current, total, steps, embedded, primaryColor }) {
  const accent = primaryColor || '#2563eb';
  const progressStep = current - 1; // 0-based index
  const pct = total > 1 ? (progressStep / (total - 1)) * 100 : 0;
  const currentLabel = steps[progressStep]?.label || '';

  return (
    <div style={{
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      padding: embedded ? '10px 16px 12px' : '12px 24px 14px',
    }}>
      {/* Step name + counter on one line */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: accent,
          letterSpacing: '0.02em',
        }}>
          {currentLabel}
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          color: '#94a3b8',
        }}>
          {current} / {total}
        </span>
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
