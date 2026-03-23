import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { supabase } from '../../lib/supabase';
import { CreditCardIcon, CheckCircleIcon, MailIcon } from '../ui/Icons';
import './ResultsScreen.css';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

function fmtDollar(n) {
  return '$' + fmt(Math.abs(n));
}

const SITE_URL = process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

function buildFullReportUrl(results, form, lead) {
  try {
    const payload = JSON.stringify({ r: results, b: form.monthlyBill, s: form.state || results.inputs?.state, p: lead?.paymentMethod });
    return `${SITE_URL}/results#${btoa(unescape(encodeURIComponent(payload)))}`;
  } catch {
    return `${SITE_URL}/`;
  }
}

export default function ResultsScreen({ results, onReset, form, lead, installerConfig, embedded }) {
  const { system, cost, incentives, savings, chart } = results;
  const cta = installerConfig || {};

  const isCash = lead?.paymentMethod === 'cash';

  // Must be declared before any conditional returns (Rules of Hooks)
  const [showModal, setShowModal] = useState(false);

  // Scroll to top when results load (only for standalone full-page view)
  useEffect(() => {
    if (!embedded) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [embedded]);

  // Compact embed view — keeps the iframe frame fixed; full report opens in a popup modal
  if (embedded) {
    const hasFinancing = !isCash && savings.monthlyPaymentFinanced > 0;
    const daySavings = hasFinancing ? savings.netMonthlyFinanced : savings.monthly;

    return (
      <>
        <div style={{ padding: '28px 20px 32px', fontFamily: installerConfig?.fontFamily ? `'${installerConfig.fontFamily}', sans-serif` : "'Poppins', sans-serif", maxWidth: 540, margin: '0 auto' }}>

          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999, marginBottom: 10 }}>
              Your Solar Estimate
            </span>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {isCash
                ? <>{fmtDollar(incentives.netCost)} net cost — paid off in {savings.paybackYears} yrs</>
                : <>Save <span style={{ color: '#1e40af' }}>{fmtDollar(daySavings)}/mo</span> from day one</>
              }
            </div>
          </div>

          {/* Key metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: isCash ? 'Net Cost' : 'Day-1 Savings', value: isCash ? fmtDollar(incentives.netCost) : fmtDollar(daySavings) + '/mo' },
              { label: '30-Year Savings', value: fmtDollar(savings.thirtyYear), highlight: true },
              { label: 'Payback', value: savings.paybackYears ? `${savings.paybackYears} yrs` : 'N/A' },
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{ background: highlight ? '#1e3a8a' : '#f8fafc', border: `1px solid ${highlight ? '#1e3a8a' : '#e2e8f0'}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: highlight ? '#bfdbfe' : '#64748b', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: highlight ? 'white' : '#0f172a' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* System size pill */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Recommended: <strong style={{ color: '#0f172a' }}>{system.sizeKw} kW</strong> ({system.panelCount} panels) · {system.offsetPercent}% energy offset
            </span>
          </div>

          {/* Installer CTA */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #1e40af)', borderRadius: 16, padding: '20px 20px', textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 6 }}>
              {cta.ctaHeadline || 'Ready to Go Solar?'}
            </div>
            <div style={{ fontSize: 13, color: '#bfdbfe', marginBottom: 16, lineHeight: 1.5 }}>
              {cta.ctaSubtext || 'Get a custom quote from a local installer — free, no obligation.'}
            </div>
            {cta.companyName && (
              <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600, marginBottom: 12 }}>{cta.companyName}</div>
            )}
            <a
              href={cta.ctaButtonUrl || (cta.ctaPhone ? `tel:${cta.ctaPhone}` : '#')}
              style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}
            >
              {cta.ctaButtonText || 'Contact Us'}
            </a>
            {cta.ctaPhone && (
              <div style={{ fontSize: 13, color: '#93c5fd', marginTop: 10 }}>{cta.ctaPhone}</div>
            )}
          </div>

          {/* Full report button + recalculate */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              View Full Solar Report
            </button>
            <span style={{ color: '#cbd5e1', margin: '0 8px' }}>·</span>
            <button onClick={onReset} style={{ fontSize: 13, color: '#64748b', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Recalculate
            </button>
          </div>
        </div>

        {/* Full report modal popup */}
        {showModal && (
          <FullReportModal
            results={results}
            form={form}
            lead={lead}
            installerConfig={installerConfig}
            onClose={() => setShowModal(false)}
            onReset={() => { setShowModal(false); onReset(); }}
          />
        )}
      </>
    );
  }

  // Find payback year for chart reference line
  const paybackYear = chart.find(d => d.cumulativeSavings >= 0)?.year;

  const hasFinancing = !isCash && savings.monthlyPaymentFinanced > 0;
  const daySavings = hasFinancing
    ? savings.netMonthlyFinanced
    : savings.monthly;
  const totalMonthlyCostWithSolar = hasFinancing
    ? savings.monthlyPaymentFinanced + Math.max(0, form.monthlyBill - savings.monthly)
    : null;

  return (
    <section className="results-section">
      <div className="results-container">

        {/* Hero */}
        <div className="results-hero">
          <span className="results-badge">Your Solar Estimate</span>

          {isCash ? (
            <>
              <div className="versus-block">
                <div className="versus-side">
                  <div className="versus-label">Net cost after 30% credit</div>
                  <div className="versus-amount versus-bill">{fmtDollar(incentives.netCost)}</div>
                </div>
                <div className="versus-arrow">→</div>
                <div className="versus-side">
                  <div className="versus-label">Paid off in</div>
                  <div className="versus-amount versus-solar">{savings.paybackYears ? `${savings.paybackYears} yrs` : 'N/A'}</div>
                </div>
              </div>
              <h2 className="results-title">
                Then pure savings — <span className="highlight">{fmtDollar(savings.monthly)}/mo</span> back in your pocket
              </h2>
              <p className="results-subtitle">
                Cash purchase. No loan, no interest. {fmtDollar(savings.thirtyYear)} total over 30 years in {results.inputs.state || 'your area'}.
              </p>
            </>
          ) : hasFinancing ? (
            <>
              <div className="versus-block">
                <div className="versus-side">
                  <div className="versus-label">Your current bill</div>
                  <div className="versus-amount versus-bill">{fmtDollar(form.monthlyBill)}<span>/mo</span></div>
                </div>
                <div className="versus-arrow">→</div>
                <div className="versus-side">
                  <div className="versus-label">Est. total with solar</div>
                  <div className="versus-amount versus-solar">{fmtDollar(totalMonthlyCostWithSolar)}<span>/mo</span></div>
                </div>
              </div>
              <h2 className="results-title">
                Save <span className="highlight">{fmtDollar(daySavings)}/mo from day one</span>
              </h2>
              <p className="results-subtitle">
                Based on your {fmtDollar(form.monthlyBill)}/month bill in {results.inputs.state || 'your area'} — estimated at 5.99% APR over 25 years (rate varies by lender and credit score)
              </p>
            </>
          ) : (
            <>
              <h2 className="results-title">
                Solar could cut your electric bill by <span className="highlight">{fmtDollar(savings.monthly)}/mo</span>
              </h2>
              <p className="results-subtitle">
                Based on your {fmtDollar(form.monthlyBill)}/month electric bill in {results.inputs.state || 'your area'}
              </p>
            </>
          )}
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          {isCash ? (
            <div className="metric-card metric-savings">
              <div className="metric-label">Net Cost (after credit)</div>
              <div className="metric-value">{fmtDollar(incentives.netCost)}</div>
              <div className="metric-sub">one-time cash purchase</div>
            </div>
          ) : hasFinancing && (
            <div className="metric-card metric-savings">
              <div className="metric-label">Day-One Monthly Savings</div>
              <div className="metric-value">{fmtDollar(daySavings)}</div>
              <div className="metric-sub">bill − solar payment</div>
            </div>
          )}
          <div className="metric-card">
            <div className="metric-label">Annual Electricity Savings</div>
            <div className="metric-value">{fmtDollar(savings.annual)}</div>
            <div className="metric-sub">saved on your electric bill</div>
          </div>
          <div className="metric-card metric-highlight">
            <div className="metric-label">30-Year Savings</div>
            <div className="metric-value">{fmtDollar(savings.thirtyYear)}</div>
            <div className="metric-sub">total vs. renting from utility</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Payback Period</div>
            <div className="metric-value">{savings.paybackYears ? `${savings.paybackYears} yrs` : 'N/A'}</div>
            <div className="metric-sub">break-even point</div>
          </div>
        </div>

        {/* System Summary */}
        <div className="section-card">
          <h3 className="section-title">Recommended Solar System</h3>
          <div className="system-grid">
            <div className="system-item">
              <span className="sys-label">System Size</span>
              <span className="sys-value">{system.sizeKw} kW</span>
            </div>
            <div className="system-item">
              <span className="sys-label">Panel Count</span>
              <span className="sys-value">{system.panelCount} panels</span>
            </div>
            <div className="system-item">
              <span className="sys-label">Annual Production</span>
              <span className="sys-value">{fmt(system.annualProduction)} kWh</span>
            </div>
            <div className="system-item">
              <span className="sys-label">Energy Offset</span>
              <span className="sys-value offset">{system.offsetPercent}%</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="section-card">
          <h3 className="section-title">Installation Cost Estimate</h3>
          <div className="cost-main">
            <div className="cost-row cost-total">
              <span>Total installation cost</span>
              <span>{fmtDollar(cost.low)} – {fmtDollar(cost.high)}</span>
            </div>
            <div className="cost-row cost-credit">
              <span>Federal solar tax credit (30%)</span>
              <span>− {fmtDollar(incentives.federalTaxCredit)}</span>
            </div>
            <div className="cost-row cost-net">
              <span>Net cost after incentives</span>
              <span>{fmtDollar(incentives.netCostLow)} – {fmtDollar(incentives.netCostHigh)}</span>
            </div>
          </div>
          <p className="tax-credit-disclaimer">* The 30% federal tax credit is claimed when you file your taxes — not an instant discount at purchase. Consult a tax professional to confirm eligibility.</p>

          {hasFinancing && (
            <div className="financing-note">
              <CreditCardIcon size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /><strong>If financed:</strong> ~{fmtDollar(savings.monthlyPaymentFinanced)}/mo loan payment (25 yr, est. 5.99% APR — actual rate depends on credit and lender). Solar covers ~{system.offsetPercent}% of usage — <strong>net savings from day one: ~{fmtDollar(daySavings)}/mo</strong>.
            </div>
          )}

          <div className="breakdown-details">
            <details>
              <summary>View cost breakdown</summary>
              <div className="breakdown-list">
                {Object.entries(cost.breakdown).map(([key, val]) => (
                  val > 0 && (
                    <div key={key} className="breakdown-row">
                      <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                      <span>{fmtDollar(val)}</span>
                    </div>
                  )
                ))}
              </div>
            </details>
          </div>
        </div>

        {/* 30-Year Savings Chart */}
        <div className="section-card">
          <h3 className="section-title">30-Year Savings Projection</h3>
          <p className="chart-note">Assumes 4% annual utility rate increase. Solar payment stays fixed.</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} label={{ value: 'Years', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tickFormatter={v => `$${Math.abs(v) >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [fmtDollar(v), 'Cumulative Savings']} labelFormatter={l => `Year ${l}`} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                {paybackYear && <ReferenceLine x={paybackYear} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Break-even', position: 'top', fontSize: 10, fill: '#f59e0b' }} />}
                <Area type="monotone" dataKey="cumulativeSavings" stroke="#1e40af" strokeWidth={2} fill="url(#savingsGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CTA — installer-branded when embedded, email capture for public */}
        <div className="section-card lead-card">
          {embedded ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <img src="/logo-icon-navy.svg" alt="MySolarWidget" style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 12 }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 8 }}>
                {cta.ctaHeadline || 'Ready to Go Solar?'}
              </h3>
              <p style={{ color: '#bfdbfe', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                {cta.ctaSubtext || 'Our team will design a custom solar system for your home — free, no obligation.'}
              </p>
              {cta.companyName && (
                <p style={{ color: '#93c5fd', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
                  {cta.companyName}
                </p>
              )}
              <a
                href={cta.ctaButtonUrl || `tel:${cta.ctaPhone}`}
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                  color: 'white',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
                }}
              >
                {cta.ctaButtonText || 'Contact Us'}
              </a>
              {cta.ctaPhone && (
                <p style={{ color: '#93c5fd', fontSize: 14, marginTop: 12 }}>
                  {cta.ctaPhone}
                </p>
              )}
            </div>
          ) : (
            <PublicEmailCapture results={results} form={form} savings={savings} system={system} />
          )}
        </div>

        <button className="btn btn-secondary recalc-btn" onClick={onReset}>
          ← Recalculate with different inputs
        </button>
      </div>
    </section>
  );
}

/* ── Full Report Modal ─────────────────────────────────── */
function FullReportModal({ results, form, lead, installerConfig, onClose, onReset }) {
  const { system, cost, incentives, savings, chart } = results;
  const cta = installerConfig || {};
  const isCash = lead?.paymentMethod === 'cash';
  const hasFinancing = !isCash && savings.monthlyPaymentFinanced > 0;
  const daySavings = hasFinancing ? savings.netMonthlyFinanced : savings.monthly;
  const totalMonthlyCostWithSolar = hasFinancing
    ? savings.monthlyPaymentFinanced + Math.max(0, form.monthlyBill - savings.monthly)
    : null;
  const paybackYear = chart.find(d => d.cumulativeSavings >= 0)?.year;

  // Prevent body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '16px 0 40px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#f1f5f9', width: '100%', maxWidth: 720, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', position: 'relative' }}>

        {/* Sticky header bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', borderBottom: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Full Solar Report</span>
          <button
            onClick={onClose}
            style={{ fontSize: 13, color: '#64748b', fontWeight: 600, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', padding: '6px 14px', fontFamily: 'inherit' }}
          >
            ✕ Close
          </button>
        </div>

        {/* Full report content */}
        <section className="results-section">
          <div className="results-container">

            {/* Hero */}
            <div className="results-hero">
              <span className="results-badge">Your Solar Estimate</span>
              {isCash ? (
                <>
                  <div className="versus-block">
                    <div className="versus-side">
                      <div className="versus-label">Net cost after 30% credit</div>
                      <div className="versus-amount versus-bill">{fmtDollar(incentives.netCost)}</div>
                    </div>
                    <div className="versus-arrow">→</div>
                    <div className="versus-side">
                      <div className="versus-label">Paid off in</div>
                      <div className="versus-amount versus-solar">{savings.paybackYears ? `${savings.paybackYears} yrs` : 'N/A'}</div>
                    </div>
                  </div>
                  <h2 className="results-title">
                    Then pure savings — <span className="highlight">{fmtDollar(savings.monthly)}/mo</span> back in your pocket
                  </h2>
                  <p className="results-subtitle">
                    Cash purchase. No loan, no interest. {fmtDollar(savings.thirtyYear)} total over 30 years in {results.inputs.state || 'your area'}.
                  </p>
                </>
              ) : hasFinancing ? (
                <>
                  <div className="versus-block">
                    <div className="versus-side">
                      <div className="versus-label">Your current bill</div>
                      <div className="versus-amount versus-bill">{fmtDollar(form.monthlyBill)}<span>/mo</span></div>
                    </div>
                    <div className="versus-arrow">→</div>
                    <div className="versus-side">
                      <div className="versus-label">Est. total with solar</div>
                      <div className="versus-amount versus-solar">{fmtDollar(totalMonthlyCostWithSolar)}<span>/mo</span></div>
                    </div>
                  </div>
                  <h2 className="results-title">
                    Save <span className="highlight">{fmtDollar(daySavings)}/mo from day one</span>
                  </h2>
                  <p className="results-subtitle">
                    Based on your {fmtDollar(form.monthlyBill)}/month bill in {results.inputs.state || 'your area'} — estimated at 5.99% APR over 25 years (rate varies by lender and credit score)
                  </p>
                </>
              ) : (
                <>
                  <h2 className="results-title">
                    Solar could cut your electric bill by <span className="highlight">{fmtDollar(savings.monthly)}/mo</span>
                  </h2>
                  <p className="results-subtitle">
                    Based on your {fmtDollar(form.monthlyBill)}/month electric bill in {results.inputs.state || 'your area'}
                  </p>
                </>
              )}
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
              {isCash ? (
                <div className="metric-card metric-savings">
                  <div className="metric-label">Net Cost (after credit)</div>
                  <div className="metric-value">{fmtDollar(incentives.netCost)}</div>
                  <div className="metric-sub">one-time cash purchase</div>
                </div>
              ) : hasFinancing && (
                <div className="metric-card metric-savings">
                  <div className="metric-label">Day-One Monthly Savings</div>
                  <div className="metric-value">{fmtDollar(daySavings)}</div>
                  <div className="metric-sub">bill − solar payment</div>
                </div>
              )}
              <div className="metric-card">
                <div className="metric-label">Annual Electricity Savings</div>
                <div className="metric-value">{fmtDollar(savings.annual)}</div>
                <div className="metric-sub">saved on your electric bill</div>
              </div>
              <div className="metric-card metric-highlight">
                <div className="metric-label">30-Year Savings</div>
                <div className="metric-value">{fmtDollar(savings.thirtyYear)}</div>
                <div className="metric-sub">total vs. renting from utility</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Payback Period</div>
                <div className="metric-value">{savings.paybackYears ? `${savings.paybackYears} yrs` : 'N/A'}</div>
                <div className="metric-sub">break-even point</div>
              </div>
            </div>

            {/* System Summary */}
            <div className="section-card">
              <h3 className="section-title">Recommended Solar System</h3>
              <div className="system-grid">
                <div className="system-item"><span className="sys-label">System Size</span><span className="sys-value">{system.sizeKw} kW</span></div>
                <div className="system-item"><span className="sys-label">Panel Count</span><span className="sys-value">{system.panelCount} panels</span></div>
                <div className="system-item"><span className="sys-label">Annual Production</span><span className="sys-value">{fmt(system.annualProduction)} kWh</span></div>
                <div className="system-item"><span className="sys-label">Energy Offset</span><span className="sys-value offset">{system.offsetPercent}%</span></div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="section-card">
              <h3 className="section-title">Installation Cost Estimate</h3>
              <div className="cost-main">
                <div className="cost-row cost-total">
                  <span>Total installation cost</span>
                  <span>{fmtDollar(cost.low)} – {fmtDollar(cost.high)}</span>
                </div>
                <div className="cost-row cost-credit">
                  <span>Federal solar tax credit (30%)</span>
                  <span>− {fmtDollar(incentives.federalTaxCredit)}</span>
                </div>
                <div className="cost-row cost-net">
                  <span>Net cost after incentives</span>
                  <span>{fmtDollar(incentives.netCostLow)} – {fmtDollar(incentives.netCostHigh)}</span>
                </div>
              </div>
              <p className="tax-credit-disclaimer">* The 30% federal tax credit is claimed when you file your taxes — not an instant discount at purchase. Consult a tax professional to confirm eligibility.</p>
              {hasFinancing && (
                <div className="financing-note">
                  <CreditCardIcon size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /><strong>If financed:</strong> ~{fmtDollar(savings.monthlyPaymentFinanced)}/mo loan payment (25 yr, est. 5.99% APR — actual rate depends on credit and lender). Solar covers ~{system.offsetPercent}% of usage — <strong>net savings from day one: ~{fmtDollar(daySavings)}/mo</strong>.
                </div>
              )}
              <div className="breakdown-details">
                <details>
                  <summary>View cost breakdown</summary>
                  <div className="breakdown-list">
                    {Object.entries(cost.breakdown).map(([key, val]) => (
                      val > 0 && (
                        <div key={key} className="breakdown-row">
                          <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                          <span>{fmtDollar(val)}</span>
                        </div>
                      )
                    ))}
                  </div>
                </details>
              </div>
            </div>

            {/* 30-Year Savings Chart */}
            <div className="section-card">
              <h3 className="section-title">30-Year Savings Projection</h3>
              <p className="chart-note">Assumes 4% annual utility rate increase. Solar payment stays fixed.</p>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="savingsGradModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e40af" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} label={{ value: 'Years', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tickFormatter={v => `$${Math.abs(v) >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(v) => [fmtDollar(v), 'Cumulative Savings']} labelFormatter={l => `Year ${l}`} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    {paybackYear && <ReferenceLine x={paybackYear} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Break-even', position: 'top', fontSize: 10, fill: '#f59e0b' }} />}
                    <Area type="monotone" dataKey="cumulativeSavings" stroke="#1e40af" strokeWidth={2} fill="url(#savingsGradModal)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Installer CTA */}
            <div className="section-card lead-card">
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>
                  {cta.ctaHeadline || 'Ready to Go Solar?'}
                </h3>
                <p style={{ color: '#bfdbfe', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                  {cta.ctaSubtext || 'Our team will design a custom solar system for your home — free, no obligation.'}
                </p>
                {cta.companyName && (
                  <p style={{ color: '#93c5fd', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{cta.companyName}</p>
                )}
                <a
                  href={cta.ctaButtonUrl || `tel:${cta.ctaPhone}`}
                  style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}
                >
                  {cta.ctaButtonText || 'Contact Us'}
                </a>
                {cta.ctaPhone && (
                  <p style={{ color: '#93c5fd', fontSize: 14, marginTop: 12 }}>{cta.ctaPhone}</p>
                )}
              </div>
            </div>

            <button className="btn btn-secondary recalc-btn" onClick={onReset}>
              ← Recalculate with different inputs
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function PublicEmailCapture({ results, form, savings, system }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setLoading(true);
    try {
      await supabase.from('leads').insert({
        installer_id: null,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: null,
        timeline: null,
        payment_method: null,
        monthly_bill: parseFloat(form.monthlyBill),
        state: form.state || null,
        zip: form.zip || null,
        system_size_kw: system?.sizeKw || null,
        annual_savings: savings?.annual || null,
        total_cost: results?.cost?.total || null,
      });
    } catch (_) {
      // fire-and-forget — don't block UX on Supabase error
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="lead-success">
        <div className="lead-success-icon"><CheckCircleIcon size={40} color="#16a34a" /></div>
        <h3>Report sent!</h3>
        <p>Check your inbox for your personalized solar savings summary.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ marginBottom: 12 }}><MailIcon size={32} color="white" /></div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>
        Send report to your email
      </h3>
      <p style={{ color: '#bfdbfe', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
        Get your personalized solar savings summary delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360, margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          style={inputStyle}
        />
        {error && <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '13px 24px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? 'Sending...' : 'Send My Report →'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '12px 14px',
  borderRadius: 10,
  border: '1.5px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.12)',
  color: 'white',
  fontSize: 15,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
