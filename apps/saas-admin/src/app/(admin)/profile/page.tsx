"use client";

import { Button } from "@rocketmind/ui";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Профиль текущего админа. Данные берём из сессии (/profile Ивана через
// auth-context). Редактирование своих данных и роли — на стороне Ивана;
// здесь read-only + выход. Пароля/доп.email нет (вход по OTP).
export default function ProfilePage() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return <div className="p-6 text-muted-foreground">Загрузка…</div>;

  const name = [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="shrink-0 px-6 py-4 border-b border-border">
        <h1 className="text-[length:var(--text-20)] font-semibold text-foreground">Мой профиль</h1>
      </div>

      <div className="p-6 max-w-[480px] space-y-4">
        <Row label="Имя" value={name} />
        <Row label="Email" value={currentUser.email ?? "—"} />
        <Row label="Роль" value={currentUser.role ?? "—"} />

        <div className="pt-2">
          <Button variant="outline" onClick={() => logout()}>
            <LogOut size={14} className="mr-1" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[length:var(--text-12)] text-muted-foreground">{label}</span>
      <span className="text-[length:var(--text-14)] text-foreground">{value}</span>
    </div>
  );
}
