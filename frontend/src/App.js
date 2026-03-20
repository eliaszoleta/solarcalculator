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
import BlogIndex from './components/blog/BlogIndex';
import BlogPost from './components/blog/BlogPost';
import BlogCategory from './components/blog/BlogCategory';
import InstallerLanding from './components/pages/InstallerLanding';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || '';
const pathname = window.location.pathname.replace(/\/$/, '') || '/';
const isInstaller = pathname.startsWith('/installer');
const isForInstallers = pathname === '/for-installers';
const isEmbed = pathname.startsWith('/embed');
const isBlog = pathname === '/blog' || pathname.startsWith('/blog/');
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

  if (installerConfig.paused) {
    return (
      <div style={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Calculator Temporarily Unavailable</h3>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
            This solar calculator is currently paused. Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
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

  if (isForInstallers) return <InstallerLanding />;

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
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How accurate is this solar calculator?",
              "acceptedAnswer": { "@type": "Answer", "text": "Our estimates are within 10–20% of real installer quotes for most homes. When you enter a ZIP code, we use real irradiance data from the NREL PVWatts API for your exact location, which improves accuracy to roughly 10–15%. Without a ZIP we use NREL state averages (15–20% range). We also use EIA electricity rates by state and current market installation costs ($2.50–$3.50/watt). For an exact price, you'll still need a site visit from a certified installer." }
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
