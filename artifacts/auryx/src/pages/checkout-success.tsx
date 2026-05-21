import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
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
          If your order includes any consultation-required protocols, a member of our team will reach out to schedule a brief physician review.
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
