import fs from "fs";
import path from "path";
import matter from "gray-matter";
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

const FORMS_DIR = path.join(process.cwd(), "content", "forms");

function parseScope(value: unknown): EntityScope {
  return value === "product" || value === "article" || value === "both"
    ? value
    : "both";
}

function parseFields(raw: unknown): FormFieldsConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: r.name !== false,
    email: r.email !== false,
    phone: r.phone === true,
    message: r.message === true,
  };
}

function parseChips(raw: unknown): FormChipsConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    enabled: r.enabled === true,
    multi: r.multi === true,
    label: typeof r.label === "string" ? r.label : "",
  };
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
      const id = typeof r.id === "string" && r.id ? r.id : `l${i}`;
      return { id, label, url };
    })
    .filter((l): l is FormConsentLink => l !== null);
}

function parseSuccessGift(raw: unknown): FormSuccessGift | null {
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

function parseConsent(raw: unknown): FormConsentConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    text: typeof r.text === "string" ? r.text : "",
    links: parseConsentLinks(r.links),
  };
}

function readForm(filePath: string): FormEntity | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const id = typeof data.id === "string" && data.id ? data.id : null;
    if (!id) return null;
    return {
      id,
      name: typeof data.name === "string" ? data.name : "",
      scope: parseScope(data.scope),
      title: typeof data.title === "string" ? data.title : "",
      description: typeof data.description === "string" ? data.description : "",
      submitButtonText:
        typeof data.submitButtonText === "string"
          ? data.submitButtonText
          : "",
      successMessage:
        typeof data.successMessage === "string" ? data.successMessage : "",
      successGift: parseSuccessGift(data.successGift),
      fields: parseFields(data.fields),
      chips: parseChips(data.chips),
      consent: parseConsent(data.consent),
      createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function getAllForms(): FormEntity[] {
  if (!fs.existsSync(FORMS_DIR)) return [];
  return fs
    .readdirSync(FORMS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => readForm(path.join(FORMS_DIR, f)))
    .filter((f): f is FormEntity => f !== null);
}

export function getFormById(id: string): FormEntity | null {
  const file = path.join(FORMS_DIR, `${id}.md`);
  if (!fs.existsSync(file)) return null;
  return readForm(file);
}
