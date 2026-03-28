"use client";

import { useRef, useState } from "react";
import { Button, Textarea, GlowingEffect } from "@rocketmind/ui";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="px-3.5 pb-3.5">
      <div className="mx-auto max-w-2xl">
        <div className="relative rounded-sm border-2 border-border bg-background/80 backdrop-blur-sm transition-colors focus-within:border-ring">
          <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />
          <Textarea
            ref={textareaRef}
            variant="chat"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            disabled={disabled}
            className="border-0 bg-transparent pr-12 focus-visible:ring-0 focus-visible:border-0"
            rows={1}
          />
          <Button
            size="icon"
            variant={value.trim() ? "default" : "ghost"}
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="absolute right-2 bottom-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="size-6"
            >
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
