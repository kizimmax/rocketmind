import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slugify";

type GlossaryContent = {
  order?: number;
  body?: unknown[];
  sections?: unknown[];
  pinned?: boolean;
  pinnedOrder?: number;
  aliases?: unknown[];
  [key: string]: unknown;
};

function toDto(t: {
  id: string;
  slug: string;
  status: string;
  title: string;
  description: string;
  content: unknown;
  tagIds: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const c = (t.content ?? {}) as GlossaryContent;
  const sections = Array.isArray(c.sections) ? c.sections : Array.isArray(c.body) ? c.body : [];
  const aliases = Array.isArray(c.aliases)
    ? c.aliases
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter((v) => v.length > 0)
    : [];
  return {
    id: `glossary/${t.slug}`,
    slug: t.slug,
    status: t.status,
    order: typeof c.order === "number" ? c.order : 0,
    title: t.title,
    description: t.description,
    tagIds: t.tagIds,
    metaTitle: t.metaTitle,
    metaDescription: t.metaDescription,
    sections,
    aliases,
    pinned: c.pinned === true,
    pinnedOrder: typeof c.pinnedOrder === "number" ? c.pinnedOrder : 0,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export async function GET() {
  const terms = await prisma.glossaryTerm.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(terms.map(toDto));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { slug: rawSlug, title } = body as { slug?: string; title?: string };
  const slug = normalizeSlug(rawSlug);
  if (!slug) return NextResponse.json({ error: "invalid slug" }, { status: 400 });

  const existing = await prisma.glossaryTerm.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "exists" }, { status: 409 });

  const now = new Date().toISOString();
  const term = await prisma.glossaryTerm.create({
    data: {
      slug,
      title: title || "",
      status: "hidden",
      description: "",
      content: { order: 0, sections: [], pinned: false, pinnedOrder: 0, aliases: [] },
      tagIds: [],
      metaTitle: title ? `${title} | Глоссарий Rocketmind` : "",
      metaDescription: "",
    },
  });
  return NextResponse.json(toDto(term), { status: 201 });
}
