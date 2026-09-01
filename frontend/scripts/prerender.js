'use strict';

const fs   = require('fs');
const path = require('path');

const BUILD  = path.join(__dirname, '../build');
const SRC    = path.join(__dirname, '../src');
const DOMAIN = 'https://www.solarcostpredictor.com';
const PRIMARY = '#1b4d3e';

// Mirrors the favicon/manifest/font links in public/index.html. That file only backs the
// homepage — every other prerendered page builds its own <head> from scratch here, so
// without this the browser tab (and Google's favicon in search results) shows blank, and
// the Poppins font never loads, on every page except "/".
const FAVICON_LINKS = `<link rel="icon" href="/favicon.ico">
  <link rel="icon" type="image/svg+xml" href="/logo-icon-navy.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

function loadBlogData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/blogPosts.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export default /gm, 'const _default = ')
    .replace(/^export \{[^}]*\};\s*$/gm, '');
  const fn = new Function(`${src}\nreturn { CATEGORIES, POSTS };`);
  return fn();
}

function loadServicesData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/services.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export \{[^}]*\};\s*$/gm, '');
  const fn = new Function(`${src}\nreturn { getAllServices, getServiceBySlug, getRelatedServices, typicalCost };`);
  return fn();
}

function loadStatesData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/statePricing.js'), 'utf8');
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export \{[^}]*\};\s*$/gm, '');
  const fn = new Function(`${src}\nreturn { getAllStates, getStateBySlug, getFeaturedStates, estimateForState };`);
  return fn();
}

function loadFaqsData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/faqs.js'), 'utf8');
  const src = raw.replace(/^export function /gm, 'function ');
  const fn = new Function(`${src}\nreturn { getAllFaqs };`);
  return fn();
}

function getAssetTags() {
  const indexHtml = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
  const cssLinks  = (indexHtml.match(/<link[^>]+\.css[^>]*>/g)  || []).join('\n  ');
  const jsScripts = (indexHtml.match(/<script\b[^>]*\ssrc="[^"]*\.js[^"]*"[^>]*>\s*<\/script>/g) || []).join('\n  ');
  return { cssLinks, jsScripts };
}

function staticHeader() {
  return `<header id="static-header" style="position:sticky;top:0;z-index:100;height:60px;display:flex;align-items:center;padding:0 12px;background:#ffffff;border-bottom:1px solid #f1f5f9;box-sizing:border-box">
  <div style="max-width:1120px;width:100%;margin:0 auto;display:flex;align-items:center;justify-content:space-between">
    <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0">
      <img src="/logo-icon-navy.svg" alt="" style="height:42px;width:42px;border-radius:11px;flex-shrink:0" />
      <span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.01em;white-space:nowrap">Solar Cost <span style="color:#16a34a">Predictor</span></span>
    </a>
    <nav class="pr-desktop-nav" style="display:flex;align-items:center;gap:4px">
      <a href="/#how-it-works" style="font-size:14px;font-weight:500;color:#475569;padding:6px 12px;border-radius:8px;text-decoration:none">How It Works</a>
      <a href="/blog" style="font-size:14px;font-weight:500;color:#475569;padding:6px 12px;border-radius:8px;text-decoration:none">Blog</a>
      <a href="/#faq" style="font-size:14px;font-weight:500;color:#475569;padding:6px 12px;border-radius:8px;text-decoration:none">FAQ</a>
      <a href="/for-installers" style="margin-left:8px;font-size:13px;font-weight:600;color:${PRIMARY};padding:7px 16px;border-radius:9px;border:1.5px solid ${PRIMARY};text-decoration:none">Get Solar Estimator</a>
    </nav>
    <a href="/for-installers" class="pr-mobile-cta" style="display:none;font-size:11px;font-weight:600;color:${PRIMARY};padding:5px 10px;border-radius:8px;border:1.5px solid ${PRIMARY};text-decoration:none">Get Solar Estimator</a>
  </div>
  <style>
    @media(max-width:639px){.pr-desktop-nav{display:none!important}.pr-mobile-cta{display:inline-block!important}}
  </style>
</header>`;
}

// Static footer with real internal links, visible to Googlebot's raw HTML crawl without
// needing JS to render. Without this, every page besides the header nav is only
// discoverable via sitemap.xml or the client-side (post-hydration) footer.
function staticFooter(categories) {
  const catLinks = categories.map(cat =>
    `<a href="/blog/category/${cat.slug}" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">${esc(cat.label)}</a>`
  ).join('\n        ');

  return `<footer style="background:#0f172a;color:#94a3b8">
  <div style="max-width:1200px;margin:0 auto;padding:64px 24px 40px;font-family:'Poppins','Poppins Fallback',Arial,sans-serif">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:40px;margin-bottom:48px">
      <div>
        <div style="color:white;font-weight:700;font-size:14px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em">Blog Categories</div>
        ${catLinks}
        <a href="/blog" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">All Blog Posts</a>
      </div>
      <div>
        <div style="color:white;font-weight:700;font-size:14px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em">Resources</div>
        <a href="/how-we-calculate-solar-costs" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">How We Calculate Your Estimate</a>
        <a href="/about" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">About Solar Cost Predictor</a>
        <a href="/contact" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Contact</a>
      </div>
      <div>
        <div style="color:white;font-weight:700;font-size:14px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em">Cost Guides</div>
        <a href="/solar-panels/solar-system-size-cost" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Cost by System Size</a>
        <a href="/solar-panels/solar-cost-by-roof-type" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Cost by Roof Type</a>
        <a href="/solar-panels/tesla-powerwall-cost" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Tesla Powerwall Cost</a>
        <a href="/solar-cost/california" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Cost in California</a>
        <a href="/solar-cost/texas" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Cost in Texas</a>
      </div>
      <div>
        <div style="color:white;font-weight:700;font-size:14px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em">For Installers</div>
        <a href="/installer" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Dashboard</a>
        <a href="/for-installers" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Embed Calculator</a>
        <a href="/for-installers#pricing" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Pricing</a>
      </div>
      <div>
        <div style="color:white;font-weight:700;font-size:14px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em">Partner Program</div>
        <a href="/partner-with-us" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Become a Partner</a>
        <a href="/partner-with-us" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Exclusive City Placement</a>
        <a href="/partner-with-us#apply" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Apply Now</a>
      </div>
      <div>
        <div style="color:white;font-weight:700;font-size:14px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em">Legal</div>
        <a href="/privacy-policy" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Privacy Policy</a>
        <a href="/terms-of-service" style="display:block;color:#94a3b8;text-decoration:none;font-size:14px;margin-bottom:10px">Terms of Service</a>
      </div>
    </div>
    <div style="border-top:1px solid #1e293b;padding-top:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="display:flex;align-items:center;gap:8px">
        <img src="/logo-icon-navy.svg" alt="" style="height:24px;width:24px;border-radius:6px;flex-shrink:0" />
        <span style="color:white;font-weight:700">Solar Cost <span style="color:#4ade80">Predictor</span></span>
      </div>
      <div style="font-size:13px;color:#64748b">&copy; ${new Date().getFullYear()} Solar Cost Predictor. All rights reserved.</div>
    </div>
  </div>
</footer>`;
}

