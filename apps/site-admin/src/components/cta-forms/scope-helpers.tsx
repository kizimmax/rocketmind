"use client";

import { Tabs, TabsList, TabsTrigger } from "@rocketmind/ui";
import type { EntityScope } from "@/lib/types";

export const SCOPE_OPTIONS: { value: EntityScope; label: string }[] = [
  { value: "both", label: "Везде" },
  { value: "product", label: "Продукты" },
  { value: "article", label: "Статьи" },
];

export const SCOPE_LABEL: Record<EntityScope, string> = {
  both: "Везде",
  product: "Продукты",
  article: "Статьи",
};

export const ID_REGEX = /^[a-z0-9][a-z0-9-]*$/;

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "i", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "",
  ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/[а-яё]/g, (ch) => TRANSLIT[ch] ?? "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Если `base` свободен — возвращает его. Иначе — `base-2`, `base-3` и т.д.
 * Используется при авто-генерации id из названия, чтобы не натыкаться на 409
 * от API при сохранении.
 */
export function uniqueSlug(base: string, existing: Set<string>): string {
  if (!base) return "";
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export function ScopeFilter({
  value,
  onChange,
}: {
  value: EntityScope | "all";
  onChange: (v: EntityScope | "all") => void;
}) {
  const opts: Array<{ v: EntityScope | "all"; label: string }> = [
    { v: "all", label: "Все" },
    { v: "both", label: "Везде" },
    { v: "product", label: "Продукты" },
    { v: "article", label: "Статьи" },
  ];
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as EntityScope | "all")}>
      <TabsList size="sm">
        {opts.map((o) => (
          <TabsTrigger key={o.v} value={o.v}>
            {o.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export function ScopeSelect({
  value,
  onChange,
  size,
  className,
}: {
  value: EntityScope;
  onChange: (v: EntityScope) => void;
  size?: "sm";
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as EntityScope)}
      className={`rounded-sm border border-border bg-background px-2 text-[length:var(--text-12)] text-foreground ${
        size === "sm" ? "h-8" : "h-9"
      } ${className ?? ""}`}
    >
      {SCOPE_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
