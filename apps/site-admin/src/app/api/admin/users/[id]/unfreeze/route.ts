import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { canFreeze } from "@/lib/user-policy";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, status: true, createdById: true },
  });
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (!canFreeze(auth, target)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (target.status === "ACTIVE") {
    return NextResponse.json({ ok: true, status: "ACTIVE" });
  }

  await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
  await logAudit({
    actorId: auth.id,
    action: "user.unfrozen",
    targetType: "user",
    targetId: id,
    req,
  });

  return NextResponse.json({ ok: true, status: "ACTIVE" });
}
