"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { VideoPlayer } from "./video-player"

// ── Types ──────────────────────────────────────────────────────────────────

export type ArticleBodyBlockType =
  | "h2"
  | "h3"
  | "h4"
  | "paragraph"
  | "quote"
  | "image"
  | "gallery"
  | "video"

export interface ArticleGalleryItem {
  id: string
  title: string
  src: string
  /** Тип контента таба. Default — image (для обратной совместимости). */
  kind?: "image" | "video"
  /** Опциональная подпись под активным медиа. Пустая — не рендерится. */
  caption?: string
}

export interface ArticleBodyBlock {
  id: string
  type: ArticleBodyBlockType
  data: { text?: string } & Record<string, unknown>
}

export interface ArticleBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  blocks: ArticleBodyBlock[]
}

// ── Slugify (Cyrillic-aware, same map as site-admin/store.ts) ───────────────

const RU_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
}

function slugify(input: string): string {
  const lower = input.toLowerCase().trim()
  let out = ""
  for (const ch of lower) out += RU_MAP[ch] ?? ch
  return out
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60)
}

// ── Vertical rhythm (prev type → curr type → margin-top class) ──────────────

function marginTopClass(
  prev: ArticleBodyBlockType | null,
  curr: ArticleBodyBlockType,
): string {
  // Изображение/галерея всегда отделяются 40px сверху и снизу — как от
  // предыдущего, так и от следующего блока. Обрабатываем оба направления
  // здесь, чтобы суммарный отступ был ровно 40px (в flex-col margin'ы не
  // схлопываются).
  const isMedia = (t: ArticleBodyBlockType | null) =>
    t === "image" || t === "gallery" || t === "video"
  if (isMedia(curr) || isMedia(prev)) {
    return prev === null ? "mt-0" : "mt-[40px]"
  }
  if (prev === null) return "mt-0"
  if (curr === "h2") return "mt-[44px] md:mt-[56px]"
  if (prev === "h2" || prev === "quote") return "mt-[32px]"
  if (curr === "quote" || curr === "h3") return "mt-[32px]"
  // prev ∈ { h3, h4, paragraph }, curr ∈ { h4, paragraph }
  if (curr === "h4") {
    return prev === "h3" || prev === "h4" ? "mt-[16px]" : "mt-[32px]"
  }
  // curr === "paragraph" — 16 для всех prev из {h3, h4, paragraph} (см. DS MD §11.7)
  return "mt-[16px]"
}

// ── Inline markdown-link parser for paragraphs ──────────────────────────────

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  const re = new RegExp(LINK_RE.source, "g")
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(renderLineBreaks(text.slice(last, match.index), `t-${last}`))
    }
    nodes.push(
      <a
        key={`a-${match.index}`}
        href={match[2]}
        className="underline underline-offset-2 transition-colors hover:text-[color:var(--rm-yellow-100)]"
      >
        {match[1]}
      </a>,
    )
    last = match.index + match[0].length
  }
  if (last < text.length) {
    nodes.push(renderLineBreaks(text.slice(last), `t-${last}`))
  }
  return nodes
}

