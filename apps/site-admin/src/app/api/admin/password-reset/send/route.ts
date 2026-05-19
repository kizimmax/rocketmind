import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { logAudit } from "@/lib/audit";
import { checkLoginRateLimit, recordLoginAttempt } from "@/lib/rate-limit";
import { getClientMeta } from "@/lib/client-meta";

export const dynamic = "force-dynamic";

const TTL_MS = 30 * 60 * 1000;

interface Body {
  login?: string;
  target?: "primary" | "secondary";
}

/**
 * Public: issues a reset token and emails it to the selected target.
 * Always returns 200 so the UI doesn't differentiate "no such login" from
 * "email sent" — the cost is one fake send for invalid input, which is
 * already capped by the login rate limit.
 */
export async function POST(req: NextRequest) {
  const { ip, userAgent } = getClientMeta(req);
  const safeIp = ip ?? "unknown";
  const body = (await req.json().catch(() => null)) as Body | null;
  const login = body?.login?.trim() || "";
  const target = body?.target === "secondary" ? "secondary" : "primary";

  const rl = await checkLoginRateLimit(safeIp, login);
  if (!rl.allowed) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }

  await recordLoginAttempt(safeIp, login, false);

  if (!login) return NextResponse.json({ ok: true });

  const user = await prisma.user.findUnique({
    where: { login },
    select: { id: true, email: true, secondaryEmail: true, status: true },
  });
  if (!user || user.status === "FROZEN") return NextResponse.json({ ok: true });

  const to = target === "secondary" ? user.secondaryEmail : user.email;
  if (!to) return NextResponse.json({ ok: true });

  const { raw, hash } = issueToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      email: to,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });

  const base = process.env.ADMIN_PUBLIC_URL?.replace(/\/$/, "") || "";
  const link = `${base}/reset?token=${encodeURIComponent(raw)}`;

  const result = await sendEmail({
    reason: "password.reset",
    to,
    subject: "Сброс пароля — Rocketmind CMS",
    text: `Для сброса пароля перейдите по ссылке:\n\n${link}\n\nСсылка действует 30 минут. Если вы не запрашивали сброс, проигнорируйте это письмо.`,
  });

  await logAudit({
    actorId: user.id,
    action: "password.reset_requested",
    targetType: "user",
    targetId: user.id,
    metadata: { target, stubbed: result.stubbed },
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true, stubbed: result.stubbed });
}
