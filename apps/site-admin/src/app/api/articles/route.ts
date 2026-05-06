import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slugify";

type ArticleContent = { body?: unknown; keyThoughts?: unknown[]; caseCard?: unknown; sortOrder?: number; order?: number; multiPage?: unknown; chapters?: unknown; [key: string]: unknown };

function toDto(a: {
  id: string; slug: string; type: string; status: string; title: string; description: string;
  content: unknown; coverPath: string | null; expertSlug: string | null; publishedAt: string;
  tagIds: string[]; pinned: boolean; pinnedOrder: number; featured: boolean; cardVariant: string;
  metaTitle: string; metaDescription: string; createdAt: Date; updatedAt: Date;
}) {
  const c = (a.content ?? {}) as ArticleContent;
  const body = Array.isArray(c.body) ? c.body : [];
  const order = typeof c.sortOrder === "number" ? c.sortOrder : (typeof c.order === "number" ? c.order : 0);
  const type = a.type === "lesson" || a.type === "case" ? a.type : "default";
  return {
    id: `media/${a.slug}`,
    slug: a.slug,
    status: a.status,
    order,
    type,
    title: a.title,
    description: a.description,
    coverImageData: a.coverPath || undefined,
    publishedAt: a.publishedAt,
    expertSlug: a.expertSlug || undefined,
    tagIds: a.tagIds,
    keyThoughts: Array.isArray(c.keyThoughts) ? c.keyThoughts.filter((t): t is string => typeof t === "string") : [],
    body,
    multiPage: c.multiPage === true,
    chapters: Array.isArray(c.chapters) ? c.chapters : [],
    caseCard: type === "case" ? (c.caseCard ?? undefined) : undefined,
    featured: type === "case" ? a.featured : undefined,
    cardVariant: a.cardVariant === "wide" ? "wide" : "default",
    pinned: a.pinned,
    pinnedOrder: a.pinnedOrder,
    metaTitle: a.metaTitle,
    metaDescription: a.metaDescription,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function GET() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(articles.map(toDto));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { slug: rawSlug, title, type: rawType } = body as { slug?: string; title?: string; type?: string };
  // Нормализуем на бэке: даже если фронт прислал кириллицу — кладём в БД ASCII slug.
  // Это backstop на случай, если автогенерация на фронте сломается или клиент шлёт сырой ввод.
  const slug = normalizeSlug(rawSlug);
  if (!slug) return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  const type = rawType === "lesson" || rawType === "case" ? rawType : "default";

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "exists" }, { status: 409 });

  const emptyCaseCard = { title: "", description: "", stats: [{ value: "", label: "", description: "" }, { value: "", label: "", description: "" }, { value: "", label: "", description: "" }], result: "" };
  const article = await prisma.article.create({
    data: {
      slug,
      type,
      status: "hidden",
      title: title || "",
      description: "",
      content: {
        body: [],
        keyThoughts: [],
        ...(type === "case" ? { caseCard: emptyCaseCard } : {}),
        sortOrder: 0,
      },
      coverPath: null,
      expertSlug: "r-editorial",
      publishedAt: new Date().toISOString().slice(0, 10),
      tagIds: [],
      pinned: false,
      pinnedOrder: 0,
      featured: false,
      cardVariant: "default",
      metaTitle: title ? `${title} — Rocketmind` : "",
      metaDescription: "",
    },
  });
  return NextResponse.json(toDto(article), { status: 201 });
}
