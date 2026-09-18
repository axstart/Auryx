import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, X, Send, ChevronRight, ArrowRight,
  Loader2, User, Mail, Clock, ShoppingCart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConsultationModal } from "./ConsultationModal";
import { useCart } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/i18n";

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

const SUPPORT_EMAIL = "admin@auryxlife.com";

function IntakeForm({ onSubmit }: { onSubmit: (info: UserInfo) => void }) {
  const { dict } = useI18n();
  const copy = dict.chat;
  const [form, setForm] = useState<UserInfo>({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError(copy.intakeNameError); return; }
    if (!form.email.trim() && !form.phone.trim()) {
      setError(copy.intakeContactError);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
      <p className="text-xs text-muted-foreground leading-relaxed">
        {copy.intakeBlurb}
      </p>
      <div className="space-y-2.5">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
          <Input
            placeholder={copy.intakeName}
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(""); }}
            className="pl-8 h-11 text-sm bg-background border-border"
          />
        </div>
        <Input
          placeholder={copy.intakeEmail}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(""); }}
          className="h-11 text-sm bg-background border-border"
        />
        <Input
          placeholder={copy.intakePhone}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={form.phone}
          onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setError(""); }}
          className="h-11 text-sm bg-background border-border"
        />
        <p className="text-[10px] text-muted-foreground/50">{copy.intakeHint}</p>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button type="submit" className="w-full bg-primary text-primary-foreground h-11 text-sm">
        {copy.intakeSubmit}
      </Button>
    </form>
  );
}

