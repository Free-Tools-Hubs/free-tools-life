# Phase C & D — Rendering Architecture & Hosting Remediation

**Project:** LifeHub (`https://life.freetoolshubs.com`)  
**Architecture:** Vite + React 18 + React Router v6 + Build-Time Static Prerendering (`scripts/prerender.mjs`)  
**Target Hosting:** Netlify Static Deployment (`dist/`) behind Cloudflare DNS/CDN  

---

## 1. Evaluation of Rendering Implementation Options (Phase C1)

Three approaches were evaluated to replace the empty client-side shell (`<div id="root"></div>`):

| Approach | Description | Pros | Cons | Decision |
| :--- | :--- | :--- | :--- | :--- |
| **Option 1: Next.js / Full Framework Migration** | Migrate Vite + React Router app to Next.js App Router or Pages Router. | Built-in SSG/ISR. | High migration risk; breaks existing Vite build pipeline, service worker setup, and project structure; unnecessary overhead for a static client-first tracker. | **Rejected** (Violates minimal-disruption requirement). |
| **Option 2: Headless Browser Prerender Plugin (`vite-plugin-prerender` / Puppeteer)** | Boot a headless Chromium instance for every route after `vite build`. | Executes browser DOM APIs directly. | Rendering 500–12,500 routes in headless Chromium takes 15–90+ minutes and frequently crashes CI/Netlify memory limits. | **Rejected** (Unacceptable build overhead). |
| **Option 3: Vite SSR Bundle (`src/entry-server.tsx`) + Custom Build-Time Static Renderer (`scripts/prerender.mjs`)** | Compile an SSR bundle via `vite build --ssr src/entry-server.tsx` using `react-dom/server` (`renderToString`) + `createMemoryRouter`, and generate static HTML files in `dist/`. | Zero external framework migration; deterministic; renders 505 full React SSR routes + 12,006 consolidated routes in ~10–15 seconds; embeds route-specific `#__INITIAL_DATA__` to eliminate the 8.45 MB runtime fetch. | Requires guarding `window`/`localStorage` during SSR render. | **Selected** |

---

## 2. How the Build-Time Prerendering Pipeline Works (Phase C2 & C3)

The unified build command (`npm run build`) executes four deterministic stages:

```bash
tsc && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
```

### Stage 1: TypeScript Verification & Client Bundle (`tsc && vite build`)
- Compiles the client application into `dist/`.
- **Removed Dead 8.45 MB Chunk:** Removed `'data-life': ['./src/data/lifeTemplates.json']` from `vite.config.ts` `manualChunks`, reducing the JavaScript bundle in `dist/assets/` by **8.45 MB**.

### Stage 2: SSR Server Entry Compilation (`vite build --ssr src/entry-server.tsx --outDir dist-ssr`)
- Compiles `src/entry-server.tsx`, `src/App.tsx`, all page components, `src/utils/indexabilityPolicy.ts`, and `src/utils/deterministicVariationEngine.ts` into a Node-executable ESM bundle (`dist-ssr/entry-server.js`).
- `src/store/useUserStore.ts` uses an SSR-safe storage adapter (`typeof window !== 'undefined' ? window.localStorage : memoryStorage`) and guards `IndexedDB` subscriptions so Zustand stores initialize cleanly in Node.js.

### Stage 3: Static HTML & Payload Generation (`node scripts/prerender.mjs`)
1. **Generates `public/tier1Templates.json` & `dist/tier1Templates.json`:**
   - Extracts the `494` Tier 1 indexable templates into a compact JSON index (~320 KB vs 8.45 MB—a **96% reduction** for directory browsing).
2. **Full React SSR (`renderToString`) for All Approved Indexable & Core Routes (`510` Routes):**
   - Renders `/`, `/templates`, `/about`, `/dashboard`, `/privacy`, `/terms`, `/404.html`, all `8` `/category/:categorySlug` hubs, and all `494` Tier 1 template routes (`/:slug`).
   - Injects route-specific `<title>`, `<meta name="description">`, `<meta name="robots">`, `<link rel="canonical">`, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`), Twitter Card metadata, and valid JSON-LD (`WebSite`, `CollectionPage`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage` on `/about`).
   - Writes both `dist/{route}.html` and `dist/{route}/index.html` for clean extensionless and trailing-slash resolution across Netlify and `vite preview`.
