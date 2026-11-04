# Phase 12 & 15.H — Next Phase Roadmap

**Project:** LifeHub (`https://life.freetoolshubs.com`)  

---

## Recommended Next Phase: Phase 2 — GSC Telemetry Analysis & Tier 2 Cohort Expansion

### 1. Phase Name
**Phase 2: Post-Deploy GSC Crawl/Indexation Telemetry & Selective Tier 2 Cohort Promotion**

### 2. Objective
Validate in production Google Search Console that the initial **505 Tier 1 canonical URLs** (`/` + `/templates` + `/about` + `8` Category Hubs + `494` Tier 1 Templates) achieve sustained indexing and organic impressions, and use real GSC query/crawl evidence to selectively enrich and promote the highest-demand **Tier 2** templates (`1,497` candidates) into Tier 1.

### 3. Scope
- Live production verification of HTTP headers, Cloudflare cache behavior, and GSC `All submitted pages` indexing ratio over the first 14–30 days post-deployment.
- Forensic review of live GSC exclusion buckets (`Crawled - currently not indexed`, `Discovered - currently not indexed`, `Alternate page with proper canonical tag`).
- Deep domain expansion of the 42 missing scenarios in `scripts/seed-templates.cjs` that were historically truncated by `.slice(0, 12500)` (such as `Time Management`, `Focus for ADHD`, `Exam Prep`, `Sleep Hygiene`, and `Posture Correction`) and selective promotion of top-performing Tier 2 templates.

### 4. Exact Tasks
1. **Execute Production Deployment & Cache Purge:**
   - Deploy the remediated `dist/` build to Netlify and purge the Cloudflare edge cache following `PRODUCTION-DEPLOYMENT-CHECKLIST.md`.
2. **Collect Missing Baseline & Day-14 GSC Evidence:**
   - Export the GSC `Indexing > Pages` report filtered by `All submitted pages` (`505` URLs) vs `All known pages`.
   - Inspect 10 representative URLs (`/` + 3 `/category/*` hubs + 4 Tier 1 templates + 2 Tier 3 consolidated variants) and record Google-selected canonical vs user-declared canonical.
3. **Evaluate Tier 1 Indexing Velocity by Category:**
   - Measure what percentage of each Category Hub’s Tier 1 templates (`Morning Routine` [81], `Habit Building` [113], `Daily Productivity` [53], etc.) transitions from `Discovered/Crawled` to `Indexed`.
4. **Upgrade & Promote Priority Tier 2 Cohorts (Only After ≥60% Tier 1 Indexation):**
   - For categories demonstrating strong indexing and search impressions in GSC, author bespoke audience-specific workflows, obstacle breakdowns, and specialized habit sets for the top 100–200 Tier 2 templates (e.g., `Productivity Goal Setting for Busy Professionals`, `Deep Work Mindfulness for Remote Workers`) and promote them from `tier2` (`noindex, follow`) to `tier1` (`index, follow`).
5. **Curate High-Demand Truncated Scenarios (Without Combinatorial Bloat):**
   - Instead of generating 576 permutations per scenario, author **1 single canonical guide + tracker per high-demand missing topic** (e.g., `/focus-for-adhd-daily-productivity-guide`, `/exam-prep-study-routine-for-students`, `/sleep-hygiene-evening-checklist`) with 100% custom habits and zero persona duplication.

### 5. Required Evidence Before Promoting Any Tier 2 Page
- GSC `Indexing > Pages` report showing that the `505` submitted Tier 1 URLs are being crawled with `200 OK` and progressively indexed without `Duplicate without user-selected canonical` or `Soft 404` exclusions.
- GSC `Performance > Search results` showing impressions on the corresponding Category Hub or Tier 1 scenario cluster.
- Verification that the candidate Tier 2 page has been upgraded with non-overlapping habits and audience-specific guidance.

### 6. Acceptance Criteria for Phase 2
- `100%` of the 8 Category Hub pages (`/category/*`) and core static pages (`/`, `/templates`, `/about`) are indexed in GSC.
- At least `60%+` of the initial `494` Tier 1 template pages are indexed in GSC within 4–8 weeks of deployment, with `0` Soft 404 errors on valid routes.
- Historical Tier 3/4 URLs recrawled by Googlebot properly move out of `Crawled - currently not indexed` into `Excluded by 'noindex' tag` or `Alternate page with proper canonical tag`.

---

**Next Execution Recommendation:** Deploy the verified `dist/` build to Netlify, verify live `curl -I` HTTP 200/404 responses through Cloudflare, submit the 505-URL `sitemap.xml` in Google Search Console, and request indexing on `/` + `/templates` + the 8 `/category/*` hubs.

