"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
} from "@rocketmind/ui";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignableRoles: Array<"ADMIN" | "EDITOR">;
  onCreated: () => void;
}

export function CreateUserDialog({ open, onOpenChange, assignableRoles, onCreated }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EDITOR">(assignableRoles[0] ?? "EDITOR");
  const [saving, setSaving] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setFirstName("");
    setLastName("");
    setLogin("");
    setEmail("");
    setRole(assignableRoles[0] ?? "EDITOR");
    setGeneratedPassword(null);
    setCopied(false);
  }

  async function handleCreate() {
    if (!firstName.trim() || !lastName.trim() || !login.trim()) {
      toast.error("Заполните имя, фамилию и логин");
      return;
    }
    if (login.trim().length < 3) {
      toast.error("Логин не короче 3 символов");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          login: login.trim(),
          email: email.trim() || null,
          role,
          initialPermissions: [],
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { user?: { id: string }; generatedPassword?: string; error?: string }
        | null;
      if (!res.ok || !data?.generatedPassword) {
        const err = data?.error;
        if (err === "login_or_email_taken") toast.error("Логин или email уже заняты");
        else if (err === "forbidden_role") toast.error("Нельзя создать пользователя с такой ролью");
        else toast.error("Не удалось создать пользователя");
        return;
      }
      setGeneratedPassword(data.generatedPassword);
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  async function copy() {
    if (!generatedPassword) return;
    await navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    toast.success("Пароль скопирован");
    setTimeout(() => setCopied(false), 1500);
  }

  function handleClose(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый пользователь</DialogTitle>
          <DialogDescription>
            Введите данные. Пароль будет сгенерирован автоматически и показан один раз.
          </DialogDescription>
        </DialogHeader>

        {generatedPassword ? (
          <div className="space-y-4">
            <div className="text-[length:var(--text-13)] text-foreground">
              Пользователь создан. Скопируйте пароль — он больше не будет показан.
            </div>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={generatedPassword}
                className="font-mono"
              />
              <Button type="button" variant="outline" onClick={copy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Закрыть</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[length:var(--text-12)] text-muted-foreground">Имя</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={saving} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[length:var(--text-12)] text-muted-foreground">Фамилия</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={saving} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">Логин</label>
              <Input value={login} onChange={(e) => setLogin(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">Email (необязательно)</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">Роль</label>
              <div className="flex gap-2">
                {assignableRoles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    disabled={saving}
                    className={`px-3 h-9 rounded border text-[length:var(--text-13)] cursor-pointer ${
                      role === r
                        ? "border-foreground bg-rm-gray-2 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "ADMIN" ? "Администратор" : "Редактор"}
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)} disabled={saving}>
                Отмена
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Создание…" : "Создать"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
