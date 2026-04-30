"use client";

import { useRef, useState, useEffect } from "react";
import {
  ImagePlus,
  Upload,
  Trash2,
  Plus,
  X,
  UserCircle,
  Search,
  ChevronDown,
} from "lucide-react";
import {
  Breadcrumbs,
  Tag,
  Author,
  KeyThoughts,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Textarea,
} from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { apiFetch } from "@/lib/api-client";
import { useAdminStore } from "@/lib/store";
import type { Article, MediaTag } from "@/lib/types";

type Expert = {
  slug: string;
  name: string;
  image: string | null;
};

/**
 * Виртуальный автор «R-Редакция» — дефолт для новых статей. Не имеет .md-файла,
 * не возвращается из /api/experts; добавляется в начало списка пикера и
 * резолвится на сайте через getExpertBySlug("r-editorial").
 */
const EDITORIAL_EXPERT: Expert = {
  slug: "r-editorial",
  name: "R-Редакция",
  image: null,
};

interface Props {
  draft: Article;
  onChange: <K extends keyof Article>(field: K, value: Article[K]) => void;
}

/**
 * Hero-блок в редакторе статьи, стилизованный как hero на сайте (тёмная плашка).
 * Все поля — inline-editable: title, description, cover, tags, author, published date, key thoughts.
 */
