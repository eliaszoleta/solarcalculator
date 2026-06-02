import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CATEGORIES, getPostsByCategory, getCategoryBySlug } from '../../data/blogPosts';
import { CategoryIcon } from '../ui/Icons';

const SITE_URL = 'https://www.mysolarwidget.com';
const PRIMARY = '#1e40af';

export default function BlogCategory({ category: categorySlug }) {
  const category = getCategoryBySlug(categorySlug);
  const posts = getPostsByCategory(categorySlug);

  if (!category) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
        <h1 style={{ fontSize: 24, color: '#0f172a' }}>Category not found</h1>
        <a href="/blog" style={{ color: PRIMARY, fontWeight: 700 }}>← Back to Blog</a>
      </div>
    );
  }

  const seoTitle = `${category.label} Guide 2026 | MySolarWidget`;
  const seoDesc = category.description || `Expert guides on ${category.label.toLowerCase()} for homeowners.`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`${SITE_URL}/blog/category/${categorySlug}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog/category/${categorySlug}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
            { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE_URL}/blog` },
            { '@type': 'ListItem', 'position': 3, 'name': category.label, 'item': `${SITE_URL}/blog/category/${categorySlug}` },
          ],
        })}</script>
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Back link */}
          <a href="/blog" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 28 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All Articles
          </a>

          {/* Category header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#eff6ff', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <CategoryIcon slug={categorySlug} size={26} color={PRIMARY} />
            </div>
            <h1 style={{ fontSize: 'clamp(24px,4vw,34px)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{category.label}</h1>
            <p style={{ fontSize: 16, color: '#64748b' }}>{seoDesc}</p>
          </div>

          {/* Other categories */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Other Categories</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.filter(c => c.slug !== categorySlug).map(cat => (
                <a
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, background: 'white', border: '1.5px solid #e2e8f0', textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#374151', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = PRIMARY; e.currentTarget.style.color = PRIMARY; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
                >
                  <CategoryIcon slug={cat.slug} size={13} /> {cat.label}
                </a>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>All Articles</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(post => {
              const readTime = post.readingTime ? `${post.readingTime} min read` : (post.readTime || '');
              const excerpt = post.excerpt || post.metaDescription || '';
              return (
                <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, transition: 'box-shadow 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{post.title}</h2>
                      <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{excerpt}</p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{readTime}</div>
                      <span style={{ fontSize: 13, color: PRIMARY, fontWeight: 600 }}>Read →</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #1e40af)', borderRadius: 14, padding: '32px 36px', marginTop: 48, color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Estimate Your Solar Savings</h3>
            <p style={{ color: '#bfdbfe', marginBottom: 20, fontSize: 15 }}>Free calculator — enter your electric bill and ZIP code for a personalized estimate powered by real NREL data.</p>
            <a href="/" style={{ background: 'white', color: PRIMARY, padding: '13px 28px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>Get My Free Estimate →</a>
          </div>

        </div>
      </div>
    </>
  );
}
