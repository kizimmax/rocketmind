/**
 * Утилиты автоматической подсветки терминов глоссария в plain-string абзацах.
 *
 * Использование: `applyGlossaryLinks(text, index, excludeSlug, used, makeNode)` —
 * передаём один и тот же `used: Set<string>` на абзац, чтобы каждый slug
 * подсвечивался только в первом своём вхождении в этом абзаце.
 */

import type { ReactNode } from "react"

export type GlossaryIndexEntry = {
  slug: string
  title: string
  description: string
  aliases: string[]
}

export type GlossaryIndex = GlossaryIndexEntry[]

type Phrase = { phrase: string; slug: string; entry: GlossaryIndexEntry }

/**
 * Собирает один регексп из всех phrase'ов всех терминов с word-boundary,
 * учитывающим Unicode-буквы (русский, латиница). Длинные фразы идут раньше
 * коротких — `replaceAll` за один проход найдёт «продакт-менеджер» вместо
 * того, чтобы матчить «менеджер» внутри.
 *
 * Возвращает `null`, если в индексе нет ни одной phrase'ы (после excludeSlug).
 */
export function buildGlossaryRegex(
  index: GlossaryIndex,
  excludeSlug?: string,
): { re: RegExp; lookup: Map<string, GlossaryIndexEntry> } | null {
  const phrases: Phrase[] = []
  const lookup = new Map<string, GlossaryIndexEntry>()
  for (const entry of index) {
    if (excludeSlug && entry.slug === excludeSlug) continue
    const terms = [entry.title, ...entry.aliases]
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    for (const phrase of terms) {
      phrases.push({ phrase, slug: entry.slug, entry })
      lookup.set(phrase.toLocaleLowerCase("ru-RU"), entry)
    }
  }
  if (phrases.length === 0) return null

  // Сортировка по длине desc — длинные фразы выигрывают у вложенных коротких.
  phrases.sort((a, b) => b.phrase.length - a.phrase.length)

  // Word-boundary через lookbehind/lookahead на любые буквы/цифры/подчёркивания.
  // Поддерживает кириллицу через флаг `u` и `\p{L}`.
  const escaped = phrases.map((p) => escapeRegex(p.phrase)).join("|")
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}_])(${escaped})(?![\\p{L}\\p{N}_])`,
    "giu",
  )
  return { re, lookup }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Прогон одного plain-string сегмента через глоссарный регексп.
 * Заменяет совпадения на узлы из `makeNode(entry, matchedText)`.
 *
 * `used: Set<string>` — общий на абзац: если slug уже использовался в этом
 * абзаце, дальнейшие вхождения остаются plain-text. Это правило «первое
 * вхождение в абзаце».
 *
 * Передавай готовый `compiled` (`buildGlossaryRegex`) — мы не пересобираем
 * regex для каждого вызова.
 */
export function applyGlossaryLinks(
  text: string,
  compiled: { re: RegExp; lookup: Map<string, GlossaryIndexEntry> },
  used: Set<string>,
  makeNode: (entry: GlossaryIndexEntry, matched: string, key: string) => ReactNode,
  keyPrefix: string,
): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  // Создаём свежий RegExp на каждый вызов — RegExp с флагом `g` хранит lastIndex,
  // который ломает повторное использование.
  const re = new RegExp(compiled.re.source, compiled.re.flags)
  while ((match = re.exec(text)) !== null) {
    const matched = match[1]
    const entry = compiled.lookup.get(matched.toLocaleLowerCase("ru-RU"))
    if (!entry || used.has(entry.slug)) {
      // Пропуск: либо неизвестная phrase (теоретически невозможно), либо
      // термин уже линковался в этом абзаце. Двигаем lastIndex дальше — иначе
      // exec застрянет в бесконечном цикле на zero-length matches не будет,
      // но при skip нам нужно идти вперёд за этой phrase'ой.
      continue
    }
    used.add(entry.slug)
    if (match.index > last) {
      nodes.push(text.slice(last, match.index))
    }
    nodes.push(makeNode(entry, matched, `${keyPrefix}-${match.index}`))
    last = match.index + matched.length
  }
  if (last < text.length) {
    nodes.push(text.slice(last))
  }
  return nodes
}
