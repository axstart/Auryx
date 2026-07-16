import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, AlertCircle, Loader2, CheckCircle2, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";

// ── PaymentNode client-side tokenization (API 1B) ───────────────────────────
// Card data is tokenized directly in the browser against PaymentNode's vault
// (URL served dynamically from /api/checkout/paymentnode-public-key) and never
// touches our backend. Stripe has been retired from this checkout page per compliance decision.

interface PaymentNodeConfig {
  publicKey: string;
  vaultUrl: string;
}

let _paymentNodeConfigPromise: Promise<PaymentNodeConfig> | null = null;

function getPaymentNodeConfig(): Promise<PaymentNodeConfig> {
  if (!_paymentNodeConfigPromise) {
    _paymentNodeConfigPromise = fetch("/api/checkout/paymentnode-public-key")
      .then(r => {
        if (!r.ok) throw new Error("Failed to load PaymentNode configuration");
        return r.json();
      })
      .then(({ publicKey, vaultUrl }: { publicKey: string; vaultUrl: string }) => {
        if (!publicKey) throw new Error("Invalid PaymentNode public key");
        if (!vaultUrl) throw new Error("Invalid PaymentNode vault URL");
        return { publicKey, vaultUrl };
      })
      .catch(err => {
        _paymentNodeConfigPromise = null;
        throw err;
      });
  }
  return _paymentNodeConfigPromise;
}

interface PaymentNodeTokenizeParams {
  publicKey: string;
  name: string;
  email: string;
  phone: string;
  address: {
    country: string;
    city: string;
    line1: string;
    line2: string;
    postal_code: string;
    province: string;
  };
  number: string;
  cvd: string;
  expiry_date: string;
  type: string;
}

class PaymentNodeTokenizeError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function tokenizeCardClientSide(params: PaymentNodeTokenizeParams & { vaultUrl: string }): Promise<string> {
  const { publicKey, vaultUrl, name, email, phone, address, number, cvd, expiry_date, type } = params;

