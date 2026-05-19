import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateSessions, requireAuth } from "@/lib/auth";
import { issueToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const TTL_MS = 30 * 60 * 1000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface PostBody {
  email?: string;
  /** "primary" (default) or "secondary" */
  kind?: "primary" | "secondary";
}

/**
 * Start email verification: issues a single-use token, stores its SHA-256
 * hash, sends the raw token to the email being claimed. The email is NOT
 * yet attached to the user — that happens only after /email/confirm succeeds.
 *
 * One exception: if the kind is "primary" and the user currently has NO
 * primary email, we attach it now (unverified) so they can use it as a
 * fallback target for password reset right away. Verification just sets
 * `emailVerifiedAt`. This matches the spec where "email привязать через
 * подтверждение" is a single user-facing action.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as PostBody | null;
  const email = body?.email?.trim().toLowerCase() || "";
  const kind = body?.kind === "secondary" ? "secondary" : "primary";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // Uniqueness check across both fields (primary + secondary).
  const taken = await prisma.user.findFirst({
    where: {
      AND: [
        { id: { not: auth.id } },
        { OR: [{ email }, { secondaryEmail: email }] },
      ],
    },
    select: { id: true },
  });
  if (taken) return NextResponse.json({ error: "email_taken" }, { status: 409 });

  const me = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { email: true, secondaryEmail: true },
  });
  if (!me) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (kind === "primary" && me.email !== email) {
    // Attach unverified primary so password-reset can fall back to it.
    await prisma.user.update({
      where: { id: auth.id },
      data: { email, emailVerifiedAt: null },
    });
  }
  if (kind === "secondary" && me.secondaryEmail !== email) {
    await prisma.user.update({
      where: { id: auth.id },
      data: { secondaryEmail: email, secondaryEmailVerifiedAt: null },
    });
    await logAudit({
      actorId: auth.id,
      action: "email.secondary_added",
      targetType: "user",
      targetId: auth.id,
      metadata: { email },
      req,
    });
  }

  const { raw, hash } = issueToken();
  await prisma.emailVerificationToken.create({
    data: {
      userId: auth.id,
      email,
      isSecondary: kind === "secondary",
      tokenHash: hash,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });

  const base = process.env.ADMIN_PUBLIC_URL?.replace(/\/$/, "") || "";
  const link = `${base}/email-verify?token=${encodeURIComponent(raw)}`;

  const result = await sendEmail({
    reason: "email.verify",
    to: email,
    subject: "Подтверждение email — Rocketmind CMS",
    text: `Перейдите по ссылке, чтобы подтвердить email:\n\n${link}\n\nСсылка действует 30 минут.`,
  });

  await logAudit({
    actorId: auth.id,
    action: "email.verification_requested",
    targetType: "user",
    targetId: auth.id,
    metadata: { email, kind, stubbed: result.stubbed },
    req,
  });

  return NextResponse.json({ ok: result.ok, stubbed: result.stubbed });
}

/**
 * Remove the secondary email (always allowed; user can always re-add).
 * Primary email removal is intentionally not supported here — use admin tools.
 */
export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await prisma.user.update({
    where: { id: auth.id },
    data: { secondaryEmail: null, secondaryEmailVerifiedAt: null },
  });
  await invalidateSessions(auth.id);
  await logAudit({
    actorId: auth.id,
    action: "email.secondary_removed",
    targetType: "user",
    targetId: auth.id,
    req,
  });
  return NextResponse.json({ ok: true });
}
