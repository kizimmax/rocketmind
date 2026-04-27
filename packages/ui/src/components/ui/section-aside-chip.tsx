import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../lib/utils"

export type SectionAsideChipCropMode = "top" | "center"

export interface SectionAsideChipProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  /** Текст внутри chip — название файла или ссылки. */
  title: string
  /** Переход: для файла — fileUrl, для внешней ссылки — url. */
  href: string
  /** Открывать ли превью 3:2 сверху. */
  showPreview?: boolean
  /** Ручной preview-image URL (только когда showPreview=true). */
  previewImageUrl?: string
  /** Как позиционировать превью при кропе 3:2: от верха картинки или по центру. */
  previewCropMode?: SectionAsideChipCropMode
  /** `true` → `target=_blank`; для скачивания файла можно передать `download`. */
  external?: boolean
  /** Если нужно скачивание (для файла) — передайте name. Передаёт атрибут `download`. */
  download?: string
}

/**
 * SectionAsideChip — единый виджет правой колонки для файла и внешней ссылки.
 * С превью — крупная карточка 3:2 сверху + строка с названием и стрелкой ↗.
 * Без превью — компактная строка с названием и стрелкой.
 *
 * Вся карточка — кликабельная область (anchor). Иконка ↗ видимо усиливает
 * affordance перехода, но сам по себе не захватывает клик — весь блок ссылка.
 */
export const SectionAsideChip = React.forwardRef<
  HTMLAnchorElement,
  SectionAsideChipProps
>(function SectionAsideChip(
  {
    title,
    href,
    showPreview = false,
    previewImageUrl,
    previewCropMode = "top",
    external = true,
    download,
    className,
    ...rest
  },
  ref,
) {
  const hasPreview = showPreview && Boolean(previewImageUrl)
  const objectPosition = previewCropMode === "top" ? "center top" : "center center"

  return (
    <a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download}
      className={cn(
        "group/chip flex flex-col overflow-hidden rounded-[5px] border border-[#404040] bg-[#0A0A0A] text-[color:var(--rm-gray-fg-main)] transition-colors",
        "hover:bg-[#1A1A1A]",
        className,
      )}
      {...rest}
    >
      {/* Заголовочная строка */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-3",
          hasPreview ? "py-2.5" : "py-2.5 min-h-[36px]",
        )}
      >
        <span className="line-clamp-1 font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] text-[length:var(--text-14)] leading-[1.2] transition-colors group-hover/chip:text-[color:var(--rm-yellow-100)]">
          {title}
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 shrink-0 text-[color:var(--rm-yellow-100)] transition-transform group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5"
        />
      </div>

      {hasPreview && (
        <div className="relative w-full overflow-hidden">
          <div style={{ aspectRatio: "3 / 2" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition }}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </a>
  )
})
