import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Scope = "product" | "article" | "both";
function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

const DEFAULT_FIELDS = { name: true, email: true, phone: false, message: true };
const DEFAULT_CHIPS = { enabled: false, multi: false, label: "Тема обращения" };
const DEFAULT_CONSENT = { text: "Я соглашаюсь с {links} и даю согласие на обработку персональных данных.", links: [] };

function parseSuccessGift(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const url = typeof r.url === "string" ? r.url.trim() : "";
  if (!url) return null;
  return { kind: r.kind === "file" ? "file" : "link", url, label: typeof r.label === "string" ? r.label : "" };
}

type FormContent = { id?: string; scope?: string; title?: string; description?: string; submitButtonText?: string; successMessage?: string; successGift?: unknown; fields?: object; chips?: object; consent?: object; [key: string]: unknown };

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
    chips: { ...DEFAULT_CHIPS, ...(cnt.chips as object) },
    consent: { ...DEFAULT_CONSENT, ...(cnt.consent as object) },
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
        chips: DEFAULT_CHIPS,
        consent: DEFAULT_CONSENT,
        createdAt: now,
      },
    },
  });
  return NextResponse.json(toDto(item), { status: 201 });
}
