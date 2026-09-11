import { motion } from "framer-motion";
import { FlaskConical, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onDismiss: () => void;
  onRemove: () => void;
}

export default function ReconstitutionKitPopup({ open, onDismiss, onRemove }: Props) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onDismiss(); }}>
      <DialogContent className="left-0 right-0 top-auto bottom-0 w-full max-w-none translate-x-0 translate-y-0 max-h-[calc(100dvh-env(safe-area-inset-top))] overflow-y-auto rounded-t-2xl border-[#C9A844]/25 bg-[#111] p-0 sm:left-[50%] sm:right-auto sm:top-[50%] sm:bottom-auto sm:max-w-sm sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl [&>button]:hidden motion-reduce:duration-0">
        <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
            className="relative w-full overflow-hidden motion-reduce:transform-none"
          >
            {/* Top accent line */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #C9A844, #B8962E)" }} />

            <div className="p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,68,0.12)" }}>
                    <FlaskConical className="w-4 h-4 text-[#C9A844]" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-sm font-medium font-['DM_Sans']">Reconstitution Kit Added</DialogTitle>
                    <DialogDescription className="text-[#C9A844] text-[10px] tracking-wider uppercase font-['DM_Sans'] mt-0.5">Required for peptide preparation</DialogDescription>
                  </div>
                </div>
                <button
                  onClick={onDismiss}
                  className="text-white/25 hover:text-white/60 transition-colors min-h-11 min-w-11 inline-flex items-center justify-center -mr-3 -mt-3"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <p className="text-white/60 text-[13px] leading-relaxed font-['DM_Sans'] mb-5">
                Every lyophilized peptide requires sterile water and precision syringes for safe reconstitution. We have automatically included the Auryx Reconstitution Kit in your cart so you are fully equipped.
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white/40 font-['DM_Sans'] mb-6">
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
              <div className="flex flex-col min-[360px]:flex-row gap-3">
                <button
                  onClick={onDismiss}
                  className="flex-1 min-h-11 rounded-xl bg-[#C9A844] hover:bg-[#b8973d] text-black text-sm font-medium font-['DM_Sans'] transition-colors"
                >
                  Got it
                </button>
                <button
                  onClick={onRemove}
                  className="flex-1 min-h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/70 text-sm font-medium font-['DM_Sans'] transition-colors"
                >
                  Remove Kit
                </button>
              </div>
            </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
