"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { ref, onValue, get, set, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import RPlanBoard, { getCurrentWeekIndex, formatWeekDates } from './RPlanBoard';

type TrackInfo = { name: string; color?: string; archived?: boolean; startWeek?: number };

const LOCK_PASSWORD = '2345';

const ACCENT_COLORS = [
  { token: 'yellow',     label: 'Жёлтый',     css100: 'var(--rm-yellow-100)' },
  { token: 'violet',     label: 'Фиолетовый', css100: 'var(--rm-violet-100)' },
  { token: 'sky',        label: 'Голубой',     css100: 'var(--rm-sky-100)' },
  { token: 'terracotta', label: 'Терракота',   css100: 'var(--rm-terracotta-100)' },
  { token: 'pink',       label: 'Розовый',     css100: 'var(--rm-pink-100)' },
  { token: 'blue',       label: 'Синий',       css100: 'var(--rm-blue-100)' },
  { token: 'red',        label: 'Красный',     css100: 'var(--rm-red-100)' },
  { token: 'green',      label: 'Зелёный',     css100: 'var(--rm-green-100)' },
] as const;

function slugify(name: string): string {
  const map: Record<string, string> = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  return name.toLowerCase().split('').map(c => map[c] ?? c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getTrackFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const qTrack = params.get('track');
  if (qTrack) return qTrack;
  const parts = window.location.pathname.split('/').filter(Boolean);
  const planIdx = parts.indexOf('r-plan');
  if (planIdx >= 0 && parts[planIdx + 1]) return parts[planIdx + 1];
  return null;
}

function accentCSS(color?: string) {
  return ACCENT_COLORS.find(c => c.token === color) ?? ACCENT_COLORS[0];
}

// ─── Toast ───────────────────────────────────────────────────────────────────

type Toast = { id: number; message: string; onUndo?: () => void };
let nextToastId = 0;

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2.5 shadow-lg text-[length:var(--text-14)] text-foreground animate-[slideUp_200ms_ease-out]">
          <span>{t.message}</span>
          {t.onUndo && (
            <button onClick={() => { t.onUndo!(); onDismiss(t.id); }} className="font-bold text-[color:var(--rm-yellow-100)] hover:underline">
              Отменить
            </button>
          )}
          <button onClick={() => onDismiss(t.id)} className="text-muted-foreground hover:text-foreground ml-1">✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── Color picker (shared between create and edit) ───────────────────────────

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {ACCENT_COLORS.map(c => (
        <button
          key={c.token}
          onClick={() => onChange(c.token)}
          className="w-7 h-7 rounded-full transition-all flex items-center justify-center"
          style={{
            backgroundColor: c.css100,
            boxShadow: value === c.token ? `0 0 0 2px var(--background), 0 0 0 4px ${c.css100}` : 'none',
          }}
          title={c.label}
        >
          {value === c.token && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 6l2.5 2.5 4.5-5" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Week selector ───────────────────────────────────────────────────────────

function WeekSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const cwIdx = getCurrentWeekIndex();
  // Show from 4 weeks before current to 12 weeks after
  const from = Math.max(0, cwIdx - 4);
  const to = cwIdx + 12;
  const options = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-[length:var(--text-14)] text-foreground outline-none transition-colors focus:border-foreground appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Cpath d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
    >
      {options.map(idx => (
        <option key={idx} value={idx}>
          {formatWeekDates(idx)}{idx === cwIdx ? ' (текущая)' : ''}
        </option>
      ))}
    </select>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function RPlanPage() {
  const [trackSlug, setTrackSlug] = useState<string | null>(null);
  const [trackName, setTrackName] = useState('');
  const [trackColor, setTrackColor] = useState('yellow');
  const [trackStartWeek, setTrackStartWeek] = useState<number | undefined>(undefined);
  const [mode, setMode] = useState<'loading' | 'index' | 'board' | 'notfound'>('loading');

  useEffect(() => {
    const slug = getTrackFromURL();
    if (!slug) { setMode('index'); return; }
    setTrackSlug(slug);
    get(ref(db, 'rplan_config/tracks')).then((snap) => {
      const tracks: Record<string, TrackInfo> | null = snap.val();
      if (tracks && slug in tracks && !tracks[slug].archived) {
        setTrackName(tracks[slug].name);
        setTrackColor(tracks[slug].color ?? 'yellow');
        setTrackStartWeek(tracks[slug].startWeek);
        setMode('board');
        const base = window.location.pathname.replace(/\/$/, '');
        const parts = base.split('/');
        const planIdx = parts.indexOf('r-plan');
        if (!parts[planIdx + 1]) window.history.replaceState({}, '', `${base}/${slug}`);
      } else {
        setMode('notfound');
      }
    });
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const pinRef = useRef<HTMLInputElement>(null);

  // ── Track list ───────────────────────────────────────────────────────────
  const [tracks, setTracks] = useState<Record<string, TrackInfo> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newColor, setNewColor] = useState('yellow');
  const [newStartWeek, setNewStartWeek] = useState(() => getCurrentWeekIndex());
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [creating, setCreating] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // ── Edit state ───────────────────────────────────────────────────────────
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editSlugError, setEditSlugError] = useState('');
  const [editColor, setEditColor] = useState('yellow');
  const [editStartWeek, setEditStartWeek] = useState(() => getCurrentWeekIndex());
  const editNameRef = useRef<HTMLInputElement>(null);

  // ── Toast state ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismissToast = useCallback((id: number) => setToasts(ts => ts.filter(t => t.id !== id)), []);
  const showToast = useCallback((message: string, onUndo?: () => void, duration = 5000) => {
    const id = ++nextToastId;
    setToasts(ts => [...ts, { id, message, onUndo }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), duration);
  }, []);

  // ── Deleted tracks backup (in-memory) ────────────────────────────────────
  const deletedBackups = useRef<Record<string, { track: TrackInfo; data: unknown }>>({});

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    if (mode === 'index' && authed) {
      const unsub = onValue(ref(db, 'rplan_config/tracks'), (snap) => {
        setTracks(snap.val() ?? {});
      });
      return () => unsub();
    }
  }, [mode, authed]);

  useEffect(() => {
    if (mode === 'index' && authed && showForm) nameRef.current?.focus();
  }, [mode, authed, showForm]);

  useEffect(() => {
    if (mode === 'index' && !authed) pinRef.current?.focus();
  }, [mode, authed]);

  useEffect(() => {
    if (!slugTouched && newName) setNewSlug(slugify(newName));
  }, [newName, slugTouched]);

  useEffect(() => {
    if (!newSlug) { setSlugError(''); return; }
    if (!/^[a-z0-9-]+$/.test(newSlug)) { setSlugError('Только строчные латинские буквы, цифры и дефис'); return; }
    if (tracks && newSlug in tracks) { setSlugError('Такой slug уже занят'); return; }
    setSlugError('');
  }, [newSlug, tracks]);

  useEffect(() => {
    if (!editSlug || editSlug === editingSlug) { setEditSlugError(''); return; }
    if (!/^[a-z0-9-]+$/.test(editSlug)) { setEditSlugError('Только строчные латинские буквы, цифры и дефис'); return; }
    if (tracks && editSlug in tracks) { setEditSlugError('Такой slug уже занят'); return; }
    setEditSlugError('');
  }, [editSlug, editingSlug, tracks]);

  useEffect(() => {
    if (editingSlug) editNameRef.current?.focus();
  }, [editingSlug]);

  const handlePinSubmit = useCallback(() => {
    if (pin === LOCK_PASSWORD) { setAuthed(true); setPinError(false); }
    else { setPinError(true); setPin(''); pinRef.current?.focus(); }
  }, [pin]);

  const handleCreate = useCallback(async () => {
    if (!newName.trim() || !newSlug || slugError) return;
    setCreating(true);
    const existing = await get(ref(db, `rplan_config/tracks/${newSlug}`));
    if (existing.exists()) { setSlugError('Такой slug уже занят'); setCreating(false); return; }
    await set(ref(db, `rplan_config/tracks/${newSlug}`), { name: newName.trim(), color: newColor, startWeek: newStartWeek });
    setNewName(''); setNewSlug(''); setNewColor('yellow'); setNewStartWeek(getCurrentWeekIndex()); setSlugTouched(false); setShowForm(false); setCreating(false);
  }, [newName, newSlug, newColor, newStartWeek, slugError]);

  const archiveTrack = useCallback(async (slug: string) => {
    await update(ref(db, `rplan_config/tracks/${slug}`), { archived: true });
  }, []);

  const restoreTrack = useCallback(async (slug: string) => {
    await update(ref(db, `rplan_config/tracks/${slug}`), { archived: false });
  }, []);

  const startEdit = useCallback((slug: string, info: TrackInfo) => {
    setEditingSlug(slug);
    setEditName(info.name);
    setEditSlug(slug);
    setEditColor(info.color ?? 'yellow');
    setEditStartWeek(info.startWeek ?? getCurrentWeekIndex());
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingSlug || !editName.trim() || !editSlug || editSlugError) return;
    const newData = { name: editName.trim(), color: editColor, startWeek: editStartWeek };
    if (editSlug !== editingSlug) {
      // Rename: copy track config + data to new slug, delete old
      const oldTrack = await get(ref(db, `rplan_config/tracks/${editingSlug}`));
      await set(ref(db, `rplan_config/tracks/${editSlug}`), { ...oldTrack.val(), ...newData });
      await remove(ref(db, `rplan_config/tracks/${editingSlug}`));
      const dataSnap = await get(ref(db, `rplan_tracks/${editingSlug}`));
      if (dataSnap.exists()) {
        await set(ref(db, `rplan_tracks/${editSlug}`), dataSnap.val());
        await remove(ref(db, `rplan_tracks/${editingSlug}`));
      }
    } else {
      await update(ref(db, `rplan_config/tracks/${editingSlug}`), newData);
    }
    setEditingSlug(null);
  }, [editingSlug, editName, editSlug, editSlugError, editColor, editStartWeek]);

  const cancelEdit = useCallback(() => setEditingSlug(null), []);

  const deleteTrack = useCallback(async (slug: string) => {
    if (!tracks) return;
    const trackInfo = tracks[slug];
    // Read track data for backup
    const dataSnap = await get(ref(db, `rplan_tracks/${slug}`));
    const trackData = dataSnap.val();
    // Store backup in memory
    deletedBackups.current[slug] = { track: trackInfo, data: trackData };
    // Delete from Firebase
    await remove(ref(db, `rplan_config/tracks/${slug}`));
    if (trackData) await remove(ref(db, `rplan_tracks/${slug}`));
    // Toast with undo
    showToast(`Трек «${trackInfo.name}» удалён`, async () => {
      const backup = deletedBackups.current[slug];
      if (!backup) return;
      await set(ref(db, `rplan_config/tracks/${slug}`), backup.track);
      if (backup.data) await set(ref(db, `rplan_tracks/${slug}`), backup.data);
      delete deletedBackups.current[slug];
    }, 10000);
  }, [tracks, showToast]);

  const navigateToTrack = useCallback((slug: string) => {
    const base = window.location.pathname.replace(/\/$/, '');
    window.location.href = `${base}/${slug}`;
  }, []);

  const resetForm = useCallback(() => {
    setShowForm(false); setNewName(''); setNewSlug(''); setNewColor('yellow'); setNewStartWeek(getCurrentWeekIndex()); setSlugTouched(false);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const activeTracks = tracks ? Object.entries(tracks).filter(([, t]) => !t.archived) : [];
  const archivedTracks = tracks ? Object.entries(tracks).filter(([, t]) => t.archived) : [];

  // ── Loading ──────────────────────────────────────────────────────────────
  if (mode === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground text-[length:var(--text-16)]">Загрузка…</p>
      </div>
    );
  }

  // ── Board mode ───────────────────────────────────────────────────────────
  if (mode === 'board' && trackSlug) {
    return <RPlanBoard dbPath={`rplan_tracks/${trackSlug}`} trackName={trackName} trackColor={trackColor} startWeekIdx={trackStartWeek} />;
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (mode === 'notfound') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-foreground text-[length:var(--text-20)] font-bold">Трек не найден</p>
          <p className="text-muted-foreground text-[length:var(--text-14)]">«{trackSlug}» не зарегистрирован.</p>
        </div>
      </div>
    );
  }

  // ── PIN screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-xs space-y-4 p-8">
          <div className="space-y-1">
            <span className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.12em] text-muted-foreground">Rocketmind</span>
            <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
              R-Plan треки
            </h1>
          </div>
          <div className="space-y-2">
            <input
              ref={pinRef}
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
              placeholder="PIN"
              className={`w-full rounded-lg border bg-transparent px-3 py-2 text-[length:var(--text-14)] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 ${pinError ? 'border-destructive' : 'border-border focus:border-foreground'}`}
              autoComplete="off"
            />
            {pinError && <p className="text-[length:var(--text-12)] text-destructive">Неверный PIN</p>}
            <button onClick={handlePinSubmit} className="w-full rounded-lg bg-foreground text-background py-2 text-[length:var(--text-14)] font-medium hover:opacity-90 transition-opacity">
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Track list ───────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="space-y-1">
          <span className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.12em] text-muted-foreground">Rocketmind</span>
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            R-Plan треки
          </h1>
        </div>

        {tracks === null ? (
          <p className="text-muted-foreground text-[length:var(--text-14)]">Загрузка…</p>
        ) : (
          <div className="space-y-3">
            {/* Active tracks */}
            {activeTracks.map(([slug, info]) => {
              const accent = accentCSS(info.color);
              const isEditing = editingSlug === slug;

              if (isEditing) {
                return (
                  <div key={slug} className="rounded-lg border border-border bg-card p-4 space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Название</label>
                      <input
                        ref={editNameRef}
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-[length:var(--text-14)] text-foreground outline-none transition-colors focus:border-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Цвет</label>
                      <ColorPicker value={editColor} onChange={setEditColor} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Стартовая неделя</label>
                      <WeekSelect value={editStartWeek} onChange={setEditStartWeek} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Slug (URL)</label>
                      <div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden transition-colors focus-within:border-foreground">
                        <span className="text-[length:var(--text-14)] text-muted-foreground/50 pl-3 flex-shrink-0">/r-plan/</span>
                        <input
                          value={editSlug}
                          onChange={e => setEditSlug(e.target.value.toLowerCase())}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                          className="flex-1 bg-transparent py-2 pr-3 text-[length:var(--text-14)] text-foreground outline-none"
                        />
                      </div>
                      {editSlugError && <p className="text-[length:var(--text-12)] text-destructive">{editSlugError}</p>}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={cancelEdit} className="px-3 py-1.5 rounded-lg text-[length:var(--text-13)] text-muted-foreground hover:bg-muted transition-colors">
                        Отмена
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={!editName.trim() || !editSlug || !!editSlugError}
                        className="px-4 py-1.5 rounded-lg bg-foreground text-background text-[length:var(--text-13)] font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={slug} className="group flex rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-foreground/20">
                  <div className="w-1 flex-shrink-0" style={{ backgroundColor: accent.css100 }} />
                  <button onClick={() => navigateToTrack(slug)} className="flex-1 text-left p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground/60">Rocketmind</span>
                      <span className="text-muted-foreground/20">·</span>
                      <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground">{info.name}</span>
                    </div>
                    <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">/r-plan/{slug}</p>
                  </button>
                  <div className="flex flex-col justify-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(slug, info)}
                      className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                      title="Редактировать"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.5 2.5l3 3M2 10l-.5 2.5 2.5-.5 8-8-3-3-7 7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => archiveTrack(slug)}
                      className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                      title="Архивировать"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1.5" y="2.5" width="11" height="2.5" rx="0.5" />
                        <path d="M2.5 5v5.5a1 1 0 001 1h7a1 1 0 001-1V5" />
                        <path d="M5.5 8h3" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add track form */}
            {showForm ? (
              <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Название</label>
                  <input
                    ref={nameRef}
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="Школа, Маркетинг…"
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-[length:var(--text-14)] text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-foreground"
                  />
                  {newName && (
                    <div className="flex items-center gap-2 text-[length:var(--text-11)] text-muted-foreground/60 font-mono">
                      <span>Rocketmind · {newName}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Цвет</label>
                  <ColorPicker value={newColor} onChange={setNewColor} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Стартовая неделя</label>
                  <WeekSelect value={newStartWeek} onChange={setNewStartWeek} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Slug (URL)</label>
                  <div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden transition-colors focus-within:border-foreground">
                    <span className="text-[length:var(--text-14)] text-muted-foreground/50 pl-3 flex-shrink-0">/r-plan/</span>
                    <input
                      value={newSlug}
                      onChange={e => { setNewSlug(e.target.value.toLowerCase()); setSlugTouched(true); }}
                      onKeyDown={e => e.key === 'Enter' && handleCreate()}
                      className="flex-1 bg-transparent py-2 pr-3 text-[length:var(--text-14)] text-foreground outline-none"
                    />
                  </div>
                  {slugError && <p className="text-[length:var(--text-12)] text-destructive">{slugError}</p>}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={resetForm} className="px-3 py-1.5 rounded-lg text-[length:var(--text-13)] text-muted-foreground hover:bg-muted transition-colors">
                    Отмена
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim() || !newSlug || !!slugError || creating}
                    className="px-4 py-1.5 rounded-lg bg-foreground text-background text-[length:var(--text-13)] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {creating ? 'Создаю…' : 'Создать'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full rounded-lg border border-dashed border-border p-4 text-[length:var(--text-14)] text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
              >
                + Добавить трек
              </button>
            )}

            {/* Archived tracks accordion */}
            {archivedTracks.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowArchived(v => !v)}
                  className="flex items-center gap-2 text-[length:var(--text-12)] text-muted-foreground/60 hover:text-muted-foreground transition-colors font-mono uppercase tracking-wide"
                >
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-transform" style={{ transform: showArchived ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M4.5 2.5l4 3.5-4 3.5" />
                  </svg>
                  Архив ({archivedTracks.length})
                </button>
                {showArchived && (
                  <div className="mt-2 space-y-2">
                    {archivedTracks.map(([slug, info]) => {
                      const accent = accentCSS(info.color);
                      return (
                        <div key={slug} className="group flex rounded-lg border border-border/50 bg-card/50 overflow-hidden">
                          <div className="w-1 flex-shrink-0 opacity-40" style={{ backgroundColor: accent.css100 }} />
                          <div className="flex-1 p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground/40">Rocketmind</span>
                              <span className="text-muted-foreground/15">·</span>
                              <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground/40">{info.name}</span>
                            </div>
                            <p className="mt-1 text-[length:var(--text-13)] text-muted-foreground/40">/r-plan/{slug}</p>
                          </div>
                          <div className="flex items-center gap-0.5 px-2">
                            <button
                              onClick={() => restoreTrack(slug)}
                              className="p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors"
                              title="Восстановить"
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 5h3.5" /><path d="M2 5l1.5-2" /><path d="M2 5l1.5 2" />
                                <path d="M4 5a4.5 4.5 0 1 1 .5 3.5" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteTrack(slug)}
                              className="p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors"
                              title="Удалить навсегда"
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 4h9" /><path d="M5 4V2.5h4V4" />
                                <path d="M4 4l.5 7.5a1 1 0 001 1h3a1 1 0 001-1L10 4" />
                                <path d="M5.5 6.5v3" /><path d="M8.5 6.5v3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
