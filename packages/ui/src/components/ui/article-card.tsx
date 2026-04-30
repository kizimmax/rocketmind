"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Tag } from "./tag"
import { Author } from "./author"
import { GlowingEffect } from "./glowing-effect"

export type ArticleCardVariant = "default" | "wide"

/** 8 акцентных DS-палитр (см. `design/design-system.md` §1.4). */
export type ArticleCardTypeBadgeColor =
  | "yellow"
  | "violet"
  | "sky"
  | "terracotta"
  | "pink"
  | "blue"
  | "red"
  | "green"

export interface ArticleCardProps extends React.HTMLAttributes<HTMLElement> {
  /** If omitted — карточка рендерится как статичное превью без ссылки и без стрелки-выноски. */
  href?: string
  title: string
  description?: string
  coverUrl?: string | null
  tags?: string[]
  authorName?: string
  authorAvatarUrl?: string | null
  date?: string
  /** Max tags to show (excess are clipped). Default 3. */
  maxTags?: number
  /**
   * Бейдж типа статьи. Рендерится первым в ленте тегов с фоном из DS-палитры.
   * Используется для системных типов «Урок» (sky) / «Кейс» (terracotta);
   * на странице самой статьи такие теги выводятся как обычные, без `typeBadge`.
   */
  typeBadge?: { label: string; color: ArticleCardTypeBadgeColor }
  /**
   * "default" — обычная карточка (обложка сверху, контент ниже).
   * "wide" — широкая: обложка слева, теги и автор справа, заголовок с описанием
   *   во всю ширину под обложкой.
   * Default "default".
   */
  variant?: ArticleCardVariant
}

/**
 * ArticleCard — floating glass-панель для списка статей на /media.
 *
 * Варианты:
 * - default: обложка сверху (overlap), теги снизу обложки, title+description+author.
 * - wide: обложка слева (~60%), справа колонка с тегами сверху и автором снизу,
 *   title+description во всю ширину ниже.
 *
 * Высота карточки фиксирована. Типографика заголовка и описания адаптивна:
 * система клэмпит заголовок по `maxTitleLines` и, измерив сколько строк он
 * фактически занял, выбирает количество строк описания так, чтобы карточка
 * сохраняла одинаковую высоту в сетке.
 *
 * Адаптивные правила (lines of title → lines of description):
 *   default: 1→5, 2→3, 3→2
 *   wide:    1→2, 2→1
 */
export function ArticleCard({
  href,
  title,
  description,
  coverUrl,
  tags,
  authorName,
  authorAvatarUrl,
  date,
  maxTags = 3,
  typeBadge,
  variant = "default",
  className,
  ...props
}: ArticleCardProps) {
  // Если задан typeBadge — он занимает один из maxTags-слотов, чтобы карточка
  // не вырастала при переполнении. На /media страница самой статьи передаёт
  // typeBadge=undefined → бейдж типа выглядит как обычный тег в общем списке.
  const reservedForBadge = typeBadge ? 1 : 0
  const visibleTags = (tags ?? []).slice(0, Math.max(0, maxTags - reservedForBadge))
  const titleRef = React.useRef<HTMLHeadingElement | null>(null)
  const [titleLines, setTitleLines] = React.useState<number>(1)

  const maxTitleLines = variant === "wide" ? 2 : 3

  // Измеряем сколько строк реально занял заголовок после рендера,
  // чтобы динамически клэмпить описание (см. doc-строку).
  React.useLayoutEffect(() => {
    const el = titleRef.current
    if (!el) return
    const compute = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight)
      if (!lh || Number.isNaN(lh)) return
      const h = el.offsetHeight
      const lines = Math.min(maxTitleLines, Math.max(1, Math.round(h / lh)))
      setTitleLines(lines)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [title, maxTitleLines, variant])

  const descClamp =
    variant === "wide"
      ? titleLines <= 1
        ? 2
        : 1
      : titleLines <= 1
        ? 5
        : titleLines === 2
          ? 3
          : 2

  return (
    <article
      className={cn(
        "group relative flex w-full flex-col",
        "rounded-sm border border-[color:var(--rm-gray-3)] transition-[border-color] duration-75",
        "md:hover:z-10 md:active:[border-color:var(--rm-yellow-100)]",
        "p-8",
        className
      )}
      {...props}
    >
      {/* Yellow hover glow — тот же паттерн, что у ProductCard. */}
      <div className="hidden md:block">
        <GlowingEffect
          spread={40}
          glow={false}
          disabled={false}
          proximity={40}
          inactiveZone={0.01}
          borderWidth={1}
          variant="yellow"
        />
      </div>

      {href && (
        <>
          <a
            href={href}
            className="absolute inset-0 z-[1] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--rm-yellow-100)]"
            aria-label={title}
          />
          {/* Arrow — same style as ProductCard (top-right, color shift + 2px
              shift on hover). Thin 11×11 SVG, stroke 2. */}
          <div
            className="pointer-events-none absolute right-[2px] top-[2px] z-[2] flex h-10 w-10 items-center justify-center rounded-[4px] text-[#404040] transition-all duration-200 group-hover:-right-[2px] group-hover:-top-[2px] group-hover:text-[#F0F0F0]"
            aria-hidden
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M1 10L10 1M10 1H3M10 1V8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </>
      )}

      {variant === "wide" ? (
        <WideLayout
          coverUrl={coverUrl}
          visibleTags={visibleTags}
          typeBadge={typeBadge}
          authorName={authorName}
          authorAvatarUrl={authorAvatarUrl}
          date={date}
        />
      ) : (
        <DefaultLayout
          coverUrl={coverUrl}
          visibleTags={visibleTags}
          typeBadge={typeBadge}
        />
      )}

      {/* Text content. Author is pinned to the card bottom (mt-auto) —
          высота карточки фиксирована, так что автор всегда внизу. */}
      <div className="relative z-[1] mt-7 flex flex-1 flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h3
            ref={titleRef}
            className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] uppercase tracking-[-0.01em] leading-[1.2] text-[color:var(--rm-gray-fg-main)]"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: maxTitleLines,
              overflow: "hidden",
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[color:var(--rm-gray-fg-sub)]"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: descClamp,
                overflow: "hidden",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {variant === "default" && authorName && (
          <Author
            variant="short"
            name={authorName}
            avatarUrl={authorAvatarUrl}
            date={date}
            showAvatarFallback={false}
            className="mt-auto"
          />
        )}
      </div>
    </article>
  )
}

