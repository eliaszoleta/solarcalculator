import React, { useState } from 'react';
import axios from 'axios';
import StepBill from './steps/StepBill';
import StepLocation from './steps/StepLocation';
import StepHome from './steps/StepHome';
import StepRoof from './steps/StepRoof';
import StepBattery from './steps/StepBattery';
import StepEquipment from './steps/StepEquipment';
import ResultsScreen from './ResultsScreen';
import ProgressBar from '../ui/ProgressBar';
import './SolarCalculator.css';

const TOTAL_STEPS = 6;

const initialForm = {
  monthlyBill: 200,
  zip: '',
  state: '',
  homeType: 'house',
  sunExposure: 'full',
  roofType: 'asphalt',
  battery: 'none',
  equipmentTier: 'standard',
};

export default function SolarCalculator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/calculate', form);
      if (data.success) {
        setResults(data.data);
        setStep(TOTAL_STEPS + 1);
      } else {
        setError('Calculation failed. Please check your inputs and try again.');
      }
    } catch (err) {
      setError('Unable to connect to calculation service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setForm(initialForm);
    setResults(null);
    setError(null);
  };

  if (results && step === TOTAL_STEPS + 1) {
    return <ResultsScreen results={results} onReset={reset} form={form} />;
  }

  const steps = [
    { label: 'Electric Bill', icon: '⚡' },
    { label: 'Location', icon: '📍' },
    { label: 'Home Type', icon: '🏠' },
    { label: 'Roof', icon: '🏗' },
    { label: 'Battery', icon: '🔋' },
    { label: 'Equipment', icon: '☀️' },
  ];

  return (
    <section className="calculator-section">
      <div className="calculator-container">
        <div className="calculator-header">
          <span className="calc-badge">Free Estimate</span>
          <h1 className="calc-title">How Much Will You Save Going Solar?</h1>
          <p className="calc-subtitle">Answer 6 quick questions and get your personalized solar savings estimate instantly.</p>
        </div>

        <div className="calculator-card">
          <ProgressBar current={step} total={TOTAL_STEPS} steps={steps} />

          <div className="step-content">
            {step === 1 && <StepBill value={form.monthlyBill} onChange={v => update('monthlyBill', v)} />}
            {step === 2 && <StepLocation zip={form.zip} state={form.state} onZipChange={v => update('zip', v)} onStateChange={v => update('state', v)} />}
            {step === 3 && <StepHome value={form.homeType} onChange={v => update('homeType', v)} />}
            {step === 4 && <StepRoof sunExposure={form.sunExposure} roofType={form.roofType} onExposureChange={v => update('sunExposure', v)} onRoofChange={v => update('roofType', v)} />}
            {step === 5 && <StepBattery value={form.battery} onChange={v => update('battery', v)} />}
            {step === 6 && <StepEquipment value={form.equipmentTier} onChange={v => update('equipmentTier', v)} />}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="step-nav">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={back} disabled={loading}>
                ← Back
              </button>
            )}
            <div className="step-counter">{step} of {TOTAL_STEPS}</div>
            {step < TOTAL_STEPS ? (
              <button className="btn btn-primary" onClick={next}>
                Next →
              </button>
            ) : (
              <button className="btn btn-cta" onClick={calculate} disabled={loading}>
                {loading ? (
                  <span className="loading-spinner">Calculating...</span>
                ) : (
                  '☀️ Calculate My Savings'
                )}
              </button>
            )}
          </div>
        </div>

        <div className="trust-badges">
          <span>🔒 No account needed</span>
          <span>⚡ Instant results</span>
          <span>✅ Free to use</span>
        </div>
      </div>
    </section>
  );
}
