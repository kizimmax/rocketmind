"use client";

import { useCallback, useMemo } from "react";
import { Plus, Scissors } from "lucide-react";
import type { ArticleSection } from "@/lib/types";
import { ArticleSectionRow } from "./article-section-row";

export interface ChapterTarget {
  id: string;
  label: string;
}

interface Props {
  articleSlug: string;
  /** Допускается массив произвольной формы — реальные legacy-статьи могут содержать
   *  старый flat-формат блоков. Нормализуем на входе. */
  sections: unknown;
  onChange: (next: ArticleSection[]) => void;
  /** Если задан — в шапке каждой секции появляется «Переместить в...» */
  otherChapters?: ChapterTarget[];
  onMoveToChapter?: (sectionId: string, targetChapterId: string) => void;
  /** Если задан — между секциями появляется «Начать новую главу».
   *  sectionIndex — позиция, начиная с которой секции уйдут в новую главу. */
  onSplitChapterAt?: (sectionIndex: number) => void;
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
        factoidCols: rec.factoidCols as ArticleSection["factoidCols"],
        listCards: Array.isArray(rec.listCards)
          ? (rec.listCards as ArticleSection["listCards"])
          : undefined,
        listType: rec.listType as ArticleSection["listType"],
        listCols: rec.listCols as ArticleSection["listCols"],
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
        bottomCtaId:
          typeof rec.bottomCtaId === "string" && rec.bottomCtaId
            ? rec.bottomCtaId
            : undefined,
      };
    })
    .filter((s): s is ArticleSection => s !== null);
}

export function ArticleSectionsEditor({
  articleSlug,
  sections: rawSections,
  onChange,
  otherChapters,
  onMoveToChapter,
  onSplitChapterAt,
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
        <AddSectionButton onClick={() => insertAt(0)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <SectionDivider onAddSection={() => insertAt(0)} />
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
            otherChapters={otherChapters}
            onMoveToChapter={onMoveToChapter}
          />
          <SectionDivider
            onAddSection={() => insertAt(idx + 1)}
            onSplitChapter={
              // Между секциями: idx — последняя «над», idx+1 — первая «под».
              // Сплит делаем по позиции idx+1 (всё с idx+1 уходит в новую главу).
              // Не показываем после последней секции (новая глава была бы пустой).
              onSplitChapterAt && idx < sections.length - 1
                ? () => onSplitChapterAt(idx + 1)
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}

function SectionDivider({
  onAddSection,
  onSplitChapter,
}: {
  onAddSection: () => void;
  onSplitChapter?: () => void;
}) {
  return (
    <div className="group/divider relative flex h-7 items-center justify-center gap-1.5">
      <div className="absolute left-0 right-0 h-px bg-border transition-colors group-hover/divider:bg-[var(--rm-violet-100)]/60" />
      {onSplitChapter && (
        <button
          type="button"
          onClick={onSplitChapter}
          className="relative z-10 flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-11)] font-medium text-muted-foreground opacity-60 transition-all hover:border-[var(--rm-violet-100)] hover:bg-background hover:text-[var(--rm-violet-100)] hover:opacity-100"
        >
          <Scissors className="h-3 w-3" />
          Начать новую главу
        </button>
      )}
      <button
        type="button"
        onClick={onAddSection}
        className="relative z-10 flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-11)] font-medium text-muted-foreground opacity-60 transition-all hover:border-[var(--rm-violet-100)] hover:bg-background hover:text-[var(--rm-violet-100)] hover:opacity-100"
      >
        <Plus className="h-3 w-3" />
        Добавить секцию
      </button>
    </div>
  );
}

function AddSectionButton({ onClick }: { onClick: () => void }) {
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
