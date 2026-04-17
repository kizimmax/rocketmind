"use client";

import { InlineEdit } from "@/components/inline-edit";

type Cell = { label: string; title: string; description: string };

const EMPTY_CELL: Cell = { label: "", title: "", description: "" };

const CELL_LIMITS: Array<{ label: number; title: number; description: number }> = [
  { label: 20, title: 22, description: 230 },
  { label: 36, title: 26, description: 290 },
  { label: 12, title: 42, description: 370 },
];

const CELL_HINTS = ["Методология", "Синергия", "Канвасы"];

interface MethodologyEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span
      className={`font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] ${
        over ? "text-destructive" : "text-[#5C5C5C]"
      }`}
    >
      {value.length} / ~{max}
    </span>
  );
}

export function MethodologyEditor({ data, onUpdate }: MethodologyEditorProps) {
  const cellsRaw = Array.isArray(data.cells) ? (data.cells as Cell[]) : [];
  // Ровно 3 ячейки: дописываем пустыми при недостатке, лишние отбрасываем.
  const cells: Cell[] = [0, 1, 2].map((i) => cellsRaw[i] || { ...EMPTY_CELL });

  function updateCell(index: number, field: keyof Cell, value: string) {
    const next = cells.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    onUpdate({ cells: next });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 pt-14 md:px-8 xl:px-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.06em] text-[#939393]">
            Блок «Методология» — три ячейки
          </span>
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
            Лимиты символов — подсказки, чтобы текст влез в адаптив
          </span>
        </div>

        <div className="grid grid-cols-1 gap-0 border-t border-l border-[#404040] lg:grid-cols-3">
          {cells.map((cell, index) => {
            const limits = CELL_LIMITS[index];
            return (
              <div
                key={index}
                className="flex flex-col gap-5 border-b border-r border-[#404040] p-6 md:p-8"
              >
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                    Ячейка {index + 1} — {CELL_HINTS[index]}
                  </span>
                </div>

                {/* Label — жёлтый */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Label (жёлтый)
                    </span>
                    <CharCounter value={cell.label} max={limits.label} />
                  </div>
                  <InlineEdit
                    value={cell.label}
                    onSave={(v) => updateCell(index, "label", v)}
                    placeholder="Методология"
                  >
                    <p className="font-['Loos_Condensed',sans-serif] text-[16px] md:text-[18px] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#FFCC00]">
                      {cell.label || "—"}
                    </p>
                  </InlineEdit>
                </div>

                {/* Title — крупный */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Заголовок
                    </span>
                    <CharCounter value={cell.title} max={limits.title} />
                  </div>
                  <InlineEdit
                    value={cell.title}
                    onSave={(v) => updateCell(index, "title", v)}
                    multiline
                    placeholder="бизнес-дизайн"
                  >
                    <p className="whitespace-pre-wrap font-['Roboto_Condensed',sans-serif] text-[24px] md:text-[28px] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
                      {cell.title || "—"}
                    </p>
                  </InlineEdit>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Описание
                    </span>
                    <CharCounter value={cell.description} max={limits.description} />
                  </div>
                  <InlineEdit
                    value={cell.description}
                    onSave={(v) => updateCell(index, "description", v)}
                    multiline
                    placeholder="Методология, которая помогает проектировать бизнес как систему…"
                  >
                    <p className="font-['Roboto',sans-serif] text-[14px] md:text-[16px] font-normal leading-[1.3] text-[#F0F0F0]">
                      {cell.description || "—"}
                    </p>
                  </InlineEdit>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
