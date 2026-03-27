"use client"

import * as React from "react"
import { toast } from "sonner"
import { Badge } from "@rocketmind/ui"
import { SpecBlock } from "@/components/ds/shared"

export function ToastShowcase() {
  const mono = "font-[family-name:var(--font-mono-family)]"

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border">
          <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Нажмите кнопку для демонстрации</p>
        </div>

        <div className="p-6 flex flex-wrap gap-3">
          <button
            onClick={() => toast("Кейс сохранён", { description: "Все изменения применены." })}
            className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}
          >
            Default
          </button>
          <button
            onClick={() => toast.success("Кейс завершён", { description: "Отчёт отправлен на email." })}
            className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}
          >
            Success
          </button>
          <button
            onClick={() => toast.error("Ошибка сохранения", { description: "Проверьте подключение к сети." })}
            className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}
          >
            Error
          </button>
          <button
            onClick={() => toast.warning("Лимит почти исчерпан", { description: "Осталось 2 запроса из 50." })}
            className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}
          >
            Warning
          </button>
          <button
            onClick={() => toast.info("Новый агент доступен", { description: "«Стратег» добавлен в ваш план." })}
            className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}
          >
            Info
          </button>
          <button
            onClick={() => {
              const id = toast.loading("Сохраняем...")
              setTimeout(() => toast.success("Готово!", { id }), 2000)
            }}
            className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}
          >
            Loading → Success
          </button>
          <button
            onClick={() => toast("Кейс удалён", {
              action: { label: "Отменить", onClick: () => toast.success("Восстановлено") },
            })}
            className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}
          >
            With Action
          </button>
        </div>
      </div>

      {/* Instructions */}
      <SpecBlock title="Правила">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Toaster подключается один раз в layout.tsx через <Toaster /> из @rocketmind/ui. Вызов — через функцию toast() из библиотеки sonner.",
            "Фон — bg-popover, бордер — border-border, скругление — var(--radius). Иконки: Lucide (CircleCheck, Info, TriangleAlert, OctagonX, Loader2).",
            "Типы: default (без иконки), success, error, warning, info, loading. Loading можно обновить на success/error по id.",
            "Action-кнопка используется для отмены (undo-паттерн). Тост автоматически наследует тему (light/dark) из ThemeProvider.",
          ].map((rule) => (
            <p key={rule} className="text-[length:var(--text-14)] text-muted-foreground">
              {rule}
            </p>
          ))}
        </div>
      </SpecBlock>
    </div>
  )
}
