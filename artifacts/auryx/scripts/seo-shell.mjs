/**
 * Chrome-free SEO shells for every sitemap route.
 *
 * Vite's SPA index.html is the homepage. Vercel rewrites send every public
 * URL to that file, so crawlers that do not execute JavaScript see homepage
 * titles, canonicals, and FAQ schema on /shop, /learn, and product pages.
 *
 * This script clones the built index.html and writes a unique head (title,
 * description, canonical, Open Graph, hreflang, JSON-LD) to
 * dist/public/<route>/index.html. Static files win over vercel.json rewrites.
 *
 * Runs on Vercel. Chromium prerender.mjs remains an optional local upgrade.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGeoInner, ES_FAQS, PT_FAQS } from "./seo-geo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..", "..");
const DIST_DIR = path.join(APP_ROOT, "dist", "public");
const SITE_ORIGIN = "https://www.auryxlife.com";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/opengraph.jpg`;
const DEFAULT_IMAGE_ALT = "Auryx — MD-led precision peptide therapy nationwide";
const SKIP_ROUTES = new Set(["/checkout", "/admin"]);

const PRODUCT_IMAGES = {
  semaglutide: "/products/semaglutide.png",
  tirzepatide: "/products/tirzepatide.png",
  retatrutide: "/products/retatrutide.png",
  sermorelin: "/products/sermorelin.png",
  tesamorelin: "/products/tesamorelin.png",
  "tesamorelin-ipamorelin": "/products/ipamorelin.png",
  ipamorelin: "/products/ipamorelin.png",
  "cjc-1295": "/products/cjc-1295.png",
  "cjc-1295-dac": "/products/cjc-1295-dac.png",
  "cjc-1295-ipamorelin": "/products/cjc-1295-ipamorelin.png",
  "bpc-157": "/products/bpc-157.png",
  "tb-500": "/products/tb-500.png",
  "bpc-157-tb-500": "/products/bpc-157-tb-500.png",
  kpv: "/products/kpv.png",
  "ghk-cu": "/products/ghk-cu.png",
  "pt-141": "/products/pt-141.png",
  kisspeptin: "/products/kisspeptin.png",
  "thymosin-alpha-1": "/products/thymosin-alpha-1.png",
  epithalon: "/products/epithalon.png",
  pinealon: "/products/pinealon.png",
  "mots-c": "/products/mots-c.png",
  semax: "/products/semax.png",
  selank: "/products/selank.png",
  cerebrolysin: "/products/cerebrolysin.png",
  "nad-plus": "/products/nad-plus.png",
  glutathione: "/products/glutathione.png",
  "ss-31": "/products/ss-31.png",
  "glow-complex": "/products/glow-complex.png",
  "klow-complex": "/products/klow-complex.png",
  "aod-9604": "/products/aod-9604.png",
  "reconstitution-kit": "/products/reconstitution-kit.png",
  "tirzepatide-b12-glycine": "/products/tirzepatide-b12-glycine.png",
};

const STATIC_PAGES = {
  "/": {
    title: "Auryx | MD-Led Peptide Therapy — Nationwide",
    description:
      "Auryx offers MD-led peptide therapy nationwide via telemedicine with physician-supervised protocols.",
    keepHomeFaq: true,
    htmlLang: "en",
    ogLocale: "en_US",
  },
  "/es": {
    title: "Auryx | Terapia con Péptidos Dirigida por Médicos — En Todo EE. UU.",
    description:
      "Auryx ofrece terapia con péptidos dirigida por médicos en todo EE. UU. mediante telemedicina.",
    keepHomeFaq: false,
    htmlLang: "es",
    ogLocale: "es_ES",
  },
  "/pt": {
    title: "Auryx | Terapia com Peptídeos Conduzida por Médicos — Em Todos os EUA",
    description:
      "A Auryx oferece terapia com peptídeos conduzida por médicos em todos os EUA via telemedicina.",
    keepHomeFaq: false,
    htmlLang: "pt-BR",
    ogLocale: "pt_BR",
  },
  "/shop": {
    title: "Shop | Auryx — Research-Grade Peptides",
    description:
      "Browse Auryx's curated collection of physician-guided peptide compounds. GLP-1 agonists, growth hormone secretagogues, recovery peptides, cognitive enhancers, and longevity protocols.",
  },
  "/learn": {
    title: "Peptide Therapy Education | Auryx Learn",
    description:
      "Your complete peptide therapy guide — how peptides work, what BPC-157, semaglutide, CJC-1295 ipamorelin, and NAD+ do, and how to start a physician-supervised protocol at Auryx's telehealth peptide clinic.",
  },
  "/blog": {
    title: "Auryx Journal — Peptide Science, Longevity & Precision Medicine",
    description:
      "Physician-written articles on peptide therapy, longevity science, metabolic health, and precision medicine from the Auryx clinical team.",
  },
  "/our-method": {
    title: "Our Method | Auryx — Precision Longevity Protocols",
    description:
      "Discover Auryx's evidence-based methodology: biomarker assessment, MD-led protocol design, US compounding pharmacy fulfillment, and ongoing clinical monitoring.",
  },
  "/about": {
    title: "About Auryx | Meet the Physician — Romy Fontoura, MD",
    description:
      "Auryx is an MD-led telehealth peptide therapy clinic founded by Romy Fontoura, MD. Learn about our medical review process, quality standards, and physician oversight.",
  },
  "/peptide-therapy-new-york": {
    title: "Peptide Therapy in New York | MD-Led Telehealth — Auryx",
    description:
      "Physician-guided peptide therapy for New York residents via telehealth. No office visits — licensed provider oversight and direct delivery across NYC, Long Island, Westchester, and upstate NY.",
  },
  "/protocol-finder": {
    title: "Protocol Finder | Auryx — Personalized Peptide Recommendations",
    description:
      "Answer a few questions and get a personalized peptide protocol recommendation from Auryx's clinical team.",
  },
  "/terms": {
    title: "Terms of Service | Auryx",
    description:
      "Auryx Terms of Service. Read our terms for using auryxlife.com and our telemedicine peptide therapy services.",
  },
  "/privacy": {
    title: "Privacy Policy | Auryx",
    description:
      "Auryx Privacy Policy. Learn how we collect, use, and protect your personal information when using auryxlife.com.",
  },
  "/contact": {
    title: "Contact Auryx | MD-Led Peptide Therapy",
    description:
      "Contact Auryx for MD-led peptide therapy nationwide. Email the clinic team or book a private telemedicine consultation.",
  },
  "/sources": {
    title: "Sources & Citations | Auryx",
    description:
      "Citations and primary sources behind Auryx educational pages on MD-led peptide therapy and longevity medicine.",
  },
};

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unescapeJs(value) {
  return String(value)
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function siteUrl(route) {
  if (!route || route === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${route.startsWith("/") ? route : `/${route}`}`;
}

function localizedPath(lang, pathName) {
  if (lang === "en") return pathName;
  return pathName === "/" ? `/${lang}` : `/${lang}${pathName}`;
}

function unprefixedPath(route) {
  if (route === "/es" || route === "/pt") return "/";
  if (route.startsWith("/es/") || route.startsWith("/pt/")) return route.slice(3);
  return route;
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((w) => (w.toUpperCase() === w ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/\bBpc\b/g, "BPC")
    .replace(/\bTb\b/g, "TB")
    .replace(/\bCjc\b/g, "CJC")
    .replace(/\bGhk\b/g, "GHK")
    .replace(/\bPt\b/g, "PT")
    .replace(/\bNad\b/g, "NAD")
    .replace(/\bMots\b/g, "MOTS")
    .replace(/\bSs\b/g, "SS")
    .replace(/\bAod\b/g, "AOD");
}

function extractQuotedField(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return match ? unescapeJs(match[1]) : "";
}

function extractProducts(source) {
  const products = [];
  const re = /\{\s*slug:\s*"([^"]+)"[\s\S]*?\n  \}/g;
  let match;
  while ((match = re.exec(source))) {
    const block = match[0];
    const slug = match[1];
    const name = extractQuotedField(block, "name") || titleFromSlug(slug);
    const category = extractQuotedField(block, "category") || "Peptides";
    const shortDescription = extractQuotedField(block, "shortDescription");
    const priceMatch = block.match(/priceCents:\s*(\d+)/);
    products.push({
      slug,
      name,
      category,
      shortDescription,
      priceCents: priceMatch ? Number(priceMatch[1]) : 0,
    });
  }
  return products;
}

function extractBlogPosts(source) {
  const posts = [];
  const chunks = source.split(/\n  \{\s*\n    slug:\s*"/).slice(1);
  for (const chunk of chunks) {
    const slug = chunk.match(/^([^"]+)"/)?.[1];
    if (!slug) continue;
    const faqBlocks = [];
    const faqRe =
      /type:\s*"h2",\s*text:\s*"((?:[^"\\]|\\.)*)",\s*faqAnswer:\s*"((?:[^"\\]|\\.)*)"/g;
    let faq;
    while ((faq = faqRe.exec(chunk))) {
      faqBlocks.push({ q: unescapeJs(faq[1]), a: unescapeJs(faq[2]) });
    }
    posts.push({
      slug,
      title: extractQuotedField(chunk, "title"),
      metaDescription: extractQuotedField(chunk, "metaDescription"),
      heroImage: extractQuotedField(chunk, "heroImage"),
      heroImageAlt: extractQuotedField(chunk, "heroImageAlt"),
      author: extractQuotedField(chunk, "author") || "Romy Fontoura, MD",
      publishDate: extractQuotedField(chunk, "publishDate"),
      faqBlocks,
    });
  }
  return posts;
}

function extractQaPairs(source, marker) {
  const start = source.indexOf(marker);
  if (start < 0) return [];
  const slice = source.slice(start);
  const pairs = [];
  const re = /q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = re.exec(slice))) {
    pairs.push({ q: unescapeJs(match[1]), a: unescapeJs(match[2]) });
  }
  return pairs;
}

async function loadRoutes() {
  const sitemapPath = path.join(DIST_DIR, "sitemap.xml");
  if (!existsSync(sitemapPath)) {
    throw new Error(`Missing ${sitemapPath} — run the Vite build first.`);
  }
  const xml = await readFile(sitemapPath, "utf8");
  const routes = [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname.replace(/\/+$/, "") || "/")
    .filter((p) => !SKIP_ROUTES.has(p) && !p.startsWith("/admin"));
  return [...new Set(routes)];
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
}

function upsertMetaName(html, name, content) {
  const re = new RegExp(`<meta\\s+name="${name}"[^>]*>`, "i");
  const tag = `<meta name="${name}" content="${esc(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return injectBeforeHeadClose(html, tag);
}

function upsertMetaProperty(html, property, content) {
  const re = new RegExp(`<meta\\s+property="${property}"[^>]*>`, "i");
  const tag = `<meta property="${property}" content="${esc(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return injectBeforeHeadClose(html, tag);
}

function setCanonical(html, url) {
  const tag = `<link rel="canonical" href="${esc(url)}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    return html.replace(/<link\s+rel="canonical"[^>]*>/i, tag);
  }
  return injectBeforeHeadClose(html, tag);
}

function setHtmlLang(html, lang) {
  return html.replace(/<html\s+lang="[^"]*"/, `<html lang="${esc(lang)}"`);
}

function injectBeforeHeadClose(html, snippet) {
  return html.replace("</head>", `    ${snippet}\n  </head>`);
}

function ensureLlmsLink(html) {
  if (/rel="alternate"[^>]*type="text\/plain"/i.test(html) || /href="\/llms\.txt"/i.test(html)) {
    return html;
  }
  return injectBeforeHeadClose(html, `<link rel="alternate" type="text/plain" href="/llms.txt" />`);
}

function removeHomeFaq(html) {
  return html.replace(
    /<script\s+type="application\/ld\+json"\s+id="ld-home-faq">[\s\S]*?<\/script>\s*/i,
    "",
  );
}

