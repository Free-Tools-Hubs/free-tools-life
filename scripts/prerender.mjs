import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SSR_ENTRY = path.join(ROOT_DIR, 'dist-ssr', 'entry-server.js');
const PUBLIC_TEMPLATES_PATH = path.join(ROOT_DIR, 'public', 'lifeTemplates.json');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function injectPageMetadataAndBody(baseHtml, {
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogType = 'website',
  ogImage = 'https://life.freetoolshubs.com/og-image.png',
  bodyHtml,
  initialPayload
}) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeRobots = escapeHtml(robots);
  const safeOgImage = escapeHtml(ogImage);
  const resolvedUrl = canonical ? escapeHtml(canonical) : 'https://life.freetoolshubs.com/';

  let html = baseHtml;

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${safeDesc}" />`
  );

  // Replace meta robots
  html = html.replace(
    /<meta name="robots"[\s\S]*?\/>/,
    `<meta name="robots" content="${safeRobots}" />`
  );

  // Replace or remove canonical link
  if (canonical) {
    html = html.replace(
      /<link rel="canonical"[\s\S]*?\/>/,
      `<link rel="canonical" href="${resolvedUrl}" />`
    );
  } else {
    html = html.replace(/<link rel="canonical"[\s\S]*?\/>\s*/, '');
  }

  // Replace Open Graph tags
  html = html.replace(/<meta property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="${escapeHtml(ogType)}" />`);
  html = html.replace(/<meta property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${resolvedUrl}" />`);
  html = html.replace(/<meta property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${safeTitle}" />`);
  html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${safeDesc}" />`);
  html = html.replace(/<meta property="og:image"[\s\S]*?\/>/, `<meta property="og:image" content="${safeOgImage}" />`);

  // Replace Twitter tags
  html = html.replace(/<meta property="twitter:url"[\s\S]*?\/>/, `<meta property="twitter:url" content="${resolvedUrl}" />`);
  html = html.replace(/<meta property="twitter:title"[\s\S]*?\/>/, `<meta property="twitter:title" content="${safeTitle}" />`);
  html = html.replace(/<meta property="twitter:description"[\s\S]*?\/>/, `<meta property="twitter:description" content="${safeDesc}" />`);
  html = html.replace(/<meta property="twitter:image"[\s\S]*?\/>/, `<meta property="twitter:image" content="${safeOgImage}" />`);

  // Clean placeholder comments
  html = html.replace('<!--PRERENDER_HEAD-->', '');
  html = html.replace('<!--PRERENDER_HTML-->', bodyHtml);

  if (initialPayload) {
    const jsonStr = JSON.stringify(initialPayload).replace(/</g, '\\u003c');
    html = html.replace(
      '<!--PRERENDER_DATA-->',
      `<script id="__INITIAL_DATA__" type="application/json">${jsonStr}</script>`
    );
  } else {
    html = html.replace('<!--PRERENDER_DATA-->', '');
  }

  return html;
}

