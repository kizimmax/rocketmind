"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus, ArrowUp, ArrowDown, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@rocketmind/ui";
import type { ArticleChapter } from "@/lib/types";
import { slugify } from "@/lib/store";
import { ArticleSectionsEditor, type ChapterTarget } from "./article-sections-editor";

interface Props {
  articleSlug: string;
  chapters: unknown;
  onChange: (next: ArticleChapter[]) => void;
  /** Вызывается, когда пользователь подтверждает удаление последней оставшейся главы.
   *  Парент должен переключить multiPage в false и плоско залить body. */
  onDisableMultiPage?: () => void;
}

function newChapterId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function makeChapter(idx: number): ArticleChapter {
  const n = idx + 1;
  return {
    id: newChapterId(),
    slug: `glava-${n}`,
    navLabel: `Глава ${n}`,
    sections: [],
  };
}

function normalize(raw: unknown): ArticleChapter[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i): ArticleChapter | null => {
      if (!item || typeof item !== "object") return null;
      const r = item as Record<string, unknown>;
      const slug = typeof r.slug === "string" ? r.slug : "";
      if (!slug) return null;
      return {
        id: typeof r.id === "string" && r.id ? r.id : `c_legacy_${i}`,
        slug,
        navLabel: typeof r.navLabel === "string" ? r.navLabel : "",
        sections: Array.isArray(r.sections)
          ? (r.sections as ArticleChapter["sections"])
          : [],
      };
    })
    .filter((c): c is ArticleChapter => c !== null);
}

