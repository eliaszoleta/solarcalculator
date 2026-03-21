import React from 'react';

export default function StepCustom({ step, value, onChange, primaryColor }) {
  const accent = primaryColor || '#1e40af';
  const selectedStyle = { borderColor: accent, background: `${accent}10` };

  if (step.type === 'yes-no') {
    const opts = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }];
    return (
      <div>
        <h2 className="step-title">{step.title}</h2>
        {step.description && <p className="step-desc">{step.description}</p>}
        <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {opts.map(opt => (
            <button
              key={opt.value}
              className={`option-card${value === opt.value ? ' selected' : ''}`}
              style={value === opt.value ? selectedStyle : {}}
              onClick={() => onChange(opt.value)}
            >
              <div className="option-label" style={{ fontSize: 16, padding: '8px 0' }}>{opt.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step.type === 'choice') {
    const opts = step.options || [];
    return (
      <div>
        <h2 className="step-title">{step.title}</h2>
        {step.description && <p className="step-desc">{step.description}</p>}
        <div className="option-grid" style={opts.length <= 2 ? { gridTemplateColumns: '1fr 1fr' } : {}}>
          {opts.map(opt => (
            <button
              key={opt.value}
              className={`option-card${value === opt.value ? ' selected' : ''}`}
              style={value === opt.value ? selectedStyle : {}}
              onClick={() => onChange(opt.value)}
            >
              <div className="option-label">{opt.label}</div>
              {opt.description && <div className="option-desc">{opt.description}</div>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step.type === 'text') {
    return (
      <div>
        <h2 className="step-title">{step.title}</h2>
        {step.description && <p className="step-desc">{step.description}</p>}
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={step.placeholder || 'Your answer…'}
          style={{
            width: '100%',
            padding: '13px 16px',
            border: `1.5px solid ${value ? accent : '#e2e8f0'}`,
            borderRadius: 10,
            fontSize: 16,
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = accent)}
          onBlur={e => (e.target.style.borderColor = value ? accent : '#e2e8f0')}
        />
      </div>
    );
  }

  return null;
}
