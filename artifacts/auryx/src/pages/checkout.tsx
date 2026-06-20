import { useState, useEffect, useCallback, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, AlertCircle, Loader2, CheckCircle2, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";

let _stripePromise: ReturnType<typeof loadStripe> | null = null;

function getStripePromise(): ReturnType<typeof loadStripe> {
  if (!_stripePromise) {
    _stripePromise = fetch("/api/checkout/publishable-key")
      .then(r => {
        if (!r.ok) throw new Error("Failed to load Stripe key");
        return r.json();
      })
      .then(({ publishableKey }: { publishableKey: string }) => {
        if (!publishableKey || !publishableKey.startsWith("pk_")) {
          throw new Error("Invalid Stripe publishable key");
        }
        return loadStripe(publishableKey);
      })
      .catch(err => {
        _stripePromise = null;
        throw err;
      }) as ReturnType<typeof loadStripe>;
  }
  return _stripePromise;
}

const RESEARCH_FIELDS = [
  "Longevity & healthspan research",
  "Metabolic function & body composition research",
  "Cognitive function & neuroprotection research",
  "Muscle recovery & physical performance research",
  "Immune function & cellular health research",
  "Analytical chemistry & quality assurance",
  "Academic or institutional research",
  "Other research application",
] as const;

interface CheckoutForm {
  customerName: string;
  email: string;
  phone: string;
  researchField: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface CheckoutPaymentProps {
  form: CheckoutForm;
  totalCents: number;
  onSuccess: () => void;
}

function CheckoutPayment({ form, totalCents, onSuccess }: CheckoutPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? `Submit error (${submitError.type ?? "unknown"})`);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(i => ({
          slug: i.product.slug,
          quantity: i.quantity,
          ...(i.variantLabel ? { variantLabel: i.variantLabel } : {}),
        })),
        customerEmail: form.email,
      }),
    });

    if (!res.ok) {
      setError("Payment initialization failed. Please try again.");
      setLoading(false);
      return;
    }

    const { clientSecret } = await res.json();

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: window.location.origin + "/checkout/success" },
      redirect: "if_required",
    });

    if (confirmError) {
      const msg = confirmError.message
        ?? `Payment error (${confirmError.type ?? "unknown"} / ${confirmError.code ?? "no-code"})`;
      setError(msg);
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const orderRes = await fetch("/api/checkout/complete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          customerName: form.customerName,
          email: form.email,
          phone: form.phone || undefined,
          researchField: form.researchField,
          shippingAddress: {
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: "US",
          },
          items: items.map(i => ({
            slug: i.product.slug,
            quantity: i.quantity,
            ...(i.variantLabel ? { variantLabel: i.variantLabel } : {}),
          })),
        }),
      });

      if (!orderRes.ok) {
        setError("Order could not be saved. Please contact support with your payment receipt.");
        setLoading(false);
        return;
      }

      clearCart();
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[#E8E8E4] rounded-xl overflow-hidden bg-white p-5">
        <PaymentElement options={{ layout: "accordion" }} />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-13 py-3.5 bg-[#0A0A0A] text-white text-sm font-medium tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Processing..." : `Complete Order — $${(totalCents / 100).toFixed(2)}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-[#0A0A0A]/40">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
        Secured by Stripe · 256-bit TLS encryption
      </div>
    </form>
  );
}

const STRIPE_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#0A0A0A",
    colorBackground: "#ffffff",
    colorText: "#0A0A0A",
    colorDanger: "#dc2626",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "8px",
    colorBorder: "#E8E8E4",
  },
  rules: {
    ".Input": { border: "1px solid #E8E8E4", boxShadow: "none" },
    ".Input:focus": { border: "1px solid #0A0A0A", boxShadow: "none" },
    ".Label": { color: "#0A0A0A", fontWeight: "500" },
  },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">
      {children}
    </label>
  );
}

type Step = "details" | "verify" | "payment";

