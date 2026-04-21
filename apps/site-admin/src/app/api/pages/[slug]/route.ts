import { NextResponse } from "next/server";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

// ── File helpers ─────────────────────────────────────────────────────────────

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg",
  "image/webp": ".webp", "image/svg+xml": ".svg", "image/gif": ".gif",
  "audio/mpeg": ".mp3", "audio/mp3": ".mp3", "audio/wav": ".wav",
  "audio/ogg": ".ogg", "audio/mp4": ".m4a", "audio/x-m4a": ".m4a",
  "audio/webm": ".webm",
};

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];
const AUDIO_EXTS = [".mp3", ".wav", ".ogg", ".m4a", ".webm"];

function parseDataUrl(dataUrl: string): { ext: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const ext = MIME_TO_EXT[match[1]] || null;
  if (!ext) return null;
  return { ext, buffer: Buffer.from(match[2], "base64") };
}

/**
 * Delete all files matching `{basePath}{ext}` for given extensions.
 */
function deleteExisting(
  fs: typeof import("fs"),
  basePath: string,
  extensions: string[],
) {
  for (const ext of extensions) {
    const fp = basePath + ext;
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
}

/** Public-URL base for page assets. Unique pages live under /images/unique/<slug>/, everything else under /images/products/<category>/<slug>/. */
function assetUrlBase(category: string, slug: string): string {
  if (category === "unique") return `/images/unique/${slug}`;
  return `/images/products/${category}/${slug}`;
}

function assetDir(
  path: typeof import("path"),
  sitePublicDir: string,
  category: string,
  slug: string,
): string {
  if (category === "unique") return path.join(sitePublicDir, "images", "unique", slug);
  return path.join(sitePublicDir, "images", "products", category, slug);
}

/**
 * Save a base64 data URL as a file. Returns the public URL path.
 * Deletes any previous file for the same role (cover, about, audio).
 */
function saveAsset(
  fs: typeof import("fs"),
  path: typeof import("path"),
  sitePublicDir: string,
  category: string,
  slug: string,
  role: string,
  dataUrl: string,
): string | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const dir = assetDir(path, sitePublicDir, category, slug);
  fs.mkdirSync(dir, { recursive: true });

  const basePath = path.join(dir, role);
  const exts = AUDIO_EXTS.some((e) => e === parsed.ext) ? AUDIO_EXTS : IMAGE_EXTS;
  deleteExisting(fs, basePath, exts);

  fs.writeFileSync(basePath + parsed.ext, parsed.buffer);
  return `${assetUrlBase(category, slug)}/${role}${parsed.ext}`;
}

/**
 * Save a logo-grid cell image (role = "logos/cell-<id>"). Deletes previous file with same base name.
 */
function saveLogoCell(
  fs: typeof import("fs"),
  path: typeof import("path"),
  sitePublicDir: string,
  category: string,
  slug: string,
  cellId: string,
  dataUrl: string,
): string | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const logosDir = path.join(assetDir(path, sitePublicDir, category, slug), "logos");
  fs.mkdirSync(logosDir, { recursive: true });

  const basePath = path.join(logosDir, `cell-${cellId}`);
  deleteExisting(fs, basePath, IMAGE_EXTS);

  fs.writeFileSync(basePath + parsed.ext, parsed.buffer);
  return `${assetUrlBase(category, slug)}/logos/cell-${cellId}${parsed.ext}`;
}