export function ArticleChaptersEditor({
  articleSlug,
  chapters: rawChapters,
  onChange,
  onDisableMultiPage,
}: Props) {
  const chapters = useMemo(() => normalize(rawChapters), [rawChapters]);
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null);
  const [moveTargetId, setMoveTargetId] = useState<string>("");

  const slugConflicts = useMemo(() => {
    const seen = new Set<string>();
    const dup = new Set<string>();
    for (const ch of chapters) {
      if (!ch.slug) continue;
      if (seen.has(ch.slug)) dup.add(ch.slug);
      seen.add(ch.slug);
    }
    return dup;
  }, [chapters]);

  const insertAt = useCallback(
    (idx: number) => {
      const next = [...chapters];
      next.splice(idx, 0, makeChapter(chapters.length));
      onChange(next);
    },
    [chapters, onChange],
  );

  const update = useCallback(
    (id: string, patch: Partial<ArticleChapter>) => {
      onChange(chapters.map((ch) => (ch.id === id ? { ...ch, ...patch } : ch)));
    },
    [chapters, onChange],
  );

  const remove = useCallback(
    (id: string) => {
      onChange(chapters.filter((ch) => ch.id !== id));
    },
    [chapters, onChange],
  );

  const requestDelete = useCallback(
    (id: string) => {
      const ch = chapters.find((c) => c.id === id);
      if (!ch) return;
      // Пустая глава, и она не последняя → удаляем без вопросов
      if (ch.sections.length === 0 && chapters.length > 1) {
        remove(id);
        return;
      }
      // Иначе — открываем диалог
      const firstOther = chapters.find((c) => c.id !== id);
      setMoveTargetId(firstOther?.id ?? "");
      setDeletingChapterId(id);
    },
    [chapters, remove],
  );

  const splitChapterAt = useCallback(
    (chapterId: string, sectionIndex: number) => {
      const idx = chapters.findIndex((c) => c.id === chapterId);
      if (idx === -1) return;
      const cur = chapters[idx];
      if (sectionIndex <= 0 || sectionIndex >= cur.sections.length) return;
      const before = cur.sections.slice(0, sectionIndex);
      const after = cur.sections.slice(sectionIndex);
      const n = chapters.length + 1;
      const newCh: ArticleChapter = {
        id: newChapterId(),
        slug: `glava-${n}`,
        navLabel: `Глава ${n}`,
        sections: after,
      };
      const next = [...chapters];
      next[idx] = { ...cur, sections: before };
      next.splice(idx + 1, 0, newCh);
      onChange(next);
    },
    [chapters, onChange],
  );

  const move = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= chapters.length || from === to) return;
      const arr = [...chapters];
      const [it] = arr.splice(from, 1);
      arr.splice(to, 0, it);
      onChange(arr);
    },
    [chapters, onChange],
  );

  const moveSectionToChapter = useCallback(
    (sectionId: string, targetChapterId: string) => {
      const sourceIdx = chapters.findIndex((ch) =>
        ch.sections.some((s) => s.id === sectionId),
      );
      const targetIdx = chapters.findIndex((ch) => ch.id === targetChapterId);
      if (sourceIdx === -1 || targetIdx === -1 || sourceIdx === targetIdx) return;
      const arr = chapters.map((ch) => ({ ...ch, sections: [...ch.sections] }));
      const section = arr[sourceIdx].sections.find((s) => s.id === sectionId)!;
      arr[sourceIdx].sections = arr[sourceIdx].sections.filter((s) => s.id !== sectionId);
      arr[targetIdx].sections = [...arr[targetIdx].sections, section];
      onChange(arr);
    },
    [chapters, onChange],
  );

  if (chapters.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-4 py-10 text-center">
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Пока нет глав. Добавьте первую — каждая будет на своём URL.
        </p>
        <button
          type="button"
          onClick={() => insertAt(0)}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-[length:var(--text-12)] font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить главу
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {chapters.map((ch, idx) => {
        const otherChapters: ChapterTarget[] = chapters
          .filter((c) => c.id !== ch.id)
          .map((c) => ({ id: c.id, label: c.navLabel || `Глава ${chapters.indexOf(c) + 1}` }));
        return (
          <ChapterRow
            key={ch.id}
            articleSlug={articleSlug}
            chapter={ch}
            index={idx}
            total={chapters.length}
            slugConflict={!!ch.slug && slugConflicts.has(ch.slug)}
            onUpdate={(patch) => update(ch.id, patch)}
            onRemove={() => requestDelete(ch.id)}
            onMoveUp={() => move(idx, idx - 1)}
            onMoveDown={() => move(idx, idx + 1)}
            otherChapters={otherChapters}
            onMoveToChapter={moveSectionToChapter}
            onSplitChapterAt={(sectionIndex) => splitChapterAt(ch.id, sectionIndex)}
          />
        );
      })}
      <button
        type="button"
        onClick={() => insertAt(chapters.length)}
        className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background px-3 py-2 text-[length:var(--text-12)] font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-3.5 w-3.5" />
        Добавить главу
      </button>

      <DeleteChapterDialog
        open={deletingChapterId !== null}
        chapter={chapters.find((c) => c.id === deletingChapterId) ?? null}
        otherChapters={chapters.filter((c) => c.id !== deletingChapterId)}
        moveTargetId={moveTargetId}
        onMoveTargetChange={setMoveTargetId}
        onClose={() => setDeletingChapterId(null)}
        onConfirmDelete={() => {
          if (!deletingChapterId) return;
          if (chapters.length === 1) {
            onDisableMultiPage?.();
          } else {
            remove(deletingChapterId);
          }
          setDeletingChapterId(null);
        }}
        onConfirmMove={() => {
          if (!deletingChapterId || !moveTargetId) return;
          const source = chapters.find((c) => c.id === deletingChapterId);
          const target = chapters.find((c) => c.id === moveTargetId);
          if (!source || !target) return;
          const next = chapters
            .map((c) =>
              c.id === target.id
                ? { ...c, sections: [...c.sections, ...source.sections] }
                : c,
            )
            .filter((c) => c.id !== deletingChapterId);
          onChange(next);
          setDeletingChapterId(null);
        }}
      />
    </div>
  );
}

