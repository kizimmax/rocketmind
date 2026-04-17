import fs from "fs";
import path from "path";

export type Testimonial = {
  id: string;
  paragraphs: string[];
  name: string;
  position: string;
  avatar: string | null;
};

const FILE = path.join(process.cwd(), "content", "_testimonials.json");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function withBasePath(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return src.startsWith("/") ? BASE_PATH + src : src;
}

export function getTestimonials(): Testimonial[] {
  if (!fs.existsSync(FILE)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8")) as {
      items?: Array<{
        id?: string;
        order?: number;
        paragraphs?: string[];
        name?: string;
        position?: string;
        avatar?: string | null;
      }>;
    };
    const items = Array.isArray(raw.items) ? raw.items : [];
    return items
      .filter((t) => typeof t.id === "string")
      .map((t, i) => ({
        id: t.id as string,
        paragraphs: Array.isArray(t.paragraphs)
          ? t.paragraphs.filter((p): p is string => typeof p === "string")
          : [],
        name: t.name ?? "",
        position: t.position ?? "",
        avatar: withBasePath(t.avatar),
        order: typeof t.order === "number" ? t.order : i,
      }))
      .sort((a, b) => a.order - b.order)
      .map(({ order: _o, ...rest }) => rest);
  } catch {
    return [];
  }
}
