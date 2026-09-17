/**
 * Build-time sitemap generator — reads static page list + product slugs + blog posts.
 * Run after Vite build: node scripts/generate-sitemap.mjs
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "dist", "public");
const publicDir = join(root, "public");
const ORIGIN = "https://www.auryxlife.com";
const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/es", priority: "0.8", changefreq: "weekly" },
  { path: "/pt", priority: "0.8", changefreq: "weekly" },
  { path: "/shop", priority: "0.9", changefreq: "weekly" },
  { path: "/learn", priority: "0.9", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/our-method", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/peptide-therapy-new-york", priority: "0.8", changefreq: "monthly" },
  { path: "/protocol-finder", priority: "0.7", changefreq: "monthly" },
  { path: "/verify-coa", priority: "0.7", changefreq: "monthly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/contact", priority: "0.5", changefreq: "yearly" },
  { path: "/sources", priority: "0.4", changefreq: "yearly" },
];

function loadProductSlugs() {
  // Prefer compiled catalog from API products source via a lightweight regex scan of public sitemap fallback
  const productsPath = join(root, "..", "api-server", "src", "routes", "shop", "products.ts");
  if (!existsSync(productsPath)) return [];
  const src = readFileSync(productsPath, "utf8");
  const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  return [...new Set(slugs)].filter((s) => s !== "test-charge");
}

function loadBlogSlugs() {
  const blogDir = join(root, "src", "content", "blog");
  // Fallback: scrape existing public sitemap for /blog/ entries
  const existing = join(publicDir, "sitemap.xml");
  if (!existsSync(existing)) return [];
  const xml = readFileSync(existing, "utf8");
  return [...xml.matchAll(/https:\/\/www\.auryxlife\.com\/blog\/([a-z0-9-]+)/g)].map((m) => m[1]);
}

function urlEntry(path, priority, changefreq) {
  return `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls = [
  ...staticPages.map((p) => urlEntry(p.path, p.priority, p.changefreq)),
  ...loadProductSlugs().map((slug) => urlEntry(`/shop/${slug}`, "0.8", "weekly")),
  ...loadBlogSlugs().map((slug) => urlEntry(`/blog/${slug}`, "0.7", "monthly")),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}
</urlset>
`;

const targets = [join(publicDir, "sitemap.xml")];
if (existsSync(outDir)) targets.push(join(outDir, "sitemap.xml"));
for (const t of targets) {
  writeFileSync(t, xml);
  console.log(`[sitemap] wrote ${t} (${urls.length} urls)`);
}
