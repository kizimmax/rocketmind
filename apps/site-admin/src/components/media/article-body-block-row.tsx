"use client";

import { useRef, useState } from "react";
import {
  FilmIcon,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Input, VideoPlayer } from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import type {
  ArticleBodyBlock,
  ArticleBodyBlockType,
  ArticleGalleryItem,
} from "@/lib/types";
import { ArticleBodyGalleryEditor } from "./article-body-gallery-editor";
import { ArticleBodyTextarea } from "./article-body-textarea";
import { BlockTypeMenu } from "./block-type-menu";
import { detectListMode } from "./list-helpers";

type DropPosition = "before" | "after";

interface Props {
  /** Slug статьи — нужен для загрузки изображений в image-блок. */
  articleSlug: string;
  block: ArticleBodyBlock;
  index: number;
  onChangeText: (text: string) => void;
  /** Для блоков с не-text shape (image): патчит произвольные поля data. */
  onChangeData: (patch: Record<string, unknown>) => void;
  onChangeType: (type: ArticleBodyBlockType) => void;
  onSplit: (before: string, after: string) => void;
  onDeleteEmpty: () => void;
  onInsertAfter: (type: ArticleBodyBlockType) => void;
  onRemove: () => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOverRow: (index: number, position: DropPosition) => void;
  onDropRow: () => void;
  isDragging: boolean;
  dropIndicator: DropPosition | null;
  focus?: { nonce: number; position: "start" | "end" };
}

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/svg+xml,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,video/ogg";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

async function uploadImage(
  articleSlug: string,
  file: File,
): Promise<{ url: string; fileName: string }> {
  // Используем тот же upload-эндпоинт, что и aside-превью (kind="preview"):
  // он принимает image/* и складывает в /media/uploads/<slug>/<hash>.<ext>.
  const dataUrl = await readAsDataUrl(file);
  const res = await apiFetch(`/api/articles/${articleSlug}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "preview", dataUrl, fileName: file.name }),
  });
  if (!res.ok) {
    let err = "upload failed";
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) err = j.error;
    } catch {}
    throw new Error(err);
  }
  return (await res.json()) as { url: string; fileName: string };
}

async function uploadVideo(
  articleSlug: string,
  file: File,
): Promise<{ url: string; fileName: string }> {
  const dataUrl = await readAsDataUrl(file);
  const res = await apiFetch(`/api/articles/${articleSlug}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "video", dataUrl, fileName: file.name }),
  });
  if (!res.ok) {
    let err = "upload failed";
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) err = j.error;
    } catch {}
    throw new Error(err);
  }
  return (await res.json()) as { url: string; fileName: string };
}

const TEXT_CLASS: Record<ArticleBodyBlockType, string> = {
  h2: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] text-[length:var(--text-24)] leading-[1.12]",
  h3: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] text-[length:var(--text-20)] leading-[1.16]",
  h4: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] text-[length:var(--text-16)] leading-[1.2]",
  paragraph: "text-[length:var(--text-14)] leading-[1.5]",
  quote:
    "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] text-[length:var(--text-18)] leading-[1.2] border-l-2 border-[#FFCC00] pl-4",
  image: "",
  gallery: "",
  video: "",
  list: "",
  callout: "",
};

const PLACEHOLDER: Record<ArticleBodyBlockType, string> = {
  h2: "Заголовок секции",
  h3: "Подзаголовок",
  h4: "Под-подзаголовок",
  paragraph: "Текст абзаца. Поддерживается markdown: **жирный**, *курсив*, [ссылка](url).",
  quote: "Короткий тезис",
  image: "",
  gallery: "",
  video: "",
  list: "",
  callout: "",
};

