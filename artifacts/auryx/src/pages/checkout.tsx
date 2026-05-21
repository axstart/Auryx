import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

async function getStripePromise() {
  if (!stripePromise) {
    const res = await fetch("/api/checkout/publishable-key");
    if (!res.ok) throw new Error("Failed to load Stripe");
    const { publishableKey } = await res.json();
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

interface CheckoutForm {
  customerName: string;
  email: string;
  phone: string;
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
      setError(submitError.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    // Confirm payment
    const res = await fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(i => ({ slug: i.product.slug, quantity: i.quantity })),
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
      setError(confirmError.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Save order
      const orderRes = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          customerName: form.customerName,
          email: form.email,
          phone: form.phone || undefined,
          shippingAddress: {
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: "US",
          },
          items: items.map(i => ({ slug: i.product.slug, quantity: i.quantity })),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-card/40 border border-border/60 rounded-xl p-5">
        <PaymentElement
          options={{
            layout: "accordion",
          }}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-12 bg-primary text-primary-foreground flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Processing..." : `Pay $${(totalCents / 100).toFixed(2)}`}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
        Secured by Stripe · 256-bit TLS encryption
      </div>
    </form>
  );
}

const STRIPE_APPEARANCE = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#C9A844",
    colorBackground: "#1a1a1a",
    colorText: "#f5f0e8",
    colorDanger: "#ef4444",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "8px",
  },
};

export default function CheckoutPage() {
  const { items, totalCents, totalItems } = useCart();
  const [, navigate] = useLocation();
  const [stripe, setStripe] = useState<Awaited<ReturnType<typeof loadStripe>> | null>(null);
  const [stripeError, setStripeError] = useState(false);
  const [step, setStep] = useState<"details" | "payment">("details");
  const [form, setForm] = useState<CheckoutForm>({
    customerName: "", email: "", phone: "",
    street: "", city: "", state: "", zip: "",
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  useEffect(() => {
    getStripePromise()
      .then(s => setStripe(s))
      .catch(() => setStripeError(true));
  }, []);

  const validate = useCallback(() => {
    const e: Partial<CheckoutForm> = {};
    if (!form.customerName.trim()) e.customerName = "Name required";
    if (!form.email.includes("@")) e.email = "Valid email required";
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

  if (items.length === 0 && step !== "payment") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Link href="/shop" className="text-primary hover:underline text-sm">← Browse protocols</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-28 pb-6 px-6 md:px-12 border-b border-border/40">
        <div className="container mx-auto max-w-5xl">
          <Link href="/shop" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to shop
          </Link>
          <h1 className="text-4xl font-serif text-foreground">Checkout</h1>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3 space-y-8">
              {step === "details" && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* Contact */}
                  <div>
                    <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Contact</h2>
                    <div className="space-y-3">
                      <div>
                        <Input
                          placeholder="Full name *"
                          value={form.customerName}
                          onChange={set("customerName")}
                          className="bg-card/50 border-border h-11"
                        />
                        {errors.customerName && <p className="text-xs text-red-400 mt-1">{errors.customerName}</p>}
                      </div>
                      <div>
                        <Input
                          placeholder="Email address *"
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          className="bg-card/50 border-border h-11"
                        />
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                      </div>
                      <Input
                        placeholder="Phone (optional)"
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        className="bg-card/50 border-border h-11"
                      />
                    </div>
                  </div>

                  {/* Shipping */}
                  <div>
                    <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Shipping Address</h2>
                    <div className="space-y-3">
                      <div>
                        <Input
                          placeholder="Street address *"
                          value={form.street}
                          onChange={set("street")}
                          className="bg-card/50 border-border h-11"
                        />
                        {errors.street && <p className="text-xs text-red-400 mt-1">{errors.street}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            placeholder="City *"
                            value={form.city}
                            onChange={set("city")}
                            className="bg-card/50 border-border h-11"
                          />
                          {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <Input
                            placeholder="State *"
                            value={form.state}
                            onChange={set("state")}
                            className="bg-card/50 border-border h-11"
                          />
                          {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
                        </div>
                      </div>
                      <div>
                        <Input
                          placeholder="ZIP code *"
                          value={form.zip}
                          onChange={set("zip")}
                          className="bg-card/50 border-border h-11 max-w-[180px]"
                        />
                        {errors.zip && <p className="text-xs text-red-400 mt-1">{errors.zip}</p>}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => { if (validate()) setStep("payment"); }}
                    className="w-full h-12 bg-primary text-primary-foreground"
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Payment</h2>
                    <button onClick={() => setStep("details")} className="text-xs text-primary hover:underline">Edit details</button>
                  </div>

                  {stripeError ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
                      Unable to load payment form. Please refresh and try again.
                    </div>
                  ) : !stripe ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  ) : (
                    <Elements
                      stripe={stripe}
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
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-card/50 border border-border rounded-xl p-6 sticky top-28">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  {items.map(({ product, quantity }) => (
                    <div key={product.slug} className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">×{quantity}</p>
                      </div>
                      <span className="text-sm text-foreground shrink-0">
                        ${((product.priceCents * quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/40 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                    <span className="text-foreground">${(totalCents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-teal-400 text-xs">Calculated after review</span>
                  </div>
                </div>
                <div className="border-t border-border/40 pt-4 mt-2 flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-primary text-lg">${(totalCents / 100).toFixed(2)}</span>
                </div>
                {items.some(i => i.product.requiresConsultation) && (
                  <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-300/80 leading-relaxed">
                      One or more items require a physician consultation. Our clinical team will contact you after ordering.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
