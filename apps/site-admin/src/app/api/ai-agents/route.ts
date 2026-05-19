import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSlug, slugify } from "@/lib/slugify";
import { requirePermission } from "@/lib/auth";

const VALID_TARGETS = new Set(["saas", "saas-teacher"]);

function validateTargets(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const filtered = input
    .filter((t): t is string => typeof t === "string")
    .filter((t) => VALID_TARGETS.has(t));
  return Array.from(new Set(filtered));
}

export async function GET(request: Request) {
  const gate = await requirePermission(request, "ai-agents", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const url = new URL(request.url);
  const target = url.searchParams.get("target");
  const where = target ? { targets: { has: target } } : undefined;

  const agents = await prisma.aiAgent.findMany({
    where,
    include: { avatarMascot: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(agents);
}

export async function POST(request: Request) {
  const gate = await requirePermission(request, "ai-agents", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });

  const targets = validateTargets(body.targets);
  const n8nWebhookUrl = String(body.n8nWebhookUrl ?? "").trim();

  const requestedSlug = body.slug ? normalizeSlug(body.slug) : slugify(name);
  const slug = requestedSlug || slugify(name) || `agent-${Date.now()}`;

  const existing = await prisma.aiAgent.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "slug_exists" }, { status: 409 });

  const agent = await prisma.aiAgent.create({
    data: {
      slug,
      name,
      role: String(body.role ?? ""),
      valueDescription: String(body.valueDescription ?? ""),
      avatarMascotId: body.avatarMascotId || null,
      avatarPath: body.avatarPath || null,
      targets,
      n8nWebhookUrl,
      n8nSecret: body.n8nSecret || null,
      systemPrompt: body.systemPrompt || null,
      notes: body.notes || null,
    },
    include: { avatarMascot: true },
  });

  return NextResponse.json(agent, { status: 201 });
}