  const res = await fetch(vaultUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicKey}`,
    },
    body: JSON.stringify({
      channel_id: "CREDIT_CARD",
      credit_card_info: { name, email, phone, address, number, cvd, expiry_date, type },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as Record<string, unknown>);
    const code = typeof body.code === "string" ? body.code : undefined;

    if (res.status === 401) {
      throw new PaymentNodeTokenizeError("Payment system is temporarily unavailable. Please try again shortly.", 401, code);
    }
    if (res.status === 400 && code === "PAYMENT_METHOD_CHANNEL_NOT_SUPPORTED") {
      throw new PaymentNodeTokenizeError("Card payments aren't currently supported. Please contact support.", 400, code);
    }
    if (res.status === 400) {
      const msg = typeof body.message === "string" ? body.message : "Please check your card details and try again.";
      throw new PaymentNodeTokenizeError(msg, 400, code);
    }
    throw new PaymentNodeTokenizeError("Card tokenization failed. Please try again.", res.status, code);
  }

  const data = await res.json() as { _id?: string };
  if (!data._id) throw new PaymentNodeTokenizeError("Unexpected response from payment provider.", 502);
  return data._id;
}

function detectCardType(number: string): string {
  const n = number.replace(/\s+/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "visa";
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
  termsAccepted: boolean;
}

interface BillingAddressForm {
  line1: string;
  line2: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

interface CheckoutPaymentProps {
  form: CheckoutForm;
  totalCents: number;
  onSuccess: () => void;
}

function PaymentNodePayment({ form, totalCents, onSuccess }: CheckoutPaymentProps) {
  const { items, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billing, setBilling] = useState<BillingAddressForm>({
    line1: "", line2: "", city: "", province: "", postal_code: "", country: "US",
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const setBillingField = (k: keyof BillingAddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBilling(b => ({ ...b, [k]: e.target.value }));
    setCardErrors(er => ({ ...er, [k]: "" }));
  };

  function validateCard(): boolean {
    const errs: Record<string, string> = {};
    const digits = cardNumber.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(digits)) errs.cardNumber = "Enter a valid card number";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = "Use MM/YY";
    if (!/^\d{3,4}$/.test(cvv)) errs.cvv = "Enter a valid CVV";

    const addr = sameAsShipping
      ? { line1: form.street, city: form.city, province: form.state, postal_code: form.zip }
      : billing;
    if (!addr.line1.trim()) errs.line1 = "Billing address required";
    if (!addr.city.trim()) errs.city = "City required";
    if (!addr.province.trim()) errs.province = "State required";
    if (!addr.postal_code.trim()) errs.postal_code = "ZIP required";

    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCard()) return;

    setLoading(true);
    setError(null);

    const digits = cardNumber.replace(/\s+/g, "");
    const addr = sameAsShipping
      ? { line1: form.street, line2: "", city: form.city, province: form.state, postal_code: form.zip, country: "US" }
      : billing;

    try {
      const { publicKey, vaultUrl } = await getPaymentNodeConfig();

      // Raw card data goes straight from the browser to PaymentNode's vault —
      // it never touches our own backend.
      const paymentMethodId = await tokenizeCardClientSide({
        publicKey,
        vaultUrl,
        name: form.customerName,
        email: form.email,
        phone: form.phone,
        address: addr,
        number: digits,
        cvd: cvv,
        expiry_date: expiry,
        type: detectCardType(digits),
      });

      const orderId = crypto.randomUUID();

      const chargeRes = await fetch("/api/checkout/place-order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method_id: paymentMethodId,
          order_id: orderId,
          customerName: form.customerName,
          email: form.email,
          phone: form.phone || undefined,
          researchField: form.researchField || undefined,
          termsAccepted: form.termsAccepted as true,
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

      const chargeBody = await chargeRes.json().catch(() => ({}) as Record<string, unknown>);

      if (!chargeRes.ok || chargeBody.success !== true) {
        setError(typeof chargeBody.error === "string" ? chargeBody.error : "Payment charge failed. Please try again.");
        setLoading(false);
        return;
      }

      clearCart();
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof PaymentNodeTokenizeError) {
        setError(err.message);
      } else {
        setError("Payment failed. Please try again.");
      }
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const cardInputCls = "bg-white border-[#E8E8E4] text-[#0A0A0A] h-11 rounded-lg focus:border-[#0A0A0A] focus:ring-0 placeholder:text-[#0A0A0A]/30 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-[#E8E8E4] rounded-xl bg-white p-5 space-y-3">
        <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium mb-2">Card Details</h3>
        <div>
          <FieldLabel>Card Number *</FieldLabel>
          <Input
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            autoComplete="cc-number"
            value={cardNumber}
            onChange={e => { setCardNumber(e.target.value); setCardErrors(er => ({ ...er, cardNumber: "" })); }}
            className={cardInputCls}
          />
          {cardErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{cardErrors.cardNumber}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Expiry (MM/YY) *</FieldLabel>
            <Input
              placeholder="12/29"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={expiry}
              onChange={e => { setExpiry(e.target.value); setCardErrors(er => ({ ...er, expiry: "" })); }}
              className={cardInputCls}
            />
            {cardErrors.expiry && <p className="text-xs text-red-500 mt-1">{cardErrors.expiry}</p>}
          </div>
          <div>
            <FieldLabel>CVV *</FieldLabel>
            <Input
              placeholder="123"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cvv}
              onChange={e => { setCvv(e.target.value); setCardErrors(er => ({ ...er, cvv: "" })); }}
              className={cardInputCls}
            />
            {cardErrors.cvv && <p className="text-xs text-red-500 mt-1">{cardErrors.cvv}</p>}
          </div>
        </div>
      </div>

      <div className="border border-[#E8E8E4] rounded-xl bg-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#0A0A0A]/40 font-medium">Billing Address</h3>
          <label className="flex items-center gap-2 text-xs text-[#0A0A0A]/55 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={e => setSameAsShipping(e.target.checked)}
              className="rounded border-[#E8E8E4]"
            />
            Same as shipping
          </label>
        </div>
        {!sameAsShipping && (
          <div className="space-y-3">
            <div>
              <FieldLabel>Address Line 1 *</FieldLabel>
              <Input placeholder="123 Main Street" value={billing.line1} onChange={setBillingField("line1")} className={cardInputCls} />
              {cardErrors.line1 && <p className="text-xs text-red-500 mt-1">{cardErrors.line1}</p>}
            </div>
            <div>
              <FieldLabel>Address Line 2 (optional)</FieldLabel>
              <Input placeholder="Apt, suite, etc." value={billing.line2} onChange={setBillingField("line2")} className={cardInputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>City *</FieldLabel>
                <Input placeholder="New York" value={billing.city} onChange={setBillingField("city")} className={cardInputCls} />
                {cardErrors.city && <p className="text-xs text-red-500 mt-1">{cardErrors.city}</p>}
              </div>
              <div>
                <FieldLabel>State *</FieldLabel>
                <Input placeholder="NY" value={billing.province} onChange={setBillingField("province")} className={cardInputCls} />
                {cardErrors.province && <p className="text-xs text-red-500 mt-1">{cardErrors.province}</p>}
              </div>
            </div>
            <div>
              <FieldLabel>ZIP Code *</FieldLabel>
              <Input placeholder="10001" value={billing.postal_code} onChange={setBillingField("postal_code")} className={`${cardInputCls} max-w-[160px]`} />
              {cardErrors.postal_code && <p className="text-xs text-red-500 mt-1">{cardErrors.postal_code}</p>}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-13 py-3.5 bg-[#0A0A0A] text-white text-sm font-medium tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Processing..." : `Complete Order — $${(totalCents / 100).toFixed(2)}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-[#0A0A0A]/40">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
        256-bit TLS encryption · Card data never touches our servers
      </div>
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/40 font-medium mb-1.5">
      {children}
    </label>
  );
}

