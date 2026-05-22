import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { requirePermission } from "@/lib/auth";
import { groupBody, mapGroupDetail, mapGroupList, type IvanCourseGroup } from "@/lib/ivan-auth";

// Программы = CourseGroup Ивана.
export async function GET(req: NextRequest) {
  const gate = await requirePermission(req, "programs.list", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanCourseGroup[]>({ path: "/course/groups", cookie, retryOn401: true });
  if (!r.ok) return NextResponse.json({ error: "fetch_failed" }, { status: r.status || 502 });
  const rows = (Array.isArray(r.data) ? r.data : []).map(mapGroupList);
  return applySetCookies(NextResponse.json(rows), r.setCookies);
}

export async function POST(req: NextRequest) {
  const gate = await requirePermission(req, "programs.list", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = await req.json().catch(() => ({}));
  if (!String(body.title ?? "").trim()) {
    return NextResponse.json({ error: "title_required" }, { status: 400 });
  }
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanCourseGroup>({
    method: "POST",
    path: "/course/groups",
    body: groupBody(body),
    cookie,
    retryOn401: true,
  });
  if (!r.ok || !r.data) return NextResponse.json({ error: "create_failed" }, { status: r.status || 502 });
  return applySetCookies(NextResponse.json(mapGroupDetail(r.data), { status: 201 }), r.setCookies);
}
