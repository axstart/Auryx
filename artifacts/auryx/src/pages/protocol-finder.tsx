import { useState } from "react";
import { motion } from "framer-motion";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProtocolContinuationModal } from "@/components/ProtocolContinuationModal";
import { PatientAssessment } from "@/components/PatientAssessment";
import { CheckCircle2 } from "lucide-react";

export default function ProtocolFinder() {
  const [modalOpen, setModalOpen] = useState(false);
  const [continuationOpen, setContinuationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header band */}
      <div className="pt-28 pb-16 px-6 md:px-16 border-b border-border/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5">Concierge Intake</p>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
              Your protocol starts<br />
              <span className="text-foreground/40">with your rhythm.</span>
            </h1>
            <p className="text-foreground/50 text-base leading-relaxed max-w-xl">
              Answer a few questions about your goals, lifestyle, and current routine. We'll guide you toward the AURYX protocol category that best matches your priorities.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Trust pillars */}
      <div className="px-6 md:px-16 py-10 border-b border-border/30 bg-card/20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            {[
              "Education-first approach",
              "No obligation to purchase",
              "Physician-reviewed protocols",
            ].map((pt) => (
              <div key={pt} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/55">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment */}
      <div className="px-6 md:px-16 py-16 md:py-24">
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
      <ProtocolContinuationModal open={continuationOpen} onOpenChange={setContinuationOpen} />
    </div>
  );
}
