import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies } from "@/lib/ivan-api";
import { fetchProfile } from "@/lib/ivan-auth";

export const dynamic = "force-dynamic";

/**
 * Текущий пользователь для клиента. Источник — /profile Ивана.
 * Нет роли → 403 (в админку не пускаем). На MVP роль маппим в SUPER_ADMIN
 * и отдаём пустой permissions[] (клиент байпасит permission-слой для SUPER_ADMIN).
 */
export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const r = await fetchProfile(cookie);
  if (!r.ok || !r.data) {
    return applySetCookies(NextResponse.json({ error: "unauthorized" }, { status: 401 }), r.setCookies);
  }
  if (!r.data.role) {
    return applySetCookies(NextResponse.json({ error: "forbidden" }, { status: 403 }), r.setCookies);
  }
  const u = r.data;
  const user = {
    id: u._id,
    login: u.email,
    firstName: u.firstName ?? "",
    lastName: "",
    role: "SUPER_ADMIN",
    email: u.email,
  };
  return applySetCookies(NextResponse.json({ user, permissions: [] }), r.setCookies);
}
