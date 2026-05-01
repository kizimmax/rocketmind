import { prisma } from "./prisma";
import type { EntityScope } from "./ctas";

export type FormFieldsConfig = {
  name: boolean;
  email: boolean;
  phone: boolean;
  message: boolean;
};

export type FormChipsConfig = {
  enabled: boolean;
  multi: boolean;
  label: string;
};

export type FormConsentLink = {
  id: string;
  label: string;
  url: string;
};

export type FormConsentConfig = {
  text: string;
  links: FormConsentLink[];
};

export type FormSuccessGift = {
  kind: "file" | "link";
  url: string;
  label: string;
};

export type FormEntity = {
  id: string;
  name: string;
  scope: EntityScope;
  title: string;
  description: string;
  submitButtonText: string;
  successMessage: string;
  successGift?: FormSuccessGift | null;
  fields: FormFieldsConfig;
  chips: FormChipsConfig;
  consent: FormConsentConfig;
  createdAt: string;
  updatedAt: string;
};

function parseScope(value: unknown): EntityScope {
  return value === "product" || value === "article" || value === "both" ? value : "both";
}

function parseFields(raw: unknown): FormFieldsConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { name: r.name !== false, email: r.email !== false, phone: r.phone === true, message: r.message === true };
}

function parseChips(raw: unknown): FormChipsConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { enabled: r.enabled === true, multi: r.multi === true, label: typeof r.label === "string" ? r.label : "" };
}

function parseConsentLinks(raw: unknown): FormConsentLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i): FormConsentLink | null => {
      if (!item || typeof item !== "object") return null;
      const r = item as Record<string, unknown>;
      const label = typeof r.label === "string" ? r.label : "";
      const url = typeof r.url === "string" ? r.url : "";
      if (!label || !url) return null;
      return { id: typeof r.id === "string" && r.id ? r.id : `l${i}`, label, url };
    })
    .filter((l): l is FormConsentLink => l !== null);
}

function parseConsent(raw: unknown): FormConsentConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { text: typeof r.text === "string" ? r.text : "", links: parseConsentLinks(r.links) };
}

function parseSuccessGift(raw: unknown): FormSuccessGift | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const url = typeof r.url === "string" ? r.url.trim() : "";
  if (!url) return null;
  return { kind: r.kind === "file" ? "file" : "link", url, label: typeof r.label === "string" ? r.label : "" };
}

function rowToForm(row: { id: string; name: string; content: unknown; createdAt: Date; updatedAt: Date }): FormEntity {
  const c = (row.content && typeof row.content === "object" ? row.content : {}) as Record<string, unknown>;
  const slugId = typeof c.id === "string" && c.id ? c.id : row.id;
  return {
    id: slugId,
    name: row.name,
    scope: parseScope(c.scope),
    title: typeof c.title === "string" ? c.title : "",
    description: typeof c.description === "string" ? c.description : "",
    submitButtonText: typeof c.submitButtonText === "string" ? c.submitButtonText : "",
    successMessage: typeof c.successMessage === "string" ? c.successMessage : "",
    successGift: parseSuccessGift(c.successGift),
    fields: parseFields(c.fields),
    chips: parseChips(c.chips),
    consent: parseConsent(c.consent),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getAllForms(): Promise<FormEntity[]> {
  try {
    const rows = await prisma.formEntity.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(rowToForm);
  } catch {
    return [];
  }
}

export async function getFormById(id: string): Promise<FormEntity | null> {
  try {
    const byContentId = await prisma.formEntity.findFirst({
      where: { content: { path: ["id"], equals: id } },
    });
    if (byContentId) return rowToForm(byContentId);
    const byDbId = await prisma.formEntity.findUnique({ where: { id } }).catch(() => null);
    if (byDbId) return rowToForm(byDbId);
    return null;
  } catch {
    return null;
  }
}
