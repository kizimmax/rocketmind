import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export const config = {
  matcher: ["/api/((?!admin/login).*)"],
};

export function middleware(req: NextRequest) {
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

  return NextResponse.next();
}
