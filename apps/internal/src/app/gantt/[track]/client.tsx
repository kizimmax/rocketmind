"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, set, get } from 'firebase/database';
import { db } from '@/lib/firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

type ColorToken = 'yellow' | 'violet' | 'sky' | 'terracotta' | 'pink' | 'blue' | 'red' | 'green' | 'neutral';

type Week = {
  id: string;
  label: string;
  dates: string;
  theme: string;
  color: ColorToken;
};

// ─── Color helpers ────────────────────────────────────────────────────────────

function cssVar(token: ColorToken, level: '100' | '300' | '500' | '700' | '900' | 'fg' | 'fg-subtle') {
  if (token === 'neutral') {
    const map: Record<string, string> = {
      '100': 'var(--rm-gray-4)',
      '300': 'var(--rm-gray-3)',
      '500': 'var(--rm-gray-fg-sub)',
      '700': 'var(--rm-gray-3)',
      '900': 'var(--rm-gray-1)',
      'fg':  'var(--rm-gray-fg-main)',
      'fg-subtle': 'var(--rm-gray-fg-sub)',
    };
    return map[level];
  }
  return `var(--rm-${token}-${level})`;
}

/** Text color readable on card (900) backgrounds in both light and dark themes */
function cssCardText(token: ColorToken) {
  if (token === 'neutral') return 'var(--foreground)';
  return `var(--rm-${token}-fg-subtle)`;
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

// ─── Date helpers ─────────────────────────────────────────────────────────────

const PROJECT_START = new Date(2026, 2, 9); // 9 марта 2026 (понедельник)
const VISIBLE_COUNT = 4;
const MONTH_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const WEEK_COLORS: ColorToken[] = ['violet', 'sky', 'terracotta', 'yellow', 'pink', 'blue', 'red', 'green'];

function getWeekRange(weekIndex: number): { start: Date; end: Date } {
  const start = new Date(PROJECT_START);
  start.setDate(start.getDate() + weekIndex * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

function formatWeekDates(weekIndex: number): string {
  const { start, end } = getWeekRange(weekIndex);
  const sm = MONTH_SHORT[start.getMonth()];
  const em = MONTH_SHORT[end.getMonth()];
  if (sm === em) return `${start.getDate()}–${end.getDate()} ${sm}`;
  return `${start.getDate()} ${sm} – ${end.getDate()} ${em}`;
}

function getCurrentWeekIndex(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - PROJECT_START.getTime();
  if (diffMs < 0) return -1;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_WEEKS: Week[] = [
  { id: 'w1', label: 'Неделя 1', dates: formatWeekDates(0), theme: 'Поиск направления + технический фундамент + DS v1', color: 'violet' },
  { id: 'w2', label: 'Неделя 2', dates: formatWeekDates(1), theme: 'Стабилизация сборки + DS v2 + старт MVP сервиса', color: 'sky' },
  { id: 'w3', label: 'Неделя 3', dates: formatWeekDates(2), theme: 'Интеграция MVP с n8n + агенты + DS v3', color: 'terracotta' },
  { id: 'w4', label: 'Неделя 4', dates: formatWeekDates(3), theme: 'Полировка + DS v4 + QA MVP сервиса', color: 'yellow' },
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
  value, onChange, className, style, startEditing,
}: {
  value: string; onChange: (v: string) => void;
  className?: string; style?: React.CSSProperties;
  startEditing?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const start = useCallback(() => {
    setEditing(true);
    requestAnimationFrame(() => { ref.current?.focus(); ref.current?.select(); });
  }, []);

  useEffect(() => {
    if (startEditing) start();
  }, [startEditing, start]);

  if (editing) {
    const lineCount = Math.max((value.match(/\n/g)?.length ?? 0) + 1, Math.ceil(value.length / 30), 2);
    return (
      <textarea
        ref={ref}
        defaultValue={value}
        className={`bg-transparent resize-none outline-none w-full ${className ?? ''}`}
        style={{ ...style, minHeight: 32 }}
        rows={lineCount}
        onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
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
      className="rounded-lg px-2.5 pt-1.5 pb-2 group/card relative transition-colors duration-300"
      style={{
        backgroundColor: c.done
          ? 'transparent'
          : cssVar(weekColor, '900'),
        border: `1px solid ${c.done
          ? `color-mix(in srgb, ${cssVar(weekColor, '300')}, transparent 60%)`
          : cssVar(weekColor, '300')}`,
        cursor: editing ? 'default' : 'grab',
        opacity: c.done ? 0.45 : 1,
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

        <div className="flex-1 grid grid-cols-5 gap-1">
          {DAYS.map(day => {
            const active = (c.days ?? []).includes(day);
            const isNeutral = weekColor === 'neutral';
            return (
              <button
                key={day}
                onClick={() => onToggleDay(day)}
                className="font-mono transition-colors leading-none w-full"
                style={{
                  fontSize: 9,
                  height: 16,
                  borderRadius: 3,
                  backgroundColor: active
                    ? (isNeutral && !c.done ? 'var(--foreground)' : cssVar(weekColor, '100'))
                    : cssVar(weekColor, '900'),
                  color: active
                    ? (isNeutral && !c.done ? 'var(--background)' : cssVar(weekColor, 'fg'))
                    : cssVar(weekColor, 'fg-subtle'),
                  opacity: active ? 1 : 0.6,
                  border: `1px solid ${active
                    ? (isNeutral && !c.done ? 'var(--foreground)' : cssVar(weekColor, '100'))
                    : cssVar(weekColor, '300')}`,
                }}
                title={day}
              >
                {day}
              </button>
            );
          })}
        </div>
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
          style={{ color: c.done ? cssVar(weekColor, 'fg-subtle') : cssCardText(weekColor), minHeight: 32 }}
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
        >
          {(lines.length > 0 ? lines : [c.label]).map((line, i) => {
            const openColor = cssCardText(weekColor);
            return (
            <li key={i} className="flex items-start gap-1.5 text-[length:var(--text-12)] leading-snug">
              <span className="flex-shrink-0 mt-[3px] w-1 h-1 rounded-full" style={{ backgroundColor: openColor, opacity: c.done ? 0.4 : 0.7 }} />
              <span style={{ color: c.done ? cssVar(weekColor, 'fg-subtle') : openColor }}>{line}</span>
            </li>
            );
          })}
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
    <span className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{ backgroundColor: color }} title={label} />
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 12L6 8l4-4" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13.5 2.5v4h-4" />
      <path d="M2.5 13.5v-4h4" />
      <path d="M13.16 6A5.5 5.5 0 004.2 4.2L2.5 6.5" />
      <path d="M2.84 10a5.5 5.5 0 008.96 1.8l1.7-2.3" />
    </svg>
  );
}


// ─── Main page ────────────────────────────────────────────────────────────────

export default function GanttTrackClient() {
  const { track } = useParams<{ track: string }>();
  const DB_PATH = `gantt_tracks/${track}`;

  const [trackValid, setTrackValid] = useState<boolean | null>(null);
  const [trackName, setTrackName] = useState('');

  useEffect(() => {
    get(ref(db, 'gantt_config/tracks')).then((snap) => {
      const tracks: Record<string, { name: string }> | null = snap.val();
      if (tracks && track in tracks) {
        setTrackValid(true);
        setTrackName(tracks[track].name);
      } else {
        setTrackValid(false);
      }
    });
  }, [track]);

  if (trackValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground text-[length:var(--text-16)]">Загрузка…</p>
      </div>
    );
  }

  if (!trackValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-foreground text-[length:var(--text-20)] font-bold">Трек не найден</p>
          <p className="text-muted-foreground text-[length:var(--text-14)]">
            «{track}» не зарегистрирован. Добавьте его в Firebase: gantt_config/tracks.
          </p>
        </div>
      </div>
    );
  }

  return <GanttBoard dbPath={DB_PATH} trackName={trackName} />;
}

// ─── Undo / Redo types ───────────────────────────────────────────────────────

type Snapshot = { weeks: Week[]; rows: Row[]; title: string; subtitle: string; locked: boolean };
const MAX_HISTORY = 50;

// ─── Toast ───────────────────────────────────────────────────────────────────

type Toast = { id: number; message: string; onUndo?: () => void };
let toastId = 0;

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2.5 shadow-lg text-[length:var(--text-14)] text-foreground animate-[slideUp_200ms_ease-out]">
          <span>{t.message}</span>
          {t.onUndo && (
            <button
              onClick={() => { t.onUndo!(); onDismiss(t.id); }}
              className="font-bold text-[color:var(--rm-yellow-100)] hover:underline"
            >
              Отменить
            </button>
          )}
          <button onClick={() => onDismiss(t.id)} className="text-muted-foreground hover:text-foreground ml-1">✕</button>
        </div>
      ))}
    </div>
  );
}

