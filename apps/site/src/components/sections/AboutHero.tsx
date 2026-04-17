"use client";

import Image from "next/image";
import { DotGridLens, HeroExperts, RichText, type HeroExpert } from "@rocketmind/ui";
import type { Factoid } from "@/lib/products";

// ── Types ──────────────────────────────────────────────────────────────────────

type AboutHeroProps = {
  /** Kept for frontmatter compatibility; not rendered in about-variant hero. */
  caption?: string;
  title?: string;
  ctaText?: string;
  description: string;
  factoids: Factoid[];
  experts: HeroExpert[];
  /** Custom logo (base64 data URL). Falls back to default SVG if absent. */
  heroLogoData?: string;
};

// ── Factoid cell (single row of 4) ────────────────────────────────────────────

function FactoidCell({
  number,
  label,
  className,
}: {
  number: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-5 p-5 md:p-7 ${className ?? ""}`}>
      <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] shrink-0">
        {number}
      </span>
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0] min-w-0">
        {label}
      </span>
    </div>
  );
}

function fadeIn(index: number): React.CSSProperties {
  return {
    opacity: 0,
    transform: "translateY(20px)",
    animation: `heroFadeIn 600ms ease-out ${index * 120}ms forwards`,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AboutHero({ description, factoids, experts, heroLogoData }: AboutHeroProps) {
  const fourFactoids = factoids.slice(0, 4);

  return (
    <section className="relative w-full bg-[#0A0A0A] overflow-hidden">
      <div className="relative mx-auto max-w-[1512px]">
        {/* Dot-grid background — inset from left 56px like Figma */}
        <DotGridLens
          accentColor
          gridGap={13}
          baseRadius={0.75}
          maxScale={4.2}
          className="absolute left-14 right-14 top-0 bottom-0 z-0 opacity-30 pointer-events-none"
        />

        {/* Content frame */}
        <div className="relative z-10 px-5 md:px-8 xl:px-14 pt-[102px] lg:pt-[184px]">
          {/* ── Top row: brand mark (left 50%) + description (right 50%) ── */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:mt-12" style={fadeIn(0)}>
            <div className="lg:w-1/2 lg:pr-11">
              <Image
                src={heroLogoData || "/with_descriptor_dark_background_ru.svg"}
                alt="Rocketmind Business Design"
                width={482}
                height={118}
                priority
                unoptimized={!!heroLogoData}
                className="h-auto w-[280px] md:w-[360px] lg:w-[482px]"
              />
            </div>
            <div className="lg:w-1/2 flex items-start">
              <RichText
                text={description}
                className="text-[length:var(--text-18)] leading-[1.3] text-[#F0F0F0] [&_p+p]:mt-4"
              />
            </div>
          </div>

          {/* ── Experts strip ── */}
          {experts.length > 0 && (
            <div className="relative mt-16 md:mt-24 lg:mt-28" style={fadeIn(2)}>
              <div className="flex flex-col gap-4">
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                  Команда экспертов
                </span>
                <HeroExperts experts={experts} />
              </div>
            </div>
          )}

          {/* ── Factoids: 4 in a single row ── */}
          {fourFactoids.length > 0 && (
            <div className="mt-10 md:mt-14 grid grid-cols-2 xl:grid-cols-4 border-t border-l border-[#404040]" style={fadeIn(3)}>
              {fourFactoids.map((f) => (
                <FactoidCell
                  key={f.number + f.label}
                  number={f.number}
                  label={f.label}
                  className="border-b border-r border-[#404040] min-w-0 overflow-hidden"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
