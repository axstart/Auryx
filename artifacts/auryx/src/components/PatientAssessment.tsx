import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

type Answer = string | string[];

interface Answers {
  knowledge?: string;
  goal?: string;
  intent?: string;
  medical?: string[];
}

const STEPS = ["knowledge", "goal", "intent", "medical"] as const;

const MEDICAL_FLAGS = [
  "hormone-sensitive-cancer",
  "other-cancer",
  "active-treatment",
];

function classifyResult(answers: Answers): {
  type: "consult-required" | "consult-recommended" | "purchase-path" | "explorer";
  headline: string;
  body: string;
  cta: string;
  flag?: "medical";
} {
  const hasMedicalFlag = answers.medical?.some((m) => MEDICAL_FLAGS.includes(m));

  if (hasMedicalFlag) {
    return {
      type: "consult-required",
      flag: "medical",
      headline: "Physician Review Required",
      body:
        "Based on your medical history, a direct consultation with one of our physicians is required before any protocol can be considered. This is not a barrier — it is the standard of care we hold for every patient. Our team will review your case with complete discretion, expertise, and compassion. Many patients with complex histories find that peptide therapy is still an excellent fit under appropriate medical supervision.",
      cta: "Request a Physician Consultation",
    };
  }

  if (answers.intent === "consultation") {
    return {
      type: "consult-recommended",
      headline: "You're Ready. So Are We.",
      body:
        "You have the intent and we have the expertise. Your next step is a private consultation with one of our longevity physicians who will review your biomarkers, goals, and history to design a protocol built entirely around your biology. Most patients walk away from their first consultation with a clear, actionable protocol in hand.",
      cta: "Book Your Private Consultation",
    };
  }

  if (answers.intent === "purchase") {
    return {
      type: "purchase-path",
      headline: "We Can Help — With One Important Step",
      body:
        "We understand you're ready to move. Before any peptide protocol is dispensed, a brief physician consultation is required — not to slow you down, but to ensure your protocol is precisely matched to your biology. This protects your results and your safety. Many of our patients complete this step within 48 hours and begin their protocol shortly after.",
      cta: "Start the Process",
    };
  }

  return {
    type: "explorer",
    headline: "The Right Place to Start",
    body:
        "Curiosity is the first step toward transformation. Explore the science on this page, review our peptide profiles, and when you're ready — our physicians are here to guide you with zero pressure. There is no obligation in reaching out. Only the possibility of becoming someone who operates at an entirely different level.",
    cta: "Explore the Science",
  };
}

