import type { AiAgent } from "@prisma/client";

export type AgentContext = {
  project: { id: string; name: string; profile: unknown };
  student: { id: string; email: string; firstName: string | null; role: string | null };
  history: { role: "user" | "assistant"; content: string }[];
  artifacts: { kind: string; content: unknown }[];
  summaries: { agentSlug: string; summary: string }[];
};

export type AgentStreamEvent =
  | { type: "delta"; text: string }
  | { type: "artifact"; kind: string; title?: string; content: unknown }
  | { type: "summary"; summary: string }
  | { type: "done" };

export interface AgentTransport {
  /** Streams events. Implementations must end with a "done" event. */
  send(args: {
    agent: AiAgent;
    userMessage: string;
    context: AgentContext;
  }): AsyncIterable<AgentStreamEvent>;
}
