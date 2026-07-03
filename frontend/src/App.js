import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import { BoltIcon } from './components/ui/Icons';
import { supabase } from './lib/supabase';
import SolarCalculator from './components/calculator/SolarCalculator';
import ResultsScreen from './components/calculator/ResultsScreen';
import InstallerDashboard from './components/dashboard/InstallerDashboard';
import AuthPage from './components/dashboard/AuthPage';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import SEOContent from './components/ui/SEOContent';
import BlogIndex from './components/blog/BlogIndex';
import BlogPost from './components/blog/BlogPost';
import BlogCategory from './components/blog/BlogCategory';
import InstallerLanding from './components/pages/InstallerLanding';
import PartnerWithUs from './components/pages/PartnerWithUs';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || '';
const pathname = window.location.pathname.replace(/\/$/, '') || '/';
const isInstaller = pathname.startsWith('/installer');
const isForInstallers = pathname === '/for-installers';
const isEmbed = pathname.startsWith('/embed');
const isBlog = pathname === '/blog' || pathname.startsWith('/blog/');
const isPrivacyPolicy = pathname === '/privacy-policy';
const isTermsOfService = pathname === '/terms-of-service';
const isAbout = pathname === '/about';
const isContact = pathname === '/contact';
const isResults = pathname === '/results';
const isPartnerWithUs = pathname === '/partner-with-us';
const embedInstallerId = isEmbed ? new URLSearchParams(window.location.search).get('installer') : null;

function BlogRouter() {
  if (pathname === '/blog') return <BlogIndex />;
  if (pathname.startsWith('/blog/category/')) {
    const cat = pathname.replace('/blog/category/', '');
    return <BlogCategory category={cat} />;
  }
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '');
    return <BlogPost slug={slug} />;
  }
  return <BlogIndex />;
}

function ResultsPage() {
  const [data, setData] = useState(null);
  const isPopup = new URLSearchParams(window.location.search).get('popup') === '1';

  useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) setData(JSON.parse(decodeURIComponent(escape(atob(hash)))));
    } catch {}
  }, []);

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
      Report not found. <a href="/" style={{ color: '#1e40af', marginLeft: 6 }}>Start a new estimate →</a>
    </div>
  );

  const installerConfig = data.c || null;
  const primaryColor = installerConfig?.primaryColor || '#3b6cf4';

  const screen = (
    <ResultsScreen
      results={data.r}
      form={{ monthlyBill: data.b, state: data.s }}
      lead={{ paymentMethod: data.p }}
      installerConfig={installerConfig}
      embedded={false}
      popup={isPopup}
      onReset={() => { window.location.href = '/'; }}
    />
  );

  if (isPopup) {
    const closePopup = () => window.parent.postMessage({ type: 'MSW_CLOSE_REPORT' }, '*');
    return (
      <div style={{ background: '#f1f5f9', minHeight: '100vh', fontFamily: "'Poppins', -apple-system, sans-serif" }}>
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: primaryColor,
          padding: '0 20px',
          height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>Full Solar Report</span>
          </div>
          <button
            onClick={closePopup}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            title="Close"
          >
            ✕
          </button>
        </div>
        <main>{screen}</main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main>{screen}</main>
      <Footer />
    </div>
  );
}

function EmbedWrapper({ installerId }) {
  const [installerConfig, setInstallerConfig] = useState(null);

  useEffect(() => {
    if (!installerId) { setInstallerConfig({}); return; }
    const load = async () => {
      try {
        const backendRes = await axios.get(`${API_BASE}/api/installer/${installerId}/public`).catch(() => ({ data: { data: {} } }));
        const backendData = backendRes.data?.data || {};
        const { data: supaRows } = await supabase
          .from('installer_configs')
          .select('config')
          .eq('installer_id', installerId)
          .limit(1);
        const supaConfig = supaRows?.[0]?.config || {};
        setInstallerConfig({
          ...supaConfig,
          paused: backendData.paused ?? false,
          trialDaysLeft: backendData.trialDaysLeft,
        });
      } catch {
        setInstallerConfig({});
      }
    };
    load();
  }, [installerId]);

  if (!installerConfig) return null;

  if (installerConfig.paused) {
    return (
      <div style={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ marginBottom: 12 }}><BoltIcon size={36} /></div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Calculator Temporarily Unavailable</h3>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>This solar calculator is currently paused. Please check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}>
      <SolarCalculator embedded installerConfig={installerConfig} installerId={installerId} />
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
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (isEmbed) return <EmbedWrapper installerId={embedInstallerId} />;
  if (isResults) return <HelmetProvider><ResultsPage /></HelmetProvider>;
  if (isForInstallers) return <HelmetProvider><InstallerLanding /></HelmetProvider>;
  if (isPartnerWithUs) return <HelmetProvider><div className="app"><Header /><main><PartnerWithUs /></main><Footer /></div></HelmetProvider>;

  if (isPrivacyPolicy) return <HelmetProvider><div className="app"><Header /><main><PrivacyPolicy /></main><Footer /></div></HelmetProvider>;
  if (isTermsOfService) return <HelmetProvider><div className="app"><Header /><main><TermsOfService /></main><Footer /></div></HelmetProvider>;
  if (isAbout) return <HelmetProvider><div className="app"><Header /><main><About /></main><Footer /></div></HelmetProvider>;
  if (isContact) return <HelmetProvider><div className="app"><Header /><main><Contact /></main><Footer /></div></HelmetProvider>;

  if (isBlog) return <HelmetProvider><div className="app"><Header /><main><BlogRouter /></main><Footer /></div></HelmetProvider>;

  if (isInstaller) {
    if (authLoading) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ color: 'white', fontSize: 16 }}>Loading...</div>
      </div>
    );
    if (!user) return <HelmetProvider><AuthPage onAuth={setUser} /></HelmetProvider>;
    return <HelmetProvider><InstallerDashboard user={user} onLogout={handleLogout} /></HelmetProvider>;
  }

  return (
    <HelmetProvider>
      <div className="app">
        <Helmet>
          <title>Free Solar Panel Cost Calculator 2026 | MySolarWidget</title>
          <meta name="description" content="Free solar panel cost calculator for US homeowners. Estimate installation cost, monthly savings &amp; 30-year ROI. Enter your electric bill and ZIP code — takes under 2 minutes." />
          <link rel="canonical" href="https://www.mysolarwidget.com/" />
          <meta property="og:title" content="Free Solar Panel Cost Calculator 2026 | MySolarWidget" />
          <meta property="og:description" content="Free solar panel cost calculator for US homeowners. Estimate installation cost, monthly savings &amp; 30-year ROI. Enter your electric bill and ZIP code." />
          <meta property="og:url" content="https://www.mysolarwidget.com/" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://www.mysolarwidget.com/android-chrome-512x512.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Free Solar Panel Cost Calculator 2026 | MySolarWidget" />
          <meta name="twitter:description" content="Instantly estimate your solar installation cost and 30-year savings. Free, powered by real NREL data. Takes under 2 minutes." />
          <meta name="twitter:image" content="https://www.mysolarwidget.com/android-chrome-512x512.png" />
        </Helmet>
        <Header />
        <main>
          <SolarCalculator />
          <SEOContent />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
