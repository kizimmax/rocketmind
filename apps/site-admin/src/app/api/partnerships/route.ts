import { NextResponse } from "next/server";
import { parseDataUrl, saveBuffer, deleteFilesWithBase, readConfig, writeConfig } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];

interface PartnershipsData {
  caption: string;
  title: string;
  description: string;
  logos: Array<{ src: string; alt: string }>;
  photos: Array<{ src: string; alt: string }>;
}

const DEFAULT_DATA: PartnershipsData = { caption: "Партнёрства", title: "", description: "", logos: [], photos: [] };

export async function GET() {
  const data = readConfig<PartnershipsData>("partnerships.json") ?? DEFAULT_DATA;
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const logos: Array<{ src: string; alt: string }> = [];
  for (let i = 0; i < (body.logos ?? []).length; i++) {
    const logo = body.logos[i];
    if (logo.src && logo.src.startsWith("data:")) {
      const parsed = parseDataUrl(logo.src);
      if (parsed) {
        deleteFilesWithBase("partnerships", `logo-${i}`, IMAGE_EXTS);
        const diskName = `logo-${i}${parsed.ext}`;
        const { publicUrl } = saveBuffer("partnerships", diskName, parsed.buffer);
        logos.push({ src: publicUrl, alt: logo.alt || "" });
      }
    } else {
      logos.push({ src: logo.src, alt: logo.alt || "" });
    }
  }

  const photos: Array<{ src: string; alt: string }> = [];
  for (let i = 0; i < (body.photos ?? []).length; i++) {
    const photo = body.photos[i];
    if (photo.src && photo.src.startsWith("data:")) {
      const parsed = parseDataUrl(photo.src);
      if (parsed) {
        deleteFilesWithBase("partnerships", `photo-${i + 1}`, IMAGE_EXTS);
        const diskName = `photo-${i + 1}${parsed.ext}`;
        const { publicUrl } = saveBuffer("partnerships", diskName, parsed.buffer);
        photos.push({ src: publicUrl, alt: photo.alt || "" });
      }
    } else {
      photos.push({ src: photo.src, alt: photo.alt || "" });
    }
  }

  const data: PartnershipsData = {
    caption: body.caption || "",
    title: body.title || "",
    description: body.description || "",
    logos,
    photos,
  };
  writeConfig("partnerships.json", data);
  await prisma.systemConfig.upsert({ where: { key: "partnerships" }, update: { value: data as never }, create: { key: "partnerships", value: data as never } }).catch(() => {});

  return NextResponse.json({ ok: true });
}
