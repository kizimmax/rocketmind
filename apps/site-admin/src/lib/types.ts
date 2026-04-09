// ── Statuses ────────────────────────────────────────────────────────────────

export type PageStatus = "published" | "hidden" | "archived";

// ── Block types (mirror ServicePageTemplate block order) ────────────────────

export type BlockType =
  | "hero"
  | "logoMarquee"
  | "about"
  | "audience"
  | "results"
  | "process"
  | "experts"
  | "aboutRocketmind"
  | "pageBottom";

// ── Block data shapes (mirror apps/site/src/lib/products.ts) ────────────────

export interface HeroBlockData {
  caption: string;
  title: string;
  description: string;
  ctaText: string;
  factoids: Array<{ number: string; label: string; text: string }>;
}

export interface AboutBlockData {
  caption: string;
  title: string;
  description: string;
  accordion: Array<{ title: string; description: string }>;
}

export interface AudienceBlockData {
  tag: string;
  title: string;
  subtitle?: string;
  wideColumn?: "left" | "right";
  facts: Array<{ title: string; text: string }>;
}

export interface ResultsBlockData {
  tag: string;
  title: string;
  description?: string;
  cards: Array<{ title: string; text: string }>;
}

export interface ExpertsBlockData {
  experts: Array<{ tag?: string; name: string; bio: string; image: string }>;
}

export interface AboutRocketmindBlockData {
  tag: string;
  title: string;
  description: string;
  variant: "dark" | "light";
}

export interface ProcessBlockData {
  tag: string;
  title: string;
  subtitle: string;
  description?: string;
  steps: Array<{ number: string; title: string; text: string; duration: string }>;
  participantsTag?: string;
  participants?: Array<{ role: string; text: string }>;
}

// ── Block ───────────────────────────────────────────────────────────────────

export interface PageBlock {
  id: string;
  type: BlockType;
  enabled: boolean;
  order: number;
  data: Record<string, unknown>;
}

// ── Page ────────────────────────────────────────────────────────────────────

export interface SitePage {
  id: string;
  sectionId: string;
  slug: string;
  status: PageStatus;
  order: number;
  menuTitle: string;
  menuDescription: string;
  cardTitle: string;
  cardDescription: string;
  metaTitle: string;
  metaDescription: string;
  blocks: PageBlock[];
  createdAt: string;
  updatedAt: string;
}

// ── Section ─────────────────────────────────────────────────────────────────

export interface AdminSection {
  id: string;
  label: string;
  category: string;
}

// ── Store root ──────────────────────────────────────────────────────────────

export interface AdminStore {
  version: number;
  pages: SitePage[];
  lastSaved: string;
}
