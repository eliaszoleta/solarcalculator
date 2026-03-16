import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { supabase } from './lib/supabase';
import SolarCalculator from './components/calculator/SolarCalculator';
import InstallerDashboard from './components/dashboard/InstallerDashboard';
import AuthPage from './components/dashboard/AuthPage';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import SEOContent from './components/ui/SEOContent';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || '';
const isInstaller = window.location.pathname.startsWith('/installer');
const isEmbed = window.location.pathname.startsWith('/embed');
const embedInstallerId = isEmbed ? new URLSearchParams(window.location.search).get('installer') : null;

// Fetches installer config then renders the calculator with it
function EmbedWrapper({ installerId }) {
  const [installerConfig, setInstallerConfig] = useState(null);

  useEffect(() => {
    if (!installerId) { setInstallerConfig({}); return; }
    axios.get(`${API_BASE}/api/installer/${installerId}/public`)
      .then(res => setInstallerConfig(res.data.data || {}))
      .catch(() => setInstallerConfig({}));
  }, [installerId]);

  if (!installerConfig) return null;

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <SolarCalculator embedded installerConfig={installerConfig} />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isInstaller);

  useEffect(() => {
    if (!isInstaller) return;
    const timeout = setTimeout(() => setAuthLoading(false), 3000);
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    }).catch(() => {
      clearTimeout(timeout);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (isEmbed) return <EmbedWrapper installerId={embedInstallerId} />;

  if (isInstaller) {
    if (authLoading) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ color: 'white', fontSize: 16 }}>Loading...</div>
      </div>
    );
    if (!user) return <AuthPage onAuth={setUser} />;
    return <InstallerDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      <Helmet>
        <title>Solar Savings Calculator — Estimate Cost & Savings in 2 Minutes</title>
        <meta name="description" content="Use our free solar savings calculator to instantly estimate your solar panel installation cost, monthly savings, and 30-year return on investment. Takes under 2 minutes." />
        <link rel="canonical" href="https://solarcalculator.example.com/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Solar Savings Calculator",
          "description": "Free solar panel cost and savings estimator for homeowners",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        })}</script>
      </Helmet>
      <Header />
      <main>
        <SolarCalculator />
        <SEOContent />
      </main>
      <Footer />
    </div>
  );
}
