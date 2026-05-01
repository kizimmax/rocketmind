import { NextResponse } from "next/server";
import { readConfig, writeConfig } from "@/lib/storage";

const VALID_IDS = ["consulting", "academy", "expert", "ai-products"] as const;
type CategoryId = (typeof VALID_IDS)[number];

interface CategorySeo {
  pageTitlePrefix?: string;
  pageTitleAccent?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
}

interface CategoryEntry {
  id: CategoryId;
  seo?: CategorySeo;
}

const SEO_KEYS = ["pageTitlePrefix", "pageTitleAccent", "metaTitle", "metaDescription", "intro"] as const;

function sanitizeSeo(raw: unknown): CategorySeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: CategorySeo = {};
  for (const k of SEO_KEYS) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function getCategories(): CategoryEntry[] {
  const saved = readConfig<{ categories?: unknown[] }>("product-categories.json");
  if (!saved?.categories) return VALID_IDS.map((id) => ({ id }));
  const byId = new Map<CategoryId, CategoryEntry>();
  for (const c of saved.categories) {
    if (!c || typeof c !== "object") continue;
    const r = c as Record<string, unknown>;
    const id = r.id;
    if (typeof id !== "string" || !VALID_IDS.includes(id as CategoryId)) continue;
    const seo = sanitizeSeo(r.seo);
    byId.set(id as CategoryId, seo ? { id: id as CategoryId, seo } : { id: id as CategoryId });
  }
  return VALID_IDS.map((id) => byId.get(id) ?? { id });
}

export async function GET() {
  return NextResponse.json({ categories: getCategories() });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { categories?: unknown } | null;
  if (!body) return NextResponse.json({ error: "invalid json" }, { status: 400 });

  const incoming = Array.isArray(body.categories) ? body.categories : [];
  const byId = new Map<CategoryId, CategoryEntry>();
  for (const c of incoming) {
    if (!c || typeof c !== "object") continue;
    const r = c as Record<string, unknown>;
    const id = r.id;
    if (typeof id !== "string" || !VALID_IDS.includes(id as CategoryId)) continue;
    const seo = sanitizeSeo(r.seo);
    byId.set(id as CategoryId, seo ? { id: id as CategoryId, seo } : { id: id as CategoryId });
  }
  const categories = VALID_IDS.map((id) => byId.get(id) ?? { id });
  writeConfig("product-categories.json", { categories });

  return NextResponse.json({ ok: true, categories });
}
