import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const CTAS_DIR = path.join(SITE_ROOT, "content", "ctas");

type Scope = "product" | "article" | "both";

function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
}

/** GET /api/ctas — list all CTA entities */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  if (!fs.existsSync(CTAS_DIR)) return NextResponse.json([]);

  const items = fs
    .readdirSync(CTAS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(CTAS_DIR, file), "utf-8");
        const { data } = matter(raw);
        const id = (data.id as string) || file.replace(/\.md$/, "");
        return {
          id,
          name: (data.name as string) || "",
          scope: parseScope(data.scope),
          heading: (data.heading as string) || "",
          body: (data.body as string) || "",
          buttonText: (data.buttonText as string) || "",
          formId: (data.formId as string) || undefined,
          createdAt: (data.createdAt as string) || "",
          updatedAt: (data.updatedAt as string) || "",
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return NextResponse.json(items);
}

/** POST /api/ctas — create a new CTA */
export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const body = await request.json();
  const id =
    typeof body.id === "string" && body.id.trim() ? body.id.trim() : null;
  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : "";
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id))
    return NextResponse.json({ error: "invalid id" }, { status: 400 });

  if (!fs.existsSync(CTAS_DIR)) fs.mkdirSync(CTAS_DIR, { recursive: true });

  const filePath = path.join(CTAS_DIR, `${id}.md`);
  if (fs.existsSync(filePath))
    return NextResponse.json({ error: "exists" }, { status: 409 });

  const now = new Date().toISOString();
  const fm: Record<string, unknown> = {
    id,
    name: name || id,
    scope: parseScope(body.scope),
    heading: "",
    body: "",
    buttonText: "оставить заявку",
    formId: undefined,
    createdAt: now,
    updatedAt: now,
  };
  for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];

  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json({ ...fm, formId: undefined }, { status: 201 });
}
