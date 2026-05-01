"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"

export type GlossaryTermItem = {
  slug: string
  title: string
  /** Href куда ведёт ссылка на термин. Обычно `/media/glossary/{slug}`. */
  href: string
  tagIds?: string[]
  /** Короткое описание (для карточки в горизонтальной ленте). */
  description?: string
  /** Закреплён ли в админке — отображается первым в горизонтальной ленте. */
  pinned?: boolean
  /** Порядок среди закреплённых (asc). */
  pinnedOrder?: number
}

export type GlossaryScript = "cyrillic" | "latin"

/**
 * Возвращает скрипт первой буквы (cyrillic/latin). Используется для разделения
 * списка на две вкладки А-Я / A-Z. Термины не на буквах (#, цифры) попадают
 * в latin bucket.
 */
export function getGlossaryTermScript(title: string): GlossaryScript {
  const ch = title.trim().charAt(0)
  return /[А-Яа-яЁё]/.test(ch) ? "cyrillic" : "latin"
}

/**
 * Группирующая буква (uppercase). Ё схлопывается в Е. Для не-буквенных
 * символов возвращает "#".
 */
export function getGlossaryTermLetter(title: string): string {
  const ch = title.trim().charAt(0).toUpperCase()
  if (/[А-ЯЁ]/.test(ch)) return ch === "Ё" ? "Е" : ch
  if (/[A-Z]/.test(ch)) return ch
  return "#"
}

type LetterGroup = { letter: string; items: GlossaryTermItem[] }

function groupByLetter(items: GlossaryTermItem[]): LetterGroup[] {
  const map = new Map<string, GlossaryTermItem[]>()
  for (const it of items) {
    const letter = getGlossaryTermLetter(it.title)
    const bucket = map.get(letter) ?? []
    bucket.push(it)
    map.set(letter, bucket)
  }
  // Кириллица первой, потом латиница, в конце "#" для не-буквенных.
  const letters = Array.from(map.keys()).sort((a, b) => {
    const scriptOf = (l: string): number =>
      /[А-ЯЁ]/.test(l) ? 0 : /[A-Z]/.test(l) ? 1 : 2
    const sa = scriptOf(a)
    const sb = scriptOf(b)
    if (sa !== sb) return sa - sb
    return a.localeCompare(b, "ru")
  })
  return letters.map((letter) => ({
    letter,
    items: (map.get(letter) ?? []).sort((a, b) =>
      a.title.localeCompare(b.title, "ru"),
    ),
  }))
}

// ── GlossaryWidget (правая колонка /media) ─────────────────────────────────

export interface GlossaryWidgetProps extends React.HTMLAttributes<HTMLElement> {
  /** Все термины. Компонент сам сортирует и группирует. */
  items: GlossaryTermItem[]
  /** Ссылка на full-страницу глоссария. Дефолт `/media/glossary`. */
  fullPageHref?: string
  /** Заголовок виджета. Дефолт «ГЛОССАРИЙ». */
  heading?: string
  /** Placeholder поиска. */
  searchPlaceholder?: string
  /** Максимум терминов всего. По дефолту показываем все. */
  maxItems?: number
  /**
   * Если задано — шапка (название + ссылка + поиск) закрепляется `sticky`
   * на указанном значении `top` (CSS value, напр. "7rem"). Список терминов
   * прокручивается вместе со страницей и уходит в фейд под шапкой через
   * gradient-хвост. Если не задано — классическая раскладка одной карточкой.
   */
  stickyTop?: string
}

/**
 * GlossaryWidget — aside-колонка на /media с превью глоссария.
 * Показывает header со стрелкой (ссылка на полный глоссарий), поиск
 * и сгруппированный по буквам список терминов.
 */
