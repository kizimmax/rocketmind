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
  agent: TeacherAgent;
  projectId: string;
}

export function TeacherChat({ agent, projectId }: TeacherChatProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset thread on agent change. Real persistence will come from the n8n
  // transport (writing to StudentSession.messages); the mock keeps in-memory.
  useEffect(() => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content:
          agent.valueDescription ||
          `Привет! Я ${agent.name}. Чем могу помочь?`,
      },
    ]);
  }, [agent.id, agent.name, agent.valueDescription]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function send() {
    const content = draft.trim();
    if (!content || streaming) return;
    setDraft("");

    const userMsg: Msg = { id: uid(), role: "user", content };
    const assistantId = uid();
    const placeholder: Msg = {
      id: assistantId,
      role: "assistant",
      content: "",
      pending: true,
    };
    setMessages((m) => [...m, userMsg, placeholder]);
    setStreaming(true);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          agentId: agent.id,
          content,
        }),
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
        // Parse SSE chunks: lines starting with "data: "
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          for (const line of part.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const evt = JSON.parse(payload);
              if (evt.type === "delta" && typeof evt.text === "string") {
                const delta = evt.text;
                setMessages((m) =>
                  m.map((x) =>
                    x.id === assistantId
                      ? { ...x, content: x.content + delta, pending: true }
                      : x,
                  ),
                );
              }
            } catch {
              // ignore malformed
            }
          }
        }
      }
      setMessages((m) =>
        m.map((x) => (x.id === assistantId ? { ...x, pending: false } : x)),
      );
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
      {/* Agent header */}
      <header className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
          {agent.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={agent.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <UserCircle className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[length:var(--text-14)] font-medium text-foreground">
            {agent.name}
          </span>
          {agent.role && (
            <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
              {agent.role}
            </span>
          )}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-sm px-3 py-2 text-[length:var(--text-14)] ${
                  msg.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-rm-gray-1/40 text-foreground"
                }`}
              >
                {msg.content || (msg.pending ? <Dots /> : "")}
                {msg.pending && msg.content && (
                  <span className="ml-1 inline-block h-3 w-[2px] animate-pulse bg-current align-middle" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <Textarea
            variant="chat"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Сообщение…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button
            size="sm"
            onClick={send}
            disabled={!draft.trim() || streaming}
          >
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
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
