"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Loader2,
  MessageSquareQuote,
  Plus,
  Search,
  Trash2,
  Upload,
  UserCircle,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Textarea,
} from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import type { ArticleSectionQuote } from "@/lib/types";

interface ExpertListItem {
  slug: string;
  name: string;
  tag: string;
  image: string | null;
}

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/svg+xml";

let expertsCache: Promise<ExpertListItem[]> | null = null;
function loadExperts(): Promise<ExpertListItem[]> {
  if (!expertsCache) {
    expertsCache = apiFetch("/api/experts")
      .then((r) => (r.ok ? (r.json() as Promise<ExpertListItem[]>) : []))
      .catch(() => [] as ExpertListItem[]);
  }
  return expertsCache;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

async function uploadAvatar(
  articleSlug: string,
  file: File,
): Promise<{ url: string; fileName: string }> {
  const dataUrl = await readAsDataUrl(file);
  const res = await apiFetch(`/api/articles/${articleSlug}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "preview", dataUrl, fileName: file.name }),
  });
  if (!res.ok) {
    let err = "upload failed";
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) err = j.error;
    } catch {}
    throw new Error(err);
  }
  return (await res.json()) as { url: string; fileName: string };
}

function newQuoteId(): string {
  return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function makeQuote(): ArticleSectionQuote {
  return { id: newQuoteId() };
}

interface Props {
  articleSlug: string;
  quotes: ArticleSectionQuote[];
  onChange: (next: ArticleSectionQuote[]) => void;
}

export function SectionQuotesEditor({
  articleSlug,
  quotes,
  onChange,
}: Props) {
  const [experts, setExperts] = useState<ExpertListItem[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadExperts().then((list) => {
      if (!cancelled) setExperts(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateQuote = useCallback(
    (id: string, patch: Partial<ArticleSectionQuote>) => {
      onChange(
        quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)),
      );
    },
    [quotes, onChange],
  );

  const removeQuote = useCallback(
    (id: string) => onChange(quotes.filter((q) => q.id !== id)),
    [quotes, onChange],
  );

  const moveQuote = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= quotes.length || from === to) return;
      const arr = [...quotes];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      onChange(arr);
    },
    [quotes, onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      {quotes.length > 0 && (
        <div className="flex flex-col gap-2">
          {quotes.map((q, idx) => (
            <QuoteRow
              key={q.id}
              quote={q}
              articleSlug={articleSlug}
              experts={experts}
              onChange={(patch) => updateQuote(q.id, patch)}
              onRemove={() => removeQuote(q.id)}
              onMoveUp={() => moveQuote(idx, idx - 1)}
              onMoveDown={() => moveQuote(idx, idx + 1)}
              canMoveUp={idx > 0}
              canMoveDown={idx < quotes.length - 1}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => onChange([...quotes, makeQuote()])}
        className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background/50 px-2 py-1.5 text-[length:var(--text-11)] font-medium text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-[var(--rm-violet-100)]"
      >
        <Plus className="h-3.5 w-3.5" />
        {quotes.length === 0 ? "Добавить цитату эксперта" : "Добавить ещё цитату"}
      </button>
    </div>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

interface RowProps {
  quote: ArticleSectionQuote;
  articleSlug: string;
  experts: ExpertListItem[] | null;
  onChange: (patch: Partial<ArticleSectionQuote>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function QuoteRow({
  quote,
  articleSlug,
  experts,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: RowProps) {
  const expert = experts?.find((e) => e.slug === quote.expertSlug) ?? null;
  const effName = quote.name?.trim() || expert?.name || "";
  const effRole = quote.role?.trim() || expert?.tag || "";
  const effAvatar = quote.avatarUrl || expert?.image || null;

  const paragraphs = quote.paragraphs ?? [];
  const hasAnyParagraph = paragraphs.some((p) => p.trim().length > 0);

  function setParagraph(i: number, v: string) {
    const next = [...paragraphs];
    next[i] = v;
    onChange({ paragraphs: next });
  }

  function addParagraph() {
    onChange({ paragraphs: [...paragraphs, ""] });
  }

  function removeParagraph(i: number) {
    const next = paragraphs.filter((_, j) => j !== i);
    onChange({ paragraphs: next.length > 0 ? next : undefined });
  }

  function moveParagraph(from: number, to: number) {
    if (to < 0 || to >= paragraphs.length || from === to) return;
    const next = [...paragraphs];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange({ paragraphs: next });
  }

  return (
    <div className="group/quote rounded-sm border border-border bg-background/50 p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground">
          <MessageSquareQuote className="h-3 w-3" />
          Цитата эксперта
        </span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/quote:opacity-100">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Вверх"
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Вниз"
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            title="Удалить"
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Автор — кастомный dropdown (как в hero) или ручные поля */}
      <div className="mb-2 flex flex-col gap-1.5">
        <ExpertPickerDropdown
          experts={experts}
          selectedSlug={quote.expertSlug}
          onSelect={(slug) => onChange({ expertSlug: slug })}
        />

        {/* Ручные override-поля. Если expertSlug не выбран, они становятся
            источником. Если выбран — работают как override поверх эксперта. */}
        <div className="flex flex-col gap-1.5 pl-5">
          <Input
            value={quote.name ?? ""}
            onChange={(e) =>
              onChange({ name: e.target.value || undefined })
            }
            placeholder={
              expert ? `Имя (из эксперта: ${expert.name})` : "Имя автора"
            }
            className="h-7 text-[length:var(--text-12)]"
          />
          <Input
            value={quote.role ?? ""}
            onChange={(e) =>
              onChange({ role: e.target.value || undefined })
            }
            placeholder={
              expert ? `Должность (из эксперта: ${expert.tag})` : "Должность"
            }
            className="h-7 text-[length:var(--text-12)]"
          />
          <AvatarField
            articleSlug={articleSlug}
            value={quote.avatarUrl}
            fallback={expert?.image ?? null}
            onChange={(url) => onChange({ avatarUrl: url })}
          />
        </div>
      </div>

      {/* Label + параграфы */}
      <div className="mb-1 flex flex-col gap-1.5">
        <Input
          value={quote.label ?? ""}
          onChange={(e) =>
            onChange({ label: e.target.value || undefined })
          }
          placeholder="Короткий тезис (uppercase, Label 18)"
          className="h-7 text-[length:var(--text-12)]"
        />

        {paragraphs.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {paragraphs.map((p, i) => (
              <div key={i} className="group/para relative">
                <Textarea
                  value={p}
                  onChange={(e) => setParagraph(i, e.target.value)}
                  placeholder={`Параграф ${i + 1}`}
                  className="min-h-[56px] resize-none pr-14 text-[length:var(--text-12)] leading-[1.4]"
                />
                <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/para:opacity-100 group-focus-within/para:opacity-100">
                  <button
                    type="button"
                    onClick={() => moveParagraph(i, i - 1)}
                    disabled={i === 0}
                    title="Вверх"
                    className="flex h-5 w-5 items-center justify-center rounded-sm bg-background/80 text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveParagraph(i, i + 1)}
                    disabled={i === paragraphs.length - 1}
                    title="Вниз"
                    className="flex h-5 w-5 items-center justify-center rounded-sm bg-background/80 text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    title="Удалить параграф"
                    className="flex h-5 w-5 items-center justify-center rounded-sm bg-background/80 text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addParagraph}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background/50 px-2 py-1 text-[length:var(--text-11)] font-medium text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-[var(--rm-violet-100)]"
        >
          <Plus className="h-3 w-3" />
          {paragraphs.length === 0 ? "Добавить параграф" : "Добавить ещё параграф"}
        </button>
      </div>

      {!effName && !quote.expertSlug && (
        <p className="text-[length:var(--text-10)] text-[#ED4843]">
          Заполните имя или выберите эксперта.
        </p>
      )}
      {!quote.label && !hasAnyParagraph && (
        <p className="text-[length:var(--text-10)] text-muted-foreground">
          Добавьте хотя бы один текстовый блок (тезис или параграф).
        </p>
      )}
      {/* Невидимые отображаемые fallback-поля — для дебага в будущем. */}
      <span className="sr-only">
        {effName} · {effRole} · {effAvatar}
      </span>
    </div>
  );
}

// ── Expert picker dropdown (custom, with search) ───────────────────────────

function ExpertPickerDropdown({
  experts,
  selectedSlug,
  onSelect,
}: {
  experts: ExpertListItem[] | null;
  selectedSlug: string | undefined;
  onSelect: (slug: string | undefined) => void;
}) {
  const selected = experts?.find((e) => e.slug === selectedSlug) ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group/expert flex h-7 w-full items-center gap-2 rounded-sm border border-border bg-background px-2 text-left text-[length:var(--text-12)] text-foreground transition-colors hover:border-[var(--rm-violet-100)]"
        >
          <UserCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {selected ? (
            <span className="flex min-w-0 flex-1 items-center gap-2">
              {selected.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selected.image}
                  alt=""
                  className="h-4 w-4 shrink-0 rounded-full object-cover"
                />
              ) : null}
              <span className="truncate">
                {selected.name}
                <span className="text-muted-foreground"> · {selected.tag}</span>
              </span>
            </span>
          ) : (
            <span className="flex-1 truncate text-muted-foreground">
              Выбрать эксперта или ввести вручную
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <ExpertPickerContent
        experts={experts ?? []}
        selectedSlug={selectedSlug}
        onSelect={onSelect}
      />
    </DropdownMenu>
  );
}

function ExpertPickerContent({
  experts,
  selectedSlug,
  onSelect,
}: {
  experts: ExpertListItem[];
  selectedSlug?: string;
  onSelect: (slug: string | undefined) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = q.trim()
    ? experts.filter((e) =>
        `${e.name} ${e.tag}`.toLowerCase().includes(q.trim().toLowerCase()),
      )
    : experts;
  return (
    <DropdownMenuContent
      align="start"
      className="w-[320px] max-h-[360px] overflow-y-auto p-0"
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
            <span className="text-muted-foreground">Убрать эксперта</span>
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
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={e.image}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="flex flex-1 flex-col truncate">
              <span className="truncate">{e.name}</span>
              <span className="truncate text-[length:var(--text-10)] text-muted-foreground">
                {e.tag}
              </span>
            </span>
          </DropdownMenuItem>
        ))
      )}
    </DropdownMenuContent>
  );
}

// ── Avatar upload ──────────────────────────────────────────────────────────

function AvatarField({
  articleSlug,
  value,
  fallback,
  onChange,
}: {
  articleSlug: string;
  value: string | undefined;
  fallback: string | null;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shown = value || fallback || null;

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadAvatar(articleSlug, file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {shown ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={shown}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full border border-border object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
          <UserCircle className="h-4 w-4" />
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-11)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Upload className="h-3 w-3" />
        )}
        {value ? "Заменить" : fallback ? "Переопределить" : "Загрузить"}
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="text-[length:var(--text-10)] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          сбросить
        </button>
      )}
      {error && (
        <span className="text-[length:var(--text-10)] text-[#ED4843]">
          {error}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
