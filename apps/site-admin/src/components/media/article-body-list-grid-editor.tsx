"use client";

import { useCallback } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  Plus,
  Trash2,
} from "lucide-react";
import type { ListCardData, ListItemData } from "@/lib/types";

const MAX_COLS = 3;

function newItemId(): string {
  return `li_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function newCardId(): string {
  return `lc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function newItem(): ListItemData {
  return { id: newItemId(), text: "" };
}

function newCard(): ListCardData {
  return { id: newCardId(), title: "", items: [newItem()] };
}

interface Props {
  cards: ListCardData[];
  listType: "bullet" | "numbered";
  cols?: 1 | 2 | 3;
  onChange: (cards: ListCardData[]) => void;
  onTypeChange: (type: "bullet" | "numbered") => void;
  onColsChange?: (cols: 1 | 2 | 3 | undefined) => void;
  onRemoveAll: () => void;
}

export function ArticleBodyListGridEditor({
  cards,
  listType,
  cols: explicitCols,
  onChange,
  onTypeChange,
  onColsChange,
  onRemoveAll,
}: Props) {
  const cols: 1 | 2 | 3 =
    explicitCols ?? (Math.min(MAX_COLS, Math.max(1, cards.length)) as 1 | 2 | 3);

  const updateCard = useCallback(
    (id: string, patch: Partial<ListCardData>) => {
      onChange(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [cards, onChange],
  );

  const removeCard = useCallback(
    (id: string) => {
      const next = cards.filter((c) => c.id !== id);
      if (next.length === 0) {
        onRemoveAll();
        return;
      }
      onChange(next);
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

  function computeLastRowCount() {
    let count = 0;
    for (let i = 0; i < cards.length; i++) {
      if (i === 0 || cards[i].newRow) {
        count = 1;
      } else if (count >= cols) {
        count = 1;
      } else {
        count += 1;
      }
    }
    return count;
  }
  const lastRowCount = computeLastRowCount();
  const lastRowFull = cards.length > 0 && lastRowCount >= cols;
  const canAddRight = !lastRowFull || cols < MAX_COLS;
  const canAddBelow = cards.length > 0;

  function addCardAt(idx: number, patch?: Partial<ListCardData>) {
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
    if (onColsChange) onColsChange(cols);
    addCardAt(cards.length - 1, { newRow: true });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header: label + type toggle + remove */}
      <div className="flex items-center gap-2">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground">
          Сетка списков
        </span>
        <div className="flex items-center overflow-hidden rounded-sm border border-border">
          <button
            type="button"
            onClick={() => onTypeChange("bullet")}
            className={`px-2 py-1 text-[length:var(--text-11)] transition-colors ${
              listType === "bullet"
                ? "bg-foreground text-background"
                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Буллиты
          </button>
          <button
            type="button"
            onClick={() => onTypeChange("numbered")}
            className={`px-2 py-1 text-[length:var(--text-11)] transition-colors ${
              listType === "numbered"
                ? "bg-foreground text-background"
                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Числа
          </button>
        </div>
        <button
          type="button"
          onClick={onRemoveAll}
          className="ml-auto flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-[length:var(--text-12)] text-muted-foreground transition-colors hover:border-[#ED4843]/40 hover:text-[#ED4843]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Убрать сетку
        </button>
      </div>

      {/* Cards grid */}
      <div
        className="grid gap-px rounded-sm bg-[color:var(--rm-gray-3)] outline outline-1 outline-[color:var(--rm-gray-3)]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card, idx) => (
          <ListCardEditorCell
            key={card.id}
            card={card}
            idx={idx}
            total={cards.length}
            cols={cols}
            listType={listType}
            onChange={(patch) => updateCard(card.id, patch)}
            onRemove={() => removeCard(card.id)}
            onMoveLeft={() => moveBy(idx, -1)}
            onMoveRight={() => moveBy(idx, 1)}
            onMoveUp={() => moveBy(idx, -cols)}
            onMoveDown={() => moveBy(idx, cols)}
          />
        ))}
      </div>

      {/* Footer: add buttons + info */}
      <div className="flex items-center gap-2 text-[length:var(--text-12)]">
        <button
          type="button"
          onClick={handleAddRight}
          disabled={!canAddRight}
          title={
            canAddRight
              ? lastRowFull && cols < MAX_COLS
                ? `Добавить справа — расширит до ${cols + 1} колонок`
                : "Добавить карточку в текущий ряд"
              : "В ряду уже максимум 3 карточки"
          }
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-background"
        >
          <Plus className="h-3.5 w-3.5" />
          Карточка справа
        </button>
        <button
          type="button"
          onClick={handleAddBelow}
          disabled={!canAddBelow}
          title={
            canAddBelow
              ? "Добавить карточку в новом ряду"
              : "Сначала добавьте хотя бы одну карточку"
          }
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-background"
        >
          <Plus className="h-3.5 w-3.5" />
          Карточка ниже
        </button>
        <span className="text-muted-foreground">
          {cards.length} {cardsPlural(cards.length)} · {cols} в ряд
        </span>
      </div>
    </div>
  );
}

function ListCardEditorCell({
  card,
  idx,
  total,
  cols,
  listType,
  onChange,
  onRemove,
  onMoveLeft,
  onMoveRight,
  onMoveUp,
  onMoveDown,
}: {
  card: ListCardData;
  idx: number;
  total: number;
  cols: number;
  listType: "bullet" | "numbered";
  onChange: (patch: Partial<ListCardData>) => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  function updateItem(id: string, text: string) {
    onChange({
      items: card.items.map((it) => (it.id === id ? { ...it, text } : it)),
    });
  }

  function removeItem(id: string) {
    const next = card.items.filter((it) => it.id !== id);
    onChange({ items: next.length > 0 ? next : [newItem()] });
  }

  function moveItem(itemIdx: number, delta: -1 | 1) {
    const to = itemIdx + delta;
    if (to < 0 || to >= card.items.length) return;
    const next = [...card.items];
    const [item] = next.splice(itemIdx, 1);
    next.splice(to, 0, item);
    onChange({ items: next });
  }

  function addItem() {
    onChange({ items: [...card.items, newItem()] });
  }

  // newRow → принудительно в первую колонку
  const breakStyle: React.CSSProperties | undefined =
    idx > 0 && card.newRow ? { gridColumnStart: 1 } : undefined;

  return (
    <div
      style={breakStyle}
      className="group/card relative flex flex-col gap-3 bg-background p-4"
    >
      {/* Card toolbar — hover */}
      <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
        <button
          type="button"
          aria-label="Сместить влево"
          title="Влево"
          onClick={onMoveLeft}
          disabled={idx === 0}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Сместить вправо"
          title="Вправо"
          onClick={onMoveRight}
          disabled={idx === total - 1}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Сместить выше"
          title="Выше (на ряд)"
          onClick={onMoveUp}
          disabled={idx - cols < 0}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Сместить ниже"
          title="Ниже (на ряд)"
          onClick={onMoveDown}
          disabled={idx + cols >= total}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={card.newRow ? "Снять перенос строки" : "Начать новый ряд"}
          title={card.newRow ? "Снять перенос строки" : "Начать новую строку"}
          onClick={() => onChange({ newRow: !card.newRow })}
          disabled={idx === 0}
          className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors disabled:opacity-30 disabled:hover:bg-transparent ${
            card.newRow
              ? "bg-foreground/10 text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Удалить карточку"
          title="Удалить"
          onClick={onRemove}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        value={card.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Заголовок"
        className="w-full bg-transparent font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] text-[length:var(--text-18)] leading-[1.12] text-foreground outline-none placeholder:opacity-40"
      />

      {/* Items */}
      <div className="flex flex-col gap-1.5">
        {card.items.map((item, itemIdx) => (
          <div key={item.id} className="group/item flex items-start gap-2">
            <span className="mt-0.5 w-4 shrink-0 select-none text-right font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
              {listType === "numbered" ? `${itemIdx + 1}.` : "•"}
            </span>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(item.id, e.target.value)}
              placeholder="Строка"
              className="min-w-0 flex-1 bg-transparent text-[length:var(--text-13)] leading-[1.32] text-muted-foreground outline-none placeholder:opacity-40"
            />
            <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover/item:opacity-100">
              <button
                type="button"
                onClick={() => moveItem(itemIdx, -1)}
                disabled={itemIdx === 0}
                aria-label="Строку вверх"
                className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(itemIdx, 1)}
                disabled={itemIdx === card.items.length - 1}
                aria-label="Строку вниз"
                className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Удалить строку"
                className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-[#ED4843]"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add item */}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1 text-[length:var(--text-11)] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="h-3 w-3" />
        строку
      </button>
    </div>
  );
}

function cardsPlural(n: number): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "карточка";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "карточки";
  return "карточек";
}
