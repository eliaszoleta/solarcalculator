import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot' | 'check_email'
  const [form, setForm] = useState({ email: '', password: '', companyName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle password reset redirect (Supabase sends user back with a token)
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset_password');
      }
      if (session && event === 'SIGNED_IN') {
        onAuth(session.user);
      }
    });
  }, [onAuth]);

  const update = (field, value) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignup = async e => {
    e.preventDefault();
    if (!form.companyName.trim()) { setError('Company name is required'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { company_name: form.companyName },
      },
    });
    if (error) { setError(error.message); }
    else { setMode('check_email'); }
    setLoading(false);
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/installer`,
    });
    if (error) { setError(error.message); }
    else { setMode('check_email'); }
    setLoading(false);
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.password });
    if (error) { setError(error.message); }
    else { setMode('login'); setError(''); alert('Password updated! Please sign in.'); }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/android-chrome-192x192.png" alt="MySolarWidget logo" style={{ width: 64, height: 64, borderRadius: 16 }} />
          <div style={{ fontSize: 24, fontWeight: 800, color: 'white', marginTop: 8 }}>
            MySolar<span style={{ color: '#f59e0b' }}>Widget</span>
          </div>
          <div style={{ fontSize: 14, color: '#93c5fd', marginTop: 4 }}>Installer Dashboard</div>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>

          {/* Check email confirmation */}
          {mode === 'check_email' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                We sent a link to <strong>{form.email}</strong>.<br />
                Click it to {mode === 'check_email' && form.companyName ? 'confirm your account' : 'reset your password'}.
              </p>
              <button onClick={() => setMode('login')} style={{ ...linkStyle, marginTop: 20, display: 'block', textAlign: 'center' }}>
                ← Back to sign in
              </button>
            </div>
          )}

          {/* Login */}
          {mode === 'login' && (
            <>
              <h1 style={headingStyle}>Welcome back</h1>
              <p style={subStyle}>Sign in to manage your solar calculator</p>
              <form onSubmit={handleLogin} style={formStyle}>
                <Field label="Email Address" type="email" placeholder="you@company.com" value={form.email} onChange={v => update('email', v)} />
                <Field label="Password" type="password" placeholder="••••••••" value={form.password} onChange={v => update('password', v)} />
                {error && <ErrorBox>{error}</ErrorBox>}
                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#64748b' }}>
                <button onClick={() => { setMode('forgot'); setError(''); }} style={linkStyle}>Forgot password?</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 14, color: '#64748b' }}>
                No account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); }} style={linkStyle}>Sign up free</button>
              </div>
            </>
          )}

          {/* Signup */}
          {mode === 'signup' && (
            <>
              <h1 style={headingStyle}>Create your account</h1>
              <p style={subStyle}>30-day free trial — no credit card required</p>
              <form onSubmit={handleSignup} style={formStyle}>
                <Field label="Company Name" type="text" placeholder="SunShine Solar LLC" value={form.companyName} onChange={v => update('companyName', v)} />
                <Field label="Email Address" type="email" placeholder="you@company.com" value={form.email} onChange={v => update('email', v)} />
                <Field label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={v => update('password', v)} />
                {error && <ErrorBox>{error}</ErrorBox>}
                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#64748b' }}>
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} style={linkStyle}>Sign in</button>
              </div>
            </>
          )}

          {/* Forgot password */}
          {mode === 'forgot' && (
            <>
              <h1 style={headingStyle}>Reset your password</h1>
              <p style={subStyle}>Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleForgotPassword} style={formStyle}>
                <Field label="Email Address" type="email" placeholder="you@company.com" value={form.email} onChange={v => update('email', v)} />
                {error && <ErrorBox>{error}</ErrorBox>}
                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#64748b' }}>
                <button onClick={() => { setMode('login'); setError(''); }} style={linkStyle}>← Back to sign in</button>
              </div>
            </>
          )}

          {/* Reset password (after clicking email link) */}
          {mode === 'reset_password' && (
            <>
              <h1 style={headingStyle}>Set new password</h1>
              <p style={subStyle}>Choose a strong new password for your account.</p>
              <form onSubmit={handleResetPassword} style={formStyle}>
                <Field label="New Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={v => update('password', v)} />
                {error && <ErrorBox>{error}</ErrorBox>}
                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        style={{
          width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
          borderRadius: 10, fontSize: 15, color: '#1e293b', outline: 'none',
          fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ErrorBox({ children }) {
  return (
    <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
      {children}
    </div>
  );
}

const headingStyle = { fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 };
const subStyle = { fontSize: 14, color: '#64748b', marginBottom: 24 };
const formStyle = { display: 'flex', flexDirection: 'column', gap: 14 };
const submitStyle = loading => ({
  padding: 13, background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e40af, #1d4ed8)',
  color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
  cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, fontFamily: 'inherit',
});
const linkStyle = { background: 'none', border: 'none', color: '#1e40af', fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' };
