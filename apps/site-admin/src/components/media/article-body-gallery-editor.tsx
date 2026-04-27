"use client";

import { useRef, useState } from "react";
import {
  Captions,
  FilmIcon,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Input, VideoPlayer } from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import type { ArticleGalleryItem } from "@/lib/types";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/svg+xml,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,video/ogg";
const MEDIA_ACCEPT = `${IMAGE_ACCEPT},${VIDEO_ACCEPT}`;

function detectKind(mime: string): "image" | "video" {
  return mime.startsWith("video/") ? "video" : "image";
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

async function uploadMedia(
  articleSlug: string,
  file: File,
): Promise<{ url: string; fileName: string; kind: "image" | "video" }> {
  const kind = detectKind(file.type);
  const uploadKind = kind === "video" ? "video" : "preview";
  const dataUrl = await readAsDataUrl(file);
  const res = await apiFetch(`/api/articles/${articleSlug}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: uploadKind, dataUrl, fileName: file.name }),
  });
  if (!res.ok) {
    let err = "upload failed";
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) err = j.error;
    } catch {}
    throw new Error(err);
  }
  const json = (await res.json()) as { url: string; fileName: string };
  return { ...json, kind };
}

function newItemId(): string {
  return `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

interface Props {
  articleSlug: string;
  items: ArticleGalleryItem[];
  onChange: (next: ArticleGalleryItem[]) => void;
}

export function ArticleBodyGalleryEditor({
  articleSlug,
  items,
  onChange,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const activeItem =
    items.find((it) => it.id === activeId) ?? items[0] ?? null;

  function updateItem(id: string, patch: Partial<ArticleGalleryItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function addItem() {
    const item: ArticleGalleryItem = {
      id: newItemId(),
      title: `Таб ${items.length + 1}`,
      src: "",
      kind: "image",
    };
    onChange([...items, item]);
    setActiveId(item.id);
  }

  function removeItem(id: string) {
    const idx = items.findIndex((it) => it.id === id);
    if (idx < 0) return;
    const next = items.filter((it) => it.id !== id);
    onChange(next);
    if (activeId === id) {
      const fallback = next[idx] ?? next[idx - 1] ?? next[0] ?? null;
      setActiveId(fallback?.id ?? null);
    }
  }

  function moveItem(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= items.length) return;
    const arr = [...items];
    const [m] = arr.splice(from, 1);
    arr.splice(Math.min(to, arr.length), 0, m);
    onChange(arr);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-4 py-6 text-center">
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Галерея пуста. Добавьте первый таб — можно загружать изображения или видео.
        </p>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-[length:var(--text-12)] font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить таб
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Превью — тёмные табы + активное изображение */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 overflow-x-auto rounded-[4px] border border-[#404040] bg-[#1A1A1A] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((it) => {
            const isActive = activeItem?.id === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setActiveId(it.id)}
                className={
                  "flex h-8 shrink-0 items-center justify-center rounded-[4px] px-3 py-1 font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] text-[length:var(--text-12)] leading-[1.2] whitespace-nowrap transition-colors " +
                  (isActive
                    ? "border border-[#404040] bg-[#0A0A0A] text-[#F0F0F0]"
                    : "border border-transparent text-[#939393] hover:text-[#F0F0F0]")
                }
              >
                {it.title || "Без названия"}
              </button>
            );
          })}
        </div>
        {activeItem?.src ? (
          activeItem.kind === "video" ? (
            <div className="max-h-[480px] overflow-hidden rounded-[4px]">
              <VideoPlayer src={activeItem.src} />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[4px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className="block h-auto max-h-[480px] w-full object-contain bg-[color:var(--rm-gray-1)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black/20"
              />
            </div>
          )
        ) : (
          <div className="flex items-center justify-center rounded-[4px] border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-4 py-10 text-center text-[length:var(--text-12)] text-muted-foreground">
            У активного таба ещё нет медиа — загрузите изображение или видео в списке ниже.
          </div>
        )}
        {activeItem?.caption && activeItem.caption.trim() && (
          <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
            {activeItem.caption}
          </p>
        )}
      </div>

      {/* Список табов — редактирование заголовка, upload, reorder, delete */}
      <div className="flex flex-col gap-2">
        {items.map((it, idx) => (
          <GalleryRow
            key={it.id}
            articleSlug={articleSlug}
            item={it}
            isActive={activeItem?.id === it.id}
            onSelect={() => setActiveId(it.id)}
            onChange={(patch) => updateItem(it.id, patch)}
            onRemove={() => removeItem(it.id)}
            canMoveUp={idx > 0}
            canMoveDown={idx < items.length - 1}
            onMoveUp={() => moveItem(idx, idx - 1)}
            onMoveDown={() => moveItem(idx, idx + 1)}
          />
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background px-3 py-1.5 text-[length:var(--text-12)] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить таб
        </button>
      </div>
    </div>
  );
}

interface RowProps {
  articleSlug: string;
  item: ArticleGalleryItem;
  isActive: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ArticleGalleryItem>) => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function GalleryRow({
  articleSlug,
  item,
  isActive,
  onSelect,
  onChange,
  onRemove,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: RowProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasCaption = Boolean(item.caption && item.caption.length > 0);
  // Caption-инпут показывается когда подпись уже задана либо юзер нажал «+ Подпись».
  const [captionOpen, setCaptionOpen] = useState(hasCaption);
  const showCaption = captionOpen || hasCaption;

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { url, kind } = await uploadMedia(articleSlug, file);
      onChange({ src: url, kind });
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onClick={onSelect}
      className={
        "flex flex-col gap-1.5 rounded-sm border p-2 transition-colors cursor-pointer " +
        (isActive
          ? "border-[color:var(--rm-violet-100)] bg-[color:var(--rm-violet-900)]/40"
          : "border-border bg-background hover:bg-muted/40")
      }
    >
      <div className="flex items-center gap-2">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          aria-label="Вверх"
          disabled={!canMoveUp}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="flex h-3 w-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <GripVertical className="h-3 w-3 rotate-90" />
        </button>
        <button
          type="button"
          aria-label="Вниз"
          disabled={!canMoveDown}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="flex h-3 w-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <GripVertical className="h-3 w-3 -rotate-90" />
        </button>
      </div>

      {item.src ? (
        item.kind === "video" ? (
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-sm border border-border bg-black">
            <video
              src={item.src}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
              <FilmIcon className="h-3.5 w-3.5 text-[#F0F0F0]" />
            </div>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.src}
            alt={item.title}
            className="h-10 w-14 shrink-0 rounded-sm border border-border object-cover"
          />
        )
      ) : (
        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 text-muted-foreground">
          <ImagePlus className="h-4 w-4" />
        </div>
      )}

      <Input
        value={item.title}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Название таба"
        className="h-7 flex-1 text-[length:var(--text-12)]"
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        disabled={uploading}
        className="flex shrink-0 items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-11)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Upload className="h-3 w-3" />
        )}
        {item.src ? "Заменить" : "Загрузить"}
      </button>

      {!showCaption && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCaptionOpen(true);
          }}
          aria-label="Добавить подпись"
          title="Добавить подпись"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Captions className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Удалить таб"
        title="Удалить"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={MEDIA_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      </div>

      {showCaption && (
        <div className="flex items-center gap-2 pl-6">
          <Captions className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Input
            value={item.caption ?? ""}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Подпись под изображением"
            className="h-7 flex-1 text-[length:var(--text-12)]"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ caption: "" });
              setCaptionOpen(false);
            }}
            aria-label="Убрать подпись"
            title="Убрать подпись"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-[length:var(--text-11)] text-[#ED4843]">{error}</p>
      )}
    </div>
  );
}
