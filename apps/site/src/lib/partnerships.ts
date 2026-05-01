import { prisma } from "./prisma";
import type { StyledParagraph } from "./products";

export type PartnershipsData = {
  caption: string;
  title: string;
  description: string;
  paragraphs?: StyledParagraph[];
  logos: Array<{ src: string; alt: string }>;
  photos: Array<{ src: string; alt?: string }>;
};

export async function getPartnershipsData(): Promise<PartnershipsData | null> {
  try {
    const row = await prisma.systemConfig.findUnique({ where: { key: "partnerships" } });
    if (!row) return null;
    const raw = row.value as Record<string, unknown>;
    return {
      caption: typeof raw.caption === "string" ? raw.caption : "",
      title: typeof raw.title === "string" ? raw.title : "",
      description: typeof raw.description === "string" ? raw.description : "",
      paragraphs: Array.isArray(raw.paragraphs) ? (raw.paragraphs as StyledParagraph[]) : undefined,
      logos: Array.isArray(raw.logos)
        ? (raw.logos as Array<{ src: string; alt: string }>).map((l) => ({ src: l.src || "", alt: l.alt || "" }))
        : [],
      photos: Array.isArray(raw.photos)
        ? (raw.photos as Array<{ src: string; alt?: string }>).map((p) => ({ src: p.src || "", alt: p.alt }))
        : [],
    };
  } catch {
    return null;
  }
}
