"use client";

import { useEffect, useRef } from "react";
import { apiFetch } from "./api-client";

export type PreviewType = "article" | "glossary" | "page";

const SESSION_KEY = (type: PreviewType, slug: string) => `preview:${type}:${slug}`;
const PREVIEW_WINDOW_NAME = "rocketmind-preview";
const SYNC_DEBOUNCE_MS = 600;

function getOrCreateDraftId(type: PreviewType, slug: string): string {
  if (typeof window === "undefined") return "";
  const key = SESSION_KEY(type, slug);
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(key, id);
  return id;
}

interface PreviewDraftResponse {
  id: string;
  url: string;
  expiresAt: string;
}

async function postDraft(
  id: string,
  type: PreviewType,
  slug: string,
  publicUrl: string,
  payload: unknown,
): Promise<PreviewDraftResponse | null> {
  try {
    const res = await apiFetch("/api/preview-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, slug, publicUrl, payload }),
    });
    if (!res.ok) return null;
    return (await res.json()) as PreviewDraftResponse;
  } catch {
    return null;
  }
}

/**
 * Хук синхронизации редактора с PreviewDraft. Каждое изменение `payload`
 * (debounced 600 мс) уезжает в БД, чтобы при клике «Предпросмотр» / при
 * перезагрузке вкладки превью контент был свежим.
 */
export function usePreviewSync(
  type: PreviewType,
  slug: string,
  publicUrl: string,
  payload: unknown,
  enabled: boolean = true,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Держим последний payload в ref, чтобы flush из visibilitychange/blur
  // мог отправить именно его (event listeners stale-closure'ят).
  const latest = useRef<{
    type: PreviewType;
    slug: string;
    publicUrl: string;
    payload: unknown;
  } | null>(null);
  const dirty = useRef(false);

  useEffect(() => {
    latest.current = { type, slug, publicUrl, payload };
  }, [type, slug, publicUrl, payload]);

  useEffect(() => {
    if (!enabled || !slug || !publicUrl) return;
    const id = getOrCreateDraftId(type, slug);
    if (!id) return;
    if (timer.current) clearTimeout(timer.current);
    dirty.current = true;
    timer.current = setTimeout(() => {
      const cur = latest.current;
      if (!cur) return;
      void postDraft(id, cur.type, cur.slug, cur.publicUrl, cur.payload);
      dirty.current = false;
    }, SYNC_DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [type, slug, publicUrl, payload, enabled]);

  // Flush на потерю видимости/фокуса — иначе фоновые таймеры тротлятся
  // браузером и пользователь видит устаревший черновик в превью-вкладке.
  useEffect(() => {
    if (!enabled) return;
    const id = getOrCreateDraftId(type, slug);
    if (!id) return;

    function flushNow() {
      const cur = latest.current;
      if (!cur || !dirty.current) return;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      void postDraft(id, cur.type, cur.slug, cur.publicUrl, cur.payload);
      dirty.current = false;
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") flushNow();
    }
    window.addEventListener("blur", flushNow);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", flushNow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [type, slug, enabled]);
}

/**
 * Открыть превью в фиксированной вкладке. Перед открытием синхронно
 * загружает текущий payload в PreviewDraft (на случай, если debounced
 * auto-sync ещё не отработал).
 */
export async function openPreview(
  type: PreviewType,
  slug: string,
  publicUrl: string,
  payload: unknown,
): Promise<void> {
  if (!slug || !publicUrl || typeof window === "undefined") return;
  const id = getOrCreateDraftId(type, slug);
  if (!id) return;

  // Открываем вкладку синхронно (внутри user-gesture клика), иначе popup-blocker
  // браузера срабатывает после `await` и `window.open` либо молча игнорится,
  // либо навигирует текущую вкладку. Сразу показываем «загрузка…», потом
  // навигируем на реальный URL после получения подписанной ссылки.
  const win = window.open("about:blank", PREVIEW_WINDOW_NAME);
  if (win) {
    try {
      win.document.write(
        '<title>Открываем предпросмотр…</title><body style="font:14px system-ui;padding:24px;color:#666">Открываем предпросмотр…</body>',
      );
    } catch {
      /* cross-origin, fine */
    }
  }

  const res = await postDraft(id, type, slug, publicUrl, payload);
  if (!res) {
    if (win) win.close();
    // eslint-disable-next-line no-alert
    alert("Не удалось открыть предпросмотр");
    return;
  }
  if (win) {
    win.location.href = res.url;
  } else {
    // Popup заблокирован — в крайнем случае открываем в текущей вкладке.
    window.location.href = res.url;
  }
}