export function ArticleHeroEditor({ draft, onChange }: Props) {
  const { mediaTags, upsertMediaTag } = useAdminStore();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [experts, setExperts] = useState<Expert[]>([EDITORIAL_EXPERT]);
  useEffect(() => {
    apiFetch("/api/experts")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setExperts(
          Array.isArray(data)
            ? [
                EDITORIAL_EXPERT,
                ...data.map(
                  (e: { slug: string; name: string; image?: string | null }) => ({
                    slug: e.slug,
                    name: e.name,
                    image: e.image ?? null,
                  }),
                ),
              ]
            : [EDITORIAL_EXPERT]
        )
      )
      .catch(() => setExperts([EDITORIAL_EXPERT]));
  }, []);

  const selectedExpert = experts.find((e) => e.slug === draft.expertSlug);
  const selectedTags: MediaTag[] = draft.tagIds
    .map((id) => mediaTags.find((t) => t.id === id))
    .filter((t): t is MediaTag => Boolean(t));

  function handleCoverUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange("coverImageData", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-sm bg-[#0A0A0A] px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-[1100px]">
        {/* Breadcrumbs preview (not editable) */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "#" },
              { label: "Медиа", href: "#" },
              { label: "Блог", href: "#" },
              { label: draft.title || "Название статьи" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] md:gap-6">
          {/* ── LEFT: title + description + cover ── */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <InlineEdit
                value={draft.title}
                onSave={(v) => onChange("title", v)}
                multiline
                placeholder="НАЗВАНИЕ СТАТЬИ"
              >
                <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[#F0F0F0] md:text-[44px] whitespace-pre-line">
                  {draft.title || "НАЗВАНИЕ СТАТЬИ"}
                </h1>
              </InlineEdit>

              <InlineEdit
                value={draft.description}
                onSave={(v) => onChange("description", v)}
                multiline
                copy
                placeholder="Короткое описание, которое появится под заголовком"
              >
                <p className="text-[length:var(--text-16)] leading-[1.28] text-[#F0F0F0] md:text-[length:var(--text-18)] md:leading-[1.2]">
                  {draft.description || "Короткое описание статьи"}
                </p>
              </InlineEdit>
            </div>

            {/* Cover */}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCoverUpload(f);
                e.target.value = "";
              }}
            />
            {draft.coverImageData ? (
              <div className="group/cover relative overflow-hidden rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.coverImageData}
                  alt=""
                  className="h-auto w-full object-cover md:h-[360px]"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover/cover:opacity-100">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex h-7 items-center gap-1 rounded-sm bg-[#1a1a1a]/80 px-2 text-[length:var(--text-11)] text-[#F0F0F0] backdrop-blur hover:bg-[#1a1a1a]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Заменить
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange("coverImageData", undefined)}
                    className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
                    aria-label="Удалить обложку"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
              >
                <ImagePlus className="h-7 w-7" />
                <span className="text-[length:var(--text-12)]">Загрузить обложку</span>
                <span className="text-[length:var(--text-10)] text-[#5C5C5C]">
                  16:9, JPG / PNG / WebP
                </span>
              </button>
            )}
          </div>

          {/* ── RIGHT: tags + author + key thoughts ── */}
          <aside className="flex flex-col gap-8 md:pl-[26px] md:border-l md:border-[#242424]">
            {/* Tags row */}
            <HeroTagsRow
              selectedTags={selectedTags}
              allTags={mediaTags}
              onChange={(ids) => onChange("tagIds", ids)}
              onCreate={(label) => {
                const t = upsertMediaTag(label);
                onChange("tagIds", [...draft.tagIds, t.id]);
              }}
            />

            {/* Author + date */}
            <div className="flex flex-col gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="group/author flex items-stretch gap-3 rounded-sm border border-dashed border-transparent px-2 py-1 text-left transition-colors hover:border-[#404040]"
                  >
                    {selectedExpert ? (
                      <Author
                        variant="full"
                        name={selectedExpert.name}
                        avatarUrl={selectedExpert.image}
                        showAvatarFallback={!!selectedExpert.image}
                      />
                    ) : (
                      <>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-[#5C5C5C]">
                          <UserCircle className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#939393]">
                            Выбрать автора
                          </span>
                        </div>
                      </>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 self-center text-[#5C5C5C] opacity-0 transition-opacity group-hover/author:opacity-100" />
                  </button>
                </DropdownMenuTrigger>
                <ExpertPickerContent
                  experts={experts}
                  selectedSlug={draft.expertSlug}
                  onSelect={(slug) => onChange("expertSlug", slug)}
                />
              </DropdownMenu>

              {/* Date control — compact, inline */}
              <label className="flex items-center gap-3 text-[length:var(--text-12)] text-[#5C5C5C]">
                <span className="font-[family-name:var(--font-mono-family)] uppercase tracking-[0.02em]">
                  Дата публикации
                </span>
                <input
                  type="date"
                  value={draft.publishedAt.slice(0, 10)}
                  onChange={(e) => onChange("publishedAt", e.target.value)}
                  className="h-7 rounded-sm border border-[#242424] bg-transparent px-2 text-[length:var(--text-12)] text-[#F0F0F0] focus:border-[#404040] focus:outline-none"
                />
              </label>
            </div>

            {/* Key thoughts */}
            <HeroKeyThoughtsEditor
              value={draft.keyThoughts}
              onChange={(next) => onChange("keyThoughts", next)}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tag row — inline for hero
// ─────────────────────────────────────────────────────────────────────────────

function HeroTagsRow({
  selectedTags,
  allTags,
  onChange,
  onCreate,
}: {
  selectedTags: MediaTag[];
  allTags: MediaTag[];
  onChange: (ids: string[]) => void;
  onCreate: (label: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const selectedIds = new Set(selectedTags.map((t) => t.id));

  const suggestions = allTags.filter(
    (t) =>
      !selectedIds.has(t.id) &&
      (query.trim() === "" || t.label.toLowerCase().includes(query.trim().toLowerCase()))
  );
  const exact = allTags.some(
    (t) => t.label.toLowerCase() === query.trim().toLowerCase()
  );

  function removeTag(id: string) {
    onChange(selectedTags.filter((t) => t.id !== id).map((t) => t.id));
  }

  function addTag(id: string) {
    onChange([...selectedTags.map((t) => t.id), id]);
    setQuery("");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedTags.map((t) => (
        <span
          key={t.id}
          className="group/tag relative inline-flex max-w-full items-center gap-2.5 rounded-[4px] border border-[#404040] bg-[#121212] px-2.5 py-1 min-h-7"
        >
          <span className="break-words [overflow-wrap:anywhere] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#939393]">
            {t.label}
          </span>
          <button
            type="button"
            onClick={() => removeTag(t.id)}
            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#404040] text-[#F0F0F0] opacity-0 transition-opacity group-hover/tag:opacity-100 hover:bg-destructive"
            aria-label={`Убрать тег ${t.label}`}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}

      {adding ? (
        <span className="relative inline-flex">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              // Delay close so clicks on suggestions fire first
              window.setTimeout(() => {
                setAdding(false);
                setQuery("");
              }, 150);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (suggestions.length > 0) {
                  addTag(suggestions[0].id);
                } else if (query.trim() && !exact) {
                  onCreate(query.trim());
                  setQuery("");
                }
              } else if (e.key === "Escape") {
                e.preventDefault();
                setAdding(false);
                setQuery("");
              }
            }}
            placeholder="название тега"
            className="h-7 w-44 rounded-[4px] border border-[#404040] bg-[#121212] px-2.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.02em] text-[#F0F0F0] placeholder:text-[#5C5C5C] placeholder:normal-case focus:border-[#FFCC00] focus:outline-none"
          />

          {(suggestions.length > 0 || (query.trim() && !exact)) && (
            <div className="absolute left-0 top-[calc(100%+4px)] z-30 flex w-[260px] max-h-[240px] flex-col overflow-y-auto rounded-sm border border-[#404040] bg-[#121212] shadow-lg">
              {suggestions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(t.id);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-left font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[#939393] transition-colors hover:bg-[#1a1a1a] hover:text-[#F0F0F0]"
                >
                  {t.label}
                </button>
              ))}
              {query.trim() && !exact && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onCreate(query.trim());
                    setQuery("");
                  }}
                  className={[
                    "flex items-center gap-2 px-3 py-2 text-left text-[length:var(--text-12)] text-[#FFCC00] transition-colors hover:bg-[#1a1a1a]",
                    suggestions.length > 0 ? "border-t border-[#242424]" : "",
                  ].join(" ")}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    Создать{" "}
                    <span className="font-[family-name:var(--font-mono-family)] uppercase tracking-[0.02em]">
                      «{query.trim()}»
                    </span>
                  </span>
                </button>
              )}
            </div>
          )}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-7 items-center gap-1 rounded-[4px] border border-dashed border-[#404040] px-2 text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
        >
          <Plus className="h-3 w-3" />
          <span className="text-[length:var(--text-12)]">тег</span>
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Expert picker dropdown content (search + list)
// ─────────────────────────────────────────────────────────────────────────────

function ExpertPickerContent({
  experts,
  selectedSlug,
  onSelect,
}: {
  experts: Expert[];
  selectedSlug?: string;
  onSelect: (slug: string | undefined) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = q.trim()
    ? experts.filter((e) =>
        e.name.toLowerCase().includes(q.trim().toLowerCase())
      )
    : experts;
  return (
    <DropdownMenuContent
      align="start"
      className="w-[320px] max-h-[400px] overflow-y-auto p-0"
    >
      <div className="sticky top-0 z-10 border-b border-border bg-background p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            size="sm"
            placeholder="Поиск эксперта"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      {selectedSlug && (
        <>
          <DropdownMenuItem onSelect={() => onSelect(undefined)}>
            <span className="text-muted-foreground">Убрать автора</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      {filtered.length === 0 ? (
        <div className="px-3 py-4 text-[length:var(--text-12)] text-muted-foreground">
          Ничего не найдено
        </div>
      ) : (
        filtered.map((e) => (
          <DropdownMenuItem
            key={e.slug}
            onSelect={() => onSelect(e.slug)}
            className="gap-2"
          >
            {e.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={e.image}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="flex-1 truncate">{e.name}</span>
            <span className="text-[10px] text-muted-foreground">{e.slug}</span>
          </DropdownMenuItem>
        ))
      )}
    </DropdownMenuContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Key thoughts editor styled for the dark hero panel
// ─────────────────────────────────────────────────────────────────────────────

function HeroKeyThoughtsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const MAX = 6;
  const [newText, setNewText] = useState("");

  function update(i: number, t: string) {
    onChange(value.map((v, j) => (j === i ? t : v)));
  }
  function remove(i: number) {
    onChange(value.filter((_, j) => j !== i));
  }
  function add() {
    const t = newText.trim();
    if (!t || value.length >= MAX) return;
    onChange([...value, t]);
    setNewText("");
  }

  return (
    <div className="flex flex-col gap-3 border-l border-[#242424] pl-[26px]">
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-wider text-[#5C5C5C]">
        Ключевые мысли
      </span>

      {value.length === 0 && (
        <p className="text-[length:var(--text-12)] italic text-[#5C5C5C]">
          Редактор ещё не закрепил тезисы. Добавьте ключевую мысль ниже.
        </p>
      )}

      {value.map((thought, i) => (
        <div key={i} className="group/thought relative">
          <InlineEdit
            value={thought}
            onSave={(v) => update(i, v)}
            multiline
            placeholder="Ключевая мысль…"
          >
            <span className="block font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393] pr-6">
              {thought}
            </span>
          </InlineEdit>
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-sm text-[#5C5C5C] opacity-0 transition-opacity group-hover/thought:opacity-100 hover:text-destructive"
            aria-label="Удалить тезис"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {value.length < MAX && (
        <div className="flex items-start gap-2">
          <Textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="+ ещё тезис"
            rows={2}
            className="min-h-0 flex-1 border-[#242424] bg-transparent text-[length:var(--text-14)] text-[#F0F0F0] placeholder:text-[#5C5C5C] focus-visible:border-[#404040] focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                add();
              }
            }}
          />
          <button
            type="button"
            onClick={add}
            disabled={!newText.trim()}
            className="flex h-7 items-center gap-1 rounded-sm border border-[#242424] px-2 text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00] disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
            <span className="text-[length:var(--text-12)]">Добавить</span>
          </button>
        </div>
      )}
    </div>
  );
}
