"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileText, RotateCw, Sparkles, Upload } from "lucide-react";
import { Button, DotGridLens, GlowingEffect, Textarea } from "@rocketmind/ui";
import { MessageBubble } from "./message";
import { ChatInput } from "./chat-input";
import { FilePreviewDialog } from "./file-preview-dialog";
import type {
  Agent,
  Artifact,
  Expert,
  ExpertScenario,
  FileAttachment,
  Message,
} from "@/lib/types";
import { useAttachedFiles } from "@/lib/use-attached-files";
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
  /** Открыть мобильный bottom-sheet артефактов. */
  onArtifactsOpenRequest?: () => void;
  /** Прогресс проекта (0–100) — рисуется снизу FAB-кнопки артефактов. */
  artifactsScore?: number | null;
  /** Колбэк после отправки сообщения с прикреплёнными файлами. */
  onFilesUpload?: (
    files: Array<{ name: string; size: number; url?: string; type?: string }>
  ) => void;
}

// Agent-адаптер для MessageBubble (исторический API)
function expertToAgent(expert: Expert): Agent {
  return {
    id: expert.id,
    slug: expert.codename,
    name: expert.name,
    description: expert.description,
    role: expert.role,
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
  onArtifactsOpenRequest,
  artifactsScore,
  onFilesUpload,
}: ExpertChatProps) {
  const agentLike = expertToAgent(expert);
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? []);
  const [isSending, setIsSending] = useState(false);
  /** Set id-шников сообщений, добавленных в реалтайме. Только они анимируются rise/typing. */
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputZoneRef = useRef<HTMLDivElement>(null);

  // Прикреплённые файлы к следующему user-сообщению + drag-over индикатор
  const attached = useAttachedFiles();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  // Preview для файлов, отправленных в чате
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(
    null
  );


  function handleDragEnter(e: React.DragEvent) {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragOver(true);
  }
  function handleDragOver(e: React.DragEvent) {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
  }
  function handleDragLeave(e: React.DragEvent) {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDragOver(false);
  }
  function handleDrop(e: React.DragEvent) {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) attached.addFiles(dropped);
  }

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
    const attachments: FileAttachment[] = attached.files.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      url: f.url,
      type: f.type,
    }));
    const userMsg: Message = {
      id: `m_u_${Date.now()}`,
      conversation_id: `es_live_${expert.codename}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
      is_read: true,
      metadata: attachments.length > 0 ? { attachments } : undefined,
    };
    if (attachments.length > 0) {
      onFilesUpload?.(
        attachments.map((a) => ({
          name: a.name,
          size: a.size,
          url: a.url,
          type: a.type,
        }))
      );
    }
    // keepUrls — URL-ы теперь принадлежат сообщению, revoke произойдёт на unmount чата
    attached.clearFiles({ keepUrls: true });
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

  // Локальное состояние HITL: пользователь нажал «Дать правки» и вводит текст
  const [hitlRevising, setHitlRevising] = useState(false);

  function hitlStartRevise() {
    setHitlRevising(true);
  }

  function hitlCancelRevise() {
    setHitlRevising(false);
  }

  function hitlSubmitRevision(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setHitlRevising(false);

    const userMsg: Message = {
      id: `m_u_${Date.now()}`,
      conversation_id: `es_live_${expert.codename}`,
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
      is_read: true,
    };
    pushFresh(userMsg);
    setIsSending(true);

    // Эксперт переспрашивает — правильно ли понял задачу
    setTimeout(() => {
      const echo: Message = {
        id: `m_a_${Date.now()}`,
        conversation_id: userMsg.conversation_id,
        role: "assistant",
        content: `Правильно я поняла — нужно учесть: «${trimmed}»? Если так, запускаю новую итерацию.`,
        metadata: { revision_echo: true },
        created_at: new Date().toISOString(),
        is_read: false,
      };
      pushFresh(echo);
      setIsSending(false);
    }, 1000);
  }

  function hitlConfirmRevision() {
    const userMsg: Message = {
      id: `m_u_${Date.now()}`,
      conversation_id: `es_live_${expert.codename}`,
      role: "user",
      content: "Да, всё верно",
      created_at: new Date().toISOString(),
      is_read: true,
    };
    pushFresh(userMsg);
    setIsSending(true);

    setTimeout(() => {
      const reply: Message = {
        id: `m_a_${Date.now()}`,
        conversation_id: userMsg.conversation_id,
        role: "assistant",
        content:
          "Принято. Запускаю новый цикл — перегенерирую профили и прогоню интервью с учётом правок.",
        metadata: { thinking: true },
        created_at: new Date().toISOString(),
        is_read: false,
      };
      pushFresh(reply);
      setIsSending(false);
    }, 1200);
  }

  function hitlRejectEcho() {
    // Пользователь отклоняет трактовку — возвращаем поле ввода правок
    setHitlRevising(true);
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

  const showHitlConfirm =
    lastMessage?.role === "assistant" &&
    lastMessage.metadata?.revision_echo === true &&
    !hasUserRepliedAfter(messages, lastMessage.id);

  // Сбрасываем «revising»-режим если чат ушёл в другую фазу
  useEffect(() => {
    if (!showHitl) setHitlRevising(false);
  }, [showHitl]);

  const isEmpty = messages.length === 0;

  return (
    <div
      className="relative flex flex-1 flex-col overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center border-2 border-dashed border-[var(--rm-yellow-100)] bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 text-foreground">
            <Upload className="h-8 w-8 text-[var(--rm-yellow-100)]" />
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em]">
              Отпустите, чтобы прикрепить
            </p>
          </div>
        </div>
      )}
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

              // Прикрепление артефакта: приоритет — к assistant, который анонсирует
              // ( = следующим идёт system с artifact_completed ). Fallback — сам system.
              const nextMsg = messages[idx + 1];
              const prevMsg = messages[idx - 1];
              let linkedArtifactId: string | undefined;
              if (msg.metadata?.hitl_for_artifact_id) {
                linkedArtifactId = msg.metadata.hitl_for_artifact_id;
              } else if (
                msg.role === "assistant" &&
                nextMsg?.role === "system" &&
                nextMsg.metadata?.artifact_completed
              ) {
                linkedArtifactId = nextMsg.metadata.artifact_completed;
              } else if (
                msg.role === "system" &&
                msg.metadata?.artifact_completed &&
                prevMsg?.role !== "assistant"
              ) {
                linkedArtifactId = msg.metadata.artifact_completed;
              }
              const linkedArtifact = linkedArtifactId
                ? artifacts?.find((a) => a.id === linkedArtifactId) ?? null
                : null;

              // Repeat: у сообщений с артефактом — перезапуск генерации артефакта
              // (как «Дать правки» в HitlPicker). Иначе — повтор предыдущего вопроса пользователя.
              const repeatHandler = linkedArtifact
                ? () => hitlStartRevise()
                : prevUserMsg
                  ? () => sendUserMessage(prevUserMsg.content)
                  : undefined;

              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  agent={agentLike}
                  expertThinkingAvatarUrl={expert.thinking_avatar_url}
                  isNew={freshIds.has(msg.id) && msg.role === "assistant"}
                  isFresh={freshIds.has(msg.id)}
                  onRepeat={repeatHandler}
                  linkedArtifact={linkedArtifact}
                  isArtifactActive={
                    !!linkedArtifact && activeArtifactId === linkedArtifact.id
                  }
                  onArtifactHover={onArtifactHover}
                  onArtifactPreview={onArtifactPreview}
                  onArtifactDownload={onArtifactDownload}
                  onAttachmentPreview={setPreviewAttachment}
                />
              );
            })}
            {isSending && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input zone */}
      <div ref={inputZoneRef} className="relative z-10">
        {/* Mobile FAB «Артефакты» — зацеплен за верх input-зоны, двигается вместе с её высотой */}
        {onArtifactsOpenRequest && artifacts && artifacts.length > 0 && (
          <button
            type="button"
            onClick={onArtifactsOpenRequest}
            aria-label={`Артефакты: ${artifacts.length}`}
            className="absolute bottom-full right-3 z-20 mb-3 flex items-center gap-1.5 overflow-hidden rounded-sm border border-border bg-background/90 px-3 py-2 text-muted-foreground backdrop-blur-sm hover:bg-rm-gray-1 hover:text-foreground lg:hidden"
          >
            <FileText className="h-4 w-4" />
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
              Артефакты · {artifacts.length}
            </span>
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 bg-[var(--rm-yellow-100)] transition-[width] duration-500 ease-out"
              style={{ width: `${artifactsScore ?? 0}%` }}
            />
          </button>
        )}
        {scenariosToShow && scenariosToShow.length > 0 ? (
          <ScenarioPicker scenarios={scenariosToShow} onPick={pickScenario} />
        ) : showModePicker ? (
          <ModePicker onPick={pickMode} />
        ) : showHitlConfirm ? (
          <HitlConfirmPicker
            onConfirm={hitlConfirmRevision}
            onReject={hitlRejectEcho}
          />
        ) : showHitl ? (
          hitlRevising ? (
            <HitlReviseInput
              onSubmit={hitlSubmitRevision}
              onCancel={hitlCancelRevise}
            />
          ) : (
            <HitlPicker
              onAccept={hitlAccept}
              onRequestChanges={hitlStartRevise}
            />
          )
        ) : (
          <ChatInput
            onSend={sendUserMessage}
            disabled={isSending}
            placeholder={`Сообщение для ${expert.name}…`}
            files={attached.files}
            onFilesAdd={attached.addFiles}
            onFileRemove={attached.removeFile}
          />
        )}
      </div>
      <FilePreviewDialog
        file={previewAttachment}
        onOpenChange={(open) => !open && setPreviewAttachment(null)}
      />
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
          ? "border-[var(--rm-yellow-100)] bg-background text-foreground hover:bg-rm-gray-1"
          : "border-border bg-background/80 backdrop-blur-sm text-foreground hover:border-foreground"
      }`}
    >
      <Sparkles
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
          isPrimary
            ? "text-[var(--rm-yellow-100)]"
            : "text-[var(--rm-yellow-100)] opacity-60 group-hover:opacity-100 transition-opacity"
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
          <span className="mt-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-100)]">
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
            className="group flex items-start gap-2.5 rounded-sm border border-[var(--rm-yellow-100)] bg-background px-3.5 py-3 text-left text-foreground transition-opacity hover:opacity-90"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-100)]" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)]">Глубокая работа</span>
              <span className="text-[length:var(--text-12)] opacity-80">
                Несколько итераций с самопроверкой — точнее, 10–15 минут
              </span>
              <span className="mt-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-100)]">
                Рекомендую
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onPick("fast")}
            className="group flex items-start gap-2.5 rounded-sm border border-border bg-background/80 backdrop-blur-sm px-3.5 py-3 text-left transition-colors hover:border-foreground"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-100)] opacity-60 group-hover:opacity-100 transition-opacity" />
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
            className="group flex items-start gap-2.5 rounded-sm border border-[var(--rm-yellow-100)] bg-background px-3.5 py-3 text-left text-foreground transition-opacity hover:opacity-90"
          >
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-100)]" />
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

