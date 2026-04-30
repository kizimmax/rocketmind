"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Check, Download, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { cn } from "../../lib/utils";

// ── Types (mirrors @rocketmind/site Form/Cta entities) ─────────────────────

export type FormFieldsConfig = {
  name: boolean;
  email: boolean;
  phone: boolean;
  message: boolean;
};

export type FormChipsConfig = {
  enabled: boolean;
  multi: boolean;
  label: string;
};

export type FormConsentLink = { id: string; label: string; url: string };

export type FormConsentConfig = {
  text: string;
  links: FormConsentLink[];
};

export type FormSuccessGift = {
  kind: "file" | "link";
  url: string;
  label: string;
};

export type FormEntity = {
  id: string;
  name: string;
  scope: "product" | "article" | "both";
  title: string;
  description: string;
  submitButtonText: string;
  successMessage: string;
  successGift?: FormSuccessGift | null;
  fields: FormFieldsConfig;
  chips: FormChipsConfig;
  consent: FormConsentConfig;
};

// ── Context ────────────────────────────────────────────────────────────────

type OpenContext = {
  /** Заголовок одного предвыбранного чипса (например, заголовок карточки услуги). */
  chipPrefilled?: string;
  /** Все доступные чипсы для этой страницы (заголовки карточек блока «Услуги»). */
  availableChips?: string[];
  /**
   * Конфиг чипсов из блока «Услуги» страницы (multi/label). Если не передан —
   * чипсы не рендерятся вообще, даже при наличии `availableChips`.
   */
  chipsConfig?: { multi?: boolean; label?: string };
};

type ModalContextValue = {
  openForm: (formId: string, ctx?: OpenContext) => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function useFormModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    return {
      openForm: () => {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.warn("openForm called outside <ModalProvider>");
        }
      },
    };
  }
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────

type SubmitHandler = (
  form: FormEntity,
  payload: Record<string, unknown>,
) => Promise<void> | void;

