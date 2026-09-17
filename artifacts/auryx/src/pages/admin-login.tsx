import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLogin() {
  const { user, loading, login, verifyMfa, resendMfa } = useAdminAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaEmail, setMfaEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/admin");
  }, [user, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mfaEmail) {
        await verifyMfa(otp.replace(/\D/g, "").slice(0, 6));
        navigate("/admin");
        return;
      }
      const result = await login(email, password);
      if (result.mfaRequired) {
        setMfaEmail(result.email ?? email);
        return;
      }
      navigate("/admin");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
      setAttemptsRemaining(typeof err.attemptsRemaining === "number" ? err.attemptsRemaining : null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await resendMfa();
    } catch (err: any) {
      setError(err.message ?? "Could not resend code");
    }
  }

  if (loading) return null;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#0A0A0A] px-4 py-8 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center sm:mb-10">
          <span className="font-['Cormorant_Garamond'] text-3xl font-light tracking-[0.25em] text-[#C9A844]">
            AURYX
          </span>
          <p className="mt-2 text-xs tracking-[0.2em] uppercase text-white/40 font-['DM_Sans']">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!mfaEmail ? (
            <>
              <div>
                <label className="block text-xs tracking-widest uppercase text-white/40 mb-2 font-['DM_Sans']">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="min-h-11 w-full bg-white/5 border border-white/10 text-white rounded px-4 py-3 text-base sm:text-sm font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/60 transition-colors placeholder-white/20"
                  placeholder="you@auryxlife.com"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-white/40 mb-2 font-['DM_Sans']">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="min-h-11 w-full bg-white/5 border border-white/10 text-white rounded px-4 py-3 text-base sm:text-sm font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/60 transition-colors placeholder-white/20"
                  placeholder="••••••••"
                />
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-white/60 mb-4 font-['DM_Sans']">
                Enter the 6-digit code sent to <span className="text-white/90">{mfaEmail}</span>
              </p>
              <label className="block text-xs tracking-widest uppercase text-white/40 mb-2 font-['DM_Sans']">
                Verification code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="min-h-11 w-full bg-white/5 border border-white/10 text-white rounded px-4 py-3 text-center text-lg tracking-[0.4em] font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/60"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={handleResend}
                className="mt-3 text-xs text-[#C9A844] hover:underline font-['DM_Sans']"
              >
                Resend code
              </button>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-red-400 text-sm font-['DM_Sans']">{error}</p>
              {attemptsRemaining !== null && attemptsRemaining > 0 && (
                <p className="text-white/30 text-xs font-['DM_Sans'] mt-1">
                  {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining before lockout
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 w-full bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black text-sm tracking-widest uppercase font-medium rounded py-3 transition-colors font-['DM_Sans'] mt-2"
          >
            {submitting ? "Please wait…" : mfaEmail ? "Verify" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8 font-['DM_Sans']">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
