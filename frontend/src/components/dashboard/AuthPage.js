import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import { MailIcon } from '../ui/Icons';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function AuthPage({ onAuth }) {
  // 'login' | 'signup' | 'forgot' | 'check_email' | 'redirecting_to_checkout' | 'reset_password'
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', companyName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Signing up with Supabase email confirmation disabled grants a session
  // immediately, which fires the SIGNED_IN listener below -- but right
  // after signup we want to hand the new account straight to Stripe
  // Checkout, not drop it into the dashboard with no subscription yet.
  // This ref suppresses that one automatic onAuth call during the
  // signup -> checkout handoff; it's only let through as a fallback if
  // checkout session creation itself fails.
  const suppressAutoAuth = useRef(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset_password');
      }
      if (session && event === 'SIGNED_IN' && !suppressAutoAuth.current) {
        onAuth(session.user);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [onAuth]);

  const update = (field, value) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      // Supabase returns a generic 400 "Invalid login credentials" for both
      // a wrong password AND a nonexistent account, on purpose (so a login
      // form can't be used to enumerate which emails are registered). A
      // separate, deliberate lookup here is what lets this page give a more
      // specific, still-safe message back. Anything other than a 400 (a
      // timeout, a 5xx from Supabase infra) is a real outage, not a bad
      // password -- showing "wrong password" for that actively misleads
      // someone with correct credentials, so it gets calm, generic copy
      // instead.
      if (error.status === 400) {
        let accountExists = true; // fail toward the safer, more generic message
        try {
          const res = await axios.get(`${API_BASE}/api/installer/check-email-exists`, { params: { email: form.email } });
          accountExists = !!res.data?.exists;
        } catch {
          // lookup itself failed -- keep the generic fallback above
        }
        setError(accountExists ? 'Wrong email or password. Please try again.' : 'Account not found. Check your email or sign up below.');
      } else {
        setError("We're working on a few things behind the scenes right now. Please check back in a few hours and try signing in again.");
      }
    }
    setLoading(false);
  };

  const handleSignup = async e => {
    e.preventDefault();
    if (!form.companyName.trim()) { setError('Company name is required'); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { company_name: form.companyName },
        emailRedirectTo: 'https://www.solarcostpredictor.com/installer',
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.user && !data.session) {
      // Email confirmation required -- checkout happens after they click
      // the link and land back on /installer with a real session.
      setMode('check_email');
      setLoading(false);
      return;
    }
    if (data.session) {
      suppressAutoAuth.current = true;
      setMode('redirecting_to_checkout');
      try {
        const res = await axios.post(
          `${API_BASE}/api/subscription/checkout`,
          {},
          { headers: { Authorization: `Bearer ${data.session.access_token}` } }
        );
        window.location.href = res.data.url;
        return; // navigating away
      } catch {
        // Checkout session creation failed -- don't strand them on a dead
        // spinner. Let them into the dashboard; they can retry from the
        // Subscription tab.
        suppressAutoAuth.current = false;
        onAuth(data.user);
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: 'https://www.solarcostpredictor.com/installer',
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
      background: 'linear-gradient(135deg, #0f172a 0%, #123529 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-icon-navy.svg" alt="" style={{ height: 44, width: 44, borderRadius: 11, flexShrink: 0 }} />
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>Solar Cost <span style={{ color: '#4ade80' }}>Predictor</span></span>
          </div>
          <div style={{ fontSize: 14, color: '#a8c3b5', marginTop: 8 }}>Installer Dashboard</div>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>

          {/* Redirecting to Stripe Checkout right after signup */}
          {mode === 'redirecting_to_checkout' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1b4d3e', borderRadius: '50%', margin: '0 auto 20px', animation: 'ip-spin 0.8s linear infinite' }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Last step — activate your calculator</h2>
              <p style={{ fontSize: 14, color: '#64748b' }}>30 days free, then $49/month.</p>
              <style>{`@keyframes ip-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Check email confirmation */}
          {mode === 'check_email' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ marginBottom: 16 }}><MailIcon size={48} /></div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                We sent a link to <strong>{form.email}</strong>.<br />
                {form.companyName
                  ? 'Click it to confirm your account, then activate your calculator with a quick checkout step — 30 days free before your first charge.'
                  : 'Click it to reset your password.'}
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
              <p style={subStyle}>Start your 30-day free trial — card required, not charged until it ends.</p>
              <form onSubmit={handleSignup} style={formStyle}>
                <Field label="Company Name" type="text" placeholder="SunShine Solar LLC" value={form.companyName} onChange={v => update('companyName', v)} />
                <Field label="Email Address" type="email" placeholder="you@company.com" value={form.email} onChange={v => update('email', v)} />
                <Field label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={v => update('password', v)} />
                {error && <ErrorBox>{error}</ErrorBox>}
                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                  {loading ? 'Creating account...' : 'Start Free Trial'}
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
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{label}</label>
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
  padding: 13, background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1b4d3e, #123529)',
  color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
  cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, fontFamily: 'inherit',
});
const linkStyle = { background: 'none', border: 'none', color: '#1b4d3e', fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' };
