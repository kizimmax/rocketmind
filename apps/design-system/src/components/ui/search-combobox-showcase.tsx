"use client"

import React, { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { SpecBlock } from "@/components/ds/shared"
import { SearchCombobox, type SearchComboboxOption } from "@rocketmind/ui"

const SEARCH_OPTIONS: SearchComboboxOption[] = [
  { value: "agent-marketing", label: "Маркетолог", meta: "Агент: стратегия, офферы, упаковка", hint: "agent" },
  { value: "agent-sales", label: "Продажник", meta: "Агент: скрипты, обработка возражений", hint: "agent" },
  { value: "agent-legal", label: "Юрист", meta: "Агент: договоры и риски сделки", hint: "agent" },
  { value: "case-diagnostics", label: "Диагностика кейса", meta: "Кейс: собрать вводные и сузить проблему", hint: "case" },
  { value: "case-payment-link", label: "Ссылка на оплату", meta: "Системное действие: отправить CTA в чат", hint: "flow" },
  { value: "case-agent-launch", label: "Запуск по slug", meta: "Системное действие: автозапуск по URL", hint: "flow" },
]

const PRESET_SUGGESTIONS: SearchComboboxOption[] = [
  { value: "preset-brief", label: "Собрать бриф по клиенту", meta: "Популярный стартовый сценарий", hint: "preset" },
  { value: "preset-sales-audit", label: "Проверить воронку продаж", meta: "Запрос из шаблонов команды", hint: "preset" },
  { value: "preset-payment", label: "Подготовить оплату после диалога", meta: "Частый системный сценарий", hint: "preset" },
]

const RECENT_SEARCHES: SearchComboboxOption[] = [
  { value: "recent-yurist", label: "Юрист", meta: "Последний запуск 15 минут назад", hint: "recent" },
  { value: "recent-cases", label: "Диагностика кейса", meta: "Использовано сегодня 3 раза", hint: "recent" },
]

const sizeLabels = [
  { size: "xs" as const, label: "XS / 28px" },
  { size: "sm" as const, label: "SM / 32px" },
  { size: "md" as const, label: "MD / 40px" },
  { size: "lg" as const, label: "LG / 48px" },
]

export function SearchComboboxShowcase() {
  const [selection, setSelection] = useState<SearchComboboxOption | null>(SEARCH_OPTIONS[0])
  const [modalOpen, setModalOpen] = useState(false)

  const modalSubtitle = useMemo(() => {
    if (!selection) return "Выберите агент, кейс или системное действие"
    return `Последний выбор: ${selection.label}`
  }, [selection])

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Search / Combobox
            </p>
            <h4 className="mt-1 font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] uppercase tracking-[-0.01em]">
              Полноценный поиск по агентам, кейсам и системным действиям
            </h4>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-sm border border-border bg-rm-gray-1 px-2 py-1 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Новый паттерн
            </span>
            <CopyButton value={`import { SearchCombobox } from "@rocketmind/ui"`} label="SearchCombobox import" />
          </div>
        </div>

        <p className="max-w-3xl text-[length:var(--text-14)] leading-relaxed text-muted-foreground">
          Поиск по агентам, кейсам и системным действиям: inline, история, preset-подсказки и запуск в модальном окне.
        </p>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h4 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase tracking-[0.02em]">
          1. Размеры
        </h4>
        <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
          Четыре размера совпадают по высоте с кнопками и базовыми input, поэтому toolbar и поисковые сценарии собираются без ручной подгонки.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sizeLabels.map(({ size, label }) => (
            <div key={size} className="rounded-lg border border-border p-4">
              <p className="mb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                {label}
              </p>
              <SearchCombobox
                options={SEARCH_OPTIONS}
                predefinedSuggestions={PRESET_SUGGESTIONS}
                recentSearches={RECENT_SEARCHES}
                size={size}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h4 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase tracking-[0.02em]">
          2. Состояния
        </h4>
        <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
          Базовые состояния компонента и типовые тексты ошибок.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Default
            </p>
            <SearchCombobox
              onSelect={setSelection}
              options={SEARCH_OPTIONS}
              predefinedSuggestions={PRESET_SUGGESTIONS}
              recentSearches={RECENT_SEARCHES}
            />
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Disabled
            </p>
            <SearchCombobox
              disabled
              options={SEARCH_OPTIONS}
              placeholder="Поиск недоступен, пока кейс архивируется"
              predefinedSuggestions={PRESET_SUGGESTIONS}
              recentSearches={RECENT_SEARCHES}
            />
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Error
            </p>
            <SearchCombobox
              defaultValue="rocketmind-unknown"
              error="Агент с таким slug не найден. Проверьте название или откройте каталог."
              options={SEARCH_OPTIONS}
              placeholder="Найти агента по slug..."
              predefinedSuggestions={PRESET_SUGGESTIONS}
              recentSearches={RECENT_SEARCHES}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h4 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase tracking-[0.02em]">
          3. Подсказки и история
        </h4>
        <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
          При пустом запросе компонент показывает историю поиска и готовые сценарии. Если истории нет, блок не исчезает, а объясняет следующий шаг и уступает приоритет preset-подсказкам.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              История + preset-подсказки
            </p>
            <SearchCombobox
              options={SEARCH_OPTIONS}
              predefinedSuggestions={PRESET_SUGGESTIONS}
              recentSearches={RECENT_SEARCHES}
            />
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Истории нет
            </p>
            <SearchCombobox
              emptyMessage="Ничего не найдено. Попробуйте название агента, услугу или системное действие."
              options={SEARCH_OPTIONS}
              predefinedSuggestions={PRESET_SUGGESTIONS}
              recentSearches={[]}
            />
          </div>
        </div>

        <SpecBlock title="Правило empty-state">
          <p className="text-[length:var(--text-14)] leading-relaxed text-muted-foreground">
            Когда запрос уже введён, список показывает только результаты совпадения или одно текстовое сообщение без декоративных иллюстраций. Когда запрос пустой, вместо пустоты показываем полезный старт: история, популярные сценарии или оба блока сразу.
          </p>
        </SpecBlock>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h4 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase tracking-[0.02em]">
          4. Поиск в модальном окне
        </h4>
        <p className="mt-1 max-w-3xl text-[length:var(--text-14)] leading-relaxed text-muted-foreground">
          Основной паттерн глобального поиска: на desktop центрированное modal-окно, на mobile bottom sheet.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#FFCC00] px-4 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-[#121212] transition-all duration-150 hover:bg-[#FFE040] focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            <Search className="size-4" strokeWidth={2.4} />
            Открыть поиск
          </button>

          <p className="text-[length:var(--text-12)] text-muted-foreground">
            Подходит для `Cmd/Ctrl + K`, каталога агентов и быстрого перехода по кейсам.
          </p>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[var(--rm-gray-alpha-600)] md:items-center md:justify-center">
          <div
            className="absolute inset-0"
            onClick={() => setModalOpen(false)}
            role="button"
            tabIndex={-1}
          />

          <div className="relative z-10 w-full rounded-t-lg border border-border bg-card p-4 md:max-w-3xl md:rounded-lg md:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                  Глобальный поиск
                </p>
                <h4 className="mt-1 font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] uppercase tracking-[-0.01em]">
                  Найти агент, кейс или системное действие
                </h4>
                <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">{modalSubtitle}</p>
              </div>

              <button
                className="inline-flex h-10 items-center justify-center rounded-sm border border-border bg-rm-gray-1 px-4 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground transition-all duration-150 hover:bg-rm-gray-2 focus:outline-none focus:ring-1 focus:ring-ring"
                onClick={() => setModalOpen(false)}
                type="button"
              >
                Закрыть
              </button>
            </div>

            <div className="rounded-lg border border-border bg-background p-3 md:p-4">
              <SearchCombobox
                className="mx-auto"
                onSelect={(option) => {
                  setSelection(option)
                  setModalOpen(false)
                }}
                options={SEARCH_OPTIONS}
                predefinedSuggestions={PRESET_SUGGESTIONS}
                recentSearches={RECENT_SEARCHES}
                size="lg"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
