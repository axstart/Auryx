import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Stethoscope, Loader2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { applyPageSeo } from "@/lib/seo";

const GOALS = [
  "Weight Loss",
  "Recovery & Regeneration",
  "Anti-Aging & Longevity",
  "Growth Hormone Optimization",
  "Cognitive Enhancement",
  "Sexual Health & Vitality",
  "Immune Support",
  "Other",
] as const;

const MEDICAL_HISTORY_OPTIONS = [
  {
    key: "hormone-sensitive-cancer",
    title: "History of hormone-sensitive cancer",
    subtitle: "Breast, prostate, ovarian, endometrial, or other hormone-driven cancers",
  },
  {
    key: "other-cancer",
    title: "History of other cancer",
    subtitle: "Any malignancy not listed above, past or present",
  },
  {
    key: "cancer-treatment",
    title: "Currently undergoing cancer treatment",
    subtitle: "Chemotherapy, radiation, immunotherapy, or targeted therapy",
  },
  {
    key: "cardiovascular-disease",
    title: "Significant cardiovascular disease",
    subtitle: "Heart attack, stroke, heart failure, or serious arrhythmia",
  },
  {
    key: "diabetes",
    title: "Diabetes — Type 1 or Type 2",
    subtitle: "Insulin-dependent or diet/medication-controlled",
  },
  {
    key: "thyroid-disorder",
    title: "Thyroid disorder",
    subtitle: "Hypothyroidism, hyperthyroidism, Hashimoto's, Graves' disease",
  },
  {
    key: "autoimmune",
    title: "Autoimmune condition",
    subtitle: "Lupus, MS, rheumatoid arthritis, IBD, or similar diagnosis",
  },
  {
    key: "kidney-liver-disease",
    title: "Kidney or liver disease",
    subtitle: "Chronic kidney disease, hepatitis, cirrhosis, or similar",
  },
  {
    key: "eating-disorder",
    title: "History of eating disorder",
    subtitle: "Anorexia, bulimia, binge eating disorder, or similar",
  },
  {
    key: "psychiatric",
    title: "Active psychiatric condition",
    subtitle: "Depression, anxiety, bipolar disorder, schizophrenia, or similar — currently under treatment",
  },
  {
    key: "pregnant-nursing",
    title: "Pregnant or nursing",
    subtitle: "Current pregnancy or breastfeeding",
  },
  {
    key: "other",
    title: "Other",
    subtitle: "A condition not listed above",
  },
  {
    key: "none",
    title: "None of the above",
    subtitle: "I do not have any of the conditions listed",
  },
] as const;

