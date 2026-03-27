"use client"

import { ArrowRight, CircleAlert, CircleCheck, Info, Sparkles, TriangleAlert } from "lucide-react"

import { Badge, Button, Note, NoteDescription, NoteEyebrow, NoteTitle } from "@rocketmind/ui"
import { CopyButton } from "@/components/copy-button"
import { SpecBlock } from "@/components/ds/shared"

const NOTE_CODE = `rounded-lg border p-4 transition-[border-color,background-color,color,opacity] duration-150`

type NoteTone = "soft" | "filled"
type NoteVariant = "neutral" | "info" | "success" | "warning" | "error" | "action"

const rows: Array<{ pattern: string; rocketmind: string; rule: string }> = [
  {
    pattern: "Базовое сообщение",
    rocketmind: "neutral",
    rule: "Нейтральное сервисное сообщение без лишнего акцента.",
  },
  {
    pattern: "CTA внутри note",
    rocketmind: "action",
    rule: "Кнопка живёт внутри note только если завершает конкретное сообщение.",
  },
  {
    pattern: "Статусные состояния",
    rocketmind: "success / warning / error",
    rule: "Семантика собирается только на status-токенах: info, success, warning, error.",
  },
  {
    pattern: "Filled",
    rocketmind: "tone=\"filled\"",
    rule: "Заполненная версия нужна, когда note должен считываться быстрее карточек и соседних нейтральных поверхностей.",
  },
  {
    pattern: "Disabled / labels",
    rocketmind: "disabled / eyebrow / no eyebrow",
    rule: "Note можно приглушить, скрыть подзаголовок или заменить его короткой смысловой формулировкой.",
  },
]

const tokenRows = [
  ["Neutral", "border --border · bg card / --rm-gray-1", "Базовое объяснение, вторичная помощь, meta-комментарий."],
  ["Info", "blue 300 / 900 / fg-subtle · blue 100 / fg", "Нейтрально-операционный контекст: синхронизация, импорт, системные подсказки."],
  ["Success", "green 300 / 900 / fg-subtle · green 100 / fg", "Подтверждение завершения, валидные шаги, успешный sync."],
  ["Warning", "yellow 300 / 900 / fg-subtle · yellow 100 / fg", "Сценарий требует внимания, но не блокирует поток."],
  ["Error", "red 300 / 900 / fg-subtle · red 100 / fg", "Блокирующая проблема, риск потери данных или неудачный запрос."],
  ["Disabled", "opacity 0.4", "Сохраняем в лэйауте, но выключаем взаимодействие до доступности сценария."],
]

function NoteCard({
  variant,
  tone = "soft",
  eyebrow,
  title,
  description,
  action,
  disabled = false,
}: {
  variant: NoteVariant
  tone?: NoteTone
  eyebrow?: string | null
  title: string
  description: React.ReactNode
  action?: React.ReactNode
  disabled?: boolean
}) {
  const Icon =
    variant === "success"
      ? CircleCheck
      : variant === "warning"
        ? TriangleAlert
        : variant === "error"
          ? CircleAlert
          : variant === "action"
            ? Sparkles
            : Info

  return (
    <Note variant={variant} tone={tone} disabled={disabled}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 shrink-0">
            <Icon className="size-4 text-current" />
          </div>
          <div className="min-w-0 space-y-2">
            {eyebrow === null ? null : <NoteEyebrow>{eyebrow}</NoteEyebrow>}
            <div className="space-y-1">
              <NoteTitle>{title}</NoteTitle>
              <NoteDescription>{description}</NoteDescription>
            </div>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Note>
  )
}

