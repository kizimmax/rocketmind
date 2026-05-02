#!/usr/bin/env node
/**
 * One-shot: дедупликация логотипов проектов на /about.
 *
 * Cells в pages.about.content.projects.logoGrid ссылаются на
 * /images/unique/about/logos/cell-clip-XXX.svg — это копии файлов
 * из assets/clip-logos/. Меняем src на /clip-logos/<original>.svg
 * чтобы использовать общий каталог (один источник, симлинк ai-mascots).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");

const ABOUT_LOGOS_DIR = path.join(ROOT, "apps", "site", "public", "images", "unique", "about", "logos");
const CLIP_LOGOS_DIR = path.join(ROOT, "assets", "clip-logos");

function hash(filePath) {
  return crypto.createHash("sha1").update(fs.readFileSync(filePath)).digest("hex");
}

function buildHashIndex(dir) {
  const idx = new Map();
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (!fs.statSync(full).isFile()) continue;
    idx.set(hash(full), file);
  }
  return idx;
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const clipIdx = buildHashIndex(CLIP_LOGOS_DIR);
  console.log(`✔ ${clipIdx.size} clip-logos indexed by hash`);

  const page = await prisma.page.findFirst({ where: { slug: "about", category: "unique" } });
  if (!page) throw new Error("about page not found in DB");
  const content = page.content;
  const cells = content?.projects?.logoGrid?.cells ?? [];
  console.log(`→ ${cells.length} cells in about/projects/logoGrid`);

  let mapped = 0, unmapped = 0;
  for (const cell of cells) {
    const src = cell.src || "";
    if (!src.includes("/images/unique/about/logos/")) continue;
    const fname = path.basename(src);
    const fullPath = path.join(ABOUT_LOGOS_DIR, fname);
    if (!fs.existsSync(fullPath)) { unmapped++; continue; }
    const h = hash(fullPath);
    const orig = clipIdx.get(h);
    if (!orig) { unmapped++; continue; }
    cell.src = `/clip-logos/${orig}`;
    cell.alt = orig.replace(/\.[^.]+$/, "").replace(/[-_ ]+/g, " ").trim();
    mapped++;
  }
  console.log(`→ remapped: ${mapped}, unmapped: ${unmapped}`);

  await prisma.page.update({ where: { id: page.id }, data: { content } });
  console.log("✔ DB updated");
}

main().catch((e) => { console.error("✗", e); process.exit(1); }).finally(() => prisma.$disconnect());
