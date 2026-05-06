/**
 * One-shot миграция: убирает абсолютный префикс из URL'ов uploads.
 * Заменяет:
 *   http://localhost:3004/uploads/...  →  /uploads/...
 *   http://localhost:3001/uploads/...  →  /uploads/...
 *   https://*.amvera.io/uploads/...    →  /uploads/...
 * Затрагивает: pages.content, articles.content, glossary_terms.content,
 *              forms.content, system_configs.value, assets.publicUrl.
 *
 * Запуск (внутри admin-контейнера или с DATABASE_URL=...):
 *   docker compose -f docker-compose.dev.yml exec admin node scripts/migrate-uploads-to-relative.mjs
 *
 * Идемпотентен: повторный запуск не делает ничего, потому что искомые префиксы
 * уже отсутствуют.
 */
import { Pool } from "pg";

const RE = /(https?:\/\/[^"'/\s]*\/uploads\/)/g;
const TARGET_PATTERNS = [
  /^https?:\/\/(localhost(:\d+)?|[^/]*amvera\.io)\/uploads\//,
];

function rewriteString(s) {
  if (typeof s !== "string") return s;
  return s.replace(RE, (match) => {
    if (TARGET_PATTERNS.some((p) => p.test(match))) return "/uploads/";
    return match;
  });
}

function deepRewrite(v) {
  if (v == null) return v;
  if (typeof v === "string") return rewriteString(v);
  if (Array.isArray(v)) return v.map(deepRewrite);
  if (typeof v === "object") {
    const out = {};
    let changed = false;
    for (const [k, val] of Object.entries(v)) {
      const next = deepRewrite(val);
      out[k] = next;
      if (next !== val) changed = true;
    }
    return changed ? out : v;
  }
  return v;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrateJsonTable(table, idCol, jsonCol) {
  const { rows } = await pool.query(`SELECT ${idCol} AS id, ${jsonCol} AS data FROM ${table}`);
  let updated = 0;
  for (const row of rows) {
    const before = JSON.stringify(row.data);
    const after = deepRewrite(row.data);
    const afterStr = JSON.stringify(after);
    if (before !== afterStr) {
      await pool.query(`UPDATE ${table} SET ${jsonCol} = $1 WHERE ${idCol} = $2`, [after, row.id]);
      updated++;
    }
  }
  console.log(`✓ ${table}: проверено ${rows.length}, обновлено ${updated}`);
}

async function migrateAssetsTable() {
  const { rows } = await pool.query(`SELECT id, "publicUrl" FROM assets`);
  let updated = 0;
  for (const row of rows) {
    const next = rewriteString(row.publicUrl);
    if (next !== row.publicUrl) {
      await pool.query(`UPDATE assets SET "publicUrl" = $1 WHERE id = $2`, [next, row.id]);
      updated++;
    }
  }
  console.log(`✓ assets: проверено ${rows.length}, обновлено ${updated}`);
}

async function main() {
  console.log("Migrating uploads URLs to relative paths…");
  await migrateJsonTable("pages", "id", "content");
  await migrateJsonTable("articles", "id", "content");
  await migrateJsonTable("glossary_terms", "id", "content");
  await migrateJsonTable("forms", "id", "content");
  await migrateJsonTable("system_configs", "key", "value");
  await migrateAssetsTable();
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => pool.end());
