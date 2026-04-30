import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const FORMS_DIR = path.join(SITE_ROOT, "content", "forms");

type Scope = "product" | "article" | "both";

function parseScope(v: unknown): Scope {
  return v === "product" || v === "article" || v === "both" ? v : "both";
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

const DEFAULT_FIELDS = { name: true, email: true, phone: false, message: true };
const DEFAULT_CHIPS = { enabled: false, multi: false, label: "Тема обращения" };
const DEFAULT_CONSENT = {
  text: "Я соглашаюсь с {links} и даю согласие на обработку персональных данных.",
  links: [],
};

/** GET /api/forms — list all Form entities */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  if (!fs.existsSync(FORMS_DIR)) return NextResponse.json([]);

  const items = fs
    .readdirSync(FORMS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(FORMS_DIR, file), "utf-8");
        const { data } = matter(raw);
        const id = (data.id as string) || file.replace(/\.md$/, "");
        return {
          id,
          name: (data.name as string) || "",
          scope: parseScope(data.scope),
          title: (data.title as string) || "",
          description: (data.description as string) || "",
          submitButtonText: (data.submitButtonText as string) || "",
          successMessage: (data.successMessage as string) || "",
          successGift: parseSuccessGift(data.successGift),
          fields: { ...DEFAULT_FIELDS, ...(data.fields as object) },
          chips: { ...DEFAULT_CHIPS, ...(data.chips as object) },
          consent: { ...DEFAULT_CONSENT, ...(data.consent as object) },
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

/** POST /api/forms — create a new Form */
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

  if (!fs.existsSync(FORMS_DIR)) fs.mkdirSync(FORMS_DIR, { recursive: true });

  const filePath = path.join(FORMS_DIR, `${id}.md`);
  if (fs.existsSync(filePath))
    return NextResponse.json({ error: "exists" }, { status: 409 });

  const now = new Date().toISOString();
  const fm = {
    id,
    name: name || id,
    scope: parseScope(body.scope),
    title: "",
    description: "",
    submitButtonText: "Отправить",
    successMessage:
      "Спасибо! Мы получили заявку и свяжемся с вами в ближайшее время.",
    successGift: null,
    fields: DEFAULT_FIELDS,
    chips: DEFAULT_CHIPS,
    consent: DEFAULT_CONSENT,
    createdAt: now,
    updatedAt: now,
  };

  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json(fm, { status: 201 });
}
