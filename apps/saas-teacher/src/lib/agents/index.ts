import type { AgentTransport } from "./transport";
import { mockTransport } from "./mock";
import { n8nTransport } from "./n8n";

/**
 * Реальный n8n-транспорт включается флагом AGENT_TRANSPORT=n8n. По умолчанию
 * (или явно "mock") используется локальная заглушка — она нужна для
 * dev/preview, пока контракт n8n не финализирован.
 */
export function getTransport(): AgentTransport {
  if (process.env.AGENT_TRANSPORT === "n8n") return n8nTransport;
  return mockTransport;
}

export type { AgentTransport, AgentContext, AgentStreamEvent } from "./transport";
