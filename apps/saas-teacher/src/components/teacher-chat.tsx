"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Textarea } from "@rocketmind/ui";
import { Send, Loader2, UserCircle } from "lucide-react";
import type { TeacherAgent } from "./teacher-sidebar";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
};

function uid() {
  return Math.random().toString(36).slice(2);
}

interface TeacherChatProps {
  agents: TeacherAgent[];
  /** Активный эксперт — у каждого своя переписка. */
  selectedAgent: TeacherAgent | null;
  /** Программа закрыта → новые сообщения недоступны, чат read-only. */
  programClosed?: boolean;
}

/**
 * Чат с ОДНИМ экспертом (per-agent). У каждого агента своя история
 * (GET /api/chat?agentId). Переключение агента в сайдбаре → своя переписка.
 */
export function TeacherChat({ selectedAgent, programClosed = false }: TeacherChatProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const agentId = selectedAgent?.id ?? null;

  // История выбранного агента — перезагружаем при смене агента.
  useEffect(() => {
    abortRef.current?.abort();
    setMessages([]);
    if (!agentId) return;
    let cancelled = false;
    setLoadingHistory(true);
    fetch(`/api/chat?agentId=${encodeURIComponent(agentId)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { messages?: { id: string; role: "user" | "assistant"; content: string }[] }) => {
        if (!cancelled) setMessages((data.messages ?? []).map((m) => ({ id: m.id, role: m.role, content: m.content })));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoadingHistory(false));
    return () => {
      cancelled = true;
    };
  }, [agentId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function send() {
    const content = draft.trim();
    if (!content || streaming || !selectedAgent) return;
    setDraft("");

    const userMsg: Msg = { id: uid(), role: "user", content };
    const assistantId = uid();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "", pending: true }]);
    setStreaming(true);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent.id, content }),
        signal: ctrl.signal,
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          let event = "message";
          let data = "";
          for (const line of part.split("\n")) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (!data) continue;
          let payload: Record<string, unknown>;
          try {
            payload = JSON.parse(data);
          } catch {
            continue;
          }

          if (event === "delta" && typeof payload.text === "string") {
            const delta = payload.text;
            setMessages((m) =>
              m.map((x) => (x.id === assistantId ? { ...x, content: x.content + delta, pending: true } : x)),
            );
          } else if (event === "done") {
            const am = payload.agentMessage as { _id?: string } | undefined;
            setMessages((m) => m.map((x) => (x.id === assistantId ? { ...x, id: am?._id ?? x.id, pending: false } : x)));
          } else if (event === "error") {
            const msg = String(payload.message ?? "Ошибка");
            setMessages((m) =>
              m.map((x) =>
                x.id === assistantId
                  ? { ...x, content: x.content || `Не удалось получить ответ (${msg}).`, pending: false }
                  : x,
              ),
            );
          }
        }
      }
      setMessages((m) => m.map((x) => (x.id === assistantId ? { ...x, pending: false } : x)));
    } catch (err) {
      if ((err as { name?: string }).name !== "AbortError") {
        setMessages((m) =>
          m.map((x) =>
            x.id === assistantId
              ? { ...x, content: "Не удалось получить ответ. Попробуйте ещё раз.", pending: false }
              : x,
          ),
        );
      }
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header — активный эксперт */}
      <header className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
          {selectedAgent?.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={selectedAgent.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <UserCircle className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[length:var(--text-14)] font-medium text-foreground">
            {selectedAgent ? selectedAgent.name : "Выберите AI-эксперта"}
          </span>
          {selectedAgent?.role && (
            <span className="truncate text-[length:var(--text-12)] text-muted-foreground">{selectedAgent.role}</span>
          )}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {!selectedAgent ? (
            <p className="text-center text-[length:var(--text-12)] text-muted-foreground">
              Выберите AI-эксперта в сайдбаре слева.
            </p>
          ) : loadingHistory && messages.length === 0 ? (
            <p className="text-center text-[length:var(--text-12)] text-muted-foreground">Загрузка…</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-[length:var(--text-12)] text-muted-foreground">
              {selectedAgent.valueDescription || `Напишите ${selectedAgent.name} первое сообщение.`}
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-sm px-3 py-2 text-[length:var(--text-14)] ${
                    msg.role === "user" ? "bg-foreground text-background" : "bg-rm-gray-1/40 text-foreground"
                  }`}
                >
                  {msg.content || (msg.pending ? <Dots /> : "")}
                  {msg.pending && msg.content && (
                    <span className="ml-1 inline-block h-3 w-[2px] animate-pulse bg-current align-middle" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Composer / плашка подписки */}
      {programClosed ? (
        <div className="border-t border-border bg-rm-gray-1/30 px-6 py-4">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Чтобы продолжить диалог — оформите подписку.
            </p>
            <a
              href="/upgrade"
              className="rounded bg-[var(--rm-yellow-100)] px-4 py-2 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-foreground hover:opacity-90 transition-opacity"
            >
              Оформить подписку
            </a>
          </div>
        </div>
      ) : (
        <div className="border-t border-border px-6 py-4">
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <Textarea
              variant="chat"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={selectedAgent ? "Сообщение…" : "Выберите эксперта"}
              disabled={!selectedAgent}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button size="sm" onClick={send} disabled={!draft.trim() || streaming || !selectedAgent}>
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
    </span>
  );
}
