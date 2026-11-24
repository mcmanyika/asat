"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: `Hello. I'm the ${siteConfig.shortName} assistant. I can answer questions about our products, systems, IT solutions and consulting — and I can also take your enquiry details so our team can follow up.`,
};

export function ChatWidget() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enquirySaved, setEnquirySaved] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    inputRef.current?.focus();
  }, [open, messages, pending]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const content = input.trim();
    if (!content || pending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    const history = [...messages, userMessage]
      .filter((message) => message.id !== "welcome")
      .map(({ role, content: text }) => ({ role, content: text }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setPending(true);
    setError(null);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((current) => [
      ...current,
      { id: assistantId, role: "assistant", content: "Thinking…" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
        enquirySaved?: boolean;
      } | null;

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to reach the assistant right now.",
        );
      }

      const reply =
        data?.message?.trim() ||
        "How else can I help you with ASAT Technologies today?";

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: reply }
            : message,
        ),
      );

      if (data?.enquirySaved) {
        setEnquirySaved(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setMessages((current) =>
        current.filter((item) => item.id !== assistantId),
      );
    } finally {
      setPending(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {open ? (
        <section
          id={panelId}
          aria-label={`${siteConfig.shortName} chat assistant`}
          className="flex h-[min(34rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden border border-border bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center bg-gold text-white">
                <Bot className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {siteConfig.shortName} Assistant
                </p>
                <p className="text-xs text-slate-300">
                  Chat or leave an enquiry
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-8 items-center justify-center text-white/80 transition hover:text-white"
              aria-label="Close chat"
            >
              <X className="size-5" />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-light-bg px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-[4px] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                  message.role === "user"
                    ? "ml-auto bg-navy text-white"
                    : "border border-border bg-white text-primary-text",
                )}
              >
                {message.content}
              </div>
            ))}
          </div>

          {enquirySaved ? (
            <p className="border-t border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-900">
              Enquiry saved. Our team will follow up using the details you
              shared.
            </p>
          ) : null}

          {error ? (
            <p className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950">
              {error}
            </p>
          ) : null}

          <form
            onSubmit={sendMessage}
            className="border-t border-border bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder="Ask a question or start an enquiry…"
                className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-[4px] border border-border px-3 py-2 text-sm outline-none focus:border-gold"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="inline-flex size-11 shrink-0 items-center justify-center bg-gold text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-2 bg-navy px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#15233a]"
      >
        {open ? (
          <>
            <X className="size-5" aria-hidden />
            Close
          </>
        ) : (
          <>
            <MessageCircle className="size-5" aria-hidden />
            Chat with us
          </>
        )}
      </button>
    </div>
  );
}
