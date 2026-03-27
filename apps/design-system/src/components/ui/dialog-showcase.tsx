"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import { Badge } from "@rocketmind/ui"
import { SpecBlock } from "@/components/ds/shared"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@rocketmind/ui"

export function DialogShowcase() {
  const mono = "font-[family-name:var(--font-mono-family)]"

  return (
    <div className="space-y-8">
      {/* Default dialog */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border">
          <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Примеры</p>
        </div>

        <div className="p-6 grid gap-4 sm:grid-cols-3">
          {/* Informational dialog */}
          <div className="flex flex-col items-start gap-2">
            <Badge variant="outline" className="text-[length:var(--text-12)]">INFO</Badge>
            <Dialog>
              <DialogTrigger asChild>
                <button className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}>
                  Открыть диалог
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Информация о кейсе</DialogTitle>
                  <DialogDescription>
                    Кейс создан 15 марта 2026. Агент «Аналитик» завершил 3 из 5 этапов анализа.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                  <div className="flex justify-between text-[length:var(--text-14)]">
                    <span className="text-muted-foreground">Статус</span>
                    <span className="text-foreground">В работе</span>
                  </div>
                  <div className="flex justify-between text-[length:var(--text-14)]">
                    <span className="text-muted-foreground">Сообщений</span>
                    <span className="text-foreground">24</span>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}>
                      Закрыть
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Confirmation dialog */}
          <div className="flex flex-col items-start gap-2">
            <Badge variant="outline" className="text-[length:var(--text-12)]">CONFIRM</Badge>
            <Dialog>
              <DialogTrigger asChild>
                <button className={`h-8 px-3 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040] cursor-pointer`}>
                  Завершить кейс
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Завершить кейс?</DialogTitle>
                  <DialogDescription>
                    После завершения вы получите отчёт на email. Диалог с агентом станет недоступен для продолжения.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}>
                      Отмена
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button className={`h-8 px-3 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040] cursor-pointer`}>
                      Завершить
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Destructive dialog */}
          <div className="flex flex-col items-start gap-2">
            <Badge variant="outline" className="text-[length:var(--text-12)]">DESTRUCTIVE</Badge>
            <Dialog>
              <DialogTrigger asChild>
                <button className={`h-8 px-3 rounded-sm bg-destructive text-white ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-90 cursor-pointer`}>
                  <Trash2 size={13} className="inline mr-1.5 -mt-0.5" />
                  Удалить кейс
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Удалить кейс?</DialogTitle>
                  <DialogDescription>
                    Это действие необратимо. Все сообщения и файлы кейса будут удалены навсегда.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className={`h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}>
                      Отмена
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button className={`h-8 px-3 rounded-sm bg-destructive text-white ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-90 cursor-pointer`}>
                      Удалить
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <SpecBlock title="Правила">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Dialog используется для подтверждения критичных действий (удаление, завершение) или показа информации, требующей фокуса. Оверлей — rm-gray-alpha-600.",
            "Максимальная ширина панели — 480px. Скругление — rounded-lg, фон — bg-card, бордер — border-border. Padding — 24px (p-6).",
            "Заголовок — font-heading, uppercase, text-18. Описание — text-14, text-muted-foreground. Footer выровнен вправо с gap-3.",
            "Для деструктивных действий кнопка подтверждения использует bg-destructive. Кнопка отмены всегда Ghost-стиль.",
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
