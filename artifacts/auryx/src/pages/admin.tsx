import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// ── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "approved" | "sent_to_pharmacy" | "shipped" | "delivered" | "cancelled" | "refunded";

interface Order {
  id: number;
  customerName: string;
  email: string;
  phone?: string;
  shippingAddress: { street: string; city: string; state: string; zip: string };
  items: { name: string; quantity: number; priceCents: number; variantLabel?: string }[];
  totalCents: number;
  status: OrderStatus;
  trackingNumber?: string;
  requiresConsultation: boolean;
  consultationFormSubmitted: boolean;
  researchField?: string;
  paymentMethodId?: string;
  paynodePaymentId?: string;
  createdAt: string;
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lowStockThreshold: number;
  costPerUnit: number;
  sellPriceCents: number;
  notes?: string;
  variantLabel?: string;
}

interface ConsultationForm {
  id: number;
  orderId: number;
  patientName: string;
  dob?: string | null;
  height?: string | null;
  weight?: string | null;
  conditions?: string | null;
  medications?: string | null;
  goal?: string | null;
  priorPeptideUse: boolean;
  priorPeptidesDetail?: string | null;
  allergies?: string | null;
  notes?: string | null;
  submittedAt: string;
}

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: string;
  state?: string;
  interest: string;
  primaryGoal: string;
  usedPeptidesBefore: string;
  message?: string;
  status: string;
  createdAt: string;
}

interface ProtocolContinuation {
  id: number;
  name: string;
  email: string;
  phone?: string;
  peptides: string;
  duration: string;
  prescribingContext: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface ChatEscalation {
  id: number;
  name: string;
  email: string;
  phone?: string;
  preferredContact?: string;
  conversationJson: string;
  createdAt: string;
}

interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: "staff" | "admin";
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

type PatientStage = "lead" | "consultation" | "active_patient" | "churned";

interface PatientOrder {
  id: number;
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
  items: { name: string; quantity: number; priceCents: number; variantLabel?: string }[];
  trackingNumber?: string | null;
}

interface PatientRecord {
  email: string;
  name: string;
  phone?: string;
  state?: string;
  age?: number;
  interest: string;
  primaryGoal: string;
  usedPeptidesBefore: string;
  hearAboutUs: string;
  stage: PatientStage;
  notes: string;
  consultationId?: number;
  consultationStatus?: string;
  orders: PatientOrder[];
  lastActivity: string;
}

interface DashboardData {
  monthlyRevenueCents: number;
  activeOrdersCount: number;
  pendingOrdersCount: number;
  totalPatientsCount: number;
  recentOrders: Order[];
  lowStockItems: InventoryItem[];
}

interface FinancialsData {
  allTimeRevenueCents: number;
  monthlyRevenue: { month: string; revenueCents: number; orderCount: number }[];
  ordersByStatus: { status: string; count: number; totalCents: number }[];
  topSellingItems: { name: string; revenueCents: number; unitsSold: number }[];
}

interface InfluencerCoupon {
  id: number;
  code: string;
  influencer_name: string;
  influencer_email: string;
  discount_percent: number;
  commission_percent: number;
  is_active: boolean;
  created_at: string;
  total_sales: number;
  total_commission_owed: number;
}

interface CommissionUse {
  id: number;
  order_id: number;
  influencer_name: string;
  coupon_code: string;
  customer_name: string;
  customer_email: string;
  order_amount_before_discount: number;
  discount_applied: number;
  order_amount_after_discount: number;
  commission_owed: number;
  commission_paid: boolean;
  commission_paid_at?: string | null;
  created_at: string;
}

interface CommissionsData {
  total_commission_owed: number;
  total_commission_paid: number;
  uses: CommissionUse[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt$ = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const STATUS_ORDER: OrderStatus[] = ["pending", "approved", "sent_to_pharmacy", "shipped", "delivered", "cancelled", "refunded"];
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  sent_to_pharmacy: "Sent to Pharmacy",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "text-amber-400 bg-amber-400/10",
  approved: "text-teal-400 bg-teal-400/10",
  sent_to_pharmacy: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-white/40 bg-white/5",
  refunded: "text-red-400 bg-red-400/10",
};

function apiFetch(path: string, opts?: RequestInit) {
  return fetch(`/api${path}`, { credentials: "include", ...opts });
}

function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const reload = useCallback(() => {
    if (!path) return;
    setLoading(true);
    setError(null);
    apiFetch(path)
      .then(r => {
        setStatus(r.status);
        return r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${r.statusText}`));
      })
      .then(setData)
      .catch(e => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, status, reload };
}

// ── Small reusable pieces ─────────────────────────────────────────────────────

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-5">
      <p className="text-xs tracking-widest uppercase text-white/40 font-['DM_Sans'] mb-2">{label}</p>
      <p className="text-2xl font-['Cormorant_Garamond'] text-[#C9A844]">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1 font-['DM_Sans']">{sub}</p>}
    </div>
  );
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium font-['DM_Sans'] ${className}`}>
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-['Cormorant_Garamond'] text-white/80 mb-4">{children}</h2>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-white/30 font-['DM_Sans'] text-sm">{message}</div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-[#C9A844]/30 border-t-[#C9A844] rounded-full animate-spin" />
    </div>
  );
}

function SubTabs<T extends string>({ tabs, active, onChange }: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
}) {
  return (
    <div className="flex gap-2 border-b border-white/10 mb-4">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`pb-3 px-1 text-sm font-['DM_Sans'] transition-colors border-b-2 -mb-[1px] ${
            active === t.id
              ? "text-[#C9A844] border-[#C9A844]"
              : "text-white/40 border-transparent hover:text-white/60"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

function DashboardTab() {
  const { logout } = useAdminAuth();
  const [, navigate] = useLocation();
  const { data, loading, error, status, reload } = useApi<DashboardData>("/admin/dashboard");

  if (loading) return <Spinner />;
  if (!data) {
    const isAuthError = status === 401 || status === 403;
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-white/40 font-['DM_Sans'] text-sm">
          {isAuthError ? "Your session has expired. Please sign in again." : "Could not load dashboard."}
        </p>
        {error && !isAuthError && (
          <p className="text-white/20 font-['DM_Sans'] text-xs">{error}</p>
        )}
        {isAuthError ? (
          <button
            onClick={() => { logout().then(() => navigate("/admin/login")); }}
            className="px-4 py-2 bg-[#C9A844] text-black text-xs font-medium rounded font-['DM_Sans'] hover:bg-[#b8973d] transition-colors"
          >
            Sign In Again
          </button>
        ) : (
          <button
            onClick={reload}
            className="px-4 py-2 border border-white/10 text-white/50 text-xs font-medium rounded font-['DM_Sans'] hover:border-white/20 hover:text-white/70 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Revenue (this month)" value={fmt$(data.monthlyRevenueCents)} />
        <MetricCard label="Active Orders" value={String(data.activeOrdersCount)} />
        <MetricCard label="Pending Review" value={String(data.pendingOrdersCount)} />
        <MetricCard label="Total Patients" value={String(data.totalPatientsCount)} />
      </div>

      {data.lowStockItems.length > 0 && (
        <div>
          <SectionTitle>⚠ Low Stock Alerts</SectionTitle>
          <div className="space-y-2">
            {data.lowStockItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-amber-400/5 border border-amber-400/20 rounded px-4 py-3">
                <span className="text-sm text-white/80 font-['DM_Sans']">{item.name}</span>
                <span className="text-amber-400 text-sm font-['DM_Sans']">{item.stock} {item.unit} remaining</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionTitle>Recent Orders</SectionTitle>
        {data.recentOrders.length === 0 ? <EmptyState message="No orders yet." /> : (
          <div className="space-y-2">
            {data.recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between bg-white/[0.02] border border-white/8 rounded px-4 py-3">
                <div>
                  <p className="text-sm text-white/80 font-['DM_Sans']">#{order.id} — {order.customerName}</p>
                  <p className="text-xs text-white/30 font-['DM_Sans'] mt-0.5">{fmtDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/60 font-['DM_Sans']">{fmt$(order.totalCents)}</span>
                  <Badge label={STATUS_LABEL[order.status]} className={STATUS_COLOR[order.status]} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Orders ───────────────────────────────────────────────────────────────────

function exportOrdersCSV(orders: Order[]) {
  const headers = ["ID", "Customer", "Email", "Phone", "Status", "Total", "Tracking", "Ordered", "Items"];
  const rows = orders.map(o => [
    o.id,
    `"${o.customerName}"`,
    o.email,
    o.phone ?? "",
    o.status,
    (o.totalCents / 100).toFixed(2),
    o.trackingNumber ?? "",
    fmtDate(o.createdAt),
    `"${o.items.map(i => `${i.name}×${i.quantity}`).join("; ")}"`,
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `auryx-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function OrdersTab() {
  const { data: orders, loading, reload } = useApi<Order[]>("/orders");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "approve" | "cancel";
    orderId: number;
    title: string;
    message: string;
    detail?: string;
    reason?: string;
  } | null>(null);
  const [consultationForms, setConsultationForms] = useState<Record<number, ConsultationForm>>({});
  const [loadingForm, setLoadingForm] = useState<number | null>(null);
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    orderId: number;
    email: string;
    customerName: string;
    subject: string;
    message: string;
  } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  async function updateOrder(id: number, body: object) {
    setSaving(id);
    try {
      await apiFetch(`/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      reload();
    } finally {
      setSaving(null);
    }
  }

  async function approveOrder(id: number) {
    setSaving(id);
    try {
      const res = await apiFetch(`/admin/orders/${id}/approve`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as Record<string, unknown>));
        alert(typeof body.error === "string" ? body.error : "Approval charge failed.");
      } else {
        reload();
      }
    } finally {
      setSaving(null);
      setConfirmDialog(null);
    }
  }

  async function cancelOrder(id: number, reason?: string) {
    setSaving(id);
    try {
      const res = await apiFetch(`/admin/orders/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason?.trim() || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as Record<string, unknown>));
        alert(typeof body.error === "string" ? body.error : "Cancel failed.");
      } else {
        reload();
      }
    } finally {
      setSaving(null);
      setConfirmDialog(null);
    }
  }

