"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

type TrackInfo = { name: string };

export default function GanttIndexPage() {
  const [tracks, setTracks] = useState<Record<string, TrackInfo> | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, 'gantt_config/tracks'), (snap) => {
      setTracks(snap.val() ?? {});
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-8">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight text-foreground">
          Gantt-треки
        </h1>

        {tracks === null ? (
          <p className="text-muted-foreground text-[length:var(--text-14)]">Загрузка…</p>
        ) : Object.keys(tracks).length === 0 ? (
          <p className="text-muted-foreground text-[length:var(--text-14)]">
            Нет зарегистрированных треков. Добавьте их в Firebase: gantt_config/tracks.
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(tracks).map(([slug, info]) => (
              <Link
                key={slug}
                href={`/gantt/${slug}`}
                className="block rounded-sm border border-border bg-card p-4 transition-colors hover:bg-rm-gray-1"
              >
                <p className="text-[length:var(--text-16)] font-medium text-foreground">
                  {info.name}
                </p>
                <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
                  /gantt/{slug}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
