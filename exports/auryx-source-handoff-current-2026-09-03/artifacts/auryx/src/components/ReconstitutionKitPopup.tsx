import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, X } from "lucide-react";

interface Props {
  open: boolean;
  onDismiss: () => void;
  onRemove: () => void;
}

export default function ReconstitutionKitPopup({ open, onDismiss, onRemove }: Props) {
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
                    <FlaskConical className="w-4 h-4 text-[#C9A844]" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium font-['DM_Sans']">Reconstitution Kit Added</h3>
                    <p className="text-[#C9A844] text-[10px] tracking-wider uppercase font-['DM_Sans'] mt-0.5">Required for peptide preparation</p>
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
              <p className="text-white/60 text-[13px] leading-relaxed font-['DM_Sans'] mb-5">
                Every lyophilized peptide requires sterile water and precision syringes for safe reconstitution. We have automatically included the Auryx Reconstitution Kit in your cart so you are fully equipped.
              </p>

              <div className="flex items-center gap-3 text-[11px] text-white/40 font-['DM_Sans'] mb-6">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#C9A844]" />
                  Bacteriostatic water
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#C9A844]" />
                  Sterile syringes
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#C9A844]" />
                  Alcohol pads
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onDismiss}
                  className="flex-1 h-11 rounded-xl bg-[#C9A844] hover:bg-[#b8973d] text-black text-sm font-medium font-['DM_Sans'] transition-colors"
                >
                  Got it
                </button>
                <button
                  onClick={onRemove}
                  className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/70 text-sm font-medium font-['DM_Sans'] transition-colors"
                >
                  Remove Kit
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
