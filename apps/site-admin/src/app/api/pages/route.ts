import { NextResponse } from "next/server";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

// ── Asset resolution helpers ─────────────────────────────────────────────────

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];
const AUDIO_EXTS = [".mp3", ".wav", ".ogg", ".m4a", ".webm"];

/** Returns disk dir + public-URL base for page assets, split by category. */
function assetPaths(
  path: typeof import("path"),
  publicDir: string,
  category: string,
  slug: string,
): { dir: string; base: string } {
  if (category === "unique") {
    return {
      dir: path.join(publicDir, "images", "unique", slug),
      base: `/images/unique/${slug}`,
    };
  }
  return {
    dir: path.join(publicDir, "images", "products", category, slug),
    base: `/images/products/${category}/${slug}`,
  };
}

function resolveAsset(
  fs: typeof import("fs"),
  path: typeof import("path"),
  publicDir: string,
  category: string,
  slug: string,
  role: string,
  extensions: string[],
): string | null {
  const { dir, base } = assetPaths(path, publicDir, category, slug);
  for (const ext of extensions) {
    const fp = path.join(dir, role + ext);
    if (fs.existsSync(fp)) return `${base}/${role}${ext}`;
  }
  return null;
}

/** Read an asset file and return as base64 data URL for inline display in admin. */
function resolveAssetAsDataUrl(
  fs: typeof import("fs"),
  path: typeof import("path"),
  publicDir: string,
  category: string,
  slug: string,
  role: string,
  extensions: string[],
): string | null {
  const MIME: Record<string, string> = {
    ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  };
  const { dir } = assetPaths(path, publicDir, category, slug);
  for (const ext of extensions) {
    const fp = path.join(dir, role + ext);
    if (fs.existsSync(fp)) {
      const buf = fs.readFileSync(fp);
      const mime = MIME[ext] || "application/octet-stream";
      return `data:${mime};base64,${buf.toString("base64")}`;
    }
  }
  return null;
}

