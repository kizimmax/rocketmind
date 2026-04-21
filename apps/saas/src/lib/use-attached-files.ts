"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AttachedFile } from "./types";

/**
 * Управляет прикреплёнными к инпуту файлами — с мок-анимацией загрузки.
 * Создаёт Blob-URL для preview, revoke происходит при remove/unmount.
 * При отправке сообщения вызвать clearFiles({ keepUrls: true }) —
 * URL-ы переносятся в message.metadata.attachments.
 */
export function useAttachedFiles() {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());
  const urlsRef = useRef<Map<string, string>>(new Map());

  const clearTimer = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t !== undefined) {
      window.clearInterval(t);
      timersRef.current.delete(id);
    }
  }, []);

  const addFiles = useCallback(
    (native: File[]) => {
      const added: AttachedFile[] = native.map((f) => {
        const id = `f_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const url = URL.createObjectURL(f);
        urlsRef.current.set(id, url);
        return {
          id,
          name: f.name,
          size: f.size,
          progress: 0,
          url,
          type: f.type || undefined,
        };
      });
      setFiles((prev) => [...prev, ...added]);

      // Мок-прогресс для каждого добавленного файла
      for (const a of added) {
        const t = window.setInterval(() => {
          setFiles((prev) => {
            const next = prev.map((f) =>
              f.id === a.id ? { ...f, progress: Math.min(100, f.progress + 8) } : f
            );
            const me = next.find((f) => f.id === a.id);
            if (me && me.progress >= 100) clearTimer(a.id);
            return next;
          });
        }, 120);
        timersRef.current.set(a.id, t);
      }
    },
    [clearTimer]
  );

  const removeFile = useCallback(
    (id: string) => {
      clearTimer(id);
      const url = urlsRef.current.get(id);
      if (url) {
        URL.revokeObjectURL(url);
        urlsRef.current.delete(id);
      }
      setFiles((prev) => prev.filter((f) => f.id !== id));
    },
    [clearTimer]
  );

  const clearFiles = useCallback(
    (options?: { keepUrls?: boolean }) => {
      for (const id of timersRef.current.keys()) clearTimer(id);
      if (!options?.keepUrls) {
        for (const url of urlsRef.current.values()) URL.revokeObjectURL(url);
      }
      urlsRef.current.clear();
      setFiles([]);
    },
    [clearTimer]
  );

  useEffect(
    () => () => {
      for (const id of timersRef.current.keys()) clearTimer(id);
    },
    [clearTimer]
  );

  return { files, addFiles, removeFile, clearFiles };
}
