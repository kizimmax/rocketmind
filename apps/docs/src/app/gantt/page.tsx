"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '@/lib/firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

type ColorToken = 'yellow' | 'violet' | 'sky' | 'terracotta' | 'pink' | 'blue' | 'red' | 'green';

type Week = {
  id: string;
  label: string;
  dates: string;
  theme: string;
  color: ColorToken;
};

// ─── Color helpers ────────────────────────────────────────────────────────────

function cssVar(token: ColorToken, level: '100' | '300' | '500' | '700' | '900' | 'fg' | 'fg-subtle') {
  return `var(--rm-${token}-${level})`;
}

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
  { id: 'w1', label: 'Неделя 1', dates: '9–15 мар', theme: 'Поиск направления + технический фундамент + DS v1', color: 'violet' },
  { id: 'w2', label: 'Неделя 2', dates: '16–22 мар', theme: 'Стабилизация сборки + DS v2 + старт MVP сервиса', color: 'sky' },
  { id: 'w3', label: 'Неделя 3', dates: '23–29 мар', theme: 'Интеграция MVP с n8n + агенты + DS v3', color: 'terracotta' },
  { id: 'w4', label: 'Неделя 4', dates: '30 мар – 5 апр', theme: 'Полировка + DS v4 + QA MVP сервиса', color: 'yellow' },
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

const INITIAL_TITLE = 'План работ 9 марта — 3 апреля';
const INITIAL_SUBTITLE = '4 недели · Дизайн-система + MVP сервиса + Продуктовые страницы';

// ─── Helpers ──────────────────────────────────────────────────────────────────


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

