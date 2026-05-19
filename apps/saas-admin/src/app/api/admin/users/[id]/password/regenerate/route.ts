import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { invalidateSessions, requireAdmin } from "@/lib/auth";
import { canManageUser } from "@/lib/user-policy";
import { generateStrongPassword } from "@/lib/password";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Generates a new strong password, replaces the hash, invalidates all sessions
 * for the target. Plaintext is returned ONCE in the response — the admin UI is
 * expected to show it (copy-to-clipboard) and optionally trigger an email send.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, createdById: true, email: true },
  });
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (!canManageUser(auth, target)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const plaintext = generateStrongPassword(16);
  const hash = await bcrypt.hash(plaintext, 12);

  await prisma.user.update({ where: { id }, data: { password: hash } });
  await invalidateSessions(id);

  await logAudit({
    actorId: auth.id,
    action: "password.regenerated_by_admin",
    targetType: "user",
    targetId: id,
    req,
  });

  return NextResponse.json({
    ok: true,
    password: plaintext,
    canEmail: Boolean(target.email),
  });
}
