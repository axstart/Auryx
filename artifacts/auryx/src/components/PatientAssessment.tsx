import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import { useGetProtocolRecommendation } from "@workspace/api-client-react";
import type { ProtocolRecommendation } from "@workspace/api-client-react";

interface Answers {
  knowledge?: string;
  currentPeptides?: string;
  protocolIntent?: string;
  goal?: string;
  energySleep?: string;
  activityLevel?: string;
  intent?: string;
  medical?: string[];
}

type StepKey = "knowledge" | "currentPeptides" | "protocolIntent" | "goal" | "energySleep" | "activityLevel" | "intent" | "medical";

const MEDICAL_FLAGS = ["hormone-sensitive-cancer", "other-cancer", "active-treatment"];

function getSequence(answers: Answers): StepKey[] {
  const base: StepKey[] = ["knowledge"];
  if (answers.knowledge === "experienced") {
    base.push("currentPeptides", "protocolIntent");
  }
  base.push("goal", "energySleep", "activityLevel", "intent", "medical");
  return base;
}

function StepShell({
  label,
  headline,
  sub,
  children,
}: {
  label: string;
  headline: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={headline}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
    >
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">{label}</p>
      <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2">{headline}</h3>
      <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{sub}</p>
      {children}
    </motion.div>
  );
}

function OptionCard({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      data-testid={`option-${label.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-lg border border-[#C9A844]/20 bg-[#161510] hover:border-[#C9A844]/60 hover:bg-[#1e1a0a] transition-all duration-200 group"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-sm text-foreground mb-0.5">{label}</p>
          <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </button>
  );
}

function StepKnowledge({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  const options = [
    { value: "new", label: "New to peptides", desc: "I've heard about them but don't know much yet." },
    { value: "some", label: "Some knowledge", desc: "I've researched a few peptides and understand the basics." },
    { value: "experienced", label: "Experienced", desc: "I've used peptides before and understand protocols well." },
  ];
  return (
    <StepShell
      label={stepLabel}
      headline="How familiar are you with peptide therapy?"
      sub="This helps us tailor the information and guidance we share with you."
    >
      <div className="grid gap-2">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

const PEPTIDE_OPTIONS = [
  "BPC-157", "TB-500", "CJC-1295", "Ipamorelin", "GHK-Cu", "Epithalon",
  "AOD-9604", "Semax", "Selank", "PT-141", "MOTS-c", "Thymosin Alpha-1",
  "Kisspeptin", "Tesamorelin", "Sermorelin", "Tirzepatide", "Semaglutide",
  "NAD+", "IGF-1 LR3", "Hexarelin", "GHRP-2", "GHRP-6",
];

function StepCurrentPeptides({ stepLabel, onNext }: { stepLabel: string; onNext: (v: string) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");

  const toggle = (p: string) =>
    setSelected((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const handleContinue = () => {
    const all = [...selected];
    if (custom.trim()) all.push(custom.trim());
    onNext(all.length ? all.join(", ") : "Not specified");
  };

  return (
    <StepShell
      label={stepLabel}
      headline="What peptides are you currently using?"
      sub="Select all that apply. You can add custom compounds below — doses and frequency are optional."
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {PEPTIDE_OPTIONS.map((p) => {
          const active = selected.includes(p);
          return (
            <button
              key={p}
              onClick={() => toggle(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                active
                  ? "bg-primary text-[#0A0A0A] border-primary"
                  : "border-[#C9A844]/20 bg-[#161510] text-foreground/60 hover:border-[#C9A844]/50 hover:text-foreground"
              }`}
            >
              {active && <span className="mr-1">✓</span>}{p}
            </button>
          );
        })}
      </div>
      <input
        data-testid="input-custom-peptides"
        type="text"
        placeholder="Other compounds (e.g. Epithalon 10mg, Kisspeptin 10mcg...)"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        className="w-full mb-5 px-4 py-2.5 rounded-lg bg-[#161510] border border-[#C9A844]/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
      />
      <Button
        data-testid="current-peptides-next"
        onClick={handleContinue}
        className="w-full bg-primary text-primary-foreground h-11 text-sm tracking-wide"
      >
        Continue <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
      <button
        onClick={() => onNext("Prefer not to say")}
        className="w-full mt-3 text-xs text-muted-foreground hover:text-primary transition-colors py-2"
      >
        Prefer not to share — skip this step
      </button>
    </StepShell>
  );
}

