"use client";

import { useRef } from "react";
import { GripVertical, ImagePlus, ArrowUpRight, Upload, Trash2, Plus, X } from "lucide-react";
import { HeroExperts } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";
import { useItemDnd } from "@/lib/use-item-dnd";

// ── Tag badge (inline-editable, deletable) ────────────────────────────────

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

interface HeroEditorProps {
  data: Record<string, unknown>;
  hasExperts: boolean;
  experts?: Array<{ name: string; image: string | null }>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function HeroEditor({ data, hasExperts, experts = [], onUpdate }: HeroEditorProps) {
  const iconInputRef = useRef<HTMLInputElement>(null);
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.description as string) || "",
    { uppercase: false, color: "secondary" },
  );
  const ctaText = (data.ctaText as string) || "";
  const heroImageData = (data.heroImageData as string) || "";
  const tags = (data.tags as Array<{ text: string }>) || [];
  const quote = (data.quote as string) || "";
  const factoids =
    (data.factoids as Array<{ number: string; label: string; text: string }>) || [];

  // 2×2 layout (about variant) uses 4 factoids; default is 3.
  const factoidsLayout = (data.factoidsLayout as string) === "2x2" ? "2x2" : "column";
  const factoidCount = factoidsLayout === "2x2" ? 4 : 3;

  const normalized = [...factoids];
  while (normalized.length < factoidCount) {
    normalized.push({ number: "", label: "", text: "" });
  }
  const displayFactoids = normalized.slice(0, factoidCount);

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

  const showExpertsBlock = hasExperts && experts.length > 0;

  const descriptionEl = (
    <ParagraphsEditor
      paragraphs={paragraphs}
      onChange={setParagraphs}
      theme="dark"
      defaults={{ uppercase: false, color: "secondary" }}
    />
  );

  return (
    <div className="rounded-sm bg-[#0A0A0A] pb-20">
      <div className="mx-auto flex max-w-[1512px] flex-col lg:flex-row">
        {/* Left: 3-col grid matching ProductHero layout */}
        <div
          className="relative flex-1 px-5 py-10 md:px-8 xl:pl-14"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gridTemplateRows: "auto 1fr auto",
            columnGap: "24px",
            minHeight: "600px",
          }}
        >
          {/* Row 1 (top): caption + expert badge + tags + title (+ desc if expertProduct) */}
          <div className="col-span-3 row-start-1 flex flex-col gap-6 pr-10">
            {/* Caption + tags row */}
            <div className="flex items-center gap-5 flex-wrap">
              <InlineEdit
                value={caption}
                onSave={(v) => onUpdate({ caption: v })}
                placeholder="напр. консалтинг и стратегии"
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

            {/* Title */}
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

            {/* Description moves up here when expertProduct */}
            {showExpertsBlock && (
              <div className="max-w-[696px]">{descriptionEl}</div>
            )}
          </div>

          {/* Row 3 (bottom-left, col 1-2): HeroExperts OR description */}
          <div className="col-span-2 col-start-1 row-start-3 self-end pb-8 flex flex-col gap-4">
            {showExpertsBlock ? (
              <>
                <HeroExperts experts={experts} />
                {/* Quote edit field */}
                <div className="flex flex-col gap-1 mt-2">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-wider text-[#939393]">
                    Цитата под блоком экспертов (опционально)
                  </span>
                  <InlineEdit
                    value={quote}
                    onSave={(v) => onUpdate({ quote: v })}
                    multiline
                    placeholder="Короткая цитата эксперта…"
                  >
                    <span className="block max-w-[696px] font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                      {quote || "цитата эксперта…"}
                    </span>
                  </InlineEdit>
                </div>
              </>
            ) : (
              descriptionEl
            )}
          </div>

          {/* Row 3 (bottom-right, col 3): icon */}
          <div className="col-start-3 row-start-3 self-end pb-8">
            <input
              ref={iconInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => onUpdate({ heroImageData: reader.result as string });
                reader.readAsDataURL(file);
                e.target.value = "";
              }}
              className="hidden"
            />
            {heroImageData ? (
              <div className="group/icon relative">
                <div
                  className="w-full h-auto rounded-sm bg-contain bg-center bg-no-repeat aspect-square"
                  style={{ backgroundImage: `url(${heroImageData})` }}
                />
                <div className="absolute left-1 top-1 flex items-center gap-1 opacity-0 transition-opacity group-hover/icon:opacity-100">
                  <button
                    type="button"
                    onClick={() => iconInputRef.current?.click()}
                    className="flex h-6 items-center gap-1 rounded-sm bg-[#1a1a1a]/80 px-1.5 text-[length:var(--text-10)] text-[#F0F0F0] backdrop-blur hover:bg-[#1a1a1a]"
                  >
                    <Upload className="h-3 w-3" />
                    Заменить
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdate({ heroImageData: "" })}
                    className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => iconInputRef.current?.click()}
                className="flex w-full aspect-square cursor-pointer items-center justify-center rounded-sm border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
              >
                <div className="flex flex-col items-center gap-1">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-[length:var(--text-10)]">Иконка продукта</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right: 3 factoids + CTA — fixed 344px */}
        <div className="flex w-full shrink-0 flex-col lg:w-[344px]">
          {displayFactoids.map((factoid, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);

            return (
              <div
                key={index}
                draggable={draggable}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                className={`group/fact relative flex h-[189px] flex-col justify-between border-b border-l border-r border-[#404040] p-5 transition-all lg:p-7 ${
                  isDragging ? "opacity-60" : ""
                }`}
              >
                {/* Drag handle — top right */}
                <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/fact:opacity-100">
                  <div
                    className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                    onMouseDown={() => dnd.onGripDown(index)}
                    onMouseUp={dnd.onGripUp}
                  >
                    <GripVertical className="h-2.5 w-2.5" />
                  </div>
                  <ItemMoveButtons index={index} count={displayFactoids.length} onMove={dnd.move} />
                </div>

                {/* Top row: number + label side by side */}
                <div className="flex items-center gap-5">
                  <InlineEdit
                    value={factoid.number}
                    onSave={(v) => updateFactoid(index, "number", v)}
                    placeholder="600+"
                  >
                    <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                      {factoid.number || "—"}
                    </span>
                  </InlineEdit>

                  <InlineEdit
                    value={factoid.label}
                    onSave={(v) => updateFactoid(index, "label", v)}
                    placeholder="кейсов платформ"
                  >
                    <span className="inline-block w-[127px] font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                      {factoid.label || "подпись"}
                    </span>
                  </InlineEdit>
                </div>

                {/* Bottom: description */}
                <InlineEdit
                  value={factoid.text}
                  onSave={(v) => updateFactoid(index, "text", v)}
                  multiline
                  placeholder="Описание фактоида"
                >
                  <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
                    {factoid.text || "описание"}
                  </p>
                </InlineEdit>
              </div>
            );
          })}

          {/* CTA button — matches original design */}
          <div className="flex flex-1 flex-col justify-between bg-[#FFCC00] p-5 lg:min-h-[189px] lg:p-7">
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
    </div>
  );
}
