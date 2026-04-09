"use client";

import { MascotCarousel } from "@/components/blocks/MascotCarousel";

// ── Types ──────────────────────────────────────────────────────────────────────

export type AboutRocketmindVariant = "dark" | "light";

export type AboutRocketmindSectionProps = {
  tag: string;
  title: string;
  description: string;
  variant?: AboutRocketmindVariant;
};

// ── Default content ────────────────────────────────────────────────────────────

export const ABOUT_RM_DEFAULTS = {
  tag: "О Rocketmind",
  title: "СОЗДАЁМ БУДУЩЕЕ БИЗНЕСА С ПОМОЩЬЮ\nБИЗНЕС-ДИЗАЙНА И ИИ",
  description:
    "Rocketmind — платформа, где бизнес-дизайн и искусственный интеллект работают вместе. Мы помогаем компаниям находить новые точки роста, проектировать платформенные модели и выстраивать стратегию развития с опорой на данные и экспертный опыт.",
};

// ── Component ──────────────────────────────────────────────────────────────────

export function AboutRocketmindSection({
  tag,
  title,
  description,
  variant = "dark",
}: AboutRocketmindSectionProps) {
  const isDark = variant === "dark";
  const bg = isDark ? "bg-[#0A0A0A]" : "bg-[#F0F0F0]";
  const textPrimary = isDark ? "text-[#F0F0F0]" : "text-[#0A0A0A]";
  const textSecondary = isDark ? "text-[#939393]" : "text-[#666666]";
  const accentColor = "text-[#FFCC00]";

  return (
    <section className={`w-full ${bg} border-t border-border py-10 lg:py-20`}>
      {/* ── Desktop ── */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14 gap-16">
        {/* Left: text content */}
        <div className="w-1/2 shrink-0 pr-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className={`font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] ${accentColor}`}>
              {tag}
            </span>
            <h2 className={`h2 ${textPrimary} whitespace-pre-line`}>{title}</h2>
          </div>
          <p className={`text-[length:var(--text-18)] leading-[1.2] ${textSecondary} max-w-[560px]`}>
            {description}
          </p>
        </div>

        {/* Right: MascotCarousel */}
        <div className="w-1/2 flex items-end">
          <MascotCarousel />
        </div>
      </div>

      {/* ── Tablet (md → lg) ── */}
      <div className="hidden md:flex lg:hidden flex-col gap-10 px-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className={`font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] ${accentColor}`}>
              {tag}
            </span>
            <h2 className={`font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em] ${textPrimary} whitespace-pre-line`}>
              {title}
            </h2>
          </div>
          <p className={`text-[length:var(--text-16)] leading-[1.28] ${textSecondary}`}>
            {description}
          </p>
        </div>
        <MascotCarousel size="compact" />
      </div>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col gap-8 px-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className={`font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] ${accentColor}`}>
              {tag}
            </span>
            <h2 className={`h1 ${textPrimary} whitespace-pre-line`}>{title}</h2>
          </div>
          <p className={`text-[length:var(--text-16)] leading-[1.28] ${textSecondary}`}>
            {description}
          </p>
        </div>
        <MascotCarousel size="compact" />
      </div>
    </section>
  );
}
