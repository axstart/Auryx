import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AdminRole = "admin" | "staff";

export interface AdminUser {
  id: number | null;
  email: string;
  name: string;
  role: AdminRole;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ mfaRequired: boolean; email?: string }>;
  verifyMfa: (otp: string) => Promise<void>;
  resendMfa: () => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const r = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      const err = new Error(body.error ?? "Login failed") as Error & { attemptsRemaining?: number };
      if (typeof body.attemptsRemaining === "number") err.attemptsRemaining = body.attemptsRemaining;
      throw err;
    }
    const data = await r.json();
    if (data.mfaRequired) {
      return { mfaRequired: true, email: data.email as string };
    }
    setUser(data);
    return { mfaRequired: false };
  }

  async function verifyMfa(otp: string) {
    const r = await fetch("/api/admin/auth/verify-mfa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otp }),
    });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.error ?? "MFA verification failed");
    }
    const data = await r.json();
    setUser(data);
  }

  async function resendMfa() {
    const r = await fetch("/api/admin/auth/resend-mfa", {
      method: "POST",
      credentials: "include",
    });
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.error ?? "Could not resend code");
    }
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, verifyMfa, resendMfa, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
