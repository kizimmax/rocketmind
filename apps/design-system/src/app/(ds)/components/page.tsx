"use client"

import React from "react"
import {
  Avatar, AvatarFallback, AvatarImage,
  ArticleCard,
  Badge, GlowingEffect, ProductCard, ProductImageCard, ScrollArea,
  SectionAsideProductCard,
  Separator, Skeleton, Slider,
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@rocketmind/ui"
import { Section, SubSection } from "@/components/ds/shared"
import { CopyButton } from "@/components/copy-button"
import { SearchComboboxShowcase } from "@/components/ui/search-combobox-showcase"
import { TextareaShowcase } from "@/components/ui/textarea-showcase"
import { CheckboxShowcase } from "@/components/ui/checkbox-showcase"
import { RadioShowcase } from "@/components/ui/radio-showcase"
import { SwitchShowcase } from "@/components/ui/switch-showcase"
import { NoteShowcase } from "@/components/ui/note-showcase"
import { TableShowcase } from "@/components/ui/table-showcase"
import { DialogShowcase } from "@/components/ui/dialog-showcase"
import { DropdownMenuShowcase } from "@/components/ui/dropdown-menu-showcase"
import { ToastShowcase } from "@/components/ui/toast-showcase"
import { ShowMoreShowcase } from "@/components/ui/show-more-showcase"
import { ArticlePaginationShowcase } from "@/components/ui/article-pagination-showcase"
import { AccordionShowcase } from "@/components/ui/accordion-showcase"
import {
  Rocket, Gem, BookOpen, Search,
  Loader2, Trash2, Wrench
} from "lucide-react"

function SliderInteractiveDemo() {
  const [val, setVal] = React.useState(0.6)
  return <Slider value={val} min={0} max={1} step={0.01} width={200} onChange={setVal} />
}

/** Demo: Slider Number — numbers stay in place, slider appears after active */
function SliderNumberDemo() {
  const [active, setActive] = React.useState(0)
  const count = 5
  const duration = 4000

  React.useEffect(() => {
    const t = setTimeout(() => setActive((p) => (p + 1) % count), duration)
    return () => clearTimeout(t)
  }, [active])

  return (
    <div className="flex items-center gap-4">
      {Array.from({ length: count }, (_, i) => (
        <React.Fragment key={i}>
          <button
            onClick={() => setActive(i)}
            className={[
              "font-[family-name:var(--font-mono-family)] text-[16px] uppercase tracking-[0.02em] leading-[1.16] transition-colors cursor-pointer",
              i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
          {i === active && <Slider animate animateKey={active} animationDuration={duration} />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function ComponentsPage() {
  const mono = "font-[family-name:var(--font-mono-family)]"

  return (
    <>
      <Section id="components" title="Компоненты">
        <p className="text-muted-foreground mb-8">
          Базовые UI-примитивы Rocketmind. Каждый компонент использует только токены дизайн-системы — никаких одноразовых значений.
        </p>

        {/* ── Кнопки ── */}
        <div className="mb-12">
          <SubSection id="components-buttons" title="Кнопки" first />
          <p className={`text-[length:var(--text-14)] text-muted-foreground mb-6`}>
            Четыре варианта × четыре размера. Высоты совпадают с инпутами — LG (48px) / MD (40px) / SM (32px) / XS (28px).
          </p>

          {/* Variant × Size grid */}
          {(() => {
            const sizes = [
              { id: "lg", label: "LG / 48px", h: "h-12", px: "px-6", fs: "text-[length:var(--text-16)]" },
              { id: "md", label: "MD / 40px", h: "h-10", px: "px-4", fs: "text-[length:var(--text-14)]" },
              { id: "sm", label: "SM / 32px", h: "h-8",  px: "px-3", fs: "text-[length:var(--text-12)]" },
              { id: "xs", label: "XS / 28px", h: "h-7",  px: "px-3", fs: "text-[length:var(--text-12)]" },
            ]
            const variants: {
              id: string; name: string; desc: string; token: string
              render: (h: string, px: string, fs: string) => React.ReactNode
            }[] = [
              {
                id: "primary", name: "Primary", token: "btn-primary",
                desc: "Главное действие на экране. Hero CTA, финальный шаг формы. Один на странице.",
                render: (h, px, fs) => (
                  <button className={`inline-flex items-center justify-center gap-2 ${h} ${px} rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] ${mono} ${fs} uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040] active:bg-[#E6B800] cursor-pointer`}>
                    Запустить
                  </button>
                ),
              },
              {
                id: "secondary", name: "Secondary", token: "btn-secondary",
                desc: "Второстепенное действие рядом с primary. Фильтры, переключатели.",
                render: (h, px, fs) => (
                  <button className={`inline-flex items-center justify-center gap-2 ${h} ${px} rounded-sm border border-transparent bg-secondary text-secondary-foreground ${mono} ${fs} uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-[0.88] active:opacity-[0.76] cursor-pointer`}>
                    Подробнее
                  </button>
                ),
              },
              {
                id: "ghost", name: "Ghost", token: "btn-ghost",
                desc: "Тихое нейтральное действие: серый фон и border.",
                render: (h, px, fs) => (
                  <button className={`inline-flex items-center justify-center gap-2 ${h} ${px} rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} ${fs} uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] active:bg-[var(--rm-gray-3)] cursor-pointer`}>
                    Отмена
                  </button>
                ),
              },
              {
                id: "destructive", name: "Destructive", token: "btn-destructive",
                desc: "Необратимые действия. Удаление, архивация. Требует диалог подтверждения.",
                render: (h, px, fs) => (
                  <button className={`inline-flex items-center justify-center gap-2 ${h} ${px} rounded-sm bg-destructive text-white ${mono} ${fs} uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-90 active:opacity-75 cursor-pointer`}>
                    <Trash2 size={13} /> Удалить
                  </button>
                ),
              },
            ]
            return (
              <div className="border border-border rounded-lg overflow-hidden bg-border mb-6">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-[1px]">
                  <div className="bg-muted/60 px-4 py-3" />
                  {sizes.map((s) => (
                    <div key={s.id} className="bg-muted/60 px-4 py-3 flex items-center justify-center">
                      <span className={`text-[10px] text-muted-foreground ${mono} uppercase tracking-wider`}>{s.label}</span>
                    </div>
                  ))}
                  {variants.map((v) => (
                    <React.Fragment key={v.id}>
                      <div className="bg-background px-4 py-4 flex flex-col justify-center gap-1">
                        <p className={`${mono} font-medium text-[length:var(--text-13)] uppercase tracking-wider`}>{v.name}</p>
                        <p className={`text-[10px] text-muted-foreground ${mono} leading-relaxed`}>{v.desc}</p>
                      </div>
                      {sizes.map((s) => (
                        <div key={s.id} className="bg-background px-4 py-4 flex flex-col items-center justify-center gap-2">
                          {v.render(s.h, s.px, s.fs)}
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <span className={`text-[10px] text-muted-foreground ${mono}`}>{v.token}</span>
                            <CopyButton value={v.token} label={`Скопировать: ${v.token}`} />
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* States */}
          <div className="border border-border rounded-lg overflow-hidden">
            <p className="px-4 pt-4 pb-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">Состояния</p>
            <p className="px-4 pb-2 text-[10px] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/60">Hover</p>
            <div className="flex flex-wrap items-end gap-4 px-4 pb-4">
              {[
                { label: "Primary",     cls: "bg-[#FFE040] text-[var(--rm-yellow-fg)]",                                              hint: "bg #FFE040 (–10%)" },
                { label: "Secondary",   cls: "border border-transparent bg-secondary text-secondary-foreground opacity-[0.88]",       hint: "opacity 0.88" },
                { label: "Ghost",       cls: "border border-border bg-[var(--rm-gray-2)] text-foreground",                            hint: "bg --rm-gray-2" },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-start gap-1.5">
                  <button className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-sm ${mono} text-[length:var(--text-13)] uppercase tracking-[0.08em] ${b.cls}`}>{b.label}</button>
                  <span className={`text-[10px] text-muted-foreground ${mono}`}>{b.hint}</span>
                </div>
              ))}
              <div className="flex flex-col items-start gap-1.5">
                <button className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-sm bg-destructive text-white opacity-90 ${mono} text-[length:var(--text-13)] uppercase tracking-[0.08em]`}><Trash2 size={13} /> Destructive</button>
                <span className={`text-[10px] text-muted-foreground ${mono}`}>opacity-90</span>
              </div>
            </div>
            <p className="px-4 pb-2 text-[10px] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/60">Disabled</p>
            <div className="flex flex-wrap items-end gap-4 px-4 pb-4">
              {[
                { label: "Primary",     cls: "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)]" },
                { label: "Secondary",   cls: "border border-transparent bg-secondary text-secondary-foreground" },
                { label: "Ghost",       cls: "border border-border bg-[var(--rm-gray-1)] text-foreground" },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-start gap-1.5">
                  <button disabled className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-sm ${mono} text-[length:var(--text-13)] uppercase tracking-[0.08em] ${b.cls} opacity-50 cursor-not-allowed`}>{b.label}</button>
                  <span className={`text-[10px] text-muted-foreground ${mono}`}>opacity 0.5 + cursor not-allowed</span>
                </div>
              ))}
              <div className="flex flex-col items-start gap-1.5">
                <button disabled className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-sm bg-destructive text-white opacity-50 cursor-not-allowed ${mono} text-[length:var(--text-13)] uppercase tracking-[0.08em]`}><Trash2 size={13} /> Destructive</button>
                <span className={`text-[10px] text-muted-foreground ${mono}`}>opacity 0.5 + cursor not-allowed</span>
              </div>
            </div>
            <p className="px-4 pb-2 text-[10px] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/60">Loading</p>
            <div className="flex flex-wrap items-end gap-4 px-4 pb-4">
              <div className="flex flex-col items-start gap-1.5">
                <button className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] ${mono} text-[length:var(--text-13)] uppercase tracking-[0.08em] opacity-80 cursor-wait`}>
                  <Loader2 size={13} className="animate-spin" /> Loading
                </button>
                <span className={`text-[10px] text-muted-foreground ${mono}`}>opacity-80 + Loader2 spinner</span>
              </div>
            </div>
          </div>

          {/* Icon buttons */}
          {(() => {
            const iconSizes = [
              { size: "icon-lg", label: "MD / 40px", px: 40, desc: "Крупные icon-кнопки для hero-секций и standalone-действий." },
              { size: "icon", label: "SM / 32px", px: 32, desc: "Основные icon-кнопки: undo, redo, тема, навигация." },
              { size: "icon-sm", label: "XS / 28px", px: 28, desc: "Toolbar-кнопки рядом с компактными текстовыми кнопками." },
              { size: "icon-micro", label: "Micro / 20px", px: 20, desc: "Inline-контролы: удалить карточку, обновить саммари. Выровнен с Checkbox/Radio 20×20." },
            ]
            return (
              <div className="border border-border rounded-lg overflow-hidden bg-border mt-6">
                <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${iconSizes.length}, 1fr)` }}>
                  {iconSizes.map(({ size, label }) => (
                    <div key={`h-${size}`} className="bg-muted/60 px-4 py-3 flex items-center justify-between gap-2">
                      <span className={`text-[10px] text-muted-foreground ${mono} uppercase tracking-wider`}>{label}</span>
                      <CopyButton value={`<Button variant="ghost" size="${size}" />`} label={size} />
                    </div>
                  ))}
                  {iconSizes.map(({ size, px }) => (
                    <div key={`b-${size}`} className="bg-background px-4 py-5 flex items-center gap-3">
                      <button
                        className="inline-flex items-center justify-center rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer flex-shrink-0"
                        style={{ width: px, height: px, fontSize: px <= 20 ? 11 : 14 }}
                      >×</button>
                      <p className={`text-[10px] text-muted-foreground ${mono} leading-relaxed`}>
                        {iconSizes.find(s => s.size === size)!.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>

        {/* ── Бейджи ── */}
        <div className="mb-12">
          <SubSection id="components-badges" title="Бейджи" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Лейблы для статусов, категорий и тегов. Шрифт — Loos Latin Condensed Medium, uppercase. Три размера: SM (20px) / MD (24px) / LG (28px).
          </p>

          {(() => {
            const colors: { label: string; variant: string }[] = [
              { label: "Neutral",     variant: "neutral" },
              { label: "Yellow",      variant: "yellow-subtle" },
              { label: "Violet",      variant: "violet-subtle" },
              { label: "Sky",         variant: "sky-subtle" },
              { label: "Terracotta",  variant: "terracotta-subtle" },
              { label: "Pink",        variant: "pink-subtle" },
              { label: "Blue",        variant: "blue-subtle" },
              { label: "Red",         variant: "red-subtle" },
              { label: "Green",       variant: "green-subtle" },
            ]
            const sizes: { label: string; size: "sm" | "md" | "lg" }[] = [
              { label: "SM / 20px", size: "sm" },
              { label: "MD / 24px", size: "md" },
              { label: "LG / 28px", size: "lg" },
            ]
            return (
              <div className="border border-border rounded-lg overflow-hidden mb-6">
                <div className="grid border-b border-border" style={{ gridTemplateColumns: "120px 1fr 1fr 1fr" }}>
                  <div className={`px-3 py-2 bg-[var(--rm-gray-1)] text-[10px] ${mono} uppercase tracking-wider text-muted-foreground border-r border-border`}>Цвет</div>
                  <div className={`px-3 py-2 bg-[var(--rm-gray-1)] text-[10px] ${mono} uppercase tracking-wider text-muted-foreground col-span-3`}>Variant</div>
                </div>
                <div className="grid border-b border-border" style={{ gridTemplateColumns: "120px 1fr 1fr 1fr" }}>
                  <div className="border-r border-border" />
                  {sizes.map((s, i) => (
                    <div key={`sh-${s.size}`} className={`px-3 py-1.5 text-[10px] ${mono} uppercase tracking-wider text-muted-foreground ${i < sizes.length - 1 ? "border-r border-border" : ""}`}>{s.label}</div>
                  ))}
                </div>
                {colors.map((c, ri) => (
                  <div key={c.label} className="grid items-center" style={{ gridTemplateColumns: "120px 1fr 1fr 1fr", borderBottom: ri < colors.length - 1 ? "1px solid var(--border)" : undefined }}>
                    <div className={`px-3 py-3 text-[10px] ${mono} uppercase tracking-wider text-muted-foreground border-r border-border`}>{c.label}</div>
                    {sizes.map((s, i) => (
                      <div key={`${c.label}-${s.size}`} className={`px-3 py-3 flex items-center ${i < sizes.length - 1 ? "border-r border-border" : ""}`}>
                        {/* @ts-expect-error variant union */}
                        <Badge variant={c.variant} size={s.size}>{s.size === "lg" ? "Статус" : s.size === "md" ? "Тег" : "Мета"}</Badge>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          })()}

          <div className="border border-border rounded-lg overflow-hidden">
            <p className="px-4 py-2 text-[10px] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground bg-[var(--rm-gray-1)] border-b border-border">Контекстные примеры</p>
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 p-3 border border-border rounded-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-[length:var(--text-14)] font-medium text-foreground truncate">AI-агент «Аналитик»</p>
                  <p className="text-[length:var(--text-12)] text-muted-foreground mt-0.5">Финансовый анализ и прогнозирование</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant="green-subtle" size="sm">Активен</Badge>
                  <Badge variant="violet-subtle" size="sm">Pro</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[length:var(--text-12)] text-muted-foreground ${mono}`}>Статусы:</span>
                <Badge variant="green-subtle" size="md">Активен</Badge>
                <Badge variant="yellow-subtle" size="md">Ожидание</Badge>
                <Badge variant="red-subtle" size="md">Ошибка</Badge>
                <Badge variant="neutral" size="md">Архив</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ── Табы ── */}
        <div className="mb-12">
          <SubSection id="components-tabs" title="Табы" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Tabs переключают соседние панели без смены экрана. <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">default</code> для равноправных наборов данных, <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">secondary</code> для локальной навигации.
          </p>

          <div className="overflow-auto rounded-lg border border-border mb-6">
            <table className="w-full min-w-[960px] text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="w-[32%] text-left px-4 py-3 font-medium">Ключевые сценарии</th>
                  <th className="text-left px-4 py-3 font-medium">Пример</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-b border-border">
                  <td className="px-4 py-4">
                    <p className={`text-[length:var(--text-12)] ${mono} uppercase tracking-[0.08em] text-foreground mb-1`}>Default</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground">Сегментированный список с одной активной вкладкой. Для равноправных наборов данных.</p>
                  </td>
                  <td className="px-4 py-4">
                    <Tabs defaultValue="apple" className="w-full">
                      <TabsList>
                        <TabsTrigger value="apple">Apple</TabsTrigger>
                        <TabsTrigger value="orange">Orange</TabsTrigger>
                        <TabsTrigger value="mango">Mango</TabsTrigger>
                      </TabsList>
                      <TabsContent value="apple" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Используй для переключения соседних наборов данных: «Все кейсы / Активные / Архив».</p>
                      </TabsContent>
                      <TabsContent value="orange" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Второй таб получает тот же контейнер панели без смены структуры.</p>
                      </TabsContent>
                      <TabsContent value="mango" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Активная вкладка: bg-background, border-border, текст --foreground.</p>
                      </TabsContent>
                    </Tabs>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-4">
                    <p className={`text-[length:var(--text-12)] ${mono} uppercase tracking-[0.08em] text-foreground mb-1`}>With Icons</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground">Иконка работает как вспомогательный смысловой маркер и не заменяет текстовую метку.</p>
                  </td>
                  <td className="px-4 py-4">
                    <Tabs defaultValue="agents" className="w-full">
                      <TabsList>
                        <TabsTrigger value="agents"><Rocket size={14} /> Agents</TabsTrigger>
                        <TabsTrigger value="search"><Search size={14} /> Search</TabsTrigger>
                        <TabsTrigger value="academy"><BookOpen size={14} /> Academy</TabsTrigger>
                      </TabsList>
                      <TabsContent value="agents" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Используй только известные 16px-иконки Lucide без цветных акцентов.</p>
                      </TabsContent>
                      <TabsContent value="search" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Текст остаётся главным носителем смысла, иконка вторична.</p>
                      </TabsContent>
                      <TabsContent value="academy" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Иконка помогает быстрее сканировать вкладки на плотных экранах.</p>
                      </TabsContent>
                    </Tabs>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4">
                    <p className={`text-[length:var(--text-12)] ${mono} uppercase tracking-[0.08em] text-foreground mb-1`}>Secondary</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground">Тихая навигация внутри секции с подчёркнутым активным состоянием.</p>
                  </td>
                  <td className="px-4 py-4">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList variant="secondary" className="mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="files">Files</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Нужен для тихой навигации внутри уже выбранного объекта: кейса, агента, карточки.</p>
                      </TabsContent>
                      <TabsContent value="activity" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Secondary не используется как основной page-switcher на верхнем уровне экрана.</p>
                      </TabsContent>
                      <TabsContent value="files" className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[length:var(--text-14)] text-foreground">Активность через жёлтое подчёркивание --rm-yellow-100.</p>
                      </TabsContent>
                    </Tabs>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-auto rounded-lg border border-border mb-6">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Состояние / часть</th>
                  <th className="text-left px-4 py-2 font-medium">Токены</th>
                  <th className="text-left px-4 py-2 font-medium">Правило</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["TabsList default",  "bg --rm-gray-1 · border --border · radius --radius-sm", "Контейнер для сегментированных табов с общей подложкой."],
                  ["TabsTrigger default","text --muted-foreground", "Неактивный триггер остаётся нейтральным."],
                  ["Hover",             "bg --rm-gray-2 · text --foreground", "Hover только на триггере, без glow и тени."],
                  ["Active",            "bg --background · border --border · text --foreground", "Активный таб — вложенная поверхность внутри списка."],
                  ["Disabled",          "opacity 0.4", "Вкладка видна в иерархии, но не интерактивна."],
                  ["Secondary active",  "underline --rm-yellow-100", "Подчёркивание заменяет filled-background."],
                ].map(([part, token, rule]) => (
                  <tr key={part} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{part}</td>
                    <td className={`px-4 py-2 ${mono} text-[length:var(--text-12)]`}>{token}</td>
                    <td className="px-4 py-2">{rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Чекбоксы ── */}
        <div className="mb-12">
          <SubSection id="components-checkboxes" title="Чекбоксы" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Паттерн для независимого yes/no-выбора. Основа: 16×16 control, общий focus-visible и один акцент для checked и indeterminate.
          </p>
          <CheckboxShowcase />
        </div>

        {/* ── Радио ── */}
        <div className="mb-12">
          <SubSection id="components-radio" title="Радио" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Паттерн для выбора одного варианта из группы. Основа: 16×16 control, один активный выбор и headless-композиция внутри строки.
          </p>
          <RadioShowcase />
        </div>

        {/* ── Тумблер ── */}
        <div className="mb-12">
          <SubSection id="components-switch" title="Тумблер" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Немедленный on/off. Squircle-форма (<code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">rounded-sm</code>, 4px) — как у всех контролов DS.
          </p>
          <SwitchShowcase />
        </div>

        {/* ── Примечания ── */}
        <div className="mb-12">
          <SubSection id="components-notes" title="Примечания / Notes" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Постоянные сервисные сообщения внутри экрана: подсказки, предупреждения, подтверждения и локальные CTA. Используют только operational-состояния и существующие status/surface-токены.
          </p>
          <NoteShowcase />
        </div>

        {/* ── Таблицы ── */}
        <div className="mb-12">
          <SubSection id="components-tables" title="Таблицы" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Паттерн для плотных сравнимых данных: кейсы, платежи, документы, usage-отчёты. Таблица собирается на существующих surface, border, badge и control-токенах.
          </p>
          <TableShowcase />
        </div>

        {/* ── Инпуты ── */}
        <div className="mb-12">
          <SubSection id="components-inputs" title="Инпуты" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">Четыре размера идентичны кнопкам по высоте и padding: LG (48px) / MD (40px, default) / SM (32px) / XS (28px).</p>

          {(() => {
            const sizes = [
              { id: "lg", label: "LG / 48px", h: "h-12", px: "px-6", fs: "text-[length:var(--text-16)]" },
              { id: "md", label: "MD / 40px", h: "h-10", px: "px-4", fs: "text-[length:var(--text-14)]" },
              { id: "sm", label: "SM / 32px", h: "h-8",  px: "px-3", fs: "text-[length:var(--text-12)]" },
              { id: "xs", label: "XS / 28px", h: "h-7",  px: "px-3", fs: "text-[length:var(--text-12)]" },
            ]
            const states: {
              id: string; name: string; desc: string
              render: (h: string, px: string, fs: string) => React.ReactNode
            }[] = [
              {
                id: "default", name: "Default",
                desc: "Стандартное поле. border: --border, bg: --rm-gray-1.",
                render: (h, px, fs) => (
                  <input type="text" placeholder="Email..." className={`w-full ${h} ${px} rounded-sm border border-border bg-rm-gray-1 text-foreground ${fs} placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:border-ring`} />
                ),
              },
              {
                id: "error", name: "Error",
                desc: "Ошибка валидации. border: --destructive.",
                render: (h, px, fs) => (
                  <input type="text" defaultValue="invalid" className={`w-full ${h} ${px} rounded-sm border border-destructive bg-rm-gray-1 text-foreground ${fs} transition-all duration-150 focus:outline-none`} />
                ),
              },
              {
                id: "disabled", name: "Disabled",
                desc: "Недоступно. opacity: 0.4, cursor: not-allowed.",
                render: (h, px, fs) => (
                  <input type="text" disabled placeholder="Email..." className={`w-full ${h} ${px} rounded-sm border border-border bg-rm-gray-1 text-foreground ${fs} placeholder:text-muted-foreground transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed`} />
                ),
              },
            ]
            return (
              <div className="border border-border rounded-lg overflow-hidden bg-border mb-6">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-[1px]">
                  <div className="bg-muted/60 px-4 py-3" />
                  {sizes.map((s) => (
                    <div key={s.id} className="bg-muted/60 px-4 py-3 flex items-center justify-center">
                      <span className={`text-[10px] text-muted-foreground ${mono} uppercase tracking-wider`}>{s.label}</span>
                    </div>
                  ))}
                  {states.map((v) => (
                    <React.Fragment key={v.id}>
                      <div className="bg-background px-4 py-4 flex flex-col justify-center gap-1">
                        <p className={`${mono} font-medium text-[length:var(--text-13)] uppercase tracking-wider`}>{v.name}</p>
                        <p className={`text-[10px] text-muted-foreground ${mono} leading-relaxed`}>{v.desc}</p>
                      </div>
                      {sizes.map((s) => (
                        <div key={s.id} className="bg-background px-3 py-4 flex items-center justify-center">
                          {v.render(s.h, s.px, s.fs)}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )
          })()}

          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[length:var(--text-12)]">CODE (OTP)</Badge>
              </div>
              <p className={`text-[length:var(--text-12)] text-muted-foreground ${mono}`}>6 символов авторизации. Моноширинный шрифт, крупный.</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input
                    key={i} maxLength={1}
                    className={`w-14 h-14 text-center rounded-sm border border-border bg-rm-gray-1 text-foreground ${mono} text-[length:var(--text-25)] tracking-[0.08em] transition-all duration-150 focus:outline-none focus:border-ring`}
                    defaultValue={i <= 3 ? String(i) : ""}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg border border-border space-y-3">
              <Badge variant="outline" className="text-[length:var(--text-12)]">WITH LABEL + ERROR</Badge>
              <div className="flex flex-col gap-1.5 max-w-md">
                <label className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Email</label>
                <input type="email" defaultValue="invalid-email" className="w-full h-10 px-4 rounded-sm border border-destructive bg-rm-gray-1 text-foreground text-[length:var(--text-14)] transition-all duration-150 focus:outline-none" />
                <span className="text-[length:var(--text-12)] text-destructive">Введите корректный email</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Textarea ── */}
        <div className="mb-12">
          <SubSection id="components-textarea" title="Textarea" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Паттерн для multiline-ввода. Базовые состояния: default, disabled и error; focus меняет только border.
          </p>
          <TextareaShowcase />
        </div>

        {/* ── Поиск / Combobox ── */}
        <div className="mb-12">
          <SubSection id="components-search" title="Поиск / Combobox" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Компонент поиска для Rocketmind: inline-search, подсказки, история, empty-state и запуск в модальном окне.
          </p>
          <SearchComboboxShowcase />
        </div>

        {/* ── Карточки ── */}
        <div>
          <SubSection id="components-cards" title="Карточки" />
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="cards">Каталог карточек</TabsTrigger>
              <TabsTrigger value="cards-base">Компоненты карточек</TabsTrigger>
            </TabsList>

            {/* CARDS BASE */}
            <TabsContent value="cards-base">
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-2">
                Варианты бордера карточки
              </h3>
              <p className="text-muted-foreground text-[length:var(--text-14)] mb-8">
                Все карточки используют <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-card</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">rounded-lg</code> и отличаются только поведением бордера при наведении.
              </p>

              <div className="mb-10">
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1`}>Базовая структура</p>
                <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Фон, скругление, бордер. Без hover-реакции — для статичных блоков и отзывов.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((i) => (<div key={i} className="h-24 rounded-lg border border-border bg-card" />))}
                </div>
                <p className={`mt-3 ${mono} text-[length:var(--text-12)] text-muted-foreground`}>
                  <code className="font-[family-name:var(--font-caption-family)]">rounded-lg border border-border bg-card</code>
                </p>
              </div>

              <div className="mb-10">
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1`}>Soft hover</p>
                <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Бордер меняется на <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">muted-foreground</code> — приглушённый, ненавязчивый. Используется в большинстве каталожных карточек.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((i) => (<div key={i} className="h-24 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer" />))}
                </div>
                <p className={`mt-3 ${mono} text-[length:var(--text-12)] text-muted-foreground`}>
                  <code className="font-[family-name:var(--font-caption-family)]">hover:border-muted-foreground</code>
                </p>
              </div>

              <div className="mb-10">
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1`}>Yellow hover</p>
                <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Жёлтое свечение бордера следует за курсором. Для CTA-карточек: партнёрка, выделенные офферы.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="relative h-24 rounded-lg bg-card cursor-pointer transition-all duration-75 border border-border active:[border:2px_solid_var(--rm-yellow-100)]">
                      <GlowingEffect spread={40} glow={false} disabled={false} proximity={40} inactiveZone={0.01} borderWidth={2} variant="yellow" />
                    </div>
                  ))}
                </div>
                <p className={`mt-3 ${mono} text-[length:var(--text-12)] text-muted-foreground`}>
                  <code className="font-[family-name:var(--font-caption-family)]">GlowingEffect variant=&quot;yellow&quot; borderWidth=&#123;2&#125;</code> — бордер #FFCC00 следует за курсором
                </p>
              </div>
            </TabsContent>

            {/* CARDS CATALOG */}
            <TabsContent value="cards">
              <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-lg border border-border bg-rm-gray-2/40">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[length:var(--text-12)] ${mono}`}>S</Badge>
                  <span className="text-[length:var(--text-14)] text-muted-foreground">Узкая — 20–30% экрана. Сетка 3–4 колонки.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[length:var(--text-12)] ${mono}`}>M</Badge>
                  <span className="text-[length:var(--text-14)] text-muted-foreground">Широкая — ~50% экрана. Сетка 2 колонки.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[length:var(--text-12)] ${mono}`}>L</Badge>
                  <span className="text-[length:var(--text-14)] text-muted-foreground">Горизонтальная — 100% ширины. Медиа слева, контент справа.</span>
                </div>
              </div>

              {/* ════════ 1. ПРОДУКТ С ИКОНКОЙ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">1. Продукт с иконкой</h3>
              <p className="text-muted-foreground text-[length:var(--text-14)] mb-4">
                Карточки для раздела «Консалтинг и стратегия». Иконка 120×120, опциональные аватарки экспертов и жёлтый бейдж.
                Заголовок — макс. 2 строки, описание — 3 строки с многоточием.
              </p>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>С экспертами</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <ProductCard
                  title="Экосистемная стратегия"
                  description="Создадим стратегию и портфель бизнес-моделей, которые расширят влияние и сделают бизнес более устойчивым"
                  icon={<div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#3D3300]/40 to-[#1A1A1A] flex items-center justify-center"><Rocket size={48} className="text-[var(--rm-yellow-100)]" /></div>}
                  experts={[
                    { name: "Алексей Е.", image: "" },
                    { name: "Ирина Г.", image: "" },
                    { name: "Сергей К.", image: "" },
                    { name: "Мария Л.", image: "" },
                    { name: "Дмитрий Р.", image: "" },
                  ]}
                  tag="Экспертный продукт"
                  href="#"
                />
                <ProductCard
                  title="Умная аналитика"
                  description="Аналитика для развития бизнеса на основе данных и выявления зон роста"
                  icon={<div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#3D3300]/40 to-[#1A1A1A] flex items-center justify-center"><Gem size={48} className="text-[var(--rm-yellow-100)]" /></div>}
                  experts={[
                    { name: "Иван П.", image: "" },
                  ]}
                  tag="Экспертный продукт"
                  href="#"
                />
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>Без экспертов</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <ProductCard
                  title="Цифровая платформа"
                  description="Внедрение цифровой платформы в ваш бизнес для масштабирования и оптимизации"
                  icon={<div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#3D3300]/40 to-[#1A1A1A] flex items-center justify-center"><Wrench size={48} className="text-[var(--rm-yellow-100)]" /></div>}
                  href="#"
                />
                <ProductCard
                  title="Дизайн-спринты"
                  description="Организация дизайн-спринтов для быстрого тестирования идей и проверки гипотез"
                  icon={<div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#3D3300]/40 to-[#1A1A1A] flex items-center justify-center"><BookOpen size={48} className="text-[var(--rm-yellow-100)]" /></div>}
                  href="#"
                />
              </div>
              {/* ════════ 2. С ИЗОБРАЖЕНИЕМ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4 mt-4">2. Продукт с изображением</h3>
              <p className="text-muted-foreground text-[length:var(--text-14)] mb-4">
                Карточки для разделов «Онлайн-школа» и «AI-продукты». Изображение cover 220px, бейдж -22px overlap.
                Вариант «wide» — 2 колонки с фактоидами из hero.
                Если обложки нет — скелетон <code>CoverSkeleton</code>: два круга (бордер 2px, #404040) по центру на тёмном фоне (см. карточки ниже).
              </p>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>1 колонка</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <ProductImageCard
                  title="Бизнес-дизайн для команд"
                  description="Практикум по бизнес-дизайну для команд, помогающий системно подойти к развитию продукта"
                  tag="Экспертный продукт"
                  href="#"
                />
                <ProductImageCard
                  title="Тестирование гипотез"
                  description="ИИ-агент по тестированию бизнес-гипотез с автоматическим анализом данных"
                  href="#"
                />
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>2 колонки (wide)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <ProductImageCard
                  title="Практикум по бизнес-дизайну для команд"
                  description="Навыки стратегического развития бизнеса — от поиска бизнес-модели до проектирования платформ и экосистем"
                  variant="wide"
                  factoids={[
                    { number: "1000+", text: "Руководителей и специалистов прошли обучение" },
                    { number: "130+", text: "Стратегических консультаций проведено" },
                    { number: "50+", text: "Стратегических сессий для корпораций" },
                  ]}
                  href="#"
                />
              </div>

              {/* ════════ 3. СТАТЬЯ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">3. Статья</h3>
              <p className="text-muted-foreground text-[length:var(--text-14)] mb-4">
                Карточка статьи для раздела «Медиа». Обложка сверху (overlap −22px), бейдж типа (sky — урок, terracotta — кейс), теги, автор и дата.
                Вариант «wide» — двухколоночный: обложка слева, заголовок и описание во всю ширину.
                Если обложки нет — скелетон <code>CoverSkeleton</code>: два круга (бордер 2px, #404040) по центру на тёмном фоне (см. карточки ниже).
              </p>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>Default — обложка сверху</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <ArticleCard
                  title="Как мы строим экосистемную стратегию для растущих компаний"
                  description="Разбор фреймворка из 5 шагов, который применяем в консалтинговых проектах."
                  tags={["Стратегия", "Экосистема"]}
                  typeBadge={{ label: "Кейс", color: "terracotta" }}
                  authorName="Иван Петров"
                  date="12 марта 2026"
                />
                <ArticleCard
                  title="Бизнес-дизайн: от идеи до запуска"
                  description="Практический разбор инструментов, которые ускоряют вывод продукта на рынок."
                  tags={["Продукт", "Дизайн"]}
                  typeBadge={{ label: "Урок", color: "sky" }}
                  authorName="Ирина Смирнова"
                  date="5 марта 2026"
                />
                <ArticleCard
                  title="ИИ-агенты в консалтинге"
                  description="Где LLM реально помогают, а где замедляют работу команды."
                  tags={["AI", "Консалтинг", "Практика"]}
                  authorName="Сергей Кузнецов"
                  date="28 февраля 2026"
                />
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>Wide — обложка слева</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <ArticleCard
                  variant="wide"
                  title="Дизайн-спринт за 5 дней: что работает на практике"
                  description="Адаптация Google Ventures под российский контекст и распределённые команды."
                  tags={["Спринты", "Команды"]}
                  typeBadge={{ label: "Кейс", color: "terracotta" }}
                  authorName="Мария Лебедева"
                  date="20 февраля 2026"
                />
              </div>

              {/* ════════ 4. ASIDE-КАРТОЧКА ПРОДУКТА В СТАТЬЕ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">4. Aside-карточка продукта</h3>
              <p className="text-muted-foreground text-[length:var(--text-14)] mb-4">
                Мини-карточка продукта для правой колонки статьи. Вариант <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">default</code> — 72×72 thumb + аватары экспертов (для consulting); вариант <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">image</code> — широкая cover-картинка (для academy/ai-products).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-[640px]">
                <SectionAsideProductCard
                  href="#"
                  title="Экосистемная стратегия"
                  description="Стратегия и портфель бизнес-моделей, расширяющих влияние."
                  experts={[
                    { name: "Алексей Е.", image: null },
                    { name: "Ирина Г.", image: null },
                    { name: "Сергей К.", image: null },
                  ]}
                />
                <SectionAsideProductCard
                  href="#"
                  variant="image"
                  title="Тестирование гипотез"
                  description="ИИ-агент по тестированию бизнес-гипотез с автоматическим анализом данных."
                />
              </div>

              {/* ════════ 5. КЕЙС ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">5. Кейс</h3>
              <p className="text-muted-foreground text-[length:var(--text-14)] mb-4">
                Карточка кейса для раздела «Кейсы». Заголовок, описание, бордерный блок с тремя метриками, итоговый результат.
                Для «big»-кейсов (есть страница) — жёлтый бордер при наведении и стрелка ↗ в правом верхнем углу.
              </p>
              <div className="flex flex-col gap-12 mb-10">
                <div className="group">
                  <div className="flex flex-col gap-5 lg:gap-11">
                    <div className="flex flex-col gap-2 lg:gap-5">
                      <h2 className="font-[family-name:var(--font-heading-family)] text-[24px] md:text-[36px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                        Запуск онлайн-академии для&nbsp;корпоративных команд
                      </h2>
                      <p className="text-[16px] xl:text-[18px] leading-[1.32] text-[#939393] max-w-none xl:max-w-[70%]">
                        Помогли крупному EdTech-игроку упаковать методологию и&nbsp;вывести её на&nbsp;b2b-рынок за&nbsp;6&nbsp;месяцев.
                      </p>
                    </div>
                    <div className="relative border border-[#404040] group-hover:border-[var(--rm-yellow-100)] transition-[border-color] duration-200 p-5 sm:p-6 xl:p-8">
                      <div className="absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] text-[#404040] transition-all duration-200 group-hover:text-[#F0F0F0] group-hover:-top-[2px] group-hover:-right-[2px] group-hover:scale-110">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                          <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {[
                          { value: "6", label: "месяцев\nдо запуска", description: "От первой стратегической сессии до продаж b2b-клиентам." },
                          { value: "12", label: "корпоративных\nклиентов", description: "Подписали контракты в первый квартал после запуска." },
                          { value: "×3", label: "рост выручки\nза год", description: "Относительно базового сценария без b2b-направления." },
                        ].map((stat, i) => (
                          <div key={i} className="flex flex-col gap-1 sm:gap-5 xl:justify-between">
                            <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-1 xl:flex-row xl:items-center xl:gap-3">
                              <div className="font-[family-name:var(--font-heading-family)] text-[52px] sm:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] flex-none">
                                {stat.value}
                              </div>
                              <div className={`${mono} text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#F0F0F0] whitespace-pre-wrap`}>
                                {stat.label}
                              </div>
                            </div>
                            <p className="text-[12px] sm:text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                              {stat.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className={`${mono} text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] text-[#F0F0F0] xl:max-w-[70%]`}>
                      Методология упакована в&nbsp;продукт, продажи&nbsp;— системные, команда заказчика выросла в&nbsp;два&nbsp;раза.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Аватар ── */}
        <div className="mb-12">
          <SubSection id="components-avatar" title="Аватар" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Круглый аватар пользователя или агента. 5 размеров: XS (24px) / SM (32px) / MD (40px) / LG (48px) / XL (64px). Fallback — инициалы на <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-rm-gray-1</code>, моно-шрифт.
          </p>

          <div className="rounded-lg border border-border overflow-hidden mb-6">
            <div className={`px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border`}>
              <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Размеры и fallback</p>
            </div>
            <div className="p-6 flex flex-wrap items-end gap-6">
              {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Avatar size={size}>
                    <AvatarFallback className={size === "xs" ? "text-[10px]" : size === "sm" ? "text-[length:var(--text-12)]" : size === "md" ? "text-[length:var(--text-14)]" : size === "lg" ? "text-[length:var(--text-16)]" : "text-[20px]"}>
                      {size === "xs" ? "М" : size === "sm" ? "АИ" : size === "md" ? "НК" : size === "lg" ? "СД" : "RM"}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground`}>{size.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className={`px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border`}>
              <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Контекстные примеры</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 border border-border rounded-sm">
                <Avatar size="md">
                  <AvatarFallback className="text-[length:var(--text-14)]">АА</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[length:var(--text-14)] font-medium text-foreground">AI-агент «Аналитик»</p>
                  <p className="text-[length:var(--text-12)] text-muted-foreground">Финансовый анализ</p>
                </div>
                <Badge variant="green-subtle" size="sm" className="ml-auto">Активен</Badge>
              </div>
              <div className="flex items-center gap-2">
                {["МД", "АС", "НК", "ЕВ"].map((initials, i) => (
                  <Avatar key={i} size="sm" className={i > 0 ? "-ml-2" : ""}>
                    <AvatarFallback className="text-[length:var(--text-12)]">{initials}</AvatarFallback>
                  </Avatar>
                ))}
                <span className="text-[length:var(--text-12)] text-muted-foreground ml-2">+3 участника</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Диалог ── */}
        <div className="mb-12">
          <SubSection id="components-dialog" title="Диалог" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Модальное окно для подтверждения действий и показа информации. Оверлей — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">rm-gray-alpha-600</code>, панель — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">max-w-480px bg-card rounded-lg</code>.
          </p>
          <DialogShowcase />
        </div>

        {/* ── Dropdown Menu ── */}
        <div className="mb-12">
          <SubSection id="components-dropdown" title="Dropdown Menu" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Контекстное меню действий. Контейнер — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-popover rounded-sm min-w-160px</code>. Destructive-элемент — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">text-rm-red-100</code>.
          </p>
          <DropdownMenuShowcase />
        </div>

        {/* ── Разделитель ── */}
        <div className="mb-12">
          <SubSection id="components-separator" title="Разделитель" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Визуальный разделитель контента. Горизонтальный — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">h-px w-full</code>, вертикальный — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">w-px self-stretch</code>. Цвет — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-border</code>.
          </p>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className={`px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border`}>
              <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Горизонтальный и вертикальный</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Horizontal</p>
                <div className="rounded-sm border border-border p-4 bg-card">
                  <p className="text-[length:var(--text-14)] text-foreground mb-3">Блок контента сверху</p>
                  <Separator />
                  <p className="text-[length:var(--text-14)] text-foreground mt-3">Блок контента снизу</p>
                </div>
              </div>
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Vertical</p>
                <div className="rounded-sm border border-border p-4 bg-card flex items-center gap-4 h-16">
                  <span className="text-[length:var(--text-14)]">Раздел A</span>
                  <Separator orientation="vertical" />
                  <span className="text-[length:var(--text-14)]">Раздел B</span>
                  <Separator orientation="vertical" />
                  <span className="text-[length:var(--text-14)]">Раздел C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Skeleton ── */}
        <div className="mb-12">
          <SubSection id="components-skeleton" title="Skeleton" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Placeholder-загрузка с анимацией пульса. Фон — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-rm-gray-1 animate-pulse rounded-sm</code>. Повторяет форму реального контента.
          </p>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className={`px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border`}>
              <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Паттерны загрузки</p>
            </div>
            <div className="p-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Card skeleton</p>
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-5 w-16 rounded-sm" />
                    <Skeleton className="h-7 w-20 rounded-sm" />
                  </div>
                </div>
              </div>
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Chat skeleton</p>
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Table skeleton</p>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="h-9 bg-[var(--rm-gray-1)] border-b border-border px-3 flex items-center gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </div>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-10 px-3 flex items-center gap-4 border-b border-border last:border-b-0">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-5 w-14 rounded-sm ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Profile skeleton</p>
                <div className="rounded-lg border border-border p-4 flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll Area ── */}
        <div className="mb-12">
          <SubSection id="components-scroll-area" title="Scroll Area" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Контейнер с кастомным скроллбаром. Thumb — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-rm-gray-3</code>, hover — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-rm-gray-4</code>, ширина — 8px, rounded-full.
          </p>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className={`px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border`}>
              <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Вертикальный скролл</p>
            </div>
            <div className="p-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Список агентов</p>
                <ScrollArea className="h-48 rounded-sm border border-border">
                  <div className="p-3 space-y-2">
                    {[
                      { name: "Аналитик", desc: "Финансовый анализ и прогнозирование" },
                      { name: "Стратег", desc: "Разработка стратегии и планирование" },
                      { name: "Исследователь", desc: "Маркетинговые исследования" },
                      { name: "Тестировщик", desc: "Тестирование гипотез и A/B тесты" },
                      { name: "Копирайтер", desc: "Создание текстов и контента" },
                      { name: "Дизайнер", desc: "Визуальный дизайн и брендинг" },
                      { name: "Разработчик", desc: "Прототипирование и MVP" },
                      { name: "Консультант", desc: "Бизнес-консалтинг" },
                    ].map((agent) => (
                      <div key={agent.name} className="flex items-center gap-3 p-2 rounded-sm hover:bg-[var(--rm-gray-2)] transition-colors">
                        <Avatar size="sm">
                          <AvatarFallback className="text-[length:var(--text-12)]">{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-[length:var(--text-14)] text-foreground truncate">{agent.name}</p>
                          <p className="text-[length:var(--text-12)] text-muted-foreground truncate">{agent.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div>
                <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>Лог сообщений</p>
                <ScrollArea className="h-48 rounded-sm border border-border">
                  <div className="p-3 space-y-2">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="flex items-start gap-2 text-[length:var(--text-12)]">
                        <span className={`${mono} text-muted-foreground shrink-0`}>{String(i + 1).padStart(2, "0")}.</span>
                        <span className="text-muted-foreground">
                          {i % 3 === 0 ? "Пользователь отправил сообщение" : i % 3 === 1 ? "Агент обработал запрос" : "Система обновила статус кейса"}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className={`px-4 py-2 bg-[var(--rm-gray-1)] border-b border-t border-border`}>
              <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Invisible scrollbar · <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)] normal-case">.rm-scrollbar-invisible</code></p>
            </div>
            <div className="p-6">
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-wider text-muted-foreground mb-3`}>
                Скролл работает (wheel/touch/keyboard), но визуально полоски нет. Используется в GlossaryWidget на /media и других aside-панелях, где DS не хочет видимой полосы.
              </p>
              <div className="rm-scrollbar-invisible h-48 overflow-y-auto rounded-sm bg-[var(--rm-gray-1)] p-4">
                <div className="space-y-2">
                  {Array.from({ length: 30 }, (_, i) => (
                    <p key={i} className="text-[length:var(--text-14)] text-foreground">
                      Строка списка {String(i + 1).padStart(2, "0")} — наполнитель для демонстрации внутреннего скролла плашки.
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Toasts ── */}
        <div className="mb-12">
          <SubSection id="components-toasts" title="Уведомления / Toasts" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Всплывающие уведомления через sonner. Типы: default, success, error, warning, info, loading. Фон — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-popover</code>, бордер — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">border-border</code>.
          </p>
          <ToastShowcase />
        </div>

        {/* ── Show More ── */}
        <div className="mb-12">
          <SubSection id="components-show-more" title="Show More" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Кнопка-разделитель для скрытия избыточного контента. Пропсы: <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">expanded</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">onClick</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">label</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">labelExpanded</code>. Занимает всю ширину контейнера.
          </p>
          <ShowMoreShowcase />
        </div>

        {/* ── Slider ── */}
        <div className="mb-12">
          <SubSection id="components-slider" title="Слайдер" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Минималистичный прогресс-слайдер 62×8 px из дизайн-системы. Трек — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">border</code>, заливка и точка — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">foreground</code>. Пропсы: <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">value</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">min</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">max</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">width</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">animate</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">animateKey</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">animationDuration</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">onChange</code>.
          </p>
          <div className="flex flex-col gap-8">
            {/* Static */}
            <div>
              <p className="text-[length:var(--text-12)] text-muted-foreground mb-3">Статичный (value=0.4)</p>
              <div className="flex items-center gap-6 p-6 border border-border rounded-sm bg-background">
                <Slider value={0} />
                <Slider value={0.4} />
                <Slider value={1} />
              </div>
            </div>
            {/* Animated */}
            <div>
              <p className="text-[length:var(--text-12)] text-muted-foreground mb-3">Анимированный (animate, 4 сек)</p>
              <div className="flex items-center gap-6 p-6 border border-border rounded-sm bg-background">
                <Slider animate animationDuration={4000} />
              </div>
            </div>
            {/* Wide interactive */}
            <div>
              <p className="text-[length:var(--text-12)] text-muted-foreground mb-3">Интерактивный, ширина 200 px</p>
              <div className="flex items-center gap-6 p-6 border border-border rounded-sm bg-background">
                <SliderInteractiveDemo />
              </div>
            </div>
            {/* Slider Number — case navigator pattern */}
            <div>
              <p className="text-[length:var(--text-12)] text-muted-foreground mb-3">Slider Number — навигатор кейсов</p>
              <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
                Паттерн из блока кейсов: все номера остаются на местах, анимированный ползунок появляется справа от активного номера.
                Активный номер — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">foreground</code>, остальные — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">muted-foreground</code>.
                Gap между элементами — 16px. Ползунок 62×8 px.
              </p>
              <div className="flex items-center gap-6 p-6 border border-border rounded-sm bg-background">
                <SliderNumberDemo />
              </div>
            </div>
          </div>
        </div>

        {/* ── Pagination ── */}
        <div className="mb-12">
          <SubSection id="components-pagination" title="Пагинация" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Навигация между разделами многостраничной статьи. Размещается в конце тела статьи перед блоком «Похожие статьи». Пропсы: <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">prev</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">next</code> (каждый — <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">{`{ label, href }`}</code>), опционально <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">renderLink</code> для интеграции с next/link.
          </p>
          <ArticlePaginationShowcase />
        </div>

          {/* ── Аккордеон ── */}
          <SubSection id="components-accordion" title="Аккордеон" />
          <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
            Минимальный аккордеон для продуктовых страниц. Иконки +/−, бордер <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">#404040</code>, заголовок — Label 16, контент — Copy 14. Одновременно открыт только один элемент.
          </p>
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[length:var(--text-12)] text-muted-foreground mb-3">Интерактивный пример</p>
              <div className="p-6 border border-border rounded-sm bg-background max-w-[700px]">
                <AccordionShowcase />
              </div>
            </div>
          </div>
      </Section>

      <Separator />
    </>
  )
}
