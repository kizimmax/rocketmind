/**
 * Hardcoded section tree for the permission system (saas-admin variant).
 *
 * - `id` is a path token (no dots). Full path = parent.path + "." + id.
 * - `refinable: true` means: in addition to static children defined here,
 *   the admin UI may load real entities from the DB to grant per-item
 *   access (e.g. specific agents inside a program).
 * - Leaf nodes without `children` and without `refinable` get a single
 *   VIEW/EDIT checkbox in the UI.
 */

export type SectionKind =
  | "ai-agent"
  | "program";

export interface SectionDef {
  id: string;
  label: string;
  /** Backing entity kind for dynamic child loading. */
  kind?: SectionKind;
  /** Static sub-sections. */
  children?: SectionDef[];
  /** UI may load entities of `kind` as additional children at runtime. */
  refinable?: boolean;
}

export const SECTIONS: SectionDef[] = [
  {
    id: "ai-agents",
    label: "AI-эксперты",
    kind: "ai-agent",
    refinable: true,
  },
  {
    id: "programs",
    label: "Программы",
    children: [
      { id: "list", label: "Программы", kind: "program", refinable: true },
      { id: "students", label: "Студенты" },
      { id: "places", label: "Площадки" },
      { id: "program-agents", label: "Программные агенты" },
    ],
  },
  {
    id: "system",
    label: "Системные",
    children: [
      { id: "audit-log", label: "Аудит-лог" },
      { id: "users", label: "Управление админами" },
    ],
  },
];

function buildPathMap(): Map<string, SectionDef> {
  const map = new Map<string, SectionDef>();
  function walk(prefix: string, nodes: SectionDef[]) {
    for (const n of nodes) {
      const path = prefix ? `${prefix}.${n.id}` : n.id;
      map.set(path, n);
      if (n.children) walk(path, n.children);
    }
  }
  walk("", SECTIONS);
  return map;
}

export const SECTION_PATH_MAP = buildPathMap();

export function findStaticSection(path: string): SectionDef | null {
  return SECTION_PATH_MAP.get(path) ?? null;
}

export function splitDynamic(path: string): { staticPath: string; itemId: string | null } {
  const parts = path.split(".");
  for (let i = parts.length; i >= 1; i--) {
    const candidate = parts.slice(0, i).join(".");
    if (SECTION_PATH_MAP.has(candidate)) {
      const remainder = parts.slice(i).join(".");
      return { staticPath: candidate, itemId: remainder || null };
    }
  }
  return { staticPath: "", itemId: null };
}
