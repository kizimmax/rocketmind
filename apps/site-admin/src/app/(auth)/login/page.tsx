"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    const success = await login(password);
    if (success) {
      router.replace("/pages");
    } else {
      setError("Неверный пароль");
      setPassword("");
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
              disabled={!password.trim()}
            >
              Войти
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
