#!/usr/bin/env node
/**
 * Build-time snapshot of site content → static JSON + assets under public/data/.
 * Consumed by the static GitHub Pages export (`GITHUB_PAGES=1`) via the
 * `apiFetch()` wrapper, which rewrites `/api/*` GETs to these files.
 *
 * Mirrors the GET logic of src/app/api/*\/route.ts. If those change, update
 * this script too. (Source of truth: the API routes.)
 *
 * Image/audio assets are COPIED (not inlined as data URLs) to keep JSON small.
 * URLs are written with `${BASE_PATH}/data/...` prefix so they resolve
 * correctly under any route inside the admin.
 *   BASE_PATH=/rocketmind/cms node scripts/build-cms-data.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.resolve(ADMIN_ROOT, "..", "site");
const SITE_PUBLIC = path.join(SITE_ROOT, "public");
const SITE_CONTENT = path.join(SITE_ROOT, "content");
const OUT_DIR = path.join(ADMIN_ROOT, "public", "data");
const OUT_ASSETS = path.join(OUT_DIR, "assets");

const BASE_PATH = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";
const ASSET_URL_BASE = `${BASE_PATH}/data/assets`;

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];
const AUDIO_EXTS = [".mp3", ".wav", ".ogg", ".m4a", ".webm"];

const SECTION_DIRS = {
  consulting: path.join(SITE_CONTENT, "products"),
  academy: path.join(SITE_CONTENT, "academy"),
  "ai-products": path.join(SITE_CONTENT, "ai-products"),
  cases: path.join(SITE_CONTENT, "cases"),
  media: path.join(SITE_CONTENT, "media"),
  unique: path.join(SITE_CONTENT, "unique"),
};

const DEFAULT_BLOCK_TYPES = [
  "hero", "logoMarquee", "about", "partnerships", "audience", "tools",
  "results", "services", "process", "experts", "aboutRocketmind", "pageBottom",
];

// ── asset copy ───────────────────────────────────────────────────────────────

const copiedAssets = new Set();

/** Copy a file under apps/site/public into public/data/assets, return URL. */
function copyAsset(publicUrl) {
  if (!publicUrl || publicUrl.startsWith("data:") || publicUrl.startsWith("http")) {
    return publicUrl || null;
  }
  const clean = publicUrl.startsWith("/") ? publicUrl.slice(1) : publicUrl;
  const src = path.join(SITE_PUBLIC, clean);
  if (!fs.existsSync(src)) return null;
  const dst = path.join(OUT_ASSETS, clean);
  if (!copiedAssets.has(dst)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    copiedAssets.add(dst);
  }
  return `${ASSET_URL_BASE}/${clean}`;
}

function copyPageAsset(category, slug, role, extensions) {
  const subdir = category === "unique"
    ? `images/unique/${slug}`
    : `images/products/${category}/${slug}`;
  for (const ext of extensions) {
    const rel = `${subdir}/${role}${ext}`;
    if (fs.existsSync(path.join(SITE_PUBLIC, rel))) return copyAsset("/" + rel);
  }
  return null;
}

// ── readers ──────────────────────────────────────────────────────────────────