function TypeBadge({
  badge,
}: {
  badge: { label: string; color: ArticleCardTypeBadgeColor }
}) {
  // Геометрия и типографика — 1-в-1 как у `Tag size="s"`, чтобы стоять в
  // одном ряду с обычными тегами и не выглядеть тяжелее их.
  // Окраска — DS-вариант «{color}-subtle» (см. Badge): bg `--rm-{c}-900`,
  // border `--rm-{c}-700`, text `--rm-{c}-fg-subtle`. Спокойный цветной фон
  // с тёмным текстом — не «активная заливка», а маркировка типа.
  return (
    <span
      className="inline-flex max-w-full items-center justify-center gap-2 break-words rounded-sm border px-2 py-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-left [overflow-wrap:anywhere]"
      style={{
        backgroundColor: `var(--rm-${badge.color}-900)`,
        borderColor: `var(--rm-${badge.color}-700)`,
        color: `var(--rm-${badge.color}-fg-subtle)`,
      }}
    >
      {badge.label}
    </span>
  )
}

function DefaultLayout({
  coverUrl,
  visibleTags,
  typeBadge,
}: {
  coverUrl?: string | null
  visibleTags: string[]
  typeBadge?: { label: string; color: ArticleCardTypeBadgeColor }
}) {
  return (
    <>
      {/* Image — aspect 3:2 (из Figma), ширина подстраивается под грид.
          Тэги позиционированы absolute поверх нижнего края, чтобы при
          переполнении строки они НЕ РАСТЯГИВАЛИ карточку вниз, а наползали
          вверх на обложку (flex-wrap-reverse). */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
        ) : (
          <div className="h-full w-full bg-[color:var(--rm-gray-1)]" aria-hidden />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.72) 22%, rgba(10,10,10,0) 100%)",
          }}
          aria-hidden
        />

        {/* Tags — absolute, прибиты к левому-нижнему углу обложки. При
            переполнении flex-wrap-reverse отправляет новые ряды ВВЕРХ,
            поэтому теги наползают на изображение без роста высоты карточки. */}
        {(visibleTags.length > 0 || typeBadge) && (
          <div className="absolute inset-x-0 bottom-3 z-[1] flex flex-wrap-reverse gap-x-2 gap-y-1">
            {typeBadge && <TypeBadge badge={typeBadge} />}
            {visibleTags.map((t) => (
              <Tag key={t} size="s">
                {t}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function WideLayout({
  coverUrl,
  visibleTags,
  typeBadge,
  authorName,
  authorAvatarUrl,
  date,
}: {
  coverUrl?: string | null
  visibleTags: string[]
  typeBadge?: { label: string; color: ArticleCardTypeBadgeColor }
  authorName?: string
  authorAvatarUrl?: string | null
  date?: string
}) {
  return (
    <div className="relative z-[0] flex gap-6">
      {/* Image — 60% width, 4:3 */}
      <div className="relative aspect-[4/3] flex-[3] overflow-hidden rounded-sm">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
        ) : (
          <div className="h-full w-full bg-[color:var(--rm-gray-1)]" aria-hidden />
        )}
      </div>

      {/* Right column: tags (стек, right-align) сверху, Author full — снизу */}
      <div className="flex flex-[2] flex-col justify-between gap-4">
        {(visibleTags.length > 0 || typeBadge) && (
          <div className="flex flex-col items-start gap-1.5">
            {typeBadge && <TypeBadge badge={typeBadge} />}
            {visibleTags.map((t) => (
              <Tag key={t} size="s">
                {t}
              </Tag>
            ))}
          </div>
        )}
        {authorName && (
          <Author
            variant="full"
            name={authorName}
            avatarUrl={authorAvatarUrl}
            date={date}
            showAvatarFallback={false}
          />
        )}
      </div>
    </div>
  )
}
