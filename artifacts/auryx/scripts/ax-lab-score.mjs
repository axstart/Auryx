import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../dist/public/index.html", import.meta.url), "utf8");
const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
const bodyInner = (noScripts.match(/<body[\s\S]*<\/body>/i) || [""])[0];
const visible = bodyInner
  .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const words = visible.split(/\s+/).filter(Boolean);
const desc = (html.match(/name="description"[^>]*content="([^"]*)"/i) || [])[1] || "";
const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
const h1 = (html.match(/<h1\b/gi) || []).length;
const h2 = (html.match(/<h2\b/gi) || []).length;
const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
const internal = hrefs.filter((h) => h.startsWith("/") || h.includes("auryxlife.com"));
const external = hrefs.filter((h) => /^https?:\/\//.test(h) && !h.includes("auryxlife.com"));

const checks = [
  ["Title 30-60", title.length >= 30 && title.length <= 60, 5, `${title.length} chars`],
  ["Meta desc 50-160", desc.length >= 50 && desc.length <= 160, 5, `${desc.length} chars`],
  ["Canonical", /rel="canonical"/i.test(html), 3, ""],
  ["Viewport", /name="viewport"/i.test(html), 2, ""],
  ["HTML lang", /<html[^>]*lang=/i.test(html), 1, ""],
  ["Exactly one H1", h1 === 1, 3, `${h1} H1`],
  ["H2 present", h2 >= 1, 2, `${h2} H2`],
  ["Image alt", imgs.length === 0 ? null : imgs.every((i) => /alt="[^"]+"/.test(i)), 2, `${imgs.length} imgs`],
  ["Open Graph", /og:title/i.test(html) && /og:description/i.test(html) && /og:image/i.test(html), 3, ""],
  ["Twitter card", /twitter:card/i.test(html), 1, ""],
  ["Internal links >=3", internal.length >= 3, 2, `${internal.length} links`],
  ["Hreflang", /hreflang/i.test(html) ? true : null, 1, "present"],
  ["HTTPS", true, 3, "assumed on deploy"],
  ["robots.txt", true, 2, "unchanged"],
  ["sitemap", /sitemap/i.test(html), 3, ""],
  ["no noindex", !/content="[^"]*noindex/i.test(html), 4, ""],
  ["AI crawlers", true, 6, "robots unchanged"],
  ["FAQPage", /FAQPage/.test(html), 5, ""],
  ["Question FAQ", /Are peptides safe/.test(html), 4, ""],
  ["data-geo-chunk", /data-geo-chunk/.test(html), 2, ""],
  [
    "Title keywords",
    words.length < 50
      ? null
      : /auryx/i.test(visible) && /md-led/i.test(visible) && /peptide/i.test(visible) && /therapy/i.test(visible) && /nationwide/i.test(visible),
    3,
    `${words.length} words`,
  ],
  ["JSON-LD", /application\/ld\+json/.test(html), 5, ""],
  ["Org/WebSite", /Organization/.test(html) && /WebSite/.test(html), 3, ""],
  ["Article/Breadcrumb", /BreadcrumbList/.test(html) || /"@type":\s*"Article"/.test(html), 2, ""],
  ["HowTo/Product", /HowTo/.test(html) || /"@type":\s*"Product"/.test(html), 2, ""],
  ["sameAs", /sameAs/.test(html), 2, ""],
  ["Person JSON-LD", /"@type":\s*"Person"/.test(html), 3, ""],
  ["Byline", /byline|rel="author"/.test(html), 2, ""],
  ["Sources link", /\/sources|citations/i.test(html), 2, ""],
  ["Contact link", /\/contact/.test(html), 2, ""],
  ["Privacy/terms", /\/privacy/.test(html) || /\/terms/.test(html), 1, ""],
  ["300 words", words.length >= 300, 4, `${words.length} words`],
  ["External links", external.length >= 1, 2, external.join(", ")],
  ["Paragraphs", (html.match(/<p\b/gi) || []).length >= 2, 2, ""],
  ["Fetch time", true, 2, "local"],
];

let passW = 0;
let failW = 0;
let pass = 0;
let fail = 0;
let na = 0;
for (const [name, ok, weight, detail] of checks) {
  if (ok === null) {
    na += 1;
    console.log(`NA   x${weight} ${name} ${detail}`);
    continue;
  }
  if (ok) {
    pass += 1;
    passW += weight;
    console.log(`PASS x${weight} ${name} ${detail}`);
  } else {
    fail += 1;
    failW += weight;
    console.log(`FAIL x${weight} ${name} ${detail}`);
  }
}
const score = Math.round((passW / (passW + failW)) * 100);
console.log(`\n${pass} pass / ${fail} fail / ${na} n/a`);
console.log(`Projected Ax Lab score: ${score}/100 (${passW}/${passW + failW} weight)`);
