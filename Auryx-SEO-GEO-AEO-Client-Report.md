# Auryx Website — SEO, GEO & AEO Readiness Report

**Prepared for:** Auryx  
**Site reviewed:** https://www.auryxlife.com  
**Date:** September 11, 2026  
**Scope:** Search Engine Optimization (SEO), Generative Engine Optimization (GEO), and Answer Engine Optimization (AEO)

---

## Executive summary

Auryx already has a strong foundation for search and AI visibility: clear homepage messaging, physician-led educational content, blog articles with structured Q&A, and baseline metadata (titles, descriptions, social sharing tags, and structured data).

**However, the site is not yet ready for reliable search or AI discovery.** The most important issue is that most pages beyond the homepage are not reachable by Google or AI crawlers when visited directly. That means shop pages, blog posts, Learn, and other key URLs listed in the sitemap currently fail to load for bots — even though they work when users navigate inside the site.

**Bottom line:** Content and brand direction are in good shape. Technical discoverability must be fixed first. After that, we will strengthen entity signals, align messaging, and expand structured data so Auryx can rank in search and be cited by AI answer engines.

**Overall readiness (approximate):**

| Area | Score | Status |
|------|------:|--------|
| SEO (traditional search) | 34 / 100 | Needs priority work |
| GEO (AI / generative search visibility) | 28 / 100 | Needs priority work |
| AEO (answer / citation readiness) | 36 / 100 | Needs priority work |

---

## What we evaluated

1. **SEO** — Can Google and Bing find, load, understand, and rank pages?
2. **GEO** — Can AI systems recognize Auryx as a clear brand/entity (who you are, where you serve, what you offer)?
3. **AEO** — Is content structured so ChatGPT, Perplexity, Google AI Overviews, and similar tools can quote accurate answers?

---

## What’s already working

These assets give us a strong base to build on:

- **Homepage fundamentals** — Title, meta description, social (Open Graph / Twitter) tags, and canonical URL are in place.
- **Brand clarity on the home page** — Positioning around MD-led, nationwide peptide / longevity protocols is clear.
- **Educational content** — The Learn section and Journal articles are well suited for AI citation (physician authorship, clear questions and answers).
- **Crawl policy** — `robots.txt` allows indexing and points to a sitemap; admin areas are blocked as expected.
- **Social preview image** — Open Graph image is live and correctly sized for link sharing.

---

## Critical finding (must fix first)

### Most website URLs are not crawlable in production

When a user lands on the homepage and clicks around, pages load normally.  
When Google, AI bots, or a shared link hits a direct URL (for example `/shop`, `/learn`, `/blog/...`, or a product page), the server currently returns a **404 Not Found**.

**Why this matters**

- Search engines cannot index shop, blog, or education pages.
- The sitemap is advertising URLs that fail when crawled.
- AI tools cannot cite content they cannot fetch.
- Shared links to product or article pages may fail for new visitors.

**What we will update**

- Configure hosting so all valid site routes load the app correctly (SPA routing / fallback).
- Prefer prerendering or server-rendered HTML for key pages so bots receive real content without relying only on JavaScript.
- Re-test every URL in the sitemap after the fix.

This is the **#1 priority**. Content SEO and AI optimization will not deliver results until this is resolved.

---

## Key areas we will update

### 1. Technical discoverability (SEO foundation)

| Item | Current state | Planned update |
|------|---------------|----------------|
| Page routing | Only homepage reliably loads for crawlers | Fix routing so all public pages return 200 |
| Page HTML for bots | Heavy reliance on client-side JavaScript | Prerender / SSR key pages (home, shop, Learn, blog, top products) |
| Sitemap | Present, but incomplete and includes dead URLs | Regenerate from live catalog + blog; keep dates accurate |
| Private pages | Checkout / success not clearly excluded | Add `noindex` for checkout, success, and other non-marketing pages |

**Client outcome:** Every important page becomes indexable and shareable.

---

### 2. On-page SEO for money pages

| Item | Current state | Planned update |
|------|---------------|----------------|
| Product pages | Basic title/description only | Unique titles, descriptions, social tags, and product structured data |
| Blog & Learn | Good content; meta often applied only after JavaScript runs | Ensure titles, descriptions, and canonicals are present in the initial HTML |
| Brand consistency | Mix of “Auryx” / “AURYX” in titles | Standardize naming across titles and schema |
| Social tags | Strong on homepage; thinner on inner pages | Complete `og:site_name`, locale, and per-page images where useful |

