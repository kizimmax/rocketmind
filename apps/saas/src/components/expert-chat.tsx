"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, RotateCw, Sparkles } from "lucide-react";
import { DotGridLens } from "@rocketmind/ui";
import { MessageBubble } from "./message";
import { ChatInput } from "./chat-input";
import type {
  Agent,
  Artifact,
  Expert,
  ExpertScenario,
  Message,
} from "@/lib/types";
import { getInitials } from "@/lib/utils";

interface ExpertChatProps {
  expert: Expert;
  /** История диалога, загруженная из моков/бэка. Анимация появления не играется. */
  initialMessages?: Message[];
  /** Состояние сессии: определяет доступные действия (HITL, mode-picker). */
  sessionStatus?: "not_started" | "in_progress" | "awaiting_validation" | "completed";
  /** Артефакты проекта — для привязки карточек к сообщениям. */
  artifacts?: Artifact[];
  activeArtifactId?: string | null;
  onArtifactHover?: (id: string | null) => void;
  onArtifactPreview?: (artifact: Artifact) => void;
  onArtifactDownload?: (artifact: Artifact) => void;
  /** Сообщает родителю высоту нижней зоны (input + пикеры) в px. */
  onInputZoneHeight?: (height: number) => void;
}

// Agent-адаптер для MessageBubble (исторический API)
function expertToAgent(expert: Expert): Agent {
  return {
    id: expert.id,
    slug: expert.codename,
    name: expert.name,
    description: expert.description,
    avatar_url: expert.avatar_url,
    greeting: expert.greeting,
    suggestions: expert.suggestions,
    config: {},
  };
}

