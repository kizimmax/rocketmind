/**
 * One-shot миграция: включает `integrations.bitrix24.enabled = true` для всех
 * существующих форм с пустым webhookUrl. Backend подставит глобальный URL из
 * env BITRIX24_DEFAULT_WEBHOOK_URL при отправке. Per-form URL не трогаем.
 *
 * Запуск:
 *   docker compose -f docker-compose.dev.yml exec admin node scripts/enable-bitrix24-on-existing-forms.mjs
 *
 * Идемпотентен: повторный запуск — no-op.
 */
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const { rows } = await pool.query(`SELECT id, content FROM forms`);
let updated = 0;
let alreadyOn = 0;

for (const row of rows) {
  const content = (row.content && typeof row.content === "object" ? row.content : {});
  const integrations = (content.integrations && typeof content.integrations === "object" ? content.integrations : {});
  const bitrix24 = (integrations.bitrix24 && typeof integrations.bitrix24 === "object" ? integrations.bitrix24 : {});

  if (bitrix24.enabled === true) {
    alreadyOn++;
    continue;
  }

  const nextContent = {
    ...content,
    integrations: {
      ...integrations,
      bitrix24: {
        enabled: true,
        webhookUrl: typeof bitrix24.webhookUrl === "string" ? bitrix24.webhookUrl : "",
        assignedById: typeof bitrix24.assignedById === "number" ? bitrix24.assignedById : null,
      },
    },
  };
  await pool.query(`UPDATE forms SET content = $1 WHERE id = $2`, [nextContent, row.id]);
  updated++;
}

console.log(`✓ форм всего: ${rows.length}, уже было включено: ${alreadyOn}, обновлено: ${updated}`);
await pool.end();
