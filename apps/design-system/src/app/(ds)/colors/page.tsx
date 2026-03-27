"use client"

import React from "react"
import { CopyButton } from "@/components/copy-button"
import { Separator } from "@rocketmind/ui"
import { ChevronRight } from "lucide-react"
import { Section, SubSection } from "@/components/ds/shared"
import { ColorHexBlock, FgRow } from "@/components/ds/color-helpers"

export default function ColorsPage() {
  return (
    <>
      <Section id="colors" title="1. Цветовая палитра">
        <p className="text-muted-foreground mb-8">
          Все цвета — CSS-переменные. Акцентный цвет бренда — <strong className="text-[var(--rm-yellow-100)]">#FFCC00</strong>.
          Категориальные цвета используются для кодировки данных, тегов, карточек.
        </p>

        {/* ── Backgrounds ── */}
        <SubSection id="colors-bg" title="Фоны" first />
        <div className="border border-border rounded-lg overflow-hidden grid grid-cols-2 mb-3">
          {[
            { name: "Background", var: "--background",    token: "--background", lhex: "#FAFAFA", dhex: "#0A0A0A",
              note: "Основной фон страницы. Используй по умолчанию — особенно когда поверх кладёшь цвет." },
            { name: "Card",       var: "--card",          token: "--card",       lhex: "#FFFFFF", dhex: "#121212",
              note: "Поверхность карточек и поповеров. Слой над фоном страницы." },
          ].map((c, i) => (
            <div key={c.token} className={`flex flex-col gap-2 p-3 ${i < 1 ? "border-r border-border" : ""}`}>
              <ColorHexBlock
                className="w-full h-16 rounded-sm"
                style={{ backgroundColor: `var(${c.var})` }}
              />
              <div>
                <p className="text-[length:var(--text-14)] font-medium">{c.name}</p>
                <div className="flex items-center gap-0.5">
                  <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] flex-1">{c.token}</p>
                  <CopyButton value={c.token} label={`Токен: ${c.token}`} />
                </div>
                <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">L: {c.lhex} · D: {c.dhex}</p>
              </div>
              <p className="text-[length:var(--text-12)] text-muted-foreground leading-relaxed border-t border-border pt-2">{c.note}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-rm-gray-2/40 px-4 py-3 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] mb-10 leading-relaxed">
          Background (#FAFAFA / #0A0A0A) — фон страницы, всегда первый слой.
          Card (#FFFFFF / #121212) — поверхность карточек и поповеров поверх Background.
        </div>

        {/* ── Gray Scale ── */}
        <SubSection id="colors-gray" title="Серая шкала" />
        <p className="text-[length:var(--text-13)] text-muted-foreground font-[family-name:var(--font-mono-family)] mb-3">
          Используй шкалу последовательно — не пропускай уровни без причины.
        </p>
        <div className="border border-border rounded-lg overflow-hidden grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 mb-10">
          {(() => {
            const grays = [
              { name: "Gray 1",  var: "--rm-gray-1",  role: "Subtle surface", lhex: "#F5F5F5", dhex: "#1A1A1A" },
              { name: "Gray 2",  var: "--rm-gray-2",  role: "Hover bg",       lhex: "#EBEBEB", dhex: "#242424" },
              { name: "Gray 3",  var: "--rm-gray-3",  role: "Default border", lhex: "#CBCBCB", dhex: "#404040" },
              { name: "Gray 4",  var: "--rm-gray-4",  role: "Hover border",   lhex: "#A3A3A3", dhex: "#5C5C5C" },
              { name: "Gray fg-sub",  var: "--rm-gray-fg-sub",  role: "2nd text",       lhex: "#666666", dhex: "#939393" },
              { name: "Gray fg-main", var: "--rm-gray-fg-main", role: "Primary text",   lhex: "#2D2D2D", dhex: "#F0F0F0" },
            ]
            return grays.map((c, i) => (
              <div key={c.var} className={`flex flex-col gap-1.5 p-3 ${i < grays.length - 1 ? "border-r border-border" : ""}`}>
                <ColorHexBlock
                  className="w-full h-10 rounded-sm"
                  style={{ backgroundColor: `var(${c.var})` }}
                />
                <p className="text-[length:var(--text-12)] font-medium font-[family-name:var(--font-mono-family)]">{c.name}</p>
                <div className="flex items-center gap-0.5">
                  <p className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)] flex-1 truncate">{c.var}</p>
                  <CopyButton value={c.var} label={`Токен: ${c.var}`} />
                </div>
                <p className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">{c.role}</p>
              </div>
            ))
          })()}
          {/* Group labels row — visible only at md (6-col grid) */}
          <div className="hidden md:flex md:col-span-2 border-t border-border border-r px-3 py-2 items-center">
            <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">фоны компонентов</span>
          </div>
          <div className="hidden md:flex md:col-span-2 border-t border-border border-r px-3 py-2 items-center">
            <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">границы</span>
          </div>
          <div className="hidden md:flex md:col-span-1 border-t border-border border-r px-3 py-2 items-center">
            <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">вторичный текст</span>
          </div>
          <div className="hidden md:flex md:col-span-1 border-t border-border px-3 py-2 items-center">
            <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">основной текст</span>
          </div>
        </div>

        {/* ── Accent Scale ── */}
        <SubSection id="colors-accent" title="Акцентная шкала" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
          Каждый цвет имеет 5 уровней насыщенности и 2 foreground-токена.
        </p>

        {/* Scale legend */}
        <div className="border border-border rounded-lg overflow-hidden grid grid-cols-6 mb-6 text-[10px] font-[family-name:var(--font-mono-family)] text-muted-foreground">
          <div className="col-span-2 px-2 py-2 border-r border-border">
            <p className="font-bold text-foreground mb-0.5">100</p>
            <p className="leading-snug">Solid fill. Кнопка, filled badge, иконка-заливка.</p>
          </div>
          {[
            { level: "300", role: "Subtle border. Граница chip/тега в покое." },
            { level: "500", role: "Component bg active. Нажатое состояние." },
            { level: "700", role: "Component bg hover. Наведение на chip/row." },
            { level: "900", role: "Subtle background. Badge ghost, строка таблицы, фон карточки." },
          ].map((l, i, arr) => (
            <div key={l.level} className={`px-2 py-2 ${i < arr.length - 1 ? "border-r border-border" : ""}`}>
              <p className="font-bold text-foreground mb-0.5">{l.level}</p>
              <p className="leading-snug">{l.role}</p>
            </div>
          ))}
          <div className="col-span-2 border-t border-border px-2 py-2 border-r">
            <span className="font-bold text-foreground">fg</span> — текст поверх solid-100 фона (WCAG AA).
          </div>
          <div className="col-span-4 border-t border-border px-2 py-2">
            <span className="font-bold text-foreground">fg-subtle</span> — текст поверх 300–900 фона (WCAG AA).
          </div>
        </div>

        {/* Color scales */}
        <div className="space-y-8">
          {[
            { name: "Yellow · Бренд-акцент",  token: "yellow",
              lhex: { 100:"#FFCC00", 300:"#FFE066", 500:"#FFF0AA", 700:"#FFF7CC", 900:"#FFFEF3", fg:"#3D2E00", fgs:"#5C4200" },
              dhex: { 100:"#FFCC00", 300:"#B38F00", 500:"#7A6200", 700:"#4A3C00", 900:"#3D3300", fg:"#0A0800", fgs:"#FFE566" } },
            { name: "Violet · Категориальный", token: "violet",
              lhex: { 100:"#A172F8", 300:"#C4A0FB", 500:"#DCC8FF", 700:"#EDE0FF", 900:"#FBFAFE", fg:"#FFF", fgs:"#3D1A8A" },
              dhex: { 100:"#B48DFA", 300:"#8A5FF5", 500:"#5A3D99", 700:"#2E1F66", 900:"#20143D", fg:"#0A050F", fgs:"#DCC8FF" } },
            { name: "Sky · Категориальный",    token: "sky",
              lhex: { 100:"#56CAEA", 300:"#8ADCF2", 500:"#C3ECF7", 700:"#E0F6FB", 900:"#F7FDFF", fg:"#FFF", fgs:"#0D4D5C" },
              dhex: { 100:"#7AD6EF", 300:"#3AAACE", 500:"#1A5F72", 700:"#0A2D38", 900:"#051A20", fg:"#020D10", fgs:"#C3ECF7" } },
            { name: "Terracotta · Категориальный", token: "terracotta",
              lhex: { 100:"#FE733A", 300:"#FFA07A", 500:"#FFD6AD", 700:"#FFECE0", 900:"#FFFAF7", fg:"#FFF", fgs:"#5C1A00" },
              dhex: { 100:"#FF8A5C", 300:"#CC5522", 500:"#7A2E10", 700:"#3D1507", 900:"#2A0F05", fg:"#0A0300", fgs:"#FFD6AD" } },
            { name: "Pink · Категориальный",   token: "pink",
              lhex: { 100:"#FF54AC", 300:"#FF8FCA", 500:"#FFB8D9", 700:"#FFE0EF", 900:"#FFF8FC", fg:"#FFF", fgs:"#6B0033" },
              dhex: { 100:"#FF7EC5", 300:"#CC3D88", 500:"#7A1A55", 700:"#3D0D2A", 900:"#25061A", fg:"#0A0208", fgs:"#FFB8D9" } },
            { name: "Blue · Категориальный",   token: "blue",
              lhex: { 100:"#4A56DF", 300:"#8A94EC", 500:"#BFC4F3", 700:"#E0E2FA", 900:"#F9FAFF", fg:"#FFF", fgs:"#0D1466" },
              dhex: { 100:"#7A84F0", 300:"#3D4ACC", 500:"#1E2870", 700:"#0D1238", 900:"#060A24", fg:"#020310", fgs:"#BFC4F3" } },
            { name: "Red · Семантика: ошибка", token: "red",
              lhex: { 100:"#ED4843", 300:"#F48A87", 500:"#FFBCBA", 700:"#FFE0DF", 900:"#FFF9F8", fg:"#FFF", fgs:"#5C0A08" },
              dhex: { 100:"#F47370", 300:"#CC2E2A", 500:"#7A1715", 700:"#3D0908", 900:"#250504", fg:"#0A0202", fgs:"#FFBCBA" } },
            { name: "Green · Семантика: успех", token: "green",
              lhex: { 100:"#9AF576", 300:"#C0F9A8", 500:"#D8F4CD", 700:"#ECFAE6", 900:"#F7FEF3", fg:"#1A4A05", fgs:"#1A4A05" },
              dhex: { 100:"#B5FA97", 300:"#6ACC44", 500:"#2A6E15", 700:"#133808", 900:"#0A2005", fg:"#020A01", fgs:"#D8F4CD" } },
          ].map((c) => (
            <div key={c.token}>
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-3">{c.name}</p>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-6">
                  {(["100","300","500","700","900"] as const).map((level, li) => (
                    <div key={level} className={`${level === "100" ? "col-span-2" : ""} flex flex-col gap-1.5 p-2 ${li < 4 ? "border-r border-border" : ""}`}>
                      <ColorHexBlock
                        className="w-full h-12 rounded-sm"
                        style={{ backgroundColor: `var(--rm-${c.token}-${level})` }}
                        badgeColor={level === "100" ? `var(--rm-${c.token}-fg)` : `var(--rm-${c.token}-fg-subtle)`}
                        badge={level}
                      />
                      <div className="flex items-center justify-between gap-0.5">
                        <p className="text-[10px] font-[family-name:var(--font-mono-family)] text-muted-foreground truncate">--rm-{c.token}-{level}</p>
                        <CopyButton value={`--rm-${c.token}-${level}`} label={`Токен: --rm-${c.token}-${level}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <FgRow token={c.token} />
              </div>
            </div>
          ))}
        </div>

        {/* ── On-color surfaces ── */}
        <SubSection id="colors-inverted" title="Инвертированные поверхности" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блоки с акцентным фоном. Добавь класс <code className="font-[family-name:var(--font-caption-family)] text-foreground">.on-{"{color}"}</code> на контейнер —
          все дочерние токены (<code className="font-[family-name:var(--font-caption-family)] text-foreground">--foreground</code>, <code className="font-[family-name:var(--font-caption-family)] text-foreground">--border</code>) автоматически инвертируются.
        </p>
        <div className="on-yellow rounded-lg px-10 py-14 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.1em] mb-4 opacity-60">Брендовый блок · .on-yellow</p>
            <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-3 leading-tight">
              Готов запустить агента?
            </h4>
            <p className="text-[length:var(--text-16)] opacity-70 max-w-md">
              Попробуй Rocketmind — AI-агенты для твоего бизнеса без написания кода.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider transition-all duration-150"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              Попробовать
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-rm-gray-2/40 px-4 py-3 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] leading-relaxed">
          <span className="text-foreground font-medium">.on-yellow</span> — основной CTA-блок бренда, hero-секции, highlight-полосы.
          Используй только один такой блок на экране. Остальные .on-* — для категориальной маркировки секций.
        </div>
      </Section>

      <Separator />
    </>
  )
}
