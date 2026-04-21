"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  GripVertical,
  ArrowUpRight,
  ImagePlus,
  Upload,
  Trash2,
  Play,
  Pause,
  Plus,
  X,
} from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";
import { useItemDnd } from "@/lib/use-item-dnd";

interface HeroImageEditorProps {
  data: Record<string, unknown>;
  hasExperts: boolean;
  onUpdate: (data: Record<string, unknown>) => void;
}

// ── Audio Player Controls ──────────────────────────────────────────────────

function AudioControls({
  audioData,
  audioFilename,
  onUpload,
  onDelete,
}: {
  audioData?: string;
  audioFilename?: string;
  onUpload: (data: string, filename: string) => void;
  onDelete: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play();
    setPlaying(!playing);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnd = () => { setPlaying(false); setProgress(0); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audioData]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string, file.name);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (!audioData) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-[4px] border border-dashed border-[#404040] bg-[#121212] px-4 py-2 text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
        >
          <Upload className="h-4 w-4" />
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase tracking-[0.02em]">
            Загрузить аудио
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Play/Pause + progress bar */}
      <div className="relative flex items-center gap-2 self-start rounded-[4px] border border-[#404040] bg-[#121212] px-4 py-[14px] h-12 overflow-hidden min-w-[200px]">
        <button type="button" onClick={toggle} className="shrink-0 cursor-pointer">
          {playing ? (
            <Pause className="h-4 w-4 text-[#F0F0F0]" fill="#F0F0F0" />
          ) : (
            <Play className="h-4 w-4 text-[#F0F0F0]" fill="#F0F0F0" />
          )}
        </button>
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] font-medium text-[#939393] truncate">
          {audioFilename || "audio"}
        </span>
        <div
          className="absolute bottom-0 left-0 h-1 bg-[#FFCC00] transition-[width] duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={audioRef} src={audioData} preload="metadata" />
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="flex h-8 w-8 items-center justify-center rounded-sm text-[#939393] transition-colors hover:bg-[#1a1a1a] hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Re-upload */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-8 w-8 items-center justify-center rounded-sm text-[#939393] transition-colors hover:bg-[#1a1a1a] hover:text-[#FFCC00]"
      >
        <Upload className="h-4 w-4" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

// ── Hero Image Upload ──────────────────────────────────────────────────────

function HeroImageUpload({
  imageData,
  onUpload,
  onDelete,
}: {
  imageData?: string;
  onUpload: (data: string) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (!imageData) {
    return (
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute top-0 right-0 w-[60%] h-full flex flex-col items-center justify-center gap-2 border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00] rounded-sm"
      >
        <ImagePlus className="h-10 w-10" />
        <span className="text-[length:var(--text-14)] font-medium">Фоновое изображение</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </button>
    );
  }

  return (
    <>
      <div
        className="absolute top-0 right-0 w-[60%] h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imageData})` }}
      />
      <div
        className="absolute top-0 right-0 w-[60%] h-full z-[1]"
        style={{
          background:
            "linear-gradient(-90deg, rgba(10,10,10,0) 34%, rgba(10,10,10,0.86) 71%, rgba(10,10,10,1) 100%)",
        }}
      />
      {/* Image controls overlay */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-8 items-center gap-1.5 rounded-sm bg-[#1a1a1a]/80 px-2.5 text-[#F0F0F0] backdrop-blur transition-colors hover:bg-[#1a1a1a]"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="text-[length:var(--text-12)]">Заменить</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur transition-colors hover:bg-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}

// ── Tag Editor ─────────────────────────────────────────────────────────────

function TagBadge({
  text,
  onUpdate,
  onDelete,
}: {
  text: string;
  onUpdate: (text: string) => void;
  onDelete: () => void;
}) {
  return (
    <span className="group/tag relative inline-flex items-center gap-2.5 rounded-[4px] border border-[#404040] bg-[#121212] px-2.5 py-1 h-7">
      <InlineEdit value={text} onSave={onUpdate} placeholder="тег">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#939393]">
          {text || "тег"}
        </span>
      </InlineEdit>
      <button
        type="button"
        onClick={onDelete}
        className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#404040] text-[#F0F0F0] opacity-0 transition-opacity group-hover/tag:opacity-100 hover:bg-destructive"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

// ── Factoid Card ───────────────────────────────────────────────────────────

function FactoidCardEditor({
  factoid,
  index,
  count,
  dndProps,
  onGripDown,
  onGripUp,
  onMove,
  onUpdate,
}: {
  factoid: { number: string; label: string; text: string };
  index: number;
  count: number;
  dndProps: ReturnType<ReturnType<typeof useItemDnd>["itemProps"]>;
  onGripDown: () => void;
  onGripUp: () => void;
  onMove: (from: number, dir: "up" | "down") => void;
  onUpdate: (field: string, value: string) => void;
}) {
  return (
    <div
      draggable={dndProps.draggable}
      onDragStart={dndProps.onDragStart}
      onDragOver={dndProps.onDragOver}
      onDrop={dndProps.onDrop}
      onDragEnd={dndProps.onDragEnd}
      className={`group/fact relative flex flex-1 flex-col justify-between border-t border-l border-[#404040] p-5 lg:p-7 min-w-0 ${
        dndProps.isDragging ? "opacity-60" : ""
      }`}
    >
      {/* Drag handle */}
      <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/fact:opacity-100">
        <div
          className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
          onMouseDown={onGripDown}
          onMouseUp={onGripUp}
        >
          <GripVertical className="h-2.5 w-2.5" />
        </div>
        <ItemMoveButtons index={index} count={count} onMove={onMove} />
      </div>

      {/* Number + label */}
      <div className="flex items-center gap-5">
        <InlineEdit
          value={factoid.number}
          onSave={(v) => onUpdate("number", v)}
          placeholder="600+"
        >
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] shrink-0">
            {factoid.number || "—"}
          </span>
        </InlineEdit>

        <InlineEdit
          value={factoid.label}
          onSave={(v) => onUpdate("label", v)}
          placeholder="кейсов платформ"
        >
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0] max-w-[148px]">
            {factoid.label || "подпись"}
          </span>
        </InlineEdit>
      </div>

      {/* Description */}
      <InlineEdit
        value={factoid.text}
        onSave={(v) => onUpdate("text", v)}
        multiline
        placeholder="Описание фактоида"
      >
        <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393] mt-4">
          {factoid.text || "описание"}
        </p>
      </InlineEdit>
    </div>
  );
}

// ── Main Editor ────────────────────────────────────────────────────────────

export function HeroImageEditor({ data, hasExperts, onUpdate }: HeroImageEditorProps) {
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.description as string) || "",
    { uppercase: false, color: "secondary" },
  );
  const ctaText = (data.ctaText as string) || "";
  const secondaryCta = (data.secondaryCta as string) || "";
  const heroImageData = (data.heroImageData as string) || "";
  const audioData = (data.audioData as string) || "";
  const audioFilename = (data.audioFilename as string) || "";
  const tags = (data.tags as Array<{ text: string }>) || [];
  const factoids =
    (data.factoids as Array<{ number: string; label: string; text: string }>) || [];

  // Ensure exactly 3 factoids
  const normalized = [...factoids];
  while (normalized.length < 3) {
    normalized.push({ number: "", label: "", text: "" });
  }
  const displayFactoids = normalized.slice(0, 3);

  const dnd = useItemDnd(displayFactoids, (reordered) =>
    onUpdate({ factoids: reordered })
  );

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({ paragraphs: next, description: undefined });
  }

  function updateFactoid(index: number, field: string, value: string) {
    const updated = displayFactoids.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ factoids: updated });
  }

  function addTag() {
    onUpdate({ tags: [...tags, { text: "" }] });
  }

  function updateTag(index: number, text: string) {
    const updated = tags.map((t, i) => (i === index ? { text } : t));
    onUpdate({ tags: updated });
  }

  function deleteTag(index: number) {
    onUpdate({ tags: tags.filter((_, i) => i !== index) });
  }

  return (
    <div className="rounded-sm bg-[#0A0A0A]">
      {/* ── Hero image area ── */}
      <div className="relative mx-auto min-h-[600px] overflow-hidden">
        {/* Background image or upload placeholder */}
        <HeroImageUpload
          imageData={heroImageData}
          onUpload={(d) => onUpdate({ heroImageData: d })}
          onDelete={() => onUpdate({ heroImageData: "" })}
        />

        {/* Content — left side */}
        <div className="relative z-10 flex flex-col gap-11 max-w-[752px] px-5 md:px-8 xl:px-14 pb-14 pt-[120px] lg:pt-[188px]">
          {/* Caption + tags */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5 flex-wrap">
              <InlineEdit
                value={caption}
                onSave={(v) => onUpdate({ caption: v })}
                placeholder="напр. онлайн-школа"
              >
                <span className="h4 text-[#FFCC00]">
                  {caption || "caption"}
                </span>
              </InlineEdit>

              {hasExperts && (
                <span className="inline-flex items-center px-2.5 py-1 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466]">
                  Экспертный продукт
                </span>
              )}

              {tags.map((tag, i) => (
                <TagBadge
                  key={i}
                  text={tag.text}
                  onUpdate={(text) => updateTag(i, text)}
                  onDelete={() => deleteTag(i)}
                />
              ))}

              <button
                type="button"
                onClick={addTag}
                className="flex h-7 items-center gap-1 rounded-[4px] border border-dashed border-[#404040] px-2 text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
              >
                <Plus className="h-3 w-3" />
                <span className="text-[length:var(--text-12)]">тег</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                multiline
                placeholder="ЗАГОЛОВОК БЛОКА"
              >
                <h1 className="h1 whitespace-pre-line text-[#F0F0F0]">
                  {title || "ЗАГОЛОВОК"}
                </h1>
              </InlineEdit>

              <InlineEdit
                value={titleSecondary}
                onSave={(v) => onUpdate({ titleSecondary: v })}
                multiline
                placeholder="Дополнительная часть (серая)"
              >
                <span className="h1 whitespace-pre-line text-[#939393] block">
                  {titleSecondary || "доп. часть заголовка"}
                </span>
              </InlineEdit>
            </div>
          </div>

          {/* Description */}
          <ParagraphsEditor
            paragraphs={paragraphs}
            onChange={setParagraphs}
            theme="dark"
            defaults={{ uppercase: false, color: "secondary" }}
          />

          {/* Secondary CTA (audio button) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <InlineEdit
                value={secondaryCta}
                onSave={(v) => onUpdate({ secondaryCta: v })}
                placeholder="отзывы участников"
              >
                <div className="relative inline-flex items-center gap-2 self-start rounded-[4px] border border-[#404040] bg-[#121212] px-4 py-[14px] h-12">
                  <Play className="h-4 w-4 text-[#F0F0F0] shrink-0" fill="#F0F0F0" />
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.16] tracking-[0.04em] text-[#F0F0F0]">
                    {secondaryCta || "отзывы участников"}
                  </span>
                </div>
              </InlineEdit>
            </div>

            {/* Audio upload / player */}
            <AudioControls
              audioData={audioData}
              audioFilename={audioFilename}
              onUpload={(d, name) => onUpdate({ audioData: d, audioFilename: name })}
              onDelete={() => onUpdate({ audioData: "", audioFilename: "" })}
            />
          </div>
        </div>
      </div>

      {/* ── Factoids + CTA row ── */}
      <div className="flex flex-col lg:flex-row px-5 md:px-8 xl:px-14">
        {displayFactoids.map((factoid, index) => (
          <FactoidCardEditor
            key={index}
            factoid={factoid}
            index={index}
            count={displayFactoids.length}
            dndProps={dnd.itemProps(index)}
            onGripDown={() => dnd.onGripDown(index)}
            onGripUp={dnd.onGripUp}
            onMove={dnd.move}
            onUpdate={(field, value) => updateFactoid(index, field, value)}
          />
        ))}

        {/* CTA button */}
        <div className="flex flex-1 flex-col justify-between border-t border-l border-[#404040] bg-[#FFCC00] p-5 lg:p-7 lg:min-h-[189px]">
          <div className="flex w-full justify-end">
            <ArrowUpRight className="h-8 w-8 text-[#0A0A0A]" strokeWidth={3} />
          </div>
          <InlineEdit
            value={ctaText}
            onSave={(v) => onUpdate({ ctaText: v })}
            placeholder="оставить заявку"
          >
            <span className="h3 text-[#0A0A0A]">
              {ctaText || "оставить заявку"}
            </span>
          </InlineEdit>
        </div>
      </div>
    </div>
  );
}