// Vanilla JS search injected into the prerendered page (works before React loads)
const vanillaSearch = `
<script>
(function(){
  function init(){
    var inp = document.getElementById('pr-search-input');
    var noRes = document.getElementById('pr-no-results');
    if(!inp) return;
    inp.addEventListener('input', function(){
      var term = this.value.trim().toLowerCase();
      var cards = document.querySelectorAll('.pr-post-card');
      var shown = 0;
      cards.forEach(function(c){
        var matches = !term || c.dataset.search.indexOf(term) !== -1;
        c.style.display = matches ? '' : 'none';
        if(matches) shown++;
      });
      if(noRes) noRes.style.display = (term && shown === 0) ? '' : 'none';
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
<\/script>`;

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function searchData(post, categories) {
  const cat = (categories.find(c => c.slug === post.category) || {}).label || '';
  return [post.title, post.excerpt || '', post.metaDescription || '', cat].join(' ').toLowerCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function articleSchema(post) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    author: { '@type': 'Organization', name: 'Solar Cost Predictor' },
    publisher: {
      '@type': 'Organization',
      name: 'Solar Cost Predictor',
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/android-chrome-512x512.png` },
    },
    datePublished: post.publishDate,
    url: `${DOMAIN}/blog/${post.slug}`,
    mainEntityOfPage: `${DOMAIN}/blog/${post.slug}`,
  });
}

function renderBlogPost(post, categories, assets) {
  const sectionsHtml = (post.sections || []).map(s =>
    `<section>\n<h2>${s.title}</h2>\n${s.content}\n</section>`
  ).join('\n');

  const faqHtml = post.faq && post.faq.length
    ? `<section class="faq">\n<h2>Frequently Asked Questions</h2>\n${
        post.faq.map(f => `<div class="faq-item"><h3>${esc(f.question)}</h3><p>${f.answer}</p></div>`).join('\n')
      }\n</section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FAVICON_LINKS}
  <title>${esc(post.seoTitle || post.title)}</title>
  <meta name="description" content="${esc(post.metaDescription || post.excerpt)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${DOMAIN}/blog/${post.slug}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(post.seoTitle || post.title)}">
  <meta property="og:description" content="${esc(post.metaDescription || post.excerpt)}">
  <meta property="og:url" content="${DOMAIN}/blog/${post.slug}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Solar Cost Predictor">
  <meta property="og:image" content="${DOMAIN}/android-chrome-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${articleSchema(post)}</script>
  ${assets.cssLinks}
</head>
<body>
<div id="root">${staticHeader()}<article style="max-width:800px;margin:40px auto;padding:0 24px;font-family:'Poppins','Poppins Fallback',Arial,sans-serif;line-height:1.7;color:#0f172a">
  <nav style="font-size:13px;color:#64748b;margin-bottom:24px">
    <a href="/" style="color:${PRIMARY};text-decoration:none">Home</a> &rsaquo;
    <a href="/blog" style="color:${PRIMARY};text-decoration:none">Blog</a> &rsaquo;
    <span>${esc(post.title)}</span>
  </nav>
  <h1 style="font-size:clamp(24px,4vw,40px);font-weight:900;line-height:1.2;margin-bottom:16px">${esc(post.title)}</h1>
  <p style="color:#64748b;font-size:13px;margin-bottom:32px">
    By Solar Cost Predictor Team &middot; ${formatDate(post.publishDate)} &middot; ${post.readingTime || 8} min read
  </p>
  <div>${post.intro || ''}</div>
  ${sectionsHtml}
  ${faqHtml}
</article>${staticFooter(categories)}</div>
  ${assets.jsScripts}
</body>
</html>`;
}

function renderBlogIndex(posts, categories, assets) {
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);
  const allPosts = posts;

  const catBadge = (post) => {
    const cat = categories.find(c => c.slug === post.category) || { label: post.category };
    return `<span style="display:inline-flex;align-items:center;gap:5px;background:#eaf3ee;border:1px solid #bfe3cf;border-radius:6px;padding:3px 9px;font-size:11px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.05em">${esc(cat.label)}</span>`;
  };

  const readTime = (post) => post.readingTime ? `${post.readingTime} min read` : (post.readTime || '');

  const postCard = (post, isFeatured = false) => {
    const sd = searchData(post, categories).replace(/"/g, '&quot;');
    return `
    <div class="pr-post-card" data-search="${sd}" style="min-width:0">
      <a href="/blog/${post.slug}" style="text-decoration:none;display:block;height:100%">
        <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:${isFeatured ? '28px 32px' : '22px 26px'};height:100%;box-sizing:border-box">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:12px">
            ${catBadge(post)}
            <span style="margin-left:auto;font-size:12px;color:#94a3b8">${readTime(post)}</span>
          </div>
          <h2 style="font-size:${isFeatured ? 22 : 17}px;font-weight:800;color:#0f172a;line-height:1.35;margin-bottom:10px">${esc(post.title)}</h2>
          <p style="font-size:14px;color:#64748b;line-height:1.65;margin:0 0 14px">${esc(post.excerpt || post.metaDescription || '')}</p>
          <span style="font-size:13px;color:${PRIMARY};font-weight:600">Read article &rarr;</span>
        </div>
      </a>
    </div>`;
  };

  const catPills = categories.map(cat => `
    <a href="/blog/category/${cat.slug}" style="display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:24px;background:white;border:1.5px solid #e2e8f0;text-decoration:none;font-size:13.5px;font-weight:600;color:#334155">${esc(cat.label)}</a>`
  ).join('');

  const allCards = allPosts.map(p => postCard(p)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FAVICON_LINKS}
  <title>Solar Blog 2026 &mdash; Cost Guides, Savings &amp; Incentives | Solar Cost Predictor</title>
  <meta name="description" content="Expert solar guides: cost estimates, savings calculations, financing options, tax credits, and installation advice. Free resources for homeowners.">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${DOMAIN}/blog">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="Solar Blog 2026 | Solar Cost Predictor">
  <meta property="og:description" content="Expert solar guides: cost estimates, savings calculations, financing options, tax credits, and installation advice.">
  <meta property="og:url" content="${DOMAIN}/blog">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Solar Cost Predictor">
  ${assets.cssLinks}
</head>
<body>
<div id="root">
${staticHeader()}
<div style="background:#f8fafc;min-height:100vh;padding:48px 24px 64px;font-family:'Poppins','Poppins Fallback',Arial,sans-serif">
  <div style="max-width:1100px;margin:0 auto">

    <div style="text-align:center;margin-bottom:32px">
      <h1 style="font-size:clamp(26px,4vw,38px);font-weight:800;color:#0f172a;margin-bottom:10px">Solar Resource Center</h1>
      <p style="font-size:16px;color:#64748b;max-width:520px;margin:0 auto">Cost guides, savings calculations, financing options, and installation advice for homeowners.</p>
    </div>

    <div style="max-width:560px;margin:0 auto 40px;position:relative">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);pointer-events:none">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input id="pr-search-input" type="search" placeholder="Search solar guides..."
        style="width:100%;padding:13px 18px 13px 46px;font-size:15px;border-radius:12px;border:2px solid #e2e8f0;outline:none;background:white;box-sizing:border-box;color:#0f172a" />
    </div>

    <p id="pr-no-results" style="display:none;color:#64748b;font-size:14px;text-align:center;padding:24px 0">No articles found. Try a different search term.</p>

    <div id="pr-featured" style="margin-bottom:40px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px">Featured</div>
      ${featured ? postCard(featured, true) : ''}
    </div>

    <div style="margin-bottom:40px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Browse by Category</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${catPills}</div>
    </div>

    <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">All Articles</div>
    <div id="pr-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px">
      ${allCards}
    </div>

  </div>
</div>
${staticFooter(categories)}</div>
${vanillaSearch}
  ${assets.jsScripts}
</body>
</html>`;
}

