import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import './ResultsScreen.css';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

function fmtDollar(n) {
  return '$' + fmt(Math.abs(n));
}

export default function ResultsScreen({ results, onReset, form, installerConfig, embedded }) {
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const { system, cost, incentives, savings, chart } = results;
  const cta = installerConfig || {};

  const handleLeadSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Find payback year for chart reference line
  const paybackYear = chart.find(d => d.cumulativeSavings >= 0)?.year;

  return (
    <section className="results-section">
      <div className="results-container">

        {/* Hero Result */}
        <div className="results-hero">
          <span className="results-badge">Your Solar Estimate</span>
          <h2 className="results-title">Solar could cut your electric bill by <span className="highlight">{fmtDollar(savings.monthly)}/mo</span></h2>
          <p className="results-subtitle">Based on your ${form.monthlyBill}/month electric bill in {results.inputs.state || 'your area'}</p>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card metric-savings">
            <div className="metric-label">Monthly Bill Reduction</div>
            <div className="metric-value">{fmtDollar(savings.monthly)}</div>
            <div className="metric-sub">less to the utility company</div>
          </div>
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
              <span>Federal tax credit (30%)</span>
              <span>− {fmtDollar(incentives.federalTaxCredit)}</span>
            </div>
            <div className="cost-row cost-net">
              <span>Net cost after incentives</span>
              <span>{fmtDollar(incentives.netCostLow)} – {fmtDollar(incentives.netCostHigh)}</span>
            </div>
          </div>

          {savings.monthlyPaymentFinanced > 0 && (
            <div className="financing-note">
              💳 <strong>If financed:</strong> ~{fmtDollar(savings.monthlyPaymentFinanced)}/mo loan payment (25 yr, 5.9% APR).{' '}
              Your electric bill drops ~{fmtDollar(savings.monthly)}/mo, so your <strong>net monthly savings = ~{fmtDollar(savings.netMonthlyFinanced || Math.max(0, savings.monthly - savings.monthlyPaymentFinanced))}</strong>{' '}
              ({fmtDollar(savings.monthly)} savings − {fmtDollar(savings.monthlyPaymentFinanced)} payment).
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

        {/* CTA — installer-branded when embedded, generic lead form otherwise */}
        <div className="section-card lead-card">
          {embedded ? (
            // Installer CTA
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>☀️</div>
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
                  📞 {cta.ctaPhone}
                </p>
              )}
            </div>
          ) : submitted ? (
            <div className="lead-success">
              <div className="lead-success-icon">✅</div>
              <h3>We'll be in touch!</h3>
              <p>A solar specialist will contact you with a precise quote for your home.</p>
            </div>
          ) : (
            <>
              <div className="lead-header">
                <h3 className="section-title">Get Your Exact Solar Quote</h3>
                <p className="lead-desc">This estimate is based on your inputs. Get a precise system design and final price from a local solar installer — free, no obligation.</p>
              </div>
              <form className="lead-form" onSubmit={handleLeadSubmit}>
                <input type="text" placeholder="Your full name" value={leadForm.name} onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))} required className="lead-input" />
                <input type="email" placeholder="Email address" value={leadForm.email} onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))} required className="lead-input" />
                <input type="tel" placeholder="Phone number" value={leadForm.phone} onChange={e => setLeadForm(p => ({ ...p, phone: e.target.value }))} className="lead-input" />
                <button type="submit" className="btn btn-cta lead-cta">Get My Free Solar Quote →</button>
              </form>
              <p className="lead-disclaimer">No spam. No commitment. One call with a certified installer.</p>
            </>
          )}
        </div>

        <button className="btn btn-secondary recalc-btn" onClick={onReset}>
          ← Recalculate with different inputs
        </button>
      </div>
    </section>
  );
}