export function NoteShowcase() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[180px_repeat(3,minmax(0,1fr))]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Сценарий", "Вариант", "Правило"].map((label) => (
            <div key={label} className="bg-muted/60 px-4 py-3">
              <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}

          {rows.map((row) => (
            <div key={row.pattern} className="contents">
              <div className="bg-background px-4 py-4 text-[length:var(--text-14)] text-foreground">
                {row.pattern}
              </div>
              <div className="bg-background px-4 py-4">
                <code className="rounded-sm bg-rm-gray-2 px-1 py-0.5 text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-foreground">
                  {row.rocketmind}
                </code>
              </div>
              <div className="bg-background px-4 py-4 text-[length:var(--text-14)] text-muted-foreground md:col-span-2">
                {row.rule}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">SOFT</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Основной режим для пояснений внутри карточек, форм и системных панелей.
              </p>
            </div>
            <CopyButton value={NOTE_CODE} label="Note base styles" />
          </div>

          <div className="space-y-3">
            <NoteCard
              variant="neutral"
              eyebrow="Нейтральное пояснение"
              title="Сначала соберите факты по кейсу"
              description="Используй neutral-note, когда сообщение должно помогать, но не конкурировать с главным CTA."
            />
            <NoteCard
              variant="info"
              eyebrow="Синхронизация"
              title="Интеграция обновляется каждые 15 минут"
              description="Если нужен ручной запуск раньше, покажи action-note с кнопкой обновления."
            />
            <NoteCard
              variant="success"
              eyebrow="Успешный шаг"
              title="Документы успешно прикреплены"
              description={
                <>
                  Можно переходить к следующему шагу. Подробности смотри в{" "}
                  <a href="#components-cards" className="underline underline-offset-2">
                    карточке кейса
                  </a>
                  .
                </>
              }
            />
            <NoteCard
              variant="warning"
              eyebrow="Требует внимания"
              title="Часть полей ещё не заполнена"
              description="Warning-note виден заранее и не пропадает после закрытия модалки, пока риск остаётся актуальным."
            />
            <NoteCard
              variant="error"
              eyebrow="Блокирующая ошибка"
              title="Не удалось отправить webhook"
              description="Error-note используется для блокирующей проблемы. Не смешивай его с toast, если сообщение должно оставаться на экране."
            />
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">FILLED</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Усиленный режим для флоу, где note должен считываться быстрее соседнего контента.
              </p>
            </div>
            <Badge variant="neutral" size="sm">tone=&quot;filled&quot;</Badge>
          </div>

          <div className="space-y-3">
            <NoteCard
              variant="info"
              tone="filled"
              eyebrow="Режим агента"
              title="Агент переключён в режим интервью"
              description="Filled info подходит для текущего режима работы, если важно подчеркнуть контекст экрана."
            />
            <NoteCard
              variant="success"
              tone="filled"
              eyebrow="Подтверждение"
              title="Оплата подтверждена"
              description="Filled success фиксирует завершённый этап и может стоять сразу над блоком результата."
            />
            <NoteCard
              variant="warning"
              tone="filled"
              eyebrow="Ожидание ответа"
              title="Ответ ИИ может занять до 2 минут"
              description="Заполненный warning уместен перед долгой операцией, если пользователь должен скорректировать ожидание."
            />
            <NoteCard
              variant="error"
              tone="filled"
              eyebrow="Проверьте данные"
              title="Проверьте slug агента"
              description="Filled error используем редко: только для первичной блокировки, которую важно заметить мгновенно."
            />
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">ACTION + DISABLED</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                CTA и disabled-состояние для сервисных сообщений.
              </p>
            </div>

          <div className="space-y-3">
            <NoteCard
              variant="action"
              eyebrow="Следующий шаг"
              title="Подключите оплату, чтобы завершать кейс автоматически"
              description="CTA живёт внутри note только тогда, когда действие напрямую относится к сообщению."
              action={
                <Button size="sm" variant="outline">
                  Подключить
                  <ArrowRight className="size-4" />
                </Button>
              }
            />
            <NoteCard
              variant="warning"
              disabled
              eyebrow="Временно недоступно"
              title="Расшифровка звонка временно недоступна"
              description="Disabled-note нужен, когда важно сохранить место и объяснить структуру шага, но сценарий ещё закрыт."
              action={
                <Button size="sm" variant="outline" disabled>
                  Скоро
                </Button>
              }
            />
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">SUBHEADS</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Вместо badge note использует короткий подзаголовок, который объясняет суть примечания.
              </p>
            </div>

          <div className="space-y-3">
            <NoteCard
              variant="info"
              eyebrow="Контекст сценария"
              title="Default label"
              description="Когда контекст неочевиден, подзаголовок помогает быстрее считать смысл note."
            />
            <NoteCard
              variant="success"
              eyebrow="Платёжный статус"
              title="Custom label"
              description="Подзаголовок можно привязать к сценарию: платёж, синк, онбординг, модерация."
            />
            <NoteCard
              variant="neutral"
              eyebrow={null}
              title="Без подзаголовка"
              description="Подзаголовок убираем только в плотных интерфейсах, где контекст уже читается из секции или карточки."
            />
          </div>
        </div>
      </div>

      <SpecBlock title="Токены и правила">
        <div className="space-y-6">
          <div className="overflow-auto">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Вариант</th>
                  <th className="text-left px-4 py-2 font-medium">Токены</th>
                  <th className="text-left px-4 py-2 font-medium">Когда использовать</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {tokenRows.map(([variant, tokens, usage]) => (
                  <tr key={variant} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{variant}</td>
                    <td className="px-4 py-2"><code className="ds-token-chip">{tokens}</code></td>
                    <td className="px-4 py-2 text-[length:var(--text-14)] text-muted-foreground">{usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Note нужен для постоянного контекста внутри экрана. Если сообщение краткоживущее и не должно занимать место после действия, используй toast.",
              "Не добавляй новые декоративные цвета. Для note зафиксированы только operational-состояния: neutral, info, success, warning, error, action.",
              "CTA внутри note разрешён только один, размером sm и только когда действие логически завершает или исправляет конкретное сообщение.",
              "Внутри note не используем badge-лейблы. Если нужен дополнительный смысловой слой, ставь короткий текстовый подзаголовок над заголовком.",
            ].map((rule) => (
              <p key={rule} className="text-[length:var(--text-14)] text-muted-foreground">
                {rule}
              </p>
            ))}
          </div>
        </div>
      </SpecBlock>
    </div>
  )
}
