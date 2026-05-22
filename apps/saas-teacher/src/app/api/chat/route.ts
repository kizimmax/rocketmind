import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanStream } from "@/lib/ivan-api";
import { fetchAgentHistory, mapMessage } from "@/lib/ivan-auth";

/**
 * POST /api/chat — прокси на POST /course/messages Ивана (SSE насквозь).
 * Body: { agentId, content } → { agentId, messageText }.
 * Клиент читает SSE-события Ивана: message_created / delta / done / error.
 */
export async function POST(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const body = await request.json().catch(() => ({}));
  const agentId = String(body.agentId ?? "");
  const messageText = String(body.content ?? body.messageText ?? "").trim();

  if (!agentId || !messageText) {
    return new Response(
      `event: error\ndata: ${JSON.stringify({ message: "bad_request", code: 400 })}\n\n`,
      { status: 200, headers: { "Content-Type": "text/event-stream" } },
    );
  }

  return ivanStream({ path: "/course/messages", body: { agentId, messageText }, cookie });
}

/**
 * GET /api/chat?agentId=… — история диалога с конкретным агентом (per-agent чат).
 */
export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const agentId = new URL(request.url).searchParams.get("agentId");
  if (!cookie || !agentId) return NextResponse.json({ messages: [] });

  const r = await fetchAgentHistory(cookie, agentId);
  const messages = (r.data?.messages ?? []).map(mapMessage);
  return applySetCookies(NextResponse.json({ messages }), r.setCookies);
}
