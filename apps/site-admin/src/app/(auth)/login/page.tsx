"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setLoading(true);
    setError("");
    const success = await login(password);
    if (success) {
      router.replace("/pages");
    } else {
      setError("Неверный пароль");
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
              Введите пароль для входа в админку
            </p>
          </div>

          <div className="space-y-3">
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
              autoFocus
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
              disabled={!password.trim() || loading}
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
          </div>
        </form>
      </div>
    </div>
  );
}