function GanttBoard({ dbPath, trackName }: { dbPath: string; trackName: string }) {
  const [weeks, setWeeks] = useState<Week[]>(INITIAL_WEEKS);
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [title, setTitle] = useState(INITIAL_TITLE);
  const [subtitle, setSubtitle] = useState(INITIAL_SUBTITLE);
  const [locked, setLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error' | 'loading'>('loading');

  // ── Undo / Redo ───────────────────────────────────────────────────────────
  const history = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const skipHistory = useRef(false);

  const snap = useCallback((): Snapshot => ({ weeks, rows, title, subtitle, locked }), [weeks, rows, title, subtitle, locked]);

  const pushHistory = useCallback((s: Snapshot) => {
    history.current = [...history.current.slice(-(MAX_HISTORY - 1)), s];
    future.current = [];
  }, []);

  const canUndo = history.current.length > 0;
  const canRedo = future.current.length > 0;

  const persistRef = useRef<typeof persist>(null!);

  const applySnapshot = useCallback((s: Snapshot) => {
    skipHistory.current = true;
    setWeeks(s.weeks); setRows(s.rows); setTitle(s.title); setSubtitle(s.subtitle); setLocked(s.locked);
    persistRef.current(s.weeks, s.rows, s.title, s.subtitle, s.locked);
  }, []);

  const undo = useCallback(() => {
    if (history.current.length === 0) return;
    future.current = [snap(), ...future.current];
    const prev = history.current[history.current.length - 1];
    history.current = history.current.slice(0, -1);
    applySnapshot(prev);
  }, [snap, applySnapshot]);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    history.current = [...history.current, snap()];
    const next = future.current[0];
    future.current = future.current.slice(1);
    applySnapshot(next);
  }, [snap, applySnapshot]);

  // ── Toasts ────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismissToast = useCallback((id: number) => setToasts(ts => ts.filter(t => t.id !== id)), []);
  const showToast = useCallback((message: string, onUndo?: () => void) => {
    const id = ++toastId;
    setToasts(ts => [...ts, { id, message, onUndo }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 5000);
  }, []);

  // ── Keyboard shortcuts (undo/redo) ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA' || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && e.key === 'z' && e.shiftKey)  { e.preventDefault(); redo(); }
      if (mod && e.key === 'y')                 { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // Week navigation — start near current week to avoid flash
  const [visibleStartIdx, setVisibleStartIdx] = useState(() => {
    const cwIdx = getCurrentWeekIndex();
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const count = mobile ? 1 : VISIBLE_COUNT;
    const maxStart = Math.max(0, INITIAL_WEEKS.length - count);
    const ideal = mobile ? cwIdx : Math.max(0, cwIdx - 1);
    return cwIdx > 0 ? Math.min(ideal, maxStart) : 0;
  });

  // Summary loading
  const [summaryLoading, setSummaryLoading] = useState<string | null>(null);
  const [summaryReady, setSummaryReady] = useState<string | null>(null);
  // API key input dialog
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [pendingWeekId, setPendingWeekId] = useState<string | null>(null);

  // Track whether we've received the first snapshot from Firebase
  const initialized = useRef(false);
  const [loaded, setLoaded] = useState(false);
  // Suppress writes while receiving remote update
  const remoteUpdate = useRef(false);
  // Track initial scroll
  const didInitialScroll = useRef(false);

  // ── Current week index ─────────────────────────────────────────────────────
  const currentWeekIdx = useMemo(() => getCurrentWeekIndex(), []);

  // ── Mobile detection ─────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Visible weeks ──────────────────────────────────────────────────────────
  const effectiveCount = isMobile ? 1 : VISIBLE_COUNT;
  const visibleWeeks = useMemo(() => {
    return weeks.slice(visibleStartIdx, visibleStartIdx + VISIBLE_COUNT);
  }, [weeks, visibleStartIdx]);
  const shownWeeks = isMobile ? weeks.slice(visibleStartIdx, visibleStartIdx + 1) : visibleWeeks;

  const canGoBack = visibleStartIdx > 0;
  const canGoForward = visibleStartIdx + effectiveCount < weeks.length;

  // Slide animation direction
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [animating, setAnimating] = useState(false);
  const slideTimerRef = useRef<number | null>(null);

  const navigateWeeks = useCallback((dir: 'left' | 'right') => {
    if (animating) return;
    if (dir === 'left' && !canGoBack) return;
    if (dir === 'right' && !canGoForward) return;
    setSlideDir(dir);
    setAnimating(true);
    if (slideTimerRef.current !== null) clearTimeout(slideTimerRef.current);
    slideTimerRef.current = window.setTimeout(() => {
      const maxIdx = Math.max(0, weeks.length - effectiveCount);
      setVisibleStartIdx(i => dir === 'left' ? Math.max(0, i - 1) : Math.min(maxIdx, i + 1));
      setSlideDir(null);
      setAnimating(false);
    }, 250);
  }, [animating, canGoBack, canGoForward, weeks.length, effectiveCount]);

  // Effective color: current week = yellow, others = neutral
  const getEffectiveColor = useCallback((globalIdx: number): ColorToken => {
    return globalIdx === currentWeekIdx ? 'yellow' : 'neutral';
  }, [currentWeekIdx]);

  // ── Auto-scroll to current week on first Firebase load ──────────────────────
  // (handled inside onValue callback to avoid racing with initial state)

  // ── Subscribe to Firebase Realtime DB ─────────────────────────────────────
  useEffect(() => {
    const dbRef = ref(db, dbPath);
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
          // Auto-scroll to current week on first load
          if (!didInitialScroll.current && data.weeks?.length > 0) {
            didInitialScroll.current = true;
            const wLen = data.weeks.length;
            const mobile = window.matchMedia('(max-width: 768px)').matches;
            const count = mobile ? 1 : VISIBLE_COUNT;
            if (currentWeekIdx >= 0 && currentWeekIdx < wLen) {
              const maxStart = Math.max(0, wLen - count);
              const ideal = mobile ? currentWeekIdx : Math.max(0, currentWeekIdx - 1);
              setVisibleStartIdx(Math.min(ideal, maxStart));
            } else if (wLen > count) {
              setVisibleStartIdx(wLen - count);
            }
          }
        }
        initialized.current = true;
        setLoaded(true);
        setSyncStatus('synced');
        // reset flag after state updates are flushed
        setTimeout(() => { remoteUpdate.current = false; }, 0);
      },
      (error) => {
        console.error('Firebase error:', error);
        setSyncStatus('error');
        initialized.current = true;
        setLoaded(true);
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
      set(ref(db, dbPath), {
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
  persistRef.current = persist;

  // ── Helpers that update state AND persist ─────────────────────────────────

  const updateWeeks = (next: Week[]) => {
    if (!skipHistory.current) pushHistory(snap());
    skipHistory.current = false;
    setWeeks(next); persist(next, rows, title, subtitle, locked);
  };
  const updateRows = (next: Row[]) => {
    if (!skipHistory.current) pushHistory(snap());
    skipHistory.current = false;
    setRows(next); persist(weeks, next, title, subtitle, locked);
  };
  const updateLocked = (v: boolean) => { setLocked(v); persist(weeks, rows, title, subtitle, v); };

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
    const prev = snap();
    const next = rows.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: (r.cells[weekId] ?? []).filter(c => c.id !== cardId) } }
        : r
    );
    updateRows(next);
    showToast('Карточка удалена', () => { applySnapshot(prev); });
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

  const removeRow = (rowId: string) => {
    const prev = snap();
    updateRows(rows.filter(r => r.id !== rowId));
    showToast('Строка удалена', () => { applySnapshot(prev); });
  };

  // ── Add week ──────────────────────────────────────────────────────────────

  const addWeek = () => {
    const idx = weeks.length;
    const newId = `w${idx + 1}`;
    const newWeek: Week = {
      id: newId,
      label: `Неделя ${idx + 1}`,
      dates: formatWeekDates(idx),
      theme: '',
      color: WEEK_COLORS[idx % WEEK_COLORS.length],
    };
    const nextWeeks = [...weeks, newWeek];
    const nextRows = rows.map(r => ({
      ...r,
      cells: { ...r.cells, [newId]: [] },
    }));
    setWeeks(nextWeeks);
    setRows(nextRows);
    persist(nextWeeks, nextRows, title, subtitle, locked);
    // Navigate to show the new week
    setVisibleStartIdx(Math.max(0, idx + 1 - VISIBLE_COUNT));
  };

  // ── Generate week summary (AI-powered via Groq) ─────────────────────────

  const callAI = async (weekId: string, apiKey: string) => {
    const week = weeks.find(w => w.id === weekId);
    if (!week) return;

    setSummaryLoading(weekId);
    updateWeekTheme(weekId, 'Загрузка...');

    // Group rows into 4 semantic blocks
    const blockMap: Record<string, string> = {
      'согласование': 'Согласование',
      'контент': 'Контент',
      'ui-направление': 'Сайт', 'вайп код дизайн сайта': 'Сайт', 'design system': 'Сайт', 'вайп код верстка сайта': 'Сайт',
      'mvp сервиса': 'Сервис', 'n8n интеграция': 'Сервис', 'продуктовые состояния': 'Сервис', 'qa аналитики': 'Сервис',
    };
    const blocks: Record<string, string[]> = {};
    let totalCount = 0;
    rows.forEach(row => {
      const cards = row.cells[weekId] ?? [];
      if (cards.length === 0) return;
      const block = blockMap[row.label.toLowerCase().trim()] ?? row.label;
      if (!blocks[block]) blocks[block] = [];
      cards.forEach(c => {
        const status = c.done ? '✅' : '⬜';
        blocks[block].push(`${status} ${c.label.split('\n')[0]}`);
        totalCount++;
      });
    });

    if (totalCount === 0) {
      updateWeekTheme(weekId, 'Нет задач');
      setSummaryLoading(null);
      return;
    }

    const blockText = Object.entries(blocks).map(([name, tasks]) => `[${name}]\n${tasks.join('\n')}`).join('\n\n');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 150,
          messages: [
            { role: 'system', content: 'Ты — помощник проджект-менеджера. Пиши кратко на русском.' },
            { role: 'user', content: `Задачи недели "${week.label}" (${week.dates}) сгруппированы по блокам:\n\n${blockText}\n\nНапиши саммери из ТРЁХ коротких частей через « · » (точка по центру). Каждая часть — ключевой конкретный результат одного-двух блоков. Объедини смежные блоки по смыслу.\n\nПравила:\n- НЕ пиши названия блоков (Сайт, Сервис, Контент, Согласование)\n- НЕ начинай с цифр\n- НЕ используй общие слова: «работа над», «согласование», «подготовка», «разработка», «создание»\n- Называй конкретные сущности из задач: «hero + сетка услуг» вместо «дизайн сайта»\n- Каждая часть до 25 символов\n- Формат ответа: «часть1 · часть2 · часть3»\n- Пример: «hero + навигация · auth-флоу · тексты о компании»` },
          ],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        if (res.status === 401) {
          set(ref(db, 'gantt_config/groq_api_key'), null);
          setGroqKey(null);
          updateWeekTheme(weekId, 'Неверный ключ');
          setPendingWeekId(weekId);
          setKeyValue('');
          setShowKeyInput(true);
        } else {
          updateWeekTheme(weekId, `Ошибка API: ${res.status}`);
          console.error('Groq error:', errBody);
        }
        setSummaryLoading(null);
        return;
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim() ?? '';
      updateWeekTheme(weekId, text || 'Пустой ответ от AI');
      setSummaryReady(weekId);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      updateWeekTheme(weekId, `Ошибка: ${msg}`);
      console.error('AI summary error:', e);
    } finally {
      setSummaryLoading(null);
    }
  };

  const [keyValue, setKeyValue] = useState('');
  const [groqKey, setGroqKey] = useState<string | null>(null);

  // Default dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // Load Groq key from Firebase on mount
  useEffect(() => {
    const keyRef = ref(db, 'gantt_config/groq_api_key');
    const unsub = onValue(keyRef, (snap) => {
      const val = snap.val();
      if (val) setGroqKey(val);
    });
    return () => unsub();
  }, []);

  const generateWeekSummary = (weekId: string) => {
    if (groqKey) {
      callAI(weekId, groqKey);
    } else {
      setPendingWeekId(weekId);
      setKeyValue('');
      setShowKeyInput(true);
    }
  };

  const handleKeySubmit = () => {
    const val = keyValue.trim();
    if (!val || !pendingWeekId) return;
    // Save to Firebase so all devices can use it
    set(ref(db, 'gantt_config/groq_api_key'), val);
    setGroqKey(val);
    setShowKeyInput(false);
    const wid = pendingWeekId;
    setPendingWeekId(null);
    callAI(wid, val);
  };

  // ──────────────────────────────────────────────────────────────────────────

  const COL_W = 154;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* API Key input overlay */}
      {showKeyInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowKeyInput(false); setPendingWeekId(null); }}>
          <div className="bg-background border border-border rounded-lg p-6 shadow-xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <p className="font-heading text-[length:var(--text-16)] font-bold mb-1">Groq API Key</p>
            <p className="text-muted-foreground text-[length:var(--text-12)] mb-4">Бесплатно на <a href="https://console.groq.com/keys" target="_blank" rel="noopener" style={{textDecoration:'underline'}}>console.groq.com/keys</a></p>
            <input
              autoFocus
              type="password"
              placeholder="gsk_..."
              value={keyValue}
              onChange={e => setKeyValue(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground font-mono text-[length:var(--text-14)] mb-3 outline-none focus:border-muted-foreground"
              onKeyDown={e => { if (e.key === 'Enter') handleKeySubmit(); }}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowKeyInput(false); setPendingWeekId(null); }} className="px-3 py-1.5 rounded text-[length:var(--text-12)] text-muted-foreground hover:bg-muted">Отмена</button>
              <button onClick={handleKeySubmit} className="px-3 py-1.5 rounded text-[length:var(--text-12)] bg-foreground text-background font-medium hover:opacity-90">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="border-b border-border px-4 py-3 md:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          <span className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.12em] text-muted-foreground">Rocketmind</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.12em] text-muted-foreground">{trackName}</span>
          <span className="text-muted-foreground/30">·</span>
          <SyncDot status={syncStatus} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-4 md:px-8 md:py-6 space-y-4 md:space-y-6">

        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-[length:var(--text-16)] md:text-[length:var(--text-20)] font-bold uppercase tracking-wide mr-auto">
            План работ
          </span>
          <button
            onClick={undo}
            disabled={!canUndo}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-25 disabled:pointer-events-none"
            title="Отменить (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h7a3 3 0 0 1 0 6H8" /><path d="M6 3L3 6l3 3" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-25 disabled:pointer-events-none"
            title="Повторить (Ctrl+Shift+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 6H6a3 3 0 0 0 0 6h2" /><path d="M10 3l3 3-3 3" />
            </svg>
          </button>
          <button
            onClick={() => {
              const html = document.documentElement;
              const isDark = html.classList.contains('dark');
              html.classList.toggle('dark', !isDark);
              html.classList.toggle('light', isDark);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted text-[length:var(--text-14)]"
            title="Сменить тему"
          >
            ◐
          </button>
          <button
            onClick={() => navigateWeeks('left')}
            disabled={!canGoBack || animating}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-25 disabled:pointer-events-none"
            title="Предыдущая неделя"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateWeeks('right')}
            disabled={!canGoForward || animating}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-25 disabled:pointer-events-none"
            title="Следующая неделя"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          {!locked && (
            <button
              onClick={addWeek}
              className="h-8 px-3 flex items-center gap-1 rounded-lg border border-border text-[length:var(--text-12)] font-mono transition-colors hover:bg-muted"
              title="Добавить неделю"
            >
              + неделя
            </button>
          )}
        </div>

        {/* Gantt table */}
        <div className="border border-border rounded-xl overflow-hidden relative">
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              minWidth: isMobile ? '100%' : COL_W + shownWeeks.length * 240,
              transform: slideDir ? `translateX(${slideDir === 'left' ? '40px' : '-40px'})` : 'translateX(0)',
              opacity: slideDir ? 0.6 : 1,
              transition: slideDir ? 'transform 0.25s ease-out, opacity 0.25s ease-out' : 'none',
            }}>

              {/* Header */}
              <div className="flex border-b border-border bg-muted/40 sticky top-0 z-10">
                <div
                  className="flex-shrink-0 px-2 py-3 md:px-4 border-r border-border text-[length:var(--text-12)] font-mono uppercase tracking-wide text-muted-foreground bg-muted/40"
                  style={isMobile ? { width: '30%', minWidth: 0 } : { width: COL_W, minWidth: COL_W }}
                >
                  Раздел
                </div>
                {shownWeeks.map((w, localIdx) => {
                  const globalIdx = visibleStartIdx + localIdx;
                  const isCurrent = globalIdx === currentWeekIdx;
                  const effColor = getEffectiveColor(globalIdx);
                  return (
                    <div
                      key={w.id}
                      className="flex-1 px-2 py-2 md:px-3 md:py-2.5 border-r border-border last:border-r-0 relative overflow-hidden"
                      style={{
                        minWidth: isMobile ? 0 : 240,
                        backgroundColor: isCurrent ? cssVar('yellow', '900') : undefined,
                        borderTop: `2px solid ${cssVar(effColor, '100')}`,
                      }}
                    >
                      {/* Row 1: label + dates + badge */}
                      <div className="flex items-center gap-1.5">
                        <div className="font-mono text-[length:var(--text-12)] font-bold uppercase tracking-wide" style={{ color: cssVar(effColor, '100') }}>
                          <EditableText value={w.label} onChange={v => updateWeekLabel(w.id, v)} />
                        </div>
                        <div className="font-mono text-[length:var(--text-12)]" style={{ color: isCurrent ? cssVar('yellow', '500') : 'var(--muted-foreground)' }}>
                          <EditableText value={w.dates} onChange={v => updateWeekDates(w.id, v)} />
                        </div>
                        {isCurrent && (
                          <span
                            className="ml-auto px-1.5 py-0.5 rounded text-[length:9px] font-mono uppercase tracking-wider flex-shrink-0"
                            style={{ backgroundColor: cssVar('yellow', '100'), color: cssVar('yellow', 'fg') }}
                          >
                            сейчас
                          </span>
                        )}
                      </div>
                      {/* Row 2: theme/summary + refresh */}
                      <div className="flex items-start gap-1 mt-1">
                        <p className="text-[length:var(--text-12)] leading-snug flex-1 min-w-0" style={{ color: cssVar(effColor, 'fg-subtle') }}>
                          <EditableText value={w.theme} onChange={v => { updateWeekTheme(w.id, v); setSummaryReady(null); }} startEditing={summaryReady === w.id} />
                        </p>
                        <button
                          onClick={() => generateWeekSummary(w.id)}
                          disabled={summaryLoading === w.id}
                          className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded transition-colors text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted mt-0.5"
                          title="Сгенерировать итог недели"
                        >
                          {summaryLoading === w.id ? (
                            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <RefreshIcon className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  draggable={!isMobile}
                  onDragStart={isMobile ? undefined : e => onRowDragStart(e, idx)}
                  onDragOver={isMobile ? undefined : e => onRowDragOver(e, idx)}
                  onDrop={isMobile ? undefined : e => onRowDrop(e, idx)}
                  onDragEnd={isMobile ? undefined : onRowDragEnd}
                >
                  {/* Left column */}
                  <div
                    className="flex-shrink-0 flex items-start gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-3 border-r border-border bg-background"
                    style={isMobile ? { width: '30%', minWidth: 0 } : { width: COL_W, minWidth: COL_W }}
                  >
                    {!isMobile && (
                      <span
                        className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground transition-colors select-none flex-shrink-0 mt-0.5 text-[length:var(--text-16)] leading-none"
                        title="Перетащить строку"
                      >
                        ⠿
                      </span>
                    )}
                    <span className="text-[length:var(--text-12)] font-medium text-foreground flex-1 min-w-0 mt-0.5">
                      <EditableText value={row.label} onChange={v => updateRowLabel(row.id, v)} />
                    </span>
                    {!isMobile && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="flex-shrink-0 text-muted-foreground/20 hover:text-destructive transition-colors text-[length:var(--text-14)] leading-none mt-0.5"
                        title="Удалить строку"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Week cells */}
                  {shownWeeks.map((w, localIdx) => {
                    const globalIdx = visibleStartIdx + localIdx;
                    const isCurrent = globalIdx === currentWeekIdx;
                    const effColor = getEffectiveColor(globalIdx);
                    const cards = row.cells?.[w.id] ?? [];
                    return (
                      <div
                        key={w.id}
                        className="flex-1 px-1.5 py-1.5 md:px-2 md:py-2 border-r border-border/40 last:border-r-0"
                        style={{
                          minWidth: isMobile ? 0 : 240,
                          backgroundColor: isCurrent ? `color-mix(in srgb, ${cssVar('yellow', '900')}, transparent 60%)` : undefined,
                        }}
                        onDragOver={e => onCardDragOver(e, row.id, w.id, null)}
                        onDrop={e => onCardDrop(e, row.id, w.id, null)}
                      >
                        {!locked && (
                          <button
                            onClick={() => addCard(row.id, w.id)}
                            className="w-full mb-1.5 flex items-center justify-center gap-1 rounded text-[length:var(--text-12)] font-mono uppercase tracking-wide transition-colors"
                            style={{
                              height: 18,
                              color: cssVar(effColor, 'fg-subtle'),
                              opacity: 0.35,
                              backgroundColor: cssVar(effColor, '900'),
                              border: `1px dashed ${cssVar(effColor, '300')}`,
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
                                  <div className="h-0.5 mx-1 rounded-full mb-1" style={{ backgroundColor: cssVar(effColor, '100') }} />
                                )}
                                <div className="mb-1.5">
                                  <CardItem
                                    card={c}
                                    weekColor={effColor}
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
                            <div className="h-0.5 mx-1 rounded-full mb-1" style={{ backgroundColor: cssVar(effColor, '100') }} />
                          )}
                          {cards.length === 0 && (
                            <div className="min-h-[40px] rounded-sm border border-dashed border-border/0 hover:border-border/40 transition-colors" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton overlay while loading from Firebase */}
          {!loaded && (
            <div className="absolute inset-0 z-20 bg-background/95 flex flex-col">
              {/* Skeleton header */}
              <div className="flex border-b border-border">
                <div className="flex-shrink-0 px-4 py-4" style={isMobile ? { width: '30%' } : { width: COL_W }}>
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
                {Array.from({ length: effectiveCount }).map((_, i) => (
                  <div key={i} className="flex-1 px-3 py-3 border-l border-border">
                    <div className="h-3 w-20 rounded bg-muted animate-pulse mb-2" />
                    <div className="h-2 w-28 rounded bg-muted/60 animate-pulse" />
                  </div>
                ))}
              </div>
              {/* Skeleton rows */}
              {[0, 1, 2, 3].map(r => (
                <div key={r} className="flex border-b border-border/40">
                  <div className="flex-shrink-0 px-4 py-4" style={isMobile ? { width: '30%' } : { width: COL_W }}>
                    <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                  </div>
                  {Array.from({ length: effectiveCount }).map((_, i) => (
                    <div key={i} className="flex-1 px-3 py-3 border-l border-border/40 space-y-2">
                      <div className="h-16 rounded-lg bg-muted/50 animate-pulse" />
                      <div className="h-12 rounded-lg bg-muted/30 animate-pulse" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-3 md:gap-4 text-[length:var(--text-12)] text-muted-foreground font-mono pb-2">
          {!locked && (
            <button
              onClick={addRow}
              className="border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors text-foreground flex-shrink-0"
            >
              + строка
            </button>
          )}
          <div className="hidden md:flex items-center gap-4 flex-1">
            {!locked && (
              <>
                <span>⠿ перетащить строку</span>
                <span>⬌ перетащить карточку</span>
                <span>двойной клик — редактировать</span>
              </>
            )}
            {locked && <span className="text-muted-foreground/60">Редактирование заблокировано</span>}
          </div>
          <div className="flex-1 md:hidden" />
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

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* slideUp animation for toasts */}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>

    </div>
  );
}
