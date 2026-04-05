"use client"

import * as React from "react"
import { ArrowRight, ChevronsUpDown, Download, FolderOpen, Search } from "lucide-react"

import { Badge, Checkbox } from "@rocketmind/ui"
import { CopyButton } from "@/components/copy-button"
import { SpecBlock } from "@/components/ds/shared"

const OUTLINE_XS_BUTTON =
  "inline-flex items-center justify-center gap-2 h-7 px-3 rounded-sm border border-border bg-background text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] active:bg-[var(--rm-gray-3)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

const SECONDARY_SM_BUTTON =
  "inline-flex items-center justify-center gap-2 h-8 px-3 rounded-sm border border-transparent bg-secondary text-secondary-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-[0.88] active:opacity-[0.76] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

const mappingRows = [
  {
    pattern: "Базовая таблица",
    rocketmind: "base",
    rule: "Семантическая таблица на `bg-card`, `border-border`, заголовок на `--rm-gray-1`. База для списков кейсов, платежей и файлов.",
  },
  {
    pattern: "Полосы",
    rocketmind: "striped",
    rule: "Полосы допустимы только для плотных наборов данных. Используем тихий зебра-фон `--rm-gray-1`, без новых оттенков.",
  },
  {
    pattern: "Вертикальные разделители",
    rocketmind: "bordered",
    rule: "Вертикальные разделители берём из `--border`. Никаких теней, inset-обводок и декоративных grid-эффектов.",
  },
  {
    pattern: "Hover / selection",
    rocketmind: "interactive / selectable",
    rule: "Hover строки = `--rm-gray-2`, выбранная строка = `--rm-yellow-900` + border `--rm-yellow-300`. Selection живёт на существующих control-токенах.",
  },
  {
    pattern: "Операционная таблица",
    rocketmind: "operational table",
    rule: "Сложные таблицы собираются из уже описанных badge, checkbox, button и note-паттернов. Таблица сама не вводит новые цвета.",
  },
  {
    pattern: "Большой набор данных",
    rocketmind: "large dataset / progressive reveal",
    rule: "Для MVP фиксируем поведение `Show more` или пагинацию. Виртуализация как техника возможна, но визуально не получает отдельного стиля.",
  },
]

const tokenRows = [
  ["Container", "bg-card + border-border + rounded-lg", "Базовая flat-surface для любой таблицы."],
  ["Head", "bg --rm-gray-1 · text-muted-foreground", "Тихий header, который не спорит с содержимым."],
  ["Row hover", "bg --rm-gray-2", "Единый hover-паттерн строк и quiet-controls."],
  ["Row selected", "bg --rm-yellow-900 · border --rm-yellow-300", "Выбранная строка или частичный bulk-контекст."],
  ["Stripe", "odd/even bg-card / --rm-gray-1", "Только для длинных однотипных списков."],
  ["Numeric", "font-caption-family", "Числа, суммы, id и короткие коды."],
]

function TableFrame({
  label,
  badge,
  children,
}: {
  label: string
  badge: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border flex items-center justify-between gap-3">
        <span className="text-[10px] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Badge variant="neutral" size="sm">{badge}</Badge>
      </div>
      <div className="overflow-x-auto bg-card">
        {children}
      </div>
    </div>
  )
}

