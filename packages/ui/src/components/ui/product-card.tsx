"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { GlowingEffect } from "./glowing-effect";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProductCardExpert {
  name: string;
  image: string;
}

export interface ProductCardProps {
  /** Product title (uppercase, max 2 lines) */
  title: string;
  /** Short description (max 3 lines, ellipsis on overflow) */
  description: string;
  /** 120×120 icon element (consulting section only) */
  icon?: React.ReactNode;
  /** Expert avatars — first 2 shown, rest collapsed into "+N" */
  experts?: ProductCardExpert[];
  /** Yellow badge label (e.g. "Экспертный продукт") */
  tag?: string;
  /** Makes the entire card a link */
  href?: string;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProductCard({
  title,
  description,
  icon,
  experts,
  tag,
  href,
  className,
}: ProductCardProps) {
  const hasExperts = experts && experts.length > 0;
  const exactlyThree = hasExperts && experts.length === 3;
  const shown = hasExperts ? experts.slice(0, exactlyThree ? 3 : 2) : [];
  const extra = hasExperts && !exactlyThree ? Math.max(0, experts.length - 2) : 0;

  const rootCn = cn(
    "group relative flex flex-col p-5 md:p-8 md:h-full",
    "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
    "border border-[#404040] transition-[border-color] duration-75",
    "md:hover:z-10",
    "md:active:[border-color:var(--rm-yellow-100)]",
    className,
  );

  const content = (
    <>
      {/* Yellow hover glow */}
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

      {/* Arrow — top-right, border color → white + shift on hover */}
      <div className="absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] text-[#404040] transition-all duration-200 group-hover:text-[#F0F0F0] group-hover:-top-[2px] group-hover:-right-[2px]">
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

      <div className={cn("flex flex-col", icon ? "gap-6 md:gap-8" : "")}>
        {/* ── Icon + Experts + Tag ── */}
        {icon && (
          <div className="relative flex items-center overflow-visible">
            <div className="w-[120px] h-[120px] shrink-0 z-0">{icon}</div>
            {hasExperts && (
              <div className="flex items-center -ml-[18px] pb-10 pt-2 justify-end min-w-0">
                {shown.map((e, i) => (
                  <div
                    key={e.name}
                    className={cn(
                      "w-[72px] h-[72px] min-w-[52px] min-h-[52px] rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center",
                      i > 0 && "-ml-4",
                    )}
                    style={{
                      backgroundImage: `url(${e.image})`,
                      zIndex: shown.length + 1 - i,
                    }}
                  />
                ))}
                {extra > 0 && (
                  <div className="w-[72px] h-[72px] min-w-[52px] min-h-[52px] rounded-full bg-[#1A1A1A] flex items-center justify-center -ml-4 z-[1]">
                    <span className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                      +{extra}
                    </span>
                  </div>
                )}
              </div>
            )}
            {tag && (
              <span className="absolute left-0 bottom-[-22px] inline-flex items-center px-2.5 py-1 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466] z-10">
                {tag}
              </span>
            )}
          </div>
        )}

        {/* ── Tag without icon ── */}
        {tag && !icon && (
          <span className="inline-flex self-start items-center px-2.5 py-1 mb-4 md:mb-5 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466]">
            {tag}
          </span>
        )}

        {/* ── Text ── */}
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

  if (href) {
    return (
      <Link href={href} className={rootCn}>
        {content}
      </Link>
    );
  }
  return <div className={rootCn}>{content}</div>;
}
