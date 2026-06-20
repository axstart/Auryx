import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "auryx_age_verified";

export default function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#0A0A0A" }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(201,168,68,0.08) 0%, transparent 68%)",
            }}
          />
          {/* Subtle grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "180px 180px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 flex flex-col items-center text-center max-w-[340px] w-full px-8"
          >
            {declined ? (
              /* ── Declined state ── */
              <div className="flex flex-col items-center gap-5">
                <div className="w-10 h-px bg-[#C9A844]/40 mb-2" />
                <p
                  className="text-white/80 leading-snug"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.6rem",
                    fontWeight: 300,
                  }}
                >
                  Access Restricted
                </p>
                <p className="text-white/30 text-sm leading-relaxed">
                  You must be 21 years of age or older to access this site.
                </p>
                <div className="w-10 h-px bg-white/10 mt-2" />
              </div>
            ) : (
              /* ── Verification prompt ── */
              <>
                {/* Wordmark */}
                <p
                  className="text-[#C9A844] tracking-[0.55em] text-[11px] font-semibold mb-9"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  AURYX
                </p>

                {/* Decorative rule */}
                <div className="flex items-center gap-3 mb-9 w-full max-w-[200px]">
                  <div className="flex-1 h-px bg-[#C9A844]/25" />
                  <div className="w-1 h-1 rounded-full bg-[#C9A844]/40" />
                  <div className="flex-1 h-px bg-[#C9A844]/25" />
                </div>

                {/* Heading */}
                <h1
                  className="text-white leading-snug mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                  }}
                >
                  Age Verification
                  <br />
                  <em className="not-italic text-[#C9A844]">Required</em>
                </h1>

                {/* Body copy */}
                <p className="text-white/40 text-[13px] leading-relaxed mb-2">
                  You must be 21 years of age or older to access this site.
                </p>
                <p className="text-white/22 text-[11px] leading-relaxed mb-10 max-w-[260px]">
                  All products are sold for research purposes only and are not
                  intended for human consumption.
                </p>

                {/* Buttons */}
                <button
                  onClick={handleEnter}
                  className="w-full py-4 bg-[#C9A844] text-[#0A0A0A] text-[11px] font-bold tracking-[0.22em] uppercase rounded-lg hover:bg-[#D4B050] active:bg-[#B8962E] transition-colors duration-200 mb-3 shadow-lg shadow-[#C9A844]/15"
                >
                  I am 21 or older — Enter
                </button>
                <button
                  onClick={handleDecline}
                  className="w-full py-3 border border-white/12 text-white/30 text-[11px] font-medium tracking-[0.18em] uppercase rounded-lg hover:border-white/22 hover:text-white/40 transition-colors duration-200"
                >
                  I am under 21 — Exit
                </button>

                {/* Fine print */}
                <p className="mt-8 text-white/15 text-[10px] leading-relaxed px-2">
                  By entering you confirm you are 21+ and agree to our{" "}
                  <a
                    href="/terms"
                    className="underline underline-offset-2 text-white/25 hover:text-white/40 transition-colors"
                  >
                    Terms &amp; Conditions
                  </a>
                  .
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
