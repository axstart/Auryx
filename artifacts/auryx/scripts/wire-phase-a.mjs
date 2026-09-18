import fs from "fs";

function ensureImport(s, line) {
  if (s.includes(line) || s.includes('from "@/i18n"')) {
    if (!s.includes("useI18n")) {
      // add to existing i18n import if any
    }
    if (s.includes('from "@/i18n"')) return s;
  }
  const lines = s.split("\n");
  let last = 0;
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
  lines.splice(last + 1, 0, line);
  return lines.join("\n");
}

function replaceAll(s, pairs) {
  for (const [a, b] of pairs) {
    if (!s.includes(a)) console.warn("MISS:", JSON.stringify(a).slice(0, 80));
    else s = s.split(a).join(b);
  }
  return s;
}

// ── LEARN ───────────────────────────────────────────────────────────
{
  let s = fs.readFileSync("src/pages/learn.tsx", "utf8");
  s = ensureImport(s, 'import { useI18n, langHref } from "@/i18n";');
  if (!s.includes("const copy = dict.learn")) {
    s = s.replace(
      "export default function LearnPage() {\n  const [activeCategory, setActiveCategory] = useState<string | null>(null);",
      `export default function LearnPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.learn;\n  const [activeCategory, setActiveCategory] = useState<string | null>(null);`,
    );
  }
  s = replaceAll(s, [
    [
      `title: "Peptide Therapy Education | Auryx Learn",
      description:
        "Your complete peptide therapy guide — how peptides work, what BPC-157, semaglutide, CJC-1295 ipamorelin, and NAD+ do, and how to start a physician-supervised protocol at Auryx's telehealth peptide clinic.",`,
      `title: copy.seoTitle,
      description: copy.seoDescription,`,
    ],
    [`name: "Peptide Therapy Education | Auryx Learn",`, `name: copy.seoTitle,`],
    [`}, []);`, `}, [lang, copy]);`],
    [`Peptide Encyclopedia`, `{copy.heroEyebrow}`],
    [
      `Every peptide.{" "}
              <em className="not-italic text-[#C9A844]">Explained.</em>`,
      `{copy.heroTitleBefore}{" "}
              <em className="not-italic text-[#C9A844]">{copy.heroTitleEm}</em>`,
    ],
  ]);
  // hero body - find paragraph after h1
  s = s.replace(
    /<p className="text-white\/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">\s*A scientific reference guide[\s\S]*?research purposes only\.\s*<\/p>/,
    `<p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">\n              {copy.heroBody}\n            </p>`,
  );
  s = s.replace(
    /href="\/protocol-finder"\n\s+className="flex items-center justify-center gap-2 bg-\[#C9A844\][\s\S]*?Find My Protocol\n\s+<\/Link>/,
    `href={langHref(lang, "/protocol-finder")}
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                {copy.ctaProtocol}
              </Link>`,
  );
  s = s.replace(
    /href="\/shop"\n\s+className="flex items-center justify-center gap-2 border border-white\/20[\s\S]*?Browse All Peptides\n\s+<\/Link>/,
    `href={langHref(lang, "/shop")}
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                {copy.ctaShop}
              </Link>`,
  );
  s = s.replace(
    `26 compounds · 6 categories · Physician-reviewed`,
    `{copy.heroMeta.replace("{count}", String(PEPTIDES.length)).replace("{cats}", String(CATEGORIES.length))}`,
  );
  s = s.replace(`>All</button>`, `>{copy.allCategories}</button>`);
  // category display labels in filter
  s = s.replace(
    /\{CATEGORIES\.map\(cat => \(\s*<button\s+key=\{cat\}/,
    `{CATEGORIES.map(cat => (
              <button
                key={cat}`,
  );
  // Replace category text in buttons - the child text `{cat}` when used as label
  // FAQ: use copy.faqs
  s = s.replace(
    `mainEntity: FAQS.map((f) => ({`,
    `mainEntity: copy.faqs.map((f) => ({`,
  );
  s = s.replace(`{FAQS.map((faq, i) => (`, `{(copy.faqs).map((faq, i) => (`);
  // labels for sections
  s = s.replace(/>How It Works</g, `>{copy.mechanism}<`);
  s = s.replace(/>Research Properties</g, `>{copy.benefits}<`);
  s = s.replace(/Research note:/g, `{copy.researchNote}:`);
  s = s.replace(/>Rx Required</g, `>{copy.rxBadge}<`);
  s = s.replace(/>Shop </g, `>{copy.viewProduct} `);
  // bottom CTA - approximate
  s = s.replace(/Find My Protocol <ArrowRight/g, `{copy.ctaButton} <ArrowRight`);

  fs.writeFileSync("src/pages/learn.tsx", s);
  console.log("learn wired");
}

// ── CHECKOUT ────────────────────────────────────────────────────────
{
  let s = fs.readFileSync("src/pages/checkout.tsx", "utf8");
  s = ensureImport(s, 'import { useI18n, langHref } from "@/i18n";');
  if (!s.includes("dict.checkout")) {
    s = s.replace(
      /export default function CheckoutPage\(\) \{/,
      `export default function CheckoutPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.checkout;`,
    );
  }
  // RESEARCH_OPTIONS -> copy.researchOptions
  s = s.replace(
    /const RESEARCH_OPTIONS = \[[\s\S]*?\];/,
    `/* research options from i18n */`,
  );
  s = replaceAll(s, [
    [`title: "Checkout | Auryx"`, `title: copy.seoTitle`],
    [
      `description: "Complete your Auryx order. Secure checkout for research-grade peptide compounds."`,
      `description: copy.seoDescription`,
    ],
    [`>Checkout</h1>`, `>{copy.title}</h1>`],
    [`Back to Shop`, `{copy.backToShop}`],
    [`>Back<`, `>{copy.back}<`],
    [`details: "Details"`, `details: copy.stepDetails`],
    [`verify: "Verify Email"`, `verify: copy.stepVerify`],
    [`payment: "Payment"`, `payment: copy.stepPayment`],
    [`Contact Information`, `{copy.contactInfo}`],
    [`Full Name *`, `{copy.fullName}`],
    [`Email Address *`, `{copy.email}`],
    [`Phone (optional)`, `{copy.phone}`],
    [
      `A verification code will be sent to this address before payment.`,
      `{copy.emailVerifyHint}`,
    ],
    [`Research Application`, `{copy.researchField}`],
    [`Select research application…`, `{copy.researchPlaceholder}`],
    [
      `Research-grade compounds are sold strictly for legitimate scientific research and are not intended for human consumption.`,
      `{copy.researchDisclaimer}`,
    ],
    [`Shipping Address`, `{copy.shippingAddress}`],
    [`Order Summary`, `{copy.orderSummary}`],
    [`Subtotal`, `{copy.subtotal}`],
    [`Shipping`, `{copy.shipping}`],
    [`>Free<`, `>{copy.shippingFree}<`],
    [`Discount`, `{copy.discount}`],
    [`>Total<`, `>{copy.total}<`],
    [`Promo code`, `{copy.promoPlaceholder}`],
    [`>Apply<`, `>{copy.apply}<`],
    [`Enter a promo code.`, `{copy.promoRequired}`],
    [`Invalid or expired promo code.`, `{copy.promoInvalid}`],
    [`Promo code applied.`, `{copy.promoApplied}`],
    [
      `Could not validate the promo code. Please try again.`,
      `{copy.promoError}`,
    ],
    [`Your cart is empty.`, `{copy.emptyCart}`],
    [`Continue Shopping`, `{copy.continueShopping}`],
  ]);
  // research options map
  s = s.replace(
    /\{RESEARCH_OPTIONS\.map/,
    `{(copy.researchOptions).map`,
  );
  s = s.replace(
    /I acknowledge that research-grade compounds[\s\S]*?human consumption\./,
    `{copy.researchAck}`,
  );
  // place order button
  s = s.replace(
    /\{loading \? "Processing\.\.\." : `Complete Order — \$\{/,
    `{loading ? copy.processing : copy.completeOrder.replace("{total}", \`$\${`,
  );
  // This last replace may be fragile - leave if miss

  fs.writeFileSync("src/pages/checkout.tsx", s);
  console.log("checkout wired");
}

console.log("phase A done");
