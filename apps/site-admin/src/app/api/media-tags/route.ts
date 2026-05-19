import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

type DsAccentColor = "yellow" | "violet" | "sky" | "terracotta" | "pink" | "blue" | "red" | "green";

const DS_ACCENT_COLORS: ReadonlyArray<DsAccentColor> = [
  "yellow", "violet", "sky", "terracotta", "pink", "blue", "red", "green",
];

interface MediaTagSeo {
  pageTitlePrefix?: string;
  pageTitleAccent?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
}

interface MediaTag {
  id: string;
  label: string;
  createdAt?: string;
  disabled?: boolean;
  seo?: MediaTagSeo;
  system?: boolean;
  cardColor?: DsAccentColor;
}

const SEO_KEYS = ["pageTitlePrefix", "pageTitleAccent", "metaTitle", "metaDescription", "intro"] as const;

const SYSTEM_TAG_DEFAULTS: ReadonlyArray<MediaTag> = [
  { id: "lesson", label: "Урок", system: true, cardColor: "sky" },
  { id: "case", label: "Кейс", system: true, cardColor: "terracotta" },
];

function sanitizeSeo(raw: unknown): MediaTagSeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: MediaTagSeo = {};
  for (const k of SEO_KEYS) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function withSystemTags(tags: MediaTag[]): MediaTag[] {
  const byId = new Map(tags.map((t) => [t.id, t]));
  const merged: MediaTag[] = [];
  for (const def of SYSTEM_TAG_DEFAULTS) {
    const user = byId.get(def.id);
    byId.delete(def.id);
    const next: MediaTag = {
      ...def,
      ...(user ?? {}),
      id: def.id,
      label: user?.label?.trim() || def.label,
      system: true,
      cardColor: user?.cardColor ?? def.cardColor,
    };
    if (!user?.createdAt) next.createdAt = new Date().toISOString();
    merged.push(next);
  }
  for (const t of tags) {
    if (!byId.has(t.id)) continue;
    const { system: _ignored, ...rest } = t;
    void _ignored;
    merged.push(rest);
  }
  return merged;
}

function dbToTag(row: {
  id: string;
  label: string;
  disabled: boolean;
  system: boolean;
  cardColor: string | null;
  seo: unknown;
  createdAt: Date;
}): MediaTag {
  const tag: MediaTag = {
    id: row.id,
    label: row.label,
    createdAt: row.createdAt.toISOString(),
  };
  if (row.disabled) tag.disabled = true;
  if (row.system) tag.system = true;
  if (row.cardColor && (DS_ACCENT_COLORS as readonly string[]).includes(row.cardColor)) {
    tag.cardColor = row.cardColor as DsAccentColor;
  }
  const seo = sanitizeSeo(row.seo);
  if (seo) tag.seo = seo;
  return tag;
}

export async function GET(request: Request) {
  const gate = await requirePermission(request, "media.tags", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const rows = await prisma.mediaTag.findMany({ orderBy: { createdAt: "asc" } });
  const tags = withSystemTags(rows.map(dbToTag));
  return NextResponse.json({ tags });
}

export async function PUT(request: Request) {
  const gate = await requirePermission(request, "media.tags", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  if (!body) return NextResponse.json({ error: "invalid json" }, { status: 400 });

  if (!Array.isArray(body.tags)) {
    return NextResponse.json({ error: "tags must be array" }, { status: 400 });
  }

  const incoming = (body.tags as unknown[])
    .map((t): MediaTag | null => {
      if (!t || typeof t !== "object") return null;
      const r = t as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id.trim() : "";
      const label = typeof r.label === "string" ? r.label.trim() : "";
      if (!id || !label) return null;
      const tag: MediaTag = { id, label };
      if (r.disabled === true) tag.disabled = true;
      const seo = sanitizeSeo(r.seo);
      if (seo) tag.seo = seo;
      if (typeof r.cardColor === "string" && (DS_ACCENT_COLORS as readonly string[]).includes(r.cardColor)) {
        tag.cardColor = r.cardColor as DsAccentColor;
      }
      return tag;
    })
    .filter((t): t is MediaTag => t !== null);

  const final = withSystemTags(incoming);

  await prisma.$transaction(
    final.map((tag) =>
      prisma.mediaTag.upsert({
        where: { id: tag.id },
        update: {
          label: tag.label,
          disabled: tag.disabled ?? false,
          system: tag.system ?? false,
          cardColor: tag.cardColor ?? null,
          seo: tag.seo ? (tag.seo as Prisma.InputJsonValue) : Prisma.JsonNull,
        },
        create: {
          id: tag.id,
          label: tag.label,
          disabled: tag.disabled ?? false,
          system: tag.system ?? false,
          cardColor: tag.cardColor ?? null,
          seo: tag.seo ? (tag.seo as Prisma.InputJsonValue) : Prisma.JsonNull,
        },
      }),
    ),
  );

  return NextResponse.json({ ok: true, tags: final });
}
