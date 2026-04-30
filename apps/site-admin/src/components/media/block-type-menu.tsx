"use client";

import {
  Film,
  GalleryHorizontal,
  Heading3,
  Heading4,
  Image as ImageIcon,
  Pilcrow,
  Quote,
  Table as TableIcon,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@rocketmind/ui";
import type { ArticleBodyBlockType } from "@/lib/types";

const ITEMS: {
  type: ArticleBodyBlockType;
  label: string;
  icon: LucideIcon;
  hint?: string;
}[] = [
  { type: "h3", label: "Заголовок H3", icon: Heading3 },
  { type: "h4", label: "Заголовок H4", icon: Heading4 },
  { type: "paragraph", label: "Параграф", icon: Pilcrow },
  { type: "quote", label: "Цитата", icon: Quote },
  { type: "image", label: "Изображение", icon: ImageIcon },
  { type: "gallery", label: "Галерея", icon: GalleryHorizontal },
  { type: "video", label: "Видео", icon: Film },
  { type: "table", label: "Таблица", icon: TableIcon },
];

interface Props {
  onSelect: (type: ArticleBodyBlockType) => void;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BlockTypeMenu({
  onSelect,
  children,
  align = "start",
  side = "bottom",
  open,
  onOpenChange,
}: Props) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="min-w-[200px]">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.type} onSelect={() => onSelect(item.type)}>
              <Icon className="mr-2 h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.hint && (
                <span className="ml-2 text-[length:var(--text-10)] text-muted-foreground">
                  {item.hint}
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