export default function CheckoutPage() {
  const { items, totalCents, totalItems } = useCart();
  const [, navigate] = useLocation();
  const [stripeP] = useState<ReturnType<typeof loadStripe>>(() => getStripePromise());
  const [stripeError, setStripeError] = useState(false);
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<CheckoutForm>({
    customerName: "", email: "", phone: "", researchField: "",
    street: "", city: "", state: "", zip: "",
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  // OTP state
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    stripeP.catch(() => setStripeError(true));
  }, [stripeP]);

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const validate = useCallback(() => {
    const e: Partial<CheckoutForm> = {};
    if (!form.customerName.trim()) e.customerName = "Name required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.researchField) e.researchField = "Please select your research application";
    if (!form.street.trim()) e.street = "Street required";
    if (!form.city.trim()) e.city = "City required";
    if (!form.state.trim()) e.state = "State required";
    if (!form.zip.trim()) e.zip = "ZIP required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const set = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  function startResendCooldown() {
    setResendCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(c => {
        if (c <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  async function requestOtp(email: string): Promise<boolean> {
    const r = await fetch("/api/checkout/request-otp", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.error ?? "Could not send verification code");
    }
    return true;
  }

  async function handleContinue() {
    if (!validate()) return;

    // If this email is already verified in this session, skip OTP
    if (verifiedEmail === form.email.trim().toLowerCase()) {
      setStep("payment");
      return;
    }

    setRequestingOtp(true);
    setErrors({});
    try {
      await requestOtp(form.email.trim());
      setOtpValue("");
      setOtpError(null);
      startResendCooldown();
      setStep("verify");
    } catch (err: unknown) {
      setErrors(e => ({ ...e, email: err instanceof Error ? err.message : "Could not send code" }));
    } finally {
      setRequestingOtp(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setRequestingOtp(true);
    setOtpError(null);
    try {
      await requestOtp(form.email.trim());
      setOtpValue("");
      startResendCooldown();
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : "Could not resend code");
    } finally {
      setRequestingOtp(false);
    }
  }

  async function handleVerify() {
    const code = otpValue.replace(/\D/g, "");
    if (code.length !== 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }

    setOtpLoading(true);
    setOtpError(null);
    try {
      const r = await fetch("/api/checkout/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), otp: code }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setOtpError(body.error ?? "Invalid code. Please try again.");
        return;
      }
      setVerifiedEmail(form.email.trim().toLowerCase());
      setStep("payment");
    } catch {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  if (items.length === 0 && step !== "payment") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAFAF8" }}>
        <div className="text-center">
          <p className="text-[#0A0A0A]/45 mb-4 text-sm">Your cart is empty.</p>
          <Link href="/shop" className="text-[#B8962E] hover:underline text-sm">← Browse protocols</Link>
        </div>
      </div>
    );
  }

  const inputCls = "bg-white border-[#E8E8E4] text-[#0A0A0A] h-11 rounded-lg focus:border-[#0A0A0A] focus:ring-0 placeholder:text-[#0A0A0A]/30 text-sm";

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <div className="pt-32 pb-5 px-6 md:px-12 border-b border-[#E8E8E4]">
        <div className="container mx-auto max-w-5xl">
          {step !== "details" ? (
            <button
              onClick={() => setStep(step === "payment" ? "verify" : "details")}
              className="inline-flex items-center gap-1.5 text-xs text-[#0A0A0A]/40 hover:text-[#B8962E] transition-colors mb-4"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          ) : (
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-[#0A0A0A]/40 hover:text-[#B8962E] transition-colors mb-4">
              <ArrowLeft className="w-3 h-3" /> Back to Shop
            </Link>
          )}
          <h1 className="font-serif text-[#0A0A0A] text-4xl">Checkout</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {(["details", "verify", "payment"] as Step[]).map((s, i) => {
              const stepLabels: Record<Step, string> = { details: "Details", verify: "Verify Email", payment: "Payment" };
              const stepIdx = ["details", "verify", "payment"].indexOf(step);
              const thisIdx = i;
              const done = thisIdx < stepIdx;
              const active = thisIdx === stepIdx;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                    active ? "text-[#0A0A0A]" : done ? "text-[#0D9488]" : "text-[#0A0A0A]/30"
                  }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                      active ? "bg-[#0A0A0A] text-white" : done ? "bg-[#0D9488] text-white" : "bg-[#0A0A0A]/10 text-[#0A0A0A]/30"
                    }`}>
                      {done ? "✓" : i + 1}
                    </div>
                    {stepLabels[s]}
                  </div>
                  {i < 2 && <div className={`w-8 h-px ${thisIdx < stepIdx ? "bg-[#0D9488]/40" : "bg-[#0A0A0A]/10"}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left — Form */}
            <div className="lg:col-span-3 space-y-8">
              <AnimatePresence mode="wait">

                {/* ── Step 1: Details ── */}
                {step === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-8"
                  >
                    {/* Contact */}
                    <div>
                      <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium mb-5">
                        Contact Information
                      </h2>
                      <div className="space-y-3">
                        <div>
                          <FieldLabel>Full Name *</FieldLabel>
                          <Input placeholder="Jane Smith" value={form.customerName} onChange={set("customerName")} className={inputCls} />
                          {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
                        </div>
                        <div>
                          <FieldLabel>Email Address *</FieldLabel>
                          <Input placeholder="jane@example.com" type="email" value={form.email} onChange={set("email")} className={inputCls} />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                          <p className="text-[10px] text-[#0A0A0A]/35 mt-1.5 leading-relaxed">
                            A verification code will be sent to this address before payment.
                          </p>
                        </div>
                        <div>
                          <FieldLabel>Phone (optional)</FieldLabel>
                          <Input placeholder="+1 (555) 000-0000" type="tel" value={form.phone} onChange={set("phone")} className={inputCls} />
                        </div>
                      </div>
                    </div>

                    {/* Research Application */}
                    <div>
                      <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium mb-5">
                        Research Application
                      </h2>
                      <div>
                        <FieldLabel>Intended Research Field *</FieldLabel>
                        <select
                          value={form.researchField}
                          onChange={e => {
                            setForm(f => ({ ...f, researchField: e.target.value }));
                            setErrors(er => ({ ...er, researchField: undefined }));
                          }}
                          className="w-full h-11 bg-white border border-[#E8E8E4] text-[#0A0A0A] rounded-lg px-3 text-sm focus:border-[#0A0A0A] focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230A0A0A' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px", paddingRight: "36px" }}
                        >
                          <option value="" disabled>Select research application…</option>
                          {RESEARCH_FIELDS.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                        {errors.researchField && <p className="text-xs text-red-500 mt-1">{errors.researchField}</p>}
                        <p className="text-[10px] text-[#0A0A0A]/35 mt-1.5 leading-relaxed">
                          All products are sold for research purposes only and are not intended for human consumption.
                        </p>
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium mb-5">
                        Shipping Address
                      </h2>
                      <div className="space-y-3">
                        <div>
                          <FieldLabel>Street Address *</FieldLabel>
                          <Input placeholder="123 Main Street" value={form.street} onChange={set("street")} className={inputCls} />
                          {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                          <p className="text-[10px] text-[#0A0A0A]/35 mt-1.5">
                            No P.O. Boxes — a physical street address is required.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel>City *</FieldLabel>
                            <Input placeholder="New York" value={form.city} onChange={set("city")} className={inputCls} />
                            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                          </div>
                          <div>
                            <FieldLabel>State *</FieldLabel>
                            <Input placeholder="NY" value={form.state} onChange={set("state")} className={inputCls} />
                            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>ZIP Code *</FieldLabel>
                          <Input placeholder="10001" value={form.zip} onChange={set("zip")} className={`${inputCls} max-w-[160px]`} />
                          {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleContinue}
                      disabled={requestingOtp}
                      className="w-full h-12 bg-[#0A0A0A] text-white text-sm font-medium tracking-wide uppercase rounded-xl hover:bg-[#222] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {requestingOtp && <Loader2 className="w-4 h-4 animate-spin" />}
                      {requestingOtp ? "Sending code…" : "Continue — Verify Email"}
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: Email Verification ── */}
                {step === "verify" && (
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 p-5 bg-white border border-[#E8E8E4] rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-[#0D9488]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0A0A0A]">Check your inbox</p>
                        <p className="text-sm text-[#0A0A0A]/55 mt-0.5">
                          We sent a 6-digit verification code to{" "}
                          <span className="font-medium text-[#0A0A0A]">{form.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* OTP Input */}
                    <div>
                      <FieldLabel>Verification Code *</FieldLabel>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otpValue}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setOtpValue(v);
                          setOtpError(null);
                        }}
                        placeholder="000000"
                        className="w-full h-14 bg-white border border-[#E8E8E4] text-[#0A0A0A] text-2xl font-mono text-center rounded-xl focus:border-[#0A0A0A] focus:outline-none focus:ring-0 tracking-[0.5em] placeholder:text-[#0A0A0A]/20 placeholder:text-lg placeholder:tracking-widest"
                        autoFocus
                      />
                      {otpError && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <p className="text-xs text-red-500">{otpError}</p>
                        </div>
                      )}
                      <p className="text-[10px] text-[#0A0A0A]/35 mt-2">
                        Code expires in 10 minutes. Check spam if you don't see it.
                      </p>
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={otpLoading || otpValue.replace(/\D/g, "").length !== 6}
                      className="w-full h-12 bg-[#0A0A0A] text-white text-sm font-medium tracking-wide uppercase rounded-xl hover:bg-[#222] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {otpLoading ? "Verifying…" : "Verify & Continue to Payment"}
                    </button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        onClick={() => setStep("details")}
                        className="text-xs text-[#0A0A0A]/40 hover:text-[#B8962E] transition-colors"
                      >
                        ← Change email
                      </button>
                      <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || requestingOtp}
                        className="text-xs text-[#0A0A0A]/40 hover:text-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : requestingOtp ? "Sending…" : "Resend code"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Payment ── */}
                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium">Payment</h2>
                        <p className="text-sm text-[#0A0A0A]/60 mt-0.5">
                          {form.customerName} · {form.email}
                          <span className="ml-2 text-[#0D9488] text-[10px]">✓ Email verified</span>
                        </p>
                      </div>
                      <button onClick={() => setStep("details")} className="text-xs text-[#B8962E] hover:underline">
                        Edit details
                      </button>
                    </div>

                    {stripeError ? (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                        Unable to load payment form. Please refresh and try again.
                      </div>
                    ) : (
                      <Elements
                        stripe={stripeP}
                        options={{
                          mode: "payment",
                          amount: totalCents,
                          currency: "usd",
                          appearance: STRIPE_APPEARANCE,
                        }}
                      >
                        <CheckoutPayment
                          form={form}
                          totalCents={totalCents}
                          onSuccess={() => navigate("/checkout/success")}
                        />
                      </Elements>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E8E8E4] rounded-2xl p-6 sticky top-28 shadow-sm">
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium mb-5">Order Summary</h3>

                <div className="space-y-3 mb-5">
                  {items.map(({ product, quantity }) => (
                    <div key={product.slug} className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#0A0A0A] font-medium leading-tight">{product.name}</p>
                        <p className="text-xs text-[#0A0A0A]/40 mt-0.5">×{quantity}</p>
                      </div>
                      <span className="text-sm text-[#0A0A0A] font-medium shrink-0">
                        ${((product.priceCents * quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8E8E4] pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#0A0A0A]/45">Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                    <span className="text-[#0A0A0A]">${(totalCents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#0A0A0A]/45">Shipping</span>
                    <span className="text-[#0D9488] text-xs">Calculated after review</span>
                  </div>
                </div>

                <div className="border-t border-[#E8E8E4] pt-4 mt-1 flex justify-between items-baseline">
                  <span className="font-medium text-[#0A0A0A] text-sm uppercase tracking-wider">Total</span>
                  <span className="font-serif text-[#0A0A0A] text-2xl">${(totalCents / 100).toFixed(2)}</span>
                </div>

                {items.some(i => i.product.requiresConsultation) && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 leading-relaxed">
                      One or more items require a physician consultation. Our clinical team will contact you after ordering.
                    </p>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-[#E8E8E4] space-y-2">
                  {[
                    "Physician-reviewed before fulfillment",
                    "Discreet, insured shipping",
                    "30-day satisfaction guarantee",
                  ].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                      <span className="text-[11px] text-[#0A0A0A]/50">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