function readPartnerships() {
  const jsonPath = path.join(SITE_CONTENT, "_partnerships.json");
  if (!fs.existsSync(jsonPath)) {
    return { caption: "Партнёрства", title: "", description: "", logos: [], photos: [] };
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  return {
    caption: raw.caption || "",
    title: raw.title || "",
    description: raw.description || "",
    logos: (raw.logos || []).map((l) => ({ src: copyAsset(l.src) || l.src, alt: l.alt || "" })),
    photos: (raw.photos || []).map((p) => ({ src: copyAsset(p.src) || p.src, alt: p.alt || "" })),
  };
}

function readPages() {
  const partnerships = readPartnerships();
  const pages = [];

  for (const [sectionId, dir] of Object.entries(SECTION_DIRS)) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

    files.forEach((file, index) => {
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data } = matter(raw);
        if (!data.slug) return;

        const category = data.category || sectionId;
        const coverUrl = copyPageAsset(category, data.slug, "cover", IMAGE_EXTS);
        const aboutUrl = copyPageAsset(category, data.slug, "about", IMAGE_EXTS);
        const audioUrl = copyPageAsset(category, data.slug, "audio", AUDIO_EXTS);

        const blockTypesForSection = sectionId === "unique"
          ? (data.slug === "home"
              ? ["homeHero", "methodology", "homeSections"]
              : data.slug === "cases-index"
              ? ["hero", "about"]
              : ["hero", "about", "tools", "projects", "process", "experts", "audience", "pageBottom"])
          : sectionId === "cases"
          ? (data.caseType === "mini"
              ? ["caseCard"]
              : ["caseCard", "hero", "about", "pageBottom"])
          : DEFAULT_BLOCK_TYPES;

        const blocks = blockTypesForSection.map((type, i) => {
          let blockData = {};
          let enabled = true;

          switch (type) {
            case "hero":
              blockData = data.hero || {};
              enabled = !!data.hero;
              if (coverUrl && !blockData.heroImageData) blockData = { ...blockData, heroImageData: coverUrl };
              if (audioUrl && !blockData.audioData) blockData = { ...blockData, audioData: audioUrl };
              break;
            case "about":
              if (data.about) {
                blockData = data.about;
                if (aboutUrl && !blockData.aboutImageData) blockData = { ...blockData, aboutImageData: aboutUrl };
              } else { enabled = false; }
              break;
            case "projects": {
              const p = data.projects;
              if (p && typeof p === "object") {
                blockData = p;
                const lg = blockData.logoGrid;
                if (lg && Array.isArray(lg.cells)) {
                  const cells = lg.cells.map((c) => {
                    const url = copyAsset(c.src);
                    return url ? { ...c, src: url } : c;
                  });
                  blockData = { ...blockData, logoGrid: { cells } };
                }
              } else { enabled = false; }
              break;
            }
            case "audience": if (data.audience) blockData = data.audience; else enabled = false; break;
            case "tools":    if (data.tools)    blockData = data.tools;    else enabled = false; break;
            case "results":  if (data.results)  blockData = data.results;  else enabled = false; break;
            case "process":  if (data.process)  blockData = data.process;  else enabled = false; break;
            case "services": if (data.services) blockData = data.services; else enabled = false; break;
            case "experts": {
              const arr = data.experts;
              if (Array.isArray(arr)) { blockData = { experts: arr }; enabled = true; }
              else { blockData = { experts: [] }; enabled = sectionId === "academy"; }
              break;
            }
            case "partnerships":
              blockData = partnerships;
              enabled = sectionId === "academy";
              break;
            case "aboutRocketmind":
              enabled = data.aboutRocketmind !== false;
              blockData = data.aboutRocketmind && typeof data.aboutRocketmind === "object" ? data.aboutRocketmind : {};
              break;
            case "logoMarquee":
              enabled = data.logoMarquee !== false;
              break;
            case "pageBottom":
              enabled = !!data.pageBottom;
              if (data.pageBottom) blockData = data.pageBottom;
              break;
            case "homeHero":
              if (data.homeHero && typeof data.homeHero === "object") { blockData = data.homeHero; enabled = true; }
              else enabled = false;
              break;
            case "methodology":
              if (data.methodology && typeof data.methodology === "object") { blockData = data.methodology; enabled = true; }
              else enabled = false;
              break;
            case "homeSections":
              if (data.homeSections && typeof data.homeSections === "object") { blockData = data.homeSections; enabled = true; }
              else enabled = false;
              break;
            case "caseCard":
              if (data.caseCard && typeof data.caseCard === "object") { blockData = data.caseCard; enabled = true; }
              else enabled = false;
              break;
          }
          return { id: `${data.slug}_${type}`, type, enabled, order: i, data: blockData };
        });

        const customSections = Array.isArray(data.customSections) ? data.customSections : [];
        const finalBlocks = [];
        for (const b of blocks) {
          finalBlocks.push(b);
          for (const cs of customSections) {
            if (cs && typeof cs === "object" && cs.insertAfter === b.type) {
              finalBlocks.push({
                id: typeof cs.id === "string" ? cs.id : `cs_${Math.random().toString(36).slice(2, 9)}`,
                type: "customSection",
                enabled: cs.enabled !== false,
                order: 0,
                data: (cs.data && typeof cs.data === "object" ? cs.data : {}),
              });
            }
          }
        }
        const preBlocks = customSections.filter(
          (cs) => cs && typeof cs === "object" && (cs.insertAfter === null || cs.insertAfter === "" || cs.insertAfter === undefined),
        );
        for (let i = preBlocks.length - 1; i >= 0; i--) {
          const cs = preBlocks[i];
          finalBlocks.unshift({
            id: typeof cs.id === "string" ? cs.id : `cs_${Math.random().toString(36).slice(2, 9)}`,
            type: "customSection",
            enabled: cs.enabled !== false,
            order: 0,
            data: (cs.data && typeof cs.data === "object" ? cs.data : {}),
          });
        }
        finalBlocks.forEach((b, i) => { b.order = i; });

        const stat = fs.statSync(path.join(dir, file));
        pages.push({
          id: `${sectionId}/${data.slug}`,
          sectionId,
          slug: data.slug,
          status: "published",
          order: index,
          menuTitle: data.menuTitle || "",
          menuDescription: data.menuDescription || "",
          cardTitle: data.cardTitle || "",
          cardDescription: data.cardDescription || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          expertProduct: typeof data.expertProduct === "boolean" ? data.expertProduct : undefined,
          caseType: data.caseType === "mini" || data.caseType === "big" ? data.caseType : undefined,
          featured: data.featured === true ? true : (data.featured === false ? false : undefined),
          blocks: finalBlocks,
          createdAt: stat.birthtime.toISOString(),
          updatedAt: stat.mtime.toISOString(),
        });
      } catch (e) {
        console.warn(`skip ${file}: ${e.message}`);
      }
    });
  }
  return pages;
}

