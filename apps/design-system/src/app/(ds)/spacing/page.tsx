"use client"

import React from "react"
import { CopyButton } from "@/components/copy-button"
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from "@rocketmind/ui"
import { GridGuides } from "@/components/ui/guide-grid"
import { Section } from "@/components/ds/shared"

export default function SpacingPage() {
  return (
    <>
      <Section id="spacing" title="3. Спейсинг и Сетка">
        <p className="text-muted-foreground mb-6">
          Базовый модуль — <strong>8px</strong>. Модуль сетки страницы — <strong>20px</strong>.
          Все отступы кратны 8. Золотое сечение для макетных пропорций.
        </p>

        <h3 id="spacing-scale" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          Шкала отступов
        </h3>
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { label: "1", px: 4 },
            { label: "2", px: 8 },
            { label: "3", px: 12 },
            { label: "4", px: 16 },
            { label: "5", px: 20 },
            { label: "6", px: 24 },
            { label: "8", px: 32 },
            { label: "10", px: 40 },
            { label: "12", px: 48 },
            { label: "16", px: 64 },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <div
                className="bg-[var(--rm-yellow-100)] rounded-sm"
                style={{ width: `${Math.min(s.px, 64)}px`, height: `${Math.min(s.px, 64)}px` }}
              />
              <div className="flex items-center gap-1">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground">
                  {s.px}px
                </span>
                <CopyButton value={`p-${s.label}`} label={`space-${s.label}`} />
              </div>
            </div>
          ))}
        </div>

        <h3 id="spacing-grid" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          Сетка страницы
        </h3>
        <Tabs defaultValue="mobile" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="tablet">Tablet</TabsTrigger>
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="wide">Wide</TabsTrigger>
          </TabsList>

          {[
            { value: "mobile",  label: "Mobile",  bp: "< 768px",    cols: 4,  gutter: 0, margin: 20,  tw: "sm:" },
            { value: "tablet",  label: "Tablet",  bp: "768–1024px", cols: 8,  gutter: 0, margin: 40,  tw: "md:" },
            { value: "desktop", label: "Desktop", bp: "1024–1440px",cols: 12, gutter: 0, margin: 80,  tw: "lg:" },
            { value: "wide",    label: "Wide",    bp: "> 1440px",   cols: 12, gutter: 0, margin: 120, tw: "2xl:" },
          ].map((g) => (
            <TabsContent key={g.value} value={g.value}>
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  { label: "Breakpoint", val: g.bp },
                  { label: "Columns",    val: String(g.cols) },
                  { label: "Gutter",     val: `${g.gutter}px` },
                  { label: "Margin",     val: `${g.margin}px` },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5 bg-rm-gray-2 rounded-sm px-3 py-2 min-w-[90px]">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                    <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{s.val}</span>
                  </div>
                ))}
                <div className="flex flex-col gap-0.5 bg-rm-gray-2 rounded-sm px-3 py-2 min-w-[90px]">
                  <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">Tailwind</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{g.tw}</span>
                    <CopyButton value={g.tw} label={`Breakpoint ${g.tw}`} />
                  </div>
                </div>
              </div>

              {(() => {
                const marginPct = g.cols <= 4 ? 5 : g.cols <= 8 ? 6 : 8
                const colTemplate = Array.from({ length: g.cols * 2 - 1 }, (_, i) =>
                  i % 2 === 0 ? "1fr" : "1px"
                ).join(" ")
                return (
                  <div className="border border-border rounded-lg overflow-hidden select-none">
                    <div className="flex h-6 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/70 border-b border-dashed border-border/40">
                      <div className="flex items-center justify-center border-r border-dashed border-muted-foreground/30"
                        style={{ width: `${marginPct}%` }}>
                        {g.margin}px
                      </div>
                      <div className="flex-1" />
                      <div className="flex items-center justify-center border-l border-dashed border-muted-foreground/30"
                        style={{ width: `${marginPct}%` }}>
                        {g.margin}px
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: colTemplate,
                        height: 56,
                        padding: `0 ${marginPct}%`,
                      }}
                    >
                      {Array.from({ length: g.cols }).map((_, i) => (
                        <div
                          key={i}
                          style={{ gridColumn: i * 2 + 1 }}
                          className="flex items-end justify-center pb-2 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/40"
                        >
                          {i + 1}
                        </div>
                      ))}
                      {Array.from({ length: g.cols - 1 }, (_, i) => (
                        <div
                          key={`g${i}`}
                          style={{
                            gridColumn: i * 2 + 2,
                            background: "var(--border)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center h-5 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60 border-t border-dashed border-border/40">
                      gutter {g.gutter}px
                    </div>
                  </div>
                )
              })()}
            </TabsContent>
          ))}
        </Tabs>

        <h3 id="spacing-phi" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-2">
          Макетные пропорции (phi)
        </h3>
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6 max-w-[640px]">
          Алгоритм: <strong>1 → контент</strong> диктует ширину зоны, <strong>2 → колонки</strong> привязывают к сетке, <strong>3 → φ (≈ 38/62)</strong> используется как ориентир, не жёсткое правило.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[length:var(--text-12)] font-medium">1. App: навигация + контент</span>
              <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">3 + 9 col</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-border" style={{ display: "grid", gap: "1px", background: "var(--border)", gridTemplateColumns: "3fr 9fr", gridTemplateRows: "28px 1fr 1fr", height: 100 }}>
              <div style={{ gridColumn: "1", gridRow: "1 / 4", background: "var(--background)" }} className="flex flex-col items-center justify-center gap-0.5">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60">Nav</span>
                <span className="text-[length:var(--text-12)] text-muted-foreground/35 font-[family-name:var(--font-mono-family)]">3 col · 25%</span>
              </div>
              <div style={{ gridColumn: "2", gridRow: "1", background: "var(--background)" }} className="flex items-center px-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Header</span>
              </div>
              <div style={{ gridColumn: "2", gridRow: "2", background: "var(--background)" }} className="flex items-center px-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Content · 9 col · 75%</span>
              </div>
              <div style={{ gridColumn: "2", gridRow: "3", background: "var(--background)" }} className="flex items-center px-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Content</span>
              </div>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground/60">Контент: список nav → 3 col. Остаток → 9 col. Не φ, но контент-первый.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[length:var(--text-12)] font-medium">2. Hero: текст + визуал</span>
              <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">7 + 5 col · ≈ φ</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-border" style={{ display: "grid", gap: "1px", background: "var(--border)", gridTemplateColumns: "7fr 5fr", gridTemplateRows: "1fr 1fr", height: 100 }}>
              <div style={{ gridColumn: "1", gridRow: "1", background: "var(--background)" }} className="flex items-center px-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Headline + CTA · 7 col · 58%</span>
              </div>
              <div style={{ gridColumn: "1", gridRow: "2", background: "var(--background)" }} className="flex items-center px-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Body copy</span>
              </div>
              <div style={{ gridColumn: "2", gridRow: "1 / 3", background: "var(--rm-gray-1)" }} className="flex flex-col items-center justify-center gap-0.5">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60">Visual</span>
                <span className="text-[length:var(--text-12)] text-muted-foreground/40 font-[family-name:var(--font-mono-family)]">5 col · 42%</span>
              </div>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground/60">Текст → 7 col (≈ 58%). Изображение заполняет → 5 col (≈ 42%). Ближайшее к φ.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[length:var(--text-12)] font-medium">3. Feature bento</span>
              <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">7+5 / 4+4+4</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-border" style={{ display: "grid", gap: "1px", background: "var(--border)", gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "1fr 1fr", height: 100 }}>
              <div style={{ gridColumn: "1 / 8", gridRow: "1", background: "var(--background)" }} className="flex items-center px-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Feature A · 7 col</span>
              </div>
              <div style={{ gridColumn: "8 / 13", gridRow: "1", background: "var(--background)" }} className="flex items-center justify-center">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">B · 5 col</span>
              </div>
              <div style={{ gridColumn: "1 / 5", gridRow: "2", background: "var(--background)" }} className="flex items-center justify-center">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">C · 4</span>
              </div>
              <div style={{ gridColumn: "5 / 9", gridRow: "2", background: "var(--background)" }} className="flex items-center justify-center">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">D · 4</span>
              </div>
              <div style={{ gridColumn: "9 / 13", gridRow: "2", background: "var(--background)" }} className="flex items-center justify-center">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">E · 4</span>
              </div>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground/60">Ряд 1: крупный блок → 7, доп. → 5. Ряд 2: три равных → 4+4+4. Колонки фиксируют.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[length:var(--text-12)] font-medium">4. Dashboard</span>
              <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">12 / 8+4</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-border" style={{ display: "grid", gap: "1px", background: "var(--border)", gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "28px 1fr 1fr", height: 100 }}>
              <div style={{ gridColumn: "1 / 13", gridRow: "1", background: "var(--background)" }} className="flex items-center px-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Metrics strip · 12 col</span>
              </div>
              <div style={{ gridColumn: "1 / 9", gridRow: "2 / 4", background: "var(--background)" }} className="flex flex-col items-center justify-center gap-0.5">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Chart</span>
                <span className="text-[length:var(--text-12)] text-muted-foreground/35 font-[family-name:var(--font-mono-family)]">8 col · 67%</span>
              </div>
              <div style={{ gridColumn: "9 / 13", gridRow: "2 / 4", background: "var(--background)" }} className="flex flex-col items-center justify-center gap-0.5">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Sidebar</span>
                <span className="text-[length:var(--text-12)] text-muted-foreground/35 font-[family-name:var(--font-mono-family)]">4 col · 33%</span>
              </div>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground/60">График требует широкой зоны → 8 col. Панель метрик → 4 col. Контент первый.</p>
          </div>
        </div>

        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Золотое сечение 38/62 — ориентир для пар sidebar/content, text/visual в hero-блоках.
        </p>

        <h3 id="spacing-visual" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4 mt-10">
          Сетка как визуальный стиль
        </h3>
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6 max-w-[640px]">
          Сетка — часть дизайн-кода. Направляющие линии между колонками — не декор, а материализация структуры.
          Реальные 1px CSS-колонки задают ритм и видимый каркас. <code className="bg-rm-gray-2 px-1.5 py-0.5 rounded text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)]">guideVisible</code> управляет видимостью без изменения раскладки.
        </p>

        <p className="text-[length:var(--text-12)] font-medium text-muted-foreground mb-3">Механика: от пустой сетки к контенту</p>
        <p className="text-[length:var(--text-12)] text-muted-foreground mb-4">
          Принцип: вместо CSS gap — реальные 1px CSS-колонки.
          {" "}<code className="bg-rm-gray-2 px-1 rounded font-[family-name:var(--font-caption-family)]">cols=4</code> →
          {" "}template = <code className="bg-rm-gray-2 px-1 rounded font-[family-name:var(--font-caption-family)]">&quot;1fr 1px 1fr 1px 1fr 1px 1fr&quot;</code>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <p className="text-[length:var(--text-12)] font-medium">1. Направляющие без контента</p>
            <div className="border rounded-[var(--radius-lg)]">
              <GridGuides cols={3} guideVisible={true} cellPadding={16} rowGap={0}>
                {Array.from({ length: 3 }, (_, i) => (
                  <Card key={i} size="sm" className="invisible">
                    <CardHeader><Badge>Пусто</Badge><CardTitle>Функция</CardTitle></CardHeader>
                  </Card>
                ))}
              </GridGuides>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[length:var(--text-12)] font-medium">2. С контентом, направляющие видны</p>
            <div className="border rounded-[var(--radius-lg)]">
              <GridGuides cols={3} guideVisible={true} cellPadding={8} rowGap={0}>
                {["AI", "Авто", "Быстро"].map((label) => (
                  <Card key={label} size="sm">
                    <CardHeader><Badge className="w-fit self-start">{label}</Badge><CardTitle>Функция</CardTitle></CardHeader>
                  </Card>
                ))}
              </GridGuides>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[length:var(--text-12)] font-medium">3. С контентом, направляющие скрыты</p>
            <div className="border rounded-[var(--radius-lg)]">
              <GridGuides cols={3} guideVisible={false} cellPadding={8} rowGap={0}>
                {["AI", "Авто", "Быстро"].map((label) => (
                  <Card key={label} size="sm">
                    <CardHeader><Badge className="w-fit self-start">{label}</Badge><CardTitle>Функция</CardTitle></CardHeader>
                  </Card>
                ))}
              </GridGuides>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2 bg-rm-gray-2/30 rounded-[var(--radius-lg)] border border-border p-4">
            <Badge variant="default" className="w-fit self-start">Лендинг / маркетинг</Badge>
            <p className="text-[length:var(--text-14)] font-medium">guideVisible = true</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">
              Направляющие видны как часть визуального языка. Структура читается через линии.
            </p>
          </div>
          <div className="space-y-2 bg-rm-gray-2/30 rounded-[var(--radius-lg)] border border-border p-4">
            <Badge variant="secondary" className="w-fit self-start">SaaS-интерфейс</Badge>
            <p className="text-[length:var(--text-14)] font-medium">guideVisible = false</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">
              Те же 1px-колонки, но прозрачны. Раскладка идентична — меняется только вид.
            </p>
          </div>
        </div>

        <p className="text-[length:var(--text-12)] font-medium text-muted-foreground mb-3">Пример: 3 колонки с направляющими</p>
        <div className="border rounded-[var(--radius-lg)] mb-2">
          <GridGuides cols={3} guideVisible={true} cellPadding={12} rowGap={0}>
            {[
              { badge: "AI", title: "Анализ кейса", desc: "Агент обрабатывает документы и формирует сводку." },
              { badge: "Авто", title: "Классификация", desc: "Определяет тип дела и маршрутизирует автоматически." },
              { badge: "Быстро", title: "Результат за секунды", desc: "Формирует ответ и ссылку на оплату." },
            ].map((c) => (
              <Card key={c.title}>
                <CardHeader>
                  <Badge className="w-fit self-start">{c.badge}</Badge>
                  <CardTitle>{c.title}</CardTitle>
                  <p className="text-[length:var(--text-14)] text-muted-foreground">{c.desc}</p>
                </CardHeader>
              </Card>
            ))}
          </GridGuides>
        </div>
        <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
          GridGuides cols=3 guideVisible=true cellPadding=12
        </p>

        <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4 mt-10">
          Bento Grid — нерегулярная сетка
        </h3>
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4 max-w-[640px]">
          Секция Features / «Что умеет сервис» — мозаика карточек разного размера. Минимум 4, максимум 6 ячеек. Ни одна строка не одинакова (принцип асимметрии φ).
        </p>
        <div className="grid grid-cols-12 gap-2 mb-2">
          <div className="col-span-6 border border-border rounded-lg bg-card p-4 flex flex-col gap-1.5 min-h-[100px]">
            <Badge className="w-fit">AI</Badge>
            <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Анализ кейса</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">Агент обрабатывает документы и формирует сводку.</p>
          </div>
          <div className="col-span-6 border border-border rounded-lg bg-card p-4 flex flex-col gap-1.5 min-h-[100px]">
            <Badge variant="secondary" className="w-fit">Авто</Badge>
            <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Классификация</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">Определяет тип дела и маршрутизирует.</p>
          </div>
          <div className="col-span-4 border border-border rounded-lg bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
            <Badge className="w-fit">Быстро</Badge>
            <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Ответ за секунды</p>
          </div>
          <div className="col-span-8 border rounded-lg p-5 min-h-[80px] flex items-center" style={{ backgroundColor: "var(--rm-yellow-10)", borderColor: "var(--rm-yellow-50)" }}>
            <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-tight leading-tight">
              AI-система для ведения кейсов
            </p>
          </div>
          <div className="col-span-5 border border-border rounded-lg bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
            <Badge variant="secondary" className="w-fit">n8n</Badge>
            <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Интеграции</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">Подключается к любому воркфлоу.</p>
          </div>
          <div className="col-span-7 border border-border rounded-lg bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
            <Badge className="w-fit">Оплата</Badge>
            <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Ссылка на оплату</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">Агент формирует ответ со ссылкой автоматически.</p>
          </div>
        </div>
        <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
          grid-cols-12 → col-span-6+6 / col-span-4+8 / col-span-5+7 — ни одна строка не одинакова
        </p>
      </Section>

      <Separator />
    </>
  )
}
