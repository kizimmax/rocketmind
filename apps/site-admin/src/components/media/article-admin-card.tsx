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
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

const STATUS_BADGE: Record<
  string,
  { label: string; variant: "green-subtle" | "yellow-subtle" | "neutral" }
> = {
  published: { label: "Опубликована", variant: "green-subtle" },
  hidden: { label: "Скрыта", variant: "yellow-subtle" },
  archived: { label: "В архиве", variant: "neutral" },
};

/**
 * Админская карточка статьи — компактная плитка для списка.
 * Кавер (если есть) + заголовок + теги + статус + действия.
 */
export function ArticleAdminCard({
  article,
  onArchive,
  onRestore,
  onDelete,
  onTogglePublish,
}: Props) {
  const router = useRouter();
  const { mediaTags } = useAdminStore();
  const status = STATUS_BADGE[article.status];

  const tags = article.tagIds
    .map((id) => mediaTags.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 3);

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
              ) : null
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
