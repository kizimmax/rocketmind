import * as React from "react";
import { cn } from "../../lib/utils";
import {
  StyledParagraphs,
  resolveStyledParagraphs,
  type StyledParagraph,
} from "./styled-paragraphs";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PartnershipLogo {
  src: string;
  alt: string;
}

export interface PartnershipPhoto {
  src: string;
  alt?: string;
}

export interface PartnershipBlockProps {
  /** Yellow caption label (e.g. "Партнёрства") */
  caption: string;
  /** Main heading */
  title: string;
  /** Legacy single-string description (plain secondary text). */
  description?: string;
  /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
  paragraphs?: StyledParagraph[];
  /** Partner logos (max ~4, displayed inline) */
  logos: PartnershipLogo[];
  /** Photos for 2×2 grid (exactly 4) */
  photos: PartnershipPhoto[];
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PartnershipBlock({
  caption,
  title,
  description,
  paragraphs,
  logos,
  photos,
  className,
}: PartnershipBlockProps) {
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: false,
    color: "secondary",
  });
  const hasParagraphs = resolvedParagraphs.length > 0;
  return (
    <div
      className={cn(
        // 50/50 на lg+ (как в AboutProduct и других секциях продуктовых
        // страниц). Раньше было justify-between с фиксированной шириной
        // фотогрида — на широких экранах прижимало его к правому краю
        // max-w-[1512px], на средних — выпирало за контейнер.
        "flex flex-col lg:flex-row lg:items-center gap-10",
        className,
      )}
    >
      {/* Left: text content (1/2 ширины контейнера, контент капится 560px). */}
      <div className="flex flex-col gap-8 lg:w-1/2 lg:shrink-0 lg:max-w-[560px]">
        {/* Tag + Title + Description */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[var(--rm-yellow-100)]">
            {caption}
          </span>
          <div className="flex flex-col gap-6">
            <h3 className="font-[family-name:var(--font-heading-family)] text-[28px] md:text-[36px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
              {title}
            </h3>
            {hasParagraphs && (
              <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="16" />
            )}
          </div>
        </div>

        {/* Partner logos — 2 columns, multiple rows allowed (admin может
            добавлять/удалять ряды). */}
        {logos.length > 0 && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 items-center">
            {logos.map((logo, i) => (
              <img
                key={`${logo.src}-${i}`}
                src={logo.src}
                alt={logo.alt}
                className="h-auto w-full max-h-[56px] object-contain object-left"
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: 2×2 photo grid (1/2 ширины, фото шкалятся под колонку,
          сверху ограничено дизайнерским максимумом 696px). */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 lg:max-w-[696px]">
          {photos.slice(0, 4).map((photo, i) => (
            <div key={i} className="aspect-[340/252] overflow-hidden">
              <img
                src={photo.src}
                alt={photo.alt || ""}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
