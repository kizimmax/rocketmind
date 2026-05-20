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
   * Если задано — включается режим «прибитой» колонки:
   * — высота aside равна высоте соседней колонки в grid (карточек статей);
   * — содержимое глоссария скроллится ВНУТРИ aside (а не вместе со страницей);
   * — шапка (название + ссылка + поиск) остаётся `sticky` на `top: 0`
   *   внутреннего скролл-контейнера, поэтому всегда видна;
   * — скроллбар визуально скрыт (`.rm-scrollbar-invisible`); направление
   *   читается по top/bottom фейдам.
   *
   * Значение `stickyTop` оставлено для обратной совместимости с предыдущим
   * page-scroll режимом, но в новом режиме игнорируется — шапка прибивается
   * к верху внутреннего scroll-контейнера. Передавайте любое истинное
   * значение, чтобы включить режим (например, `"0"` или `"4rem"`).
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
    return (
      <GlossaryStickyShell
        className={className}
        head={headContent}
        body={groupsList}
        stickyTop={stickyTop}
        {...props}
      />
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

// ── GlossaryStickyShell ────────────────────────────────────────────────────
//
// Column-matched режим:
//   • Высота aside равна высоте соседней grid-колонки со статьями — внешний
//     <aside> ничего не «толкает» в grid, всё содержимое внутри
//     `absolute inset-0`, row-sizing определяется соседом.
//   • Шапка (название + ссылка + поиск) `sticky` к скроллу СТРАНИЦЫ
//     (top = `stickyTop`, обычно 4rem чтобы упереться в фикс-хедер сайта).
//   • Тело (лента терминов) — отдельный внутренний scroll-контейнер с
//     `.rm-scrollbar-invisible`.
//   • Top-фейд виден когда:
//       – внутренний `scrollTop > 0` (тело прокручено внутри), ИЛИ
//       – шапка `pinned` к фикс-хедеру (страница прокручена через aside).
//     Pinned-состояние ловим через IntersectionObserver на sentinel’е,
//     поставленном на верх aside с `rootMargin = -stickyTop`.
//   • Bottom-фейд — абсолютный оверлей на низ aside (поверх scroll-контейнера),
//     виден когда снизу остался контент во внутреннем скролле. Сдвинут на
//     1px вниз чтобы не было субпиксельной щели под фейдом у скругления.

type GlossaryStickyShellProps = React.HTMLAttributes<HTMLElement> & {
  head: React.ReactNode
  body: React.ReactNode
  stickyTop: string
}

function parseStickyTopPx(value: string): number {
  const m = value.trim().match(/^(-?\d*\.?\d+)(rem|em|px)?$/)
  if (!m) return 0
  const n = parseFloat(m[1])
  return m[2] === "rem" || m[2] === "em" ? n * 16 : n
}

function GlossaryStickyShell({
  head,
  body,
  stickyTop,
  className,
  ...props
}: GlossaryStickyShellProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const [internal, setInternal] = React.useState<{ top: boolean; bottom: boolean }>({
    top: false,
    bottom: false,
  })
  const [pinned, setPinned] = React.useState(false)

  const updateInternal = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const overflows = scrollHeight - clientHeight > 1
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1
    setInternal({
      top: overflows && scrollTop > 1,
      bottom: overflows && !atBottom,
    })
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateInternal()
    const ro = new ResizeObserver(updateInternal)
    ro.observe(el)
    const mo = new MutationObserver(updateInternal)
    mo.observe(el, { childList: true, subtree: true, characterData: true })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [updateInternal])

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const topPx = parseStickyTopPx(stickyTop)
    const io = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { rootMargin: `-${topPx + 1}px 0px 0px 0px`, threshold: 0 },
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [stickyTop])

  const showTopFade = internal.top || pinned
  const showBottomFade = internal.bottom

  return (
    <aside
      className={cn("relative isolate h-full min-h-[200px]", className)}
      {...props}
    >
      {/* Sentinel на верхней кромке aside — ловит page-sticky состояние. */}
      <div
        ref={sentinelRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-px"
      />
      {/* absolute inset-0 без overflow — НЕ scroll-контейнер, поэтому
          `sticky` шапки внутри отслеживает скролл СТРАНИЦЫ. */}
      <div className="absolute inset-0 flex flex-col">
        <div className="sticky z-20" style={{ top: stickyTop }}>
          <div className="flex flex-col gap-5 rounded-t-sm bg-[color:var(--rm-gray-1)] px-6 pt-6 pb-5">
            {head}
          </div>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none h-10 bg-gradient-to-b from-[color:var(--rm-gray-1)] via-[color:var(--rm-gray-1)]/70 to-transparent transition-opacity duration-150",
              showTopFade ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
        <div
          ref={scrollRef}
          onScroll={updateInternal}
          className="rm-scrollbar-invisible relative z-0 -mt-10 flex-1 min-h-0 overflow-y-auto rounded-b-sm bg-[color:var(--rm-gray-1)] px-6 pt-1 pb-6"
        >
          {body}
        </div>
        {/* Bottom-фейд — абсолютный оверлей на низ aside, поверх scroll-body. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-[-1px] z-10 h-10 rounded-b-sm bg-gradient-to-t from-[color:var(--rm-gray-1)] via-[color:var(--rm-gray-1)]/70 to-transparent transition-opacity duration-150",
            showBottomFade ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
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
              <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-16)] font-bold uppercase tracking-[-0.01em] leading-[1.16] text-[color:var(--rm-gray-fg-main)] line-clamp-2">
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
