"use client"

import * as React from "react"
import { BellRing, CircleHelp, Moon, ShieldCheck, Sun } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { Badge, Switch } from "@rocketmind/ui"

const SWITCH_CODE = `relative inline-flex items-center rounded-full border border-border bg-rm-gray-1 p-[1px] transition-[background-color,border-color,box-shadow,opacity] duration-150 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-checked:border-[var(--rm-yellow-100)] data-checked:bg-[var(--rm-yellow-100)] data-disabled:opacity-40`

function SwitchRow({
  icon,
  label,
  description,
  control,
  quiet = false,
}: {
  icon?: React.ReactNode
  label: string
  description: string
  control: React.ReactNode
  quiet?: boolean
}) {
  return (
    <label className={`flex items-start justify-between gap-4 rounded-lg border border-border p-4 ${quiet ? "bg-rm-gray-1" : "bg-background"}`}>
      <span className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-sm border border-border bg-rm-gray-1 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="block text-[length:var(--text-14)] text-foreground">{label}</span>
          <span className="mt-1 block text-[length:var(--text-12)] text-muted-foreground">{description}</span>
        </span>
      </span>
      <span className="shrink-0 pt-0.5">{control}</span>
    </label>
  )
}

export function SwitchShowcase() {
  const [autoPayEnabled, setAutoPayEnabled] = React.useState(true)
  const [soundEnabled, setSoundEnabled] = React.useState(false)
  const [themeEnabled, setThemeEnabled] = React.useState(true)

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[180px_repeat(3,minmax(0,1fr))]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Default", "Disabled", "Sizes"].map((state) => (
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
              Два размера, внешний tooltip/icon и тот же control-набор: `--border`, `--ring`, `--rm-gray-1`, `--rm-yellow-100`.
            </p>
          </div>

          <div className="bg-background px-4 py-4">
            <div className="space-y-3">
              <SwitchRow
                label="Автоматически отправлять ссылку на оплату"
                description="Тумблер подходит для немедленного on/off без отдельной кнопки Save."
                control={<Switch aria-label="Автоматически отправлять ссылку на оплату" checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} />}
              />
              <SwitchRow
                label="Показывать системные подсказки"
                description="Состояние меняется сразу и остаётся в текущем контексте экрана."
                control={<Switch aria-label="Показывать системные подсказки" defaultChecked />}
                quiet
              />
            </div>
          </div>

          <div className="bg-background px-4 py-4">
            <div className="space-y-3">
              <SwitchRow
                label="Уведомления заблокированы"
                description="Disabled не скрываем, если он помогает объяснить, почему сценарий пока недоступен."
                control={<Switch aria-label="Уведомления заблокированы" checked disabled readOnly />}
              />
              <SwitchRow
                label="Синхронизация с CRM скоро"
                description="Недоступный off-вариант остаётся видимым в структуре настроек."
                control={<Switch aria-label="Синхронизация с CRM скоро" disabled />}
                quiet
              />
            </div>
          </div>

          <div className="bg-background px-4 py-4">
            <div className="space-y-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                    Small / 28×16
                  </p>
                  <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground">
                    Compact toolbar, inline-filters, плотные строки.
                  </p>
                </div>
                <Switch aria-label="Компактный тумблер" size="sm" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                    Default / 36×20
                  </p>
                  <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground">
                    Основной размер для форм и экранов настроек.
                  </p>
                </div>
                <Switch aria-label="Основной тумблер" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">FULL WIDTH</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Основной паттерн: тумблер живёт в полной строке настройки.
              </p>
            </div>
            <CopyButton value={SWITCH_CODE} label="Switch styles" />
          </div>

          <div className="space-y-3">
            <SwitchRow
              label="Разрешить быстрый автозапуск агента"
              description="Если пользователь понимает последствие действия, тумблер можно переключать сразу."
              control={<Switch aria-label="Разрешить быстрый автозапуск агента" defaultChecked />}
            />
            <SwitchRow
              label="Показывать завершённые кейсы"
              description="Для плотных экранов строка остаётся полноширинной, а тумблер выравнивается справа."
              control={<Switch aria-label="Показывать завершённые кейсы" />}
              quiet
            />
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
            <Badge variant="outline" className="text-[length:var(--text-12)]">TOOLTIP</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Tooltip не меняет стиль control. Он висит на helper-иконке или лейбле и объясняет последствие переключения.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[length:var(--text-14)] text-foreground">Звуковые уведомления в чате</span>
                  <span
                    title="Включай только там, где системные ответы должны сразу привлекать внимание оператора."
                    className="inline-flex size-5 items-center justify-center rounded-full border border-border bg-rm-gray-1 text-muted-foreground"
                  >
                    <CircleHelp size={12} strokeWidth={2.4} />
                  </span>
                </div>
                <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground">
                  Подсказка живёт рядом с текстом, а не внутри самого тумблера.
                </p>
              </div>
              <Switch
                aria-label="Звуковые уведомления в чате"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">ICON</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Иконка вторична, живёт в строке настройки и наследует цвет текста.
              </p>
            </div>

          <div className="space-y-3">
            <SwitchRow
              icon={<ShieldCheck size={16} strokeWidth={2.4} />}
              label="Защитить кейс повторным подтверждением"
              description="Используй иконку только если она помогает быстрее считать смысл опции."
              control={<Switch aria-label="Защитить кейс повторным подтверждением" defaultChecked />}
            />
            <SwitchRow
              icon={<BellRing size={16} strokeWidth={2.4} />}
              label="Пуши о новых ответах агента"
              description="Иконка вторична: цвет и размер берём из общих icon-правил Rocketmind."
              control={<Switch aria-label="Пуши о новых ответах агента" />}
              quiet
            />
            <div className="rounded-lg border border-border bg-rm-gray-1 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Moon size={16} strokeWidth={2.4} />
                  <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">
                    Theme Mode
                  </span>
                  <Sun size={16} strokeWidth={2.4} />
                </div>
                <Switch
                  aria-label="Theme Mode"
                  checked={themeEnabled}
                  onCheckedChange={setThemeEnabled}
                />
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
            "Switch используем для немедленного бинарного on/off, когда результат понятен без отдельного подтверждения. Если действие юридически значимо или требует группового выбора, переходи к Checkbox или Radio.",
            "Основной размер — 36×20 px, compact-вариант — 28×16 px. Оба используют один и тот же rail: border --border, off-bg --rm-gray-1, on-bg --rm-yellow-100.",
            "Focus-visible повторяет общую control-логику Rocketmind: border --ring и outer ring 3px / 50%. Не добавляй новые glow, shadow или кастомные hover-анимации.",
            "Иконки и tooltip остаются внешней композицией строки настройки. Сам тумблер не получает встроенный декор, подписи внутри rail или отдельную палитру.",
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
