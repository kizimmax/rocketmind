import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ExpertContent = { name?: string; tag?: string; shortBio?: string; bio?: string; [key: string]: unknown };

function toDto(e: { id: string; slug: string; content: unknown; photoPath: string | null; sortOrder: number }) {
  const c = (e.content ?? {}) as ExpertContent;
  return {
    slug: e.slug,
    name: String(c.name ?? ""),
    tag: String(c.tag ?? "Эксперт продукта"),
    shortBio: String(c.shortBio ?? ""),
    bio: String(c.bio ?? ""),
    image: e.photoPath || null,
  };
}

export async function GET() {
  const experts = await prisma.expert.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(experts.map(toDto));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, name, tag, shortBio, bio } = body;
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const existing = await prisma.expert.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "exists" }, { status: 409 });

  const expert = await prisma.expert.create({
    data: {
      slug,
      content: { name: name || "", tag: tag || "Эксперт продукта", shortBio: shortBio || "", bio: bio || "" },
      photoPath: null,
      sortOrder: 0,
    },
  });
  return NextResponse.json(toDto(expert), { status: 201 });
}
