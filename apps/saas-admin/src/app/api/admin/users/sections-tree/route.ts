import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { SECTIONS, SectionDef } from "@/lib/permissions/sections";
import { DynamicChild, loadChildren } from "@/lib/permissions/children-loader";

export const dynamic = "force-dynamic";

interface TreeNode {
  id: string;
  label: string;
  path: string;
  refinable: boolean;
  children: TreeNode[];
  items?: DynamicChild[];
}

async function expand(node: SectionDef, prefix: string): Promise<TreeNode> {
  const path = prefix ? `${prefix}.${node.id}` : node.id;
  const children: TreeNode[] = [];
  if (node.children) {
    for (const c of node.children) children.push(await expand(c, path));
  }
  const items = node.refinable && node.kind ? await loadChildren(node.kind) : undefined;
  return {
    id: node.id,
    label: node.label,
    path,
    refinable: Boolean(node.refinable && node.kind),
    children,
    items,
  };
}

/**
 * Returns the full permission tree, with dynamic per-item leaves loaded from
 * the DB. Used by the user-permissions UI to render the granular checkboxes.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const tree: TreeNode[] = [];
  for (const s of SECTIONS) tree.push(await expand(s, ""));
  return NextResponse.json({ tree });
}