function renderCategoryPage(cat, posts, categories, assets) {
  const catPosts = posts.filter(p => p.category === cat.slug);

  const articleRows = catPosts.map(p => {
    const rt = p.readingTime ? `${p.readingTime} min read` : (p.readTime || '');
    const excerpt = esc(p.excerpt || p.metaDescription || '');
    return `
    <a href="/blog/${p.slug}" style="text-decoration:none">
      <div style="background:white;border-radius:12px;border:1px solid #e2e8f0;padding:22px 26px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:16px">
        <div style="flex:1">
          <h2 style="font-size:17px;font-weight:700;color:#0f172a;margin-bottom:6px">${esc(p.title)}</h2>
          <p style="font-size:13.5px;color:#64748b;line-height:1.6;margin:0">${excerpt}</p>
        </div>
        <div style="flex-shrink:0;text-align:right">
          <div style="font-size:12px;color:#94a3b8;margin-bottom:4px">${rt}</div>
          <span style="font-size:13px;color:${PRIMARY};font-weight:600">Read &rarr;</span>
        </div>
      </div>
    </a>`;
  }).join('');

  const seoTitle = `${cat.label} Guide 2026 | Solar Cost Predictor`;
  const seoDesc = cat.description || `Expert guides on ${cat.label.toLowerCase()} for homeowners.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FAVICON_LINKS}
  <title>${esc(seoTitle)}</title>
  <meta name="description" content="${esc(seoDesc)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${DOMAIN}/blog/category/${cat.slug}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(seoTitle)}">
  <meta property="og:description" content="${esc(seoDesc)}">
  <meta property="og:url" content="${DOMAIN}/blog/category/${cat.slug}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Solar Cost Predictor">
  ${assets.cssLinks}
</head>
<body>
<div id="root">
${staticHeader()}
<div style="background:#f8fafc;min-height:100vh;padding:48px 24px 64px;font-family:'Poppins','Poppins Fallback',Arial,sans-serif">
  <div style="max-width:900px;margin:0 auto">

    <a href="/blog" style="font-size:13px;color:#64748b;text-decoration:none;display:inline-flex;align-items:center;gap:5px;margin-bottom:28px">
      &larr; All Articles
    </a>

    <div style="margin-bottom:40px">
      <div style="width:52px;height:52px;border-radius:14px;background:#eaf3ee;border:1.5px solid #bfe3cf;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:24px">&#9728;</div>
      <h1 style="font-size:clamp(24px,4vw,34px);font-weight:800;color:#0f172a;margin-bottom:8px">${esc(cat.label)}</h1>
      <p style="font-size:16px;color:#64748b">${esc(seoDesc)}</p>
    </div>

    <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">All Articles</div>
    ${articleRows || '<p style="color:#64748b">No articles yet.</p>'}

    <div style="background:linear-gradient(135deg,#123529,#1b4d3e);border-radius:14px;padding:32px 36px;margin-top:48px;color:white;text-align:center">
      <h3 style="font-size:20px;font-weight:800;margin-bottom:10px">Estimate Your Solar Savings</h3>
      <p style="color:#bfe3cf;margin-bottom:20px;font-size:15px">Free calculator &mdash; enter your electric bill and ZIP code for a personalized estimate.</p>
      <a href="/" style="background:white;color:${PRIMARY};padding:13px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">Get My Free Estimate &rarr;</a>
    </div>

  </div>
</div>
${staticFooter(categories)}</div>
  ${assets.jsScripts}
</body>
</html>`;
}

