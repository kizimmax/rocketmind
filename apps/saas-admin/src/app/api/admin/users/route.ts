import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { requireAuth } from "@/lib/auth";
import { mapAdminUser, type IvanUser } from "@/lib/ivan-auth";

export const dynamic = "force-dynamic";

// Список пользователей Ивана (GET /users). Фильтра нет — клиент делит на
// админов (role != null) и учеников. Создание не поддерживается: юзеры
// саморегистрируются по OTP.
export async function GET(req: NextRequest) {
  const gate = await requireAuth(req);
  if (gate instanceof NextResponse) return gate;
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<{ users?: IvanUser[] } | IvanUser[]>({
    path: "/users?page=1&limit=500",
    cookie,
    retryOn401: true,
  });
  if (!r.ok) return NextResponse.json({ error: "fetch_failed" }, { status: r.status || 502 });
  const list = Array.isArray(r.data) ? r.data : (r.data?.users ?? []);
  return applySetCookies(NextResponse.json({ users: list.map(mapAdminUser) }), r.setCookies);
}

export async function POST() {
  return NextResponse.json({ error: "not_supported" }, { status: 405 });
}
