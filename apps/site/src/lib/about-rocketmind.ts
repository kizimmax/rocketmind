import { prisma } from "./prisma";

export type AboutRocketmindPhotos = {
  alexPhoto: string;
  canvasPhoto: string;
};

const DEFAULT_ALEX = "/images/about/alexey-eremin.png";
const DEFAULT_CANVAS = "/images/about/canvas-image.png";

export async function getAboutRocketmindPhotos(): Promise<AboutRocketmindPhotos> {
  try {
    const row = await prisma.systemConfig.findUnique({ where: { key: "about-rocketmind" } });
    if (row) {
      const raw = row.value as Record<string, unknown>;
      const alex = typeof raw.alexPhoto === "string" && raw.alexPhoto ? raw.alexPhoto : DEFAULT_ALEX;
      const canvas = typeof raw.canvasPhoto === "string" && raw.canvasPhoto ? raw.canvasPhoto : DEFAULT_CANVAS;
      return { alexPhoto: alex, canvasPhoto: canvas };
    }
  } catch { /* fall through */ }
  return { alexPhoto: DEFAULT_ALEX, canvasPhoto: DEFAULT_CANVAS };
}