// Secondary static routes. Vercel's catch-all rewrite (`/(.*) -> /index.html`) means
// any route without its own build/<path>/index.html silently serves the *homepage's*
// prerendered HTML — including its <title> and canonical tag — to Googlebot's first-pass
// crawl. That self-canonicalizes every one of these URLs back to "/", which reads as
// duplicate content and is why Google stops trusting site-provided titles and falls back
// to showing the bare domain in search results. Each entry here gets its own real <head>.
const STATIC_ROUTES = [
  {
    path: 'for-installers',
    title: 'Solar Calculator for Installers | Solar Cost Predictor',
    description: 'Embed a branded solar savings calculator on your website in minutes. Capture leads, show instant estimates, and close more solar deals. Free trial for solar installers.',
    heading: 'Solar Calculator for Installers',
  },
  {
    path: 'partner-with-us',
    title: 'Partner With Us | Solar Cost Predictor',
    description: "Get your solar installation business recommended to thousands of homeowners actively getting solar estimates in your area. Join Solar Cost Predictor's partner network for $350/month per city.",
    heading: 'Partner With Us',
  },
  {
    path: 'about',
    title: 'About Solar Cost Predictor | Free Solar Savings Calculator',
    description: 'Solar Cost Predictor is a free solar savings calculator for US homeowners. We use NREL PVWatts data and real electricity rates to estimate your solar costs and savings in under 2 minutes.',
    heading: 'About Solar Cost Predictor',
  },
  {
    path: 'how-we-calculate-solar-costs',
    title: 'How We Calculate Your Solar Cost Estimate | Solar Cost Predictor',
    description: 'See exactly how Solar Cost Predictor estimates your solar installation cost, savings, and payback period — real NREL sun data, EIA electricity rates, and current market pricing, step by step.',
    heading: 'How We Calculate Your Solar Cost Estimate',
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | Solar Cost Predictor',
    description: 'Solar Cost Predictor privacy policy. Learn how we collect, use, and protect your personal information when you use our free solar savings calculator.',
    heading: 'Privacy Policy',
  },
  {
    path: 'terms-of-service',
    title: 'Terms of Service | Solar Cost Predictor',
    description: 'Solar Cost Predictor terms of service. Read our terms and conditions for using the Solar Cost Predictor free solar savings calculator.',
    heading: 'Terms of Service',
  },
];

function renderStaticRoute(route, categories, assets) {
  const url = `${DOMAIN}/${route.path}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FAVICON_LINKS}
  <title>${esc(route.title)}</title>
  <meta name="description" content="${esc(route.description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(route.title)}">
  <meta property="og:description" content="${esc(route.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Solar Cost Predictor">
  <meta property="og:image" content="${DOMAIN}/android-chrome-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(route.title)}">
  <meta name="twitter:description" content="${esc(route.description)}">
  <meta name="twitter:image" content="${DOMAIN}/android-chrome-512x512.png">
  ${assets.cssLinks}
</head>
<body>
<div id="root">${staticHeader()}<div style="font-family:'Poppins','Poppins Fallback',Arial,sans-serif;background:#f8fafc;min-height:60vh;padding:56px 24px">
  <div style="max-width:720px;margin:0 auto;text-align:center">
    <h1 style="font-size:clamp(26px,4vw,38px);font-weight:800;color:#0f172a;margin-bottom:14px">${esc(route.heading)}</h1>
    <p style="font-size:16px;color:#64748b;line-height:1.7">${esc(route.description)}</p>
  </div>
</div>${staticFooter(categories)}</div>
  ${assets.jsScripts}
</body>
</html>`;
}

