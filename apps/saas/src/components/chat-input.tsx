"use client";

import { useRef, useState } from "react";
import { Button, Textarea, GlowingEffect } from "@rocketmind/ui";
import { Send } from "lucide-react";

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
    <div className="px-6 pb-4 pt-2">
      <div className="mx-auto max-w-2xl">
        <div className="relative rounded-sm border border-border bg-background/80 backdrop-blur-sm">
          <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />
          <Textarea
            ref={textareaRef}
            variant="chat"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            disabled={disabled}
            className="min-h-[44px] max-h-[160px] border-0 bg-transparent pr-12 focus-visible:ring-0 focus-visible:border-0"
            rows={1}
          />
          <Button
            size="icon-sm"
            variant={value.trim() ? "default" : "ghost"}
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="absolute right-2 bottom-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