function StepKnowledge({ onSelect }: { onSelect: (v: string) => void }) {
  const options = [
    {
      value: "new",
      label: "New to peptides",
      desc: "I've heard about them but don't know much yet.",
    },
    {
      value: "some",
      label: "Some knowledge",
      desc: "I've researched a few peptides and understand the basics.",
    },
    {
      value: "experienced",
      label: "Experienced",
      desc: "I've used peptides before and understand protocols.",
    },
  ];
  return (
    <StepShell
      label="Step 1 of 4"
      headline="How familiar are you with peptide therapy?"
      sub="This helps us tailor the information and guidance we share with you."
    >
      <div className="grid gap-4">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepGoal({ onSelect }: { onSelect: (v: string) => void }) {
  const options = [
    { value: "antiaging", label: "Anti-Aging & Longevity", desc: "Slow biological aging, improve cellular health, look and feel younger." },
    { value: "fatloss", label: "Fat Loss & Body Composition", desc: "Metabolic acceleration, weight reduction, lean mass preservation." },
    { value: "sexual", label: "Sexual Health & Vitality", desc: "Libido restoration, performance, hormonal balance." },
    { value: "recovery", label: "Recovery & Regeneration", desc: "Injury healing, post-surgical recovery, tissue repair." },
    { value: "cognitive", label: "Cognitive Performance", desc: "Focus, memory, neuroprotection, mental clarity." },
    { value: "energy", label: "Energy & Vitality", desc: "Eliminate fatigue, optimize mitochondria, sustain peak output." },
    { value: "unsure", label: "Not sure yet", desc: "I'd like guidance on what's most relevant for my situation." },
  ];
  return (
    <StepShell
      label="Step 2 of 4"
      headline="What is your primary area of focus?"
      sub="Select the goal that matters most to you right now. You can address multiple areas with a complete protocol."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepIntent({ onSelect }: { onSelect: (v: string) => void }) {
  const options = [
    { value: "consultation", label: "I want a private consultation", desc: "I'm ready to speak with a physician and get a personalized protocol." },
    { value: "purchase", label: "I'm looking to purchase peptides", desc: "I know what I want and would like to proceed with an order." },
    { value: "learn", label: "I want to learn more first", desc: "I'm gathering information before making any decisions." },
    { value: "browse", label: "Just exploring", desc: "I'm curious about what Auryx offers and how this works." },
  ];
  return (
    <StepShell
      label="Step 3 of 4"
      headline="What brings you to Auryx today?"
      sub="There's no wrong answer. This helps us direct you to exactly the right next step."
    >
      <div className="grid gap-4">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepMedical({ onSubmit }: { onSubmit: (selected: string[]) => void }) {
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
    if (value === "none") {
      setSelected(["none"]);
      return;
    }
    setSelected((prev) => {
      const filtered = prev.filter((v) => v !== "none");
      return filtered.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value];
    });
  };

  return (
    <StepShell
      label="Step 4 of 4"
      headline="Please review the following medical history items."
      sub="This information is used solely to ensure your safety and guide appropriate protocol design. Select all that apply."
    >
      <div className="grid gap-3 mb-8">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              data-testid={`medical-option-${o.value}`}
              onClick={() => toggle(o.value)}
              className={`w-full text-left p-5 rounded-lg border transition-all duration-200 ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-card/30 hover:border-primary/40 hover:bg-card/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${active ? "bg-primary border-primary" : "border-border"}`}>
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{o.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
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
        className="w-full bg-primary text-primary-foreground h-13 text-base tracking-wide"
      >
        See My Recommendation <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </StepShell>
  );
}

function ResultScreen({
  answers,
  onReset,
  onConsult,
}: {
  answers: Answers;
  onReset: () => void;
  onConsult: () => void;
}) {
  const result = classifyResult(answers);

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      {result.flag === "medical" ? (
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-[1px] w-8 bg-primary/40" />
        <span className="text-primary text-xs tracking-[0.25em] uppercase">Your Assessment Result</span>
        <div className="h-[1px] w-8 bg-primary/40" />
      </div>

      <h3 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">{result.headline}</h3>
      <p className="text-muted-foreground leading-relaxed mb-10 text-base">{result.body}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          data-testid="result-primary-cta"
          onClick={() => {
            if (result.type === "explorer") {
              document.getElementById("education")?.scrollIntoView({ behavior: "smooth" });
            } else {
              onConsult();
            }
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-13 px-8 text-base tracking-wide"
        >
          {result.cta} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          data-testid="result-reset"
          variant="outline"
          onClick={onReset}
          className="border-border/60 text-muted-foreground hover:border-primary/40 h-13 px-8"
        >
          Start Over
        </Button>
      </div>

      {result.flag === "medical" && (
        <p className="mt-8 text-xs text-muted-foreground/60 max-w-lg mx-auto">
          All information shared is protected under strict medical privacy standards. Our physicians approach every case without judgment and with your wellbeing as the sole priority.
        </p>
      )}
    </motion.div>
  );
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
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{label}</p>
      <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3">{headline}</h3>
      <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{sub}</p>
      {children}
    </motion.div>
  );
}

function OptionCard({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      data-testid={`option-${label.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={onClick}
      className="w-full text-left p-5 rounded-lg border border-border/60 bg-card/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm text-foreground mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4" />
      </div>
    </button>
  );
}

export function PatientAssessment({ onOpenConsult }: { onOpenConsult: () => void }) {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const stepIndex = step;
  const totalSteps = STEPS.length;

  const handleAnswer = (key: keyof Answers, value: Answer) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (stepIndex < totalSteps - 1) {
      setStep(stepIndex + 1);
    } else {
      setDone(true);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStep(stepIndex - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  const progressPct = done ? 100 : (stepIndex / totalSteps) * 100;

  return (
    <section id="assessment" className="py-32 px-6 md:px-12 bg-card relative z-20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary tracking-[0.2em] text-sm uppercase mb-4 block">Personalized Guidance</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Find Your Protocol</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Answer four questions. We'll tell you exactly where you stand and what your most intelligent next step is.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-background/60 border border-border/60 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            {!done && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs text-muted-foreground">{stepIndex + 1} of {totalSteps}</span>
                </div>
                <div className="h-[2px] bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!done ? (
                <>
                  {stepIndex === 0 && (
                    <StepKnowledge onSelect={(v) => handleAnswer("knowledge", v)} />
                  )}
                  {stepIndex === 1 && (
                    <StepGoal onSelect={(v) => handleAnswer("goal", v)} />
                  )}
                  {stepIndex === 2 && (
                    <StepIntent onSelect={(v) => handleAnswer("intent", v)} />
                  )}
                  {stepIndex === 3 && (
                    <StepMedical onSubmit={(v) => handleAnswer("medical", v)} />
                  )}
                </>
              ) : (
                <ResultScreen answers={answers} onReset={reset} onConsult={onOpenConsult} />
              )}
            </AnimatePresence>

            {!done && stepIndex > 0 && (
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
