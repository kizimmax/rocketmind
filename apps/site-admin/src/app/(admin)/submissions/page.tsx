"use client";

import { apiFetch } from "@/lib/api-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@rocketmind/ui";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

type DeliveryStatus = {
  status: "ok" | "skipped" | "error" | null;
  error: string | null;
};

type Submission = {
  id: string;
  formId: string;
  formName: string;
  pageUrl: string | null;
  data: Record<string, unknown>;
  ipAddress: string | null;
  delivery: {
    bitrix24: DeliveryStatus;
    email: DeliveryStatus;
    telegram: DeliveryStatus;
  };
  createdAt: string;
};

type Form = { id: string; name: string };

const KEY_LABELS: Record<string, string> = {
  name: "Имя", fullName: "Имя", firstName: "Имя", lastName: "Фамилия",
  email: "Email", phone: "Телефон", tel: "Телефон",
  message: "Сообщение", comment: "Комментарий",
  company: "Компания", position: "Должность",
};
function humanizeKey(k: string): string { return KEY_LABELS[k] ?? k; }

function formatVal(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function StatusBadge({ s }: { s: DeliveryStatus }) {
  if (s.status === null) {
    return <span className="text-[length:var(--text-11)] text-muted-foreground">—</span>;
  }
  if (s.status === "ok") return <Badge variant="green-subtle">отправлено</Badge>;
  if (s.status === "skipped") return <Badge variant="neutral">пропущено</Badge>;
  return <Badge variant="red-subtle" title={s.error ?? undefined}>ошибка</Badge>;
}

export default function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFormId, setFilterFormId] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const url = filterFormId ? `/api/submissions?formId=${encodeURIComponent(filterFormId)}` : "/api/submissions";
    apiFetch(url)
      .then((r) => r.json())
      .then((data: Submission[]) => setItems(data))
      .catch(() => toast.error("Ошибка загрузки заявок"))
      .finally(() => setLoading(false));
  }, [filterFormId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    apiFetch("/api/forms")
      .then((r) => r.json())
      .then((data: Form[]) => setForms(data))
      .catch(() => { /* список форм опционален для фильтра */ });
  }, []);

  const totalCount = items.length;
  const counts = useMemo(() => {
    let bitrix = 0, email = 0, telegram = 0;
    for (const s of items) {
      if (s.delivery.bitrix24.status === "ok") bitrix++;
      if (s.delivery.email.status === "ok") email++;
      if (s.delivery.telegram.status === "ok") telegram++;
    }
    return { bitrix, email, telegram };
  }, [items]);

  async function handleDelete(id: string) {
    const res = await apiFetch(`/api/submissions/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((s) => s.id !== id));
      toast.success("Заявка удалена");
    } else {
      toast.error("Ошибка удаления");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-[length:var(--text-18)] font-semibold text-foreground">Заявки</h1>
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Все формы → отправленные пользователями. Заявки сохраняются всегда, даже если каналы доставки выключены или упали.
        </p>
      </div>

      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="text-[length:var(--text-12)] text-muted-foreground">
          Всего: <span className="text-foreground">{totalCount}</span>
        </div>
        <div className="text-[length:var(--text-12)] text-muted-foreground">
          Bitrix24 ✓ <span className="text-foreground">{counts.bitrix}</span>
        </div>
        <div className="text-[length:var(--text-12)] text-muted-foreground">
          Email ✓ <span className="text-foreground">{counts.email}</span>
        </div>
        <div className="text-[length:var(--text-12)] text-muted-foreground">
          Telegram ✓ <span className="text-foreground">{counts.telegram}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-[length:var(--text-12)] text-muted-foreground">Форма:</label>
          <select
            value={filterFormId}
            onChange={(e) => setFilterFormId(e.target.value)}
            className="h-8 rounded-sm border border-border bg-background px-2 text-[length:var(--text-12)] text-foreground"
          >
            <option value="">Все формы</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-[length:var(--text-12)] text-muted-foreground">Загрузка…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-[length:var(--text-13)] text-muted-foreground">
            Заявок ещё нет. Они появятся здесь, как только пользователи начнут отправлять формы на сайте.
          </div>
        ) : (
          <table className="w-full text-[length:var(--text-12)]">
            <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur">
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="w-8 px-3 py-2"></th>
                <th className="px-3 py-2">Дата</th>
                <th className="px-3 py-2">Форма</th>
                <th className="px-3 py-2">Имя / Email / Телефон</th>
                <th className="px-3 py-2">Страница</th>
                <th className="px-3 py-2">Bitrix</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Telegram</th>
                <th className="w-12 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => {
                const isOpen = expandedId === s.id;
                const dataAny = s.data as Record<string, unknown>;
                const name = (dataAny.name ?? dataAny.fullName ?? dataAny.firstName) as string | undefined;
                const email = dataAny.email as string | undefined;
                const phone = (dataAny.phone ?? dataAny.tel) as string | undefined;
                return (
                  <>
                    <tr
                      key={s.id}
                      className="cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/40"
                      onClick={() => setExpandedId(isOpen ? null : s.id)}
                    >
                      <td className="px-3 py-2 align-top text-muted-foreground">
                        {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </td>
                      <td className="px-3 py-2 align-top text-muted-foreground tabular-nums">
                        {new Date(s.createdAt).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span className="font-medium text-foreground">{s.formName || s.formId}</span>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex flex-col">
                          {name && <span className="text-foreground">{name}</span>}
                          {email && <span className="text-muted-foreground">{email}</span>}
                          {phone && <span className="text-muted-foreground">{phone}</span>}
                          {!name && !email && !phone && <span className="text-muted-foreground">—</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-muted-foreground">
                        {s.pageUrl ? (
                          <a
                            href={s.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground"
                          >
                            {s.pageUrl}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2 align-top"><StatusBadge s={s.delivery.bitrix24} /></td>
                      <td className="px-3 py-2 align-top"><StatusBadge s={s.delivery.email} /></td>
                      <td className="px-3 py-2 align-top"><StatusBadge s={s.delivery.telegram} /></td>
                      <td className="px-3 py-2 align-top text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(s.id); }}
                          title="Удалить заявку"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`${s.id}-detail`} className="border-b border-border/60 bg-muted/20">
                        <td></td>
                        <td colSpan={8} className="px-3 py-3">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <div className="mb-1.5 text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">Поля заявки</div>
                              <table className="w-full text-[length:var(--text-12)]">
                                <tbody>
                                  {Object.entries(s.data).map(([k, v]) => (
                                    <tr key={k} className="border-b border-border/40 last:border-0">
                                      <td className="py-1 pr-3 text-muted-foreground align-top w-1/3">{humanizeKey(k)}</td>
                                      <td className="py-1 text-foreground align-top whitespace-pre-wrap break-words">{formatVal(v)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <div className="mb-1.5 text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">Доставка</div>
                              <div className="flex flex-col gap-2 text-[length:var(--text-12)]">
                                {(["bitrix24", "email", "telegram"] as const).map((ch) => (
                                  <div key={ch} className="flex items-start gap-2">
                                    <div className="w-20 text-muted-foreground capitalize">{ch === "bitrix24" ? "Bitrix24" : ch === "email" ? "Email" : "Telegram"}:</div>
                                    <div className="flex-1">
                                      <StatusBadge s={s.delivery[ch]} />
                                      {s.delivery[ch].error && (
                                        <div className="mt-1 text-[length:var(--text-11)] text-[var(--rm-red-500)] break-words">{s.delivery[ch].error}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 text-[length:var(--text-11)] text-muted-foreground">
                                IP: {s.ipAddress ?? "—"} · ID: <code className="font-mono">{s.id}</code>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Удалить заявку?"
        description="Заявка будет удалена безвозвратно."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
