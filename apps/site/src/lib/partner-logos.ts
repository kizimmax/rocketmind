import { promises as fs } from "node:fs";
import path from "node:path";

export type PartnerLogo = {
  alt: string;
  filename: string;
  src: string;
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
    path.resolve(process.cwd(), "assets", "hero-logos"),
    path.resolve(process.cwd(), "..", "assets", "hero-logos"),
    path.resolve(process.cwd(), "..", "..", "assets", "hero-logos"),
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

export async function getPartnerLogos(): Promise<PartnerLogo[]> {

  const directory = await resolveHeroLogosDirectory();
  const entries = await fs.readdir(directory, { withFileTypes: true });

  return entries
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
    })
    .map((filename) => ({
      alt: formatLogoAlt(filename),
      filename,
      src: `/hero-logos/${filename}`,
    }));
}