function readExperts() {
  const dir = path.join(SITE_CONTENT, "experts");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data } = matter(raw);
        const slug = data.slug || file.replace(/\.md$/, "");
        let image = null;
        for (const ext of [".jpg", ".png", ".webp", ".svg"]) {
          const rel = `images/experts/${slug}${ext}`;
          if (fs.existsSync(path.join(SITE_PUBLIC, rel))) { image = copyAsset("/" + rel); break; }
        }
        return {
          slug,
          name: data.name || "",
          tag: data.tag || "Эксперт продукта",
          shortBio: data.shortBio || "",
          bio: data.bio || "",
          image,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function readTestimonials() {
  const file = path.join(SITE_CONTENT, "_testimonials.json");
  if (!fs.existsSync(file)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
    const items = Array.isArray(raw.items) ? raw.items : [];
    return items
      .map((t) => ({
        id: String(t.id ?? ""),
        order: typeof t.order === "number" ? t.order : 0,
        paragraphs: Array.isArray(t.paragraphs) ? t.paragraphs.filter((p) => typeof p === "string") : [],
        name: typeof t.name === "string" ? t.name : "",
        position: typeof t.position === "string" ? t.position : "",
        avatar: typeof t.avatar === "string" ? (copyAsset(t.avatar) || t.avatar) : null,
        gender: t.gender === "f" ? "f" : "m",
      }))
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

function readPartnerLogos() {
  const dir = path.join(SITE_PUBLIC, "clip-logos");
  if (!fs.existsSync(dir)) return [];
  const SUPPORTED = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif"]);
  const PREFERRED = ["beeline", "rusal", "mintsifry", "vtb", "tbank", "rosatom"];
  const filenames = fs.readdirSync(dir)
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
  return filenames.map((filename) => ({
    alt: filename.replace(/\.[^.]+$/, ""),
    src: copyAsset(`/clip-logos/${filename}`) || `/clip-logos/${filename}`,
  }));
}

// ── main ─────────────────────────────────────────────────────────────────────

function writeJson(name, payload) {
  const fp = path.join(OUT_DIR, name);
  fs.writeFileSync(fp, JSON.stringify(payload), "utf-8");
  const kb = (fs.statSync(fp).size / 1024).toFixed(1);
  console.log(`  ${name.padEnd(24)} ${kb.padStart(8)} KB`);
}

function clean() {
  if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_ASSETS, { recursive: true });
}

function main() {
  console.log(`→ Building CMS data snapshot (BASE_PATH="${BASE_PATH}") …`);
  clean();

  writeJson("pages.json", readPages());
  writeJson("experts.json", readExperts());
  writeJson("testimonials.json", readTestimonials());
  writeJson("partnerships.json", readPartnerships());
  writeJson("partner-logos.json", readPartnerLogos());

  console.log(`  assets copied: ${copiedAssets.size}`);
  console.log(`✓ Snapshot → ${path.relative(process.cwd(), OUT_DIR)}`);
}

main();
