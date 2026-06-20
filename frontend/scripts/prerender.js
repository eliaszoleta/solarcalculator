'use strict';

const fs   = require('fs');
const path = require('path');

const BUILD  = path.join(__dirname, '../build');
const SRC    = path.join(__dirname, '../src');
const DOMAIN = 'https://www.mysolarwidget.com';
const PRIMARY = '#1e40af';

// ─── 1. Load blog data ───────────────────────────────────────────────────────

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

// ─── 2. Extract CSS/JS asset tags from the built index.html ─────────────────

function getAssetTags() {
  const indexHtml = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
  const cssLinks  = (indexHtml.match(/<link[^>]+\.css[^>]*>/g)  || []).join('\n  ');
  const jsScripts = (indexHtml.match(/<script[^>]+\.js[^>]*>/g) || []).join('\n  ');
  return { cssLinks, jsScripts };
}

// ─── 3. Static site header (matches React Header.js) ────────────────────────

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
    #root .app header { } /* React header takes over after mount */
  </style>
</header>`;
}

// ─── 4. Helpers ──────────────────────────────────────────────────────────────

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

// ─── 5. Blog post renderer ───────────────────────────────────────────────────

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

// ─── 6. Blog index renderer ──────────────────────────────────────────────────

function renderBlogIndex(posts, categories, assets) {
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  const catBadge = (post) => {
    const cat = categories.find(c => c.slug === post.category) || { label: post.category };
    return `<div style="display:inline-flex;align-items:center;gap:5px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:3px 9px;font-size:11px;font-weight:700;color:${PRIMARY};text-transform:uppercase;letter-spacing:0.05em">${esc(cat.label)}</div>`;
  };

  const readTime = (post) => post.readingTime ? `${post.readingTime} min read` : (post.readTime || '');

  const postCard = (post, isFeatured = false) => `
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
    </a>`;

  const catPills = categories.map(cat => `
    <a href="/blog/category/${cat.slug}" style="display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:24px;background:white;border:1.5px solid #e2e8f0;text-decoration:none;font-size:13.5px;font-weight:600;color:#374151">${esc(cat.label)}</a>`
  ).join('');

  const gridCards = rest.map(post => `
    <div style="min-width:0">${postCard(post)}</div>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Solar Blog 2026 &mdash; Cost Guides, Savings &amp; Incentives | MySolarWidget</title>
  <meta name="description" content="Expert solar guides: cost estimates, savings calculations, financing options, tax credits, and installation advice. Free resources for homeowners.">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${DOMAIN}/blog">
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:16px;top:50%;transform:translateY(-50%)">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input type="search" placeholder="Search solar guides..." disabled
        style="width:100%;padding:13px 18px 13px 46px;font-size:15px;border-radius:12px;border:2px solid #e2e8f0;outline:none;background:white;box-sizing:border-box;color:#0f172a" />
    </div>

    ${featured ? `
    <div style="margin-bottom:40px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px">Featured</div>
      ${postCard(featured, true)}
    </div>` : ''}

    <div style="margin-bottom:40px">
      <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">Browse by Category</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${catPills}</div>
    </div>

    <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px">All Articles</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px">
      ${gridCards}
    </div>

  </div>
</div>
</div>
  ${assets.jsScripts}
</body>
</html>`;
}

// ─── 7. Category page renderer ───────────────────────────────────────────────

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

// ─── 8. Write helper ─────────────────────────────────────────────────────────

function writeFile(relPath, html) {
  const full = path.join(BUILD, relPath, 'index.html');
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
}

// ─── 9. Main ─────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(BUILD)) {
    console.log('⚠  prerender: build/ directory not found — skipping');
    return;
  }

  const { CATEGORIES, POSTS } = loadBlogData();
  const assets = getAssetTags();

  let count = 0;

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

  console.log(`✓ prerender — ${count} pages generated (${POSTS.length} posts, ${CATEGORIES.length} categories)`);
}

main();
