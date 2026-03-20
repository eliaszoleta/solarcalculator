import React from 'react';

export default function ProgressBar({ current, total, steps }) {
  const progress = ((current - 1) / (total - 1)) * 100;

  return (
    <div style={{ padding: '20px 32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>
          {steps[current - 1]?.icon} {steps[current - 1]?.label}
        </span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          {current} of {total}
        </span>
      </div>
      <div style={{
        height: 4,
        background: '#f1f5f9',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.max(5, progress)}%`,
          background: 'linear-gradient(90deg, #1e40af, #f59e0b)',
          borderRadius: 999,
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}
