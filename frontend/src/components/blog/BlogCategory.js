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
        <a href="/blog" style={{ color: '#1e40af', fontWeight: 700 }}>← Back to Blog</a>
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
      <header className="category-hero" style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, #fff 100%)` }}>
        <div className="category-hero__icon" aria-hidden style={{ background: colors.iconBg, borderRadius: 20, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${colors.border}` }}>
          <CategoryIcon slug={categorySlug} size={40} color={colors.iconColor} />
        </div>
        <h1>{category.label}</h1>
        <p>{category.description}</p>
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
                    <span className="blog-card__read-more">Read more →</span>
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
        <div className="post-cta-block" style={{ marginTop: 48 }}>
          <img src="/favicon-192x192.png" alt="" aria-hidden className="post-cta-block__icon" style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 12 }} />
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
