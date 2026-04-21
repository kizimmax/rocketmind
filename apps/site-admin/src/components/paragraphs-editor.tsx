"use client";

import { Plus, GripVertical, CaseUpper, Palette } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { MdText } from "@/components/md-text";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import { useItemDnd } from "@/lib/use-item-dnd";

export type ParagraphColor = "primary" | "secondary";

export interface StyledParagraph {
  text: string;
  uppercase?: boolean;
  color?: ParagraphColor;
}

export interface ParagraphsEditorProps {
  paragraphs: StyledParagraph[];
  onChange: (next: StyledParagraph[]) => void;
  /** Visual theme. Affects preview colors. Default "dark". */
  theme?: "dark" | "light";
  /** Default style for newly added paragraphs. Default: secondary + no caps. */
  defaults?: { uppercase?: boolean; color?: ParagraphColor };
  placeholder?: string;
  addLabel?: string;
  /** Text size preset. Default "18". */
  size?: "18" | "16";
}

export function paragraphClassName(
  p: StyledParagraph,
  opts: { theme?: "dark" | "light"; size?: "18" | "16" } = {},
) {
  const theme = opts.theme ?? "dark";
  const size = opts.size ?? "18";
  const isPrimary = p.color === "primary";
  const textColor =
    theme === "light"
      ? isPrimary
        ? "text-[#0A0A0A]"
        : "text-[#666666]"
      : isPrimary
        ? "text-[#F0F0F0]"
        : "text-[#939393]";
  const sizeVar = size === "16" ? "var(--text-16)" : "var(--text-18)";
  const base = p.uppercase
    ? `font-[family-name:var(--font-mono-family)] text-[length:${sizeVar}] font-medium uppercase leading-[1.12] tracking-[0.02em]`
    : `text-[length:${sizeVar}] leading-[1.2]`;
  return `${base} ${textColor}`;
}

export function ParagraphsEditor({
  paragraphs,
  onChange,
  theme = "dark",
  defaults,
  placeholder = "Абзац описания...",
  addLabel = "Добавить абзац",
  size = "18",
}: ParagraphsEditorProps) {
  const dnd = useItemDnd(paragraphs, onChange);

  function update(i: number, patch: Partial<StyledParagraph>) {
    onChange(paragraphs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function toggleUpper(i: number) {
    update(i, { uppercase: !paragraphs[i].uppercase });
  }
  function toggleColor(i: number) {
    const cur = paragraphs[i].color === "primary" ? "primary" : "secondary";
    update(i, { color: cur === "primary" ? "secondary" : "primary" });
  }
  function remove(i: number) {
    onChange(paragraphs.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([
      ...paragraphs,
      {
        text: "",
        uppercase: defaults?.uppercase ?? false,
        color: defaults?.color ?? "secondary",
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((p, index) => {
        const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
          dnd.itemProps(index);
        const isPrimary = p.color === "primary";
        return (
          <div
            key={index}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={`group/para relative transition-all ${
              isDragging ? "opacity-60" : ""
            }`}
          >
            <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/para:opacity-100">
              <div
                className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                onMouseDown={() => dnd.onGripDown(index)}
                onMouseUp={dnd.onGripUp}
              >
                <GripVertical className="h-2.5 w-2.5" />
              </div>
              <ItemMoveButtons
                index={index}
                count={paragraphs.length}
                onMove={dnd.move}
              />
              <button
                type="button"
                title="Капсом (label-18)"
                onClick={() => toggleUpper(index)}
                className={`flex h-5 w-5 items-center justify-center rounded-sm transition-colors ${
                  p.uppercase
                    ? "bg-[#FFCC00] text-[#0A0A0A]"
                    : "bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#FFCC00]"
                }`}
              >
                <CaseUpper className="h-3 w-3" />
              </button>
              <button
                type="button"
                title={isPrimary ? "Цвет: праймари" : "Цвет: секондари"}
                onClick={() => toggleColor(index)}
                className={`flex h-5 w-5 items-center justify-center rounded-sm transition-colors ${
                  isPrimary
                    ? "bg-[#FFCC00] text-[#0A0A0A]"
                    : "bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#FFCC00]"
                }`}
              >
                <Palette className="h-3 w-3" />
              </button>
              <InlineConfirmDelete
                onConfirm={() => remove(index)}
                className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
              />
            </div>

            <InlineEdit
              value={p.text}
              onSave={(v) => update(index, { text: v })}
              multiline
              copy
              placeholder={placeholder}
            >
              <MdText
                value={p.text}
                placeholder={placeholder}
                className={paragraphClassName(p, { theme, size })}
              />
            </InlineEdit>
          </div>
        );
      })}

      <button
        onClick={add}
        className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-3 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}

/**
 * Normalize legacy/new inputs into a canonical paragraphs array.
 *
 * - If `paragraphs` array is provided and non-empty — use as-is (with field defaults).
 * - Else if `legacy` string is provided — wrap into one paragraph with `legacyDefaults`.
 * - Else return empty array.
 */
export function resolveParagraphs(
  paragraphs: unknown,
  legacy: string | undefined,
  legacyDefaults: { uppercase?: boolean; color?: ParagraphColor } = {},
): StyledParagraph[] {
  type RawItem = string | { text?: string; uppercase?: boolean; color?: ParagraphColor };
  if (Array.isArray(paragraphs) && paragraphs.length > 0) {
    return (paragraphs as RawItem[]).map((p) =>
      typeof p === "string"
        ? { text: p, uppercase: false, color: "secondary" }
        : {
            text: p.text ?? "",
            uppercase: p.uppercase === true,
            color: p.color === "primary" ? "primary" : "secondary",
          },
    );
  }
  if (legacy && legacy.trim().length > 0) {
    return [
      {
        text: legacy,
        uppercase: legacyDefaults.uppercase ?? false,
        color: legacyDefaults.color ?? "secondary",
      },
    ];
  }
  return [];
}