export function GlossaryWidget({
  items,
  fullPageHref = "/media/glossary",
  heading = "Глоссарий",
  searchPlaceholder = "Найти термин",
  maxItems,
  stickyTop,
  className,
  ...props
}: GlossaryWidgetProps) {
  const [query, setQuery] = React.useState("")
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const src = q
      ? items.filter((i) => i.title.toLowerCase().includes(q))
      : items
    return maxItems ? src.slice(0, maxItems) : src
  }, [items, query, maxItems])

  const groups = React.useMemo(() => groupByLetter(filtered), [filtered])

  const headContent = (
    <>
      <a
        href={fullPageHref}
        className="group/widget flex items-center justify-between gap-2"
      >
        <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-[-0.01em] leading-[1.16] text-[color:var(--rm-gray-fg-main)]">
          {heading}
        </span>
        {/* Arrow — same style as ProductCard (thin 11×11 SVG, color shift). */}
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] text-[#404040] transition-colors group-hover/widget:text-[#F0F0F0]">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M1 10L10 1M10 1H3M10 1V8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
      <label className="flex items-center gap-2 rounded-sm border border-[color:var(--rm-gray-3)] bg-transparent px-3 py-2 focus-within:border-[color:var(--rm-yellow-100)]">
        <Search
          className="h-4 w-4 shrink-0 text-[color:var(--rm-gray-fg-sub)]"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-[length:var(--text-14)] leading-[1.32] text-[color:var(--rm-gray-fg-main)] placeholder:text-[color:var(--rm-gray-fg-sub)] focus:outline-none"
        />
      </label>
    </>
  )

  const groupsList = (
    <div className="flex flex-col gap-5">
      {groups.length === 0 && (
        <p className="py-2 text-[length:var(--text-14)] text-[color:var(--rm-gray-fg-sub)]">
          Ничего не нашлось.
        </p>
      )}
      {groups.map((g) => (
        <LetterGroupBlock key={g.letter} group={g} />
      ))}
    </div>
  )

  if (stickyTop !== undefined) {
    // Split-режим: sticky-шапка (карточка с bg) + gradient-хвост + прокручи-
    // ваемый список. `stickyTop` должен равняться высоте fixed-шапки сайта
    // (обычно 4rem = h-16), чтобы шапка виджета упиралась в неё — тогда над
    // виджетом нет «полоски» viewport, куда скроллящийся список мог бы
    // высунуться.
    //
    // `isolate` на aside создаёт собственный stacking-context, z-20 на шапке
    // и z-0 на списке гарантируют, что текст, заезжающий под шапку при скролле,
    // полностью перекрывается непрозрачным bg карточки и gradient-хвостом.
    return (
      <aside className={cn("isolate flex flex-col", className)} {...props}>
        <div className="sticky z-20" style={{ top: stickyTop }}>
          <div className="flex flex-col gap-5 rounded-sm bg-[color:var(--rm-gray-1)] p-6">
            {headContent}
          </div>
          <div
            aria-hidden
            className="pointer-events-none h-10 bg-gradient-to-b from-[color:var(--rm-gray-1)] via-[color:var(--rm-gray-1)]/70 to-transparent"
          />
        </div>
        <div className="relative z-0 -mt-10 rounded-sm bg-[color:var(--rm-gray-1)] p-6">
          {groupsList}
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        "flex flex-col gap-5",
        "rounded-sm bg-[color:var(--rm-gray-1)]",
        "p-6",
        className,
      )}
      {...props}
    >
      {headContent}
      {groupsList}
    </aside>
  )
}

