"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Textarea } from "@rocketmind/ui";
import {
  createAgent,
  updateAgent,
  deleteAgent,
  getAssistants,
  uploadFile,
} from "@/lib/ivan-client";
import { ApiError } from "@/lib/api";
import type { OpenAiAssistant } from "@/lib/ivan-auth";
import { toast } from "sonner";
import { UserCircle, Loader2, Trash2, Upload } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

export type Agent = {
  id: string;
  name: string;
  role: string;
  valueDescription: string;
  avatarUrl: string | null;
  /** ID ассистента OpenAI (через него идёт диалог). */
  openAiAssistantId: string;
};

interface AgentEditorProps {
  agent: Agent | null; // null = create mode
  onSaved: (agent: Agent) => void;
  onDeleted?: (id: string) => void;
  onCancel?: () => void;
}

const EMPTY: Omit<Agent, "id"> = {
  name: "",
  role: "",
  valueDescription: "",
  avatarUrl: null,
  openAiAssistantId: "",
};

export function AgentEditor({ agent, onSaved, onDeleted, onCancel }: AgentEditorProps) {
  const isEdit = !!agent;
  const [state, setState] = useState<Omit<Agent, "id">>(() =>
    agent ? { ...agent } : { ...EMPTY },
  );
  // Системный промпт пока косметический: в payload не уходит (промпт живёт в
  // OpenAI Assistant). Подключим, когда переедем с openAiAssistantId.
  const [systemPrompt, setSystemPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [assistants, setAssistants] = useState<OpenAiAssistant[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAssistants()
      .then(setAssistants)
      .catch(() => toast.error("Не удалось загрузить список ассистентов"));
  }, []);

  async function handlePickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // сброс — чтобы повторный выбор того же файла триггерил change
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setState((s) => ({ ...s, avatarUrl: url }));
      toast.success("Фото загружено");
    } catch (err) {
      toast.error(`Не удалось загрузить фото${err instanceof ApiError ? `: ${err.message}` : ""}`);
    } finally {
      setUploading(false);
    }
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
        avatarUrl: state.avatarUrl,
        openAiAssistantId: state.openAiAssistantId,
      };
      const saved = isEdit
        ? await updateAgent(agent!.id, payload)
        : await createAgent(payload);
      toast.success(isEdit ? "Сохранено" : "AI-эксперт создан");
      onSaved(saved);
    } catch (e) {
      toast.error(`Ошибка: ${e instanceof ApiError ? e.message : "не удалось сохранить"}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!agent) return;
    try {
      await deleteAgent(agent.id);
      toast.success("AI-эксперт удалён");
      onDeleted?.(agent.id);
    } catch {
      toast.error("Ошибка удаления");
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left column ── */}
        <div className="space-y-4">
          {/* Avatar (загрузка с устройства → /file/upload → S3) + имя */}
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Загрузить фото"
              className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-rm-gray-1/40 transition-colors hover:border-foreground/30 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : state.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={state.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserCircle className="h-10 w-10 text-muted-foreground" />
              )}
              {!uploading && (
                <span className="absolute inset-0 hidden flex-col items-center justify-center gap-1 bg-black/55 text-[length:var(--text-10)] font-medium text-white group-hover:flex">
                  <Upload className="h-4 w-4" />
                  Загрузить
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickAvatar}
            />
            <Input
              value={state.name}
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
              placeholder="Имя AI-эксперта"
              className="h-20 flex-1 text-[length:var(--text-24)] font-bold uppercase tracking-tight"
            />
          </div>

          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">Роль</label>
            <Input
              value={state.role}
              onChange={(e) => setState((s) => ({ ...s, role: e.target.value }))}
              placeholder="напр. Наставник по бизнес-модели"
            />
          </div>

          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              Описание пользы
            </label>
            <Textarea
              value={state.valueDescription}
              onChange={(e) => setState((s) => ({ ...s, valueDescription: e.target.value }))}
              placeholder="Что AI-эксперт делает для ученика, чем полезен"
              rows={3}
            />
          </div>

          <div>
            <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
              OpenAI Assistant
            </label>
            <select
              value={state.openAiAssistantId}
              onChange={(e) => setState((s) => ({ ...s, openAiAssistantId: e.target.value }))}
              className="h-9 w-full rounded border border-border bg-background px-3 text-[length:var(--text-14)] text-foreground outline-none focus-visible:border-ring"
            >
              <option value="">— выберите ассистента —</option>
              {/* Текущий id, которого нет в списке (легаси) — показываем как есть */}
              {state.openAiAssistantId &&
                !assistants.some((a) => a.id === state.openAiAssistantId) && (
                  <option value={state.openAiAssistantId}>{state.openAiAssistantId}</option>
                )}
              {assistants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Right column: системный промпт (косметический) ── */}
        <div className="flex flex-col">
          <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
            Системный промпт
          </label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={24}
            placeholder="Сейчас инструкции живут в OpenAI Assistant. Это поле — черновик, в бэк пока не уходит."
            className="flex-1 min-h-[400px] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)]"
          />
          <p className="mt-1 text-[length:var(--text-10)] text-muted-foreground">
            <span className="uppercase tracking-wide">В разработке.</span> Подключим, когда
            промпт будет редактироваться на стороне бэка.
          </p>
        </div>
      </div>

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
