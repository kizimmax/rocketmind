import { NextResponse } from "next/server";
import path from "path";
import { UPLOADS_DIR, parseDataUrl, saveBuffer, randomHex } from "@/lib/storage";
import fs from "fs";

const SUPPORTED = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"]);
const MAX_BYTES = 512 * 1024;

const ROCKETMIND_LOGOS = [
  { src: "/text_logo_light_background_ru.svg", name: "Rocketmind RU (light)" },
  { src: "/text_logo_light_background_en.svg", name: "Rocketmind EN (light)" },
  { src: "/text_logo_dark_background_ru.svg", name: "Rocketmind RU (dark)" },
  { src: "/text_logo_dark_background_en.svg", name: "Rocketmind EN (dark)" },
  { src: "/images/about/rocketmind-logo-mono.svg", name: "Rocketmind mark" },
];

function listLogos(subDir: string, publicPrefix: string, group: string) {
  const absDir = path.join(UPLOADS_DIR, subDir);
  if (!fs.existsSync(absDir)) return [];
  return fs
    .readdirSync(absDir)
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .map((filename) => ({ src: `${publicPrefix}/${filename}`, name: filename.replace(/\.[^.]+$/, ""), group }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function safeStem(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "logo";
}

export async function GET() {
  const rocketmind = ROCKETMIND_LOGOS.map((l) => ({ ...l, group: "rocketmind" }));
  const media = listLogos("logos", "/uploads/logos", "partners");
  const clip = listLogos("clip-logos", "/uploads/clip-logos", "partners");

  const seen = new Set<string>();
  const partners = [];
  for (const item of [...media, ...clip]) {
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    partners.push(item);
  }

  return NextResponse.json([...rocketmind, ...partners]);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const rec = (body ?? {}) as Record<string, unknown>;
  const parsed = parseDataUrl(rec.dataUrl);
  if (!parsed) return NextResponse.json({ error: "invalid dataUrl" }, { status: 400 });

  const { mime, buffer } = parsed;
  if (mime !== "image/svg+xml") {
    return NextResponse.json({ error: `unsupported mime: ${mime} (only svg)` }, { status: 415 });
  }
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: `too large (>${MAX_BYTES} bytes)` }, { status: 413 });
  }

  const stem = typeof rec.fileName === "string" && rec.fileName ? safeStem(rec.fileName) : "logo";
  const diskName = `${stem}-${randomHex(4)}.svg`;
  const { publicUrl } = saveBuffer("logos", diskName, buffer);

  return NextResponse.json({ url: publicUrl, fileName: diskName, mime, size: buffer.byteLength }, { status: 201 });
}
