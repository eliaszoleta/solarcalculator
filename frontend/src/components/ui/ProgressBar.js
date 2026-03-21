import React from 'react';

export default function ProgressBar({ current, total, steps, embedded, primaryColor }) {
  const accent = primaryColor || '#f59e0b';

  return (
    <div style={{ padding: embedded ? '24px 24px 10px' : '26px 32px 14px' }}>

      {/* Step dots + connectors */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: embedded ? 10 : 16 }}>
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;

          return (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <div style={{
                  flex: 1,
                  height: 2,
                  background: isDone ? accent : '#e9ecf0',
                  transition: 'background 0.4s ease',
                  borderRadius: 999,
                }} />
              )}

              <div
                title={s.label}
                style={{
                  width: isActive ? 30 : 24,
                  height: isActive ? 30 : 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  background: isDone ? accent : isActive ? '#fff' : '#f1f5f9',
                  border: isActive
                    ? `2.5px solid ${accent}`
                    : isDone
                    ? 'none'
                    : '1.5px solid #d1d5db',
                  boxShadow: isActive ? `0 0 0 5px ${accent}22` : 'none',
                }}
              >
                {isDone ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{stepNum}</span>
                ) : isActive ? (
                  <span style={{ fontSize: 11, fontWeight: 700, color: accent, lineHeight: 1 }}>{stepNum}</span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 500, color: '#b0b8c4', lineHeight: 1 }}>{stepNum}</span>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Current step label + counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: accent, display: 'flex', alignItems: 'center' }}>{steps[current - 1]?.icon}</span>
          {steps[current - 1]?.label}
        </span>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
          {current} of {total}
        </span>
      </div>
    </div>
  );
}