// Contact gets its own static shell (instead of the generic renderStaticRoute template)
// because it matches the real Contact.js hero pixel-for-pixel -- background, badge,
// heading, subtitle, and font. The generic template used a plain white background and
// system-ui font, so for the brief window before React hydrates, visitors saw a visibly
// different page flash into the real one. Matching the hero here removes that flash.
function renderContactStatic(categories, assets) {
  const url = `${DOMAIN}/contact`;
  const title = 'Contact Us | Solar Cost Predictor';
  const description = 'Contact Solar Cost Predictor with questions about our free solar savings calculator, installer program, or your solar estimate. We read every message.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FAVICON_LINKS}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Solar Cost Predictor">
  <meta property="og:image" content="${DOMAIN}/android-chrome-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${DOMAIN}/android-chrome-512x512.png">
  ${assets.cssLinks}
</head>
<body>
<div id="root"><div style="background:#f1f5f9;min-height:100vh;font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
${staticHeader()}
<div style="background:linear-gradient(135deg,#0f172a 0%,#123529 60%,#1b4d3e 100%);padding:64px 24px 96px;text-align:center;position:relative;overflow:hidden">
  <div style="position:relative;max-width:560px;margin:0 auto">
    <div style="display:inline-flex;align-items:center;background:rgba(168,195,181,0.12);border:1px solid rgba(168,195,181,0.25);border-radius:999px;padding:4px 14px;margin-bottom:20px">
      <span style="font-size:11.5px;font-weight:700;color:#a8c3b5;letter-spacing:0.08em;text-transform:uppercase">Get in Touch</span>
    </div>
    <h1 style="font-size:clamp(28px,5vw,42px);font-weight:900;color:white;line-height:1.15;margin-bottom:14px;letter-spacing:-0.02em">Contact Us</h1>
    <p style="font-size:16px;color:#a8c3b5;line-height:1.65;max-width:420px;margin:0 auto">We're a small team and we read every message. Send us a note and expect a reply within 1&ndash;2 business days.</p>
  </div>
</div>
<div style="max-width:900px;margin:-56px auto 0;padding:0 24px 80px;position:relative;min-height:400px"></div>
${staticFooter(categories)}</div></div>
  ${assets.jsScripts}
</body>
</html>`;
}

function injectHomepage(posts, categories, servicesMod) {
  const indexPath = path.join(BUILD, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('<div id="root"></div>')) return;

  const topPosts = posts.slice(0, 6);
  const postLinks = topPosts.map(p =>
    `<li style="margin-bottom:10px"><a href="/blog/${p.slug}" style="color:${PRIMARY};text-decoration:none;font-size:14px;font-weight:500;line-height:1.5">${esc(p.title)}</a></li>`
  ).join('\n      ');

  const systemSizeService = servicesMod.getServiceBySlug('solar-system-size-cost');
  const avgCostRows = systemSizeService.tiers.map(tier =>
    `<tr><td style="padding:10px 14px;color:#0f172a;font-weight:600;border-top:1px solid #f1f5f9;white-space:nowrap">${esc(tier.label)}</td><td style="padding:10px 14px;color:#475569;border-top:1px solid #f1f5f9;white-space:nowrap">${fmt(tier.low)}&ndash;${fmt(tier.high)}</td><td style="padding:10px 14px;color:${PRIMARY};font-weight:700;border-top:1px solid #f1f5f9;white-space:nowrap">${fmt(tier.low * 0.7)}&ndash;${fmt(tier.high * 0.7)}</td><td style="padding:10px 14px;color:#64748b;border-top:1px solid #f1f5f9">${esc(tier.note)}</td></tr>`
  ).join('\n      ');

  const staticContent = `${staticHeader()}<div style="font-family:'Poppins','Poppins Fallback',Arial,sans-serif;background:#f8fafc;min-height:80vh"><div style="max-width:1100px;margin:0 auto;padding:40px 24px 64px">
  <div style="text-align:center;padding:32px 0 40px">
    <h1 style="font-size:clamp(24px,5vw,44px);font-weight:900;color:#0f172a;line-height:1.2;margin-bottom:14px">Free Solar Panel Cost Calculator 2026</h1>
    <p style="font-size:17px;color:#64748b;max-width:560px;margin:0 auto 28px;line-height:1.6">Enter your ZIP code and monthly electric bill to get an instant estimate for solar installation cost, monthly savings, and 30-year ROI. Free &mdash; no signup required.</p>
    <div style="display:inline-block;background:${PRIMARY};color:white;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">Loading calculator&hellip;</div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0;text-align:center">
    <h2 style="font-size:22px;font-weight:900;color:#0f172a;margin-bottom:14px">Get a Free Solar Cost Estimate Online</h2>
    <p style="font-size:14.5px;color:#475569;line-height:1.75;max-width:640px;margin:0 auto 12px">Solar Cost Predictor is a free solar cost calculator and solar panel cost estimator built for US homeowners who want a real number before talking to an installer. Enter your ZIP code and average monthly electric bill for an instant estimate of system size, installation cost, the 30% federal tax credit, monthly savings, and payback period &mdash; no signup required.</p>
    <p style="font-size:14.5px;color:#475569;line-height:1.75;max-width:640px;margin:0 auto">Your state's real electricity rate and sun hours change how big a system you need, while your roof type and battery choice adjust installation cost &mdash; so every estimate is personalized, not a national average.</p>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:24px;text-align:center">How Our Solar Cost Calculator Estimates Your Price</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px">
      <div style="background:#f8fafc;border-radius:10px;padding:22px"><div style="background:${PRIMARY};color:white;width:32px;height:32px;border-radius:8px;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:10px">1</div><h3 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">Enter Your Electric Bill</h3><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">Your average monthly bill determines your solar system size and savings potential.</p></div>
      <div style="background:#f8fafc;border-radius:10px;padding:22px"><div style="background:${PRIMARY};color:white;width:32px;height:32px;border-radius:8px;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:10px">2</div><h3 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">Enter Your ZIP Code</h3><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">We use real NREL PVWatts sunlight data for your exact location and EIA electricity rates by state.</p></div>
      <div style="background:#f8fafc;border-radius:10px;padding:22px"><div style="background:${PRIMARY};color:white;width:32px;height:32px;border-radius:8px;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:10px">3</div><h3 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">Get Your Free Estimate</h3><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">See personalized installation cost, 30% federal tax credit, monthly savings, and 25-year ROI.</p></div>
    </div>
    <div style="text-align:center;margin-top:24px"><a href="/how-we-calculate-solar-costs" style="font-size:14px;font-weight:700;color:${PRIMARY};text-decoration:none">See the full methodology, step by step &rarr;</a></div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:8px">Solar Cost Guides &amp; Resources</h2>
    <p style="font-size:14px;color:#64748b;margin-bottom:20px">Expert articles to help you understand solar pricing, incentives, and financing options.</p>
    <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px">
      ${postLinks}
    </ul>
    <p style="margin-top:16px;margin-bottom:0"><a href="/blog" style="color:${PRIMARY};font-weight:600;font-size:14px;text-decoration:none">View all solar guides &rarr;</a></p>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:8px">Average Solar Costs (2026)</h2>
    <p style="font-size:14px;color:#64748b;margin-bottom:20px">Nationally, solar installation runs a flat $2.80 per watt. Here's what that looks like across common system sizes, before and after the 30% federal tax credit.</p>
    <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead><tr style="background:#f8fafc"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">System Size</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0;white-space:nowrap">Before Credit</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0;white-space:nowrap">Net After 30% ITC</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Typical For</th></tr></thead>
      <tbody>
      ${avgCostRows}
      </tbody>
    </table></div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:8px">Key Solar Pricing Factors</h2>
    <p style="font-size:14px;color:#64748b;margin-bottom:20px">Two homes with identical electric bills can get very different solar quotes. Here's what actually moves the number.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;font-size:13.5px;color:#334155;line-height:1.6">System size &mdash; cost scales directly with the kW you need, set by your electricity usage</div>
      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;font-size:13.5px;color:#334155;line-height:1.6">Your state's electricity rate and sun hours &mdash; affects how big a system you need for the same bill offset</div>
      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;font-size:13.5px;color:#334155;line-height:1.6">Roof type &mdash; asphalt has no surcharge, metal adds $500, flat adds $800, tile adds $1,500</div>
      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;font-size:13.5px;color:#334155;line-height:1.6">Battery backup &mdash; one Tesla Powerwall adds $11,500, two adds $23,000</div>
      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;font-size:13.5px;color:#334155;line-height:1.6">The 30% federal tax credit &mdash; applies to your entire system cost, cutting net price by nearly a third</div>
      <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;font-size:13.5px;color:#334155;line-height:1.6">Financing choice &mdash; cash, loan, lease, or PPA change your effective cost and who keeps the tax credit</div>
    </div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:20px">What Affects Your Solar Price, by Factor</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">System Size</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 12px">The biggest lever &mdash; from a 4 kW minimum to a 20 kW maximum.</p><a href="/solar-panels/solar-system-size-cost" style="font-size:13px;font-weight:700;color:${PRIMARY};text-decoration:none">See pricing &rarr;</a></div>
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">Roof Type</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 12px">Mounting hardware and labor vary by roofing material, adding $0&ndash;$1,500.</p><a href="/solar-panels/solar-cost-by-roof-type" style="font-size:13px;font-weight:700;color:${PRIMARY};text-decoration:none">See pricing &rarr;</a></div>
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">Battery Backup</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 12px">A Tesla Powerwall for outage protection adds $11,500 (one) or $23,000 (two).</p><a href="/solar-panels/tesla-powerwall-cost" style="font-size:13px;font-weight:700;color:${PRIMARY};text-decoration:none">See pricing &rarr;</a></div>
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">Your State</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">Electricity rates and sun hours vary widely by state, changing your system size and payback period.</p></div>
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">Home Energy Usage</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">Your monthly bill determines your usage, the starting point for every other calculation.</p></div>
    </div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:8px">Key Features for Businesses</h2>
    <p style="font-size:14px;color:#64748b;margin-bottom:20px">Solar installers can grow their pipeline with Solar Cost Predictor in two ways &mdash; get exclusive local leads, or put our calculator on your own site.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">Local Partner Program</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 12px">Exclusive, one-installer-per-city placement on every solar estimate result &mdash; $350/month per city.</p><a href="/partner-with-us" style="font-size:13px;font-weight:700;color:${PRIMARY};text-decoration:none">Become a Partner &rarr;</a></div>
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">Website Integration</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 12px">Embed the branded calculator on your own installer website &mdash; $159/month after a 7-day free trial.</p><a href="/for-installers" style="font-size:13px;font-weight:700;color:${PRIMARY};text-decoration:none">Embed the Calculator &rarr;</a></div>
      <div style="background:#f8fafc;border-radius:10px;padding:20px"><div style="font-weight:800;font-size:14.5px;color:#0f172a;margin-bottom:8px">No Signup Needed for Homeowners</div><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0 0 12px">Homeowners get an instant estimate with no account or contact info required &mdash; reducing friction and increasing lead quality.</p><a href="/" style="font-size:13px;font-weight:700;color:${PRIMARY};text-decoration:none">Try the Calculator &rarr;</a></div>
    </div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:24px">Frequently Asked Questions</h2>
    <div style="display:grid;gap:18px">
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How much do solar panels cost in 2026?</h3><p style="font-size:14px;color:#334155;line-height:1.7;margin:0">The average residential solar system costs $18,000&ndash;$25,000 before incentives. After the 30% federal Investment Tax Credit, most homeowners pay $12,600&ndash;$17,500 net.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How much can solar save me per month?</h3><p style="font-size:14px;color:#334155;line-height:1.7;margin:0">The average homeowner saves roughly $1,300&ndash;$1,800 in the first year with solar on a system sized to a $150/month bill. Because utility rates tend to rise over time (our calculator assumes 4%/year), those savings compound &mdash; over 30 years that adds up to roughly $74,000&ndash;$101,000.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">What is the 30% federal solar tax credit?</h3><p style="font-size:14px;color:#334155;line-height:1.7;margin:0">The Investment Tax Credit (ITC) lets you deduct 30% of your solar installation cost from federal income taxes. On a $20,000 system, you get a $6,000 credit. Available through 2032.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How long does solar take to pay off?</h3><p style="font-size:14px;color:#334155;line-height:1.7;margin:0">Payback varies widely by state &mdash; as fast as 5&ndash;6 years in high-electricity-rate states like California and Hawaii, up to 12&ndash;14 years in low-rate states like Washington. Most homeowners fall around 7&ndash;10 years. After payback, solar electricity is essentially free for the remaining panel warranty period.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How accurate is this solar calculator?</h3><p style="font-size:14px;color:#334155;line-height:1.7;margin:0">Our estimates are 80&ndash;90% accurate vs. real installer quotes, using NREL PVWatts real irradiance data for your ZIP code and a current market installation rate of $2.80/watt all-in.</p></div>
    </div>
  </div>
</div>${staticFooter(categories)}</div>`;

  html = html.replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);
  fs.writeFileSync(indexPath, html, 'utf8');
}

function fmt(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function faqSchema(faqs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  });
}

function breadcrumbSchema(items) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.item })),
  });
}

function faqAccordionHtml(faqs) {
  return faqs.map(f => `
    <div style="background:#fafafa;border:1px solid #f1f5f9;border-radius:10px;overflow:hidden;margin-bottom:10px">
      <div style="padding:14px 18px;font-weight:700;font-size:14.5px;color:#0f172a">${esc(f.q)}</div>
      <div style="padding:0 18px 16px"><p style="font-size:13.5px;color:#475569;line-height:1.7;margin:0">${esc(f.a)}</p></div>
    </div>`).join('');
}

function pageHead({ title, description, canonicalPath, extraHead = '' }) {
  const url = `${DOMAIN}${canonicalPath}`;
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FAVICON_LINKS}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Solar Cost Predictor">
  <meta property="og:image" content="${DOMAIN}/android-chrome-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${DOMAIN}/android-chrome-512x512.png">
  ${extraHead}`;
}