3. **Lightweight Static HTML Generation for Non-Indexable Tiers (`12,006` Routes):**
   - Generates `dist/{slug}.html` for all Tier 2 (`1,497`), Tier 3 (`9,375`), and Tier 4 (`1,134`) template slugs so existing URLs continue to return HTTP 200 for users while serving `<meta name="robots" content="noindex, follow" />` and `<link rel="canonical" href="https://life.freetoolshubs.com/{canonical-tier1-slug}" />` in raw HTML.
4. **Embedded `#__INITIAL_DATA__` Hydration Payload (Eliminates 8.45 MB Client Waterfall):**
   - Each generated HTML file embeds a small `<script id="__INITIAL_DATA__" type="application/json">` payload containing only the data required for that specific route (`currentTemplate` + `relatedTemplates`).
   - On the client, `src/hooks/useTemplates.ts` reads `#__INITIAL_DATA__` synchronously on initial mount (`loading = false`), preventing any loading-spinner flash and eliminating the 8.45 MB `/lifeTemplates.json` network fetch on initial page load.
5. **Cleanup & Manifest Emission:**
   - Deletes the temporary `dist-ssr/` directory and writes `dist/prerender-manifest.json` with timing, memory, and route count telemetry.

---

## 3. HTTP Status, Redirects, and Hosting Behavior (Phase D)

### D1 & D2: Valid Routes vs. Real HTTP 404 on Unknown Routes
- **Root Cause of Historical Soft 404s:** Previously, `public/_redirects` contained `/* /index.html 200`, which forced Netlify to return HTTP `200 OK` with the homepage shell for every invalid URL.
- **Remediation in `public/_redirects`:**
  ```text
  # Canonical host & protocol redirects
  http://life.freetoolshubs.com/* https://life.freetoolshubs.com/:splat 301!
  http://www.life.freetoolshubs.com/* https://life.freetoolshubs.com/:splat 301!
  https://www.life.freetoolshubs.com/* https://life.freetoolshubs.com/:splat 301!

  # Explicit 404 fallback for unknown routes
  /*  /404.html  404
  ```
- **How Netlify Evaluates This Configuration:**
  1. Netlify always serves existing static files in `dist/` **before** evaluating non-forced (`404`) fallback rules.
  2. Any request for `/`, `/templates`, `/about`, `/dashboard`, `/privacy`, `/terms`, `/category/:slug`, or any valid `/:slug` matches its generated static HTML file in `dist/` and returns **HTTP 200 OK**.
  3. Any request for an unknown single-segment slug (`/random-invalid-slug`), invalid nested route (`/foo/bar`), or malformed path does not match any file in `dist/` and falls through to `/* /404.html 404`, returning `dist/404.html` with a **real HTTP 404 status code** and `<meta name="robots" content="noindex, nofollow" />`.

### D3: Canonicalization & URL Normalization Policy
- **Protocol & Hostname:** Enforced to `https://life.freetoolshubs.com` via `301!` rules in `public/_redirects` and absolute canonical tags.
- **Trailing Slashes:** Root homepage canonical is `https://life.freetoolshubs.com/`; all internal pages use non-trailing-slash canonicals (`https://life.freetoolshubs.com/templates`, `https://life.freetoolshubs.com/category/morning-routine`, `https://life.freetoolshubs.com/{slug}`). Both `dist/{path}.html` and `dist/{path}/index.html` are generated for indexable routes so both variants resolve without redirect chains.
- **Query Parameters:** Ignored for canonical resolution; `<link rel="canonical">` always outputs the clean base URL without query strings (`?q=...`, `?utm_...`).

### D4: Headers, Caching & Service Worker (`public/_headers` & `public/sw.js`)
- **`public/_headers` Fixes:**
  - Updated `Content-Security-Policy` to permit `https://www.googletagmanager.com` and `https://www.google-analytics.com` (previously blocked by CSP despite `gtag.js` in `index.html`).
  - Added explicit `Cache-Control` and `Content-Type` headers for `/assets/*` (`public, max-age=31536000, immutable`), `/*.html` (`public, max-age=0, must-revalidate`), `/sitemap.xml`, and `/robots.txt` (`public, max-age=3600, must-revalidate`).
- **`public/sw.js` Fixes:**
  - Removed non-existent `/assets/index.css` and `/vite.svg` from `cache.addAll()` (which previously caused Service Worker installation to fail on every page load).
  - Bumped cache version to `life-tools-v2` with automatic cleanup of stale `v1` caches on `activate`.

