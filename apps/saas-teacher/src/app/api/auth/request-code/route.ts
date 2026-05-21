import { type NextRequest, NextResponse } from "next/server";
import { ivanCall } from "@/lib/ivan-api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Прокси на POST /auth/login Ивана (отправка OTP-кода на email).
// Привязку к программе по QR (programId) переносим в Phase 2 на
// POST /course/groups/join — здесь больше не обрабатываем.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "email_invalid" }, { status: 400 });
  }

  const r = await ivanCall({ method: "POST", path: "/auth/login", body: { email } });
  if (!r.ok) {
    const error = r.status === 429 ? "rate_limited" : "request_failed";
    return NextResponse.json({ error }, { status: r.status || 502 });
  }
  return NextResponse.json({ ok: true });
}
