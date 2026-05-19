import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const config = {
  // Public endpoints (excluded from auth): admin/login, admin/password-reset/*,
  // admin/profile/email/confirm (link from email, may be opened logged-out),
  // admin/maintenance/cleanup (cron-callable with x-cleanup-token, or SUPER_ADMIN).
  matcher: ["/api/((?!admin/login|admin/password-reset|admin/profile/email/confirm|admin/maintenance/cleanup).*)"],
};

export async function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ")
    ? auth.slice(7)
    : req.cookies.get("rm_admin_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { status: true, tokenVersion: true },
  });

  if (!user || user.status === "FROZEN" || user.tokenVersion !== payload.tokenVersion) {
    return NextResponse.json({ error: "session_invalid" }, { status: 401 });
  }

  return NextResponse.next();
}
