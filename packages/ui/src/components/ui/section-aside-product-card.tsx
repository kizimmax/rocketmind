import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../lib/utils"

export interface SectionAsideProductCardExpert {
  name: string
  image: string | null
}

export interface SectionAsideProductCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  /** URL страницы продукта (например `/consulting/ecosystem-strategy`). */
  href: string
  /** Заголовок продукта (uppercase, 1–2 строки). */
  title: string
  /** Короткое описание. */
  description?: string
  /** Cover-иллюстрация продукта (если есть — convention `/images/products/<cat>/<slug>/cover.*`). */
  coverUrl?: string | null
  /** Эксперты — первые 2 показываются, остальные → «+N». */
  experts?: SectionAsideProductCardExpert[]
  /**
   * Визуальный вариант:
   * - `default` — 72×72 thumb + аватары экспертов (используется для consulting).
   * - `image` — широкая картинка 286×191 с bottom-fade градиентом, без экспертов
   *   (см. Figma 1562:26932 — используется для academy/ai-products).
   */
  variant?: "default" | "image"
}

/**
 * Мини-карточка продукта для правой колонки секции статьи.
 * Варианты:
 *   - `default` — верхний ряд: 72×72 cover + аватары экспертов (2 + «+N»).
 *   - `image` — широкая cover-картинка с bottom-fade градиентом, без экспертов.
 * Ниже — заголовок uppercase bold + описание. Стрелка ↗ в правом верхнем углу.
 */
export const SectionAsideProductCard = React.forwardRef<
  HTMLAnchorElement,
  SectionAsideProductCardProps
>(function SectionAsideProductCard(
  {
    href,
    title,
    description,
    coverUrl,
    experts,
    variant = "default",
    className,
    ...rest
  },
  ref,
) {
  const list = experts ?? []
  const shown = list.slice(0, 2)
  const extra = Math.max(0, list.length - shown.length)

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "group/product relative flex flex-col gap-4 overflow-hidden rounded-[5px] border border-[#404040] bg-[#0A0A0A] p-4 text-[color:var(--rm-gray-fg-main)] transition-colors",
        "hover:bg-[#1A1A1A]",
        className,
      )}
      {...rest}
    >
      <ArrowUpRight
        aria-hidden
        className="absolute right-3 top-3 z-10 h-4 w-4 text-[color:var(--rm-yellow-100)] transition-transform group-hover/product:translate-x-0.5 group-hover/product:-translate-y-0.5"
      />

      {/* Image-вариант: широкая картинка с bottom-fade, без экспертов */}
      {variant === "image" && coverUrl && (
        <div className="relative w-full overflow-hidden rounded-sm aspect-[286/191]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(10,10,10,1) 4%, rgba(10,10,10,0.86) 21%, rgba(10,10,10,0.62) 46%, rgba(10,10,10,0.36) 61%, rgba(10,10,10,0) 78%)",
            }}
          />
        </div>
      )}

      {/* Default-вариант: 72×72 thumb + аватары экспертов */}
      {variant === "default" && (coverUrl || list.length > 0) && (
        <div className="flex items-center gap-2">
          {coverUrl && (
            <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          {list.length > 0 && (
            <div className="flex items-center -space-x-2">
              {shown.map((ex, i) => (
                <Avatar key={i} name={ex.name} image={ex.image} />
              ))}
              {extra > 0 && (
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0A0A0A] bg-[#222222] text-[length:var(--text-11)] font-medium text-[color:var(--rm-gray-fg-main)]"
                  title={`ещё ${extra}`}
                >
                  +{extra}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative flex flex-col gap-2",
          // В image-варианте заголовок наезжает на bottom-fade зону картинки:
          // gap-4 (16px) у родителя минус -mt-[38px] → overlap ≈ 22px.
          variant === "image" && coverUrl && "-mt-[38px]",
        )}
      >
        <h3 className="line-clamp-3 pr-6 font-[family-name:var(--font-heading-family)] font-bold uppercase text-[length:var(--text-18)] leading-[1.16] tracking-[-0.01em]">
          {title}
        </h3>
        {description && (
          <p className="line-clamp-3 text-[length:var(--text-12)] leading-[1.35] text-[color:var(--rm-gray-fg-sub)]">
            {description}
          </p>
        )}
      </div>
    </a>
  )
})

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className="h-8 w-8 rounded-full border-2 border-[#0A0A0A] object-cover"
        loading="lazy"
      />
    )
  }
  // Фолбэк — инициалы, если нет картинки
  const initials = name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0A0A0A] bg-[#333333] text-[length:var(--text-11)] font-medium text-[color:var(--rm-gray-fg-main)]">
      {initials}
    </span>
  )
}
