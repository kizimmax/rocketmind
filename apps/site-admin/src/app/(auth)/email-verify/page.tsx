"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@rocketmind/ui";

type State = "verifying" | "ok" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_token: "Ссылка недействительна или истекла",
  token_expired: "Ссылка истекла. Запросите подтверждение заново.",
  token_used: "Ссылка уже использована",
};

export default function EmailVerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [state, setState] = useState<State>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("В ссылке отсутствует токен");
      return;
    }
    fetch("/api/admin/profile/email/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const data = (await r.json().catch(() => null)) as
          | { ok?: boolean; email?: string; error?: string }
          | null;
        if (r.ok && data?.ok) {
          setState("ok");
          setMessage(`Email ${data.email} подтверждён`);
        } else {
          setState("error");
          setMessage(ERROR_MESSAGES[data?.error ?? ""] ?? "Не удалось подтвердить email");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Ошибка сети");
      });
  }, [token]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-[420px] text-center space-y-4">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Подтверждение email
        </h1>
        <p
          className={
            state === "ok"
              ? "text-[length:var(--text-14)] text-emerald-600 dark:text-emerald-400"
              : state === "error"
              ? "text-[length:var(--text-14)] text-destructive"
              : "text-[length:var(--text-14)] text-muted-foreground"
          }
        >
          {state === "verifying" ? "Подтверждаем…" : message}
        </p>
        {state !== "verifying" && (
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/profile")}>В профиль</Button>
            <Link
              href="/login"
              className="inline-flex h-9 items-center px-4 text-[length:var(--text-13)] text-muted-foreground hover:text-foreground"
            >
              Ко входу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
