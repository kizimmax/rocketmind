import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { UPLOADS_DIR } from "@/lib/storage";

const SUPPORTED = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const PREFERRED = ["beeline", "rusal", "mintsifry", "vtb", "tbank", "rosatom"];

export async function GET() {
  const absDir = path.join(UPLOADS_DIR, "clip-logos");
  if (!fs.existsSync(absDir)) return NextResponse.json([]);

  const filenames = fs
    .readdirSync(absDir)
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .sort((a, b) => {
      const aStem = a.replace(/\.[^.]+$/, "");
      const bStem = b.replace(/\.[^.]+$/, "");
      const ai = PREFERRED.indexOf(aStem);
      const bi = PREFERRED.indexOf(bStem);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  return NextResponse.json(
    filenames.map((filename) => ({
      alt: filename.replace(/\.[^.]+$/, ""),
      src: `/uploads/clip-logos/${filename}`,
    })),
  );
}
