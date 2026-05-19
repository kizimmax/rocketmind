import crypto from "crypto";
import type { AgentTransport, AgentStreamEvent } from "./transport";

/**
 * Боевой транспорт: POST в AiAgent.n8nWebhookUrl с HMAC-SHA256 подписью по
 * AiAgent.n8nSecret (если задан). Ожидаем SSE (`text/event-stream`) с
 * событиями того же формата AgentStreamEvent. Если бэк отдаёт обычный JSON,
 * проксируем как один delta-чанк.
 *
 * Контракт payload — см. docs/api-questions-for-ivan-teacher.md.
 */
export const n8nTransport: AgentTransport = {
  async *send({ agent, userMessage, context }) {
    const body = JSON.stringify({
      agent: {
        id: agent.id,
        slug: agent.slug,
        name: agent.name,
        role: agent.role,
      },
      message: userMessage,
      context,
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream, application/json",
    };
    if (agent.n8nSecret) {
      const sig = crypto
        .createHmac("sha256", agent.n8nSecret)
        .update(body)
        .digest("hex");
      headers["X-Rocketmind-Signature"] = `sha256=${sig}`;
    }

    const res = await fetch(agent.n8nWebhookUrl, {
      method: "POST",
      headers,
      body,
    });
    if (!res.ok || !res.body) {
      yield {
        type: "delta",
        text: `(Ошибка backend ${res.status}) Не удалось получить ответ от агента.`,
      } satisfies AgentStreamEvent;
      yield { type: "done" } satisfies AgentStreamEvent;
      return;
    }

    const contentType = res.headers.get("content-type") ?? "";

    // Plain JSON response → single delta
    if (!contentType.includes("text/event-stream")) {
      const data = await res.json().catch(() => null) as
        | { content?: string; summary?: string; artifacts?: unknown[] }
        | null;
      const content = data?.content ?? "(пустой ответ)";
      yield { type: "delta", text: content } satisfies AgentStreamEvent;
      if (data?.summary) {
        yield { type: "summary", summary: data.summary } satisfies AgentStreamEvent;
      }
      if (Array.isArray(data?.artifacts)) {
        for (const art of data!.artifacts as Array<{
          kind: string;
          title?: string;
          content: unknown;
        }>) {
          yield {
            type: "artifact",
            kind: art.kind,
            title: art.title,
            content: art.content,
          } satisfies AgentStreamEvent;
        }
      }
      yield { type: "done" } satisfies AgentStreamEvent;
      return;
    }

    // SSE stream — passthrough parse
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        for (const line of part.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload) as AgentStreamEvent;
            yield evt;
          } catch {
            // ignore malformed
          }
        }
      }
    }
    yield { type: "done" } satisfies AgentStreamEvent;
  },
};
