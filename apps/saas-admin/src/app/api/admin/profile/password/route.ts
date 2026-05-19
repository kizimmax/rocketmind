import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { invalidateSessions, requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

interface Body {
  currentPassword?: string;
  newPassword?: string;
}

const MIN_PASSWORD_LEN = 8;

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.currentPassword || !body?.newPassword) {
    return NextResponse.json({ error: "fields_required" }, { status: 400 });
  }
  if (body.newPassword.length < MIN_PASSWORD_LEN) {
    return NextResponse.json({ error: "new_password_too_short" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { id: true, password: true },
  });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const ok = await bcrypt.compare(body.currentPassword, user.password);
  if (!ok) {
    return NextResponse.json({ error: "wrong_current_password" }, { status: 400 });
  }

  const hash = await bcrypt.hash(body.newPassword, 12);
  await prisma.user.update({ where: { id: auth.id }, data: { password: hash } });
  await invalidateSessions(auth.id);

  await logAudit({
    actorId: auth.id,
    action: "password.changed_self",
    targetType: "user",
    targetId: auth.id,
    req,
  });

  return NextResponse.json({ ok: true });
}
