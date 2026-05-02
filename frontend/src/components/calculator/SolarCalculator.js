import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import StepBill from './steps/StepBill';
import StepLocation from './steps/StepLocation';
import StepHome from './steps/StepHome';
import StepRoof from './steps/StepRoof';
import StepBattery from './steps/StepBattery';
import StepLead from './steps/StepLead';
import StepCustom from './steps/StepCustom';
import ResultsScreen from './ResultsScreen';
import ProgressBar from '../ui/ProgressBar';
import { BoltIcon, MapPinIcon, HomeIcon, BuildingIcon, BatteryIcon, UserIcon, LockIcon, CheckCircleIcon, SparklesIcon } from '../ui/Icons';
import './SolarCalculator.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

const BUILTIN_META = [
  null, // index 0 placeholder
  { label: 'Electric Bill', icon: <BoltIcon size={14} /> },
  { label: 'Location',      icon: <MapPinIcon size={14} /> },
  { label: 'Home Type',     icon: <HomeIcon size={14} /> },
  { label: 'Roof',          icon: <BuildingIcon size={14} /> },
  { label: 'Battery',       icon: <BatteryIcon size={14} /> },
  { label: 'Get Estimate',  icon: <UserIcon size={14} /> },
];

// Build an ordered list of all steps (built-in + custom interleaved)
function buildStepSequence(customSteps = []) {
  const result = [];
  for (let i = 1; i <= 5; i++) {
    result.push({ kind: 'builtin', index: i });
    (customSteps || [])
      .filter(s => s.insertAfterStep === i)
      .forEach(cs => result.push({ kind: 'custom', step: cs }));
  }
  result.push({ kind: 'builtin', index: 6 }); // lead form always last
  return result;
}

const initialForm = {
  monthlyBill: 200,
  zip: '',
  state: '',
  homeType: 'house',
  ownsHome: null,
  sunExposure: 'full',
  roofType: 'asphalt',
  battery: 'none',
  equipmentTier: 'standard',
  customAnswers: {},
};

