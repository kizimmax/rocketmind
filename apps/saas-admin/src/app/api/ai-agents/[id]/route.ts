import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { requirePermission } from "@/lib/auth";
import { agentBody, mapAgent, type IvanCourseAgent } from "@/lib/ivan-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requirePermission(req, "ai-agents", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanCourseAgent>({ path: `/course/agents/${id}`, cookie, retryOn401: true });
  if (!r.ok || !r.data) return NextResponse.json({ error: "not_found" }, { status: r.status || 404 });
  return applySetCookies(NextResponse.json(mapAgent(r.data)), r.setCookies);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requirePermission(req, "ai-agents", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanCourseAgent>({
    method: "PUT",
    path: `/course/agents/${id}`,
    body: agentBody(body),
    cookie,
    retryOn401: true,
  });
  if (!r.ok || !r.data) return NextResponse.json({ error: "update_failed" }, { status: r.status || 502 });
  return applySetCookies(NextResponse.json(mapAgent(r.data)), r.setCookies);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requirePermission(req, "ai-agents", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const cookie = req.headers.get("cookie");
  const r = await ivanCall({ method: "DELETE", path: `/course/agents/${id}`, cookie, retryOn401: true });
  if (!r.ok) return NextResponse.json({ error: "delete_failed" }, { status: r.status || 502 });
  return applySetCookies(NextResponse.json({ ok: true }), r.setCookies);
}
