import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

type TestimonialContent = {
  id?: string;
  order?: number;
  paragraphs?: string[];
  name?: string;
  position?: string;
  gender?: "m" | "f";
  [key: string]: unknown;
};

function toDto(t: { id: string; content: unknown; avatarPath: string | null; sortOrder: number }) {
  const c = (t.content ?? {}) as TestimonialContent;
  return {
    id: t.id,
    order: t.sortOrder,
    paragraphs: Array.isArray(c.paragraphs) ? c.paragraphs.filter((p): p is string => typeof p === "string") : [],
    name: String(c.name ?? ""),
    position: String(c.position ?? ""),
    avatar: t.avatarPath || null,
    gender: c.gender === "f" ? "f" : ("m" as "m" | "f"),
  };
}

export async function GET(request: Request) {
  const gate = await requirePermission(request, "testimonials", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items.map(toDto));
}

export async function POST(request: Request) {
  const gate = await requirePermission(request, "testimonials", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name : "";
  const count = await prisma.testimonial.count();

  const item = await prisma.testimonial.create({
    data: {
      content: {
        paragraphs: Array.isArray(body.paragraphs)
          ? body.paragraphs.filter((p: unknown): p is string => typeof p === "string")
          : [""],
        name,
        position: typeof body.position === "string" ? body.position : "",
        gender: body.gender === "f" ? "f" : "m",
      },
      avatarPath: null,
      sortOrder: count,
    },
  });
  return NextResponse.json(toDto(item), { status: 201 });
}
