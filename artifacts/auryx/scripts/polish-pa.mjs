import fs from "fs";

// Wire PatientAssessment remaining steps to dict option arrays where shapes match
let s = fs.readFileSync("src/components/PatientAssessment.tsx", "utf8");

// Protocol intent options
s = s.replace(
  /function StepProtocolIntent\([\s\S]*?const options = \[[\s\S]*?\];\n  return \(\n    <StepShell\n      label=\{stepLabel\}\n      headline="[^"]*"\n      sub="[^"]*"/,
  `function StepProtocolIntent({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  /*i18n:function StepProtocolIntent*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const options = copy.protocolIntent.options;
  return (
    <StepShell
      label={stepLabel}
      headline={copy.protocolIntent.headline}
      sub={copy.protocolIntent.sub}`,
);

// Goal options  
s = s.replace(
  /function StepGoal\([\s\S]*?const options = \[[\s\S]*?\];\n  return \(\n    <StepShell\n      label=\{stepLabel\}\n      headline="[^"]*"\n      sub="[^"]*"/,
  `function StepGoal({ stepLabel, onSubmit }: { stepLabel: string; onSubmit: (v: string[]) => void }) {
  /*i18n:function StepGoal*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const [selected, setSelected] = useState<string[]>([]);
  const options = copy.goal.options;
  return (
    <StepShell
      label={stepLabel}
      headline={copy.goal.headline}
      sub={copy.goal.sub}`,
);

// Loading phrases
s = s.replace(
  /const phrases = \[\n    "Analysing your profile…"[\s\S]*?\];/,
  `const phrases = copy.loadingPhrases as unknown as string[];`,
);

// Medical result
s = s.replace(
  /Book a Consultation/g,
  "{copy.medicalResult?.consult ?? copy.aiResult?.consult ?? 'Book a Consultation'}",
);

fs.writeFileSync("src/components/PatientAssessment.tsx", s);
console.log("pa improved");

// Fix checkout-success MEDICAL_HISTORY_OPTIONS map if still using const name
let cs = fs.readFileSync("src/pages/checkout-success.tsx", "utf8");
if (cs.includes("MEDICAL_HISTORY_OPTIONS.map") && !cs.includes("copy.conditions.map")) {
  cs = cs.replaceAll("MEDICAL_HISTORY_OPTIONS.map", "copy.conditions.map");
  fs.writeFileSync("src/pages/checkout-success.tsx", cs);
  console.log("cs conditions fixed");
} else {
  console.log("cs conditions", cs.includes("copy.conditions"));
}

// Verify dict key names used in new-york
const ny = fs.readFileSync("src/pages/new-york.tsx", "utf8");
const nyd = fs.readFileSync("src/i18n/pages/new-york.ts", "utf8");
const used = [...ny.matchAll(/copy\.([a-zA-Z]+)/g)].map((m) => m[1]);
const missing = [...new Set(used)].filter((k) => !nyd.includes(`"${k}"`) && !nyd.includes(`${k}:`));
console.log("ny missing", missing.join(",") || "none");
