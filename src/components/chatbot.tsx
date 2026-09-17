"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageSquare, RotateCcw, Send, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What services does Efrata offer?",
  "Can I see her video editing work?",
  "How can I hire Efrata?",
  "ኤፍራታ ምን አይነት ስራ ትሰራለች?",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>("");

  useEffect(() => {
    sessionId.current =
      globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    setError("");
    setInput("");
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10), sessionId: sessionId.current }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Chat failed");
      setMessages([...next, { role: "assistant", content: json.reply }]);
    } catch (e) {
      setError(
        (e as Error).message ||
          "The assistant is unavailable right now. You can still reach Efrata through the contact page."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        className="btn btn-primary fixed bottom-5 right-5 z-50 !h-14 !w-14 !rounded-full !p-0 shadow-2xl md:bottom-7 md:right-7"
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            role="dialog"
            aria-label="Portfolio AI assistant"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="card fixed inset-x-3 bottom-24 z-50 flex max-h-[70vh] flex-col overflow-hidden md:inset-x-auto md:right-7 md:w-[24rem]"
          >
            <header className="flex items-center gap-2.5 border-b p-4" style={{ borderColor: "var(--surface-border)" }}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                <Bot size={17} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold leading-none">Efrata’s Assistant</p>
                <p className="mt-1 text-[0.68rem] text-[var(--ink-muted)]">Answers in English or Amharic</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError("");
                }}
                aria-label="Clear conversation"
                className="rounded-full p-2 text-[var(--ink-muted)] hover:text-[var(--accent)]"
              >
                <RotateCcw size={15} />
              </button>
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-[var(--ink-soft)]">
                    Hi 👋 Ask me anything about Efrata’s work, services or how to hire her.
                  </p>
                  <ul className="space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => send(s)}
                          className="w-full rounded-xl border px-3 py-2 text-left text-[0.8rem] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          style={{ borderColor: "var(--surface-border)" }}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[0.84rem] leading-relaxed ${
                    msg.role === "user"
                      ? "ml-auto bg-[var(--accent)] text-[var(--accent-ink)]"
                      : "bg-[var(--bg-sunken)]"
                  }`}
                >
                  <Rich text={msg.content} />
                </div>
              ))}

              {loading && (
                <div className="flex w-16 items-center gap-1 rounded-2xl bg-[var(--bg-sunken)] px-3.5 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[var(--ink-muted)]"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-[var(--accent-soft)] p-3 text-[0.78rem] text-[var(--accent)]">
                  {error}{" "}
                  <Link href="/contact" className="underline">
                    Contact Efrata directly
                  </Link>
                  .
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t p-3"
              style={{ borderColor: "var(--surface-border)" }}
            >
              <label className="sr-only" htmlFor="chat-input">
                Your message
              </label>
              <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask in English or አማርኛ…"
                maxLength={600}
                className="field !py-2.5"
              />
              <button type="submit" disabled={loading} className="btn btn-primary !px-3.5 !py-2.5" aria-label="Send message">
                <Send size={15} />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/** Minimal, safe markdown-link renderer (no HTML injection). */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return <span key={i}>{part}</span>;
        const href = match[2].startsWith("/") || match[2].startsWith("https://") ? match[2] : "/contact";
        return (
          <Link key={i} href={href} className="font-semibold underline">
            {match[1]}
          </Link>
        );
      })}
    </>
  );
}
