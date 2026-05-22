import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";

// Прокси на POST /auth/logout Ивана — relay'им cookie-clears браузеру.
export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const r = await ivanCall({ method: "POST", path: "/auth/logout", cookie });
  return applySetCookies(NextResponse.json({ ok: true }), r.setCookies);
}
