const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.solarcostpredictor.com';
const TODAY = new Date().toISOString().split('T')[0];

const postsFile = fs.readFileSync(
  path.join(__dirname, '../src/data/blogPosts.js'),
  'utf8'
);

const [catSection, postsSection] = postsFile.split('export const POSTS');

const categorySlugs = [...catSection.matchAll(/slug:\s*['"]([^'"]+)['"]\s*/g)].map(m => m[1]);

const slugMatches = [...postsSection.matchAll(/(?<!\w)slug:\s*['"]([^'"]+)['"]\s*/g)];
const dateMatches = [...postsSection.matchAll(/publishDate:\s*['"]([^'"]+)['"]\s*/g)];

const posts = slugMatches.map((m, i) => ({
  slug: m[1],
  date: dateMatches[i]?.[1] || TODAY,
}));

const servicesFile = fs.readFileSync(
  path.join(__dirname, '../src/data/services.js'),
  'utf8'
);
const serviceSlugs = [...servicesFile.matchAll(/(?<!\w)slug:\s*['"]([^'"]+)['"]\s*/g)].map(m => m[1]);

const statesFile = fs.readFileSync(
  path.join(__dirname, '../src/data/statePricing.js'),
  'utf8'
);
const stateSlugs = [...statesFile.matchAll(/(?<!\w)slug:\s*['"]([^'"]+)['"]\s*/g)].map(m => m[1]);

// City slugs are computed at runtime (`${slugify(name)}-${stateCode}`), not a
// literal string in the source, so the regex scan above can't find them --
// evaluate cityPricing.js (with its statePricing.js import stripped and the
// needed functions injected) to get the real computed slugs.
const statesModForCities = (() => {
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    statesFile
      .replace(/^export const /gm, 'const ')
      .replace(/^export function /gm, 'function ')
      .replace(/^export \{[^}]*\};\s*$/gm, '')
      + '\nreturn { getStateBySlug, estimateForState };'
  );
  return fn();
})();
const cityFile = fs.readFileSync(
  path.join(__dirname, '../src/data/cityPricing.js'),
  'utf8'
);
const citySlugs = (() => {
  const src = cityFile
    .replace(/^import[^\n]*\n/gm, '')
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ');
  // eslint-disable-next-line no-new-func
  const fn = new Function('getStateBySlug', 'estimateForState', src + '\nreturn { getAllCities };');
  return fn(statesModForCities.getStateBySlug, statesModForCities.estimateForState)
    .getAllCities().map(c => c.slug);
})();

const staticPages = [
  { path: '/',                 priority: '1.0', changefreq: 'weekly',  lastmod: TODAY },
  { path: '/for-installers',   priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { path: '/blog',             priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { path: '/partner-with-us',  priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/how-we-calculate-solar-costs', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/about',            priority: '0.6', changefreq: 'monthly', lastmod: '2026-03-01' },
  { path: '/contact',          priority: '0.5', changefreq: 'monthly', lastmod: '2026-03-01' },
  { path: '/privacy-policy',   priority: '0.3', changefreq: 'yearly',  lastmod: '2026-01-01' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly',  lastmod: '2026-01-01' },
];

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '',
  '  <!-- Core & company pages -->',
  ...staticPages.map(p =>
    urlEntry({ loc: `${SITE_URL}${p.path}`, lastmod: p.lastmod, changefreq: p.changefreq, priority: p.priority })
  ),
  '',
  '  <!-- Blog posts (auto-generated from blogPosts.js) -->',
  ...posts.map(p =>
    urlEntry({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: p.date, changefreq: 'monthly', priority: '0.8' })
  ),
  '',
  '  <!-- Blog category pages -->',
  ...categorySlugs.map(slug =>
    urlEntry({ loc: `${SITE_URL}/blog/category/${slug}`, lastmod: TODAY, changefreq: 'weekly', priority: '0.7' })
  ),
  '',
  '  <!-- Solar cost topics (auto-generated from services.js) -->',
  ...serviceSlugs.map(slug =>
    urlEntry({ loc: `${SITE_URL}/solar-panels/${slug}`, lastmod: TODAY, changefreq: 'monthly', priority: '0.9' })
  ),
  '',
  '  <!-- Solar cost by state (auto-generated from statePricing.js) -->',
  ...stateSlugs.map(slug =>
    urlEntry({ loc: `${SITE_URL}/solar-cost/${slug}`, lastmod: TODAY, changefreq: 'monthly', priority: '0.8' })
  ),
  '',
  '  <!-- Solar cost by city (auto-generated from cityPricing.js) -->',
  ...citySlugs.map(slug =>
    urlEntry({ loc: `${SITE_URL}/solar-cost/city/${slug}`, lastmod: TODAY, changefreq: 'monthly', priority: '0.7' })
  ),
  '',
  '</urlset>',
].join('\n') + '\n';

const outPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`✓ sitemap.xml — ${posts.length} posts, ${categorySlugs.length} categories, ${serviceSlugs.length} topics, ${stateSlugs.length} states, ${citySlugs.length} cities`);
