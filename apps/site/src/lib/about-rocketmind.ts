import fs from "fs";
import path from "path";

export type AboutRocketmindPhotos = {
  alexPhoto: string;
  canvasPhoto: string;
};

const CONTENT_DIR = path.resolve(process.cwd(), "content");
const JSON_PATH = path.join(CONTENT_DIR, "_about-rocketmind.json");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const DEFAULT_ALEX = "/images/about/alexey-eremin.png";
const DEFAULT_CANVAS = "/images/about/canvas-image.png";

function withBase(src: string): string {
  return src.startsWith("/") ? `${BASE_PATH}${src}` : src;
}

export function getAboutRocketmindPhotos(): AboutRocketmindPhotos {
  let alex = DEFAULT_ALEX;
  let canvas = DEFAULT_CANVAS;
  if (fs.existsSync(JSON_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
      if (typeof raw.alexPhoto === "string" && raw.alexPhoto) alex = raw.alexPhoto;
      if (typeof raw.canvasPhoto === "string" && raw.canvasPhoto) canvas = raw.canvasPhoto;
    } catch { /* fall through to defaults */ }
  }
  return { alexPhoto: withBase(alex), canvasPhoto: withBase(canvas) };
}
