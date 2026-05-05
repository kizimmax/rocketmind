"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus, ArrowUp, ArrowDown, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@rocketmind/ui";
import type { ArticleChapter } from "@/lib/types";
import { ArticleSectionsEditor } from "./article-sections-editor";

interface Props {
  articleSlug: string;
  chapters: unknown;
  onChange: (next: ArticleChapter[]) => void;
}

function newChapterId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function makeChapter(idx: number): ArticleChapter {
  const n = idx + 1;
  return {
    id: newChapterId(),
    slug: `glava-${n}`,
    title: `Глава ${n}`,
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
        title: typeof r.title === "string" ? r.title : "",
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
}: Props) {
  const chapters = useMemo(() => normalize(rawChapters), [rawChapters]);

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
      {chapters.map((ch, idx) => (
        <ChapterRow
          key={ch.id}
          articleSlug={articleSlug}
          chapter={ch}
          index={idx}
          total={chapters.length}
          slugConflict={!!ch.slug && slugConflicts.has(ch.slug)}
          onUpdate={(patch) => update(ch.id, patch)}
          onRemove={() => remove(ch.id)}
          onMoveUp={() => move(idx, idx - 1)}
          onMoveDown={() => move(idx, idx + 1)}
        />
      ))}
      <button
        type="button"
        onClick={() => insertAt(chapters.length)}
        className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background px-3 py-2 text-[length:var(--text-12)] font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-3.5 w-3.5" />
        Добавить главу
      </button>
    </div>
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
}) {
  const [open, setOpen] = useState(true);
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
          {chapter.title || chapter.navLabel || "(без названия)"}
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
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Slug (URL)" hint={slugConflict ? "Дубликат slug в статье" : undefined} error={slugConflict}>
              <Input
                value={chapter.slug}
                onChange={(e) => onUpdate({ slug: e.target.value })}
                placeholder="glava-1"
              />
            </Field>
            <Field label="Заголовок главы">
              <Input
                value={chapter.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Глава 1"
              />
            </Field>
            <Field label="Подпись в меню">
              <Input
                value={chapter.navLabel}
                onChange={(e) => onUpdate({ navLabel: e.target.value })}
                placeholder={chapter.title || "Глава 1"}
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

