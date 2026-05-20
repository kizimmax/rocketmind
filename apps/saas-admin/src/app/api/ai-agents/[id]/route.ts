import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slugify";
import { requirePermission } from "@/lib/auth";

const VALID_TARGETS = new Set(["saas", "saas-teacher"]);

function validateTargets(input: unknown): string[] | null {
  if (input === undefined) return null;
  if (!Array.isArray(input)) return [];
  return Array.from(
    new Set(
      input
        .filter((t): t is string => typeof t === "string")
        .filter((t) => VALID_TARGETS.has(t)),
    ),
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(req, "ai-agents", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const agent = await prisma.aiAgent.findUnique({
    where: { id },
    include: { avatarMascot: true },
  });
  if (!agent) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(agent);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "ai-agents", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const existing = await prisma.aiAgent.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.role === "string") data.role = body.role;
  if (typeof body.valueDescription === "string") {
    data.valueDescription = body.valueDescription;
  }
  if ("avatarMascotId" in body) data.avatarMascotId = body.avatarMascotId || null;
  if ("avatarPath" in body) data.avatarPath = body.avatarPath || null;
  if ("n8nWebhookUrl" in body) {
    const url = String(body.n8nWebhookUrl ?? "").trim();
    if (!url) return NextResponse.json({ error: "webhook_required" }, { status: 400 });
    data.n8nWebhookUrl = url;
  }
  if ("n8nSecret" in body) data.n8nSecret = body.n8nSecret || null;
  if ("systemPrompt" in body) data.systemPrompt = body.systemPrompt || null;
  if ("notes" in body) data.notes = body.notes || null;
  if ("serial" in body) {
    const n = Number(body.serial);
    if (Number.isFinite(n)) data.serial = Math.trunc(n);
  }

  const targets = validateTargets(body.targets);
  if (targets !== null) {
    if (targets.length === 0) {
      return NextResponse.json({ error: "targets_required" }, { status: 400 });
    }
    data.targets = targets;
  }

  if (typeof body.slug === "string") {
    const normalized = normalizeSlug(body.slug);
    if (normalized && normalized !== existing.slug) {
      const conflict = await prisma.aiAgent.findUnique({ where: { slug: normalized } });
      if (conflict) return NextResponse.json({ error: "slug_exists" }, { status: 409 });
      data.slug = normalized;
    }
  }

  const updated = await prisma.aiAgent.update({
    where: { id },
    data,
    include: { avatarMascot: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(req, "ai-agents", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  try {
    await prisma.aiAgent.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