function renderLineBreaks(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split("\n")
  if (parts.length === 1) return <React.Fragment key={keyPrefix}>{text}</React.Fragment>
  return (
    <React.Fragment key={keyPrefix}>
      {parts.map((p, i) => (
        <React.Fragment key={`${keyPrefix}-${i}`}>
          {i > 0 && <br />}
          {p}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

// ── Block renderers ─────────────────────────────────────────────────────────

function H2({ text, className }: { text: string; className?: string }) {
  const id = slugify(text)
  return (
    <h2
      id={id}
      className={cn(
        "scroll-mt-[92px] font-[family-name:var(--font-heading-family)] font-bold uppercase text-[color:var(--rm-gray-fg-main)]",
        // Mobile/H3 → Desktop/H3 — см. DS MD §11.7
        "text-[28px] leading-[1.16] tracking-[-0.015em]",
        "md:text-[length:var(--text-32)] md:leading-[1.12] md:tracking-[-0.01em]",
        className,
      )}
    >
      {text}
    </h2>
  )
}

function H3({ text, className }: { text: string; className?: string }) {
  return (
    <h3
      className={cn(
        "font-[family-name:var(--font-heading-family)] font-bold uppercase text-[color:var(--rm-gray-fg-main)]",
        // Mobile/H4 → Desktop/H4
        "text-[20px] leading-[1.2] tracking-[-0.01em]",
        "md:text-[length:var(--text-24)] md:leading-[1.16]",
        className,
      )}
    >
      {text}
    </h3>
  )
}

function H4({ text, className }: { text: string; className?: string }) {
  return (
    <h4
      className={cn(
        "font-[family-name:var(--font-heading-family)] font-bold uppercase text-[color:var(--rm-gray-fg-main)]",
        // Mobile/H5 → Desktop/H5
        "text-[16px] leading-[1.2] tracking-[-0.01em]",
        "md:text-[length:var(--text-18)] md:leading-[1.16]",
        className,
      )}
    >
      {text}
    </h4>
  )
}

function Paragraph({ text, className }: { text: string; className?: string }) {
  return (
    <p
      className={cn(
        "text-[length:var(--text-18)] leading-[1.2] text-[color:var(--rm-gray-fg-main)]",
        className,
      )}
    >
      {renderInline(text)}
    </p>
  )
}

/**
 * Image — изображение во всю ширину колонки с сохранением пропорций
 * исходного файла. Отступы сверху/снизу 40px задаются через marginTopClass
 * (см. логику выше). Подпись (caption) опциональна — если пустая, не рендерим.
 */
function Image({
  src,
  caption,
  className,
}: {
  src: string
  caption?: string
  className?: string
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption ?? ""}
        className="block h-auto w-full"
      />
      {caption && (
        <figcaption className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Gallery — табовый переключатель изображений. Тёмная палитра (спец-виджет,
 * независимо от цветовой схемы страницы). Табы скроллятся горизонтально,
 * если их суммарная ширина больше ширины контейнера.
 *
 * См. Figma: node 1389-17654 (Website Rocketmind).
 */
function Gallery({
  items,
  className,
}: {
  items: ArticleGalleryItem[]
  className?: string
}) {
  const [activeId, setActiveId] = React.useState<string | null>(
    items[0]?.id ?? null,
  )
  // Предыдущий активный таб удерживаем рядом, пока идёт анимация выхода.
  const [outgoing, setOutgoing] = React.useState<
    { item: ArticleGalleryItem; dir: 1 | -1; nonce: number } | null
  >(null)
  // На время анимации фиксируем высоту медиа-контейнера, чтобы исключить
  // коллапс в 0 (пока новая картинка ещё декодируется) и «прыжок» между
  // разными aspect-ratio соседних кадров.
  const mediaRef = React.useRef<HTMLDivElement>(null)
  const [lockedHeight, setLockedHeight] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!items.some((it) => it.id === activeId)) {
      setActiveId(items[0]?.id ?? null)
    }
  }, [items, activeId])

  // Предзагружаем все картинки галереи один раз — чтобы при клике по табу
  // новая картинка уже была в кэше браузера и имела известные дименсии.
  React.useEffect(() => {
    if (typeof window === "undefined") return
    for (const it of items) {
      if (it.kind === "video" || !it.src) continue
      const img = new window.Image()
      img.src = it.src
    }
  }, [items])

  // По окончании анимации убираем уходящую картинку из DOM и отпускаем
  // фиксированную высоту. Таймер = выход (200ms) + задержка входа (100ms)
  // + вход (300ms) + запас.
  React.useEffect(() => {
    if (!outgoing) return
    const t = window.setTimeout(() => {
      setOutgoing(null)
      setLockedHeight(null)
    }, 440)
    return () => window.clearTimeout(t)
  }, [outgoing])

  if (items.length === 0) return null
  const active = items.find((it) => it.id === activeId) ?? items[0]

  function handleSelect(nextId: string) {
    if (nextId === active.id) return
    const nextIdx = items.findIndex((it) => it.id === nextId)
    const curIdx = items.findIndex((it) => it.id === active.id)
    // dir = 1 → таб справа: картинки едут справа налево.
    // dir = -1 → таб слева: картинки едут слева направо.
    const dir: 1 | -1 = nextIdx > curIdx ? 1 : -1
    // Замораживаем текущую высоту ДО смены состояния, иначе получим кадр
    // с `height: 0`, пока новая картинка не задекодируется.
    const h = mediaRef.current?.offsetHeight ?? null
    if (h && h > 0) setLockedHeight(h)
    setOutgoing({ item: active, dir, nonce: Date.now() })
    setActiveId(nextId)
  }

  const enterAnim =
    outgoing && outgoing.dir === 1
      ? "rm-gallery-enter-right"
      : outgoing && outgoing.dir === -1
        ? "rm-gallery-enter-left"
        : null
  const exitAnim =
    outgoing && outgoing.dir === 1
      ? "rm-gallery-exit-left"
      : outgoing && outgoing.dir === -1
        ? "rm-gallery-exit-right"
        : null

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Tabs bar — горизонтальный скролл при переполнении */}
      <div
        className="flex items-center gap-3 overflow-x-auto rounded-[4px] border border-[#404040] bg-[#1A1A1A] p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => {
          const isActive = it.id === active.id
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => handleSelect(it.id)}
              aria-pressed={isActive}
              className={cn(
                "flex h-8 shrink-0 items-center justify-center rounded-[4px] px-3 py-1",
                "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] text-[length:var(--text-12)] leading-[1.2] whitespace-nowrap",
                "transition-colors duration-150 ease-[var(--ease-standard)]",
                isActive
                  ? "border border-[#404040] bg-[#0A0A0A] text-[#F0F0F0]"
                  : "border border-transparent text-[#939393] hover:text-[#F0F0F0]",
              )}
            >
              {it.title}
            </button>
          )
        })}
      </div>

      {/* Активное изображение с лёгким затемнением (overlay 20% по Figma).
          Переключение идёт с перекрытием: выход ~200ms ease-exit без задержки,
          вход ~300ms ease-enter с задержкой 100ms — так уходящая успевает
          раствориться раньше, чем входящая достигнет полной непрозрачности.
          minHeight замораживается на handleSelect, чтобы контейнер не
          коллапсировал, пока новая картинка декодируется. */}
      <div
        ref={mediaRef}
        className="relative overflow-hidden rounded-[4px]"
        style={lockedHeight ? { minHeight: lockedHeight } : undefined}
      >
        {active.kind === "video" ? (
          // Видео-таб: без slide-анимации (на <video> она ломает воспроизведение)
          // и без overlay (overlay dимит картинку в видео-превью).
          <VideoPlayer key={active.id} src={active.src} />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={active.id}
              src={active.src}
              alt={active.title}
              decoding="async"
              className="rm-gallery-enter block h-auto w-full"
              style={
                enterAnim
                  ? {
                      animation: `${enterAnim} var(--duration-smooth) var(--ease-enter) var(--duration-fast) both`,
                    }
                  : undefined
              }
            />
            {outgoing && exitAnim && outgoing.item.kind !== "video" && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`out-${outgoing.item.id}-${outgoing.nonce}`}
                src={outgoing.item.src}
                alt=""
                aria-hidden
                // Выходящая картинка сохраняет собственный aspect-ratio
                // (h-auto, w-full, закреплена слева-сверху). Не форсируем
                // object-cover под размер входящей — это и вызывало «моргание»
                // при разных пропорциях соседних картинок.
                className="rm-gallery-exit pointer-events-none absolute left-0 top-0 block h-auto w-full"
                style={{
                  animation: `${exitAnim} var(--duration-base) var(--ease-exit) both`,
                }}
              />
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-black/20"
            />
          </>
        )}
      </div>

      {/* Подпись активного таба. Пустая подпись не рендерится. Ключ по id —
          пере-монтируется на переключении и плавно появляется с тем же
          таймингом, что и входящая картинка. */}
      {active.caption && active.caption.trim() && (
        <figcaption
          key={`cap-${active.id}`}
          className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]"
          style={{
            animation:
              "rm-gallery-caption-in var(--duration-smooth) var(--ease-enter) var(--duration-fast) both",
          }}
        >
          {active.caption}
        </figcaption>
      )}
    </div>
  )
}

