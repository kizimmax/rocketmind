"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@rocketmind/ui";
import {
  generateMockResponse,
  type ChatMessage,
} from "@/lib/use-consultant-chat";
import {
  MessagesArea,
  SuggestionChips,
  ConsultantInput,
} from "@/components/sections/AiConsultant";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const NEW_CHAT_TITLE = "Новый чат";
const TITLE_MAX = 28;

type Session = {
  id: string;
  title: string;
  messages: ChatMessage[];
  streamingMsgId: string | null;
};

function makeSessionId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function makeMsgId() {
  return `site_m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function deriveTitle(text: string) {
  const t = text.trim();
  return t.length > TITLE_MAX ? `${t.slice(0, TITLE_MAX).trimEnd()}…` : t;
}

export interface ConsultantPanelHandle {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

export interface ConsultantPanelProps {
  onOpenChange?: (open: boolean) => void;
}

export const ConsultantPanel = forwardRef<
  ConsultantPanelHandle,
  ConsultantPanelProps
>(function ConsultantPanel({ onOpenChange }, ref) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(() => [
    {
      id: makeSessionId(),
      title: NEW_CHAT_TITLE,
      messages: [],
      streamingMsgId: null,
    },
  ]);
  const [activeId, setActiveId] = useState<string>(() => sessions[0]?.id ?? "");
  const [isSending, setIsSending] = useState(false);

  // Keep activeId valid если первый ID изменился (init order quirk)
  useEffect(() => {
    if (!sessions.find((s) => s.id === activeId) && sessions[0]) {
      setActiveId(sessions[0].id);
    }
  }, [sessions, activeId]);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: () => open,
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll on mobile bottom-sheet only
  useEffect(() => {
    if (!open) return;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleNewChat = useCallback(() => {
    const active = sessions.find((s) => s.id === activeId);
    // если активная сессия уже пустая — просто остаёмся на ней
    if (active && active.messages.length === 0) {
      setActiveId(active.id);
      return;
    }
    const id = makeSessionId();
    setSessions((prev) => [
      ...prev,
      { id, title: NEW_CHAT_TITLE, messages: [], streamingMsgId: null },
    ]);
    setActiveId(id);
  }, [activeId, sessions]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const sid = activeId;
      const userMsg: ChatMessage = {
        id: makeMsgId(),
        role: "user",
        content: trimmed,
        created_at: new Date().toISOString(),
      };

      setIsSending(true);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sid
            ? {
                ...s,
                messages: [...s.messages, userMsg],
                title: s.messages.length === 0 ? deriveTitle(trimmed) : s.title,
                streamingMsgId: null,
              }
            : s,
        ),
      );

      await new Promise((r) => setTimeout(r, 1200));

      const assistantMsg: ChatMessage = {
        id: makeMsgId(),
        role: "assistant",
        content: generateMockResponse(trimmed),
        created_at: new Date().toISOString(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sid
            ? {
                ...s,
                messages: [...s.messages, assistantMsg],
                streamingMsgId: assistantMsg.id,
              }
            : s,
        ),
      );
      setIsSending(false);
    },
    [activeId],
  );

  if (!mounted) return null;

  const active = sessions.find((s) => s.id === activeId) ?? sessions[0];
  const hasMessages = active.messages.length > 0;
  const state = open ? "open" : "closed";

  // Stagger config: на open — панель заезжает первой (delay 0), затем секции
  // сверху вниз; на close — секции снизу вверх, затем панель.
  const STAGGER_COUNT = 4; // header, tabs, body, input
  const STEP = 70;
  const ITEM_OPEN_LEAD = 120;
  const PANEL_CLOSE_DELAY = (STAGGER_COUNT - 1) * STEP + 220;
  const itemDelay = (i: number) =>
    open ? ITEM_OPEN_LEAD + i * STEP : (STAGGER_COUNT - 1 - i) * STEP;
  const STAGGER_CLS =
    "transition-[opacity,transform] duration-200 ease-out data-[state=closed]:opacity-0 data-[state=closed]:translate-x-3 data-[state=open]:opacity-100 data-[state=open]:translate-x-0";

  const panel = (
    <>
      {/* Mobile backdrop */}
      <div
        data-state={state}
        className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=open]:opacity-100 md:hidden"
        onClick={handleClose}
      />

      {/* Panel */}
      <aside
        data-state={state}
        aria-hidden={!open}
        role="dialog"
        aria-label="AI-консультант Алекс"
        style={{ transitionDelay: open ? "0ms" : `${PANEL_CLOSE_DELAY}ms` }}
        className="
          fixed z-40 flex flex-col bg-background transition-[transform,top,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          inset-x-0 bottom-0 top-auto h-[85vh] rounded-t-lg border-t border-border
          translate-y-full opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100
          md:right-0 md:left-auto md:bottom-0 md:top-[var(--rm-header-offset,0px)] md:h-auto md:w-[378px] md:max-w-[420px] md:rounded-none md:border-t-0 md:border-l
          md:translate-x-full md:translate-y-0 md:data-[state=open]:translate-x-0
          xl:w-[420px]
          data-[state=closed]:pointer-events-none
        "
      >
        {/* Header */}
        <div
          data-state={state}
          style={{ transitionDelay: `${itemDelay(0)}ms` }}
          className={`flex shrink-0 items-center justify-between border-b border-border px-5 py-4 md:px-8 ${STAGGER_CLS}`}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 71%)",
                }}
              />
              <Image
                src={`${BASE_PATH}/ai-mascots/alex/alex_base.png`}
                alt="Алекс"
                width={40}
                height={40}
                className="relative h-10 w-10 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[length:var(--text-16)] font-medium leading-[1.2] text-foreground">
                Алекс
              </span>
              <span className="font-[family-name:var(--font-mono-family)] text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70">
                AI-консультант
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider delay={200}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={handleNewChat}
                      disabled={!hasMessages}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted-foreground"
                      aria-label="Новый чат"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  }
                />
                <TooltipContent>Новый чат</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs — показываем только когда есть >1 сессии */}
        {sessions.length > 1 && (
          <div
            data-state={state}
            style={{ transitionDelay: `${itemDelay(1)}ms` }}
            className={`shrink-0 ${STAGGER_CLS}`}
          >
            <SessionTabs
              sessions={sessions}
              activeId={active.id}
              onSelect={setActiveId}
            />
          </div>
        )}

        {/* Body */}
        <div
          key={active.id}
          data-state={state}
          style={{ transitionDelay: `${itemDelay(2)}ms` }}
          className={`flex min-h-0 flex-1 flex-col px-5 py-4 md:px-8 ${STAGGER_CLS}`}
        >
          {hasMessages ? (
            <MessagesArea
              messages={active.messages}
              isSending={isSending}
              streamingMsgId={active.streamingMsgId}
              compact
            />
          ) : (
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="mb-4 text-[length:var(--text-14)] leading-[1.4] text-muted-foreground">
                Расскажите, какой у вас запрос — или выберите сценарий ниже.
              </p>
              <div className="md:hidden">
                <SuggestionChips
                  layout="horizontal"
                  onSelect={(text) => sendMessage(text)}
                />
              </div>
              <div className="hidden md:block">
                <SuggestionChips
                  layout="vertical"
                  onSelect={(text) => sendMessage(text)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          data-state={state}
          style={{ transitionDelay: `${itemDelay(3)}ms` }}
          className={`shrink-0 px-5 pb-4 md:px-8 ${STAGGER_CLS}`}
        >
          <ConsultantInput onSend={sendMessage} disabled={isSending} compact />
        </div>
      </aside>
    </>
  );

  return createPortal(panel, document.body);
});

function SessionTabs({
  sessions,
  activeId,
  onSelect,
}: {
  sessions: Session[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLButtonElement>(
      `[data-session-id="${activeId}"]`,
    );
    activeBtn?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeId]);

  return (
    <div
      ref={scrollRef}
      className="flex h-10 items-center gap-1 overflow-x-auto border-b border-border bg-transparent px-5 md:px-8"
      style={{ scrollbarWidth: "none" }}
      role="tablist"
    >
      {sessions.map((s) => {
        const isActive = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-session-id={s.id}
            onClick={() => onSelect(s.id)}
            className={`relative inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-transparent px-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-[color,background-color] duration-150 hover:bg-[var(--rm-gray-2)] hover:text-foreground after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:transition-colors ${
              isActive
                ? "text-foreground after:bg-[var(--rm-yellow-100)]"
                : "text-muted-foreground after:bg-transparent"
            }`}
          >
            <span className="block max-w-[160px] truncate">{s.title}</span>
          </button>
        );
      })}
    </div>
  );
}
