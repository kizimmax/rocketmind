"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Textarea, DotGridLens, GlowingEffect } from "@rocketmind/ui";
import { Loader2 } from "lucide-react";
import type { TeacherAgent } from "./teacher-sidebar";
import { getAgentHistory, streamMessage } from "@/lib/ivan-client";

/** Инициалы для аватара-плейсхолдера — как getInitials в apps/saas. */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

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
 * (GET /course/messages?agentId). Переключение агента в сайдбаре → своя переписка.
 */
export function TeacherChat({ selectedAgent, programClosed = false }: TeacherChatProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Пагинация истории: у Ивана сортировка ASC (page 1 = самые старые), новые —
  // на последней странице. Открываем последнюю, при скролле вверх грузим старее.
  const oldestPageRef = useRef(1);
  const hasOlderRef = useRef(false);
  const loadingOlderRef = useRef(false);
  // Якорь скролла при подгрузке старых сверху (чтобы лента не прыгала).
  const prependRef = useRef<{ prevHeight: number; prevTop: number } | null>(null);
  // Разово пропустить авто-скролл вниз (после prepend старых сообщений).
  const skipBottomRef = useRef(false);

  const agentId = selectedAgent?.id ?? null;
  const canSend = draft.trim().length > 0 && !streaming && !!selectedAgent;

  // История выбранного агента: грузим последнюю страницу (самые свежие),
  // остальное — по скроллу вверх. Перезагружаем при смене агента.
  useEffect(() => {
    abortRef.current?.abort();
    setMessages([]);
    oldestPageRef.current = 1;
    hasOlderRef.current = false;
    if (!agentId) return;
    let cancelled = false;
    setLoadingHistory(true);
    (async () => {
      const first = await getAgentHistory(agentId, 1);
      const page =
        first.pagination.totalPages > 1
          ? await getAgentHistory(agentId, first.pagination.totalPages)
          : first;
      if (cancelled) return;
      oldestPageRef.current = page.pagination.page;
      hasOlderRef.current = page.pagination.page > 1;
      setMessages(page.messages.map((m) => ({ id: m.id, role: m.role, content: m.content })));
    })()
      .catch(() => {})
      .finally(() => !cancelled && setLoadingHistory(false));
    return () => {
      cancelled = true;
    };
  }, [agentId]);

  // Подгрузка более старых сообщений (страница ниже текущей самой старой).
  const loadOlder = useCallback(async () => {
    if (!agentId || loadingOlderRef.current || !hasOlderRef.current) return;
    const prevPage = oldestPageRef.current - 1;
    if (prevPage < 1) return;
    loadingOlderRef.current = true;
    setLoadingOlder(true);
    try {
      const older = await getAgentHistory(agentId, prevPage);
      const el = scrollRef.current;
      if (el) prependRef.current = { prevHeight: el.scrollHeight, prevTop: el.scrollTop };
      skipBottomRef.current = true;
      setMessages((m) => {
        const have = new Set(m.map((x) => x.id));
        const fresh = older.messages
          .filter((x) => !have.has(x.id))
          .map((x) => ({ id: x.id, role: x.role, content: x.content }));
        return [...fresh, ...m];
      });
      oldestPageRef.current = older.pagination.page;
      hasOlderRef.current = older.pagination.page > 1;
    } finally {
      loadingOlderRef.current = false;
      setLoadingOlder(false);
    }
  }, [agentId]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop < 80 && hasOlderRef.current && !loadingOlderRef.current) loadOlder();
  }

  // Перенос позиции скролла при prepend старых сообщений (до отрисовки).
  useLayoutEffect(() => {
    const p = prependRef.current;
    if (!p) return;
    prependRef.current = null;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight - p.prevHeight + p.prevTop;
  }, [messages]);

  // Авто-скролл вниз (новые сообщения / стрим / первая загрузка). После prepend пропускаем.
  useEffect(() => {
    if (skipBottomRef.current) {
      skipBottomRef.current = false;
      return;
    }
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
      const res = await streamMessage(selectedAgent.id, content, ctrl.signal);
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
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Фон — точечная сетка с линзой, как в saas */}
      <DotGridLens
        gridGap={10}
        baseRadius={0.75}
        maxScale={2.8}
        lensRadius={100}
        className="pointer-events-auto absolute inset-0 z-0"
      />

      {/* Messages */}
      <div ref={scrollRef} onScroll={onScroll} className="relative z-10 flex-1 overflow-y-auto">
        {!selectedAgent ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Выберите AI-эксперта в сайдбаре.
            </p>
          </div>
        ) : loadingHistory && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          /* Пустой чат — крупный аватар эксперта + интро, как EmptyExpertChat в saas */
          <div className="flex h-full flex-col items-center justify-center px-6 py-12">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-background">
              {selectedAgent.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedAgent.avatarUrl}
                  alt={selectedAgent.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold text-muted-foreground">
                  {getInitials(selectedAgent.name)}
                </span>
              )}
            </div>
            <h3 className="mb-1 font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase">
              {selectedAgent.name}
            </h3>
            {selectedAgent.role && (
              <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                {selectedAgent.role}
              </p>
            )}
            <p className="max-w-sm text-center text-[length:var(--text-14)] text-muted-foreground">
              {selectedAgent.valueDescription || `Напишите ${selectedAgent.name} первое сообщение.`}
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4 px-5 py-8">
            {loadingOlder && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[75%] space-y-1">
                    <div className="rounded-sm bg-rm-gray-2 px-4 py-3 text-[length:var(--text-14)] text-foreground">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-start">
                  <div className="w-full min-w-0 space-y-1 lg:max-w-[75%]">
                    {selectedAgent && (
                      <div className="mb-1 flex items-center gap-1.5">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-background">
                          {selectedAgent.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={selectedAgent.avatarUrl}
                              alt={selectedAgent.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-[length:var(--text-14)] font-bold text-muted-foreground">
                              {getInitials(selectedAgent.name)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[length:var(--text-12)] font-medium">
                            {selectedAgent.name}
                          </span>
                          {selectedAgent.role && (
                            <span className="text-[length:var(--text-12)] text-muted-foreground">
                              {selectedAgent.role}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="relative rounded-sm bg-background px-4 py-3 text-[length:var(--text-14)] text-foreground">
                      <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />
                      {msg.content ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : msg.pending ? (
                        <Dots />
                      ) : null}
                      {msg.pending && msg.content && (
                        <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-blink bg-foreground align-text-bottom" />
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Composer / плашка подписки */}
      {programClosed ? (
        <div className="relative z-10 border-t border-border bg-rm-gray-1/30 px-6 py-4">
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
        <div className="relative z-10 px-3.5 pb-3.5 pt-2">
          <div className="mx-auto max-w-2xl">
            <div className="relative rounded-sm border-2 border-border bg-background/80 backdrop-blur-sm transition-colors has-[textarea:focus]:border-ring">
              <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  variant="chat"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={selectedAgent ? "Введите сообщение..." : "Выберите эксперта"}
                  disabled={!selectedAgent}
                  className="border-0 bg-transparent pl-3.5 pr-12 focus-visible:border-0 focus-visible:ring-0"
                  rows={1}
                />
                <Button
                  size="icon"
                  variant={canSend ? "default" : "ghost"}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={send}
                  disabled={!canSend}
                  className="absolute bottom-2 right-2"
                  aria-label="Отправить"
                >
                  {streaming ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="size-6">
                      <path
                        d="M12.0468 4.58813L5 11.6131M12.0468 4.58813L12.0468 19.4117M12.0468 4.58813L19 11.6131"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
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