/**
 * Video — видео во всю ширину колонки через VideoPlayer. Контейнер
 * сохраняет aspect-ratio 16/9 по умолчанию. Подпись (caption) опциональна.
 */
function Video({
  src,
  caption,
  poster,
  className,
}: {
  src: string
  caption?: string
  poster?: string
  className?: string
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <VideoPlayer src={src} poster={poster} />
      {caption && (
        <figcaption className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function Quote({ text, className }: { text: string; className?: string }) {
  return (
    <blockquote
      className={cn(
        // Mobile: 1px border, py-1, Label 18. Desktop: 2px border, py-2, Label 24.
        "border-l-[1px] border-[color:var(--rm-yellow-100)] pl-4 py-1",
        "md:border-l-[2px] md:py-2",
        "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-main)]",
        "text-[length:var(--text-18)] leading-[1.12]",
        "md:text-[length:var(--text-24)] md:leading-[1.16]",
        className,
      )}
    >
      {text}
    </blockquote>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────

/**
 * ArticleBody — тело статьи /media/[slug]. Рендерит типизированные блоки
 * (h2/h3/paragraph/quote) с единой логикой вертикального ритма.
 * См. DS MD §11.7 для таблицы отступов.
 *
 * H2 получают id = slugify(text) — используются ArticleNav scrollspy-ом и
 * якорными ссылками.
 */
export function ArticleBody({ blocks, className, ...props }: ArticleBodyProps) {
  if (!blocks?.length) return null

  return (
    <div className={cn("flex flex-col items-stretch", className)} {...props}>
      {blocks.map((block, i) => {
        const prev = i === 0 ? null : blocks[i - 1].type
        const mt = marginTopClass(prev, block.type)
        const text = typeof block.data?.text === "string" ? block.data.text : ""

        if (block.type === "image") {
          const src = typeof block.data?.src === "string" ? block.data.src : ""
          if (!src) return null
          const caption =
            typeof block.data?.caption === "string"
              ? block.data.caption.trim()
              : ""
          return (
            <Image
              key={block.id}
              src={src}
              caption={caption || undefined}
              className={mt}
            />
          )
        }

        if (block.type === "video") {
          const src = typeof block.data?.src === "string" ? block.data.src : ""
          if (!src) return null
          const caption =
            typeof block.data?.caption === "string"
              ? block.data.caption.trim()
              : ""
          const poster =
            typeof block.data?.poster === "string" && block.data.poster
              ? block.data.poster
              : undefined
          return (
            <Video
              key={block.id}
              src={src}
              caption={caption || undefined}
              poster={poster}
              className={mt}
            />
          )
        }

        if (block.type === "gallery") {
          const raw = Array.isArray(block.data?.items) ? block.data.items : []
          const items: ArticleGalleryItem[] = raw
            .map((it): ArticleGalleryItem | null => {
              if (!it || typeof it !== "object") return null
              const rec = it as Record<string, unknown>
              const id = typeof rec.id === "string" ? rec.id : ""
              const src = typeof rec.src === "string" ? rec.src : ""
              const title = typeof rec.title === "string" ? rec.title : ""
              const kind = rec.kind === "video" ? "video" : "image"
              if (!id || !src) return null
              return { id, src, title, kind }
            })
            .filter((it): it is ArticleGalleryItem => it !== null)
          if (items.length === 0) return null
          return <Gallery key={block.id} items={items} className={mt} />
        }

        if (!text) return null

        switch (block.type) {
          case "h2":
            return <H2 key={block.id} text={text} className={mt} />
          case "h3":
            return <H3 key={block.id} text={text} className={mt} />
          case "h4":
            return <H4 key={block.id} text={text} className={mt} />
          case "paragraph":
            return <Paragraph key={block.id} text={text} className={mt} />
          case "quote":
            return <Quote key={block.id} text={text} className={mt} />
          default:
            return null
        }
      })}
    </div>
  )
}

// ── Helpers exposed for admin editor ────────────────────────────────────────

export { slugify as slugifyArticleHeading }
