"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { GlowingEffect } from "./glowing-effect";
import { CoverSkeleton } from "./cover-skeleton";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProductImageCardFactoid {
  number: string;
  text: string;
}

export interface ProductImageCardProps {
  /** Product title (uppercase, max 2 lines) */
  title: string;
  /** Short description */
  description: string;
  /** Cover image URL */
  image?: string;
  /** Yellow badge label */
  tag?: string;
  /** Makes the entire card a link */
  href?: string;
  /** "default" = 1 column, "wide" = 2 columns with factoids on desktop */
  variant?: "default" | "wide";
  /** Hero factoids for the wide variant (desktop only, max 3) */
  factoids?: ProductImageCardFactoid[];
  /** Compact wide: min-h 350px, max 2 factoids (for mixed grids with 1-col cards) */
  compact?: boolean;
  className?: string;
}

// ── Tag badge ─────────────────────────────────────────────────────────────────

const tagCn =
  "inline-flex items-center px-2.5 py-1 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466]";

// ── Component ─────────────────────────────────────────────────────────────────

export function ProductImageCard({
  title,
  description,
  image,
  tag,
  href,
  variant = "default",
  factoids = [],
  compact = false,
  className,
}: ProductImageCardProps) {
  // ════════════════════════════════════════════════════════════════════════════
  // Wide (2-column) variant
  // Desktop: row — image left, text + factoids right, tag absolute over image
  // Mobile: column — same as default (image → tag overlap → text, no factoids)
  // ════════════════════════════════════════════════════════════════════════════
  if (variant === "wide") {
    const maxFactoids = compact ? 2 : 3;
    const rootCn = cn(
      "group relative flex flex-col p-5 md:flex-row md:gap-8 md:p-8 md:pl-0 md:h-full",
      compact ? "md:min-h-[350px]" : "md:min-h-[424px]",
      "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
      "border border-[#404040] transition-[border-color] duration-75",
      "md:hover:z-10",
      "md:active:[border-color:var(--rm-yellow-100)]",
      className,
    );

    const inner = (
      <>
        <div className="hidden md:block"><GlowingEffect spread={40} glow={false} disabled={false} proximity={40} inactiveZone={0.01} borderWidth={1} variant="yellow" /></div>

        {/* Arrow — top-right */}
        <div className="absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] text-[#404040] transition-all duration-200 group-hover:text-[#F0F0F0] group-hover:-top-[2px] group-hover:-right-[2px]">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ── Image ── */}
        <div className="relative md:w-1/2 h-[220px] md:h-auto md:self-stretch overflow-hidden shrink-0">
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <CoverSkeleton />
          )}
          {/* Tag: absolute over image — desktop only */}
          {tag && (
            <span className={cn(tagCn, "hidden md:inline-flex absolute left-0 top-0 z-10")}>
              {tag}
            </span>
          )}
        </div>

        {/* Tag: overlapping below image — mobile only */}
        {tag && (
          <div className="md:hidden -mt-[22px]">
            <span className={tagCn}>{tag}</span>
          </div>
        )}

        {/* ── Text + Factoids ── */}
        <div className="md:flex-1 flex flex-col md:justify-between gap-4 mt-6 md:mt-0 min-w-0">
          {/* Title + Description */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] line-clamp-2 min-h-[2.4em] text-[20px] md:text-[clamp(16px,1.6vw,24px)]">
              {title}
            </h3>
            <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-[#939393] line-clamp-3 h-[54px] overflow-hidden">
              {description}
            </p>
          </div>

          {/* Factoids — desktop only */}
          {factoids.length > 0 && (
            <div className="hidden md:flex flex-col gap-4">
              {factoids.slice(0, maxFactoids).map((f, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="font-heading text-[24px] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0] shrink-0 w-[66px]">
                    {f.number}
                  </span>
                  <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-[#F0F0F0] pt-[5px] line-clamp-2">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );

    if (href) return <Link href={href} className={rootCn}>{inner}</Link>;
    return <div className={rootCn}>{inner}</div>;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Default (1-column) variant
  // Image 220px → tag overlap -22px → title + description
  // ════════════════════════════════════════════════════════════════════════════
  const rootCn = cn(
    "group relative flex flex-col p-5 md:p-8",
    "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
    "border border-[#404040] transition-[border-color] duration-75",
    "md:hover:z-10",
    "md:active:[border-color:var(--rm-yellow-100)]",
    className,
  );

  const inner = (
    <>
      <GlowingEffect spread={40} glow={false} disabled={false} proximity={40} inactiveZone={0.01} borderWidth={2} variant="yellow" />

      {/* Arrow — top-right */}
      <div className="absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] text-[#404040] transition-all duration-200 group-hover:text-[#F0F0F0] group-hover:-top-[2px] group-hover:-right-[2px]">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        {/* Image + Tag */}
        <div className="flex flex-col">
          <div className="w-full h-[220px] overflow-hidden">
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <CoverSkeleton />
            )}
          </div>
          {tag && (
            <div className="-mt-[22px]">
              <span className={tagCn}>{tag}</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-4 md:gap-5">
          <h3 className="font-heading font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] line-clamp-2 min-h-[2.4em] text-[20px] md:text-[clamp(16px,1.6vw,24px)]">
            {title}
          </h3>
          <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-[#939393] h-[54px] overflow-hidden line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </>
  );

  if (href) return <Link href={href} className={rootCn}>{inner}</Link>;
  return <div className={rootCn}>{inner}</div>;
}
