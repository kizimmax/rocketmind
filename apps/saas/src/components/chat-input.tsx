"use client";

import { useRef, useState } from "react";
import { FileText, Paperclip, X } from "lucide-react";
import { Button, Textarea, GlowingEffect } from "@rocketmind/ui";
import type { AttachedFile } from "@/lib/types";
import { FilePreviewDialog } from "./file-preview-dialog";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  files?: AttachedFile[];
  onFilesAdd?: (files: File[]) => void;
  onFileRemove?: (id: string) => void;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder,
  files,
  onFilesAdd,
  onFileRemove,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFiles = !!files && files.length > 0;
  const canSend = (value.trim().length > 0 || hasFiles) && !disabled;

  function handleSubmit() {
    if (!canSend) return;
    onSend(value.trim());
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

  function handlePickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length > 0) onFilesAdd?.(picked);
    // reset, чтобы повторный выбор того же файла триггерил change
    e.target.value = "";
  }

  return (
    <div className="px-3.5 pb-3.5">
      <div className="mx-auto max-w-2xl">
        <div className="relative rounded-sm border-2 border-border bg-background/80 backdrop-blur-sm transition-colors has-[textarea:focus]:border-ring">
          <GlowingEffect variant="yellow" borderWidth={2} disabled={false} />

          {hasFiles && (
            <div className="flex flex-wrap gap-1.5 border-b border-border px-3 py-2">
              {files!.map((f) => (
                <AttachedFileChip
                  key={f.id}
                  file={f}
                  onPreview={() => setPreviewFile(f)}
                  onRemove={() => onFileRemove?.(f.id)}
                />
              ))}
            </div>
          )}

          <div className="relative">
            <Textarea
              ref={textareaRef}
              variant="chat"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder ?? "Введите сообщение..."}
              disabled={disabled}
              className="border-0 bg-transparent pl-12 pr-12 focus-visible:ring-0 focus-visible:border-0"
              rows={1}
            />

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handlePickFiles}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center border-0 bg-transparent text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              aria-label="Прикрепить файл"
              title="Прикрепить файл"
            >
              <Paperclip className="size-5" />
            </button>

            <Button
              size="icon"
              variant={canSend ? "default" : "ghost"}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSubmit}
              disabled={!canSend}
              className="absolute right-2 bottom-2"
              aria-label="Отправить"
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
      <FilePreviewDialog
        file={previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      />
    </div>
  );
}

function AttachedFileChip({
  file,
  onPreview,
  onRemove,
}: {
  file: AttachedFile;
  onPreview: () => void;
  onRemove: () => void;
}) {
  const isLoading = file.progress < 100;
  const meta = isLoading ? `${file.progress}%` : formatSize(file.size);
  return (
    <button
      type="button"
      onClick={onPreview}
      className="group relative flex min-w-0 max-w-[220px] items-center gap-2 overflow-hidden rounded-sm bg-rm-gray-1 px-2 py-1.5 text-left transition-colors hover:bg-rm-gray-2"
    >
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <p className="min-w-0 flex-1 truncate text-[length:var(--text-12)] font-medium text-foreground">
        {file.name}
      </p>
      <span className="relative shrink-0">
        <span className="text-[length:var(--text-12)] text-muted-foreground group-hover:invisible">
          {meta}
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
          className="absolute inset-0 hidden items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground group-hover:flex"
          aria-label={`Удалить ${file.name}`}
          title="Удалить"
        >
          <X className="h-3.5 w-3.5" />
        </span>
      </span>
      {isLoading && (
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-0.5 bg-[var(--rm-yellow-100)] transition-[width] duration-200 ease-out"
          style={{ width: `${file.progress}%` }}
        />
      )}
    </button>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}
