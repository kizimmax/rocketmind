import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Retention windows. Tokens past expiresAt are dead anyway — we just delete
 * the now-useless rows. Login attempts older than 7 days are far past the
 * 15-minute rate-limit window.
 */
const TOKEN_GRACE_MS = DAY;       // wait 24h after expiry before deleting
const LOGIN_ATTEMPT_TTL_MS = 7 * DAY;

/**
 * Deletes stale rows from token and rate-limit tables. Intended for periodic
 * invocation (cron from Amvera or anywhere with HTTP access). Idempotent and
 * SUPER_ADMIN-only.
 *
 * Optional alternative auth: header `x-cleanup-token: <env CLEANUP_TOKEN>`,
 * for a cron without a user session.
 */
export async function POST(req: NextRequest) {
  const cronToken = req.headers.get("x-cleanup-token");
  const expected = process.env.CLEANUP_TOKEN;
  const cronOk = Boolean(expected && cronToken && cronToken === expected);

  if (!cronOk) {
    const auth = await requireSuperAdmin(req);
    if (auth instanceof NextResponse) return auth;
  }

  const now = Date.now();
  const tokenCutoff = new Date(now - TOKEN_GRACE_MS);
  const attemptCutoff = new Date(now - LOGIN_ATTEMPT_TTL_MS);

  const [resetTokens, verifyTokens, attempts] = await Promise.all([
    prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: tokenCutoff } } }),
    prisma.emailVerificationToken.deleteMany({ where: { expiresAt: { lt: tokenCutoff } } }),
    prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: attemptCutoff } } }),
  ]);

  return NextResponse.json({
    ok: true,
    triggeredBy: cronOk ? "cron" : "admin",
    deleted: {
      passwordResetTokens: resetTokens.count,
      emailVerificationTokens: verifyTokens.count,
      loginAttempts: attempts.count,
    },
    cutoffs: {
      tokenBefore: tokenCutoff.toISOString(),
      attemptBefore: attemptCutoff.toISOString(),
    },
  });
}
