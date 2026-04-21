"use client";

import { Fragment, useState, useCallback, useRef } from "react";
import { GripVertical, ChevronDown, ChevronRight, EyeOff, Plus, Trash2 } from "lucide-react";
import { Switch } from "@rocketmind/ui";
import type { PageBlock, BlockType } from "@/lib/types";
import { BLOCK_TYPES, CUSTOM_BLOCK_ID_PREFIX } from "@/lib/constants";
import { BlockEditor } from "./block-editors/block-editor";

interface BlockListProps {
  blocks: PageBlock[];
  sectionId: string;
  pageSlug?: string;
  hasExperts: boolean;
  experts: Array<{ name: string; image: string | null }>;
  onToggleBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, data: Record<string, unknown>) => void;
  onReorderBlocks: (orderedIds: string[]) => void;
  onInsertBlock: (afterBlockId: string | null, blockType: BlockType) => void;
  onDeleteBlock: (blockId: string) => void;
  /** If true, hides "+ Добавить блок" gaps (used for mini cases with a fixed single-block layout). */
  disableInsert?: boolean;
}

function InsertGap({ onInsert }: { onInsert: () => void }) {
  return (
    <div className="group/gap relative z-20 flex h-10 items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[var(--rm-yellow-300)] opacity-0 transition-opacity group-hover/gap:opacity-60" />
      <button
        type="button"
        onClick={onInsert}
        className="relative z-10 flex h-6 items-center gap-1.5 rounded-sm border border-[var(--rm-yellow-300)] bg-card px-2 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-[var(--rm-yellow-300)] opacity-0 transition-opacity hover:bg-[var(--rm-yellow-300)] hover:text-[#0A0A0A] group-hover/gap:opacity-100 cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        Добавить блок
      </button>
    </div>
  );
}

export function BlockList({
  blocks,
  sectionId,
  pageSlug,
  hasExperts,
  experts,
  onToggleBlock,
  onUpdateBlock,
  onReorderBlocks,
  onInsertBlock,
  onDeleteBlock,
  disableInsert = false,
}: BlockListProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggableId, setDraggableId] = useState<string | null>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  const toggleCollapse = useCallback((blockId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent, blockId: string) => {
      setDragId(blockId);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", blockId);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, blockId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (blockId !== dragOverId) {
        setDragOverId(blockId);
      }
    },
    [dragOverId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetId) {
        setDragId(null);
        setDragOverId(null);
        return;
      }

      const ids = sorted.map((b) => b.id);
      const sourceIdx = ids.indexOf(sourceId);
      const targetIdx = ids.indexOf(targetId);

      if (sourceIdx === -1 || targetIdx === -1) return;

      ids.splice(sourceIdx, 1);
      ids.splice(targetIdx, 0, sourceId);

      onReorderBlocks(ids);
      setDragId(null);
      setDragOverId(null);
    },
    [sorted, onReorderBlocks]
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setDragOverId(null);
    setDraggableId(null);
  }, []);

  const handleGripMouseDown = useCallback((blockId: string) => {
    setDraggableId(blockId);
  }, []);

  const handleGripMouseUp = useCallback(() => {
    setDraggableId(null);
  }, []);

  return (
    <div className="flex flex-col gap-0">
      {/* Insert gap above the first block */}
      {!disableInsert && (
        <InsertGap onInsert={() => onInsertBlock(null, "customSection")} />
      )}

      {sorted.map((block, idx) => {
        const info = BLOCK_TYPES[block.type];
        const labelOverride =
          sectionId === "unique" && pageSlug === "cases-index" && block.type === "about"
            ? "Произвольный блок"
            : null;
        const isCollapsed = collapsedIds.has(block.id);
        const isDragging = dragId === block.id;
        const isDragOver = dragOverId === block.id && dragId !== block.id;
        const isCustom = block.id.startsWith(CUSTOM_BLOCK_ID_PREFIX);

        return (
          <Fragment key={block.id}>
            <div
              ref={(el) => {
                if (el) rowRefs.current.set(block.id, el);
                else rowRefs.current.delete(block.id);
              }}
              draggable={draggableId === block.id}
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDrop={(e) => handleDrop(e, block.id)}
              onDragEnd={handleDragEnd}
              className={`relative transition-all ${
                isDragging
                  ? "opacity-50"
                  : isDragOver
                    ? "ring-2 ring-[var(--rm-yellow-300)]"
                    : ""
              }`}
            >
              {/* Block toolbar — floating bar */}
              <div className="sticky top-0 z-10 flex items-center gap-2 border border-border bg-card px-3 py-1.5 shadow-sm">
                {!disableInsert && (
                  <div
                    className="cursor-grab text-muted-foreground active:cursor-grabbing select-none"
                    onMouseDown={() => handleGripMouseDown(block.id)}
                    onMouseUp={handleGripMouseUp}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>
                )}

                <button
                  className="flex flex-1 items-center gap-2 text-left"
                  onClick={() => toggleCollapse(block.id)}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
                    {labelOverride || info?.label || block.type}
                  </span>
                  {isCustom && (
                    <span className="text-[length:var(--text-10)] font-medium uppercase tracking-wider text-[var(--rm-yellow-300)]">
                      свой
                    </span>
                  )}
                </button>

                {!disableInsert && !block.enabled && (
                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                )}

                {!disableInsert && (
                  <Switch
                    checked={block.enabled}
                    onCheckedChange={() => onToggleBlock(block.id)}
                    size="sm"
                  />
                )}

                {isCustom && (
                  confirmingDeleteId === block.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[length:var(--text-11)] text-destructive">Удалить?</span>
                      <button
                        type="button"
                        onClick={() => { onDeleteBlock(block.id); setConfirmingDeleteId(null); }}
                        className="flex h-6 items-center px-1.5 rounded-sm text-[length:var(--text-11)] font-medium text-destructive border border-destructive/40 hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        Да
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(null)}
                        className="flex h-6 items-center px-1.5 rounded-sm text-[length:var(--text-11)] font-medium text-muted-foreground border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        Нет
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(block.id)}
                      title="Удалить блок"
                      className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )
                )}
              </div>

              {/* Block preview */}
              {!isCollapsed && (
                <div className={!block.enabled ? "pointer-events-none opacity-30" : ""}>
                  <BlockEditor
                    block={block}
                    sectionId={sectionId}
                    hasExperts={hasExperts}
                    experts={experts}
                    onUpdate={(data) => onUpdateBlock(block.id, data)}
                  />
                </div>
              )}
            </div>

            {/* Insert gap between this block and the next */}
            {!disableInsert && idx < sorted.length - 1 && (
              <InsertGap onInsert={() => onInsertBlock(block.id, "customSection")} />
            )}
          </Fragment>
        );
      })}

      {/* Insert gap below the last block */}
      {!disableInsert && sorted.length > 0 && (
        <InsertGap
          onInsert={() => onInsertBlock(sorted[sorted.length - 1].id, "customSection")}
        />
      )}
    </div>
  );
}
