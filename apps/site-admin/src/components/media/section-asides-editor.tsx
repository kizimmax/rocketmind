"use client";

import { useCallback } from "react";
import {
  FileText,
  Images,
  Link as LinkIcon,
  Package,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Switch,
} from "@rocketmind/ui";
import type { ArticleAside } from "@/lib/types";
import {
  AsideFileEditor,
  AsideLinkEditor,
  AsideLogosEditor,
  AsideProductEditor,
} from "./aside-item-editors";

interface Props {
  articleSlug: string;
  asides: ArticleAside[];
  title: string;
  titleEnabled: boolean;
  onChange: (next: ArticleAside[]) => void;
  onTitleChange: (title: string) => void;
  onTitleEnabledChange: (enabled: boolean) => void;
}

function newAsideId(): string {
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function makeAside(kind: ArticleAside["kind"]): ArticleAside {
  if (kind === "file")
    return {
      id: newAsideId(),
      kind: "file",
      fileUrl: "",
      fileName: "",
      displayName: "",
      showPreview: false,
    };
  if (kind === "link")
    return {
      id: newAsideId(),
      kind: "link",
      url: "",
      displayName: "",
      showPreview: false,
    };
  if (kind === "logos")
    return {
      id: newAsideId(),
      kind: "logos",
      logos: [],
    };
  return {
    id: newAsideId(),
    kind: "product",
    productSlug: "",
    productCategory: "consulting",
  };
}

export function SectionAsidesEditor({
  articleSlug,
  asides,
  title,
  titleEnabled,
  onChange,
  onTitleChange,
  onTitleEnabledChange,
}: Props) {
  const updateAside = useCallback(
    (id: string, next: ArticleAside) => {
      onChange(asides.map((a) => (a.id === id ? next : a)));
    },
    [asides, onChange],
  );

  const removeAside = useCallback(
    (id: string) => {
      onChange(asides.filter((a) => a.id !== id));
    },
    [asides, onChange],
  );

  const moveAside = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= asides.length || from === to) return;
      const arr = [...asides];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      onChange(arr);
    },
    [asides, onChange],
  );

  const addAside = useCallback(
    (kind: ArticleAside["kind"]) => {
      onChange([...asides, makeAside(kind)]);
    },
    [asides, onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Заголовок колонки + свитч */}
      <div className="flex items-center gap-2 rounded-sm border border-dashed border-border bg-background/50 px-2 py-1">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Материалы"
          disabled={!titleEnabled}
          className="h-6 border-0 bg-transparent px-1 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.02em] shadow-none focus-visible:ring-0 disabled:opacity-40"
        />
        <Switch
          checked={titleEnabled}
          onCheckedChange={onTitleEnabledChange}
          aria-label="Показывать заголовок колонки"
        />
      </div>

      {/* Список asides */}
      {asides.length === 0 ? (
        <p className="rounded-sm border border-dashed border-border bg-background/30 px-2 py-4 text-center text-[length:var(--text-11)] text-muted-foreground">
          Пусто. Добавьте файл, ссылку или продукт.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {asides.map((aside, idx) => {
            const common = {
              articleSlug,
              onRemove: () => removeAside(aside.id),
              onMoveUp: () => moveAside(idx, idx - 1),
              onMoveDown: () => moveAside(idx, idx + 1),
              canMoveUp: idx > 0,
              canMoveDown: idx < asides.length - 1,
            };
            if (aside.kind === "file")
              return (
                <AsideFileEditor
                  key={aside.id}
                  aside={aside}
                  onChange={(next) => updateAside(aside.id, next)}
                  {...common}
                />
              );
            if (aside.kind === "link")
              return (
                <AsideLinkEditor
                  key={aside.id}
                  aside={aside}
                  onChange={(next) => updateAside(aside.id, next)}
                  {...common}
                />
              );
            if (aside.kind === "logos")
              return (
                <AsideLogosEditor
                  key={aside.id}
                  aside={aside}
                  onChange={(next) => updateAside(aside.id, next)}
                  {...common}
                />
              );
            return (
              <AsideProductEditor
                key={aside.id}
                aside={aside}
                onChange={(next) => updateAside(aside.id, next)}
                {...common}
              />
            );
          })}
        </div>
      )}

      {/* Кнопка добавить */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background/50 px-2 py-1.5 text-[length:var(--text-11)] font-medium text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-[var(--rm-violet-100)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[180px]">
          <DropdownMenuItem onSelect={() => addAside("file")}>
            <FileText className="mr-2 h-4 w-4" /> Файл
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => addAside("link")}>
            <LinkIcon className="mr-2 h-4 w-4" /> Внешняя ссылка
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => addAside("product")}>
            <Package className="mr-2 h-4 w-4" /> Карточка продукта
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => addAside("logos")}>
            <Images className="mr-2 h-4 w-4" /> Логотипы
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
