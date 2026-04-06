import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CATEGORIES, getPostsByCategory, getCategoryBySlug } from '../../data/blogPosts';
import { CategoryIcon, StarIcon, ClockIcon, SearchIcon, BoltIcon, getCategoryColors } from '../ui/Icons';
import './Blog.css';

const SITE_URL = 'https://www.mysolarwidget.com';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogCategory({ category: categorySlug }) {
  const category = getCategoryBySlug(categorySlug);
  const posts = getPostsByCategory(categorySlug);
  const otherCategories = CATEGORIES.filter(c => c.slug !== categorySlug);

  if (!category) {
    return (
      <div className="blog-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
        <div><SearchIcon size={48} /></div>
        <h1 style={{ fontSize: 24, color: '#0f172a', margin: 0 }}>Category not found</h1>
        <a href="/blog" style={{ color: '#2563eb', fontWeight: 700 }}>← Back to Blog</a>
      </div>
    );
  }

  const canonicalUrl = `${SITE_URL}/blog/category/${categorySlug}`;
  const seoTitle = `${category.label} Articles — Solar Blog | MySolarWidget`;
  const seoDescription = `${category.description} Browse all ${posts.length} ${category.label.toLowerCase()} articles and use our free solar calculator to estimate your savings.`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE_URL}/blog` },
      { '@type': 'ListItem', 'position': 3, 'name': category.label, 'item': canonicalUrl },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${category.label} — MySolarWidget Blog`,
    'description': seoDescription,
    'url': canonicalUrl,
    'publisher': { '@type': 'Organization', 'name': 'MySolarWidget', 'url': SITE_URL },
  };

  const colors = getCategoryColors(categorySlug);

  return (
    <div className="blog-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="blog-container" style={{ paddingTop: 0 }}>
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="blog-breadcrumb__sep" aria-hidden>›</span>
          <a href="/blog">Blog</a>
          <span className="blog-breadcrumb__sep" aria-hidden>›</span>
          <span aria-current="page">{category.label}</span>
        </nav>
      </div>

      {/* Category hero */}
      <header style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)',
        padding: '44px 24px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', filter: 'blur(50px)' }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: colors.iconBg, border: `2px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CategoryIcon slug={categorySlug} size={28} color={colors.iconColor} />
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(147,197,253,0.12)', border: '1px solid rgba(147,197,253,0.25)', borderRadius: 999, padding: '3px 10px', marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Category</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 900, letterSpacing: '-0.025em', margin: '0 0 8px', color: 'white', lineHeight: 1.2 }}>{category.label}</h1>
          <p style={{ fontSize: 14, color: '#93c5fd', lineHeight: 1.6 }}>{category.description}</p>
        </div>
      </header>

      {/* Posts */}
      <div className="category-content">
        <h2>{posts.length} Article{posts.length !== 1 ? 's' : ''} in {category.label}</h2>

        {posts.length > 0 ? (
          <div className="blog-grid" role="list">
            {posts.map(post => (
              <article key={post.slug} className="blog-card" role="listitem">
                <a href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'contents' }}>
                  <div className="blog-card__img" aria-hidden style={{ background: colors.iconBg }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, background: colors.bg, border: `1.5px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon slug={categorySlug} size={30} color={colors.iconColor} />
                    </div>
                  </div>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
                      {post.featured && (
                        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}><StarIcon size={11} style={{ verticalAlign: 'middle', marginRight: 2 }} />Featured</span>
                      )}
                    </div>
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__excerpt">{post.excerpt.slice(0, 130)}…</p>
                  </div>
                  <div className="blog-card__footer">
                    <span style={{ fontSize: 12, color: '#94a3b8' }}><ClockIcon size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />{post.readingTime} min read</span>
                    <span className="blog-card__read-more">Read more</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-no-results">
            <div><CategoryIcon slug={categorySlug} size={48} /></div>
            <h3>No articles yet</h3>
            <p>Check back soon — we're adding new guides regularly.</p>
          </div>
        )}

        {/* CTA */}
        <div className="post-cta-block" style={{ marginTop: 32 }}>
          <img src="/logo-icon-navy.svg" alt="" aria-hidden className="post-cta-block__icon" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 10 }} />
          <h3>Estimate Your Solar Savings</h3>
          <p>
            Use our free Solar Calculator to see your personalized cost, monthly savings,
            and 25-year return based on your real electricity bill and location.
          </p>
          <a href="/" className="post-cta-block__btn"><BoltIcon size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Get My Free Estimate</a>
        </div>

        {/* Other categories */}
        <section className="category-other-cats" aria-label="Other categories">
          <h2>Explore Other Topics</h2>
          <div className="blog-categories-grid">
            {otherCategories.map(c => {
              const oc = getCategoryColors(c.slug);
              return (
              <a key={c.slug} href={`/blog/category/${c.slug}`} className="blog-category-card" style={{ background: oc.bg, borderColor: oc.border }}>
                <div className="blog-category-card__icon-box" aria-hidden style={{ background: oc.iconBg }}>
                  <CategoryIcon slug={c.slug} size={24} color={oc.iconColor} />
                </div>
                <div>
                  <div className="blog-category-card__name">{c.label}</div>
                  <p className="blog-category-card__desc">{c.description}</p>
                </div>
              </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
