import fs from "fs";

let s = fs.readFileSync("src/pages/blog-post.tsx", "utf8");

const reps = [
  [
    `  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Article not found.</p>
          <Link href="/blog" className="text-[#C9A844] hover:underline text-sm">
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }`,
    `  }, [post, lang, copy]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">{copy.postNotFound}</p>
          <Link href={langHref(lang, "/blog")} className="text-[#C9A844] hover:underline text-sm">
            ← {copy.backToJournal}
          </Link>
        </div>
      </div>
    );
  }`,
  ],
  [
    `<ArrowLeft className="w-3 h-3" /> AURYX Journal`,
    `<ArrowLeft className="w-3 h-3" /> {copy.journalName}`,
  ],
  [
    `href="/blog"
                className="inline-flex items-center gap-1.5 text-white/45 hover:text-[#C9A844] text-[10px] uppercase tracking-widest font-semibold mb-6 transition-colors"`,
    `href={langHref(lang, "/blog")}
                className="inline-flex items-center gap-1.5 text-white/45 hover:text-[#C9A844] text-[10px] uppercase tracking-widest font-semibold mb-6 transition-colors"`,
  ],
  [
    `{post.readTime} min read`,
    `{copy.minReadLabel.replace("{n}", String(post.readTime))}`,
  ],
  [
    `Physician and longevity medicine specialist at AURYX. Focused on evidence-based peptide protocols and precision metabolic health.`,
    `{copy.authorBio}`,
  ],
  [
    `Ready to Start Your Protocol?`,
    `{copy.postCtaEyebrow}`,
  ],
  [
    `Book a private{" "}
            <em className="not-italic text-[#C9A844]">consultation.</em>`,
    `{copy.postCtaTitleBefore}{" "}
            <em className="not-italic text-[#C9A844]">{copy.postCtaTitleEm}</em>`,
  ],
  [
    `Our clinical team will design a protocol matched to your biology, goals, and lifestyle — physician-supervised from first order to ongoing optimization.`,
    `{copy.postCtaBody}`,
  ],
  [
    `href="/protocol-finder"`,
    `href={langHref(lang, "/protocol-finder")}`,
  ],
  [
    `Find My Protocol <ArrowRight`,
    `{copy.postCtaProtocol} <ArrowRight`,
  ],
  [
    `href="/blog"
              className="inline-flex items-center justify-center gap-2 border border-white/20`,
    `href={langHref(lang, "/blog")}
              className="inline-flex items-center justify-center gap-2 border border-white/20`,
  ],
  [
    `Read More Articles`,
    `{copy.postCtaMore}`,
  ],
];

for (const [a, b] of reps) {
  if (!s.includes(a)) {
    console.warn("MISS:", a.slice(0, 70).replace(/\n/g, " "));
  } else {
    s = s.split(a).join(b);
    console.log("OK:", a.slice(0, 40).replace(/\n/g, " "));
  }
}

// medical disclaimer — fuzzy
s = s.replace(
  /<strong className="text-\[#111\]\/45">Medical Disclaimer:<\/strong>[^<]*/,
  `<strong className="text-[#111]/45">{copy.medicalDisclaimerLabel}</strong> {copy.medicalDisclaimer}`,
);

// category badge
s = s.replace(
  /(\{)\s*post\.category\s*(\}\s*<\/span>)/,
  `$1copy.categories[post.category] ?? post.category$2`,
);

fs.writeFileSync("src/pages/blog-post.tsx", s);
console.log("blog-post done");