function injectJsonLd(html, id, data) {
  html = html.replace(new RegExp(`<script[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/script>\\s*`, "i"), "");
  const script = `<script type="application/ld+json" id="${id}">${JSON.stringify(data)}</script>`;
  return injectBeforeHeadClose(html, script);
}

function setHreflang(html, pathName) {
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\s*/gi, "");
  const links = [
    ["en", siteUrl(pathName)],
    ["es", siteUrl(localizedPath("es", pathName))],
    ["pt-BR", siteUrl(localizedPath("pt", pathName))],
    ["x-default", siteUrl(pathName)],
  ]
    .map(([hreflang, href]) => `<link rel="alternate" hreflang="${hreflang}" href="${esc(href)}" />`)
    .join("\n    ");
  return injectBeforeHeadClose(html, links);
}

function updateWebPageGraph(html, { url, title, description }) {
  return html.replace(
    /"@type":\s*"WebPage",\s*"@id":\s*"https:\/\/www\.auryxlife\.com\/#webpage",\s*"url":\s*"https:\/\/www\.auryxlife\.com\/",\s*"name":\s*"[^"]*",\s*"isPartOf":\s*\{\s*"@id":\s*"https:\/\/www\.auryxlife\.com\/#website"\s*\},\s*"about":\s*\{\s*"@id":\s*"https:\/\/www\.auryxlife\.com\/#medicalbusiness"\s*\},\s*"description":\s*"[^"]*",/,
    `"@type": "WebPage",
          "@id": "${url}#webpage",
          "url": "${url}",
          "name": ${JSON.stringify(title)},
          "isPartOf": {
            "@id": "https://www.auryxlife.com/#website"
          },
          "about": {
            "@id": "https://www.auryxlife.com/#medicalbusiness"
          },
          "description": ${JSON.stringify(description)},`,
  );
}

