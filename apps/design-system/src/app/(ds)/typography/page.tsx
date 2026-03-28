"use client"

import React from "react"
import { CopyButton } from "@/components/copy-button"
import { Badge, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from "@rocketmind/ui"
import { Section, SubSection } from "@/components/ds/shared"

export default function TypographyPage() {
  return (
    <>
      <Section id="typography" title="2. Типография">
        <p className="text-muted-foreground mb-8">
          5 шрифтов с чёткими ролями. 4 категории стилей: Heading, Label, Copy, Accent. Для code и caption используется отдельная моноширинная гарнитура Roboto Mono Regular. Размерная шкала на золотом сечении (phi = 1.618) от минимального размера 12px.
        </p>

        {/* 2.1 ШРИФТЫ */}
        <SubSection id="typography-fonts" title="Шрифты" first />
        <div className="border border-border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-10">
          {(() => {
            const fonts = [
              { family: "Roboto Condensed", role: "Заголовки (H1–H4)", example: "ЗАГОЛОВОК СТРАНИЦЫ", css: "font-family: 'Roboto Condensed', sans-serif", fontClass: "font-[family-name:var(--font-heading-family)] font-bold uppercase" },
              { family: "Loos Condensed", role: "Навигация, кнопки, UI-label", example: "НАВИГАЦИЯ / КНОПКИ", css: "font-family: 'Loos Condensed', sans-serif", fontClass: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-wider" },
              { family: "Roboto", role: "Основной текст, body", example: "Основной текст для описаний и контента страниц", css: "font-family: 'Roboto', sans-serif", fontClass: "" },
              { family: "Roboto Mono", role: "Code, caption, технические подписи", example: "const caseId = 'RM-2048'", css: "font-family: 'Roboto Mono', monospace", fontClass: "font-[family-name:var(--font-caption-family)]" },
              { family: "Shantell Sans", role: "Акцентные подписи, стикеры", example: "Рукописная подпись агента", css: "font-family: 'Shantell Sans', cursive", fontClass: "font-[family-name:var(--font-accent-family)]" },
            ]
            return fonts.map((f, i) => (
              <div key={f.family} className={`p-4 ${i % 2 === 0 ? "md:border-r border-border" : ""} ${i < fonts.length - 1 ? "border-b border-border" : ""} ${i === fonts.length - 1 ? "md:col-span-2" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[length:var(--text-16)] font-medium">{f.family}</p>
                  <CopyButton value={f.css} label={f.family} />
                </div>
                <p className="text-[length:var(--text-12)] text-muted-foreground mb-3">{f.role}</p>
                <p className={`text-[length:var(--text-19)] ${f.fontClass}`}>{f.example}</p>
              </div>
            ))
          })()}
        </div>

        {/* 2.2 ТИПОГРАФИКА */}
        <SubSection id="typography-scale" title="Типографика" />

        <Tabs defaultValue="scale" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="scale">Размерная шкала</TabsTrigger>
            <TabsTrigger value="specimens">Текстовые примеры</TabsTrigger>
          </TabsList>

          {/* SCALE */}
          <TabsContent value="scale">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-rm-gray-2/40">
                <span className="w-16 shrink-0" />
                <span className="flex-1 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">Пример</span>
                <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-28 justify-end">
                  <span className="text-[length:var(--text-12)] leading-none">🖥</span> size / weight
                </span>
                <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-24 justify-end">
                  <span className="text-[length:var(--text-12)] leading-none">📱</span> size
                </span>
                <span className="w-8 shrink-0" />
              </div>
              {[
                { label: "H1",         size: "80px", mobileSize: "40px", weight: "800", cls: "font-[family-name:var(--font-heading-family)] font-extrabold uppercase tracking-[-0.02em] leading-[1.0]",    tailwind: "text-[length:var(--text-40)] md:text-[length:var(--text-80)]" },
                { label: "H2",         size: "52px", mobileSize: "32px", weight: "700", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] leading-[1.08]",         tailwind: "text-[length:var(--text-32)] md:text-[length:var(--text-52)]" },
                { label: "H3",         size: "32px", mobileSize: "28px", weight: "700", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.015em] leading-[1.16]",        tailwind: "text-[length:var(--text-28)] md:text-[length:var(--text-32)]" },
                { label: "H4",         size: "24px", mobileSize: "24px", weight: "700", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] leading-[1.2]",          tailwind: "text-[length:var(--text-24)]" },
                { label: "Label-18",   size: "18px", mobileSize: "18px", weight: "500", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.03em] leading-[1.2]",            tailwind: "text-[length:var(--text-18)]" },
                { label: "Label-16",   size: "16px", mobileSize: "16px", weight: "500", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.28]",           tailwind: "text-[length:var(--text-16)]" },
                { label: "Label-14",   size: "14px", mobileSize: "14px", weight: "500", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.24]",           tailwind: "text-[length:var(--text-14)]" },
                { label: "Label-12",   size: "12px", mobileSize: "12px", weight: "500", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.2]",            tailwind: "text-[length:var(--text-12)]" },
                { label: "Copy-24",    size: "24px", mobileSize: "19px", weight: "400", cls: "leading-[1.32]",                                                                                               tailwind: "text-[length:var(--text-19)] md:text-[length:var(--text-25)]" },
                { label: "Copy-18",    size: "18px", mobileSize: "17px", weight: "400", cls: "leading-[1.32]",                                                                                               tailwind: "text-[length:var(--text-16)] md:text-[length:var(--text-19)]" },
                { label: "Copy-16",    size: "16px", mobileSize: "16px", weight: "400", cls: "leading-[1.32]",                                                                                               tailwind: "text-[length:var(--text-16)]" },
                { label: "Caption-14", size: "14px", mobileSize: "14px", weight: "400", cls: "font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.01em]",                              tailwind: "text-[length:var(--text-14)] font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.01em]" },
                { label: "Code-14",    size: "14px", mobileSize: "14px", weight: "400", cls: "font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.02em]",                              tailwind: "text-[length:var(--text-14)] font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.02em]" },
                { label: "Copy-12",    size: "12px", mobileSize: "12px", weight: "400", cls: "leading-[1.4] tracking-[0.02em]",                                                                             tailwind: "text-[length:var(--text-12)]" },
              ].map((t, i, arr) => (
                <div key={t.label} className={`flex items-center gap-4 py-3 px-4 hover:bg-rm-gray-2/40 transition-colors group ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <Badge variant="secondary" className="w-16 justify-center text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] shrink-0">
                    {t.label}
                  </Badge>
                  <span className={`flex-1 ${t.cls}`} style={{ fontSize: t.size }}>
                    {t.label === "Code-14" ? "const caseId = 'RM-2048'" : "Пример текста"}
                  </span>
                  <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-28 justify-end">
                    <span className="text-[length:var(--text-12)] leading-none">🖥</span>{t.size} / {t.weight}
                  </span>
                  <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-24 justify-end">
                    <span className="text-[length:var(--text-12)] leading-none">📱</span>{t.mobileSize}
                  </span>
                  <CopyButton value={`${t.tailwind} ${t.cls}`} label={`${t.label} classes`} />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* SPECIMENS */}
          <TabsContent value="specimens">
            <div className="border border-border rounded-lg overflow-hidden">
              {[
                { label: "H1", text: "Запускайте AI-агентов быстро", cls: "font-[family-name:var(--font-heading-family)] font-extrabold uppercase tracking-[-0.02em] leading-[1.0]", size: "80px", mobileSize: "40px", letterSpacing: "-0.02em", figmaSpacing: "-2%", lineHeight: "1.0", figmaLineHeight: "100%", twCopy: "text-[length:var(--text-40)] md:text-[length:var(--text-80)] font-[family-name:var(--font-heading-family)] font-extrabold uppercase tracking-[-0.02em] leading-[1.0]" },
                { label: "H2", text: "AI-агенты для вашего бизнеса", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] leading-[1.08]", size: "52px", mobileSize: "32px", letterSpacing: "-0.02em", figmaSpacing: "-2%", lineHeight: "1.08", figmaLineHeight: "108%", twCopy: "text-[length:var(--text-32)] md:text-[length:var(--text-52)] font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] leading-[1.08]" },
                { label: "H3", text: "Аналитика и маркетинг без команды", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.015em] leading-[1.16]", size: "32px", mobileSize: "28px", letterSpacing: "-0.015em", figmaSpacing: "-1.5%", lineHeight: "1.16", figmaLineHeight: "116%", twCopy: "text-[length:var(--text-28)] md:text-[length:var(--text-32)] font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.015em] leading-[1.16]" },
                { label: "H4", text: "Выберите агента под задачу", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] leading-[1.2]", size: "24px", mobileSize: "24px", letterSpacing: "-0.01em", figmaSpacing: "-1%", lineHeight: "1.2", figmaLineHeight: "120%", twCopy: "text-[length:var(--text-24)] font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] leading-[1.2]" },
                { label: "Label-18", text: "AI-POWERED · БЕСПЛАТНО", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.03em] leading-[1.2]", size: "18px", mobileSize: "18px", letterSpacing: "0.03em", figmaSpacing: "3%", lineHeight: "1.2", figmaLineHeight: "120%", twCopy: "text-[length:var(--text-18)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.03em] leading-[1.2]" },
                { label: "Label-16", text: "ПОПРОБОВАТЬ БЕСПЛАТНО", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.28]", size: "16px", mobileSize: "16px", letterSpacing: "0.04em", figmaSpacing: "4%", lineHeight: "1.28", figmaLineHeight: "128%", twCopy: "text-[length:var(--text-16)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.28]" },
                { label: "Label-14", text: "ДОБАВИТЬ АГЕНТА", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.24]", size: "14px", mobileSize: "14px", letterSpacing: "0.04em", figmaSpacing: "4%", lineHeight: "1.24", figmaLineHeight: "124%", twCopy: "text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.24]" },
                { label: "Label-12", text: "ОТПРАВИТЬ", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.2]", size: "12px", mobileSize: "12px", letterSpacing: "0.04em", figmaSpacing: "4%", lineHeight: "1.2", figmaLineHeight: "120%", twCopy: "text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.04em] leading-[1.2]" },
                { label: "Copy-24", text: "Платформа AI-агентов, которая помогает бизнесу запускать проекты быстро и без лишних затрат.", cls: "leading-[1.32]", size: "24px", mobileSize: "19px", letterSpacing: "0", figmaSpacing: "0%", lineHeight: "1.32", figmaLineHeight: "132%", twCopy: "text-[length:var(--text-19)] md:text-[length:var(--text-25)] leading-[1.32]" },
                { label: "Copy-18", text: "Платформа AI-агентов, которая помогает малому бизнесу запускать проекты без найма специалистов.", cls: "leading-[1.32]", size: "18px", mobileSize: "17px", letterSpacing: "0", figmaSpacing: "0%", lineHeight: "1.32", figmaLineHeight: "132%", twCopy: "text-[length:var(--text-16)] md:text-[length:var(--text-19)] leading-[1.32]" },
                { label: "Copy-16", text: "Rocketmind — сервис AI-агентов для ведения кейсов. Подключите нужного агента, опишите задачу и получите результат прямо в чате.", cls: "leading-[1.32]", size: "16px", mobileSize: "16px", letterSpacing: "0", figmaSpacing: "0%", lineHeight: "1.32", figmaLineHeight: "132%", twCopy: "text-[length:var(--text-16)] leading-[1.32]" },
                { label: "Caption-14", text: "Подпись к кейсу: результат сформирован агентом автоматически и доступен для повторного запуска.", cls: "font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.01em]", size: "14px", mobileSize: "14px", letterSpacing: "0.01em", figmaSpacing: "1%", lineHeight: "1.4", figmaLineHeight: "140%", twCopy: "text-[length:var(--text-14)] font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.01em]" },
                { label: "Code-14", text: "curl -X POST /api/cases/RM-2048/run", cls: "font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.02em]", size: "14px", mobileSize: "14px", letterSpacing: "0.02em", figmaSpacing: "2%", lineHeight: "1.4", figmaLineHeight: "140%", twCopy: "text-[length:var(--text-14)] font-[family-name:var(--font-caption-family)] leading-[1.4] tracking-[0.02em]" },
                { label: "Copy-12", text: "Последнее обновление: сегодня в 14:32. Версия агента 2.1.4. © 2026 Rocketmind", cls: "leading-[1.4] tracking-[0.02em]", size: "12px", mobileSize: "12px", letterSpacing: "0.02em", figmaSpacing: "2%", lineHeight: "1.4", figmaLineHeight: "140%", twCopy: "text-[length:var(--text-12)] leading-[1.4] tracking-[0.02em]" },
              ].map((t, i, arr) => (
                <div key={t.label} className={`flex gap-4 py-4 px-4 hover:bg-rm-gray-2/40 transition-colors group items-start ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <Badge variant="secondary" className="w-16 justify-center text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] shrink-0 mt-1">
                    {t.label}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className={t.cls} style={{ fontSize: t.size }}>{t.text}</p>
                    <p className={t.cls} style={{ fontSize: t.size }}>Пример второй строки — {t.label} выглядит так.</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5 min-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[length:var(--text-12)] leading-none">🖥</span>
                      <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">size</span>
                      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.size}</code>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[length:var(--text-12)] leading-none">📱</span>
                      <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">size</span>
                      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.mobileSize}</code>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">spacing</span>
                      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.letterSpacing}</code>
                      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-muted-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.figmaSpacing}</code>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">line-h</span>
                      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.lineHeight}</code>
                      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-muted-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.figmaLineHeight}</code>
                    </div>
                    <CopyButton value={t.twCopy} label={`${t.label} classes`} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      <Separator />
    </>
  )
}
