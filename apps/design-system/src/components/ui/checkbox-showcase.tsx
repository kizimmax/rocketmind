"use client"

import * as React from "react"

import { CopyButton } from "@/components/copy-button"
import { SpecBlock } from "@/components/ds/shared"
import { Badge, Checkbox } from "@rocketmind/ui"

const CHECKBOX_CODE = `relative inline-flex size-4 items-center justify-center > input[type="checkbox"] { appearance: none; width: 16px; height: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--rm-gray-1); } input:checked, input:indeterminate { border-color: var(--rm-yellow-100); background: var(--rm-yellow-100); } input:focus-visible { border-color: var(--ring); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent); } input:disabled { opacity: 0.4; }`

function CheckboxRow({
  label,
  description,
  checkbox,
}: {
  label: string
  description: string
  checkbox: React.ReactNode
}) {
  return (
    <label className="flex items-start gap-3 rounded-sm border border-border bg-background p-3">
      {checkbox}
      <span className="min-w-0">
        <span className="block text-[length:var(--text-14)] text-foreground">{label}</span>
        <span className="mt-1 block text-[length:var(--text-12)] text-muted-foreground">{description}</span>
      </span>
    </label>
  )
}

export function CheckboxShowcase() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[180px_repeat(3,minmax(0,1fr))]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Default", "Disabled", "Indeterminate"].map((state) => (
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
              16×16 control, общий focus-visible и один акцент для checked и indeterminate.
            </p>
          </div>

          <div className="bg-background px-4 py-4">
            <div className="space-y-3">
              <CheckboxRow
                label="Получать обновления по кейсу"
                description="Пользователь сам управляет подпиской на служебные сообщения."
                checkbox={<Checkbox defaultChecked />}
              />
              <CheckboxRow
                label="Согласен с политикой обработки данных"
                description="Обязательный чек в формах авторизации и заявок."
                checkbox={<Checkbox />}
              />
            </div>
          </div>

          <div className="bg-background px-4 py-4">
            <div className="space-y-3">
              <CheckboxRow
                label="Платёж уже создаётся"
                description="Недоступное состояние с зафиксированным выбором."
                checkbox={<Checkbox checked disabled readOnly />}
              />
              <CheckboxRow
                label="Изменение заблокировано"
                description="До завершения шага поле остаётся видимым, но не редактируется."
                checkbox={<Checkbox disabled />}
              />
            </div>
          </div>

          <div className="bg-background px-4 py-4">
            <div className="space-y-3">
              <CheckboxRow
                label="Выбрана часть файлов"
                description="Промежуточное состояние для bulk-действий в таблице или списке."
                checkbox={<Checkbox indeterminate readOnly />}
              />
              <CheckboxRow
                label="Архив выбран частично"
                description="Disabled + indeterminate сохраняет структуру сценария без интерактива."
                checkbox={<Checkbox indeterminate disabled readOnly />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">CONSENT</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Основной паттерн: checkbox + label + короткое пояснение.
              </p>
            </div>
            <CopyButton value={CHECKBOX_CODE} label="Checkbox styles" />
          </div>

          <div className="space-y-3">
            <CheckboxRow
              label="Согласен получать ссылку на оплату в чате"
              description="Если действие юридически или продуктово значимо, текст должен объяснять последствие выбора."
              checkbox={<Checkbox defaultChecked />}
            />
            <CheckboxRow
              label="Скрыть завершённые кейсы"
              description="Для вторичных фильтров допустим только один короткий вспомогательный текст."
              checkbox={<Checkbox />}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
            <Badge variant="outline" className="text-[length:var(--text-12)]">BULK SELECT</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Indeterminate нужен только там, где один master-checkbox управляет списком элементов.
            </p>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-rm-gray-1 px-4 py-3">
              <label className="flex items-center gap-3">
                <Checkbox indeterminate readOnly />
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground">
                  Выбрано 2 из 5
                </span>
              </label>
              <span className="text-[length:var(--text-12)] text-muted-foreground">Частичный выбор</span>
            </div>
            <div className="space-y-0">
              {[
                "Кейс: аудит воронки продаж",
                "Кейс: запуск юридического агента",
                "Кейс: подготовка оплаты",
              ].map((item, index) => (
                <label key={item} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
                  <Checkbox defaultChecked={index < 2} />
                  <span className="text-[length:var(--text-14)] text-foreground">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SpecBlock title="Правила">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Checkbox переключает независимый yes/no-выбор. Если пользователь должен выбрать ровно один вариант, используй Radio.",
            "Размер фиксированный: 16x16 px. Радиус берём только --radius-sm, чтобы control совпадал с flat-характером кнопок и input.",
            "Checked и indeterminate используют один акцентный фон --rm-yellow-100. Разница между ними читается только по внутренней пиктограмме.",
            "Disabled-состояние не прячем, если оно помогает объяснить этап процесса или состав недоступных действий.",
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
