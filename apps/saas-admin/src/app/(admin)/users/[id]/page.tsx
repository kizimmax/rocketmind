"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { toast } from "sonner";
import { getAdminUser, getRoles, updateAdminUser } from "@/lib/ivan-client";
import { ApiError } from "@/lib/api";

interface UserDetail {
  id: string;
  firstName: string;
  email: string;
  role: string | null;
  roleId: string | null;
  profession: string;
  fieldOfActivity: string;
  city: string;
}

type Role = { id: string; name: string; isSystem: boolean };

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [profession, setProfession] = useState("");
  const [fieldOfActivity, setFieldOfActivity] = useState("");
  const [city, setCity] = useState("");
  const [roleId, setRoleId] = useState("");

  function load() {
    setLoading(true);
    Promise.all([getAdminUser(id), getRoles()])
      .then(([u, rs]) => {
        setUser(u);
        setRoles(rs);
        setFirstName(u.firstName);
        setProfession(u.profession);
        setFieldOfActivity(u.fieldOfActivity);
        setCity(u.city);
        setRoleId(u.roleId ?? "");
      })
      .catch(() => toast.error("Не удалось загрузить"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const dirty = useMemo(() => {
    if (!user) return false;
    return (
      firstName !== user.firstName ||
      profession !== user.profession ||
      fieldOfActivity !== user.fieldOfActivity ||
      city !== user.city ||
      roleId !== (user.roleId ?? "")
    );
  }, [user, firstName, profession, fieldOfActivity, city, roleId]);

  async function save() {
    if (!user) return;
    // Шлём только изменённое: смена роли не должна тащить лишний PUT /users/{id}
    // (он мог падать и ронять всю операцию вместе с назначением роли).
    const changed: Record<string, string> = {};
    if (firstName !== user.firstName) changed.firstName = firstName;
    if (profession !== user.profession) changed.profession = profession;
    if (fieldOfActivity !== user.fieldOfActivity) changed.fieldOfActivity = fieldOfActivity;
    if (city !== user.city) changed.city = city;
    if (roleId !== (user.roleId ?? "")) changed.roleId = roleId;

    if (Object.keys(changed).length === 0) return;

    setSaving(true);
    try {
      await updateAdminUser(id, changed);
      toast.success("Сохранено");
      load();
    } catch (e) {
      toast.error(`Не удалось сохранить${e instanceof ApiError ? `: ${e.message}` : ""}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) return <div className="p-6 text-muted-foreground">Загрузка…</div>;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-b border-border">
        <Link href="/users" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="flex-1 text-[length:var(--text-20)] font-semibold text-foreground">
          {user.firstName || user.email}
          <span className="ml-3 text-[length:var(--text-13)] text-muted-foreground">
            {user.role ?? "ученик"}
          </span>
        </h1>
        <Button onClick={save} disabled={!dirty || saving}>
          <Save size={14} className="mr-1" />
          Сохранить
        </Button>
      </div>

      <div className="p-6 max-w-[640px] space-y-4">
        <Field label="Email">
          <Input value={user.email} readOnly disabled />
        </Field>
        <Field label="Имя">
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Field>
        <Field label="Профессия">
          <Input value={profession} onChange={(e) => setProfession(e.target.value)} />
        </Field>
        <Field label="Сфера деятельности">
          <Input value={fieldOfActivity} onChange={(e) => setFieldOfActivity(e.target.value)} />
        </Field>
        <Field label="Регион">
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>

        <Field label="Роль (доступ в админку)" hint="Без роли — обычный ученик">
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="h-9 w-full rounded border border-border bg-background px-3 text-[length:var(--text-14)] text-foreground"
          >
            <option value="">— без роли (ученик)</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[length:var(--text-12)] text-muted-foreground">{label}</label>
        {hint && <span className="text-[length:var(--text-11)] text-muted-foreground/70">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
