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
        <SubSection title="Аккордион — FAQ" first />
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

      <Separator />

      <VersionHistory />
    </>
  )
}
