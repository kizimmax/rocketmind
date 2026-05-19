import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { maskEmail } from "@/lib/tokens";
import { checkLoginRateLimit, recordLoginAttempt } from "@/lib/rate-limit";
import { getClientMeta } from "@/lib/client-meta";

export const dynamic = "force-dynamic";

interface Body {
  login?: string;
}

interface TargetOption {
  target: "primary" | "secondary";
  masked: string;
}

/**
 * Public: given a login, returns the masked list of email targets the user
 * may pick for a reset link. Always responds 200; an empty `options` array
 * either means the login is unknown or the user has no email at all.
 *
 * Rate-limited via the same login-attempt counter as the login endpoint to
 * prevent enumeration by mass guessing.
 */
export async function POST(req: NextRequest) {
  const { ip } = getClientMeta(req);
  const safeIp = ip ?? "unknown";
  const body = (await req.json().catch(() => null)) as Body | null;
  const login = body?.login?.trim() || "";

  const rl = await checkLoginRateLimit(safeIp, login);
  if (!rl.allowed) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }

  if (!login) {
    return NextResponse.json({ options: [] });
  }

  const user = await prisma.user.findUnique({
    where: { login },
    select: { id: true, email: true, secondaryEmail: true, status: true },
  });

  // Mark as a non-success attempt regardless of outcome — counts toward the
  // per-login limit even if we don't reveal whether they found a real user.
  await recordLoginAttempt(safeIp, login, false);

  if (!user || user.status === "FROZEN") {
    return NextResponse.json({ options: [] });
  }

  const options: TargetOption[] = [];
  if (user.email) options.push({ target: "primary", masked: maskEmail(user.email) });
  if (user.secondaryEmail)
    options.push({ target: "secondary", masked: maskEmail(user.secondaryEmail) });

  return NextResponse.json({ options });
}