**Client outcome:** Clearer search listings and better link previews when pages are shared.

---

### 3. Structured data & entity signals (GEO)

Search and AI systems need a clean “entity” for Auryx — who you are, what you offer, and where you serve.

| Item | Current state | Planned update |
|------|---------------|----------------|
| Organization / MedicalBusiness schema | Partial (missing logo, contact, social profiles, full founder details) | Complete brand entity markup |
| Location signals | Generic U.S. map coordinates | Accurate nationwide / service-area messaging (and real business details where applicable) |
| Product schema | Missing on product pages | Add Product / Offer (and breadcrumb) markup |
| FAQ schema on homepage | FAQ data in code without matching FAQ content on the page | Either add a visible FAQ section that matches the markup, or keep FAQ schema only on Learn |

**Client outcome:** Stronger brand recognition in Google Knowledge-style results and AI systems.

---

### 4. Answer-engine readiness (AEO)

Learn and Journal content is already well positioned for AI answers. Gaps are mostly technical and messaging-related.

| Item | Current state | Planned update |
|------|---------------|----------------|
| Citation-ready content | Strong Q&A style on Learn / blog | Keep and expand; ensure pages are crawlable |
| Messaging consistency | Homepage/schema lean “MD-led clinic”; footer/Learn lean “research use only” | Align public positioning so AI tools cite one clear, accurate story |
| AI discovery file | No `llms.txt` | Add a concise brand + key-page summary for AI crawlers |
| Age gate / delayed content | Overlay and API-loaded shop content | Ensure core marketing copy remains available to crawlers |

**Client outcome:** Higher chance that Auryx is quoted accurately in AI Overviews and chat-style search.

---

### 5. Content inventory & trust

| Item | Current state | Planned update |
|------|---------------|----------------|
| Product coverage in sitemap | Roughly half the catalog listed | Include all public product URLs |
| Trust / E-E-A-T | Strong physician bylines on articles | Reinforce consistent credentials, authorship, and review signals site-wide |
| Claim alignment | Clinical vs research language conflict | Legal / brand-approved unified messaging across schema, FAQ, and footer |

**Client outcome:** More complete catalog visibility and higher trust for both users and AI systems.

---

## Recommended update roadmap

### Phase 1 — Unblock discovery (highest priority)
1. Fix production routing so all public URLs load.
2. Validate sitemap URLs (no 404s).
3. Confirm Google can fetch key pages.

### Phase 2 — Make pages “bot-ready”
1. Prerender or server-render priority pages.
2. Ensure unique titles, descriptions, and canonicals in initial HTML.
3. Add product structured data on shop detail pages.

### Phase 3 — Strengthen GEO / AEO
1. Complete Organization / brand entity markup.
2. Align medical vs research messaging with approved copy.
3. Fix FAQ schema/content match.
4. Publish `llms.txt` and refresh the full sitemap.

### Phase 4 — Ongoing growth
1. Expand Journal / Learn with citation-friendly Q&A.
2. Monitor Search Console coverage and AI referral trends.
3. Refresh sitemap when products or articles are added.

---

## Expected business impact (after updates)

- **Search:** Shop, Learn, and Journal pages become eligible to rank for product and education queries — not only the homepage.
- **Sharing:** Direct links to products and articles work reliably for customers and partners.
- **AI visibility:** Cleaner entity + consistent answers increase the chance Auryx is cited in AI search results.
- **Trust:** One clear positioning story reduces confusion for customers and algorithms.

---

## What we are not changing yet

We are not recommending a full redesign or a large content rewrite as the first step. The priority is **technical discoverability and accurate structured signals**. Content expansion can follow once pages are reliably crawlable.

---

## Summary for decision-makers

| Priority | Area | Action |
|----------|------|--------|
| Critical | Technical SEO | Fix URL routing / hosting so all public pages load for Google and AI |
| High | Rendering | Deliver real HTML for key pages (not JavaScript-only) |
| High | Messaging | Align clinic vs research claims across the site |
| High | Structured data | Complete brand + product + FAQ markup correctly |
| Medium | Sitemap & inventory | Include full product catalog; noindex private flows |
| Medium | AEO extras | Add `llms.txt`; keep expanding physician-authored Q&A |

**Recommendation:** Approve Phase 1–3 as the next website update package. This sequence unlocks SEO and AI visibility without requiring a visual redesign.

---

*This report is based on a review of the live site and current website source as of September 11, 2026. Scores are directional readiness indicators, not Google ranking predictions.*
