import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SolarCalculator from './components/calculator/SolarCalculator';
import InstallerDashboard from './components/dashboard/InstallerDashboard';
import AuthPage from './components/dashboard/AuthPage';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import SEOContent from './components/ui/SEOContent';
import './App.css';

const isInstaller = window.location.pathname.startsWith('/installer');

export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('sc_token');
    const company = localStorage.getItem('sc_company');
    return token ? { token, companyName: company } : null;
  });

  const handleAuth = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_installer_id');
    localStorage.removeItem('sc_company');
    setUser(null);
  };

  if (isInstaller) {
    if (!user) return <AuthPage onAuth={handleAuth} />;
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
