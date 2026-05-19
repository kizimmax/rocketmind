import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { canManageUser } from "@/lib/user-policy";
import { sendEmail } from "@/lib/mailer";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

interface Body {
  password?: string;
  /** "primary" (default) | "secondary" */
  emailTarget?: "primary" | "secondary";
}

/**
 * Sends the just-regenerated password to the user's email. The client must
 * pass the plaintext back; we verify it against the current hash so we never
 * email arbitrary attacker-supplied strings as "your new password".
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.password) {
    return NextResponse.json({ error: "password_required" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      login: true,
      password: true,
      email: true,
      secondaryEmail: true,
      role: true,
      createdById: true,
    },
  });
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canManageUser(auth, target)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const matches = await bcrypt.compare(body.password, target.password);
  if (!matches) {
    return NextResponse.json({ error: "password_mismatch" }, { status: 400 });
  }

  const which = body.emailTarget === "secondary" ? target.secondaryEmail : target.email;
  if (!which) {
    return NextResponse.json({ error: "no_email_on_account" }, { status: 400 });
  }

  const result = await sendEmail({
    reason: "password.send",
    to: which,
    subject: "Ваш новый пароль для админ-панели Rocketmind",
    text: `Здравствуйте!\n\nАдминистратор сгенерировал для вас новый пароль для входа в админ-панель.\n\nЛогин: ${target.login}\nПароль: ${body.password}\n\nРекомендуем сменить пароль после первого входа.`,
  });

  await logAudit({
    actorId: auth.id,
    action: "password.regenerated_by_admin",
    targetType: "user",
    targetId: id,
    metadata: { sentTo: which, stubbed: result.stubbed },
    req,
  });

  return NextResponse.json({ ok: result.ok, stubbed: result.stubbed });
}
