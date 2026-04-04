"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { ref, onValue, get, set, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import GanttBoard from './GanttBoard';

type TrackInfo = { name: string; color?: string; archived?: boolean };

const LOCK_PASSWORD = '2345';

const ACCENT_COLORS = [
  { token: 'yellow',     label: 'Жёлтый',     css100: 'var(--rm-yellow-100)',     css900: 'var(--rm-yellow-900)' },
  { token: 'violet',     label: 'Фиолетовый', css100: 'var(--rm-violet-100)',     css900: 'var(--rm-violet-900)' },
  { token: 'sky',        label: 'Голубой',     css100: 'var(--rm-sky-100)',        css900: 'var(--rm-sky-900)' },
  { token: 'terracotta', label: 'Терракота',   css100: 'var(--rm-terracotta-100)', css900: 'var(--rm-terracotta-900)' },
  { token: 'pink',       label: 'Розовый',     css100: 'var(--rm-pink-100)',       css900: 'var(--rm-pink-900)' },
  { token: 'blue',       label: 'Синий',       css100: 'var(--rm-blue-100)',       css900: 'var(--rm-blue-900)' },
  { token: 'red',        label: 'Красный',     css100: 'var(--rm-red-100)',        css900: 'var(--rm-red-900)' },
  { token: 'green',      label: 'Зелёный',     css100: 'var(--rm-green-100)',      css900: 'var(--rm-green-900)' },
] as const;

