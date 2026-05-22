"use client";

import { useEffect, useState } from "react";
import { joinGroup } from "@/lib/ivan-client";
import { ApiError } from "@/lib/api";
import { setPendingJoin, clearPendingJoin } from "@/lib/join";

/**
 * /join?code=<qrCode> — точка входа после сканирования QR группы.
 *
 * Привязка к группе у Ивана (POST /course/groups/join) требует авторизации,
 * поэтому:
 *  - авторизован → сразу join → редирект в приложение;
 *  - не авторизован (401) → уходим на /login?returnTo=/join?code=…,
 *    после входа login вернёт сюда и join выполнится.
 */
export default function JoinPage() {
  const [error, setError] = useState<null | "no_code" | "invalid" | "failed">(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // code — новый параметр; t — легаси-алиас старого QR.
    const code = (params.get("code") ?? params.get("t") ?? "").trim();
    if (!code) {
      setError("no_code");
      return;
    }

    // Сохраняем код сразу: если юзер уйдёт регистрироваться, после входа
    // join «дожмётся» из localStorage (consumePendingJoin в шелле) — повторно
    // сканировать QR не придётся.
    setPendingJoin(code);

    let cancelled = false;
    (async () => {
      try {
        await joinGroup(code);
        if (cancelled) return;
        clearPendingJoin();
        window.location.href = "/";
      } catch (e) {
        if (cancelled) return;
        const status = e instanceof ApiError ? e.status : 0;
        if (status === 401) {
          // Не авторизован → на вход. Код уже в localStorage; returnTo —
          // быстрый путь для happy-case, localStorage — страховка.
          const returnTo = `/join?code=${encodeURIComponent(code)}`;
          window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
          return;
        }
        // Мёртвый код — чистим, чтобы не пытаться снова после входа.
        if (status === 404 || status === 400) clearPendingJoin();
        setError(status === 404 ? "invalid" : "failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    const copy = {
      no_code: {
        title: "Ссылка некорректна",
        description: "В QR должен быть код группы.",
      },
      invalid: {
        title: "Этот QR больше не действителен",
        description:
          "Скорее всего, преподаватель обновил QR. Попросите свежий — старые ссылки перестают работать после регенерации.",
      },
      failed: {
        title: "Не удалось подключиться",
        description: "Попробуйте ещё раз чуть позже или обновите страницу.",
      },
    }[error];
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-[length:var(--text-24)] font-bold text-foreground">{copy.title}</h1>
        <p className="max-w-md text-[length:var(--text-14)] text-muted-foreground">{copy.description}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      <p className="text-[length:var(--text-14)] text-muted-foreground">Подключаем к программе…</p>
    </main>
  );
}
