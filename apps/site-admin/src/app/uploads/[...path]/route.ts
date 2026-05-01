import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { UPLOADS_DIR, mimeForExt } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const joined = segments.map((s) => s.replace(/\.\./g, "")).join("/");
  const absPath = path.join(UPLOADS_DIR, joined);

  if (!absPath.startsWith(UPLOADS_DIR)) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(absPath).toLowerCase();
  const mimeType = mimeForExt(ext);
  const buffer = fs.readFileSync(absPath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
