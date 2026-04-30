import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const CTAS_DIR = path.join(SITE_ROOT, "content", "ctas");

type Scope = "product" | "article" | "both";

function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

/** PUT /api/ctas/[id] — update CTA frontmatter */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { id } = await params;
  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const filePath = path.join(CTAS_DIR, `${id}.md`);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const now = new Date().toISOString();
  const fm: Record<string, unknown> = {
    id,
    name: typeof body.name === "string" ? body.name : "",
    scope: parseScope(body.scope),
    heading: typeof body.heading === "string" ? body.heading : "",
    body: typeof body.body === "string" ? body.body : "",
    buttonText: typeof body.buttonText === "string" ? body.buttonText : "",
    formId:
      typeof body.formId === "string" && body.formId
        ? body.formId
        : undefined,
    createdAt: typeof body.createdAt === "string" ? body.createdAt : now,
    updatedAt: now,
  };
  for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];

  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json({ ok: true, id, updatedAt: fm.updatedAt });
}

/** DELETE /api/ctas/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { id } = await params;
  const fs = await import("fs");

  const filePath = path.join(CTAS_DIR, `${id}.md`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return NextResponse.json({ ok: true });
}
