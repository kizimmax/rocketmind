import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseDataUrl, saveBuffer, deleteFilesWithBase, writeConfig, readConfig } from "@/lib/storage";
import { createAutoRedirect } from "@/lib/redirects";

export const dynamic = "force-dynamic";

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];
const AUDIO_EXTS = [".mp3", ".wav", ".ogg", ".m4a", ".webm"];

type Block = { id: string; type: string; enabled: boolean; order?: number; data: Record<string, unknown> };

function savePageAsset(category: string, slug: string, role: string, dataUrl: string): string | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  const dir = `pages/${category}/${slug}`;
  const exts = AUDIO_EXTS.some((e) => e === parsed.ext) ? AUDIO_EXTS : IMAGE_EXTS;
  deleteFilesWithBase(dir, role, exts);
  const { publicUrl } = saveBuffer(dir, `${role}${parsed.ext}`, parsed.buffer);
  return publicUrl;
}

function saveLogoCell(category: string, slug: string, cellId: string, dataUrl: string): string | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  const dir = `pages/${category}/${slug}/logos`;
  deleteFilesWithBase(dir, `cell-${cellId}`, IMAGE_EXTS);
  const { publicUrl } = saveBuffer(dir, `cell-${cellId}${parsed.ext}`, parsed.buffer);
  return publicUrl;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const url = pageId.startsWith("/") ? pageId : `/${pageId}`;

  const existing = await prisma.page.findUnique({ where: { url } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const page = await request.json();
  const blocks: Block[] = page.blocks ?? [];
  const block = (t: string) => blocks.find((b) => b.type === t);
  const enabled = (b: Block | undefined) => b?.enabled ? (b.data ?? {}) : null;

  const category = page.sectionId as string;
  const pageSlug = page.slug as string;

  // ── Extract custom sections ───��─────────────────────────────────────────��────
  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const customSections: Array<{ id: string; insertAfter: string | null; enabled: boolean; data: Record<string, unknown> }> = [];
  let lastBuiltinType: string | null = null;
  for (const b of sortedBlocks) {
    if (b.type === "customSection") {
      customSections.push({ id: b.id, insertAfter: lastBuiltinType, enabled: b.enabled !== false, data: b.data ?? {} });
    } else {
      lastBuiltinType = b.type;
    }
  }

  // ── Process hero images ──────────────────────────────────────────────────────
  const heroBlock = block("hero");
  if (heroBlock?.enabled && heroBlock.data) {
    const { heroImageData, audioData, ...cleanHero } = heroBlock.data;
    if (typeof heroImageData === "string" && heroImageData.startsWith("data:")) {
      const url = savePageAsset(category, pageSlug, "cover", heroImageData);
      if (url) cleanHero.heroImageData = url;
    } else if (typeof heroImageData === "string") {
      cleanHero.heroImageData = heroImageData;
    }
    if (typeof audioData === "string" && audioData.startsWith("data:")) {
      const url = savePageAsset(category, pageSlug, "audio", audioData);
      if (url) cleanHero.audioData = url;
    } else if (typeof audioData === "string") {
      cleanHero.audioData = audioData;
    }
    heroBlock.data = cleanHero;
  }

  const aboutBlock = block("about");
  if (aboutBlock?.enabled && aboutBlock.data) {
    const { aboutImageData, ...cleanAbout } = aboutBlock.data;
    if (typeof aboutImageData === "string" && aboutImageData.startsWith("data:")) {
      const url = savePageAsset(category, pageSlug, "about", aboutImageData);
      if (url) cleanAbout.aboutImageData = url;
    } else if (typeof aboutImageData === "string") {
      cleanAbout.aboutImageData = aboutImageData;
    }
    aboutBlock.data = cleanAbout;
  }

  // ── aboutRocketmind shared photos ───────────────────────────────────────────
  const aboutRmBlock = block("aboutRocketmind");
  if (aboutRmBlock?.data) {
    const d = aboutRmBlock.data;
    const { alexPhotoData, canvasPhotoData, ...cleanAboutRm } = d;
    const shared = readConfig<{ alexPhoto?: string; canvasPhoto?: string }>("about-rocketmind.json") ?? {};
    if (typeof alexPhotoData === "string" && alexPhotoData.startsWith("data:")) {
      const url = savePageAsset("about", "shared", "alexey-eremin", alexPhotoData);
      if (url) { shared.alexPhoto = url; cleanAboutRm.alexPhotoData = url; }
    }
    if (typeof canvasPhotoData === "string" && canvasPhotoData.startsWith("data:")) {
      const url = savePageAsset("about", "shared", "canvas-image", canvasPhotoData);
      if (url) { shared.canvasPhoto = url; cleanAboutRm.canvasPhotoData = url; }
    }
    if (alexPhotoData || canvasPhotoData) {
      writeConfig("about-rocketmind.json", shared);
      await prisma.systemConfig.upsert({ where: { key: "about-rocketmind" }, update: { value: shared as never }, create: { key: "about-rocketmind", value: shared as never } }).catch(() => {});
    }
    aboutRmBlock.data = cleanAboutRm;
  }

  // ── Projects logoGrid cells ──────────────────────────────────────────────────
  const projectsBlock = block("projects");
  if (projectsBlock?.enabled && projectsBlock.data) {
    const clean = { ...projectsBlock.data };
    const logoGrid = clean.logoGrid as { cells?: Array<{ id: string; src: string; alt?: string; size?: string }> } | undefined;
    if (logoGrid && Array.isArray(logoGrid.cells)) {
      clean.logoGrid = {
        cells: logoGrid.cells.map((cell) => {
          if (cell.src && cell.src.startsWith("data:")) {
            const url = saveLogoCell(category, pageSlug, cell.id, cell.src);
            if (url) return { ...cell, src: url };
          }
          return cell;
        }),
      };
    }
    projectsBlock.data = clean;
  }

  // ── Partnerships block → save to config ─────────────────────────────────────
  const partnershipsBlock = block("partnerships");
  if (partnershipsBlock?.enabled && partnershipsBlock.data) {
    const pData = partnershipsBlock.data;
    const logos: Array<{ src: string; alt: string }> = [];
    const rawLogos = (pData.logos as Array<{ src: string; alt: string }>) || [];
    for (let i = 0; i < rawLogos.length; i++) {
      const logo = rawLogos[i];
      if (logo.src && logo.src.startsWith("data:")) {
        const parsed = parseDataUrl(logo.src);
        if (parsed) {
          deleteFilesWithBase("partnerships", `logo-${i}`, IMAGE_EXTS);
          const { publicUrl } = saveBuffer("partnerships", `logo-${i}${parsed.ext}`, parsed.buffer);
          logos.push({ src: publicUrl, alt: logo.alt || "" });
        }
      } else {
        logos.push({ src: logo.src, alt: logo.alt || "" });
      }
    }
    const photos: Array<{ src: string; alt: string }> = [];
    const rawPhotos = (pData.photos as Array<{ src: string; alt?: string }>) || [];
    for (let i = 0; i < rawPhotos.length; i++) {
      const photo = rawPhotos[i];
      if (photo.src && photo.src.startsWith("data:")) {
        const parsed = parseDataUrl(photo.src);
        if (parsed) {
          deleteFilesWithBase("partnerships", `photo-${i + 1}`, IMAGE_EXTS);
          const { publicUrl } = saveBuffer("partnerships", `photo-${i + 1}${parsed.ext}`, parsed.buffer);
          photos.push({ src: publicUrl, alt: photo.alt || "" });
        }
      } else {
        photos.push({ src: photo.src, alt: photo.alt || "" });
      }
    }
    writeConfig("partnerships.json", { caption: pData.caption || "", title: pData.title || "", description: pData.description || "", logos, photos });
  }

  // ── Build content object (mirrors old frontmatter structure) ─────────────────
  const expertsBlock = block("experts");
  const expertsValue = expertsBlock?.enabled
    ? (Array.isArray(expertsBlock.data?.experts) ? expertsBlock.data.experts : [])
    : null;

  const content: Record<string, unknown> = {
    slug: pageSlug, category,
    expertProduct: typeof page.expertProduct === "boolean" ? page.expertProduct : null,
    caseType: page.caseType === "mini" ? "mini" : null,
    featured: typeof page.featured === "boolean" ? page.featured : null,
    showInMenu: typeof page.showInMenu === "boolean" ? page.showInMenu : null,
    showInFooter: typeof page.showInFooter === "boolean" ? page.showInFooter : null,
    formId: typeof page.formId === "string" && page.formId ? page.formId : null,
    order: typeof page.order === "number" ? page.order : null,
    caseCard: enabled(block("caseCard")),
    homeHero: enabled(block("homeHero")),
    methodology: enabled(block("methodology")),
    homeSections: enabled(block("homeSections")),
    hero: enabled(heroBlock),
    logoMarquee: block("logoMarquee")?.enabled === false ? false : null,
    about: enabled(aboutBlock),
    audience: enabled(block("audience")),
    contacts: enabled(block("contacts")),
    tools: enabled(block("tools")),
    results: enabled(block("results")),
    services: enabled(block("services")),
    process: enabled(block("process")),
    experts: expertsValue,
    aboutRocketmind: (() => {
      const b = block("aboutRocketmind");
      if (b?.enabled === false) return false;
      const d = (b?.data ?? {}) as Record<string, unknown>;
      return Object.keys(d).length > 0 ? d : null;
    })(),
    projects: enabled(projectsBlock),
    pageBottom: (() => {
      const b = block("pageBottom");
      if (!b || b.enabled === false) return false;
      const d = (b.data ?? {}) as Record<string, unknown>;
      const ctaId = typeof d.ctaId === "string" ? d.ctaId.trim() : "";
      return ctaId ? { ctaId } : true;
    })(),
    customSections: customSections.length > 0 ? customSections : null,
  };

  const newUrl = category === "unique" ? `/${pageSlug}` : `/${category}/${pageSlug}`;
  const urlChanged = existing.url !== newUrl;

  await prisma.page.update({
    where: { id: existing.id },
    data: {
      slug: pageSlug,
      url: newUrl,
      name: page.menuTitle || pageSlug,
      status: page.status || "published",
      sortOrder: typeof page.order === "number" ? page.order : existing.sortOrder,
      menuTitle: page.menuTitle ?? "",
      menuDescription: page.menuDescription ?? "",
      cardTitle: page.cardTitle ?? "",
      cardDescription: page.cardDescription ?? "",
      metaTitle: page.metaTitle ?? "",
      metaDescription: page.metaDescription ?? "",
      content: content as Prisma.InputJsonValue,
    },
  });

  if (urlChanged) {
    await createAutoRedirect(existing.url, newUrl, "page", existing.id);
  }

  return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      { error: err.message ?? "unknown error", name: err.name, stack: err.stack },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const url = pageId.startsWith("/") ? pageId : `/${pageId}`;

  const page = await prisma.page.findUnique({ where: { url } });
  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.page.delete({ where: { id: page.id } });
  return NextResponse.json({ ok: true });
}
