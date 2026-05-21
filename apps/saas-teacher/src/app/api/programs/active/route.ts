import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import {
  fetchProfile,
  mapAgent,
  mapGroupToProgram,
  type IvanCourseAgent,
} from "@/lib/ivan-auth";

/**
 * GET /api/programs/active
 *
 * Программа студента = его courseGroup (из /profile). Список агентов —
 * GET /course/agents/accessible (агенты, доступные текущему юзеру; фильтрацию
 * по target/доступности делает бэк Ивана). Сортировку по serial убрали —
 * у Ивана такого поля нет, порядок отдаём как пришёл.
 */
export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");

  const prof = await fetchProfile(cookie);
  if (!prof.ok || !prof.data) {
    return applySetCookies(
      NextResponse.json({ error: "unauthorized" }, { status: prof.status || 401 }),
      prof.setCookies,
    );
  }
  const group = prof.data.courseGroup ?? null;

  const ag = await ivanCall<IvanCourseAgent[]>({
    path: "/course/agents/accessible",
    cookie,
    retryOn401: true,
  });
  const agents = (Array.isArray(ag.data) ? ag.data : []).map(mapAgent);

  return applySetCookies(
    NextResponse.json({ program: group ? mapGroupToProgram(group) : null, agents }),
    [...prof.setCookies, ...ag.setCookies],
  );
}