function HitlReviseInput({
  onSubmit,
  onCancel,
}: {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  }

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm px-3.5 py-4">
      <div className="mx-auto max-w-2xl space-y-2">
        {/* Активный вариант кнопки «Дать правки» — подсвечен как выбранный */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-sm border border-[var(--rm-yellow-100)] bg-background px-3 py-2 text-foreground">
            <RotateCw className="h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-100)]" />
            <span className="text-[length:var(--text-14)]">Дать правки</span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Отмена
          </button>
        </div>
        <div className="relative rounded-sm border-2 border-border bg-background/80 backdrop-blur-sm transition-colors focus-within:border-ring">
          <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />
          <Textarea
            ref={textareaRef}
            variant="chat"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Опишите, что поправить в артефакте…"
            className="border-0 bg-transparent pr-12 focus-visible:ring-0 focus-visible:border-0"
            rows={1}
          />
          <Button
            size="icon"
            variant={value.trim() ? "default" : "ghost"}
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="absolute right-2 bottom-2"
            aria-label="Отправить правки"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="size-6">
              <path
                d="M12.0468 4.58813L5 11.6131M12.0468 4.58813L12.0468 19.4117M12.0468 4.58813L19 11.6131"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

function HitlConfirmPicker({
  onConfirm,
  onReject,
}: {
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm px-3.5 py-4">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
          Подтвердите трактовку правок
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            className="group flex items-start gap-2.5 rounded-sm border border-[var(--rm-yellow-100)] bg-background px-3.5 py-3 text-left text-foreground transition-opacity hover:opacity-90"
          >
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-100)]" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)]">Да, всё верно</span>
              <span className="text-[length:var(--text-12)] opacity-80">
                Запустить новый цикл с учётом правок
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={onReject}
            className="group flex items-start gap-2.5 rounded-sm border border-border bg-background/80 backdrop-blur-sm px-3.5 py-3 text-left transition-colors hover:border-foreground"
          >
            <RotateCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)] text-foreground">
                Нет, уточню ещё
              </span>
              <span className="text-[length:var(--text-12)] text-muted-foreground">
                Вернуться к полю ввода правок
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function hasFilesInDrag(e: React.DragEvent): boolean {
  return Array.from(e.dataTransfer?.types ?? []).includes("Files");
}

function mockReplyTo(expert: Expert, _userText: string): string {
  return `Принято. Продолжаю работу (мок-ответ от ${expert.name}).`;
}
