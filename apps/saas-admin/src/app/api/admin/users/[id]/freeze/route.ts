import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateSessions, requireAdmin } from "@/lib/auth";
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

  // Guardrail: refuse to freeze the last active SUPER_ADMIN.
  if (target.role === "SUPER_ADMIN") {
    const activeCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE" },
    });
    if (activeCount <= 1) {
      return NextResponse.json({ error: "cannot_freeze_last_super_admin" }, { status: 409 });
    }
  }

  if (target.status === "FROZEN") {
    return NextResponse.json({ ok: true, status: "FROZEN" });
  }

  await prisma.user.update({ where: { id }, data: { status: "FROZEN" } });
  await invalidateSessions(id);
  await logAudit({
    actorId: auth.id,
    action: "user.frozen",
    targetType: "user",
    targetId: id,
    req,
  });

  return NextResponse.json({ ok: true, status: "FROZEN" });
}
