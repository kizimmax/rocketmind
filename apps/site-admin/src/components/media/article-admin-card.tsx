"use client";

import { useRouter } from "next/navigation";
import {
  Pencil,
  Archive,
  ArchiveRestore,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  Image as ImageIcon,
  Calendar,
  Pin,
  PinOff,
  LayoutGrid,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@rocketmind/ui";
import type { Article } from "@/lib/types";
import { useAdminStore } from "@/lib/store";

interface Props {
  article: Article;
  viewMode?: "grid" | "list";
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  /** Pinned reordering — only in list mode. Если заданы, рендерится ведущая
   *  ячейка с ↑/↓ кнопками. */
  pinMove?: {
    onUp: () => void;
    onDown: () => void;
    canUp: boolean;
    canDown: boolean;
  };
}

const STATUS_BADGE: Record<
  string,
  { label: string; variant: "green-subtle" | "yellow-subtle" | "neutral" }
> = {
  published: { label: "Опубликована", variant: "green-subtle" },
  hidden: { label: "Скрыта", variant: "yellow-subtle" },
  archived: { label: "В архиве", variant: "neutral" },
};

// ── Shared action menu ─────────────────────────────────────────────────────

function ArticleActionsMenu({
  article,
  onArchive,
  onRestore,
  onDelete,
  onTogglePublish,
  onTogglePin,
  onToggleWide,
}: {
  article: Article;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onTogglePin: () => void;
  onToggleWide: () => void;
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Действия"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => router.push(`/media/${article.slug}`)}
        >
          <Pencil className="mr-2 h-4 w-4" /> Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onTogglePublish(article.id)}>
          {article.status === "published" ? (
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
          {article.pinned ? (
            <>
              <PinOff className="mr-2 h-4 w-4" /> Открепить
            </>
          ) : (
            <>
              <Pin className="mr-2 h-4 w-4" /> Закрепить
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onToggleWide}>
          <LayoutGrid className="mr-2 h-4 w-4" />
          {article.cardVariant === "wide"
            ? "Сделать обычной"
            : "Сделать широкой (2 колонки)"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {article.status === "archived" ? (
          <DropdownMenuItem onSelect={() => onRestore(article.id)}>
            <ArchiveRestore className="mr-2 h-4 w-4" /> Восстановить
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onArchive(article.id)}>
            <Archive className="mr-2 h-4 w-4" /> В архив
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={() => onDelete(article.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Админская карточка статьи. Два режима:
 *  - grid — плитка с обложкой 16:9, заголовком и тегами.
 *  - list — строка `<tr>` для табличного списка (используется внутри `<table>`).
 */
export function ArticleAdminCard({
  article,
  viewMode = "grid",
  onArchive,
  onRestore,
  onDelete,
  onTogglePublish,
  pinMove,
}: Props) {
  const router = useRouter();
  const { mediaTags, setArticlePinned, saveArticle } = useAdminStore();
  const status = STATUS_BADGE[article.status];

  function handleTogglePin() {
    setArticlePinned(article.id, !article.pinned);
  }

  function handleToggleWide() {
    saveArticle({
      ...article,
      cardVariant: article.cardVariant === "wide" ? "default" : "wide",
    });
  }

  const tags = article.tagIds
    .map((id) => mediaTags.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 3);

  // ── List (table row) ────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <tr
        className="group border-b border-border transition-colors last:border-b-0 hover:bg-muted/50 cursor-pointer"
        onClick={() => router.push(`/media/${article.slug}`)}
      >
        {/* Pinned move (optional leading cell) */}
        {pinMove && (
          <td
            className="w-12 py-2 pl-3 pr-1 align-middle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={pinMove.onUp}
                disabled={!pinMove.canUp}
                aria-label="Выше"
                title="Выше"
                className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={pinMove.onDown}
                disabled={!pinMove.canDown}
                aria-label="Ниже"
                title="Ниже"
                className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </td>
        )}

        {/* Thumbnail */}
        <td className="w-12 py-2 pl-3 pr-1 align-middle">
          {article.coverImageData ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={article.coverImageData}
              alt=""
              className="h-8 w-8 shrink-0 rounded-sm border border-border object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-dashed border-border">
              <ImageIcon className="h-3 w-3 text-muted-foreground/50" />
            </div>
          )}
        </td>

        {/* Title + badges */}
        <td className="py-2 px-2 align-middle">
          <div className="flex items-center gap-1.5">
            <span className="text-[length:var(--text-14)] font-semibold text-foreground line-clamp-1">
              {article.title || "Без названия"}
            </span>
            {article.pinned && (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-[color:var(--rm-yellow-100)] px-1 py-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] font-medium uppercase tracking-[0.02em] text-[color:var(--rm-yellow-fg)]"
                title="Закреплена"
              >
                <Pin className="h-2.5 w-2.5" strokeWidth={2} />
              </span>
            )}
            {article.cardVariant === "wide" && (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-[color:var(--rm-gray-3)] bg-background px-1 py-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] font-medium uppercase tracking-[0.02em] text-foreground"
                title="Широкая карточка"
              >
                <LayoutGrid className="h-2.5 w-2.5" strokeWidth={2} />2 кол
              </span>
            )}
          </div>
        </td>

        {/* Description */}
        <td className="hidden md:table-cell py-2 px-2 align-middle max-w-[320px]">
          <span className="text-[length:var(--text-12)] text-muted-foreground line-clamp-1">
            {article.description || "—"}
          </span>
        </td>

        {/* Tags */}
        <td className="hidden lg:table-cell py-2 px-2 align-middle">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {tags.map((t) =>
                t ? (
                  <span
                    key={t.id}
                    className="inline-flex items-center rounded-sm border border-border bg-background px-1 py-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground"
                  >
                    {t.label}
                  </span>
                ) : null,
              )}
              {article.tagIds.length > tags.length && (
                <span className="inline-flex items-center text-[length:var(--text-10)] text-muted-foreground">
                  +{article.tagIds.length - tags.length}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[length:var(--text-10)] text-muted-foreground/40">
              —
            </span>
          )}
        </td>

        {/* Date */}
        <td className="hidden sm:table-cell py-2 px-2 align-middle">
          <span className="inline-flex items-center gap-1 text-[length:var(--text-12)] text-muted-foreground tabular-nums">
            <Calendar className="h-3.5 w-3.5" />
            {article.publishedAt || "—"}
          </span>
        </td>

        {/* Status */}
        <td className="py-2 px-2 align-middle">
          {status && (
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          )}
        </td>

        {/* Slug path */}
        <td className="hidden xl:table-cell py-2 px-2 align-middle">
          <span className="text-[length:var(--text-10)] font-mono text-muted-foreground">
            /media/{article.slug}
          </span>
        </td>

        {/* Actions */}
        <td
          className="py-2 pr-3 pl-1 align-middle w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <ArticleActionsMenu
            article={article}
            onArchive={onArchive}
            onRestore={onRestore}
            onDelete={onDelete}
            onTogglePublish={onTogglePublish}
            onTogglePin={handleTogglePin}
            onToggleWide={handleToggleWide}
          />
        </td>
      </tr>
    );
  }

  // ── Grid (plitka) ───────────────────────────────────────────────────────
  return (
    <div className="group flex flex-col overflow-hidden rounded-sm border border-border bg-[color:var(--rm-gray-1)] transition-colors hover:border-[color:var(--rm-gray-4)]">
      {/* Cover */}
      <button
        type="button"
        onClick={() => router.push(`/media/${article.slug}`)}
        className="relative aspect-[16/9] w-full overflow-hidden bg-[color:var(--rm-gray-2)]"
      >
        {article.coverImageData ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageData}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        {(article.pinned || article.cardVariant === "wide") && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {article.pinned && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-[color:var(--rm-yellow-100)] px-1.5 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] font-medium uppercase tracking-[0.02em] text-[color:var(--rm-yellow-fg)]">
                <Pin className="h-3 w-3" strokeWidth={2} />
                Закреп
              </span>
            )}
            {article.cardVariant === "wide" && (
              <span className="inline-flex items-center gap-1 rounded-sm border border-[color:var(--rm-gray-3)] bg-background/80 px-1.5 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] font-medium uppercase tracking-[0.02em] text-foreground backdrop-blur-sm">
                <LayoutGrid className="h-3 w-3" strokeWidth={2} />2 кол
              </span>
            )}
          </div>
        )}
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant={status.variant} size="sm">
                {status.label}
              </Badge>
            )}
            <span className="inline-flex items-center gap-1 text-[length:var(--text-12)] text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {article.publishedAt}
            </span>
          </div>

          <ArticleActionsMenu
            article={article}
            onArchive={onArchive}
            onRestore={onRestore}
            onDelete={onDelete}
            onTogglePublish={onTogglePublish}
            onTogglePin={handleTogglePin}
            onToggleWide={handleToggleWide}
          />
        </div>

        <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase tracking-[-0.005em] leading-[1.2] text-foreground line-clamp-2">
          {article.title || "Без названия"}
        </h3>

        {article.description && (
          <p className="text-[length:var(--text-14)] leading-[1.4] text-muted-foreground line-clamp-2">
            {article.description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.map((t) =>
              t ? (
                <span
                  key={t.id}
                  className="inline-flex items-center rounded-sm border border-border bg-background px-1.5 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.02em] text-muted-foreground"
                >
                  {t.label}
                </span>
              ) : null,
            )}
            {article.tagIds.length > tags.length && (
              <span className="inline-flex items-center text-[length:var(--text-11)] text-muted-foreground">
                +{article.tagIds.length - tags.length}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
