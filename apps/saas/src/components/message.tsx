"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, GlowingEffect } from "@rocketmind/ui";
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import type { Artifact, Message, Agent } from "@/lib/types";
import { formatTime, getInitials } from "@/lib/utils";

export function MessageBubble({
  message,
  agent,
  expertThinkingAvatarUrl,
  isNew,
  isFresh,
  onRepeat,
  linkedArtifact,
  isArtifactActive,
  onArtifactSelect,
  onArtifactPreview,
  onArtifactDownload,
}: {
  message: Message;
  agent?: Agent;
  /** Аватар thinking-варианта эксперта. Подменяет agent.avatar_url при metadata.thinking=true. */
  expertThinkingAvatarUrl?: string;
  /** Включает streaming-эффект посимвольной печати. */
  isNew?: boolean;
  /** Real-time: применяет анимацию появления (slide + fade). */
  isFresh?: boolean;
  onRepeat?: () => void;
  /** Артефакт, на который ссылается сообщение (генерация/валидация/приёмка). */
  linkedArtifact?: Artifact | null;
  isArtifactActive?: boolean;
  onArtifactSelect?: (id: string) => void;
  onArtifactPreview?: (a: Artifact) => void;
  onArtifactDownload?: (a: Artifact) => void;
}) {
  switch (message.role) {
    case "user":
      return <UserMessage message={message} isFresh={isFresh} />;
    case "assistant":
      return (
        <AssistantMessage
          message={message}
          agent={agent}
          thinkingAvatarUrl={expertThinkingAvatarUrl}
          stream={isNew}
          isFresh={isFresh}
          onRepeat={onRepeat}
          linkedArtifact={linkedArtifact ?? null}
          isArtifactActive={!!isArtifactActive}
          onArtifactSelect={onArtifactSelect}
          onArtifactPreview={onArtifactPreview}
          onArtifactDownload={onArtifactDownload}
        />
      );
    case "system":
      return (
        <SystemMessage
          message={message}
          isFresh={isFresh}
          linkedArtifact={linkedArtifact ?? null}
          isArtifactActive={!!isArtifactActive}
          onArtifactSelect={onArtifactSelect}
          onArtifactPreview={onArtifactPreview}
          onArtifactDownload={onArtifactDownload}
        />
      );
  }
}

