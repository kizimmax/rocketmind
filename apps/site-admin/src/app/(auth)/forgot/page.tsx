"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "@rocketmind/ui";

type TargetOption = { target: "primary" | "secondary"; masked: string };
type Stage = "ask-login" | "pick-target" | "sent";

export default function ForgotPage() {
  const [stage, setStage] = useState<Stage>("ask-login");
  const [login, setLogin] = useState("");
  const [options, setOptions] = useState<TargetOption[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup() {
    if (!login.trim() || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password-reset/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim() }),
      });
      const data = (await res.json().catch(() => null)) as
        | { options?: TargetOption[]; error?: string }
        | null;
      if (res.status === 429) {
        setError("Слишком много попыток. Попробуйте позже.");
        return;
      }
      const opts = data?.options ?? [];
      if (opts.length === 0) {
        setError("Для этого логина нельзя восстановить пароль автоматически. Обратитесь к администратору.");
        return;
      }
      setOptions(opts);
      setStage("pick-target");
    } finally {
      setLoading(false);
    }
  }

  async function send(target: "primary" | "secondary") {
    setLoading(true);
    try {
      await fetch("/api/admin/password-reset/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim(), target }),
      });
      setStage("sent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            Восстановление пароля
          </h1>
        </div>

        {stage === "ask-login" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookup();
            }}
            className="space-y-3"
          >
            <Input
              size="lg"
              placeholder="Логин"
              value={login}
              disabled={loading}
              onChange={(e) => {
                setLogin(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
            {error && <p className="text-[length:var(--text-12)] text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="h-12 w-full" disabled={!login.trim() || loading}>
              {loading ? "Поиск…" : "Продолжить"}
            </Button>
            <div className="text-center">
              <Link href="/login" className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground">
                ← Назад ко входу
              </Link>
            </div>
          </form>
        )}

        {stage === "pick-target" && (
          <div className="space-y-3">
            <p className="text-[length:var(--text-13)] text-muted-foreground text-center">
              Выберите, на какой адрес отправить ссылку:
            </p>
            {options.map((o) => (
              <Button
                key={o.target}
                variant="outline"
                size="lg"
                className="w-full justify-between"
                onClick={() => send(o.target)}
                disabled={loading}
              >
                <span>{o.masked}</span>
                <span className="text-muted-foreground text-[length:var(--text-11)]">
                  {o.target === "primary" ? "основной" : "доп."}
                </span>
              </Button>
            ))}
            <div className="text-center pt-2">
              <button
                onClick={() => setStage("ask-login")}
                className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ← Изменить логин
              </button>
            </div>
          </div>
        )}

        {stage === "sent" && (
          <div className="space-y-4 text-center">
            <p className="text-[length:var(--text-14)] text-foreground">
              Если адрес зарегистрирован, мы отправили на него письмо со ссылкой для сброса пароля.
              Ссылка действует 30 минут.
            </p>
            <Link href="/login" className="inline-block text-[length:var(--text-13)] text-muted-foreground hover:text-foreground">
              ← Назад ко входу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
