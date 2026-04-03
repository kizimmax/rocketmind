"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ref, onValue, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';

type TrackInfo = { name: string };

const LOCK_PASSWORD = '2345';

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

export default function GanttIndexPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const pinRef = useRef<HTMLInputElement>(null);

  const [tracks, setTracks] = useState<Record<string, TrackInfo> | null>(null);

  // New track form
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [creating, setCreating] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    if (authed) {
      const unsub = onValue(ref(db, 'gantt_config/tracks'), (snap) => {
        setTracks(snap.val() ?? {});
      });
      return () => unsub();
    }
  }, [authed]);

  useEffect(() => {
    if (authed && showForm) nameRef.current?.focus();
  }, [authed, showForm]);

  useEffect(() => {
    if (!authed) pinRef.current?.focus();
  }, [authed]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugTouched && newName) {
      setNewSlug(slugify(newName));
    }
  }, [newName, slugTouched]);

  // Validate slug
  useEffect(() => {
    if (!newSlug) { setSlugError(''); return; }
    if (!/^[a-z0-9-]+$/.test(newSlug)) {
      setSlugError('Только строчные латинские буквы, цифры и дефис');
      return;
    }
    if (tracks && newSlug in tracks) {
      setSlugError('Такой slug уже занят');
      return;
    }
    setSlugError('');
  }, [newSlug, tracks]);

  const handlePinSubmit = () => {
    if (pin === LOCK_PASSWORD) {
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
      pinRef.current?.focus();
    }
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newSlug || slugError) return;
    setCreating(true);
    const existing = await get(ref(db, `gantt_config/tracks/${newSlug}`));
    if (existing.exists()) {
      setSlugError('Такой slug уже занят');
      setCreating(false);
      return;
    }
    await set(ref(db, `gantt_config/tracks/${newSlug}`), { name: newName.trim() });
    setNewName('');
    setNewSlug('');
    setSlugTouched(false);
    setShowForm(false);
    setCreating(false);
  };

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
            <button
              onClick={handlePinSubmit}
              className="w-full rounded-lg bg-foreground text-background py-2 text-[length:var(--text-14)] font-medium hover:opacity-90 transition-opacity"
            >
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
            {Object.entries(tracks).map(([slug, info]) => (
              <Link
                key={slug}
                href={`/gantt/${slug}`}
                className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground/60">Rocketmind</span>
                  <span className="text-muted-foreground/20">·</span>
                  <span className="font-mono text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground">{info.name}</span>
                </div>
                <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">
                  /gantt/{slug}
                </p>
              </Link>
            ))}

            {/* Add track */}
            {showForm ? (
              <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-[length:var(--text-12)] text-muted-foreground font-mono uppercase tracking-wide">Название трека</label>
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
                  <button
                    onClick={() => { setShowForm(false); setNewName(''); setNewSlug(''); setSlugTouched(false); }}
                    className="px-3 py-1.5 rounded-lg text-[length:var(--text-13)] text-muted-foreground hover:bg-muted transition-colors"
                  >
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
          </div>
        )}
      </div>
    </div>
  );
}
