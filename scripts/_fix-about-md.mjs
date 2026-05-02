import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = "/Users/Maxi/GitHub/Rocketmind";
const CLIP = path.join(ROOT, "assets", "clip-logos");
const ABOUT_MD = path.join(ROOT, "apps/site/content/unique/about.md");

// Read the deduped DB → use it as source of truth for mapping
import pg from "pg";
const pool = new pg.Pool({
  connectionString: "postgresql://alex:123456qwerasdzx@postgres-rocketmind.db-msk0.amvera.tech:5432/siteadmin?sslmode=require",
  ssl: { rejectUnauthorized: false },
});
const r = await pool.query("SELECT content FROM pages WHERE slug='about' AND category='unique'");
await pool.end();

const cells = r.rows[0].content.projects.logoGrid.cells;
// Map by id: cell.id (clip-1744800000000) → src
const idToSrc = new Map();
for (const c of cells) idToSrc.set(c.id, c.src);

// Read about.md and replace each "/images/unique/about/logos/cell-<id>.svg" → new src
let md = fs.readFileSync(ABOUT_MD, "utf-8");
let count = 0;
md = md.replace(/\/images\/unique\/about\/logos\/cell-(clip-\d+)\.\w+/g, (m, id) => {
  const newSrc = idToSrc.get(id);
  if (!newSrc) return m;
  count++;
  return newSrc;
});
fs.writeFileSync(ABOUT_MD, md);
console.log(`✔ Replaced ${count} paths in about.md`);