export default function ChatWidget() {
  const { dict } = useI18n();
  const copy = dict.chat;
  const [open, setOpen]                     = useState(false);
  const [userInfo, setUserInfo]             = useState<UserInfo | null>(null);
  const [hours, setHours]                   = useState<HoursStatus | null>(null);
  const [messages, setMessages]             = useState<Message[]>([]);
  const [input, setInput]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [showEscalate, setShowEscalate]     = useState(false);
  const [escalated, setEscalated]           = useState(false);
  const [escLoading, setEscLoading]         = useState(false);
  const [showSuggested, setShowSuggested]   = useState(true);
  const [labelVisible, setLabelVisible]     = useState(true);
  const [consultOpen, setConsultOpen]       = useState(false);
  const { openCart }                        = useCart();
  const isMobile                            = useIsMobile();

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const sessionId = useRef<string>(crypto.randomUUID());

  // Reset label and restart the 6 s fade timer every time the chat closes
  useEffect(() => {
    if (open) return;
    setLabelVisible(true);
    const t = setTimeout(() => setLabelVisible(false), 6000);
    return () => clearTimeout(t);
  }, [open]);

  // Fetch business hours when panel first opens
  useEffect(() => {
    if (!open || hours !== null) return;
    fetch("/api/chat/hours")
      .then(r => r.json())
      .then((data: HoursStatus) => setHours(data))
      .catch(() => setHours({ available: true, nextAvailable: null }));
  }, [open, hours]);

  useEffect(() => {
    if (!isMobile && open && userInfo) {
      const timer = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isMobile, open, userInfo]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMobile, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showEscalate, loading]);

  const handleIntakeSubmit = (info: UserInfo) => {
    setUserInfo(info);
    const firstName = info.name.split(" ")[0];

    const availNote =
      hours && !hours.available && hours.nextAvailable
        ? copy.hoursNote.replace("{when}", hours.nextAvailable)
        : "";

    setMessages([{
      role: "assistant",
      content: `${copy.welcomeNamed.replace("{name}", firstName)}${availNote}`,
    }]);
    if (!isMobile) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 150);
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
          sessionId: sessionId.current,
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

      // Only surface escalation when user explicitly asks to speak to a person
      const userLower = trimmed.toLowerCase();
      if (
        !escalated &&
        (userLower.includes("speak to") ||
          userLower.includes("talk to") ||
          userLower.includes("contact") ||
          userLower.includes("human") ||
          userLower.includes("person") ||
          userLower.includes("someone") ||
          userLower.includes("real person") ||
          userLower.includes("team") ||
          userLower.includes("email") ||
          userLower.includes("call me") ||
          userLower.includes("reach out") ||
          userLower.includes("get in touch"))
      ) {
        setShowEscalate(true);
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessages(prev => {
          const updated = [...prev];
          updated[placeholderIdx] = {
            role: "assistant",
            content: copy.error,
          };
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!userInfo) return;
    setEscLoading(true);
    try {
      await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          preferredContact: "email",
          conversationJson: JSON.stringify(messages),
        }),
      });
      setEscalated(true);
      setShowEscalate(false);

      const firstName = userInfo.name.split(" ")[0];
      setMessages(prev => [...prev, {
        role: "assistant",
        content: copy.escalateSuccess
          .replace("{name}", firstName)
          .replace("{email}", SUPPORT_EMAIL),
      }]);
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
      <div className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 sm:right-6 z-50 flex flex-col items-end gap-3 ${open && isMobile ? "hidden" : ""}`}>
        {!open && labelVisible && (
          <div className="hidden sm:block bg-card border border-primary/30 text-foreground/80 text-sm px-4 py-2 rounded-full shadow-lg">
            {copy.floatingLabel}
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:scale-100"
          aria-label={open ? copy.closeAria : copy.openAria}
        >
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-modal={isMobile}
          aria-labelledby="aria-chat-title"
          className="fixed inset-x-0 bottom-0 z-50 w-full h-[min(100dvh,46rem)] flex flex-col rounded-t-2xl overflow-hidden shadow-2xl border border-border bg-card sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[370px] sm:h-auto sm:max-h-[610px] sm:rounded-2xl"
        >

          {/* Header */}
          <div className="bg-background border-b border-border px-4 sm:px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-4 pb-4 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-primary text-xs font-serif font-bold">A</span>
            </div>
            <div>
              <p id="aria-chat-title" className="text-sm font-medium text-foreground">Aria</p>
              <p className="text-xs text-muted-foreground">
                {userInfo ? `${copy.title} · Hi, ${firstName}` : copy.title}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {hours !== null && !teamAvailable && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400/80">
                  <Clock className="w-3 h-3" />
                  {copy.afterHours}
                </span>
              )}
              <div className={`w-2 h-2 rounded-full ${teamAvailable ? "bg-emerald-500" : "bg-amber-400"}`} />
              <button
                onClick={() => setOpen(false)}
                className="sm:hidden min-h-11 min-w-11 -mr-3 inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label={copy.closeAria}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Intake gate or conversation */}
          {!userInfo ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 pt-5 pb-2">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {copy.preIntakeWelcome}
                </p>
              </div>
              <IntakeForm onSubmit={handleIntakeSubmit} />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
                    {/* Sales CTA — guaranteed action below every assistant response */}
                    {msg.role === "assistant" && msg.content !== "" && !loading && (
                      <div className="flex gap-2 mt-2 pl-9">
                        <button
                          onClick={() => {
                            setOpen(false);
                            openCart();
                          }}
                        className="flex min-h-11 items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-[11px] text-primary font-medium transition-colors"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          {copy.browseShop}
                        </button>
                        <button
                          onClick={() => {
                            setOpen(false);
                            setConsultOpen(true);
                          }}
                          className="flex min-h-11 items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-[11px] text-primary font-medium transition-colors"
                        >
                          <ArrowRight className="w-3 h-3" />
                          {copy.bookConsultation}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Suggested questions */}
                {showSuggested && messages.length === 1 && (
                  <div className="space-y-2 pt-1">
                    {copy.suggested.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="w-full min-h-11 text-left text-xs text-foreground/70 border border-border hover:border-primary/50 hover:text-primary rounded-xl px-3 py-2.5 transition-colors flex items-center justify-between group"
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
                    {!teamAvailable && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <p className="text-xs font-medium text-foreground/90">{copy.teamOffline}</p>
                      </div>
                    )}
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {teamAvailable
                        ? copy.escalateAvailable
                        : copy.escalateOffline.replace(
                            "{when}",
                            hours?.nextAvailable ? ` ${hours.nextAvailable}` : copy.escalateOfflineFallback,
                          )}
                    </p>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      onClick={() => handleEscalate()}
                      className="flex items-center gap-2.5 w-full rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 px-3 py-2.5 text-xs text-primary font-medium transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      {escLoading
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <span>{copy.emailUs.replace("{email}", SUPPORT_EMAIL)}</span>}
                    </a>
                    <Button
                      onClick={() => setShowEscalate(false)}
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs border-border/60"
                    >
                      {copy.continueChatting}
                    </Button>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Consultation CTA */}
              <div className="px-4 py-1 border-t border-border/50 bg-background/50 shrink-0">
                <button
                  onClick={() => {
                    setOpen(false);
                    setConsultOpen(true);
                  }}
                  className="w-full min-h-11 flex items-center justify-center gap-2 text-primary text-xs font-medium py-2 hover:opacity-80 transition-opacity"
                >
                  {copy.scheduleConsult} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Connect with team shortcut (only when not yet escalated) */}
              {!escalated && !showEscalate && (
                <div className="px-3 pb-1 shrink-0">
                  <button
                    onClick={() => setShowEscalate(true)}
                    className="w-full min-h-11 text-[10px] text-muted-foreground/50 hover:text-primary/60 transition-colors py-2 flex items-center justify-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {copy.contactTeam}
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] shrink-0">
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
                    placeholder={copy.placeholderNamed.replace("{name}", firstName)}
                    type="text"
                    autoComplete="off"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="text-primary disabled:text-muted-foreground/30 transition-colors shrink-0 min-h-11 min-w-11 inline-flex items-center justify-center -mr-2"
                    aria-label={copy.sendAria}
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
      <ConsultationModal open={consultOpen} onOpenChange={setConsultOpen} />
    </>
  );
}
