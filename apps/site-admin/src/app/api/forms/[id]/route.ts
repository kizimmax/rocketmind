import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Scope = "product" | "article" | "both";
function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

function parseFields(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { name: r.name !== false, email: r.email !== false, phone: r.phone === true, message: r.message === true };
}

function parseRequiredFields(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  // Default — историческое поведение: name+email обязательны.
  return {
    name: r.name === undefined ? true : r.name === true,
    email: r.email === undefined ? true : r.email === true,
    phone: r.phone === true,
    message: r.message === true,
  };
}

function parseChips(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { enabled: r.enabled === true, multi: r.multi === true, label: typeof r.label === "string" ? r.label : "" };
}

function parseSuccessGift(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const url = typeof r.url === "string" ? r.url.trim() : "";
  if (!url) return null;
  return { kind: r.kind === "file" ? "file" : "link", url, label: typeof r.label === "string" ? r.label : "" };
}

function parseIntegrations(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const b = (r.bitrix24 ?? {}) as Record<string, unknown>;
  const e = (r.email ?? {}) as Record<string, unknown>;
  const t = (r.telegram ?? {}) as Record<string, unknown>;
  const recipients = Array.isArray(e.recipients)
    ? e.recipients.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((x) => x.trim())
    : [];
  return {
    bitrix24: {
      enabled: b.enabled === true,
      webhookUrl: typeof b.webhookUrl === "string" ? b.webhookUrl.trim() : "",
      assignedById: typeof b.assignedById === "number" ? b.assignedById : null,
    },
    email: {
      enabled: e.enabled === true,
      recipients,
      subject: typeof e.subject === "string" ? e.subject : "",
    },
    telegram: {
      enabled: t.enabled === true,
      chatId: typeof t.chatId === "string" ? t.chatId.trim() : "",
      topicId: typeof t.topicId === "string" ? t.topicId.trim() : "",
    },
  };
}

function parseConsent(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawLinks = Array.isArray(r.links) ? r.links : [];
  const links = rawLinks
    .map((item, i) => {
      if (!item || typeof item !== "object") return null;
      const li = item as Record<string, unknown>;
      const label = typeof li.label === "string" ? li.label : "";
      const url = typeof li.url === "string" ? li.url : "";
      if (!label || !url) return null;
      return { id: typeof li.id === "string" && li.id ? li.id : `l${i}`, label, url };
    })
    .filter((l): l is { id: string; label: string; url: string } => l !== null);
  return { text: typeof r.text === "string" ? r.text : "", links };
}

async function findForm(id: string) {
  return (
    await prisma.formEntity.findFirst({ where: { content: { path: ["id"], equals: id } } }) ??
    await prisma.formEntity.findUnique({ where: { id } }).catch(() => null)
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const form = await findForm(id);
  if (!form) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const existing = (form.content ?? {}) as Record<string, unknown>;
  const updated = await prisma.formEntity.update({
    where: { id: form.id },
    data: {
      name: typeof body.name === "string" ? body.name : form.name,
      content: {
        ...existing,
        scope: parseScope(body.scope),
        title: typeof body.title === "string" ? body.title : "",
        description: typeof body.description === "string" ? body.description : "",
        submitButtonText: typeof body.submitButtonText === "string" ? body.submitButtonText : "",
        successMessage: typeof body.successMessage === "string" ? body.successMessage : "",
        successGift: parseSuccessGift(body.successGift),
        fields: parseFields(body.fields),
        requiredFields: parseRequiredFields(body.requiredFields),
        chips: parseChips(body.chips),
        consent: parseConsent(body.consent),
        integrations: parseIntegrations(body.integrations),
      },
    },
  });
  return NextResponse.json({ ok: true, id, updatedAt: updated.updatedAt.toISOString() });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const form = await findForm(id);
  if (form) await prisma.formEntity.delete({ where: { id: form.id } });
  return NextResponse.json({ ok: true });
}
