/**
 * Post-build prerender: crawls every public route from the sitemap with headless
 * Chrome and writes static HTML snapshots into dist/public/<route>/index.html so
 * crawlers that don't execute JavaScript see the full, SEO-tagged page.
 *
 * Run automatically as part of `pnpm build` (see package.json). Requires the
 * Vite build output to already exist in dist/public.
 */
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

// Headless Chrome + @sparticuz/chromium routinely times out on Vercel Linux.
// Ship the Vite SPA + vercel.json rewrites instead of failing the production build.
if (process.env.VERCEL) {
  console.log(
    "Skipping prerender on Vercel (VERCEL is set). Shipping the SPA; crawlers get client-rendered pages and vercel.json rewrites serve /about, /shop, and other routes.",
  );
  process.exit(0);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(APP_ROOT, "dist", "public");

const SITE_ORIGIN = "https://www.auryxlife.com";
// Noindexed routes that must never be snapshotted.
const SKIP_ROUTES = new Set(["/checkout", "/admin"]);
// Matches AgeGate.tsx's bot regex so snapshots never contain the age overlay.
const BOT_UA =
  "Mozilla/5.0 (compatible; AuryxPrerenderBot/1.0; +https://www.auryxlife.com) HeadlessChrome bot";
const CONCURRENCY = 2;
const PAGE_TIMEOUT_MS = 60_000;
const SEO_SETTLE_TIMEOUT_MS = 35_000;

/** Browser HTMLLinkElement.href normalizes origin-only URLs with a trailing slash. */
function mockProductFromSlug(slug) {
  const name = slug
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
  return {
    slug,
    name,
    category: "Peptides",
    shortDescription: `${name} from Auryx — physician-guided peptide protocols nationwide.`,
    fullDescription: `${name} is available through Auryx's MD-led clinical program.`,
    benefits: [],
    dosingInfo: "Dosing is determined by your Auryx clinician.",
    priceCents: 0,
    requiresConsultation: true,
    regulatoryStatus: "research",
    variants: [{ label: "Standard", priceCents: 0 }],
  };
}

/* ── Route list from sitemap ─────────────────────────────────────────── */

async function loadRoutes() {
  const xml = await readFile(path.join(DIST_DIR, "sitemap.xml"), "utf8");
  const routes = [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname.replace(/\/+$/, "") || "/")
    .filter((p) => !SKIP_ROUTES.has(p) && !p.startsWith("/admin"));
  return [...new Set(routes)];
}

/* ── Expected canonical (mirrors src/lib/seo.ts + src/i18n) ──────────── */

function expectedCanonical(route) {
  let lang = "en";
  let clean = route;
  for (const l of ["es", "pt"]) {
    if (route === `/${l}`) ({ lang, clean } = { lang: l, clean: "/" });
    else if (route.startsWith(`/${l}/`)) ({ lang, clean } = { lang: l, clean: route.slice(3) });
  }
  const localized = lang === "en" ? clean : clean === "/" ? `/${lang}` : `/${lang}${clean}`;
  return localized === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${localized}`;
}

/* ── Minimal static file server with SPA fallback ────────────────────── */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

function startServer(getFallbackHtml) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);

      // Product PDPs fetch /api/products/:slug during prerender; there is no API
      // server in the static build, so return enough JSON for applyPageSeo to run.
      if (urlPath === "/api/products" || urlPath === "/api/stock") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(urlPath === "/api/stock" ? "{}" : "[]");
        return;
      }
      const productMatch = urlPath.match(/^\/api\/products\/([^/]+)$/);
      if (productMatch) {
        const slug = decodeURIComponent(productMatch[1]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(mockProductFromSlug(slug)));
        return;
      }

      const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
      let filePath = path.join(DIST_DIR, safePath);
      if (urlPath.endsWith("/")) filePath = path.join(filePath, "index.html");
      const ext = path.extname(filePath).toLowerCase();
      if (ext && existsSync(filePath)) {
        res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
        res.end(await readFile(filePath));
        return;
      }
      // Extensionless path (SPA route): mimic the Vercel rewrite to /index.html.
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(getFallbackHtml());
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

/* ── Chrome executable resolution ────────────────────────────────────── */

async function resolveChrome() {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (fromEnv && existsSync(fromEnv)) return { executablePath: fromEnv, args: [] };
  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          process.env.LOCALAPPDATA &&
            path.join(process.env.LOCALAPPDATA, "Google\\Chrome\\Application\\chrome.exe"),
        ]
      : process.platform === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
          ]
        : [
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
          ];
  for (const c of candidates) {
    if (c && existsSync(c)) return { executablePath: c, args: [] };
  }
  if (process.platform === "linux") {
    // CI/Vercel build containers: use the Lambda-compatible Chromium build.
    const { default: chromium } = await import("@sparticuz/chromium");
    return { executablePath: await chromium.executablePath(), args: chromium.args };
  }
  throw new Error(
    "No Chrome executable found. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH.",
  );
}

/* ── Snapshot one route ──────────────────────────────────────────────── */

async function snapshotRoute(page, baseUrl, route) {
  const canonical = expectedCanonical(route);
  await page.goto(`${baseUrl}${route}`, {
    waitUntil: "networkidle2",
    timeout: PAGE_TIMEOUT_MS,
  });
  // Settled = app rendered AND applyPageSeo ran (canonical is set client-side).
  await page.waitForFunction(
    (expected) => {
      const link = document.querySelector('link[rel="canonical"]');
      const root = document.getElementById("root");
      const normalize = (url) => {
        try {
          const u = new URL(url);
          const path = u.pathname.replace(/\/+$/, "") || "/";
          return `${u.origin}${path === "/" ? "" : path}`;
        } catch {
          return String(url).replace(/\/+$/, "");
        }
      };
      return (
        !!link &&
        normalize(link.href) === normalize(expected) &&
        !!root &&
        root.children.length > 0 &&
        document.title.length > 0
      );
    },
    { timeout: SEO_SETTLE_TIMEOUT_MS, polling: 250 },
    canonical,
  );
  // Give late microtasks (JSON-LD injection, fonts) a moment to flush.
  await new Promise((r) => setTimeout(r, 300));

  const isEnglishHome = route === "/";
  await page.evaluate((keepStaticFaq) => {
    // The static homepage FAQPage JSON-LD belongs only on the English homepage;
    // every other route either has no FAQ or injects its own (ld-faq / ld-home-faq-local).
    if (!keepStaticFaq) document.getElementById("ld-home-faq")?.remove();
  }, isEnglishHome);

  const html = await page.content();

  if (html.includes("age-gate-title")) {
    throw new Error(`Snapshot for ${route} contains age-gate markup`);
  }
  const faqCount = (html.match(/"@type":\s*"FAQPage"/g) ?? []).length;
  if (isEnglishHome && faqCount !== 1) {
    throw new Error(`Homepage snapshot has ${faqCount} FAQPage blocks (expected 1)`);
  }
  if (!isEnglishHome && faqCount > 1) {
    throw new Error(`Snapshot for ${route} has ${faqCount} FAQPage blocks (expected <= 1)`);
  }
  if (!html.includes(`href="${canonical}"`) && !html.includes(`href="${canonical}/"`)) {
    throw new Error(`Snapshot for ${route} is missing canonical ${canonical}`);
  }
  return html;
}

/* ── Post-crawl sanity check: SPA fallback still boots client routes ─── */

async function verifySpaFallback(browser, baseUrl) {
  const page = await browser.newPage();
  try {
    await page.setUserAgent(BOT_UA);
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    // /checkout is not prerendered; the server responds with the "/" snapshot
    // (same as the Vercel rewrite) and React must client-render the real route.
    await page.goto(`${baseUrl}/checkout`, {
      waitUntil: "networkidle2",
      timeout: PAGE_TIMEOUT_MS,
    });
    await page.waitForFunction(
      () => {
        const root = document.getElementById("root");
        return !!root && root.children.length > 0;
      },
      { timeout: SEO_SETTLE_TIMEOUT_MS, polling: 250 },
    );
    const title = await page.title();
    if (errors.length > 0) {
      throw new Error(`/checkout via SPA fallback threw page errors: ${errors.join("; ")}`);
    }
    console.log(`  fallback OK: /checkout rendered client-side (title: "${title}")`);
  } finally {
    await page.close();
  }
}

/* ── Main ────────────────────────────────────────────────────────────── */

async function main() {
  const spaIndexPath = path.join(DIST_DIR, "index.html");
  if (!existsSync(spaIndexPath)) {
    throw new Error(`Missing ${spaIndexPath} — run the Vite build first.`);
  }
  const spaHtml = await readFile(spaIndexPath, "utf8");
  if (!spaHtml.includes('id="ld-home-faq"')) {
    throw new Error('Built index.html is missing the id="ld-home-faq" FAQPage script.');
  }

  const routes = await loadRoutes();
  console.log(`Prerendering ${routes.length} routes from sitemap.xml ...`);

  // Fallback swaps to the "/" snapshot at the end for the /checkout check.
  let fallbackHtml = spaHtml;
  const server = await startServer(() => fallbackHtml);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const { executablePath, args } = await resolveChrome();
  console.log(`Using Chrome at: ${executablePath}`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [...args, "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--hide-scrollbars"],
  });

  const failures = [];
  let rootHtml = null;
  let done = 0;

  try {
    const queue = [...routes];
    const workers = Array.from({ length: Math.min(CONCURRENCY, routes.length) }, async () => {
      const page = await browser.newPage();
      await page.setUserAgent(BOT_UA);
      await page.setViewport({ width: 1366, height: 900 });
      for (;;) {
        const route = queue.shift();
        if (route === undefined) break;
        try {
          const html = await snapshotRoute(page, baseUrl, route);
          if (route === "/") {
            rootHtml = html; // written last so the SPA index stays intact during the crawl
          } else {
            const outDir = path.join(DIST_DIR, ...route.split("/").filter(Boolean));
            await mkdir(outDir, { recursive: true });
            await writeFile(path.join(outDir, "index.html"), html, "utf8");
          }
          done += 1;
          console.log(`  [${done}/${routes.length}] ${route}`);
        } catch (err) {
          failures.push({ route, error: err.message });
          console.error(`  FAILED ${route}: ${err.message}`);
        }
      }
      await page.close();
    });
    await Promise.all(workers);

    if (rootHtml) {
      await writeFile(spaIndexPath, rootHtml, "utf8");
      console.log("  wrote / snapshot to index.html (also serves as the SPA rewrite fallback)");
      fallbackHtml = rootHtml;
      await verifySpaFallback(browser, baseUrl);
    } else if (!failures.some((f) => f.route === "/")) {
      failures.push({ route: "/", error: "Root route missing from sitemap" });
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length > 0) {
    console.error(`\nPrerender failed for ${failures.length} route(s):`);
    for (const f of failures) console.error(`  ${f.route}: ${f.error}`);
    process.exit(1);
  }
  console.log(`\nPrerender complete: ${routes.length} routes snapshotted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
