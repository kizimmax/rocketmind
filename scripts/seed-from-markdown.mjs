#!/usr/bin/env node
/**
 * Seed Postgres from markdown/JSON content in apps/site/content/.
 * One-shot migration: read all CMS content → Prisma upsert.
 *
 * Run AFTER managed Postgres is provisioned and DATABASE_URL is set.
 *
 *   DATABASE_URL=postgresql://... \
 *   ADMIN_INITIAL_PASSWORD=... \
 *   ADMIN_INITIAL_LOGIN=admin \
 *   node scripts/seed-from-markdown.mjs
 *
 * Идемпотентен: повторный запуск upsert'ит существующие записи.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SITE_CONTENT = path.join(ROOT, "apps", "site", "content");

const prisma = new PrismaClient();

// ── helpers ──────────────────────────────────────────────────────────────────

function readMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const full = path.join(dir, f);
      const raw = fs.readFileSync(full, "utf-8");
      const parsed = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        frontmatter: parsed.data,
        body: parsed.content,
      };
    });
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ── seeders ──────────────────────────────────────────────────────────────────

async function seedAdminUser() {
  const login = process.env.ADMIN_INITIAL_LOGIN || "admin";
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password) {
    console.warn("⚠ ADMIN_INITIAL_PASSWORD не задан — админ не создан");
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { login },
    update: {},
    create: {
      login,
      password: hash,
      firstName: "Admin",
      lastName: "Rocketmind",
      role: "ADMIN",
    },
  });
  console.log(`✔ User '${login}' (ADMIN)`);
}

async function seedPages() {
  const sections = ["products", "academy", "ai-products", "cases", "unique"];
  let count = 0;
  for (const section of sections) {
    const files = readMdFiles(path.join(SITE_CONTENT, section));
    for (const { slug, frontmatter } of files) {
      const url = section === "unique" ? `/${slug}` : `/${section}/${slug}`;
      await prisma.page.upsert({
        where: { url },
        update: {
          name: frontmatter.title || slug,
          content: frontmatter,
          status: frontmatter.status || "published",
          sortOrder: frontmatter.sortOrder ?? 0,
          menuTitle: frontmatter.menuTitle || "",
          menuDescription: frontmatter.menuDescription || "",
          cardTitle: frontmatter.cardTitle || "",
          cardDescription: frontmatter.cardDescription || "",
          metaTitle: frontmatter.metaTitle || "",
          metaDescription: frontmatter.metaDescription || "",
        },
        create: {
          slug,
          url,
          category: section,
          name: frontmatter.title || slug,
          content: frontmatter,
          status: frontmatter.status || "published",
          sortOrder: frontmatter.sortOrder ?? 0,
          menuTitle: frontmatter.menuTitle || "",
          menuDescription: frontmatter.menuDescription || "",
          cardTitle: frontmatter.cardTitle || "",
          cardDescription: frontmatter.cardDescription || "",
          metaTitle: frontmatter.metaTitle || "",
          metaDescription: frontmatter.metaDescription || "",
        },
      });
      count++;
    }
  }
  console.log(`✔ Pages: ${count}`);
}

async function seedArticles() {
  const files = readMdFiles(path.join(SITE_CONTENT, "media"));
  let count = 0;
  for (const { slug, frontmatter, body } of files) {
    await prisma.article.upsert({
      where: { slug },
      update: {
        title: frontmatter.title || slug,
        type: frontmatter.type || "default",
        status: frontmatter.status || "published",
        description: frontmatter.description || "",
        content: { ...frontmatter, body },
        coverPath: frontmatter.cover || frontmatter.coverPath || null,
        expertSlug: frontmatter.expert || frontmatter.expertSlug || null,
        publishedAt: frontmatter.publishedAt || frontmatter.date || "",
        tagIds: frontmatter.tags || frontmatter.tagIds || [],
        pinned: !!frontmatter.pinned,
        pinnedOrder: frontmatter.pinnedOrder ?? 0,
        featured: !!frontmatter.featured,
        cardVariant: frontmatter.cardVariant || "default",
        metaTitle: frontmatter.metaTitle || "",
        metaDescription: frontmatter.metaDescription || "",
      },
      create: {
        slug,
        title: frontmatter.title || slug,
        type: frontmatter.type || "default",
        status: frontmatter.status || "published",
        description: frontmatter.description || "",
        content: { ...frontmatter, body },
        coverPath: frontmatter.cover || frontmatter.coverPath || null,
        expertSlug: frontmatter.expert || frontmatter.expertSlug || null,
        publishedAt: frontmatter.publishedAt || frontmatter.date || "",
        tagIds: frontmatter.tags || frontmatter.tagIds || [],
        pinned: !!frontmatter.pinned,
        pinnedOrder: frontmatter.pinnedOrder ?? 0,
        featured: !!frontmatter.featured,
        cardVariant: frontmatter.cardVariant || "default",
        metaTitle: frontmatter.metaTitle || "",
        metaDescription: frontmatter.metaDescription || "",
      },
    });
    count++;
  }
  console.log(`✔ Articles: ${count}`);
}

async function seedGlossary() {
  const files = readMdFiles(path.join(SITE_CONTENT, "glossary"));
  let count = 0;
  for (const { slug, frontmatter, body } of files) {
    await prisma.glossaryTerm.upsert({
      where: { slug },
      update: {
        title: frontmatter.title || slug,
        status: frontmatter.status || "published",
        description: frontmatter.description || "",
        content: { ...frontmatter, body },
        tagIds: frontmatter.tags || frontmatter.tagIds || [],
        metaTitle: frontmatter.metaTitle || "",
        metaDescription: frontmatter.metaDescription || "",
      },
      create: {
        slug,
        title: frontmatter.title || slug,
        status: frontmatter.status || "published",
        description: frontmatter.description || "",
        content: { ...frontmatter, body },
        tagIds: frontmatter.tags || frontmatter.tagIds || [],
        metaTitle: frontmatter.metaTitle || "",
        metaDescription: frontmatter.metaDescription || "",
      },
    });
    count++;
  }
  console.log(`✔ GlossaryTerms: ${count}`);
}

async function seedExperts() {
  const files = readMdFiles(path.join(SITE_CONTENT, "experts"));
  let count = 0;
  for (const { slug, frontmatter, body } of files) {
    await prisma.expert.upsert({
      where: { slug },
      update: {
        content: { ...frontmatter, body },
        photoPath: frontmatter.photo || frontmatter.photoPath || null,
        sortOrder: frontmatter.sortOrder ?? 0,
      },
      create: {
        slug,
        content: { ...frontmatter, body },
        photoPath: frontmatter.photo || frontmatter.photoPath || null,
        sortOrder: frontmatter.sortOrder ?? 0,
      },
    });
    count++;
  }
  console.log(`✔ Experts: ${count}`);
}

async function seedCtas() {
  const files = readMdFiles(path.join(SITE_CONTENT, "ctas"));
  let count = 0;
  for (const { slug, frontmatter, body } of files) {
    const existing = await prisma.ctaEntity.findFirst({
      where: { name: frontmatter.name || slug },
    });
    const data = {
      name: frontmatter.name || slug,
      content: { ...frontmatter, body },
    };
    if (existing) {
      await prisma.ctaEntity.update({ where: { id: existing.id }, data });
    } else {
      await prisma.ctaEntity.create({ data });
    }
    count++;
  }
  console.log(`✔ CTAs: ${count}`);
}

async function seedForms() {
  const files = readMdFiles(path.join(SITE_CONTENT, "forms"));
  let count = 0;
  for (const { slug, frontmatter, body } of files) {
    const existing = await prisma.formEntity.findFirst({
      where: { name: frontmatter.name || slug },
    });
    const data = {
      name: frontmatter.name || slug,
      content: { ...frontmatter, body },
    };
    if (existing) {
      await prisma.formEntity.update({ where: { id: existing.id }, data });
    } else {
      await prisma.formEntity.create({ data });
    }
    count++;
  }
  console.log(`✔ Forms: ${count}`);
}

async function seedTestimonials() {
  const json = readJson(path.join(SITE_CONTENT, "_testimonials.json"));
  if (!json || !Array.isArray(json.items || json)) {
    console.log("✔ Testimonials: 0 (no _testimonials.json)");
    return;
  }
  const items = json.items || json;
  let count = 0;
  for (const t of items) {
    const data = {
      content: t,
      avatarPath: t.avatar || t.avatarPath || null,
      sortOrder: t.sortOrder ?? count,
    };
    if (t.id) {
      await prisma.testimonial.upsert({
        where: { id: t.id },
        update: data,
        create: { id: t.id, ...data },
      });
    } else {
      await prisma.testimonial.create({ data });
    }
    count++;
  }
  console.log(`✔ Testimonials: ${count}`);
}

async function seedMediaTags() {
  const tagsPath = path.join(SITE_CONTENT, "media", "_tags.json");
  const json = readJson(tagsPath);
  if (!json) {
    console.log("✔ MediaTags: 0 (no _tags.json)");
    return;
  }
  const items = Array.isArray(json) ? json : json.items || [];
  let count = 0;
  for (const t of items) {
    if (!t.id) continue;
    await prisma.mediaTag.upsert({
      where: { id: t.id },
      update: {
        label: t.label || t.id,
        disabled: !!t.disabled,
        system: !!t.system,
        cardColor: t.cardColor || null,
        seo: t.seo || null,
      },
      create: {
        id: t.id,
        label: t.label || t.id,
        disabled: !!t.disabled,
        system: !!t.system,
        cardColor: t.cardColor || null,
        seo: t.seo || null,
      },
    });
    count++;
  }
  console.log(`✔ MediaTags: ${count}`);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("→ Seeding Postgres from apps/site/content/...");
  await seedAdminUser();
  await seedMediaTags();
  await seedPages();
  await seedArticles();
  await seedGlossary();
  await seedExperts();
  await seedCtas();
  await seedForms();
  await seedTestimonials();
  console.log("✔ Done");
}

main()
  .catch((e) => {
    console.error("✗ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
