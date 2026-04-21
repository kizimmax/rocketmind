"use client";

import { GripVertical, Plus, Trash2, ArrowRight } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import { useItemDnd } from "@/lib/use-item-dnd";

type RotatingLine = { text: string; ctaLabel: string; ctaHref: string };

interface HomeHeroEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const EMPTY_LINE: RotatingLine = { text: "", ctaLabel: "", ctaHref: "" };

export function HomeHeroEditor({ data, onUpdate }: HomeHeroEditorProps) {
  const title = (data.title as string) || "";
  const pikCaption = (data.pikCaption as string) || "";
  const rotatingLines = Array.isArray(data.rotatingLines)
    ? (data.rotatingLines as RotatingLine[])
    : [];

  const dnd = useItemDnd(rotatingLines, (reordered) =>
    onUpdate({ rotatingLines: reordered }),
  );

  function updateLine(index: number, field: keyof RotatingLine, value: string) {
    const next = rotatingLines.map((l, i) =>
      i === index ? { ...l, [field]: value } : l,
    );
    onUpdate({ rotatingLines: next });
  }

  function addLine() {
    onUpdate({ rotatingLines: [...rotatingLines, { ...EMPTY_LINE }] });
  }

  function deleteLine(index: number) {
    onUpdate({ rotatingLines: rotatingLines.filter((_, i) => i !== index) });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 pt-14 pb-0 md:px-8 xl:px-14">
        {/* ── Заголовок (2 статичные строки + серая ротируемая) ── */}
        <div className="mb-16">
          <label className="mb-3 block font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.06em] text-[#939393]">
            Статичный заголовок (первые две строки)
          </label>
          <InlineEdit
            value={title}
            onSave={(v) => onUpdate({ title: v })}
            multiline
            placeholder={"Помогаем бизнесу расти\nи масштабироваться"}
          >
            <h1 className="whitespace-pre-wrap font-[family-name:var(--font-heading-family)] text-[40px] md:text-[56px] lg:text-[64px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
              {title || "Помогаем бизнесу расти\nи масштабироваться"}
            </h1>
          </InlineEdit>
        </div>

        {/* ── Ротирующиеся серые строчки с CTA ── */}
        <div className="mb-16">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.06em] text-[#939393]">
              Ротирующиеся серые строчки и CTA-кнопка
            </span>
            <button
              type="button"
              onClick={addLine}
              className="flex h-7 items-center gap-1 rounded-[4px] border border-dashed border-[#404040] px-2 text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
            >
              <Plus className="h-3 w-3" />
              <span className="text-[length:var(--text-11)]">Добавить строку</span>
            </button>
          </div>

          <div className="flex flex-col border-t border-l border-[#404040]">
            {rotatingLines.map((line, index) => {
              const {
                draggable,
                onDragStart,
                onDragOver,
                onDrop,
                onDragEnd,
                isDragging,
              } = dnd.itemProps(index);

              return (
                <div
                  key={index}
                  draggable={draggable}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  className={`group/line relative grid grid-cols-[1fr_auto_260px_220px] items-center gap-4 border-b border-r border-[#404040] p-5 transition-all ${
                    isDragging ? "opacity-60" : ""
                  }`}
                >
                  {/* Серая фраза */}
                  <InlineEdit
                    value={line.text}
                    onSave={(v) => updateLine(index, "text", v)}
                    placeholder="создаем стратегию развития"
                  >
                    <span className="font-[family-name:var(--font-heading-family)] text-[28px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#939393]">
                      {line.text || "—"}
                    </span>
                  </InlineEdit>

                  <ArrowRight className="h-4 w-4 shrink-0 text-[#5C5C5C]" />

                  {/* CTA label */}
                  <div className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Текст CTA
                    </span>
                    <InlineEdit
                      value={line.ctaLabel}
                      onSave={(v) => updateLine(index, "ctaLabel", v)}
                      placeholder="Обсудить стратегию"
                    >
                      <span className="text-[length:var(--text-14)] text-[#F0F0F0]">
                        {line.ctaLabel || "—"}
                      </span>
                    </InlineEdit>
                  </div>

                  {/* CTA href */}
                  <div className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Ссылка
                    </span>
                    <InlineEdit
                      value={line.ctaHref}
                      onSave={(v) => updateLine(index, "ctaHref", v)}
                      placeholder="#contact"
                    >
                      <span className="truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-[#F0F0F0]">
                        {line.ctaHref || "—"}
                      </span>
                    </InlineEdit>
                  </div>

                  {/* Ручки */}
                  <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/line:opacity-100">
                    <div
                      className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                      onMouseDown={() => dnd.onGripDown(index)}
                      onMouseUp={dnd.onGripUp}
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </div>
                    <ItemMoveButtons index={index} count={rotatingLines.length} onMove={dnd.move} />
                    <button
                      type="button"
                      onClick={() => deleteLine(index)}
                      className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
            {rotatingLines.length === 0 && (
              <div className="border-b border-r border-[#404040] p-10 text-center text-[length:var(--text-12)] text-[#5C5C5C]">
                Ни одной строки. Нажмите «Добавить строку».
              </div>
            )}
          </div>
        </div>

        {/* ── Подпись под PIK ── */}
        <div>
          <label className="mb-3 block font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.06em] text-[#939393]">
            Подпись под логотипом PIK (многострочная)
          </label>
          <InlineEdit
            value={pikCaption}
            onSave={(v) => onUpdate({ pikCaption: v })}
            multiline
            placeholder={"Развиваем методологию\nи представляем PIK\nв России и странах Азии"}
          >
            <p className="whitespace-pre-wrap font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase leading-[1.32] tracking-[0.01em] text-[#939393]">
              {pikCaption || "Развиваем методологию\nи представляем PIK\nв России и странах Азии"}
            </p>
          </InlineEdit>
        </div>
      </div>
    </div>
  );
}
