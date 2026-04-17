/**
 * prerender.js — Pure Node.js static HTML prerenderer (no browser/Puppeteer needed).
 *
 * Reads blogPosts.js data by evaluating it with new Function(), then generates
 * a complete HTML file for every blog post, category page, and static page.
 * Vercel serves these files directly so Google sees real content without JS.
 *
 * Runs automatically as the postbuild step: `node scripts/prerender.js`
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const BUILD  = path.join(__dirname, '../build');
const SRC    = path.join(__dirname, '../src');
const DOMAIN = 'https://www.mysolarwidget.com';

// ─── 1. Load blog data by evaluating blogPosts.js ───────────────────────────

function loadBlogData() {
  const raw = fs.readFileSync(path.join(SRC, 'data/blogPosts.js'), 'utf8');
  // Strip ES module keywords so new Function() can evaluate the file
  const src = raw
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export default /gm, 'const _default = ')
    .replace(/^export \{[^}]*\};\s*$/gm, '');
  // Evaluate and return the two exported constants
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

// ─── 3. HTML generator helpers ───────────────────────────────────────────────

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
    description: post.metaDescription,
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
  <meta name="description" content="${esc(post.metaDescription)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${DOMAIN}/blog/${post.slug}">
  <meta property="og:title" content="${esc(post.seoTitle || post.title)}">
  <meta property="og:description" content="${esc(post.metaDescription)}">
  <meta property="og:url" content="${DOMAIN}/blog/${post.slug}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="MySolarWidget">
  <meta property="og:image" content="${DOMAIN}/android-chrome-512x512.png">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${articleSchema(post)}</script>
  ${assets.cssLinks}
</head>
<body>
<div id="root"><article style="max-width:800px;margin:40px auto;padding:0 24px;font-family:system-ui,-apple-system,sans-serif;line-height:1.7;color:#0f172a">
  <nav style="font-size:13px;color:#64748b;margin-bottom:24px">
    <a href="/" style="color:#2563eb;text-decoration:none">Home</a> &rsaquo;
    <a href="/blog" style="color:#2563eb;text-decoration:none">Blog</a> &rsaquo;
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

function renderBlogIndex(posts, assets) {
  const listHtml = posts.map(p => `
  <article style="border-bottom:1px solid #e2e8f0;padding:24px 0">
    <a href="/blog/${p.slug}" style="text-decoration:none;color:inherit">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;color:#0f172a">${esc(p.title)}</h2>
    </a>
    <p style="color:#64748b;font-size:14px;margin-bottom:8px">${formatDate(p.publishDate)} &middot; ${p.readingTime || 8} min read</p>
    <p style="color:#374151;font-size:15px;line-height:1.6">${esc(p.excerpt || '')}</p>
    <a href="/blog/${p.slug}" style="color:#2563eb;font-size:14px;font-weight:600;text-decoration:none">Read more &rarr;</a>
  </article>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Solar Energy Blog | MySolarWidget</title>
  <meta name="description" content="Expert guides on solar panel costs, savings, financing, incentives, and installation for US homeowners. Based on real NREL and EIA data.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${DOMAIN}/blog">
  <meta property="og:title" content="Solar Energy Blog | MySolarWidget">
  <meta property="og:description" content="Expert guides on solar panel costs, savings, financing, and incentives for US homeowners.">
  <meta property="og:url" content="${DOMAIN}/blog">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="MySolarWidget">
  ${assets.cssLinks}
</head>
<body>
<div id="root"><div style="max-width:800px;margin:40px auto;padding:0 24px;font-family:system-ui,-apple-system,sans-serif;color:#0f172a">
  <h1 style="font-size:clamp(24px,4vw,36px);font-weight:900;margin-bottom:8px">Solar Energy Blog</h1>
  <p style="color:#64748b;margin-bottom:32px">Expert guides on solar costs, savings, financing, and incentives — backed by real data.</p>
  ${listHtml}
</div></div>
  ${assets.jsScripts}
</body>
</html>`;
}

function renderCategoryPage(cat, posts, assets) {
  const catPosts = posts.filter(p => p.category === cat.slug);
  const listHtml = catPosts.map(p => `
  <article style="border-bottom:1px solid #e2e8f0;padding:24px 0">
    <a href="/blog/${p.slug}" style="text-decoration:none;color:inherit">
      <h2 style="font-size:18px;font-weight:700;margin-bottom:8px;color:#0f172a">${esc(p.title)}</h2>
    </a>
    <p style="color:#64748b;font-size:13px;margin-bottom:8px">${formatDate(p.publishDate)} &middot; ${p.readingTime || 8} min read</p>
    <p style="color:#374151;font-size:14px;line-height:1.6">${esc(p.excerpt || '')}</p>
    <a href="/blog/${p.slug}" style="color:#2563eb;font-size:13px;font-weight:600;text-decoration:none">Read more &rarr;</a>
  </article>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(cat.label)} Articles | MySolarWidget Blog</title>
  <meta name="description" content="${esc(cat.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${DOMAIN}/blog/category/${cat.slug}">
  <meta property="og:title" content="${esc(cat.label)} Articles | MySolarWidget Blog">
  <meta property="og:description" content="${esc(cat.description)}">
  <meta property="og:url" content="${DOMAIN}/blog/category/${cat.slug}">
  <meta property="og:type" content="website">
  ${assets.cssLinks}
</head>
<body>
<div id="root"><div style="max-width:800px;margin:40px auto;padding:0 24px;font-family:system-ui,-apple-system,sans-serif;color:#0f172a">
  <nav style="font-size:13px;color:#64748b;margin-bottom:24px">
    <a href="/blog" style="color:#2563eb;text-decoration:none">Blog</a> &rsaquo; <span>${esc(cat.label)}</span>
  </nav>
  <h1 style="font-size:clamp(22px,3.5vw,34px);font-weight:900;margin-bottom:8px">${esc(cat.label)}</h1>
  <p style="color:#64748b;margin-bottom:32px">${esc(cat.description)}</p>
  ${listHtml || '<p>No articles yet.</p>'}
</div></div>
  ${assets.jsScripts}
</body>
</html>`;
}

// ─── 4. Write a file, creating parent directories as needed ─────────────────

function writeFile(relPath, html) {
  const full = path.join(BUILD, relPath, 'index.html');
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
}

// ─── 5. Main ─────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(BUILD)) {
    console.log('⚠  prerender: build/ directory not found — skipping');
    return;
  }

  const { CATEGORIES, POSTS } = loadBlogData();
  const assets = getAssetTags();

  let count = 0;

  // Blog index
  writeFile('blog', renderBlogIndex(POSTS, assets));
  count++;

  // Category pages
  for (const cat of CATEGORIES) {
    writeFile(`blog/category/${cat.slug}`, renderCategoryPage(cat, POSTS, assets));
    count++;
  }

  // Individual blog posts
  for (const post of POSTS) {
    writeFile(`blog/${post.slug}`, renderBlogPost(post, assets));
    count++;
  }

  console.log(`✓ prerender — ${count} pages generated (${POSTS.length} posts, ${CATEGORIES.length} categories)`);
}

main();
