import { type NextRequest, NextResponse } from "next/server";
import { ivanCall } from "@/lib/ivan-api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Шаг 1 входа: отправка OTP-кода на email (POST /auth/login Ивана).
// Единый OTP-вход для всех; пароля у админов больше нет.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
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
