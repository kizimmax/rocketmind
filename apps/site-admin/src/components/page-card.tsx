"use client";

import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Archive,
  ArchiveRestore,
  Trash2,
  GripVertical,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@rocketmind/ui";
import type { SitePage } from "@/lib/types";

const STATUS_BADGE: Record<
  string,
  { label: string; variant: string }
> = {
  published: { label: "Опубликована", variant: "green-subtle" },
  hidden: { label: "Скрыта", variant: "yellow-subtle" },
  archived: { label: "В архиве", variant: "neutral-subtle" },
};

interface PageCardProps {
  page: SitePage;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onGripDown?: () => void;
  onGripUp?: () => void;
}

export function PageCard({ page, onArchive, onRestore, onDelete, onGripDown, onGripUp }: PageCardProps) {
  const router = useRouter();
  const status = STATUS_BADGE[page.status] || STATUS_BADGE.hidden;
  const isArchived = page.status === "archived";

  return (
    <Card className="group relative transition-colors hover:border-foreground/20">
      <CardHeader>
        {/* Drag handle */}
        {onGripDown && (
          <div
            className="mr-1 cursor-grab text-muted-foreground opacity-0 transition-opacity select-none active:cursor-grabbing group-hover:opacity-100"
            onMouseDown={onGripDown}
            onMouseUp={onGripUp}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        <span className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-rm-gray-1 text-[length:var(--text-10)] font-medium text-muted-foreground">
          {page.order + 1}
        </span>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-[length:var(--text-16)] truncate">
            {page.menuTitle || page.cardTitle || "Без названия"}
          </CardTitle>
          <CardDescription className="mt-1 line-clamp-2 text-[length:var(--text-12)]">
            {page.menuDescription || page.cardDescription || "Нет описания"}
          </CardDescription>
        </div>
        <CardAction>
          <Badge variant={status.variant as never} size="sm">
            {status.label}
          </Badge>
        </CardAction>
      </CardHeader>

      <div className="flex items-center justify-between px-4 pb-4">
        <p className="text-[length:var(--text-10)] text-muted-foreground">
          /{page.sectionId}/{page.slug}
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push(`/pages/${encodeURIComponent(page.id)}`)}
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
              <DropdownMenuItem onClick={() => router.push(`/pages/${encodeURIComponent(page.id)}`)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Редактировать
              </DropdownMenuItem>
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
      </div>
    </Card>
  );
}
