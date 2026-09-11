import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProtocolContinuationModal } from "@/components/ProtocolContinuationModal";
import { PatientAssessment } from "@/components/PatientAssessment";
import { CheckCircle2 } from "lucide-react";
import { applyPageSeo } from "@/lib/seo";

export default function ProtocolFinder() {
  useEffect(() => {
    return applyPageSeo({
      title: "Protocol Finder | Auryx — Personalized Peptide Recommendations",
      description:
        "Answer a few questions and get a personalized peptide protocol recommendation from Auryx's clinical team.",
      path: "/protocol-finder",
    });
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [continuationOpen, setContinuationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header band */}
      <div className="pt-[calc(var(--site-header-height)+1rem)] pb-8 px-4 sm:px-6 md:px-16 border-b border-border/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Concierge Intake</p>
            <h1 className="text-3xl md:text-4xl font-serif leading-snug mb-3">
              Your protocol starts{" "}
              <span className="text-foreground/35">with your rhythm.</span>
            </h1>
            <p className="text-foreground/45 text-sm leading-relaxed max-w-lg">
              Answer a few questions and Aria will recommend the AURYX protocol that best matches your biology.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Trust pillars */}
      <div className="px-6 md:px-16 py-5 border-b border-border/30 bg-card/20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            {[
              "Physician-reviewed protocols",
              "No obligation to purchase",
              "Free shipping on every order*",
            ].map((pt) => (
              <div key={pt} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-foreground/50">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment */}
      <div className="px-4 sm:px-6 md:px-16 py-8 md:py-14">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <PatientAssessment
              onOpenConsult={() => setModalOpen(true)}
              onContinueProtocol={() => setContinuationOpen(true)}
            />
          </motion.div>

          <p className="text-xs text-foreground/25 text-center mt-8 leading-relaxed max-w-md mx-auto">
            This tool is for educational guidance only and does not constitute medical advice.
            Always consult a licensed healthcare provider before beginning any protocol.
          </p>
        </div>
      </div>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
      <ProtocolContinuationModal open={continuationOpen} onOpenChange={setContinuationOpen} onSwitchToConsultation={() => { setContinuationOpen(false); setModalOpen(true); }} />
    </div>
  );
}
