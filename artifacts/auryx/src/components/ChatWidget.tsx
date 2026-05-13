import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Welcome to Auryx. I'm Aria, your personal health concierge.\n\nI can answer questions about our peptide protocols, quality standards, and help you determine whether Auryx might be right for you. How can I help you today?",
};

const SUGGESTED = [
  "What peptides help with fat loss?",
  "Tell me about your quality standards",
  "How does BPC-157 work?",
  "What's the best anti-aging protocol?",
];

export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>([WELCOME]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showEscalate, setShowEscalate] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [escForm, setEscForm]     = useState({ name: "", email: "" });
  const [escLoading, setEscLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const streamRef  = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showEscalate, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setShowSuggested(false);

    const placeholderIdx = nextMessages.length;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const ctrl = new AbortController();
    streamRef.current = ctrl;

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: ctrl.signal,
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");
        for (const line of lines) {
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
          } catch {}
        }
      }

      // Check if AI suggests escalation
      const lower = accumulated.toLowerCase();
      if (
        lower.includes("connect you with") ||
        lower.includes("one of our physicians") ||
        lower.includes("auryx team") ||
        lower.includes("specialist")
      ) {
        setShowEscalate(true);
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessages(prev => {
          const updated = [...prev];
          updated[placeholderIdx] = {
            role: "assistant",
            content: "I apologize — something went wrong. Please try again or request a consultation directly.",
          };
          return updated;
        });
      }
    } finally {
      setLoading(false);
      streamRef.current = null;
    }
  };

  const handleEscalate = async () => {
    if (!escForm.name.trim() || !escForm.email.trim()) return;
    setEscLoading(true);
    try {
      await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: escForm.name,
          email: escForm.email,
          conversationJson: JSON.stringify(messages),
        }),
      });
      setEscalated(true);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `Thank you, ${escForm.name}. A member of the Auryx team will reach out to ${escForm.email} shortly. In the meantime, feel free to ask me anything else.`,
        },
      ]);
      setShowEscalate(false);
    } catch {
      // silently fail
    } finally {
      setEscLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && (
          <div className="bg-card border border-primary/30 text-foreground/80 text-sm px-4 py-2 rounded-full shadow-lg animate-pulse-slow">
            Ask Aria — AI Concierge
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-primary text-background flex items-center justify-center shadow-2xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 focus:outline-none"
          aria-label="Open chat"
        >
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[370px] max-h-[580px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
          {/* Header */}
          <div className="bg-background border-b border-border px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-primary text-xs font-serif font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Aria</p>
              <p className="text-xs text-muted-foreground">Auryx AI Concierge · Online</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <span className="text-primary text-[9px] font-serif font-bold">A</span>
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-background border border-border text-foreground/90 rounded-tl-sm"
                  }`}
                >
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

            {/* Escalation form */}
            {showEscalate && !escalated && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                <p className="text-xs text-muted-foreground">Connect with the Auryx team:</p>
                <Input
                  placeholder="Your name"
                  value={escForm.name}
                  onChange={e => setEscForm(f => ({ ...f, name: e.target.value }))}
                  className="h-8 text-sm bg-background border-border"
                />
                <Input
                  placeholder="Email address"
                  type="email"
                  value={escForm.email}
                  onChange={e => setEscForm(f => ({ ...f, email: e.target.value }))}
                  className="h-8 text-sm bg-background border-border"
                />
                <Button
                  onClick={handleEscalate}
                  disabled={escLoading || !escForm.name || !escForm.email}
                  size="sm"
                  className="w-full bg-primary text-primary-foreground h-8 text-xs"
                >
                  {escLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Connect with Auryx Team"
                  )}
                </Button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* CTA bar */}
          <div className="px-4 py-2 border-t border-border/50 bg-background/50 shrink-0">
            <button
              onClick={() => {
                setOpen(false);
                // Dispatch a custom event to open the consultation modal
                window.dispatchEvent(new CustomEvent("auryx:open-consultation"));
              }}
              className="w-full flex items-center justify-center gap-2 text-primary text-xs font-medium py-2 hover:opacity-80 transition-opacity"
            >
              Schedule a Private Consultation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Input */}
          <div className="px-3 pb-3 shrink-0">
            <div className="flex gap-2 items-center bg-background border border-border rounded-xl px-3 py-2 focus-within:border-primary/50 transition-colors">
              {!escalated && (
                <button
                  onClick={() => setShowEscalate(e => !e)}
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                  title="Connect with specialist"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
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
                placeholder="Ask about protocols, peptides, pricing…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="text-primary disabled:text-muted-foreground/30 transition-colors shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
