"use client";

import { InlineEdit } from "@/components/inline-edit";

interface CaseCardEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Stat = { value: string; label: string; description: string };

const EMPTY_STAT: Stat = { value: "", label: "", description: "" };

export function CaseCardEditor({ data, onUpdate }: CaseCardEditorProps) {
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const result = (data.result as string) || "";
  const statsRaw = (data.stats as Stat[]) || [];
  // Always show exactly 3 stats — the card layout depends on it
  const stats: Stat[] = [0, 1, 2].map((i) => statsRaw[i] || EMPTY_STAT);

  function updateStat(index: number, field: keyof Stat, value: string) {
    const next = stats.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    onUpdate({ stats: next });
  }

  return (
    <section className="dark border-t border-[#404040] bg-[#0A0A0A] py-10 text-foreground">
      <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <span className="font-['Loos_Condensed',sans-serif] text-[16px] md:text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00] mb-4 block">
          карточка кейса
        </span>

        <div className="flex flex-col gap-5 lg:gap-11">
          {/* Title + Description */}
          <div className="flex flex-col gap-2 lg:gap-5">
            <InlineEdit
              value={title}
              onSave={(v) => onUpdate({ title: v })}
              multiline
              placeholder="Заголовок кейса"
            >
              <h2 className="font-heading text-[24px] md:text-[36px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                {title || "Заголовок кейса"}
              </h2>
            </InlineEdit>

            <InlineEdit
              value={description}
              onSave={(v) => onUpdate({ description: v })}
              multiline
              placeholder="Краткое описание кейса"
            >
              <p className="text-[16px] xl:text-[18px] leading-[1.32] text-[#939393] 2xl:pr-[200px]">
                {description || "Краткое описание кейса"}
              </p>
            </InlineEdit>
          </div>

          {/* Stats — bordered box, exactly 3 columns */}
          <div className="border border-[#404040] p-5 sm:p-6 xl:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1 sm:gap-5 xl:justify-between">
                  <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-1 xl:flex-row xl:items-center xl:gap-3">
                    <InlineEdit
                      value={stat.value}
                      onSave={(v) => updateStat(i, "value", v)}
                      placeholder="0"
                    >
                      <div className="font-heading text-[52px] sm:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] flex-none">
                        {stat.value || "0"}
                      </div>
                    </InlineEdit>
                    <InlineEdit
                      value={stat.label}
                      onSave={(v) => updateStat(i, "label", v)}
                      multiline
                      placeholder="подпись"
                    >
                      <div className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#F0F0F0] whitespace-pre-wrap">
                        {stat.label || "подпись"}
                      </div>
                    </InlineEdit>
                  </div>

                  <InlineEdit
                    value={stat.description}
                    onSave={(v) => updateStat(i, "description", v)}
                    multiline
                    placeholder="Подробное описание показателя"
                  >
                    <p className="text-[12px] sm:text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                      {stat.description || "Описание показателя"}
                    </p>
                  </InlineEdit>
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          <InlineEdit
            value={result}
            onSave={(v) => onUpdate({ result: v })}
            multiline
            placeholder="Итог проекта"
          >
            <p className="font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] text-[#F0F0F0]">
              {result || "Итог проекта"}
            </p>
          </InlineEdit>
        </div>
      </div>
    </section>
  );
}