type Step = "details" | "verify" | "payment";

export default function CheckoutPage() {
  useEffect(() => {
    document.title = "Checkout | AURYX";
    const el = document.querySelector('meta[name="description"]');
    if (el) el.setAttribute("content", "Complete your AURYX order. Secure checkout for research-grade peptide compounds.");
  }, []);
  const { items, totalCents, totalItems } = useCart();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<CheckoutForm>({
    customerName: "", email: "", phone: "", researchField: "",
    street: "", city: "", state: "", zip: "",
    termsAccepted: false,
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
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const hasResearchItems = items.some(i => i.product.regulatoryStatus === "research");

  const validate = useCallback(() => {
    const e: Partial<CheckoutForm> = {};
    if (!form.customerName.trim()) e.customerName = "Name required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (hasResearchItems && !form.researchField) e.researchField = "Please select your research application";
    if (!form.termsAccepted) e.termsAccepted = "You must accept the Terms of Service to proceed" as unknown as boolean;
    if (!form.street.trim()) e.street = "Street required";
    if (!form.city.trim()) e.city = "City required";
    if (!form.state.trim()) e.state = "State required";
    if (!form.zip.trim()) e.zip = "ZIP required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, hasResearchItems]);

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

                    {/* Research Application — only shown when cart contains research-grade compounds */}
                    {items.some(i => i.product.regulatoryStatus === "research") && (
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
                          Research-grade compounds are sold strictly for legitimate scientific research and are not intended for human consumption.
                        </p>
                      </div>
                    </div>
                    )}

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

                    {/* T&C checkbox */}
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={form.termsAccepted}
                            onChange={e => {
                              setForm(f => ({ ...f, termsAccepted: e.target.checked }));
                              setErrors(er => ({ ...er, termsAccepted: undefined }));
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors ${
                            form.termsAccepted
                              ? "bg-[#0A0A0A] border-[#0A0A0A]"
                              : errors.termsAccepted
                              ? "bg-white border-red-400"
                              : "bg-white border-[#E8E8E4] group-hover:border-[#0A0A0A]/40"
                          }`}>
                            {form.termsAccepted && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 10" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M1 5l3.5 3.5L11 1" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-[#0A0A0A]/55 leading-relaxed">
                          I confirm I am 21 years of age or older.{" "}
                          {items.some(i => i.product.regulatoryStatus === "research") && (
                            <>I acknowledge that research-grade compounds in this order are sold strictly for legitimate research purposes and are not intended for human consumption.{" "}</>
                          )}
                          I have read and agree to the{" "}
                          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#B8962E] hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#B8962E] hover:underline">
                            Privacy Policy
                          </a>.
                        </span>
                      </label>
                      {errors.termsAccepted && (
                        <div className="flex items-center gap-1.5 pl-6">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <p className="text-xs text-red-500">You must accept the Terms of Service to proceed.</p>
                        </div>
                      )}
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

                    <PaymentNodePayment
                      form={form}
                      totalCents={totalCents}
                      onSuccess={() => navigate("/checkout/success")}
                    />
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
