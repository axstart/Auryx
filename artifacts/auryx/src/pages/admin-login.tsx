import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLogin() {
  const { user, loading, login } = useAdminAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/admin");
  }, [user, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-['Cormorant_Garamond'] text-3xl font-light tracking-[0.25em] text-[#C9A844]">
            AURYX
          </span>
          <p className="mt-2 text-xs tracking-[0.2em] uppercase text-white/40 font-['DM_Sans']">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-white/40 mb-2 font-['DM_Sans']">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 text-white rounded px-4 py-3 text-sm font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/60 transition-colors placeholder-white/20"
              placeholder="you@auryxlife.com"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-white/40 mb-2 font-['DM_Sans']">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded px-4 py-3 text-sm font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/60 transition-colors placeholder-white/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-['DM_Sans'] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black text-sm tracking-widest uppercase font-medium rounded py-3 transition-colors font-['DM_Sans'] mt-2"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8 font-['DM_Sans']">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
