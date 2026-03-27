"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Note } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

export default function LoginEmailPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { requestCode } = useAuth();
  const router = useRouter();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail) {
      setError("Введите корректный email");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await requestCode(email);
      router.push("/login/code");
    } catch {
      setError("Не удалось отправить код. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight">
          Войти
        </h1>
        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Введите email для получения кода доступа
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={!!error}
          autoFocus
        />

        {error && <Note variant="error">{error}</Note>}

        <Button
          type="submit"
          className="w-full"
          disabled={!email.trim() || isLoading}
        >
          {isLoading ? "Отправка..." : "Получить код"}
        </Button>
      </div>
    </form>
  );
}
