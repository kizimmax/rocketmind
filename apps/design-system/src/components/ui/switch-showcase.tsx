"use client"

import * as React from "react"
import { BellRing, LayoutGrid, LayoutList, Moon, ShieldCheck, Sun } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { Badge, Switch, Tabs, TabsList, TabsTrigger } from "@rocketmind/ui"

const SWITCH_IMPORT = `import { Switch } from "@rocketmind/ui"`

function SwitchRow({
  icon,
  label,
  control,
  quiet = false,
}: {
  icon?: React.ReactNode
  label: string
  control: React.ReactNode
  quiet?: boolean
}) {
  return (
    <label className={`flex items-center justify-between gap-4 rounded-lg border border-border p-4 ${quiet ? "bg-rm-gray-1" : "bg-background"}`}>
      <span className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm border border-border bg-rm-gray-1 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <span className="text-[length:var(--text-14)] text-foreground">{label}</span>
      </span>
      <span className="shrink-0">{control}</span>
    </label>
  )
}

export function SwitchShowcase() {
  const [autoPayEnabled, setAutoPayEnabled] = React.useState(true)

  return (
    <div className="space-y-8">
      {/* ── States grid ── */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[140px_repeat(3,minmax(0,1fr))]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Default", "Disabled", "Sizes"].map((state) => (
            <div key={state} className="bg-muted/60 px-4 py-3">
              <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
                {state}
              </p>
            </div>
          ))}

          {/* Row label */}
          <div className="bg-background px-4 py-4 flex items-center">
            <p className="text-[length:var(--text-14)] font-medium text-foreground">
              Boolean
            </p>
          </div>

          {/* Default */}
          <div className="bg-background px-4 py-4">
            <div className="space-y-3">
              <SwitchRow
                label="Автооплата"
                control={<Switch aria-label="Автооплата" checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} />}
              />
              <SwitchRow
                icon={<ShieldCheck size={16} strokeWidth={2.4} />}
                label="Подтверждение кейса"
                control={<Switch aria-label="Подтверждение кейса" defaultChecked />}
                quiet
              />
            </div>
          </div>

          {/* Disabled */}
          <div className="bg-background px-4 py-4">
            <div className="space-y-3">
              <SwitchRow
                label="Уведомления"
                control={<Switch aria-label="Уведомления" checked disabled readOnly />}
              />
              <SwitchRow
                label="Синхронизация CRM"
                control={<Switch aria-label="Синхронизация CRM" disabled />}
                quiet
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-background px-4 py-4">
            <div className="space-y-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  SM / 28×16
                </p>
                <Switch aria-label="Компактный тумблер" size="sm" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  Default / 36×20
                </p>
                <Switch aria-label="Основной тумблер" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Segmented variants ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text switch */}
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-[length:var(--text-12)]">TEXT SWITCH</Badge>
              <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
                Tabs с двумя пунктами. Стилизация идентична default Tabs.
              </p>
            </div>
            <CopyButton value={SWITCH_IMPORT} label="Switch import" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Период оплаты</span>
              <Tabs defaultValue="yearly">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Режим просмотра</span>
              <Tabs defaultValue="source">
                <TabsList>
                  <TabsTrigger value="source">Source</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Icon switch */}
        <div className="rounded-lg border border-border p-6 space-y-4">
          <div>
            <Badge variant="outline" className="text-[length:var(--text-12)]">ICON SWITCH</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Tabs с двумя иконками. Для компактных toolbar-переключателей.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Тема</span>
              <Tabs defaultValue="light">
                <TabsList>
                  <TabsTrigger value="light"><Sun size={16} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="dark"><Moon size={16} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Вид каталога</span>
              <Tabs defaultValue="grid">
                <TabsList>
                  <TabsTrigger value="grid"><LayoutGrid size={16} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="list"><LayoutList size={16} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-rm-gray-2/30 p-4">
        <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
          Boolean: squircle-форма (rounded-sm, 4px), default 36×20, sm 28×16. Text / Icon: композиция из Tabs с двумя TabsTrigger, без нового компонента.
        </p>
      </div>
    </div>
  )
}
