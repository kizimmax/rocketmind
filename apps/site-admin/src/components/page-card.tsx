"use client";

import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Archive,
  ArchiveRestore,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Star,
  Settings,
} from "lucide-react";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@rocketmind/ui";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import { SYNTHETIC_PAGE_IDS } from "@/lib/constants";
import type { SitePage } from "@/lib/types";

const STATUS_BADGE: Record<
  string,
  { label: string; variant: string }
> = {
  published: { label: "Опубликована", variant: "green-subtle" },
  hidden: { label: "Скрыта", variant: "yellow-subtle" },
  archived: { label: "В архиве", variant: "neutral-subtle" },
};

/** Extract cover thumbnail data URL from hero block */
function getCoverData(page: SitePage): string | null {
  const hero = page.blocks.find((b) => b.type === "hero");
  return (hero?.data?.heroImageData as string) || null;
}

/** Whether this section uses full-width cover images (vs icons) */
function isImageSection(sectionId: string): boolean {
  return sectionId === "academy" || sectionId === "ai-products" || sectionId === "media";
}

/**
 * Два мини-индикатора: «в меню» (МЕНЮ) и «в футере» (ФУТЕР) для продуктовых
 * разделов. undefined → включено (default true). Выключенное — приглушено +
 * зачёркнуто, чтобы при беглом просмотре списка видеть, что страница не
 * попадает в соответствующий раздел сайта.
 */
function VisibilityDots({ page }: { page: SitePage }) {
  const inMenu = page.showInMenu !== false;
  const inFooter = page.showInFooter !== false;
  const onCn =
    "shrink-0 rounded-sm border border-[color:var(--rm-yellow-100)]/30 bg-[color:var(--rm-yellow-100)]/10 px-1 py-px text-[9px] font-medium uppercase tracking-[0.04em] text-[color:var(--rm-yellow-100)]";
  const offCn =
    "shrink-0 rounded-sm border border-border bg-muted/30 px-1 py-px text-[9px] font-medium uppercase tracking-[0.04em] text-muted-foreground/50 line-through";
  return (
    <span className="flex items-center gap-1">
      <span className={inMenu ? onCn : offCn} title={inMenu ? "В меню" : "Скрыта в меню"}>
        меню
      </span>
      <span className={inFooter ? onCn : offCn} title={inFooter ? "В футере" : "Скрыта в футере"}>
        футер
      </span>
    </span>
  );
}

/** Build a display path for the cover asset */
function getCoverPath(page: SitePage): string {
  return `images/products/${page.sectionId}/${page.slug}/cover.*`;
}

/**
 * Extract card tag: "Экспертный продукт", "Мини-кейс", or null.
 * Большие кейсы — теперь Article(type=case), на /cases-секции SitePage остался
 * только mini.
 */
function getCardTag(page: SitePage): string | null {
  if (page.sectionId === "cases") return "Мини-кейс";
  const expertsBlock = page.blocks.find((b) => b.type === "experts");
  const experts = expertsBlock?.data?.experts as string[] | undefined;
  if (experts && experts.length > 0) return "Экспертный продукт";
  return null;
}

// ── Shared action buttons ─────────────────────────────────────────────────