  const filtered = (orders ?? []).filter(o => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!o.customerName.toLowerCase().includes(q) && !o.email.toLowerCase().includes(q) && !String(o.id).includes(q)) return false;
    }
    if (dateFrom && new Date(o.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(o.createdAt) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  // Status metric cards
  const statusCounts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = (orders ?? []).filter(o => o.status === s).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {/* Confirmation Dialog */}
      {confirmDialog?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-['Cormorant_Garamond'] text-white/90 mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-white/60 font-['DM_Sans'] mb-1">{confirmDialog.message}</p>
            {confirmDialog.detail && (
              <p className="text-xs text-white/40 font-['DM_Sans'] mb-4">{confirmDialog.detail}</p>
            )}

            {/* Cancel reason field */}
            {confirmDialog.action === "cancel" && (
              <div className="mt-3 mb-4">
                <label className="text-[10px] tracking-widest uppercase text-white/30 mb-1.5 block font-['DM_Sans']">
                  Reason for cancellation (optional — will be included in customer email)
                </label>
                <textarea
                  value={confirmDialog.reason ?? ""}
                  onChange={e => setConfirmDialog(p => p ? { ...p, reason: e.target.value } : null)}
                  rows={3}
                  placeholder="e.g. Out of stock, prescription required, customer request..."
                  className="w-full bg-white/5 border border-white/10 text-white/70 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40 resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                disabled={saving === confirmDialog.orderId}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded font-['DM_Sans'] transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={() => confirmDialog.action === "approve"
                  ? approveOrder(confirmDialog.orderId)
                  : cancelOrder(confirmDialog.orderId, confirmDialog.reason)
                }
                disabled={saving === confirmDialog.orderId}
                className={`px-4 py-2 text-sm rounded font-['DM_Sans'] font-medium transition-colors disabled:opacity-50 ${
                  confirmDialog.action === "approve"
                    ? "bg-[#C9A844] hover:bg-[#b8973d] text-black"
                    : "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                }`}
              >
                {saving === confirmDialog.orderId ? "Processing…" : confirmDialog.action === "approve" ? "Approve & Charge" : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Compose Dialog */}
      {emailDialog?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4">
            <p className="text-xs tracking-widest uppercase text-white/30 mb-1 font-['DM_Sans']">To</p>
            <p className="text-sm text-white/80 font-['DM_Sans'] mb-4">{emailDialog.customerName} &lt;{emailDialog.email}&gt;</p>

            <label className="text-xs tracking-widest uppercase text-white/30 mb-1 block font-['DM_Sans']">Subject</label>
            <input
              value={emailDialog.subject}
              onChange={e => setEmailDialog(p => p ? { ...p, subject: e.target.value } : null)}
              placeholder="e.g. Update on your order"
              className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40 mb-4"
            />

            <label className="text-xs tracking-widest uppercase text-white/30 mb-1 block font-['DM_Sans']">Message</label>
            <textarea
              value={emailDialog.message}
              onChange={e => setEmailDialog(p => p ? { ...p, message: e.target.value } : null)}
              placeholder="Type your message to the customer..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40 resize-none mb-5"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEmailDialog(null)}
                disabled={sendingEmail}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded font-['DM_Sans'] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!emailDialog.subject.trim() || !emailDialog.message.trim()) return;
                  setSendingEmail(true);
                  try {
                    const res = await apiFetch(`/admin/orders/${emailDialog.orderId}/email`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ subject: emailDialog.subject, message: emailDialog.message }),
                    });
                    if (res.ok) {
                      toast({ title: "Email sent", description: `Message sent to ${emailDialog.email}.` });
                      setEmailDialog(null);
                    } else {
                      const body = await res.json().catch(() => ({} as Record<string, unknown>));
                      toast({ title: "Send failed", description: typeof body.error === "string" ? body.error : "Could not send email.", variant: "destructive" });
                    }
                  } catch {
                    toast({ title: "Send failed", description: "Network error. Please try again.", variant: "destructive" });
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                disabled={sendingEmail || !emailDialog.subject.trim() || !emailDialog.message.trim()}
                className="px-4 py-2 bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
              >
                {sendingEmail ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status metric cards */}
      <div className="grid grid-cols-7 gap-2">
        {STATUS_ORDER.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`p-3 rounded-lg border text-left transition-all ${
              statusFilter === s
                ? "border-[#C9A844]/40 bg-[#C9A844]/10"
                : "border-white/8 bg-white/[0.02] hover:border-white/15"
            }`}
          >
            <p className="text-xs text-white/30 font-['DM_Sans'] truncate">{STATUS_LABEL[s]}</p>
            <p className="text-xl font-['Cormorant_Garamond'] text-white/70 mt-1">{statusCounts[s]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, order #…"
          className="flex-1 min-w-48 bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/50 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
        />
        <span className="text-white/20 text-sm">→</span>
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/50 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
        />
        {(search || dateFrom || dateTo || statusFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); setStatusFilter("all"); }}
            className="text-xs text-white/30 hover:text-white/60 font-['DM_Sans'] transition-colors"
          >
            Clear filters
          </button>
        )}
        <button
          onClick={() => exportOrdersCSV(filtered)}
          className="ml-auto px-3 py-2 bg-white/5 hover:bg-white/10 text-white/50 text-xs rounded font-['DM_Sans'] transition-colors"
        >
          Export CSV
        </button>
      </div>

      <p className="text-xs text-white/30 font-['DM_Sans']">
        {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        {filtered.length !== (orders?.length ?? 0) ? ` of ${orders?.length ?? 0}` : ""}
      </p>

      {filtered.length === 0 ? <EmptyState message="No orders match your filters." /> : (
        <div className="space-y-2">
          {filtered.map(order => {
            const isExpanded = expanded === order.id;
            // Normal workflow progression only (excludes cancelled/refunded)
            const WORKFLOW_STATUSES: OrderStatus[] = ["pending", "approved", "sent_to_pharmacy", "shipped", "delivered"];
            const currentIdx = WORKFLOW_STATUSES.indexOf(order.status);
            const nextStatus = currentIdx >= 0 && currentIdx < WORKFLOW_STATUSES.length - 1 ? WORKFLOW_STATUSES[currentIdx + 1] : null;

            return (
              <div key={order.id} className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-white/30 text-sm font-['DM_Sans'] shrink-0">#{order.id}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-white/80 font-['DM_Sans'] truncate">{order.customerName}</p>
                      <p className="text-xs text-white/30 font-['DM_Sans'] truncate">{order.email}</p>
                    </div>
                    {order.requiresConsultation && (
                      <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-['DM_Sans'] shrink-0">
                        Rx Required
                      </span>
                    )}
                    {order.consultationFormSubmitted && (
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-['DM_Sans'] shrink-0">
                        Form Submitted
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-sm text-white/60 font-['DM_Sans']">{fmt$(order.totalCents)}</span>
                    <span className="text-xs text-white/30 font-['DM_Sans'] hidden sm:block">{fmtDate(order.createdAt)}</span>
                    <Badge label={STATUS_LABEL[order.status]} className={STATUS_COLOR[order.status]} />
                    <span className="text-white/30 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/8 pt-4 space-y-4">
                        <div>
                          <p className="text-xs tracking-widest uppercase text-white/30 mb-2 font-['DM_Sans']">Items</p>
                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm font-['DM_Sans']">
                                <span className="text-white/70">
                                  {item.name}{item.variantLabel ? ` (${item.variantLabel})` : ""} ×{item.quantity}
                                </span>
                                <span className="text-white/50">{fmt$(item.priceCents * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs tracking-widest uppercase text-white/30 mb-1 font-['DM_Sans']">Shipping</p>
                          <p className="text-sm text-white/60 font-['DM_Sans']">
                            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                          </p>
                        </div>

                        {order.researchField && (
                          <div>
                            <p className="text-xs tracking-widest uppercase text-white/30 mb-1 font-['DM_Sans']">Research Application</p>
                            <p className="text-sm text-white/60 font-['DM_Sans']">{order.researchField}</p>
                          </div>
                        )}

                        {/* Consultation Intake Form */}
                        {order.consultationFormSubmitted && (
                          <div className="border border-[#C9A844]/20 rounded p-3 bg-[#C9A844]/5">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs tracking-widest uppercase text-[#C9A844]/70 font-['DM_Sans']">Physician Consultation Intake</p>
                              {!consultationForms[order.id] && (
                                <button
                                  onClick={async () => {
                                    setLoadingForm(order.id);
                                    try {
                                      const res = await apiFetch(`/consultation-form/${order.id}`);
                                      if (res.ok) {
                                        const form = await res.json();
                                        setConsultationForms(prev => ({ ...prev, [order.id]: form }));
                                      }
                                    } finally {
                                      setLoadingForm(null);
                                    }
                                  }}
                                  disabled={loadingForm === order.id}
                                  className="text-xs text-[#C9A844] hover:text-[#b8973d] font-['DM_Sans'] underline disabled:opacity-50"
                                >
                                  {loadingForm === order.id ? "Loading…" : "View Intake Form"}
                                </button>
                              )}
                            </div>
                            {consultationForms[order.id] && (
                              <div className="space-y-1 text-xs font-['DM_Sans'] text-white/60">
                                <div className="grid grid-cols-2 gap-2">
                                  <span><span className="text-white/30">Name:</span> {consultationForms[order.id]!.patientName}</span>
                                  <span><span className="text-white/30">DOB:</span> {consultationForms[order.id]!.dob ?? "N/A"}</span>
                                  <span><span className="text-white/30">Height:</span> {consultationForms[order.id]!.height ?? "N/A"}</span>
                                  <span><span className="text-white/30">Weight:</span> {consultationForms[order.id]!.weight ?? "N/A"}</span>
                                </div>
                                <div><span className="text-white/30">Goal:</span> {consultationForms[order.id]!.goal ?? "N/A"}</div>
                                <div><span className="text-white/30">Prior Peptide Use:</span> {consultationForms[order.id]!.priorPeptideUse ? "Yes" : "No"} {consultationForms[order.id]!.priorPeptidesDetail ? `(${consultationForms[order.id]!.priorPeptidesDetail})` : ""}</div>
                                <div>
                                  <span className="text-white/30">Conditions:</span>{" "}
                                  {(() => {
                                    const raw = consultationForms[order.id]!.conditions;
                                    if (!raw) return "None listed";
                                    let conds: string[] | null = null;
                                    if (typeof raw === "string") {
                                      try {
                                        const parsed = JSON.parse(raw);
                                        if (Array.isArray(parsed)) conds = parsed;
                                      } catch { /* not valid JSON */ }
                                    } else if (Array.isArray(raw)) {
                                      conds = raw;
                                    }
                                    if (!conds || conds.length === 0) return "None listed";
                                    const labels: Record<string, string> = {
                                      "hormone-sensitive-cancer": "History of hormone-sensitive cancer",
                                      "other-cancer": "History of other cancer",
                                      "cancer-treatment": "Currently undergoing cancer treatment",
                                      "cardiovascular-disease": "Significant cardiovascular disease",
                                      "diabetes": "Diabetes — Type 1 or Type 2",
                                      "thyroid-disorder": "Thyroid disorder",
                                      "autoimmune": "Autoimmune condition",
                                      "kidney-liver-disease": "Kidney or liver disease",
                                      "eating-disorder": "History of eating disorder",
                                      "psychiatric": "Active psychiatric condition",
                                      "pregnant-nursing": "Pregnant or nursing",
                                      "other": "Other",
                                      "none": "None of the above",
                                    };
                                    return (
                                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                                        {conds.map((c: string, i: number) => (
                                          <li key={i}>{labels[c] ?? c}</li>
                                        ))}
                                      </ul>
                                    );
                                  })()}
                                </div>
                                <div><span className="text-white/30">Medications:</span> {consultationForms[order.id]!.medications ?? "None listed"}</div>
                                <div><span className="text-white/30">Allergies:</span> {consultationForms[order.id]!.allergies ?? "None listed"}</div>
                                {consultationForms[order.id]!.notes && (
                                  <div><span className="text-white/30">Notes:</span> {consultationForms[order.id]!.notes}</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="text-xs tracking-widest uppercase text-white/30 mb-1 block font-['DM_Sans']">
                              Tracking Number
                            </label>
                            <input
                              value={trackingInputs[order.id] ?? order.trackingNumber ?? ""}
                              onChange={e => setTrackingInputs(p => ({ ...p, [order.id]: e.target.value }))}
                              placeholder="Enter tracking number"
                              className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
                            />
                          </div>
                          <button
                            onClick={() => updateOrder(order.id, { trackingNumber: trackingInputs[order.id] ?? order.trackingNumber ?? null })}
                            disabled={saving === order.id}
                            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white/70 text-sm rounded font-['DM_Sans'] transition-colors disabled:opacity-50"
                          >
                            Save
                          </button>
                        </div>

                        {/* Charge status indicator */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/25 font-['DM_Sans'] tracking-wider uppercase">Payment</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-['DM_Sans'] ${order.paynodePaymentId ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"}`}>
                            {order.paynodePaymentId ? "Charged" : "Stored (not charged)"}
                          </span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {/* Approve & Charge — only for pending orders */}
                          {order.status === "pending" && (
                            <button
                              onClick={() => setConfirmDialog({
                                open: true,
                                action: "approve",
                                orderId: order.id,
                                title: order.paynodePaymentId ? "Approve Order" : "Approve & Charge Order",
                                message: order.paynodePaymentId
                                  ? `Order #${order.id} has already been charged. Mark it as approved?`
                                  : `Charge the customer’s card for ${fmt$(order.totalCents)} and approve order #${order.id}?`,
                                detail: order.paynodePaymentId
                                  ? "No additional charge will be processed."
                                  : "This will process the charge via PaymentNode.",
                              })}
                              disabled={saving === order.id}
                              className="px-4 py-2 bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
                            >
                              Approve & Charge
                            </button>
                          )}

                          {/* Next status progression (skip for pending — use Approve instead) */}
                          {nextStatus && order.status !== "pending" && (
                            <button
                              onClick={() => updateOrder(order.id, { status: nextStatus })}
                              disabled={saving === order.id}
                              className="px-4 py-2 bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
                            >
                              {saving === order.id ? "Updating…" : `Mark as ${STATUS_LABEL[nextStatus]}`}
                            </button>
                          )}

                          <button
                            onClick={() => setEmailDialog({ open: true, orderId: order.id, email: order.email, customerName: order.customerName, subject: "", message: "" })}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded font-['DM_Sans'] transition-colors"
                          >
                            Email Customer
                          </button>

                          {/* Cancel Order — all non-terminal states */}
                          {!["cancelled", "refunded", "delivered"].includes(order.status) && (
                            <button
                              onClick={() => setConfirmDialog({
                                open: true,
                                action: "cancel",
                                orderId: order.id,
                                title: order.paynodePaymentId ? "Refund & Cancel Order" : "Cancel Order",
                                message: order.paynodePaymentId
                                  ? `Order #${order.id} has already been charged. This will issue a full refund of ${fmt$(order.totalCents)} via PaymentNode and mark the order as refunded.`
                                  : `Cancel order #${order.id}? No charge has been processed, so no refund is needed.`,
                              })}
                              disabled={saving === order.id}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded font-['DM_Sans'] transition-colors disabled:opacity-50 border border-red-500/20"
                            >
                              {order.paynodePaymentId ? "Refund & Cancel" : "Cancel Order"}
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-white/20 font-['DM_Sans']">
                          Ordered {fmtDate(order.createdAt)} · {order.phone ?? "No phone"}
                          {order.trackingNumber ? ` · Tracking: ${order.trackingNumber}` : ""}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Adjust Stock Modal ────────────────────────────────────────────────────────

function AdjustStockModal({
  item,
  onClose,
  onSaved,
}: {
  item: InventoryItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [delta, setDelta] = useState(0);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function save() {
    if (delta === 0) { onClose(); return; }
    setSaving(true);
    try {
      await apiFetch(`/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Math.max(0, item.stock + delta) }),
      });
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const newStock = Math.max(0, item.stock + delta);
  const isLow = newStock <= item.lowStockThreshold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#111] border border-white/10 rounded-xl p-6 w-80 shadow-2xl"
      >
        <p className="text-base font-['Cormorant_Garamond'] text-white/80 mb-1">Adjust Stock</p>
        <p className="text-xs text-white/40 font-['DM_Sans'] mb-4">{item.name}</p>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setDelta(d => d - 1)}
            className="w-9 h-9 rounded bg-white/5 hover:bg-white/10 text-white/60 text-lg flex items-center justify-center font-['DM_Sans'] transition-colors"
          >
            −
          </button>
          <input
            ref={inputRef}
            type="number"
            value={delta}
            onChange={e => setDelta(parseInt(e.target.value) || 0)}
            className="flex-1 text-center bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
          />
          <button
            onClick={() => setDelta(d => d + 1)}
            className="w-9 h-9 rounded bg-white/5 hover:bg-white/10 text-white/60 text-lg flex items-center justify-center font-['DM_Sans'] transition-colors"
          >
            +
          </button>
        </div>

        <div className="flex justify-between text-xs text-white/40 font-['DM_Sans'] mb-5">
          <span>Current: {item.stock} {item.unit}</span>
          <span className={isLow ? "text-amber-400" : "text-white/60"}>
            New: {newStock} {item.unit}{isLow ? " ⚠ Low" : ""}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || delta === 0}
            className="flex-1 py-2 bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-40 text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/50 text-sm rounded font-['DM_Sans'] transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Inventory ────────────────────────────────────────────────────────────────

function InventoryTab() {
  const { data: items, loading, reload } = useApi<InventoryItem[]>("/inventory");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<Partial<InventoryItem & { sellPriceCents: number }>>({});
  const [saving, setSaving] = useState(false);

  function startNew() {
    setForm({ name: "", variantLabel: "", category: "", stock: 0, unit: "vials", lowStockThreshold: 5, costPerUnit: 0, sellPriceCents: 0 });
    setEditingId("new");
  }

  function startEdit(item: InventoryItem) {
    setForm({ ...item });
    setEditingId(item.id);
  }

  async function saveItem() {
    setSaving(true);
    try {
      const body = { ...form };
      delete (body as Record<string, unknown>).sellPriceCents;
      if (editingId === "new") {
        await apiFetch("/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch(`/inventory/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setEditingId(null);
      reload();
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this inventory item?")) return;
    await apiFetch(`/inventory/${id}`, { method: "DELETE" });
    reload();
  }

  if (loading) return <Spinner />;

  const fields: { label: string; key: keyof InventoryItem; type: string; hint?: string }[] = [
    { label: "Name", key: "name", type: "text" },
    { label: "Variant Label", key: "variantLabel", type: "text" },
    { label: "Category", key: "category", type: "text" },
    { label: "Stock", key: "stock", type: "number" },
    { label: "Unit", key: "unit", type: "text" },
    { label: "Low Stock Threshold", key: "lowStockThreshold", type: "number" },
    { label: "Cost per Unit (cents)", key: "costPerUnit", type: "number", hint: "e.g. 5000 = $50.00" },
    { label: "Sell Price (cents)", key: "sellPriceCents", type: "number", hint: "e.g. 32900 = $329.00" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SectionTitle>Inventory</SectionTitle>
        <button
          onClick={startNew}
          className="px-4 py-2 bg-[#C9A844] hover:bg-[#b8973d] text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
        >
          + Add Item
        </button>
      </div>

      <AnimatePresence>
        {editingId !== null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white/[0.04] border border-[#C9A844]/30 rounded-lg p-5 space-y-4"
          >
            <p className="text-sm text-[#C9A844] font-['DM_Sans'] tracking-wide">
              {editingId === "new" ? "New Item" : "Edit Item"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {fields.map(({ label, key, type, hint }) => (
                <div key={key as string}>
                  <label className="block text-xs tracking-widest uppercase text-white/30 mb-1 font-['DM_Sans']">
                    {label}{hint && <span className="normal-case tracking-normal ml-1 text-white/20">({hint})</span>}
                  </label>
                  <input
                    type={type}
                    value={String(form[key] ?? "")}
                    onChange={e => setForm(p => ({
                      ...p,
                      [key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value,
                    }))}
                    className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-white/30 mb-1 font-['DM_Sans']">Notes</label>
              <input
                type="text"
                value={form.notes ?? ""}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveItem}
                disabled={saving}
                className="px-5 py-2 bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded font-['DM_Sans'] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {adjustItem && (
          <AdjustStockModal
            item={adjustItem}
            onClose={() => setAdjustItem(null)}
            onSaved={reload}
          />
        )}
      </AnimatePresence>

      {!items?.length ? <EmptyState message="No inventory items yet." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-['DM_Sans']">
            <thead>
              <tr className="text-left text-white/30 text-xs tracking-widest uppercase border-b border-white/8">
                <th className="pb-3 pr-4 font-normal">Item</th>
                <th className="pb-3 pr-4 font-normal">Variant</th>
                <th className="pb-3 pr-4 font-normal">Category</th>
                <th className="pb-3 pr-4 font-normal">Status</th>
                <th className="pb-3 pr-4 text-right font-normal">Stock</th>
                <th className="pb-3 pr-4 text-right font-normal">Cost/Unit</th>
                <th className="pb-3 pr-4 text-right font-normal">Sell Price</th>
                <th className="pb-3 pr-4 text-right font-normal">Margin</th>
                <th className="pb-3 pr-4 font-normal">Notes</th>
                <th className="pb-3 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map(item => {
                const lowStock = item.stock <= item.lowStockThreshold;
                const outOfStock = item.stock === 0;
                const grossMargin = item.sellPriceCents > 0 && item.costPerUnit > 0
                  ? Math.round(((item.sellPriceCents - item.costPerUnit) / item.sellPriceCents) * 100)
                  : null;
                return (
                  <tr key={item.id}>
                    <td className="py-3 pr-4 text-white/80">{item.name}</td>
                    <td className="py-3 pr-4 text-white/40">{item.variantLabel ?? <span className="text-white/15">—</span>}</td>
                    <td className="py-3 pr-4 text-white/40">{item.category}</td>
                    <td className="py-3 pr-4">
                      {outOfStock
                        ? <Badge label="Out of Stock" className="text-red-400 bg-red-400/10" />
                        : lowStock
                        ? <Badge label="Low Stock" className="text-amber-400 bg-amber-400/10" />
                        : <Badge label="In Stock" className="text-green-400 bg-green-400/10" />
                      }
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className={outOfStock ? "text-red-400 font-medium" : lowStock ? "text-amber-400 font-medium" : "text-white/70"}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-white/50">
                      {item.costPerUnit ? fmt$(item.costPerUnit) : "—"}
                    </td>
                    <td className="py-3 pr-4 text-right text-white/70">
                      {item.sellPriceCents ? fmt$(item.sellPriceCents) : "—"}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      {grossMargin !== null
                        ? <span className={grossMargin >= 60 ? "text-green-400" : grossMargin >= 30 ? "text-amber-400" : "text-red-400"}>
                            {grossMargin}%
                          </span>
                        : <span className="text-white/20">—</span>
                      }
                    </td>
                    <td className="py-3 pr-4 text-white/30 text-xs max-w-xs truncate">{item.notes ?? "—"}</td>
                    <td className="py-3">
                      <div className="flex gap-3 justify-end">
                        <button onClick={() => setAdjustItem(item)} className="text-xs text-white/40 hover:text-[#0D9488] transition-colors">Adjust</button>
                        <button onClick={() => startEdit(item)} className="text-xs text-white/40 hover:text-[#C9A844] transition-colors">Edit</button>
                        <button onClick={() => deleteItem(item.id)} className="text-xs text-white/40 hover:text-red-400 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Patients ─────────────────────────────────────────────────────────────────

const STAGE_CONFIG: Record<PatientStage, { label: string; headerCls: string; borderCls: string; badgeCls: string }> = {
  lead:           { label: "Lead",           headerCls: "text-amber-400",  borderCls: "border-amber-500/20",  badgeCls: "bg-amber-400/10 text-amber-400"  },
  consultation:   { label: "Consultation",   headerCls: "text-blue-400",   borderCls: "border-blue-500/20",   badgeCls: "bg-blue-400/10 text-blue-400"    },
  active_patient: { label: "Active Patient", headerCls: "text-green-400",  borderCls: "border-green-500/20",  badgeCls: "bg-green-400/10 text-green-400"  },
  churned:        { label: "Churned",        headerCls: "text-red-400",    borderCls: "border-red-500/20",    badgeCls: "bg-red-400/10 text-red-400"      },
};
const STAGE_KEYS: PatientStage[] = ["lead", "consultation", "active_patient", "churned"];

function PatientsTab() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [sub, setSub] = useState<"consultations" | "continuations">("consultations");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SectionTitle>Patients</SectionTitle>
        <div className="flex gap-1 bg-white/5 rounded p-1">
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1 text-xs rounded font-['DM_Sans'] transition-colors ${view === "kanban" ? "bg-[#C9A844] text-black font-medium" : "text-white/40 hover:text-white/60"}`}
          >
            CRM
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 text-xs rounded font-['DM_Sans'] transition-colors ${view === "list" ? "bg-[#C9A844] text-black font-medium" : "text-white/40 hover:text-white/60"}`}
          >
            List
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div>
          <SubTabs
            tabs={[
              { id: "consultations", label: "Consultations" },
              { id: "continuations", label: "Protocol Continuations" },
            ]}
            active={sub}
            onChange={setSub}
          />
          {sub === "consultations" ? <ConsultationsPanel /> : <ContinuationsPanel />}
        </div>
      ) : (
        <PatientKanbanView />
      )}
    </div>
  );
}

function PatientKanbanView() {
  const { data: patients, loading, reload } = useApi<PatientRecord[]>("/admin/patients");
  const [stageFilter, setStageFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [peptideFilter, setPeptideFilter] = useState("all");
  const [selected, setSelected] = useState<PatientRecord | null>(null);
  const [savingStage, setSavingStage] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const allInterests = useMemo(() => {
    if (!patients) return [];
    const set = new Set<string>();
    patients.forEach(p => {
      if (p.interest) p.interest.split(",").forEach(i => { const t = i.trim(); if (t) set.add(t); });
    });
    return [...set].sort();
  }, [patients]);

  const filtered = useMemo(() => {
    if (!patients) return [];
    return patients.filter(p => {
      if (stageFilter !== "all" && p.stage !== stageFilter) return false;
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.email.toLowerCase().includes(q)) return false;
      if (peptideFilter !== "all" && !p.interest.toLowerCase().includes(peptideFilter.toLowerCase())) return false;
      return true;
    });
  }, [patients, stageFilter, search, peptideFilter]);

  const byStage = useMemo(() => {
    const m: Record<PatientStage, PatientRecord[]> = { lead: [], consultation: [], active_patient: [], churned: [] };
    filtered.forEach(p => { (m[p.stage] ?? m.lead).push(p); });
    return m;
  }, [filtered]);

  async function updateStage(p: PatientRecord, stage: PatientStage) {
    setSavingStage(true);
    try {
      await apiFetch(`/admin/patients/${encodeURIComponent(p.email)}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      reload();
      setSelected(prev => prev?.email === p.email ? { ...prev, stage } : prev);
    } finally {
      setSavingStage(false);
    }
  }

  async function saveNotes(email: string) {
    setSavingNotes(true);
    try {
      await apiFetch(`/admin/patients/${encodeURIComponent(email)}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesText }),
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
      reload();
    } finally {
      setSavingNotes(false);
    }
  }

  function openDetail(p: PatientRecord) {
    setSelected(p);
    setNotesText(p.notes);
  }

  const hasFilters = stageFilter !== "all" || search !== "" || peptideFilter !== "all";

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-2 mb-5 flex-wrap items-center">
        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/70 text-xs rounded px-3 py-1.5 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
        >
          <option value="all">All Stages</option>
          {STAGE_KEYS.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/70 text-xs rounded px-3 py-1.5 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40 w-52"
        />
        <select
          value={peptideFilter}
          onChange={e => setPeptideFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/70 text-xs rounded px-3 py-1.5 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
        >
          <option value="all">All Interests</option>
          {allInterests.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setStageFilter("all"); setSearch(""); setPeptideFilter("all"); }}
            className="text-xs text-white/30 hover:text-white/60 font-['DM_Sans'] px-2 py-1.5 transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-white/20 font-['DM_Sans']">
          {filtered.length} / {patients?.length ?? 0} patients
        </span>
      </div>

      {/* Kanban + detail split */}
      <div className="flex gap-4 items-start">
        {/* Kanban board */}
        <div className={`transition-all duration-200 ${selected ? "hidden lg:block lg:flex-1 lg:min-w-0" : "w-full"}`}>
          <div className="grid grid-cols-4 gap-3">
            {STAGE_KEYS.map(stage => {
              const cfg = STAGE_CONFIG[stage];
              const cards = byStage[stage];
              return (
                <div key={stage} className={`bg-white/[0.02] border ${cfg.borderCls} rounded-lg overflow-hidden`}>
                  <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                    <span className={`text-xs font-['DM_Sans'] font-medium ${cfg.headerCls}`}>{cfg.label}</span>
                    <span className="text-xs text-white/20 font-['DM_Sans']">{cards.length}</span>
                  </div>
                  <div className="p-2 space-y-2 min-h-[100px]">
                    {cards.map(p => (
                      <button
                        key={p.email}
                        onClick={() => openDetail(p)}
                        className={`w-full text-left rounded-md p-2.5 transition-colors border ${
                          selected?.email === p.email
                            ? "border-[#C9A844]/40 bg-[#C9A844]/5"
                            : "bg-white/[0.03] hover:bg-white/[0.06] border-white/8"
                        }`}
                      >
                        <p className="text-xs text-white/80 font-['DM_Sans'] font-medium truncate">{p.name}</p>
                        <p className="text-xs text-white/30 font-['DM_Sans'] truncate mt-0.5">{p.email}</p>
                        {p.interest && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.interest.split(",").slice(0, 2).map(t => (
                              <span key={t} style={{ fontSize: "10px" }} className="bg-teal-400/8 text-teal-400/70 px-1.5 py-0.5 rounded font-['DM_Sans'] truncate">
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <p style={{ fontSize: "10px" }} className="text-white/20 font-['DM_Sans'] mt-1.5">
                          {p.orders.length > 0 ? `${p.orders.length} order${p.orders.length > 1 ? "s" : ""} · ` : ""}{fmtDate(p.lastActivity)}
                        </p>
                      </button>
                    ))}
                    {cards.length === 0 && (
                      <p className="text-xs text-white/15 font-['DM_Sans'] text-center py-4">—</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="w-full lg:w-[400px] flex-shrink-0 bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/8 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base text-white/90 font-['Cormorant_Garamond'] truncate">{selected.name}</p>
                  <p className="text-xs text-white/40 font-['DM_Sans'] mt-0.5 truncate">{selected.email}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/60 text-xl leading-none flex-shrink-0">×</button>
              </div>

              <div className="p-5 space-y-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                {/* Stage */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/25 font-['DM_Sans'] mb-2">Stage</p>
                  <div className="flex flex-wrap gap-2">
                    {STAGE_KEYS.map(s => {
                      const cfg = STAGE_CONFIG[s];
                      const active = selected.stage === s;
                      return (
                        <button
                          key={s}
                          onClick={() => !active && updateStage(selected, s)}
                          disabled={savingStage}
                          className={`text-xs px-3 py-1.5 rounded font-['DM_Sans'] transition-colors disabled:opacity-50 ${active ? `${cfg.badgeCls} font-medium` : "bg-white/5 text-white/30 hover:bg-white/10"}`}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3">
                  {selected.phone && (
                    <div><p className="text-xs text-white/25 font-['DM_Sans']">Phone</p><p className="text-sm text-white/70 font-['DM_Sans']">{selected.phone}</p></div>
                  )}
                  {selected.state && (
                    <div><p className="text-xs text-white/25 font-['DM_Sans']">State</p><p className="text-sm text-white/70 font-['DM_Sans']">{selected.state}</p></div>
                  )}
                  {(selected.age ?? 0) > 0 && (
                    <div><p className="text-xs text-white/25 font-['DM_Sans']">Age</p><p className="text-sm text-white/70 font-['DM_Sans']">{selected.age}</p></div>
                  )}
                </div>

                {/* Interest tags */}
                {selected.interest && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-white/25 font-['DM_Sans'] mb-1.5">Areas of Interest</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.interest.split(",").map(t => (
                        <span key={t} className="text-xs bg-teal-400/10 text-teal-400 px-2 py-0.5 rounded font-['DM_Sans']">{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consultation form fields */}
                {selected.primaryGoal && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-white/25 font-['DM_Sans'] mb-1">Primary Goal</p>
                    <p className="text-sm text-white/60 font-['DM_Sans']">{selected.primaryGoal}</p>
                  </div>
                )}
                {selected.usedPeptidesBefore && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-white/25 font-['DM_Sans'] mb-1">Peptide Experience</p>
                    <p className="text-sm text-white/60 font-['DM_Sans']">{selected.usedPeptidesBefore}</p>
                  </div>
                )}
                {selected.hearAboutUs && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-white/25 font-['DM_Sans'] mb-1">Referral Source</p>
                    <p className="text-sm text-white/60 font-['DM_Sans']">{selected.hearAboutUs}</p>
                  </div>
                )}
                {selected.consultationStatus && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-white/25 font-['DM_Sans']">Consult status:</p>
                    <Badge
                      label={selected.consultationStatus}
                      className={selected.consultationStatus === "contacted" ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"}
                    />
                    <a href={`mailto:${selected.email}`} className="ml-auto text-xs text-white/30 hover:text-[#C9A844] font-['DM_Sans'] transition-colors">Reply ↗</a>
                  </div>
                )}

                {/* Order history */}
                {selected.orders.length > 0 && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-white/25 font-['DM_Sans'] mb-2">Order History</p>
                    <div className="space-y-2">
                      {selected.orders.map(o => (
                        <div key={o.id} className="bg-white/[0.03] border border-white/8 rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-white/40 font-['DM_Sans']">#{o.id} · {fmtDate(o.createdAt)}</span>
                            <Badge
                              label={STATUS_LABEL[o.status as OrderStatus] ?? o.status}
                              className={STATUS_COLOR[o.status as OrderStatus] ?? "text-white/40 bg-white/5"}
                            />
                          </div>
                          <p className="text-xs text-white/30 font-['DM_Sans']">
                            {(o.items as { name: string; quantity: number }[]).map(i => `${i.name} ×${i.quantity}`).join(", ")}
                          </p>
                          <p className="text-xs text-white/50 font-['DM_Sans'] mt-1">{fmt$(o.totalCents)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/25 font-['DM_Sans'] mb-1.5">Notes</p>
                  <textarea
                    value={notesText}
                    onChange={e => setNotesText(e.target.value)}
                    rows={3}
                    placeholder="Internal notes…"
                    className="w-full bg-white/5 border border-white/10 text-white/70 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40 resize-none"
                  />
                  <button
                    onClick={() => saveNotes(selected.email)}
                    disabled={savingNotes}
                    className="mt-1.5 text-xs px-3 py-1.5 bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black rounded font-['DM_Sans'] font-medium transition-colors"
                  >
                    {notesSaved ? "Saved ✓" : savingNotes ? "Saving…" : "Save Notes"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConsultationsPanel() {
  const { data: consultations, loading, reload } = useApi<Consultation[]>("/consultations");
  const [saving, setSaving] = useState<number | null>(null);

  async function updateStatus(id: number, status: string) {
    setSaving(id);
    try {
      await apiFetch(`/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      reload();
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <Spinner />;
  if (!consultations?.length) return <EmptyState message="No consultation requests yet." />;

  return (
    <div className="space-y-3">
      {consultations.map(c => (
        <div key={c.id} className="bg-white/[0.02] border border-white/10 rounded-lg px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-white/80 font-['DM_Sans']">{c.name}</p>
              <p className="text-xs text-white/40 font-['DM_Sans'] mt-0.5">
                {c.email} · {c.phone ?? "No phone"} · {c.age ? `Age ${c.age}` : ""} {c.state ? `· ${c.state}` : ""} · {fmtDate(c.createdAt)}
              </p>
              {c.message && (
                <p className="text-xs text-white/50 mt-2 font-['DM_Sans'] max-w-xl leading-relaxed">{c.message}</p>
              )}
              <div className="flex gap-2 mt-2 flex-wrap">
                {c.interest.split(",").map(i => (
                  <span key={i} className="text-xs bg-teal-400/10 text-teal-400 px-2 py-0.5 rounded font-['DM_Sans']">
                    {i.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge
                label={c.status}
                className={c.status === "contacted" ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"}
              />
              <div className="flex gap-2">
                {c.status !== "contacted" && (
                  <button
                    onClick={() => updateStatus(c.id, "contacted")}
                    disabled={saving === c.id}
                    className="text-xs px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded font-['DM_Sans'] transition-colors disabled:opacity-50"
                  >
                    Mark Contacted
                  </button>
                )}
                <a
                  href={`mailto:${c.email}`}
                  className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/50 rounded font-['DM_Sans'] transition-colors"
                >
                  Reply
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContinuationsPanel() {
  const { data: rows, loading, reload } = useApi<ProtocolContinuation[]>("/admin/protocol-continuations");
  const [saving, setSaving] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const STATUSES = ["pending", "approved", "needs-review", "rejected"];

  async function updateStatus(id: number, status: string) {
    setSaving(id);
    try {
      await apiFetch(`/admin/protocol-continuations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      reload();
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <Spinner />;
  if (!rows?.length) return <EmptyState message="No protocol continuation requests yet." />;

  return (
    <div className="space-y-2">
      {rows.map(r => (
        <div key={r.id} className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm text-white/80 font-['DM_Sans']">{r.name}</p>
              <p className="text-xs text-white/30 font-['DM_Sans']">{r.email} · {fmtDate(r.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                label={r.status}
                className={
                  r.status === "approved" ? "text-green-400 bg-green-400/10" :
                  r.status === "rejected" ? "text-red-400 bg-red-400/10" :
                  r.status === "needs-review" ? "text-amber-400 bg-amber-400/10" :
                  "text-white/40 bg-white/5"
                }
              />
              <span className="text-white/30 text-xs">{expanded === r.id ? "▲" : "▼"}</span>
            </div>
          </button>
          <AnimatePresence>
            {expanded === r.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 border-t border-white/8 pt-4 space-y-2">
                  <p className="text-sm text-white/60 font-['DM_Sans']">
                    <span className="text-white/30">Peptides:</span> {r.peptides}
                  </p>
                  <p className="text-sm text-white/60 font-['DM_Sans']">
                    <span className="text-white/30">Duration:</span> {r.duration}
                  </p>
                  <p className="text-sm text-white/60 font-['DM_Sans']">
                    <span className="text-white/30">Context:</span> {r.prescribingContext}
                  </p>
                  {r.notes && (
                    <p className="text-sm text-white/60 font-['DM_Sans']">
                      <span className="text-white/30">Notes:</span> {r.notes}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap pt-1">
                    {STATUSES.filter(s => s !== r.status).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(r.id, s)}
                        disabled={saving === r.id}
                        className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/50 rounded font-['DM_Sans'] transition-colors capitalize disabled:opacity-50"
                      >
                        {s.replace("-", " ")}
                      </button>
                    ))}
                    <a
                      href={`mailto:${r.email}`}
                      className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/50 rounded font-['DM_Sans'] transition-colors"
                    >
                      Reply
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── Aria / Chat ───────────────────────────────────────────────────────────────

function AriaTab() {
  const [sub, setSub] = useState<"settings" | "analytics" | "escalations">("settings");

  return (
    <div>
      <SubTabs
        tabs={[
          { id: "settings", label: "System Prompt" },
          { id: "analytics", label: "Analytics" },
          { id: "escalations", label: "Escalations" },
        ]}
        active={sub}
        onChange={setSub}
      />
      {sub === "settings" && <AriaSettingsPanel />}
      {sub === "analytics" && <AriaAnalyticsPanel />}
      {sub === "escalations" && <EscalationsPanel />}
    </div>
  );
}

function AriaSettingsPanel() {
  const { data: current, loading } = useApi<{ instructions: string; updatedAt?: string; isCustom: boolean }>("/admin/aria-settings");
  const { data: defaults } = useApi<{ instructions: string }>("/admin/aria-settings/default");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (current) setText(current.instructions);
  }, [current]);

  async function save() {
    setSaving(true);
    try {
      await apiFetch("/admin/aria-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions: text }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60 font-['DM_Sans']">Aria System Prompt</p>
          {current?.updatedAt && (
            <p className="text-xs text-white/30 font-['DM_Sans'] mt-0.5">
              Last updated: {fmtDate(current.updatedAt)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {current?.isCustom && (
            <button
              onClick={() => defaults && setText(defaults.instructions)}
              className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white/50 rounded font-['DM_Sans'] transition-colors"
            >
              Reset to Default
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-1.5 text-xs bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black rounded font-['DM_Sans'] font-medium transition-colors"
          >
            {saved ? "Saved ✓" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={20}
        className="w-full bg-white/[0.03] border border-white/10 text-white/70 text-sm rounded-lg px-4 py-3 font-mono focus:outline-none focus:border-[#C9A844]/30 resize-none leading-relaxed"
      />
    </div>
  );
}

function AriaAnalyticsPanel() {
  const { data: summary, loading } = useApi<{
    total: number;
    intents: { intent: string; count: number }[];
    topPeptides: { peptide: string; count: number }[];
  }>("/admin/aria-analytics/summary");

  if (loading) return <Spinner />;
  if (!summary) return <EmptyState message="No analytics data." />;

  const INTENT_COLORS: Record<string, string> = {
    purchase: "text-green-400 bg-green-400/10",
    pricing: "text-blue-400 bg-blue-400/10",
    consultation: "text-teal-400 bg-teal-400/10",
    medical: "text-amber-400 bg-amber-400/10",
    general: "text-white/40 bg-white/5",
  };

  const maxPeptide = summary.topPeptides[0]?.count ?? 1;

  return (
    <div className="space-y-6">
      <MetricCard label="Total Aria Conversations (30 days)" value={String(summary.total)} />

      {summary.intents.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-white/30 mb-3 font-['DM_Sans']">Intent Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {summary.intents.map(i => (
              <div
                key={i.intent}
                className={`px-3 py-2 rounded font-['DM_Sans'] ${INTENT_COLORS[i.intent] ?? "text-white/40 bg-white/5"}`}
              >
                <span className="text-xs capitalize">{i.intent}</span>
                <span className="ml-2 text-sm font-medium">{i.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.topPeptides.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-white/30 mb-3 font-['DM_Sans']">Top Peptides Mentioned</p>
          <div className="space-y-2">
            {summary.topPeptides.map((p, i) => (
              <div key={p.peptide} className="flex items-center gap-3">
                <span className="text-white/20 text-xs w-4 font-['DM_Sans'] text-right">{i + 1}</span>
                <div className="flex-1 bg-white/5 rounded h-5 overflow-hidden">
                  <div
                    className="h-full bg-[#C9A844]/40 rounded transition-all"
                    style={{ width: `${Math.round((p.count / maxPeptide) * 100)}%` }}
                  />
                </div>
                <span className="text-white/60 text-sm font-['DM_Sans'] w-36 truncate">{p.peptide}</span>
                <span className="text-white/30 text-xs font-['DM_Sans'] w-6 text-right">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EscalationsPanel() {
  const { data: escalations, loading } = useApi<ChatEscalation[]>("/chat/escalations");
  const [expanded, setExpanded] = useState<number | null>(null);

  if (loading) return <Spinner />;
  if (!escalations?.length) return <EmptyState message="No Aria escalations yet." />;

  return (
    <div className="space-y-2">
      {escalations.map(e => {
        let messages: { role: string; content: string }[] = [];
        try { messages = JSON.parse(e.conversationJson); } catch {}

        return (
          <div key={e.id} className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === e.id ? null : e.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <p className="text-sm text-white/80 font-['DM_Sans']">{e.name}</p>
                <p className="text-xs text-white/30 font-['DM_Sans']">
                  {e.email}{e.phone ? ` · ${e.phone}` : ""} · {fmtDate(e.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {e.preferredContact && (
                  <span className="text-xs text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded font-['DM_Sans']">
                    Prefers {e.preferredContact}
                  </span>
                )}
                <span className="text-white/30 text-xs">{expanded === e.id ? "▲" : "▼"}</span>
              </div>
            </button>
            <AnimatePresence>
              {expanded === e.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 border-t border-white/8 pt-4 space-y-2 max-h-96 overflow-y-auto">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={`text-sm font-['DM_Sans'] px-3 py-2 rounded ${
                          m.role === "user"
                            ? "bg-white/5 text-white/70"
                            : "bg-teal-400/5 text-teal-300/80"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wide text-white/30 mr-2">
                          {m.role === "user" ? "Patient" : "Aria"}:
                        </span>
                        {m.content}
                      </div>
                    ))}
                    <a
                      href={`mailto:${e.email}`}
                      className="block mt-3 text-xs text-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white/50 rounded font-['DM_Sans'] transition-colors"
                    >
                      Reply via Email
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ── User Management ───────────────────────────────────────────────────────────

function UsersTab() {
  const { data: users, loading, reload } = useApi<StaffUser[]>("/admin/users");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function createStaff(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const r = await apiFetch("/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const body = await r.json();
        throw new Error(body.error ?? "Failed");
      }
      setForm({ name: "", email: "", password: "", role: "staff" });
      setShowForm(false);
      reload();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(user: StaffUser) {
    await apiFetch(`/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    reload();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SectionTitle>Staff Accounts</SectionTitle>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#C9A844] hover:bg-[#b8973d] text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
        >
          + Add Staff
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={createStaff}
            className="bg-white/[0.04] border border-[#C9A844]/30 rounded-lg p-5 space-y-3"
          >
            <p className="text-sm text-[#C9A844] font-['DM_Sans'] tracking-wide">New Staff Member</p>
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Password (min 8 chars)", key: "password", type: "password" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs tracking-widest uppercase text-white/30 mb-1 font-['DM_Sans']">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs tracking-widest uppercase text-white/30 mb-1 font-['DM_Sans']">Role</label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded px-3 py-2 font-['DM_Sans'] focus:outline-none focus:border-[#C9A844]/40"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {formError && <p className="text-red-400 text-xs font-['DM_Sans']">{formError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#C9A844] hover:bg-[#b8973d] disabled:opacity-50 text-black text-sm rounded font-['DM_Sans'] font-medium transition-colors"
              >
                {saving ? "Creating…" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded font-['DM_Sans'] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!users?.length ? (
        <EmptyState message="No staff users yet. Add one above." />
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div
              key={u.id}
              className="flex items-center justify-between bg-white/[0.02] border border-white/10 rounded-lg px-5 py-4"
            >
              <div>
                <p className="text-sm text-white/80 font-['DM_Sans']">{u.name}</p>
                <p className="text-xs text-white/30 font-['DM_Sans'] mt-0.5">
                  {u.email} · <span className="capitalize">{u.role}</span> · Added {fmtDate(u.createdAt)}
                  {u.lastLoginAt ? ` · Last login ${fmtDate(u.lastLoginAt)}` : " · Never logged in"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  label={u.role === "admin" ? "Admin" : "Staff"}
                  className={u.role === "admin" ? "text-[#C9A844] bg-[#C9A844]/10" : "text-teal-400 bg-teal-400/10"}
                />
                <Badge
                  label={u.isActive ? "Active" : "Inactive"}
                  className={u.isActive ? "text-green-400 bg-green-400/10" : "text-white/30 bg-white/5"}
                />
                <button
                  onClick={() => toggleActive(u)}
                  className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/40 rounded font-['DM_Sans'] transition-colors"
                >
                  {u.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/8 rounded-lg px-5 py-4 mt-2">
        <p className="text-xs tracking-widest uppercase text-white/30 mb-2 font-['DM_Sans']">Admin Accounts (Environment)</p>
        <p className="text-sm text-white/40 font-['DM_Sans']">
          Leo and Romy are configured as admins via environment secrets and are not stored in the database.
        </p>
      </div>
    </div>
  );
}

// ── Financials ────────────────────────────────────────────────────────────────

function FinancialsTab() {
  const { data, loading } = useApi<FinancialsData>("/admin/financials");

  if (loading) return <Spinner />;
  if (!data) return <EmptyState message="Could not load financials." />;

  const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenueCents), 1);
  const maxItemRevenue = Math.max(...(data.topSellingItems ?? []).map(i => i.revenueCents), 1);

  const STATUS_LABEL_MAP: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    sent_to_pharmacy: "At Pharmacy",
    shipped: "Shipped",
    delivered: "Delivered",
  };

  return (
    <div className="space-y-8">
      <MetricCard label="All-Time Revenue" value={fmt$(data.allTimeRevenueCents)} />

      <div>
        <p className="text-xs tracking-widest uppercase text-white/30 mb-4 font-['DM_Sans']">
          Monthly Revenue (12 months)
        </p>
        <div className="flex items-end gap-1 h-40">
          {data.monthlyRevenue.map(m => {
            const heightPct = m.revenueCents > 0
              ? Math.max(4, (m.revenueCents / maxRevenue) * 100)
              : 2;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-[#C9A844]/30 group-hover:bg-[#C9A844]/60 rounded-t transition-colors relative"
                  style={{ height: `${heightPct}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111] text-white/70 text-xs font-['DM_Sans'] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {fmt$(m.revenueCents)}
                    {m.orderCount > 0 && <span className="ml-1 text-white/40">({m.orderCount})</span>}
                  </div>
                </div>
                <p className="text-white/20 text-[10px] font-['DM_Sans'] text-center leading-none">
                  {m.month.split(" ")[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-white/30 mb-3 font-['DM_Sans']">Orders by Status</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {data.ordersByStatus.map(s => (
            <div key={s.status} className="bg-white/[0.02] border border-white/8 rounded-lg px-4 py-3">
              <p className="text-xs text-white/30 font-['DM_Sans'] mb-1">
                {STATUS_LABEL_MAP[s.status] ?? s.status}
              </p>
              <p className="text-xl font-['Cormorant_Garamond'] text-white/70">{s.count}</p>
              <p className="text-xs text-white/30 font-['DM_Sans']">{fmt$(s.totalCents)}</p>
            </div>
          ))}
        </div>
      </div>

      {data.topSellingItems && data.topSellingItems.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-white/30 mb-3 font-['DM_Sans']">Top Selling Peptides by Revenue</p>
          <div className="space-y-2">
            {data.topSellingItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-white/20 text-xs w-4 font-['DM_Sans'] text-right shrink-0">{i + 1}</span>
                <div className="flex-1 bg-white/5 rounded h-6 overflow-hidden relative">
                  <div
                    className="h-full bg-[#C9A844]/25 rounded transition-all"
                    style={{ width: `${Math.round((item.revenueCents / maxItemRevenue) * 100)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-xs text-white/60 font-['DM_Sans'] truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-white/50 text-sm font-['DM_Sans'] shrink-0 w-20 text-right">{fmt$(item.revenueCents)}</span>
                <span className="text-white/30 text-xs font-['DM_Sans'] shrink-0 w-16 text-right">{item.unitsSold} units</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfluencersTab() {
  const couponsApi = useApi<InfluencerCoupon[]>("/admin/coupons");
  const commissionsApi = useApi<CommissionsData>("/admin/commissions");
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    code: "",
    influencer_name: "",
    influencer_email: "",
    discount_percent: "10",
    commission_percent: "5",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredUses = (commissionsApi.data?.uses ?? []).filter(use =>
    !filter.trim()
      || use.influencer_name.toLowerCase().includes(filter.toLowerCase())
      || use.coupon_code.toLowerCase().includes(filter.toLowerCase()),
  );

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await apiFetch("/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discount_percent: Number(form.discount_percent),
          commission_percent: Number(form.commission_percent),
          is_active: true,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Could not create coupon.");
      setForm({ code: "", influencer_name: "", influencer_email: "", discount_percent: "10", commission_percent: "5" });
      setMessage("Coupon created.");
      couponsApi.reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not create coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleCoupon(coupon: InfluencerCoupon) {
    const response = await apiFetch(`/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !coupon.is_active }),
    });
    if (response.ok) couponsApi.reload();
    else setMessage("Could not update coupon.");
  }

  async function markPaid(id: number) {
    const response = await apiFetch(`/admin/commissions/${id}/mark-paid`, { method: "PATCH" });
    if (response.ok) commissionsApi.reload();
    else setMessage("Could not mark commission as paid.");
  }

  if (couponsApi.loading || commissionsApi.loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>Influencer Referrals</SectionTitle>
        <p className="text-sm text-white/40 font-['DM_Sans']">
          Manage referral codes, discounts, and commissions from completed orders.
        </p>
      </div>

      {message && (
        <div className="border border-[#C9A844]/30 bg-[#C9A844]/10 rounded-lg px-4 py-3 text-sm text-[#C9A844]">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard label="Unpaid commissions" value={fmt$(Math.round((commissionsApi.data?.total_commission_owed ?? 0) * 100))} />
        <MetricCard label="Paid commissions" value={fmt$(Math.round((commissionsApi.data?.total_commission_paid ?? 0) * 100))} />
        <MetricCard label="Active codes" value={String((couponsApi.data ?? []).filter(c => c.is_active).length)} />
      </div>

      <form onSubmit={createCoupon} className="border border-white/10 rounded-lg p-5 space-y-4">
        <p className="text-xs tracking-widest uppercase text-white/40 font-['DM_Sans']">New coupon</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {([
            ["code", "Coupon code", "AURYX10"],
            ["influencer_name", "Influencer name", "Name"],
            ["influencer_email", "Influencer email", "name@example.com"],
            ["discount_percent", "Customer discount %", "10"],
            ["commission_percent", "Commission %", "5"],
          ] as const).map(([key, label, placeholder]) => (
            <label key={key} className="block">
              <span className="text-[10px] uppercase tracking-widest text-white/35 font-['DM_Sans']">{label}</span>
              <input
                required
                type={key === "influencer_email" ? "email" : key.endsWith("percent") ? "number" : "text"}
                min={key.endsWith("percent") ? 0 : undefined}
                max={key.endsWith("percent") ? 100 : undefined}
                value={form[key]}
                onChange={e => setForm(current => ({ ...current, [key]: e.target.value }))}
                placeholder={placeholder}
                className="mt-1 w-full h-10 rounded border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/20 focus:border-[#C9A844] focus:outline-none"
              />
            </label>
          ))}
        </div>
        <button disabled={saving} className="px-4 py-2 rounded bg-[#C9A844] text-[#0A0A0A] text-sm font-medium disabled:opacity-50">
          {saving ? "Creating…" : "Create coupon"}
        </button>
      </form>

      <div>
        <SectionTitle>Coupon codes</SectionTitle>
        <div className="space-y-2">
          {(couponsApi.data ?? []).length === 0 ? <EmptyState message="No influencer coupons yet." /> : (couponsApi.data ?? []).map(coupon => (
            <div key={coupon.id} className="border border-white/10 rounded-lg px-4 py-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-48">
                <p className="text-[#C9A844] font-medium tracking-wider">{coupon.code}</p>
                <p className="text-sm text-white/60">{coupon.influencer_name} · {coupon.influencer_email}</p>
              </div>
              <div className="text-sm text-white/50">{coupon.discount_percent}% off · {coupon.commission_percent}% commission</div>
              <div className="text-sm text-white/40">{coupon.total_sales} sale{coupon.total_sales !== 1 ? "s" : ""}</div>
              <button
                onClick={() => void toggleCoupon(coupon)}
                className={`px-3 py-1.5 rounded text-xs ${coupon.is_active ? "bg-[#0D9488]/20 text-[#5EEAD4]" : "bg-white/10 text-white/40"}`}
              >
                {coupon.is_active ? "Active" : "Inactive"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <SectionTitle>Commission tracker</SectionTitle>
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter influencer or code"
            className="h-9 w-56 rounded border border-white/10 bg-white/5 px-3 text-xs text-white placeholder:text-white/25 focus:border-[#C9A844] focus:outline-none"
          />
        </div>
        {filteredUses.length === 0 ? <EmptyState message="No commission activity yet." /> : (
          <div className="space-y-2">
            {filteredUses.map(use => (
              <div key={use.id} className="border border-white/10 rounded-lg px-4 py-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-48">
                  <p className="text-sm text-white">{use.influencer_name} <span className="text-[#C9A844]">· {use.coupon_code}</span></p>
                  <p className="text-xs text-white/35">Order #{use.order_id} · {use.customer_name}</p>
                </div>
                <div className="text-xs text-white/45">
                  ${use.order_amount_after_discount.toFixed(2)} paid · ${use.commission_owed.toFixed(2)} owed
                </div>
                {use.commission_paid ? (
                  <Badge label="Paid" className="bg-[#0D9488]/20 text-[#5EEAD4]" />
                ) : (
                  <button onClick={() => void markPaid(use.id)} className="px-3 py-1.5 rounded bg-[#C9A844] text-[#0A0A0A] text-xs font-medium">
                    Mark paid
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────

type Tab = "dashboard" | "orders" | "inventory" | "patients" | "aria" | "users" | "financials" | "influencers";

const ALL_TABS: { id: Tab; label: string; adminOnly?: boolean }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "orders", label: "Orders" },
  { id: "inventory", label: "Inventory" },
  { id: "patients", label: "Patients" },
  { id: "aria", label: "Aria / Chat" },
  { id: "users", label: "User Management", adminOnly: true },
  { id: "financials", label: "Financials", adminOnly: true },
  { id: "influencers", label: "Influencers", adminOnly: true },
];

export default function Admin() {
  const { user, loading, logout } = useAdminAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!loading && !user) navigate("/admin/login");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A844]/30 border-t-[#C9A844] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const visibleTabs = ALL_TABS.filter(t => !t.adminOnly || user.role === "admin");

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-white/8 flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="px-5 py-5 border-b border-white/8">
          <span className="font-['Cormorant_Garamond'] text-xl font-light tracking-[0.2em] text-[#C9A844]">
            AURYX
          </span>
          <p className="text-[10px] tracking-widest uppercase text-white/25 font-['DM_Sans'] mt-0.5">
            Admin Portal
          </p>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {visibleTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full text-left px-3 py-2.5 rounded text-sm font-['DM_Sans'] transition-colors ${
                activeTab === t.id
                  ? "bg-[#C9A844]/15 text-[#C9A844]"
                  : "text-white/45 hover:text-white/75 hover:bg-white/5"
              }`}
            >
              {t.label}
              {t.adminOnly && (
                <span className="ml-1 text-[9px] text-white/20 uppercase tracking-wide align-middle">●</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/8">
          <p className="text-xs text-white/50 font-['DM_Sans'] truncate">{user.name}</p>
          <p className="text-[10px] text-white/20 font-['DM_Sans'] capitalize">{user.role}</p>
          <button
            onClick={async () => { await logout(); navigate("/admin/login"); }}
            className="mt-3 text-xs text-white/25 hover:text-white/55 font-['DM_Sans'] transition-colors"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-52 min-h-screen overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "inventory" && <InventoryTab />}
              {activeTab === "patients" && <PatientsTab />}
              {activeTab === "aria" && <AriaTab />}
              {activeTab === "users" && user.role === "admin" && <UsersTab />}
              {activeTab === "financials" && user.role === "admin" && <FinancialsTab />}
              {activeTab === "influencers" && user.role === "admin" && <InfluencersTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
