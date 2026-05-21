import { type NextRequest, NextResponse } from "next/server";
import { applySetCookies, ivanStream } from "@/lib/ivan-api";
import { fetchUnifiedHistory } from "@/lib/ivan-auth";

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
 * GET /api/chat — единая история юзера по всем агентам (один тред на юзера).
 */
export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return NextResponse.json({ messages: [] });

  const { messages, setCookies } = await fetchUnifiedHistory(cookie);
  return applySetCookies(NextResponse.json({ messages }), setCookies);
}
