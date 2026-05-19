import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateConsultation } from "@workspace/api-client-react";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const STEPS = [
  { number: 1, label: "Your Details" },
  { number: 2, label: "Your Goals" },
  { number: 3, label: "Final Details" },
];

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["name", "email", "age", "state"],
  2: ["interest", "primaryGoal", "usedPeptidesBefore"],
  3: ["hearAboutUs"],
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  state: z.string().min(1, "Please select your state"),
  age: z.coerce.number({ invalid_type_error: "Age is required" }).int().min(18, "Must be at least 18").max(120, "Invalid age"),
  interest: z.string().min(1, "Please select an area of interest"),
  primaryGoal: z.string().min(1, "Please select your primary goal"),
  usedPeptidesBefore: z.enum(["yes", "no"], { message: "Please select one" }),
  hearAboutUs: z.string().min(1, "Please select how you heard about us"),
  instagramHandle: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6 pt-1">
      {STEPS.map((s, i) => {
        const done = step > s.number;
        const active = step === s.number;
        return (
          <div key={s.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-semibold transition-all duration-300 ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border/50 text-muted-foreground bg-transparent"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : s.number}
              </div>
              <span
                className={`text-[10px] tracking-wide uppercase font-medium transition-colors duration-300 ${
                  active ? "text-primary" : done ? "text-primary/60" : "text-muted-foreground/50"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 h-px mb-5 transition-colors duration-300 ${
                  step > s.number ? "bg-primary/50" : "bg-border/40"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function ConsultationModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const createConsultation = useCreateConsultation();
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      state: "",
      age: undefined as unknown as number,
      interest: "",
      primaryGoal: "",
      usedPeptidesBefore: undefined as unknown as "yes" | "no",
      hearAboutUs: "",
      instagramHandle: "",
      message: "",
    },
  });

  async function handleNext() {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (!valid) return;
    setDirection(1);
    setStep((s) => s + 1);
  }

  function handleBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function onSubmit(values: FormValues) {
    createConsultation.mutate(
      {
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          state: values.state,
          age: values.age,
          interest: values.interest,
          primaryGoal: values.primaryGoal,
          usedPeptidesBefore: values.usedPeptidesBefore,
          hearAboutUs: values.hearAboutUs,
          instagramHandle: values.instagramHandle || undefined,
          message: values.message,
        },
      },
      {
        onSuccess: () => setSuccessEmail(values.email),
        onError: () =>
          toast({
            title: "Submission failed",
            description: "Please try again or contact us directly.",
            variant: "destructive",
          }),
      }
    );
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setSuccessEmail(null);
      setStep(1);
      setDirection(1);
      form.reset();
    }, 300);
  }

  const inputClass = "bg-background border-border focus-visible:ring-primary";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] bg-card border-border overflow-hidden">
        {successEmail ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center py-10 px-4 gap-5"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-foreground">Request Received.</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                A member of our concierge team will be in touch shortly. We look forward to speaking with you.
              </p>
            </div>
            <p className="text-sm">
              We'll follow up at{" "}
              <span className="text-primary font-medium">{successEmail}</span>
            </p>
            <Button
              variant="outline"
              onClick={handleClose}
              className="mt-2 border-border/60 text-foreground hover:bg-card/80 px-8"
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className="mb-1">
                <DialogTitle className="font-serif text-2xl font-semibold">
                  Request Private Consultation
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Enter your details below to schedule an initial discussion with our medical team.
                </DialogDescription>
              </DialogHeader>

              <ProgressBar step={step} />

              <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    {step === 1 && (
                      <>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} className={inputClass} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" type="email" {...field} className={inputClass} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Phone{" "}
                                <span className="text-muted-foreground font-normal">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 000-0000" {...field} className={inputClass} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="18"
                                    max="120"
                                    placeholder="e.g. 34"
                                    {...field}
                                    value={field.value ?? ""}
                                    className={inputClass}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className={inputClass}>
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="max-h-60">
                                    {US_STATES.map((s) => (
                                      <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <FormField
                          control={form.control}
                          name="interest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Area of Interest</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className={inputClass}>
                                    <SelectValue placeholder="Select a protocol focus" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="anti-aging">Anti-Aging & Longevity</SelectItem>
                                  <SelectItem value="fat-loss">Fat Loss & Body Composition</SelectItem>
                                  <SelectItem value="sexual-health">Sexual Health & Vitality</SelectItem>
                                  <SelectItem value="recovery">Recovery & Regeneration</SelectItem>
                                  <SelectItem value="cognitive">Cognitive Performance</SelectItem>
                                  <SelectItem value="energy">Energy & Vitality</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="primaryGoal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Goal</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className={inputClass}>
                                    <SelectValue placeholder="Select your primary goal" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                  <SelectItem value="anti-aging">Anti-Aging</SelectItem>
                                  <SelectItem value="performance">Performance & Strength</SelectItem>
                                  <SelectItem value="energy-focus">Energy & Focus</SelectItem>
                                  <SelectItem value="recovery">Recovery</SelectItem>
                                  <SelectItem value="hormonal">Hormonal Balance</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="usedPeptidesBefore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Have you used peptides before?</FormLabel>
                              <FormControl>
                                <div className="flex gap-3">
                                  {(["yes", "no"] as const).map((val) => (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => field.onChange(val)}
                                      className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${
                                        field.value === val
                                          ? "border-primary bg-primary/10 text-primary"
                                          : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-border/80"
                                      }`}
                                    >
                                      {val === "yes" ? "Yes" : "No"}
                                    </button>
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <FormField
                          control={form.control}
                          name="instagramHandle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Instagram Handle{" "}
                                <span className="text-muted-foreground font-normal">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="@yourhandle" {...field} className={inputClass} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hearAboutUs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>How did you hear about us?</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className={inputClass}>
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="instagram">Instagram</SelectItem>
                                  <SelectItem value="google">Google Search</SelectItem>
                                  <SelectItem value="referral">Referral from a Friend</SelectItem>
                                  <SelectItem value="tiktok">TikTok</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Additional Context{" "}
                                <span className="text-muted-foreground font-normal">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Briefly describe your goals or current protocols..."
                                  className={`resize-none h-24 ${inputClass}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border-border/60 text-foreground hover:bg-card/80"
                  >
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={createConsultation.isPending}
                  >
                    {createConsultation.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
