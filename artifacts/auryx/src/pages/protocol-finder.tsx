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

      {/* Compact header — just enough to clear the navbar */}
      <div className="pt-28 pb-6 px-6 md:px-16">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Protocol Finder</p>
              <h1 className="text-2xl md:text-3xl font-serif leading-tight">
                Find the right protocol for you.
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 shrink-0">
              {[
                "Physician-reviewed",
                "No obligation",
                "Free shipping*",
              ].map((pt) => (
                <div key={pt} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-xs text-foreground/50">{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Assessment — right up top */}
      <div className="px-6 md:px-16 pb-16">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <PatientAssessment
              onOpenConsult={() => setModalOpen(true)}
              onContinueProtocol={() => setContinuationOpen(true)}
            />
          </motion.div>

          <p className="text-xs text-foreground/25 text-center mt-6 leading-relaxed max-w-md mx-auto">
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
