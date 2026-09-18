/**
 * Wire remaining pages/components to i18n dicts.
 * Pattern matches blog.tsx / our-method.tsx: useI18n, langHref, applyPageSeo, path.
 */
import fs from "fs";
import path from "path";

const root = "src";

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}
function write(rel, s) {
  fs.writeFileSync(path.join(root, rel), s);
  console.log("OK", rel);
}
function ensureImport(s, importLine) {
  if (s.includes(importLine)) return s;
  // after last import
  const lines = s.split("\n");
  let lastImport = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImport = i;
  }
  lines.splice(lastImport + 1, 0, importLine);
  return lines.join("\n");
}

// ── blog-post.tsx ───────────────────────────────────────────────────
{
  let s = read("pages/blog-post.tsx");
  if (!s.includes("useI18n")) {
    s = ensureImport(s, 'import { useI18n, langHref } from "@/i18n";');
    // Inside BlogPostPage function, after slug/post
    s = s.replace(
      /export default function BlogPostPage\(\) \{\n  const \{ slug \} = useParams/,
      `export default function BlogPostPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.blog;\n  const { slug } = useParams`,
    );
    s = s.replace(
      /}, \[post\]\);/,
      `}, [post, lang, copy]);`,
    );
    s = s.replace(
      `<p className="text-white/40 mb-4">Article not found.</p>
          <Link href="/blog" className="text-[#C9A844] hover:underline text-sm">
            ← Back to Journal
          </Link>`,
      `<p className="text-white/40 mb-4">{copy.postNotFound}</p>
          <Link href={langHref(lang, "/blog")} className="text-[#C9A844] hover:underline text-sm">
            ← {copy.backToJournal}
          </Link>`,
    );
    s = s.replace(
      /href="\/blog"\n\s+className="inline-flex items-center gap-1\.5 text-white\/45[\s\S]*?<ArrowLeft className="w-3 h-3" \/> AURYX Journal/,
      `href={langHref(lang, "/blog")}
                className="inline-flex items-center gap-1.5 text-white/45 hover:text-[#C9A844] text-[10px] uppercase tracking-widest font-semibold mb-6 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> {copy.journalName}`,
    );
    s = s.replace(
      /\{post\.category\}/,
      `{copy.categories[post.category] ?? post.category}`,
    );
    s = s.replace(
      /\{post\.readTime\} min read/,
      `{copy.minReadLabel.replace("{n}", String(post.readTime))}`,
    );
    s = s.replace(
      /Physician and longevity medicine specialist at AURYX\. Focused on evidence-based peptide protocols and precision metabolic health\./,
      `{copy.authorBio}`,
    );
    s = s.replace(
      /Ready to Start Your Protocol\?/,
      `{copy.postCtaEyebrow}`,
    );
    s = s.replace(
      /Book a private\{\" \"\}\n\s+<em className="not-italic text-\[#C9A844\]">consultation\.<\/em>/,
      `{copy.postCtaTitleBefore}{" "}
            <em className="not-italic text-[#C9A844]">{copy.postCtaTitleEm}</em>`,
    );
    // fallback if different formatting
    s = s.replace(
      /Book a private\s+<em className="not-italic text-\[#C9A844\]">consultation\.<\/em>/,
      `{copy.postCtaTitleBefore}{" "}
            <em className="not-italic text-[#C9A844]">{copy.postCtaTitleEm}</em>`,
    );
    s = s.replace(
      /Our clinical team will design a protocol matched to your biology, goals, and lifestyle — physician-supervised from first order to ongoing optimization\./,
      `{copy.postCtaBody}`,
    );
    s = s.replace(
      /href="\/protocol-finder"/,
      `href={langHref(lang, "/protocol-finder")}`,
    );
    s = s.replace(
      /Find My Protocol <ArrowRight/,
      `{copy.postCtaProtocol} <ArrowRight`,
    );
    s = s.replace(
      /href="\/blog"\n\s+className="inline-flex items-center justify-center gap-2 border/,
      `href={langHref(lang, "/blog")}
              className="inline-flex items-center justify-center gap-2 border`,
    );
    s = s.replace(/Read More Articles/, `{copy.postCtaMore}`);
    s = s.replace(
      /<strong className="text-\[#111\]\/45">Medical Disclaimer:<\/strong> This article is for educational purposes only[\s\S]*?peptide protocol\./,
      `<strong className="text-[#111]/45">{copy.medicalDisclaimerLabel}</strong> {copy.medicalDisclaimer}`,
    );
    write("pages/blog-post.tsx", s);
  } else console.log("skip blog-post");
}

// ── learn.tsx chrome ────────────────────────────────────────────────
{
  let s = read("pages/learn.tsx");
  if (!s.includes("useI18n")) {
    s = ensureImport(s, 'import { useI18n, langHref } from "@/i18n";');
    s = s.replace(
      /export default function LearnPage\(\) \{\n  const \[activeCategory/,
      `export default function LearnPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.learn;\n  const [activeCategory`,
    );
    s = s.replace(
      /return applyPageSeo\(\{\n\s+title: "Peptide Encyclopedia[\s\S]*?path: "\/learn",/,
      `return applyPageSeo({\n      title: copy.seoTitle,\n      description: copy.seoDescription,\n      path: "/learn",`,
    );
    // If applyPageSeo vs applyPageSeo
    s = s.replace(
      /title: "Peptide Therapy Education \| Auryx Learn"/,
      "title: copy.seoTitle",
    );
    s = s.replace(
      /description:\n\s+"Your complete peptide therapy guide[\s\S]*?at Auryx's telehealth peptide clinic\."/,
      "description: copy.seoDescription",
    );
    s = s.replace(/}, \[\]\);/, "}, [lang, copy]);");
    s = s.replace(
      /alt="AURYX peptide encyclopedia[^"]*"/,
      "alt={copy.heroAlt}",
    );
    s = s.replace(
      />Peptide Encyclopedia<\/p>/,
      ">{copy.heroEyebrow}</p>",
    );
    s = s.replace(
      /Every peptide\.\{\" \"\}\n\s+<em className="not-italic text-\[#C9A844\]">Explained\.<\/em>/,
      `{copy.heroTitleBefore}{" "}
              <em className="not-italic text-[#C9A844]">{copy.heroTitleEm}</em>`,
    );
    s = s.replace(
      /A scientific reference guide to every compound in the AURYX catalog[\s\S]*?research purposes only\./,
      `{copy.heroBody}`,
    );
    s = s.replace(
      /href="\/protocol-finder"\n\s+className="flex items-center justify-center gap-2 bg-\[#C9A844\][\s\S]*?>\n\s+Find My Protocol\n\s+<\/Link>/,
      `href={langHref(lang, "/protocol-finder")}
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                {copy.ctaProtocol}
              </Link>`,
    );
    s = s.replace(
      /href="\/shop"\n\s+className="flex items-center justify-center gap-2 border border-white\/20[\s\S]*?>\n\s+Browse All Peptides\n\s+<\/Link>/,
      `href={langHref(lang, "/shop")}
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                {copy.ctaShop}
              </Link>`,
    );
    s = s.replace(
      /26 compounds · 6 categories · Physician-reviewed/,
      `{copy.heroMeta.replace("{count}", String(PEPTIDES.length)).replace("{cats}", String(CATEGORIES.length))}`,
    );
    s = s.replace(/>All<\/button>/, ">{copy.allCategories}</button>");
    // Category label display
    s = s.replace(
      /\{CATEGORIES\.map\(cat => \(\n\s+<button\n\s+key=\{cat\}\n\s+onClick=\{ \(\) => setActiveCategory\(cat === activeCategory \? null : cat\) \}/,
      `{CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}`,
    );
    // In category filter button children - replace {cat} with label when it's the only content
    // FAQ section
    s = s.replace(/\{FAQS\.map/g, "{(copy.faqs ?? FAQS).map");
    // Actually learn dict has faqs with q,a - page might use FAQS constant. Replace FAQS usage in render.
    write("pages/learn.tsx", s);
  } else console.log("skip learn");
}

console.log("phase1 done");
