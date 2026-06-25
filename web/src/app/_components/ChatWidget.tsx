"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Sparkles, X } from "lucide-react";

import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's your automation experience?",
  "Which tools do you use?",
  "Walk me through your career.",
  "Why should we hire you?",
];

const GREETING: Message = {
  role: "assistant",
  content: `Hi! I'm ${profile.name.split(" ")[0]}'s digital twin. Ask me anything about his QA & automation experience, skills, or career.`,
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    setError(null);
    setInput("");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      if (!acc.trim()) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Sorry, I didn't catch that — could you rephrase?",
          };
          return copy;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with my digital twin"}
        className={cn(
          "fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-[0_12px_40px_-12px_rgba(99,102,241,0.8)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60",
          "bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 text-slate-950",
        )}
      >
        {open ? <X size={18} /> : <Sparkles size={18} />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask my AI twin"}</span>
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-20 right-5 z-[60] w-[calc(100vw-2.5rem)] max-w-[400px] origin-bottom-right transition-all duration-200",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div className="glass flex h-[min(560px,75vh)] flex-col overflow-hidden rounded-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-300 text-slate-950">
              <Bot size={18} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{profile.name} · Digital Twin</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online · answers about my career
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                    m.role === "user"
                      ? "bg-gradient-to-br from-indigo-400 to-cyan-300 text-slate-950"
                      : "border border-white/10 bg-white/[0.04] text-slate-200",
                  )}
                >
                  {m.content || (loading && i === messages.length - 1 ? <TypingDots /> : null)}
                </div>
              </div>
            ))}

            {messages.length <= 1 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-indigo-400/40 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            ) : null}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-white/10 p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/12 bg-black/30 px-3 py-2 focus-within:border-indigo-400/50">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about my experience…"
                className="max-h-28 flex-1 resize-none bg-transparent py-1 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="grid h-8 w-8 flex-none place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-300 text-slate-950 transition-opacity disabled:opacity-40"
              >
                <ArrowUp size={16} />
              </button>
            </div>
            <div className="mt-2 px-1 text-center text-[10px] text-slate-600">
              AI digital twin · may occasionally be imperfect
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
    </span>
  );
}
