"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Archive,
  ArchiveRestore,
  Trash2,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  Button,
  Input,
  Tag,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@rocketmind/ui";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { useAdminStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { GlossaryTerm } from "@/lib/types";
import { SYSTEM_MEDIA_TAG_IDS } from "@/lib/types";

const STATUS_BADGE: Record<
  string,
  { label: string; variant: "green-subtle" | "yellow-subtle" | "neutral" }
> = {
  published: { label: "Опубликован", variant: "green-subtle" },
  hidden: { label: "Скрыт", variant: "yellow-subtle" },
  archived: { label: "В архиве", variant: "neutral" },
};

/**
 * GlossaryAdminPanel — вкладка «Глоссарий» внутри раздела МЕДИА.
 * Список терминов + фильтр по тегам + создание нового термина.
 * Клик по термину открывает /media/glossary/[slug] — страницу-заглушку с
 * метаданными (title / tags / SEO). Редактор содержимого будет на следующей
 * итерации.
 */
export function GlossaryAdminPanel() {
  const router = useRouter();
  const {
    glossaryTerms,
    mediaTags,
    createGlossaryTerm,
    setGlossaryTermStatus,
    setGlossaryTermPinned,
    deleteGlossaryTerm,
  } = useAdminStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [filterTagId, setFilterTagId] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const sorted = useMemo(
    () =>
      [...glossaryTerms].sort((a, b) => {
        // Закреплённые — первыми (по pinnedOrder asc), далее — по алфавиту.
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (a.pinned && b.pinned) return a.pinnedOrder - b.pinnedOrder;
        return a.title.localeCompare(b.title, "ru");
      }),
    [glossaryTerms],
  );
  const active = sorted.filter((t) => t.status !== "archived");
  const archived = sorted.filter((t) => t.status === "archived");

  const filtered = useMemo(() => {
    if (filterTagId === "all") return active;
    return active.filter((t) => t.tagIds.includes(filterTagId));
  }, [active, filterTagId]);

  function handleCreate() {
    const title = newTitle.trim();
    if (!title) return;
    const term = createGlossaryTerm(title);
    setNewTitle("");
    setIsCreating(false);
    toast.success(`Термин «${term.title}» создан`);
    router.push(`/media/glossary/${term.slug}`);
  }

  function handleArchive(id: string) {
    setGlossaryTermStatus(id, "archived");
    toast("Термин перемещён в архив", {
      action: {
        label: "Отменить",
        onClick: () => setGlossaryTermStatus(id, "hidden"),
      },
    });
  }

  function handleRestore(id: string) {
    setGlossaryTermStatus(id, "hidden");
    toast.success("Термин восстановлен");
  }

  function handleTogglePublish(term: GlossaryTerm) {
    const next = term.status === "published" ? "hidden" : "published";
    setGlossaryTermStatus(term.id, next);
    toast.success(next === "published" ? "Термин опубликован" : "Термин скрыт");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteGlossaryTerm(deleteTarget);
    setDeleteTarget(null);
    toast.success("Термин удалён");
  }

  async function handleBackfillMorph() {
    const id = toast.loading("Пересчёт падежей…");
    try {
      const res = await apiFetch("/api/glossary/backfill-morph", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { processed: number; updated: number };
      toast.success(
        `Падежи пересчитаны: ${data.updated} из ${data.processed}. Обновите страницу.`,
        { id },
      );
    } catch (e) {
      toast.error(`Ошибка: ${e instanceof Error ? e.message : String(e)}`, { id });
    }
  }

  return (
    <div>
      {/* Create + view toggle */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        {isCreating ? (
          <div className="flex items-center gap-2">
            <Input
              size="sm"
              placeholder="Название термина"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewTitle("");
                }
              }}
              autoFocus
              className="max-w-xs"
            />
            <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim()}>
              Создать
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewTitle("");
              }}
            >
              Отмена
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Добавить термин
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackfillMorph}
              title="Сгенерить падежи для всех терминов разом"
            >
              Пересчитать падежи
            </Button>
          </>
        )}
        </div>

        {/* View toggle — grid | list */}
        <div className="flex items-center gap-0.5 rounded-sm border border-border p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Карточки"
            title="Карточки"
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
              viewMode === "grid"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="Список"
            title="Список"
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
              viewMode === "list"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tag filter — без системных lesson/case (они применимы только к статьям). */}
      {(() => {
        const SYSTEM_IDS = new Set<string>(SYSTEM_MEDIA_TAG_IDS);
        const glossaryTags = mediaTags.filter((t) => !SYSTEM_IDS.has(t.id));
        if (glossaryTags.length === 0) return null;
        return (
          <div className="mb-6 flex flex-wrap gap-2">
            <Tag
              size="m"
              state={filterTagId === "all" ? "active" : "interactive"}
              as="button"
              onClick={() => setFilterTagId("all")}
            >
              Все термины
            </Tag>
            {glossaryTags.map((t) => (
              <Tag
                key={t.id}
                size="m"
                state={filterTagId === t.id ? "active" : "interactive"}
                as="button"
                onClick={() => setFilterTagId(t.id)}
              >
                {t.label}
              </Tag>
            ))}
          </div>
        );
      })()}

      {/* List */}
      {(() => {
        const tagLabels = mediaTags.reduce<Record<string, string>>(
          (acc, t) => {
            acc[t.id] = t.label;
            return acc;
          },
          {},
        );
        const renderTerm = (term: GlossaryTerm) => {
          const props = {
            term,
            tagLabels,
            onOpen: () => router.push(`/media/glossary/${term.slug}`),
            onArchive: () => handleArchive(term.id),
            onRestore: () => handleRestore(term.id),
            onDelete: () => setDeleteTarget(term.id),
            onTogglePublish: () => handleTogglePublish(term),
            onTogglePin: () =>
              setGlossaryTermPinned(term.id, !term.pinned),
          };
          return viewMode === "grid" ? (
            <GlossaryCard key={term.id} {...props} />
          ) : (
            <GlossaryRow key={term.id} {...props} />
          );
        };

        return (
          <>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
                {filterTagId === "all"
                  ? "Пока нет терминов. Создайте первый."
                  : "По выбранному тегу терминов нет."}
              </p>
            ) : viewMode === "grid" ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(renderTerm)}
              </div>
            ) : (
              <div className="divide-y divide-border rounded-sm border border-border">
                {filtered.map(renderTerm)}
              </div>
            )}

            {archived.length > 0 && (
              <div className="mt-10">
                <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
                  Архив ({archived.length})
                </p>
                {viewMode === "grid" ? (
                  <div className="grid gap-3 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
                    {archived.map(renderTerm)}
                  </div>
                ) : (
                  <div className="divide-y divide-border rounded-sm border border-border opacity-60">
                    {archived.map(renderTerm)}
                  </div>
                )}
              </div>
            )}
          </>
        );
      })()}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить термин?"
        description="Термин будет удалён навсегда. Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