// ── PUT ──────────────────────────────────────────────────────────────────────

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getAllContentDirs } = await import("@/lib/content-paths");

  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const page = await request.json();

  const parts = pageId.split("/");
  if (parts.length < 2) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const [sectionId, ...rest] = parts;
  const slug = rest.join("/");

  let filePath: string | null = null;
  for (const { sectionId: sid, dir } of getAllContentDirs()) {
    if (sid !== sectionId) continue;
    const fp = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fp)) { filePath = fp; break; }
  }
  if (!filePath) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Site public dir for saving assets
  const sitePublicDir = path.resolve(process.cwd(), "..", "site", "public");

  type Block = { id: string; type: string; enabled: boolean; order?: number; data: Record<string, unknown> };
  const blocks: Block[] = page.blocks ?? [];
  const block = (t: string) => blocks.find((b) => b.type === t);
  // Switch alone determines persistence: enabled → data (object as-is, even if partially filled), disabled → null.
  const enabled = (b: Block | undefined) => b?.enabled ? (b.data ?? {}) : null;

  // ── Extract custom sections and compute their position ──────────────────────
  // Each custom section's `insertAfter` = type of the nearest preceding built-in block
  // (null if it comes before any built-in). Relative order is preserved via array index.
  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const customSections: Array<{ id: string; insertAfter: string | null; enabled: boolean; data: Record<string, unknown> }> = [];
  {
    let lastBuiltinType: string | null = null;
    for (const b of sortedBlocks) {
      if (b.type === "customSection") {
        customSections.push({
          id: b.id,
          insertAfter: lastBuiltinType,
          enabled: b.enabled !== false,
          data: b.data ?? {},
        });
      } else {
        lastBuiltinType = b.type;
      }
    }
  }

  const category = page.sectionId as string;
  const pageSlug = page.slug as string;

  // ── Extract and save binary assets ──────────────────────────────────────────

  const heroBlock = block("hero");
  if (heroBlock?.enabled && heroBlock.data) {
    const { heroImageData, audioData, audioFilename, ...cleanHero } = heroBlock.data as Record<string, unknown>;

    if (typeof heroImageData === "string" && heroImageData.startsWith("data:")) {
      saveAsset(fs, path, sitePublicDir, category, pageSlug, "cover", heroImageData);
    }

    if (typeof audioData === "string" && audioData.startsWith("data:")) {
      saveAsset(fs, path, sitePublicDir, category, pageSlug, "audio", audioData);
    }

    heroBlock.data = cleanHero;
  }

  const aboutBlock = block("about");
  if (aboutBlock?.enabled && aboutBlock.data) {
    const { aboutImageData, ...cleanAbout } = aboutBlock.data as Record<string, unknown>;

    if (typeof aboutImageData === "string" && aboutImageData.startsWith("data:")) {
      saveAsset(fs, path, sitePublicDir, category, pageSlug, "about", aboutImageData);
    }

    aboutBlock.data = cleanAbout;
  }

  // ── About Rocketmind shared photos (global across all pages) ────────────────
  const aboutRmBlock = block("aboutRocketmind");
  if (aboutRmBlock?.data) {
    const d = aboutRmBlock.data as Record<string, unknown>;
    const alexData = typeof d.alexPhotoData === "string" ? d.alexPhotoData : null;
    const canvasData = typeof d.canvasPhotoData === "string" ? d.canvasPhotoData : null;

    const aboutDir = path.join(sitePublicDir, "images", "about");
    const jsonPath = path.join(path.resolve(process.cwd(), "..", "site", "content"), "_about-rocketmind.json");
    let shared: { alexPhoto?: string; canvasPhoto?: string } = {};
    if (fs.existsSync(jsonPath)) {
      try { shared = JSON.parse(fs.readFileSync(jsonPath, "utf-8")); } catch { /* ignore */ }
    }

    function saveAboutPhoto(role: string, dataUrl: string): string | null {
      const parsed = parseDataUrl(dataUrl);
      if (!parsed) return null;
      fs.mkdirSync(aboutDir, { recursive: true });
      // Delete any previous `role.<ext>` files
      for (const ext of IMAGE_EXTS) {
        const fp = path.join(aboutDir, role + ext);
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      }
      fs.writeFileSync(path.join(aboutDir, role + parsed.ext), parsed.buffer);
      return `/images/about/${role}${parsed.ext}`;
    }

    if (alexData && alexData.startsWith("data:")) {
      const url = saveAboutPhoto("alexey-eremin", alexData);
      if (url) shared.alexPhoto = url;
    }
    if (canvasData && canvasData.startsWith("data:")) {
      const url = saveAboutPhoto("canvas-image", canvasData);
      if (url) shared.canvasPhoto = url;
    }
    if (alexData || canvasData) {
      fs.writeFileSync(
        jsonPath,
        JSON.stringify(
          {
            alexPhoto: shared.alexPhoto || "/images/about/alexey-eremin.png",
            canvasPhoto: shared.canvasPhoto || "/images/about/canvas-image.png",
          },
          null,
          2,
        ),
        "utf-8",
      );
    }

    // Strip transient data-URL fields from block data before persisting to frontmatter
    const { alexPhotoData: _a, canvasPhotoData: _c, ...cleanAboutRm } = d;
    void _a; void _c;
    aboutRmBlock.data = cleanAboutRm;
  }

  // ── Projects block (about-clone with logoGrid; used on unique /about page) ──
  const projectsBlock = block("projects");
  if (projectsBlock?.enabled && projectsBlock.data) {
    const cleanProjects = { ...projectsBlock.data } as Record<string, unknown>;
    const logoGrid = cleanProjects.logoGrid as { cells?: Array<{ id: string; src: string; alt?: string; size?: string }> } | undefined;
    if (logoGrid && Array.isArray(logoGrid.cells)) {
      const persistedCells = logoGrid.cells.map((cell) => {
        if (cell.src && cell.src.startsWith("data:")) {
          const url = saveLogoCell(fs, path, sitePublicDir, category, pageSlug, cell.id, cell.src);
          if (url) return { ...cell, src: url };
        }
        return cell;
      });
      cleanProjects.logoGrid = { cells: persistedCells };
    }
    projectsBlock.data = cleanProjects;
  }

  // ── Build frontmatter ───────────────────────────────────────────────────────

  const expertsBlock = block("experts");
  // Switch authoritative: enabled → array (possibly empty); disabled → null.
  const expertsValue = expertsBlock?.enabled
    ? (Array.isArray(expertsBlock.data?.experts) ? expertsBlock.data.experts : [])
    : null;

  // ── Save shared partnerships block (if changed) ────────────────────────────
  const partnershipsBlock = block("partnerships");
  if (partnershipsBlock?.enabled && partnershipsBlock.data) {
    const pData = partnershipsBlock.data;
    const partnershipsDir = path.join(sitePublicDir, "images", "partnerships");
    fs.mkdirSync(partnershipsDir, { recursive: true });

    // Save logo images
    const logos: Array<{ src: string; alt: string }> = [];
    const rawLogos = (pData.logos as Array<{ src: string; alt: string }>) || [];
    for (let i = 0; i < rawLogos.length; i++) {
      const logo = rawLogos[i];
      if (logo.src && logo.src.startsWith("data:")) {
        const parsed = parseDataUrl(logo.src);
        if (parsed) {
          const filename = `logo-${i}${parsed.ext}`;
          for (const ext of IMAGE_EXTS) {
            const old = path.join(partnershipsDir, `logo-${i}${ext}`);
            if (fs.existsSync(old)) fs.unlinkSync(old);
          }
          fs.writeFileSync(path.join(partnershipsDir, filename), parsed.buffer);
          logos.push({ src: `/images/partnerships/${filename}`, alt: logo.alt || "" });
        }
      } else {
        logos.push({ src: logo.src, alt: logo.alt || "" });
      }
    }

    // Save photo images
    const photos: Array<{ src: string; alt: string }> = [];
    const rawPhotos = (pData.photos as Array<{ src: string; alt?: string }>) || [];
    for (let i = 0; i < rawPhotos.length; i++) {
      const photo = rawPhotos[i];
      if (photo.src && photo.src.startsWith("data:")) {
        const parsed = parseDataUrl(photo.src);
        if (parsed) {
          const filename = `photo-${i + 1}${parsed.ext}`;
          for (const ext of IMAGE_EXTS) {
            const old = path.join(partnershipsDir, `photo-${i + 1}${ext}`);
            if (fs.existsSync(old)) fs.unlinkSync(old);
          }
          fs.writeFileSync(path.join(partnershipsDir, filename), parsed.buffer);
          photos.push({ src: `/images/partnerships/${filename}`, alt: photo.alt || "" });
        }
      } else {
        photos.push({ src: photo.src, alt: photo.alt || "" });
      }
    }

    const sharedData = {
      caption: pData.caption || "",
      title: pData.title || "",
      description: pData.description || "",
      logos,
      photos,
    };
    const pJsonPath = path.join(path.resolve(process.cwd(), "..", "site", "content"), "_partnerships.json");
    fs.writeFileSync(pJsonPath, JSON.stringify(sharedData, null, 2), "utf-8");
  }

  const fm: Record<string, unknown> = {
    slug: pageSlug, category,
    menuTitle: page.menuTitle, menuDescription: page.menuDescription,
    cardTitle: page.cardTitle, cardDescription: page.cardDescription,
    metaTitle: page.metaTitle, metaDescription: page.metaDescription,
    expertProduct: typeof page.expertProduct === "boolean" ? page.expertProduct : null,
    caseType: page.caseType === "mini" || page.caseType === "big" ? page.caseType : null,
    featured: typeof page.featured === "boolean" ? page.featured : null,
    order: typeof page.order === "number" ? page.order : null,
    caseCard: enabled(block("caseCard")),
    homeHero: enabled(block("homeHero")),
    methodology: enabled(block("methodology")),
    homeSections: enabled(block("homeSections")),
    hero: enabled(heroBlock),
    // logoMarquee is auto-enabled by default; persist `false` only if disabled, otherwise omit (null)
    logoMarquee: block("logoMarquee")?.enabled === false ? false : null,
    about: enabled(aboutBlock),
    audience: enabled(block("audience")),
    contacts: enabled(block("contacts")),
    tools: enabled(block("tools")),
    results: enabled(block("results")),
    services: enabled(block("services")),
    process: enabled(block("process")),
    experts: expertsValue,
    // Enabled-by-default: store `false` to hide; otherwise object (custom data) or null (use defaults)
    aboutRocketmind: (() => {
      const b = block("aboutRocketmind");
      if (b?.enabled === false) return false;
      const d = (b?.data ?? {}) as Record<string, unknown>;
      return Object.keys(d).length > 0 ? d : null;
    })(),
    projects: enabled(projectsBlock),
    pageBottom: enabled(block("pageBottom")),
    customSections: customSections.length > 0 ? customSections : null,
    socialProof: null, duration: null, whyRocketmind: null, expert: null, cases: null, reviews: null,
  };

  const newPath = path.join(path.dirname(filePath), `${pageSlug}.md`);
  if (newPath !== filePath) fs.unlinkSync(filePath);
  fs.writeFileSync(newPath, matter.stringify("", fm), "utf-8");
  return NextResponse.json({ ok: true });
}

// ── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const { getAllContentDirs } = await import("@/lib/content-paths");

  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const parts = pageId.split("/");
  if (parts.length < 2) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const [sectionId, ...rest] = parts;
  const slug = rest.join("/");

  const siteRoot = path.resolve(process.cwd(), "..", "site");
  const archiveDir = path.join(siteRoot, "content", ".archive");

  for (const { sectionId: sid, dir } of getAllContentDirs()) {
    if (sid !== sectionId) continue;
    const fp = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fp)) {
      // Archive markdown
      const dest = path.join(archiveDir, sectionId, slug);
      fs.mkdirSync(dest, { recursive: true });
      fs.renameSync(fp, path.join(dest, `${slug}.md`));

      // Archive assets
      const sitePublicDir = path.join(siteRoot, "public");
      const assetDir = path.join(sitePublicDir, "images", "products", sectionId, slug);
      if (fs.existsSync(assetDir)) {
        const assetDest = path.join(dest, "assets");
        fs.mkdirSync(assetDest, { recursive: true });
        for (const f of fs.readdirSync(assetDir)) {
          fs.renameSync(path.join(assetDir, f), path.join(assetDest, f));
        }
        fs.rmSync(assetDir, { recursive: true, force: true });
      }

      return NextResponse.json({ ok: true });
    }
  }
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

export function generateStaticParams() {
  return [];
}
