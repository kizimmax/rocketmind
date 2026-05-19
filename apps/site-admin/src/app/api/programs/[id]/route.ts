import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolvePlaceId } from "@/lib/resolve-place";
import { requirePermission } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(req, "programs.list", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      place: true,
      agents: { include: { agent: { include: { avatarMascot: true } } } },
      students: { orderBy: { joinedAt: "desc" } },
    },
  });
  if (!program) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(program);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "programs.list", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title) return NextResponse.json({ error: "title_required" }, { status: 400 });
    data.title = title;
  }
  if ("placeName" in body) {
    data.placeId = await resolvePlaceId(body.placeName);
  }
  if ("startsAt" in body) {
    const d = body.startsAt ? new Date(body.startsAt) : null;
    if (!d || Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "startsAt_invalid" }, { status: 400 });
    }
    data.startsAt = d;
  }
  if ("endsAt" in body) {
    const d = body.endsAt ? new Date(body.endsAt) : null;
    if (!d || Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "endsAt_invalid" }, { status: 400 });
    }
    data.endsAt = d;
  }

  const updated = await prisma.program.update({ where: { id }, data, include: { place: true } });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(req, "programs.list", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  try {
    await prisma.program.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
