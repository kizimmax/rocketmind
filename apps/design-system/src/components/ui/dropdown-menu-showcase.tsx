"use client"

import * as React from "react"
import { User, Settings, LogOut, Copy, Archive, Trash2, ChevronDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@rocketmind/ui"
import { CopyButton } from "@/components/copy-button"
import { SpecBlock } from "@/components/ds/shared"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@rocketmind/ui"

export function DropdownMenuShowcase() {
  const mono = "font-[family-name:var(--font-mono-family)]"

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border flex items-center justify-between">
          <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Примеры</p>
          <CopyButton value={`import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup } from "@rocketmind/ui"`} label="DropdownMenu import" />
        </div>

        <div className="p-6 grid gap-6 sm:grid-cols-3">
          {/* Basic */}
          <div className="flex flex-col items-start gap-2">
            <Badge variant="outline" className="text-[length:var(--text-12)]">BASIC</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}>
                  Действия <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem><Copy size={14} /> Копировать ссылку</DropdownMenuItem>
                <DropdownMenuItem><Archive size={14} /> Архивировать</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive><Trash2 size={14} /> Удалить</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* With labels */}
          <div className="flex flex-col items-start gap-2">
            <Badge variant="outline" className="text-[length:var(--text-12)]">WITH GROUPS</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground ${mono} text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-gray-2)] cursor-pointer`}>
                  <User size={14} /> Профиль <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem><User size={14} /> Профиль</DropdownMenuItem>
                  <DropdownMenuItem><Settings size={14} /> Настройки</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive><LogOut size={14} /> Выйти</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Icon trigger */}
          <div className="flex flex-col items-start gap-2">
            <Badge variant="outline" className="text-[length:var(--text-12)]">ICON TRIGGER</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-sm border border-border bg-[var(--rm-gray-1)] text-muted-foreground transition-all duration-150 hover:bg-[var(--rm-gray-2)] hover:text-foreground cursor-pointer">
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Copy size={14} /> Дублировать</DropdownMenuItem>
                <DropdownMenuItem><Archive size={14} /> В архив</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive><Trash2 size={14} /> Удалить навсегда</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <SpecBlock title="Правила">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "DropdownMenu — контекстное меню для действий, которые не помещаются в одну строку. Trigger — кнопка Ghost или Icon-only.",
            "Контейнер: bg-popover, border-border, rounded-sm, min-width 160px. Элементы — высота 32px (h-8), padding px-2.",
            "Hover-фон элемента — rm-gray-2. Destructive-элемент — текст rm-red-100, hover-фон rm-red-900.",
            "Label — mono, uppercase, text-12, text-muted-foreground. Separator — h-px bg-border. Используй группы для логического разделения.",
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
