"use client"

import * as React from "react"
import { ArticlePagination } from "@rocketmind/ui"
import { CopyButton } from "@/components/copy-button"
import { Badge } from "@rocketmind/ui"

const IMPORT_LINE = `import { ArticlePagination } from "@rocketmind/ui"`

function Frame({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <div>
        <Badge variant="outline" className="text-[length:var(--text-12)]">
          {label}
        </Badge>
        <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
          {description}
        </p>
      </div>
      <div className="rounded-md border border-dashed border-border p-6 bg-rm-gray-1/30">
        <div className="mx-auto max-w-[720px]">{children}</div>
      </div>
    </div>
  )
}

export function ArticlePaginationShowcase() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Навигация между разделами многостраничной статьи. Ставится в конце тела статьи перед блоком «Похожие статьи». Кнопки занимают центральные две колонки тела (cols 2-3).
        </p>
        <CopyButton value={IMPORT_LINE} label="ArticlePagination import" />
      </div>

      <Frame
        label="prev + next"
        description="Средний раздел статьи: обе кнопки 50/50."
      >
        <ArticlePagination
          prev={{ label: "Глава 1. Контекст", href: "#" }}
          next={{ label: "Глава 3. Результат", href: "#" }}
        />
      </Frame>

      <Frame
        label="только next"
        description="Первый раздел: оставшаяся кнопка занимает всю ширину тела."
      >
        <ArticlePagination
          next={{ label: "Глава 2. Подход", href: "#" }}
        />
      </Frame>

      <Frame
        label="только prev"
        description="Последний раздел: оставшаяся кнопка занимает всю ширину тела."
      >
        <ArticlePagination
          prev={{ label: "Глава 2. Подход", href: "#" }}
        />
      </Frame>

      <Frame
        label="длинные имена глав"
        description="Названия обрезаются truncate без переноса строки."
      >
        <ArticlePagination
          prev={{ label: "Очень длинное название предыдущей главы которое не помещается", href: "#" }}
          next={{ label: "Не менее длинное название следующей главы для проверки усечения", href: "#" }}
        />
      </Frame>
    </div>
  )
}