export default function CheckoutSuccessPage() {
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);
  const [otherCondition, setOtherCondition] = useState("");
  const [form, setForm] = useState({
    patientName: "",
    dob: "",
    height: "",
    weight: "",
    medications: "",
    goal: "",
    priorPeptideUse: false,
    priorPeptidesDetail: "",
    allergies: "",
    notes: "",
  });

  useEffect(() => {
    applyPageSeo({
      title: "Order Confirmed | Auryx",
      description: "Your Auryx order has been received and is under clinical review.",
      path: "/checkout/success",
      noindex: true,
    });

    const stored = localStorage.getItem("auryx_last_order");
    if (stored) {
      const id = parseInt(stored, 10);
      if (!isNaN(id)) setOrderId(id);
    }
  }, []);

  const toggleCondition = (key: string) => {
    if (key === "none") {
      setConditions(["none"]);
      return;
    }
    setConditions(prev => {
      const withoutNone = prev.filter(c => c !== "none");
      if (prev.includes(key)) {
        return withoutNone.filter(c => c !== key);
      }
      return [...withoutNone, key];
    });
    setFormError(null);
  };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    if (!form.patientName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        orderId,
        ...form,
        conditions: conditions.includes("other") && otherCondition.trim()
          ? [...conditions, `other: ${otherCondition.trim()}`]
          : conditions,
      };
      const res = await fetch("/api/consultation-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(typeof data.error === "string" ? data.error : "Failed to submit. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      setSubmitting(false);
    } catch {
      setFormError("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 pt-[calc(var(--site-header-height)+2rem)] pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Order Confirmed</p>
        <h1 className="text-4xl font-serif text-foreground mb-4">Your order is in review.</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
          Our clinical team reviews every order before fulfillment. You'll receive a confirmation email shortly.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          If you'd like a personalized protocol review by our physician, complete the optional intake form below. Our medical director will evaluate your profile and follow up via email within 24–48 hours.
        </p>

        <div className="bg-card/50 border border-border rounded-xl p-5 mb-8 text-left space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">What happens next</p>
          {[
            { step: "1", text: "Clinical review (24–48 hours)" },
            { step: "2", text: "Physician approval + personalized dosing confirmation" },
            { step: "3", text: "Shipped from US-licensed compounding pharmacy" },
            { step: "4", text: "Discreet delivery to your door" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] text-primary font-medium shrink-0">
                {step}
              </span>
              <span className="text-foreground/70">{text}</span>
            </div>
          ))}
        </div>

        {/* ── Consultation intake form ── */}
        {orderId && !showForm && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-[#0A0A0A] border border-[#C9A844]/20 rounded-2xl p-6 text-left"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#C9A844]/10 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-[#C9A844]" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium font-['DM_Sans']">Complete Your Consultation Intake</h3>
                <p className="text-white/40 text-[11px] font-['DM_Sans'] mt-0.5">Optional — helps us prepare for your physician review</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full h-11 rounded-xl bg-[#C9A844] hover:bg-[#b8973d] text-black text-sm font-medium font-['DM_Sans'] transition-colors"
            >
              Start Intake Form
            </button>
          </motion.div>
        )}

        {showForm && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white border border-[#E8E8E4] rounded-2xl p-6 text-left"
          >
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium mb-5">Physician Consultation Intake</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Full Name *</label>
                <input
                  autoComplete="name"
                  value={form.patientName}
                  onChange={setField("patientName")}
                  className="w-full h-11 bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 text-base md:text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844]"
                  placeholder="Dr. Smith will see this"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    autoComplete="bday"
                    value={form.dob}
                    onChange={setField("dob")}
                    className="w-full h-11 bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 text-base md:text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Primary Goal</label>
                  <select
                    value={form.goal}
                    onChange={setField("goal")}
                    className="w-full h-11 bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 text-base md:text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844]"
                  >
                    <option value="">Select a goal</option>
                    {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Height</label>
                  <input
                    value={form.height}
                    onChange={setField("height")}
                    className="w-full h-11 bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 text-base md:text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844]"
                    placeholder="e.g. 5'10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Weight</label>
                  <input
                    value={form.weight}
                    onChange={setField("weight")}
                    className="w-full h-11 bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 text-base md:text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844]"
                    placeholder="e.g. 175 lbs"
                  />
                </div>
              </div>

              {/* ── Medical History Checkboxes ── */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-2">
                  Medical History — Select all that apply
                </label>
                <div className="space-y-1.5">
                  {MEDICAL_HISTORY_OPTIONS.map((opt) => {
                    const isSelected = conditions.includes(opt.key);
                    return (
                      <div key={opt.key}>
                        <button
                          type="button"
                          onClick={() => toggleCondition(opt.key)}
                          className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                            isSelected
                              ? "bg-[#0A0A0A] border-[#C9A844]/30 shadow-sm"
                              : "bg-[#FAFAF8] border-[#E8E8E4] hover:border-[#C9A844]/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected ? "bg-[#C9A844] border-[#C9A844]" : "border-[#E8E8E4] bg-white"
                          }`}>
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <Check className="w-3 h-3 text-black" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-medium leading-tight ${isSelected ? "text-white" : "text-[#0A0A0A]"}`}>
                              {opt.title}
                            </p>
                            <p className={`text-[11px] leading-relaxed mt-0.5 ${isSelected ? "text-white/50" : "text-[#0A0A0A]/40"}`}>
                              {opt.subtitle}
                            </p>
                          </div>
                        </button>
                        {opt.key === "other" && isSelected && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-1.5 pl-2">
                            <textarea
                              value={otherCondition}
                              onChange={e => { setOtherCondition(e.target.value); setFormError(null); }}
                              rows={2}
                              className="w-full bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844] resize-none"
                              placeholder="Please describe the condition"
                            />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Current Medications</label>
                <textarea
                  value={form.medications}
                  onChange={setField("medications")}
                  rows={2}
                  className="w-full bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844] resize-none"
                  placeholder="List any medications, supplements, or therapies"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="priorPeptideUse"
                  type="checkbox"
                  checked={form.priorPeptideUse}
                  onChange={setField("priorPeptideUse")}
                  className="w-5 h-5 rounded border-[#E8E8E4] accent-[#C9A844]"
                />
                <label htmlFor="priorPeptideUse" className="text-sm text-[#0A0A0A]/70">I have used peptides before</label>
              </div>
              {form.priorPeptideUse && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <textarea
                    value={form.priorPeptidesDetail}
                    onChange={setField("priorPeptidesDetail")}
                    rows={2}
                    className="w-full bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844] resize-none"
                    placeholder="Which peptides? Duration and results?"
                  />
                </motion.div>
              )}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Allergies</label>
                <input
                  autoComplete="off"
                  value={form.allergies}
                  onChange={setField("allergies")}
                  className="w-full h-11 bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844]"
                  placeholder="Drug or substance allergies"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={setField("notes")}
                  rows={2}
                  className="w-full bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#C9A844] resize-none"
                  placeholder="Anything else our physician should know"
                />
              </div>

              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{formError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-11 rounded-xl border border-[#E8E8E4] text-[#0A0A0A]/50 text-sm font-medium hover:bg-[#FAFAF8] transition-colors"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 rounded-xl bg-[#0A0A0A] text-white text-sm font-medium hover:bg-[#222] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Submitting..." : "Submit Intake"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-[#0A0A0A] border border-[#C9A844]/20 rounded-2xl p-6 text-center"
          >
            <CheckCircle2 className="w-8 h-8 text-[#C9A844] mx-auto mb-3" />
            <h3 className="text-white text-sm font-medium font-['DM_Sans']">Intake Submitted</h3>
            <p className="text-white/40 text-[11px] font-['DM_Sans'] mt-1">Our clinical team will review your information before scheduling your physician consultation.</p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button variant="outline" className="border-border/60 h-10 text-sm">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground h-10 text-sm flex items-center gap-2">
              Return Home <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
