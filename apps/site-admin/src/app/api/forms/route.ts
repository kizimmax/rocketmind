import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Scope = "product" | "article" | "both";
function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

const DEFAULT_FIELDS = { name: true, email: true, phone: false, message: true };
/** Историческое поведение: required был хардкодом на name+email. Сохраняем. */
const DEFAULT_REQUIRED_FIELDS = { name: true, email: true, phone: false, message: false };
const DEFAULT_CHIPS = { enabled: false, multi: false, label: "Тема обращения" };
const DEFAULT_CONSENT = { text: "Я соглашаюсь с {links} и даю согласие на обработку персональных данных.", links: [] };
const DEFAULT_INTEGRATIONS = {
  // Bitrix24 включён по умолчанию для всех новых форм. Per-form URL не задан —
  // backend подставит глобальный из env BITRIX24_DEFAULT_WEBHOOK_URL.
  bitrix24: { enabled: true, webhookUrl: "", assignedById: null as number | null },
  email: { enabled: false, recipients: [] as string[], subject: "" },
  telegram: { enabled: false, chatId: "", topicId: "" },
};

function mergeIntegrations(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const b = (r.bitrix24 ?? {}) as Record<string, unknown>;
  const e = (r.email ?? {}) as Record<string, unknown>;
  const t = (r.telegram ?? {}) as Record<string, unknown>;
  const recipients = Array.isArray(e.recipients)
    ? e.recipients.filter((x): x is string => typeof x === "string")
    : [];
  // Legacy-формы (созданные до интеграций) не имеют поля integrations вовсе.
  // Чтобы не заставлять админа вручную включать Bitrix24 на каждой форме, для них
  // дефолт = ВКЛ. Если форма уже пересохранена после фичи (raw имеет любой ключ) —
  // читаем enabled явно (true только если буквально true, иначе false).
  const hasAny = !!r.bitrix24 || !!r.email || !!r.telegram;
  return {
    bitrix24: {
      enabled: hasAny ? b.enabled === true : true,
      webhookUrl: typeof b.webhookUrl === "string" ? b.webhookUrl : "",
      assignedById: typeof b.assignedById === "number" ? b.assignedById : null,
    },
    email: {
      enabled: e.enabled === true,
      recipients,
      subject: typeof e.subject === "string" ? e.subject : "",
    },
    telegram: {
      enabled: t.enabled === true,
      chatId: typeof t.chatId === "string" ? t.chatId : "",
      topicId: typeof t.topicId === "string" ? t.topicId : "",
    },
  };
}

function parseSuccessGift(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const url = typeof r.url === "string" ? r.url.trim() : "";
  if (!url) return null;
  return { kind: r.kind === "file" ? "file" : "link", url, label: typeof r.label === "string" ? r.label : "" };
}

type FormContent = { id?: string; scope?: string; title?: string; description?: string; submitButtonText?: string; successMessage?: string; successGift?: unknown; fields?: object; requiredFields?: object; chips?: object; consent?: object; integrations?: object; [key: string]: unknown };

function toDto(f: { id: string; name: string; content: unknown; createdAt: Date; updatedAt: Date }) {
  const cnt = (f.content ?? {}) as FormContent;
  const formId = typeof cnt.id === "string" && cnt.id ? cnt.id : f.id;
  return {
    id: formId,
    name: f.name,
    scope: parseScope(cnt.scope),
    title: String(cnt.title ?? ""),
    description: String(cnt.description ?? ""),
    submitButtonText: String(cnt.submitButtonText ?? ""),
    successMessage: String(cnt.successMessage ?? ""),
    successGift: parseSuccessGift(cnt.successGift),
    fields: { ...DEFAULT_FIELDS, ...(cnt.fields as object) },
    requiredFields: { ...DEFAULT_REQUIRED_FIELDS, ...(cnt.requiredFields as object ?? {}) },
    chips: { ...DEFAULT_CHIPS, ...(cnt.chips as object) },
    consent: { ...DEFAULT_CONSENT, ...(cnt.consent as object) },
    integrations: mergeIntegrations(cnt.integrations),
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

export async function GET() {
  const items = await prisma.formEntity.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(items.map(toDto));
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = typeof body.id === "string" && body.id.trim() ? body.id.trim() : null;
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "";
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const existing = await prisma.formEntity.findFirst({ where: { content: { path: ["id"], equals: id } } });
  if (existing) return NextResponse.json({ error: "exists" }, { status: 409 });

  const now = new Date().toISOString();
  const item = await prisma.formEntity.create({
    data: {
      name: name || id,
      content: {
        id,
        scope: parseScope(body.scope),
        title: "",
        description: "",
        submitButtonText: "Отправить",
        successMessage: "Спасибо! Мы получили заявку и свяжемся с вами в ближайшее время.",
        successGift: null,
        fields: DEFAULT_FIELDS,
        requiredFields: DEFAULT_REQUIRED_FIELDS,
        chips: DEFAULT_CHIPS,
        consent: DEFAULT_CONSENT,
        integrations: DEFAULT_INTEGRATIONS,
        createdAt: now,
      },
    },
  });
  return NextResponse.json(toDto(item), { status: 201 });
}
