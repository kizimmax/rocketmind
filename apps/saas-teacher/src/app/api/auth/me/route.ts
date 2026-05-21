import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies } from "@/lib/ivan-api";
import { fetchProfile, mapUserToStudent } from "@/lib/ivan-auth";

// GET /profile Ивана → наш {student} контракт. Если был auto-refresh —
// relay'им обновлённые куки; на провал считаем разлогиненным.
export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return NextResponse.json({ student: null });

  const r = await fetchProfile(cookie);
  if (!r.ok || !r.data) {
    return applySetCookies(NextResponse.json({ student: null }), r.setCookies);
  }
  return applySetCookies(
    NextResponse.json({ student: mapUserToStudent(r.data) }),
    r.setCookies,
  );
}
