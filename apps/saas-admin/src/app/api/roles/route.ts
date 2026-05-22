import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { requireAuth } from "@/lib/auth";
import { mapRole, type IvanRole } from "@/lib/ivan-auth";

// Список ролей Ивана — для назначения роли юзеру (PUT /users/{id}/role).
export async function GET(req: NextRequest) {
  const gate = await requireAuth(req);
  if (gate instanceof NextResponse) return gate;
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanRole[]>({ path: "/roles", cookie, retryOn401: true });
  if (!r.ok) return NextResponse.json({ error: "fetch_failed" }, { status: r.status || 502 });
  const roles = (Array.isArray(r.data) ? r.data : []).map(mapRole);
  return applySetCookies(NextResponse.json(roles), r.setCookies);
}
