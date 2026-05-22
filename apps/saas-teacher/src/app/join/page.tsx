"use client";

import { useEffect, useState } from "react";

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

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/programs/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qrCode: code }),
        });
        if (cancelled) return;
        if (res.ok) {
          window.location.href = "/";
          return;
        }
        if (res.status === 401) {
          const returnTo = `/join?code=${encodeURIComponent(code)}`;
          window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
          return;
        }
        setError(res.status === 404 ? "invalid" : "failed");
      } catch {
        if (!cancelled) setError("failed");
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
