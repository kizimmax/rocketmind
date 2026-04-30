"use client";

import { Breadcrumbs } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import type { GlossaryTerm } from "@/lib/types";

interface Props {
  draft: GlossaryTerm;
  onChange: <K extends keyof GlossaryTerm>(
    field: K,
    value: GlossaryTerm[K],
  ) => void;
}

/**
 * Hero-блок в редакторе термина глоссария — упрощённый аналог `ArticleHeroEditor`.
 * Без обложки, автора, даты, тегов, ключевых мыслей и цитат — только заголовок
 * и описание, оба inline-editable через фиолетовую иконку с карандашом
 * (`InlineEdit`). Сохраняются неразрывные пробелы и переносы строк.
 */
export function GlossaryHeroEditor({ draft, onChange }: Props) {
  return (
    <div className="rounded-sm bg-[#0A0A0A] px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-[1100px]">
        {/* Breadcrumbs preview (не редактируется) */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "#" },
              { label: "Медиа", href: "#" },
              { label: "Глоссарий", href: "#" },
              { label: draft.title || "Название термина" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-5">
          <InlineEdit
            value={draft.title}
            onSave={(v) => onChange("title", v)}
            multiline
            placeholder="НАЗВАНИЕ ТЕРМИНА"
          >
            <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[#F0F0F0] md:text-[44px] whitespace-pre-line">
              {draft.title || "НАЗВАНИЕ ТЕРМИНА"}
            </h1>
          </InlineEdit>

          <InlineEdit
            value={draft.description ?? ""}
            onSave={(v) => onChange("description", v)}
            multiline
            copy
            placeholder="Короткое описание, которое появится под заголовком"
          >
            <p className="text-[length:var(--text-16)] leading-[1.28] text-[#F0F0F0] md:text-[length:var(--text-18)] md:leading-[1.2] whitespace-pre-line">
              {draft.description || "Короткое описание термина"}
            </p>
          </InlineEdit>
        </div>
      </div>
    </div>
  );
}
