"use client";

import { useState } from "react";
import { ChevronRight, Eye, Pencil, Ban } from "lucide-react";
import { cn } from "@rocketmind/ui";

export type Access = "VIEW" | "EDIT" | null;

export interface TreeItem {
  id: string;
  label: string;
}

export interface TreeNode {
  id: string;
  label: string;
  path: string;
  refinable: boolean;
  children: TreeNode[];
  items?: TreeItem[];
}

interface Props {
  tree: TreeNode[];
  value: Map<string, "VIEW" | "EDIT">;
  onChange: (next: Map<string, "VIEW" | "EDIT">) => void;
  readOnly?: boolean;
}

export function PermissionTree({ tree, value, onChange, readOnly }: Props) {
  return (
    <div className="space-y-0.5">
      {tree.map((node) => (
        <TreeRow
          key={node.path}
          node={node}
          depth={0}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

function TreeRow({
  node,
  depth,
  value,
  onChange,
  readOnly,
}: {
  node: TreeNode;
  depth: number;
  value: Map<string, "VIEW" | "EDIT">;
  onChange: (next: Map<string, "VIEW" | "EDIT">) => void;
  readOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children.length > 0 || (node.items?.length ?? 0) > 0;
  const current = value.get(node.path) ?? null;
  const inheritedFrom = findInheritedGrant(node.path, value);

  function setAccess(next: Access) {
    const m = new Map(value);
    if (next === null) m.delete(node.path);
    else m.set(node.path, next);
    onChange(m);
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 rounded hover:bg-rm-gray-2/40 transition-colors"
        style={{ paddingLeft: 8 + depth * 18 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((x) => !x)}
            className="shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={expanded ? "Свернуть" : "Развернуть"}
          >
            <ChevronRight
              size={12}
              className={cn("transition-transform duration-150", expanded && "rotate-90")}
            />
          </button>
        ) : (
          <span className="shrink-0 w-5" />
        )}

        <span className="flex-1 min-w-0 text-[length:var(--text-13)] text-foreground truncate">
          {node.label}
          {inheritedFrom && !current && (
            <span className="ml-2 text-[length:var(--text-11)] text-muted-foreground">
              ← {inheritedFrom.path} ({inheritedFrom.level === "EDIT" ? "редактор" : "просмотр"})
            </span>
          )}
        </span>

        <AccessPicker value={current} onChange={setAccess} readOnly={readOnly} />
      </div>

      {expanded && (
        <div>
          {node.children.map((c) => (
            <TreeRow
              key={c.path}
              node={c}
              depth={depth + 1}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
            />
          ))}
          {node.items?.map((it) => {
            const itemPath = `${node.path}.${it.id}`;
            const itemCurrent = value.get(itemPath) ?? null;
            const itemInherited = findInheritedGrant(itemPath, value);
            return (
              <div
                key={itemPath}
                className="flex items-center gap-2 py-1 rounded hover:bg-rm-gray-2/40 transition-colors"
                style={{ paddingLeft: 8 + (depth + 1) * 18 + 20 }}
              >
                <span className="flex-1 min-w-0 text-[length:var(--text-12)] text-muted-foreground truncate">
                  {it.label}
                  {itemInherited && !itemCurrent && (
                    <span className="ml-2 text-[length:var(--text-11)] text-muted-foreground/70">
                      ← {itemInherited.level === "EDIT" ? "редактор" : "просмотр"}
                    </span>
                  )}
                </span>
                <AccessPicker
                  value={itemCurrent}
                  onChange={(next) => {
                    const m = new Map(value);
                    if (next === null) m.delete(itemPath);
                    else m.set(itemPath, next);
                    onChange(m);
                  }}
                  readOnly={readOnly}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AccessPicker({
  value,
  onChange,
  readOnly,
}: {
  value: Access;
  onChange: (next: Access) => void;
  readOnly?: boolean;
}) {
  const baseBtn =
    "h-7 w-7 flex items-center justify-center rounded text-muted-foreground transition-colors cursor-pointer";
  if (readOnly) {
    return (
      <span className="shrink-0 flex items-center gap-1 text-[length:var(--text-11)] text-muted-foreground">
        {value === "EDIT" ? "Редактор" : value === "VIEW" ? "Просмотр" : "—"}
      </span>
    );
  }
  return (
    <div className="shrink-0 flex items-center gap-0.5 border border-border rounded">
      <button
        type="button"
        onClick={() => onChange(null)}
        title="Без доступа"
        className={cn(baseBtn, value === null && "bg-rm-gray-2 text-foreground")}
      >
        <Ban size={13} />
      </button>
      <button
        type="button"
        onClick={() => onChange("VIEW")}
        title="Только просмотр"
        className={cn(baseBtn, value === "VIEW" && "bg-rm-gray-2 text-foreground")}
      >
        <Eye size={13} />
      </button>
      <button
        type="button"
        onClick={() => onChange("EDIT")}
        title="Редактирование"
        className={cn(baseBtn, value === "EDIT" && "bg-[var(--rm-yellow-100)] text-foreground")}
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}

/**
 * Looks up whether `path` is implicitly granted via an ancestor. Used for
 * UI hint only — the real check still happens server-side.
 */
function findInheritedGrant(
  path: string,
  value: Map<string, "VIEW" | "EDIT">,
): { path: string; level: "VIEW" | "EDIT" } | null {
  const parts = path.split(".");
  for (let i = parts.length - 1; i >= 1; i--) {
    const ancestor = parts.slice(0, i).join(".");
    const lvl = value.get(ancestor);
    if (lvl) return { path: ancestor, level: lvl };
  }
  return null;
}
