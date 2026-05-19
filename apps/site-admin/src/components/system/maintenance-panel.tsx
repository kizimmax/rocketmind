"use client";

import { useState } from "react";
import { Wrench, Trash2 } from "lucide-react";
import { Button } from "@rocketmind/ui";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface CleanupResult {
  ok: boolean;
  triggeredBy: "cron" | "admin";
  deleted: {
    passwordResetTokens: number;
    emailVerificationTokens: number;
    loginAttempts: number;
  };
  cutoffs: {
    tokenBefore: string;
    attemptBefore: string;
  };
}

function fmt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Manual trigger for the cleanup endpoint. Only renders for SUPER_ADMIN —
 * the API itself is also SUPER_ADMIN-gated, this is just visibility.
 */
export function MaintenancePanel() {
  const { currentUser } = useAuth();
  const [running, setRunning] = useState(false);
  const [last, setLast] = useState<CleanupResult | null>(null);

  if (currentUser?.role !== "SUPER_ADMIN") return null;

  async function runCleanup() {
    setRunning(true);
    try {
      const res = await apiFetch("/api/admin/maintenance/cleanup", { method: "POST" });
      const data = (await res.json().catch(() => null)) as CleanupResult | { error?: string } | null;
      if (!res.ok || !data || !("ok" in data)) {
        toast.error("Не удалось выполнить очистку");
        return;
      }
      setLast(data);
      const total = data.deleted.passwordResetTokens + data.deleted.emailVerificationTokens + data.deleted.loginAttempts;
      if (total === 0) toast.success("Очистка выполнена. Удалять нечего.");
      else toast.success(`Удалено записей: ${total}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-4 rounded border border-border p-5">
      <div className="flex items-center gap-2">
        <Wrench size={16} className="text-muted-foreground" />
        <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">
          Обслуживание
        </h2>
      </div>
      <p className="text-[length:var(--text-13)] text-muted-foreground">
        Удаляет истекшие токены сброса пароля, токены подтверждения email и старые
        записи попыток входа. Безопасно запускать в любое время; обычно вызывается
        ежедневным cron'ом, эта кнопка — на случай ручного запуска.
      </p>

      <Button onClick={runCleanup} disabled={running}>
        <Trash2 size={14} className="mr-1" />
        {running ? "Выполнение…" : "Запустить очистку"}
      </Button>

      {last && (
        <div className="space-y-1 text-[length:var(--text-12)] text-muted-foreground">
          <div>
            Удалено: токены сброса пароля — {last.deleted.passwordResetTokens}, токены
            подтверждения email — {last.deleted.emailVerificationTokens}, попытки входа —{" "}
            {last.deleted.loginAttempts}.
          </div>
          <div>Токены старше: {fmt(last.cutoffs.tokenBefore)}.</div>
          <div>Попытки входа старше: {fmt(last.cutoffs.attemptBefore)}.</div>
        </div>
      )}
    </div>
  );
}
