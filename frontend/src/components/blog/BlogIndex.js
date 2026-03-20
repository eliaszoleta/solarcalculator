import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { POSTS, CATEGORIES, getFeaturedPost } from '../../data/blogPosts';
import { CategoryIcon, StarIcon, CalendarIcon, ClockIcon, PencilIcon, SearchIcon, getCategoryColors } from '../ui/Icons';
import './Blog.css';

const SITE_URL = 'https://www.mysolarwidget.com';
const POSTS_PER_PAGE = 6;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogIndex() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const featured = getFeaturedPost();

  const filtered = useMemo(() => {
    let posts = POSTS.filter(p => !p.featured || activeCategory !== 'all' || search);
    if (activeCategory !== 'all') posts = POSTS.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = POSTS.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return posts;
  }, [search, activeCategory]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleCategory = (slug) => {
    setActiveCategory(slug);
    setPage(1);
    setSearch('');
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setActiveCategory('all');
  };

  const showFeatured = activeCategory === 'all' && !search.trim();

  return (
    <div className="blog-page">
      <Helmet>
        <title>Solar Blog — Costs, Savings, Incentives & More | MySolarWidget</title>
        <meta name="description" content="Expert solar guides covering costs, savings, financing, tax credits, and installation. Use our free calculator to get your personalized solar estimate." />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:title" content="Solar Blog — MySolarWidget" />
        <meta property="og:description" content="Expert solar guides covering costs, savings, financing, tax credits, and installation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solar Blog — MySolarWidget" />
        <meta name="twitter:description" content="Expert solar guides covering costs, savings, financing, tax credits, and installation." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          'name': 'MySolarWidget Solar Blog',
          'description': 'Expert guides on solar costs, savings, financing, incentives, and installation.',
          'url': `${SITE_URL}/blog`,
          'publisher': {
            '@type': 'Organization',
            'name': 'MySolarWidget',
            'url': SITE_URL,
          },
        })}</script>
      </Helmet>

      {/* Hero */}
      <div className="blog-hero">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1>Solar Energy Blog</h1>
          <p>Expert guides on solar costs, savings, incentives, and installation — everything you need to make a smart solar decision.</p>
          <div className="blog-search-wrap">
            <input
              className="blog-search"
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={handleSearch}
              aria-label="Search blog articles"
            />
            <span className="blog-search-icon" aria-hidden><SearchIcon size={16} /></span>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <nav className="blog-categories-bar" aria-label="Article categories">
        <button
          className={`blog-cat-pill${activeCategory === 'all' ? ' blog-cat-pill--active' : ''}`}
          onClick={() => handleCategory('all')}
        >
          All Topics
        </button>
        {CATEGORIES.map(c => (
          <a
            key={c.slug}
            href={`/blog/category/${c.slug}`}
            className={`blog-cat-pill${activeCategory === c.slug ? ' blog-cat-pill--active' : ''}`}
            onClick={e => { e.preventDefault(); handleCategory(c.slug); }}
          >
            <CategoryIcon slug={c.slug} size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {c.label}
          </a>
        ))}
      </nav>

      <div className="blog-container">
        {/* Featured post */}
        {showFeatured && featured && (
          <section className="blog-featured" aria-label="Featured article">
            <div className="blog-featured__label"><StarIcon size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Featured Article</div>
            <a href={`/blog/${featured.slug}`} className="blog-featured__card">
              {(() => { const fc = getCategoryColors(featured.category); return (
              <div className="blog-featured__img" style={{ background: fc.iconBg }}>
                <div style={{ width: 88, height: 88, borderRadius: 20, background: fc.bg, border: `2px solid ${fc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CategoryIcon slug={featured.category} size={48} color={fc.iconColor} />
                </div>
              </div>
              ); })()}
              <div className="blog-featured__body">
                <span className="blog-badge"><CategoryIcon slug={featured.category} size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {featured.categoryLabel || featured.category.replace(/-/g, ' ')}</span>
                <h2 className="blog-featured__title">{featured.title}</h2>
                <p className="blog-featured__excerpt">{featured.excerpt}</p>
                <div className="blog-featured__meta">
                  <span><CalendarIcon size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />{formatDate(featured.publishDate)}</span>
                  <span><ClockIcon size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />{featured.readingTime} min read</span>
                  <span><PencilIcon size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />{featured.author}</span>
                </div>
                <div className="blog-featured__cta">Read article →</div>
              </div>
            </a>
          </section>
        )}

        {/* Grid header */}
        <div className="blog-grid-header">
          <h2>
            {search ? `Search: "${search}"` : activeCategory === 'all' ? 'Latest Articles' : CATEGORIES.find(c => c.slug === activeCategory)?.label}
          </h2>
          <span className="blog-count">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Grid */}
        {paginated.length > 0 ? (
          <div className="blog-grid" role="list">
            {paginated.map(post => {
              const cc = getCategoryColors(post.category);
              return (
              <article key={post.slug} className="blog-card" role="listitem">
                <a href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'contents' }}>
                  <div className="blog-card__img" aria-hidden style={{ background: cc.iconBg }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, background: cc.bg, border: `1.5px solid ${cc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon slug={post.category} size={30} color={cc.iconColor} />
                    </div>
                  </div>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span className="blog-badge" style={{ fontSize: 11 }}>
                        <CategoryIcon slug={post.category} size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} /> {post.category.replace(/-/g, ' ')}
                      </span>
                      <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
                    </div>
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__excerpt">{post.excerpt.slice(0, 120)}…</p>
                  </div>
                  <div className="blog-card__footer">
                    <span style={{ fontSize: 12, color: '#94a3b8' }}><ClockIcon size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />{post.readingTime} min read</span>
                    <span className="blog-card__read-more">Read more →</span>
                  </div>
                </a>
              </article>
              );
            })}
          </div>
        ) : (
          <div className="blog-no-results">
            <div><SearchIcon size={48} /></div>
            <h3>No articles found</h3>
            <p>Try a different search term or browse by category.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="blog-pagination" aria-label="Pagination">
            <button
              className="blog-page-btn"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`blog-page-btn${n === page ? ' blog-page-btn--active' : ''}`}
                onClick={() => setPage(n)}
                aria-current={n === page ? 'page' : undefined}
              >{n}</button>
            ))}
            <button
              className="blog-page-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >›</button>
          </nav>
        )}
      </div>

      {/* Categories section */}
      <section className="blog-categories-section" aria-label="Browse by category">
        <h2>Browse by Category</h2>
        <div className="blog-categories-grid">
          {CATEGORIES.map(c => {
            const colors = getCategoryColors(c.slug);
            return (
            <a key={c.slug} href={`/blog/category/${c.slug}`} className="blog-category-card" style={{ background: colors.bg, borderColor: colors.border }}>
              <div className="blog-category-card__icon-box" aria-hidden style={{ background: colors.iconBg }}>
                <CategoryIcon slug={c.slug} size={24} color={colors.iconColor} />
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
  );
}
