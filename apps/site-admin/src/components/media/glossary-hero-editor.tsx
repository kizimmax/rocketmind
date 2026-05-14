"use client";

import { Plus } from "lucide-react";
import { Breadcrumbs } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";
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
 * и описание. Заголовок — `InlineEdit`. Описание — мульти-абзацы через
 * `ParagraphsEditor` (DnD reorder, добавление, удаление). Первый абзац
 * синхронизируется с legacy-полем `description` для SEO/мета.
 */
export function GlossaryHeroEditor({ draft, onChange }: Props) {
  const paragraphs = resolveParagraphs(draft.descriptionParagraphs, draft.description, {
    color: "primary",
  });

  function handleParagraphsChange(next: StyledParagraph[]) {
    onChange("descriptionParagraphs", next);
    onChange("description", next[0]?.text ?? "");
  }

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

          {paragraphs.length === 0 ? (
            <button
              type="button"
              onClick={() =>
                handleParagraphsChange([{ text: "", uppercase: false, color: "primary" }])
              }
              className="flex items-center justify-start gap-1 border border-dashed border-[#404040] px-3 py-3 text-left text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
            >
              <Plus className="h-3.5 w-3.5" />
              Добавить абзац описания
            </button>
          ) : (
            <ParagraphsEditor
              paragraphs={paragraphs}
              onChange={handleParagraphsChange}
              theme="dark"
              defaults={{ color: "primary" }}
              placeholder="Короткое описание, которое появится под заголовком"
              addLabel="Добавить абзац"
            />
          )}
        </div>
      </div>
    </div>
  );
}
