import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import './InstallerDashboard.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

const ALL_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

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
  systemName: 'Solar Calculator', companyName: '', primaryColor: '#f59e0b',
};

export default function InstallerDashboard({ user, onLogout }) {
  const installerId = user?.id || user?.sub;
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('pricing');
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

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

  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  const embedCode = `<!-- Solar Savings Calculator -->
<iframe id="sc-iframe" src="${siteUrl}/embed?installer=${installerId}" width="100%" height="700" frameborder="0" scrolling="no" style="border:none;width:100%;display:block;" title="Solar Savings Calculator"></iframe>
<script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='sc-resize'){var f=document.getElementById('sc-iframe');if(f)f.style.height=(e.data.height+20)+'px';}});<\/script>`;

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <img src="/android-chrome-192x192.png" alt="MySolarWidget logo" style={{ width: 26, height: 26, borderRadius: 6 }} />
          <span className="dash-brand-name">MySolar<span>Widget</span></span>
        </div>
        <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#64748b', borderBottom: '1px solid #1e293b', marginBottom: 8 }}>
          {config.companyName || user?.user_metadata?.company_name || 'My Company'}
        </div>
        <nav className="dash-nav">
          {[
            { id: 'pricing', icon: '💰', label: 'Pricing Settings' },
            { id: 'appearance', icon: '🎨', label: 'Appearance' },
            { id: 'embed', icon: '📋', label: 'Embed Code' },
            { id: 'leads', icon: '📊', label: 'Leads' },
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
            <span>🚪</span>
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
              {activeTab === 'embed' && 'Embed Code'}
              {activeTab === 'leads' && 'Leads'}
            </h1>
            <p className="dash-page-sub">Configure how your solar calculator estimates costs</p>
          </div>
          <button className="btn-save" onClick={save} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✅ Saved' : 'Save Changes'}
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
            <div className="settings-grid">
              <SettingCard title="Branding" desc="Customize the calculator appearance on your website.">
                <SettingRow label="Company Name">
                  <input type="text" placeholder="Your Solar Company" value={config.companyName || ''} onChange={e => update('companyName', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Calculator Title">
                  <input type="text" value={config.systemName || ''} onChange={e => update('systemName', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Primary Color">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="color" value={config.primaryColor || '#f59e0b'} onChange={e => update('primaryColor', e.target.value)} style={{ width: 40, height: 36, border: 'none', padding: 2, borderRadius: 6, cursor: 'pointer' }} />
                    <span className="color-value">{config.primaryColor}</span>
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
          )}

          {activeTab === 'embed' && (
            <div className="settings-grid">
              <SettingCard title="Embed on Your Website" desc="Add the solar calculator to any page on your website with one line of code.">
                <div className="embed-code-box">
                  <code>{embedCode}</code>
                </div>
                <button className="btn-copy" onClick={() => navigator.clipboard.writeText(embedCode)}>
                  📋 Copy Embed Code
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
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
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
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Payment</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Timeline</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>System</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Annual Savings</th>
                          <th style={{ padding: '8px 12px', fontWeight: 600 }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map(lead => (
                          <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 500 }}>{lead.name}</td>
                            <td style={{ padding: '10px 12px' }}><a href={`mailto:${lead.email}`} style={{ color: '#1e40af' }}>{lead.email}</a></td>
                            <td style={{ padding: '10px 12px' }}>{lead.phone}</td>
                            <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{lead.payment_method || '—'}</td>
                            <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{lead.timeline || '—'}</td>
                            <td style={{ padding: '10px 12px' }}>{lead.system_size_kw ? `${lead.system_size_kw} kW` : '—'}</td>
                            <td style={{ padding: '10px 12px' }}>{lead.annual_savings ? `$${lead.annual_savings.toLocaleString()}` : '—'}</td>
                            <td style={{ padding: '10px 12px', color: '#64748b' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
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
