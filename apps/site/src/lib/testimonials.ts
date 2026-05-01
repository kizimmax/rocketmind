import { prisma } from "./prisma";

export type Testimonial = {
  id: string;
  paragraphs: string[];
  name: string;
  position: string;
  avatar: string | null;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map((r) => {
      const c = (r.content && typeof r.content === "object" ? r.content : {}) as Record<string, unknown>;
      return {
        id: r.id,
        paragraphs: Array.isArray(c.paragraphs)
          ? (c.paragraphs as unknown[]).filter((p): p is string => typeof p === "string")
          : [],
        name: typeof c.name === "string" ? c.name : "",
        position: typeof c.position === "string" ? c.position : "",
        avatar: r.avatarPath ?? null,
      };
    });
  } catch {
    return [];
  }
}
