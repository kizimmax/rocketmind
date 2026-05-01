import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PRODUCT_CATEGORIES = new Set(["consulting", "academy", "ai-products"]);

export async function GET() {
  const pages = await prisma.page.findMany({
    where: { category: { in: ["consulting", "academy", "ai-products"] } },
    select: { slug: true, category: true, cardTitle: true, cardDescription: true, content: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(
    pages
      .filter((p) => PRODUCT_CATEGORIES.has(p.category))
      .map((p) => {
        const c = (p.content ?? {}) as Record<string, unknown>;
        const coverPath = typeof c.coverPath === "string" ? c.coverPath : null;
        return {
          slug: p.slug,
          category: p.category,
          cardTitle: p.cardTitle || p.slug,
          cardDescription: p.cardDescription || "",
          coverUrl: coverPath || null,
        };
      }),
  );
}
