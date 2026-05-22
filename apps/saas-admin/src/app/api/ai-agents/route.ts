import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { requirePermission } from "@/lib/auth";
import { agentBody, mapAgent, type IvanCourseAgent } from "@/lib/ivan-auth";

// Каталог AI-агентов — прокси на /course/agents Ивана.
export async function GET(req: NextRequest) {
  const gate = await requirePermission(req, "ai-agents", "VIEW");
  if (gate instanceof NextResponse) return gate;

  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanCourseAgent[]>({ path: "/course/agents", cookie, retryOn401: true });
  if (!r.ok) return NextResponse.json({ error: "fetch_failed" }, { status: r.status || 502 });
  const agents = (Array.isArray(r.data) ? r.data : []).map(mapAgent).sort((a, b) => a.serial - b.serial);
  return applySetCookies(NextResponse.json(agents), r.setCookies);
}

export async function POST(req: NextRequest) {
  const gate = await requirePermission(req, "ai-agents", "EDIT");
  if (gate instanceof NextResponse) return gate;

  const body = await req.json().catch(() => ({}));
  if (!String(body.name ?? "").trim()) {
    return NextResponse.json({ error: "name_required" }, { status: 400 });
  }
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanCourseAgent>({
    method: "POST",
    path: "/course/agents",
    body: agentBody(body),
    cookie,
    retryOn401: true,
  });
  if (!r.ok || !r.data) return NextResponse.json({ error: "create_failed" }, { status: r.status || 502 });
  return applySetCookies(NextResponse.json(mapAgent(r.data), { status: 201 }), r.setCookies);
}
