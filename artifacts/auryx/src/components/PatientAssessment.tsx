import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, RotateCcw, X, ShoppingCart, Search } from "lucide-react";
import { useGetProtocolRecommendation } from "@workspace/api-client-react";
import type { ProtocolRecommendation } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";
import type { ProductSummary } from "@/types/shop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/i18n";

async function fetchProducts(): Promise<ProductSummary[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

function matchProduct(protocolName: string, products: ProductSummary[]): ProductSummary | undefined {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const pn = norm(protocolName);
  return products.find(p => {
    const n = norm(p.name);
    return pn.includes(n) || n.includes(pn);
  });
}

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
      className="w-full min-h-11 text-left px-4 py-3 rounded-lg border border-[#C9A844]/20 bg-[#161510] hover:border-[#C9A844]/60 hover:bg-[#1e1a0a] transition-all duration-200 group motion-reduce:transition-none"
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
  /*i18n:function StepKnowledge*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const options = copy.knowledge.options;
  return (
    <StepShell
      label={stepLabel}
      headline={copy.knowledge.headline}
      sub={copy.knowledge.sub}
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
  /*i18n:function StepCurrentPeptides*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");

  const toggle = (p: string) =>
    setSelected((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const handleContinue = () => {
    const all = [...selected];
    if (custom.trim()) all.push(custom.trim());
    onNext(all.length ? all.join(", ") : copy.currentPeptides.notSpecified);
  };

  return (
    <StepShell
      label={stepLabel}
      headline={copy.currentPeptides.headline}
      sub={copy.currentPeptides.sub}
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {PEPTIDE_OPTIONS.map((p) => {
          const active = selected.includes(p);
          return (
            <button
              key={p}
              onClick={() => toggle(p)}
              className={`min-h-11 px-3 py-2 rounded-full text-xs font-medium border transition-all duration-150 ${
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
        autoComplete="off"
        placeholder={copy.currentPeptides.customPlaceholder}
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        className="w-full mb-5 px-4 py-2.5 rounded-lg bg-[#161510] border border-[#C9A844]/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
      />
      <Button
        data-testid="current-peptides-next"
        onClick={handleContinue}
        className="w-full bg-primary text-primary-foreground h-11 text-sm tracking-wide"
      >
        {copy.continue} <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
      <button
        onClick={() => onNext(copy.currentPeptides.preferNot)}
        className="w-full min-h-11 mt-3 text-xs text-muted-foreground hover:text-primary transition-colors py-2"
      >
        {copy.skipPreferNot}
      </button>
    </StepShell>
  );
}

function StepProtocolIntent({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  /*i18n:function StepProtocolIntent*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const options = copy.protocolIntent.options;
  return (
    <StepShell
      label={stepLabel}
      headline={copy.protocolIntent.headline}
      sub={copy.protocolIntent.sub}
    >
      <div className="grid gap-2">
        {options.map((o) => (
          <OptionCard key={o.value} label={o.label} desc={o.desc} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </StepShell>
  );
}

function StepGoal({ stepLabel, onSubmit }: { stepLabel: string; onSubmit: (v: string[]) => void }) {
  /*i18n:function StepGoal*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const [selected, setSelected] = useState<string[]>([]);
  const options = copy.goal.options;

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <StepShell
      label={stepLabel}
      headline={copy.goal.headline}
      sub={copy.goal.sub}
    >
      <div className="grid gap-2 mb-6">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={`w-full min-h-11 text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                active ? "border-primary bg-primary/10" : "border-white/[0.14] bg-white/[0.06] hover:border-primary/50"
              }`}
            >
              <div className="font-medium text-sm text-foreground">{o.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{o.desc}</div>
            </button>
          );
        })}
      </div>
      <Button
        disabled={selected.length === 0}
        onClick={() => onSubmit(selected)}
        className="w-full bg-primary text-primary-foreground h-11"
      >
        {copy.continue} <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </StepShell>
  );
}

function StepEnergySleep({ stepLabel, onSelect }: { stepLabel: string; onSelect: (v: string) => void }) {
  /*i18n:function StepEnergySleep*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const options = copy.energySleep.options;
  return (
    <StepShell
      label={stepLabel}
      headline={copy.energySleep.headline}
      sub={copy.energySleep.sub}
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
  /*i18n:function StepActivityLevel*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const options = copy.activity.options;
  return (
    <StepShell
      label={stepLabel}
      headline={copy.activity.headline}
      sub={copy.activity.sub}
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
  /*i18n:function StepIntent*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const options = copy.intent.options;
  return (
    <StepShell
      label={stepLabel}
      headline={copy.intent.headline}
      sub={copy.intent.sub}
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
  /*i18n:function StepMedical*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const [selected, setSelected] = useState<string[]>([]);
  const options = copy.medical.options;

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
      headline={copy.medical.headline}
      sub={copy.medical.sub}
    >
      <div className="grid gap-2 mb-6">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              data-testid={`medical-option-${o.value}`}
              onClick={() => toggle(o.value)}
              className={`w-full min-h-11 text-left px-4 py-3 rounded-lg border transition-all duration-200 motion-reduce:transition-none ${
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
        {copy.analyseProfile} <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </StepShell>
  );
}

function LoadingScreen() {
  /*i18n:function LoadingScreen*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const phrases = copy.loadingPhrases as unknown as string[];
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
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">{copy.ariaWorking}</p>
        <p className="text-muted-foreground text-sm">{phrases[phraseIndex]}</p>
      </div>
    </motion.div>
  );
}

function WaiverModal({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  /*i18n:function WaiverModal*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const [agreed, setAgreed] = useState(false);
  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="left-0 right-0 top-auto bottom-0 w-full max-w-none translate-x-0 translate-y-0 max-h-[calc(100dvh-env(safe-area-inset-top))] overflow-y-auto overscroll-contain rounded-t-2xl bg-[#0f0f0f] border-[#C9A844]/20 p-0 pb-[env(safe-area-inset-bottom)] shadow-2xl sm:left-[50%] sm:right-auto sm:top-[50%] sm:bottom-auto sm:max-w-xl sm:max-h-[90vh] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl [&>button]:hidden motion-reduce:duration-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25 }}
        className="relative w-full motion-reduce:transform-none"
      >
        <div className="sticky top-0 bg-[#0f0f0f] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <DialogTitle className="text-xs uppercase tracking-[0.2em] text-amber-400">{copy.waiver.title}</DialogTitle>
          </div>
          <button onClick={onClose} className="min-h-11 min-w-11 -mr-3 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label={copy.waiver.closeAria}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-6">
          <h3 className="font-serif text-xl text-foreground mb-1">{copy.waiver.heading}</h3>
          <DialogDescription className="text-xs text-muted-foreground mb-5">{copy.waiver.pleaseRead}</DialogDescription>

          <div className="space-y-4 text-sm text-foreground/65 leading-relaxed">
            {copy.waiver.sections.map((section) => (
              <div key={section.title}>
                <p className="text-foreground/90 font-medium mb-1">{section.title}</p>
                <p>{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/[0.06] pt-5">
            <label className="flex items-start gap-3 cursor-pointer mb-5 min-h-11">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="sr-only"
              />
              <div
                aria-hidden="true"
                className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                  agreed ? "bg-primary border-primary" : "border-white/25 bg-transparent"
                }`}
              >
                {agreed && (
                  <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-muted-foreground leading-relaxed">
                {copy.waiver.agree}
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                disabled={!agreed}
                onClick={onAccept}
                className="flex-1 bg-primary text-[#0A0A0A] hover:bg-primary/90 h-11 text-sm font-bold tracking-wide disabled:opacity-30"
              >
                {copy.waiver.accept} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-border/60 text-muted-foreground hover:border-primary/40 h-11 px-5"
              >
                {copy.waiver.cancel}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function MedicalResultScreen({ onReset, onConsult }: { onReset: () => void; onConsult: () => void }) {
  /*i18n:function MedicalResultScreen*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const [showWaiver, setShowWaiver] = useState(false);
  const [, navigate] = useLocation();

  return (
    <>
      {showWaiver && (
        <AnimatePresence>
          <WaiverModal
            onClose={() => setShowWaiver(false)}
            onAccept={() => { setShowWaiver(false); navigate("/shop"); }}
          />
        </AnimatePresence>
      )}

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
          <span className="text-primary text-xs tracking-[0.25em] uppercase">{copy.medicalResult.eyebrow}</span>
          <div className="h-[1px] w-8 bg-primary/40" />
        </div>
        <h3 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">{copy.medicalResult.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-8 text-base">
          {copy.medicalResult.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button
            data-testid="result-primary-cta"
            onClick={onConsult}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base tracking-wide"
          >
            {copy.medicalResult.consult} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            data-testid="result-reset"
            variant="outline"
            onClick={onReset}
            className="border-border/60 text-muted-foreground hover:border-primary/40 h-12 px-8"
          >
            {copy.medicalResult.reset}
          </Button>
        </div>

        <button
          data-testid="self-order-risk"
          onClick={() => setShowWaiver(true)}
          className="min-h-11 px-3 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors underline underline-offset-4 decoration-muted-foreground/25"
        >
          {copy.medicalResult.selfOrder}
        </button>

        <p className="mt-6 text-xs text-muted-foreground/50 max-w-lg mx-auto">
          {copy.medicalResult.privacy}
        </p>
      </motion.div>
    </>
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
  /*i18n:function AIResultScreen*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const { addToCart } = useCart();
  const [addedSlugs, setAddedSlugs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [] } = useQuery<ProductSummary[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  function protocolSearchScore(item: ProtocolRecommendation["protocols"][number], q: string): number {
    const query = q.toLowerCase();
    const name = item.protocol.toLowerCase();
    if (name === query) return 100;
    if (name.startsWith(query)) return 50;
    if (name.includes(query)) return 10;
    if (item.tagline.toLowerCase().includes(query)) return 2;
    if (item.why.toLowerCase().includes(query)) return 1;
    if (item.peptides.some(p => p.toLowerCase().includes(query))) return 1;
    return 0;
  }

  const filteredProtocols = searchQuery.trim()
    ? (() => {
        const q = searchQuery.trim();
        const scored = result.protocols.map(item => ({ item, score: protocolSearchScore(item, q) })).filter(s => s.score > 0);
        const nameMatches = scored.filter(s => s.score >= 10);
        // Short queries (≤3 chars) = name-only, never show description matches
        if (q.length <= 3) {
          return nameMatches.map(s => s.item);
        }
        // Longer queries: suppress description-only matches if 3+ name matches
        if (nameMatches.length >= 3) {
          return nameMatches.map(s => s.item);
        }
        return scored.map(s => s.item);
      })()
    : result.protocols;

  function handleAdd(product: ProductSummary) {
    addToCart(product);
    trackEvent("pf_add_recommended_to_cart", { productSlug: product.slug });
    setAddedSlugs(prev => new Set([...prev, product.slug]));
    setTimeout(() => setAddedSlugs(prev => { const s = new Set(prev); s.delete(product.slug); return s; }), 1500);
  }

  return (
    <motion.div
      key="ai-result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-[1px] flex-1 bg-primary/20" />
        <span className="text-primary text-xs tracking-[0.25em] uppercase flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> {copy.aiResult.title}
        </span>
        <div className="h-[1px] flex-1 bg-primary/20" />
      </div>

      {/* Summary */}
      <p className="text-foreground/70 leading-relaxed text-sm mb-6 text-center max-w-xl mx-auto">
        {result.summary}
      </p>

      {/* Search recommendations */}
      <div className="relative max-w-md mx-auto mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/25" />
        <input
          type="text"
          autoComplete="off"
          placeholder={copy.aiResult.searchPlaceholder}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-xl border border-[#C9A844]/20 bg-[#161510] text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-[#C9A844]/60 focus:ring-1 focus:ring-[#C9A844]/15 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-0 top-1/2 min-h-11 px-3 -translate-y-1/2 text-foreground/25 hover:text-primary text-xs transition-colors"
            aria-label={copy.aiResult.clearSearchAria}
          >
            {copy.aiResult.clearSearch}
          </button>
        )}
      </div>

      {/* Protocol cards */}
      <div className="grid gap-3 mb-6">
        {filteredProtocols.map((item, i) => {
          const product = matchProduct(item.protocol, products);
          const isAdded = product ? addedSlugs.has(product.slug) : false;
          return (
            <div
              key={item.protocol}
              className="border border-[#C9A844]/20 bg-[#161510] rounded-xl px-5 py-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <h4 className="font-serif text-lg text-foreground">{item.protocol}</h4>
                    <span className="text-xs text-primary/70 italic tracking-wide">{item.tagline}</span>
                  </div>
                  <p className="text-xs text-foreground/55 leading-relaxed mb-3">{item.why}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.peptides.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-0.5 rounded-full border border-primary/25 bg-primary/5 text-[10px] text-primary tracking-wide"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  {product && (
                    <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        ${(product.priceCents / 100).toFixed(0)}
                      </span>
                      <button
                        onClick={() => handleAdd(product)}
                        className={`min-h-11 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold tracking-widest uppercase transition-all duration-200 ${
                          isAdded
                            ? "bg-primary/20 text-primary border border-primary/40"
                            : "bg-primary text-[#0A0A0A] hover:bg-primary/85"
                        }`}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {isAdded ? copy.aiResult.added : copy.aiResult.addToCart}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next step */}
      <div className="bg-card/50 border border-border/40 rounded-lg px-5 py-3.5 mb-6">
        <p className="text-sm text-foreground/75 leading-relaxed">{result.nextStep}</p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          data-testid="result-primary-cta"
          onClick={onConsult}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm tracking-wide"
        >
          {copy.aiResult.consult} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          data-testid="result-reset"
          variant="outline"
          onClick={onReset}
          className="border-border/60 text-muted-foreground hover:border-primary/40 h-11 px-6"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> {copy.aiResult.reset}
        </Button>
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground/35 text-center leading-relaxed max-w-lg mx-auto">
        {result.disclaimer}
      </p>
    </motion.div>
  );
}

function ErrorResultScreen({ onReset, onConsult }: { onReset: () => void; onConsult: () => void }) {
  /*i18n:function ErrorResultScreen*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
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
        <span className="text-primary text-xs tracking-[0.25em] uppercase">{copy.errorResult.eyebrow}</span>
        <div className="h-[1px] w-8 bg-primary/40" />
      </div>
      <h3 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">{copy.errorResult.title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-10 text-base">
        {copy.errorResult.body}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          data-testid="result-primary-cta"
          onClick={onConsult}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base tracking-wide"
        >
          {copy.errorResult.consult} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          data-testid="result-reset"
          variant="outline"
          onClick={onReset}
          className="border-border/60 text-muted-foreground hover:border-primary/40 h-12 px-8"
        >
          {copy.errorResult.reset}
        </Button>
      </div>
    </motion.div>
  );
}

export function PatientAssessment({ onOpenConsult, onContinueProtocol }: { onOpenConsult: () => void; onContinueProtocol?: () => void }) {
  /*i18n:export function PatientAssessment*/
  const { dict } = useI18n();
  const copy = dict.patientAssessment;
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<"quiz" | "loading" | "result" | "error" | "medical">("quiz");
  const [aiResult, setAiResult] = useState<ProtocolRecommendation | null>(null);
  const completedRef = useRef(false);
  const lastStepRef = useRef<string>("knowledge");

  const { mutateAsync: getRecommendation } = useGetProtocolRecommendation();

  const sequence = getSequence(answers);
  const totalSteps = sequence.length;
  const currentKey = sequence[stepIndex];

  useEffect(() => {
    if (phase !== "quiz" || !currentKey) return;
    lastStepRef.current = currentKey;
    trackEvent("pf_step_view", { stepKey: currentKey });
  }, [phase, currentKey]);

  useEffect(() => {
    return () => {
      if (!completedRef.current) {
        trackEvent("pf_drop_off", { stepKey: lastStepRef.current });
      }
    };
  }, []);

  const advance = async (key: keyof Answers, value: string | string[]) => {
    trackEvent("pf_step_complete", { stepKey: key });
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
      completedRef.current = true;
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
      completedRef.current = true;
      trackEvent("pf_recommendation_shown", {
        protocol_count: recommendation.protocols?.length ?? 0,
        protocols: (recommendation.protocols ?? []).map((p) => p.protocol).slice(0, 8),
      });
    } catch {
      setPhase("error");
      completedRef.current = true;
    }
  };

  const goBack = () => { if (stepIndex > 0) setStepIndex(stepIndex - 1); };

  const reset = () => {
    completedRef.current = false;
    setPhase("quiz");
    setAiResult(null);
    setTimeout(() => {
      setStepIndex(0);
      setAnswers({});
    }, 200);
  };

  const progressPct = phase !== "quiz" ? 100 : (stepIndex / totalSteps) * 100;
  const stepLabel = copy.stepOf
    .replace("{current}", String(stepIndex + 1))
    .replace("{total}", String(totalSteps));

  return (
    <section id="assessment" className="pt-6 sm:pt-8 pb-8 sm:pb-10 px-3 sm:px-6 md:px-12 bg-card relative z-20">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-3xl mx-auto">
          <div className="bg-background/60 border border-border/60 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
            {phase === "quiz" && (
              <div className="mb-5 sm:mb-7">
                <div className="md:hidden" aria-label={`${stepLabel}, ${Math.round(progressPct)}% complete`}>
                  <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>{stepLabel}</span>
                    <span>{Math.round(progressPct)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      animate={{ width: `${Math.max(progressPct, 4)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-between">
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
                className="mt-6 sm:mt-8 min-h-11 px-2 -ml-2 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
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
