"use client";

import Image from "next/image";
import { Button, GlowingEffect } from "@rocketmind/ui";
import { ExternalLink } from "lucide-react";
import type { Message, Agent } from "@/lib/types";
import { formatTime, getInitials } from "@/lib/utils";

export function MessageBubble({
  message,
  agent,
}: {
  message: Message;
  agent?: Agent;
}) {
  switch (message.role) {
    case "user":
      return <UserMessage message={message} />;
    case "assistant":
      return <AssistantMessage message={message} agent={agent} />;
    case "system":
      return <SystemMessage message={message} />;
  }
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] space-y-1">
        <div className="rounded-sm bg-[var(--rm-yellow-900)] px-3 py-2 text-[length:var(--text-14)] text-foreground">
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
}: {
  message: Message;
  agent?: Agent;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[75%] space-y-1">
        {/* Agent identity above bubble */}
        {agent && (
          <div className="flex items-center gap-1.5 mb-1">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-background">
              {agent.avatar_url ? (
                <Image
                  src={agent.avatar_url}
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
        <div className="relative rounded-sm bg-background px-3 py-2 text-[length:var(--text-14)] text-foreground">
          <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />
          <MarkdownContent content={message.content} />
        </div>
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

function SystemMessage({ message }: { message: Message }) {
  const cta = message.metadata?.cta;

  return (
    <div className="flex justify-center">
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

// Simple markdown renderer (bold, italic, code, code blocks, lists, links)
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
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

    // Empty line
    if (line.trim() === "") {
      elements.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }

    // Headers (h3 only for chat context)
    if (line.startsWith("### ")) {
      elements.push(
        <p key={`h-${i}`} className="mt-2 mb-1 font-semibold">
          {line.slice(4)}
        </p>
      );
      i++;
      continue;
    }

    // List items
    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      elements.push(
        <p key={`li-${i}`} className="ml-3">
          <InlineMarkdown text={line} />
        </p>
      );
      i++;
      continue;
    }

    // Tables
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

    // Blockquote
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

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`}>
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <div className="space-y-1 whitespace-pre-wrap">{elements}</div>;
}

// Inline markdown: **bold**, *italic*, `code`
function InlineMarkdown({ text }: { text: string }) {
  // Split by inline patterns
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
