"use client";

import { useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import type { ArticleSection } from "@/lib/types";
import { ArticleSectionRow } from "./article-section-row";

interface Props {
  articleSlug: string;
  /** Допускается массив произвольной формы — реальные legacy-статьи могут содержать
   *  старый flat-формат блоков. Нормализуем на входе. */
  sections: unknown;
  onChange: (next: ArticleSection[]) => void;
}

function newSectionId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULT_ASIDES_TITLE = "Материалы";

function makeSection(): ArticleSection {
  return {
    id: newSectionId(),
    title: "",
    navLabel: "",
    blocks: [],
    factoids: [],
    asides: [],
    quotes: [],
    asidesTitle: DEFAULT_ASIDES_TITLE,
    asidesTitleEnabled: true,
  };
}

function normalizeSections(raw: unknown): ArticleSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i): ArticleSection | null => {
      if (!item || typeof item !== "object") return null;
      const rec = item as Record<string, unknown>;
      // Отсеиваем legacy flat-блоки (у них есть `type`, нет `blocks`).
      if (!Array.isArray(rec.blocks)) return null;
      return {
        id: typeof rec.id === "string" && rec.id ? rec.id : `s_legacy_${i}`,
        title: typeof rec.title === "string" ? rec.title : "",
        navLabel: typeof rec.navLabel === "string" ? rec.navLabel : "",
        blocks: rec.blocks as ArticleSection["blocks"],
        factoids: Array.isArray(rec.factoids)
          ? (rec.factoids as ArticleSection["factoids"])
          : [],
        asides: Array.isArray(rec.asides)
          ? (rec.asides as ArticleSection["asides"])
          : [],
        quotes: Array.isArray(rec.quotes)
          ? (rec.quotes as ArticleSection["quotes"])
          : [],
        asidesTitle:
          typeof rec.asidesTitle === "string"
            ? rec.asidesTitle
            : DEFAULT_ASIDES_TITLE,
        asidesTitleEnabled:
          typeof rec.asidesTitleEnabled === "boolean"
            ? rec.asidesTitleEnabled
            : true,
      };
    })
    .filter((s): s is ArticleSection => s !== null);
}

export function ArticleSectionsEditor({
  articleSlug,
  sections: rawSections,
  onChange,
}: Props) {
  const sections = useMemo(() => normalizeSections(rawSections), [rawSections]);
  const insertAt = useCallback(
    (idx: number) => {
      const next = [...sections];
      next.splice(idx, 0, makeSection());
      onChange(next);
    },
    [sections, onChange],
  );

  const updateSection = useCallback(
    (id: string, nextSection: ArticleSection) => {
      onChange(sections.map((s) => (s.id === id ? nextSection : s)));
    },
    [sections, onChange],
  );

  const removeSection = useCallback(
    (id: string) => {
      onChange(sections.filter((s) => s.id !== id));
    },
    [sections, onChange],
  );

  const moveSection = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= sections.length || from === to) return;
      const arr = [...sections];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      onChange(arr);
    },
    [sections, onChange],
  );

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-4 py-10 text-center">
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Пока нет секций. Добавьте первую — у каждой свой H2 и свои блоки.
        </p>
        <AddSectionButton onClick={() => insertAt(0)} variant="primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AddSectionButton onClick={() => insertAt(0)} />
      {sections.map((section, idx) => (
        <div key={section.id} className="flex flex-col gap-3">
          <ArticleSectionRow
            articleSlug={articleSlug}
            section={section}
            index={idx}
            total={sections.length}
            onChange={(next) => updateSection(section.id, next)}
            onRemove={() => removeSection(section.id)}
            onMoveUp={() => moveSection(idx, idx - 1)}
            onMoveDown={() => moveSection(idx, idx + 1)}
          />
          <AddSectionButton onClick={() => insertAt(idx + 1)} />
        </div>
      ))}
    </div>
  );
}

function AddSectionButton({
  onClick,
  variant = "divider",
}: {
  onClick: () => void;
  variant?: "divider" | "primary";
}) {
  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-[length:var(--text-12)] font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-3.5 w-3.5" />
        Добавить секцию
      </button>
    );
  }
  return (
    <div className="group/addsection relative flex h-7 items-center justify-center">
      <div className="absolute left-0 right-0 h-px bg-border transition-colors group-hover/addsection:bg-[var(--rm-violet-100)]/60" />
      <button
        type="button"
        onClick={onClick}
        className="relative z-10 flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-11)] font-medium text-muted-foreground opacity-60 transition-all hover:border-[var(--rm-violet-100)] hover:bg-background hover:text-[var(--rm-violet-100)] hover:opacity-100"
      >
        <Plus className="h-3 w-3" />
        Добавить секцию
      </button>
    </div>
  );
}
