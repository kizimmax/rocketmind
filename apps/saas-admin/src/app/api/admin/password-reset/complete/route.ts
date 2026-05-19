import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const MIN_PASSWORD_LEN = 8;

interface Body {
  token?: string;
  newPassword?: string;
}

/**
 * Public: validates a reset token, sets the new password, bumps tokenVersion
 * to invalidate any lingering sessions on other devices.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.token || !body?.newPassword) {
    return NextResponse.json({ error: "fields_required" }, { status: 400 });
  }
  if (body.newPassword.length < MIN_PASSWORD_LEN) {
    return NextResponse.json({ error: "new_password_too_short" }, { status: 400 });
  }

  const hash = hashToken(body.token);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hash } });
  if (!record) return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  if (record.usedAt) return NextResponse.json({ error: "token_used" }, { status: 400 });
  if (record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "token_expired" }, { status: 400 });
  }

  const newHash = await bcrypt.hash(body.newPassword, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: newHash, tokenVersion: { increment: 1 } },
    }),
    prisma.passwordResetToken.update({
      where: { tokenHash: hash },
      data: { usedAt: new Date() },
    }),
  ]);

  await logAudit({
    actorId: record.userId,
    action: "password.reset_completed",
    targetType: "user",
    targetId: record.userId,
    req,
  });

  return NextResponse.json({ ok: true });
}
