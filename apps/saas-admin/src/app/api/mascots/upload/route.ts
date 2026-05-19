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
 * POST /api/mascots/upload
 * Body: { dataUrl: string, name?: string, pack?: string }
 * Загружает одиночный маскот, по умолчанию в pack="custom".
 */
export async function POST(request: Request) {
  const body = await request.json();
  const dataUrl = body.dataUrl;

  if (typeof dataUrl !== "string") {
    return NextResponse.json({ error: "dataUrl_required" }, { status: 400 });
  }

  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    const mime = extractDataUrlMime(dataUrl);
    return NextResponse.json(
      { error: "unsupported_mime", mime },
      { status: 415 },
    );
  }
  if (!isImageMime(parsed.mime)) {
    return NextResponse.json(
      { error: "unsupported_mime", mime: parsed.mime },
      { status: 415 },
    );
  }

  const pack = (body.pack && String(body.pack).trim()) || "custom";
  const packSlug = slugify(pack) || "custom";
  const baseName = body.name ? slugify(String(body.name)) : "";
  const fileBase = baseName || crypto.randomBytes(6).toString("hex");
  const fileName = `${fileBase}${parsed.ext}`;

  const { publicUrl } = saveBuffer(`mascots/${packSlug}`, fileName, parsed.buffer);

  const mascot = await prisma.mascot.create({
    data: {
      name: body.name ? String(body.name) : fileBase,
      pack: packSlug,
      imagePath: publicUrl,
      isBuiltIn: false,
    },
  });

  return NextResponse.json(mascot, { status: 201 });
}
