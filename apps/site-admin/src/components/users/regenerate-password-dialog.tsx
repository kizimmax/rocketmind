"use client";

import { useEffect, useState } from "react";
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
import { Copy, Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userHasEmail: boolean;
  userHasSecondaryEmail: boolean;
}

export function RegeneratePasswordDialog({
  open,
  onOpenChange,
  userId,
  userHasEmail,
  userHasSecondaryEmail,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState<"primary" | "secondary" | null>(null);

  useEffect(() => {
    if (!open) {
      setGenerated(null);
      setCopied(false);
      setSending(null);
    }
  }, [open]);

  async function regenerate() {
    setGenerating(true);
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/password/regenerate`, {
        method: "POST",
      });
      const data = (await res.json().catch(() => null)) as { password?: string } | null;
      if (!res.ok || !data?.password) {
        toast.error("Не удалось сгенерировать пароль");
        return;
      }
      setGenerated(data.password);
      toast.success("Новый пароль сгенерирован. Старые сессии разлогинены.");
    } finally {
      setGenerating(false);
    }
  }

  async function copy() {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    toast.success("Пароль скопирован");
    setTimeout(() => setCopied(false), 1500);
  }

  async function sendTo(target: "primary" | "secondary") {
    if (!generated) return;
    setSending(target);
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/password/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: generated, emailTarget: target }),
      });
      const data = (await res.json().catch(() => null)) as { stubbed?: boolean; error?: string } | null;
      if (!res.ok) {
        toast.error(data?.error === "no_email_on_account" ? "У пользователя нет email" : "Не удалось отправить");
        return;
      }
      toast.success(data?.stubbed ? "Письмо подготовлено (заглушка SMTP)" : "Письмо отправлено");
    } finally {
      setSending(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Перегенерация пароля</DialogTitle>
          <DialogDescription>
            После генерации старый пароль сразу перестанет работать, активные сессии будут завершены.
          </DialogDescription>
        </DialogHeader>

        {generated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input readOnly value={generated} className="font-mono" />
              <Button type="button" variant="outline" onClick={copy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => sendTo("primary")}
                disabled={!userHasEmail || sending !== null}
              >
                <Mail size={14} className="mr-1" />
                {sending === "primary" ? "Отправка…" : "Отправить на основной email"}
              </Button>
              {userHasSecondaryEmail && (
                <Button
                  variant="outline"
                  onClick={() => sendTo("secondary")}
                  disabled={sending !== null}
                >
                  <Mail size={14} className="mr-1" />
                  {sending === "secondary" ? "Отправка…" : "Отправить на доп. email"}
                </Button>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
            </DialogFooter>
          </div>
        ) : (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button onClick={regenerate} disabled={generating}>
              {generating ? "Генерация…" : "Сгенерировать новый пароль"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
