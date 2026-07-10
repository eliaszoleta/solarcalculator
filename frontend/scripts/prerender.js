'use strict';

const fs   = require('fs');
const path = require('path');

const BUILD  = path.join(__dirname, '../build');
const SRC    = path.join(__dirname, '../src');
const DOMAIN = 'https://www.mysolarwidget.com';
const PRIMARY = '#1e40af';

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

function getAssetTags() {
  const indexHtml = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
  const cssLinks  = (indexHtml.match(/<link[^>]+\.css[^>]*>/g)  || []).join('\n  ');
  const jsScripts = (indexHtml.match(/<script[^>]+\.js[^>]*>/g) || []).join('\n  ');
  return { cssLinks, jsScripts };
}

function staticHeader() {
  return `<header id="static-header" style="position:sticky;top:0;z-index:100;height:60px;display:flex;align-items:center;padding:0 12px;background:#ffffff;border-bottom:1px solid #f3f4f6;box-sizing:border-box">
  <div style="max-width:1120px;width:100%;margin:0 auto;display:flex;align-items:center;justify-content:space-between">
    <a href="/" style="display:flex;align-items:center;text-decoration:none;flex-shrink:0">
      <img src="/logo-horizontal-light.svg" alt="MySolarWidget" style="height:44px;width:auto" />
    </a>
    <nav class="pr-desktop-nav" style="display:flex;align-items:center;gap:4px">
      <a href="/#how-it-works" style="font-size:14px;font-weight:500;color:#4b5563;padding:6px 12px;border-radius:8px;text-decoration:none">How It Works</a>
      <a href="/blog" style="font-size:14px;font-weight:500;color:#4b5563;padding:6px 12px;border-radius:8px;text-decoration:none">Blog</a>
      <a href="/#faq" style="font-size:14px;font-weight:500;color:#4b5563;padding:6px 12px;border-radius:8px;text-decoration:none">FAQ</a>
      <a href="/for-installers" style="margin-left:8px;font-size:13px;font-weight:600;color:${PRIMARY};padding:7px 16px;border-radius:9px;border:1.5px solid ${PRIMARY};text-decoration:none">Get Solar Widget</a>
    </nav>
    <a href="/for-installers" class="pr-mobile-cta" style="display:none;font-size:11px;font-weight:600;color:${PRIMARY};padding:5px 10px;border-radius:8px;border:1.5px solid ${PRIMARY};text-decoration:none">Get Solar Widget</a>
  </div>
  <style>
    @media(max-width:639px){.pr-desktop-nav{display:none!important}.pr-mobile-cta{display:inline-block!important}}
  </style>
</header>`;
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
    author: { '@type': 'Organization', name: 'MySolarWidget' },
    publisher: {
      '@type': 'Organization',
      name: 'MySolarWidget',
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/android-chrome-512x512.png` },
    },
    datePublished: post.publishDate,
    url: `${DOMAIN}/blog/${post.slug}`,
    mainEntityOfPage: `${DOMAIN}/blog/${post.slug}`,
  });
}

function renderBlogPost(post, assets) {
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
  <title>${esc(post.seoTitle || post.title)}</title>
  <meta name="description" content="${esc(post.metaDescription || post.excerpt)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${DOMAIN}/blog/${post.slug}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(post.seoTitle || post.title)}">
  <meta property="og:description" content="${esc(post.metaDescription || post.excerpt)}">
  <meta property="og:url" content="${DOMAIN}/blog/${post.slug}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="MySolarWidget">
  <meta property="og:image" content="${DOMAIN}/android-chrome-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${articleSchema(post)}</script>
  ${assets.cssLinks}
</head>
<body>
<div id="root">${staticHeader()}<article style="max-width:800px;margin:40px auto;padding:0 24px;font-family:system-ui,-apple-system,sans-serif;line-height:1.7;color:#0f172a">
  <nav style="font-size:13px;color:#64748b;margin-bottom:24px">
    <a href="/" style="color:${PRIMARY};text-decoration:none">Home</a> &rsaquo;
    <a href="/blog" style="color:${PRIMARY};text-decoration:none">Blog</a> &rsaquo;
    <span>${esc(post.title)}</span>
  </nav>
  <h1 style="font-size:clamp(24px,4vw,40px);font-weight:900;line-height:1.2;margin-bottom:16px">${esc(post.title)}</h1>
  <p style="color:#64748b;font-size:13px;margin-bottom:32px">
    By MySolarWidget Team &middot; ${formatDate(post.publishDate)} &middot; ${post.readingTime || 8} min read
  </p>
  <div>${post.intro || ''}</div>
  ${sectionsHtml}
  ${faqHtml}
</article></div>
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
    return `<span style="display:inline-flex;align-items:center;gap:5px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:3px 9px;font-size:11px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.05em">${esc(cat.label)}</span>`;
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
    <a href="/blog/category/${cat.slug}" style="display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:24px;background:white;border:1.5px solid #e2e8f0;text-decoration:none;font-size:13.5px;font-weight:600;color:#374151">${esc(cat.label)}</a>`
  ).join('');

  const allCards = allPosts.map(p => postCard(p)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Solar Blog 2026 &mdash; Cost Guides, Savings &amp; Incentives | MySolarWidget</title>
  <meta name="description" content="Expert solar guides: cost estimates, savings calculations, financing options, tax credits, and installation advice. Free resources for homeowners.">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${DOMAIN}/blog">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="Solar Blog 2026 | MySolarWidget">
  <meta property="og:description" content="Expert solar guides: cost estimates, savings calculations, financing options, tax credits, and installation advice.">
  <meta property="og:url" content="${DOMAIN}/blog">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="MySolarWidget">
  ${assets.cssLinks}
</head>
<body>
<div id="root">
${staticHeader()}
<div style="background:#f8fafc;min-height:100vh;padding:48px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
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
</div>
${vanillaSearch}
  ${assets.jsScripts}
</body>
</html>`;
}

function renderCategoryPage(cat, posts, assets) {
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

  const seoTitle = `${cat.label} Guide 2026 | MySolarWidget`;
  const seoDesc = cat.description || `Expert guides on ${cat.label.toLowerCase()} for homeowners.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(seoTitle)}</title>
  <meta name="description" content="${esc(seoDesc)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${DOMAIN}/blog/category/${cat.slug}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(seoTitle)}">
  <meta property="og:description" content="${esc(seoDesc)}">
  <meta property="og:url" content="${DOMAIN}/blog/category/${cat.slug}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="MySolarWidget">
  ${assets.cssLinks}
</head>
<body>
<div id="root">
${staticHeader()}
<div style="background:#f8fafc;min-height:100vh;padding:48px 24px 64px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:900px;margin:0 auto">

    <a href="/blog" style="font-size:13px;color:#64748b;text-decoration:none;display:inline-flex;align-items:center;gap:5px;margin-bottom:28px">
      &larr; All Articles
    </a>

    <div style="margin-bottom:40px">
      <div style="width:52px;height:52px;border-radius:14px;background:#eff6ff;border:1.5px solid #bfdbfe;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:24px">&#9728;</div>
      <h1 style="font-size:clamp(24px,4vw,34px);font-weight:800;color:#0f172a;margin-bottom:8px">${esc(cat.label)}</h1>
      <p style="font-size:16px;color:#64748b">${esc(seoDesc)}</p>
    </div>

    <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">All Articles</div>
    ${articleRows || '<p style="color:#64748b">No articles yet.</p>'}

    <div style="background:linear-gradient(135deg,#1e3a8a,#1e40af);border-radius:14px;padding:32px 36px;margin-top:48px;color:white;text-align:center">
      <h3 style="font-size:20px;font-weight:800;margin-bottom:10px">Estimate Your Solar Savings</h3>
      <p style="color:#bfdbfe;margin-bottom:20px;font-size:15px">Free calculator &mdash; enter your electric bill and ZIP code for a personalized estimate.</p>
      <a href="/" style="background:white;color:${PRIMARY};padding:13px 28px;border-radius:9px;text-decoration:none;font-weight:700;font-size:15px">Get My Free Estimate &rarr;</a>
    </div>

  </div>
</div>
</div>
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
    title: 'Solar Calculator Widget for Installers | MySolarWidget',
    description: 'Embed a branded solar savings calculator on your website in minutes. Capture leads, show instant estimates, and close more solar deals. Free trial for solar installers.',
    heading: 'Solar Calculator Widget for Installers',
  },
  {
    path: 'partner-with-us',
    title: 'Partner With Us | MySolarWidget',
    description: "Get your solar installation business recommended to thousands of homeowners actively getting solar estimates in your area. Join MySolarWidget's partner network for $350/month per city.",
    heading: 'Partner With Us',
  },
  {
    path: 'about',
    title: 'About MySolarWidget | Free Solar Savings Calculator',
    description: 'MySolarWidget is a free solar savings calculator for US homeowners. We use NREL PVWatts data and real electricity rates to estimate your solar costs and savings in under 2 minutes.',
    heading: 'About MySolarWidget',
  },
  {
    path: 'contact',
    title: 'Contact Us | MySolarWidget',
    description: 'Contact MySolarWidget with questions about our free solar savings calculator, installer widget, or your solar estimate. We read every message.',
    heading: 'Contact Us',
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | MySolarWidget',
    description: 'MySolarWidget privacy policy. Learn how we collect, use, and protect your personal information when you use our free solar savings calculator.',
    heading: 'Privacy Policy',
  },
  {
    path: 'terms-of-service',
    title: 'Terms of Service | MySolarWidget',
    description: 'MySolarWidget terms of service. Read our terms and conditions for using the MySolarWidget free solar savings calculator.',
    heading: 'Terms of Service',
  },
];