export default function SolarCalculator({ embedded, installerConfig, installerId }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState(null);
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cardRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!cardRef.current) return;
      if (embedded) {
        cardRef.current.scrollTop = 0;
      } else {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [step, embedded]);

  const fontLinkRef = useRef(null);
  useEffect(() => {
    const font = installerConfig?.fontFamily;
    if (!font) return;
    if (fontLinkRef.current) fontLinkRef.current.remove();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
    fontLinkRef.current = link;
  }, [installerConfig?.fontFamily]);

  const customSteps = installerConfig?.customSteps || [];
  const allSteps = buildStepSequence(customSteps);
  const TOTAL_STEPS = allSteps.length;
  const currentStepDef = allSteps[step - 1] || allSteps[0];
  const leadStepPos = allSteps.findIndex(s => s.kind === 'builtin' && s.index === 6) + 1;
  const isOnLeadForm = currentStepDef?.kind === 'builtin' && currentStepDef?.index === 6;
  const isOnLocationStep = currentStepDef?.kind === 'builtin' && currentStepDef?.index === 2;
  const isOnHomeStep = currentStepDef?.kind === 'builtin' && currentStepDef?.index === 3;

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateCustomAnswer = (id, value) =>
    setForm(prev => ({ ...prev, customAnswers: { ...prev.customAnswers, [id]: value } }));

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 1));

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
        supabase.from('leads').insert({
          installer_id: installerId || null,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          timeline: leadData.timeline,
          payment_method: leadData.paymentMethod,
          monthly_bill: parseFloat(form.monthlyBill) || null,
          state: form.state || null,
          zip: form.zip || null,
          home_type: form.homeType || null,
          owns_home: form.ownsHome != null ? form.ownsHome : null,
          sun_exposure: form.sunExposure || null,
          roof_type: form.roofType || null,
          battery: form.battery || null,
          system_size_kw: data.data.system?.sizeKw || null,
          annual_savings: data.data.savings?.annual || null,
          total_cost: data.data.cost?.total || null,
          custom_answers: Object.keys(form.customAnswers || {}).length > 0 ? form.customAnswers : null,
        }).then(({ data: leadRow, error }) => {
          if (error) console.error('Lead save error:', error.message, error.details, error.hint);
          else console.log('Lead saved:', leadRow);
        });
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

  const progressSteps = allSteps.map(s =>
    s.kind === 'builtin'
      ? BUILTIN_META[s.index]
      : { label: s.step.label, icon: <SparklesIcon size={14} /> }
  );

  const serviceStates = installerConfig?.serviceStates || [];
  const isOutOfArea = isOnLocationStep && serviceStates.length > 0 && form.state && !serviceStates.includes(form.state);
  const isDisqualified = isOnHomeStep && (
    form.homeType === 'apartment' || form.homeType === 'condo' || form.ownsHome === false
  );
  const step3Incomplete = isOnHomeStep && form.homeType === 'house' && form.ownsHome === null;

  const customStepAnswered = currentStepDef?.kind !== 'custom' ||
    !currentStepDef.step.required ||
    form.customAnswers[currentStepDef.step.id] !== undefined;

  const canProceed = !isOutOfArea && !isDisqualified && !step3Incomplete && customStepAnswered;

  // Border radius: installer-configured or default 12px
  const borderRadius = installerConfig?.borderRadius !== undefined ? installerConfig.borderRadius : 12;

  return (
    <section
      className={`calculator-section${embedded ? ' embed-mode' : ''}`}
      style={installerConfig?.fontFamily ? { fontFamily: `'${installerConfig.fontFamily}', sans-serif` } : {}}
    >
      <div className="calculator-container">
        {!embedded && (
          <div className="calculator-header">
            <span className="calc-badge">Free Estimate</span>
            <h1 className="calc-title">Free Solar Panel Cost &amp; Savings Calculator</h1>
            <p className="calc-subtitle">Instant residential solar estimate — installation cost, monthly savings &amp; 30-year ROI based on real NREL data for your ZIP code.</p>
          </div>
        )}

        <div
          ref={cardRef}
          className={`calculator-card${embedded ? ' embed-card' : ''}`}
          style={{
            ...(installerConfig?.formBgColor ? { background: installerConfig.formBgColor } : {}),
            ...(embedded ? { borderRadius } : {}),
          }}
        >
          <ProgressBar current={step} total={TOTAL_STEPS} steps={progressSteps} embedded={embedded} primaryColor={installerConfig?.primaryColor} />

          <div className={`step-content${embedded ? ' embed-content' : ''}`} style={embedded ? { paddingTop: 32 } : {}}>
            {currentStepDef?.kind === 'builtin' && currentStepDef.index === 1 && (
              <StepBill value={form.monthlyBill} onChange={v => update('monthlyBill', v)} primaryColor={installerConfig?.primaryColor} />
            )}
            {currentStepDef?.kind === 'builtin' && currentStepDef.index === 2 && (
              <StepLocation zip={form.zip} state={form.state} onZipChange={v => update('zip', v)} onStateChange={v => update('state', v)} serviceStates={serviceStates} />
            )}
            {currentStepDef?.kind === 'builtin' && currentStepDef.index === 3 && (
              <StepHome
                homeType={form.homeType}
                ownsHome={form.ownsHome}
                onHomeTypeChange={v => update('homeType', v)}
                onOwnsHomeChange={v => update('ownsHome', v)}
              />
            )}
            {currentStepDef?.kind === 'builtin' && currentStepDef.index === 4 && (
              <StepRoof sunExposure={form.sunExposure} roofType={form.roofType} onExposureChange={v => update('sunExposure', v)} onRoofChange={v => update('roofType', v)} />
            )}
            {currentStepDef?.kind === 'builtin' && currentStepDef.index === 5 && (
              <StepBattery value={form.battery} onChange={v => update('battery', v)} />
            )}
            {currentStepDef?.kind === 'builtin' && currentStepDef.index === 6 && (
              <StepLead onSubmit={handleLeadSubmit} loading={loading} requireContact={!!installerId} embedded={embedded} primaryColor={installerConfig?.primaryColor} formBgColor={installerConfig?.formBgColor} />
            )}
            {currentStepDef?.kind === 'custom' && (
              <StepCustom
                step={currentStepDef.step}
                value={form.customAnswers[currentStepDef.step.id]}
                onChange={v => updateCustomAnswer(currentStepDef.step.id, v)}
                primaryColor={installerConfig?.primaryColor}
              />
            )}
          </div>

          {error && <div className="error-banner">{error}</div>}

          {!isOnLeadForm && (
            <div className={`step-nav${embedded ? ' embed-nav' : ''}`}>
              {step > 1 && (
                <button className="btn btn-secondary" onClick={back}>← Back</button>
              )}
              <div className="step-counter">{step} of {leadStepPos - 1}</div>
              <button
                className="btn btn-primary"
                onClick={next}
                disabled={!canProceed}
                title={
                  isDisqualified ? 'Solar is not available for this home type' :
                  step3Incomplete ? 'Please answer the ownership question' : ''
                }
                style={installerConfig?.primaryColor ? { background: installerConfig.primaryColor } : {}}
              >
                Next →
              </button>
            </div>
          )}

          {isOnLeadForm && (
            <div className={`step-nav${embedded ? ' embed-nav' : ''}`}>
              <button className="btn btn-secondary" onClick={back} disabled={loading}>← Back</button>
              <div className="step-counter">Almost done</div>
              <div />
            </div>
          )}
        </div>

        {!embedded && (
          <div className="trust-badges">
            <span><LockIcon size={13} color="#7c3aed" style={{ verticalAlign: 'middle', marginRight: 4 }} />No account needed</span>
            <span><BoltIcon size={13} color="#d97706" style={{ verticalAlign: 'middle', marginRight: 4 }} />Instant results</span>
            <span><CheckCircleIcon size={13} color="#059669" style={{ verticalAlign: 'middle', marginRight: 4 }} />Free to use</span>
          </div>
        )}
      </div>
    </section>
  );
}
