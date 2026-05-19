import type { AgentTransport, AgentStreamEvent } from "./transport";

/**
 * Локальный мок-транспорт: пока бэк у Ивана не готов, отдаём заглушку
 * посимвольно с небольшими задержками, чтобы убедиться, что SSE-pipeline
 * на клиенте работает.
 */
export const mockTransport: AgentTransport = {
  async *send({ agent, userMessage, context }) {
    const reply = buildReply(agent.name, userMessage, context.project.name);
    for (const chunk of chunkText(reply)) {
      await sleep(40);
      yield { type: "delta", text: chunk } satisfies AgentStreamEvent;
    }
    yield { type: "done" } satisfies AgentStreamEvent;
  },
};

function buildReply(agentName: string, userMessage: string, projectName: string): string {
  return `(${agentName}, мок) Понял запрос: «${userMessage.slice(0, 200)}». В проекте «${projectName}» давайте разберём это подробнее. Реальный ответ придёт когда подключим n8n.`;
}

function chunkText(text: string, size = 6): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    out.push(text.slice(i, i + size));
  }
  return out;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