function renderStaticRoute(route, assets) {
  const url = `${DOMAIN}/${route.path}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(route.title)}</title>
  <meta name="description" content="${esc(route.description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <meta property="og:title" content="${esc(route.title)}">
  <meta property="og:description" content="${esc(route.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="MySolarWidget">
  <meta property="og:image" content="${DOMAIN}/android-chrome-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(route.title)}">
  <meta name="twitter:description" content="${esc(route.description)}">
  <meta name="twitter:image" content="${DOMAIN}/android-chrome-512x512.png">
  ${assets.cssLinks}
</head>
<body>
<div id="root">${staticHeader()}<div style="font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;min-height:60vh;padding:56px 24px">
  <div style="max-width:720px;margin:0 auto;text-align:center">
    <h1 style="font-size:clamp(26px,4vw,38px);font-weight:800;color:#0f172a;margin-bottom:14px">${esc(route.heading)}</h1>
    <p style="font-size:16px;color:#64748b;line-height:1.7">${esc(route.description)}</p>
  </div>
</div></div>
  ${assets.jsScripts}
</body>
</html>`;
}

function injectHomepage(posts, categories) {
  const indexPath = path.join(BUILD, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('<div id="root"></div>')) return;

  const topPosts = posts.slice(0, 6);
  const postLinks = topPosts.map(p =>
    `<li style="margin-bottom:10px"><a href="/blog/${p.slug}" style="color:${PRIMARY};text-decoration:none;font-size:14px;font-weight:500;line-height:1.5">${esc(p.title)}</a></li>`
  ).join('\n      ');

  const staticContent = `${staticHeader()}<div style="font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;min-height:80vh"><div style="max-width:1100px;margin:0 auto;padding:40px 24px 64px">
  <div style="text-align:center;padding:32px 0 40px">
    <h1 style="font-size:clamp(24px,5vw,44px);font-weight:900;color:#0f172a;line-height:1.2;margin-bottom:14px">Free Solar Panel Cost Calculator 2026</h1>
    <p style="font-size:17px;color:#64748b;max-width:560px;margin:0 auto 28px;line-height:1.6">Enter your ZIP code and monthly electric bill to get an instant estimate for solar installation cost, monthly savings, and 30-year ROI. Free &mdash; no signup required.</p>
    <div style="display:inline-block;background:${PRIMARY};color:white;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">Loading calculator&hellip;</div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:24px;text-align:center">How It Works &mdash; 3 Simple Steps</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px">
      <div style="background:#f8fafc;border-radius:10px;padding:22px"><div style="background:${PRIMARY};color:white;width:32px;height:32px;border-radius:8px;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:10px">1</div><h3 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">Enter Your Electric Bill</h3><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">Your average monthly bill determines your solar system size and savings potential.</p></div>
      <div style="background:#f8fafc;border-radius:10px;padding:22px"><div style="background:${PRIMARY};color:white;width:32px;height:32px;border-radius:8px;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:10px">2</div><h3 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">Enter Your ZIP Code</h3><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">We use real NREL PVWatts sunlight data for your exact location and EIA electricity rates by state.</p></div>
      <div style="background:#f8fafc;border-radius:10px;padding:22px"><div style="background:${PRIMARY};color:white;width:32px;height:32px;border-radius:8px;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:10px">3</div><h3 style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">Get Your Free Estimate</h3><p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">See personalized installation cost, 30% federal tax credit, monthly savings, and 25-year ROI.</p></div>
    </div>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;margin-bottom:32px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:8px">Solar Cost Guides &amp; Resources</h2>
    <p style="font-size:14px;color:#64748b;margin-bottom:20px">Expert articles to help you understand solar pricing, incentives, and financing options.</p>
    <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px">
      ${postLinks}
    </ul>
    <p style="margin-top:16px;margin-bottom:0"><a href="/blog" style="color:${PRIMARY};font-weight:600;font-size:14px;text-decoration:none">View all solar guides &rarr;</a></p>
  </div>
  <div style="background:white;border-radius:16px;padding:36px;border:1px solid #e2e8f0">
    <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-bottom:24px">Frequently Asked Questions</h2>
    <div style="display:grid;gap:18px">
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How much do solar panels cost in 2026?</h3><p style="font-size:14px;color:#374151;line-height:1.7;margin:0">The average residential solar system costs $18,000&ndash;$25,000 before incentives. After the 30% federal Investment Tax Credit, most homeowners pay $12,600&ndash;$17,500 net.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How much can solar save me per month?</h3><p style="font-size:14px;color:#374151;line-height:1.7;margin:0">Most homeowners save $100&ndash;$150 per month with solar, or $1,200&ndash;$1,800 per year. Over 25 years, that&rsquo;s $30,000&ndash;$45,000 in total electricity savings.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">What is the 30% federal solar tax credit?</h3><p style="font-size:14px;color:#374151;line-height:1.7;margin:0">The Investment Tax Credit (ITC) lets you deduct 30% of your solar installation cost from federal income taxes. On a $20,000 system, you get a $6,000 credit. Available through 2032.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How long does solar take to pay off?</h3><p style="font-size:14px;color:#374151;line-height:1.7;margin:0">The average payback period is 7&ndash;12 years. After payback, solar electricity is essentially free for the remaining panel warranty period of 13&ndash;18 years.</p></div>
      <div><h3 style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">How accurate is this solar calculator?</h3><p style="font-size:14px;color:#374151;line-height:1.7;margin:0">Our estimates are 80&ndash;90% accurate vs. real installer quotes, using NREL PVWatts real irradiance data for your ZIP code and current 2026 market installation rates ($2.50&ndash;$3.50/watt).</p></div>
    </div>
  </div>
</div></div>`;

  html = html.replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);
  fs.writeFileSync(indexPath, html, 'utf8');
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
  const assets = getAssetTags();

  let count = 0;

  injectHomepage(POSTS, CATEGORIES);

  for (const route of STATIC_ROUTES) {
    writeFile(route.path, renderStaticRoute(route, assets));
    count++;
  }

  writeFile('blog', renderBlogIndex(POSTS, CATEGORIES, assets));
  count++;

  for (const cat of CATEGORIES) {
    writeFile(`blog/category/${cat.slug}`, renderCategoryPage(cat, POSTS, assets));
    count++;
  }

  for (const post of POSTS) {
    writeFile(`blog/${post.slug}`, renderBlogPost(post, assets));
    count++;
  }

  console.log(`✓ prerender — ${count} pages + homepage generated (${POSTS.length} posts, ${CATEGORIES.length} categories)`);
}

main();
