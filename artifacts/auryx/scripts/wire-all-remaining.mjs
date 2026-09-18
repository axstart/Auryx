import fs from "fs";

function addI18n(s, hookLine) {
  if (s.includes("useI18n")) return s;
  if (!s.includes('from "@/i18n"')) {
    const lines = s.split("\n");
    let last = 0;
    for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
    lines.splice(last + 1, 0, 'import { useI18n, langHref } from "@/i18n";');
    s = lines.join("\n");
  }
  return s.replace(hookLine.find, hookLine.insert);
}

// LEARN
{
  let s = fs.readFileSync("src/pages/learn.tsx", "utf8");
  s = addI18n(s, {
    find: "export default function LearnPage() {\n  const [activeCategory, setActiveCategory] = useState<string | null>(null);",
    insert:
      "export default function LearnPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.learn;\n  const [activeCategory, setActiveCategory] = useState<string | null>(null);",
  });
  const pairs = [
    ['Peptide Encyclopedia', "{copy.heroEyebrow}"],
    ["Every peptide.", "{copy.heroTitleBefore}"],
    ["Explained.", "{copy.heroTitleEm}"],
    [">All</button>", ">{copy.allCategories}</button>"],
  ];
  for (const [a, b] of pairs) {
    if (s.includes(a)) s = s.replace(a, b);
    else console.warn("learn miss", a);
  }
  // Only replace first two Find My Protocol in hero/cta carefully via count
  let n = 0;
  s = s.replace(/Find My Protocol/g, (m) => {
    n++;
    return n <= 3 ? "{copy.ctaProtocol}" : m;
  });
  s = s.replace("Browse All Peptides", "{copy.ctaShop}");
  s = s.replace(/\{FAQS\.map/g, "{copy.faqs.map");
  s = s.replace(/FAQS\.map\(\(f\)/g, "copy.faqs.map((f)");
  // SEO titles
  s = s.replace(
    /title: "Peptide Therapy Education \| Auryx Learn"/g,
    "title: copy.seoTitle",
  );
  s = s.replace(
    /name: "Peptide Therapy Education \| Auryx Learn"/g,
    "name: copy.seoTitle",
  );
  s = s.replace(/\}, \[\]\);/, "}, [lang, copy]);");
  // langHref for main CTAs
  s = s.replace(/href="\/protocol-finder"/g, 'href={langHref(lang, "/protocol-finder")}');
  s = s.replace(/href="\/shop"/g, 'href={langHref(lang, "/shop")}');
  s = s.replace(/href=\{`\/shop\/\$\{/g, 'href={langHref(lang, `/shop/${');
  // category labels in UI where {cat} shown as heading
  s = s.replace(
    /<h2 className="font-serif text-2xl md:text-3xl text-\[#111\]">\{cat\}<\/h2>/,
    `<h2 className="font-serif text-2xl md:text-3xl text-[#111]">{copy.categoryLabels[cat] ?? cat}</h2>`,
  );
  fs.writeFileSync("src/pages/learn.tsx", s);
  console.log("learn ok");
}

// CHECKOUT
{
  let s = fs.readFileSync("src/pages/checkout.tsx", "utf8");
  s = addI18n(s, {
    find: "export default function CheckoutPage() {",
    insert:
      "export default function CheckoutPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.checkout;",
  });
  const pairs = [
    ['title: "Checkout | Auryx"', "title: copy.seoTitle"],
    [">Checkout</h1>", ">{copy.title}</h1>"],
    ["Contact Information", "{copy.contactInfo}"],
    ["Order Summary", "{copy.orderSummary}"],
    ["Continue Shopping", "{copy.continueShopping}"],
    ["Your cart is empty", "{copy.emptyCart}"],
    ["Back to Shop", "{copy.backToShop}"],
    ["Shipping Address", "{copy.shippingAddress}"],
    ["Promo code", "{copy.promoPlaceholder}"],
  ];
  for (const [a, b] of pairs) {
    if (s.includes(a)) s = s.split(a).join(b);
    else console.warn("checkout miss", a);
  }
  s = s.replace(/href="\/shop"/g, 'href={langHref(lang, "/shop")}');
  fs.writeFileSync("src/pages/checkout.tsx", s);
  console.log("checkout ok");
}

// CHECKOUT SUCCESS
{
  let s = fs.readFileSync("src/pages/checkout-success.tsx", "utf8");
  s = addI18n(s, {
    find: "export default function CheckoutSuccessPage() {",
    insert:
      "export default function CheckoutSuccessPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.checkoutSuccess;",
  });
  // Replace GOALS and MEDICAL_HISTORY constants with copy references at use site
  s = s.replace(/\{GOALS\.map/g, "{copy.goals.map");
  s = s.replace(/\{MEDICAL_HISTORY\.map/g, "{copy.conditions.map");
  // Common UI
  const pairs = [
    ["Continue Shopping", "{copy.continueShopping}"],
    ["Start Intake Form", "{copy.startIntake}"],
    ["Skip for Now", "{copy.skipForNow}"],
    ["Submit Intake", "{copy.submit}"],
    ["Submitting…", "{copy.submitting}"],
    ["Submitting...", "{copy.submitting}"],
  ];
  for (const [a, b] of pairs) {
    if (s.includes(a)) s = s.split(a).join(b);
    else console.warn("success miss", a);
  }
  s = s.replace(/href="\/shop"/g, 'href={langHref(lang, "/shop")}');
  fs.writeFileSync("src/pages/checkout-success.tsx", s);
  console.log("checkout-success ok");
}

// CONSULTATION MODAL
{
  let s = fs.readFileSync("src/components/ConsultationModal.tsx", "utf8");
  s = addI18n(s, {
    find: "export function ConsultationModal(",
    insert:
      "export function ConsultationModal(", // keep, inject inside
  });
  // Inject inside component body
  if (!s.includes("dict.consultation")) {
    s = s.replace(
      /export function ConsultationModal\((\{[\s\S]*?\})\) \{\n/,
      (m) => m + "  const { dict } = useI18n();\n  const copy = dict.consultation;\n",
    );
    if (!s.includes('from "@/i18n"')) {
      const lines = s.split("\n");
      let last = 0;
      for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
      lines.splice(last + 1, 0, 'import { useI18n } from "@/i18n";');
      s = lines.join("\n");
    }
  }
  // Replace INTEREST_OPTIONS usage
  s = s.replace(/INTEREST_OPTIONS\.map/g, "copy.interestOptions.map");
  s = s.replace(/STEPS\.map/g, "copy.steps.map((label, i) => ({ number: i + 1, label })).map");
  // This STEPS replace might be too clever - check
  fs.writeFileSync("src/components/ConsultationModal.tsx", s);
  console.log("consultation ok");
}

// PROTOCOL CONTINUATION
{
  let s = fs.readFileSync("src/components/ProtocolContinuationModal.tsx", "utf8");
  if (!s.includes("useI18n")) {
    const lines = s.split("\n");
    let last = 0;
    for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
    lines.splice(last + 1, 0, 'import { useI18n } from "@/i18n";');
    s = lines.join("\n");
    s = s.replace(
      /export function ProtocolContinuationModal\((\{[\s\S]*?\})\) \{\n/,
      (m) => m + "  const { dict } = useI18n();\n  const copy = dict.protocolContinuation;\n",
    );
  }
  s = s.replace(/SCREENING_QUESTIONS\.map/g, "copy.screeningQuestions.map");
  s = s.replace(/Continue My Protocol/g, "{copy.title}");
  fs.writeFileSync("src/components/ProtocolContinuationModal.tsx", s);
  console.log("protocolContinuation ok");
}

// CHAT WIDGET
{
  let s = fs.readFileSync("src/components/ChatWidget.tsx", "utf8");
  if (!s.includes("useI18n")) {
    const lines = s.split("\n");
    let last = 0;
    for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
    lines.splice(last + 1, 0, 'import { useI18n } from "@/i18n";');
    s = lines.join("\n");
  }
  if (!s.includes("dict.chat")) {
    s = s.replace(
      /export default function ChatWidget\(\) \{\n/,
      "export default function ChatWidget() {\n  const { dict } = useI18n();\n  const copy = dict.chat;\n",
    );
  }
  s = s.replace(/SUGGESTED\.map/g, "copy.suggested.map");
  s = s.replace(/Auryx Concierge/g, "{copy.title}");
  s = s.replace(/Start Conversation/g, "{copy.intakeSubmit}");
  s = s.replace(/Type your message…/g, "{copy.placeholder}");
  s = s.replace(/Type your message\.\.\./g, "{copy.placeholder}");
  fs.writeFileSync("src/components/ChatWidget.tsx", s);
  console.log("chat ok");
}

// PATIENT ASSESSMENT — inject + key step strings
{
  let s = fs.readFileSync("src/components/PatientAssessment.tsx", "utf8");
  if (!s.includes("useI18n")) {
    const lines = s.split("\n");
    let last = 0;
    for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
    lines.splice(last + 1, 0, 'import { useI18n } from "@/i18n";');
    s = lines.join("\n");
  }
  // Helper at module level is awkward for hooks — inject into each Step* and main export
  const stepFns = [
    "function StepKnowledge",
    "function StepCurrentPeptides",
    "function StepProtocolIntent",
    "function StepGoal",
    "function StepEnergySleep",
    "function StepActivityLevel",
    "function StepIntent",
    "function StepMedical",
    "function LoadingScreen",
    "function WaiverModal",
    "function MedicalResultScreen",
    "function AIResultScreen",
    "function ErrorResultScreen",
    "export function PatientAssessment",
  ];
  for (const fn of stepFns) {
    const re = new RegExp(
      `(${fn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^{]*\\{)\\n`,
    );
    if (re.test(s) && !s.includes(`/*i18n:${fn}*/`)) {
      s = s.replace(re, `$1\n  /*i18n:${fn}*/\n  const { dict } = useI18n();\n  const copy = dict.patientAssessment;\n`);
    }
  }
  // Replace common Continue button
  s = s.replace(/>Continue</g, ">{copy.continue}<");
  s = s.replace(
    /How familiar are you with peptide therapy\?/g,
    "{copy.knowledge.headline}",
  );
  s = s.replace(
    /This helps us tailor the information and guidance we share with you\./g,
    "{copy.knowledge.sub}",
  );
  s = s.replace(/New to peptides/g, '{copy.knowledge.options[0].label}');
  s = s.replace(
    /I've heard about them but don't know much yet\./g,
    "{copy.knowledge.options[0].desc}",
  );
  s = s.replace(/Some knowledge/g, "{copy.knowledge.options[1].label}");
  s = s.replace(/Experienced/g, "{copy.knowledge.options[2].label}");
  s = s.replace(/Analyse My Profile/g, "{copy.analyseProfile}");
  s = s.replace(/Prefer not to share — skip this step/g, "{copy.skipPreferNot}");
  s = s.replace(/Book Your Private Consultation/g, "{copy.results?.ctaConsult ?? 'Book Your Private Consultation'}");
  s = s.replace(/>Start Over</g, ">{copy.results?.startOver ?? 'Start Over'}<");

  fs.writeFileSync("src/components/PatientAssessment.tsx", s);
  console.log("patientAssessment ok");
}

console.log("all phase B done");
