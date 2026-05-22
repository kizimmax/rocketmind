import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { type IvanUser, mapUserToStudent } from "@/lib/ivan-auth";

// PATCH профиля → PUT /profile Ивана.
// Маппинг полей анкеты: role→profession, industry→fieldOfActivity, region→city.
// lastName у Ивана нет — игнорируем.
export async function PATCH(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const body = await request.json().catch(() => ({}));

  const payload: Record<string, string> = {};
  if (typeof body.firstName === "string") payload.firstName = body.firstName.trim();
  if (typeof body.role === "string") payload.profession = body.role.trim();
  if (typeof body.industry === "string") payload.fieldOfActivity = body.industry.trim();
  if (typeof body.region === "string") payload.city = body.region.trim();

  const r = await ivanCall<IvanUser>({
    method: "PUT",
    path: "/profile",
    body: payload,
    cookie,
    retryOn401: true,
  });
  if (!r.ok || !r.data) {
    return applySetCookies(
      NextResponse.json({ error: "unauthorized" }, { status: r.status || 401 }),
      r.setCookies,
    );
  }
  return applySetCookies(NextResponse.json({ student: mapUserToStudent(r.data) }), r.setCookies);
}