function PageActions({
  page,
  isArchived,
  onArchive,
  onRestore,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}: {
  page: SitePage;
  isArchived: boolean;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
}) {
  const router = useRouter();
  const isPublished = page.status === "published";
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => router.push(`/pages/${page.id}`)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/pages/${page.id}`)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Редактировать
          </DropdownMenuItem>
          {!isArchived && (
            <DropdownMenuItem onClick={() => onTogglePublish(page.id)}>
              {isPublished ? (
                <>
                  <EyeOff className="mr-2 h-3.5 w-3.5" />
                  Скрыть
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Опубликовать
                </>
              )}
            </DropdownMenuItem>
          )}
          {onToggleFeatured && page.sectionId === "cases" && !isArchived && (
            <DropdownMenuItem onClick={() => onToggleFeatured(page.id)}>
              <Star
                className={`mr-2 h-3.5 w-3.5 ${page.featured ? "fill-[color:var(--rm-yellow-100)] text-[color:var(--rm-yellow-100)]" : ""}`}
              />
              {page.featured ? "Убрать с общего показа" : "Отображать на всех страницах"}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {isArchived ? (
            <DropdownMenuItem onClick={() => onRestore(page.id)}>
              <ArchiveRestore className="mr-2 h-3.5 w-3.5" />
              Восстановить
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onArchive(page.id)}>
              <Archive className="mr-2 h-3.5 w-3.5" />
              В архив
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-[var(--rm-red-500)]"
            onClick={() => onDelete(page.id)}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Grid card (mini product card) ─────────────────────────────────────────

interface PageCardProps {
  page: SitePage;
  viewMode?: "grid" | "list";
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
  /** Cases section only — toggle the "show on all pages" flag. */
  onToggleFeatured?: (id: string) => void;
  onGripDown?: () => void;
  onGripUp?: () => void;
  /** Index of this card in the active list. Required alongside onMove/count for arrow move buttons. */
  index?: number;
  count?: number;
  onMove?: (from: number, dir: "up" | "down") => void;
  /** Drag props for list-mode <tr> (applied directly since no wrapper div) */
  dragProps?: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    isDragging: boolean;
  };
}

export function PageCard({ page, viewMode = "grid", onArchive, onRestore, onDelete, onTogglePublish, onToggleFeatured, onGripDown, onGripUp, index, count, onMove, dragProps }: PageCardProps) {
  const router = useRouter();

  // «Системный» макет: title + description + pencil без номера, drag-handle,
  // dropdown'а статусов и удаления. Применяется к:
  //   - синтетическим страницам (без .md, со своим редактором);
  //   - всем страницам секции «Уникальные» (home/about/cases-index и т.п.) —
  //     это служебные страницы, не карточки контента.
  if (SYNTHETIC_PAGE_IDS.has(page.id) || page.sectionId === "unique") {
    return <SyntheticPageCard page={page} viewMode={viewMode} dragProps={dragProps} />;
  }

  const status = STATUS_BADGE[page.status] || STATUS_BADGE.hidden;
  const isArchived = page.status === "archived";
  const isMiniCase = page.sectionId === "cases" && page.caseType === "mini";
  const cover = isMiniCase ? null : getCoverData(page);
  const isImage = isImageSection(page.sectionId);
  const coverPath = getCoverPath(page);
  const tag = getCardTag(page);

  // ── List (table row) ──────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <tr
        className={`group border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${dragProps?.isDragging ? "opacity-50" : ""}`}
        onClick={() => router.push(`/pages/${page.id}`)}
        draggable={dragProps?.draggable}
        onDragStart={dragProps?.onDragStart}
        onDragOver={dragProps?.onDragOver}
        onDrop={dragProps?.onDrop}
        onDragEnd={dragProps?.onDragEnd}
      >
        {/* # */}
        <td className="w-8 py-2 pl-3 pr-1 text-center align-middle">
          <div className="flex items-center gap-1">
            {onGripDown && (
              <div
                className="cursor-grab text-muted-foreground opacity-0 transition-opacity select-none active:cursor-grabbing group-hover:opacity-100"
                onMouseDown={(e) => { e.stopPropagation(); onGripDown(); }}
                onMouseUp={(e) => { e.stopPropagation(); onGripUp?.(); }}
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-3.5 w-3.5" />
              </div>
            )}
            {onMove && typeof index === "number" && typeof count === "number" && (
              <div
                className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <ItemMoveButtons index={index} count={count} onMove={onMove} size={16} />
              </div>
            )}
            <span className="text-[length:var(--text-12)] text-muted-foreground tabular-nums">
              {page.order + 1}
            </span>
          </div>
        </td>

        {/* Thumbnail — skipped for mini cases (no image at all) */}
        {!isMiniCase && (
          <td className="w-10 py-2 px-1 align-middle">
            {cover ? (
              <div
                className={`h-8 w-8 shrink-0 rounded-sm border border-border ${isImage ? "bg-cover bg-center" : "bg-contain bg-center bg-no-repeat"}`}
                style={{ backgroundImage: `url(${cover})` }}
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-dashed border-border">
                <ImageIcon className="h-3 w-3 text-muted-foreground/50" />
              </div>
            )}
          </td>
        )}

        {/* Title + Tag */}
        <td className="py-2 px-2 align-middle">
          <div className="flex items-center gap-1.5">
            <span className="text-[length:var(--text-14)] font-semibold text-foreground line-clamp-1">
              {page.menuTitle || page.cardTitle || "Без названия"}
            </span>
            {tag && (
              <span className="shrink-0 rounded-sm bg-[color:var(--rm-yellow-100)]/10 px-1.5 py-0.5 text-[length:var(--text-10)] font-medium text-[color:var(--rm-yellow-100)]">
                {tag}
              </span>
            )}
            {page.sectionId === "cases" && onToggleFeatured && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleFeatured(page.id); }}
                className="shrink-0 rounded-sm p-0.5 text-muted-foreground transition hover:bg-foreground/10"
                aria-label={page.featured ? "На всех страницах" : "Сделать общим"}
                title={page.featured ? "На всех страницах — кликните, чтобы убрать" : "Отображать на всех страницах"}
              >
                <Star
                  className={`h-3.5 w-3.5 ${page.featured ? "fill-[color:var(--rm-yellow-100)] text-[color:var(--rm-yellow-100)]" : ""}`}
                />
              </button>
            )}
          </div>
        </td>

        {/* Description (hidden on small screens) */}
        <td className="hidden md:table-cell py-2 px-2 align-middle max-w-[260px]">
          <span className="text-[length:var(--text-12)] text-muted-foreground line-clamp-1">
            {page.menuDescription || page.cardDescription || "—"}
          </span>
        </td>

        {/* Cover path */}
        <td className="hidden lg:table-cell py-2 px-2 align-middle">
          {cover ? (
            <span className="text-[length:var(--text-10)] font-mono text-muted-foreground/70 line-clamp-1">
              {coverPath}
            </span>
          ) : (
            <span className="text-[length:var(--text-10)] text-muted-foreground/40">—</span>
          )}
        </td>

        {/* Status */}
        <td className="py-2 px-2 align-middle">
          <Badge variant={status.variant as never} size="sm">
            {status.label}
          </Badge>
        </td>

        {/* Path */}
        <td className="hidden sm:table-cell py-2 px-2 align-middle">
          <span className="text-[length:var(--text-10)] font-mono text-muted-foreground">
            /{page.sectionId}/{page.slug}
          </span>
        </td>

        {/* Actions */}
        <td className="py-2 pr-3 pl-1 align-middle" onClick={(e) => e.stopPropagation()}>
          <PageActions page={page} isArchived={isArchived} onArchive={onArchive} onRestore={onRestore} onDelete={onDelete} onTogglePublish={onTogglePublish} onToggleFeatured={onToggleFeatured} />
        </td>
      </tr>
    );
  }

  // ── Grid (mini product card) ──────────────────────────────────────────

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-foreground/25 cursor-pointer"
      onClick={() => router.push(`/pages/${page.id}`)}
    >
      {/* Drag handle — top-left, visible on hover */}
      {onGripDown && (
        <div
          className="absolute left-1.5 top-1.5 z-10 cursor-grab rounded-sm bg-background/80 p-0.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity select-none active:cursor-grabbing group-hover:opacity-100"
          onMouseDown={(e) => { e.stopPropagation(); onGripDown(); }}
          onMouseUp={(e) => { e.stopPropagation(); onGripUp?.(); }}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Arrow move buttons — just to the right of drag handle */}
      {onMove && typeof index === "number" && typeof count === "number" && (
        <div
          className="absolute left-7 top-1.5 z-10 flex items-center gap-0.5 rounded-sm bg-background/80 p-0.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <ItemMoveButtons index={index} count={count} onMove={onMove} size={18} />
        </div>
      )}

      {/* Thumbnail area — skipped for mini cases (no image at all) */}
      {!isMiniCase && (isImage ? (
        /* Image-style cover (academy / ai-products / media) — 4:3 landscape */
        <div className="relative aspect-[4/3] w-full bg-muted/30">
          {cover ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${cover})` }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
        </div>
      ) : (
        /* Icon-style cover (consulting) — small square */
        <div className="flex h-[80px] items-center px-4 pt-4">
          {cover ? (
            <div
              className="h-[56px] w-[56px] shrink-0 rounded-sm bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${cover})` }}
            />
          ) : (
            <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-sm border border-dashed border-border text-muted-foreground/30">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </div>
      ))}

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 px-4 pb-3 pt-2">
        {/* Order + Tag + Status */}
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-muted text-[length:var(--text-10)] font-medium text-muted-foreground">
            {page.order + 1}
          </span>
          {tag && (
            <span className="truncate rounded-sm bg-[color:var(--rm-yellow-100)]/10 px-1.5 py-0.5 text-[length:var(--text-10)] font-medium text-[color:var(--rm-yellow-100)]">
              {tag}
            </span>
          )}
          {page.sectionId === "cases" && onToggleFeatured && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleFeatured(page.id); }}
              className="shrink-0 rounded-sm p-0.5 text-muted-foreground transition hover:bg-foreground/10"
              aria-label={page.featured ? "На всех страницах" : "Сделать общим"}
              title={page.featured ? "На всех страницах — кликните, чтобы убрать" : "Отображать на всех страницах"}
            >
              <Star
                className={`h-3.5 w-3.5 ${page.featured ? "fill-[color:var(--rm-yellow-100)] text-[color:var(--rm-yellow-100)]" : ""}`}
              />
            </button>
          )}
          {(page.sectionId === "consulting" ||
            page.sectionId === "academy" ||
            page.sectionId === "ai-products") && (
            <VisibilityDots page={page} />
          )}
          <span className="ml-auto shrink-0">
            <Badge variant={status.variant as never} size="sm">
              {status.label}
            </Badge>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-14)] font-bold uppercase leading-[1.2] tracking-tight text-foreground line-clamp-2 min-h-[2.4em]">
          {page.menuTitle || page.cardTitle || "Без названия"}
        </h3>

        {/* Description */}
        <p className="text-[length:var(--text-12)] leading-[1.32] text-muted-foreground line-clamp-2">
          {page.menuDescription || page.cardDescription || "Нет описания"}
        </p>

        {/* Footer: paths + actions */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[length:var(--text-10)] font-mono text-muted-foreground truncate">
              /{page.sectionId}/{page.slug}
            </span>
            {cover && (
              <span className="text-[length:var(--text-10)] font-mono text-muted-foreground/50 truncate">
                {coverPath}
              </span>
            )}
          </div>
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <PageActions page={page} isArchived={isArchived} onArchive={onArchive} onRestore={onRestore} onDelete={onDelete} onTogglePublish={onTogglePublish} onToggleFeatured={onToggleFeatured} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Synthetic page card (system-level entries, no .md source) ─────────────

function SyntheticPageCard({
  page,
  viewMode,
  dragProps,
}: {
  page: SitePage;
  viewMode: "grid" | "list";
  dragProps?: PageCardProps["dragProps"];
}) {
  const router = useRouter();
  const open = () => router.push(`/pages/${page.id}`);

  const systemBadge = (
    <span className="shrink-0 rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[length:var(--text-10)] font-medium uppercase tracking-wider text-foreground">
      Системная
    </span>
  );

  if (viewMode === "list") {
    return (
      <tr
        className={`group border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${dragProps?.isDragging ? "opacity-50" : ""}`}
        onClick={open}
      >
        <td className="w-8 py-2 pl-3 pr-1 text-center align-middle">
          <span className="text-[length:var(--text-12)] text-muted-foreground/40">—</span>
        </td>
        <td className="w-10 py-2 px-1 align-middle">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-dashed border-border text-muted-foreground/60">
            <Settings className="h-3.5 w-3.5" />
          </div>
        </td>
        <td className="py-2 px-2 align-middle">
          <div className="flex items-center gap-1.5">
            <span className="text-[length:var(--text-14)] font-semibold text-foreground line-clamp-1">
              {page.menuTitle || page.cardTitle}
            </span>
            {systemBadge}
          </div>
        </td>
        <td className="hidden md:table-cell py-2 px-2 align-middle max-w-[260px]">
          <span className="text-[length:var(--text-12)] text-muted-foreground line-clamp-1">
            {page.menuDescription || page.cardDescription}
          </span>
        </td>
        <td className="hidden lg:table-cell py-2 px-2 align-middle">
          <span className="text-[length:var(--text-10)] text-muted-foreground/40">—</span>
        </td>
        <td className="py-2 px-2 align-middle">
          <span className="text-[length:var(--text-10)] text-muted-foreground/40">—</span>
        </td>
        <td className="hidden sm:table-cell py-2 px-2 align-middle">
          <span className="text-[length:var(--text-10)] font-mono text-muted-foreground/40">—</span>
        </td>
        <td className="py-2 pr-3 pl-1 align-middle" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon-sm" onClick={open}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-foreground/25 cursor-pointer"
      onClick={open}
    >
      <div className="flex h-[80px] items-center px-4 pt-4">
        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-sm border border-dashed border-border text-muted-foreground/60">
          <Settings className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pb-3 pt-2">
        <div className="flex items-center gap-1.5">
          {systemBadge}
        </div>
        <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-14)] font-bold uppercase leading-[1.2] tracking-tight text-foreground line-clamp-2 min-h-[2.4em]">
          {page.menuTitle || page.cardTitle}
        </h3>
        <p className="text-[length:var(--text-12)] leading-[1.32] text-muted-foreground line-clamp-2">
          {page.menuDescription || page.cardDescription}
        </p>
        <div className="mt-auto flex items-end justify-end pt-1">
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon-sm" onClick={open}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
