import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import StepBill from './steps/StepBill';
import StepLocation from './steps/StepLocation';
import StepHome from './steps/StepHome';
import StepRoof from './steps/StepRoof';
import StepBattery from './steps/StepBattery';
import StepLead from './steps/StepLead';
import ResultsScreen from './ResultsScreen';
import ProgressBar from '../ui/ProgressBar';
import { BoltIcon, MapPinIcon, HomeIcon, BuildingIcon, BatteryIcon, UserIcon, LockIcon, CheckCircleIcon } from '../ui/Icons';
import './SolarCalculator.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

// Steps 1-5 are the calculator questions; step 6 is the lead gate
const TOTAL_STEPS = 6;

const initialForm = {
  monthlyBill: 200,
  zip: '',
  state: '',
  homeType: 'house',
  ownsHome: null,
  sunExposure: 'full',
  roofType: 'asphalt',
  battery: 'none',
  equipmentTier: 'standard', // fixed — removed from UI, always standard
};

export default function SolarCalculator({ embedded, installerConfig, installerId }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState(null);
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Auto-resize iframe when content height changes
  useEffect(() => {
    if (!embedded) return;
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'sc-resize', height }, '*');
    };
    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [embedded, step, results]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 1));

  // Called when lead form is submitted — run calculation and show results
  const handleLeadSubmit = async (leadData) => {
    setLead(leadData);
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        lead: leadData,
        ...(installerId ? { installerId } : {}),
      };
      const { data } = await axios.post(`${API_BASE}/api/calculate`, payload);
      if (data.success) {
        setResults(data.data);
        setStep(TOTAL_STEPS + 1);
        // Persist lead to Supabase (fire-and-forget, don't block UX on failure)
        supabase.from('leads').insert({
          installer_id: installerId || null,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          timeline: leadData.timeline,
          payment_method: leadData.paymentMethod,
          monthly_bill: parseFloat(form.monthlyBill),
          state: form.state || null,
          zip: form.zip || null,
          system_size_kw: data.data.system?.sizeKw || null,
          annual_savings: data.data.savings?.annual || null,
          total_cost: data.data.cost?.total || null,
        }).then(({ error }) => { if (error) console.error('Lead save error:', error.message); });
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
    setLead(null);
    setError(null);
  };

  if (results && step === TOTAL_STEPS + 1) {
    return <ResultsScreen results={results} onReset={reset} form={form} lead={lead} installerConfig={installerConfig} embedded={embedded} />;
  }

  const steps = [
    { label: 'Electric Bill', icon: <BoltIcon size={14} /> },
    { label: 'Location', icon: <MapPinIcon size={14} /> },
    { label: 'Home Type', icon: <HomeIcon size={14} /> },
    { label: 'Roof', icon: <BuildingIcon size={14} /> },
    { label: 'Battery', icon: <BatteryIcon size={14} /> },
    { label: 'Your Info', icon: <UserIcon size={14} /> },
  ];

  const serviceStates = installerConfig?.serviceStates || [];
  const isOutOfArea = step === 2 && serviceStates.length > 0 && form.state && !serviceStates.includes(form.state);

  // Disqualify if apartment/condo or renter — block Next button on step 3
  const isDisqualified = step === 3 && (
    form.homeType === 'apartment' ||
    form.homeType === 'condo' ||
    form.ownsHome === false
  );

  // On step 3 (house selected), require ownsHome to be answered before proceeding
  const step3Incomplete = step === 3 && form.homeType === 'house' && form.ownsHome === null;

  const canProceed = !isOutOfArea && !isDisqualified && !step3Incomplete;

  return (
    <section className="calculator-section" ref={containerRef} style={embedded ? { padding: '24px 16px 32px', minHeight: 'unset' } : {}}>
      <div className="calculator-container">
        <div className="calculator-header">
          <span className="calc-badge">Free Estimate</span>
          <h1 className="calc-title">How Much Will You Save Going Solar?</h1>
          <p className="calc-subtitle">Answer 5 quick questions and get your personalized solar savings estimate instantly.</p>
        </div>

        <div className="calculator-card">
          <ProgressBar current={step} total={TOTAL_STEPS} steps={steps} />

          <div className="step-content">
            {step === 1 && <StepBill value={form.monthlyBill} onChange={v => update('monthlyBill', v)} />}
            {step === 2 && <StepLocation zip={form.zip} state={form.state} onZipChange={v => update('zip', v)} onStateChange={v => update('state', v)} serviceStates={serviceStates} />}
            {step === 3 && (
              <StepHome
                homeType={form.homeType}
                ownsHome={form.ownsHome}
                onHomeTypeChange={v => update('homeType', v)}
                onOwnsHomeChange={v => update('ownsHome', v)}
              />
            )}
            {step === 4 && <StepRoof sunExposure={form.sunExposure} roofType={form.roofType} onExposureChange={v => update('sunExposure', v)} onRoofChange={v => update('roofType', v)} />}
            {step === 5 && <StepBattery value={form.battery} onChange={v => update('battery', v)} />}
            {step === 6 && <StepLead onSubmit={handleLeadSubmit} loading={loading} requireContact={!!installerId} />}
          </div>

          {error && <div className="error-banner">{error}</div>}

          {/* Nav — hidden on step 6 (lead form has its own submit button) */}
          {step < 6 && (
            <div className="step-nav">
              {step > 1 && (
                <button className="btn btn-secondary" onClick={back}>
                  ← Back
                </button>
              )}
              <div className="step-counter">{step} of 5</div>
              <button
                className="btn btn-primary"
                onClick={next}
                disabled={!canProceed}
                title={isDisqualified ? "Solar is not available for this home type" : step3Incomplete ? "Please answer the ownership question" : ""}
              >
                Next →
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="step-nav">
              <button className="btn btn-secondary" onClick={back} disabled={loading}>
                ← Back
              </button>
              <div className="step-counter">Almost done</div>
              <div />
            </div>
          )}
        </div>

        <div className="trust-badges">
          <span><LockIcon size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />No account needed</span>
          <span><BoltIcon size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Instant results</span>
          <span><CheckCircleIcon size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Free to use</span>
        </div>
      </div>
    </section>
  );
}
