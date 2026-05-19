"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Snowflake, KeyRound, Trash2, Save } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  PermissionTree,
  type TreeNode,
} from "@/components/users/permission-tree";
import { RegeneratePasswordDialog } from "@/components/users/regenerate-password-dialog";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

interface UserDetail {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  email: string | null;
  emailVerifiedAt: string | null;
  secondaryEmail: string | null;
  secondaryEmailVerifiedAt: string | null;
  role: Role;
  status: "ACTIVE" | "FROZEN";
  createdById: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  lastLoginUserAgent: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Array<{ path: string; accessLevel: "VIEW" | "EDIT" }>;
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

function roleLabel(r: Role): string {
  if (r === "SUPER_ADMIN") return "Главный админ";
  if (r === "ADMIN") return "Администратор";
  return "Редактор";
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useAuth();
  const id = params.id;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [tree, setTree] = useState<TreeNode[] | null>(null);
  const [permissions, setPermissions] = useState<Map<string, "VIEW" | "EDIT">>(new Map());
  const [initialPermissionsKey, setInitialPermissionsKey] = useState("");
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");

  const [confirmFreeze, setConfirmFreeze] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);

  const isSelf = currentUser?.id === id;
  const canManage = !isSelf && (currentUser?.role === "SUPER_ADMIN" ||
    (currentUser?.role === "ADMIN" && user?.role === "EDITOR" && user.createdById === currentUser.id));
  const canDelete = !isSelf && currentUser?.role === "SUPER_ADMIN" && user?.role !== "SUPER_ADMIN";