function readFileAsDataUrl(fs: typeof import("fs"), path: typeof import("path"), publicDir: string, publicUrl: string): string | null {
  if (!publicUrl || publicUrl.startsWith("data:")) return publicUrl || null;
  const fp = path.join(publicDir, publicUrl);
  if (!fs.existsSync(fp)) return null;
  const MIME: Record<string, string> = {
    ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  };
  const ext = path.extname(fp).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(fp).toString("base64")}`;
}

export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getAllContentDirs } = await import("@/lib/content-paths");
  const { DEFAULT_BLOCK_TYPES } = await import("@/lib/constants");

  const sitePublicDir = path.resolve(process.cwd(), "..", "site", "public");
  const pages: unknown[] = [];

  for (const { sectionId, dir } of getAllContentDirs()) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".md") && !f.startsWith("_"));
    files.forEach((file: string, index: number) => {
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data } = matter(raw);
        if (!data.slug) return;

        // Resolve static asset URLs for this page
        const coverUrl = resolveAssetAsDataUrl(fs, path, sitePublicDir, data.category || sectionId, data.slug, "cover", IMAGE_EXTS);
        const aboutUrl = resolveAssetAsDataUrl(fs, path, sitePublicDir, data.category || sectionId, data.slug, "about", IMAGE_EXTS);
        const audioUrl = resolveAsset(fs, path, sitePublicDir, data.category || sectionId, data.slug, "audio", AUDIO_EXTS);

        const blockTypesForSection: string[] = sectionId === "unique"
          ? (data.slug === "home"
              ? ["homeHero", "methodology", "homeSections"]
              : data.slug === "cases-index"
              ? ["hero", "about"]
              : ["hero", "about", "tools", "projects", "process", "experts", "aboutRocketmind", "contacts", "pageBottom"])
          : sectionId === "cases"
          ? (data.caseType === "mini"
              ? ["caseCard"]
              : ["caseCard", "hero", "about", "pageBottom"])
          : DEFAULT_BLOCK_TYPES;
        const blocks = blockTypesForSection.map((type: string, i: number) => {
          let blockData: Record<string, unknown> = {};
          let enabled = true;
          switch (type) {
            case "hero":
              blockData = data.hero || {};
              enabled = !!data.hero;
              // Inject static file URLs so admin UI can display them
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
              const p = data.projects as Record<string, unknown> | undefined;
              if (p && typeof p === "object") {
                blockData = p;
                // Resolve logoGrid cell src (file paths) to data URLs for admin display
                const lg = blockData.logoGrid as { cells?: Array<{ id: string; src: string; alt?: string; size?: string }> } | undefined;
                if (lg && Array.isArray(lg.cells)) {
                  const cells = lg.cells.map((c) => {
                    const dataUrl = readFileAsDataUrl(fs, path, sitePublicDir, c.src);
                    return dataUrl ? { ...c, src: dataUrl } : c;
                  });
                  blockData = { ...blockData, logoGrid: { cells } };
                }
              } else { enabled = false; }
              break;
            }
            case "audience": if (data.audience) blockData = data.audience; else enabled = false; break;
            case "contacts": if (data.contacts) blockData = data.contacts; else enabled = false; break;
            case "tools": if (data.tools) blockData = data.tools; else enabled = false; break;
            case "results": if (data.results) blockData = data.results; else enabled = false; break;
            case "process": if (data.process) blockData = data.process; else enabled = false; break;
            case "services": if (data.services) blockData = data.services; else enabled = false; break;
            case "experts": {
              const arr = data.experts as unknown[] | null | undefined;
              if (Array.isArray(arr)) {
                // Field present (even empty array) → user has explicit on-state
                blockData = { experts: arr };
                enabled = true;
              } else {
                // Field missing/null → use section default
                blockData = { experts: [] };
                enabled = sectionId === "academy";
              }
              break;
            }
            case "partnerships": {
              // Shared block — load from _partnerships.json, resolve images to data URLs
              const pFile = path.join(path.resolve(process.cwd(), "..", "site", "content"), "_partnerships.json");
              if (fs.existsSync(pFile)) {
                try {
                  const pRaw = JSON.parse(fs.readFileSync(pFile, "utf-8"));
                  const MIME: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
                  function resolveImg(src: string): string {
                    if (!src || src.startsWith("data:")) return src;
                    const fp = path.join(sitePublicDir, src);
                    if (!fs.existsSync(fp)) return src;
                    const ext = path.extname(fp).toLowerCase();
                    const mime = MIME[ext] || "application/octet-stream";
                    return `data:${mime};base64,${fs.readFileSync(fp).toString("base64")}`;
                  }
                  blockData = {
                    caption: pRaw.caption || "",
                    title: pRaw.title || "",
                    description: pRaw.description || "",
                    logos: (pRaw.logos || []).map((l: { src: string; alt: string }) => ({ src: resolveImg(l.src), alt: l.alt || "" })),
                    photos: (pRaw.photos || []).map((p: { src: string; alt?: string }) => ({ src: resolveImg(p.src), alt: p.alt || "" })),
                  };
                } catch { /* skip */ }
              }
              // Only enable for academy pages by default
              enabled = sectionId === "academy";
              break;
            }
            case "aboutRocketmind": {
              // Enabled-by-default block (rendered with defaults if no custom data).
              // Frontmatter stores `false` only to explicitly hide on site.
              enabled = data.aboutRocketmind !== false;
              blockData = data.aboutRocketmind && typeof data.aboutRocketmind === "object"
                ? data.aboutRocketmind
                : {};
              // Inject current shared photos (from _about-rocketmind.json) as data URLs for preview
              try {
                const jsonPath = path.join(path.resolve(process.cwd(), "..", "site", "content"), "_about-rocketmind.json");
                const shared = fs.existsSync(jsonPath)
                  ? JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
                  : { alexPhoto: "/images/about/alexey-eremin.png", canvasPhoto: "/images/about/canvas-image.png" };
                const alexData = readFileAsDataUrl(fs, path, sitePublicDir, shared.alexPhoto || "");
                const canvasData = readFileAsDataUrl(fs, path, sitePublicDir, shared.canvasPhoto || "");
                if (alexData) blockData = { ...blockData, alexPhotoData: alexData };
                if (canvasData) blockData = { ...blockData, canvasPhotoData: canvasData };
              } catch { /* ignore */ }
              break;
            }
            case "logoMarquee":
              // Auto-block: enabled by default; only disabled if frontmatter explicitly stores false
              enabled = data.logoMarquee !== false;
              break;
            case "pageBottom": enabled = !!data.pageBottom; if (data.pageBottom) blockData = data.pageBottom; break;
            case "homeHero":
              if (data.homeHero && typeof data.homeHero === "object") {
                blockData = data.homeHero;
                enabled = true;
              } else {
                enabled = false;
              }
              break;
            case "methodology":
              if (data.methodology && typeof data.methodology === "object") {
                blockData = data.methodology;
                enabled = true;
              } else {
                enabled = false;
              }
              break;
            case "homeSections":
              if (data.homeSections && typeof data.homeSections === "object") {
                blockData = data.homeSections;
                enabled = true;
              } else {
                enabled = false;
              }
              break;
            case "caseCard":
              if (data.caseCard && typeof data.caseCard === "object") {
                blockData = data.caseCard;
                enabled = true;
              } else {
                enabled = false;
              }
              break;
          }
          return { id: `${data.slug}_${type}`, type, enabled, order: i, data: blockData };
        });

        // ── Merge in custom sections (user-inserted between built-ins) ─────────
        const customSections = Array.isArray(data.customSections) ? data.customSections : [];
        const finalBlocks: Array<{ id: string; type: string; enabled: boolean; order: number; data: Record<string, unknown> }> = [];
        for (const b of blocks) {
          finalBlocks.push(b);
          for (const cs of customSections) {
            if (cs && typeof cs === "object" && cs.insertAfter === b.type) {
              finalBlocks.push({
                id: typeof cs.id === "string" ? cs.id : `cs_${Math.random().toString(36).slice(2, 9)}`,
                type: "customSection",
                enabled: cs.enabled !== false,
                order: 0, // renumbered below
                data: (cs.data && typeof cs.data === "object" ? cs.data : {}) as Record<string, unknown>,
              });
            }
          }
        }
        // Handle customs inserted before any built-in (insertAfter = null / "")
        const preBlocks = customSections.filter(
          (cs: { insertAfter?: unknown }) =>
            cs && typeof cs === "object" && (cs.insertAfter === null || cs.insertAfter === "" || cs.insertAfter === undefined),
        );
        for (let i = preBlocks.length - 1; i >= 0; i--) {
          const cs = preBlocks[i];
          finalBlocks.unshift({
            id: typeof cs.id === "string" ? cs.id : `cs_${Math.random().toString(36).slice(2, 9)}`,
            type: "customSection",
            enabled: cs.enabled !== false,
            order: 0,
            data: (cs.data && typeof cs.data === "object" ? cs.data : {}) as Record<string, unknown>,
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
      } catch { /* skip */ }
    });
  }
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getContentDir } = await import("@/lib/content-paths");

  const body = await request.json();
  const { sectionId, slug, menuTitle, caseType } = body;
  const dir = getContentDir(sectionId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.md`);
  if (fs.existsSync(filePath)) return NextResponse.json({ error: "exists" }, { status: 409 });

  const captions: Record<string, string> = {
    consulting: "консалтинг и стратегии", academy: "онлайн-школа",
    "ai-products": "ии-продукты", cases: "кейсы", media: "медиа",
  };

  let fm: Record<string, unknown>;
  if (sectionId === "cases") {
    const isMini = caseType === "mini";
    fm = {
      slug, category: "cases",
      caseType: isMini ? "mini" : "big",
      featured: false,
      order: 0,
      menuTitle, menuDescription: "",
      cardTitle: menuTitle, cardDescription: "",
      metaTitle: `${menuTitle} | Rocketmind`, metaDescription: "",
      caseCard: {
        title: menuTitle,
        description: "",
        stats: [
          { value: "", label: "", description: "" },
          { value: "", label: "", description: "" },
          { value: "", label: "", description: "" },
        ],
        result: "",
      },
      // Big cases also get a hero/about/pageBottom for the future internal page
      hero: isMini ? null : { caption: "кейс", title: menuTitle.toUpperCase(), description: "", ctaText: "обсудить проект", factoids: [] },
      about: null, pageBottom: null,
    };
  } else {
    fm = {
      slug, category: sectionId, menuTitle, menuDescription: "",
      cardTitle: menuTitle, cardDescription: "",
      metaTitle: `${menuTitle} | Rocketmind`, metaDescription: "",
      hero: { caption: captions[sectionId] || sectionId, title: menuTitle.toUpperCase(), description: "", ctaText: "оставить заявку", factoids: [] },
      about: null, audience: null, results: null, process: null, experts: null,
      socialProof: null, tools: null, duration: null, whyRocketmind: null, expert: null, cases: null, reviews: null,
    };
  }
  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");
  return NextResponse.json({
    id: `${sectionId}/${slug}`, sectionId, slug,
    status: "published", order: 0,
    menuTitle, menuDescription: "",
    cardTitle: menuTitle, cardDescription: "",
    metaTitle: `${menuTitle} | Rocketmind`, metaDescription: "",
    caseType: sectionId === "cases" ? (caseType === "mini" ? "mini" : "big") : undefined,
    featured: sectionId === "cases" ? false : undefined,
    blocks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, { status: 201 });
}
