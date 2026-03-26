"use client"

import * as React from "react"

import { CopyButton } from "@/components/copy-button"
import { Badge, Radio } from "@rocketmind/ui"

const RADIO_CODE = `input[type="radio"] { appearance: none; width: 16px; height: 16px; border-radius: 9999px; border: 1px solid var(--border); background: var(--rm-gray-1); } input:checked { border-color: var(--rm-yellow-100); background: var(--background); } input:checked + .dot { opacity: 1; background: var(--rm-yellow-100); } input:focus-visible { border-color: var(--ring); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent); } input:disabled { opacity: 0.4; }`

function RadioRow({
  label,
  description,
  radio,
  quiet = false,
}: {
  label: string
  description: string
  radio: React.ReactNode
  quiet?: boolean
}) {
  return (
    <label className={`flex items-start gap-3 rounded-sm border border-border p-3 ${quiet ? "bg-rm-gray-1" : "bg-background"}`}>
      {radio}
      <span className="min-w-0">
        <span className="block text-[length:var(--text-14)] text-foreground">{label}</span>
        <span className="mt-1 block text-[length:var(--text-12)] text-muted-foreground">{description}</span>
      </span>
    </label>
  )
}

export function RadioShowcase() {
  const [headlessValue, setHeadlessValue] = React.useState("agent")

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[180px_repeat(3,minmax(0,1fr))]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Default", "Disabled", "Required"].map((state) => (
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
              16×16 control, один выбор в группе и required без отдельного декоративного состояния.
            </p>
          </div>

          <div className="bg-background px-4 py-4">
            <fieldset className="space-y-3">
              <RadioRow
                label="Запускать агента сразу"
                description="Подходит для сценариев с одним обязательным вариантом ответа."
                radio={<Radio name="launch-mode-default" defaultChecked />}
              />
              <RadioRow
                label="Сначала собрать бриф"
                description="Второй mutually exclusive вариант внутри той же группы."
                radio={<Radio name="launch-mode-default" />}
              />
            </fieldset>
          </div>

          <div className="bg-background px-4 py-4">
            <fieldset className="space-y-3">
              <RadioRow
                label="Текущий тариф"
                description="Выбранный, но недоступный вариант остаётся видимым."
                radio={<Radio name="billing-disabled" checked disabled readOnly />}
              />
              <RadioRow
                label="Новый тариф станет доступен после оплаты"
                description="Disabled помогает объяснить структуру выбора, не ломая сценарий."
                radio={<Radio name="billing-disabled" disabled />}
              />
            </fieldset>
          </div>

          <div className="bg-background px-4 py-4">
            <fieldset className="space-y-3">
              <RadioRow
                label="Email-код"
                description="Один из вариантов в обязательной группе."
                radio={<Radio name="auth-required" defaultChecked required />}
              />
              <RadioRow
                label="Магическая ссылка"
                description="Форма не должна отправляться, пока ни один вариант не выбран."
                radio={<Radio name="auth-required" required />}
              />
            </fieldset>
            <p className="mt-3 text-[length:var(--text-12)] text-muted-foreground">
              Required не меняет визуальный стиль control. Обязательность показываем текстом, а не дополнительным декором.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">HEADLESS</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Control живёт внутри более крупной строки выбора.
              </p>
            </div>
            <CopyButton value={RADIO_CODE} label="Radio styles" />
          </div>

          <div className="space-y-3">
            {[
              {
                value: "agent",
                label: "Подобрать AI-агента",
                description: "Система предложит подходящий сценарий и сразу откроет чат.",
              },
              {
                value: "consultation",
                label: "Сначала нужна консультация",
                description: "Показываем более осторожный маршрут без автозапуска.",
              },
            ].map((item) => {
              const checked = headlessValue === item.value

              return (
                <label
                  key={item.value}
                  className={`block rounded-lg border p-4 transition-colors duration-150 ${
                    checked
                      ? "border-[var(--rm-yellow-300)] bg-[var(--rm-yellow-900)]"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Radio
                      name="headless-example"
                      checked={checked}
                      onChange={() => setHeadlessValue(item.value)}
                    />
                    <span className="min-w-0">
                      <span className="block text-[length:var(--text-14)] text-foreground">{item.label}</span>
                      <span className="mt-1 block text-[length:var(--text-12)] text-muted-foreground">{item.description}</span>
                    </span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
            <Badge variant="outline" className="text-[length:var(--text-12)]">STANDALONE</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Лаконичный radio без сложной карточки: полезен в таблицах, списках каналов и компактных настройках.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 rounded-sm border border-border bg-background px-3 py-2">
              <Radio name="channel-standalone" defaultChecked />
              <span className="text-[length:var(--text-14)] text-foreground">Отправить ответ в текущий чат</span>
            </label>
            <label className="flex items-center gap-3 rounded-sm border border-border bg-background px-3 py-2">
              <Radio name="channel-standalone" />
              <span className="text-[length:var(--text-14)] text-foreground">Отправить только на email</span>
            </label>
            <label className="flex items-center gap-3 rounded-sm border border-border bg-background px-3 py-2">
              <Radio name="channel-standalone" disabled />
              <span className="text-[length:var(--text-14)] text-muted-foreground">Синхронизировать с CRM (скоро)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] uppercase tracking-[-0.01em] mb-3">
          Инструкция
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Radio используем только там, где пользователь обязан выбрать ровно один вариант из группы.",
            "Required остаётся логикой формы, а не отдельным визуальным вариантом: control не получает новый цвет, бейдж или иконку.",
            "Headless-композиция допустима, если сама строка выбора уже использует существующие токены surface: border-border, bg-card, accent-background по состоянию.",
            "Standalone radio подходит для плотных списков. Если у варианта есть пояснение длиннее одной строки, переходи к строке-выбору с label и description.",
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
