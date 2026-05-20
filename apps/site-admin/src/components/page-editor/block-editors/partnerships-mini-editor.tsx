"use client";

import { useState } from "react";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { LogoPickerDialog } from "@/components/media/aside-item-editors";

interface PartnershipsMiniEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Logo = { src: string; alt: string };

const DEFAULT_TITLE = "Программы с ведущими бизнес-школами";
const DEFAULT_DESCRIPTION =
  "Обучаем топ-менеджеров крупных компаний, помогаем трансформировать бизнес с помощью бизнес-дизайна";

export function PartnershipsMiniEditor({ data, onUpdate }: PartnershipsMiniEditorProps) {
  const title = (data.title as string) || DEFAULT_TITLE;
  const description = (data.description as string) || DEFAULT_DESCRIPTION;
  const logos = (data.logos as Logo[]) || [];

  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null);

  // Логотипы: плоский массив, в редакторе показываем по 2 в ряд.
  // `minRows` ≥1, чтобы пустой блок всё равно показывал слоты.
  const [minRows, setMinRows] = useState(1);
  const rowsFromLogos = Math.ceil(logos.length / 2);
  const totalRows = Math.max(minRows, rowsFromLogos, 1);
  const visibleSlots: (Logo | null)[] = [];
  for (let i = 0; i < totalRows * 2; i++) {
    visibleSlots.push(logos[i] || null);
  }

  function setLogoAt(index: number, src: string) {
    const next = [...visibleSlots];
    next[index] = { src, alt: "" };
    onUpdate({ logos: next.filter((l): l is Logo => l !== null && Boolean(l.src)) });
  }

  function clearLogoAt(index: number) {
    const next = [...visibleSlots];
    next[index] = null;
    onUpdate({ logos: next.filter((l): l is Logo => l !== null && Boolean(l.src)) });
  }

  function addLogoRow() {
    setMinRows(totalRows + 1);
  }

  function removeRow(rowIndex: number) {
    const start = rowIndex * 2;
    const next = [...visibleSlots];
    next.splice(start, 2);
    const filled = next.filter((l): l is Logo => l !== null && Boolean(l.src));
    onUpdate({ logos: filled });
    setMinRows((r) => Math.max(1, r - 1));
  }

  return (
    <div className="rounded-sm bg-[var(--rm-yellow-100)] px-5 py-10 md:px-8 xl:px-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: title + description */}
        <div className="flex flex-col gap-5 lg:max-w-[720px]">
          <InlineEdit
            value={title}
            onSave={(v) => onUpdate({ title: v })}
            multiline
            placeholder="Заголовок"
          >
            <h3 className="font-[family-name:var(--font-heading-family)] text-[24px] md:text-[32px] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-[#0A0A0A]">
              {title}
            </h3>
          </InlineEdit>
          <InlineEdit
            value={description}
            onSave={(v) => onUpdate({ description: v })}
            multiline
            placeholder="Подпись"
          >
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] md:text-[length:var(--text-16)] font-medium uppercase leading-[1.3] tracking-[0.01em] text-[#0A0A0A]">
              {description}
            </p>
          </InlineEdit>
        </div>

        {/* Right: editable logos grid (2 cols) */}
        <div className="flex flex-col gap-3 lg:max-w-[360px] lg:w-full">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.08em] text-[#0A0A0A]/70">
            Логотипы
          </span>
          <div className="flex flex-col gap-3">
            {Array.from({ length: totalRows }).map((_, rowIdx) => {
              const left = visibleSlots[rowIdx * 2] || null;
              const right = visibleSlots[rowIdx * 2 + 1] || null;
              return (
                <div
                  key={rowIdx}
                  className="group/logo-row grid grid-cols-[1fr_1fr_auto] items-center gap-3"
                >
                  <LogoSlot
                    logo={left}
                    onPick={() => setPickerOpenIndex(rowIdx * 2)}
                    onClear={() => clearLogoAt(rowIdx * 2)}
                    onYellow
                  />
                  <LogoSlot
                    logo={right}
                    onPick={() => setPickerOpenIndex(rowIdx * 2 + 1)}
                    onClear={() => clearLogoAt(rowIdx * 2 + 1)}
                    onYellow
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(rowIdx)}
                    title="Удалить ряд"
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-[#0A0A0A]/60 opacity-0 transition-all hover:bg-[#ED4843]/15 hover:text-[#ED4843] group-hover/logo-row:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addLogoRow}
              className="flex items-center justify-center gap-1.5 border border-dashed border-[#0A0A0A]/40 py-2.5 text-[length:var(--text-12)] text-[#0A0A0A]/70 transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
            >
              <Plus className="h-3.5 w-3.5" />
              Добавить ряд
            </button>
          </div>
        </div>
      </div>

      <LogoPickerDialog
        open={pickerOpenIndex !== null}
        onOpenChange={(v) => !v && setPickerOpenIndex(null)}
        onPick={(src) => {
          if (pickerOpenIndex !== null) {
            setLogoAt(pickerOpenIndex, src);
            setPickerOpenIndex(null);
          }
        }}
      />
    </div>
  );
}

function LogoSlot({
  logo,
  onPick,
  onClear,
  onYellow,
}: {
  logo: Logo | null;
  onPick: () => void;
  onClear: () => void;
  onYellow?: boolean;
}) {
  if (logo?.src) {
    return (
      <div className="group/logo-slot relative flex h-14 items-center justify-start">
        <img
          src={logo.src}
          alt={logo.alt || ""}
          className="h-auto max-h-[56px] w-auto max-w-full object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity group-hover/logo-slot:opacity-100">
          <button
            type="button"
            onClick={onPick}
            title="Заменить логотип"
            className="flex h-7 items-center gap-1.5 rounded-sm bg-[#1a1a1a]/90 px-2.5 text-[length:var(--text-11)] text-[#F0F0F0] backdrop-blur transition-colors hover:bg-[#252525]"
          >
            <ImageIcon className="h-3 w-3" />
            Заменить
          </button>
          <button
            type="button"
            onClick={onClear}
            title="Очистить"
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1a1a1a]/90 text-[#F0F0F0] backdrop-blur transition-colors hover:bg-[#ED4843]/20 hover:text-[#ED4843]"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onPick}
      className={
        onYellow
          ? "flex h-14 items-center justify-center border border-dashed border-[#0A0A0A]/40 text-[#0A0A0A]/70 transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          : "flex h-14 items-center justify-center border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
      }
    >
      <div className="flex items-center gap-1.5">
        <ImageIcon className="h-3.5 w-3.5" />
        <span className="text-[length:var(--text-11)]">Выбрать</span>
      </div>
    </button>
  );
}