  function load() {
    setLoading(true);
    Promise.all([
      apiFetch(`/api/admin/users/${id}`).then((r) => r.json()),
      apiFetch(`/api/admin/users/sections-tree`).then((r) => r.json()),
    ])
      .then(([userData, treeData]: [{ user: UserDetail }, { tree: TreeNode[] }]) => {
        setUser(userData.user);
        setTree(treeData.tree);
        setFirstName(userData.user.firstName);
        setLastName(userData.user.lastName);
        setLogin(userData.user.login);
        setEmail(userData.user.email ?? "");
        const map = new Map<string, "VIEW" | "EDIT">();
        for (const p of userData.user.permissions) map.set(p.path, p.accessLevel);
        setPermissions(map);
        setInitialPermissionsKey(serializeMap(map));
      })
      .catch(() => toast.error("Не удалось загрузить"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const profileDirty = useMemo(() => {
    if (!user) return false;
    return (
      firstName.trim() !== user.firstName ||
      lastName.trim() !== user.lastName ||
      login.trim() !== user.login ||
      (email.trim() || null) !== user.email
    );
  }, [user, firstName, lastName, login, email]);

  const permissionsDirty = serializeMap(permissions) !== initialPermissionsKey;

  async function saveProfile() {
    const res = await apiFetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        login: login.trim(),
        email: email.trim() || null,
      }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string; changed?: string[] } | null;
    if (!res.ok) {
      if (data?.error === "login_or_email_taken") toast.error("Логин или email уже заняты");
      else toast.error("Не удалось сохранить");
      return;
    }
    const changed = data?.changed ?? [];
    const sessionsKilled = changed.includes("login") || changed.includes("email");
    toast.success(sessionsKilled ? "Сохранено. Активные сессии пользователя завершены." : "Сохранено");
    load();
  }

  async function savePermissions() {
    const list = Array.from(permissions.entries()).map(([path, accessLevel]) => ({ path, accessLevel }));
    const res = await apiFetch(`/api/admin/users/${id}/permissions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions: list }),
    });
    const data = (await res.json().catch(() => null)) as
      | { droppedPermissionCount?: number; invalid?: string[]; error?: string }
      | null;
    if (!res.ok) {
      if (data?.error === "invalid_paths") toast.error(`Некорректные пути: ${(data.invalid ?? []).join(", ")}`);
      else toast.error("Не удалось сохранить права");
      return;
    }
    if (data?.droppedPermissionCount && data.droppedPermissionCount > 0) {
      toast.warning(`Сохранено. ${data.droppedPermissionCount} прав отброшено (нельзя выдать больше своих).`);
    } else {
      toast.success("Права сохранены. Сессии пользователя завершены.");
    }
    load();
  }

  async function toggleFreeze() {
    if (!user) return;
    const endpoint = user.status === "FROZEN" ? "unfreeze" : "freeze";
    const res = await apiFetch(`/api/admin/users/${id}/${endpoint}`, { method: "POST" });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      if (data?.error === "cannot_freeze_last_super_admin") toast.error("Нельзя заморозить последнего главного админа");
      else toast.error("Не удалось изменить статус");
      return;
    }
    toast.success(endpoint === "freeze" ? "Пользователь заморожен" : "Пользователь разморожен");
    load();
  }

  async function deleteUser() {
    const res = await apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Не удалось удалить");
      return;
    }
    toast.success("Пользователь удалён");
    router.replace("/users");
  }

  if (loading || !user || !tree) {
    return <div className="p-6 text-muted-foreground">Загрузка…</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-b border-border">
        <Link href="/users" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="flex-1 text-[length:var(--text-20)] font-semibold text-foreground">
          {user.firstName} {user.lastName}
          <span className="ml-3 text-[length:var(--text-13)] text-muted-foreground">
            {roleLabel(user.role)}
            {user.status === "FROZEN" && (
              <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground">
                <Snowflake size={12} /> заморожен
              </span>
            )}
          </span>
        </h1>
        {canManage && (
          <>
            <Button variant="outline" onClick={() => setRegenOpen(true)}>
              <KeyRound size={14} className="mr-1" />
              Пароль
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                user.status === "FROZEN" ? toggleFreeze() : setConfirmFreeze(true)
              }
            >
              <Snowflake size={14} className="mr-1" />
              {user.status === "FROZEN" ? "Разморозить" : "Заморозить"}
            </Button>
            {canDelete && (
              <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={14} className="mr-1" />
                Удалить
              </Button>
            )}
          </>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px]">
        {/* Profile */}
        <section className="space-y-4">
          <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">
            Профиль
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Имя">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!canManage} />
            </Field>
            <Field label="Фамилия">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!canManage} />
            </Field>
          </div>
          <Field label="Логин">
            <Input value={login} onChange={(e) => setLogin(e.target.value)} disabled={!canManage} />
          </Field>
          <Field
            label="Email"
            hint={user.email && !user.emailVerifiedAt ? "не подтверждён" : undefined}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!canManage}
            />
          </Field>
          {user.secondaryEmail && (
            <Field
              label="Дополнительный email"
              hint={!user.secondaryEmailVerifiedAt ? "не подтверждён" : undefined}
            >
              <Input readOnly value={user.secondaryEmail} />
            </Field>
          )}

          {canManage && (
            <div className="pt-2">
              <Button onClick={saveProfile} disabled={!profileDirty}>
                <Save size={14} className="mr-1" />
                Сохранить
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-border space-y-1 text-[length:var(--text-12)] text-muted-foreground">
            <div>Последний вход: {fmt(user.lastLoginAt)}</div>
            <div>IP последнего входа: {user.lastLoginIp ?? "—"}</div>
            <div className="truncate">User-Agent: {user.lastLoginUserAgent ?? "—"}</div>
            <div>Создан: {fmt(user.createdAt)}</div>
          </div>
        </section>

        {/* Permissions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">
              Доступы
            </h2>
            {canManage && user.role !== "SUPER_ADMIN" && (
              <Button onClick={savePermissions} disabled={!permissionsDirty}>
                <Save size={14} className="mr-1" />
                Сохранить права
              </Button>
            )}
          </div>
          {user.role === "SUPER_ADMIN" ? (
            <p className="text-[length:var(--text-13)] text-muted-foreground">
              Главный администратор имеет полный доступ ко всем разделам.
            </p>
          ) : (
            <div className="border border-border rounded p-2">
              <PermissionTree
                tree={tree}
                value={permissions}
                onChange={setPermissions}
                readOnly={!canManage}
              />
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={confirmFreeze}
        onOpenChange={setConfirmFreeze}
        title="Заморозить пользователя?"
        description="Пользователь будет немедленно разлогинен и не сможет войти, пока вы не разморозите его. Контент сохранится."
        confirmLabel="Заморозить"
        variant="destructive"
        onConfirm={toggleFreeze}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Удалить пользователя?"
        description="Удаление необратимо. Если хотите сохранить историю — используйте заморозку."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={deleteUser}
      />
      <RegeneratePasswordDialog
        open={regenOpen}
        onOpenChange={setRegenOpen}
        userId={user.id}
        userHasEmail={Boolean(user.email)}
        userHasSecondaryEmail={Boolean(user.secondaryEmail)}
      />
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[length:var(--text-12)] text-muted-foreground">{label}</label>
        {hint && <span className="text-[length:var(--text-11)] text-amber-600">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function serializeMap(m: Map<string, "VIEW" | "EDIT">): string {
  return Array.from(m.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("|");
}
