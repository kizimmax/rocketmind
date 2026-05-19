import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

interface Body {
  token?: string;
}

/**
 * Public endpoint: the token in the email IS the proof. Requiring an active
 * session here would prevent users from confirming a new email while logged
 * out (e.g. opening the link on a different device). The user record is
 * looked up from the token.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.token) return NextResponse.json({ error: "token_required" }, { status: 400 });

  const hash = hashToken(body.token);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hash },
  });

  if (!record) return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  if (record.usedAt) return NextResponse.json({ error: "token_used" }, { status: 400 });
  if (record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "token_expired" }, { status: 400 });
  }

  const data = record.isSecondary
    ? { secondaryEmail: record.email, secondaryEmailVerifiedAt: new Date() }
    : { email: record.email, emailVerifiedAt: new Date() };

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data }),
    prisma.emailVerificationToken.update({
      where: { tokenHash: hash },
      data: { usedAt: new Date() },
    }),
  ]);

  await logAudit({
    actorId: record.userId,
    action: "email.verified",
    targetType: "user",
    targetId: record.userId,
    metadata: { email: record.email, kind: record.isSecondary ? "secondary" : "primary" },
    req,
  });

  return NextResponse.json({ ok: true, email: record.email, isSecondary: record.isSecondary });
}