function LetterGroupBlock({ group }: { group: LetterGroup }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-[-0.01em] leading-[1.2] text-[color:var(--rm-yellow-100)]">
        {group.letter}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {group.items.map((item) => (
          <li key={item.slug}>
            <a
              href={item.href}
              className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[color:var(--rm-gray-fg-sub)] transition-colors hover:text-[color:var(--rm-yellow-100)]"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── GlossaryList (main content /media/glossary) ────────────────────────────

export interface GlossaryListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Все термины. */
  items: GlossaryTermItem[]
  /**
   * Опциональный фильтр по скрипту. Если не задан — рендерится единый
   * список: сначала кириллические группы, затем латинские.
   */
  script?: GlossaryScript
}

/**
 * GlossaryList — 4-колоночный (multi-column) список терминов для /media/glossary.
 * По умолчанию рендерит общий список (кириллица сверху, латиница ниже);
 * можно ограничить одним скриптом через `script`.
 */
export function GlossaryList({
  items,
  script,
  className,
  ...props
}: GlossaryListProps) {
  const filtered = React.useMemo(
    () =>
      script
        ? items.filter((i) => getGlossaryTermScript(i.title) === script)
        : items,
    [items, script],
  )
  const groups = React.useMemo(() => groupByLetter(filtered), [filtered])

  if (groups.length === 0) {
    return (
      <p className={cn("py-16 text-center text-[length:var(--text-14)] text-[color:var(--rm-gray-fg-sub)]", className)}>
        По выбранным фильтрам терминов нет.
      </p>
    )
  }

  return (
    <div
      className={cn(
        "columns-1 gap-x-8 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4",
        className,
      )}
      {...props}
    >
      {groups.map((g) => (
        <div key={g.letter} className="mb-10 break-inside-avoid">
          <LetterGroupBlock group={g} />
        </div>
      ))}
    </div>
  )
}

// ── GlossaryPopularRow (горизонтальная лента ярких карточек) ───────────────

export interface GlossaryPopularRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Список терминов в порядке отображения (сначала закреплённые, далее —
   * самые часто открываемые). Логика сортировки — на стороне страницы
   * (там доступен localStorage со счётчиком views).
   */
  items: GlossaryTermItem[]
}

/**
 * GlossaryPopularRow — горизонтальный скролл карточек терминов глоссария
 * на месте бывшего переключателя А-Я / A-Z. Справа всегда есть фейд (если
 * контент уходит за край), слева фейд появляется после начала скролла.
 */
export function GlossaryPopularRow({
  items,
  className,
  ...props
}: GlossaryPopularRowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [fade, setFade] = React.useState<{ left: boolean; right: boolean }>({
    left: false,
    right: true,
  })

  const update = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const overflows = scrollWidth - clientWidth > 1
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 1
    setFade({
      left: overflows && scrollLeft > 1,
      right: overflows && !atEnd,
    })
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update, items])

  if (items.length === 0) return null

  return (
    <div className={cn("relative", className)} {...props}>
      <div
        ref={scrollRef}
        onScroll={update}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-3 pr-10">
          {items.map((it) => (
            <a
              key={it.slug}
              href={it.href}
              className={cn(
                "group/term flex w-[260px] shrink-0 flex-col gap-2 rounded-sm border border-[color:var(--rm-gray-3)] bg-[color:var(--rm-gray-1)] p-4 transition-colors",
                "hover:border-[color:var(--rm-yellow-100)]",
              )}
            >
              <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-[-0.01em] leading-[1.16] text-[color:var(--rm-gray-fg-main)] line-clamp-2">
                {it.title}
              </span>
              {it.description && (
                <span className="text-[length:var(--text-12)] leading-[1.35] text-[color:var(--rm-gray-fg-sub)] line-clamp-3">
                  {it.description}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-200",
          fade.left ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity duration-200",
          fade.right ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  )
}

/**
 * ScriptToggle — переключатель А-Я / A-Z для страницы глоссария.
 */
export interface GlossaryScriptToggleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: GlossaryScript
  onChange: (script: GlossaryScript) => void
}

export function GlossaryScriptToggle({
  value,
  onChange,
  className,
  ...props
}: GlossaryScriptToggleProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-6", className)}
      role="tablist"
      {...props}
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "cyrillic"}
        onClick={() => onChange("cyrillic")}
        className={cn(
          "font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-[-0.02em] leading-[1.08] transition-colors",
          value === "cyrillic"
            ? "text-[color:var(--rm-gray-fg-main)]"
            : "text-[color:var(--rm-gray-fg-sub)] hover:text-[color:var(--rm-gray-fg-main)]",
        )}
      >
        А-Я
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "latin"}
        onClick={() => onChange("latin")}
        className={cn(
          "font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-[-0.02em] leading-[1.08] transition-colors",
          value === "latin"
            ? "text-[color:var(--rm-gray-fg-main)]"
            : "text-[color:var(--rm-gray-fg-sub)] hover:text-[color:var(--rm-gray-fg-main)]",
        )}
      >
        A-Z
      </button>
    </div>
  )
}
