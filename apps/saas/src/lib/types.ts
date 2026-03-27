// Rocketmind SaaS — Data Model Types (MVP 1.1)

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login: string;
}

export type CaseStatus = "active" | "archived";

export interface Case {
  id: string;
  user_id: string;
  name: string;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  description: string;
  avatar_url: string | null;
  greeting?: string;
  suggestions?: string[];
  config: Record<string, unknown>;
}

export interface CaseAgent {
  case_id: string;
  agent_id: string;
}

export interface Conversation {
  id: string;
  case_id: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface MessageCTA {
  label: string;
  url: string;
}

export interface MessageMetadata {
  cta?: MessageCTA;
  summary?: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
  created_at: string;
  is_read: boolean;
}