export function ModalProvider({
  forms,
  children,
  onSubmit,
  defaultConsentLinks,
}: {
  forms: FormEntity[];
  children: ReactNode;
  onSubmit?: SubmitHandler;
  /**
   * Дефолтные ссылки на документы для consent-чекбокса (Политика, согласие на
   * обработку ПД и т.п.). Используются, когда у формы `consent.links` пустой —
   * то есть админ не задал кастомные ссылки. Передавать relative paths
   * (`/legal/...`) — они переживают смену домена и base-path.
   */
  defaultConsentLinks?: FormConsentLink[];
}) {
  const [open, setOpen] = useState(false);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [openCtx, setOpenCtx] = useState<OpenContext>({});

  const formsById = useMemo(() => {
    const m = new Map<string, FormEntity>();
    for (const f of forms) m.set(f.id, f);
    return m;
  }, [forms]);

  const openForm = useCallback<ModalContextValue["openForm"]>(
    (formId, ctx) => {
      if (!formId || !formsById.has(formId)) {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.warn(`Form not found: ${formId}`);
        }
        return;
      }
      setActiveFormId(formId);
      setOpenCtx(ctx ?? {});
      setOpen(true);
    },
    [formsById],
  );

  const value = useMemo<ModalContextValue>(() => ({ openForm }), [openForm]);

  const activeForm = activeFormId ? formsById.get(activeFormId) : null;

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) {
            setActiveFormId(null);
            setOpenCtx({});
          }
        }}
      >
        <DialogContent className="max-w-[560px]">
          {activeForm && (
            <FormModalBody
              form={activeForm}
              ctx={openCtx}
              defaultConsentLinks={defaultConsentLinks}
              onSubmit={onSubmit}
              onClose={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}

// ── FormModalBody — отдельно, чтобы state сбрасывался по mount/unmount ────

function FormModalBody({
  form,
  ctx,
  defaultConsentLinks,
  onSubmit,
  onClose,
}: {
  form: FormEntity;
  ctx: OpenContext;
  defaultConsentLinks?: FormConsentLink[];
  onSubmit?: SubmitHandler;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    const gift = form.successGift;
    const hasGift = gift && gift.url.trim();
    return (
      <div className="flex flex-col items-center gap-7 py-8 text-center">
        {/* Checkmark circle */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
          <Check className="h-6 w-6 text-foreground" strokeWidth={2} />
        </div>

        <p className="h2 text-foreground">
          {form.successMessage ||
            "Заявка получена. Мы свяжемся с вами в ближайшее время."}
        </p>

        {hasGift && (
          <a
            href={gift.url}
            download={gift.kind === "file" ? "" : undefined}
            target={gift.kind === "link" ? "_blank" : undefined}
            rel={gift.kind === "link" ? "noopener noreferrer" : undefined}
            className="flex w-full items-center justify-center gap-3 rounded-sm border border-border bg-foreground px-6 py-4 text-[15px] font-semibold uppercase tracking-[0.04em] text-background transition-opacity hover:opacity-80"
          >
            {gift.kind === "file" ? (
              <Download className="h-5 w-5 shrink-0" strokeWidth={2} />
            ) : (
              <ExternalLink className="h-5 w-5 shrink-0" strokeWidth={2} />
            )}
            {gift.label ||
              (gift.kind === "file" ? "Скачать материал" : "Перейти по ссылке")}
          </a>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground"
        >
          Закрыть
        </Button>
      </div>
    );
  }

  return (
    <DynamicForm
      form={form}
      chipPrefilled={ctx.chipPrefilled}
      availableChips={ctx.availableChips}
      chipsConfig={ctx.chipsConfig}
      defaultConsentLinks={defaultConsentLinks}
      onSubmit={async (payload) => {
        if (onSubmit) await onSubmit(form, payload);
        else {
          // Default stub — webhook integration в шаге 7.
          // eslint-disable-next-line no-console
          console.log("[FormModal] submit", form.id, payload);
        }
        setSubmitted(true);
      }}
    />
  );
}

// ── DynamicForm ────────────────────────────────────────────────────────────

export function DynamicForm({
  form,
  chipPrefilled,
  availableChips,
  chipsConfig,
  defaultConsentLinks,
  onSubmit,
}: {
  form: FormEntity;
  chipPrefilled?: string;
  availableChips?: string[];
  /**
   * Конфиг чипсов из контекста открытия (multi/label). Передаётся блоком
   * «Услуги» страницы — там же админ настраивает single/multi и заголовок.
   * Если не передан, чипсы не рендерятся.
   */
  chipsConfig?: { multi?: boolean; label?: string };
  /** Дефолтные ссылки consent — используются если у формы `consent.links` пуст. */
  defaultConsentLinks?: FormConsentLink[];
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [chips, setChips] = useState<string[]>(
    chipPrefilled ? [chipPrefilled] : [],
  );
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Чипсы рендерятся, если страница передала и `chipsConfig`, и хотя бы одну
  // опцию. Источник правды по multi/label — `chipsConfig` (на блоке «Услуги»).
  const showChips =
    !!chipsConfig &&
    Array.isArray(availableChips) &&
    availableChips.length > 0;
  const isMulti = chipsConfig?.multi === true;
  const chipsLabel = chipsConfig?.label ?? "";

  function toggleChip(label: string) {
    if (isMulti) {
      setChips((cur) =>
        cur.includes(label) ? cur.filter((c) => c !== label) : [...cur, label],
      );
    } else {
      setChips((cur) => (cur[0] === label ? [] : [label]));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consentChecked) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = { formId: form.id };
      if (form.fields.name) payload.name = name;
      if (form.fields.email) payload.email = email;
      if (form.fields.phone) payload.phone = phone;
      if (form.fields.message) payload.message = message;
      if (showChips) payload.chips = isMulti ? chips : chips[0] ?? "";
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  // Stagger: модалка едет ~500ms снизу. Внутренние элементы стартуют через
  // 180ms (когда контент уже почти на месте) с шагом 70ms — заголовок →
  // поля сверху вниз → чекбокс согласия → кнопка отправки.
  let order = 0;
  const stage = (): React.CSSProperties => ({
    opacity: 0,
    animation: `formStaggerIn 500ms cubic-bezier(0.16, 1, 0.3, 1) ${180 + order++ * 70}ms forwards`,
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader style={stage()}>
        <DialogTitle>{form.title || "Заявка"}</DialogTitle>
        {form.description && (
          <DialogDescription>{form.description}</DialogDescription>
        )}
      </DialogHeader>

      <div className="flex flex-col gap-3">
        {form.fields.name && (
          <Input
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            style={stage()}
          />
        )}
        {form.fields.email && (
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={stage()}
          />
        )}
        {form.fields.phone && (
          <Input
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            style={stage()}
          />
        )}
        {form.fields.message && (
          <Textarea
            placeholder="Сообщение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px]"
            style={stage()}
          />
        )}

        {showChips && (
          <div className="flex flex-col gap-1.5" style={stage()}>
            {chipsLabel && (
              <span className="text-[12px] uppercase tracking-wide text-muted-foreground">
                {chipsLabel}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {availableChips!.map((c) => {
                const active = chips.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleChip(c)}
                    className={cn(
                      "rounded-sm border px-2.5 py-1 text-[13px] transition-colors",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground/50",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={stage()}>
        <ConsentCheckbox
          config={form.consent}
          defaultLinks={defaultConsentLinks}
          checked={consentChecked}
          onChange={setConsentChecked}
        />
      </div>

      <Button
        type="submit"
        disabled={!consentChecked || submitting}
        className="h-12 w-full px-6 text-[length:var(--text-16)] uppercase tracking-[0.04em]"
        style={stage()}
      >
        {submitting
          ? "Отправка…"
          : form.submitButtonText || "Отправить"}
      </Button>
    </form>
  );
}

// ── Consent Checkbox ──────────────────────────────────────────────────────

function ConsentCheckbox({
  config,
  defaultLinks,
  checked,
  onChange,
}: {
  config: FormConsentConfig;
  defaultLinks?: FormConsentLink[];
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const text =
    config.text ||
    "Я соглашаюсь с {links} и даю согласие на обработку персональных данных";
  // Если у формы свои ссылки — используем их (override админа); иначе —
  // дефолтные из футера сайта (Политика, Согласие на ПД, Рекламное согласие).
  const links =
    config.links.length > 0 ? config.links : defaultLinks ?? [];
  return (
    <label className="flex items-start gap-2 text-[12px] leading-[1.4] text-muted-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 shrink-0"
        required
      />
      <span>{renderConsentText(text, links)}</span>
    </label>
  );
}

function renderConsentText(text: string, links: FormConsentLink[]): ReactNode {
  // Нет {links}-плейсхолдера — рендерим текст as-is.
  if (!text.includes("{links}")) return <>{text}</>;
  // Плейсхолдер есть, но ссылок нет — убираем его (с прилегающим пробелом).
  if (links.length === 0) {
    return <>{text.replace(/\s*\{links\}\s*/g, " ").trim()}</>;
  }
  const [before, after] = text.split("{links}");
  return (
    <>
      {before}
      {links.map((l, i) => (
        <span key={l.id}>
          {i > 0 && ", "}
          <a
            href={l.url}
            target={l.url.startsWith("http") ? "_blank" : undefined}
            rel={l.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="underline hover:text-foreground"
          >
            {l.label}
          </a>
        </span>
      ))}
      {after}
    </>
  );
}
