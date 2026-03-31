"use client"

import React from "react"
import { Separator } from "@rocketmind/ui"
import { Section, SubSection, SpecBlock } from "@/components/ds/shared"
import { TokenChip } from "@/components/ds/color-helpers"
import { Accordion05Demo, VersionHistory } from "@/components/ds/shared"

export default function MarketingBlocksPage() {
  return (
    <>
      <Section id="marketing-blocks" title="Маркетинг блоки">
        <p className="text-muted-foreground mb-8">
          Готовые блоки для лендинга и маркетинговых страниц. Используют токены дизайн-системы — стиль единый с основным приложением.
        </p>

        {/* ── Accordion 05 ── */}
        <SubSection id="marketing-blocks-faq" title="Аккордион — FAQ" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Аккордион для секций FAQ и «Часто задаваемые вопросы». Числа слева — порядковые метки. Заголовок раскрытого пункта подсвечивается акцентным жёлтым. Плавное открытие через <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">grid-template-rows</code> (200ms, ease-standard).
        </p>

        <div className="-mx-5 md:-mx-10 border-y border-border py-10 px-5 md:px-10 mb-8">
          <Accordion05Demo />
        </div>

        <SpecBlock title="Токены">
        <div className="overflow-auto rounded-lg border border-border">
          <table className="w-full text-[length:var(--text-14)]">
            <thead>
              <tr className="border-b border-border bg-rm-gray-2/30">
                <th className="text-left px-4 py-2 font-medium">Свойство</th>
                <th className="text-left px-4 py-2 font-medium">Токен / значение</th>
                <th className="text-left px-4 py-2 font-medium">Описание</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Закрытый заголовок",   "text-foreground/20",              "Приглушённый текст"],
                ["Открытый заголовок",   "text-primary (--rm-yellow-100)",   "Акцентный жёлтый"],
                ["Hover заголовок",      "text-foreground/50",               "Промежуточное состояние"],
                ["Типографика",          "--font-heading-family, uppercase",  "Bold, tracking -0.02em"],
                ["Номер",               "--font-mono-family, --text-12",     "Tabular nums, mt-2"],
                ["Контент",             "--text-14, text-muted-foreground",  "Отступ pl-6 / md:px-20"],
                ["Разделитель",          "border-b border-border",           "Стандартный бордер ДС"],
                ["Анимация",             "grid-template-rows, 200ms",        "--ease-standard (0.4,0,0.2,1)"],
              ].map(([prop, token, desc]) => (
                <tr key={prop} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                  <td className="px-4 py-2"><TokenChip>{token}</TokenChip></td>
                  <td className="px-4 py-2 text-[length:var(--text-14)] text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </SpecBlock>
      </Section>

        {/* ── Кейсы + CTA (PageBottom) ── */}
        <SubSection id="marketing-blocks-page-bottom" title="Кейсы + отзывы + CTA" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Стандартный нижний блок страницы — компонент <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">PageBottom</code>.
          Добавляется на всех страницах сайта, кроме <strong className="text-foreground">/cases</strong> и <strong className="text-foreground">/media</strong>.
        </p>

        <div className="-mx-5 md:-mx-10 border-y border-border py-6 px-5 md:px-10 mb-8">
          <div className="flex flex-col gap-1 text-[length:var(--text-14)]">
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">1</span>
              <span className="font-medium text-foreground">CasesSection</span>
              <span className="text-muted-foreground">— авто-ротация кейсов (15 с), факт-статы, отзывы (21 шт.), бегущая строка логотипов партнёров</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">2</span>
              <span className="font-medium text-foreground">CTASection</span>
              <span className="text-muted-foreground">— призыв к действию с жёлтой кнопкой (#contact), декоративный кружок с жёлтым свечением</span>
            </div>
          </div>
        </div>

        <SpecBlock title="Использование">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Страница</th>
                  <th className="text-left px-4 py-2 font-medium">PageBottom</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["/ (главная)",                        "✓"],
                  ["/consulting, /academy, /ai-products", "✓"],
                  ["/about",                             "✓"],
                  ["/consulting/* (все подстраницы)",    "✓ — через ServicePageTemplate"],
                  ["/academy/* (все подстраницы)",       "✓ — через ServicePageTemplate"],
                  ["/ai-products/* (все подстраницы)",   "✓ — через ServicePageTemplate"],
                  ["/cases, /cases/[slug]",              "✗ — страница кейсов"],
                  ["/media, /media/[slug]",              "✗ — медиа-страницы"],
                  ["/legal/*",                           "✗ — юридические страницы"],
                ].map(([page, status]) => (
                  <tr key={page} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">
                      <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">{page}</code>
                    </td>
                    <td className={`px-4 py-2 ${status === "✓" || status.startsWith("✓") ? "text-foreground" : "text-muted-foreground/50"}`}>
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

      </Section>

      <Separator />

      <VersionHistory />
    </>
  )
}
