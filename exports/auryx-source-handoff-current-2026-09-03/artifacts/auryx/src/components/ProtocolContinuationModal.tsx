import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

type Step = "protocol" | "screening" | "contact" | "redirected" | "success";

const SCREENING_QUESTIONS = [
  { id: "cancer", label: "Active or recent cancer diagnosis, or currently undergoing cancer treatment" },
  { id: "cardiovascular", label: "Serious cardiovascular condition (recent heart attack, uncontrolled arrhythmia, or severe heart failure)" },
  { id: "pregnancy", label: "Currently pregnant or breastfeeding" },
  { id: "immunosuppressants", label: "Taking immunosuppressant medications for an autoimmune condition" },
  { id: "organDisease", label: "Severe liver or kidney disease" },
];

export function ProtocolContinuationModal({
  open,
  onOpenChange,
  onSwitchToConsultation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToConsultation: () => void;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("protocol");

  const [peptides, setPeptides] = useState("");
  const [duration, setDuration] = useState("");
  const [prescribingContext, setPrescribingContext] = useState("");
  const [prescribingDetails, setPrescribingDetails] = useState("");

  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, boolean>>({});
  const [screeningIndex, setScreeningIndex] = useState(0);
  const [redFlags, setRedFlags] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStep("protocol");
    setPeptides(""); setDuration(""); setPrescribingContext(""); setPrescribingDetails("");
    setScreeningAnswers({}); setScreeningIndex(0); setRedFlags([]);
    setName(""); setEmail(""); setPhone(""); setNotes("");
    setSubmitting(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const protocolValid = peptides.trim() && duration && prescribingContext;

  const handleProtocolNext = () => {
    if (!protocolValid) return;
    setScreeningIndex(0);
    setScreeningAnswers({});
    setRedFlags([]);
    setStep("screening");
  };

  const currentQuestion = SCREENING_QUESTIONS[screeningIndex];

  const handleScreeningAnswer = (yes: boolean) => {
    const qId = currentQuestion.id;
    const updated = { ...screeningAnswers, [qId]: yes };
    setScreeningAnswers(updated);

    const updatedFlags = yes ? [...redFlags, qId] : redFlags;
    if (yes) setRedFlags(updatedFlags);

    if (screeningIndex < SCREENING_QUESTIONS.length - 1) {
      setScreeningIndex(screeningIndex + 1);
    } else {
      const allFlags = Object.entries(updated).filter(([, v]) => v).map(([k]) => k);
      if (allFlags.length > 0) {
        setRedFlags(allFlags);
        setStep("redirected");
      } else {
        setStep("contact");
      }
    }
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const contactValid = name.trim().length >= 2 && emailValid && phone.trim().length >= 7;

  const handleSubmit = async () => {
    if (!contactValid) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/protocol-continuations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, peptides, duration, prescribingContext,
          prescribingDetails: prescribingDetails || undefined,
          redFlagsJson: JSON.stringify(redFlags),
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStep("success");
    } catch {
      toast({ title: "Something went wrong", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const progressIndex = ["protocol", "screening", "contact"].indexOf(step);
  const progressPct = step === "success" ? 100 : Math.max(0, ((progressIndex + 1) / 3) * 100);
  const progressLabels = ["Protocol details", "Medical screening", "Your contact info"];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border/60 text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground mb-1">Continue My Protocol</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Already on a protocol? Our streamlined intake gets you approved and dispensed within 24 hours.
          </p>
        </DialogHeader>

        {step !== "success" && step !== "redirected" && (
          <div className="mb-6 mt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{progressLabels[Math.max(0, progressIndex)] ?? ""}</span>
              <span>Step {Math.max(1, progressIndex + 1)} of 3</span>
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
          {step === "protocol" && (
            <motion.div
              key="protocol"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Which peptides are you currently on? *
                </label>
                <Textarea
                  placeholder="e.g. Semaglutide 0.5mg weekly, BPC-157 250mcg daily, CJC-1295 + Ipamorelin 300mcg 5x/week..."
                  className="bg-background/50 border-border/60 min-h-[100px] text-sm resize-none focus:border-primary/50"
                  value={peptides}
                  onChange={e => setPeptides(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  How long have you been on this protocol? *
                </label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-background/50 border-border/60 h-11 focus:border-primary/50">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1-month">Less than 1 month</SelectItem>
                    <SelectItem value="1-3-months">1–3 months</SelectItem>
                    <SelectItem value="3-6-months">3–6 months</SelectItem>
                    <SelectItem value="6-12-months">6–12 months</SelectItem>
                    <SelectItem value="more-than-1-year">More than 1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Who originally prescribed this protocol? *
                </label>
                <Select value={prescribingContext} onValueChange={setPrescribingContext}>
                  <SelectTrigger className="bg-background/50 border-border/60 h-11 focus:border-primary/50">
                    <SelectValue placeholder="Select prescribing context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="md-do">Licensed MD or DO</SelectItem>
                    <SelectItem value="np-pa">Nurse Practitioner or PA</SelectItem>
                    <SelectItem value="functional">Functional / integrative medicine provider</SelectItem>
                    <SelectItem value="telehealth">Online clinic or telehealth service</SelectItem>
                    <SelectItem value="self-managed">Self-managed / no prescription</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Provider name or clinic <span className="text-muted-foreground/50 normal-case">(optional)</span>
                </label>
                <Input
                  placeholder="e.g. Dr. Smith at XYZ Wellness"
                  className="bg-background/50 border-border/60 h-11 focus:border-primary/50"
                  value={prescribingDetails}
                  onChange={e => setPrescribingDetails(e.target.value)}
                />
              </div>
              <Button
                onClick={handleProtocolNext}
                disabled={!protocolValid}
                className="w-full bg-primary text-primary-foreground h-12 text-base tracking-wide mt-2 disabled:opacity-40"
              >
                Continue to Medical Screening <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === "screening" && (
            <motion.div
              key={`screening-${screeningIndex}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="uppercase tracking-wider">Medical screening</span>
                  <span>{screeningIndex + 1} of {SCREENING_QUESTIONS.length}</span>
                </div>
                <div className="h-[1px] bg-border rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="h-full bg-primary/50 rounded-full"
                    animate={{ width: `${((screeningIndex + 1) / SCREENING_QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-3">Do you have any of the following?</h3>
                <p className="text-muted-foreground text-base leading-relaxed border-l-2 border-primary/30 pl-4">
                  {currentQuestion.label}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleScreeningAnswer(false)}
                  className="p-5 rounded-xl border border-border/60 bg-card/30 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-200 text-center group"
                >
                  <p className="text-lg font-serif text-foreground group-hover:text-emerald-400 transition-colors">No</p>
                  <p className="text-xs text-muted-foreground mt-1">This does not apply to me</p>
                </button>
                <button
                  onClick={() => handleScreeningAnswer(true)}
                  className="p-5 rounded-xl border border-border/60 bg-card/30 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-200 text-center group"
                >
                  <p className="text-lg font-serif text-foreground group-hover:text-amber-400 transition-colors">Yes</p>
                  <p className="text-xs text-muted-foreground mt-1">This applies to me</p>
                </button>
              </div>
              {screeningIndex > 0 && (
                <button
                  onClick={() => setScreeningIndex(screeningIndex - 1)}
                  className="mt-5 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous question
                </button>
              )}
            </motion.div>
          )}

          {step === "redirected" && (
            <motion.div
              key="redirected"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif text-foreground mb-4">Physician Review Required</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 text-sm max-w-md mx-auto">
                Based on your responses, we recommend beginning with a private consultation. This is the standard of care for patients in your situation — our physicians will approach your case with complete discretion and your wellbeing as the only priority.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button
                  onClick={() => { handleOpenChange(false); onSwitchToConsultation(); }}
                  className="bg-primary text-primary-foreground h-12 text-base tracking-wide"
                >
                  Request a Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={() => handleOpenChange(false)} className="text-muted-foreground hover:text-foreground text-sm">
                  Close
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/50 mt-6">All information is protected under strict medical privacy standards.</p>
            </motion.div>
          )}

          {step === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-xs text-foreground/70">
                You've cleared the medical screening. A physician will review your intake and reach out within 24 hours on business days.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Full name *</label>
                  <Input
                    placeholder="Your full name"
                    className="bg-background/50 border-border/60 h-11 focus:border-primary/50"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-background/50 border-border/60 h-11 focus:border-primary/50"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Phone *</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="bg-background/50 border-border/60 h-11 focus:border-primary/50"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Notes for your physician <span className="text-muted-foreground/50 normal-case">(optional)</span>
                  </label>
                  <Textarea
                    placeholder="Any additional context or questions you'd like the physician to know before review..."
                    className="bg-background/50 border-border/60 min-h-[80px] text-sm resize-none focus:border-primary/50"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => { setStep("screening"); setScreeningIndex(0); }}
                  className="border-border/60 text-muted-foreground hover:text-foreground shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!contactValid || submitting}
                  className="flex-1 bg-primary text-primary-foreground h-12 text-base tracking-wide disabled:opacity-40"
                >
                  {submitting ? "Submitting..." : <>Submit Intake <ArrowRight className="ml-2 w-4 h-4" /></>}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/50 text-center">
                Reviewed by a licensed Auryx physician — typically within 24 hours on business days.
              </p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-serif text-foreground mb-4">You're in the queue.</h3>
              <p className="text-muted-foreground leading-relaxed mb-3 text-base max-w-md mx-auto">
                Your protocol intake has been received. A licensed Auryx physician will review your submission and reach out — typically within 24 hours on business days.
              </p>
              <p className="text-sm text-muted-foreground/60 mb-8">
                We'll follow up at <span className="text-primary">{email}</span>
              </p>
              <Button variant="outline" onClick={() => handleOpenChange(false)} className="border-border/60 text-muted-foreground hover:text-foreground">
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
