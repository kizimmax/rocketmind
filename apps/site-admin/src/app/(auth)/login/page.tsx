"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

function errorMessage(code?: string): string {
  switch (code) {
    case "invalid_credentials":
      return "Неверный логин или пароль";
    case "account_frozen":
      return "Учётная запись заморожена";
    case "too_many_attempts":
      return "Слишком много попыток. Попробуйте позже";
    case "login_and_password_required":
      return "Заполните оба поля";
    default:
      return "Ошибка входа";
  }
}

export default function LoginPage() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loginValue.trim() || !password.trim() || loading) return;

    setLoading(true);
    setError("");
    const result = await login(loginValue.trim(), password);
    if (result.ok) {
      router.replace("/pages");
    } else {
      setError(errorMessage(result.error));
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3 text-center">
            <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight text-foreground">
              CMS Rocketmind
            </h1>
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Введите логин и пароль для входа
            </p>
          </div>

          <div className="space-y-3">
            <Input
              type="text"
              size="lg"
              placeholder="Логин"
              value={loginValue}
              disabled={loading}
              onChange={(e) => {
                setLoginValue(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={!!error}
              autoFocus
            />
            <Input
              type="password"
              size="lg"
              placeholder="Пароль"
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={!!error}
            />

            {error && (
              <p className="text-[length:var(--text-12)] text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full"
              disabled={!loginValue.trim() || !password.trim() || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 100 10h-2a8 8 0 01-8-8z" />
                  </svg>
                  Вход…
                </span>
              ) : "Войти"}
            </Button>

            <div className="text-center">
              <Link
                href="/forgot"
                className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground"
              >
                Забыли пароль?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
