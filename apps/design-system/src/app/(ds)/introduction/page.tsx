"use client"

import React from "react"
import Link from "next/link"
import { CTASectionMini, GlowingEffect } from "@rocketmind/ui"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ""
const mono = "font-[family-name:var(--font-mono-family)]"

/* ── Tile previews ───────────────────────────────────────────────────────── */

function GuidebookCoverPreview() {
  // Cover slide (1) sits in the center spanning 2×2; the remaining 12 cells are
  // filler slides that crop at the tile edges.
  // Picked deterministically to avoid SSR/CSR drift.
  const filler = [3, 7, 9, 14, 16, 21, 5, 31, 11, 18, 26, 33]
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--rm-gray-1)]">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          /* width drives total height via 16:9 + 2px gaps */
          width: "min(125%, 720px)",
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "minmax(0, 1fr)",
            gap: 2,
            aspectRatio: "16 / 9",
          }}
        >
          {/* Big center slide — covers cols 2-3, rows 2-3 (4 cells). */}
          <div
            className="relative overflow-hidden rounded-[2px] ring-1 ring-white/20 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)]"
            style={{
              gridColumn: "2 / span 2",
              gridRow: "2 / span 2",
              aspectRatio: "16 / 9",
            }}
          >
            <img
              src={`${BASE_PATH}/guidebook/pages/p01.jpg`}
              alt=""
              className="w-full h-full object-cover select-none"
              draggable={false}
              loading="lazy"
            />
          </div>
          {/* Filler — auto-placed; CSS grid skips cells occupied by the big slide. */}
          {filler.map((page, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[2px] opacity-90"
              style={{ aspectRatio: "16 / 9" }}
            >
              <img
                src={`${BASE_PATH}/guidebook/pages/p${String(page).padStart(2, "0")}.jpg`}
                alt=""
                className="w-full h-full object-cover select-none"
                draggable={false}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MascotsPreview() {
  const rowTop: string[] = [
    "alex/alex_pointer.png",
    "kate/kate_smile.png",
    "lida/lida_confident.png",
    "max/max_thinks.png",
    "sergey/sergey_pointer.png",
    "sophie/sophie_ok.png",
    "nick/nick_smile.png",
    "mark/mark_confident.png",
    "alex/alex_thinks.png",
    "kate/kate_surprised.png",
  ]
  const rowBottom: string[] = [
    "lida/lida_pointing.png",
    "max/max_confident_→.png",
    "sophie/sophie_pointer.png",
    "nick/nick_thinks.png",
    "alex/alex_ok.png",
    "kate/kate_pointer.png",
    "mark/mark_smile.png",
    "sergey/sergey_thinks.png",
    "lida/lida_surprised_→.png",
    "max/max_ok.png",
  ]
  return (
    <div className="absolute inset-0 bg-[var(--rm-gray-1)] overflow-hidden">
      {/* Golden ratio behind the mascots */}
      <GoldenRatioBg opacity={0.08} />
      <div className="absolute inset-0 z-10 flex flex-col justify-center gap-2">
        {/* Row 1 — scrolls right (LTR) */}
        <MascotMarquee items={rowTop} direction="ltr" duration={56} />
        {/* Row 2 — scrolls left (RTL) */}
        <MascotMarquee items={rowBottom} direction="rtl" duration={64} />
      </div>
    </div>
  )
}

function MascotMarquee({ items, direction, duration }: { items: string[]; direction: "ltr" | "rtl"; duration: number }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 152 }}>
      <div
        className={`partner-logo-marquee-track${direction === "ltr" ? " partner-logo-marquee-track--ltr" : ""}`}
        style={{ ["--hero-marquee-duration" as string]: `${duration}s`, alignItems: "center" }}
      >
        {[...items, ...items].map((p, i) => (
          <img
            key={`${p}-${i}`}
            src={`${BASE_PATH}/ai-mascots/${p}`}
            alt=""
            className="h-36 w-auto shrink-0 mx-[-8px] object-contain select-none"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}

function ComponentsRowPreview() {
  // Compact UI kit packed densely. Inner canvas oversized so chips bleed past
  // the tile edges and crop naturally.
  return (
    <div className="absolute inset-0 bg-[var(--rm-gray-1)] overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 flex flex-wrap gap-3 content-center justify-center items-end"
        style={{
          /* Fixed pixel width — wrap positions stay identical at any tile size.
             The tile clips overflow naturally. */
          width: 1000,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* ── Sticky-aside style CTA — featured, larger ── */}
        <div className="shrink-0" style={{ width: 220 }}>
          <CTASectionMini
            heading="Оставьте заявку"
            body="Свяжемся с вами в течение рабочего дня."
            buttonText="Оставить заявку"
            href="#"
          />
        </div>

        {/* ── Site card — Product / consulting ── */}
        <div className="shrink-0 flex flex-col gap-2 rounded-lg border border-border bg-card p-3" style={{ width: 200 }}>
          <div className="h-20 rounded-sm bg-gradient-to-br from-[#3D3300]/40 to-[#1A1A1A] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[var(--rm-yellow-100)]">
              <path d="M3 12l5-9 4 7 4-5 5 7-9 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[-0.005em] leading-[1.1]">
            Платформенная бизнес-модель
          </h4>
          <p className="text-[10px] text-muted-foreground leading-[1.4] line-clamp-2">
            Двусторонний рынок и сетевые эффекты.
          </p>
          <div className="flex -space-x-1.5 mt-auto">
            {["А", "К", "С"].map((l, i) => (
              <div key={i} className={`w-5 h-5 rounded-full bg-rm-gray-2 border border-card flex items-center justify-center ${mono} text-[9px] uppercase text-muted-foreground`}>
                {l}
              </div>
            ))}
            <span className={`ml-2 ${mono} text-[10px] uppercase tracking-[0.08em] text-muted-foreground self-center`}>
              +2 эксперта
            </span>
          </div>
        </div>

        {/* ── Site card — Article ── */}
        <div className="shrink-0 flex flex-col gap-2 rounded-lg border border-border bg-card p-3" style={{ width: 200 }}>
          <div className="h-20 rounded-sm bg-rm-gray-2 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            />
            <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-sm bg-[#FE733A]/20 text-[var(--rm-terracotta-100)] ${mono} text-[10px] uppercase tracking-[0.08em] font-medium`}>
              Кейс
            </span>
          </div>
          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[-0.005em] leading-[1.1] line-clamp-3">
            Как мы строим экосистемную стратегию для роста
          </h4>
          <div className="flex items-center gap-1.5 mt-auto">
            <div className="w-4 h-4 rounded-full bg-rm-gray-3" />
            <span className={`${mono} text-[10px] uppercase tracking-[0.08em] text-muted-foreground`}>Иван П.</span>
          </div>
        </div>

        {/* ── Site card — AI Agent ── */}
        <div className="shrink-0 flex flex-col gap-2 rounded-lg border border-border bg-card p-3" style={{ width: 200 }}>
          <div className="h-20 relative flex items-end justify-start">
            <img
              src={`${BASE_PATH}/ai-mascots/kate/kate_smile.png`}
              alt=""
              className="h-[96px] w-auto object-contain -ml-1"
              draggable={false}
            />
            <span className={`absolute top-0 right-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-card border border-border ${mono} text-[10px] uppercase tracking-[0.08em] text-muted-foreground`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--rm-green-100)]" />
              Активен
            </span>
          </div>
          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[-0.005em] leading-[1.1]">
            Катя · Маркетолог
          </h4>
          <p className="text-[10px] text-muted-foreground leading-[1.4] line-clamp-2">
            Анализирует рынок и формирует стратегии роста.
          </p>
          <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-border">
            <span className={`${mono} text-[10px] uppercase tracking-[0.08em] text-muted-foreground`}>124 кейса</span>
            <span className={`${mono} text-[10px] uppercase tracking-[0.08em] text-foreground`}>Запустить →</span>
          </div>
        </div>

        {/* ── Buttons row ── */}
        <button className={`h-8 px-4 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>
          Сохранить
        </button>
        <button className={`h-8 px-4 rounded-sm border border-border bg-card text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>
          Отмена
        </button>
        <button className={`h-8 px-4 rounded-sm bg-[var(--rm-yellow-100)] text-[#0A0A0A] ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] font-medium`}>
          Получить →
        </button>
        <button className={`h-8 px-4 rounded-sm bg-[#0A0A0A] text-[#F0F0F0] border border-[#262626] ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>
          Подробнее
        </button>
        <button className={`h-8 px-4 rounded-sm bg-[var(--rm-red-100)]/15 border border-[var(--rm-red-100)]/30 text-[var(--rm-red-100)] ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>
          Удалить
        </button>
        <button className={`h-8 w-8 rounded-sm border border-border bg-card text-muted-foreground flex items-center justify-center`}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="4" cy="8" r="1.25" fill="currentColor" />
            <circle cx="8" cy="8" r="1.25" fill="currentColor" />
            <circle cx="12" cy="8" r="1.25" fill="currentColor" />
          </svg>
        </button>

        {/* ── Inputs ── */}
        <div className="h-8 w-44 rounded-sm border border-border bg-card px-2.5 flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-muted-foreground">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className={`${mono} text-[length:var(--text-12)] text-muted-foreground/70`}>Поиск…</span>
        </div>
        <div className="h-8 w-36 rounded-sm border border-[var(--rm-yellow-100)] bg-card px-2.5 flex items-center" style={{ boxShadow: "0 0 0 3px color-mix(in srgb, var(--rm-yellow-100) 25%, transparent)" }}>
          <span className={`${mono} text-[length:var(--text-12)] text-foreground`}>mail@…</span>
          <span className="ml-auto w-[1px] h-3 bg-foreground animate-pulse" />
        </div>
        <div className="h-8 w-32 rounded-sm border border-border bg-card px-2.5 flex items-center justify-between">
          <span className={`${mono} text-[length:var(--text-12)] text-muted-foreground`}>Все статусы</span>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-muted-foreground">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ── Tabs ── */}
        <div className="h-8 rounded-sm border border-border bg-card flex items-center text-muted-foreground">
          <span className={`px-2.5 h-full flex items-center bg-rm-gray-2 rounded-l-sm border-r border-border text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Обзор</span>
          <span className={`px-2.5 h-full flex items-center border-r border-border ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Метрики</span>
          <span className={`px-2.5 h-full flex items-center rounded-r-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Журнал</span>
        </div>

        {/* ── Slider Number 01..05 ── */}
        <div className="flex items-center gap-2.5 h-8 px-3 rounded-sm border border-border bg-card">
          {["01", "02", "03", "04", "05"].map((n, i) => (
            <span
              key={n}
              className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.04em] relative ${
                i === 1 ? "text-foreground" : "text-muted-foreground/50"
              }`}
            >
              {n}
              {i === 1 && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--rm-yellow-100)]" />
              )}
            </span>
          ))}
        </div>

        {/* ── Linear slider with yellow fill ── */}
        <div className="flex items-center gap-2 w-48 h-8 px-2 rounded-sm border border-border bg-card">
          <span className={`${mono} text-[10px] text-muted-foreground`}>0</span>
          <div className="flex-1 h-1 rounded-full bg-rm-gray-2 relative">
            <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-[var(--rm-yellow-100)]" />
            <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-card border-2 border-[var(--rm-yellow-100)]" />
          </div>
          <span className={`${mono} text-[10px] text-foreground`}>66</span>
        </div>

        {/* ── Switch (on, yellow) ── */}
        <div className="h-8 px-2 rounded-sm border border-border bg-card flex items-center gap-2">
          <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Авто</span>
          <div className="relative w-9 h-5 rounded-full bg-[var(--rm-yellow-100)]">
            <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-card border border-border" />
          </div>
        </div>
        {/* ── Switch (off) ── */}
        <div className="h-8 px-2 rounded-sm border border-border bg-card flex items-center gap-2">
          <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Push</span>
          <div className="relative w-9 h-5 rounded-full bg-rm-gray-2 border border-border">
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card border border-border" />
          </div>
        </div>

        {/* ── Icon Switch — Sun / Moon segmented ── */}
        <div className="h-8 rounded-sm border border-border bg-card flex items-center text-muted-foreground p-0.5 gap-0.5">
          <span className="h-full px-2 flex items-center text-foreground bg-rm-gray-2 rounded-[3px]">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.25" />
              <path d="M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.2 3.2l1.06 1.06M11.7 11.7l1.06 1.06M3.2 12.7l1.06-1.06M11.7 4.3l1.06-1.06" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </span>
          <span className="h-full px-2 flex items-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M13 9.5A6 6 0 116.5 3a4.5 4.5 0 006.5 6.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* ── Badges row ── */}
        <span className={`h-7 px-2 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] flex items-center`} style={{ backgroundColor: "var(--rm-green-900, #1A3D1A)", color: "var(--rm-green-100)" }}>
          ● Активен
        </span>
        <span className={`h-7 px-2 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] flex items-center`} style={{ backgroundColor: "color-mix(in srgb, var(--rm-yellow-100) 20%, transparent)", color: "var(--rm-yellow-100)" }}>
          В работе
        </span>
        <span className={`h-7 px-2 rounded-sm bg-rm-gray-2 text-muted-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] flex items-center`}>
          Архив
        </span>
        <span className={`h-7 px-2 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] flex items-center`} style={{ backgroundColor: "color-mix(in srgb, var(--rm-terracotta-100) 18%, transparent)", color: "var(--rm-terracotta-100)" }}>
          Кейс
        </span>
        <span className={`h-7 px-2 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] flex items-center`} style={{ backgroundColor: "color-mix(in srgb, var(--rm-sky-100) 18%, transparent)", color: "var(--rm-sky-100)" }}>
          Урок
        </span>

        {/* ── Avatars group ── */}
        <div className="h-8 px-1.5 rounded-sm border border-border bg-card flex items-center gap-1">
          <div className="flex -space-x-1.5">
            {["А", "К", "М", "Л", "С"].map((l, i) => (
              <div key={i} className={`w-6 h-6 rounded-full bg-rm-gray-2 border border-card flex items-center justify-center ${mono} text-[10px] uppercase text-muted-foreground`}>
                {l}
              </div>
            ))}
          </div>
          <span className={`${mono} text-[10px] uppercase tracking-[0.08em] text-muted-foreground pl-1`}>+12</span>
        </div>

        {/* ── Checkboxes ── */}
        <div className="h-8 px-2 rounded-sm border border-border bg-card flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm border border-border bg-[var(--rm-yellow-100)] flex items-center justify-center">
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5 9.5 3.5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground`}>Согласен</span>
        </div>
        <div className="h-8 px-2 rounded-sm border border-border bg-card flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm border border-border bg-card" />
          <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Подписка</span>
        </div>

        {/* ── Radio ── */}
        <div className="h-8 px-2 rounded-sm border border-border bg-card flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-[var(--rm-yellow-100)] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[var(--rm-yellow-100)]" />
          </div>
          <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground`}>Опция А</span>
        </div>

        {/* ── Pagination ── */}
        <div className="h-8 rounded-sm border border-border bg-card flex items-center text-muted-foreground">
          {["←", "1", "2", "3", "…", "9", "→"].map((p, i) => (
            <span
              key={i}
              className={`px-2.5 h-full flex items-center ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] ${i > 0 ? "border-l border-border" : ""} ${p === "2" ? "bg-rm-gray-2 text-foreground" : ""}`}
            >
              {p}
            </span>
          ))}
        </div>

        {/* ── Note — info ── */}
        <div className="h-8 rounded-sm border flex items-center px-2 gap-1.5" style={{ borderColor: "color-mix(in srgb, var(--rm-sky-100) 40%, transparent)", backgroundColor: "color-mix(in srgb, var(--rm-sky-100) 10%, transparent)" }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: "var(--rm-sky-100)" }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground`}>
            Note · Info
          </span>
        </div>

        {/* ── Note — warning ── */}
        <div className="h-8 rounded-sm border flex items-center px-2 gap-1.5" style={{ borderColor: "color-mix(in srgb, var(--rm-yellow-100) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--rm-yellow-100) 14%, transparent)" }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: "var(--rm-yellow-100)" }}>
            <path d="M8 1.5L15 13.5H1z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
            <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground`}>
            Warning
          </span>
        </div>

        {/* ── Breadcrumbs ── */}
        <div className={`h-8 px-2 rounded-sm border border-border bg-card flex items-center gap-1.5 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.04em] text-muted-foreground`}>
          <span>Главная</span>
          <span className="opacity-40">/</span>
          <span>Кейсы</span>
          <span className="opacity-40">/</span>
          <span className="text-foreground">EdTech</span>
        </div>

        {/* ── Tag/Chip set ── */}
        {["Стратегия", "Дизайн", "EdTech", "AI", "Команды"].map((t) => (
          <span key={t} className={`px-2 py-1 rounded-sm bg-rm-gray-2 border border-border ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>
            {t}
          </span>
        ))}

        {/* ── Hidden filler — empty space-filler component-like blocks ── */}
        {/* keeps the wrap from leaving big bottom gap on tall tiles */}
      </div>
    </div>
  )
}

function ColorsTokensPreview() {
  // Compact echo of /colors page: each accent color as a row of 5 saturation
  // levels (100..900) with the level "100" wider, mirroring the live page.
  // Plus a final neutral row with the gray ramp.
  const palette: { name: string; token: string }[] = [
    { name: "Yellow",     token: "yellow" },
    { name: "Violet",     token: "violet" },
    { name: "Sky",        token: "sky" },
    { name: "Terracotta", token: "terracotta" },
    { name: "Blue",       token: "blue" },
    { name: "Green",      token: "green" },
    { name: "Red",        token: "red" },
  ]
  const neutrals: { var: string; label: string; fg: string }[] = [
    { var: "--rm-gray-1",        label: "1",   fg: "var(--rm-gray-fg-sub)" },
    { var: "--rm-gray-2",        label: "2",   fg: "var(--rm-gray-fg-sub)" },
    { var: "--rm-gray-3",        label: "3",   fg: "var(--rm-gray-fg-sub)" },
    { var: "--rm-gray-4",        label: "4",   fg: "var(--rm-gray-fg-main)" },
    { var: "--rm-gray-fg-sub",   label: "sub", fg: "var(--rm-gray-1)" },
    { var: "--rm-gray-fg-main",  label: "fg",  fg: "var(--rm-gray-1)" },
  ]
  return (
    <div className="absolute inset-0 bg-[var(--rm-gray-1)] flex flex-col justify-center gap-1.5 px-3 py-3">
      {palette.map((p) => (
        <div key={p.token} className="flex flex-col gap-1">
          <span className={`${mono} text-[9px] uppercase tracking-[0.08em] text-muted-foreground leading-none`}>
            {p.name}
          </span>
          <div className="grid grid-cols-6 gap-px rounded-sm overflow-hidden border border-border">
            {(["100", "300", "500", "700", "900"] as const).map((lv) => (
              <div
                key={lv}
                className={`${lv === "100" ? "col-span-2" : "col-span-1"} h-5 flex items-center px-1.5`}
                style={{ backgroundColor: `var(--rm-${p.token}-${lv})` }}
              >
                <span
                  className={`${mono} text-[9px] font-medium uppercase tracking-[0.04em] leading-none`}
                  style={{ color: `var(--rm-${p.token}-${lv === "100" ? "fg" : "fg-subtle"})` }}
                >
                  {lv}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Neutral / Gray ramp */}
      <div className="flex flex-col gap-1">
        <span className={`${mono} text-[9px] uppercase tracking-[0.08em] text-muted-foreground leading-none`}>
          Neutral
        </span>
        <div className="grid grid-cols-6 gap-px rounded-sm overflow-hidden border border-border">
          {neutrals.map((n) => (
            <div
              key={n.var}
              className="h-5 flex items-center px-1.5"
              style={{ backgroundColor: `var(${n.var})` }}
            >
              <span
                className={`${mono} text-[9px] font-medium uppercase tracking-[0.04em] leading-none`}
                style={{ color: n.fg }}
              >
                {n.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TypographyPreview() {
  // Compact echo of /typography scale: rows of [label badge][sample text at size][size].
  // Sizes scaled down a touch to fit a narrow tile while preserving the ladder.
  const scale: { label: string; px: number; cls: string; sample: string }[] = [
    { label: "H1",   px: 44, cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] leading-none",   sample: "Hero" },
    { label: "H2",   px: 32, cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] leading-none",   sample: "Заголовок" },
    { label: "H4",   px: 22, cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.005em] leading-none", sample: "Подзаголовок" },
    { label: "H5",   px: 18, cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.005em] leading-none", sample: "Раздел" },
    { label: "LBL",  px: 14, cls: `${mono} font-medium uppercase tracking-[0.04em] leading-none`,                                        sample: "UI · Метка" },
    { label: "CPY",  px: 14, cls: "leading-none",                                                                                         sample: "Основной текст" },
    { label: "CODE", px: 12, cls: "font-[family-name:var(--font-caption-family)] leading-none tracking-[0.02em]",                       sample: "const id = 42" },
  ]
  return (
    <div className="absolute inset-0 bg-[var(--rm-gray-1)] flex flex-col justify-center gap-1.5 px-3 py-3">
      {scale.map((s) => (
        <div key={s.label} className="flex items-center gap-2.5 rounded-sm border border-border bg-card px-2 py-2 min-h-[36px]">
          <span className={`${mono} text-[9px] font-medium uppercase tracking-[0.04em] text-muted-foreground bg-rm-gray-2 rounded-[3px] px-1.5 py-0.5 shrink-0 w-10 text-center leading-none`}>
            {s.label}
          </span>
          <span
            className={`${s.cls} text-foreground flex-1 min-w-0 truncate`}
            style={{ fontSize: s.px }}
          >
            {s.sample}
          </span>
          <span className={`${mono} text-[9px] uppercase tracking-[0.04em] text-muted-foreground shrink-0 leading-none`}>
            {s.px}px
          </span>
        </div>
      ))}
    </div>
  )
}

function GridPreview() {
  // Compact echo of /spacing: scale ladder + page-grid hint.
  const scale: { label: string; px: number }[] = [
    { label: "GAP-1",  px: 4 },
    { label: "GAP-2",  px: 8 },
    { label: "GAP-3",  px: 12 },
    { label: "GAP-4",  px: 16 },
    { label: "GAP-6",  px: 24 },
    { label: "GAP-8",  px: 32 },
    { label: "GAP-12", px: 48 },
  ]
  return (
    <div className="absolute inset-0 bg-[var(--rm-gray-1)] flex flex-col justify-center gap-1.5 px-3 py-3">
      {scale.map((s) => (
        <div key={s.label} className="flex items-center gap-2.5 rounded-sm border border-border bg-card px-2 py-2 min-h-[36px]">
          <span className={`${mono} text-[9px] font-medium uppercase tracking-[0.04em] text-muted-foreground bg-rm-gray-2 rounded-[3px] px-1.5 py-0.5 shrink-0 w-12 text-center leading-none`}>
            {s.label}
          </span>
          <div className="flex-1 min-w-0 flex items-center">
            <div
              className="bg-[var(--rm-yellow-100)] rounded-[1px]"
              style={{ width: s.px * 1.6, height: 4 }}
            />
          </div>
          <span className={`${mono} text-[9px] uppercase tracking-[0.04em] text-muted-foreground shrink-0 leading-none`}>
            {s.px}px
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── Golden ratio background ─────────────────────────────────────────────── */

/**
 * Nested golden rectangles with the golden spiral threading through their
 * squares. Sits behind the bento grid as a subtle decorative grid.
 * ViewBox 1000×618 (1:φ). Use `preserveAspectRatio="none"` to stretch to
 * any container; the geometry is mathematically pure regardless.
 */
function GoldenRatioBg({ opacity = 0.12 }: { opacity?: number } = {}) {
  // Auto-rotate 90° when the host is portrait so the golden rectangle keeps
  // hugging the longer axis. Sized explicitly (no `height: auto`) since SVG
  // intrinsic sizing inside `position: absolute` is unreliable across browsers.
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 })
  React.useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    // Initial sync measurement to avoid a one-frame mis-render before RO fires.
    const r0 = el.getBoundingClientRect()
    setSize({ w: r0.width, h: r0.height })
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const isPortrait = size.h > size.w
  // Pre-rotation SVG dimensions. Landscape: full host width, height from aspect.
  // Portrait (rotated 90°): pre-rotation width = host height so visual height
  // fills the host; pre-rotation height = that width * 0.618.
  const svgW = isPortrait ? size.h : size.w
  const svgH = svgW * 618 / 1000
  // Subdivision sequence (computed once, kept inline for clarity).
  const rects: { x: number; y: number; w: number; h: number }[] = [
    { x: 0,   y: 0,   w: 1000, h: 618 }, // outer (the golden rect itself)
    { x: 618, y: 0,   w: 382,  h: 618 },
    { x: 618, y: 382, w: 382,  h: 236 },
    { x: 618, y: 382, w: 146,  h: 236 },
    { x: 618, y: 382, w: 146,  h: 90  },
    { x: 708, y: 382, w: 56,   h: 90  },
    { x: 708, y: 438, w: 56,   h: 34  },
    { x: 708, y: 438, w: 22,   h: 34  },
  ]
  const squares: { x: number; y: number; size: number }[] = [
    { x: 0,   y: 0,   size: 618 },
    { x: 618, y: 0,   size: 382 },
    { x: 764, y: 382, size: 236 },
    { x: 618, y: 472, size: 146 },
    { x: 618, y: 382, size: 90  },
    { x: 708, y: 382, size: 56  },
    { x: 730, y: 438, size: 34  },
    { x: 708, y: 460, size: 22  },
  ]
  const spiral =
    "M 0 618 " +
    "A 618 618 0 0 1 618 0 " +
    "A 382 382 0 0 1 1000 382 " +
    "A 236 236 0 0 1 764 618 " +
    "A 146 146 0 0 1 618 472 " +
    "A 90 90 0 0 1 708 382 " +
    "A 56 56 0 0 1 764 438 " +
    "A 34 34 0 0 1 730 472"
  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        aria-hidden
        viewBox="0 0 1000 618"
        preserveAspectRatio="none"
        className="absolute text-[var(--rm-yellow-100)]"
        width={svgW}
        height={svgH}
        style={{
          opacity,
          left: "50%",
          top: "50%",
          transform: isPortrait
            ? "translate(-50%, -50%) rotate(90deg)"
            : "translate(-50%, -50%)",
          transformOrigin: "center",
        }}
      >
      {/* Nested rectangles */}
      <g stroke="currentColor" strokeWidth="1.25" fill="none" vectorEffect="non-scaling-stroke">
        {rects.map((r, i) => (
          <rect key={`r-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} />
        ))}
        {squares.map((s, i) => (
          <rect key={`s-${i}`} x={s.x} y={s.y} width={s.size} height={s.size} opacity={0.55} />
        ))}
      </g>
      {/* Golden spiral */}
      <path
        d={spiral}
        stroke="currentColor"
        strokeWidth="1.75"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      </svg>
    </div>
  )
}