export function ExpertChat({
  expert,
  initialMessages,
  sessionStatus,
  artifacts,
  activeArtifactId,
  onArtifactHover,
  onArtifactPreview,
  onArtifactDownload,
  onInputZoneHeight,
}: ExpertChatProps) {
  const agentLike = expertToAgent(expert);
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? []);
  const [isSending, setIsSending] = useState(false);
  /** Set id-шников сообщений, добавленных в реалтайме. Только они анимируются rise/typing. */
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputZoneRef = useRef<HTMLDivElement>(null);

  // Сообщаем родителю высоту нижней зоны — FAB-кнопка «Артефакты» её учитывает.
  useEffect(() => {
    if (!onInputZoneHeight || !inputZoneRef.current) return;
    const el = inputZoneRef.current;
    const report = () => onInputZoneHeight(el.getBoundingClientRect().height);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onInputZoneHeight]);

  // Синхронизируем при смене эксперта / загруженной истории
  useEffect(() => {
    setMessages(initialMessages ?? []);
    setFreshIds(new Set()); // историческая загрузка — без fresh-анимации
  }, [expert.codename, initialMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const pushFresh = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    setFreshIds((prev) => new Set(prev).add(msg.id));
  }, []);

  // --- User interactions ---

  function sendUserMessage(content: string) {
    const userMsg: Message = {
      id: `m_u_${Date.now()}`,
      conversation_id: `es_live_${expert.codename}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
      is_read: true,
    };
    pushFresh(userMsg);
    setIsSending(true);

    // Эмулируем ответ эксперта через 1200ms
    setTimeout(() => {
      const reply: Message = {
        id: `m_a_${Date.now()}`,
        conversation_id: userMsg.conversation_id,
        role: "assistant",
        content: mockReplyTo(expert, content),
        created_at: new Date().toISOString(),
        is_read: false,
      };
      pushFresh(reply);
      setIsSending(false);
    }, 1200);
  }

  function pickScenario(scenario: ExpertScenario) {
    sendUserMessage(scenario.label);
  }

  function pickMode(mode: "deep" | "fast") {
    sendUserMessage(mode === "deep" ? "Глубокая работа" : "Быстро");
  }

  function hitlAccept() {
    // Системное сообщение об успехе + финальное assistant
    const system: Message = {
      id: `m_sys_${Date.now()}`,
      conversation_id: `es_live_${expert.codename}`,
      role: "system",
      content: `Артефакт принят`,
      metadata: { artifact_completed: "accepted" },
      created_at: new Date().toISOString(),
      is_read: true,
    };
    pushFresh(system);
  }

  function hitlRequestChanges() {
    sendUserMessage("Нужно доработать — перезапусти с учётом правок");
  }

  // --- Derived: какой picker показывать под input ---

  const lastMessage = messages[messages.length - 1];
  const scenariosToShow =
    lastMessage?.role === "assistant" &&
    lastMessage.metadata?.scenarios &&
    !hasUserRepliedAfter(messages, lastMessage.id)
      ? (expert.scenarios ?? []).filter((s) =>
          lastMessage.metadata!.scenarios!.includes(s.codename)
        )
      : null;

  const showModePicker =
    lastMessage?.role === "assistant" &&
    lastMessage.metadata?.mode_picker === true &&
    !hasUserRepliedAfter(messages, lastMessage.id);

  const showHitl =
    sessionStatus === "awaiting_validation" &&
    lastMessage?.role === "assistant" &&
    lastMessage.metadata?.hitl_for_artifact_id &&
    !hasUserRepliedAfter(messages, lastMessage.id);

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <DotGridLens
        gridGap={10}
        baseRadius={0.75}
        maxScale={2.8}
        lensRadius={100}
        className="pointer-events-auto absolute inset-0 z-0"
      />

      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyExpertChat expert={expert} onSuggestion={sendUserMessage} />
        ) : (
          <div className="mx-auto max-w-2xl space-y-4 px-5 py-16">
            {messages.map((msg, idx) => {
              const prevUserMsg =
                msg.role === "assistant"
                  ? [...messages]
                      .slice(0, idx)
                      .reverse()
                      .find((m) => m.role === "user")
                  : undefined;
              const linkedArtifactId =
                msg.metadata?.artifact_completed ??
                msg.metadata?.hitl_for_artifact_id;
              const linkedArtifact = linkedArtifactId
                ? artifacts?.find((a) => a.id === linkedArtifactId) ?? null
                : null;
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  agent={agentLike}
                  expertThinkingAvatarUrl={expert.thinking_avatar_url}
                  isNew={freshIds.has(msg.id) && msg.role === "assistant"}
                  isFresh={freshIds.has(msg.id)}
                  onRepeat={
                    prevUserMsg
                      ? () => sendUserMessage(prevUserMsg.content)
                      : undefined
                  }
                  linkedArtifact={linkedArtifact}
                  isArtifactActive={
                    !!linkedArtifact && activeArtifactId === linkedArtifact.id
                  }
                  onArtifactHover={onArtifactHover}
                  onArtifactPreview={onArtifactPreview}
                  onArtifactDownload={onArtifactDownload}
                />
              );
            })}
            {isSending && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input zone */}
      <div ref={inputZoneRef} className="relative z-10">
        {scenariosToShow && scenariosToShow.length > 0 ? (
          <ScenarioPicker scenarios={scenariosToShow} onPick={pickScenario} />
        ) : showModePicker ? (
          <ModePicker onPick={pickMode} />
        ) : showHitl ? (
          <HitlPicker onAccept={hitlAccept} onRequestChanges={hitlRequestChanges} />
        ) : (
          <ChatInput
            onSend={sendUserMessage}
            disabled={isSending}
            placeholder={`Сообщение для ${expert.name}…`}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Вспомогательные компоненты
// ─────────────────────────────────────────────────────────────────────────────

function hasUserRepliedAfter(messages: Message[], anchorId: string): boolean {
  const idx = messages.findIndex((m) => m.id === anchorId);
  if (idx < 0) return false;
  return messages.slice(idx + 1).some((m) => m.role === "user");
}

function EmptyExpertChat({
  expert,
  onSuggestion,
}: {
  expert: Expert;
  onSuggestion: (text: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12">
      <div className="mb-4 h-24 w-24 overflow-hidden rounded-full">
        {expert.avatar_url ? (
          <Image
            src={expert.avatar_url}
            alt={expert.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold text-muted-foreground">
            {getInitials(expert.name)}
          </span>
        )}
      </div>

      <h3 className="mb-1 font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase">
        {expert.name}
      </h3>
      <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
        {expert.codename} · {expert.role}
      </p>
      <p className="mb-6 max-w-sm text-center text-[length:var(--text-14)] text-muted-foreground">
        {expert.greeting ?? expert.description}
      </p>

      {expert.scenarios && expert.scenarios.length > 0 && (
        <div className="w-full max-w-lg">
          <div className="grid gap-2 sm:grid-cols-2">
            {expert.scenarios.map((s) => (
              <ScenarioButton key={s.codename} scenario={s} onPick={() => onSuggestion(s.label)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-sm bg-rm-gray-1 px-4 py-2.5">
        <div className="flex space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-rm-gray-3 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-rm-gray-3 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-rm-gray-3 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ScenarioButton({
  scenario,
  onPick,
}: {
  scenario: ExpertScenario;
  onPick: () => void;
}) {
  const isPrimary = scenario.is_primary;
  return (
    <button
      type="button"
      onClick={onPick}
      className={`group flex items-start gap-2.5 rounded-sm border px-3.5 py-3 text-left transition-colors ${
        isPrimary
          ? "border-foreground bg-foreground text-background hover:opacity-90"
          : "border-border bg-background/80 backdrop-blur-sm text-foreground hover:border-foreground"
      }`}
    >
      <Sparkles
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
          isPrimary
            ? "text-[var(--rm-yellow-500)]"
            : "text-[var(--rm-yellow-500)] opacity-60 group-hover:opacity-100 transition-opacity"
        }`}
      />
      <div className="flex flex-col">
        <span className="text-[length:var(--text-14)]">{scenario.label}</span>
        {scenario.hint && (
          <span
            className={`text-[length:var(--text-12)] ${
              isPrimary ? "opacity-80" : "text-muted-foreground"
            }`}
          >
            {scenario.hint}
          </span>
        )}
        {isPrimary && (
          <span className="mt-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-500)]">
            Рекомендую
          </span>
        )}
      </div>
    </button>
  );
}