function slugify(name: string): string {
  const map: Record<string, string> = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  return name
    .toLowerCase()
    .split('')
    .map(c => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getTrackFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const qTrack = params.get('track');
  if (qTrack) return qTrack;
  const parts = window.location.pathname.split('/').filter(Boolean);
  const ganttIdx = parts.indexOf('gantt');
  if (ganttIdx >= 0 && parts[ganttIdx + 1]) return parts[ganttIdx + 1];
  return null;
}

function accentCSS(color?: string) {
  return ACCENT_COLORS.find(c => c.token === color) ?? ACCENT_COLORS[0];
}

export default function GanttPage() {
  const [trackSlug, setTrackSlug] = useState<string | null>(null);
  const [trackName, setTrackName] = useState('');
  const [mode, setMode] = useState<'loading' | 'index' | 'board' | 'notfound'>('loading');

  useEffect(() => {
    const slug = getTrackFromURL();
    if (!slug) { setMode('index'); return; }
    setTrackSlug(slug);
    get(ref(db, 'gantt_config/tracks')).then((snap) => {
      const tracks: Record<string, TrackInfo> | null = snap.val();
      if (tracks && slug in tracks && !tracks[slug].archived) {
        setTrackName(tracks[slug].name);
        setMode('board');
        const base = window.location.pathname.replace(/\/$/, '');
        const parts = base.split('/');
        const ganttIdx = parts.indexOf('gantt');
        if (!parts[ganttIdx + 1]) window.history.replaceState({}, '', `${base}/${slug}`);
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
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [creating, setCreating] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    if (mode === 'index' && authed) {
      const unsub = onValue(ref(db, 'gantt_config/tracks'), (snap) => {
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

  const handlePinSubmit = useCallback(() => {
    if (pin === LOCK_PASSWORD) { setAuthed(true); setPinError(false); }
    else { setPinError(true); setPin(''); pinRef.current?.focus(); }
  }, [pin]);

  const handleCreate = useCallback(async () => {
    if (!newName.trim() || !newSlug || slugError) return;
    setCreating(true);
    const existing = await get(ref(db, `gantt_config/tracks/${newSlug}`));
    if (existing.exists()) { setSlugError('Такой slug уже занят'); setCreating(false); return; }
    await set(ref(db, `gantt_config/tracks/${newSlug}`), { name: newName.trim(), color: newColor });
    setNewName(''); setNewSlug(''); setNewColor('yellow'); setSlugTouched(false); setShowForm(false); setCreating(false);
  }, [newName, newSlug, newColor, slugError]);

  const archiveTrack = useCallback(async (slug: string) => {
    await update(ref(db, `gantt_config/tracks/${slug}`), { archived: true });
  }, []);

  const restoreTrack = useCallback(async (slug: string) => {
    await update(ref(db, `gantt_config/tracks/${slug}`), { archived: false });
  }, []);

  const navigateToTrack = useCallback((slug: string) => {
    const base = window.location.pathname.replace(/\/$/, '');
    window.location.href = `${base}/${slug}`;
  }, []);

  const resetForm = useCallback(() => {
    setShowForm(false); setNewName(''); setNewSlug(''); setNewColor('yellow'); setSlugTouched(false);
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
    return <GanttBoard dbPath={`gantt_tracks/${trackSlug}`} trackName={trackName} />;
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
              Gantt-треки
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
            Gantt-треки
          </h1>
        </div>

        {tracks === null ? (
          <p className="text-muted-foreground text-[length:var(--text-14)]">Загрузка…</p>
        ) : (
          <div className="space-y-3">
            {/* Active tracks */}
            {activeTracks.map(([slug, info]) => {
              const accent = accentCSS(info.color);
              return (
                <div
                  key={slug}
                  className="group flex rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-foreground/20"
                >
                  {/* Color accent bar */}
                  <div className="w-1 flex-shrink-0" style={{ backgroundColor: accent.css100 }} />
                  <button
                    onClick={() => navigateToTrack(slug)}
                    className="flex-1 text-left p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground/60">Rocketmind</span>
                      <span className="text-muted-foreground/20">·</span>
                      <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground">{info.name}</span>
                    </div>
                    <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">/gantt/{slug}</p>
                  </button>
                  <button
                    onClick={() => archiveTrack(slug)}
                    className="px-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/40 hover:text-muted-foreground text-[length:var(--text-12)] flex-shrink-0"
                    title="Архивировать"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="12" height="3" rx="0.5" />
                      <path d="M3 6v6.5a1 1 0 001 1h8a1 1 0 001-1V6" />
                      <path d="M6.5 9h3" />
                    </svg>
                  </button>
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

                {/* Color picker */}
                <div className="space-y-1.5">
                  <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Цвет</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {ACCENT_COLORS.map(c => (
                      <button
                        key={c.token}
                        onClick={() => setNewColor(c.token)}
                        className="w-7 h-7 rounded-full transition-all flex items-center justify-center"
                        style={{
                          backgroundColor: c.css100,
                          boxShadow: newColor === c.token ? `0 0 0 2px var(--background), 0 0 0 4px ${c.css100}` : 'none',
                        }}
                        title={c.label}
                      >
                        {newColor === c.token && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6l2.5 2.5 4.5-5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Slug (URL)</label>
                  <div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden transition-colors focus-within:border-foreground">
                    <span className="text-[length:var(--text-14)] text-muted-foreground/50 pl-3 flex-shrink-0">/gantt/</span>
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
                        <div
                          key={slug}
                          className="group flex rounded-lg border border-border/50 bg-card/50 overflow-hidden"
                        >
                          <div className="w-1 flex-shrink-0 opacity-40" style={{ backgroundColor: accent.css100 }} />
                          <div className="flex-1 p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground/40">Rocketmind</span>
                              <span className="text-muted-foreground/15">·</span>
                              <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground/40">{info.name}</span>
                            </div>
                            <p className="mt-1 text-[length:var(--text-13)] text-muted-foreground/40">/gantt/{slug}</p>
                          </div>
                          <button
                            onClick={() => restoreTrack(slug)}
                            className="px-3 text-muted-foreground/40 hover:text-foreground transition-colors text-[length:var(--text-12)] flex-shrink-0"
                            title="Восстановить"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2.5 6h4" /><path d="M2.5 6l2-2.5" /><path d="M2.5 6l2 2.5" />
                              <path d="M4.5 6a5 5 0 1 1 .5 4" />
                            </svg>
                          </button>
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
    </div>
  );
}
