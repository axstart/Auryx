import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  listConsultations,
  getListConsultationsQueryKey,
  listInventory,
  getListInventoryQueryKey,
  useUpdateConsultation,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from "@workspace/api-client-react";
import type { Consultation, InventoryItem, InventoryItemInput, ConsultationUpdate } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Package, Users, AlertTriangle, Plus, Trash2, Pencil, Check, X, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

const SESSION_KEY = "auryx_admin_key";

function statusColor(status: string) {
  if (status === "new") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  if (status === "contacted") return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  if (status === "complete") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  return "bg-border text-muted-foreground";
}

function interestLabel(val: string) {
  const map: Record<string, string> = {
    "anti-aging": "Anti-Aging & Longevity",
    "fat-loss": "Fat Loss & Body Composition",
    "sexual-health": "Sexual Health & Vitality",
    "recovery": "Recovery & Regeneration",
    "cognitive": "Cognitive Performance",
    "energy": "Energy & Vitality",
  };
  return map[val] ?? val;
}

function LoginScreen({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    try {
      const data = await listConsultations({ headers: { "x-admin-key": key } });
      if (Array.isArray(data)) {
        sessionStorage.setItem(SESSION_KEY, key);
        onLogin(key);
      }
    } catch {
      setError("Invalid admin key. Please try again.");
      toast({ title: "Access denied", description: "Incorrect admin key.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-3">Auryx</p>
          <h1 className="text-3xl font-serif text-foreground mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm">Enter your admin key to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            data-testid="input-admin-key"
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(""); }}
            className="bg-card border-border h-12 text-center tracking-widest"
            autoFocus
          />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <Button data-testid="button-admin-login" type="submit" className="w-full bg-primary text-primary-foreground h-12">
            Enter
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

function ConsultationsTab({ adminKey }: { adminKey: string }) {
  const queryClient = useQueryClient();
  const headers = { "x-admin-key": adminKey };

  const { data: consultations = [], isLoading } = useQuery({
    queryKey: getListConsultationsQueryKey(),
    queryFn: () => listConsultations({ headers }),
  });

  const updateMutation = useUpdateConsultation({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListConsultationsQueryKey() }),
    },
    request: { headers },
  });

  const handleStatus = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } as ConsultationUpdate });
  };

  const newCount = consultations.filter((c: Consultation) => c.status === "new").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif text-foreground mb-1">Consultation Requests</h2>
          <p className="text-sm text-muted-foreground">
            {consultations.length} total &mdash; {newCount} new
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-sm text-center py-20">Loading...</div>
      ) : consultations.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No consultation requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...consultations].reverse().map((c: Consultation) => (
            <div
              key={c.id}
              data-testid={`consultation-row-${c.id}`}
              className={`bg-card/50 border rounded-lg p-6 ${c.status === "new" ? "border-primary/30" : "border-border/60"}`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor(c.status)}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-muted-foreground mb-3">
                    <span>{c.email}</span>
                    {c.phone && <span>{c.phone}</span>}
                    <span className="text-primary/80">{interestLabel(c.interest)}</span>
                  </div>
                  {c.message && (
                    <p className="text-sm text-foreground/70 bg-background/40 rounded p-3 border border-border/40 italic">
                      "{c.message}"
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <Select value={c.status} onValueChange={(val) => handleStatus(c.id, val)}>
                    <SelectTrigger data-testid={`status-select-${c.id}`} className="w-36 h-9 text-xs bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type InventoryFormState = Omit<InventoryItemInput, "stock" | "lowStockThreshold"> & {
  stock: string;
  lowStockThreshold: string;
};

const EMPTY_FORM: InventoryFormState = {
  name: "",
  category: "",
  stock: "",
  unit: "vials",
  lowStockThreshold: "5",
  notes: "",
};

function InventoryTab({ adminKey }: { adminKey: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const headers = { "x-admin-key": adminKey };

  const { data: items = [], isLoading } = useQuery({
    queryKey: getListInventoryQueryKey(),
    queryFn: () => listInventory({ headers }),
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<InventoryFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState<string>("");

  const createMutation = useCreateInventoryItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListInventoryQueryKey() });
        setForm(EMPTY_FORM);
        setShowForm(false);
        toast({ title: "Item added", description: `${form.name} added to inventory.` });
      },
    },
    request: { headers },
  });

  const updateMutation = useUpdateInventoryItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListInventoryQueryKey() });
        setEditingId(null);
      },
    },
    request: { headers },
  });

  const deleteMutation = useDeleteInventoryItem({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListInventoryQueryKey() }),
    },
    request: { headers },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        name: form.name,
        category: form.category,
        stock: parseInt(form.stock) || 0,
        unit: form.unit,
        lowStockThreshold: parseInt(form.lowStockThreshold) || 5,
        notes: form.notes || undefined,
      },
    });
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditStock(String(item.stock));
  };

  const saveEdit = (item: InventoryItem) => {
    updateMutation.mutate({ id: item.id, data: { stock: parseInt(editStock) || 0 } });
  };

  const lowStock = items.filter((i: InventoryItem) => i.stock <= i.lowStockThreshold);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-serif text-foreground mb-1">Inventory</h2>
          <p className="text-sm text-muted-foreground">{items.length} items &mdash; {lowStock.length} low stock</p>
        </div>
        <Button
          data-testid="button-add-item"
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground h-9 text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300 mb-1">Low Stock Alert</p>
            <p className="text-xs text-amber-300/70">{lowStock.map((i: InventoryItem) => `${i.name} (${i.stock} ${i.unit})`).join(", ")}</p>
          </div>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 border border-primary/30 rounded-lg p-6 mb-6"
        >
          <h3 className="text-sm font-medium text-foreground mb-4">Add New Item</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input data-testid="input-item-name" placeholder="Peptide name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="bg-background border-border" />
            <Input data-testid="input-item-category" placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required className="bg-background border-border" />
            <Input data-testid="input-item-stock" placeholder="Current stock" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required className="bg-background border-border" />
            <Input data-testid="input-item-unit" placeholder="Unit (e.g. vials)" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required className="bg-background border-border" />
            <Input data-testid="input-item-threshold" placeholder="Low stock alert at" type="number" min="0" value={form.lowStockThreshold} onChange={e => setForm(f => ({ ...f, lowStockThreshold: e.target.value }))} required className="bg-background border-border" />
            <Input data-testid="input-item-notes" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="bg-background border-border" />
            <div className="sm:col-span-2 md:col-span-3 flex gap-3">
              <Button data-testid="button-save-item" type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground h-9 text-sm">
                {createMutation.isPending ? "Saving..." : "Save Item"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="h-9 text-sm border-border/60">Cancel</Button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="text-muted-foreground text-sm text-center py-20">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No inventory items yet. Add your first item above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left py-3 pr-6">Peptide</th>
                <th className="text-left py-3 pr-6">Category</th>
                <th className="text-left py-3 pr-6">Stock</th>
                <th className="text-left py-3 pr-6">Unit</th>
                <th className="text-left py-3 pr-6">Alert At</th>
                <th className="text-left py-3 pr-6">Notes</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: InventoryItem) => {
                const isLow = item.stock <= item.lowStockThreshold;
                return (
                  <tr
                    key={item.id}
                    data-testid={`inventory-row-${item.id}`}
                    className={`border-b border-border/30 ${isLow ? "bg-amber-500/5" : ""}`}
                  >
                    <td className="py-4 pr-6">
                      <span className="font-medium text-foreground">{item.name}</span>
                      {isLow && <AlertTriangle className="inline w-3.5 h-3.5 text-amber-400 ml-2" />}
                    </td>
                    <td className="py-4 pr-6 text-muted-foreground">{item.category}</td>
                    <td className="py-4 pr-6">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            data-testid={`edit-stock-${item.id}`}
                            type="number"
                            min="0"
                            value={editStock}
                            onChange={e => setEditStock(e.target.value)}
                            className="w-20 h-7 text-xs bg-background border-border"
                          />
                          <button onClick={() => saveEdit(item)} className="text-emerald-400 hover:text-emerald-300"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <span className={`font-mono ${isLow ? "text-amber-400 font-bold" : "text-foreground"}`}>{item.stock}</span>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-muted-foreground">{item.unit}</td>
                    <td className="py-4 pr-6 text-muted-foreground">{item.lowStockThreshold}</td>
                    <td className="py-4 pr-6 text-muted-foreground text-xs max-w-[200px] truncate">{item.notes ?? "—"}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          data-testid={`button-edit-${item.id}`}
                          onClick={() => startEdit(item)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          data-testid={`button-delete-${item.id}`}
                          onClick={() => deleteMutation.mutate({ id: item.id })}
                          className="text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

interface ChatEscalation {
  id: number;
  name: string;
  email: string;
  conversationJson: string;
  createdAt: string;
}

function EscalationsTab({ adminKey }: { adminKey: string }) {
  const headers = { "x-admin-key": adminKey };
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: escalations = [], isLoading } = useQuery<ChatEscalation[]>({
    queryKey: ["chat-escalations"],
    queryFn: async () => {
      const res = await fetch("/api/chat/escalations", { headers });
      if (!res.ok) throw new Error("Failed to fetch escalations");
      return res.json();
    },
    refetchInterval: 30000,
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-foreground mb-1">Chat Escalations</h2>
        <p className="text-sm text-muted-foreground">
          {escalations.length} visitor{escalations.length !== 1 ? "s" : ""} requested to connect with the team via Aria
        </p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-sm text-center py-20">Loading...</div>
      ) : escalations.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No chat escalations yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...escalations].reverse().map((e: ChatEscalation) => {
            let conversation: { role: string; content: string }[] = [];
            try { conversation = JSON.parse(e.conversationJson); } catch {}
            const isExpanded = expandedId === e.id;
            return (
              <div key={e.id} className="bg-card/50 border border-border/60 hover:border-primary/20 transition-colors rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : e.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-serif font-bold">
                        {e.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto mr-4 shrink-0">
                      {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-xs text-muted-foreground/60 shrink-0">
                      {conversation.length} message{conversation.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="ml-4 text-muted-foreground shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && conversation.length > 0 && (
                  <div className="border-t border-border/40 px-6 py-5 bg-background/30 space-y-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-4">Conversation transcript</p>
                    {conversation.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-primary/15 text-foreground border border-primary/20"
                            : "bg-card border border-border/60 text-foreground/80"
                        }`}>
                          <span className="block text-[10px] uppercase tracking-wider mb-1 opacity-50">
                            {msg.role === "user" ? e.name : "Aria"}
                          </span>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border/30 flex justify-end">
                      <a
                        href={`mailto:${e.email}?subject=Following up from Auryx&body=Hi ${e.name},%0A%0AThank you for your interest in Auryx.`}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Reply to {e.email} →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem(SESSION_KEY) ?? "");
  const [tab, setTab] = useState<"consultations" | "inventory" | "escalations">("consultations");

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAdminKey("");
  };

  if (!adminKey) {
    return <LoginScreen onLogin={setAdminKey} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/60 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-primary font-serif tracking-widest text-lg">AURYX</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Admin</span>
            <nav className="flex gap-1">
              <button
                data-testid="tab-consultations"
                onClick={() => setTab("consultations")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${tab === "consultations" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Users className="inline w-4 h-4 mr-2" />Consultations
              </button>
              <button
                data-testid="tab-inventory"
                onClick={() => setTab("inventory")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${tab === "inventory" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Package className="inline w-4 h-4 mr-2" />Inventory
              </button>
              <button
                data-testid="tab-escalations"
                onClick={() => setTab("escalations")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${tab === "escalations" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <MessageSquare className="inline w-4 h-4 mr-2" />Chat Escalations
              </button>
            </nav>
          </div>
          <button
            data-testid="button-logout"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          {tab === "consultations" && <ConsultationsTab adminKey={adminKey} />}
          {tab === "inventory" && <InventoryTab adminKey={adminKey} />}
          {tab === "escalations" && <EscalationsTab adminKey={adminKey} />}
        </motion.div>
      </div>
    </div>
  );
}