function ScenarioPicker({
  scenarios,
  onPick,
}: {
  scenarios: ExpertScenario[];
  onPick: (s: ExpertScenario) => void;
}) {
  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm px-3.5 py-4">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
          Выберите сценарий
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {scenarios.map((s) => (
            <ScenarioButton key={s.codename} scenario={s} onPick={() => onPick(s)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModePicker({ onPick }: { onPick: (mode: "deep" | "fast") => void }) {
  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm px-3.5 py-4">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
          Как будем делать?
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onPick("deep")}
            className="group flex items-start gap-2.5 rounded-sm border border-foreground bg-foreground px-3.5 py-3 text-left text-background transition-opacity hover:opacity-90"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)]" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)]">Глубокая работа</span>
              <span className="text-[length:var(--text-12)] opacity-80">
                Несколько итераций с самопроверкой — точнее, 10–15 минут
              </span>
              <span className="mt-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-500)]">
                Рекомендую
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onPick("fast")}
            className="group flex items-start gap-2.5 rounded-sm border border-border bg-background/80 backdrop-blur-sm px-3.5 py-3 text-left transition-colors hover:border-foreground"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)] opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)] text-foreground">Быстро</span>
              <span className="text-[length:var(--text-12)] text-muted-foreground">
                Первая версия за 30 секунд. Принять или перезапустить позже
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function HitlPicker({
  onAccept,
  onRequestChanges,
}: {
  onAccept: () => void;
  onRequestChanges: () => void;
}) {
  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm px-3.5 py-4">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
          Решение по артефакту
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onAccept}
            className="group flex items-start gap-2.5 rounded-sm border border-foreground bg-foreground px-3.5 py-3 text-left text-background transition-opacity hover:opacity-90"
          >
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)]" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)]">Принять</span>
              <span className="text-[length:var(--text-12)] opacity-80">
                Финализирую артефакт и двигаемся к следующему эксперту
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={onRequestChanges}
            className="group flex items-start gap-2.5 rounded-sm border border-border bg-background/80 backdrop-blur-sm px-3.5 py-3 text-left transition-colors hover:border-foreground"
          >
            <RotateCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)] text-foreground">
                Дать правки и перезапустить
              </span>
              <span className="text-[length:var(--text-12)] text-muted-foreground">
                Расскажите, что поправить — запущу новую итерацию
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function mockReplyTo(expert: Expert, _userText: string): string {
  return `Принято. Продолжаю работу (мок-ответ от ${expert.name}).`;
}