function buildFastTemplateBodyHtml(template, classification, content, categorySlug, relatedList, BASE_URL) {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: template.title,
    description: content.purposeSummary,
    url: classification.canonicalUrl,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${BASE_URL}/templates` },
      { '@type': 'ListItem', position: 3, name: template.category, item: `${BASE_URL}/category/${categorySlug}` },
      { '@type': 'ListItem', position: 4, name: template.title, item: classification.canonicalUrl }
    ]
  };

  const seenHabits = new Set();
  const combinedHabits = [];
  for (const rec of content.domainRecommendedHabits) {
    if (!seenHabits.has(rec.name)) {
      seenHabits.add(rec.name);
      combinedHabits.push(rec.name);
    }
  }
  for (const h of template.baseHabits) {
    if (!seenHabits.has(h)) {
      seenHabits.add(h);
      combinedHabits.push(h);
    }
  }

  const noticeHtml =
    classification.canonicalSlug !== template.slug
      ? `<div class="glass-card" style="margin-bottom:2rem;padding:1rem 1.5rem;border-left:4px solid var(--primary)"><strong>Persona Edition Notice:</strong> You are viewing the <strong>${escapeHtml(content.persona)}</strong> variation. <a href="/${escapeHtml(classification.canonicalSlug)}" style="color:var(--primary);font-weight:600">View Primary Unified Edition →</a></div>`
      : '';

  const stepsHtml = content.routineSteps
    .map(
      s =>
        `<div style="background:var(--bg-dark);padding:1.25rem;border-radius:0.75rem;border:1px solid var(--border)"><strong>${escapeHtml(s.phase)} (${escapeHtml(s.timing)})</strong><p>${escapeHtml(s.action)}</p><p style="color:var(--text-muted);font-size:0.88rem">${escapeHtml(s.purpose)}</p></div>`
    )
    .join('');

  const habitsHtml = combinedHabits
    .map(hName => {
      const d = content.habitDetails[hName] || {
        cue: `During your scheduled ${template.category.toLowerCase()} block`,
        rationale: `Supports daily consistency for ${content.scenario.toLowerCase()}.`,
        minimumViableVersion: `Complete a 2-minute starter version of "${hName}".`
      };
      return `<li style="padding:0.75rem 0;border-bottom:1px solid var(--border)"><strong>${escapeHtml(hName)}</strong> — <em>Trigger:</em> ${escapeHtml(d.cue)} | <em>Why:</em> ${escapeHtml(d.rationale)} | <em>2-Min Baseline:</em> ${escapeHtml(d.minimumViableVersion)}</li>`;
    })
    .join('');

  const goalsHtml = template.baseGoals.map(g => `<li>${escapeHtml(g)}</li>`).join('');
  const relatedHtml = relatedList
    .slice(0, 4)
    .map(
      r =>
        `<a href="/${escapeHtml(r.slug)}" class="glass-card" style="text-decoration:none;color:inherit;display:block"><h3>${escapeHtml(r.title.replace(' (Type A)', ''))}</h3><p style="color:var(--text-muted)">${escapeHtml(r.description)}</p></a>`
    )
    .join('');

  return `<div class="min-h-screen flex flex-col"><header class="sticky-nav"><div class="app-container" style="padding:0 2rem;margin:0 auto"><div style="display:flex;justify-content:space-between;align-items:center;height:64px"><a class="logo" href="/">LifeHub</a><nav class="desktop-nav" aria-label="Primary Navigation"><a href="/">Home</a><a href="/templates">Templates</a><a href="/category/morning-routine">Morning Routines</a><a href="/category/habit-building">Habit Building</a><a href="/dashboard">My Dashboard</a><a href="/about">About</a></nav></div></div></header><main style="flex:1"><div class="app-container"><div class="tool-page"><script type="application/ld+json">${JSON.stringify(softwareSchema)}</script><script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script><nav aria-label="Breadcrumb" style="margin-bottom:1.5rem;font-size:0.9rem"><a href="/">Home</a> / <a href="/templates">Templates</a> / <a href="/category/${escapeHtml(categorySlug)}">${escapeHtml(template.category)}</a> / <span>${escapeHtml(template.title)}</span></nav>${noticeHtml}<header class="hero-section" style="text-align:center"><h1>${escapeHtml(template.title)}</h1><p class="hero-description">${escapeHtml(content.purposeSummary)}</p></header><section class="grid" style="margin:2.5rem 0"><div class="glass-card"><h2>Template Purpose &amp; Workflow Design</h2><p>${escapeHtml(content.explanation)}</p><p><strong>Scheduling Framework (${escapeHtml(template.plannerFrameworks)}):</strong> ${escapeHtml(content.frameworkGuide)}</p></div><div class="glass-card"><h2>Intended Audience: ${escapeHtml(content.context)}</h2><p>${escapeHtml(content.audienceUseCase)}</p><p>${escapeHtml(content.habitTip)}</p></div></section><section class="glass-card" style="margin-bottom:2.5rem"><h2>Structured ${escapeHtml(template.category)} Sequence</h2><div class="grid">${stepsHtml}</div></section><section class="glass-card" style="margin-bottom:2.5rem"><h2>Included Habits &amp; Execution Guide</h2><ul>${habitsHtml}</ul></section><section class="glass-card" style="margin-bottom:2.5rem"><h2>Target Milestones</h2><ul>${goalsHtml}</ul></section><section style="margin-bottom:2.5rem"><h2>Related ${escapeHtml(template.category)} Templates</h2><div class="grid">${relatedHtml}</div></section></div></div></main></div>`;
}

async function runPrerender() {
  const startTime = Date.now();
  const includeAllTemplates = !process.argv.includes('--tier1-only');

  if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    throw new Error('dist/index.html not found. Run `vite build` before prerendering.');
  }
  if (!fs.existsSync(SSR_ENTRY)) {
    throw new Error('dist-ssr/entry-server.js not found. Run `vite build --ssr src/entry-server.tsx --outDir dist-ssr` first.');
  }

  const ssrModuleUrl = new URL(`file://${SSR_ENTRY.replace(/\\/g, '/')}`).href;
  const {
    renderRoute,
    BASE_URL,
    CATEGORIES,
    CATEGORY_BY_NAME,
    classifyTemplateRecord,
    parseTemplateTitle,
    getDeterministicContent,
    formatPageTitle
  } = await import(ssrModuleUrl);

  const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  const allTemplates = JSON.parse(fs.readFileSync(PUBLIC_TEMPLATES_PATH, 'utf8'));

  // 1. Classify all 12,500 templates
  const tierCounts = { tier1: 0, tier2: 0, tier3: 0, tier4: 0 };
  const tier1Templates = [];
  const classificationsBySlug = new Map();

  for (const t of allTemplates) {
    const c = classifyTemplateRecord(t);
    classificationsBySlug.set(t.slug, c);
    tierCounts[c.tier] = (tierCounts[c.tier] || 0) + 1;
    if (c.tier === 'tier1') {
      tier1Templates.push(t);
    }
  }

  // Write public/tier1Templates.json and dist/tier1Templates.json
  const tier1Json = JSON.stringify(tier1Templates);
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'tier1Templates.json'), tier1Json, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'tier1Templates.json'), tier1Json, 'utf8');

  // Pre-group Tier 1 templates by category for fast lookup
  const tier1ByCategory = new Map();
  for (const cat of CATEGORIES) {
    tier1ByCategory.set(
      cat.name,
      tier1Templates.filter(t => t.category === cat.name)
    );
  }

  let generatedRoutesCount = 0;
  let totalHtmlBytes = 0;
  const failedRoutes = [];

  function writeHtmlArtifact(relPath, htmlContent, alsoWriteDirIndex = false) {
    const targetPath = path.join(DIST_DIR, relPath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, htmlContent, 'utf8');
    totalHtmlBytes += Buffer.byteLength(htmlContent, 'utf8');
    generatedRoutesCount++;

    if (alsoWriteDirIndex && relPath.endsWith('.html') && !relPath.endsWith('index.html')) {
      const dirIndexPath = path.join(DIST_DIR, relPath.slice(0, -5), 'index.html');
      fs.mkdirSync(path.dirname(dirIndexPath), { recursive: true });
      fs.writeFileSync(dirIndexPath, htmlContent, 'utf8');
      totalHtmlBytes += Buffer.byteLength(htmlContent, 'utf8');
    }
  }

  // 2. Render Core Static & Utility Pages via React SSR
  const staticPages = [
    {
      url: '/',
      outFile: 'index.html',
      alsoDir: false,
      title: formatPageTitle('LifeHub — Free Offline Habit Trackers, Morning Routines & Daily Planners'),
      description: 'Build durable habits and structure your day with free, 100% private, offline-first templates for morning routines, deep work, fitness, mindfulness, and evening rituals.',
      canonical: `${BASE_URL}/`,
      robots: 'index, follow',
      payload: {
        routeType: 'home',
        templates: CATEGORIES.map(c => (tier1ByCategory.get(c.name) || [])[0]).filter(Boolean)
      }
    },
    {
      url: '/templates',
      outFile: 'templates.html',
      alsoDir: true,
      title: formatPageTitle('Browse All Habit & Routine Templates'),
      description: 'Explore structured, private habit trackers, morning routines, deep work planners, fitness schedules, and evening rituals across eight core categories.',
      canonical: `${BASE_URL}/templates`,
      robots: 'index, follow',
      payload: {
        routeType: 'templates-dir',
        templates: tier1Templates.slice(0, 64)
      }
    },
    {
      url: '/about',
      outFile: 'about.html',
      alsoDir: true,
      title: formatPageTitle('About LifeHub — Private, Offline-First Habit & Routine Tools'),
      description: 'Learn how LifeHub helps you build sustainable habits, morning routines, and daily productivity systems with 100% local browser privacy and zero account tracking.',
      canonical: `${BASE_URL}/about`,
      robots: 'index, follow',
      payload: { routeType: 'other' }
    },
    {
      url: '/dashboard',
      outFile: 'dashboard.html',
      alsoDir: true,
      title: formatPageTitle('My Personal Habit & Goal Dashboard'),
      description: 'Track your daily habits, streaks, time-blocked schedule, and active milestone goals locally in your browser.',
      canonical: `${BASE_URL}/dashboard`,
      robots: 'noindex, nofollow',
      payload: { routeType: 'other' }
    },
    {
      url: '/privacy',
      outFile: 'privacy.html',
      alsoDir: true,
      title: formatPageTitle('Privacy Policy'),
      description: 'LifeHub Privacy Policy: Learn how your habit and goal data remains stored locally on your device in LocalStorage and IndexedDB.',
      canonical: `${BASE_URL}/privacy`,
      robots: 'noindex, follow',
      payload: { routeType: 'other' }
    },
    {
      url: '/terms',
      outFile: 'terms.html',
      alsoDir: true,
      title: formatPageTitle('Terms of Service'),
      description: "Terms of Service for using LifeHub's offline-first habit trackers, daily planners, and routine templates.",
      canonical: `${BASE_URL}/terms`,
      robots: 'noindex, follow',
      payload: { routeType: 'other' }
    },
    {
      url: '/404-not-found-page',
      outFile: '404.html',
      alsoDir: false,
      title: formatPageTitle('404 - Page Not Found'),
      description: 'The page or template you requested could not be found on LifeHub.',
      canonical: undefined,
      robots: 'noindex, nofollow',
      payload: { routeType: 'other' }
    }
  ];

  for (const page of staticPages) {
    try {
      const bodyHtml = renderRoute(page.url, page.payload);
      const fullHtml = injectPageMetadataAndBody(baseHtml, {
        title: page.title,
        description: page.description,
        canonical: page.canonical,
        robots: page.robots,
        bodyHtml,
        initialPayload: page.payload
      });
      writeHtmlArtifact(page.outFile, fullHtml, page.alsoDir);
    } catch (err) {
      failedRoutes.push({ url: page.url, error: String(err) });
    }
  }

  // 3. Render all 8 Category Hub Pages via React SSR
  for (const cat of CATEGORIES) {
    const url = `/category/${cat.slug}`;
    const catTemplates = tier1ByCategory.get(cat.name) || [];
    const payload = {
      routeType: 'category',
      templates: catTemplates
    };
    try {
      const bodyHtml = renderRoute(url, payload);
      const fullHtml = injectPageMetadataAndBody(baseHtml, {
        title: formatPageTitle(`${cat.shortTitle} Templates & Habit Trackers`),
        description: cat.metaDescription,
        canonical: `${BASE_URL}${url}`,
        robots: 'index, follow',
        bodyHtml,
        initialPayload: payload
      });
      writeHtmlArtifact(`category/${cat.slug}.html`, fullHtml, true);
    } catch (err) {
      failedRoutes.push({ url, error: String(err) });
    }
  }

  // 4. Render all 494 Tier 1 Strong Indexable Template Pages via full React SSR
  for (const t of tier1Templates) {
    const url = `/${t.slug}`;
    const classification = classificationsBySlug.get(t.slug);
    const content = getDeterministicContent(t.slug, t);
    const sameCat = (tier1ByCategory.get(t.category) || [])
      .filter(other => other.slug !== t.slug)
      .slice(0, 6);
    const sameAud = tier1Templates
      .filter(
        other =>
          other.category !== t.category &&
          parseTemplateTitle(other.title, other.category).context === classification.attributes.context
      )
      .slice(0, 4);

    const payload = {
      routeType: 'template',
      currentTemplate: t,
      relatedTemplates: [...sameCat, ...sameAud]
    };

    try {
      const bodyHtml = renderRoute(url, payload);
      const fullHtml = injectPageMetadataAndBody(baseHtml, {
        title: formatPageTitle(t.title),
        description: `${t.description} Includes a structured 3-phase ${t.category.toLowerCase()} workflow, customizable habits, and offline streak tracking for ${content.context.toLowerCase()}.`,
        canonical: classification.canonicalUrl,
        robots: classification.robotsDirective,
        bodyHtml,
        initialPayload: payload
      });
      writeHtmlArtifact(`${t.slug}.html`, fullHtml, true);
    } catch (err) {
      failedRoutes.push({ url, error: String(err) });
    }
  }

  // 5. Render remaining non-indexable (Tier 2, Tier 3, Tier 4) template routes so existing URLs return HTTP 200 with explicit noindex + canonical consolidation
  if (includeAllTemplates) {
    for (const t of allTemplates) {
      const classification = classificationsBySlug.get(t.slug);
      if (classification.tier === 'tier1') continue; // Already rendered via full React SSR

      const content = getDeterministicContent(t.slug, t);
      const catMeta = CATEGORY_BY_NAME[t.category];
      const categorySlug = catMeta ? catMeta.slug : 'habit-building';
      const relatedList = (tier1ByCategory.get(t.category) || []).slice(0, 4);

      const payload = {
        routeType: 'template',
        currentTemplate: t,
        relatedTemplates: relatedList
      };

      const bodyHtml = buildFastTemplateBodyHtml(
        t,
        classification,
        content,
        categorySlug,
        relatedList,
        BASE_URL
      );

      const fullHtml = injectPageMetadataAndBody(baseHtml, {
        title: formatPageTitle(t.title),
        description: `${t.description} Includes a structured 3-phase ${t.category.toLowerCase()} workflow, customizable habits, and offline streak tracking for ${content.context.toLowerCase()}.`,
        canonical: classification.canonicalUrl,
        robots: classification.robotsDirective,
        bodyHtml,
        initialPayload: payload
      });
      writeHtmlArtifact(`${t.slug}.html`, fullHtml, false);
    }
  }

  // 6. Generate authoritative sitemap.xml containing strictly canonical, indexable URLs (505 total)
  const sitemapUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/templates`,
    `${BASE_URL}/about`,
    ...CATEGORIES.map(c => `${BASE_URL}/category/${c.slug}`),
    ...tier1Templates.map(t => `${BASE_URL}/${t.slug}`)
  ];

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls.map(loc => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`),
    '</urlset>',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  // Clean up temporary dist-ssr folder
  fs.rmSync(path.join(ROOT_DIR, 'dist-ssr'), { recursive: true, force: true });

  const elapsedMs = Date.now() - startTime;
  const memUsageMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;

  const manifest = {
    generatedAt: new Date().toISOString(),
    elapsedMs,
    memoryHeapUsedMb: memUsageMb,
    totalTemplateRecords: allTemplates.length,
    tierCounts,
    sitemapUrlCount: sitemapUrls.length,
    generatedRoutesCount,
    totalHtmlSizeMb: Math.round((totalHtmlBytes / 1024 / 1024) * 100) / 100,
    failedRoutesCount: failedRoutes.length,
    failedRoutes
  };

  fs.writeFileSync(path.join(DIST_DIR, 'prerender-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('=== PRERENDER & SITEMAP SUMMARY ===');
  console.log(JSON.stringify(manifest, null, 2));

  if (failedRoutes.length > 0) {
    process.exit(1);
  }
}

runPrerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});

