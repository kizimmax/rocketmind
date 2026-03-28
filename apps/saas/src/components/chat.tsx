"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useMessages } from "@/lib/hooks";
import { MessageBubble } from "./message";
import { ChatInput } from "./chat-input";
import { DotGridLens } from "./dot-grid-lens";
import type { Agent } from "@/lib/types";
import { getInitials } from "@/lib/utils";

interface ChatProps {
  caseId: string;
  agent: Agent;
}

export function Chat({ caseId, agent }: ChatProps) {
  const { messages, sendMessage, isSending, streamingMsgId } = useMessages(caseId, agent.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Re-scroll when virtual keyboard opens/closes (viewport resize)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function onResize() {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }

    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Dot grid background */}
      <DotGridLens
        gridGap={10}
        baseRadius={0.75}
        maxScale={2.8}
        lensRadius={100}
        className="pointer-events-auto absolute inset-0 z-0"
      />

      {/* Messages area */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyChat
            agent={agent}
            onSuggestionClick={(text) => sendMessage(text)}
          />
        ) : (
          <div className="mx-auto max-w-2xl space-y-4 px-4 py-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                agent={agent}
                isNew={msg.id === streamingMsgId}
              />
            ))}
            {isSending && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Floating input */}
      <div className="relative z-10">
        <ChatInput onSend={sendMessage} disabled={isSending} />
      </div>
    </div>
  );
}

function EmptyChat({
  agent,
  onSuggestionClick,
}: {
  agent: Agent;
  onSuggestionClick: (text: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12">
      {/* Mascot — no border, no ring */}
      <div className="mb-4 h-24 w-24 overflow-hidden rounded-full">
        {agent.avatar_url ? (
          <Image
            src={agent.avatar_url}
            alt={agent.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold text-muted-foreground">
            {getInitials(agent.name)}
          </span>
        )}
      </div>

      {/* Greeting */}
      <h3 className="mb-1 font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase">
        {agent.name}
      </h3>
      <p className="mb-2 max-w-sm text-center text-[length:var(--text-14)] text-muted-foreground">
        {agent.greeting ?? agent.description}
      </p>

      {/* Suggestions */}
      {agent.suggestions && agent.suggestions.length > 0 && (
        <div className="mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2">
          {agent.suggestions.map((text) => (
            <button
              key={text}
              onClick={() => onSuggestionClick(text)}
              className="group flex items-start gap-2.5 rounded-sm border border-border bg-background/80 backdrop-blur-sm px-3.5 py-3 text-left text-[length:var(--text-14)] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)] opacity-60 group-hover:opacity-100 transition-opacity" />
              <span>{text}</span>
            </button>
          ))}
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
