"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { CtaEntity, PageBlock } from "@/lib/types";

interface PageBottomEditorProps {
  block: PageBlock;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function PageBottomEditor({ block, onUpdate }: PageBottomEditorProps) {
  const [ctas, setCtas] = useState<CtaEntity[]>([]);
  const ctaId =
    typeof block.data?.ctaId === "string" ? (block.data.ctaId as string) : "";

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/ctas")
      .then((r) => r.json() as Promise<CtaEntity[]>)
      .then((all) => {
        if (cancelled) return;
        setCtas(all.filter((c) => c.scope !== "article"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const defaultCta = ctas.find((c) => c.id === "default");
  const selected = ctaId ? ctas.find((c) => c.id === ctaId) : null;
  const preview = selected ?? defaultCta ?? null;

  return (
    <div className="flex flex-col gap-3 bg-[#0A0A0A] p-6">
      <div className="flex flex-col gap-1.5">
        <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-wider text-[#939393]">
          CTA-блок
        </label>
        <select
          value={ctaId}
          onChange={(e) => onUpdate({ ...block.data, ctaId: e.target.value })}
          className="h-9 max-w-md rounded-sm border border-[#404040] bg-[#0A0A0A] px-2 text-[length:var(--text-13)] text-[#F0F0F0]"
        >
          <option value="">
            — По умолчанию{defaultCta ? ` («${defaultCta.name || "default"}»)` : ""} —
          </option>
          {ctas
            .filter((c) => c.id !== "default")
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.id}
              </option>
            ))}
        </select>
      </div>

      {preview && (
        <div className="rounded-sm border border-[#404040] p-3 text-[length:var(--text-12)] text-[#939393]">
          {!selected && (
            <p className="mb-2 text-[length:var(--text-11)] text-[#666]">
              Фолбэк — CTA «default»:
            </p>
          )}
          <div className="text-[#F0F0F0]">
            «{preview.heading || "(заголовок не задан)"}»
          </div>
          <div className="mt-1">{preview.body || "(описание не задано)"}</div>
          <div className="mt-2 inline-block rounded-sm bg-[#FFCC00] px-2 py-0.5 text-[length:var(--text-12)] text-[#0A0A0A]">
            {preview.buttonText || "(текст кнопки)"}
          </div>
        </div>
      )}

      <p className="text-[length:var(--text-11)] text-[#666]">
        Кнопка открывает форму страницы (см. поле «Форма страницы» в настройках
        выше). Чипсы из блока «Услуги» подставляются автоматически. Секция
        «Кейсы» рендерится автоматически над CTA-блоком.
      </p>
    </div>
  );
}