const BILL_SCENARIOS = [100, 150, 200, 300];

function renderStatePage(state, servicesMod, statesMod, faqsMod, assets) {
  const otherStates = statesMod.getAllStates().filter(s => s.slug !== state.slug);
  const faqs = faqsMod.getAllFaqs().slice(0, 5);
  const est = state.estimate;

  const title = `Solar Panel Cost in ${state.name} (2026) | Installation Prices & Savings | Solar Cost Predictor`;
  const description = `See average solar panel costs, savings, and payback period in ${state.name} for 2026, based on real electricity rates and sun hours. Get a free instant estimate.`;

  const billRows = BILL_SCENARIOS.map((bill, i) => {
    const e = statesMod.estimateForState(state, bill);
    return `<tr style="background:${i % 2 === 0 ? 'white' : '#fafafa'}">
      <td style="padding:10px 14px;color:#0f172a;font-weight:600;border-bottom:1px solid #f1f5f9">$${bill}/mo</td>
      <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #f1f5f9;white-space:nowrap">${e.systemSizeKw} kW (${e.panelCount} panels)</td>
      <td style="padding:10px 14px;color:${PRIMARY};font-weight:700;border-bottom:1px solid #f1f5f9;white-space:nowrap">${fmt(e.netCostLow)}&ndash;${fmt(e.netCostHigh)}</td>
      <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #f1f5f9;white-space:nowrap">${e.paybackYears ? `${e.paybackYears} yrs` : '&mdash;'}</td>
    </tr>`;
  }).join('');

  const topicLinks = servicesMod.getAllServices().map(t =>
    `<a href="/solar-panels/${t.slug}" style="text-decoration:none"><div style="background:white;border-radius:10px;border:1px solid #e2e8f0;padding:16px 18px"><div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">${esc(t.name)}</div><span style="font-size:12.5px;color:${PRIMARY};font-weight:600">See pricing &rarr;</span></div></a>`
  ).join('');

  const otherStatesHtml = otherStates.map(s => `<a href="/solar-cost/${s.slug}" style="font-size:12.5px;color:#64748b;text-decoration:none;background:white;border:1px solid #e2e8f0;border-radius:20px;padding:6px 12px">${esc(s.name)}</a>`).join(' ');

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:'Poppins','Poppins Fallback',Arial,sans-serif">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:24px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">Solar Cost in ${esc(state.name)}</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <div style="font-size:12px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">${esc(state.name)}</div>
      <h1 style="font-size:clamp(24px,4vw,32px);font-weight:800;color:#0f172a;line-height:1.25;margin-bottom:10px">Solar Panel Cost in ${esc(state.name)} (2026)</h1>
      <p style="font-size:15.5px;color:#64748b;line-height:1.7;margin-bottom:20px">${esc(state.name)} homeowners pay a flat $2.80/watt installed nationwide &mdash; what's different here is your electricity rate (${(state.electricityRate * 100).toFixed(1)}&cent;/kWh) and sun hours (${state.sunHours} peak hours/day), which change how big a system you need to offset a typical bill.</p>
      <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
        <span style="font-size:30px;font-weight:800;color:${PRIMARY}">${fmt(est.netCostLow)} &ndash; ${fmt(est.netCostHigh)}</span>
        <span style="font-size:13px;color:#94a3b8">net cost after 30% tax credit, $150/mo bill</span>
      </div>
      <div style="font-size:13px;color:#94a3b8;margin-top:6px">&asymp; ${est.systemSizeKw} kW system (${est.panelCount} panels) ${est.paybackYears ? `&middot; ${est.paybackYears}-year payback` : ''}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:20px">
        <div style="background:#f8fafc;border-radius:10px;padding:12px 14px"><div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Elec. Rate</div><div style="font-size:15px;font-weight:700;color:#0f172a">${(state.electricityRate * 100).toFixed(1)}&cent;/kWh</div></div>
        <div style="background:#f8fafc;border-radius:10px;padding:12px 14px"><div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Sun Hours</div><div style="font-size:15px;font-weight:700;color:#0f172a">${state.sunHours}/day</div></div>
        <div style="background:#f8fafc;border-radius:10px;padding:12px 14px"><div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Annual Savings</div><div style="font-size:15px;font-weight:700;color:#0f172a">${fmt(est.annualSavings)}</div></div>
        <div style="background:#f8fafc;border-radius:10px;padding:12px 14px"><div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Bill Offset</div><div style="font-size:15px;font-weight:700;color:#0f172a">${est.offsetPercent}%</div></div>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,${PRIMARY},#16324f);border-radius:12px;padding:18px 24px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="color:white"><div style="font-weight:700;font-size:15px">Get a personalized estimate for ${esc(state.name)}</div><div style="font-size:13px;opacity:0.9">Free &middot; No signup &middot; 2 minutes</div></div>
      <a href="/" style="background:white;color:${PRIMARY};padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap">Calculate Now &rarr;</a>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:6px">Cost by Monthly Bill in ${esc(state.name)}</h2>
      <p style="font-size:13.5px;color:#64748b;margin-bottom:4px">System size and cost scale with your usage &mdash; here's what different bill sizes look like in ${esc(state.name)}.</p>
      <div style="overflow-x:auto;margin:20px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#f8fafc"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Monthly Bill</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">System Size</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Net Cost (after ITC)</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Payback</th></tr></thead>
        <tbody>${billRows}</tbody>
      </table></div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">Solar Cost Topics</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">${topicLinks}</div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">FAQs</h2>
      ${faqAccordionHtml(faqs)}
    </div>
    <div style="background:#eaf3ee;border:1px solid #c7d2e0;border-radius:12px;padding:24px 28px;margin-bottom:32px;text-align:center">
      <div style="font-weight:800;font-size:18px;color:#0f172a;margin-bottom:6px">Ready to get an accurate estimate?</div>
      <p style="font-size:14px;color:#64748b;margin-bottom:16px">Use our free calculator for a personalized solar estimate in ${esc(state.name)} in under 2 minutes.</p>
      <a href="/" style="background:${PRIMARY};color:white;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">Get My Free Estimate &rarr;</a>
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Solar Costs in Other States</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${otherStatesHtml}</div>
    </div>
  </div>
</div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: `Solar Cost in ${state.name}`, item: `${DOMAIN}/solar-cost/${state.slug}` },
  ]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${pageHead({
    title, description, canonicalPath: `/solar-cost/${state.slug}`,
    extraHead: `<script type="application/ld+json">${faqSchema(faqs)}</script><script type="application/ld+json">${breadcrumb}</script>`,
  })}
  ${assets.cssLinks}
