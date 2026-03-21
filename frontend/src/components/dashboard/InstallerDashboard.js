import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import { DollarSignIcon, PaintBrushIcon, ClipboardIcon, ChartBarIcon, CreditCardIcon, LogOutIcon, CheckCircleIcon, SparklesIcon, LayersIcon, PlusIcon, TrashIcon } from '../ui/Icons';
import SolarCalculator from '../calculator/SolarCalculator';
import './InstallerDashboard.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

const ALL_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

function ColorInput({ value, onChange }) {
  const pickerRef = useRef(null);
  const [localText, setLocalText] = useState(value || '');

  useEffect(() => { setLocalText(value || ''); }, [value]);

  const handleText = (e) => {
    const raw = e.target.value;
    setLocalText(raw);
    const normalized = /^#/.test(raw) ? raw : '#' + raw;
    if (/^#[0-9A-Fa-f]{6}$/.test(normalized)) onChange(normalized.toLowerCase());
  };

  const handlePicker = (e) => {
    setLocalText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        onClick={() => pickerRef.current?.click()}
        style={{ width: 36, height: 36, background: value || '#ffffff', borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer', flexShrink: 0 }}
      />
      <input ref={pickerRef} type="color" value={value || '#ffffff'} onChange={handlePicker} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} tabIndex={-1} />
      <input
        type="text"
        value={localText}
        onChange={handleText}
        placeholder="#f59e0b"
        style={{ width: 100, padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontFamily: 'monospace', letterSpacing: '0.05em' }}
      />
    </div>
  );
}

const DEFAULT_CONFIG = {
  minSystemSize: 4, maxSystemSize: 20,
  pricePerWatt: 2.8,
  serviceStates: [],
  batteries: {
    none: { label: 'No battery', cost: 0 },
    one: { label: '1 Battery (Tesla Powerwall)', cost: 11500 },
    two: { label: '2 Batteries (Tesla Powerwall)', cost: 23000 },
  },
  roofSurcharges: { asphalt: 0, metal: 500, tile: 1500, flat: 800 },
  systemName: 'Solar Calculator', companyName: '', primaryColor: '#f59e0b', formBgColor: '#ffffff',
  borderRadius: 12,
  frameHeight: 620,
  customSteps: [],
};

export default function InstallerDashboard({ user, onLogout }) {
  const installerId = user?.id || user?.sub;
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Open subscription tab directly if redirected from Stripe
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscribed') === 'true' || params.get('tab') === 'subscription') return 'subscription';
    return 'pricing';
  });
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_BASE}/api/installer/${installerId}`, { headers });
        setConfig(res.data.data);
      } catch (err) {
        if (err.response?.status === 401) onLogout();
        else setConfig(DEFAULT_CONFIG);
      }
    };
    load();
  }, [installerId, onLogout]);

  useEffect(() => {
    if (activeTab !== 'leads') return;
    const loadLeads = async () => {
      setLeadsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('installer_id', installerId)
        .order('created_at', { ascending: false });
      if (!error) setLeads(data || []);
      setLeadsLoading(false);
    };
    loadLeads();
  }, [activeTab, installerId]);

  useEffect(() => {
    if (activeTab !== 'subscription') return;
    const loadSub = async () => {
      setSubLoading(true);
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_BASE}/api/subscription/status`, { headers });
        setSubscription(res.data.data);
      } catch {
        // fallback: derive from config
        setSubscription(null);
      } finally {
        setSubLoading(false);
      }
    };
    loadSub();
  }, [activeTab]);


  const update = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const headers = await getAuthHeader();
      await axios.put(`${API_BASE}/api/installer/${installerId}`, config, { headers });
      setSaved(true);
    } catch (err) {
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const headers = await getAuthHeader();
      const res = await axios.post(`${API_BASE}/api/subscription/checkout`, {}, { headers });
      if (res.data.url) window.location.href = res.data.url;
    } catch {
      alert('Could not open checkout. Please try again.');
    }
  };

  const handleManageBilling = async () => {
    try {
      const headers = await getAuthHeader();
      const res = await axios.post(`${API_BASE}/api/subscription/portal`, {}, { headers });
      if (res.data.url) window.location.href = res.data.url;
    } catch {
      alert('Could not open billing portal. Please try again.');
    }
  };

  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  const frameHeight = config.frameHeight || 620;
  const embedCode = `<!-- MySolarWidget Solar Calculator -->
<iframe src="${siteUrl}/embed?installer=${installerId}" width="100%" height="${frameHeight}" frameborder="0" scrolling="no" style="border:none;width:100%;max-width:100%;display:block;" title="Solar Savings Calculator"></iframe>`;

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <div style={{ background: 'white', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo-horizontal-light.svg" alt="MySolarWidget" style={{ height: 36, width: 'auto', display: 'block' }} />
          </div>
        </div>
        <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#64748b', borderBottom: '1px solid #1e293b', marginBottom: 8 }}>
          {config.companyName || user?.user_metadata?.company_name || 'My Company'}
        </div>
        <nav className="dash-nav">
          {[
            { id: 'pricing', icon: <DollarSignIcon size={16} />, label: 'Pricing Settings' },
            { id: 'appearance', icon: <PaintBrushIcon size={16} />, label: 'Appearance' },
            { id: 'steps', icon: <LayersIcon size={16} />, label: 'Custom Steps' },
            { id: 'embed', icon: <ClipboardIcon size={16} />, label: 'Embed Code' },
            { id: 'leads', icon: <ChartBarIcon size={16} />, label: 'Leads' },
            { id: 'subscription', icon: <CreditCardIcon size={16} />, label: 'Subscription' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`dash-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          <button className="dash-nav-item" onClick={onLogout} style={{ marginTop: 'auto', color: '#f87171' }}>
            <span><LogOutIcon size={16} /></span>
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1 className="dash-page-title">
              {activeTab === 'pricing' && 'Pricing Settings'}
              {activeTab === 'appearance' && 'Appearance'}
              {activeTab === 'steps' && 'Custom Steps'}
              {activeTab === 'embed' && 'Embed Code'}
              {activeTab === 'leads' && 'Leads'}
              {activeTab === 'subscription' && 'Subscription'}
            </h1>
            <p className="dash-page-sub">Configure how your solar calculator estimates costs</p>
          </div>
          <button className="btn-save" onClick={save} disabled={saving}>
            {saving ? 'Saving...' : saved ? <><CheckCircleIcon size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Saved</> : 'Save Changes'}
          </button>
        </div>

        <div className="dash-content">

          {activeTab === 'pricing' && (
            <div className="settings-grid">
              <SettingCard title="Base Price per Watt" desc="All-in installed cost per watt — covers panels, inverter, labor, permits, and your margin. This is the single number that drives every estimate.">
                <SettingRow label="Price per Watt ($)" hint="Typical range: $2.50 – $4.00">
                  <input type="number" step="0.05" min="1" max="6" value={config.pricePerWatt || 2.8} onChange={e => update('pricePerWatt', parseFloat(e.target.value))} className="dash-input" />
                </SettingRow>
              </SettingCard>

              <SettingCard title="Roof Surcharges" desc="Extra cost added for non-standard roof types.">
                {Object.entries(config.roofSurcharges).map(([type, cost]) => (
                  <SettingRow key={type} label={`${type.charAt(0).toUpperCase() + type.slice(1)} roof ($)`}>
                    <input type="number" step="100" min="0" max="5000" value={cost} onChange={e => update('roofSurcharges', { ...config.roofSurcharges, [type]: parseInt(e.target.value) })} className="dash-input" />
                  </SettingRow>
                ))}
              </SettingCard>

              <SettingCard title="Battery Pricing" desc="Installed cost of battery storage options.">
                {Object.entries(config.batteries).filter(([k]) => k !== 'none').map(([key, bat]) => (
                  <SettingRow key={key} label={bat.label}>
                    <input type="number" step="500" min="0" max="50000" value={bat.cost} onChange={e => update('batteries', { ...config.batteries, [key]: { ...bat, cost: parseInt(e.target.value) } })} className="dash-input" />
                  </SettingRow>
                ))}
              </SettingCard>

              <SettingCard title="System Limits" desc="Set minimum and maximum system sizes you install.">
                <SettingRow label="Minimum System Size (kW)">
                  <input type="number" step="1" min="1" max="10" value={config.minSystemSize} onChange={e => update('minSystemSize', parseInt(e.target.value))} className="dash-input" />
                </SettingRow>
                <SettingRow label="Maximum System Size (kW)">
                  <input type="number" step="1" min="5" max="50" value={config.maxSystemSize} onChange={e => update('maxSystemSize', parseInt(e.target.value))} className="dash-input" />
                </SettingRow>
              </SettingCard>

              <SettingCard title="Service Area" desc="Leads outside your service area will be told you don't serve their location. Leave all unchecked to accept leads from any state.">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 0' }}>
                  {ALL_STATES.map(st => {
                    const active = (config.serviceStates || []).includes(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          const current = config.serviceStates || [];
                          update('serviceStates', active ? current.filter(s => s !== st) : [...current, st]);
                        }}
                        style={{
                          padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid',
                          borderColor: active ? '#1e40af' : '#cbd5e1',
                          background: active ? '#1e40af' : 'white',
                          color: active ? 'white' : '#64748b',
                          cursor: 'pointer', fontWeight: active ? 600 : 400,
                        }}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
                {(config.serviceStates || []).length > 0 && (
                  <button
                    type="button"
                    onClick={() => update('serviceStates', [])}
                    style={{ marginTop: 8, fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Clear all (serve all states)
                  </button>
                )}
              </SettingCard>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="appearance-layout">
              <div className="settings-grid">
              <SettingCard title="Branding" desc="Customize the calculator appearance on your website.">
                <SettingRow label="Company Name">
                  <input type="text" placeholder="Your Solar Company" value={config.companyName || ''} onChange={e => update('companyName', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Calculator Title">
                  <input type="text" value={config.systemName || ''} onChange={e => update('systemName', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Primary Color">
                  <ColorInput value={config.primaryColor || '#f59e0b'} onChange={v => update('primaryColor', v)} />
                </SettingRow>
                <SettingRow label="Form Background">
                  <ColorInput value={config.formBgColor || '#ffffff'} onChange={v => update('formBgColor', v)} />
                </SettingRow>
                <SettingRow label="Font Style" hint="Applied to the calculator widget on your site">
                  <select
                    value={config.fontFamily || ''}
                    onChange={e => update('fontFamily', e.target.value)}
                    className="dash-input dash-input-text"
                    style={{ fontFamily: config.fontFamily ? `'${config.fontFamily}', sans-serif` : undefined }}
                  >
                    <option value="">Default (Inter)</option>
                    <option value="Poppins">Poppins — friendly &amp; modern</option>
                    <option value="Montserrat">Montserrat — bold &amp; strong</option>
                    <option value="Lato">Lato — clean &amp; professional</option>
                    <option value="Raleway">Raleway — elegant &amp; sleek</option>
                    <option value="Nunito">Nunito — soft &amp; rounded</option>
                    <option value="Open Sans">Open Sans — neutral &amp; readable</option>
                    <option value="DM Sans">DM Sans — minimal &amp; sharp</option>
                    <option value="Playfair Display">Playfair Display — premium &amp; luxe</option>
                    <option value="Roboto">Roboto — clean &amp; technical</option>
                  </select>
                </SettingRow>
                <SettingRow label="Corner Radius" hint="Rounded corners on the calculator widget (0 = sharp, 24 = very round)">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="range" min="0" max="24" step="2"
                      value={config.borderRadius !== undefined ? config.borderRadius : 12}
                      onChange={e => update('borderRadius', parseInt(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: 13, color: '#64748b', minWidth: 36 }}>{config.borderRadius !== undefined ? config.borderRadius : 12}px</span>
                  </div>
                </SettingRow>
              </SettingCard>

              <SettingCard title="Results Page CTA" desc="What visitors see after they get their savings estimate — shown on your embedded calculator.">
                <SettingRow label="Headline" hint='e.g. "Ready to Go Solar?"'>
                  <input type="text" placeholder="Ready to Go Solar?" value={config.ctaHeadline || ''} onChange={e => update('ctaHeadline', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Subtext" hint="One sentence below the headline">
                  <input type="text" placeholder="Call us for a free site visit." value={config.ctaSubtext || ''} onChange={e => update('ctaSubtext', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Phone Number" hint="Click-to-call button">
                  <input type="text" placeholder="+1 (555) 000-0000" value={config.ctaPhone || ''} onChange={e => update('ctaPhone', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Button Text">
                  <input type="text" placeholder="Call Us for a Free Quote" value={config.ctaButtonText || ''} onChange={e => update('ctaButtonText', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Button URL" hint="Optional — links to your contact page instead of phone">
                  <input type="text" placeholder="https://yoursite.com/contact" value={config.ctaButtonUrl || ''} onChange={e => update('ctaButtonUrl', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
              </SettingCard>
              </div>

              <div className="appearance-preview-panel">
                <div className="appearance-preview-label">Live Preview</div>
                <div className="appearance-preview-frame">
                  <SolarCalculator
                    embedded
                    installerConfig={config}
                    installerId={null}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <CustomStepsPanel
              steps={config.customSteps || []}
              onChange={steps => update('customSteps', steps)}
            />
          )}

          {activeTab === 'embed' && (
            <div className="settings-grid">
              <SettingCard title="Widget Frame Height" desc="Set the fixed height of your embedded calculator. Content inside scrolls — your page layout stays perfectly intact.">
                <SettingRow label="Height (px)" hint="Recommended: 580 – 800px depending on your layout">
                  <input
                    type="number"
                    min="480"
                    max="1200"
                    step="10"
                    value={config.frameHeight || 620}
                    onChange={e => update('frameHeight', parseInt(e.target.value) || 620)}
                    className="dash-input"
                  />
                </SettingRow>
              </SettingCard>
              <SettingCard title="Embed on Your Website" desc="Add the solar calculator to any page on your website with one line of code.">
                <div className="embed-code-box">
                  <code>{embedCode}</code>
                </div>
                <button className="btn-copy" onClick={() => navigator.clipboard.writeText(embedCode)}>
                  <ClipboardIcon size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Copy Embed Code
                </button>
                <div className="embed-instructions">
                  <h4>How to add it:</h4>
                  <ol>
                    <li>Copy the code above</li>
                    <li>Paste it into your website's HTML — anywhere you want the calculator to appear</li>
                    <li>The calculator will load automatically using your pricing settings</li>
                  </ol>
                </div>
              </SettingCard>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="setting-card">
              <div className="setting-card-header">
                <h3 className="setting-card-title">Leads ({leads.length})</h3>
                <p className="setting-card-desc">Contacts collected through your solar calculator.</p>
              </div>
              <div className="setting-card-body">
                {leadsLoading ? (
                  <p style={{ color: '#64748b', fontSize: 14 }}>Loading leads...</p>
                ) : leads.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                    <div style={{ marginBottom: 12 }}><ClipboardIcon size={32} /></div>
                    <p style={{ fontSize: 14 }}>No leads yet. They'll appear here once someone completes your calculator.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Name</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Email</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Phone</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Answers</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Estimate</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map(lead => {
                          const fmt = v => v ? String(v).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null;
                          const rows = [
                            lead.monthly_bill != null && `Bill: $${lead.monthly_bill}/mo`,
                            (lead.zip || lead.state) && `Location: ${[lead.zip, lead.state].filter(Boolean).join(', ')}`,
                            lead.home_type && `Home: ${fmt(lead.home_type)}`,
                            lead.owns_home != null && `Owns: ${lead.owns_home ? 'Yes' : 'No'}`,
                            lead.sun_exposure && `Sun: ${fmt(lead.sun_exposure)}`,
                            lead.roof_type && `Roof: ${fmt(lead.roof_type)}`,
                            lead.battery != null && `Battery: ${lead.battery ? 'Yes' : 'No'}`,
                            lead.payment_method && `Payment: ${fmt(lead.payment_method)}`,
                            lead.timeline && `Timeline: ${fmt(lead.timeline)}`,
                          ].filter(Boolean);
                          const customRows = lead.custom_answers
                            ? (config.customSteps || []).filter(s => lead.custom_answers[s.id] !== undefined)
                                .map(s => `${s.label}: ${lead.custom_answers[s.id]}`)
                            : [];
                          return (
                            <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{lead.name || '—'}</td>
                              <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                                {lead.email ? <a href={`mailto:${lead.email}`} style={{ color: '#1e40af' }}>{lead.email}</a> : '—'}
                              </td>
                              <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{lead.phone || '—'}</td>
                              <td style={{ padding: '10px 12px', minWidth: 200 }}>
                                {[...rows, ...customRows].length > 0
                                  ? [...rows, ...customRows].map((r, i) => (
                                      <div key={i} style={{ fontSize: 12, color: '#475569', lineHeight: '1.7' }}>{r}</div>
                                    ))
                                  : <span style={{ color: '#94a3b8' }}>—</span>}
                              </td>
                              <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                                {lead.system_size_kw ? <div style={{ fontSize: 12 }}>{lead.system_size_kw} kW</div> : null}
                                {lead.annual_savings ? <div style={{ fontSize: 12, color: '#16a34a' }}>${lead.annual_savings.toLocaleString()}/yr</div> : null}
                                {!lead.system_size_kw && !lead.annual_savings ? '—' : null}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="settings-grid">
              <SubscriptionPanel
                subscription={subscription}
                loading={subLoading}
                onSubscribe={handleSubscribe}
                onManage={handleManageBilling}
                justSubscribed={new URLSearchParams(window.location.search).get('subscribed') === 'true'}
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

const POSITION_LABELS = {
  0: 'Before all questions',
  1: 'After Electric Bill',
  2: 'After Location',
  3: 'After Home Type',
  4: 'After Roof',
  5: 'After Battery',
};

const STEP_TYPES = [
  { value: 'choice', label: 'Multiple Choice' },
  { value: 'yes-no', label: 'Yes / No' },
  { value: 'text', label: 'Text Input' },
];

function CustomStepsPanel({ steps, onChange }) {
  const [editing, setEditing] = useState(null); // null = list view, 'new' or index = form view
  const [draft, setDraft] = useState(null);

  const startNew = () => {
    setDraft({
      id: `custom_${Date.now()}`,
      label: '',
      title: '',
      description: '',
      type: 'choice',
      insertAfterStep: 5,
      required: true,
      options: [{ label: '', value: 'opt_0' }, { label: '', value: 'opt_1' }],
    });
    setEditing('new');
  };

  const startEdit = (idx) => {
    setDraft({ ...steps[idx], options: steps[idx].options ? [...steps[idx].options.map(o => ({ ...o }))] : [] });
    setEditing(idx);
  };

  const saveDraft = () => {
    if (!draft.label.trim() || !draft.title.trim()) return;
    if (draft.type === 'choice' && draft.options.filter(o => o.label.trim()).length < 1) return;
    const clean = {
      ...draft,
      label: draft.label.trim(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      options: draft.type === 'choice'
        ? draft.options.filter(o => o.label.trim()).map((o, i) => ({
            label: o.label.trim(),
            value: o.value || `opt_${i}`,
          }))
        : undefined,
    };
    if (editing === 'new') {
      onChange([...steps, clean]);
    } else {
      const next = [...steps];
      next[editing] = clean;
      onChange(next);
    }
    setEditing(null);
    setDraft(null);
  };

  const deleteStep = (idx) => {
    const next = [...steps];
    next.splice(idx, 1);
    onChange(next);
  };

  const moveStep = (idx, dir) => {
    const next = [...steps];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  };

  const updateDraft = (field, val) => setDraft(prev => ({ ...prev, [field]: val }));

  const updateOption = (i, val) => {
    const opts = [...(draft.options || [])];
    opts[i] = { ...opts[i], label: val };
    updateDraft('options', opts);
  };

  const addOption = () => {
    const opts = [...(draft.options || [])];
    opts.push({ label: '', value: `opt_${Date.now()}` });
    updateDraft('options', opts);
  };

  const removeOption = (i) => {
    const opts = [...(draft.options || [])];
    opts.splice(i, 1);
    updateDraft('options', opts);
  };

  if (editing !== null && draft) {
    const isValid = draft.label.trim() && draft.title.trim() &&
      (draft.type !== 'choice' || draft.options.filter(o => o.label.trim()).length >= 1);
    return (
      <div className="setting-card" style={{ maxWidth: 620 }}>
        <div className="setting-card-header">
          <h3 className="setting-card-title">{editing === 'new' ? 'Add Custom Step' : 'Edit Step'}</h3>
          <p className="setting-card-desc">Define a question to collect extra info from your leads.</p>
        </div>
        <div className="setting-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div className="setting-row">
            <div className="setting-row-label">Step Label <span style={{ color: '#94a3b8', fontWeight: 400 }}>(progress bar)</span></div>
            <input className="dash-input dash-input-text" placeholder="e.g. Roof Age" value={draft.label} onChange={e => updateDraft('label', e.target.value)} />
          </div>

          <div className="setting-row">
            <div className="setting-row-label">Question Title</div>
            <input className="dash-input dash-input-text" placeholder="e.g. How old is your roof?" value={draft.title} onChange={e => updateDraft('title', e.target.value)} />
          </div>

          <div className="setting-row">
            <div className="setting-row-label">Description <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></div>
            <input className="dash-input dash-input-text" placeholder="e.g. We use this to estimate if replacement is needed." value={draft.description} onChange={e => updateDraft('description', e.target.value)} />
          </div>

          <div className="setting-row">
            <div className="setting-row-label">Answer Type</div>
            <select className="dash-input dash-input-text" value={draft.type} onChange={e => updateDraft('type', e.target.value)}>
              {STEP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {draft.type === 'text' && (
            <div className="setting-row">
              <div className="setting-row-label">Placeholder text</div>
              <input className="dash-input dash-input-text" placeholder="e.g. Your answer…" value={draft.placeholder || ''} onChange={e => updateDraft('placeholder', e.target.value)} />
            </div>
          )}

          {draft.type === 'choice' && (
            <div>
              <div className="setting-row-label" style={{ marginBottom: 8 }}>Answer Options</div>
              {(draft.options || []).map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input
                    className="dash-input dash-input-text"
                    style={{ flex: 1 }}
                    placeholder={`Option ${i + 1}`}
                    value={opt.label}
                    onChange={e => updateOption(i, e.target.value)}
                  />
                  {(draft.options || []).length > 1 && (
                    <button onClick={() => removeOption(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}>
                      <TrashIcon size={15} />
                    </button>
                  )}
                </div>
              ))}
              {(draft.options || []).length < 8 && (
                <button onClick={addOption} style={{ background: 'none', border: '1px dashed #cbd5e1', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: '#64748b', cursor: 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PlusIcon size={13} /> Add option
                </button>
              )}
            </div>
          )}

          <div className="setting-row">
            <div className="setting-row-label">Insert position</div>
            <select className="dash-input dash-input-text" value={draft.insertAfterStep} onChange={e => updateDraft('insertAfterStep', parseInt(e.target.value))}>
              {Object.entries(POSITION_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-row-label">Required</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={draft.required} onChange={e => updateDraft('required', e.target.checked)} style={{ width: 16, height: 16 }} />
              Visitor must answer before proceeding
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
            <button
              className="btn-save"
              onClick={saveDraft}
              disabled={!isValid}
              style={{ opacity: isValid ? 1 : 0.5 }}
            >
              {editing === 'new' ? 'Add Step' : 'Save Step'}
            </button>
            <button
              onClick={() => { setEditing(null); setDraft(null); }}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, cursor: 'pointer', color: '#475569' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-grid">
      <div className="setting-card">
        <div className="setting-card-header">
          <h3 className="setting-card-title">Custom Steps ({steps.length})</h3>
          <p className="setting-card-desc">Add your own questions between the default calculator steps. Answers are recorded in the Leads tab.</p>
        </div>
        <div className="setting-card-body">
          {steps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
              <LayersIcon size={28} style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 14, marginBottom: 16 }}>No custom steps yet. Add one to collect extra info from your leads.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {steps.map((s, idx) => (
                <div key={s.id} className="custom-step-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {POSITION_LABELS[s.insertAfterStep] || ''} · {STEP_TYPES.find(t => t.value === s.type)?.label}
                      {s.required ? ' · Required' : ' · Optional'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {idx > 0 && (
                      <button onClick={() => moveStep(idx, -1)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 12, color: '#64748b' }}>↑</button>
                    )}
                    {idx < steps.length - 1 && (
                      <button onClick={() => moveStep(idx, 1)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 12, color: '#64748b' }}>↓</button>
                    )}
                    <button onClick={() => startEdit(idx)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#1e40af' }}>Edit</button>
                    <button onClick={() => deleteStep(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}><TrashIcon size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={startNew} className="custom-step-add-btn">
            <PlusIcon size={15} /> Add Custom Step
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionPanel({ subscription, loading, onSubscribe, onManage, justSubscribed }) {
  if (loading) return (
    <div className="setting-card">
      <div className="setting-card-body" style={{ padding: 32, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
        Loading subscription details...
      </div>
    </div>
  );

  const status = subscription?.status || 'trialing';
  const daysLeft = subscription?.daysLeft;
  const isActive = subscription?.active !== false;
  const hasStripe = !!subscription?.stripeCustomerId;

  const statusColors = {
    active: { bg: '#dcfce7', color: '#16a34a', label: 'Active' },
    trialing: { bg: '#dbeafe', color: '#1d4ed8', label: `Free Trial${daysLeft != null ? ` — ${daysLeft} days left` : ''}` },
    expired: { bg: '#fee2e2', color: '#dc2626', label: 'Trial Expired' },
    canceled: { bg: '#fef3c7', color: '#d97706', label: 'Canceled' },
  };
  const badge = statusColors[status] || statusColors.trialing;

  return (
    <div className="setting-card">
      <div className="setting-card-header">
        <h3 className="setting-card-title">Plan & Billing</h3>
        <p className="setting-card-desc">Manage your MySolarWidget subscription.</p>
      </div>
      <div className="setting-card-body">

        {justSubscribed && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '14px 18px', marginBottom: 20, color: '#15803d', fontSize: 14, fontWeight: 600 }}>
            <SparklesIcon size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />You're subscribed! Your embedded calculator is now active.
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>Status:</span>
          <span style={{ background: badge.bg, color: badge.color, borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
            {badge.label}
          </span>
        </div>

        {status === 'trialing' && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              {daysLeft > 0 ? `${daysLeft} days remaining in your free trial` : 'Your free trial is ending soon'}
            </h4>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 0 }}>
              Subscribe now to keep your embedded calculator active on your website after the trial ends. Your pricing settings, branding, and leads are all preserved.
            </p>
          </div>
        )}

        {!isActive && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>
              Your embedded calculator is paused
            </h4>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 0 }}>
              Visitors to your website will see a notice that the calculator is temporarily unavailable. Subscribe below to reactivate it instantly.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {!hasStripe && (
            <button
              onClick={onSubscribe}
              style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            >
              Subscribe — Activate Calculator
            </button>
          )}
          {hasStripe && (
            <button
              onClick={onManage}
              style={{ padding: '12px 28px', background: '#1e293b', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Manage Subscription
            </button>
          )}
          {!hasStripe && status !== 'trialing' && (
            <button
              onClick={onSubscribe}
              style={{ padding: '12px 28px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Reactivate
            </button>
          )}
        </div>

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20, lineHeight: 1.6 }}>
          You can cancel anytime from the billing portal. No long-term commitment required.
        </p>
      </div>
    </div>
  );
}

function SettingCard({ title, desc, children }) {
  return (
    <div className="setting-card">
      <div className="setting-card-header">
        <h3 className="setting-card-title">{title}</h3>
        {desc && <p className="setting-card-desc">{desc}</p>}
      </div>
      <div className="setting-card-body">{children}</div>
    </div>
  );
}

function SettingRow({ label, hint, children }) {
  return (
    <div className="setting-row">
      <div className="setting-row-label">
        <span>{label}</span>
        {hint && <span className="setting-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
