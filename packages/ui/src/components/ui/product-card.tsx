"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  /** Product title (H4, uppercase) */
  title: string;
  /** Short description */
  description: string;
  /** Cover image element (Next.js Image or plain img) */
  image?: React.ReactNode;
  /** Link href for the card */
  href?: string;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProductCard({
  title,
  description,
  image,
  href,
  className,
}: ProductCardProps) {
  const content = (
    <div className={cn(
      "flex flex-col gap-8 border border-[#404040] p-5 md:p-8",
      "transition-colors hover:border-[#606060]",
      className,
    )}>
      {image && (
        <div className="shrink-0">{image}</div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="h4 text-[#F0F0F0]">{title}</h3>
        <p className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }

  return content;
}
