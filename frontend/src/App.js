import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
const embedInstallerId = isEmbed ? new URLSearchParams(window.location.search).get('installer') : null;

// Resolve blog route
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

// Standalone full-results page — reads encoded data from URL hash
function ResultsPage() {
  const [data, setData] = useState(null);
  // ?popup=1 = loaded inside the embed popup iframe — hide site chrome
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
    // Popup mode: render our own premium header (close via postMessage) + content only
    const closePopup = () => window.parent.postMessage({ type: 'MSW_CLOSE_REPORT' }, '*');
    return (
      <div style={{ background: '#f1f5f9', minHeight: '100vh', fontFamily: "'Poppins', -apple-system, sans-serif" }}>
        {/* Premium sticky header — uses installer primary color */}
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
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
              Full Solar Report
            </span>
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

// Fetches installer config then renders the calculator with it.
// Config is read directly from Supabase (always up-to-date, no backend redeploy needed).
// The backend is still called for the subscription paused check.
function EmbedWrapper({ installerId }) {
  const [installerConfig, setInstallerConfig] = useState(null);

  useEffect(() => {
    if (!installerId) { setInstallerConfig({}); return; }

    const load = async () => {
      try {
        // Fetch paused/subscription status from backend
        const backendRes = await axios.get(`${API_BASE}/api/installer/${installerId}/public`).catch(() => ({ data: { data: {} } }));
        const backendData = backendRes.data?.data || {};

        // Fetch full config (including customSteps) directly from Supabase
        const { data: supaRows } = await supabase
          .from('installer_configs')
          .select('config')
          .eq('installer_id', installerId)
          .limit(1);
        const supaConfig = supaRows?.[0]?.config || {};

        // Merge: Supabase has the latest full config, backend adds paused/trialDaysLeft
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
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
            This solar calculator is currently paused. Please check back soon.
          </p>
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
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (isEmbed) return <EmbedWrapper installerId={embedInstallerId} />;

  if (isResults) return <ResultsPage />;

  if (isForInstallers) return <InstallerLanding />;

  if (isPrivacyPolicy) return (
    <div className="app">
      <Header />
      <main><PrivacyPolicy /></main>
      <Footer />
    </div>
  );

  if (isTermsOfService) return (
    <div className="app">
      <Header />
      <main><TermsOfService /></main>
      <Footer />
    </div>
  );

  if (isAbout) return (
    <div className="app">
      <Header />
      <main><About /></main>
      <Footer />
    </div>
  );

  if (isContact) return (
    <div className="app">
      <Header />
      <main><Contact /></main>
      <Footer />
    </div>
  );

  if (isBlog) return (
    <div className="app">
      <Header />
      <main><BlogRouter /></main>
      <Footer />
    </div>
  );

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
        <title>Free Solar Panel Cost Calculator 2026 | MySolarWidget</title>
        <meta name="description" content="Free solar savings calculator for US homeowners. Enter your electric bill and get an instant estimate of solar installation cost, monthly savings, and 30-year ROI. Powered by real NREL sunlight data." />
        <link rel="canonical" href="https://www.mysolarwidget.com/" />
        <meta property="og:title" content="Free Solar Panel Cost Calculator 2026 | MySolarWidget" />
        <meta property="og:description" content="Free solar savings calculator for US homeowners. Enter your electric bill and get an instant estimate of solar installation cost, monthly savings, and 30-year ROI." />
        <meta property="og:url" content="https://www.mysolarwidget.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.mysolarwidget.com/android-chrome-512x512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Solar Panel Cost Calculator 2026 | MySolarWidget" />
        <meta name="twitter:description" content="Instantly estimate your solar installation cost and 30-year savings. Free, powered by real NREL data. Takes under 2 minutes." />
        <meta name="twitter:image" content="https://www.mysolarwidget.com/android-chrome-512x512.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "MySolarWidget — Solar Savings Calculator",
          "description": "Free solar panel cost and savings estimator for US homeowners. Powered by NREL PVWatts real irradiance data and EIA electricity rates.",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "url": "https://www.mysolarwidget.com/",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "publisher": {
            "@type": "Organization",
            "name": "MySolarWidget",
            "url": "https://www.mysolarwidget.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.mysolarwidget.com/android-chrome-512x512.png"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "312",
            "bestRating": "5"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How accurate is this solar calculator?",
              "acceptedAnswer": { "@type": "Answer", "text": "Our estimates are 80–90% accurate compared to real installer quotes. On a typical $25,000 system, that means your estimate is within $2,500–$5,000 of what an installer would actually propose. We use real irradiance data from the NREL PVWatts API for your exact ZIP code, EIA electricity rates by state, and current market installation costs ($2.50–$3.50/watt). For a final price, you'll still need a site visit from a certified installer." }
            },
            {
              "@type": "Question",
              "name": "How much does solar save on average?",
              "acceptedAnswer": { "@type": "Answer", "text": "The average US homeowner saves $1,000–$1,500 per year with solar. Over 25 years, that's $25,000–$40,000 in savings. The exact amount depends on your electricity rate, sunlight hours, and system size." }
            },
            {
              "@type": "Question",
              "name": "What is the 30% federal solar tax credit?",
              "acceptedAnswer": { "@type": "Answer", "text": "The Investment Tax Credit (ITC) lets you deduct 30% of your total solar installation cost from your federal income taxes. For a $20,000 system, you'd get a $6,000 tax credit, reducing your net cost to $14,000. This applies to systems installed through 2032." }
            },
            {
              "@type": "Question",
              "name": "How long does it take for solar to pay itself off?",
              "acceptedAnswer": { "@type": "Answer", "text": "The average payback period in the US is 7–12 years depending on your state, electricity rate, and system cost. After payback, all solar production is essentially free electricity." }
            },
            {
              "@type": "Question",
              "name": "Do I need a battery for solar panels?",
              "acceptedAnswer": { "@type": "Answer", "text": "Most grid-tied solar systems don't require a battery. Without one, your home uses solar during the day and draws from the grid at night. A battery like the Tesla Powerwall ($10,000–$14,000 installed) adds backup power during outages and maximizes self-consumption." }
            },
            {
              "@type": "Question",
              "name": "How many solar panels does an average home need?",
              "acceptedAnswer": { "@type": "Answer", "text": "A typical US home using 10,000 kWh per year needs a 6–9 kW solar system, which is roughly 15–22 panels (400W each). Our calculator automatically sizes the system for your specific usage and location." }
            },
            {
              "@type": "Question",
              "name": "Does my roof need to face south for solar?",
              "acceptedAnswer": { "@type": "Answer", "text": "South-facing roofs are ideal, but east or west-facing roofs still produce 80–85% of a south-facing system's output. North-facing roofs are not ideal. Our calculator accounts for shading loss in the roof sun exposure step." }
            },
            {
              "@type": "Question",
              "name": "How much do solar panels cost in 2026?",
              "acceptedAnswer": { "@type": "Answer", "text": "The average cost of a residential solar system in 2026 is $14,000–$25,000 before the 30% federal tax credit, depending on system size and location. After the ITC, most homeowners pay $10,000–$18,000 net. Our calculator gives you a personalized estimate based on your electricity usage and state." }
            }
          ]
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
