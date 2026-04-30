import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type EntityScope = "product" | "article" | "both";

export type CtaEntity = {
  id: string;
  name: string;
  scope: EntityScope;
  heading: string;
  body: string;
  buttonText: string;
  formId?: string;
  createdAt: string;
  updatedAt: string;
};

const CTAS_DIR = path.join(process.cwd(), "content", "ctas");

function parseScope(value: unknown): EntityScope {
  return value === "product" || value === "article" || value === "both"
    ? value
    : "both";
}

function readCta(filePath: string): CtaEntity | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const id = typeof data.id === "string" && data.id ? data.id : null;
    if (!id) return null;
    return {
      id,
      name: typeof data.name === "string" ? data.name : "",
      scope: parseScope(data.scope),
      heading: typeof data.heading === "string" ? data.heading : "",
      body: typeof data.body === "string" ? data.body : "",
      buttonText: typeof data.buttonText === "string" ? data.buttonText : "",
      formId:
        typeof data.formId === "string" && data.formId
          ? data.formId
          : undefined,
      createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function getAllCtas(): CtaEntity[] {
  if (!fs.existsSync(CTAS_DIR)) return [];
  return fs
    .readdirSync(CTAS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => readCta(path.join(CTAS_DIR, f)))
    .filter((c): c is CtaEntity => c !== null);
}

export function getCtaById(id: string): CtaEntity | null {
  const file = path.join(CTAS_DIR, `${id}.md`);
  if (!fs.existsSync(file)) return null;
  return readCta(file);
}
