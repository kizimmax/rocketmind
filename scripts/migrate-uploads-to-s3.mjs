#!/usr/bin/env node
/**
 * One-shot migration: apps/site/public/{images,forms,avatars}/** → S3.
 * Also creates Asset records in Postgres for tracking.
 *
 *   DATABASE_URL=postgresql://... \
 *   S3_ENDPOINT=https://storage.yandexcloud.net S3_REGION=ru-central1 \
 *   S3_BUCKET=rocketmind-uploads \
 *   S3_ACCESS_KEY=... S3_SECRET_KEY=... \
 *   S3_PUBLIC_URL_BASE=https://storage.yandexcloud.net/rocketmind-uploads \
 *   node scripts/migrate-uploads-to-s3.mjs
 *
 * Идемпотентен: пропускает файлы, которые уже в Asset table.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SITE_PUBLIC = path.join(ROOT, "apps", "site", "public");

const TARGET_DIRS = ["images", "forms", "avatars", "media"];
const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
};

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION || "ru-central1";
const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
const publicUrlBase = process.env.S3_PUBLIC_URL_BASE || `${endpoint}/${bucket}`;

if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
  console.error("✗ Не заданы S3 ENV (S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY)");
  process.exit(1);
}

const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});
const dbPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(dbPool) });

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && !entry.name.startsWith(".")) yield full;
  }
}

async function uploadOne(absPath) {
  const rel = path.relative(SITE_PUBLIC, absPath).split(path.sep).join("/");
  const ext = path.extname(absPath).toLowerCase();
  const mimeType = MIME_BY_EXT[ext] || "application/octet-stream";

  const existing = await prisma.asset.findUnique({ where: { filePath: rel } });
  if (existing) return { skipped: true, key: rel };

  const buffer = fs.readFileSync(absPath);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: rel,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    }),
  );

  await prisma.asset.create({
    data: {
      filePath: rel,
      publicUrl: `${publicUrlBase}/${rel}`,
      mimeType,
      sizeBytes: buffer.length,
      role: rel.split("/")[0] || "misc",
      originalName: path.basename(absPath),
    },
  });
  return { skipped: false, key: rel, size: buffer.length };
}

async function main() {
  console.log("→ Migrating apps/site/public/* → S3");
  let total = 0;
  let uploaded = 0;
  let skipped = 0;
  let bytes = 0;

  for (const sub of TARGET_DIRS) {
    const dir = path.join(SITE_PUBLIC, sub);
    for (const file of walk(dir)) {
      total++;
      try {
        const result = await uploadOne(file);
        if (result.skipped) {
          skipped++;
        } else {
          uploaded++;
          bytes += result.size || 0;
          if (uploaded % 25 === 0) console.log(`  · ${uploaded} uploaded`);
        }
      } catch (e) {
        console.error(`✗ ${file}: ${e.message}`);
      }
    }
  }

  console.log(`✔ Total ${total}, uploaded ${uploaded} (${(bytes / 1024 / 1024).toFixed(2)} MB), skipped ${skipped}`);
}

main()
  .catch((e) => {
    console.error("✗ Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
