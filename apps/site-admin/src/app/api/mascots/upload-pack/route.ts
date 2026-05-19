import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseDataUrl,
  saveBuffer,
  isImageMime,
  extractDataUrlMime,
} from "@/lib/storage";
import { slugify } from "@/lib/slugify";
import crypto from "crypto";

/**
 * POST /api/mascots/upload-pack
 * Body: { packName: string, files: Array<{ name?: string, dataUrl: string }> }
 * Создаёт несколько Mascot с общим pack.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const packName = String(body.packName ?? "").trim();
  if (!packName) {
    return NextResponse.json({ error: "packName_required" }, { status: 400 });
  }
  const packSlug = slugify(packName) || `pack-${Date.now()}`;

  const files = Array.isArray(body.files) ? body.files : [];
  if (files.length === 0) {
    return NextResponse.json({ error: "files_required" }, { status: 400 });
  }

  const created: unknown[] = [];
  const errors: { index: number; error: string; mime?: string | null }[] = [];

  for (let i = 0; i < files.length; i += 1) {
    const entry = files[i] ?? {};
    const dataUrl = entry.dataUrl;
    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      errors.push({ index: i, error: "invalid_dataUrl", mime: extractDataUrlMime(dataUrl) });
      continue;
    }
    if (!isImageMime(parsed.mime)) {
      errors.push({ index: i, error: "unsupported_mime", mime: parsed.mime });
      continue;
    }
    const baseName = entry.name
      ? slugify(String(entry.name)) || crypto.randomBytes(6).toString("hex")
      : crypto.randomBytes(6).toString("hex");
    const fileName = `${baseName}${parsed.ext}`;
    const { publicUrl } = saveBuffer(`mascots/${packSlug}`, fileName, parsed.buffer);

    const mascot = await prisma.mascot.create({
      data: {
        name: entry.name ? String(entry.name) : baseName,
        pack: packSlug,
        imagePath: publicUrl,
        isBuiltIn: false,
      },
    });
    created.push(mascot);
  }

  return NextResponse.json({ pack: packSlug, created, errors }, { status: 201 });
}
