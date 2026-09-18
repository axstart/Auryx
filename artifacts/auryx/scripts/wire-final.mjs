import fs from "fs";

function injectImport(s) {
  if (s.includes('from "@/i18n"')) return s;
  const lines = s.split("\n");
  let last = 0;
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
  lines.splice(last + 1, 0, 'import { useI18n, langHref } from "@/i18n";');
  return lines.join("\n");
}

function injectImportHookOnly(s) {
  if (s.includes('from "@/i18n"')) return s;
  const lines = s.split("\n");
  let last = 0;
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) last = i;
  lines.splice(last + 1, 0, 'import { useI18n } from "@/i18n";');
  return lines.join("\n");
}

// LEARN
{
  let s = fs.readFileSync("src/pages/learn.tsx", "utf8");
  s = injectImport(s);
  if (!s.includes("dict.learn")) {
    s = s.replace(
      "export default function LearnPage() {\n  const [activeCategory, setActiveCategory] = useState<string | null>(null);",
      "export default function LearnPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.learn;\n  const [activeCategory, setActiveCategory] = useState<string | null>(null);",
    );
  }
  s = s.replaceAll("Peptide Encyclopedia", "{copy.heroEyebrow}");
  s = s.replace("Every peptide.", "{copy.heroTitleBefore}");
  s = s.replace("Explained.", "{copy.heroTitleEm}");
  s = s.replaceAll("Find My Protocol", "{copy.ctaProtocol}");
  s = s.replaceAll("Browse All Peptides", "{copy.ctaShop}");
  s = s.replace(">All</button>", ">{copy.allCategories}</button>");
  s = s.replaceAll("{FAQS.map", "{copy.faqs.map");
  s = s.replaceAll("FAQS.map(", "copy.faqs.map(");
  s = s.replaceAll('href="/protocol-finder"', 'href={langHref(lang, "/protocol-finder")}');
  s = s.replaceAll('href="/shop"', 'href={langHref(lang, "/shop")}');
  // seo
  s = s.replace(
    /title: "Peptide Therapy Education \| Auryx Learn"/g,
    "title: copy.seoTitle",
  );
  s = s.replace(
    /name: "Peptide Therapy Education \| Auryx Learn"/g,
    "name: copy.seoTitle",
  );
  s = s.replace("}, []);", "}, [lang, copy]);");
  // category label in filter chips - keep English keys for data, display labels
  s = s.replace(
    /(\{CATEGORIES\.map\(cat => \(\s*<button[^>]*>)\s*\{cat\}/,
    "$1{copy.categoryLabels[cat] ?? cat}",
  );
  fs.writeFileSync("src/pages/learn.tsx", s);
  console.log("learn");
}

// CHECKOUT
{
  let s = fs.readFileSync("src/pages/checkout.tsx", "utf8");
  s = injectImport(s);
  if (!s.includes("dict.checkout")) {
    s = s.replace(
      "export default function CheckoutPage() {",
      "export default function CheckoutPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.checkout;",
    );
  }
  s = s.replace('title: "Checkout | Auryx"', "title: copy.seoTitle");
  s = s.replaceAll("Your cart is empty.", "{copy.emptyCart}");
  s = s.replaceAll("Contact Information", "{copy.contactInfo}");
  s = s.replaceAll("Order Summary", "{copy.orderSummary}");
  s = s.replaceAll("Continue Shopping", "{copy.continueShopping}");
  s = s.replaceAll(">Checkout</h1>", ">{copy.title}</h1>");
  s = s.replaceAll('href="/shop"', 'href={langHref(lang, "/shop")}');
  fs.writeFileSync("src/pages/checkout.tsx", s);
  console.log("checkout");
}

// CHECKOUT SUCCESS
{
  let s = fs.readFileSync("src/pages/checkout-success.tsx", "utf8");
  s = injectImport(s);
  if (!s.includes("dict.checkoutSuccess")) {
    s = s.replace(
      "export default function CheckoutSuccessPage() {",
      "export default function CheckoutSuccessPage() {\n  const { lang, dict } = useI18n();\n  const copy = dict.checkoutSuccess;",
    );
  }
  s = s.replaceAll("{GOALS.map", "{copy.goals.map");
  s = s.replaceAll("{MEDICAL_HISTORY_OPTIONS.map", "{copy.conditions.map");
  s = s.replaceAll("Continue Shopping", "{copy.continueShopping}");
  s = s.replaceAll('href="/shop"', 'href={langHref(lang, "/shop")}');
  // SEO if present
  s = s.replace(/title: "Order Confirmed[^"]*"/, "title: copy.seoTitle");
  fs.writeFileSync("src/pages/checkout-success.tsx", s);
  console.log("checkout-success");
}

// CONSULTATION
{
  let s = fs.readFileSync("src/components/ConsultationModal.tsx", "utf8");
  s = injectImportHookOnly(s);
  if (!s.includes("dict.consultation")) {
    s = s.replace(
      /export function ConsultationModal\([^)]*\) \{\n/,
      (m) => m + "  const { dict } = useI18n();\n  const copy = dict.consultation;\n",
    );
  }
  s = s.replaceAll("INTEREST_OPTIONS.map", "copy.interestOptions.map");
  // STEPS is array of {number, label} - dict.steps is string[]
  // Keep STEPS for structure but localize labels via copy.steps[i]
  s = s.replace(
    /\{STEPS\.map\(\(s, i\) => \{/,
    `{STEPS.map((s, i) => {\n        const stepLabel = copy.steps[i] ?? s.label;`,
  );
  // Use stepLabel where s.label is rendered - careful
  s = s.replace(/\{s\.label\}/g, "{stepLabel}");
  s = s.replaceAll("Submitting...", "{copy.submitting}");
  s = s.replaceAll("Submit Request", "{copy.submit}");
  fs.writeFileSync("src/components/ConsultationModal.tsx", s);
  console.log("consultation");
}

// PROTOCOL CONTINUATION
{
  let s = fs.readFileSync("src/components/ProtocolContinuationModal.tsx", "utf8");
  s = injectImportHookOnly(s);
  if (!s.includes("dict.protocolContinuation")) {
    s = s.replace(
      /export function ProtocolContinuationModal\([^)]*\) \{\n/,
      (m) => m + "  const { dict } = useI18n();\n  const copy = dict.protocolContinuation;\n",
    );
  }
  // Keep const for structure but prefer copy at call sites
  s = s.replaceAll("SCREENING_QUESTIONS.map", "copy.screeningQuestions.map");
  s = s.replaceAll("SCREENING_QUESTIONS[", "copy.screeningQuestions[");
  s = s.replaceAll("SCREENING_QUESTIONS.length", "copy.screeningQuestions.length");
  s = s.replaceAll("Continue My Protocol", "{copy.title}");
  s = s.replaceAll("Submitting...", "{copy.submitting}");
  s = s.replace("Submit Intake", "{copy.submit}");
  fs.writeFileSync("src/components/ProtocolContinuationModal.tsx", s);
  console.log("protocolContinuation");
}

// CHAT
{
  let s = fs.readFileSync("src/components/ChatWidget.tsx", "utf8");
  s = injectImportHookOnly(s);
  if (!s.includes("dict.chat")) {
    s = s.replace(
      "export default function ChatWidget() {\n",
      "export default function ChatWidget() {\n  const { dict } = useI18n();\n  const copy = dict.chat;\n",
    );
  }
  // IntakeForm is nested — needs its own hook
  if (!s.includes("dict.chat") || true) {
    s = s.replace(
      "function IntakeForm({ onSubmit }: { onSubmit: (info: UserInfo) => void }) {\n",
      "function IntakeForm({ onSubmit }: { onSubmit: (info: UserInfo) => void }) {\n  const { dict } = useI18n();\n  const copy = dict.chat;\n",
    );
  }
  s = s.replaceAll("SUGGESTED.map", "copy.suggested.map");
  s = s.replaceAll("Start Conversation", "{copy.intakeSubmit}");
  s = s.replace(
    'placeholder="Your name *"',
    "placeholder={copy.intakeName}",
  );
  s = s.replace(
    'placeholder="Email address"',
    "placeholder={copy.intakeEmail}",
  );
  s = s.replace(
    'placeholder="Phone number"',
    "placeholder={copy.intakePhone}",
  );
  s = s.replace(
    /\{userInfo \? `Auryx Concierge · Hi, \$\{firstName\}` : "Auryx AI Concierge"\}/,
    `{userInfo ? \`\${copy.title} · Hi, \${firstName}\` : copy.title}`,
  );
  fs.writeFileSync("src/components/ChatWidget.tsx", s);
  console.log("chat");
}

// PATIENT ASSESSMENT — inject into main + step components
{
  let s = fs.readFileSync("src/components/PatientAssessment.tsx", "utf8");
  s = injectImportHookOnly(s);
  const targets = [
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
  for (const t of targets) {
    const marker = `/*i18n:${t}*/`;
    if (s.includes(marker)) continue;
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}[\\s\\S]*?\\{)\\n`);
    if (re.test(s)) {
      s = s.replace(re, `$1\n  ${marker}\n  const { dict } = useI18n();\n  const copy = dict.patientAssessment;\n`);
    } else {
      console.warn("no match", t);
    }
  }
  s = s.replaceAll(">Continue<", ">{copy.continue}<");
  s = s.replaceAll("Analyse My Profile", "{copy.analyseProfile}");
  s = s.replaceAll(
    "Prefer not to share — skip this step",
    "{copy.skipPreferNot}",
  );
  s = s.replaceAll(
    "How familiar are you with peptide therapy?",
    "{copy.knowledge.headline}",
  );
  s = s.replaceAll(
    "This helps us tailor the information and guidance we share with you.",
    "{copy.knowledge.sub}",
  );
  fs.writeFileSync("src/components/PatientAssessment.tsx", s);
  console.log("patientAssessment");
}

console.log("done");
