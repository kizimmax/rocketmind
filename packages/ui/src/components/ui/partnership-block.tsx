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
        "flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10",
        className,
      )}
    >
      {/* Left: text content */}
      <div className="flex flex-col gap-8 lg:max-w-[560px]">
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

        {/* Partner logos */}
        {logos.length > 0 && (
          <div className="flex items-center gap-8">
            {logos.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                className="h-auto w-auto max-h-[56px] max-w-[45%] object-contain"
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: 2×2 photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:w-[696px] shrink-0">
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