/* ── Tile definitions ────────────────────────────────────────────────────── */

type Tile = {
  href: string
  title: string
  description: string
  Preview: React.ComponentType
  /** Columns in the 4-col bento grid (1 = narrow, 2 = wide). Default 2. */
  span?: 1 | 2
}

const tiles: Tile[] = [
  { href: "/guidebook",           title: "ДС Гайдбук",  description: "Документ дизайн-системы Rocketmind v1.3 — единая точка истины.", Preview: GuidebookCoverPreview },
  { href: "/colors",              title: "Цвета",       description: "Палитра дизайн-токенов: 5 уровней насыщенности.",                Preview: ColorsTokensPreview,   span: 1 },
  { href: "/typography",          title: "Типография",  description: "Roboto Condensed, Loos, Roboto Mono.",                            Preview: TypographyPreview,     span: 1 },
  { href: "/spacing",             title: "Сетка",       description: "Шкала отступов, сетка страницы, пропорции (phi).",                Preview: GridPreview,           span: 1 },
  { href: "/icons#icons-mascots", title: "Маскоты",     description: "ИИ-герои с эмоциями для иллюстрации UI-состояний.",              Preview: MascotsPreview,        span: 1 },
  { href: "/components",          title: "Компоненты",  description: "Кнопки, инпуты, табы, бейджи, тумблеры — 25+ примитивов.",        Preview: ComponentsRowPreview },
]

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div
      className="-mx-5 md:-mx-8 -my-10 px-5 md:px-8 py-5 md:py-6"
      style={{ height: "100vh" }}
    >
      {/* Bento — 4-col grid; wide tiles span 2 cols. Fills the entire viewport. */}
      <div className="h-full grid grid-cols-1 md:grid-cols-4 grid-rows-[repeat(5,minmax(0,auto))] md:grid-rows-[repeat(2,minmax(0,1fr))] gap-3">
        {tiles.map(({ href, title, description, Preview, span = 2 }) => (
          <Link
            key={href}
            href={href}
            scroll={false}
            className={`group relative flex flex-col overflow-hidden rounded-md border border-border bg-card transition-[border-color,background-color] duration-75 active:[border:2px_solid_var(--rm-yellow-100)] dark:border-white/[0.06] min-h-[220px] ${
              span === 1 ? "md:col-span-1" : "md:col-span-2"
            }`}
          >
            {/* Preview area */}
            <div className="relative flex-1 min-h-0 overflow-hidden border-b border-border">
              <Preview />
            </div>

            {/* Caption */}
            <div className="shrink-0 flex items-start justify-between gap-3 px-4 py-3 md:px-5 md:py-3.5">
              <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] md:text-[length:var(--text-18)] uppercase tracking-[-0.005em] leading-[1.15]">
                  {title}
                </h3>
                <p className="text-[length:var(--text-12)] md:text-[length:var(--text-14)] text-muted-foreground leading-[1.4] line-clamp-1">
                  {description}
                </p>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 mt-1 text-muted-foreground transition-all duration-200 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Yellow hover — last child so the cursor-following glow ring
                stacks above the preview + caption (same z-auto, later DOM wins). */}
            <GlowingEffect
              variant="yellow"
              borderWidth={2}
              spread={40}
              proximity={40}
              inactiveZone={0.01}
              glow={false}
              disabled={false}
              className="z-20"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