export function ArticleBodyBlockRow({
  articleSlug,
  block,
  index,
  onChangeText,
  onChangeData,
  onChangeType,
  onSplit,
  onDeleteEmpty,
  onInsertAfter,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOverRow,
  onDropRow,
  isDragging,
  dropIndicator,
  focus,
}: Props) {
  const [insertMenuOpen, setInsertMenuOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const [draggable, setDraggable] = useState(false);

  const text = typeof block.data?.text === "string" ? block.data.text : "";
  const baseTextClass = TEXT_CLASS[block.type];
  // Режим списка у параграфа — gap между строк 12px на всех адаптивах
  // (font-size 14px + 12px gap = line-height 26px).
  const isListParagraph =
    block.type === "paragraph" && detectListMode(text) !== "none";
  const textClass = isListParagraph
    ? "text-[length:var(--text-14)] leading-[26px]"
    : baseTextClass;
  const placeholder = PLACEHOLDER[block.type];

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    const midpoint = rect.top + rect.height / 2;
    const position: DropPosition = e.clientY < midpoint ? "before" : "after";
    onDragOverRow(index, position);
  }

  return (
    <div
      ref={rowRef}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
        onDragStart(index);
      }}
      onDragEnd={() => {
        setDraggable(false);
        onDragEnd();
      }}
      onDragOver={handleDragOver}
      onDrop={(e) => {
        e.preventDefault();
        onDropRow();
      }}
      className={`group/row relative flex items-start gap-1 py-1 pl-12 pr-2 transition-opacity ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {dropIndicator === "before" && (
        <div className="pointer-events-none absolute left-12 right-2 top-0 h-0.5 rounded-sm bg-[var(--rm-violet-100)]" />
      )}
      {dropIndicator === "after" && (
        <div className="pointer-events-none absolute left-12 right-2 bottom-0 h-0.5 rounded-sm bg-[var(--rm-violet-100)]" />
      )}

      {/* Left gutter — appears on hover */}
      <div
        className={`absolute left-0 top-1 flex items-center gap-0.5 transition-opacity ${
          insertMenuOpen ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
        }`}
      >
        <BlockTypeMenu
          open={insertMenuOpen}
          onOpenChange={setInsertMenuOpen}
          onSelect={(t) => {
            onInsertAfter(t);
            setInsertMenuOpen(false);
          }}
        >
          <button
            type="button"
            aria-label="Добавить блок ниже"
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </BlockTypeMenu>
        <button
          type="button"
          aria-label="Перетащить блок"
          title="Перетащить"
          onMouseDown={() => setDraggable(true)}
          onMouseUp={() => setDraggable(false)}
          className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        {block.type === "image" ? (
          <ImageBlockRowBody
            articleSlug={articleSlug}
            src={typeof block.data?.src === "string" ? block.data.src : ""}
            caption={
              typeof block.data?.caption === "string" ? block.data.caption : ""
            }
            onChange={onChangeData}
          />
        ) : block.type === "gallery" ? (
          <ArticleBodyGalleryEditor
            articleSlug={articleSlug}
            items={
              Array.isArray(block.data?.items)
                ? (block.data.items as ArticleGalleryItem[])
                : []
            }
            onChange={(items) => onChangeData({ items })}
          />
        ) : block.type === "video" ? (
          <VideoBlockRowBody
            articleSlug={articleSlug}
            src={typeof block.data?.src === "string" ? block.data.src : ""}
            caption={
              typeof block.data?.caption === "string" ? block.data.caption : ""
            }
            onChange={onChangeData}
          />
        ) : (
          <ArticleBodyTextarea
            value={text}
            onChange={onChangeText}
            onChangeType={onChangeType}
            onSplit={onSplit}
            onDeleteEmpty={onDeleteEmpty}
            blockType={block.type}
            placeholder={placeholder}
            textClassName={textClass}
            focus={focus}
          />
        )}
      </div>

      {/* Delete (right, on hover) — интуитивно и аналогично другим редакторам админки */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Удалить блок"
        title="Удалить"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-0 transition-all hover:bg-[#ED4843]/10 hover:text-[#ED4843] group-hover/row:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/**
 * Тело строки image-блока в админке.
 *  - Если изображение ещё не загружено: dropzone-кнопка с file-input.
 *  - Если загружено: превью + инпут подписи + кнопка «Заменить».
 * Загрузка использует общий /api/articles/<slug>/uploads (kind=preview).
 */
function ImageBlockRowBody({
  articleSlug,
  src,
  caption,
  onChange,
}: {
  articleSlug: string;
  src: string;
  caption: string;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadImage(articleSlug, file);
      onChange({ src: url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {src ? (
        <>
          {/* Превью загруженного изображения. object-contain + max-h —
              чтобы в админке не распирало строку гигантской картинкой. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={caption || ""}
            className="block h-auto w-full max-h-[320px] rounded-sm border border-border bg-[color:var(--rm-gray-1)] object-contain"
          />
          <div className="flex items-center gap-2">
            <Input
              value={caption}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="Подпись (опционально, не отображается если пустая)"
              className="h-7 flex-1 text-[length:var(--text-12)]"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex shrink-0 items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-11)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
              Заменить
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-4 py-6 text-[length:var(--text-12)] text-muted-foreground transition-colors hover:bg-[color:var(--rm-gray-1)]/60 hover:text-foreground disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Загрузка…" : "Загрузить изображение"}
        </button>
      )}
      {error && (
        <p className="text-[length:var(--text-11)] text-[#ED4843]">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/**
 * Тело строки video-блока в админке.
 *  - Если видео не загружено: dropzone-кнопка.
 *  - Если загружено: VideoPlayer-превью + инпут подписи + кнопка «Заменить».
 * Ограничение — 50MB, форматы mp4/webm/mov/ogg.
 */
function VideoBlockRowBody({
  articleSlug,
  src,
  caption,
  onChange,
}: {
  articleSlug: string;
  src: string;
  caption: string;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadVideo(articleSlug, file);
      onChange({ src: url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {src ? (
        <>
          <div className="max-h-[360px] overflow-hidden rounded-sm">
            <VideoPlayer src={src} />
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={caption}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="Подпись (опционально, не отображается если пустая)"
              className="h-7 flex-1 text-[length:var(--text-12)]"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex shrink-0 items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-11)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
              Заменить
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-4 py-6 text-[length:var(--text-12)] text-muted-foreground transition-colors hover:bg-[color:var(--rm-gray-1)]/60 hover:text-foreground disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FilmIcon className="h-4 w-4" />
          )}
          {uploading ? "Загрузка…" : "Загрузить видео (mp4, webm, mov, до 50MB)"}
        </button>
      )}
      {error && (
        <p className="text-[length:var(--text-11)] text-[#ED4843]">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={VIDEO_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
