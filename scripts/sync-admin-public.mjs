/**
 * Dev-only: синкает legacy static (images/ai-mascots/forms/avatars/partners)
 * из site/public в admin/public, чтобы admin отдавал те же `/images/...` URL
 * со своего домена. На проде это делается в Dockerfile (cp -RL в builder).
 *
 * Запуск: автоматически в entrypoint admin-контейнера docker-compose.dev.yml.
 * Идемпотентен (cp -R перепишет если что-то новое).
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SITE_PUBLIC = "/app/apps/site/public";
const ADMIN_PUBLIC = "/app/apps/site-admin/public";
const DIRS = ["images", "ai-mascots", "clip-logos", "media", "forms", "avatars", "partners"];

let copied = 0;
for (const d of DIRS) {
  const src = path.join(SITE_PUBLIC, d);
  const dst = path.join(ADMIN_PUBLIC, d);
  if (!fs.existsSync(src)) continue;
  // Удаляем dst (мог быть симлинком), потом cp -RL — разыменует симлинки в src.
  try {
    fs.rmSync(dst, { recursive: true, force: true });
    execSync(`cp -RL "${src}" "${dst}"`);
    copied++;
  } catch (e) {
    console.warn(`✗ sync ${d} failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
console.log(`✓ sync-admin-public: synced ${copied}/${DIRS.length} static dirs`);