</head>
<body>
<div id="root">${staticHeader()}${body}</div>
  ${assets.jsScripts}
</body>
</html>`;
}

function renderTopicPage(service, servicesMod, statesMod, assets) {
  const cost = servicesMod.typicalCost(service);
  const related = servicesMod.getRelatedServices(service);
  const featured = statesMod.getFeaturedStates();

  const tierRows = service.tiers.map((tier, i) => `
    <tr style="background:${i % 2 === 0 ? 'white' : '#fafafa'}">
      <td style="padding:10px 14px;color:#0f172a;font-weight:600;border-bottom:1px solid #f1f5f9">${esc(tier.label)}</td>
      <td style="padding:10px 14px;color:${PRIMARY};font-weight:700;border-bottom:1px solid #f1f5f9;white-space:nowrap">${tier.low === tier.high ? fmt(tier.low) : `${fmt(tier.low)}&ndash;${fmt(tier.high)}`}</td>
      <td style="padding:10px 14px;color:#475569;border-bottom:1px solid #f1f5f9">${esc(tier.note)}</td>
    </tr>`).join('');

  const bulletsHtml = service.bullets.map(b => `<li style="display:flex;gap:8px;font-size:14.5px;color:#374151;line-height:1.7;margin-bottom:10px"><span style="color:#16a34a;flex-shrink:0">&check;</span>${esc(b)}</li>`).join('');

  const stateRows = featured.map(state =>
    `<a href="/solar-cost/${state.slug}" style="text-decoration:none"><div style="border:1px solid #f1f5f9;background:#fafafa;border-radius:8px;padding:11px 14px;display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="font-size:13px;font-weight:600;color:#0f172a">${esc(state.name)}</span><span style="font-size:12.5px;font-weight:700;color:${PRIMARY};white-space:nowrap">${fmt(state.estimate.netCostLow)}&ndash;${fmt(state.estimate.netCostHigh)}</span></div></a>`
  ).join('');

  const relatedHtml = related.map(r => `<a href="/solar-panels/${r.slug}" style="text-decoration:none"><div style="background:white;border-radius:10px;border:1px solid #e2e8f0;padding:16px 18px"><div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">${esc(r.name)}</div><span style="font-size:12.5px;color:${PRIMARY};font-weight:600">See pricing &rarr;</span></div></a>`).join('');

  const body = `<div style="background:#f8fafc;min-height:100vh;padding:40px 24px 64px;font-family:'Poppins','Poppins Fallback',Arial,sans-serif">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:flex;gap:6px;font-size:13px;color:#94a3b8;margin-bottom:24px;flex-wrap:wrap">
      <a href="/" style="color:#64748b;text-decoration:none">Home</a><span>&rsaquo;</span>
      <span style="color:#0f172a">${esc(service.name)}</span>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h1 style="font-size:clamp(24px,4vw,32px);font-weight:800;color:#0f172a;line-height:1.25;margin-bottom:10px">${esc(service.name)} 2026</h1>
      <p style="font-size:15.5px;color:#64748b;line-height:1.7;margin-bottom:20px">${esc(service.tagline)}</p>
      <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
        <span style="font-size:30px;font-weight:800;color:${PRIMARY}">${cost.low === cost.high ? fmt(cost.low) : `${fmt(cost.low)} &ndash; ${fmt(cost.high)}`}</span>
        <span style="font-size:13px;color:#94a3b8">${esc(service.unit)}</span>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,${PRIMARY},#16324f);border-radius:12px;padding:18px 24px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div style="color:white"><div style="font-weight:700;font-size:15px">Get a personalized solar estimate</div><div style="font-size:13px;opacity:0.9">Free &middot; No signup &middot; 2 minutes</div></div>
      <a href="/" style="background:white;color:${PRIMARY};padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap">Calculate Now &rarr;</a>
    </div>
    <div style="background:white;border-radius:14px;border:1px solid #e2e8f0;padding:32px 36px;margin-bottom:24px">
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-bottom:6px">Pricing Breakdown</h2>
      <p style="font-size:13.5px;color:#64748b;margin-bottom:4px">Based on our calculator's $2.80/watt installed rate &mdash; ${esc(service.unit)}.</p>
      <div style="overflow-x:auto;margin:20px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#f8fafc"><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Option</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Cost</th><th style="padding:10px 14px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e2e8f0">Notes</th></tr></thead>
        <tbody>${tierRows}</tbody>
      </table></div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">What to Know</h2>
      <ul style="list-style:none;padding:0;margin:0">${bulletsHtml}</ul>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">Solar Cost by State</h2>
      <p style="font-size:13px;color:#94a3b8;margin-bottom:12px">Installed price per watt is the same nationwide &mdash; state variance comes from electricity rates and sun hours changing your recommended system size.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">${stateRows}</div>
      <h2 style="font-size:19px;font-weight:800;color:#0f172a;margin-top:32px;margin-bottom:14px">FAQs</h2>
      ${faqAccordionHtml(service.faqs)}
    </div>
    <div style="background:#eaf3ee;border:1px solid #c7d2e0;border-radius:12px;padding:24px 28px;margin-bottom:32px;text-align:center">
      <div style="font-weight:800;font-size:18px;color:#0f172a;margin-bottom:6px">Ready to get an accurate estimate?</div>
      <p style="font-size:14px;color:#64748b;margin-bottom:16px">Use our free calculator for a personalized solar estimate in under 2 minutes.</p>
      <a href="/" style="background:${PRIMARY};color:white;padding:12px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">Get My Free Estimate &rarr;</a>
    </div>
    ${related.length ? `<div><div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Related Topics</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">${relatedHtml}</div></div>` : ''}
  </div>
