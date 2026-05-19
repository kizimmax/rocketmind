import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolvePlaceId } from "@/lib/resolve-place";
import { requirePermission } from "@/lib/auth";

export async function GET(request: Request) {
  const gate = await requirePermission(request, "programs.list", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const programs = await prisma.program.findMany({
    include: { place: true, _count: { select: { students: true, agents: true } } },
    orderBy: { startsAt: "desc" },
  });
  return NextResponse.json(programs);
}

export async function POST(request: Request) {
  const gate = await requirePermission(request, "programs.list", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "title_required" }, { status: 400 });

  const startsAt = body.startsAt ? new Date(body.startsAt) : null;
  const endsAt = body.endsAt ? new Date(body.endsAt) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "startsAt_required" }, { status: 400 });
  }
  if (!endsAt || Number.isNaN(endsAt.getTime())) {
    return NextResponse.json({ error: "endsAt_required" }, { status: 400 });
  }
  if (endsAt < startsAt) {
    return NextResponse.json({ error: "endsAt_before_startsAt" }, { status: 400 });
  }

  const placeId = await resolvePlaceId(body.placeName);

  const program = await prisma.program.create({
    data: {
      title,
      placeId,
      startsAt,
      endsAt,
    },
    include: { place: true },
  });
  return NextResponse.json(program, { status: 201 });
}
