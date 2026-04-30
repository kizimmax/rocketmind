"use client";

import { useCallback } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { FactoidCardData } from "@/lib/types";

const MAX_COLS = 3;

interface Props {
  cards: FactoidCardData[];
  onChange: (cards: FactoidCardData[]) => void;
  /**
   * Явное число колонок. Если не задано — авто из cards.length (max 3).
   * При сохранении пишется как `factoidCols` в section frontmatter.
   */
  cols?: 1 | 2 | 3;
  onColsChange?: (cols: 1 | 2 | 3 | undefined) => void;
  /**
   * Если задан, удаление последней карточки вызывает onRemoveAll вместо
   * автосоздания пустой. Используется в section-level редакторе, где
   * сетка может вообще отсутствовать.
   */
  onRemoveAll?: () => void;
}

function newCardId(): string {
  return `fc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function newCard(): FactoidCardData {
  return { id: newCardId(), number: "", text: "", accent: false };
}

/**
 * Редактор `factoid-grid` блока. Сетка карточек, плотно стыкованных:
 *  - max 3 колонки (третья — в зоне правой колонки на сайте);
 *  - кнопка «+ карточка» справа от последнего ряда (если в ряду <3) и снизу
 *    под сеткой (новый ряд);
 *  - per-card: стрелки ←→↑↓ для перестановки, accent-toggle, удаление,
 *    inline-инпуты для number / text.
 *
 * Hover-состояния и иконки — лоу-key, под общий стиль article-body-editor.
 */
export function ArticleBodyFactoidGridEditor({
  cards,
  onChange,
  cols: explicitCols,
  onColsChange,
  onRemoveAll,
}: Props) {
  // Если cols явно не задан — авто из числа карточек, max 3.
  const cols: 1 | 2 | 3 =
    explicitCols ?? (Math.min(MAX_COLS, Math.max(1, cards.length)) as 1 | 2 | 3);

  const updateCard = useCallback(
    (id: string, patch: Partial<FactoidCardData>) => {
      onChange(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [cards, onChange],
  );

  const removeCard = useCallback(
    (id: string) => {
      const next = cards.filter((c) => c.id !== id);
      if (next.length === 0 && onRemoveAll) {
        // Section-level: убираем сетку целиком.
        onRemoveAll();
        return;
      }
      // Иначе не оставляем пустую сетку — добавляем стартовую карточку.
      onChange(next.length > 0 ? next : [newCard()]);
    },
    [cards, onChange, onRemoveAll],
  );

  const moveBy = useCallback(
    (idx: number, delta: number) => {
      const to = idx + delta;
      if (to < 0 || to >= cards.length) return;
      const next = [...cards];
      const [item] = next.splice(idx, 1);
      next.splice(to, 0, item);
      onChange(next);
    },
    [cards, onChange],
  );

  // Учитываем newRow при расчёте позиции — последний newRow-флаг
  // «обнуляет» позицию в строке.
  function computeRowState() {
    let count = 0;
    for (let i = 0; i < cards.length; i++) {
      if (i === 0 || cards[i].newRow) {
        count = 1;
      } else if (count >= cols) {
        count = 1; // авто-перенос когда строка переполнена
      } else {
        count += 1;
      }
    }
    return count;
  }
  const lastRowCount = computeRowState();
  const lastRowFull = cards.length > 0 && lastRowCount >= cols;
  // «Карточка справа»: если в последнем ряду есть пустой слот — добавляем туда
  // (cols не меняем). Если ряд полон и cols<3 — расширяем cols на 1, новая
  // карточка ляжет в тот же ряд. При cols=3 и полном ряду — disabled.
  const canAddRight = !lastRowFull || cols < MAX_COLS;
  // «Карточка ниже»: всегда доступна (если есть хотя бы одна карточка).
  // Новой карточке проставляется `newRow: true` — она начинает новый ряд
  // через `grid-column-start: 1`, оставляя пустые ячейки текущего ряда.
  const canAddBelow = cards.length > 0;

  function addCardAt(idx: number, patch?: Partial<FactoidCardData>) {
    const next = [...cards];
    next.splice(idx + 1, 0, { ...newCard(), ...patch });
    onChange(next);
  }

  function handleAddRight() {
    if (lastRowFull && cols < MAX_COLS && onColsChange) {
      onColsChange((cols + 1) as 1 | 2 | 3);
    }
    addCardAt(cards.length - 1);
  }

  function handleAddBelow() {
    // Фиксируем текущее cols, чтобы соседи в новом ряду тоже встали в этот же
    // макет (например, 2x2 при cols=2 + 4 карточках).
    if (onColsChange) onColsChange(cols);
    addCardAt(cards.length - 1, { newRow: true });
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid gap-px rounded-sm bg-[color:var(--rm-gray-3)] outline outline-1 outline-[color:var(--rm-gray-3)]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card, idx) => {
          const accent = card.accent;
          // newRow → принудительно ставим карточку в первую колонку.
          // CSS grid оставит пустые ячейки в предыдущей строке.
          const breakStyle: React.CSSProperties | undefined =
            idx > 0 && card.newRow ? { gridColumnStart: 1 } : undefined;
          return (
            <div
              key={card.id}
              style={breakStyle}
              className={`group/card relative flex flex-col gap-3 p-4 ${
                accent ? "bg-[#FFCC00]" : "bg-background"
              }`}
            >
              <input
                type="text"
                value={card.number}
                onChange={(e) => updateCard(card.id, { number: e.target.value })}
                placeholder="10,1 млн"
                className={`w-full bg-transparent font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] text-[28px] leading-[1.08] outline-none placeholder:opacity-40 ${
                  accent ? "text-[#0A0A0A]" : "text-foreground"
                }`}
              />
              <textarea
                value={card.text}
                onChange={(e) => updateCard(card.id, { text: e.target.value })}
                placeholder="Описание фактоида"
                rows={2}
                className={`w-full resize-none bg-transparent text-[length:var(--text-14)] leading-[1.32] outline-none placeholder:opacity-40 ${
                  accent ? "text-[#0A0A0A]" : "text-muted-foreground"
                }`}
              />

              {/* Toolbar — появляется при hover на карточку. */}
              <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
                <button
                  type="button"
                  aria-label="Сместить влево"
                  title="Влево"
                  onClick={() => moveBy(idx, -1)}
                  disabled={idx === 0}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Сместить вправо"
                  title="Вправо"
                  onClick={() => moveBy(idx, 1)}
                  disabled={idx === cards.length - 1}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Сместить выше"
                  title="Выше (на ряд)"
                  onClick={() => moveBy(idx, -cols)}
                  disabled={idx - cols < 0}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Сместить ниже"
                  title="Ниже (на ряд)"
                  onClick={() => moveBy(idx, cols)}
                  disabled={idx + cols >= cards.length}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={
                    card.newRow
                      ? "Не начинать новый ряд"
                      : "Начать новый ряд с этой карточки"
                  }
                  title={
                    card.newRow
                      ? "Снять перенос на новую строку"
                      : "Начать новую строку с этой карточки"
                  }
                  onClick={() =>
                    updateCard(card.id, { newRow: !card.newRow })
                  }
                  disabled={idx === 0}
                  className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors disabled:opacity-30 disabled:hover:bg-transparent ${
                    card.newRow
                      ? accent
                        ? "bg-[#0A0A0A]/10 text-[#0A0A0A]"
                        : "bg-foreground/10 text-foreground"
                      : accent
                        ? "text-[#0A0A0A] hover:bg-[#0A0A0A]/10"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={accent ? "Снять акцент" : "Сделать акцентной"}
                  title="Жёлтый акцент"
                  onClick={() => updateCard(card.id, { accent: !accent })}
                  className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
                    accent
                      ? "text-[#0A0A0A] hover:bg-[#0A0A0A]/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Удалить карточку"
                  title="Удалить"
                  onClick={() => removeCard(card.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
                    accent
                      ? "text-[#0A0A0A] hover:bg-[#ED4843]/20 hover:text-[#ED4843]"
                      : "text-muted-foreground hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
                  }`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add buttons row */}
      <div className="flex items-center gap-2 text-[length:var(--text-12)]">
        <button
          type="button"
          onClick={handleAddRight}
          disabled={!canAddRight}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-background"
          title={
            canAddRight
              ? lastRowFull && cols < MAX_COLS
                ? `Добавить справа — расширит сетку до ${cols + 1} колонок`
                : "Добавить карточку в текущий ряд"
              : "В ряду уже максимум 3 карточки"
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Карточка справа
        </button>
        <button
          type="button"
          onClick={handleAddBelow}
          disabled={!canAddBelow}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-background"
          title={
            canAddBelow
              ? "Добавить карточку в новом ряду — пустые ячейки текущего ряда останутся пустыми"
              : "Сначала добавьте хотя бы одну карточку"
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Карточка ниже
        </button>
        <span className="text-muted-foreground">
          {cards.length} {plural(cards.length)} · {cols} в ряд
        </span>
      </div>
    </div>
  );
}

function plural(n: number): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "карточка";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "карточки";
  return "карточек";
}
