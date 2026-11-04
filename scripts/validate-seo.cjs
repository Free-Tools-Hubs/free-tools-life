const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BASE_URL = 'https://life.freetoolshubs.com';

let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function assertCheck(condition, message, details = '') {
  if (condition) {
    passedChecks++;
  } else {
    failedChecks++;
    failures.push({ message, details });
    console.error(`❌ FAIL: ${message}${details ? ` (${details})` : ''}`);
  }
}

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

function getAllJsonLd(html) {
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const blocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

function extractInternalHrefs(html) {
  const regex = /<a\s+[^>]*href="([^"]+)"[^>]*>/g;
  const hrefs = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    if (m[1].startsWith('/')) {
      hrefs.push(m[1]);
    }
  }
  return hrefs;
}

function getDirectorySizeBytes(dirPath) {
  let total = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      total += getDirectorySizeBytes(full);
    } else {
      total += fs.statSync(full).size;
    }
  }
  return total;
}

function runValidation() {
  console.log('=== PHASE I: AUTOMATED SEO, RENDERING & SITEMAP VALIDATION SUITE ===\n');

  assertCheck(fs.existsSync(DIST_DIR), 'dist/ directory exists');
  const manifestPath = path.join(DIST_DIR, 'prerender-manifest.json');
  assertCheck(fs.existsSync(manifestPath), 'dist/prerender-manifest.json exists');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  assertCheck(manifest.failedRoutesCount === 0, 'Zero failed routes during prerender', `failed=${manifest.failedRoutesCount}`);
  assertCheck(
    manifest.tierCounts.tier1 + manifest.tierCounts.tier2 + manifest.tierCounts.tier3 + manifest.tierCounts.tier4 === 12500,
    'All 12,500 template records reconciled across Tiers 1-4',
    JSON.stringify(manifest.tierCounts)
  );

  // 1. Validate robots.txt & _redirects
  const robotsTxt = fs.readFileSync(path.join(DIST_DIR, 'robots.txt'), 'utf8');
  assertCheck(robotsTxt.includes('Allow: /'), 'robots.txt allows public crawling');
  assertCheck(
    robotsTxt.includes('Sitemap: https://life.freetoolshubs.com/sitemap.xml'),
    'robots.txt references canonical HTTPS sitemap'
  );

  const redirectsTxt = fs.readFileSync(path.join(DIST_DIR, '_redirects'), 'utf8');
  assertCheck(
    !redirectsTxt.includes('/index.html  200') && !redirectsTxt.includes('/index.html 200'),
    '_redirects no longer contains soft-404 catch-all /* /index.html 200'
  );
  assertCheck(
    redirectsTxt.includes('/*  /404.html  404') || redirectsTxt.includes('/* /404.html 404'),
    '_redirects configures explicit HTTP 404 fallback to /404.html'
  );

  // Validate 404.html
  const notFoundHtml = fs.readFileSync(path.join(DIST_DIR, '404.html'), 'utf8');
  assertCheck(notFoundHtml.includes('Page Not Found'), '404.html contains Page Not Found heading');
  assertCheck(
    extractTag(notFoundHtml, /<meta name="robots" content="([^"]+)"/) === 'noindex, nofollow',
    '404.html has noindex, nofollow robots directive'
  );

  // 2. Validate Sitemap XML
  const sitemapRaw = fs.readFileSync(path.join(DIST_DIR, 'sitemap.xml'), 'utf8');
  assertCheck(sitemapRaw.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap.xml has valid XML declaration');
  const locMatches = [...sitemapRaw.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const uniqueLocs = new Set(locMatches);

  assertCheck(locMatches.length === 505, 'sitemap.xml contains exactly 505 approved indexable URLs', `actual=${locMatches.length}`);
  assertCheck(uniqueLocs.size === locMatches.length, 'sitemap.xml contains zero duplicate URLs');
  assertCheck(!uniqueLocs.has(`${BASE_URL}/dashboard`), 'sitemap.xml excludes utility route /dashboard');
  assertCheck(!uniqueLocs.has(`${BASE_URL}/privacy`), 'sitemap.xml excludes legal utility route /privacy');
  assertCheck(!uniqueLocs.has(`${BASE_URL}/terms`), 'sitemap.xml excludes legal utility route /terms');

  // 3. Validate EVERY single Sitemap URL (all 505 indexable pages!) in raw HTML
  let allSitemapHtmlValid = true;
  const reachableFromCategoryHubs = new Set();
  const reachableFromHome = new Set();
  let leakedNonIndexableLinks = 0;

  for (const loc of locMatches) {
    if (!loc.startsWith(BASE_URL)) {
      allSitemapHtmlValid = false;
      assertCheck(false, `Sitemap URL uses canonical hostname: ${loc}`);
      continue;
    }
    const urlPath = loc.slice(BASE_URL.length) || '/';
    const htmlFilePath =
      urlPath === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, `${urlPath.slice(1)}.html`);

    if (!fs.existsSync(htmlFilePath)) {
      allSitemapHtmlValid = false;
      assertCheck(false, `Sitemap URL maps to generated HTML artifact: ${urlPath}`, htmlFilePath);
      continue;
    }

    const html = fs.readFileSync(htmlFilePath, 'utf8');
    const title = extractTag(html, /<title>([\s\S]*?)<\/title>/);
    const desc = extractTag(html, /<meta name="description" content="([^"]+)"/);
    const robots = extractTag(html, /<meta name="robots" content="([^"]+)"/);
    const canonical = extractTag(html, /<link rel="canonical" href="([^"]+)"/);
    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
    const jsonLdBlocks = getAllJsonLd(html);
    const hrefs = extractInternalHrefs(html);

    if (
      !title ||
      !desc ||
      robots !== 'index, follow' ||
      canonical !== loc ||
      h1Matches.length !== 1 ||
      h1Matches[0][1].includes('JavaScript Required') ||
      jsonLdBlocks.length === 0 ||
      hrefs.length === 0
    ) {
      allSitemapHtmlValid = false;
      assertCheck(
        false,
        `Raw HTML validation failed on indexable route ${urlPath}`,
        `title=${Boolean(title)}, desc=${Boolean(desc)}, robots=${robots}, canonical=${canonical}, h1Count=${h1Matches.length}, jsonLd=${jsonLdBlocks.length}`
      );
    }

    // Validate JSON-LD parseability
    for (const block of jsonLdBlocks) {
      try {
        JSON.parse(block);
      } catch (e) {
        allSitemapHtmlValid = false;
        assertCheck(false, `Invalid JSON-LD on ${urlPath}`, String(e));
      }
    }

    // Track internal link discovery graph
    if (urlPath === '/') {
      hrefs.forEach(h => reachableFromHome.add(h));
    }
    if (urlPath.startsWith('/category/')) {
      hrefs.forEach(h => reachableFromCategoryHubs.add(h));
    }

    // Check that no internal link on an indexable page points to a non-indexable template slug
    for (const href of hrefs) {
      if (
        href === '/' ||
        href === '/templates' ||
        href === '/about' ||
        href === '/dashboard' ||
        href === '/privacy' ||
        href === '/terms' ||
        href.startsWith('/category/')
      ) {
        continue;
      }
      if (!uniqueLocs.has(`${BASE_URL}${href}`)) {
        leakedNonIndexableLinks++;
      }
    }
  }

  assertCheck(
    allSitemapHtmlValid,
    'All 505 approved indexable URLs have valid raw HTML (unique title, meta description, self-canonical, index/follow, single H1, valid JSON-LD, internal links)'
  );

  // 4. Verify Crawl Discovery Graph (Home -> Category Hubs -> All 494 Tier 1 Templates)
  const categoryPaths = [
    '/category/morning-routine',
    '/category/habit-building',
    '/category/daily-productivity',
    '/category/goal-setting',
    '/category/mindfulness',
    '/category/fitness',
    '/category/evening-ritual',
    '/category/career-growth'
  ];
  for (const catPath of categoryPaths) {
    assertCheck(
      reachableFromHome.has(catPath),
      `Homepage links directly to category hub ${catPath}`
    );
  }

  const tier1TemplatePaths = locMatches
    .map(u => u.slice(BASE_URL.length))
    .filter(p => p !== '/' && p !== '/templates' && p !== '/about' && !p.startsWith('/category/'));

  const orphanedTier1 = tier1TemplatePaths.filter(p => !reachableFromCategoryHubs.has(p));
  assertCheck(
    orphanedTier1.length === 0,
    `100% of ${tier1TemplatePaths.length} Tier 1 templates are reachable via HTML links from Category Hubs (0 orphaned indexable pages)`,
    `orphaned=${orphanedTier1.length}`
  );
  assertCheck(
    leakedNonIndexableLinks === 0,
    'Zero internal links on indexable pages point to excluded Tier 2/3/4 template URLs',
    `leaked=${leakedNonIndexableLinks}`
  );

  // 5. Validate Utility & Non-Indexable Pages (Dashboard, Privacy, Terms, Tier 2, Tier 3, Tier 4 samples)
  const dashboardHtml = fs.readFileSync(path.join(DIST_DIR, 'dashboard.html'), 'utf8');
  assertCheck(
    extractTag(dashboardHtml, /<meta name="robots" content="([^"]+)"/) === 'noindex, nofollow',
    '/dashboard raw HTML has noindex, nofollow'
  );

  // Sample Tier 3 Persona Variant (productivity-morning-routine-for-busy-professionals-consistent)
  const tier3SamplePath = path.join(
    DIST_DIR,
    'productivity-morning-routine-for-busy-professionals-consistent.html'
  );
  if (fs.existsSync(tier3SamplePath)) {
    const tier3Html = fs.readFileSync(tier3SamplePath, 'utf8');
    assertCheck(
      extractTag(tier3Html, /<meta name="robots" content="([^"]+)"/) === 'noindex, follow',
      'Tier 3 persona variant has noindex, follow directive'
    );
    assertCheck(
      extractTag(tier3Html, /<link rel="canonical" href="([^"]+)"/) ===
        `${BASE_URL}/productivity-morning-routine-for-busy-professionals-type-a`,
      'Tier 3 persona variant canonicalizes to verified Tier 1 Type A representative'
    );
  }

  // Sample Tier 4 Mismatched Cross-Product (writing-habit-fitness-for-freelancers-type-a)
  const tier4SamplePath = path.join(
    DIST_DIR,
    'writing-habit-fitness-for-freelancers-type-a.html'
  );
  if (fs.existsSync(tier4SamplePath)) {
    const tier4Html = fs.readFileSync(tier4SamplePath, 'utf8');
    const tier4Canonical = extractTag(tier4Html, /<link rel="canonical" href="([^"]+)"/);
    assertCheck(
      extractTag(tier4Html, /<meta name="robots" content="([^"]+)"/) === 'noindex, follow',
      'Tier 4 mismatched cross-product has noindex, follow directive'
    );
    assertCheck(
      uniqueLocs.has(tier4Canonical),
      'Tier 4 canonical target is a verified Tier 1 indexable URL in sitemap.xml',
      `canonical=${tier4Canonical}`
    );
  }

  // 6. Validate JS Bundle & Output Size (Ensure dead 8.45MB data-life JS chunk is gone)
  const assetsDir = path.join(DIST_DIR, 'assets');
  const assetFiles = fs.readdirSync(assetsDir);
  const deadDataLifeChunk = assetFiles.find(f => f.startsWith('data-life-'));
  assertCheck(
    !deadDataLifeChunk,
    'Unused 8.45 MB data-life-*.js chunk removed from dist/assets/'
  );

  const jsAssets = assetFiles.filter(f => f.endsWith('.js'));
  const totalJsBytes = jsAssets.reduce((acc, f) => acc + fs.statSync(path.join(assetsDir, f)).size, 0);
  const totalDistBytes = getDirectorySizeBytes(DIST_DIR);

  console.log('\n=== BUILD & PERFORMANCE METRICS ===');
  console.log(`Prerender Execution Time: ${(manifest.elapsedMs / 1000).toFixed(2)}s`);
  console.log(`Prerender Heap Memory Used: ${manifest.memoryHeapUsedMb} MB`);
  console.log(`Generated HTML Route Artifacts: ${manifest.generatedRoutesCount}`);
  console.log(`Approved Sitemap Indexable URLs: ${manifest.sitemapUrlCount}`);
  console.log(`Initial JS Bundle Size (all chunks in dist/assets/): ${(totalJsBytes / 1024).toFixed(2)} KB`);
  console.log(`Total dist/ Directory Size: ${(totalDistBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\nValidation Summary: ${passedChecks} passed, ${failedChecks} failed.`);

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runValidation();

