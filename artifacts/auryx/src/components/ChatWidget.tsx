import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, X, Send, ChevronRight, ArrowRight,
  Loader2, User, Phone, Mail, MessageSquare as SmsIcon, Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

interface HoursStatus {
  available: boolean;
  nextAvailable: string | null;
}

const SUGGESTED = [
  "What peptides help with fat loss?",
  "Tell me about your quality standards",
  "How does BPC-157 work?",
  "What's the best anti-aging protocol?",
];

const CONTACT_OPTIONS = [
  { value: "call",  label: "Phone call",    icon: Phone,          desc: "We'll call you back" },
  { value: "email", label: "Email",         icon: Mail,           desc: "We'll email you" },
  { value: "text",  label: "Text message",  icon: SmsIcon,        desc: "We'll text you" },
  { value: "other", label: "Other",         icon: MessageCircle,  desc: "Your own message" },
];

function IntakeForm({ onSubmit }: { onSubmit: (info: UserInfo) => void }) {
  const [form, setForm] = useState<UserInfo>({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Please enter your name."); return; }
    if (!form.email.trim() && !form.phone.trim()) {
      setError("Please enter an email address or phone number.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
      <p className="text-xs text-muted-foreground leading-relaxed">
        To personalise your experience, please share a few details.
      </p>
      <div className="space-y-2.5">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
          <Input
            placeholder="Your name *"
            value={form.name}
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(""); }}
            className="pl-8 h-9 text-sm bg-background border-border"
            autoFocus
          />
        </div>
        <Input
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(""); }}
          className="h-9 text-sm bg-background border-border"
        />
        <Input
          placeholder="Phone number"
          type="tel"
          value={form.phone}
          onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setError(""); }}
          className="h-9 text-sm bg-background border-border"
        />
        <p className="text-[10px] text-muted-foreground/50">* Required · Email or phone required</p>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button type="submit" className="w-full bg-primary text-primary-foreground h-9 text-sm">
        Start Conversation
      </Button>
    </form>
  );
}

