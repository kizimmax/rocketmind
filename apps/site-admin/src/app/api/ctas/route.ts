import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

type Scope = "product" | "article" | "both";
function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

type CtaContent = { id?: string; scope?: string; heading?: string; body?: string; buttonText?: string; formId?: string; [key: string]: unknown };

function toDto(c: { id: string; name: string; content: unknown; createdAt: Date; updatedAt: Date }) {
  const cnt = (c.content ?? {}) as CtaContent;
  const ctaId = typeof cnt.id === "string" && cnt.id ? cnt.id : c.id;
  return {
    id: ctaId,
    name: c.name,
    scope: parseScope(cnt.scope),
    heading: String(cnt.heading ?? ""),
    body: String(cnt.body ?? ""),
    buttonText: String(cnt.buttonText ?? ""),
    formId: typeof cnt.formId === "string" && cnt.formId ? cnt.formId : undefined,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function GET(request: Request) {
  const gate = await requirePermission(request, "cta-forms.ctas", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const items = await prisma.ctaEntity.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(items.map(toDto));
}

export async function POST(request: Request) {
  const gate = await requirePermission(request, "cta-forms.ctas", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = await request.json();
  const id = typeof body.id === "string" && body.id.trim() ? body.id.trim() : null;
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "";
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const existing = await prisma.ctaEntity.findFirst({ where: { content: { path: ["id"], equals: id } } });
  if (existing) return NextResponse.json({ error: "exists" }, { status: 409 });

  const now = new Date().toISOString();
  const item = await prisma.ctaEntity.create({
    data: {
      name: name || id,
      content: { id, scope: parseScope(body.scope), heading: "", body: "", buttonText: "оставить заявку", createdAt: now },
    },
  });
  return NextResponse.json(toDto(item), { status: 201 });
}
