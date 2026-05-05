import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const SUPPORTED = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const PREFERRED = ["beeline", "rusal", "mintsifry", "vtb", "tbank", "rosatom"];

// clip-logos — статичный набор брендовых логотипов, лежит в public/ обоих
// apps (site и site-admin). Контракт URL: `/clip-logos/{filename}` — Next.js
// отдаёт его напрямую из public/, без uploads-роутинга.
export async function GET() {
  const absDir = path.join(process.cwd(), "public", "clip-logos");
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
      src: `/clip-logos/${filename}`,
    })),
  );
}
