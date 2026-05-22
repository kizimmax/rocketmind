import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanCall } from "@/lib/ivan-api";
import { requireAuth } from "@/lib/auth";
import { mapAdminUser, userBody, type IvanUser } from "@/lib/ivan-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAuth(req);
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const cookie = req.headers.get("cookie");
  const r = await ivanCall<IvanUser>({ path: `/users/${id}`, cookie, retryOn401: true });
  if (!r.ok || !r.data) return NextResponse.json({ error: "not_found" }, { status: r.status || 404 });
  return applySetCookies(NextResponse.json({ user: mapAdminUser(r.data) }), r.setCookies);
}

// Управление ограничено моделью Ивана: edit данных (PUT /users/{id}) +
// назначение роли (PUT /users/{id}/role). Заморозки/пароля/прав-дерева нет.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAuth(req);
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const cookie = req.headers.get("cookie");
  const setCookies: string[] = [];

  if ("roleId" in body) {
    const rr = await ivanCall({
      method: "PUT",
      path: `/users/${id}/role`,
      body: { role: body.roleId || null },
      cookie,
      retryOn401: true,
    });
    setCookies.push(...rr.setCookies);
    if (!rr.ok) return applySetCookies(NextResponse.json({ error: "role_failed" }, { status: rr.status || 502 }), setCookies);
  }

  const data = userBody(body);
  let user: IvanUser | null = null;
  if (Object.keys(data).length) {
    const ur = await ivanCall<IvanUser>({ method: "PUT", path: `/users/${id}`, body: data, cookie, retryOn401: true });
    setCookies.push(...ur.setCookies);
    if (!ur.ok || !ur.data) return applySetCookies(NextResponse.json({ error: "update_failed" }, { status: ur.status || 502 }), setCookies);
    user = ur.data;
  }

  if (!user) {
    const gr = await ivanCall<IvanUser>({ path: `/users/${id}`, cookie, retryOn401: true });
    setCookies.push(...gr.setCookies);
    user = gr.data;
  }
  return applySetCookies(NextResponse.json({ user: user ? mapAdminUser(user) : null }), setCookies);
}
