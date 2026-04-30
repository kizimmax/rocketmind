"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Pencil, Upload, X } from "lucide-react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from "@rocketmind/ui";
import { LEGAL_LINKS } from "@rocketmind/ui/content";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type {
  FormEntity,
  EntityScope,
  FormConsentConfig,
} from "@/lib/types";
import {
  ID_REGEX,
  SCOPE_LABEL,
  ScopeFilter,
  ScopeSelect,
  slugify,
  uniqueSlug,
} from "./scope-helpers";
import { NbspInput, NbspTextarea, VisualizedNbsp } from "./nbsp-fields";

export function FormsPanel({
  forms: items,
  setForms: setItems,
}: {
  forms: FormEntity[];
  setForms: Dispatch<SetStateAction<FormEntity[]>>;
}) {
  const [scopeFilter, setScopeFilter] = useState<EntityScope | "all">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [idTouched, setIdTouched] = useState(false);
  const [newScope, setNewScope] = useState<EntityScope>("both");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const existingIds = new Set(items.map((f) => f.id));
  const idCollision = newId !== "" && existingIds.has(newId);

  const load = () => {
    apiFetch("/api/forms")
      .then((r) => r.json() as Promise<FormEntity[]>)
      .then(setItems)
      .catch(() => {});
  };

  async function handleCreate() {
    const name = newName.trim();
    const id = (newId.trim() || slugify(name)).trim();
    if (!name) return;
    if (!ID_REGEX.test(id)) {
      toast.error("ID может содержать только латиницу, цифры и дефис");
      return;
    }
    const res = await apiFetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, scope: newScope }),
    });
    if (res.ok) {
      const created = (await res.json()) as FormEntity;
      setItems((prev) => [...prev, created]);
      setNewName("");
      setNewId("");
      setIdTouched(false);
      setNewScope("both");
      setIsCreating(false);
      toast.success("Форма создана");
    } else if (res.status === 409) {
      toast.error("Форма с таким ID уже существует");
    } else {
      toast.error("Ошибка создания");
    }
  }

  async function patch(id: string, patch: Partial<FormEntity>) {
    setItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    const current = items.find((f) => f.id === id);
    if (!current) return;
    const next = { ...current, ...patch };
    const res = await apiFetch(`/api/forms/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      toast.error("Ошибка сохранения");
      load();
    }
  }

  /** Применить новый текст согласия ко всем формам (одной кнопкой из модалки). */
  async function applyConsentTextToAll(text: string) {
    setItems((prev) =>
      prev.map((f) => ({ ...f, consent: { ...f.consent, text } })),
    );
    const results = await Promise.all(
      items.map((f) =>
        apiFetch(`/api/forms/${encodeURIComponent(f.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...f, consent: { ...f.consent, text } }),
        }),
      ),
    );
    if (results.some((r) => !r.ok)) {
      toast.error("Не удалось обновить часть форм");
      load();
    } else {
      toast.success(`Текст согласия обновлён во всех формах (${items.length})`);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await apiFetch(
      `/api/forms/${encodeURIComponent(deleteTarget)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setItems((prev) => prev.filter((f) => f.id !== deleteTarget));
      toast.success("Форма удалена");
    } else {
      toast.error("Ошибка удаления");
    }
    setDeleteTarget(null);
  }

  const visibleItems = items.filter(
    (f) => scopeFilter === "all" || f.scope === scopeFilter,
  );

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-tight text-foreground">
          Формы
        </h2>
        <ScopeFilter value={scopeFilter} onChange={setScopeFilter} />
      </div>

      <div className="mb-4">
        {isCreating ? (
          <div className="flex flex-wrap items-center gap-2">
            <Input
              size="sm"
              placeholder="Название (для админки)"
              value={newName}
              onChange={(e) => {
                const name = e.target.value;
                setNewName(name);
                if (!idTouched) {
                  setNewId(uniqueSlug(slugify(name), existingIds));
                }
              }}
              autoFocus
              className="max-w-xs"
            />
            <Input
              size="sm"
              placeholder="id (slug)"
              value={newId}
              onChange={(e) => {
                setIdTouched(true);
                setNewId(e.target.value);
              }}
              className={`max-w-[180px] font-mono ${
                idCollision ? "border-[var(--rm-red-500)]" : ""
              }`}
            />
            <ScopeSelect value={newScope} onChange={setNewScope} size="sm" />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!newName.trim() || !newId.trim() || idCollision}
            >
              Создать
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewName("");
                setNewId("");
                setIdTouched(false);
                setNewScope("both");
              }}
            >
              Отмена
            </Button>
            {idCollision && (
              <p className="basis-full text-[length:var(--text-11)] text-[var(--rm-red-500)]">
                ID «{newId}» уже занят. Измени вручную или сотри — авто-ID
                подберёт свободный.
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Добавить форму
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {visibleItems.map((f) => (
          <FormCard
            key={f.id}
            form={f}
            onPatch={(p) => patch(f.id, p)}
            onDelete={() => setDeleteTarget(f.id)}
            onApplyConsentTextToAll={applyConsentTextToAll}
          />
        ))}
      </div>

      {visibleItems.length === 0 && (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          {items.length === 0
            ? "Нет форм. Создайте первую."
            : `Нет форм в скоупе «${SCOPE_LABEL[scopeFilter as EntityScope] ?? ""}»`}
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить форму?"
        description="CTA-блоки, ссылающиеся на эту форму, перестанут открывать модалку."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ── Form Card ───────────────────────────────────────────────────────────────

function FormCard({
  form,
  onPatch,
  onDelete,
  onApplyConsentTextToAll,
}: {
  form: FormEntity;
  onPatch: (p: Partial<FormEntity>) => void;
  onDelete: () => void;
  onApplyConsentTextToAll: (text: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(form.name);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description);
  const [submitButtonText, setSubmitButtonText] = useState(
    form.submitButtonText,
  );
  const [successMessage, setSuccessMessage] = useState(form.successMessage);
  const [giftEnabled, setGiftEnabled] = useState(!!form.successGift?.url);
  const [giftKind, setGiftKind] = useState<"file" | "link">(
    form.successGift?.kind ?? "link",
  );
  const [giftUrl, setGiftUrl] = useState(form.successGift?.url ?? "");
  const [giftLabel, setGiftLabel] = useState(form.successGift?.label ?? "");
  const [giftFileName, setGiftFileName] = useState(
    form.successGift?.kind === "file"
      ? (form.successGift.url.split("/").pop() ?? "")
      : "",
  );
  const [giftUploading, setGiftUploading] = useState(false);

  useEffect(() => setName(form.name), [form.name]);
  useEffect(() => setTitle(form.title), [form.title]);
  useEffect(() => setDescription(form.description), [form.description]);
  useEffect(
    () => setSubmitButtonText(form.submitButtonText),
    [form.submitButtonText],
  );
  useEffect(() => setSuccessMessage(form.successMessage), [form.successMessage]);
  useEffect(() => {
    setGiftEnabled(!!form.successGift?.url);
    setGiftKind(form.successGift?.kind ?? "link");
    setGiftUrl(form.successGift?.url ?? "");
    setGiftLabel(form.successGift?.label ?? "");
    setGiftFileName(
      form.successGift?.kind === "file"
        ? (form.successGift.url.split("/").pop() ?? "")
        : "",
    );
  }, [form.successGift]);

  function saveGift() {
    if (!giftEnabled || !giftUrl.trim()) {
      if (form.successGift) onPatch({ successGift: null });
      return;
    }
    const next = { kind: giftKind, url: giftUrl.trim(), label: giftLabel };
    if (
      form.successGift?.kind !== next.kind ||
      form.successGift?.url !== next.url ||
      form.successGift?.label !== next.label
    ) {
      onPatch({ successGift: next });
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setGiftUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await apiFetch(
        `/api/forms/${encodeURIComponent(form.id)}/upload`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl, fileName: file.name }),
        },
      );
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(`Ошибка загрузки: ${err.error ?? res.status}`);
        return;
      }
      const { url, fileName } = (await res.json()) as {
        url: string;
        fileName: string;
      };
      const autoLabel = giftLabel || file.name.replace(/\.[^.]+$/, "");
      setGiftUrl(url);
      setGiftFileName(fileName);
      setGiftLabel(autoLabel);
      onPatch({ successGift: { kind: "file", url, label: autoLabel } });
      toast.success("Файл загружен");
    } finally {
      setGiftUploading(false);
    }
  }

  return (
    <div className="group relative flex flex-col rounded-sm border border-[#404040] bg-[#0A0A0A]">
      {/* Header — компактный */}
      <div className="flex items-center gap-2 border-b border-[#404040] px-3 py-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-sm p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          aria-label={expanded ? "Свернуть" : "Развернуть"}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        <Input
          size="sm"
          placeholder="Название (для админки)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name !== form.name && onPatch({ name })}
          className="max-w-[200px] border-0 bg-transparent shadow-none focus-visible:ring-1"
        />
        <ScopeSelect
          value={form.scope}
          onChange={(scope) => onPatch({ scope })}
          size="sm"
        />
        <span className="ml-auto font-mono text-[length:var(--text-11)] text-[#666]">
          id: {form.id}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-sm p-1 text-muted-foreground opacity-0 transition hover:bg-foreground/10 hover:text-[var(--rm-red-500)] group-hover:opacity-100"
          aria-label="Удалить"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 px-3 py-3">
          <p className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
            Превью модалки — редактирование инлайн
          </p>
          {/* Modal preview — стиль повторяет настоящую модалку: тёмный фон,
              max-w как в DialogContent (560px), inline-edit полей. */}
          <div className="mx-auto w-full max-w-[560px] rounded-md border border-border bg-background p-6 shadow-sm">
            {/* DialogHeader */}
            <div className="mb-4 flex flex-col gap-1.5">
              <NbspInput
                value={title}
                onChange={setTitle}
                onBlur={() => title !== form.title && onPatch({ title })}
                placeholder="Заголовок модалки (DialogTitle)"
                showPreview={false}
                className="h-auto border-transparent bg-transparent !pr-12 !text-[18px] font-semibold leading-tight tracking-tight text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:border-border"
              />
              <VisualizedNbsp value={title} />
              <NbspTextarea
                value={description}
                onChange={setDescription}
                onBlur={() =>
                  description !== form.description &&
                  onPatch({ description })
                }
                placeholder="Описание (DialogDescription)"
                showPreview={false}
                className="min-h-[44px] border-transparent bg-transparent !pr-12 text-[14px] leading-[1.4] text-muted-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:border-border"
              />
              <VisualizedNbsp value={description} />
            </div>

            {/* Поля — превью полей формы с тоглами на каждое */}
            <div className="mb-4 flex flex-col gap-3">
              <FieldPreviewRow
                label="Имя"
                placeholder="Имя"
                enabled={form.fields.name}
                onToggle={(v) =>
                  onPatch({ fields: { ...form.fields, name: v } })
                }
              />
              <FieldPreviewRow
                label="Email"
                placeholder="Email"
                enabled={form.fields.email}
                onToggle={(v) =>
                  onPatch({ fields: { ...form.fields, email: v } })
                }
              />
              <FieldPreviewRow
                label="Телефон"
                placeholder="Телефон"
                enabled={form.fields.phone}
                onToggle={(v) =>
                  onPatch({ fields: { ...form.fields, phone: v } })
                }
              />
              <FieldPreviewRow
                label="Сообщение"
                placeholder="Сообщение"
                enabled={form.fields.message}
                onToggle={(v) =>
                  onPatch({ fields: { ...form.fields, message: v } })
                }
                multiline
              />
            </div>

            {/* Консент — читается inline ниже DialogFooter */}
            <div className="mb-4">
              <ConsentEditor
                consent={form.consent}
                onChange={(consent) => onPatch({ consent })}
                onApplyTextToAll={onApplyConsentTextToAll}
              />
            </div>

            {/* Submit-кнопка — inline-edit текста, выглядит как настоящая кнопка */}
            <div
              className="relative inline-flex items-center rounded-sm h-12 w-full px-6"
              style={{ backgroundColor: "var(--rm-yellow-100)" }}
            >
              <NbspInput
                value={submitButtonText}
                onChange={setSubmitButtonText}
                onBlur={() =>
                  submitButtonText !== form.submitButtonText &&
                  onPatch({ submitButtonText })
                }
                placeholder="Отправить"
                showPreview={false}
                className="h-auto w-full border-0 bg-transparent !pr-10 text-center text-[length:var(--text-16)] font-medium uppercase tracking-[0.04em] shadow-none focus-visible:ring-0"
                style={{ color: "var(--rm-yellow-fg)" }}
              />
            </div>
          </div>

          {/* Success message — отдельным блоком ниже превью, потому что в модалке
              это другой экран (после сабмита). */}
          <div className="rounded-sm border border-border p-3">
            <div className="mb-1.5 text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
              Сообщение об успехе (после отправки)
            </div>
            <NbspTextarea
              value={successMessage}
              onChange={setSuccessMessage}
              onBlur={() =>
                successMessage !== form.successMessage &&
                onPatch({ successMessage })
              }
              placeholder="Спасибо! Мы получили заявку…"
              className="min-h-[40px]"
            />
          </div>

          {/* Gift — файл/ссылка на экране успеха */}
          <div className="rounded-sm border border-border p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
                Подарок после отправки
              </div>
              <label className="flex cursor-pointer select-none items-center gap-1.5 text-[length:var(--text-11)] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={giftEnabled}
                  onChange={(e) => {
                    const v = e.target.checked;
                    setGiftEnabled(v);
                    if (!v) onPatch({ successGift: null });
                  }}
                />
                Включить
              </label>
            </div>

            {giftEnabled && (
              <div className="flex flex-col gap-2">
                {/* Kind pills */}
                <div className="flex gap-1.5">
                  {(["link", "file"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setGiftKind(k);
                        if (k !== giftKind) {
                          setGiftUrl("");
                          setGiftFileName("");
                        }
                      }}
                      className={[
                        "rounded-sm border px-2.5 py-1 text-[length:var(--text-11)] uppercase tracking-wide transition-colors",
                        giftKind === k
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:border-foreground/50",
                      ].join(" ")}
                    >
                      {k === "link" ? "Ссылка" : "Файл (скачать)"}
                    </button>
                  ))}
                </div>

                {giftKind === "file" ? (
                  <>
                    {/* Uploaded file row */}
                    {giftUrl && (
                      <div className="flex items-center gap-2 rounded-sm border border-border bg-[#0F0F0F] px-3 py-2">
                        <span className="flex-1 truncate font-mono text-[length:var(--text-11)] text-muted-foreground">
                          {giftFileName || giftUrl.split("/").pop()}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setGiftUrl("");
                            setGiftFileName("");
                            onPatch({ successGift: null });
                          }}
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Удалить файл"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {/* File picker */}
                    <label
                      className={[
                        "flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-border px-4 py-3 text-[length:var(--text-12)] text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground",
                        giftUploading ? "pointer-events-none opacity-50" : "",
                      ].join(" ")}
                    >
                      <Upload className="h-4 w-4 shrink-0" />
                      {giftUploading
                        ? "Загрузка…"
                        : giftUrl
                          ? "Заменить файл"
                          : "Выбрать файл (pdf, doc, zip…)"}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png,.webp"
                        onChange={handleFileUpload}
                        disabled={giftUploading}
                      />
                    </label>
                  </>
                ) : (
                  <Input
                    size="sm"
                    placeholder="URL страницы"
                    value={giftUrl}
                    onChange={(e) => setGiftUrl(e.target.value)}
                    onBlur={saveGift}
                  />
                )}

                <Input
                  size="sm"
                  placeholder="Текст кнопки (напр. «Скачать гайд»)"
                  value={giftLabel}
                  onChange={(e) => setGiftLabel(e.target.value)}
                  onBlur={saveGift}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Field preview row (inline-edit modal field) ────────────────────────────

/**
 * Превью одного поля формы в стиле настоящей модалки. Полупрозрачное, когда
 * поле отключено. Слева — placeholder-имя поля (как в реальном Input/Textarea),
 * справа — Switch для включения/отключения.
 */
function FieldPreviewRow({
  label,
  placeholder,
  enabled,
  onToggle,
  multiline,
}: {
  label: string;
  placeholder: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
  multiline?: boolean;
}) {
  const previewClass =
    "flex w-full items-center rounded-sm border border-border bg-background px-3 text-[14px] text-muted-foreground/70";
  return (
    <div
      className={`flex items-stretch gap-2 transition-opacity ${
        enabled ? "opacity-100" : "opacity-40"
      }`}
    >
      {multiline ? (
        <div className={`${previewClass} min-h-[60px] py-2.5`}>
          {placeholder}
        </div>
      ) : (
        <div className={`${previewClass} h-10`}>{placeholder}</div>
      )}
      <label
        className="flex shrink-0 items-center gap-2 rounded-sm border border-border bg-muted/30 px-2 text-[length:var(--text-11)] text-muted-foreground"
        title={`${enabled ? "Отключить" : "Включить"} поле «${label}»`}
      >
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        {label}
      </label>
    </div>
  );
}

// ── Consent editor ──────────────────────────────────────────────────────────

const DEFAULT_CONSENT_TEXT =
  "Я соглашаюсь с {links} и даю согласие на обработку персональных данных.";

/**
 * Превью текста согласия — подставляет {links} как стилизованные ссылки.
 * Если у формы пуст список `consent.links` — берём дефолтные ссылки из футера
 * (LEGAL_LINKS), как это делает сайт.
 */
function ConsentPreview({ consent }: { consent: FormConsentConfig }) {
  const text = consent.text || DEFAULT_CONSENT_TEXT;
  const links =
    consent.links.length > 0
      ? consent.links.map((l) => l.label)
      : LEGAL_LINKS.map((l) => l.label);

  let body: React.ReactNode;
  if (!text.includes("{links}")) {
    body = text;
  } else if (links.length === 0) {
    body = text.replace(/\s*\{links\}\s*/g, " ").trim();
  } else {
    const [before, after] = text.split("{links}");
    body = (
      <>
        {before}
        {links.map((label, i) => (
          <span key={`${label}-${i}`}>
            {i > 0 && ", "}
            <span className="underline decoration-muted-foreground/60 underline-offset-2">
              {label}
            </span>
          </span>
        ))}
        {after}
      </>
    );
  }

  return (
    <label className="flex items-start gap-2 text-[length:var(--text-12)] leading-[1.4] text-muted-foreground">
      <input
        type="checkbox"
        disabled
        className="mt-0.5 shrink-0 cursor-not-allowed"
      />
      <span>{body}</span>
    </label>
  );
}

function ConsentEditor({
  consent,
  onChange,
  onApplyTextToAll,
}: {
  consent: FormConsentConfig;
  onChange: (next: FormConsentConfig) => void;
  onApplyTextToAll: (text: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(consent.text);
  const [applyToAll, setApplyToAll] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setDraft(consent.text);
    setApplyToAll(false);
    setOpen(true);
  }

  async function save() {
    const text = draft;
    setSaving(true);
    try {
      if (applyToAll) {
        await onApplyTextToAll(text);
      } else if (text !== consent.text) {
        onChange({ ...consent, text });
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-border p-3">
      <div className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
        Согласие (чекбокс — обязателен на всех формах)
      </div>
      <div className="flex items-start gap-3">
        <div className="flex-1 rounded-sm bg-[#0F0F0F] p-3">
          <ConsentPreview consent={consent} />
        </div>
        <Button size="sm" variant="outline" onClick={startEdit}>
          <Pencil className="mr-1 h-3.5 w-3.5" />
          Изменить
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(o) => !saving && setOpen(o)}>
        <DialogContent className="max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Текст согласия</DialogTitle>
            <DialogDescription>
              Используйте подстановку <code className="font-mono">{"{links}"}</code>{" "}
              — UI подставит ссылки на юридические документы из футера сайта.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={DEFAULT_CONSENT_TEXT}
              className="min-h-[88px]"
              autoFocus
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
                Превью
              </span>
              <div className="rounded-sm border border-border bg-[#0F0F0F] p-3">
                <ConsentPreview consent={{ ...consent, text: draft }} />
              </div>
            </div>

            <label className="mt-1 flex cursor-pointer items-center gap-2 text-[length:var(--text-13)] text-foreground">
              <Checkbox
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
              />
              Изменить для всех форм
            </label>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Отмена
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Сохраняем…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
