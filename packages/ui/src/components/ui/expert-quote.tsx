"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────

export interface ExpertQuoteItem {
  id: string
  /** Label — UPPERCASE тезис (Label 18 desktop / Label 16 mobile). */
  label?: string
  /** Параграфы основного текста цитаты (Copy 16). */
  paragraphs?: string[]
  /** Имя автора (обязательно — хотя бы fallback). */
  name: string
  /** Должность / роль. */
  role: string
  /** URL аватара, 72×72 desktop / 64×64 mobile. */
  avatarUrl?: string | null
}

export interface ExpertQuoteStackProps {
  quotes: ExpertQuoteItem[]
  /**
   * Вариант раскладки:
   *  - `mobile` — column-стэк с горизонтальным разделителем между text и
   *    author внутри каждой цитаты, маленькие padding'и (20px);
   *  - `narrow` — column в одной рамке, автор плашкой внизу, padding 32;
   *  - `wide` — row-split: слева текст, справа автор, внутренний vertical
   *    divider. Все элементы сетки делят общую рамку.
   */
  variant: "mobile" | "narrow" | "wide"
  className?: string
}

// ── Single-quote inner pieces ──────────────────────────────────────────────

function QuoteText({
  label,
  paragraphs,
  variant,
}: {
  label?: string
  paragraphs?: string[]
  variant: ExpertQuoteStackProps["variant"]
}) {
  const visibleParagraphs = (paragraphs ?? []).filter((p) => p.trim().length > 0)
  if (!label && visibleParagraphs.length === 0) return null
  const labelSize =
    variant === "mobile"
      ? "text-[length:var(--text-16)]"
      : "text-[length:var(--text-18)]"
  return (
    <div
      className={cn(
        "flex flex-col",
        variant === "mobile" ? "gap-4 p-5" : "gap-6 p-8",
      )}
    >
      {label && (
        <p
          className={cn(
            "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em]",
            "leading-[1.12] text-[#F0F0F0]",
            labelSize,
          )}
        >
          {label}
        </p>
      )}
      {visibleParagraphs.length > 0 && (
        <div className="flex flex-col gap-4">
          {visibleParagraphs.map((p, i) => (
            <p
              key={i}
              className="text-[length:var(--text-16)] leading-[1.28] text-[#939393] whitespace-pre-line"
            >
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function QuoteAuthor({
  name,
  role,
  avatarUrl,
  variant,
}: {
  name: string
  role: string
  avatarUrl?: string | null
  variant: ExpertQuoteStackProps["variant"]
}) {
  // Mobile: avatar 64, H4-mobile (20/24). Desktop: avatar 72, H4 (24/28).
  const isMobile = variant === "mobile"
  const avatarSize = isMobile ? "h-16 w-16" : "h-[72px] w-[72px]"
  const nameSize = isMobile
    ? "text-[length:var(--text-20)] leading-[1.2]"
    : "text-[length:var(--text-24)] leading-[1.16]"
  const pad = isMobile ? "p-5" : "p-8"
  const gap = isMobile ? "gap-6" : "gap-6"

  return (
    <div
      className={cn(
        "flex flex-col",
        pad,
        variant === "wide" ? "justify-between gap-6 h-full" : "gap-4",
      )}
    >
      <div className={cn("flex items-center", gap)}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className={cn(
              "shrink-0 rounded-full object-cover bg-[#0A0A0A]",
              avatarSize,
            )}
          />
        ) : (
          <div
            aria-hidden
            className={cn("shrink-0 rounded-full bg-[#2D2D2D]", avatarSize)}
          />
        )}
        <h4
          className={cn(
            "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em]",
            "text-[#F0F0F0]",
            nameSize,
          )}
        >
          {name}
        </h4>
      </div>
      {role && (
        <p className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
          {role}
        </p>
      )}
    </div>
  )
}

// ── Quote-row renderers per variant ─────────────────────────────────────────

function QuoteRow({
  quote,
  variant,
}: {
  quote: ExpertQuoteItem
  variant: ExpertQuoteStackProps["variant"]
}) {
  if (variant === "wide") {
    // Row: [text 2fr] [vertical divider] [author 1fr]
    return (
      <div className="grid grid-cols-[2fr_1fr]">
        <QuoteText
          label={quote.label}
          paragraphs={quote.paragraphs}
          variant="wide"
        />
        <div className="border-l border-[#404040]">
          <QuoteAuthor
            name={quote.name}
            role={quote.role}
            avatarUrl={quote.avatarUrl}
            variant="wide"
          />
        </div>
      </div>
    )
  }
  if (variant === "mobile") {
    // Column with internal horizontal divider between text and author
    return (
      <div className="flex flex-col">
        <QuoteText
          label={quote.label}
          paragraphs={quote.paragraphs}
          variant="mobile"
        />
        <div className="h-px bg-[#404040]" />
        <QuoteAuthor
          name={quote.name}
          role={quote.role}
          avatarUrl={quote.avatarUrl}
          variant="mobile"
        />
      </div>
    )
  }
  // narrow — одной column'ой, без внутреннего разделителя
  return (
    <div className="flex flex-col">
      <QuoteText
        label={quote.label}
        paragraphs={quote.paragraphs}
        variant="narrow"
      />
      <QuoteAuthor
        name={quote.name}
        role={quote.role}
        avatarUrl={quote.avatarUrl}
        variant="narrow"
      />
    </div>
  )
}

// ── Stack ──────────────────────────────────────────────────────────────────

/**
 * ExpertQuoteStack — монолитный блок из одной или нескольких цитат экспертов.
 * Все цитаты делят общую рамку #404040; между ними — горизонтальный
 * разделитель в один пиксель. Тёмная палитра фиксирована, независимо от
 * темы страницы (спец-виджет — как Gallery/VideoPlayer).
 */
export function ExpertQuoteStack({
  quotes,
  variant,
  className,
}: ExpertQuoteStackProps) {
  if (!quotes || quotes.length === 0) return null
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[4px] border border-[#404040] bg-[#0A0A0A]",
        className,
      )}
      data-variant={variant}
    >
      {quotes.map((q, i) => (
        <React.Fragment key={q.id}>
          {i > 0 && <div className="h-px bg-[#404040]" />}
          <QuoteRow quote={q} variant={variant} />
        </React.Fragment>
      ))}
    </div>
  )
}