function UserMessage({ message, isFresh }: { message: Message; isFresh?: boolean }) {
  return (
    <div className={`flex justify-end ${isFresh ? "rm-message-rise" : ""}`}>
      <div className="max-w-[75%] space-y-1">
        <div className="rounded-sm bg-rm-gray-2 px-4 py-3 text-[length:var(--text-14)] text-foreground">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-right text-[length:var(--text-12)] text-muted-foreground">
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

function AssistantMessage({
  message,
  agent,
  thinkingAvatarUrl,
  stream,
  isFresh,
  onRepeat,
  linkedArtifact,
  isArtifactActive,
  onArtifactSelect,
  onArtifactPreview,
  onArtifactDownload,
}: {
  message: Message;
  agent?: Agent;
  thinkingAvatarUrl?: string;
  stream?: boolean;
  isFresh?: boolean;
  onRepeat?: () => void;
  linkedArtifact: Artifact | null;
  isArtifactActive: boolean;
  onArtifactSelect?: (id: string) => void;
  onArtifactPreview?: (a: Artifact) => void;
  onArtifactDownload?: (a: Artifact) => void;
}) {
  const [displayedText, setDisplayedText] = useState(stream ? "" : message.content);
  const [isStreaming, setIsStreaming] = useState(!!stream);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!stream) return;
    const full = message.content;
    const speed = 18;
    indexRef.current = 0;
    setDisplayedText("");
    setIsStreaming(true);

    const timer = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= full.length) {
        setDisplayedText(full);
        setIsStreaming(false);
        clearInterval(timer);
      } else {
        setDisplayedText(full.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(timer);
  }, [stream, message.content]);

  function handleCopy() {
    navigator.clipboard.writeText(message.content).then(() => {
      toast.success("Скопировано в буфер обмена");
    });
  }

  const isThinking = message.metadata?.thinking === true;
  // Если сообщение в режиме «глубокая проработка» (thinking=true) —
  // используем thinking-аватар эксперта. Fallback: обычный agent.avatar_url.
  const avatarSrc =
    isThinking && thinkingAvatarUrl ? thinkingAvatarUrl : agent?.avatar_url ?? null;

  return (
    <div className={`flex justify-start ${isFresh ? "rm-message-rise" : ""}`}>
      <div className="w-full lg:max-w-[75%] min-w-0 space-y-1">
        {agent && (
          <div className="flex items-center gap-1.5 mb-1">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-background">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={agent.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[10px] font-bold">
                  {getInitials(agent.name)}
                </span>
              )}
            </div>
            <span className="text-[length:var(--text-12)] font-medium">
              {agent.name}
            </span>
          </div>
        )}
        <div className="relative rounded-sm bg-background px-4 py-3 text-[length:var(--text-14)] text-foreground">
          <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />
          <MarkdownContent content={displayedText} />
          {isStreaming && (
            <span className="inline-block w-[2px] h-[1em] bg-foreground ml-0.5 align-text-bottom animate-blink" />
          )}
        </div>

        {linkedArtifact && !isStreaming && (
          <ChatArtifactCard
            artifact={linkedArtifact}
            isActive={isArtifactActive}
            status={message.metadata?.hitl_for_artifact_id ? "draft" : "accepted"}
            onSelect={onArtifactSelect}
            onPreview={onArtifactPreview}
            onDownload={onArtifactDownload}
          />
        )}

        {/* Bottom bar: time + actions */}
        <div className="inline-flex items-center gap-1 rounded-sm bg-background px-2 py-1">
          <span className="text-[length:var(--text-12)] text-muted-foreground pr-1">
            {formatTime(message.created_at)}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            title="Копировать"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          {onRepeat && (
            <button
              type="button"
              onClick={onRepeat}
              title="Повторить"
              className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SystemMessage({
  message,
  isFresh,
  linkedArtifact,
  isArtifactActive,
  onArtifactSelect,
  onArtifactPreview,
  onArtifactDownload,
}: {
  message: Message;
  isFresh?: boolean;
  linkedArtifact?: Artifact | null;
  isArtifactActive?: boolean;
  onArtifactSelect?: (id: string) => void;
  onArtifactPreview?: (a: Artifact) => void;
  onArtifactDownload?: (a: Artifact) => void;
}) {
  const cta = message.metadata?.cta;
  const artifactCompleted = message.metadata?.artifact_completed;

  // Специальный вариант — «артефакт принят». Если артефакт есть в данных проекта —
  // показываем полную карточку, иначе fallback на короткий пилл.
  if (artifactCompleted) {
    if (linkedArtifact) {
      return (
        <div className={`flex justify-center ${isFresh ? "rm-message-rise" : ""}`}>
          <ChatArtifactCard
            artifact={linkedArtifact}
            isActive={!!isArtifactActive}
            status="accepted"
            onSelect={onArtifactSelect}
            onPreview={onArtifactPreview}
            onDownload={onArtifactDownload}
          />
        </div>
      );
    }
    return (
      <div className={`flex justify-center ${isFresh ? "rm-message-rise" : ""}`}>
        <div className="inline-flex items-center gap-2 rounded-sm border border-[var(--rm-yellow-700)] bg-[var(--rm-yellow-900)] px-3 py-2 text-[length:var(--text-12)] text-[var(--rm-yellow-fg-subtle)]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em]">
            {message.content}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${isFresh ? "rm-message-rise" : ""}`}>
      <div className="max-w-[85%] space-y-2 rounded-sm border border-border bg-rm-gray-1 px-4 py-3 text-center">
        <p className="text-[length:var(--text-14)] text-foreground">
          {message.content}
        </p>
        {cta && (
          <Button
            size="sm"
            onClick={() => window.open(cta.url, "_blank", "noopener")}
          >
            {cta.label}
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <pre
          key={`code-${i}`}
          className="my-2 overflow-x-auto rounded-sm bg-rm-gray-2 px-3 py-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)]"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (line.trim() === "") {
      elements.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <p key={`h-${i}`} className="mt-2 mb-1 font-semibold">
          {line.slice(4)}
        </p>
      );
      i++;
      continue;
    }

    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      elements.push(
        <p key={`li-${i}`} className="ml-3">
          <InlineMarkdown text={line} />
        </p>
      );
      i++;
      continue;
    }

    if (line.includes("|") && line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div
          key={`table-${i}`}
          className="my-2 overflow-x-auto text-[length:var(--text-12)]"
        >
          <pre className="font-[family-name:var(--font-mono-family)]">
            {tableLines.join("\n")}
          </pre>
        </div>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <p
          key={`bq-${i}`}
          className="border-l-2 border-border pl-3 italic text-muted-foreground"
        >
          <InlineMarkdown text={line.slice(2)} />
        </p>
      );
      i++;
      continue;
    }

    elements.push(
      <p key={`p-${i}`}>
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <div className="space-y-1 whitespace-pre-wrap">{elements}</div>;
}

function ChatArtifactCard({
  artifact,
  isActive,
  status,
  onSelect,
  onPreview,
  onDownload,
}: {
  artifact: Artifact;
  isActive: boolean;
  status: "draft" | "accepted";
  onSelect?: (id: string) => void;
  onPreview?: (a: Artifact) => void;
  onDownload?: (a: Artifact) => void;
}) {
  const isAccepted = status === "accepted";
  return (
    <div
      onClick={() => onSelect?.(artifact.id)}
      className={`group flex w-full max-w-md cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
        isActive
          ? "border-[var(--rm-yellow-500)] bg-[var(--rm-yellow-900)]"
          : isAccepted
            ? "border-[var(--rm-yellow-700)] bg-[var(--rm-yellow-900)] hover:border-[var(--rm-yellow-500)]"
            : "border-border bg-background hover:border-foreground"
      }`}
    >
      {isAccepted ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rm-yellow-500)]" />
      ) : (
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-[family-name:var(--font-heading-family)] text-[length:var(--text-14)] font-bold uppercase leading-tight ${
            isAccepted ? "text-[var(--rm-yellow-fg-subtle)]" : "text-foreground"
          }`}
        >
          {artifact.title}
        </p>
        <p className="mt-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
          {artifact.expert_codename} · {isAccepted ? "Принят" : "Черновик"}
        </p>
        <p className="mt-1 line-clamp-2 text-[length:var(--text-12)] text-muted-foreground">
          {artifact.preview}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        {onPreview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(artifact);
            }}
            title="Пред просмотр"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
        {onDownload && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(artifact);
            }}
            title="Скачать"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-sm bg-rm-gray-2 px-1 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
}