function CardItem({
  card: c, weekColor, locked,
  onToggleDone, onUpdateLabel, onRemove,
  draggable: isDraggable,
  onDragStart, onDragEnd, onDragOver, onDrop,
  onToggleDay,
}: {
  card: Card; weekColor: ColorToken; locked: boolean;
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
  const [editing, setEditing] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const lines = (c.label ?? '').split('\n').filter(l => l.trim() !== '');

  const startEdit = useCallback(() => {
    setEditing(true);
    requestAnimationFrame(() => {
      if (!taRef.current) return;
      taRef.current.focus();
      const len = taRef.current.value.length;
      taRef.current.setSelectionRange(len, len);
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
        backgroundColor: cssVar(weekColor, '900'),
        border: `1px solid ${cssVar(weekColor, '300')}`,
        cursor: editing ? 'default' : 'grab',
      }}
    >
      {/* Top row: checkbox + days + remove */}
      <div className="flex items-center gap-1.5 mb-1">
        <button
          onClick={onToggleDone}
          className="flex-shrink-0 w-3.5 h-3.5 rounded-sm border transition-colors"
          style={{
            borderColor: c.done ? cssVar(weekColor, '100') : cssVar(weekColor, '300'),
            backgroundColor: c.done ? cssVar(weekColor, '100') : 'transparent',
          }}
          title={c.done ? 'Готово' : 'Отметить как готово'}
        >
          {c.done && (
            <svg viewBox="0 0 10 10" className="w-full h-full text-white" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-0.5">
          {DAYS.map(day => {
            const active = (c.days ?? []).includes(day);
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
                  backgroundColor: active ? cssVar(weekColor, '100') : cssVar(weekColor, '900'),
                  color: active ? cssVar(weekColor, 'fg') : cssVar(weekColor, 'fg-subtle'),
                  opacity: active ? 1 : 0.6,
                  border: `1px solid ${active ? cssVar(weekColor, '100') : cssVar(weekColor, '300')}`,
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
            className="opacity-0 group-hover/card:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive text-[length:var(--text-14)] leading-none"
            title="Удалить карточку"
          >
            ×
          </button>
        )}
      </div>

      {editing ? (
        <textarea
          ref={taRef}
          defaultValue={c.label}
          className="w-full bg-transparent outline-none resize-none text-[length:var(--text-12)] leading-snug"
          style={{ color: cssVar(weekColor, 'fg-subtle'), minHeight: 32 }}
          rows={Math.max(lines.length, 1)}
          onInput={e => autoResize(e.currentTarget)}
          onBlur={e => {
            const val = e.target.value.replace(/\n{3,}/g, '\n\n').trimEnd();
            onUpdateLabel(val || 'Новая задача');
            setEditing(false);
          }}
          onKeyDown={e => {
            if (e.key === 'Escape') setEditing(false);
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
            <li key={i} className="flex items-start gap-1.5 text-[length:var(--text-12)] leading-snug">
              <span className="flex-shrink-0 mt-[3px] w-1 h-1 rounded-full" style={{ backgroundColor: cssVar(weekColor, '100'), opacity: 0.7 }} />
              <span style={{ color: cssVar(weekColor, 'fg-subtle') }}>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
      style={{ backgroundColor: 'var(--rm-gray-alpha-600)' }}
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl p-6 w-80 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-[length:var(--text-25)] mb-1">🔒</div>
          <div className="font-heading font-bold text-[length:var(--text-16)]">Введите пароль</div>
          <div className="text-[length:var(--text-12)] text-muted-foreground mt-0.5">для разблокировки редактирования</div>
        </div>
        <input
          ref={inputRef}
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose(); }}
          className="w-full border rounded-lg px-3 py-2 text-[length:var(--text-14)] outline-none transition-colors"
          style={{
            borderColor: err ? 'var(--rm-red-100)' : 'var(--border)',
            backgroundColor: err ? 'var(--rm-red-900)' : 'var(--background)',
          }}
          placeholder="Пароль"
          autoComplete="off"
        />
        {err && <p className="text-[length:var(--text-12)] text-[var(--rm-red-100)] mt-1.5">Неверный пароль</p>}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 border border-border rounded-lg py-2 text-[length:var(--text-14)] hover:bg-muted transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            className="flex-1 rounded-lg py-2 text-[length:var(--text-14)] font-medium transition-colors"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sync indicator ───────────────────────────────────────────────────────────

function SyncDot({ status }: { status: 'synced' | 'saving' | 'error' | 'loading' }) {
  const map = {
    loading: { color: 'var(--rm-gray-4)', label: 'Загрузка…' },
    saving:  { color: 'var(--rm-yellow-100)', label: 'Сохранение…' },
    synced:  { color: 'var(--rm-green-100)', label: 'Синхронизировано' },
    error:   { color: 'var(--rm-red-100)', label: 'Ошибка синхронизации' },
  };
  const { color, label } = map[status];
  return (
    <div className="flex items-center gap-1.5 font-mono text-[length:var(--text-12)] text-muted-foreground select-none" title={label}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const DB_PATH = 'gantt';

export default function GanttPage() {
  const [weeks, setWeeks] = useState<Week[]>(INITIAL_WEEKS);
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [title, setTitle] = useState(INITIAL_TITLE);
  const [subtitle, setSubtitle] = useState(INITIAL_SUBTITLE);
  const [locked, setLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error' | 'loading'>('loading');

  // Track whether we've received the first snapshot from Firebase
  const initialized = useRef(false);
  // Suppress writes while receiving remote update
  const remoteUpdate = useRef(false);

  // ── Subscribe to Firebase Realtime DB ─────────────────────────────────────
  useEffect(() => {
    const dbRef = ref(db, DB_PATH);
    const unsub = onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        remoteUpdate.current = true;
        if (data) {
          if (data.weeks) setWeeks(data.weeks);
          if (data.rows) setRows(data.rows);
          if (data.title) setTitle(data.title);
          if (data.subtitle) setSubtitle(data.subtitle);
          if (data.locked !== undefined) setLocked(data.locked);
        }
        initialized.current = true;
        setSyncStatus('synced');
        // reset flag after state updates are flushed
        setTimeout(() => { remoteUpdate.current = false; }, 0);
      },
      (error) => {
        console.error('Firebase error:', error);
        setSyncStatus('error');
        initialized.current = true;
      }
    );
    return () => unsub();
  }, []);

  // ── Write state to Firebase (debounced) ───────────────────────────────────
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((
    nextWeeks: Week[], nextRows: Row[],
    nextTitle: string, nextSubtitle: string, nextLocked: boolean,
  ) => {
    if (!initialized.current || remoteUpdate.current) return;
    setSyncStatus('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      set(ref(db, DB_PATH), {
        weeks: nextWeeks,
        rows: nextRows,
        title: nextTitle,
        subtitle: nextSubtitle,
        locked: nextLocked,
      })
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('error'));
    }, 600);
  }, []);

  // ── Helpers that update state AND persist ─────────────────────────────────

  const updateWeeks = (next: Week[]) => { setWeeks(next); persist(next, rows, title, subtitle, locked); };
  const updateRows  = (next: Row[])  => { setRows(next);  persist(weeks, next, title, subtitle, locked); };
  const updateTitle = (v: string)    => { setTitle(v);    persist(weeks, rows, v, subtitle, locked); };
  const updateSubtitle = (v: string) => { setSubtitle(v); persist(weeks, rows, title, v, locked); };
  const updateLocked = (v: boolean)  => { setLocked(v);   persist(weeks, rows, title, subtitle, v); };

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
    updateRows(next);
    dragRowIdx.current = null;
    dragOverRowIdx.current = null;
    setDraggingRowId(null);
    setDropTargetRowIdx(null);
  };
  const onRowDragEnd = () => { setDraggingRowId(null); setDropTargetRowIdx(null); isCardDragging.current = false; };

  // ── Card drag ─────────────────────────────────────────────────────────────
  const dragCard = useRef<{ rowId: string; weekId: string; cardId: string } | null>(null);
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
    e.preventDefault(); e.stopPropagation();
    if (dragCard.current) setCardDropTarget({ rowId, weekId, cardId });
  };
  const onCardDragEnd = () => { isCardDragging.current = false; dragCard.current = null; setCardDropTarget(null); };

  const onCardDrop = (e: React.DragEvent, toRowId: string, toWeekId: string, toCardId: string | null) => {
    e.preventDefault(); e.stopPropagation();
    setCardDropTarget(null);
    const from = dragCard.current;
    if (!from) return;
    if (from.rowId === toRowId && from.weekId === toWeekId && from.cardId === toCardId) return;

    let next = rows;
    let movedCard: Card | null = null;
    const step1 = next.map(row => {
      if (row.id !== from.rowId) return row;
      const cards = row.cells[from.weekId] ?? [];
      const idx = cards.findIndex(c => c.id === from.cardId);
      if (idx === -1) return row;
      movedCard = cards[idx];
      return { ...row, cells: { ...row.cells, [from.weekId]: cards.filter(c => c.id !== from.cardId) } };
    });
    if (!movedCard) return;

    next = step1.map(row => {
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
    updateRows(next);
    dragCard.current = null;
    isCardDragging.current = false;
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  const updateRowLabel = (rowId: string, val: string) => {
    const next = rows.map(r => r.id === rowId ? { ...r, label: val } : r);
    updateRows(next);
  };

  const addCard = (rowId: string, weekId: string) => {
    const next = rows.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: [card('Новая задача'), ...(r.cells[weekId] ?? [])] } }
        : r
    );
    updateRows(next);
  };

  const removeCard = (rowId: string, weekId: string, cardId: string) => {
    const next = rows.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: (r.cells[weekId] ?? []).filter(c => c.id !== cardId) } }
        : r
    );
    updateRows(next);
  };

  const updateCardLabel = (rowId: string, weekId: string, cardId: string, val: string) => {
    const next = rows.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: (r.cells[weekId] ?? []).map(c => c.id === cardId ? { ...c, label: val } : c) } }
        : r
    );
    updateRows(next);
  };

  const toggleCardDone = (rowId: string, weekId: string, cardId: string) => {
    const next = rows.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: (r.cells[weekId] ?? []).map(c => c.id === cardId ? { ...c, done: !c.done } : c) } }
        : r
    );
    updateRows(next);
  };

  const toggleCardDay = (rowId: string, weekId: string, cardId: string, day: Day) => {
    const next = rows.map(r =>
      r.id === rowId
        ? {
            ...r, cells: {
              ...r.cells, [weekId]: (r.cells[weekId] ?? []).map(c =>
                c.id === cardId
                  ? { ...c, days: (c.days ?? []).includes(day) ? (c.days ?? []).filter(d => d !== day) : [...(c.days ?? []), day] }
                  : c
              ),
            },
          }
        : r
    );
    updateRows(next);
  };

  const updateWeekLabel = (weekId: string, val: string) =>
    updateWeeks(weeks.map(w => w.id === weekId ? { ...w, label: val } : w));

  const updateWeekDates = (weekId: string, val: string) =>
    updateWeeks(weeks.map(w => w.id === weekId ? { ...w, dates: val } : w));

  const updateWeekTheme = (weekId: string, val: string) =>
    updateWeeks(weeks.map(w => w.id === weekId ? { ...w, theme: val } : w));

  const addRow = () => {
    const id = `r${Date.now()}`;
    const cells: Record<string, Card[]> = {};
    weeks.forEach(w => { cells[w.id] = []; });
    updateRows([...rows, { id, label: 'Новый раздел', cells }]);
  };

  const removeRow = (rowId: string) => updateRows(rows.filter(r => r.id !== rowId));

  // ──────────────────────────────────────────────────────────────────────────

  const COL_W = 220;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <p className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.12em] text-muted-foreground flex-1">
              Rocketmind · MVP 1.1
            </p>
            <SyncDot status={syncStatus} />
          </div>
          <h1 className="font-heading text-[length:var(--text-31)] font-bold leading-tight">
            <EditableText value={title} onChange={updateTitle} />
          </h1>
          <p className="text-muted-foreground mt-1.5 text-[length:var(--text-14)]">
            <EditableText value={subtitle} onChange={updateSubtitle} />
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* Week cards */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
          {weeks.map(w => (
            <div key={w.id} className="border border-border rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: cssVar(w.color, '100') }} />
              <div className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.12em] text-muted-foreground mb-1">
                <EditableText value={w.dates} onChange={v => updateWeekDates(w.id, v)} />
              </div>
              <div className="font-heading font-bold text-[length:var(--text-16)] mb-1">
                <EditableText value={w.label} onChange={v => updateWeekLabel(w.id, v)} />
              </div>
              <p className="text-[length:var(--text-12)] text-muted-foreground leading-snug">
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
                  className="flex-shrink-0 px-4 py-3 border-r border-border text-[length:var(--text-12)] font-mono uppercase tracking-wide text-muted-foreground bg-muted/40"
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
                    <div className="font-mono text-[length:var(--text-12)] font-bold uppercase tracking-wide" style={{ color: cssVar(w.color, '100') }}>
                      <EditableText value={w.label} onChange={v => updateWeekLabel(w.id, v)} />
                    </div>
                    <div className="font-mono text-[length:var(--text-12)] text-muted-foreground mt-0.5">
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
                      className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground transition-colors select-none flex-shrink-0 mt-0.5 text-[length:var(--text-16)] leading-none"
                      title="Перетащить строку"
                    >
                      ⠿
                    </span>
                    <span className="text-[length:var(--text-12)] font-medium text-foreground flex-1 min-w-0 mt-0.5">
                      <EditableText value={row.label} onChange={v => updateRowLabel(row.id, v)} />
                    </span>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="flex-shrink-0 text-muted-foreground/20 hover:text-destructive transition-colors text-[length:var(--text-14)] leading-none mt-0.5"
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
                        {!locked && (
                          <button
                            onClick={() => addCard(row.id, w.id)}
                            className="w-full mb-1.5 flex items-center justify-center gap-1 rounded text-[length:var(--text-12)] font-mono uppercase tracking-wide transition-colors"
                            style={{
                              height: 18,
                              color: cssVar(w.color, 'fg-subtle'),
                              opacity: 0.35,
                              backgroundColor: cssVar(w.color, '900'),
                              border: `1px dashed ${cssVar(w.color, '300')}`,
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.35'; }}
                            title="Добавить задачу"
                          >
                            + задача
                          </button>
                        )}

                        <div className="flex flex-col gap-0">
                          {cards.map(c => {
                            const isDropBefore =
                              cardDropTarget?.rowId === row.id &&
                              cardDropTarget?.weekId === w.id &&
                              cardDropTarget?.cardId === c.id &&
                              dragCard.current?.cardId !== c.id;
                            return (
                              <div key={c.id}>
                                {isDropBefore && (
                                  <div className="h-0.5 mx-1 rounded-full mb-1" style={{ backgroundColor: cssVar(w.color, '100') }} />
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
        <div className="flex items-center gap-4 text-[length:var(--text-12)] text-muted-foreground font-mono pb-2">
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
          <button
            onClick={() => {
              if (locked) { setShowLockModal(true); }
              else { updateLocked(true); }
            }}
            className="flex-shrink-0 flex items-center gap-1.5 border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors text-foreground"
            title={locked ? 'Разблокировать' : 'Заблокировать редактирование'}
          >
            <span className="text-[length:var(--text-14)]">{locked ? '🔒' : '🔓'}</span>
            <span>{locked ? 'Заблокировано' : 'Заблокировать'}</span>
          </button>
        </div>
      </div>

      {showLockModal && (
        <LockModal
          onClose={() => setShowLockModal(false)}
          onUnlock={() => { updateLocked(false); setShowLockModal(false); }}
        />
      )}
    </div>
  );
}
