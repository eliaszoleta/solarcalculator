import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', companyName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const { data } = await axios.post(`${API_BASE}${endpoint}`, form);
      if (data.success) {
        localStorage.setItem('sc_token', data.data.token);
        localStorage.setItem('sc_installer_id', data.data.installerId);
        localStorage.setItem('sc_company', data.data.companyName);
        onAuth(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 36 }}>☀️</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'white', marginTop: 8 }}>
            Solar<span style={{ color: '#f59e0b' }}>Calc</span>
          </div>
          <div style={{ fontSize: 14, color: '#93c5fd', marginTop: 4 }}>Installer Dashboard</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: 36,
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            {mode === 'login'
              ? 'Sign in to manage your solar calculator'
              : 'Start your 30-day free trial — no credit card required'}
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>Company Name</label>
                <input
                  type="text"
                  placeholder="SunShine Solar LLC"
                  value={form.companyName}
                  onChange={e => update('companyName', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            )}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                color: '#dc2626',
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              padding: '13px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e40af, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); }} style={linkStyle}>
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} style={linkStyle}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        {mode === 'signup' && (
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#93c5fd' }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  fontSize: 15,
  color: '#1e293b',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#1e40af',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 14,
  fontFamily: 'inherit',
};
