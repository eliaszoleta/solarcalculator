import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SparklesIcon } from '../ui/Icons';
import { getAllStates } from '../../data/statePricing';
import { POSTS } from '../../data/blogPosts';

const PRIMARY = '#1b4d3e';

export default function StartSolarBusinessIndex() {
  const states = getAllStates();
  const posts = POSTS.filter(p => p.category === 'solar-business');

  const title = 'How to Start a Solar Installation Business (2026): Costs, Licensing & State-by-State Guide | Solar Cost Predictor';
  const description = 'Everything you need to start a solar installation business: licensing, insurance, equipment, pricing, and getting your first customers -- plus the LLC filing fee for all 50 states.';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.solarcostpredictor.com' },
      { '@type': 'ListItem', position: 2, name: 'Start a Solar Business', item: 'https://www.solarcostpredictor.com/start-a-solar-business' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://www.solarcostpredictor.com/start-a-solar-business" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 24px 64px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>

          <div style={{ display: 'flex', gap: 6, fontSize: 13, color: '#94a3b8', marginBottom: 24, flexWrap: 'wrap' }}>
            <a href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <span style={{ color: '#0f172a' }}>Start a Solar Business</span>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <SparklesIcon size={18} color={PRIMARY} />
              <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting Your Business</span>
            </div>
            <h1 style={{ fontSize: 'clamp(26px,4.5vw,36px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 14 }}>How to Start a Solar Installation Business</h1>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7 }}>
              Everything you need to go from idea to your first install: business structure, licensing, insurance, equipment, pricing, permitting, and getting your first customers — plus the LLC filing fee for every state.
            </p>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${PRIMARY}, #16324f)`, borderRadius: 12, padding: '18px 24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Ready to get online?</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Free 7-day trial · Be live on your site today</div>
            </div>
            <a href="/for-installers" style={{ background: 'white', color: PRIMARY, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
              Get My Free Trial →
            </a>
          </div>

          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>The Complete Solar Business Startup Guide</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {posts.map(post => (
                <a key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, textDecoration: 'none' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{post.readingTime} min read</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: 8 }}>{post.title}</div>
                  <span style={{ fontSize: 13, color: PRIMARY, fontWeight: 700 }}>Read guide →</span>
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Find Your State's LLC Filing Fee</h2>
            <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 18 }}>LLC filing fees, filing agencies, and state-specific notes for every state.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {states.map(s => (
                <a key={s.code} href={`/start-a-solar-business/${s.slug}`} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: '#eaf3ee', border: '1px solid #bfe3cf', borderRadius: 12, padding: '24px 28px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 6 }}>Not ready to build your own marketing yet?</div>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Solar Cost Predictor's Partner Program gives one installer per city exclusive, guaranteed lead visibility — no website required to start.</p>
            <a href="/partner-with-us" style={{ background: PRIMARY, color: 'white', padding: '12px 28px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
              See If Your City Is Available →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
