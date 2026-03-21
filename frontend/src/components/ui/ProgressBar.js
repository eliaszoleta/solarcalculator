import React from 'react';

export default function ProgressBar({ current, total, steps, embedded }) {
  return (
    <div style={{ padding: embedded ? '14px 28px 0' : '28px 36px 0' }}>

      {/* Step dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: embedded ? 10 : 20 }}>
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;
          return (
            <React.Fragment key={s.label}>
              {/* Connector line */}
              {i > 0 && (
                <div style={{
                  flex: 1,
                  height: 1,
                  background: isDone || isActive ? '#0a0a0a' : '#e5e7eb',
                  transition: 'background 0.3s ease',
                  margin: '0 2px',
                }} />
              )}
              {/* Step dot */}
              <div
                title={s.label}
                style={{
                  width: isActive ? 28 : 22,
                  height: isActive ? 28 : 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  background: isDone
                    ? '#0a0a0a'
                    : isActive
                    ? '#0a0a0a'
                    : '#f3f4f6',
                  border: isActive ? 'none' : isDone ? 'none' : '1.5px solid #e5e7eb',
                }}
              >
                {isDone ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isActive ? (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffffff' }} />
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af' }}>{stepNum}</span>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Current step label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: embedded ? 2 : 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 6 }}>
          {steps[current - 1]?.icon}
          {steps[current - 1]?.label}
        </span>
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
          {current} of {total}
        </span>
      </div>
    </div>
  );
}
