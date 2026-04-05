import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import { DollarSignIcon, PaintBrushIcon, ClipboardIcon, ChartBarIcon, CreditCardIcon, LogOutIcon, CheckCircleIcon, SparklesIcon, LayersIcon, PlusIcon, TrashIcon, PencilIcon, SettingsIcon, LayoutIcon, MailIcon, PhoneIcon, XIcon, DownloadIcon, RefreshCwIcon, InboxIcon, GlobeIcon, CalendarIcon, TrendingUpIcon, SearchIcon, BoltIcon, AlertTriangleIcon, KeyIcon } from '../ui/Icons';
import SolarCalculator from '../calculator/SolarCalculator';
import './InstallerDashboard.css';

const API_BASE = process.env.REACT_APP_API_URL || '';
const SITE_URL = process.env.REACT_APP_SITE_URL || window.location.origin;

const fmt = v => v ? String(v).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null;

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
  frameWidth: null,
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
    return 'overview';
  });
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [trashView, setTrashView] = useState(false);
  const [trashedLeads, setTrashedLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null); // lead object being edited
  const [editDraft, setEditDraft] = useState({});
  const [apiKey, setApiKey] = useState(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKeyRegenerating, setApiKeyRegenerating] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState(null); // { type: 'success'|'error', text: string }
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [wpCopied, setWpCopied] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilter, setLeadFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState(new Set());

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
    if ((activeTab !== 'leads' && activeTab !== 'settings') || apiKey) return;
    const loadApiKey = async () => {
      try {
        const headers = await getAuthHeader();
        const res = await axios.get(`${API_BASE}/api/installer/${installerId}/api-key`, { headers });
        setApiKey(res.data.data.apiKey);
      } catch {}
    };
    loadApiKey();
  }, [activeTab, installerId, apiKey]);

  const handleRegenerateApiKey = async () => {
    if (!window.confirm('Regenerating will invalidate the current key. Any integrations using it will stop working until updated. Continue?')) return;
    setApiKeyRegenerating(true);
    try {
      const headers = await getAuthHeader();
      const res = await axios.post(`${API_BASE}/api/installer/${installerId}/api-key/regenerate`, {}, { headers });
      setApiKey(res.data.data.apiKey);
    } catch {}
    setApiKeyRegenerating(false);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwNew !== pwConfirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (pwNew.length < 8) {
      setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwNew });
      if (error) throw error;
      setPwMsg({ type: 'success', text: 'Password updated successfully.' });
      setPwCurrent('');
      setPwNew('');
      setPwConfirm('');
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setPwLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'leads' && activeTab !== 'overview') return;
    const loadLeads = async () => {
      setLeadsLoading(true);
      const [activeRes, trashedRes] = await Promise.all([
        supabase.from('leads').select('*').eq('installer_id', installerId).is('deleted_at', null).order('created_at', { ascending: false }),
        supabase.from('leads').select('*').eq('installer_id', installerId).not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
      ]);
      if (!activeRes.error) setLeads(activeRes.data || []);
      if (!trashedRes.error) setTrashedLeads(trashedRes.data || []);
      setLeadsLoading(false);
    };
    loadLeads();
  }, [activeTab, installerId]);

  const handleDeleteLead = async (lead) => {
    const now = new Date().toISOString();
    await supabase.from('leads').update({ deleted_at: now }).eq('id', lead.id);
    setLeads(prev => prev.filter(l => l.id !== lead.id));
    setTrashedLeads(prev => [{ ...lead, deleted_at: now }, ...prev]);
  };

  const handleRestoreLead = async (lead) => {
    await supabase.from('leads').update({ deleted_at: null }).eq('id', lead.id);
    setTrashedLeads(prev => prev.filter(l => l.id !== lead.id));
    setLeads(prev => [{ ...lead, deleted_at: null }, ...prev]);
  };

  const handlePermanentDelete = async (lead) => {
    if (!window.confirm('Permanently delete this lead? This cannot be undone.')) return;
    await supabase.from('leads').delete().eq('id', lead.id);
    setTrashedLeads(prev => prev.filter(l => l.id !== lead.id));
  };

  const handleSaveLead = async () => {
    const { id } = editingLead;
    const patch = { name: editDraft.name, email: editDraft.email, phone: editDraft.phone };
    await supabase.from('leads').update(patch).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
    setEditingLead(null);
  };

  const handleSaveNote = async () => {
    if (!selectedLead) return;
    setSavingNote(true);
    try {
      await supabase.from('leads').update({ notes: leadNotes }).eq('id', selectedLead.id);
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: leadNotes } : l));
      setSelectedLead(prev => ({ ...prev, notes: leadNotes }));
    } catch {}
    setSavingNote(false);
  };

  const openLead = (lead) => { setSelectedLead(lead); setLeadNotes(lead.notes || ''); };

  const handleBulkArchive = async (ids) => {
    const now = new Date().toISOString();
    const idArr = [...ids];
    await supabase.from('leads').update({ deleted_at: now }).in('id', idArr);
    const archived = leads.filter(l => ids.has(l.id)).map(l => ({ ...l, deleted_at: now }));
    setLeads(prev => prev.filter(l => !ids.has(l.id)));
    setTrashedLeads(prev => [...archived, ...prev]);
    setSelectedLeadIds(new Set());
    if (selectedLead && ids.has(selectedLead.id)) setSelectedLead(null);
  };

  const exportCSV = () => {
    const batteryLabel = b => ({ none: 'No Battery', one: '1 Battery', two: '2 Batteries' }[b] || fmt(b) || '');
    const activeLeads = leads.filter(l => !l.deleted_at);
    const filtered = activeLeads.filter(l => {
      if (leadFilter !== 'all' && l.home_type !== leadFilter) return false;
      if (leadSearch) {
        const q = leadSearch.toLowerCase();
        return (l.name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q) || (l.zip || '').includes(q);
      }
      return true;
    });
    const headers = ['Name', 'Email', 'Phone', 'Monthly Bill', 'Location', 'Home Type', 'Owns Home', 'Sun Exposure', 'Roof Type', 'Battery', 'Payment', 'Timeline', 'System kW', 'Annual Savings', 'Date'];
    const rows = filtered.map(l => [
      l.name || '', l.email || '', l.phone || '',
      l.monthly_bill != null ? `$${l.monthly_bill}/mo` : '',
      [l.zip, l.state].filter(Boolean).join(', '),
      fmt(l.home_type) || '', l.owns_home != null ? (l.owns_home ? 'Yes' : 'No') : '',
      fmt(l.sun_exposure) || '', fmt(l.roof_type) || '',
      batteryLabel(l.battery), fmt(l.payment_method) || '', fmt(l.timeline) || '',
      l.system_size_kw || '', l.annual_savings ? `$${l.annual_savings.toLocaleString()}/yr` : '',
      new Date(l.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mysolarwidget-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const loadSub = async () => {
      if (activeTab === 'subscription') setSubLoading(true);
      try {
        const headers = await getAuthHeader();
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        const justSubscribed = params.get('subscribed') === 'true';

        // If returning from Stripe checkout, verify the session directly
        // so we don't depend solely on the webhook to activate the account
        if (justSubscribed && sessionId) {
          const verifyRes = await axios.post(
            `${API_BASE}/api/subscription/verify-checkout`,
            { sessionId },
            { headers }
          );
          setSubscription(verifyRes.data.data);
        } else {
          const res = await axios.get(`${API_BASE}/api/subscription/status`, { headers });
          setSubscription(res.data.data);
        }
      } catch {
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
      else alert('No checkout URL returned. Please try again.');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Unknown error';
      alert(`Could not open checkout: ${msg}`);
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

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleteLoading(true);
    try {
      const headers = await getAuthHeader();
      await axios.delete(`${API_BASE}/api/installer/account`, { headers });
      await supabase.auth.signOut();
      onLogout();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete account. Please try again.');
      setDeleteLoading(false);
    }
  };

  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  const frameHeight = config.frameHeight || 620;
  const frameWidth = config.frameWidth;
  const iframeWidth = frameWidth ? `${frameWidth}px` : '100%';
  const maxWidth = frameWidth ? `${frameWidth}px` : '100%';
  const embedCode = `<!-- MySolarWidget Solar Calculator -->
<iframe src="${siteUrl}/embed?installer=${installerId}" width="${iframeWidth}" height="${frameHeight}" frameborder="0" scrolling="no" style="border:none;width:${iframeWidth};max-width:${maxWidth};display:block;" title="Solar Savings Calculator"></iframe>
<script>
(function(){var o=null;function cl(){if(o&&o.parentNode)o.parentNode.removeChild(o);document.body.style.overflow='';o=null;}window.addEventListener('message',function(e){if(!e.data)return;if(e.data.type==='MSW_OPEN_REPORT'&&!o){var st=document.createElement('style');st.textContent='@keyframes mswIn{from{opacity:0;transform:translateY(12px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}';document.head.appendChild(st);o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,0.75);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';var m=document.createElement('div');m.style.cssText='width:100%;max-width:660px;height:90vh;border-radius:10px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.5);animation:mswIn 0.22s cubic-bezier(0.34,1.06,0.64,1) both;';var fr=document.createElement('iframe');fr.src=e.data.url;fr.style.cssText='width:100%;height:100%;border:none;display:block;';fr.scrolling='yes';m.appendChild(fr);o.appendChild(m);o.onclick=function(ev){if(ev.target===o)cl();};document.body.appendChild(o);document.body.style.overflow='hidden';}if(e.data.type==='MSW_CLOSE_REPORT'){cl();}});})();
<\/script>`;

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <div style={{ background: 'white', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo-horizontal-light.svg" alt="MySolarWidget" style={{ height: 36, width: 'auto', display: 'block' }} />
          </div>
        </div>
        <div style={{ padding: '8px 18px 14px', fontSize: 12, color: '#94a3b8', borderBottom: '1px solid #e2e8f0', marginBottom: 4 }}>
          {config.companyName || user?.user_metadata?.company_name || 'My Company'}
        </div>
        <nav className="dash-nav">
          {[
            { id: 'overview',     icon: <LayoutIcon size={16} />,      label: 'Overview' },
            { id: 'pricing',      icon: <DollarSignIcon size={16} />,  label: 'Pricing Settings' },
            { id: 'appearance',   icon: <PaintBrushIcon size={16} />,  label: 'Appearance' },
            { id: 'steps',        icon: <LayersIcon size={16} />,      label: 'Custom Steps' },
            { id: 'embed',        icon: <ClipboardIcon size={16} />,   label: 'Embed Code' },
            { id: 'leads',        icon: <ChartBarIcon size={16} />,    label: 'Leads', count: leads.filter(l => !l.deleted_at).length },
            { id: 'subscription', icon: <CreditCardIcon size={16} />,  label: 'Subscription' },
            { id: 'settings',     icon: <SettingsIcon size={16} />,    label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`dash-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span style={{ flex: 1 }}>{tab.label}</span>
              {tab.count > 0 && (
                <span style={{ background: activeTab === tab.id ? '#f59e0b' : '#e2e8f0', color: activeTab === tab.id ? '#78350f' : '#64748b', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                  {tab.count}
                </span>
              )}
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
              {activeTab === 'overview'    && 'Dashboard Overview'}
              {activeTab === 'pricing'     && 'Pricing Settings'}
              {activeTab === 'appearance'  && 'Appearance'}
              {activeTab === 'steps'       && 'Custom Steps'}
              {activeTab === 'embed'       && 'Embed Code'}
              {activeTab === 'leads'       && 'Leads'}
              {activeTab === 'subscription'&& 'Subscription'}
              {activeTab === 'settings'    && 'Settings'}
            </h1>
            <p className="dash-page-sub">
              {activeTab === 'overview' ? `Welcome back${config.companyName ? `, ${config.companyName}` : ''}.` : 'Configure how your solar calculator estimates costs'}
            </p>
          </div>
          <button className="btn-save" onClick={save} disabled={saving}>
            {saving ? 'Saving...' : saved ? <><CheckCircleIcon size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Saved</> : 'Save Changes'}
          </button>
        </div>

        <div className="dash-content">

          {subscription && !subscription.active && (
            <div style={{
              background: subscription.status === 'requires_trial_setup' ? '#eff6ff' : '#fef2f2',
              border: `1px solid ${subscription.status === 'requires_trial_setup' ? '#bfdbfe' : '#fca5a5'}`,
              borderRadius: 12, padding: '14px 20px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <AlertTriangleIcon size={15} color={subscription.status === 'requires_trial_setup' ? '#2563eb' : '#dc2626'} />
                <span style={{ fontWeight: 600, fontSize: 13, color: subscription.status === 'requires_trial_setup' ? '#1d4ed8' : '#dc2626' }}>
                  {subscription.status === 'requires_trial_setup'
                    ? 'Your calculator is paused — start your 7-day free trial to activate'
                    : subscription.status === 'expired'
                    ? 'Your free trial has ended — subscribe to reactivate your calculator'
                    : 'Your calculator is paused — subscription issue'}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('subscription')}
                style={{
                  whiteSpace: 'nowrap', padding: '8px 18px',
                  background: subscription.status === 'requires_trial_setup' ? '#2563eb' : '#dc2626',
                  color: 'white', border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}
              >
                {subscription.status === 'requires_trial_setup' ? 'Start Trial →' : 'Reactivate →'}
              </button>
            </div>
          )}

          {activeTab === 'overview' && (() => {
            const activeLeads = leads.filter(l => !l.deleted_at);
            const thisMonth = activeLeads.filter(l => new Date(l.created_at) > new Date(Date.now() - 30 * 86400000));
            const avgSavings = activeLeads.length > 0
              ? activeLeads.reduce((s, l) => s + (l.annual_savings || 0), 0) / activeLeads.filter(l => l.annual_savings).length
              : 0;
            const recentLeads = activeLeads.slice(0, 5);
            const isActive = subscription?.active !== false;

            const stats = [
              { label: 'Total Leads',    value: activeLeads.length,                                   Icon: ChartBarIcon, color: '#d97706', bg: '#fffbeb' },
              { label: 'This Month',     value: thisMonth.length,                                      Icon: CalendarIcon, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Avg Savings/yr', value: avgSavings > 0 ? `$${Math.round(avgSavings).toLocaleString()}` : '—', Icon: TrendingUpIcon, color: '#2563eb', bg: '#eff6ff' },
              { label: 'Widget Status',  value: isActive ? 'Active' : 'Inactive',                     Icon: GlobeIcon,    color: isActive ? '#16a34a' : '#dc2626', bg: isActive ? '#f0fdf4' : '#fef2f2' },
            ];

            return (
              <div>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 24 }}>
                  {stats.map(({ label, value, Icon, color, bg }) => (
                    <div key={label} style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={17} color={color} />
                        </div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '18px 22px', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Quick Actions</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Customize Appearance', tab: 'appearance', Icon: PaintBrushIcon },
                      { label: 'Get Embed Code',        tab: 'embed',       Icon: ClipboardIcon },
                      { label: 'View All Leads',         tab: 'leads',       Icon: ChartBarIcon },
                      { label: 'Manage Billing',         tab: 'subscription',Icon: CreditCardIcon },
                    ].map(({ label, tab, Icon }) => (
                      <button key={label} onClick={() => setActiveTab(tab)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', color: '#374151', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#d97706'; e.currentTarget.style.background = '#fffbeb'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = 'white'; }}
                      >
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent leads */}
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ padding: '14px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Recent Leads</div>
                    <button onClick={() => setActiveTab('leads')} style={{ fontSize: 13, color: '#d97706', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
                  </div>
                  {leadsLoading ? (
                    <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Loading leads…</div>
                  ) : recentLeads.length === 0 ? (
                    <div style={{ padding: '40px 32px', textAlign: 'center' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                        <InboxIcon size={24} color="#94a3b8" />
                      </div>
                      <div style={{ fontWeight: 700, color: '#374151', marginBottom: 6, fontSize: 15 }}>No leads yet</div>
                      <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 300, margin: '0 auto' }}>
                        Embed your calculator on your website to start capturing solar leads.
                      </p>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Name', 'Location', 'System Size', 'Annual Savings', 'Date'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '9px 14px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentLeads.map((l, i) => (
                          <tr key={l.id} style={{ borderBottom: i < recentLeads.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer' }} onClick={() => { setActiveTab('leads'); setTimeout(() => openLead(l), 50); }}>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{l.name || '(No name)'}</div>
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>{l.email}</div>
                            </td>
                            <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{[l.zip, l.state].filter(Boolean).join(', ') || '—'}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{l.system_size_kw ? `${l.system_size_kw} kW` : '—'}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#16a34a' }}>{l.annual_savings ? `$${l.annual_savings.toLocaleString()}/yr` : '—'}</td>
                            <td style={{ padding: '12px 14px', fontSize: 12, color: '#94a3b8' }}>{new Date(l.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
          })()}

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
                <SettingRow label="Logo URL" hint="Paste a publicly hosted image URL (PNG, SVG, JPG)">
                  <input type="text" placeholder="https://yoursite.com/logo.png" value={config.logoUrl || ''} onChange={e => update('logoUrl', e.target.value)} className="dash-input dash-input-text" />
                  {config.logoUrl && (
                    <img src={config.logoUrl} alt="logo preview" style={{ marginTop: 8, maxHeight: 48, maxWidth: 200, borderRadius: 4, display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                  )}
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

          {activeTab === 'embed' && (() => {
            const h = config.frameHeight || 620;
            const w = config.frameWidth;
            const iframeWidth = w ? `${w}px` : '100%';
            const iframeCode = `<iframe\n  src="${siteUrl}/embed?installer=${installerId}"\n  width="${iframeWidth}"\n  height="${h}"\n  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.10);"\n  title="Solar Savings Calculator"\n  loading="lazy">\n</iframe>`;
            const scriptCode = embedCode;
            const wpCode = `[mysolarwidget installer_id="${installerId}" height="${h}"]`;

            const EmbedCard = ({ title, badge, desc, code, copied, onCopy }) => (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 14 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{title}</span>
                      {badge && <span style={{ fontSize: 11, fontWeight: 700, background: '#fffbeb', color: '#d97706', padding: '2px 8px', borderRadius: 20 }}>{badge}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
                  </div>
                  <button onClick={onCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: copied ? '#16a34a' : '#0f172a', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 12.5, flexShrink: 0, marginLeft: 14, transition: 'background 0.15s' }}>
                    {copied ? <><CheckCircleIcon size={13} /> Copied!</> : <><ClipboardIcon size={13} /> Copy Code</>}
                  </button>
                </div>
                <div style={{ background: '#0f172a', padding: '14px 18px', overflowX: 'auto' }}>
                  <code style={{ fontFamily: "'Menlo','Monaco',monospace", fontSize: 12, color: '#7dd3fc', whiteSpace: 'pre', display: 'block' }}>{code}</code>
                </div>
              </div>
            );

            return (
              <div>
                <div style={{ marginBottom: 22 }}>
                  <EmbedCard title="Full Embed (Recommended)" badge="Recommended" desc="iFrame + popup handler. Enables the full-screen report overlay when visitors click 'Open Full Solar Report'." code={scriptCode} copied={scriptCopied} onCopy={() => { navigator.clipboard.writeText(scriptCode); setScriptCopied(true); setTimeout(() => setScriptCopied(false), 2500); }} />
                  <EmbedCard title="iFrame Only" desc="Basic embed without the full-report popup. Use only if you don't need the full report overlay." code={iframeCode} copied={embedCopied} onCopy={() => { navigator.clipboard.writeText(iframeCode); setEmbedCopied(true); setTimeout(() => setEmbedCopied(false), 2500); }} />
                  <EmbedCard title="WordPress Shortcode" desc="Install the MySolarWidget plugin, then paste this shortcode anywhere on your site." code={wpCode} copied={wpCopied} onCopy={() => { navigator.clipboard.writeText(wpCode); setWpCopied(true); setTimeout(() => setWpCopied(false), 2500); }} />
                </div>

                {/* Frame size settings */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px', marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Frame Dimensions</div>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Height (px) <span style={{ color: '#94a3b8', fontWeight: 400 }}>Recommended: 580–800</span></label>
                      <input type="number" min="480" max="1200" step="10" value={h} onChange={e => update('frameHeight', parseInt(e.target.value) || 620)} className="dash-input" style={{ width: 110 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Width (px) <span style={{ color: '#94a3b8', fontWeight: 400 }}>Leave blank for 100%</span></label>
                      <input type="number" min="320" max="1400" step="10" placeholder="Auto (100%)" value={config.frameWidth || ''} onChange={e => update('frameWidth', e.target.value ? parseInt(e.target.value) : null)} className="dash-input" style={{ width: 110 }} />
                    </div>
                  </div>
                </div>

                {/* Installation guides */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px', marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Installation Guide</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    {[
                      { platform: 'Wix',             steps: ['Go to Edit Site', 'Add an Embed element', 'Paste the iFrame code'] },
                      { platform: 'Squarespace',     steps: ['Add a Code Block', 'Switch to HTML mode', 'Paste the iFrame code'] },
                      { platform: 'WordPress',       steps: ['Open Gutenberg editor', 'Add a Custom HTML block', 'Paste the iFrame code'] },
                      { platform: 'Weebly / Duda',   steps: ['Add Embed Code element', 'Paste iFrame in the box', 'Publish your changes'] },
                    ].map(({ platform, steps }) => (
                      <div key={platform} style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#0f172a' }}>{platform}</div>
                        <ol style={{ paddingLeft: 16, margin: 0 }}>
                          {steps.map(s => <li key={s} style={{ fontSize: 12.5, color: '#64748b', marginBottom: 5 }}>{s}</li>)}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview link */}
                <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef9c3)', border: '1px solid #fde68a', borderRadius: 12, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#92400e', marginBottom: 4 }}>Preview your widget</div>
                    <p style={{ fontSize: 13, color: '#78350f', margin: 0 }}>See exactly how it looks before embedding on your site.</p>
                  </div>
                  <a href={`/embed?installer=${installerId}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#d97706', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
                    Open Preview →
                  </a>
                </div>
              </div>
            );
          })()}

          {activeTab === 'leads' && (() => {
            const batteryLabel = b => ({ none: 'No Battery', one: '1 Battery', two: '2 Batteries' }[b] || fmt(b) || '—');
            const activeLeads = leads.filter(l => !l.deleted_at);
            const filteredLeads = activeLeads.filter(l => {
              if (leadFilter !== 'all' && l.home_type !== leadFilter) return false;
              if (leadSearch) {
                const q = leadSearch.toLowerCase();
                return (l.name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q) || (l.zip || '').includes(q);
              }
              return true;
            });
            const homeTypes = [...new Set(activeLeads.map(l => l.home_type).filter(Boolean))];
            const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', border: '1px solid #e2e8f0', borderRadius: 7, background: 'white', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#374151' };

            return (
            <>
            {/* Edit Lead Modal */}
            {editingLead && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Edit Lead</h3>
                    {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel']].map(([label, field, type]) => (
                      <div key={field} style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>{label}</label>
                        <input type={type} value={editDraft[field] || ''} onChange={e => setEditDraft(d => ({ ...d, [field]: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }} />
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                      <button onClick={() => setEditingLead(null)} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 7, background: '#fff', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                      <button onClick={handleSaveLead} style={{ padding: '8px 16px', border: 'none', borderRadius: 7, background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    </div>
                  </div>
                </div>
              )}

            <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 160px)', minHeight: 480 }}>
              {/* Lead list */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Toolbar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {trashView ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button onClick={() => setTrashView(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 2 }}>
                            ← Back to Leads
                          </button>
                          <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 400 }}>/ Trash</span>
                        </span>
                      ) : (
                        <>Leads <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 400 }}>({filteredLeads.length})</span></>
                      )}
                    </h2>
                    <div style={{ display: 'flex', gap: 7 }}>
                      <button onClick={() => setLeads([])} style={btnStyle} onClick={async () => { setLeadsLoading(true); const { data } = await supabase.from('leads').select('*').eq('installer_id', installerId).is('deleted_at', null).order('created_at', { ascending: false }); setLeads(data || []); setLeadsLoading(false); }}>
                        <RefreshCwIcon size={13} /> Refresh
                      </button>
                      <button onClick={exportCSV} disabled={filteredLeads.length === 0} style={{ ...btnStyle, opacity: filteredLeads.length === 0 ? 0.5 : 1 }}>
                        <DownloadIcon size={13} /> Export CSV
                      </button>
                      {!trashView && (
                        <button onClick={() => setTrashView(true)} style={btnStyle}>
                          <TrashIcon size={13} /> Trash {trashedLeads.length > 0 && `(${trashedLeads.length})`}
                        </button>
                      )}
                    </div>
                  </div>
                  {!trashView && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                        <SearchIcon size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={leadSearch} onChange={e => setLeadSearch(e.target.value)} placeholder="Search by name, email, ZIP…" style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, outline: 'none', color: '#0f172a', boxSizing: 'border-box' }} />
                      </div>
                      <select value={leadFilter} onChange={e => setLeadFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, background: 'white', cursor: 'pointer', outline: 'none', color: '#374151' }}>
                        <option value="all">All home types</option>
                        {homeTypes.map(t => <option key={t} value={t}>{fmt(t)}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* List / Trash */}
                {/* Bulk actions bar */}
                {!trashView && selectedLeadIds.size > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8', flex: 1 }}>{selectedLeadIds.size} lead{selectedLeadIds.size !== 1 ? 's' : ''} selected</span>
                    <button onClick={() => handleBulkArchive(selectedLeadIds)} style={{ padding: '5px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>Move to Trash</button>
                    <button onClick={async () => { if (!window.confirm(`Permanently delete ${selectedLeadIds.size} lead(s)? This cannot be undone.`)) return; const ids = [...selectedLeadIds]; await supabase.from('leads').delete().in('id', ids); setLeads(prev => prev.filter(l => !selectedLeadIds.has(l.id))); if (selectedLead && selectedLeadIds.has(selectedLead.id)) setSelectedLead(null); setSelectedLeadIds(new Set()); }} style={{ padding: '5px 12px', background: '#7f1d1d', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>Delete Forever</button>
                    <button onClick={() => setSelectedLeadIds(new Set())} style={{ padding: '5px 12px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', fontSize: 12.5 }}>Clear</button>
                  </div>
                )}

                {leadsLoading ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>Loading…</div>
                ) : trashView ? (
                  <div style={{ flex: 1, background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'auto' }}>
                    {trashedLeads.length === 0 ? (
                      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
                        <TrashIcon size={28} style={{ marginBottom: 10 }} />
                        <p style={{ fontSize: 14 }}>Trash is empty.</p>
                      </div>
                    ) : trashedLeads.map((lead, i) => (
                      <div key={lead.id} style={{ padding: '12px 16px', borderBottom: i < trashedLeads.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: '#64748b' }}>{lead.name || '(No name)'}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>{lead.email} · Deleted {new Date(lead.deleted_at).toLocaleDateString()}</div>
                        </div>
                        <button onClick={() => handleRestoreLead(lead)} style={{ padding: '5px 12px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#0f172a' }}>Restore</button>
                        <button onClick={() => handlePermanentDelete(lead)} style={{ padding: '5px 12px', border: '1px solid #fecaca', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#dc2626' }}>Delete forever</button>
                      </div>
                    ))}
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <InboxIcon size={24} color="#94a3b8" />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#374151', marginBottom: 5 }}>
                      {leadSearch || leadFilter !== 'all' ? 'No matching leads' : 'No leads yet'}
                    </div>
                    <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', maxWidth: 280, margin: 0 }}>
                      {leadSearch || leadFilter !== 'all' ? 'Try changing your search or filter.' : 'Embed your calculator to start capturing leads.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '9px 10px 9px 14px', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 2 }}>
                            <input type="checkbox"
                              checked={filteredLeads.length > 0 && filteredLeads.every(l => selectedLeadIds.has(l.id))}
                              ref={el => { if (el) el.indeterminate = selectedLeadIds.size > 0 && !filteredLeads.every(l => selectedLeadIds.has(l.id)); }}
                              onChange={e => setSelectedLeadIds(e.target.checked ? new Set(filteredLeads.map(l => l.id)) : new Set())}
                              style={{ cursor: 'pointer', width: 14, height: 14 }}
                            />
                          </th>
                          {[
                            'Name', 'Email', 'Phone', 'Location', 'Bill/mo',
                            'Home', 'Roof', 'Battery', 'Sun', 'Owns Home',
                            'System', 'Savings/yr', 'Payment', 'Timeline',
                            ...(config.customSteps || []).map(s => s.label || s.id),
                            'Date',
                          ].map(col => (
                            <th key={col} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 2 }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead, i) => {
                          const isChecked = selectedLeadIds.has(lead.id);
                          const isSelected = selectedLead?.id === lead.id;
                          const customSteps = config.customSteps || [];
                          const rowBg = isSelected ? '#fffbeb' : isChecked ? '#f0f9ff' : 'white';
                          return (
                            <tr key={lead.id}
                              onClick={() => openLead(lead)}
                              style={{ borderBottom: i < filteredLeads.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer', background: rowBg, transition: 'background 0.1s' }}
                              onMouseEnter={e => { if (!isSelected && !isChecked) e.currentTarget.style.background = '#f8fafc'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = rowBg; }}
                            >
                              <td style={{ padding: '8px 10px 8px 14px' }} onClick={e => e.stopPropagation()}>
                                <input type="checkbox"
                                  checked={isChecked}
                                  onChange={e => {
                                    const next = new Set(selectedLeadIds);
                                    if (e.target.checked) next.add(lead.id); else next.delete(lead.id);
                                    setSelectedLeadIds(next);
                                  }}
                                  style={{ cursor: 'pointer', width: 14, height: 14 }}
                                />
                              </td>
                              <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0f172a', minWidth: 120 }}>{lead.name || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569', minWidth: 160 }}>{lead.email || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{lead.phone || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{[lead.zip, lead.state].filter(Boolean).join(', ') || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{lead.monthly_bill != null ? `$${lead.monthly_bill}` : '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{fmt(lead.home_type) || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{fmt(lead.roof_type) || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{batteryLabel(lead.battery)}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{fmt(lead.sun_exposure) || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{lead.owns_home != null ? (lead.owns_home ? 'Yes' : 'No') : '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#d97706', fontWeight: 700 }}>{lead.system_size_kw ? `${lead.system_size_kw} kW` : '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#16a34a', fontWeight: 700 }}>{lead.annual_savings ? `$${lead.annual_savings.toLocaleString()}` : '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{fmt(lead.payment_method) || '—'}</td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>{fmt(lead.timeline) || '—'}</td>
                              {customSteps.map(step => (
                                <td key={step.id} style={{ padding: '8px 12px', color: '#475569' }}>
                                  {lead.custom_answers?.[step.id] ?? '—'}
                                </td>
                              ))}
                              <td style={{ padding: '8px 12px', color: '#94a3b8', fontSize: 11.5 }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Lead detail panel */}
              {selectedLead && !trashView && (
                <div style={{ width: 340, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 2 }}>{selectedLead.name || '(No name)'}</h3>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(selectedLead.created_at).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}>
                      <XIcon size={18} />
                    </button>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 9, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {[
                      ['Email',         selectedLead.email,              `mailto:${selectedLead.email}`],
                      ['Phone',         selectedLead.phone,              `tel:${selectedLead.phone}`],
                      ['Location',      [selectedLead.zip, selectedLead.state].filter(Boolean).join(' · ') || null, null],
                      ['Monthly Bill',  selectedLead.monthly_bill != null ? `$${selectedLead.monthly_bill}/mo` : null, null],
                      ['Home Type',     fmt(selectedLead.home_type),     null],
                      ['Roof Type',     fmt(selectedLead.roof_type),     null],
                      ['Battery',       batteryLabel(selectedLead.battery), null],
                      ['Sun Exposure',  fmt(selectedLead.sun_exposure),  null],
                      ['Owns Home',     selectedLead.owns_home != null ? (selectedLead.owns_home ? 'Yes' : 'No') : null, null],
                      ['System Size',   selectedLead.system_size_kw ? `${selectedLead.system_size_kw} kW` : null, null],
                      ['Annual Savings',selectedLead.annual_savings ? `$${selectedLead.annual_savings.toLocaleString()}/yr` : null, null],
                      ['Payment Pref.', fmt(selectedLead.payment_method), null],
                      ['Timeline',      fmt(selectedLead.timeline),      null],
                    ].filter(([, val]) => val).map(([label, val, href]) => (
                      <div key={label} style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', minWidth: 88, paddingTop: 1 }}>{label}</span>
                        {href
                          ? <a href={href} style={{ fontSize: 13, color: '#d97706', fontWeight: 500 }}>{val}</a>
                          : <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{val}</span>
                        }
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>Internal Notes</div>
                    <textarea value={leadNotes} onChange={e => setLeadNotes(e.target.value)} placeholder="Add notes about this lead…" style={{ width: '100%', padding: '9px 11px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, resize: 'vertical', minHeight: 80, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    <button onClick={handleSaveNote} disabled={savingNote} style={{ marginTop: 6, padding: '7px 14px', background: '#d97706', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                      {savingNote ? 'Saving…' : 'Save Note'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 7, paddingTop: 8, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                    {selectedLead.email && (
                      <a href={`mailto:${selectedLead.email}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', background: '#d97706', color: 'white', textAlign: 'center', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: 13, minWidth: 80 }}>
                        <MailIcon size={13} /> Email
                      </a>
                    )}
                    {selectedLead.phone && (
                      <a href={`tel:${selectedLead.phone}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', background: '#16a34a', color: 'white', textAlign: 'center', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: 13, minWidth: 80 }}>
                        <PhoneIcon size={13} /> Call
                      </a>
                    )}
                    <button onClick={() => { setEditingLead(selectedLead); setEditDraft({ name: selectedLead.name || '', email: selectedLead.email || '', phone: selectedLead.phone || '' }); }} style={{ padding: '9px 13px', background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <PencilIcon size={13} /> Edit
                    </button>
                    <button onClick={() => { handleDeleteLead(selectedLead); setSelectedLead(null); }} style={{ padding: '9px 13px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                      Archive
                    </button>
                  </div>
                </div>
              )}
            </div>
            </>
            );
          })()}

          {activeTab === 'settings' && (
            <div className="settings-grid">
              {/* Account */}
              <div className="setting-card">
                <div className="setting-card-header">
                  <h3 className="setting-card-title">Account</h3>
                  <p className="setting-card-desc">Your login email and password.</p>
                </div>
                <div className="setting-card-body">
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Email</label>
                    <input
                      readOnly
                      type="text"
                      value={user?.email || ''}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#f8fafc', color: '#64748b', boxSizing: 'border-box' }}
                    />
                  </div>

                  <form onSubmit={handleChangePassword}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Change Password</div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>New Password</label>
                      <input
                        type="password"
                        value={pwNew}
                        onChange={e => setPwNew(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Confirm New Password</label>
                      <input
                        type="password"
                        value={pwConfirm}
                        onChange={e => setPwConfirm(e.target.value)}
                        placeholder="Repeat new password"
                        required
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>
                    {pwMsg && (
                      <div style={{ marginBottom: 12, fontSize: 13, color: pwMsg.type === 'success' ? '#16a34a' : '#dc2626', background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${pwMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 7, padding: '8px 12px' }}>
                        {pwMsg.text}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={pwLoading}
                      style={{ padding: '8px 18px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: pwLoading ? 'not-allowed' : 'pointer', opacity: pwLoading ? 0.7 : 1 }}
                    >
                      {pwLoading ? 'Updating…' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>

              {/* API Access */}
              <div className="setting-card">
                <div className="setting-card-header">
                  <h3 className="setting-card-title">API Access</h3>
                  <p className="setting-card-desc">Pull your leads in real time into any CRM, Zapier, Make, or custom integration.</p>
                </div>
                <div className="setting-card-body">
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Your API Key</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        readOnly
                        type="text"
                        value={apiKey || 'Loading…'}
                        style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', background: '#f8fafc', color: '#0f172a' }}
                      />
                      <button onClick={handleCopyApiKey} style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', color: apiKeyCopied ? '#16a34a' : '#0f172a' }}>
                        {apiKeyCopied ? 'Copied!' : 'Copy'}
                      </button>
                      <button onClick={handleRegenerateApiKey} disabled={apiKeyRegenerating} style={{ padding: '8px 14px', border: '1px solid #fecaca', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', color: '#dc2626' }}>
                        {apiKeyRegenerating ? 'Regenerating…' : 'Regenerate'}
                      </button>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 10 }}>Usage Examples</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Fetch all leads:</div>
                    <pre style={{ margin: '0 0 12px', fontSize: 11, background: '#0f172a', color: '#e2e8f0', padding: '10px 14px', borderRadius: 6, overflowX: 'auto' }}>{`curl ${API_BASE}/api/leads \\
  -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}"`}</pre>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Fetch leads since a date (for polling):</div>
                    <pre style={{ margin: 0, fontSize: 11, background: '#0f172a', color: '#e2e8f0', padding: '10px 14px', borderRadius: 6, overflowX: 'auto' }}>{`curl "${API_BASE}/api/leads?since=2026-01-01T00:00:00Z" \\
  -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}"`}</pre>
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: 12, color: '#94a3b8' }}>Keep your API key secret. Regenerating it will invalidate all existing integrations.</p>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="setting-card" style={{ border: '1px solid #fecaca' }}>
                <div className="setting-card-header">
                  <h3 className="setting-card-title" style={{ color: '#dc2626' }}>Danger Zone</h3>
                  <p className="setting-card-desc">Permanently delete your account and all associated data. This cannot be undone.</p>
                </div>
                <div className="setting-card-body">
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
                    Deleting your account will permanently remove your profile, all leads, settings, and branding. Your embedded calculator will stop working immediately.
                  </p>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                      Type <strong>DELETE</strong> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                      placeholder="DELETE"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', background: '#fff' }}
                    />
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                    style={{
                      padding: '9px 20px', background: deleteConfirm === 'DELETE' && !deleteLoading ? '#dc2626' : '#f1f5f9',
                      color: deleteConfirm === 'DELETE' && !deleteLoading ? 'white' : '#94a3b8',
                      border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                      cursor: deleteConfirm === 'DELETE' && !deleteLoading ? 'pointer' : 'not-allowed',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {deleteLoading ? 'Deleting…' : 'Delete My Account'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <SubscriptionPanel
              subscription={subscription}
              loading={subLoading}
              onSubscribe={handleSubscribe}
              onManage={handleManageBilling}
              justSubscribed={new URLSearchParams(window.location.search).get('subscribed') === 'true'}
            />
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

const SUBSCRIPTION_FEATURES = [
  { Icon: GlobeIcon,      text: 'Embeddable solar calculator widget on your website' },
  { Icon: PaintBrushIcon, text: 'Custom branding — colors, logo, and CTA text' },
  { Icon: ChartBarIcon,   text: 'Lead capture & CRM dashboard' },
  { Icon: DollarSignIcon, text: 'Pricing controls and per-watt margin settings' },
  { Icon: KeyIcon,        text: 'API access for CRM integration' },
  { Icon: TrendingUpIcon, text: 'Lead analytics and CSV export' },
  { Icon: PhoneIcon,      text: 'Priority support' },
  { Icon: SparklesIcon,   text: 'Unlimited calculator sessions per month' },
];

function SubscriptionPanel({ subscription, loading, onSubscribe, onManage, justSubscribed }) {
  if (loading) return (
    <div style={{ padding: 32, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
      Loading subscription details...
    </div>
  );

  const status = subscription?.status || 'requires_trial_setup';
  const isActive = subscription?.active !== false;
  const hasStripe = !!subscription?.stripeCustomerId;
  const currentPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const statusConfig = {
    requires_trial_setup: { Icon: BoltIcon,          iconColor: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', title: 'Start Your Free Trial' },
    trialing:             { Icon: BoltIcon,          iconColor: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', title: 'Free Trial' },
    active:               { Icon: CheckCircleIcon,   iconColor: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', title: 'Active Subscription' },
    active_canceling:     { Icon: AlertTriangleIcon, iconColor: '#d97706', bg: '#fffbeb', border: '#fde68a', title: 'Active (Canceling)' },
    past_due:             { Icon: AlertTriangleIcon, iconColor: '#dc2626', bg: '#fff1f2', border: '#fecdd3', title: 'Payment Past Due' },
    expired:              { Icon: AlertTriangleIcon, iconColor: '#dc2626', bg: '#fef2f2', border: '#fecaca', title: 'Trial Expired' },
    canceled:             { Icon: AlertTriangleIcon, iconColor: '#dc2626', bg: '#fef2f2', border: '#fecaca', title: 'Subscription Canceled' },
  };
  const sc = statusConfig[status] || { Icon: AlertTriangleIcon, iconColor: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', title: 'No Active Plan' };

  const statusDetail = (() => {
    if (status === 'requires_trial_setup') return 'Get 7 days free — credit card required, cancel anytime before your trial ends.';
    if (status === 'trialing' && subscription?.daysLeft > 0) return `${subscription.daysLeft} days remaining in your trial.`;
    if (status === 'trialing') return 'Your trial ends today.';
    if (status === 'active' && currentPeriodEnd) return `Renews on ${currentPeriodEnd}.`;
    if (status === 'active_canceling' && currentPeriodEnd) return `Active until ${currentPeriodEnd}. Will not renew.`;
    if (status === 'past_due') return 'Your payment failed. Update your payment method to keep your calculator active.';
    if (status === 'expired' || status === 'canceled') return 'Your calculator is currently paused. Subscribe to reactivate it.';
    return '';
  })();

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 3, letterSpacing: '-0.3px' }}>Subscription</h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>Manage your MySolarWidget plan and billing.</p>
      </div>

      {/* Success banner after returning from Stripe checkout */}
      {justSubscribed && (status === 'active' || status === 'trialing') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '11px 14px', marginBottom: 18, color: '#15803d', fontSize: 14, fontWeight: 600 }}>
          <SparklesIcon size={15} style={{ verticalAlign: 'middle' }} /> You're subscribed! Your embedded calculator is now active.
        </div>
      )}

      {/* Status card */}
      <div style={{ borderRadius: 12, padding: '20px 22px', marginBottom: 18, background: sc.bg, border: `1px solid ${sc.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <sc.Icon size={22} color={sc.iconColor} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.3px' }}>{sc.title}</div>
              <div style={{ fontSize: 13.5, color: '#374151' }}>{statusDetail}</div>
            </div>
          </div>
          <div>
            {(!isActive || status === 'trialing' || status === 'requires_trial_setup') && (
              <button onClick={onSubscribe}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                {status === 'requires_trial_setup' ? 'Start 7-Day Trial →' : status === 'trialing' ? 'Subscribe Now →' : 'Reactivate →'}
              </button>
            )}
            {(status === 'active' || status === 'active_canceling' || status === 'past_due') && (
              <button onClick={onManage}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: '#0f172a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Manage Billing →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 22px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>What's included</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SUBSCRIPTION_FEATURES.map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color="#2563eb" />
              </div>
              <span style={{ fontSize: 13.5, color: '#374151' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)', border: '1px solid #bfdbfe', borderRadius: 12, padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>$149</span>
          <span style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}>/month</span>
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>Cancel anytime. &nbsp;·&nbsp; 🔒 Secure billing via Stripe</div>
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
