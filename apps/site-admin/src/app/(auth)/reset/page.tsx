"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@rocketmind/ui";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_token: "Ссылка недействительна",
  token_expired: "Ссылка истекла. Запросите новую.",
  token_used: "Эта ссылка уже использована",
  new_password_too_short: "Пароль не короче 8 символов",
  fields_required: "Заполните оба поля",
};

export default function ResetPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (!token) {
      setError("В ссылке отсутствует токен");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password-reset/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(ERROR_MESSAGES[data?.error ?? ""] ?? "Не удалось сбросить пароль");
        return;
      }
      setDone(true);
      setTimeout(() => router.replace("/login"), 1500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            Новый пароль
          </h1>
        </div>

        {done ? (
          <p className="text-center text-[length:var(--text-14)] text-emerald-600 dark:text-emerald-400">
            Пароль изменён. Перенаправляем на вход…
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <Input
              type="password"
              size="lg"
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
              autoComplete="new-password"
              autoFocus
            />
            <Input
              type="password"
              size="lg"
              placeholder="Повторите пароль"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
              autoComplete="new-password"
            />
            {error && <p className="text-[length:var(--text-12)] text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="h-12 w-full" disabled={loading || !password || !confirm}>
              {loading ? "Сохранение…" : "Сменить пароль"}
            </Button>
            <div className="text-center">
              <Link href="/login" className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground">
                ← Назад ко входу
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
