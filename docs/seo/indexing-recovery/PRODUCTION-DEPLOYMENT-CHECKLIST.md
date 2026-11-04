# Phase 11 — Production Deployment & GSC Verification Checklist

**Project:** LifeHub (`https://life.freetoolshubs.com`)  
**Hosting Stack:** Netlify Static Hosting (`dist/`) + Cloudflare DNS/CDN  

> [!IMPORTANT]
> Per project safety rules, **nothing has been deployed, committed, or pushed automatically**, and no production DNS or Cloudflare settings have been modified. Follow this checklist sequentially when deploying to production.

---

## 1. Pre-Deployment Build & Verification (Local / CI)

1. Run the full build, static prerender, and sitemap generator:
   ```bash
   npm run build
   ```
2. Run the automated SEO, HTML, canonical, crawl-graph, and sitemap validator:
   ```bash
   npm run validate-seo
   ```
   Confirm `0 failed` checks and verify `dist/prerender-manifest.json` reports:
   - `sitemapUrlCount: 505`
   - `failedRoutesCount: 0`
3. Verify Netlify build settings in the Netlify Dashboard (`Site configuration > Build & deploy`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node.js version:** `18.x` or `20.x`

---

## 2. Post-Deployment Live HTTP & Raw HTML Verification

Immediately after Netlify finishes deploying `dist/`, run the following checks using `curl -i` (not browser DevTools Elements panel, so you inspect raw pre-JS HTTP responses):

1. **Homepage Raw HTML (`/`):**
   ```bash
   curl -i -s https://life.freetoolshubs.com/ | head -n 45
   ```
   - Verify HTTP status is `200`.
   - Verify `<link rel="canonical" href="https://life.freetoolshubs.com/" />`.
   - Verify `<meta name="robots" content="index, follow" />`.
   - Verify `<h1>Transform Your Life, One Simple Tool at a Time.</h1>` is present in raw HTML.

2. **Representative Tier 1 Template Pages (`/:slug`):**
   ```bash
   curl -i -s https://life.freetoolshubs.com/productivity-morning-routine-for-busy-professionals-type-a | head -n 45
   curl -i -s https://life.freetoolshubs.com/deep-work-daily-productivity-for-remote-workers-type-a | head -n 45
   curl -i -s https://life.freetoolshubs.com/sleep-quality-evening-ritual-for-night-owls-type-a | head -n 45
   ```
   - Verify HTTP status is `200`.
   - Verify page-specific `<title>`, `<meta name="description">`, self-referencing `<link rel="canonical">`, `<meta name="robots" content="index, follow" />`, `<h1>`, structured routine phases, and `<script type="application/ld+json">` exist in raw HTML.

3. **Category Hub Pages (`/category/:slug`):**
   ```bash
   curl -i -s https://life.freetoolshubs.com/category/morning-routine | head -n 45
   ```
   - Verify HTTP status is `200`, `index, follow`, self-canonical, and crawlable `<a href="/...">` links to Tier 1 templates.

4. **Consolidated Tier 3 Persona Variant (`/:slug`):**
   ```bash
   curl -i -s https://life.freetoolshubs.com/productivity-morning-routine-for-busy-professionals-consistent | head -n 45
   ```
   - Verify HTTP status is `200`.
   - Verify `<meta name="robots" content="noindex, follow" />`.
   - Verify `<link rel="canonical" href="https://life.freetoolshubs.com/productivity-morning-routine-for-busy-professionals-type-a" />`.

5. **Utility Route (`/dashboard`):**
   ```bash
   curl -i -s https://life.freetoolshubs.com/dashboard | head -n 45
   ```
   - Verify `<meta name="robots" content="noindex, nofollow" />`.

6. **Invalid Routes (Verify Real HTTP 404 — No Soft 404):**
   ```bash
   curl -I https://life.freetoolshubs.com/this-slug-does-not-exist-99999
   curl -I https://life.freetoolshubs.com/invalid/nested/route
   ```
   - **Must return `HTTP/2 404`** (not `200 OK`).

7. **Sitemap & Robots.txt:**
   ```bash
   curl -I https://life.freetoolshubs.com/robots.txt
   curl -I https://life.freetoolshubs.com/sitemap.xml
   ```
   - Verify `200 OK`, `application/xml` on `/sitemap.xml`, and `505` `<url>` entries.

---

## 3. Cloudflare CDN & Cache Checklist

Because `life.freetoolshubs.com` sits behind Cloudflare in front of Netlify:
1. **SSL/TLS Mode:** Ensure Cloudflare SSL/TLS encryption mode is set to **Full (Strict)** to prevent redirect loops with Netlify’s HTTPS enforcement.
2. **Caching Level & HTML Caching:**
   - Do **not** configure a Cloudflare "Cache Everything" Page Rule on `/*` without respecting origin `Cache-Control` headers, as caching old SPA HTML at the edge would serve stale shells or mask 404 status codes.
   - Set Cloudflare Browser Cache TTL to **Respect Existing Headers** so `public/_headers` (`/*.html` → `max-age=0, must-revalidate`; `/assets/*` → `max-age=31536000, immutable`) controls caching accurately.
3. **Post-Deploy Cache Purge:**
   - After deploying to Netlify, run **Purge Everything** once in the Cloudflare Dashboard (`Caching > Configuration > Purge Everything`) so Cloudflare immediately drops any cached HTTP 200 soft-404 responses or stale `/sitemap.xml` copies.
4. **Verify `cf-cache-status` Header:**
   - Confirm that requests to `/nonexistent-url-test` return `HTTP/2 404` through Cloudflare.

---

## 4. Google Search Console (GSC) Recovery & Monitoring Plan

> [!WARNING]
> Do **not** use automated indexing APIs or bulk third-party ping tools to submit all URLs. Follow Google’s standard Sitemap and URL Inspection workflows below.

### Step 1: Baseline Snapshot (Before Submitting Updated Sitemap)
Export and archive from GSC:
- `Indexing > Pages`: Full CSV export of "Not indexed" reasons (`Crawled - currently not indexed`, `Discovered - currently not indexed`, `Soft 404`, `Duplicate without user-selected canonical`) and sample URLs.
- `Settings > Crawl stats`: 90-day crawl request volume, response code breakdown, and average response time.

### Step 2: Resubmit `sitemap.xml`
- In GSC (`Indexing > Sitemaps`), submit `https://life.freetoolshubs.com/sitemap.xml`.
- Confirm status updates to **Success** and "Discovered pages" reflects **`505`** URLs (down from `12,506`).

### Step 3: Live URL Inspection & Priority Indexing Requests (10–12 URLs Over Days 1–3)
Use the GSC **URL Inspection > Test Live URL** tool and click **Request Indexing** for the following priority entry points first (they contain direct HTML links to all 494 Tier 1 templates):
1. `https://life.freetoolshubs.com/` (Homepage)
2. `https://life.freetoolshubs.com/templates` (Main Directory)
3. `https://life.freetoolshubs.com/about`
4. All 8 Category Hub URLs:
   - `https://life.freetoolshubs.com/category/morning-routine`
   - `https://life.freetoolshubs.com/category/habit-building`
   - `https://life.freetoolshubs.com/category/daily-productivity`
   - `https://life.freetoolshubs.com/category/goal-setting`
   - `https://life.freetoolshubs.com/category/mindfulness`
   - `https://life.freetoolshubs.com/category/fitness`
   - `https://life.freetoolshubs.com/category/evening-ritual`
   - `https://life.freetoolshubs.com/category/career-growth`
5. In the Live Test results for each inspected URL, verify:
   - **Page fetch:** Successful (`HTTP 200`)
   - **Indexing allowed?** Yes (`index, follow`)
   - **User-declared canonical:** Matches the inspected URL
   - **View Tested Page > HTML:** Contains the full prerendered `<h1>`, body text, and `<a href>` links without relying on async JSON fetches.

### Step 4: Weekly Monitoring Cadence (Weeks 1–8)
- **Sitemap Coverage Filter:** In `Indexing > Pages`, switch the top filter from `All known pages` to **`All submitted pages`** (which isolates the `505` canonical URLs in `sitemap.xml`).
- **Expected Trajectory:**
  - *All known pages* will show an increase in `Excluded by 'noindex' tag` and `Alternate page with proper canonical tag` as Googlebot recrawls historical Tier 2/3/4 URLs—**this is healthy and expected**.
  - *All submitted pages* (`505` URLs) should show steady movement from `Discovered / Crawled - currently not indexed` into **Indexed**, starting with `/`, `/templates`, the 8 `/category/*` hubs, and Tier 1 templates.

