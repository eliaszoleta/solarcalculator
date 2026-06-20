import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { POSTS, CATEGORIES, getFeaturedPost } from '../../data/blogPosts';
import { CategoryIcon } from '../ui/Icons';

const SITE_URL = 'https://www.mysolarwidget.com';
const PRIMARY = '#1e40af';

function PostCard({ post, featured = false }) {
  const catLabel = (CATEGORIES.find(c => c.slug === post.category) || {}).label || post.category;
  const readTime = post.readingTime ? `${post.readingTime} min read` : (post.readTime || '');
  const excerpt = post.excerpt || post.metaDescription || '';

  return (
    <a href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          background: 'white',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          padding: featured ? '28px 32px' : '22px 26px',
          transition: 'box-shadow 0.2s, transform 0.2s',
          cursor: 'pointer',
          height: '100%',
          boxSizing: 'border-box',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 9px 3px 7px' }}>
            <CategoryIcon slug={post.category} size={11} color={PRIMARY} />
            <span style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{catLabel}</span>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{readTime}</span>
        </div>
        <h2 style={{ fontSize: featured ? 22 : 17, fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: 10 }}>{post.title}</h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: '0 0 14px' }}>{excerpt}</p>
        <span style={{ fontSize: 13, color: PRIMARY, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Read article
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </a>
  );
}

export default function BlogIndex() {
  const featured = getFeaturedPost();
  const rest = POSTS.filter(p => !p.featured);
  const [search, setSearch] = useState('');

  const searchTerm = search.trim().toLowerCase();
  const searchResults = searchTerm
    ? POSTS.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        (p.excerpt || '').toLowerCase().includes(searchTerm) ||
        (p.metaDescription || '').toLowerCase().includes(searchTerm) ||
        (CATEGORIES.find(c => c.slug === p.category) || {}).label?.toLowerCase().includes(searchTerm)
      )
    : null;

  return (
    <>
      <Helmet>
        <title>Solar Blog 2026 — Cost Guides, Savings &amp; Incentives | MySolarWidget</title>
        <meta name="description" content="Expert solar guides: cost estimates, savings calculations, financing options, tax credits, and installation advice. Free resources for homeowners." />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:title" content="Solar Blog 2026 — Cost Guides, Savings &amp; Incentives | MySolarWidget" />
        <meta property="og:description" content="Expert solar guides: cost estimates, savings calculations, financing options, tax credits, and installation advice." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          'name': 'MySolarWidget Solar Blog',
          'description': 'Expert guides on solar costs, savings, financing, incentives, and installation.',
          'url': `${SITE_URL}/blog`,
          'publisher': { '@type': 'Organization', 'name': 'MySolarWidget', 'url': SITE_URL },
        })}</script>
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Page header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Solar Resource Center</h1>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>Cost guides, savings calculations, financing options, and installation advice for homeowners.</p>
          </div>

          {/* Search bar */}
          <div style={{ maxWidth: 560, margin: '0 auto 40px', position: 'relative' }}>
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              placeholder="Search solar guides..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 18px 13px 46px',
                fontSize: 15,
                borderRadius: 12,
                border: '2px solid #e2e8f0',
                outline: 'none',
                background: 'white',
                boxSizing: 'border-box',
                color: '#0f172a',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = PRIMARY; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, lineHeight: 1, padding: 2 }}
                aria-label="Clear search"
              >✕</button>
            )}
          </div>

          {/* Search results */}
          {searchResults !== null ? (
            <>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                {searchResults.length === 0
                  ? `No results for "${search}"`
                  : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${search}"`
                }
              </div>
              {searchResults.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {searchResults.map(post => <PostCard key={post.slug} post={post} />)}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Featured</div>
                  <PostCard post={featured} featured />
                </div>
              )}

              {/* Browse by Category */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Browse by Category</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {CATEGORIES.map(cat => (
                    <a
                      key={cat.slug}
                      href={`/blog/category/${cat.slug}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 24, background: 'white', border: '1.5px solid #e2e8f0', textDecoration: 'none', fontSize: 13.5, fontWeight: 600, color: '#374151', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = PRIMARY; e.currentTarget.style.color = PRIMARY; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
                    >
                      <CategoryIcon slug={cat.slug} size={14} /> {cat.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* All Articles grid */}
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>All Articles</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {rest.map(post => <PostCard key={post.slug} post={post} />)}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
