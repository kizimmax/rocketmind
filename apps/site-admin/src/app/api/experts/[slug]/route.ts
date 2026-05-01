import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDataUrl, saveBuffer, deleteFilesWithBase, randomHex } from "@/lib/storage";

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({ where: { slug } });
  if (!expert) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const existing = (expert.content ?? {}) as Record<string, unknown>;

  const updated = await prisma.expert.update({
    where: { slug },
    data: {
      content: { ...existing, ...body, slug },
    },
  });
  return NextResponse.json({ slug, ...(updated.content as Record<string, unknown>) });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({ where: { slug } });
  if (!expert) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Accept either multipart/form-data (legacy) or JSON { dataUrl }
  const contentType = request.headers.get("content-type") ?? "";
  let buffer: Buffer;
  let ext: string;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("photo") as File | null;
    if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });
    ext = "." + (file.name.split(".").pop() || "jpg");
    buffer = Buffer.from(await file.arrayBuffer());
  } else {
    const body = await request.json();
    const parsed = parseDataUrl(body.dataUrl);
    if (!parsed) return NextResponse.json({ error: "invalid dataUrl" }, { status: 400 });
    buffer = parsed.buffer;
    ext = parsed.ext;
  }

  deleteFilesWithBase("experts", slug, IMAGE_EXTS);
  const diskName = `${slug}${ext}`;
  const { publicUrl } = saveBuffer("experts", diskName, buffer);

  await prisma.expert.update({ where: { slug }, data: { photoPath: publicUrl } });
  return NextResponse.json({ image: publicUrl });
}
