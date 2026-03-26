"use client"

import { CopyButton } from "@/components/copy-button"
import { Badge, Button, Textarea } from "@rocketmind/ui"

const DEFAULT_TEXTAREA_CODE = `min-h-[120px] resize-y px-4 py-3 rounded-sm border border-border bg-rm-gray-1 text-foreground text-[length:var(--text-14)] leading-[1.5] placeholder:text-muted-foreground transition-all duration-150 outline-none focus-visible:border-ring disabled:opacity-40 disabled:cursor-not-allowed aria-invalid:border-destructive`

const CHAT_TEXTAREA_CODE = `min-h-[48px] max-h-[200px] resize-none overflow-auto px-4 py-3 rounded-sm border border-border bg-rm-gray-1 text-foreground text-[length:var(--text-16)] leading-[1.618] placeholder:text-muted-foreground transition-all duration-150 outline-none focus-visible:border-ring disabled:opacity-40 disabled:cursor-not-allowed aria-invalid:border-destructive`

export function TextareaShowcase() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[180px_repeat(3,minmax(0,1fr))]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Default", "Disabled", "Error"].map((state) => (
            <div key={state} className="bg-muted/60 px-4 py-3">
              <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
                {state}
              </p>
            </div>
          ))}

          <div className="bg-background px-4 py-4 flex flex-col gap-1 justify-center">
            <p className="text-[length:var(--text-14)] font-medium text-foreground">
              Основа
            </p>
            <p className="ds-token-caption text-muted-foreground leading-relaxed">
              Базовые состояния: default, disabled и error. Focus меняет только border.
            </p>
          </div>

          <div className="bg-background px-4 py-4">
            <Textarea
              placeholder="Опишите задачу для AI-агента..."
              defaultValue="Нужен краткий разбор текущего кейса и список следующих шагов."
            />
          </div>

          <div className="bg-background px-4 py-4">
            <Textarea
              disabled
              placeholder="Опишите задачу для AI-агента..."
              defaultValue="Поле заблокировано, пока кейс в обработке."
            />
          </div>

          <div className="bg-background px-4 py-4">
            <div className="space-y-2">
              <Textarea
                aria-invalid="true"
                defaultValue="Слишком общий запрос без контекста."
              />
              <p className="text-[length:var(--text-12)] text-destructive">
                Добавьте цель, аудиторию или желаемый результат.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-lg border border-border space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">DEFAULT</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Основной textarea для форм, briefs и длинных ответов.
              </p>
            </div>
            <CopyButton value={DEFAULT_TEXTAREA_CODE} label="Textarea Default" />
          </div>

          <div className="space-y-1.5 max-w-xl">
            <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Brief
            </label>
            <Textarea placeholder="Опишите задачу, контекст и ограничения..." />
          </div>
        </div>

        <div className="p-6 rounded-lg border border-border space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">CHAT</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Компактный composer для чата: поле сверху, action-ряд снизу.
              </p>
            </div>
            <CopyButton value={CHAT_TEXTAREA_CODE} label="Textarea Chat" />
          </div>

          <div className="max-w-xl rounded-lg border border-border bg-background p-3">
            <div className="flex flex-col gap-3">
              <Textarea
                variant="chat"
                rows={2}
                placeholder="Напишите сообщение..."
                defaultValue="Собери план интервью с клиентом и выдели критические вопросы."
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                  Enter отправляет, Shift + Enter переносит строку.
                </p>
                <Button size="sm">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] uppercase tracking-[-0.01em] mb-3">
          Инструкция
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Используй default для форм, брифов, описаний кейса и любых задач, где пользователь пишет больше одной строки.",
            "Используй chat только в зоне отправки сообщения: компактная высота, без ручного resize и с ограничением по max-height.",
            "Для focus меняется только border на --ring; не добавляй кастомные ring, shadow или glow поверх компонента.",
            "Error оформляется через aria-invalid на поле и текст ошибки под ним цветом --destructive.",
          ].map((rule) => (
            <p key={rule} className="text-[length:var(--text-14)] text-muted-foreground">
              {rule}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
