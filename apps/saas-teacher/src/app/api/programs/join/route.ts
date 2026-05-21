import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";

// POST /api/programs/join — прокси на POST /course/groups/join Ивана.
// Привязывает текущего (авторизованного) юзера к группе по QR-коду.
export async function POST(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const body = await request.json().catch(() => ({}));
  const qrCode = String(body.qrCode ?? body.code ?? "").trim();
  if (!qrCode) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const r = await ivanCall({
    method: "POST",
    path: "/course/groups/join",
    body: { qrCode },
    cookie,
    retryOn401: true,
  });
  if (!r.ok) {
    const error = r.status === 404 ? "not_found" : r.status === 401 ? "unauthorized" : "join_failed";
    return applySetCookies(NextResponse.json({ error }, { status: r.status || 502 }), r.setCookies);
  }
  return applySetCookies(NextResponse.json({ ok: true }), r.setCookies);
}
