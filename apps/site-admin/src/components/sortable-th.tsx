"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type SortDir = "asc" | "desc";
export type SortState<F extends string> = { field: F; dir: SortDir } | null;

interface Props<F extends string> {
  field: F;
  /** Текущее активное состояние сортировки (общее для всей таблицы). */
  active: SortState<F>;
  onChange: (next: SortState<F>) => void;
  children: React.ReactNode;
  /** Дополнительные классы для <th>. */
  className?: string;
}

/**
 * <th> с сортировкой по клику.
 *
 * Поведение:
 *  - неактивная колонка: тонкая «↕» иконка появляется на hover, ховер уйдёт —
 *    иконка прячется;
 *  - активная колонка (field совпал): «↑» (asc) или «↓» (desc), видна всегда;
 *  - клик: цикл neutral → asc → desc → neutral.
 *
 * Состояние общее на таблицу — переключение на другую колонку сбрасывает
 * предыдущую (передавайте active/onChange сверху).
 */
export function SortableTh<F extends string>({
  field,
  active,
  onChange,
  children,
  className,
}: Props<F>) {
  const isActive = active?.field === field;
  const dir = isActive ? active!.dir : null;

  function handle() {
    if (!isActive) {
      onChange({ field, dir: "asc" });
      return;
    }
    if (dir === "asc") {
      onChange({ field, dir: "desc" });
      return;
    }
    onChange(null);
  }

  return (
    <th className={className}>
      <button
        type="button"
        onClick={handle}
        className={`group inline-flex items-center gap-1 text-inherit transition-colors ${
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>{children}</span>
        <span
          className={`flex h-3 w-3 items-center justify-center transition-opacity ${
            isActive
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-60"
          }`}
        >
          {dir === "asc" ? (
            <ArrowUp className="h-3 w-3" strokeWidth={2} />
          ) : dir === "desc" ? (
            <ArrowDown className="h-3 w-3" strokeWidth={2} />
          ) : (
            <ArrowUpDown className="h-3 w-3" strokeWidth={1.75} />
          )}
        </span>
      </button>
    </th>
  );
}

/**
 * Универсальный компаратор: значения могут быть строкой, числом, null.
 * null/undefined всегда уходят в самый низ.
 */
export function compareValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
  dir: SortDir,
): number {
  const aMissing = a === null || a === undefined || a === "";
  const bMissing = b === null || b === undefined || b === "";
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  let cmp: number;
  if (typeof a === "number" && typeof b === "number") {
    cmp = a - b;
  } else {
    cmp = String(a).localeCompare(String(b), "ru", { sensitivity: "base" });
  }
  return dir === "asc" ? cmp : -cmp;
}
