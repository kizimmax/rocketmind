import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { requirePermission } from "@/lib/auth";
import { mapStudent, type IvanUser } from "@/lib/ivan-auth";

// Ученики = пользователи Ивана (GET /users). Фильтрации по группе у Ивана нет —
// отдаём список, клиент фильтрует по courseGroupId. Управление ограничено
// (роль + edit на стороне /users/{id}); freeze/delete не поддерживаются.
export async function GET(req: NextRequest) {
  const gate = await requirePermission(req, "programs.students", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<{ users?: IvanUser[] } | IvanUser[]>({
    path: "/users?page=1&limit=500",
    cookie,
    retryOn401: true,
  });
  if (!r.ok) return NextResponse.json({ error: "fetch_failed" }, { status: r.status || 502 });
  const list = Array.isArray(r.data) ? r.data : (r.data?.users ?? []);
  return applySetCookies(NextResponse.json(list.map(mapStudent)), r.setCookies);
}
