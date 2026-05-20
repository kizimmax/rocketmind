import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PartnershipsMiniLogo {
  src: string;
  alt: string;
}

export interface PartnershipsMiniProps {
  title: string;
  description: string;
  logos: PartnershipsMiniLogo[];
  className?: string;
}

/**
 * Жёлтая полоса с заголовком, подписью и логотипами партнёров — мини-версия
 * партнёрского блока, размещается на главной под каталогом продуктов.
 */
export function PartnershipsMini({
  title,
  description,
  logos,
  className,
}: PartnershipsMiniProps) {
  return (
    <section
      className={cn(
        "bg-[var(--rm-yellow-100)] px-5 py-10 md:px-8 md:py-12 xl:px-14",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1512px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: title + description */}
        <div className="flex flex-col gap-5 lg:max-w-[720px]">
          <h2 className="font-[family-name:var(--font-heading-family)] text-[24px] md:text-[32px] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-[#0A0A0A]">
            {title}
          </h2>
          <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] md:text-[length:var(--text-16)] font-medium uppercase leading-[1.3] tracking-[0.01em] text-[#0A0A0A]">
            {description}
          </p>
        </div>

        {/* Right: logos grid — 2 columns, многострочный */}
        {logos.length > 0 && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 items-center lg:max-w-[360px] lg:w-full">
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
    </section>
  );
}
