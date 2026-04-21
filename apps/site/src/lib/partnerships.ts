import fs from "fs";
import path from "path";
import type { StyledParagraph } from "./products";

export type PartnershipsData = {
  caption: string;
  title: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
  logos: Array<{ src: string; alt: string }>;
  photos: Array<{ src: string; alt?: string }>;
};

const CONTENT_DIR = path.resolve(process.cwd(), "content");
const JSON_PATH = path.join(CONTENT_DIR, "_partnerships.json");

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function getPartnershipsData(): PartnershipsData | null {
  if (!fs.existsSync(JSON_PATH)) return null;

  try {
    const raw = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
    return {
      caption: raw.caption || "",
      title: raw.title || "",
      description: raw.description || "",
      paragraphs: Array.isArray(raw.paragraphs) ? (raw.paragraphs as StyledParagraph[]) : undefined,
      logos: (raw.logos || []).map((l: { src: string; alt: string }) => ({
        src: l.src.startsWith("/") ? `${BASE_PATH}${l.src}` : l.src,
        alt: l.alt || "",
      })),
      photos: (raw.photos || []).map((p: { src: string; alt?: string }) => ({
        src: p.src.startsWith("/") ? `${BASE_PATH}${p.src}` : p.src,
        alt: p.alt || "",
      })),
    };
  } catch {
    return null;
  }
}
