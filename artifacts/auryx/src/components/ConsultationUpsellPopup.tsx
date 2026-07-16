import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, X, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onDismiss: () => void;
  onAdd: () => void;
}

export default function ConsultationUpsellPopup({ open, onDismiss, onAdd }: Props) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          style={{ background: "rgba(10,10,10,0.75)", backdropFilter: "blur(8px)" }}
          onClick={onDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ background: "#111", border: "1px solid rgba(201,168,68,0.25)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #C9A844, #B8962E)" }} />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,68,0.12)" }}>
                    <Stethoscope className="w-4 h-4 text-[#C9A844]" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium font-['DM_Sans']">Add a Physician Consultation?</h3>
                    <p className="text-[#C9A844] text-[10px] tracking-wider uppercase font-['DM_Sans'] mt-0.5">One-time \u2014 $50</p>
                  </div>
                </div>
                <button
                  onClick={onDismiss}
                  className="text-white/25 hover:text-white/60 transition-colors p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <p className="text-white/60 text-[13px] leading-relaxed font-['DM_Sans'] mb-4">
                A 1-on-1 physician review ensures your protocol is tailored to your goals, medical history, and lifestyle. Takes ~15 minutes. No commitment required.
              </p>

              <div className="space-y-2 text-[11px] text-white/40 font-['DM_Sans'] mb-6">
                {[
                  "Personalized dosing recommendation",
                  "Review of health conditions & medications",
                  "Protocol compatibility check",
                  "Follow-up scheduling available",
                ].map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#C9A844] shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { onAdd(); onDismiss(); }}
                  className="flex-1 h-11 rounded-xl bg-[#C9A844] hover:bg-[#b8973d] text-black text-sm font-medium font-['DM_Sans'] transition-colors"
                >
                  Add Consultation \u2014 $50
                </button>
                <button
                  onClick={onDismiss}
                  className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/70 text-sm font-medium font-['DM_Sans'] transition-colors"
                >
                  Not Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
