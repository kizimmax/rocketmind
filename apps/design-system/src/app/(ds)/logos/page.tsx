"use client"

import React from "react"
import { CopyButton } from "@/components/copy-button"
import { Separator } from "@rocketmind/ui"
import { Section } from "@/components/ds/shared"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind/ds" : ""

export default function LogosPage() {
  return (
    <>
      <Section id="logos" title="0. Логотипы">
        <p className="text-muted-foreground mb-8">
          Полный набор логотипов Rocketmind. Используйте вариант на тёмном фоне для тёмных поверхностей,
          на светлом — для белых/серых. Доступны форматы <strong>SVG</strong> (векторный) и <strong>PNG</strong>.
        </p>

        {[
          {
            group: "Icon — только иконка",
            imgH: "h-16",
            items: [
              { label: "Icon — тёмный фон", file: "icon_dark_background", bg: "#121212", imgClass: `<img src="/icon_dark_background.svg" className="h-16 w-auto hidden dark:block" />` },
              { label: "Icon — светлый фон", file: "icon_light_background", bg: "#f5f5f5", imgClass: `<img src="/icon_light_background.svg" className="h-16 w-auto dark:hidden" />` },
            ],
          },
          {
            group: "Text Logo — EN",
            imgH: "h-10",
            items: [
              { label: "Text EN — тёмный фон", file: "text_logo_dark_background_en", bg: "#121212", imgClass: `<img src="/text_logo_dark_background_en.svg" className="h-7 hidden dark:block" />` },
              { label: "Text EN — светлый фон", file: "text_logo_light_background_en", bg: "#f5f5f5", imgClass: `<img src="/text_logo_light_background_en.svg" className="h-7 dark:hidden" />` },
            ],
          },
          {
            group: "Text Logo — RU",
            imgH: "h-10",
            items: [
              { label: "Text RU — тёмный фон", file: "text_logo_dark_background_ru", bg: "#121212", imgClass: `<img src="/text_logo_dark_background_ru.svg" className="h-7 hidden dark:block" />` },
              { label: "Text RU — светлый фон", file: "text_logo_light_background_ru", bg: "#f5f5f5", imgClass: `<img src="/text_logo_light_background_ru.svg" className="h-7 dark:hidden" />` },
            ],
          },
          {
            group: "С дескриптором — EN",
            imgH: "h-14",
            items: [
              { label: "С дескриптором EN — тёмный", file: "with_descriptor_dark_background_en", bg: "#121212", imgClass: `<img src="/with_descriptor_dark_background_en.svg" className="h-14 w-auto hidden dark:block" />` },
              { label: "С дескриптором EN — светлый", file: "with_descriptor_light_background_en", bg: "#f5f5f5", imgClass: `<img src="/with_descriptor_light_background_en.svg" className="h-14 w-auto dark:hidden" />` },
            ],
          },
          {
            group: "С дескриптором — RU",
            imgH: "h-14",
            items: [
              { label: "С дескриптором RU — тёмный", file: "with_descriptor_dark_background_ru", bg: "#121212", imgClass: `<img src="/with_descriptor_dark_background_ru.svg" className="h-14 w-auto hidden dark:block" />` },
              { label: "С дескриптором RU — светлый", file: "with_descriptor_light_background_ru", bg: "#f5f5f5", imgClass: `<img src="/with_descriptor_light_background_ru.svg" className="h-14 w-auto dark:hidden" />` },
            ],
          },
        ].map((group) => (
          <div key={group.group} className="mb-10 last:mb-0">
            <p className="text-[length:var(--text-12)] font-semibold uppercase tracking-wider text-muted-foreground mb-4 font-[family-name:var(--font-mono-family)]">
              {group.group}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.items.map((item) => (
                <div key={item.file} className="rounded-lg border border-border overflow-hidden">
                  <div className="flex items-center justify-center p-8" style={{ backgroundColor: item.bg }}>
                    <img src={`${BASE_PATH}/${item.file}.svg`} alt={item.label} className={`${group.imgH} w-auto`} />
                  </div>
                  <div className="px-4 py-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[length:var(--text-14)] font-medium">{item.label}</p>
                      <div className="flex gap-2">
                        <a href={`${BASE_PATH}/${item.file}.svg`} download className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 font-[family-name:var(--font-mono-family)] transition-colors">SVG</a>
                        <a href={`${BASE_PATH}/${item.file}.png`} download className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 font-[family-name:var(--font-mono-family)] transition-colors">PNG</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-muted-foreground bg-rm-gray-2 px-2 py-0.5 rounded flex-1 truncate">
                        {item.imgClass}
                      </code>
                      <CopyButton value={item.imgClass} label={item.label} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Separator />
    </>
  )
}
