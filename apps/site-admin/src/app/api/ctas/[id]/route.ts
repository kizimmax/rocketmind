import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Scope = "product" | "article" | "both";
function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

async function findCta(id: string) {
  return (
    await prisma.ctaEntity.findFirst({ where: { content: { path: ["id"], equals: id } } }) ??
    await prisma.ctaEntity.findUnique({ where: { id } }).catch(() => null)
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cta = await findCta(id);
  if (!cta) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const existing = (cta.content ?? {}) as Record<string, unknown>;
  const updated = await prisma.ctaEntity.update({
    where: { id: cta.id },
    data: {
      name: typeof body.name === "string" ? body.name : cta.name,
      content: {
        ...existing,
        scope: parseScope(body.scope),
        heading: typeof body.heading === "string" ? body.heading : "",
        body: typeof body.body === "string" ? body.body : "",
        buttonText: typeof body.buttonText === "string" ? body.buttonText : "",
        formId: typeof body.formId === "string" && body.formId ? body.formId : null,
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
  const cta = await findCta(id);
  if (cta) await prisma.ctaEntity.delete({ where: { id: cta.id } });
  return NextResponse.json({ ok: true });
}
