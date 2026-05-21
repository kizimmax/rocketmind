import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";

// Прокси на POST /auth/verify Ивана. При успехе он ставит http-only куки
// (access+refresh) — relay'им их браузеру под нашим доменом.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();
  if (!email || !code) {
    return NextResponse.json({ error: "email_and_code_required" }, { status: 400 });
  }

  const r = await ivanCall({ method: "POST", path: "/auth/verify", body: { email, code } });
  if (!r.ok) {
    const error = r.status === 429 ? "too_many_attempts" : "code_invalid_or_expired";
    return NextResponse.json({ error }, { status: r.status || 401 });
  }

  return applySetCookies(NextResponse.json({ ok: true }), r.setCookies);
}
