"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Button, Checkbox, Tabs, TabsList, TabsTrigger, Tooltip, TooltipTrigger, TooltipContent, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@rocketmind/ui';
import { toast } from 'sonner';

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

// ─── Zoom-in helpers ─────────────────────────────────────────────────────────

const DAY_COL_LABELS = ['Без дня', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт'] as const;

type PlacedCard = {
  card: Card;
  colStart: number; // 0 = unsorted, 1–5 = пн–пт
  colEnd: number;   // exclusive
  gridRow: number;
};

function placeCardsOnGrid(cards: Card[]): { placed: PlacedCard[]; rowCount: number } {
  const items = cards.map(c => {
    const days = c.days ?? [];
    if (days.length === 0) return { card: c, colStart: 0, colEnd: 1 };
    const indices = days.map(d => DAYS.indexOf(d)).filter(i => i >= 0).sort((a, b) => a - b);
    return { card: c, colStart: indices[0] + 1, colEnd: indices[indices.length - 1] + 2 };
  });
  const occupied: boolean[][] = [];
  const placed: PlacedCard[] = [];
  for (const item of items) {
    let row = 0;
    while (true) {
      if (!occupied[row]) occupied[row] = Array(6).fill(false);
      let fits = true;
      for (let col = item.colStart; col < item.colEnd; col++) {
        if (occupied[row][col]) { fits = false; break; }
      }
      if (fits) break;
      row++;
    }
    if (!occupied[row]) occupied[row] = Array(6).fill(false);
    for (let col = item.colStart; col < item.colEnd; col++) {
      occupied[row][col] = true;
    }
    placed.push({ card: item.card, colStart: item.colStart, colEnd: item.colEnd, gridRow: row });
  }
  return { placed, rowCount: occupied.length || 1 };
}

type Row = {
  id: string;
  label: string;
  cells: Record<string, Card[]>; // weekId → список карточек
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

export const PROJECT_START = new Date(2026, 2, 9); // 9 марта 2026 (понедельник)
const VISIBLE_COUNT = 4;
export const MONTH_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export function getWeekRange(weekIndex: number): { start: Date; end: Date } {
  const start = new Date(PROJECT_START);
  start.setDate(start.getDate() + weekIndex * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export function formatWeekDates(weekIndex: number): string {
  const { start, end } = getWeekRange(weekIndex);
  const sm = MONTH_SHORT[start.getMonth()];
  const em = MONTH_SHORT[end.getMonth()];
  if (sm === em) return `${start.getDate()}–${end.getDate()} ${sm}`;
  return `${start.getDate()} ${sm} – ${end.getDate()} ${em}`;
}

export function getCurrentWeekIndex(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - PROJECT_START.getTime();
  if (diffMs < 0) return -1;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
}

/** Find local index of the week that contains today, by parsing week dates */
function findCurrentWeekLocal(weeks: Week[]): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = 0; i < weeks.length; i++) {
    const globalIdx = parseWeekGlobalIndex(weeks[i].dates);
    if (globalIdx < 0) continue;
    const { start, end } = getWeekRange(globalIdx);
    if (now >= start && now <= end) return i;
  }
  return -1;
}

/** Recover global week index from formatted dates string */
function parseWeekGlobalIndex(dates: string): number {
  // Brute-force: compare formatted string against known week indices
  for (let i = 0; i < 200; i++) {
    if (formatWeekDates(i) === dates) return i;
  }
  return -1;
}

// ─── Template for new tracks ─────────────────────────────────────────────────

function card(label: string, done = false): Card {
  return { id: `c${Math.random().toString(36).slice(2)}`, label, done, days: [] };
}

function createTemplate(color: ColorToken, startWeekIdx?: number) {
  const startIdx = startWeekIdx ?? Math.max(0, getCurrentWeekIndex());
  const weeks: Week[] = Array.from({ length: 4 }, (_, i) => ({
    id: `w${i + 1}`,
    label: `Неделя ${i + 1}`,
    dates: formatWeekDates(startIdx + i),
    theme: '',
    color,
  }));
  const emptyCells: Record<string, Card[]> = {};
  weeks.forEach(w => { emptyCells[w.id] = []; });
  const rows: Row[] = [
    { id: 'r1', label: 'Согласование', cells: { ...emptyCells } },
    { id: 'r2', label: 'Процессные задачи', cells: { ...emptyCells, w1: [card('Заполнить план работ')] } },
  ];
  return { weeks, rows, title: 'План работ', subtitle: '', startWeekIdx: startIdx };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────


// ─── EditableText ─────────────────────────────────────────────────────────────

function EditableText({
  value, onChange, className, style, startEditing, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  className?: string; style?: React.CSSProperties;
  startEditing?: boolean; placeholder?: string;
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
      {value || <span className="opacity-40">{placeholder}</span>}
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
  zoomIn,
  onResizeStart,
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
  zoomIn?: boolean;
  onResizeStart?: (e: React.MouseEvent, side: 'left' | 'right') => void;
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
      {/* Zoom-in: delete button top-right */}
      {zoomIn && !locked && (
        <Tooltip>
          <TooltipTrigger render={
            <Button variant="ghost" size="icon-micro" onClick={onRemove} className="absolute top-1.5 right-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive z-10" />
          }>
            ×
          </TooltipTrigger>
          <TooltipContent>Удалить задачу</TooltipContent>
        </Tooltip>
      )}

      {/* Top row: checkbox + days + remove */}
      <div className="flex items-center gap-1.5 mb-[4px]" style={{ '--checkbox-accent': cssVar(weekColor, '100'), '--checkbox-accent-fg': cssVar(weekColor, 'fg') } as React.CSSProperties}>
        <Tooltip>
          <TooltipTrigger render={<span className="flex-shrink-0" />}>
            <Checkbox checked={c.done} onChange={onToggleDone} />
          </TooltipTrigger>
          <TooltipContent>{c.done ? 'Готово' : 'Отметить как готово'}</TooltipContent>
        </Tooltip>

        {!zoomIn && (
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
        )}
        {!locked && !zoomIn && (
          <Tooltip>
            <TooltipTrigger render={
              <Button variant="ghost" size="icon-micro" onClick={onRemove} className="flex-shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive" />
            }>
              ×
            </TooltipTrigger>
            <TooltipContent>Удалить задачу</TooltipContent>
          </Tooltip>
        )}
      </div>

      {editing ? (
        <textarea
          ref={taRef}
          defaultValue={c.label}
          className={`w-full bg-transparent outline-none resize-none leading-snug ${zoomIn ? 'text-[length:var(--text-14)]' : 'text-[length:var(--text-12)]'}`}
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
        <div
          className="space-y-0.5 cursor-text"
          onDoubleClick={locked ? undefined : startEdit}
          title={locked ? undefined : 'Двойной клик — редактировать'}
        >
          {(lines.length > 0 ? lines : [c.label]).map((line, i) => {
            const openColor = cssCardText(weekColor);
            return (
            <p key={i} className={`leading-snug ${zoomIn ? 'text-[length:var(--text-14)]' : 'text-[length:var(--text-12)]'}`} style={{ color: c.done ? cssVar(weekColor, 'fg-subtle') : openColor }}>
              {line}
            </p>
            );
          })}
        </div>
      )}

      {/* Resize handles — zoom-in mode */}
      {zoomIn && !locked && onResizeStart && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-10 hover:bg-white/10 transition-colors rounded-l-lg"
            onMouseDown={e => { e.stopPropagation(); onResizeStart(e, 'left'); }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-10 hover:bg-white/10 transition-colors rounded-r-lg"
            onMouseDown={e => { e.stopPropagation(); onResizeStart(e, 'right'); }}
          />
        </>
      )}
    </div>
  );
}

// ─── Lock modal ───────────────────────────────────────────────────────────────

const LOCK_PASSWORD = '2345';

function LockModal({ open, onClose, onUnlock }: { open: boolean; onClose: () => void; onUnlock: () => void }) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);

  const submit = () => {
    if (val === LOCK_PASSWORD) { onUnlock(); setVal(''); }
    else { setErr(true); setVal(''); setTimeout(() => setErr(false), 1200); }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { onClose(); setVal(''); } }}>
      <DialogContent className="max-w-[320px]">
        <DialogHeader className="text-center items-center">
          <div className="text-[length:var(--text-25)] mb-1">🔒</div>
          <DialogTitle>Введите пароль</DialogTitle>
          <DialogDescription>для разблокировки редактирования</DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          aria-invalid={err || undefined}
          placeholder="Пароль"
          autoComplete="off"
        />
        {err && <p className="text-[length:var(--text-12)] text-destructive mt-1.5">Неверный пароль</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); setVal(''); }}>Отмена</Button>
          <Button onClick={submit}>Войти</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    <Tooltip>
      <TooltipTrigger render={<span className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{ backgroundColor: color }} />} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
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