function StepProtocolIntent({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  const options = [
    {
      value: "changes",
      label: "I'd like to optimize or change my protocol",
      desc: "I want to adjust doses, add compounds, cycle differently, or switch something.",
    },
    {
      value: "questions",
      label: "I have specific questions",
      desc: "Mechanism of action, stacking, labs, side effects — I want expert answers.",
    },
    {
      value: "continue",
      label: "Continue my exact protocol under Auryx",
      desc: "I'm happy with my current stack and just want to source it through Auryx.",
    },
    {
      value: "maintaining",
      label: "I'm happy with my current protocol",
      desc: "I'm just exploring what Auryx offers and what's available.",
    },
  ];
  return (
    <StepShell
      label={stepLabel}
      headline="What would you like from Auryx?"
      sub="Given your experience with peptides, what would be most valuable for you right now?"
    >
      <div className="grid gap-2">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepGoal({ stepLabel, onSubmit }: { stepLabel: string; onSubmit: (v: string) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const options = [
    { value: "antiaging", label: "Anti-Aging & Longevity", desc: "Slow biological aging, improve cellular health, look and feel younger." },
    { value: "fatloss", label: "Fat Loss & Body Composition", desc: "Metabolic acceleration, weight reduction, lean mass preservation." },
    { value: "sexual", label: "Sexual Health & Vitality", desc: "Libido restoration, performance, hormonal balance." },
    { value: "recovery", label: "Recovery & Regeneration", desc: "Injury healing, post-surgical recovery, tissue repair." },
    { value: "cognitive", label: "Cognitive Performance", desc: "Focus, memory, neuroprotection, mental clarity." },
    { value: "energy", label: "Energy & Vitality", desc: "Eliminate fatigue, optimize mitochondria, sustain peak output." },
    { value: "unsure", label: "Not sure yet", desc: "I'd like guidance on what's most relevant for my situation." },
  ];

  const toggle = (v: string) =>
    setSelected((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  return (
    <StepShell
      label={stepLabel}
      headline="What are your areas of focus?"
      sub="Select all that apply. Your protocol can address multiple goals simultaneously."
    >
      <div className="grid gap-2 mb-5">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              data-testid={`option-${o.value}`}
              onClick={() => toggle(o.value)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 group ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-[#C9A844]/20 bg-[#161510] hover:border-[#C9A844]/60 hover:bg-[#1e1a0a]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm text-foreground mb-0.5">{o.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{o.desc}</p>
                </div>
                <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                  active ? "bg-primary border-primary" : "border-white/20"
                }`}>
                  {active && (
                    <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 3.5-4" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <Button
        data-testid="goal-next"
        disabled={selected.length === 0}
        onClick={() => onSubmit(selected.join(", "))}
        className="w-full bg-primary text-primary-foreground h-11 text-sm tracking-wide disabled:opacity-40"
      >
        Continue <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </StepShell>
  );
}

function StepEnergySleep({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  const options = [
    { value: "excellent", label: "Consistently strong", desc: "I sleep well, wake rested, and sustain energy throughout the day." },
    { value: "variable", label: "Variable", desc: "Some good days, some bad — energy and sleep quality fluctuate." },
    { value: "low", label: "Often low", desc: "I frequently feel fatigued, struggle with afternoon crashes, or sleep poorly." },
    { value: "poor", label: "Significantly compromised", desc: "Chronic fatigue, poor sleep, and low energy are real ongoing issues for me." },
  ];
  return (
    <StepShell
      label={stepLabel}
      headline="How would you describe your current energy and sleep?"
      sub="Your baseline vitality shapes which protocols will deliver the most meaningful impact."
    >
      <div className="grid gap-2">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepActivityLevel({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  const options = [
    { value: "very-active", label: "Very active", desc: "Training 5+ days/week — sport, strength, endurance, or performance-focused." },
    { value: "moderately-active", label: "Moderately active", desc: "Regular movement 3–4x/week. Health-conscious and consistent." },
    { value: "lightly-active", label: "Lightly active", desc: "Occasional exercise. Looking to build or rebuild a more active lifestyle." },
    { value: "sedentary", label: "Mostly sedentary", desc: "Desk-based, limited movement. Health optimization is a new priority." },
  ];
  return (
    <StepShell
      label={stepLabel}
      headline="How active is your lifestyle?"
      sub="Activity level influences recovery demand, metabolic rate, and which compounds are most clinically relevant."
    >
      <div className="grid gap-2">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepIntent({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  const options = [
    { value: "consultation", label: "I want a private consultation", desc: "I'm ready to speak with a physician and get a personalized protocol." },
    { value: "purchase", label: "I'm looking to purchase peptides", desc: "I know what I want and would like to proceed with an order." },
    { value: "learn", label: "I want to learn more first", desc: "I'm gathering information before making any decisions." },
    { value: "browse", label: "Just exploring", desc: "I'm curious about what Auryx offers and how this works." },
  ];
  return (
    <StepShell
      label={stepLabel}
      headline="What brings you to Auryx today?"
      sub="There's no wrong answer. This helps us direct you to exactly the right next step."
    >
      <div className="grid gap-2">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepMedical({ stepLabel, onSubmit }: { stepLabel: string; onSubmit: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const options = [
    { value: "hormone-sensitive-cancer", label: "History of hormone-sensitive cancer", desc: "Breast, prostate, ovarian, endometrial, or other hormone-driven cancers." },
    { value: "other-cancer", label: "History of other cancer", desc: "Any malignancy not listed above, past or present." },
    { value: "active-treatment", label: "Currently undergoing cancer treatment", desc: "Chemotherapy, radiation, immunotherapy, or targeted therapy." },
    { value: "cardiovascular", label: "Significant cardiovascular disease", desc: "Heart attack, stroke, heart failure, or serious arrhythmia." },
    { value: "autoimmune", label: "Autoimmune condition", desc: "Lupus, MS, rheumatoid arthritis, IBD, or similar diagnosis." },
    { value: "pregnant", label: "Pregnant or nursing", desc: "Current pregnancy or breastfeeding." },
    { value: "none", label: "None of the above", desc: "I do not have any of the conditions listed." },
  ];

  const toggle = (value: string) => {
    if (value === "none") { setSelected(["none"]); return; }
    setSelected((prev) => {
      const filtered = prev.filter((v) => v !== "none");
      return filtered.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value];
    });
  };

  return (
    <StepShell
      label={stepLabel}
      headline="Please review the following medical history items."
      sub="This information is used solely to ensure your safety and guide appropriate protocol design. Select all that apply."
    >
      <div className="grid gap-2 mb-6">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              data-testid={`medical-option-${o.value}`}
              onClick={() => toggle(o.value)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                active ? "border-primary bg-primary/10" : "border-white/[0.14] bg-white/[0.06] hover:border-primary/50 hover:bg-primary/[0.06]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${active ? "bg-primary border-primary" : "border-white/20"}`}>
                  {active && <CheckCircle2 className="w-3 h-3 text-[#0A0A0A]" />}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground mb-0.5">{o.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{o.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <Button
        data-testid="assessment-submit"
        disabled={selected.length === 0}
        onClick={() => onSubmit(selected)}
        className="w-full bg-primary text-primary-foreground h-12 text-base tracking-wide"
      >
        Analyse My Profile <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </StepShell>
  );
}

function LoadingScreen() {
  const phrases = [
    "Analysing your profile…",
    "Matching compounds to your biology…",
    "Calibrating protocol fit…",
  ];
  const [phraseIndex] = useState(0);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-8"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 rounded-full border-t-2 border-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Aria is working</p>
        <p className="text-muted-foreground text-sm">{phrases[phraseIndex]}</p>
      </div>
    </motion.div>
  );
}

function MedicalResultScreen({ onReset, onConsult }: { onReset: () => void; onConsult: () => void }) {
  return (
    <motion.div
      key="medical-result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center border bg-amber-500/10 border-amber-500/30">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-[1px] w-8 bg-primary/40" />
        <span className="text-primary text-xs tracking-[0.25em] uppercase">Physician Review Required</span>
        <div className="h-[1px] w-8 bg-primary/40" />
      </div>
      <h3 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">Physician Review Required</h3>
      <p className="text-muted-foreground leading-relaxed mb-10 text-base">
        Based on your medical history, a direct consultation with one of our physicians is required before any protocol can be considered.
        This is not a barrier — it is the standard of care we hold for every patient. Our team will review your case with complete
        discretion, expertise, and compassion. Many patients with complex histories find that peptide therapy is still an excellent
        fit under appropriate medical supervision.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          data-testid="result-primary-cta"
          onClick={onConsult}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base tracking-wide"
        >
          Request a Physician Consultation <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          data-testid="result-reset"
          variant="outline"
          onClick={onReset}
          className="border-border/60 text-muted-foreground hover:border-primary/40 h-12 px-8"
        >
          Start Over
        </Button>
      </div>
      <p className="mt-8 text-xs text-muted-foreground/60 max-w-lg mx-auto">
        All information shared is protected under strict medical privacy standards. Our physicians approach every case without judgment and with your wellbeing as the sole priority.
      </p>
    </motion.div>
  );
}

function AIResultScreen({
  result,
  onReset,
  onConsult,
}: {
  result: ProtocolRecommendation;
  onReset: () => void;
  onConsult: () => void;
}) {
  return (
    <motion.div
      key="ai-result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-[1px] flex-1 bg-primary/20" />
        <span className="text-primary text-xs tracking-[0.25em] uppercase flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Aria's Recommendation
        </span>
        <div className="h-[1px] flex-1 bg-primary/20" />
      </div>

      <div className="border border-primary/20 rounded-xl bg-primary/5 p-7 md:p-9 mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-2">Recommended Protocol</p>
        <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-2">{result.protocol}</h3>
        <p className="text-primary text-sm tracking-wide italic">{result.tagline}</p>
      </div>

      <p className="text-foreground/75 leading-relaxed text-base mb-6">{result.why}</p>

      {result.peptides.length > 0 && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Key Compounds</p>
          <div className="flex flex-wrap gap-2">
            {result.peptides.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary tracking-wide"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card/50 border border-border/40 rounded-lg px-5 py-4 mb-8">
        <p className="text-sm text-foreground/80 leading-relaxed">{result.nextStep}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          data-testid="result-primary-cta"
          onClick={onConsult}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base tracking-wide"
        >
          Book a Private Consultation <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          data-testid="result-reset"
          variant="outline"
          onClick={onReset}
          className="border-border/60 text-muted-foreground hover:border-primary/40 h-12 px-6"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Start Over
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground/40 text-center leading-relaxed max-w-lg mx-auto">
        {result.disclaimer}
      </p>
    </motion.div>
  );
}

function ErrorResultScreen({ onReset, onConsult }: { onReset: () => void; onConsult: () => void }) {
  return (
    <motion.div
      key="error-result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center border bg-primary/10 border-primary/30">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-[1px] w-8 bg-primary/40" />
        <span className="text-primary text-xs tracking-[0.25em] uppercase">Assessment Complete</span>
        <div className="h-[1px] w-8 bg-primary/40" />
      </div>
      <h3 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">You're Ready. So Are We.</h3>
      <p className="text-muted-foreground leading-relaxed mb-10 text-base">
        Your profile suggests strong candidacy for a personalized protocol. The next step is a private consultation with one of our
        longevity physicians — they will design a protocol built entirely around your biology, goals, and history. Most patients leave
        their first consultation with a clear, actionable plan in hand.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          data-testid="result-primary-cta"
          onClick={onConsult}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base tracking-wide"
        >
          Book Your Private Consultation <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          data-testid="result-reset"
          variant="outline"
          onClick={onReset}
          className="border-border/60 text-muted-foreground hover:border-primary/40 h-12 px-8"
        >
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}

export function PatientAssessment({ onOpenConsult, onContinueProtocol }: { onOpenConsult: () => void; onContinueProtocol?: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<"quiz" | "loading" | "result" | "error" | "medical">("quiz");
  const [aiResult, setAiResult] = useState<ProtocolRecommendation | null>(null);

  const { mutateAsync: getRecommendation } = useGetProtocolRecommendation();

  const sequence = getSequence(answers);
  const totalSteps = sequence.length;
  const currentKey = sequence[stepIndex];

  const advance = async (key: keyof Answers, value: string | string[]) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    const nextSequence = getSequence(updated);

    if (stepIndex < nextSequence.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    const medicalArr = (key === "medical" ? value : updated.medical) as string[] | undefined;
    const hasMedicalFlag = medicalArr?.some((m) => MEDICAL_FLAGS.includes(m));

    if (hasMedicalFlag) {
      setPhase("medical");
      return;
    }

    setPhase("loading");
    try {
      const recommendation = await getRecommendation({
        data: {
          knowledge: updated.knowledge,
          goal: updated.goal,
          energySleep: updated.energySleep,
          activityLevel: updated.activityLevel,
          intent: updated.intent,
          medical: updated.medical,
          currentPeptides: updated.currentPeptides,
          protocolIntent: updated.protocolIntent,
        },
      });
      setAiResult(recommendation);
      setPhase("result");
    } catch {
      setPhase("error");
    }
  };

  const goBack = () => { if (stepIndex > 0) setStepIndex(stepIndex - 1); };

  const reset = () => {
    setPhase("quiz");
    setAiResult(null);
    setTimeout(() => {
      setStepIndex(0);
      setAnswers({});
    }, 200);
  };

  const progressPct = phase !== "quiz" ? 100 : (stepIndex / totalSteps) * 100;
  const stepLabel = `Step ${stepIndex + 1} of ${totalSteps}`;

  return (
    <section id="assessment" className="pt-8 pb-10 px-6 md:px-12 bg-card relative z-20">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-3xl mx-auto">
          <div className="bg-background/60 border border-border/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            {phase === "quiz" && (
              <div className="mb-7">
                <div className="flex items-center justify-between">
                  {Array.from({ length: totalSteps }, (_, i) => {
                    const num = i + 1;
                    const isComplete = i < stepIndex;
                    const isCurrent = i === stepIndex;
                    return (
                      <div key={i} className="flex items-center flex-1 last:flex-none">
                        <div className="relative flex flex-col items-center">
                          <motion.div
                            animate={{
                              backgroundColor: isCurrent ? "#C9A844" : isComplete ? "#C9A844" : "transparent",
                              borderColor: isCurrent || isComplete ? "#C9A844" : "rgba(255,255,255,0.15)",
                              scale: isCurrent ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0"
                          >
                            {isComplete ? (
                              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke={isCurrent ? "#0A0A0A" : "#0A0A0A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <span className={`text-[10px] font-semibold leading-none ${isCurrent ? "text-[#0A0A0A]" : "text-foreground/30"}`}>
                                {num}
                              </span>
                            )}
                          </motion.div>
                        </div>
                        {i < totalSteps - 1 && (
                          <div className="flex-1 mx-1 h-[1px] relative overflow-hidden bg-white/10">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-primary"
                              animate={{ width: isComplete ? "100%" : "0%" }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {phase === "quiz" && (
                <div key={currentKey}>
                  {currentKey === "knowledge" && (
                    <StepKnowledge stepLabel={stepLabel} onSelect={(v) => advance("knowledge", v)} />
                  )}
                  {currentKey === "currentPeptides" && (
                    <StepCurrentPeptides stepLabel={stepLabel} onNext={(v) => advance("currentPeptides", v)} />
                  )}
                  {currentKey === "protocolIntent" && (
                    <StepProtocolIntent stepLabel={stepLabel} onSelect={(v) => advance("protocolIntent", v)} />
                  )}
                  {currentKey === "goal" && (
                    <StepGoal stepLabel={stepLabel} onSubmit={(v) => advance("goal", v)} />
                  )}
                  {currentKey === "energySleep" && (
                    <StepEnergySleep stepLabel={stepLabel} onSelect={(v) => advance("energySleep", v)} />
                  )}
                  {currentKey === "activityLevel" && (
                    <StepActivityLevel stepLabel={stepLabel} onSelect={(v) => advance("activityLevel", v)} />
                  )}
                  {currentKey === "intent" && (
                    <StepIntent stepLabel={stepLabel} onSelect={(v) => advance("intent", v)} />
                  )}
                  {currentKey === "medical" && (
                    <StepMedical stepLabel={stepLabel} onSubmit={(v) => advance("medical", v)} />
                  )}
                </div>
              )}

              {phase === "loading" && <LoadingScreen key="loading" />}

              {phase === "result" && aiResult && (
                <AIResultScreen
                  key="ai-result"
                  result={aiResult}
                  onReset={reset}
                  onConsult={onOpenConsult}
                />
              )}

              {phase === "medical" && (
                <MedicalResultScreen
                  key="medical-result"
                  onReset={reset}
                  onConsult={onOpenConsult}
                />
              )}

              {phase === "error" && (
                <ErrorResultScreen key="error-result" onReset={reset} onConsult={onOpenConsult} />
              )}
            </AnimatePresence>

            {phase === "quiz" && stepIndex > 0 && (
              <button
                data-testid="assessment-back"
                onClick={goBack}
                className="mt-8 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Go back
              </button>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground/50 mt-6">
            Your responses are private and used only to personalize your experience on this page. No data is stored or transmitted without your consent.
          </p>
        </div>
      </div>
    </section>
  );
}
