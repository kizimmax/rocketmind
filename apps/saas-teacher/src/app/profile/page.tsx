"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@rocketmind/ui";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateProfile } from "@/lib/ivan-client";

export default function ProfilePage() {
  const router = useRouter();
  const { student, isLoading, refresh } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!student) {
      router.replace("/login");
      return;
    }
    setFirstName(student.firstName ?? "");
    setLastName(student.lastName ?? "");
    setRole(student.role ?? "");
    setIndustry(student.industry ?? "");
    setRegion(student.region ?? "");
  }, [student, isLoading, router]);

  async function save() {
    setSaving(true);
    try {
      await updateProfile({ firstName, lastName, role, industry, region });
      await refresh();
      setSavedAt(Date.now());
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !student) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-y-auto bg-background">
      <div className="mx-auto max-w-xl px-6 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Назад в чат
        </Link>

        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight text-foreground">
          Профиль
        </h1>
        <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
          Это твоя анкета. ИИ-агенты используют её, чтобы говорить с тобой на одном
          языке и учитывать контекст бизнеса.
        </p>

        <div className="mt-8 grid gap-4">
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Email
            </label>
            <Input value={student.email} disabled />
          </div>
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Имя
            </label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Фамилия
            </label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Роль в бизнесе
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Укажите роль"
            />
            <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground/70">
              Например: генеральный директор
            </p>
          </div>
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Сфера деятельности
            </label>
            <Input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Укажите сферу"
            />
            <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground/70">
              Например: производство, образование
            </p>
          </div>
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Регион
            </label>
            <Input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Укажите регион"
            />
            <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground/70">
              Например: Московская область
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
          {savedAt && Date.now() - savedAt < 3000 && (
            <span className="inline-flex items-center gap-1 text-[length:var(--text-12)] text-muted-foreground">
              <Check className="h-3.5 w-3.5" /> Сохранено
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
