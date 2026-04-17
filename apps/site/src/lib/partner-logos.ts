import { promises as fs } from "node:fs";
import path from "node:path";

import sharp from "sharp";

export type PartnerLogo = {
  alt: string;
  filename: string;
  src: string;
  /** Logical CSS width in px (PNG only — intrinsic pixels ÷ 3 for 3× assets) */
  width?: number;
  /** Logical CSS height in px (PNG only — intrinsic pixels ÷ 3 for 3× assets) */
  height?: number;
};

const SUPPORTED_LOGO_EXTENSIONS = new Set([
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
]);

const preferredOrder = [
  "beeline",
  "rusal",
  "mintsifry",
  "vtb",
  "tbank",
  "rosatom",
];

function formatLogoAlt(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, "");
  return stem
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function resolveHeroLogosDirectory() {
  const candidateDirectories = [
    path.resolve(process.cwd(), "public", "clip-logos"),
    path.resolve(process.cwd(), "assets", "clip-logos"),
    path.resolve(process.cwd(), "..", "assets", "clip-logos"),
    path.resolve(process.cwd(), "..", "..", "assets", "clip-logos"),
  ];

  for (const directory of candidateDirectories) {
    try {
      await fs.access(directory);
      return directory;
    } catch {
      continue;
    }
  }

  throw new Error("Unable to locate the shared hero logos directory.");
}

export async function getHeroLogoFilePath(filename: string) {
  const safeFilename = path.basename(filename);

  if (safeFilename !== filename) {
    return null;
  }

  const directory = await resolveHeroLogosDirectory();
  const filePath = path.join(directory, safeFilename);
  const extension = path.extname(safeFilename).toLowerCase();

  if (!SUPPORTED_LOGO_EXTENSIONS.has(extension)) {
    return null;
  }

  try {
    await fs.access(filePath);
    return filePath;
  } catch {
    return null;
  }
}

const PNG_SCALE = 3; // all PNG assets are exported at 3× — divide for logical CSS pixels

async function getPngLogicalDimensions(
  filePath: string,
): Promise<{ width: number; height: number } | undefined> {
  try {
    const meta = await sharp(filePath).metadata();
    if (meta.width && meta.height) {
      return {
        width: Math.round(meta.width / PNG_SCALE),
        height: Math.round(meta.height / PNG_SCALE),
      };
    }
  } catch {
    // non-fatal — fall back to CSS-only sizing
  }
  return undefined;
}

let cachedLogos: PartnerLogo[] | null = null;

export async function getPartnerLogos(): Promise<PartnerLogo[]> {
  if (cachedLogos) return cachedLogos;

  const directory = await resolveHeroLogosDirectory();
  const entries = await fs.readdir(directory, { withFileTypes: true });

  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((filename) =>
      SUPPORTED_LOGO_EXTENSIONS.has(path.extname(filename).toLowerCase())
    )
    .sort((left, right) => {
      const leftStem = left.replace(/\.[^.]+$/, "");
      const rightStem = right.replace(/\.[^.]+$/, "");
      const leftIndex = preferredOrder.indexOf(leftStem);
      const rightIndex = preferredOrder.indexOf(rightStem);

      if (leftIndex === -1 && rightIndex === -1) {
        return left.localeCompare(right);
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    });

  const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

  cachedLogos = await Promise.all(
    filenames.map(async (filename) => {
      const isPng = path.extname(filename).toLowerCase() === ".png";
      const dims = isPng
        ? await getPngLogicalDimensions(path.join(directory, filename))
        : undefined;

      return {
        alt: formatLogoAlt(filename),
        filename,
        src: `${BASE}/clip-logos/${encodeURIComponent(filename)}`,
        ...dims,
      };
    }),
  );
  return cachedLogos;
}
