import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPostBySlug, getRelatedPosts, getCategoryBySlug } from '../../data/blogPosts';
import { CategoryIcon, SearchIcon, PencilIcon, CalendarIcon, ClockIcon, BoltIcon } from '../ui/Icons';
import './Blog.css';

const SITE_URL = 'https://www.mysolarwidget.com';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateISO(iso) {
  return new Date(iso).toISOString();
}

/* Render a single section's HTML content safely — we own all content */
function SectionContent({ html }) {
  return (
    <div
      className="post-section-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function FAQAccordion({ faq }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="post-faq" aria-label="Frequently asked questions">
      <h2>Frequently Asked Questions</h2>
      {faq.map((item, i) => (
        <div key={i} className="faq-item">
          <button
            className="faq-question"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{item.question}</span>
            <span className={`faq-question__arrow${open === i ? ' faq-question__arrow--open' : ''}`} aria-hidden>
              ▾
            </span>
          </button>
          {open === i && (
            <p className="faq-answer">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function TableOfContents({ sections, activeId }) {
  return (
    <nav className="post-toc" aria-label="Table of contents">
      <div className="post-toc__header">Table of Contents</div>
      <ol className="post-toc__list">
        {sections.map(s => (
          <li key={s.id} className="post-toc__item">
            <a
              href={`#${s.id}`}
              className={`post-toc__link${activeId === s.id ? ' post-toc__link--active' : ''}`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SidebarCTA() {
  return (
    <div className="sidebar-cta">
      <img src="/logo-icon-navy.svg" alt="MySolarWidget" className="sidebar-cta__icon" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 10 }} />
      <h4>Free Solar Calculator</h4>
      <p>See how much solar saves you based on your real electricity bill and location.</p>
      <a href="/" className="sidebar-cta__btn">Get My Estimate</a>
    </div>
  );
}

function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="post-share">
      <h5>Share</h5>
      <div className="post-share__btns">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn share-btn--twitter"
          aria-label="Share on Twitter"
        >
          𝕏 Tweet
        </a>
        <button
          className="share-btn share-btn--copy"
          onClick={handleCopy}
          aria-label="Copy link"
        >
          {copied ? '✓ Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}

export default function BlogPost({ slug }) {
  const post = getPostBySlug(slug);
  const [activeSection, setActiveSection] = useState('');
  const observerRef = useRef(null);

  // Intersection observer for TOC active state
  useEffect(() => {
    if (!post) return;
    const ids = post.sections.map(s => s.id);
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);

    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    els.forEach(el => observerRef.current.observe(el));
    return () => observerRef.current && observerRef.current.disconnect();
  }, [post]);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!post) {
    return (
      <div className="blog-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
        <div><SearchIcon size={48} /></div>
        <h1 style={{ fontSize: 24, color: '#0f172a', margin: 0 }}>Article not found</h1>
        <p style={{ color: '#64748b' }}>The article you're looking for doesn't exist.</p>
        <a href="/blog" style={{ color: '#2563eb', fontWeight: 700 }}>← Back to Blog</a>
      </div>
    );
  }

  const category = getCategoryBySlug(post.category);
  const related = getRelatedPosts(post);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  // Schema.org Article structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.metaDescription,
    'author': {
      '@type': 'Organization',
      'name': post.author,
      'url': SITE_URL,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'MySolarWidget',
      'url': SITE_URL,
      'logo': { '@type': 'ImageObject', 'url': `${SITE_URL}/logo.png` },
    },
    'datePublished': formatDateISO(post.publishDate),
    'dateModified': formatDateISO(post.publishDate),
    'mainEntityOfPage': { '@type': 'WebPage', '@id': canonicalUrl },
    'url': canonicalUrl,
    'articleSection': category?.label || post.category,
    'keywords': post.tags.join(', '),
    'timeRequired': `PT${post.readingTime}M`,
  };

  // Schema.org FAQPage structured data
  const faqSchema = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': post.faq.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': { '@type': 'Answer', 'text': item.answer },
    })),
  } : null;

  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE_URL}/blog` },
      { '@type': 'ListItem', 'position': 3, 'name': category?.label || 'Category', 'item': `${SITE_URL}/blog/category/${post.category}` },
      { '@type': 'ListItem', 'position': 4, 'name': post.title, 'item': canonicalUrl },
    ],
  };

  return (
    <div className="blog-page">
      <Helmet>
        <title>{post.seoTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* OpenGraph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MySolarWidget" />
        <meta property="article:published_time" content={formatDateISO(post.publishDate)} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={category?.label || post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seoTitle} />
        <meta name="twitter:description" content={post.metaDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="blog-container">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="blog-breadcrumb__sep" aria-hidden>›</span>
          <a href="/blog">Blog</a>
          <span className="blog-breadcrumb__sep" aria-hidden>›</span>
          <a href={`/blog/category/${post.category}`}>
            {category?.label || post.category}
          </a>
          <span className="blog-breadcrumb__sep" aria-hidden>›</span>
          <span aria-current="page">{post.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <header className="post-hero">
        <div className="post-hero__inner">
          <a href={`/blog/category/${post.category}`} className="blog-badge">
            <CategoryIcon slug={post.category} size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {category?.label || post.category}
          </a>
          <h1 className="post-hero__title">{post.title}</h1>
          <div className="post-hero__meta">
            <span><PencilIcon size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />{post.author}</span>
            <span><CalendarIcon size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} /><time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time></span>
            <span><ClockIcon size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />{post.readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="post-layout">

        {/* ── Main content ── */}
        <main>
          {/* Intro */}
          {post.intro && (
            <div
              className="post-intro"
              dangerouslySetInnerHTML={{ __html: post.intro }}
            />
          )}

          {/* Inline CTA after intro */}
          <div className="post-cta-inline">
            <img src="/logo-icon-navy.svg" alt="" aria-hidden className="post-cta-inline__icon" style={{ width: 48, height: 48, borderRadius: 10 }} />
            <div className="post-cta-inline__text">
              <h4>Free Solar Savings Calculator</h4>
              <p>See your personalized cost, savings, and payback period based on your home and location.</p>
            </div>
            <a href="/" className="post-cta-inline__btn">Calculate My Savings</a>
          </div>

          {/* Sections */}
          {post.sections.map((section, idx) => (
            <section
              key={section.id}
              id={section.id}
              className="post-section"
              aria-label={section.title}
            >
              <h2>{section.title}</h2>
              <SectionContent html={section.content} />

              {/* Inline CTA after middle section */}
              {idx === Math.floor(post.sections.length / 2) - 1 && (
                <div className="post-cta-inline" style={{ marginTop: 24 }}>
                  <img src="/logo-icon-navy.svg" alt="" aria-hidden className="post-cta-inline__icon" style={{ width: 48, height: 48, borderRadius: 10 }} />
                  <div className="post-cta-inline__text">
                    <h4>Estimate Your Solar Savings</h4>
                    <p>Enter your monthly bill and ZIP code for a personalized estimate powered by real NREL solar data.</p>
                  </div>
                  <a href="/" className="post-cta-inline__btn">Try the Calculator</a>
                </div>
              )}
            </section>
          ))}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <FAQAccordion faq={post.faq} />
          )}

          {/* Big CTA block */}
          <div className="post-cta-block">
            <img src="/logo-icon-navy.svg" alt="" aria-hidden className="post-cta-block__icon" style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 12 }} />
            <h3>Ready to See Your Solar Savings?</h3>
            <p>
              Use our free Solar Calculator to estimate your installation cost, monthly savings,
              and 25-year return — personalized to your home in under 2 minutes.
            </p>
            <a href="/" className="post-cta-block__btn">
              <BoltIcon size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Get My Free Estimate
            </a>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <nav className="post-related" aria-label="Related articles">
              <h2>Related Articles</h2>
              <div className="post-related__grid">
                {related.map(rp => {
                  const rc = getCategoryBySlug(rp.category);
                  return (
                    <a key={rp.slug} href={`/blog/${rp.slug}`} className="post-related__card">
                      <span className="post-related__cat"><CategoryIcon slug={rp.category} size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{rc?.label}</span>
                      <span className="post-related__title">{rp.title}</span>
                      <span className="post-related__time"><ClockIcon size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />{rp.readingTime} min read</span>
                    </a>
                  );
                })}
              </div>
            </nav>
          )}
        </main>

        {/* ── Sidebar ── */}
        <aside className="post-sidebar" aria-label="Article sidebar">
          <TableOfContents sections={post.sections} activeId={activeSection} />
          <SidebarCTA />
          <ShareButtons title={post.title} />
        </aside>
      </div>
    </div>
  );
}
