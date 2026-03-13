"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Week = {
  id: string;
  label: string;
  dates: string;
  theme: string;
  color: string;
};

const DAYS = ['пн', 'вт', 'ср', 'чт', 'пт'] as const;
type Day = typeof DAYS[number];

type Card = {
  id: string;
  label: string;
  done: boolean;
  days: Day[];
};

type Row = {
  id: string;
  label: string;
  cells: Record<string, Card[]>; // weekId → список карточек
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_WEEKS: Week[] = [
  { id: 'w1', label: 'Неделя 1', dates: '9–15 мар', theme: 'Поиск направления + технический фундамент + DS v1', color: '#A172F8' },
  { id: 'w2', label: 'Неделя 2', dates: '16–22 мар', theme: 'Стабилизация сборки + DS v2 + старт MVP сервиса', color: '#56CAEA' },
  { id: 'w3', label: 'Неделя 3', dates: '23–29 мар', theme: 'Интеграция MVP с n8n + агенты + DS v3', color: '#FE733A' },
  { id: 'w4', label: 'Неделя 4', dates: '30 мар – 5 апр', theme: 'Полировка + DS v4 + QA MVP сервиса', color: '#FFCC00' },
];

function card(label: string, done = false): Card {
  return { id: `c${Math.random().toString(36).slice(2)}`, label, done, days: [] };
}

const INITIAL_ROWS: Row[] = [
  {
    id: 'r1', label: 'Согласование',
    cells: {
      w1: [card('Технические решения (стек, хостинг, n8n, PRD)')],
      w2: [], w3: [], w4: [],
    },
  },
  {
    id: 'r2', label: 'UI-направление',
    cells: {
      w1: [card('Референсы (3–7 шт.) + правила стиля')],
      w2: [], w3: [], w4: [],
    },
  },
  {
    id: 'r3', label: 'Вайпкодинг',
    cells: {
      w1: [card('Экспериментальные тесты инструмента')],
      w2: [], w3: [], w4: [],
    },
  },
  {
    id: 'r4', label: 'Design System',
    cells: {
      w1: [card('DS v1: токены + базовые компоненты + секции лендингов')],
      w2: [card('DS v2: Sync Figma ↔ код + компоненты + состояния + формы')],
      w3: [card('DS v3: компоненты сервиса — чат, состояния, списки, карточки')],
      w4: [card('DS v4: финальная фиксация — компоненты, токены, секции, правила')],
    },
  },
  {
    id: 'r5', label: 'MVP сервиса',
    cells: {
      w1: [card('Черновой wireframe: навигация / кейсы / агенты / чат')],
      w2: [card('Каркас: layout, навигация, черновой чат, карточки агентов')],
      w3: [card('Базовый сценарий с агентами работает')],
      w4: [card('End-to-end демо с агентами и оплатой')],
    },
  },
  {
    id: 'r6', label: 'Продуктовые страницы',
    cells: {
      w1: [card('1–2 демо-страницы (показательное направление)')],
      w2: [card('3–5 страниц в production-качестве')],
      w3: [card('+2–4 новые страницы (итого 5–9)')],
      w4: [card('8–15 страниц сайта в production')],
    },
  },
  {
    id: 'r7', label: 'n8n интеграция',
    cells: {
      w1: [], w2: [],
      w3: [
        card('Auth / сессия / кейсы / агенты'),
        card('Отправка / получение сообщений + сценарии оплаты'),
      ],
      w4: [],
    },
  },
  {
    id: 'r8', label: 'Продуктовые состояния',
    cells: {
      w1: [], w2: [],
      w3: [card('Загрузки / ошибки / empty states / алерты')],
      w4: [card('Полировка состояний, закрытие дырок по UX')],
    },
  },
  {
    id: 'r9', label: 'QA аналитики',
    cells: {
      w1: [], w2: [], w3: [],
      w4: [card('Проверка событий / связности на ключевых шагах')],
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function textColor(hex: string) {
  return hex;
}

// ─── EditableText ─────────────────────────────────────────────────────────────

function EditableText({
  value, onChange, className, style,
}: {
  value: string; onChange: (v: string) => void;
  className?: string; style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const start = useCallback(() => {
    setEditing(true);
    requestAnimationFrame(() => { ref.current?.focus(); ref.current?.select(); });
  }, []);

  if (editing) {
    return (
      <textarea
        ref={ref}
        defaultValue={value}
        className={`bg-transparent resize-none outline-none w-full ${className ?? ''}`}
        style={{ ...style, minHeight: 32 }}
        rows={2}
        onBlur={e => { onChange(e.target.value); setEditing(false); }}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); (e.target as HTMLTextAreaElement).blur(); }
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <span
      className={`cursor-text hover:bg-black/5 rounded px-0.5 -mx-0.5 transition-colors ${className ?? ''}`}
      style={style}
      onDoubleClick={start}
      title="Двойной клик — редактировать"
    >
      {value}
    </span>
  );
}

// ─── CardItem ─────────────────────────────────────────────────────────────────
// label хранится как многострочный текст; каждая строка — отдельный буллит

function CardItem({
  card: c, weekColor, locked,
  onToggleDone, onUpdateLabel, onRemove,
  draggable: isDraggable,
  onDragStart, onDragEnd, onDragOver, onDrop,
  onToggleDay,
}: {
  card: Card; weekColor: string; locked: boolean;
  onToggleDone: () => void;
  onUpdateLabel: (v: string) => void;
  onRemove: () => void;
  draggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onToggleDay: (day: Day) => void;
}) {
  const tc = textColor(weekColor);
  const [editing, setEditing] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const lines = c.label.split('\n').filter(l => l.trim() !== '');

  const startEdit = useCallback(() => {
    setEditing(true);
    requestAnimationFrame(() => {
      if (!taRef.current) return;
      taRef.current.focus();
      const len = taRef.current.value.length;
      taRef.current.setSelectionRange(len, len);
      // auto-height
      taRef.current.style.height = 'auto';
      taRef.current.style.height = taRef.current.scrollHeight + 'px';
    });
  }, []);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  return (
    <div
      draggable={isDraggable && !editing}
      onDragStart={editing ? undefined : onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="rounded-md px-2.5 pt-1.5 pb-2 group/card relative"
      style={{
        backgroundColor: weekColor + '1A',
        border: `1px solid ${weekColor}40`,
        cursor: editing ? 'default' : 'grab',
      }}
    >
      {/* Top row: checkbox + days + remove */}
      <div className="flex items-center gap-1.5 mb-1">
        {/* Checkbox */}
        <button
          onClick={onToggleDone}
          className="flex-shrink-0 w-3.5 h-3.5 rounded-sm border transition-colors"
          style={{
            borderColor: c.done ? weekColor : weekColor + '80',
            backgroundColor: c.done ? weekColor : 'white',
          }}
          title={c.done ? 'Готово' : 'Отметить как готово'}
        >
          {c.done && (
            <svg viewBox="0 0 10 10" className="w-full h-full" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Days */}
        <div className="flex items-center gap-0.5">
          {DAYS.map(day => {
            const active = c.days.includes(day);
            return (
              <button
                key={day}
                onClick={() => onToggleDay(day)}
                className="font-mono transition-colors leading-none"
                style={{
                  fontSize: 9,
                  width: 18,
                  height: 16,
                  borderRadius: 3,
                  backgroundColor: active ? weekColor : weekColor + '18',
                  color: active ? '#fff' : textColor(weekColor),
                  opacity: active ? 1 : 0.5,
                  border: `1px solid ${active ? weekColor : weekColor + '40'}`,
                }}
                title={day}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />
        {!locked && (
          <button
            onClick={onRemove}
            className="opacity-0 group-hover/card:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive text-sm leading-none"
            title="Удалить карточку"
          >
            ×
          </button>
        )}
      </div>

      {/* Bullet list / editor */}
      {editing ? (
        <textarea
          ref={taRef}
          defaultValue={c.label}
          className="w-full bg-transparent outline-none resize-none text-xs leading-snug"
          style={{ color: tc, minHeight: 32 }}
          rows={Math.max(lines.length, 1)}
          onInput={e => autoResize(e.currentTarget)}
          onBlur={e => {
            // trim trailing empty lines but keep structure
            const val = e.target.value.replace(/\n{3,}/g, '\n\n').trimEnd();
            onUpdateLabel(val || 'Новая задача');
            setEditing(false);
          }}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setEditing(false);
            }
          }}
        />
      ) : (
        <ul
          className="space-y-0.5 cursor-text"
          onDoubleClick={locked ? undefined : startEdit}
          title={locked ? undefined : 'Двойной клик — редактировать'}
          style={{ opacity: c.done ? 0.45 : 1 }}
        >
          {(lines.length > 0 ? lines : [c.label]).map((line, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs leading-snug">
              <span className="flex-shrink-0 mt-[3px] w-1 h-1 rounded-full" style={{ backgroundColor: weekColor, opacity: 0.7 }} />
              <span style={{ color: tc }}>
                {line}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

// ─── Lock modal ───────────────────────────────────────────────────────────────

const LOCK_PASSWORD = '2345';

function LockModal({ onClose, onUnlock }: { onClose: () => void; onUnlock: () => void }) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = () => {
    if (val === LOCK_PASSWORD) { onUnlock(); }
    else { setErr(true); setVal(''); setTimeout(() => setErr(false), 1200); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl p-6 w-80 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-2xl mb-1">🔒</div>
          <div className="font-heading font-bold text-base">Введите пароль</div>
          <div className="text-xs text-muted-foreground mt-0.5">для разблокировки редактирования</div>
        </div>
        <input
          ref={inputRef}
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose(); }}
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors"
          style={{
            borderColor: err ? '#ED4843' : 'var(--border)',
            backgroundColor: err ? '#FFF9F8' : 'var(--background)',
          }}
          placeholder="Пароль"
          autoComplete="off"
        />
        {err && <p className="text-xs text-red-500 mt-1.5">Неверный пароль</p>}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-muted transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'rocketmind-gantt-v1';

function loadState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      weeks: Week[]; rows: Row[]; title: string; subtitle: string;
    };
  } catch { return null; }
}

export default function GanttPage() {
  const saved = loadState();
  const [weeks, setWeeks] = useState<Week[]>(saved?.weeks ?? INITIAL_WEEKS);
  const [rows, setRows] = useState<Row[]>(saved?.rows ?? INITIAL_ROWS);
  const [title, setTitle] = useState(saved?.title ?? 'План работ 9 марта — 3 апреля');
  const [subtitle, setSubtitle] = useState(saved?.subtitle ?? '4 недели · Дизайн-система + MVP сервиса + Продуктовые страницы');
  const [locked, setLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // Persist state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ weeks, rows, title, subtitle }));
    } catch { /* quota exceeded or SSR */ }
  }, [weeks, rows, title, subtitle]);

  // ── Row drag ──────────────────────────────────────────────────────────────
  const dragRowIdx = useRef<number | null>(null);
  const dragOverRowIdx = useRef<number | null>(null);
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);
  const [dropTargetRowIdx, setDropTargetRowIdx] = useState<number | null>(null);
  const isCardDragging = useRef(false);

  const onRowDragStart = (e: React.DragEvent, idx: number) => {
    if (locked || isCardDragging.current) { e.preventDefault(); return; }
    dragRowIdx.current = idx;
    setDraggingRowId(rows[idx].id);
    e.dataTransfer.setData('type', 'row');
    e.dataTransfer.effectAllowed = 'move';
  };
  const onRowDragOver = (e: React.DragEvent, idx: number) => {
    if (isCardDragging.current) return;
    e.preventDefault();
    dragOverRowIdx.current = idx;
    setDropTargetRowIdx(idx);
  };
  const onRowDrop = (e: React.DragEvent, idx: number) => {
    if (e.dataTransfer.getData('type') !== 'row') return;
    e.preventDefault();
    const from = dragRowIdx.current;
    if (from === null || from === idx) { setDraggingRowId(null); setDropTargetRowIdx(null); return; }
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    setRows(next);
    dragRowIdx.current = null;
    dragOverRowIdx.current = null;
    setDraggingRowId(null);
    setDropTargetRowIdx(null);
  };
  const onRowDragEnd = () => { setDraggingRowId(null); setDropTargetRowIdx(null); isCardDragging.current = false; };

  // ── Card drag within/between cells ────────────────────────────────────────
  const dragCard = useRef<{ rowId: string; weekId: string; cardId: string } | null>(null);
  // dropTarget: rowId+weekId+cardId (insert before) or rowId+weekId (append)
  const [cardDropTarget, setCardDropTarget] = useState<{ rowId: string; weekId: string; cardId: string | null } | null>(null);

  const onCardDragStart = (e: React.DragEvent, rowId: string, weekId: string, cardId: string) => {
    if (locked) { e.preventDefault(); return; }
    isCardDragging.current = true;
    dragCard.current = { rowId, weekId, cardId };
    e.dataTransfer.setData('type', 'card');
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
  };

  const onCardDragOver = (e: React.DragEvent, rowId: string, weekId: string, cardId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragCard.current) setCardDropTarget({ rowId, weekId, cardId });
  };

  const onCardDragEnd = () => {
    isCardDragging.current = false;
    dragCard.current = null;
    setCardDropTarget(null);
  };

  const onCardDrop = (e: React.DragEvent, toRowId: string, toWeekId: string, toCardId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setCardDropTarget(null);
    const from = dragCard.current;
    if (!from) return;
    if (from.rowId === toRowId && from.weekId === toWeekId && from.cardId === toCardId) return;

    setRows(prev => {
      let movedCard: Card | null = null;
      const step1 = prev.map(row => {
        if (row.id !== from.rowId) return row;
        const cards = row.cells[from.weekId] ?? [];
        const idx = cards.findIndex(c => c.id === from.cardId);
        if (idx === -1) return row;
        movedCard = cards[idx];
        return { ...row, cells: { ...row.cells, [from.weekId]: cards.filter(c => c.id !== from.cardId) } };
      });
      if (!movedCard) return prev;

      return step1.map(row => {
        if (row.id !== toRowId) return row;
        const cards = [...(row.cells[toWeekId] ?? [])];
        if (toCardId) {
          const idx = cards.findIndex(c => c.id === toCardId);
          cards.splice(idx >= 0 ? idx : cards.length, 0, movedCard!);
        } else {
          cards.push(movedCard!);
        }
        return { ...row, cells: { ...row.cells, [toWeekId]: cards } };
      });
    });
    dragCard.current = null;
    isCardDragging.current = false;
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  const updateRowLabel = (rowId: string, val: string) =>
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, label: val } : r));

  const addCard = (rowId: string, weekId: string) =>
    setRows(prev => prev.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: [card('Новая задача'), ...(r.cells[weekId] ?? [])] } }
        : r
    ));

  const removeCard = (rowId: string, weekId: string, cardId: string) =>
    setRows(prev => prev.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: (r.cells[weekId] ?? []).filter(c => c.id !== cardId) } }
        : r
    ));

  const updateCardLabel = (rowId: string, weekId: string, cardId: string, val: string) =>
    setRows(prev => prev.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: (r.cells[weekId] ?? []).map(c => c.id === cardId ? { ...c, label: val } : c) } }
        : r
    ));

  const toggleCardDone = (rowId: string, weekId: string, cardId: string) =>
    setRows(prev => prev.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: (r.cells[weekId] ?? []).map(c => c.id === cardId ? { ...c, done: !c.done } : c) } }
        : r
    ));

  const toggleCardDay = (rowId: string, weekId: string, cardId: string, day: Day) =>
    setRows(prev => prev.map(r =>
      r.id === rowId
        ? {
            ...r, cells: {
              ...r.cells, [weekId]: (r.cells[weekId] ?? []).map(c =>
                c.id === cardId
                  ? { ...c, days: c.days.includes(day) ? c.days.filter(d => d !== day) : [...c.days, day] }
                  : c
              ),
            },
          }
        : r
    ));

  const updateWeekLabel = (weekId: string, val: string) =>
    setWeeks(prev => prev.map(w => w.id === weekId ? { ...w, label: val } : w));

  const updateWeekDates = (weekId: string, val: string) =>
    setWeeks(prev => prev.map(w => w.id === weekId ? { ...w, dates: val } : w));

  const updateWeekTheme = (weekId: string, val: string) =>
    setWeeks(prev => prev.map(w => w.id === weekId ? { ...w, theme: val } : w));

  const addRow = () => {
    const id = `r${Date.now()}`;
    const cells: Record<string, Card[]> = {};
    weeks.forEach(w => { cells[w.id] = []; });
    setRows(prev => [...prev, { id, label: 'Новый раздел', cells }]);
  };

  const removeRow = (rowId: string) =>
    setRows(prev => prev.filter(r => r.id !== rowId));

  // ──────────────────────────────────────────────────────────────────────────

  const COL_W = 220;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Rocketmind · MVP 1.1
          </p>
          <h1 className="font-heading text-[2rem] font-bold leading-tight">
            <EditableText value={title} onChange={setTitle} />
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            <EditableText value={subtitle} onChange={setSubtitle} />
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* Week cards */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
          {weeks.map(w => (
            <div key={w.id} className="border border-border rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: w.color }} />
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
                <EditableText value={w.dates} onChange={v => updateWeekDates(w.id, v)} />
              </div>
              <div className="font-heading font-bold text-base mb-1">
                <EditableText value={w.label} onChange={v => updateWeekLabel(w.id, v)} />
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                <EditableText value={w.theme} onChange={v => updateWeekTheme(w.id, v)} />
              </p>
            </div>
          ))}
        </div>

        {/* Gantt table */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div style={{ minWidth: COL_W + weeks.length * 240 }}>

              {/* Header */}
              <div className="flex border-b border-border bg-muted/40 sticky top-0 z-10">
                <div
                  className="flex-shrink-0 px-4 py-3 border-r border-border text-xs font-mono uppercase tracking-wide text-muted-foreground bg-muted/40"
                  style={{ width: COL_W, minWidth: COL_W }}
                >
                  Раздел
                </div>
                {weeks.map(w => (
                  <div
                    key={w.id}
                    className="flex-1 px-3 py-3 border-r border-border last:border-r-0 text-center"
                    style={{ minWidth: 240 }}
                  >
                    <div className="font-mono text-xs font-bold uppercase tracking-wide" style={{ color: textColor(w.color) }}>
                      <EditableText value={w.label} onChange={v => updateWeekLabel(w.id, v)} />
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      <EditableText value={w.dates} onChange={v => updateWeekDates(w.id, v)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  className="flex border-b border-border/40 last:border-b-0 transition-colors"
                  style={{
                    opacity: draggingRowId === row.id ? 0.35 : 1,
                    backgroundColor: dropTargetRowIdx === idx && draggingRowId && draggingRowId !== row.id
                      ? 'var(--muted)' : undefined,
                  }}
                  draggable
                  onDragStart={e => onRowDragStart(e, idx)}
                  onDragOver={e => onRowDragOver(e, idx)}
                  onDrop={e => onRowDrop(e, idx)}
                  onDragEnd={onRowDragEnd}
                >
                  {/* Left column */}
                  <div
                    className="flex-shrink-0 flex items-start gap-2 px-3 py-3 border-r border-border bg-background"
                    style={{ width: COL_W, minWidth: COL_W }}
                  >
                    <span
                      className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground transition-colors select-none flex-shrink-0 mt-0.5 text-base leading-none"
                      title="Перетащить строку"
                    >
                      ⠿
                    </span>
                    <span className="text-xs font-medium text-foreground flex-1 min-w-0 mt-0.5">
                      <EditableText value={row.label} onChange={v => updateRowLabel(row.id, v)} />
                    </span>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="flex-shrink-0 text-muted-foreground/20 hover:text-destructive transition-colors text-sm leading-none mt-0.5"
                      title="Удалить строку"
                    >
                      ×
                    </button>
                  </div>

                  {/* Week cells */}
                  {weeks.map(w => {
                    const cards = row.cells[w.id] ?? [];
                    return (
                      <div
                        key={w.id}
                        className="flex-1 px-2 py-2 border-r border-border/40 last:border-r-0"
                        style={{ minWidth: 240 }}
                        onDragOver={e => onCardDragOver(e, row.id, w.id, null)}
                        onDrop={e => onCardDrop(e, row.id, w.id, null)}
                      >
                        {/* + add card button — thin, top of cell */}
                        {!locked && (
                          <button
                            onClick={() => addCard(row.id, w.id)}
                            className="w-full mb-1.5 flex items-center justify-center gap-1 rounded text-[10px] font-mono uppercase tracking-wide transition-colors"
                            style={{
                              height: 18,
                              color: textColor(w.color),
                              opacity: 0.35,
                              backgroundColor: w.color + '10',
                              border: `1px dashed ${w.color}40`,
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.35'; }}
                            title="Добавить задачу"
                          >
                            + задача
                          </button>
                        )}

                        {/* Cards */}
                        <div className="flex flex-col gap-0">
                          {cards.map(c => {
                            const isDropBefore =
                              cardDropTarget?.rowId === row.id &&
                              cardDropTarget?.weekId === w.id &&
                              cardDropTarget?.cardId === c.id &&
                              dragCard.current?.cardId !== c.id;
                            return (
                              <div key={c.id}>
                                {/* drop indicator line */}
                                {isDropBefore && (
                                  <div className="h-0.5 mx-1 rounded-full mb-1" style={{ backgroundColor: w.color }} />
                                )}
                                <div className="mb-1.5">
                                  <CardItem
                                    card={c}
                                    weekColor={w.color}
                                    locked={locked}
                                    onToggleDone={() => toggleCardDone(row.id, w.id, c.id)}
                                    onUpdateLabel={v => updateCardLabel(row.id, w.id, c.id, v)}
                                    onRemove={() => removeCard(row.id, w.id, c.id)}
                                    draggable={!locked}
                                    onDragStart={e => onCardDragStart(e, row.id, w.id, c.id)}
                                    onDragEnd={onCardDragEnd}
                                    onDragOver={e => onCardDragOver(e, row.id, w.id, c.id)}
                                    onDrop={e => onCardDrop(e, row.id, w.id, c.id)}
                                    onToggleDay={day => toggleCardDay(row.id, w.id, c.id, day)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                          {/* drop indicator at end */}
                          {cardDropTarget?.rowId === row.id &&
                            cardDropTarget?.weekId === w.id &&
                            cardDropTarget?.cardId === null &&
                            dragCard.current && (
                            <div className="h-0.5 mx-1 rounded-full mb-1" style={{ backgroundColor: w.color }} />
                          )}
                          {cards.length === 0 && (
                            <div className="min-h-[40px] rounded-md border border-dashed border-border/0 hover:border-border/40 transition-colors" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono pb-2">
          {!locked && (
            <button
              onClick={addRow}
              className="border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors text-foreground flex-shrink-0"
            >
              + строка
            </button>
          )}
          <div className="flex items-center gap-4 flex-1">
            {!locked && (
              <>
                <span>⠿ перетащить строку</span>
                <span>⬌ перетащить карточку</span>
                <span>двойной клик — редактировать</span>
              </>
            )}
            {locked && <span className="text-muted-foreground/60">Редактирование заблокировано</span>}
          </div>
          {/* Lock button */}
          <button
            onClick={() => {
              if (locked) { setShowLockModal(true); }
              else { setLocked(true); }
            }}
            className="flex-shrink-0 flex items-center gap-1.5 border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors text-foreground"
            title={locked ? 'Разблокировать' : 'Заблокировать редактирование'}
          >
            <span className="text-sm">{locked ? '🔒' : '🔓'}</span>
            <span>{locked ? 'Заблокировано' : 'Заблокировать'}</span>
          </button>
        </div>
      </div>

      {/* Lock modal */}
      {showLockModal && (
        <LockModal
          onClose={() => setShowLockModal(false)}
          onUnlock={() => { setLocked(false); setShowLockModal(false); }}
        />
      )}
    </div>
  );
}
