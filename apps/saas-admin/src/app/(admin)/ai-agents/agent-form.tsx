"use client";

import { useState } from "react";
import { Button, Input, Textarea, Checkbox } from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";
import { UserCircle, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { MascotPicker, type Mascot } from "./mascot-picker";
import { ConfirmDialog } from "@/components/confirm-dialog";

export type Agent = {
  id: string;
  slug: string;
  name: string;
  role: string;
  valueDescription: string;
  avatarMascotId: string | null;
  avatarMascot: Mascot | null;
  avatarPath: string | null;
  targets: string[];
  n8nWebhookUrl: string;
  n8nSecret: string | null;
  systemPrompt: string | null;
  notes: string | null;
};

interface AgentEditorProps {
  agent: Agent | null; // null = create mode
  onSaved: (agent: Agent) => void;
  onDeleted?: (id: string) => void;
  /** Optional cancel handler (e.g. router.back). Hidden if undefined. */
  onCancel?: () => void;
}

const EMPTY: Omit<Agent, "id" | "slug"> = {
  name: "",
  role: "",
  valueDescription: "",
  avatarMascotId: null,
  avatarMascot: null,
  avatarPath: null,
  targets: ["saas-teacher"],
  n8nWebhookUrl: "",
  n8nSecret: null,
  systemPrompt: null,
  notes: null,
};

export function AgentEditor({ agent, onSaved, onDeleted, onCancel }: AgentEditorProps) {
  const isEdit = !!agent;
  const [state, setState] = useState<Omit<Agent, "id" | "slug">>(() =>
    agent ? { ...agent } : { ...EMPTY },
  );
  const [picker, setPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleTarget(t: string) {
    setState((s) => ({
      ...s,
      targets: s.targets.includes(t)
        ? s.targets.filter((x) => x !== t)
        : [...s.targets, t],
    }));
  }

  async function handleSave() {
    if (!state.name.trim()) {
      toast.error("Введите имя AI-эксперта");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: state.name,
        role: state.role,
        valueDescription: state.valueDescription,
        avatarMascotId: state.avatarMascotId,
        avatarPath: state.avatarPath,
        targets: state.targets,
        n8nWebhookUrl: state.n8nWebhookUrl,
        n8nSecret: state.n8nSecret,
        systemPrompt: state.systemPrompt,
        notes: state.notes,
      };
      const res = await apiFetch(
        isEdit ? `/api/ai-agents/${agent!.id}` : "/api/ai-agents",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Ошибка: ${err.error ?? res.status}`);
        return;
      }
      const saved = (await res.json()) as Agent;
      toast.success(isEdit ? "Сохранено" : "AI-эксперт создан");
      onSaved(saved);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!agent) return;
    const res = await apiFetch(`/api/ai-agents/${agent.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("AI-эксперт удалён");
      onDeleted?.(agent.id);
    } else {
      toast.error("Ошибка удаления");
    }
  }

  const avatarUrl = state.avatarMascot?.imagePath ?? state.avatarPath ?? null;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left column: основные поля ── */}
        <div className="space-y-4">
          {/* Avatar + крупный инпут имени */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPicker(true)}
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded border border-border bg-rm-gray-1/40 transition-colors hover:border-foreground/40"
              >
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-10 w-10 text-muted-foreground" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setPicker(true)}
                className="text-[length:var(--text-12)] text-foreground underline-offset-2 hover:underline"
              >
                Выбрать
              </button>
            </div>
            <Input
              value={state.name}
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
              placeholder="Имя AI-эксперта"
              className="h-20 flex-1 text-[length:var(--text-24)] font-bold uppercase tracking-tight"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Роль
            </label>
            <Input
              value={state.role}
              onChange={(e) => setState((s) => ({ ...s, role: e.target.value }))}
              placeholder="напр. Бизнес-моделирование"
            />
          </div>

          {/* Value */}
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Описание пользы
            </label>
            <Textarea
              value={state.valueDescription}
              onChange={(e) =>
                setState((s) => ({ ...s, valueDescription: e.target.value }))
              }
              placeholder="Что AI-эксперт делает для ученика, чем полезен"
              rows={3}
            />
          </div>

          {/* Targets */}
          <div>
            <div className="mb-1 text-[length:var(--text-12)] text-muted-foreground">
              Привязка к SaaS
            </div>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={state.targets.includes("saas-teacher")}
                  onChange={() => toggleTarget("saas-teacher")}
                />
                <span className="text-[length:var(--text-14)]">saas-teacher</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={state.targets.includes("saas")}
                  onChange={() => toggleTarget("saas")}
                />
                <span className="text-[length:var(--text-14)]">saas (R-акселератор)</span>
              </label>
            </div>
          </div>

          {/* Webhook */}
          <div>
            <div className="mb-1 flex items-center gap-2">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                n8n webhook URL
              </label>
              {!state.n8nWebhookUrl.trim() && (
                <span className="inline-flex items-center gap-1 rounded-sm bg-destructive/15 px-1.5 py-0.5 text-[length:var(--text-10)] font-medium uppercase tracking-wide text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  Не подключен
                </span>
              )}
            </div>
            <Input
              value={state.n8nWebhookUrl}
              onChange={(e) =>
                setState((s) => ({ ...s, n8nWebhookUrl: e.target.value }))
              }
              placeholder="https://n8n.example.com/webhook/agent-xyz"
              className={
                !state.n8nWebhookUrl.trim()
                  ? "border-destructive/50 focus-visible:border-destructive"
                  : undefined
              }
            />
            {!state.n8nWebhookUrl.trim() && (
              <p className="mt-1 text-[length:var(--text-10)] text-destructive">
                Без webhook агент не отвечает — диалог с ним работать не будет.
              </p>
            )}
          </div>

          {/* Secret */}
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Shared secret (опц., для HMAC-подписи)
            </label>
            <Input
              value={state.n8nSecret ?? ""}
              onChange={(e) =>
                setState((s) => ({ ...s, n8nSecret: e.target.value || null }))
              }
              placeholder="optional"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Заметки
            </label>
            <Textarea
              value={state.notes ?? ""}
              onChange={(e) =>
                setState((s) => ({ ...s, notes: e.target.value || null }))
              }
              rows={2}
            />
          </div>
        </div>

        {/* ── Right column: системный промпт (большая область) ── */}
        <div className="flex flex-col">
          <div className="mb-1 flex items-center gap-2">
            <label className="text-[length:var(--text-12)] text-muted-foreground">
              Системный промпт
            </label>
            <span className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[length:var(--text-10)] font-medium uppercase tracking-wide text-foreground">
              В разработке
            </span>
          </div>
          <Textarea
            value={state.systemPrompt ?? ""}
            onChange={(e) =>
              setState((s) => ({ ...s, systemPrompt: e.target.value || null }))
            }
            rows={24}
            placeholder="Сейчас сами инструкции живут в n8n/OpenAI. Это поле — черновик: текст сохранится в БД, но в payload AI-эксперту пока не уходит."
            className="flex-1 min-h-[400px] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)]"
          />
          <p className="mt-1 text-[length:var(--text-10)] text-muted-foreground">
            Когда подключим передачу промпта в n8n — пометку «В разработке» снимем.
          </p>
        </div>
      </div>

      {/* Action bar — sticky внизу страницы */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          {isEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Удалить
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Отмена
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isEdit ? "Сохранить" : "Создать"}
          </Button>
        </div>
      </div>

      <MascotPicker
        open={picker}
        onOpenChange={setPicker}
        selectedId={state.avatarMascotId}
        onSelect={(m) => {
          setState((s) => ({
            ...s,
            avatarMascotId: m?.id ?? null,
            avatarMascot: m,
          }));
          setPicker(false);
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Удалить AI-эксперта?"
        description={`Агент «${agent?.name ?? ""}» будет удалён. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={() => {
          setConfirmDelete(false);
          handleDelete();
        }}
      />
    </>
  );
}
