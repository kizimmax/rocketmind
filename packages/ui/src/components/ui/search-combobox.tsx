"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Clock3, Search, Sparkles, X } from "lucide-react"

import { cn } from "../../lib/utils"

export type SearchComboboxOption = {
  value: string
  label: string
  meta?: string
  hint?: string
}

type SearchComboboxSize = "xs" | "sm" | "md" | "lg"

type SearchComboboxProps = {
  ariaLabel?: string
  className?: string
  defaultValue?: string
  disabled?: boolean
  emptyMessage?: string
  error?: string
  onSelect?: (option: SearchComboboxOption) => void
  options: SearchComboboxOption[]
  placeholder?: string
  predefinedSuggestions?: SearchComboboxOption[]
  recentSearches?: SearchComboboxOption[]
  size?: SearchComboboxSize
}

const sizeStyles: Record<SearchComboboxSize, string> = {
  xs: "h-7 px-3 text-[length:var(--text-12)]",
  sm: "h-8 px-3 text-[length:var(--text-12)]",
  md: "h-10 px-4 text-[length:var(--text-14)]",
  lg: "h-12 px-6 text-[length:var(--text-16)]",
}

const iconSizes: Record<SearchComboboxSize, string> = {
  xs: "size-3.5",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
}

export function SearchCombobox({
  ariaLabel = "Поиск",
  className,
  defaultValue = "",
  disabled = false,
  emptyMessage = "Ничего не найдено. Попробуйте другой запрос.",
  error,
  onSelect,
  options,
  placeholder = "Найти агента, кейс или действие...",
  predefinedSuggestions = [],
  recentSearches = [],
  size = "md",
}: SearchComboboxProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(defaultValue)
  const [highlighted, setHighlighted] = useState(0)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const trimmedQuery = query.trim().toLowerCase()

  const filteredOptions = useMemo(() => {
    if (!trimmedQuery) return options

    return options.filter((option) => {
      const haystack = [option.label, option.meta, option.hint, option.value]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return haystack.includes(trimmedQuery)
    })
  }, [options, trimmedQuery])

  const suggestionGroups = useMemo(() => {
    if (trimmedQuery) return []

    const groups: Array<{
      id: string
      title: string
      icon: React.ReactNode
      items: SearchComboboxOption[]
      emptyText?: string
    }> = []

    if (recentSearches.length > 0) {
      groups.push({
        id: "recent",
        title: "История поиска",
        icon: <Clock3 className={`${iconSizes[size]} text-muted-foreground`} strokeWidth={2.2} />,
        items: recentSearches,
      })
    } else {
      groups.push({
        id: "recent-empty",
        title: "История поиска",
        icon: <Clock3 className={`${iconSizes[size]} text-muted-foreground`} strokeWidth={2.2} />,
        items: [],
        emptyText: "История пока пуста. Начните с одного из готовых сценариев ниже.",
      })
    }

    if (predefinedSuggestions.length > 0) {
      groups.push({
        id: "preset",
        title: recentSearches.length > 0 ? "Быстрые подсказки" : "Популярные сценарии",
        icon: <Sparkles className={`${iconSizes[size]} text-muted-foreground`} strokeWidth={2.2} />,
        items: predefinedSuggestions,
      })
    }

    return groups
  }, [predefinedSuggestions, recentSearches, size, trimmedQuery])

  const navigableOptions = trimmedQuery
    ? filteredOptions
    : suggestionGroups.flatMap((group) => group.items)
  const currentHighlighted = highlighted >= navigableOptions.length ? 0 : highlighted

  const handleSelect = (option: SearchComboboxOption) => {
    setQuery(option.label)
    setOpen(false)
    onSelect?.(option)
  }

  return (
    <div className={cn("w-full", className)}>
      <div ref={rootRef} className="relative">
        <div
          className={cn(
            "w-full rounded-sm border bg-rm-gray-1 text-foreground transition-all duration-150",
            error ? "border-destructive" : "border-border",
            disabled ? "opacity-40 cursor-not-allowed" : "focus-within:border-ring",
            open && !disabled && !error && "border-ring",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              sizeStyles[size],
              size === "lg" ? "gap-3" : "gap-2",
            )}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls="rm-search-combobox-list"
          >
            <Search className={`${iconSizes[size]} shrink-0 text-muted-foreground`} strokeWidth={2.2} />
            <input
              aria-label={ariaLabel}
              className="min-w-0 flex-1 bg-transparent text-inherit placeholder:text-muted-foreground focus:outline-none"
              disabled={disabled}
              onChange={(event) => {
                setQuery(event.target.value)
                setOpen(true)
                setHighlighted(0)
              }}
              onFocus={() => {
                if (!disabled) {
                  setOpen(true)
                  setHighlighted(0)
                }
              }}
              onKeyDown={(event) => {
                if (!navigableOptions.length) {
                  if (event.key === "Escape") setOpen(false)
                  return
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault()
                  setOpen(true)
                  setHighlighted((current) => (current + 1) % navigableOptions.length)
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault()
                  setOpen(true)
                  setHighlighted((current) => (current - 1 + navigableOptions.length) % navigableOptions.length)
                }

                if (event.key === "Enter" && open) {
                  event.preventDefault()
                  handleSelect(navigableOptions[currentHighlighted] ?? navigableOptions[0])
                }

                if (event.key === "Escape") {
                  setOpen(false)
                }
              }}
              placeholder={placeholder}
              spellCheck={false}
              type="text"
              value={query}
            />
            {query ? (
              <button
                aria-label="Очистить запрос"
                className="inline-flex items-center justify-center text-muted-foreground transition-all duration-150 hover:text-foreground disabled:pointer-events-none"
                disabled={disabled}
                onClick={() => {
                  setQuery("")
                  setOpen(true)
                  setHighlighted(0)
                }}
                type="button"
              >
                <X className={iconSizes[size]} strokeWidth={2.2} />
              </button>
            ) : (
              <button
                aria-label="Открыть список"
                className="inline-flex items-center justify-center text-muted-foreground transition-all duration-150 hover:text-foreground disabled:pointer-events-none"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    setOpen((current) => !current)
                    setHighlighted(0)
                  }
                }}
                type="button"
              >
                <ChevronDown className={iconSizes[size]} strokeWidth={2.2} />
              </button>
            )}
          </div>
        </div>

        {open && !disabled && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-lg border border-border bg-popover">
            <div className="max-h-[320px] overflow-auto p-1.5">
              {!trimmedQuery && suggestionGroups.length > 0 ? (
                <div className="space-y-1.5">
                  {suggestionGroups.map((group) => (
                    <div key={group.id} className="rounded-md">
                      <div className="flex items-center gap-2 px-2.5 py-2">
                        {group.icon}
                        <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                          {group.title}
                        </p>
                      </div>

                      {group.items.length > 0 ? (
                        <ul className="space-y-1" role="listbox">
                          {group.items.map((option, index) => {
                            const optionIndex = suggestionGroups
                              .slice(0, suggestionGroups.findIndex((entry) => entry.id === group.id))
                              .flatMap((entry) => entry.items).length + index

                            return (
                              <li key={`${group.id}-${option.value}`}>
                                <button
                                  className={cn(
                                    "flex w-full items-start justify-between gap-3 rounded-md border border-transparent px-2.5 py-2 text-left transition-all duration-150 hover:bg-rm-gray-1 hover:border-border",
                                    currentHighlighted === optionIndex && "bg-rm-gray-1 border-border",
                                  )}
                                  onClick={() => handleSelect(option)}
                                  onMouseEnter={() => setHighlighted(optionIndex)}
                                  type="button"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-[length:var(--text-14)] text-popover-foreground">{option.label}</p>
                                    {option.meta ? (
                                      <p className="mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground">{option.meta}</p>
                                    ) : null}
                                  </div>
                                  {option.hint ? (
                                    <span className="shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                                      {option.hint}
                                    </span>
                                  ) : null}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      ) : (
                        <div className="px-2.5 pb-3 pt-1">
                          <p className="text-[length:var(--text-12)] leading-relaxed text-muted-foreground">{group.emptyText}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : filteredOptions.length > 0 ? (
                <ul className="space-y-1" id="rm-search-combobox-list" role="listbox">
                  {filteredOptions.map((option, index) => (
                    <li key={option.value}>
                      <button
                        className={cn(
                          "flex w-full items-start justify-between gap-3 rounded-md border border-transparent px-2.5 py-2 text-left transition-all duration-150 hover:bg-rm-gray-1 hover:border-border",
                          currentHighlighted === index && "bg-rm-gray-1 border-border",
                        )}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setHighlighted(index)}
                        type="button"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[length:var(--text-14)] text-popover-foreground">{option.label}</p>
                          {option.meta ? (
                            <p className="mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground">{option.meta}</p>
                          ) : null}
                        </div>
                        {option.hint ? (
                          <span className="shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                            {option.hint}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-4">
                  <p className="text-[length:var(--text-13)] text-muted-foreground">{emptyMessage}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-[length:var(--text-12)] text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
