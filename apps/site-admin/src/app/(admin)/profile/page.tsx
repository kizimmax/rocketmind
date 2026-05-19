"use client";

import { useEffect, useState } from "react";
import { Save, Mail, Trash2, KeyRound } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

interface ProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  email: string | null;
  emailVerifiedAt: string | null;
  secondaryEmail: string | null;
  secondaryEmailVerifiedAt: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  status: "ACTIVE" | "FROZEN";
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  lastLoginUserAgent: string | null;
  createdAt: string;
}

function fmt(iso: string | null): string {
  if (!iso) return "—";
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

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [primaryEmail, setPrimaryEmail] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function load() {
    setLoading(true);
    apiFetch("/api/admin/profile")
      .then((r) => r.json())
      .then(({ user: u }: { user: ProfileUser }) => {
        setUser(u);
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setPrimaryEmail(u.email ?? "");
        setSecondaryEmail(u.secondaryEmail ?? "");
      })
      .catch(() => toast.error("Не удалось загрузить профиль"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile() {
    const res = await apiFetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }),
    });
    if (!res.ok) {
      toast.error("Не удалось сохранить");
      return;
    }
    toast.success("Сохранено");
    load();
  }

  async function sendEmailLink(kind: "primary" | "secondary") {
    const email = kind === "primary" ? primaryEmail.trim() : secondaryEmail.trim();
    if (!email) {
      toast.error("Введите email");
      return;
    }
    const res = await apiFetch("/api/admin/profile/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, kind }),
    });
    const data = (await res.json().catch(() => null)) as { stubbed?: boolean; error?: string } | null;
    if (!res.ok) {
      if (data?.error === "email_taken") toast.error("Email уже используется");
      else if (data?.error === "invalid_email") toast.error("Некорректный email");
      else toast.error("Не удалось отправить письмо");
      return;
    }
    toast.success(data?.stubbed ? "Письмо подготовлено (заглушка SMTP)" : "Письмо с подтверждением отправлено");
    load();
  }

  async function removeSecondary() {
    const res = await apiFetch("/api/admin/profile/email", { method: "DELETE" });
    if (!res.ok) {
      toast.error("Не удалось удалить");
      return;
    }
    toast.success("Дополнительный email удалён");
    load();
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Заполните все поля");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Новый пароль и подтверждение не совпадают");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Новый пароль не короче 8 символов");
      return;
    }
    const res = await apiFetch("/api/admin/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      if (data?.error === "wrong_current_password") toast.error("Неверный текущий пароль");
      else if (data?.error === "new_password_too_short") toast.error("Слишком короткий пароль");
      else toast.error("Не удалось сменить пароль");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Пароль изменён. Сессия будет завершена — войдите снова.");
    setTimeout(() => {
      try {
        localStorage.removeItem("rm_admin_token");
        localStorage.removeItem("rm_admin_user");
      } catch { /* ignore */ }
      window.location.href = "/login";
    }, 1200);
  }

  if (loading || !user) return <div className="p-6 text-muted-foreground">Загрузка…</div>;

  const profileDirty =
    firstName.trim() !== user.firstName || lastName.trim() !== user.lastName;
  const primaryChanged = primaryEmail.trim().toLowerCase() !== (user.email ?? "").toLowerCase();
  const secondaryChanged =
    secondaryEmail.trim().toLowerCase() !== (user.secondaryEmail ?? "").toLowerCase();

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="shrink-0 px-6 py-4 border-b border-border">
        <h1 className="text-[length:var(--text-20)] font-semibold text-foreground">Мой профиль</h1>
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          {user.login} · {user.role === "SUPER_ADMIN" ? "Главный админ" : user.role === "ADMIN" ? "Администратор" : "Редактор"}
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px]">
        <section className="space-y-4">
          <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">Личные данные</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Имя">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Field>
            <Field label="Фамилия">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Field>
          </div>
          <Field label="Логин">
            <Input value={user.login} readOnly />
          </Field>
          <Button onClick={saveProfile} disabled={!profileDirty}>
            <Save size={14} className="mr-1" />
            Сохранить
          </Button>

          <div className="pt-4 border-t border-border space-y-1 text-[length:var(--text-12)] text-muted-foreground">
            <div>Последний вход: {fmt(user.lastLoginAt)}</div>
            <div>IP: {user.lastLoginIp ?? "—"}</div>
            <div className="truncate">User-Agent: {user.lastLoginUserAgent ?? "—"}</div>
          </div>
        </section>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">Email</h2>

            <Field
              label="Основной email"
              hint={
                user.email
                  ? user.emailVerifiedAt
                    ? "подтверждён"
                    : "не подтверждён"
                  : undefined
              }
              hintColor={user.email && user.emailVerifiedAt ? "ok" : "warn"}
            >
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Button
                  variant="outline"
                  onClick={() => sendEmailLink("primary")}
                  disabled={!primaryEmail.trim() || (!primaryChanged && Boolean(user.emailVerifiedAt))}
                >
                  <Mail size={14} className="mr-1" />
                  {user.emailVerifiedAt && !primaryChanged ? "Переподтвердить" : "Подтвердить"}
                </Button>
              </div>
            </Field>

            <Field
              label="Дополнительный email (для сброса пароля)"
              hint={
                user.secondaryEmail
                  ? user.secondaryEmailVerifiedAt
                    ? "подтверждён"
                    : "не подтверждён"
                  : undefined
              }
              hintColor={user.secondaryEmail && user.secondaryEmailVerifiedAt ? "ok" : "warn"}
            >
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="backup@example.com"
                />
                <Button
                  variant="outline"
                  onClick={() => sendEmailLink("secondary")}
                  disabled={!secondaryEmail.trim() || (!secondaryChanged && Boolean(user.secondaryEmailVerifiedAt))}
                >
                  <Mail size={14} className="mr-1" />
                  {user.secondaryEmailVerifiedAt && !secondaryChanged ? "Переподтвердить" : "Подтвердить"}
                </Button>
                {user.secondaryEmail && (
                  <Button variant="outline" onClick={removeSecondary}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </Field>
          </section>

          <section className="space-y-4">
            <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">
              Смена пароля
            </h2>
            <Field label="Текущий пароль">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <Field label="Новый пароль">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
            <Field label="Повторите новый пароль">
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
            <Button
              onClick={changePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              <KeyRound size={14} className="mr-1" />
              Сменить пароль
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  hintColor,
  children,
}: {
  label: string;
  hint?: string;
  hintColor?: "ok" | "warn";
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[length:var(--text-12)] text-muted-foreground">{label}</label>
        {hint && (
          <span
            className={
              hintColor === "ok"
                ? "text-[length:var(--text-11)] text-emerald-600 dark:text-emerald-400"
                : "text-[length:var(--text-11)] text-amber-600"
            }
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