// ─── Main board (default export) ─────────────────────────────────────────────

// ─── Undo / Redo types ───────────────────────────────────────────────────────

type Snapshot = { weeks: Week[]; rows: Row[]; title: string; subtitle: string; locked: boolean };
const MAX_HISTORY = 50;

// ─── Toast (via DS Toaster + sonner) ────────────────────────────────────────

export default function GanttBoard({ dbPath, trackName, trackColor = 'yellow', startWeekIdx }: { dbPath: string; trackName: string; trackColor?: string; startWeekIdx?: number }) {
  const COL_W = 154;
  const tmpl = createTemplate(trackColor as ColorToken, startWeekIdx);
  const [weeks, setWeeks] = useState<Week[]>(tmpl.weeks);
  const [rows, setRows] = useState<Row[]>(tmpl.rows);
  const [title, setTitle] = useState(tmpl.title);
  const [subtitle, setSubtitle] = useState(tmpl.subtitle);
  const [locked, setLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error' | 'loading'>('loading');

  // ── Zoom mode (desktop/tablet only) ──────────────────────────────────────
  const [zoomMode, setZoomMode] = useState<'out' | 'in'>('out');

  // ── Resize state (zoom-in card resizing) ─────────────────────────────────
  const resizeRef = useRef<{
    cardId: string; rowId: string; weekId: string;
    side: 'left' | 'right'; anchorDayIdx: number;
    gridRect: DOMRect; lastDays: Day[];
  } | null>(null);
  const gridRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const [needsPersistAfterResize, setNeedsPersistAfterResize] = useState(false);

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

  // ── Toasts (sonner) ───────────────────────────────────────────────────────
  const showToast = useCallback((message: string, onUndo?: () => void) => {
    if (onUndo) {
      toast(message, { action: { label: 'Отменить', onClick: onUndo } });
    } else {
      toast(message);
    }
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

  // Week navigation — start at 0, auto-scroll on first Firebase load
  const [visibleStartIdx, setVisibleStartIdx] = useState(0);

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

  // ── Current week (local index, calendar-based) ─────────────────────────────
  const currentWeekIdx = useMemo(() => findCurrentWeekLocal(weeks), [weeks]);

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

  // ── Dynamic column count based on container width ──────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const [fittingCount, setFittingCount] = useState(VISIBLE_COUNT);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const MIN_COL = 240;
    const measure = () => {
      const available = el.clientWidth - COL_W;
      setFittingCount(Math.max(1, Math.floor(available / MIN_COL)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Visible weeks ──────────────────────────────────────────────────────────
  const effectiveCount = isMobile ? 1 : fittingCount;
  const visibleWeeks = useMemo(() => {
    return weeks.slice(visibleStartIdx, visibleStartIdx + effectiveCount);
  }, [weeks, visibleStartIdx, effectiveCount]);
  const shownWeeks = isMobile ? weeks.slice(visibleStartIdx, visibleStartIdx + 1) : visibleWeeks;

  const canGoBack = visibleStartIdx > 0;
  // In zoom-in mode only 1 week is shown at a time
  const visibleSpan = (!isMobile && zoomMode === 'in') ? 1 : effectiveCount;
  const canGoForward = visibleStartIdx + visibleSpan < weeks.length;

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
      const maxIdx = Math.max(0, weeks.length - visibleSpan);
      setVisibleStartIdx(i => dir === 'left' ? Math.max(0, i - 1) : Math.min(maxIdx, i + 1));
      setSlideDir(null);
      setAnimating(false);
    }, 250);
  }, [animating, canGoBack, canGoForward, weeks.length, visibleSpan]);

  // Effective color: current week = track color, others = neutral
  const getEffectiveColor = useCallback((localIdx: number): ColorToken => {
    return localIdx === currentWeekIdx ? (trackColor as ColorToken) : 'neutral';
  }, [currentWeekIdx, trackColor]);

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
          if (data.rows) setRows(data.rows.map((r: Row) => ({ ...r, cells: r.cells ?? {} })));
          if (data.title) setTitle(data.title);
          if (data.subtitle) setSubtitle(data.subtitle);
          if (data.locked !== undefined) setLocked(data.locked);
          // Auto-scroll to current week on first load
          if (!didInitialScroll.current && data.weeks?.length > 0) {
            didInitialScroll.current = true;
            const localCurrent = findCurrentWeekLocal(data.weeks);
            const wLen = data.weeks.length;
            const mobile = window.matchMedia('(max-width: 768px)').matches;
            const count = mobile ? 1 : VISIBLE_COUNT;
            if (localCurrent >= 0 && localCurrent < wLen) {
              const maxStart = Math.max(0, wLen - count);
              const ideal = mobile ? localCurrent : Math.max(0, localCurrent - 1);
              setVisibleStartIdx(Math.min(ideal, maxStart));
            } else if (wLen > count) {
              setVisibleStartIdx(wLen - count);
            }
          }
        } else {
          // Empty track — save template to Firebase
          const t = createTemplate(trackColor as ColorToken, startWeekIdx);
          set(ref(db, dbPath), {
            weeks: t.weeks, rows: t.rows,
            title: t.title, subtitle: t.subtitle, locked: false,
          });
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

  // ── Zoom-in card drag (column-aware) ──────────────────────────────────────
  const [zoomInDropCol, setZoomInDropCol] = useState<{ rowId: string; col: number } | null>(null);

  const onZoomInDragOver = (e: React.DragEvent, rowId: string, gridEl: HTMLDivElement | null) => {
    e.preventDefault(); e.stopPropagation();
    if (!dragCard.current || !gridEl) return;
    const rect = gridEl.getBoundingClientRect();
    const col = Math.max(1, Math.min(5, Math.floor((e.clientX - rect.left) / (rect.width / 6))));
    setZoomInDropCol({ rowId, col });
  };

  const onZoomInDrop = (e: React.DragEvent, toRowId: string, weekId: string, gridEl: HTMLDivElement | null) => {
    e.preventDefault(); e.stopPropagation();
    setCardDropTarget(null);
    setZoomInDropCol(null);
    const from = dragCard.current;
    if (!from || !gridEl) return;

    // Find source card to preserve span width
    const srcRow = rows.find(r => r.id === from.rowId);
    const srcCard = srcRow?.cells[from.weekId]?.find(c => c.id === from.cardId);
    if (!srcCard) return;

    const srcDays = srcCard.days ?? [];
    const srcIndices = srcDays.map(d => DAYS.indexOf(d)).filter(i => i >= 0).sort((a, b) => a - b);
    const spanWidth = srcIndices.length > 0 ? srcIndices[srcIndices.length - 1] - srcIndices[0] + 1 : 1;

    // Compute target column from mouse position (skip col 0 = "Без дня")
    const rect = gridEl.getBoundingClientRect();
    let targetCol = Math.floor((e.clientX - rect.left) / (rect.width / 6));
    targetCol = Math.max(1, Math.min(5, targetCol));

    // New days: preserve span width, clamp to пт
    const startDayIdx = targetCol - 1;
    const endDayIdx = Math.min(startDayIdx + spanWidth - 1, 4);
    const newDays: Day[] = ([...DAYS] as Day[]).slice(startDayIdx, endDayIdx + 1);

    // Same row + same days → skip
    if (from.rowId === toRowId && from.weekId === weekId && JSON.stringify(srcDays.sort()) === JSON.stringify(newDays.sort())) return;

    // Move card: remove from source, add to target with new days
    let movedCard: Card | null = null;
    let next = rows.map(row => {
      if (row.id !== from.rowId) return row;
      const cards = row.cells[from.weekId] ?? [];
      const idx = cards.findIndex(c => c.id === from.cardId);
      if (idx === -1) return row;
      movedCard = { ...cards[idx], days: newDays };
      return { ...row, cells: { ...row.cells, [from.weekId]: cards.filter(c => c.id !== from.cardId) } };
    });
    if (!movedCard) return;

    next = next.map(row => {
      if (row.id !== toRowId) return row;
      return { ...row, cells: { ...row.cells, [weekId]: [...(row.cells[weekId] ?? []), movedCard!] } };
    });

    updateRows(next);
    dragCard.current = null;
    isCardDragging.current = false;
  };

  const onZoomInDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the grid entirely
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !(e.currentTarget as HTMLElement).contains(related)) {
      setZoomInDropCol(null);
    }
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  const updateRowLabel = (rowId: string, val: string) => {
    const next = rows.map(r => r.id === rowId ? { ...r, label: val } : r);
    updateRows(next);
  };

  const addCard = (rowId: string, weekId: string, day?: Day) => {
    const c = card('Новая задача');
    if (day) c.days = [day];
    const next = rows.map(r =>
      r.id === rowId
        ? { ...r, cells: { ...r.cells, [weekId]: [c, ...(r.cells[weekId] ?? [])] } }
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

  // ── Zoom-in: card resize ───────────────────────────────────────────────────

  const startCardResize = useCallback((
    e: React.MouseEvent, side: 'left' | 'right',
    cardId: string, rowId: string, weekId: string,
  ) => {
    e.preventDefault(); e.stopPropagation();
    const gridEl = gridRefsMap.current.get(rowId);
    if (!gridEl) return;
    const row = rows.find(r => r.id === rowId);
    const c = row?.cells[weekId]?.find(x => x.id === cardId);
    if (!c) return;
    const dayIndices = (c.days ?? []).map(d => DAYS.indexOf(d)).filter(i => i >= 0).sort((a, b) => a - b);
    let anchorDayIdx: number;
    if (side === 'right') {
      anchorDayIdx = dayIndices.length > 0 ? dayIndices[0] : 0;
    } else {
      if (dayIndices.length === 0) return;
      anchorDayIdx = dayIndices[dayIndices.length - 1];
    }
    pushHistory(snap());
    resizeRef.current = { cardId, rowId, weekId, side, anchorDayIdx, gridRect: gridEl.getBoundingClientRect(), lastDays: [...(c.days ?? [])] };
  }, [rows, pushHistory, snap]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rs = resizeRef.current;
      if (!rs) return;
      const relX = e.clientX - rs.gridRect.left;
      const colWidth = rs.gridRect.width / 6;
      let col = Math.floor(relX / colWidth);
      col = Math.max(0, Math.min(5, col));
      let newDays: Day[];
      if (col === 0) { newDays = []; }
      else {
        const dayIdx = col - 1;
        if (rs.side === 'right') {
          const start = rs.anchorDayIdx;
          const end = Math.max(start, dayIdx);
          newDays = ([...DAYS] as Day[]).slice(start, end + 1);
        } else {
          const end = rs.anchorDayIdx;
          const start = Math.min(end, dayIdx);
          newDays = ([...DAYS] as Day[]).slice(start, end + 1);
        }
      }
      if (JSON.stringify(rs.lastDays) === JSON.stringify(newDays)) return;
      rs.lastDays = newDays;
      setRows(prev => prev.map(r =>
        r.id === rs.rowId
          ? { ...r, cells: { ...r.cells, [rs.weekId]: (r.cells[rs.weekId] ?? []).map(c => c.id === rs.cardId ? { ...c, days: newDays } : c) } }
          : r
      ));
    };
    const onUp = () => {
      if (!resizeRef.current) return;
      resizeRef.current = null;
      setNeedsPersistAfterResize(true);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, []);

  useEffect(() => {
    if (!needsPersistAfterResize) return;
    setNeedsPersistAfterResize(false);
    skipHistory.current = true;
    persist(weeks, rows, title, subtitle, locked);
  }, [needsPersistAfterResize, weeks, rows, title, subtitle, locked, persist]);

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
    // Derive global index from the last week's dates + 1
    const lastGlobal = weeks.length > 0 ? parseWeekGlobalIndex(weeks[weeks.length - 1].dates) + 1 : getCurrentWeekIndex() + idx;
    const newWeek: Week = {
      id: newId,
      label: `Неделя ${idx + 1}`,
      dates: formatWeekDates(lastGlobal),
      theme: '',
      color: trackColor as ColorToken,
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

  // ── Generate week summary (AI-powered) ─────────────────────────────────

  type AiProvider = 'openrouter' | 'groq';

  const AI_PROVIDERS: Record<AiProvider, { url: string; model: string; label: string; keyPrefix: string; keyHint: string; keyUrl: string }> = {
    openrouter: {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'qwen/qwen3.6-plus:free',
      label: 'OpenRouter API Key',
      keyPrefix: 'sk-or-',
      keyHint: 'Бесплатно на',
      keyUrl: 'https://openrouter.ai/settings/keys',
    },
    groq: {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.1-8b-instant',
      label: 'Groq API Key',
      keyPrefix: 'gsk_',
      keyHint: 'Бесплатно на',
      keyUrl: 'https://console.groq.com/keys',
    },
  };

  const SUMMARY_MESSAGES = (dates: string, blockText: string) => [
    { role: 'system' as const, content: 'Ты пишешь однострочные саммери проекта для заказчика. Формат: тезисы через « · ». Конкретные результаты и артефакты, которые получает клиент. Без глаголов, без вводных слов. Начинай сразу с первого тезиса. Русский.' },
    { role: 'user' as const, content: `Задачи недели (${dates}):\n\n${blockText}\n\nСаммери одной строкой. 1–4 тезиса по объёму.\n- Похожие задачи объединяй с количеством\n- Задачи одной темы из разных треков — объединяй по теме\n- Процессы (встреча, согласование, ревью) — называй результат: «утверждённый план» вместо «согласование плана»\n\nПримеры:\nhero + сетка услуг · auth-флоу · тексты о компании\n5 экранов SaaS · вебхуки оплаты\nстратегия бренда · 3 воркшопа с командой · гайдлайн tone of voice\nкаталог: макет + API + тесты · 6 текстов лендинга\nутверждённая орг-структура · 4 домашних задания · отчёт по метрикам` },
  ];

  const callAI = async (weekId: string, apiKey: string, provider: AiProvider) => {
    const week = weeks.find(w => w.id === weekId);
    if (!week) return;

    setSummaryLoading(weekId);
    updateWeekTheme(weekId, 'Загрузка...');

    // Collect tasks grouped by track name
    const blocks: Record<string, string[]> = {};
    let totalCount = 0;
    rows.forEach(row => {
      const cards = row.cells[weekId] ?? [];
      if (cards.length === 0) return;
      if (!blocks[row.label]) blocks[row.label] = [];
      cards.forEach(c => {
        blocks[row.label].push(c.label.split('\n')[0]);
        totalCount++;
      });
    });

    if (totalCount === 0) {
      updateWeekTheme(weekId, 'Нет задач');
      setSummaryLoading(null);
      return;
    }

    const blockText = Object.entries(blocks).map(([name, tasks]) => `— ${name}: ${tasks.join(', ')}`).join('\n');
    const cfg = AI_PROVIDERS[provider];

    try {
      const res = await fetch(cfg.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: cfg.model,
          max_tokens: 100,
          messages: SUMMARY_MESSAGES(week.dates, blockText),
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        if (res.status === 401) {
          set(ref(db, `gantt_config/${provider}_api_key`), null);
          setAiKey(null);
          updateWeekTheme(weekId, 'Неверный ключ');
          setPendingWeekId(weekId);
          setKeyValue('');
          setShowKeyInput(true);
        } else {
          updateWeekTheme(weekId, `Ошибка API: ${res.status}`);
          console.error('AI summary error:', errBody);
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
  const [aiProvider, setAiProvider] = useState<AiProvider>('openrouter');
  const [aiKey, setAiKey] = useState<string | null>(null);

  // Default dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // Load AI provider + key from Firebase on mount
  useEffect(() => {
    const provRef = ref(db, 'gantt_config/ai_provider');
    const unsub1 = onValue(provRef, (snap) => {
      const val = snap.val() as AiProvider | null;
      if (val && AI_PROVIDERS[val]) setAiProvider(val);
    });
    return () => unsub1();
  }, []);

  useEffect(() => {
    const keyRef = ref(db, `gantt_config/${aiProvider}_api_key`);
    const unsub = onValue(keyRef, (snap) => {
      const val = snap.val();
      setAiKey(val ?? null);
    });
    return () => unsub();
  }, [aiProvider]);

  const generateWeekSummary = (weekId: string) => {
    if (aiKey) {
      callAI(weekId, aiKey, aiProvider);
    } else {
      setPendingWeekId(weekId);
      setKeyValue('');
      setShowKeyInput(true);
    }
  };

  const handleKeySubmit = () => {
    const val = keyValue.trim();
    if (!val || !pendingWeekId) return;
    set(ref(db, `gantt_config/${aiProvider}_api_key`), val);
    setAiKey(val);
    setShowKeyInput(false);
    const wid = pendingWeekId;
    setPendingWeekId(null);
    callAI(wid, val, aiProvider);
  };

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* API Key input dialog */}
      <Dialog open={showKeyInput} onOpenChange={v => { if (!v) { setShowKeyInput(false); setPendingWeekId(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{AI_PROVIDERS[aiProvider].label}</DialogTitle>
            <DialogDescription>{AI_PROVIDERS[aiProvider].keyHint} <a href={AI_PROVIDERS[aiProvider].keyUrl} target="_blank" rel="noopener" className="underline">{AI_PROVIDERS[aiProvider].keyUrl.replace('https://', '')}</a></DialogDescription>
          </DialogHeader>
          <div className="flex gap-1 mb-1">
            {(Object.keys(AI_PROVIDERS) as AiProvider[]).map(p => (
              <Button key={p} variant={aiProvider === p ? 'default' : 'ghost'} size="xs" onClick={() => { setAiProvider(p); set(ref(db, 'gantt_config/ai_provider'), p); setKeyValue(''); }}>{p}</Button>
            ))}
          </div>
          <Input
            autoFocus
            type="password"
            placeholder={`${AI_PROVIDERS[aiProvider].keyPrefix}...`}
            value={keyValue}
            onChange={e => setKeyValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleKeySubmit(); }}
            className="font-mono"
          />
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => { setShowKeyInput(false); setPendingWeekId(null); }}>Отмена</Button>
            <Button size="sm" onClick={handleKeySubmit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" onClick={undo} disabled={!canUndo} />}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h7a3 3 0 0 1 0 6H8" /><path d="M6 3L3 6l3 3" />
              </svg>
            </TooltipTrigger>
            <TooltipContent>Отменить (Ctrl+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" onClick={redo} disabled={!canRedo} />}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 6H6a3 3 0 0 0 0 6h2" /><path d="M10 3l3 3-3 3" />
              </svg>
            </TooltipTrigger>
            <TooltipContent>Повторить (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={
              <Button variant="outline" size="icon" onClick={() => {
                const html = document.documentElement;
                const isDark = html.classList.contains('dark');
                html.classList.toggle('dark', !isDark);
                html.classList.toggle('light', isDark);
              }} />
            }>
              ◐
            </TooltipTrigger>
            <TooltipContent>Сменить тему</TooltipContent>
          </Tooltip>
          {/* Zoom In / Out switch — desktop & tablet only (DS Text Switch via Tabs) */}
          {!isMobile && (
            <Tabs
              value={zoomMode}
              onValueChange={(v: string | number | null) => {
                const mode = v as 'out' | 'in';
                setZoomMode(mode);
                if (mode === 'in' && currentWeekIdx >= 0 && currentWeekIdx < weeks.length) {
                  setVisibleStartIdx(currentWeekIdx);
                }
              }}
            >
              <TabsList size="sm">
                <TabsTrigger value="out">Out</TabsTrigger>
                <TabsTrigger value="in">In</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" onClick={() => navigateWeeks('left')} disabled={!canGoBack || animating} />}>
              <ChevronLeftIcon className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>Предыдущая неделя</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" onClick={() => navigateWeeks('right')} disabled={!canGoForward || animating} />}>
              <ChevronRightIcon className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>Следующая неделя</TooltipContent>
          </Tooltip>
          {!locked && (
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="sm" onClick={addWeek} />}>
                + неделя
              </TooltipTrigger>
              <TooltipContent>Добавить неделю</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Gantt table */}
        <div ref={containerRef} className="border border-border rounded-xl overflow-hidden relative">
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              transform: slideDir ? `translateX(${slideDir === 'left' ? '40px' : '-40px'})` : 'translateX(0)',
              opacity: slideDir ? 0.6 : 1,
              transition: slideDir ? 'transform 0.25s ease-out, opacity 0.25s ease-out' : 'none',
            }}>

              {/* ═══ ZOOM OUT — Header (weeks) ═══ */}
              {(isMobile || zoomMode === 'out') && (
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
                      className="group/week flex-1 px-2 py-2 md:px-3 md:py-2.5 border-r border-border last:border-r-0 relative overflow-hidden"
                      style={{
                        minWidth: 0,
                        backgroundColor: isCurrent ? cssVar(effColor, '900') : undefined,
                        borderTop: `2px solid ${cssVar(effColor, '100')}`,
                      }}
                    >
                      {/* Row 1: label + dates + badge */}
                      <div className="flex items-center gap-1.5">
                        <div className="font-mono text-[length:var(--text-12)] font-bold uppercase tracking-wide" style={{ color: cssVar(effColor, '100') }}>
                          <EditableText value={w.label} onChange={v => updateWeekLabel(w.id, v)} />
                        </div>
                        <div className="font-mono text-[length:var(--text-12)]" style={{ color: isCurrent ? cssVar(effColor, '500') : 'var(--muted-foreground)' }}>
                          <EditableText value={w.dates} onChange={v => updateWeekDates(w.id, v)} />
                        </div>
                        <span className="ml-auto flex-shrink-0">
                          <Tooltip>
                            <TooltipTrigger render={
                              <Button variant="ghost" size="icon-micro" onClick={() => generateWeekSummary(w.id)} disabled={summaryLoading === w.id} className={`text-muted-foreground/40 hover:text-muted-foreground transition-opacity ${summaryLoading === w.id ? '' : 'opacity-0 group-hover/week:opacity-100'}`} />
                            }>
                              {summaryLoading === w.id ? (
                                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <RefreshIcon className="w-3.5 h-3.5" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>Сгенерировать итог недели</TooltipContent>
                          </Tooltip>
                        </span>
                      </div>
                      {/* Row 2: theme/summary */}
                      <div className="mt-1">
                        <p className="text-[length:var(--text-12)] leading-snug min-w-0" style={{ color: cssVar(effColor, 'fg-subtle') }}>
                          <EditableText value={w.theme} onChange={v => { updateWeekTheme(w.id, v); setSummaryReady(null); }} startEditing={summaryReady === w.id} placeholder="саммери" />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}

              {/* ═══ ZOOM IN — Header (days of one week) ═══ */}
              {!isMobile && zoomMode === 'in' && (() => {
                const aw = weeks[visibleStartIdx];
                if (!aw) return null;
                const awIsCurrent = visibleStartIdx === currentWeekIdx;
                const awColor = getEffectiveColor(visibleStartIdx);
                return (
                  <div className="flex border-b border-border bg-muted/40 sticky top-0 z-10">
                    <div
                      className="flex-shrink-0 px-4 py-3 border-r border-border text-[length:var(--text-12)] font-mono uppercase tracking-wide text-muted-foreground bg-muted/40"
                      style={{ width: COL_W, minWidth: COL_W }}
                    >
                      Раздел
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden" style={{ borderTop: `2px solid ${cssVar(awColor, '100')}` }}>
                      {/* Week info */}
                      <div className="px-3 py-1.5 border-b border-border/40 flex items-center gap-2" style={{ backgroundColor: awIsCurrent ? cssVar(awColor, '900') : undefined }}>
                        <span className="font-mono text-[length:var(--text-12)] font-bold uppercase tracking-wide" style={{ color: cssVar(awColor, '100') }}>
                          {aw.label}
                        </span>
                        <span className="font-mono text-[length:var(--text-12)]" style={{ color: awIsCurrent ? cssVar(awColor, '500') : 'var(--muted-foreground)' }}>
                          {aw.dates}
                        </span>
                        {awIsCurrent && (
                          <span className="ml-auto px-1.5 py-0.5 rounded text-[length:9px] font-mono uppercase tracking-wider flex-shrink-0" style={{ backgroundColor: cssVar(awColor, '100'), color: cssVar(awColor, 'fg') }}>
                            сейчас
                          </span>
                        )}
                      </div>
                      {/* Day column headers */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', backgroundColor: awIsCurrent ? cssVar(awColor, '900') : undefined }}>
                        {DAY_COL_LABELS.map((label, i) => (
                          <div
                            key={i}
                            className="px-2 py-1.5 border-r border-border/40 last:border-r-0 text-[length:var(--text-11)] font-mono uppercase tracking-wide text-center"
                            style={{
                              color: awIsCurrent ? cssVar(awColor, 'fg-subtle') : 'var(--muted-foreground)',
                              ...(i === 0 ? {
                                backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 4px, ${awIsCurrent ? cssVar(awColor, '700') : 'var(--border)'} 4px, ${awIsCurrent ? cssVar(awColor, '700') : 'var(--border)'} 5px)`,
                                backgroundSize: '100% 100%',
                                opacity: 0.7,
                              } : {}),
                            }}
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ═══ ZOOM OUT — Rows (weeks) ═══ */}
              {(isMobile || zoomMode === 'out') && rows.map((row, idx) => (
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
                    className="group/row flex-shrink-0 flex items-start gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-3 border-r border-border bg-background"
                    style={isMobile ? { width: '30%', minWidth: 0 } : { width: COL_W, minWidth: COL_W }}
                  >
                    {!isMobile && (
                      <Tooltip>
                        <TooltipTrigger render={<span className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground transition-colors select-none flex-shrink-0 mt-0.5 text-[length:var(--text-16)] leading-none" />}>⠿</TooltipTrigger>
                        <TooltipContent>Перетащить строку</TooltipContent>
                      </Tooltip>
                    )}
                    <span className="text-[length:var(--text-12)] font-medium text-foreground flex-1 min-w-0 mt-0.5">
                      <EditableText value={row.label} onChange={v => updateRowLabel(row.id, v)} />
                    </span>
                    {!isMobile && (
                      <Tooltip>
                        <TooltipTrigger render={
                          <Button variant="ghost" size="icon-micro" onClick={() => removeRow(row.id)} className="flex-shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity text-muted-foreground/20 hover:text-destructive mt-0.5" />
                        }>
                          ×
                        </TooltipTrigger>
                        <TooltipContent>Удалить строку</TooltipContent>
                      </Tooltip>
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
                          minWidth: 0,
                          backgroundColor: isCurrent ? `color-mix(in srgb, ${cssVar(effColor, '900')}, transparent 60%)` : undefined,
                        }}
                        onDragOver={e => onCardDragOver(e, row.id, w.id, null)}
                        onDrop={e => onCardDrop(e, row.id, w.id, null)}
                      >
                        {!locked && (
                          <Tooltip>
                            <TooltipTrigger render={
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
                              />
                            }>
                              +
                            </TooltipTrigger>
                            <TooltipContent>Добавить задачу</TooltipContent>
                          </Tooltip>
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

              {/* ═══ ZOOM IN — Rows (days of one week) ═══ */}
              {!isMobile && zoomMode === 'in' && (() => {
                const aw = weeks[visibleStartIdx];
                if (!aw) return null;
                const awColor = getEffectiveColor(visibleStartIdx);
                const awIsCurrent = visibleStartIdx === currentWeekIdx;
                return rows.map((row, idx) => {
                  const cards = row.cells?.[aw.id] ?? [];
                  const { placed } = placeCardsOnGrid(cards);
                  return (
                    <div
                      key={row.id}
                      className="flex border-b border-border/40 last:border-b-0 transition-colors"
                      style={{
                        opacity: draggingRowId === row.id ? 0.35 : 1,
                        backgroundColor: dropTargetRowIdx === idx && draggingRowId && draggingRowId !== row.id ? 'var(--muted)' : undefined,
                      }}
                      draggable
                      onDragStart={e => onRowDragStart(e, idx)}
                      onDragOver={e => onRowDragOver(e, idx)}
                      onDrop={e => onRowDrop(e, idx)}
                      onDragEnd={onRowDragEnd}
                    >
                      {/* Left column */}
                      <div
                        className="group/row flex-shrink-0 flex items-start gap-2 px-3 py-3 border-r border-border bg-background"
                        style={{ width: COL_W, minWidth: COL_W }}
                      >
                        <Tooltip>
                          <TooltipTrigger render={<span className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground transition-colors select-none flex-shrink-0 mt-0.5 text-[length:var(--text-16)] leading-none" />}>⠿</TooltipTrigger>
                          <TooltipContent>Перетащить строку</TooltipContent>
                        </Tooltip>
                        <span className="text-[length:var(--text-12)] font-medium text-foreground flex-1 min-w-0 mt-0.5">
                          <EditableText value={row.label} onChange={v => updateRowLabel(row.id, v)} />
                        </span>
                        <Tooltip>
                          <TooltipTrigger render={<Button variant="ghost" size="icon-micro" onClick={() => removeRow(row.id)} className="flex-shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity text-muted-foreground/20 hover:text-destructive mt-0.5" />}>×</TooltipTrigger>
                          <TooltipContent>Удалить строку</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Day grid */}
                      <div className="flex-1 relative" style={{ backgroundColor: awIsCurrent ? `color-mix(in srgb, ${cssVar(awColor, '900')}, transparent 60%)` : undefined }}>
                        {/* Column borders + hatched "Без дня" + drop highlight */}
                        <div className="absolute inset-0 pointer-events-none" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
                          {[0,1,2,3,4,5].map(i => (
                            <div
                              key={i}
                              className={i < 5 ? 'border-r border-border/20' : ''}
                              style={{
                                ...(i === 0 ? {
                                  backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 4px, var(--border) 4px, var(--border) 5px)',
                                  opacity: 0.25,
                                } : {}),
                                ...(zoomInDropCol?.rowId === row.id && zoomInDropCol?.col === i ? {
                                  backgroundColor: `color-mix(in srgb, ${cssVar(awColor, '100')}, transparent 85%)`,
                                } : {}),
                              }}
                            />
                          ))}
                        </div>

                        {/* Add-card buttons */}
                        {!locked && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }} className="px-0.5 pt-1.5">
                            {([undefined, ...DAYS] as (Day | undefined)[]).map((day, i) => (
                              <div key={i} className="px-0.5">
                                <Tooltip>
                                  <TooltipTrigger render={
                                    <button
                                      onClick={() => addCard(row.id, aw.id, day)}
                                      className="w-full flex items-center justify-center rounded text-[length:var(--text-11)] font-mono uppercase tracking-wide transition-colors"
                                      style={{
                                        height: 18,
                                        color: cssVar(awColor, 'fg-subtle'),
                                        opacity: 0.35,
                                        backgroundColor: cssVar(awColor, '900'),
                                        border: `1px dashed ${cssVar(awColor, '300')}`,
                                      }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.35'; }}
                                    />
                                  }>
                                    +
                                  </TooltipTrigger>
                                  <TooltipContent>Добавить задачу</TooltipContent>
                                </Tooltip>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Placed cards (CSS grid) */}
                        <div
                          ref={el => { if (el) gridRefsMap.current.set(row.id, el); else gridRefsMap.current.delete(row.id); }}
                          style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: 'auto' }}
                          className="py-1"
                          onDragOver={e => onZoomInDragOver(e, row.id, gridRefsMap.current.get(row.id) ?? null)}
                          onDrop={e => onZoomInDrop(e, row.id, aw.id, gridRefsMap.current.get(row.id) ?? null)}
                          onDragLeave={onZoomInDragLeave}
                        >
                          {placed.map(({ card: c, colStart, colEnd, gridRow: gr }) => (
                            <div
                              key={c.id}
                              style={{ gridColumn: `${colStart + 1} / ${colEnd + 1}`, gridRow: gr + 1 }}
                              className="px-0.5 py-0.5"
                            >
                              <CardItem
                                card={c}
                                weekColor={awColor}
                                locked={locked}
                                onToggleDone={() => toggleCardDone(row.id, aw.id, c.id)}
                                onUpdateLabel={v => updateCardLabel(row.id, aw.id, c.id, v)}
                                onRemove={() => removeCard(row.id, aw.id, c.id)}
                                draggable={!locked}
                                onDragStart={e => onCardDragStart(e, row.id, aw.id, c.id)}
                                onDragEnd={() => { onCardDragEnd(); setZoomInDropCol(null); }}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => e.preventDefault()}
                                onToggleDay={day => toggleCardDay(row.id, aw.id, c.id, day)}
                                zoomIn
                                onResizeStart={(e, side) => startCardResize(e, side, c.id, row.id, aw.id)}
                              />
                            </div>
                          ))}
                          {placed.length === 0 && (
                            <div style={{ gridColumn: '1 / 7', minHeight: 40 }} className="flex items-center justify-center text-[length:var(--text-12)] text-muted-foreground/30 font-mono">
                              Нет задач
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
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
            <Button variant="outline" size="sm" onClick={addRow} className="flex-shrink-0">
              + строка
            </Button>
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
          <Tooltip>
            <TooltipTrigger render={
              <Button variant="outline" size="sm" className="flex-shrink-0 gap-1.5" onClick={() => {
                if (locked) { setShowLockModal(true); }
                else { updateLocked(true); }
              }} />
            }>
              <span className="text-[length:var(--text-14)]">{locked ? '🔒' : '🔓'}</span>
              <span>{locked ? 'Заблокировано' : 'Заблокировать'}</span>
            </TooltipTrigger>
            <TooltipContent>{locked ? 'Разблокировать' : 'Заблокировать редактирование'}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <LockModal
        open={showLockModal}
        onClose={() => setShowLockModal(false)}
        onUnlock={() => { updateLocked(false); setShowLockModal(false); }}
      />


    </div>
  );
}
