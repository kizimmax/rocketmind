import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const FORMS_DIR = path.join(SITE_ROOT, "content", "forms");

type Scope = "product" | "article" | "both";

function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

function parseFields(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: r.name !== false,
    email: r.email !== false,
    phone: r.phone === true,
    message: r.message === true,
  };
}

function parseChips(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    enabled: r.enabled === true,
    multi: r.multi === true,
    label: typeof r.label === "string" ? r.label : "",
  };
}

function parseSuccessGift(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const url = typeof r.url === "string" ? r.url.trim() : "";
  if (!url) return null;
  return {
    kind: r.kind === "file" ? "file" : "link",
    url,
    label: typeof r.label === "string" ? r.label : "",
  };
}

function parseConsent(raw: unknown) {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawLinks = Array.isArray(r.links) ? r.links : [];
  const links = rawLinks
    .map((item, i) => {
      if (!item || typeof item !== "object") return null;
      const li = item as Record<string, unknown>;
      const label = typeof li.label === "string" ? li.label : "";
      const url = typeof li.url === "string" ? li.url : "";
      if (!label || !url) return null;
      const id =
        typeof li.id === "string" && li.id ? li.id : `l${i}`;
      return { id, label, url };
    })
    .filter((l): l is { id: string; label: string; url: string } => l !== null);
  return {
    text: typeof r.text === "string" ? r.text : "",
    links,
  };
}

/** PUT /api/forms/[id] — update Form frontmatter */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { id } = await params;
  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const filePath = path.join(FORMS_DIR, `${id}.md`);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const now = new Date().toISOString();
  const fm = {
    id,
    name: typeof body.name === "string" ? body.name : "",
    scope: parseScope(body.scope),
    title: typeof body.title === "string" ? body.title : "",
    description: typeof body.description === "string" ? body.description : "",
    submitButtonText:
      typeof body.submitButtonText === "string" ? body.submitButtonText : "",
    successMessage:
      typeof body.successMessage === "string" ? body.successMessage : "",
    successGift: parseSuccessGift(body.successGift),
    fields: parseFields(body.fields),
    chips: parseChips(body.chips),
    consent: parseConsent(body.consent),
    createdAt: typeof body.createdAt === "string" ? body.createdAt : now,
    updatedAt: now,
  };

  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json({ ok: true, id, updatedAt: fm.updatedAt });
}

/** DELETE /api/forms/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { id } = await params;
  const fs = await import("fs");

  const filePath = path.join(FORMS_DIR, `${id}.md`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return NextResponse.json({ ok: true });
}
