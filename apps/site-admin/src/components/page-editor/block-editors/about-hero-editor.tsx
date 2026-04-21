"use client";

import { GripVertical, Plus, Minus } from "lucide-react";
import { HeroExperts, Switch } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";
import { useItemDnd } from "@/lib/use-item-dnd";

interface AboutHeroEditorProps {
  data: Record<string, unknown>;
  /** Experts resolved from the page-level Experts block. */
  experts: Array<{ name: string; image: string | null }>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function AboutHeroEditor({ data, experts, onUpdate }: AboutHeroEditorProps) {
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.description as string) || "",
    { uppercase: false, color: "secondary" },
  );
  const heading = (data.heading as string) || "";
  const headingSecondary = (data.headingSecondary as string) || "";
  const descriptionBelow = data.descriptionBelow === true;
  const maxExperts = typeof data.maxExperts === "number" ? data.maxExperts : null;
  const showExperts = data.showExperts !== false;

  // Factoids — always 4, pad if needed
  const rawFactoids = (data.factoids as Array<{ number: string; label: string; text: string }>) || [];
  const normalized = [...rawFactoids];
  while (normalized.length < 4) normalized.push({ number: "", label: "", text: "" });
  const displayFactoids = normalized.slice(0, 4);

  // Experts — sourced from the page-level Experts block
  const totalExperts = experts.length;
  const isRestricted = maxExperts !== null && maxExperts < totalExperts;
  const currentMax = isRestricted ? maxExperts! : totalExperts;
  const visibleExperts = experts.slice(0, currentMax);

  function setMax(n: number) {
    if (n >= totalExperts) {
      onUpdate({ maxExperts: null }); // at max → no restriction
    } else {
      onUpdate({ maxExperts: Math.max(1, n) });
    }
  }

  const dnd = useItemDnd(displayFactoids, (reordered) => onUpdate({ factoids: reordered }));

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({ paragraphs: next, description: undefined });
  }

  function updateFactoid(index: number, field: string, value: string) {
    const updated = displayFactoids.map((f, i) => (i === index ? { ...f, [field]: value } : f));
    onUpdate({ factoids: updated });
  }

  const headingBlock = (
    <div className="flex flex-col gap-2">
      <InlineEdit
        value={heading}
        onSave={(v) => onUpdate({ heading: v })}
        placeholder="ЗАГОЛОВОК"
      >
        <h1 className="font-[family-name:var(--font-heading-family)] text-[52px] md:text-[64px] lg:text-[80px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
          {heading || "ЗАГОЛОВОК"}
        </h1>
      </InlineEdit>
      <InlineEdit
        value={headingSecondary}
        onSave={(v) => onUpdate({ headingSecondary: v })}
        placeholder="Дополнительная часть (серая)"
      >
        <p className="font-[family-name:var(--font-heading-family)] text-[28px] md:text-[36px] lg:text-[44px] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#939393]">
          {headingSecondary || "доп. часть"}
        </p>
      </InlineEdit>
    </div>
  );

  const descriptionBlock = (
    <ParagraphsEditor
      paragraphs={paragraphs}
      onChange={setParagraphs}
      theme="dark"
      defaults={{ uppercase: false, color: "secondary" }}
    />
  );

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      {/* Block settings */}
      <div className="mx-auto flex max-w-[1512px] items-center gap-6 px-5 pt-6 md:px-8 xl:px-14">
        <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
          <Switch
            checked={descriptionBelow}
            onCheckedChange={(v) => onUpdate({ descriptionBelow: v })}
            size="sm"
          />
          Описание снизу
        </label>
      </div>

      <div className="mx-auto max-w-[1512px] px-5 pt-10 pb-0 md:px-8 xl:px-14">

        {/* ── Row 1: Heading (+ optional secondary) and description ── */}
        {descriptionBelow ? (
          <div className="flex flex-col gap-8 mb-16">
            <div className="w-full">{headingBlock}</div>
            <div className="w-full lg:w-3/4">{descriptionBlock}</div>
          </div>
        ) : (
          <div className="flex flex-row gap-0 mb-16">
            <div className="w-1/2 pr-11">{headingBlock}</div>
            <div className="flex w-1/2 items-start">{descriptionBlock}</div>
          </div>
        )}

        {/* ── Row 2: Experts strip ── */}
        {totalExperts > 0 && (
          <div className={`mb-10 flex flex-col gap-4 ${showExperts ? "" : "opacity-40"}`}>
            <div className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                Команда экспертов
              </span>

              {/* Show/hide toggle + max counter */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={showExperts}
                  onCheckedChange={(v) => onUpdate({ showExperts: v })}
                  size="sm"
                />

                <div className="flex items-center gap-1 rounded-sm border border-[#404040] bg-[#121212] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setMax(currentMax - 1)}
                    disabled={!showExperts || currentMax <= 1}
                    className="flex h-5 w-5 items-center justify-center text-[#939393] transition-colors hover:text-[#F0F0F0] disabled:opacity-30"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-[40px] text-center font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-[#F0F0F0]">
                    {isRestricted ? `${currentMax} / ${totalExperts}` : "все"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMax(currentMax + 1)}
                    disabled={!showExperts || currentMax >= totalExperts}
                    className="flex h-5 w-5 items-center justify-center text-[#939393] transition-colors hover:text-[#F0F0F0] disabled:opacity-30"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  {isRestricted && showExperts && (
                    <button
                      type="button"
                      onClick={() => onUpdate({ maxExperts: null })}
                      className="ml-1 text-[length:var(--text-11)] text-[#FFCC00] hover:underline"
                    >
                      все
                    </button>
                  )}
                </div>
              </div>
            </div>

            <HeroExperts experts={visibleExperts} />
          </div>
        )}

        {/* ── Row 3: Factoids — 4 in a single row ── */}
        <div className="grid grid-cols-4 border-t border-l border-[#404040]">
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
                className={`group/fact relative flex min-h-[112px] items-center gap-5 overflow-hidden border-b border-r border-[#404040] p-5 transition-all md:p-7 ${
                  isDragging ? "opacity-60" : ""
                }`}
              >
                {/* Drag handle */}
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

                <InlineEdit
                  value={factoid.number}
                  onSave={(v) => updateFactoid(index, "number", v)}
                  placeholder="120+"
                >
                  <span className="shrink-0 font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                    {factoid.number || "—"}
                  </span>
                </InlineEdit>

                <InlineEdit
                  value={factoid.label}
                  onSave={(v) => updateFactoid(index, "label", v)}
                  placeholder="проектов"
                >
                  <span className="min-w-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                    {factoid.label || "подпись"}
                  </span>
                </InlineEdit>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