</div>`;

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', item: DOMAIN },
    { name: service.name, item: `${DOMAIN}/solar-panels/${service.slug}` },
  ]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${pageHead({
    title: service.seoTitle, description: service.metaDescription, canonicalPath: `/solar-panels/${service.slug}`,
    extraHead: `<script type="application/ld+json">${faqSchema(service.faqs)}</script><script type="application/ld+json">${breadcrumb}</script>`,
  })}
  ${assets.cssLinks}
</head>
<body>
<div id="root">${staticHeader()}${body}</div>
  ${assets.jsScripts}
</body>
</html>`;
}

function writeFile(relPath, html) {
  const full = path.join(BUILD, relPath, 'index.html');
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
}

function main() {
  if (!fs.existsSync(BUILD)) {
    console.log('⚠  prerender: build/ directory not found — skipping');
    return;
  }

  const { CATEGORIES, POSTS } = loadBlogData();
  const servicesMod = loadServicesData();
  const statesMod = loadStatesData();
  const faqsMod = loadFaqsData();
  const assets = getAssetTags();

  let count = 0;

  injectHomepage(POSTS, CATEGORIES, servicesMod);

  for (const route of STATIC_ROUTES) {
    writeFile(route.path, renderStaticRoute(route, CATEGORIES, assets));
    count++;
  }

  writeFile('contact', renderContactStatic(CATEGORIES, assets));
  count++;

  writeFile('blog', renderBlogIndex(POSTS, CATEGORIES, assets));
  count++;

  for (const cat of CATEGORIES) {
    writeFile(`blog/category/${cat.slug}`, renderCategoryPage(cat, POSTS, CATEGORIES, assets));
    count++;
  }

  for (const post of POSTS) {
    writeFile(`blog/${post.slug}`, renderBlogPost(post, CATEGORIES, assets));
    count++;
  }

  const services = servicesMod.getAllServices();
  for (const service of services) {
    writeFile(`solar-panels/${service.slug}`, renderTopicPage(service, servicesMod, statesMod, assets));
    count++;
  }

  const states = statesMod.getAllStates();
  for (const state of states) {
    writeFile(`solar-cost/${state.slug}`, renderStatePage(state, servicesMod, statesMod, faqsMod, assets));
    count++;
  }

  console.log(`✓ prerender — ${count} pages + homepage generated (${POSTS.length} posts, ${CATEGORIES.length} categories, ${services.length} topics, ${states.length} states)`);
}

main();