function GlossaryRow({
  term,
  tagLabels,
  onOpen,
  onArchive,
  onRestore,
  onDelete,
  onTogglePublish,
  onTogglePin,
}: {
  term: GlossaryTerm;
  tagLabels: Record<string, string>;
  onOpen: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onTogglePin: () => void;
}) {
  const badge = STATUS_BADGE[term.status];
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--rm-gray-1)]">
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-16)] font-bold uppercase tracking-[-0.005em] leading-[1.2] text-foreground">
          {term.title || "Без названия"}
        </span>
        {term.pinned && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-[color:var(--rm-yellow-100)] px-1 py-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] font-medium uppercase tracking-[0.02em] text-[color:var(--rm-yellow-fg)]"
            title="Закреплён"
          >
            <Pin className="h-2.5 w-2.5" strokeWidth={2} />
          </span>
        )}
        {badge && (
          <Badge variant={badge.variant} size="sm">
            {badge.label}
          </Badge>
        )}
        {term.tagIds.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {term.tagIds.slice(0, 3).map((id) => (
              <span
                key={id}
                className="inline-flex items-center rounded-sm border border-border bg-background px-1.5 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.02em] text-muted-foreground"
              >
                {tagLabels[id] ?? id}
              </span>
            ))}
            {term.tagIds.length > 3 && (
              <span className="text-[length:var(--text-11)] text-muted-foreground">
                +{term.tagIds.length - 3}
              </span>
            )}
          </span>
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Действия"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onOpen}>
            <Pencil className="mr-2 h-4 w-4" /> Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onTogglePublish}>
            {term.status === "published" ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" /> Скрыть
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> Опубликовать
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onTogglePin}>
            {term.pinned ? (
              <>
                <PinOff className="mr-2 h-4 w-4" /> Открепить
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" /> Закрепить
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {term.status === "archived" ? (
            <DropdownMenuItem onSelect={onRestore}>
              <ArchiveRestore className="mr-2 h-4 w-4" /> Восстановить
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={onArchive}>
              <Archive className="mr-2 h-4 w-4" /> В архив
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function GlossaryCard({
  term,
  tagLabels,
  onOpen,
  onArchive,
  onRestore,
  onDelete,
  onTogglePublish,
  onTogglePin,
}: {
  term: GlossaryTerm;
  tagLabels: Record<string, string>;
  onOpen: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onTogglePin: () => void;
}) {
  const badge = STATUS_BADGE[term.status];
  return (
    <div className="group relative flex flex-col gap-3 rounded-sm border border-border bg-[color:var(--rm-gray-1)] p-4 transition-colors hover:border-[color:var(--rm-gray-4)]">
      {/* Top: pin/status badges + actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {term.pinned && (
            <span
              className="inline-flex items-center gap-1 rounded-sm bg-[color:var(--rm-yellow-100)] px-1.5 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] font-medium uppercase tracking-[0.02em] text-[color:var(--rm-yellow-fg)]"
              title="Закреплён"
            >
              <Pin className="h-2.5 w-2.5" strokeWidth={2} />
              Закреп
            </span>
          )}
          {badge && (
            <Badge variant={badge.variant} size="sm">
              {badge.label}
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Действия"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onOpen}>
              <Pencil className="mr-2 h-4 w-4" /> Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onTogglePublish}>
              {term.status === "published" ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" /> Скрыть
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" /> Опубликовать
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onTogglePin}>
              {term.pinned ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" /> Открепить
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" /> Закрепить
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {term.status === "archived" ? (
              <DropdownMenuItem onSelect={onRestore}>
                <ArchiveRestore className="mr-2 h-4 w-4" /> Восстановить
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={onArchive}>
                <Archive className="mr-2 h-4 w-4" /> В архив
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title (clickable) */}
      <button
        type="button"
        onClick={onOpen}
        className="text-left"
      >
        <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-[-0.01em] leading-[1.16] text-foreground line-clamp-2">
          {term.title || "Без названия"}
        </h3>
        {term.description && (
          <p className="mt-2 text-[length:var(--text-12)] leading-[1.35] text-muted-foreground line-clamp-3">
            {term.description}
          </p>
        )}
      </button>

      {/* Tags */}
      {term.tagIds.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5">
          {term.tagIds.slice(0, 3).map((id) => (
            <span
              key={id}
              className="inline-flex items-center rounded-sm border border-border bg-background px-1.5 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground"
            >
              {tagLabels[id] ?? id}
            </span>
          ))}
          {term.tagIds.length > 3 && (
            <span className="text-[length:var(--text-10)] text-muted-foreground">
              +{term.tagIds.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