function DeleteChapterDialog({
  open,
  chapter,
  otherChapters,
  moveTargetId,
  onMoveTargetChange,
  onClose,
  onConfirmDelete,
  onConfirmMove,
}: {
  open: boolean;
  chapter: ArticleChapter | null;
  otherChapters: ArticleChapter[];
  moveTargetId: string;
  onMoveTargetChange: (id: string) => void;
  onClose: () => void;
  onConfirmDelete: () => void;
  onConfirmMove: () => void;
}) {
  if (!chapter) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent />
      </Dialog>
    );
  }
  const sectionsCount = chapter.sections.length;
  const isLast = otherChapters.length === 0;
  const chapterTitle = chapter.navLabel || "Без названия";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isLast ? "Отключить разделение на главы?" : `Удалить главу «${chapterTitle}»?`}
          </DialogTitle>
        </DialogHeader>

        {isLast ? (
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Это последняя глава. При её удалении статья перестанет быть многостраничной —
            {sectionsCount > 0
              ? ` все ${sectionsCount} секций станут обычным содержимым на одной странице.`
              : " статья станет обычной (без секций)."}
          </p>
        ) : sectionsCount === 0 ? (
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Глава пустая — будет удалена без потерь.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              В главе {sectionsCount} секций. Что с ними сделать?
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="text-[length:var(--text-12)] text-muted-foreground">
                Перенести секции в:
              </span>
              <select
                value={moveTargetId}
                onChange={(e) => onMoveTargetChange(e.target.value)}
                className="h-9 rounded-sm border border-border bg-background px-3 text-[length:var(--text-13)]"
              >
                {otherChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.navLabel || "Без названия"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          {!isLast && sectionsCount > 0 && (
            <Button onClick={onConfirmMove} disabled={!moveTargetId}>
              Перенести и удалить главу
            </Button>
          )}
          <Button variant="destructive" onClick={onConfirmDelete}>
            {isLast
              ? "Отключить разделение"
              : sectionsCount > 0
                ? "Удалить с секциями"
                : "Удалить главу"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChapterRow({
  articleSlug,
  chapter,
  index,
  total,
  slugConflict,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  otherChapters,
  onMoveToChapter,
  onSplitChapterAt,
}: {
  articleSlug: string;
  chapter: ArticleChapter;
  index: number;
  total: number;
  slugConflict: boolean;
  onUpdate: (patch: Partial<ArticleChapter>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  otherChapters: ChapterTarget[];
  onMoveToChapter: (sectionId: string, targetChapterId: string) => void;
  onSplitChapterAt: (sectionIndex: number) => void;
}) {
  const [open, setOpen] = useState(true);
  // Slug авто-генерируется из navLabel пока совпадает с slugify(navLabel).
  // Как только пользователь правит slug вручную — авто-синк отключается до
  // следующего сохранения/перезагрузки.
  const [slugAutoSync, setSlugAutoSync] = useState(
    () => chapter.slug === slugify(chapter.navLabel),
  );
  return (
    <div className="rounded-sm border border-border">
      <div className="flex items-center gap-2 border-b border-border bg-[color:var(--rm-gray-1)]/40 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={open ? "Свернуть" : "Развернуть"}
        >
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.04em] text-muted-foreground">
          Глава {index + 1}
        </span>
        <span className="ml-2 truncate text-[length:var(--text-13)] font-medium text-foreground">
          {chapter.navLabel || "(без названия)"}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <IconBtn onClick={onMoveUp} disabled={index === 0} label="Выше">
            <ArrowUp className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={onMoveDown} disabled={index === total - 1} label="Ниже">
            <ArrowDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={onRemove} label="Удалить">
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-4 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Подпись в меню">
              <Input
                value={chapter.navLabel}
                onChange={(e) => {
                  const navLabel = e.target.value;
                  if (slugAutoSync) {
                    onUpdate({ navLabel, slug: slugify(navLabel) });
                  } else {
                    onUpdate({ navLabel });
                  }
                }}
                placeholder="Глава 1"
              />
            </Field>
            <Field
              label="Slug (URL)"
              hint={slugConflict ? "Дубликат slug в статье" : undefined}
              error={slugConflict}
            >
              <Input
                value={chapter.slug}
                onChange={(e) => {
                  setSlugAutoSync(false);
                  onUpdate({ slug: e.target.value });
                }}
                placeholder="glava-1"
              />
            </Field>
          </div>
          <p className="text-[length:var(--text-11)] text-muted-foreground">
            URL: <code>/media/{articleSlug}/{chapter.slug || "…"}</code>
          </p>
          <div>
            <h4 className="mb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-muted-foreground">
              Секции главы
            </h4>
            <ArticleSectionsEditor
              articleSlug={articleSlug}
              sections={chapter.sections}
              onChange={(next) => onUpdate({ sections: next })}
              otherChapters={otherChapters}
              onMoveToChapter={onMoveToChapter}
              onSplitChapterAt={onSplitChapterAt}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[length:var(--text-12)] text-muted-foreground">{label}</span>
      {children}
      {hint && (
        <span
          className={`text-[length:var(--text-11)] ${error ? "text-[color:var(--destructive,#ef4444)]" : "text-muted-foreground"}`}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