export default function ChatWidget() {
  const [open, setOpen]                     = useState(false);
  const [userInfo, setUserInfo]             = useState<UserInfo | null>(null);
  const [hours, setHours]                   = useState<HoursStatus | null>(null);
  const [messages, setMessages]             = useState<Message[]>([]);
  const [input, setInput]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [showEscalate, setShowEscalate]     = useState(false);
  const [preferredContact, setPreferredContact] = useState<string | null>(null);
  const [otherNote, setOtherNote]           = useState("");
  const [escalated, setEscalated]           = useState(false);
  const [escLoading, setEscLoading]         = useState(false);
  const [showSuggested, setShowSuggested]   = useState(true);
  const [labelVisible, setLabelVisible]     = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Fade out the label after 6 s
  useEffect(() => {
    const t = setTimeout(() => setLabelVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Fetch business hours when panel first opens
  useEffect(() => {
    if (!open || hours !== null) return;
    fetch("/api/chat/hours")
      .then(r => r.json())
      .then((data: HoursStatus) => setHours(data))
      .catch(() => setHours({ available: true, nextAvailable: null }));
  }, [open, hours]);

  useEffect(() => {
    if (open && userInfo) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open, userInfo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showEscalate, loading]);

  const handleIntakeSubmit = (info: UserInfo) => {
    setUserInfo(info);
    const firstName = info.name.split(" ")[0];

    const availNote =
      hours && !hours.available && hours.nextAvailable
        ? `\n\nOur team is currently outside business hours, but I'm here to help right now. I can also arrange for someone to reach out to you ${hours.nextAvailable} — just let me know how you'd prefer to be contacted.`
        : "";

    setMessages([{
      role: "assistant",
      content: `Hello, ${firstName} — welcome to Auryx. I'm Aria, your personal health concierge.\n\nI'm here to answer your questions about precision longevity protocols and peptide therapy, and to help find the right path for you.${availNote}`,
    }]);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading || !userInfo) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setShowSuggested(false);

    const placeholderIdx = nextMessages.length;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          userInfo,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              accumulated += data.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[placeholderIdx] = { role: "assistant", content: accumulated };
                return updated;
              });
            }
            if (data.done) break;
          } catch { /* ignore malformed lines */ }
        }
      }

      // Surface escalation prompt if Aria naturally suggests it
      const lower = accumulated.toLowerCase();
      if (
        !escalated &&
        (lower.includes("connect you with") ||
          lower.includes("one of our physicians") ||
          lower.includes("auryx team") ||
          lower.includes("reach out") ||
          lower.includes("business day") ||
          lower.includes("callback") ||
          lower.includes("call back"))
      ) {
        setShowEscalate(true);
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessages(prev => {
          const updated = [...prev];
          updated[placeholderIdx] = {
            role: "assistant",
            content: "I apologise — something went wrong. Please try again or request a consultation directly.",
          };
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async (contact?: string) => {
    if (!userInfo) return;
    const chosen = contact ?? preferredContact ?? undefined;
    const resolvedContact = chosen === "other" && otherNote.trim()
      ? `other: ${otherNote.trim()}`
      : chosen;
    setEscLoading(true);
    try {
      await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          preferredContact: resolvedContact,
          conversationJson: JSON.stringify(messages),
        }),
      });
      setEscalated(true);
      setShowEscalate(false);

      const firstName  = userInfo.name.split(" ")[0];
      const available  = hours?.available ?? true;
      const next       = hours?.nextAvailable ?? "the next business day";
      const contactStr = userInfo.phone || userInfo.email || "you";

      let confirmMsg: string;
      if (available) {
        confirmMsg = `Thank you, ${firstName}. A member of the Auryx team will be in touch with ${contactStr} shortly — they're available now. Is there anything else I can help you with in the meantime?`;
      } else {
        const methodNote = chosen === "call"
          ? "They'll give you a call"
          : chosen === "text"
          ? "They'll send you a text"
          : chosen === "other"
          ? "They'll review your note and reach out to you"
          : "They'll reach out by email";
        confirmMsg = `You're all set, ${firstName}. ${methodNote} ${next}. Your conversation has been saved and you'll be a priority first thing. In the meantime, feel free to keep asking me anything.`;
      }

      setMessages(prev => [...prev, { role: "assistant", content: confirmMsg }]);
    } catch {
      /* silently fail */
    } finally {
      setEscLoading(false);
    }
  };

  const firstName = userInfo?.name.split(" ")[0] ?? "";
  const teamAvailable = hours?.available ?? true;

  return (
    <>
      {/* Floating button + label */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && labelVisible && (
          <div className="bg-card border border-primary/30 text-foreground/80 text-sm px-4 py-2 rounded-full shadow-lg">
            Ask Aria — AI Concierge
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 focus:outline-none"
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[370px] max-h-[610px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">

          {/* Header */}
          <div className="bg-background border-b border-border px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-primary text-xs font-serif font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Aria</p>
              <p className="text-xs text-muted-foreground">
                {userInfo ? `Auryx Concierge · Hi, ${firstName}` : "Auryx AI Concierge"}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {hours !== null && !teamAvailable && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400/80">
                  <Clock className="w-3 h-3" />
                  After hours
                </span>
              )}
              <div className={`w-2 h-2 rounded-full ${teamAvailable ? "bg-emerald-500" : "bg-amber-400"}`} />
            </div>
          </div>

          {/* Intake gate or conversation */}
          {!userInfo ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 pt-5 pb-2">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Welcome to Auryx. I'm Aria, your personal health concierge — here to answer your questions about precision longevity and personalised peptide therapy.
                </p>
              </div>
              <IntakeForm onSubmit={handleIntakeSubmit} />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                        <span className="text-primary text-[9px] font-serif font-bold">A</span>
                      </div>
                    )}
                    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-background border border-border text-foreground/90 rounded-tl-sm"
                    }`}>
                      {msg.content}
                      {msg.role === "assistant" && msg.content === "" && loading && (
                        <span className="inline-flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Suggested questions */}
                {showSuggested && messages.length === 1 && (
                  <div className="space-y-2 pt-1">
                    {SUGGESTED.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left text-xs text-foreground/70 border border-border hover:border-primary/50 hover:text-primary rounded-xl px-3 py-2.5 transition-colors flex items-center justify-between group"
                      >
                        {q}
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Escalation prompt */}
                {showEscalate && !escalated && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                    {teamAvailable ? (
                      /* ── Team IS available ── */
                      <>
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          Would you like a member of the Auryx team to reach out to you directly?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEscalate()}
                            disabled={escLoading}
                            size="sm"
                            className="flex-1 bg-primary text-primary-foreground h-8 text-xs"
                          >
                            {escLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes, connect me"}
                          </Button>
                          <Button
                            onClick={() => setShowEscalate(false)}
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-border/60"
                          >
                            Not now
                          </Button>
                        </div>
                      </>
                    ) : (
                      /* ── Team is OUT of hours ── */
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <p className="text-xs font-medium text-foreground/90">
                            Our team is currently offline
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Available Mon–Fri, 8 AM – 8 PM ET. How would you prefer to be contacted
                          {hours?.nextAvailable ? ` ${hours.nextAvailable}` : " on the next business day"}?
                        </p>
                        <div className="space-y-2 pt-1">
                          {CONTACT_OPTIONS.map(opt => {
                            const Icon = opt.icon;
                            const selected = preferredContact === opt.value;
                            return (
                              <div key={opt.value}>
                                <button
                                  onClick={() => {
                                    setPreferredContact(selected ? null : opt.value);
                                    if (selected) setOtherNote("");
                                  }}
                                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-colors border ${
                                    selected
                                      ? "border-primary/50 bg-primary/10 text-primary"
                                      : "border-border/60 hover:border-primary/30 text-foreground/70"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5 shrink-0" />
                                  <span className="font-medium">{opt.label}</span>
                                  <span className="ml-auto text-muted-foreground text-[10px]">{opt.desc}</span>
                                </button>
                                {selected && opt.value === "other" && (
                                  <div className="mt-1.5">
                                    <input
                                      autoFocus
                                      maxLength={100}
                                      value={otherNote}
                                      onChange={e => setOtherNote(e.target.value)}
                                      placeholder="Let us know how to reach you or what you need…"
                                      className="w-full bg-background border border-primary/30 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                                    />
                                    <p className="text-right text-[10px] text-muted-foreground/40 mt-0.5">
                                      {otherNote.length}/100
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button
                            onClick={() => handleEscalate(preferredContact ?? undefined)}
                            disabled={
                              escLoading ||
                              !preferredContact ||
                              (preferredContact === "other" && !otherNote.trim())
                            }
                            size="sm"
                            className="flex-1 bg-primary text-primary-foreground h-8 text-xs disabled:opacity-40"
                          >
                            {escLoading
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : preferredContact && !(preferredContact === "other" && !otherNote.trim())
                              ? `Confirm — ${CONTACT_OPTIONS.find(o => o.value === preferredContact)?.label}`
                              : "Select a preference above"
                            }
                          </Button>
                          <Button
                            onClick={() => setShowEscalate(false)}
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-border/60"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Consultation CTA */}
              <div className="px-4 py-2 border-t border-border/50 bg-background/50 shrink-0">
                <button
                  onClick={() => {
                    setOpen(false);
                    window.dispatchEvent(new CustomEvent("auryx:open-consultation"));
                  }}
                  className="w-full flex items-center justify-center gap-2 text-primary text-xs font-medium py-1.5 hover:opacity-80 transition-opacity"
                >
                  Schedule a Private Consultation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Connect with team shortcut (only when not yet escalated) */}
              {!escalated && !showEscalate && (
                <div className="px-3 pb-1 shrink-0">
                  <button
                    onClick={() => setShowEscalate(true)}
                    className="w-full text-[10px] text-muted-foreground/50 hover:text-primary/60 transition-colors py-1 flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {teamAvailable ? "Connect with the team" : "Arrange a next-business-day callback"}
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="px-3 pb-3 shrink-0">
                <div className="flex gap-2 items-center bg-background border border-border rounded-xl px-3 py-2 focus-within:border-primary/50 transition-colors">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    placeholder={`Ask anything, ${firstName}…`}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="text-primary disabled:text-muted-foreground/30 transition-colors shrink-0"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Send className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