function BaseTable({
  striped = false,
  bordered = false,
  interactive = false,
}: {
  striped?: boolean
  bordered?: boolean
  interactive?: boolean
}) {
  const rows = [
    ["Маркетолог", "Активен", "12 кейсов"],
    ["Финансовый агент", "На паузе", "3 кейса"],
    ["Юридический агент", "Черновик", "7 кейсов"],
  ]

  return (
    <table className="w-full min-w-[620px] text-[length:var(--text-14)]">
      <thead>
        <tr className="bg-[var(--rm-gray-1)]">
          {["Агент", "Статус", "Нагрузка"].map((cell) => (
            <th
              key={cell}
              className={`h-10 px-4 text-left align-middle font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground border-b border-border ${bordered ? "border-r last:border-r-0 border-border" : ""}`}
            >
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={row[0]}
            className={[
              striped && index % 2 === 1 ? "bg-[var(--rm-gray-1)]" : "bg-card",
              interactive ? "transition-colors duration-150 hover:bg-[var(--rm-gray-2)]" : "",
            ].join(" ")}
          >
            {row.map((cell) => (
              <td
                key={cell}
                className={`px-4 py-3 text-foreground border-b border-border ${bordered ? "border-r last:border-r-0 border-border" : ""}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function TableShowcase() {
  const [selected, setSelected] = React.useState<string[]>(["case-1", "case-3"])
  const allIds = ["case-1", "case-2", "case-3", "case-4"]
  const allSelected = selected.length === allIds.length
  const partiallySelected = selected.length > 0 && !allSelected

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  function toggleAll() {
    setSelected((current) => (current.length === allIds.length ? [] : [...allIds]))
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[180px_repeat(3,minmax(0,1fr))]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Паттерн", "Вариант", "Правило"].map((label, i) => (
            <div key={label} className="bg-muted/60 px-4 py-3 flex items-center justify-between">
              <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
                {label}
              </p>
              {i === 2 && <CopyButton value={`import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@rocketmind/ui"`} label="Table import" />}
            </div>
          ))}

          {mappingRows.map((row) => (
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
        <TableFrame label="Basic" badge="Base">
          <BaseTable />
        </TableFrame>

        <TableFrame label="Striped" badge="Dense lists">
          <BaseTable striped />
        </TableFrame>

        <TableFrame label="Bordered" badge="Explicit columns">
          <BaseTable bordered />
        </TableFrame>

        <TableFrame label="Interactive" badge="Hover row">
          <BaseTable interactive />
        </TableFrame>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border bg-[var(--rm-gray-1)] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge variant="neutral" className="text-[length:var(--text-12)]">FULL FEATURED</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Таблица кейсов собирается из уже описанных badge, checkbox и button-паттернов.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className={OUTLINE_XS_BUTTON}>
                <Search className="size-4" />
                Фильтр
              </button>
              <button type="button" className={OUTLINE_XS_BUTTON}>
                <Download className="size-4" />
                Экспорт
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-card">
            <table className="w-full min-w-[760px] text-[length:var(--text-14)]">
              <thead>
                <tr className="bg-[var(--rm-gray-1)]">
                  <th className="h-10 w-12 px-4 text-left align-middle border-b border-border">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={partiallySelected}
                      onChange={toggleAll}
                      aria-label="Выбрать все строки"
                    />
                  </th>
                  {[
                    "Кейс",
                    "Этап",
                    "Канал",
                    "Сумма",
                    "Обновлено",
                  ].map((cell) => (
                    <th
                      key={cell}
                      className="h-10 px-4 text-left align-middle border-b border-border font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      <span className="inline-flex items-center gap-1">
                        {cell}
                        {cell === "Сумма" ? <ChevronsUpDown className="size-3.5" /> : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "case-1",
                    caseName: "Аудит воронки продаж",
                    stage: "Нужна оплата",
                    stageBadge: "yellow-subtle" as const,
                    channel: "Telegram",
                    amount: "24 000 ₽",
                    updated: "5 мин назад",
                  },
                  {
                    id: "case-2",
                    caseName: "Юридический due diligence",
                    stage: "В работе",
                    stageBadge: "blue-subtle" as const,
                    channel: "Web chat",
                    amount: "48 000 ₽",
                    updated: "22 мин назад",
                  },
                  {
                    id: "case-3",
                    caseName: "AI-агент для HR",
                    stage: "Готово",
                    stageBadge: "green-subtle" as const,
                    channel: "Email",
                    amount: "16 000 ₽",
                    updated: "1 час назад",
                  },
                  {
                    id: "case-4",
                    caseName: "Разбор unit-экономики",
                    stage: "Ошибка webhook",
                    stageBadge: "red-subtle" as const,
                    channel: "Web chat",
                    amount: "32 000 ₽",
                    updated: "2 часа назад",
                  },
                ].map((row) => {
                  const isSelected = selected.includes(row.id)

                  return (
                    <tr
                      key={row.id}
                      data-selected={isSelected}
                      className={`transition-colors duration-150 hover:bg-[var(--rm-gray-2)] ${isSelected ? "bg-[var(--rm-yellow-900)]" : "bg-card"}`}
                    >
                      <td className={`px-4 py-3 border-b ${isSelected ? "border-[var(--rm-yellow-300)]" : "border-border"}`}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggle(row.id)}
                          aria-label={`Выбрать ${row.caseName}`}
                        />
                      </td>
                      <td className={`px-4 py-3 border-b ${isSelected ? "border-[var(--rm-yellow-300)]" : "border-border"}`}>
                        <div className="space-y-1">
                          <p className="text-foreground">{row.caseName}</p>
                          <p className="text-[length:var(--text-12)] text-muted-foreground">
                            /a/{row.id}
                          </p>
                        </div>
                      </td>
                      <td className={`px-4 py-3 border-b ${isSelected ? "border-[var(--rm-yellow-300)]" : "border-border"}`}>
                        <Badge variant={row.stageBadge} size="sm">{row.stage}</Badge>
                      </td>
                      <td className={`px-4 py-3 border-b text-muted-foreground ${isSelected ? "border-[var(--rm-yellow-300)]" : "border-border"}`}>
                        {row.channel}
                      </td>
                      <td className={`px-4 py-3 border-b font-[family-name:var(--font-caption-family)] text-foreground ${isSelected ? "border-[var(--rm-yellow-300)]" : "border-border"}`}>
                        {row.amount}
                      </td>
                      <td className={`px-4 py-3 border-b text-muted-foreground ${isSelected ? "border-[var(--rm-yellow-300)]" : "border-border"}`}>
                        {row.updated}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[var(--rm-gray-1)]">
                  <td className="px-4 py-3 border-t border-border" />
                  <td className="px-4 py-3 border-t border-border font-medium text-foreground">
                    Subtotal
                  </td>
                  <td className="px-4 py-3 border-t border-border" />
                  <td className="px-4 py-3 border-t border-border" />
                  <td className="px-4 py-3 border-t border-border font-[family-name:var(--font-caption-family)] text-foreground">
                    120 000 ₽
                  </td>
                  <td className="px-4 py-3 border-t border-border text-right">
                    <button type="button" className={SECONDARY_SM_BUTTON}>
                      Открыть кейсы
                      <ArrowRight className="size-4" />
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
            <Badge variant="neutral" className="text-[length:var(--text-12)]">LARGE DATASET</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Сначала фиксируем визуальный паттерн, потом технику рендера.
            </p>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-[var(--rm-gray-1)] px-4 py-3">
              <div className="space-y-1">
                <p className="text-[length:var(--text-14)] text-foreground">Большой список документов</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">
                  Показываем первые 8 строк, затем догружаем пачками.
                </p>
              </div>
              <button type="button" className={OUTLINE_XS_BUTTON}>Show more</button>
            </div>
            <div className="divide-y divide-border bg-card">
              {[
                "brief.pdf",
                "contract-v2.docx",
                "payment-link.txt",
                "summary.md",
                "call-transcript.pdf",
                "persona.csv",
                "nda.pdf",
                "webhook-log.json",
              ].map((file, index) => (
                <div key={file} className={`flex items-center justify-between gap-3 px-4 py-3 ${index % 2 === 1 ? "bg-[var(--rm-gray-1)]" : ""}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 items-center justify-center rounded-sm border border-border bg-background">
                      <FolderOpen className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[length:var(--text-14)] text-foreground">{file}</p>
                      <p className="text-[length:var(--text-12)] text-muted-foreground">Строка {index + 1}</p>
                    </div>
                  </div>
                  <button type="button" className={OUTLINE_XS_BUTTON}>Открыть</button>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-4 py-3 bg-card">
              <button type="button" className={OUTLINE_XS_BUTTON}>
                Показать ещё 20
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              "Визуально large dataset не отличается от обычной таблицы: те же row height, border и hover-state.",
              "Если строк очень много, сначала пробуем `Show more`, пагинацию или sticky-фильтры. Виртуализация скрыта внутри реализации и не добавляет новый видимый стиль.",
              "Зебру, selection и bulk-actions можно комбинировать, но только если они реально помогают чтению, а не перегружают экран.",
            ].map((rule) => (
              <p key={rule} className="text-[length:var(--text-14)] text-muted-foreground">
                {rule}
              </p>
            ))}
          </div>
        </div>
      </div>

      <SpecBlock title="Токены и правила">
        <div className="space-y-6">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-[var(--rm-gray-1)]">
                  <th className="text-left px-4 py-2 font-medium">Слой</th>
                  <th className="text-left px-4 py-2 font-medium">Токены</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {tokenRows.map(([prop, token, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><code className="ds-token-chip">{token}</code></td>
                    <td className="px-4 py-2 text-[length:var(--text-14)] text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Таблица нужна только для сравнимых, повторяющихся данных. Если каждая строка превращается в mini-card с длинным текстом, переходи к списку или карточкам.",
              "Header всегда тихий: `--rm-gray-1`, `text-muted-foreground`, Loos Condensed uppercase. Основной контраст должен оставаться у данных, а не у шапки.",
              "Interactive row использует только два слоя поведения: hover `--rm-gray-2` и selected `--rm-yellow-900` + `--rm-yellow-300`. Не добавляй новый hover-border, shadow или ring на всю строку.",
              "Числа, суммы, id и короткие коды лучше ставить на `--font-caption-family`, чтобы колонки читались ровнее. Для статусов используем существующие `Badge`, а не красим текст вручную.",
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