function injectNoscript(html, title, description) {
  // geo-static already has the page H1; keep noscript to a paragraph so crawlers see one H1.
  const block = `<noscript><p>${esc(description)}</p></noscript>`;
  if (html.includes("<noscript>")) {
    return html.replace(/<noscript>[\s\S]*?<\/noscript>/, block);
  }
  return html.replace("</body>", `    ${block}\n  </body>`);
}

function pageGeoInner(title, description, route, learnFaqs) {
  return buildGeoInner(route, { title, description }, { learnFaqs });
}

function setGeoStatic(html, inner) {
  if (/<article id="geo-static">/.test(html)) {
    return html.replace(
      /<article id="geo-static">[\s\S]*?<\/article>/,
      `<article id="geo-static">\n        ${inner}\n      </article>`,
    );
  }
  return html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root"><article id="geo-static">${inner}</article></div>`,
  );
}

function faqJsonLd(pairs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function resolvePage(route, products, posts, learnFaqs, nyFaqs) {
  if (STATIC_PAGES[route]) {
    const page = { ...STATIC_PAGES[route], path: unprefixedPath(route), extraJsonLd: [], learnFaqs };
    if (route === "/learn") {
      page.extraJsonLd.push(
        {
          id: "ld-learn-faq",
          data: faqJsonLd(learnFaqs),
        },
        {
          id: "ld-learn-medical",
          data: {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: page.title,
            description:
              "Physician-reviewed educational resource covering peptide therapy, longevity protocols, metabolic health, and precision medicine compounds.",
            url: siteUrl("/learn"),
            inLanguage: "en-US",
            author: { "@type": "Person", name: "Romy Fontoura, MD", jobTitle: "Physician, Longevity Medicine" },
            publisher: { "@type": "Organization", name: "Auryx", url: SITE_ORIGIN },
          },
        },
      );
    }
    if (route === "/about") {
      page.extraJsonLd.push(
        {
          id: "jsonld-about-physician",
          data: {
            "@context": "https://schema.org",
            "@type": "Physician",
            "@id": siteUrl("/about#physician"),
            name: "Romy Fontoura, MD",
            jobTitle: "Founder & Medical Director",
            description:
              "Founder and medical director of Auryx, an MD-led telehealth clinic offering physician-guided peptide therapy protocols across the United States.",
            worksFor: { "@id": "https://www.auryxlife.com/#organization" },
            url: siteUrl("/about"),
          },
        },
        {
          id: "jsonld-about-webpage",
          data: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: siteUrl("/about"),
            name: "About Auryx | Meet the Physician",
            description: page.description,
            isPartOf: { "@id": "https://www.auryxlife.com/#website" },
            mainEntity: { "@id": siteUrl("/about#physician") },
          },
        },
      );
    }
    if (route === "/es") {
      page.extraJsonLd.push({ id: "ld-locale-faq", data: faqJsonLd(ES_FAQS) });
    }
    if (route === "/pt") {
      page.extraJsonLd.push({ id: "ld-locale-faq", data: faqJsonLd(PT_FAQS) });
    }
    if (route === "/peptide-therapy-new-york") {
      page.extraJsonLd.push(
        {
          id: "jsonld-ny-webpage",
          data: {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            url: siteUrl("/peptide-therapy-new-york"),
            name: page.title,
            description: page.description,
            areaServed: { "@type": "State", name: "New York" },
            inLanguage: "en-US",
          },
        },
        { id: "jsonld-ny-faq", data: faqJsonLd(nyFaqs) },
      );
    }
    return page;
  }

  const shopMatch = route.match(/^\/shop\/([^/]+)$/);
  if (shopMatch) {
    const slug = shopMatch[1];
    const product = products.find((p) => p.slug === slug);
    const name = product?.name || titleFromSlug(slug);
    const description =
      product?.shortDescription ||
      `${name} from Auryx — physician-guided peptide protocols nationwide.`;
    const imagePath = PRODUCT_IMAGES[slug]
      ? `${SITE_ORIGIN}${PRODUCT_IMAGES[slug]}`
      : DEFAULT_IMAGE;
    const price = ((product?.priceCents ?? 0) / 100).toFixed(2);
    return {
      title: `${name} | Auryx Shop`,
      description,
      path: route,
      type: "product",
      image: imagePath,
      imageAlt: `${name} — Auryx`,
      extraJsonLd: [
        {
          id: "ld-product",
          data: {
            "@context": "https://schema.org",
            "@type": "Product",
            name,
            description,
            image: imagePath,
            sku: slug,
            brand: { "@type": "Brand", name: "Auryx" },
            category: product?.category || "Peptides",
            url: siteUrl(route),
            offers: {
              "@type": "Offer",
              url: siteUrl(route),
              priceCurrency: "USD",
              price,
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "Auryx", url: SITE_ORIGIN },
            },
          },
        },
        {
          id: "ld-breadcrumb-product",
          data: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
              { "@type": "ListItem", position: 2, name: "Shop", item: siteUrl("/shop") },
              { "@type": "ListItem", position: 3, name, item: siteUrl(route) },
            ],
          },
        },
      ],
    };
  }

  const blogMatch = route.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const post = posts.find((p) => p.slug === slug);
    const title = post?.title || titleFromSlug(slug);
    const description =
      post?.metaDescription ||
      `${title} — physician-authored guidance from the Auryx clinical team.`;
    const image = post?.heroImage ? `${SITE_ORIGIN}${post.heroImage}` : DEFAULT_IMAGE;
    const extraJsonLd = [
      {
        id: "ld-article",
        data: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          author: { "@type": "Person", name: post?.author || "Romy Fontoura, MD" },
          publisher: {
            "@type": "Organization",
            name: "Auryx",
            url: SITE_ORIGIN,
            logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/logo.png` },
          },
          datePublished: post?.publishDate,
          image,
          url: siteUrl(route),
          mainEntityOfPage: siteUrl(route),
        },
      },
    ];
    if (post?.faqBlocks?.length) {
      extraJsonLd.push({ id: "ld-faq", data: faqJsonLd(post.faqBlocks) });
    }
    return {
      title: `${title} | Auryx`,
      description,
      path: route,
      type: "article",
      image,
      imageAlt: post?.heroImageAlt || title,
      extraJsonLd,
    };
  }

  return {
    title: `${titleFromSlug(route.replace(/^\//, ""))} | Auryx`,
    description: "Auryx — MD-led precision peptide therapy nationwide.",
    path: route,
    extraJsonLd: [],
  };
}

function applySeo(html, route, page) {
  const canonical = siteUrl(route);
  const type = page.type === "product" ? "product" : page.type === "article" ? "article" : "website";
  const image = page.image || DEFAULT_IMAGE;
  const imageAlt = page.imageAlt || DEFAULT_IMAGE_ALT;
  const htmlLang = page.htmlLang || "en";
  const ogLocale = page.ogLocale || "en_US";

  html = setHtmlLang(html, htmlLang);
  html = replaceTitle(html, page.title);
  html = upsertMetaName(html, "description", page.description);
  html = upsertMetaName(
    html,
    "robots",
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  );
  html = setCanonical(html, canonical);
  html = setHreflang(html, page.path || unprefixedPath(route));
  html = upsertMetaProperty(html, "og:title", page.title);
  html = upsertMetaProperty(html, "og:description", page.description);
  html = upsertMetaProperty(html, "og:type", type);
  html = upsertMetaProperty(html, "og:url", canonical);
  html = upsertMetaProperty(html, "og:image", image);
  html = upsertMetaProperty(html, "og:image:alt", imageAlt);
  html = upsertMetaProperty(html, "og:site_name", "Auryx");
  html = upsertMetaProperty(html, "og:locale", ogLocale);
  html = upsertMetaName(html, "twitter:card", "summary_large_image");
  html = upsertMetaName(html, "twitter:title", page.title);
  html = upsertMetaName(html, "twitter:description", page.description);
  html = upsertMetaName(html, "twitter:image", image);
  html = upsertMetaName(html, "twitter:image:alt", imageAlt);
  html = updateWebPageGraph(html, { url: canonical, title: page.title, description: page.description });

  if (!page.keepHomeFaq) {
    html = removeHomeFaq(html);
  }

  for (const item of page.extraJsonLd ?? []) {
    html = injectJsonLd(html, item.id, item.data);
  }

  if (!page.keepHomeFaq) {
    html = setGeoStatic(html, pageGeoInner(page.title, page.description, route, page.learnFaqs));
    html = injectNoscript(html, page.title, page.description);
  } else {
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/g, "");
  }
  html = ensureLlmsLink(html);
  return html;
}

function assertUniqueShells(written) {
  const homeTitle = STATIC_PAGES["/"].title;
  const failures = [];
  for (const { route, html } of written) {
    if (route === "/") continue;
    if (html.includes(`<title>${esc(homeTitle)}</title>`)) {
      failures.push(`${route} still has the homepage title`);
    }
    if (html.includes('id="ld-home-faq"')) {
      failures.push(`${route} still has homepage FAQ JSON-LD`);
    }
    const canonical = siteUrl(route);
    if (!html.includes(`href="${canonical}"`) && !html.includes(`href="${canonical}/"`)) {
      failures.push(`${route} is missing canonical ${canonical}`);
    }
  }
  const shop = written.find((w) => w.route === "/shop");
  if (shop && !shop.html.includes("Shop | Auryx")) {
    failures.push("/shop is missing its shop title");
  }
  const learn = written.find((w) => w.route === "/learn");
  if (learn && learn.html.includes('id="ld-home-faq"')) {
    failures.push("/learn still ships homepage FAQ schema");
  }
  const product = written.find((w) => w.route === "/shop/semaglutide");
  if (product && !product.html.includes('"@type":"Product"') && !product.html.includes('"@type": "Product"')) {
    failures.push("/shop/semaglutide is missing Product JSON-LD");
  }
  const priority = ["/", "/es", "/pt", "/shop", "/learn", "/blog", "/our-method", "/about", "/contact", "/sources"];
  for (const route of priority) {
    const item = written.find((w) => w.route === route);
    if (!item) {
      failures.push(`${route} is missing from written shells`);
      continue;
    }
    const article = (item.html.match(/<article id="geo-static">[\s\S]*?<\/article>/i) || [""])[0];
    const text = article
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const h1 = (article.match(/<h1\b/gi) || []).length;
    const h2 = (article.match(/<h2\b/gi) || []).length;
    if (words < 300) failures.push(`${route} geo-static has ${words} words (need 300+)`);
    if (h1 !== 1) failures.push(`${route} geo-static has ${h1} H1s (need 1)`);
    const docH1 = (item.html.replace(/<script[\s\S]*?<\/script>/gi, "").match(/<h1\b/gi) || []).length;
    if (docH1 !== 1) failures.push(`${route} document has ${docH1} H1s (need 1)`);
    if (h2 < 2) failures.push(`${route} geo-static has ${h2} H2s (need 2+)`);
    if (!article.includes(`<h1>${esc(STATIC_PAGES[route].title)}</h1>`)) {
      failures.push(`${route} H1 does not match title`);
    }
  }
  if (failures.length > 0) {
    throw new Error(`SEO shell verification failed:\n  ${failures.join("\n  ")}`);
  }
}

async function main() {
  const spaIndexPath = path.join(DIST_DIR, "index.html");
  if (!existsSync(spaIndexPath)) {
    throw new Error(`Missing ${spaIndexPath} — run the Vite build first.`);
  }
  const spaHtml = await readFile(spaIndexPath, "utf8");
  if (!spaHtml.includes('id="ld-home-faq"')) {
    throw new Error('Built index.html is missing the id="ld-home-faq" FAQPage script.');
  }

  const [productSource, blogSource, learnSource, nySource] = await Promise.all([
    readFile(path.join(REPO_ROOT, "artifacts/api-server/src/routes/shop/products.ts"), "utf8"),
    readFile(path.join(APP_ROOT, "src/data/blog-posts.ts"), "utf8"),
    readFile(path.join(APP_ROOT, "src/pages/learn.tsx"), "utf8"),
    readFile(path.join(APP_ROOT, "src/pages/new-york.tsx"), "utf8"),
  ]);
  const products = extractProducts(productSource);
  const posts = extractBlogPosts(blogSource);
  const learnFaqs = extractQaPairs(learnSource, "const FAQS = [");
  const nyFaqs = extractQaPairs(nySource, "const NY_FAQS = [");
  if (products.length < 10) {
    throw new Error(`Product SEO extract returned only ${products.length} items`);
  }
  if (posts.length < 3) {
    throw new Error(`Blog SEO extract returned only ${posts.length} posts`);
  }

  const routes = await loadRoutes();
  console.log(`Writing SEO shells for ${routes.length} sitemap routes ...`);

  const written = [];
  for (const route of routes) {
    const page = resolvePage(route, products, posts, learnFaqs, nyFaqs);
    const html = applySeo(spaHtml, route, page);
    if (route === "/") {
      await writeFile(spaIndexPath, html, "utf8");
    } else {
      const outDir = path.join(DIST_DIR, ...route.split("/").filter(Boolean));
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, "index.html"), html, "utf8");
    }
    written.push({ route, html });
    console.log(`  ${route}`);
  }

  assertUniqueShells(written);
  console.log(`SEO shells written: ${written.length} routes (no Chrome required).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
