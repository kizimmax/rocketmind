"use client"

import React from "react"
import {
  Avatar, AvatarFallback, AvatarImage,
  Badge, GlowingEffect, ScrollArea, Separator, Skeleton, Slider,
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
import { AccordionShowcase } from "@/components/ui/accordion-showcase"
import {
  Rocket, User, Gem, BookOpen, Search,
  Loader2, Trash2, ArrowRight, Wrench, GraduationCap
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
              { size: "icon-micro", label: "Micro / 20px", px: 20, desc: "Inline-контролы: удалить карточку, обновить саммери. Выровнен с Checkbox/Radio 20×20." },
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

              {/* ════════ 1. ПРОДУКТ / УСЛУГА ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">1. Продукт / Услуга</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="h-36 bg-rm-gray-2 overflow-hidden flex items-center justify-center text-muted-foreground"><Rocket size={28}/></div>
                    <div className="flex flex-col gap-3 p-5">
                      <span className={`w-fit px-2 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Курс</span>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em] leading-snug">Название продукта</h4>
                      <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Краткое описание продукта или услуги.</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <span className={`${mono} font-semibold text-[length:var(--text-16)]`}>9 900 ₽</span>
                        <button className={`h-7 px-3 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Купить →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="h-44 bg-rm-gray-2 overflow-hidden flex items-center justify-center text-muted-foreground"><Rocket size={36}/></div>
                    <div className="flex flex-col gap-4 p-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Курс</span>
                        <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>· 12 уроков</span>
                      </div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Название продукта</h4>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">Подробное описание продукта — здесь можно разместить больше текста, поскольку карточка шире.</p>
                      <div className="flex items-center gap-2 text-[var(--rm-yellow-100)]">
                        {"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-14)]">{s}</span>)}
                        <span className={`${mono} text-[length:var(--text-12)] text-muted-foreground ml-1`}>4.9 (128)</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <div className="flex items-baseline gap-2">
                          <span className={`${mono} font-medium text-[length:var(--text-18)] md:text-[length:var(--text-24)]`}>9 900 ₽</span>
                          <span className={`${mono} text-[length:var(--text-14)] text-muted-foreground line-through`}>14 900 ₽</span>
                        </div>
                        <button className={`h-8 px-4 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Купить →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3 mb-10">
                {[1,2].map(i => (
                  <div key={i} className="flex overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-48 flex-shrink-0 bg-rm-gray-2 flex items-center justify-center text-muted-foreground"><Rocket size={36}/></div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <span className={`w-fit px-2 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Услуга</span>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Название продукта</h4>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Описание продукта. В горизонтальном варианте текст читается слева направо.</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-2">
                          <span className={`${mono} font-medium text-[length:var(--text-18)] md:text-[length:var(--text-24)]`}>9 900 ₽</span>
                          <span className={`${mono} text-[length:var(--text-14)] text-muted-foreground line-through`}>14 900 ₽</span>
                        </div>
                        <button className={`h-8 px-4 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Купить →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ════════ 2. ЭКСПЕРТ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">2. Эксперт</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer group">
                    <div className="h-40 bg-rm-gray-2 flex items-center justify-center"><User size={36} className="text-muted-foreground"/></div>
                    <div className="flex flex-col gap-3 p-5">
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                        <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Бизнес-аналитик</span>
                      </div>
                      <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">10 лет в консалтинге, помог 200+ компаниям.</p>
                      <div className="flex flex-wrap gap-1">
                        {["Стратегия","EdTech"].map(t=><span key={t} className={`px-1.5 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>{t}</span>)}
                      </div>
                      <span className={`inline-flex items-center gap-1 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta`}>
                        Подробнее <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1"/>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer group">
                    <div className="h-52 bg-rm-gray-2 flex items-center justify-center"><User size={48} className="text-muted-foreground"/></div>
                    <div className="flex flex-col gap-4 p-6">
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                        <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>Бизнес-аналитик</span>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">10 лет в консалтинге, помог 200+ компаниям выйти на новые рынки. Специализация — стратегия роста.</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Стратегия","EdTech","SaaS"].map(t=><span key={t} className={`px-2 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>{t}</span>)}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Кейсов: 48</span>
                        <span className={`inline-flex items-center gap-1.5 ${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta`}>
                          Подробнее <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3 mb-10">
                {[1,2].map(i => (
                  <div key={i} className="flex overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-52 flex-shrink-0 bg-rm-gray-2 flex items-center justify-center"><User size={48} className="text-muted-foreground"/></div>
                    <div className="flex flex-1 items-center gap-8 p-6">
                      <div className="flex flex-col gap-1 w-48 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                        <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>Бизнес-аналитик</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">10 лет в консалтинге, помог 200+ компаниям выйти на новые рынки. Специализация — стратегия роста.</p>
                      <div className="flex flex-col gap-3 items-end flex-shrink-0">
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {["Стратегия","EdTech"].map(t=><span key={t} className={`px-2 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>{t}</span>)}
                        </div>
                        <span className={`inline-flex items-center gap-1.5 ${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta`}>
                          Подробнее <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ════════ 3. ИИ-АГЕНТ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">3. ИИ-Агент</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col gap-4 p-5 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="relative w-fit">
                      <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center bg-rm-gray-2" style={{borderColor:"var(--rm-yellow-50)"}}>
                        <Rocket size={20} className="text-[var(--rm-yellow-100)]"/>
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-card border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--rm-green-100)]"/>
                      </span>
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Маркетолог</h4>
                      <span className={`${mono} text-[length:var(--text-12)] text-muted-foreground`}>@maks</span>
                    </div>
                    <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-3">Анализирует рынок, разрабатывает стратегии роста.</p>
                    <span className={`inline-flex items-center gap-1 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta`}>
                      Запустить <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1"/>
                    </span>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col gap-5 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center bg-rm-gray-2" style={{borderColor:"var(--rm-yellow-50)"}}>
                          <Rocket size={28} className="text-[var(--rm-yellow-100)]"/>
                        </div>
                        <span className="absolute bottom-0.5 right-0.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-card border border-border">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--rm-green-100)]"/>
                          <span className={`${mono} text-[length:var(--text-12)] uppercase text-muted-foreground`}>Акт</span>
                        </span>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Маркетолог</h4>
                        <span className={`${mono} text-[length:var(--text-14)] text-muted-foreground`}>@maks</span>
                      </div>
                    </div>
                    <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">Анализирует рынок, разрабатывает стратегии и помогает находить точки роста бизнеса.</p>
                    <div className="flex items-center justify-between">
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Кейсов: 124</span>
                      <span className={`inline-flex items-center gap-1.5 ${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta`}>
                        Запустить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3 mb-10">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center bg-rm-gray-2" style={{borderColor:"var(--rm-yellow-50)"}}>
                        <Rocket size={28} className="text-[var(--rm-yellow-100)]"/>
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[var(--rm-green-100)] border-2 border-card"/>
                    </div>
                    <div className="flex flex-col gap-0.5 w-40 flex-shrink-0">
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Маркетолог</h4>
                      <span className={`${mono} text-[length:var(--text-14)] text-muted-foreground`}>@maks</span>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-1`}>Кейсов: 124</span>
                    </div>
                    <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">Анализирует рынок, разрабатывает стратегии и помогает находить точки роста бизнеса.</p>
                    <span className={`inline-flex items-center gap-1.5 ${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground flex-shrink-0 group/cta`}>
                      Запустить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                    </span>
                  </div>
                ))}
              </div>

              {/* ════════ 4. ОТЗЫВ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">4. Отзыв</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col gap-4 p-5 rounded-lg border border-border bg-card dark:border-white/[0.06]">
                    <div className="flex gap-0.5 text-[var(--rm-yellow-100)]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-14)]">{s}</span>)}</div>
                    <blockquote className="text-[length:var(--text-14)] italic leading-[1.5] text-foreground line-clamp-4">«Агент помог за 2 дня разобраться в структуре рынка, на что раньше уходило 2 недели.»</blockquote>
                    <div className="flex items-center gap-2.5 pt-3 border-t border-border mt-auto">
                      <div className="w-8 h-8 rounded-full bg-rm-gray-2 border border-border flex-shrink-0 flex items-center justify-center text-muted-foreground"><User size={14}/></div>
                      <div>
                        <div className="text-[length:var(--text-14)] font-medium leading-none">Анна Смирнова</div>
                        <div className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-0.5`}>CEO, TechStartup</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col gap-5 p-6 rounded-lg border border-border bg-card dark:border-white/[0.06]">
                    <div className="flex gap-0.5 text-[var(--rm-yellow-100)]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-16)]">{s}</span>)}</div>
                    <blockquote className="text-[length:var(--text-16)] italic leading-[1.618] text-foreground">«Агент помог мне за 2 дня разобраться в структуре рынка, на что раньше уходило целых 2 недели работы аналитика.»</blockquote>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full bg-rm-gray-2 border border-border flex-shrink-0 flex items-center justify-center text-muted-foreground"><User size={16}/></div>
                      <div className="flex-1">
                        <div className="text-[length:var(--text-14)] font-medium">Анна Смирнова</div>
                        <div className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>CEO, TechStartup</div>
                      </div>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Март 2026</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3 mb-10">
                {[1,2].map(i => (
                  <div key={i} className="flex gap-8 p-6 rounded-lg border border-border bg-card dark:border-white/[0.06]">
                    <div className="flex flex-col items-center gap-3 flex-shrink-0 w-36">
                      <div className="w-16 h-16 rounded-full bg-rm-gray-2 border border-border flex items-center justify-center text-muted-foreground"><User size={24}/></div>
                      <div className="text-center">
                        <div className="text-[length:var(--text-14)] font-medium">Анна Смирнова</div>
                        <div className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>CEO, TechStartup</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5 text-[var(--rm-yellow-100)]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-16)]">{s}</span>)}</div>
                        <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Март 2026</span>
                      </div>
                      <blockquote className="text-[length:var(--text-16)] italic leading-[1.618] text-foreground">«Агент помог мне за 2 дня разобраться в структуре рынка, на что раньше уходило 2 недели работы аналитика.»</blockquote>
                    </div>
                  </div>
                ))}
              </div>

              {/* ════════ 5. КЕЙС ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">5. Кейс</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-green-900)",color:"var(--rm-green-100)"}}>Активен</span>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>@maks</span>
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em] line-clamp-2">Анализ рынка EdTech</h4>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>2 часа назад</span>
                    </div>
                    <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Агент завершил анализ конкурентов...</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                      <div className="w-5 h-5 rounded-full bg-rm-gray-2 border border-border"/>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>3 сообщ.</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-green-900)",color:"var(--rm-green-100)"}}>Активен</span>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>@maks</span>
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Анализ рынка EdTech</h4>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Обновлён 2 часа назад</span>
                    </div>
                    <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Агент завершил анализ конкурентов и подготовил сводный отчёт по основным игрокам рынка.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-rm-gray-2 border border-border"/>
                        <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Маркетолог</span>
                      </div>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>3 сообщения</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3 mb-10">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="flex flex-col gap-1 w-40 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-sm w-fit ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-green-900)",color:"var(--rm-green-100)"}}>Активен</span>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-1`}>2 часа назад</span>
                    </div>
                    <div className="flex flex-col gap-1 w-56 flex-shrink-0">
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Анализ рынка EdTech</h4>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>@maks</span>
                    </div>
                    <p className="flex-1 text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Агент завершил анализ конкурентов и подготовил сводный отчёт по основным игрокам рынка EdTech за 2025–2026 год.</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-rm-gray-2 border border-border"/>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>3 сообщ.</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ════════ 6. КУРС ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">6. Курс</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="relative h-32 bg-rm-gray-2 flex items-center justify-center">
                      <GraduationCap size={28} className="text-muted-foreground"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"/>
                    </div>
                    <div className="flex flex-col gap-2.5 p-5">
                      <div className="flex gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-sky-900)",color:"var(--rm-sky-100)"}}>Начинающий</span>
                        <span className={`px-1.5 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Видео</span>
                      </div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em] leading-snug">Маркетинг для стартапов</h4>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>12 уроков</span>
                      <div className="flex items-center justify-between pt-2.5 border-t border-border mt-auto">
                        <span className={`${mono} font-semibold text-[length:var(--text-16)]`}>4 900 ₽</span>
                        <button className={`h-7 px-3 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Начать →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="relative h-44 bg-rm-gray-2 flex items-center justify-center">
                      <GraduationCap size={40} className="text-muted-foreground"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"/>
                    </div>
                    <div className="flex flex-col gap-4 p-6">
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-sky-900)",color:"var(--rm-sky-100)"}}>Начинающий</span>
                        <span className={`px-2 py-0.5 rounded-sm bg-rm-gray-2 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Видео</span>
                      </div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Маркетинг для стартапов</h4>
                      <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>Иван Петров · 12 уроков</span>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Практический курс по привлечению первых клиентов без большого бюджета.</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <span className={`${mono} font-medium text-[length:var(--text-18)] md:text-[length:var(--text-24)]`}>4 900 ₽</span>
                        <button className={`h-8 px-4 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Начать →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3 mb-10">
                {[1,2].map(i => (
                  <div key={i} className="flex overflow-hidden rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-52 flex-shrink-0 bg-rm-gray-2 flex items-center justify-center relative">
                      <GraduationCap size={40} className="text-muted-foreground"/>
                    </div>
                    <div className="flex flex-1 items-center gap-6 p-6">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-sky-900)",color:"var(--rm-sky-100)"}}>Начинающий</span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Маркетинг для стартапов</h4>
                        <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>Иван Петров · 12 уроков</span>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <span className={`${mono} font-medium text-[length:var(--text-18)] md:text-[length:var(--text-24)]`}>4 900 ₽</span>
                        <button className={`h-8 px-4 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`}>Начать →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ════════ 7. ИНСТРУМЕНТ ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">7. Инструмент</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-10 h-10 rounded-sm border border-border bg-rm-gray-2 flex items-center justify-center text-muted-foreground flex-shrink-0"><Wrench size={18}/></div>
                    <div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Notion</h4>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>База знаний</span>
                    </div>
                    <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Синхронизирует кейсы с базой знаний автоматически.</p>
                    <span className={`w-fit px-1.5 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-blue-900)",color:"var(--rm-blue-100)"}}>Webhook</span>
                    <span className={`inline-flex items-center gap-1 ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta`}>
                      Подключить <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1"/>
                    </span>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-12 h-12 rounded-sm border border-border bg-rm-gray-2 flex items-center justify-center text-muted-foreground flex-shrink-0"><Wrench size={22}/></div>
                    <div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Notion</h4>
                      <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>База знаний</span>
                    </div>
                    <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Синхронизирует кейсы с вашей базой знаний Notion автоматически через n8n.</p>
                    <span className={`w-fit px-2 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-blue-900)",color:"var(--rm-blue-100)"}}>Webhook</span>
                    <span className={`inline-flex items-center gap-1.5 ${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta`}>
                      Подключить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                    </span>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3 mb-10">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-14 h-14 rounded-sm border border-border bg-rm-gray-2 flex items-center justify-center text-muted-foreground flex-shrink-0"><Wrench size={24}/></div>
                    <div className="flex flex-col gap-0.5 w-40 flex-shrink-0">
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Notion</h4>
                      <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>База знаний</span>
                    </div>
                    <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Синхронизирует кейсы с базой знаний Notion автоматически через n8n вебхуки.</p>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-sm ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em]`} style={{backgroundColor:"var(--rm-blue-900)",color:"var(--rm-blue-100)"}}>Webhook</span>
                      <span className={`inline-flex items-center gap-1.5 ${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta`}>
                        Подключить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ════════ 8. ПАРТНЁРСКАЯ ПРОГРАММА ════════ */}
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">8. Партнёрская программа</h3>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>S — Узкая</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor:"var(--rm-yellow-900)"}}>
                      <Gem size={18} className="text-[var(--rm-yellow-100)]"/>
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Реферальная</h4>
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>До 30% · Пожизненно</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-tight leading-none text-[var(--rm-yellow-100)]">30%</span>
                    </div>
                    <button className={`h-7 px-3 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] w-full mt-auto`}>Стать партнёром</button>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>M — Широкая</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[1,2].map(i => (
                  <div key={i} className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor:"var(--rm-yellow-900)"}}>
                      <Gem size={22} className="text-[var(--rm-yellow-100)]"/>
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Реферальная программа</h4>
                      <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>Доход: до 30% · Пожизненно</span>
                    </div>
                    <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618]">Приглашайте клиентов и получайте процент от каждой их оплаты навсегда.</p>
                    <div className="flex flex-col gap-0.5 pt-3 border-t border-border">
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Комиссия</span>
                      <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-tight leading-none text-[var(--rm-yellow-100)]">30%</span>
                    </div>
                    <button className={`h-8 px-3 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] w-full mt-auto`}>Стать партнёром</button>
                  </div>
                ))}
              </div>
              <p className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2`}>L — Горизонтальная</p>
              <div className="flex flex-col gap-3">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-lg border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor:"var(--rm-yellow-900)"}}>
                      <Gem size={24} className="text-[var(--rm-yellow-100)]"/>
                    </div>
                    <div className="flex flex-col gap-0.5 w-48 flex-shrink-0">
                      <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.005em]">Реферальная программа</h4>
                      <span className={`${mono} text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground`}>Пожизненно</span>
                    </div>
                    <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618]">Приглашайте клиентов и получайте процент от каждой их оплаты навсегда. Без ограничений по времени.</p>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground`}>Комиссия</span>
                      <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-31)] uppercase tracking-tight leading-none text-[var(--rm-yellow-100)]">30%</span>
                    </div>
                    <button className={`h-8 px-5 rounded-sm bg-primary text-primary-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] flex-shrink-0`}>Стать партнёром</button>
                  </div>
                ))}
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
