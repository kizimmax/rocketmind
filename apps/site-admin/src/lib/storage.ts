import fs from "fs";
import path from "path";
import crypto from "crypto";

export const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "/data/uploads";
export const CONFIG_DIR = process.env.CONFIG_DIR ?? "/data/config";

/**
 * Был CMS_PUBLIC_URL (абсолютный) — мы хранили в БД `http://admin:3004/uploads/...`,
 * что на проде давало кросс-доменные `<img>` с CSP/CORS-проблемами и завязку на хост.
 * Теперь храним **относительный путь** `/uploads/...`. Сайт обслуживает его через
 * собственный route handler (`apps/site/src/app/uploads/[...path]/route.ts`),
 * админка — через свой. Оба читают из одного `UPLOADS_DIR` (на проде — общий volume
 * `/data/uploads`).
 */

export const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/ogg": ".ogg",
  "audio/mp4": ".m4a",
  "audio/x-m4a": ".m4a",
  "audio/webm": ".webm",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/ogg": ".ogv",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
};

const EXT_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
};

export function mimeForExt(ext: string): string {
  return EXT_TO_MIME[ext.toLowerCase()] ?? "application/octet-stream";
}

/** Image-only MIME-белый список. Использовать для аватаров эксперта/отзыва/глоссария
 *  и любых полей вида «фото», где приём PDF/audio/video/zip — баг и потенциальный
 *  disk leak (соседний файл со старым расширением не удаляется). */
export const IMAGE_MIMES = new Set<string>([
  "image/png", "image/jpeg", "image/jpg", "image/webp",
  "image/svg+xml", "image/gif", "image/avif",
]);
export const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"];

export function isImageMime(mime: string): boolean { return IMAGE_MIMES.has(mime); }

export function publicUrlFor(filePath: string): string {
  const normalized = filePath.split(path.sep).join("/");
  return `/uploads/${normalized}`;
}

export interface ParsedDataUrl {
  mime: string;
  ext: string;
  buffer: Buffer;
}

export function parseDataUrl(dataUrl: unknown): ParsedDataUrl | null {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const ext = MIME_TO_EXT[mime];
  if (!ext) return null;
  return { mime, ext, buffer: Buffer.from(match[2], "base64") };
}

export interface SaveResult {
  filePath: string;
  publicUrl: string;
}

export function saveBuffer(dir: string, fileName: string, buffer: Buffer): SaveResult {
  const absDir = path.join(UPLOADS_DIR, dir);
  fs.mkdirSync(absDir, { recursive: true });
  const absPath = path.join(absDir, fileName);
  fs.writeFileSync(absPath, buffer);
  const filePath = [dir, fileName].join("/").replace(/\/+/g, "/");
  return { filePath, publicUrl: publicUrlFor(filePath) };
}

export function saveDataUrl(dir: string, baseName: string, dataUrl: string): SaveResult | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  return saveBuffer(dir, `${baseName}${parsed.ext}`, parsed.buffer);
}

export function saveDataUrlWithExt(dir: string, baseName: string, dataUrl: string): SaveResult | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  return saveBuffer(dir, `${baseName}${parsed.ext}`, parsed.buffer);
}

export function deleteStorageFile(filePath: string): void {
  const absPath = path.join(UPLOADS_DIR, filePath);
  try {
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  } catch { /* ignore */ }
}

export function deleteFilesWithBase(dir: string, baseName: string, exts: string[]): void {
  const absDir = path.join(UPLOADS_DIR, dir);
  for (const ext of exts) {
    const absPath = path.join(absDir, baseName + ext);
    try {
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    } catch { /* ignore */ }
  }
}

export function deleteStorageDir(dir: string): void {
  const absDir = path.join(UPLOADS_DIR, dir);
  try {
    if (fs.existsSync(absDir)) fs.rmSync(absDir, { recursive: true, force: true });
  } catch { /* ignore */ }
}

export function randomHex(bytes = 6): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function listDir(dir: string): string[] {
  const absDir = path.join(UPLOADS_DIR, dir);
  if (!fs.existsSync(absDir)) return [];
  try {
    return fs.readdirSync(absDir).filter((f) => !f.startsWith("."));
  } catch {
    return [];
  }
}

// ── Config helpers ────────────────────────────────────────────────────────────

export function readConfig<T>(name: string): T | null {
  const configPath = path.join(CONFIG_DIR, name);
  try {
    if (!fs.existsSync(configPath)) return null;
    const raw = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeConfig(name: string, data: unknown): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(CONFIG_DIR, name), JSON.stringify(data, null, 2), "utf-8");
}

export function readConfigRaw(name: string): string | null {
  const configPath = path.join(CONFIG_DIR, name);
  try {
    if (!fs.existsSync(configPath)) return null;
    return fs.readFileSync(configPath, "utf-8");
  } catch {
    return null;
  }
}

export function writeConfigRaw(name: string, data: string): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(CONFIG_DIR, name), data, "utf-8");
}

export function deleteConfigFile(name: string): void {
  const configPath = path.join(CONFIG_DIR, name);
  try {
    if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
  } catch { /* ignore */ }
}
