import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import './InstallerDashboard.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

const DEFAULT_CONFIG = {
  pricePerWatt: 3.0, minSystemSize: 4, maxSystemSize: 20,
  laborCost: 5000, permitCost: 1200, inverterCost: 2500, profitMargin: 0.25,
  batteries: {
    none: { label: 'No battery', cost: 0 },
    one: { label: '1 Battery (Tesla Powerwall)', cost: 11500 },
    two: { label: '2 Batteries (Tesla Powerwall)', cost: 23000 },
  },
  roofSurcharges: { asphalt: 0, metal: 500, tile: 1500, flat: 800 },
  equipment: {
    basic: { label: 'Basic (JinkoSolar)', pricePerWatt: 2.5 },
    standard: { label: 'Standard (Qcells)', pricePerWatt: 2.8 },
    premium: { label: 'Premium (SunPower)', pricePerWatt: 3.4 },
  },
  systemName: 'Solar Calculator', companyName: '', primaryColor: '#f59e0b',
};

function getAuthHeader() {
  const token = localStorage.getItem('sc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function InstallerDashboard({ user, onLogout }) {
  const installerId = user?.id || user?.sub;
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('pricing');

  useEffect(() => {
    getAuthHeader().then(headers =>
      axios.get(`${API_BASE}/api/installer/${installerId}`, { headers })
        .then(res => setConfig(res.data.data))
        .catch(err => {
          if (err.response?.status === 401) onLogout();
          else setConfig(DEFAULT_CONFIG);
        })
    );
  }, [installerId, onLogout]);

  if (!config) return (
    <div className="dash-loading">Loading dashboard...</div>
  );

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

  const embedCode = `<script src="https://solarcalc.example.com/widget.js" data-installer="${installerId}"></script>`;

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span style={{ fontSize: 20 }}>☀️</span>
          <span className="dash-brand-name">Solar<span>Calc</span></span>
        </div>
        <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#64748b', borderBottom: '1px solid #1e293b', marginBottom: 8 }}>
          {localStorage.getItem('sc_company') || user?.companyName || 'My Company'}
        </div>
        <nav className="dash-nav">
          {[
            { id: 'pricing', icon: '💰', label: 'Pricing Settings' },
            { id: 'equipment', icon: '🔧', label: 'Equipment Options' },
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
              {activeTab === 'equipment' && 'Equipment Options'}
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
              <SettingCard title="Installation Pricing" desc="Set your base price per watt — this drives the total cost estimate.">
                <SettingRow label="Price per Watt ($)" hint="Typical range: $2.50–$3.50">
                  <input type="number" step="0.05" min="1.5" max="6" value={config.pricePerWatt} onChange={e => update('pricePerWatt', parseFloat(e.target.value))} className="dash-input" />
                </SettingRow>
                <SettingRow label="Profit Margin (%)" hint="Added on top of equipment + labor">
                  <input type="number" step="1" min="0" max="60" value={Math.round(config.profitMargin * 100)} onChange={e => update('profitMargin', parseInt(e.target.value) / 100)} className="dash-input" />
                </SettingRow>
                <SettingRow label="Labor Cost ($)" hint="Flat labor fee">
                  <input type="number" step="100" min="0" max="20000" value={config.laborCost} onChange={e => update('laborCost', parseInt(e.target.value))} className="dash-input" />
                </SettingRow>
                <SettingRow label="Permit & Engineering ($)" hint="Permits, inspections, system design">
                  <input type="number" step="100" min="0" max="5000" value={config.permitCost} onChange={e => update('permitCost', parseInt(e.target.value))} className="dash-input" />
                </SettingRow>
                <SettingRow label="Inverter Cost ($)" hint="String or microinverter system">
                  <input type="number" step="100" min="500" max="10000" value={config.inverterCost} onChange={e => update('inverterCost', parseInt(e.target.value))} className="dash-input" />
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
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="settings-grid">
              {Object.entries(config.equipment).map(([tier, eq]) => (
                <SettingCard key={tier} title={`${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`} desc={`Configure ${tier} equipment pricing`}>
                  <SettingRow label="Display Label">
                    <input type="text" value={eq.label} onChange={e => update('equipment', { ...config.equipment, [tier]: { ...eq, label: e.target.value } })} className="dash-input dash-input-text" />
                  </SettingRow>
                  <SettingRow label="Price per Watt ($)">
                    <input type="number" step="0.05" min="1" max="6" value={eq.pricePerWatt} onChange={e => update('equipment', { ...config.equipment, [tier]: { ...eq, pricePerWatt: parseFloat(e.target.value) } })} className="dash-input" />
                  </SettingRow>
                </SettingCard>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-grid">
              <SettingCard title="Branding" desc="Customize the calculator appearance on your website.">
                <SettingRow label="Company Name">
                  <input type="text" placeholder="Your Solar Company" value={config.companyName} onChange={e => update('companyName', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Calculator Title">
                  <input type="text" value={config.systemName} onChange={e => update('systemName', e.target.value)} className="dash-input dash-input-text" />
                </SettingRow>
                <SettingRow label="Primary Color">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="color" value={config.primaryColor} onChange={e => update('primaryColor', e.target.value)} style={{ width: 40, height: 36, border: 'none', padding: 2, borderRadius: 6, cursor: 'pointer' }} />
                    <span className="color-value">{config.primaryColor}</span>
                  </div>
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
            <div className="leads-placeholder">
              <div className="leads-icon">📊</div>
              <h3>Lead tracking coming soon</h3>
              <p>Leads collected through the calculator will appear here with contact info, estimated savings, and system size.</p>
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
