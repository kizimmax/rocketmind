"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import type { ArticleBodyBlock, ArticleBodyBlockType } from "@/lib/types";
import { ArticleBodyBlockRow } from "./article-body-block-row";
import { BlockTypeMenu } from "./block-type-menu";

interface Props {
  /** Slug статьи — нужен для загрузки изображений из image-блоков. */
  articleSlug: string;
  blocks: ArticleBodyBlock[];
  onChange: (next: ArticleBodyBlock[]) => void;
}

const SUPPORTED_TYPES: ArticleBodyBlockType[] = [
  "h3",
  "h4",
  "paragraph",
  "quote",
  "image",
  "gallery",
  "video",
];

function newBlockId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function makeBlock(type: ArticleBodyBlockType): ArticleBodyBlock {
  // Image-блок инициализируется без текста — у него своя shape (src + caption),
  // которая заполняется через UI image-row после загрузки файла.
  if (type === "image") {
    return { id: newBlockId(), type, data: { src: "", caption: "" } };
  }
  if (type === "gallery") {
    return { id: newBlockId(), type, data: { items: [] } };
  }
  if (type === "video") {
    return { id: newBlockId(), type, data: { src: "", caption: "" } };
  }
  return { id: newBlockId(), type, data: { text: "" } };
}

type DropPosition = "before" | "after";

export function ArticleBodyEditor({ articleSlug, blocks, onChange }: Props) {
  const [dragFromIdx, setDragFromIdx] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<
    { rowIdx: number; position: DropPosition } | null
  >(null);
  // Запрос на перевод фокуса (после сплита Enter, после delete Backspace и т.д.).
  // nonce уникален для каждого запроса — textarea re-focus'ится даже на уже
  // смонтированный DOM-узел (нужно для фокуса соседнего блока после удаления).
  const [focusReq, setFocusReq] = useState<
    { id: string; position: "start" | "end"; nonce: number } | null
  >(null);

  const visibleBlocks = blocks.filter((b) => SUPPORTED_TYPES.includes(b.type));

  const insertAt = useCallback(
    (targetIdx: number, type: ArticleBodyBlockType) => {
      const next = [...blocks];
      next.splice(targetIdx, 0, makeBlock(type));
      onChange(next);
    },
    [blocks, onChange],
  );

  const updateBlock = useCallback(
    (id: string, text: string) => {
      onChange(blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, text } } : b)));
    },
    [blocks, onChange],
  );

  // Универсальный апдейтер data — нужен image-блоку, у которого нет text-поля.
  const updateBlockData = useCallback(
    (id: string, patch: Record<string, unknown>) => {
      onChange(
        blocks.map((b) =>
          b.id === id ? { ...b, data: { ...b.data, ...patch } } : b,
        ),
      );
    },
    [blocks, onChange],
  );

  const updateBlockType = useCallback(
    (id: string, type: ArticleBodyBlockType) => {
      onChange(blocks.map((b) => (b.id === id ? { ...b, type } : b)));
    },
    [blocks, onChange],
  );

  const splitBlock = useCallback(
    (id: string, before: string, after: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx < 0) return;
      const current = blocks[idx];
      // Тип нового блока: всегда "paragraph" — Notion-like поведение.
      // (Если разбиваем параграф — тот же тип; если заголовок — следующий блок
      // всё равно параграф, как обычно ожидается от Enter.)
      const newBlock: ArticleBodyBlock = {
        id: newBlockId(),
        type: "paragraph",
        data: { text: after },
      };
      const next = [...blocks];
      next[idx] = { ...current, data: { ...current.data, text: before } };
      next.splice(idx + 1, 0, newBlock);
      setFocusReq({
        id: newBlock.id,
        position: "start",
        nonce: Date.now(),
      });
      onChange(next);
    },
    [blocks, onChange],
  );

  const deleteEmptyAndFocusPrev = useCallback(
    (id: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx <= 0) return; // нет предыдущего — не удаляем
      const prev = blocks[idx - 1];
      setFocusReq({
        id: prev.id,
        position: "end",
        nonce: Date.now(),
      });
      onChange(blocks.filter((_, i) => i !== idx));
    },
    [blocks, onChange],
  );

  const removeBlock = useCallback(
    (id: string) => {
      onChange(blocks.filter((b) => b.id !== id));
    },
    [blocks, onChange],
  );

  const moveBlock = useCallback(
    (from: number, to: number) => {
      const adjustedTo = to > from ? to - 1 : to;
      if (from === adjustedTo) return;
      const arr = [...blocks];
      const [item] = arr.splice(from, 1);
      arr.splice(adjustedTo, 0, item);
      onChange(arr);
    },
    [blocks, onChange],
  );

  const handleDragOverRow = useCallback(
    (rowIdx: number, position: DropPosition) => {
      setDropTarget({ rowIdx, position });
    },
    [],
  );

  const handleDropRow = useCallback(() => {
    if (dragFromIdx == null || !dropTarget) {
      setDragFromIdx(null);
      setDropTarget(null);
      return;
    }
    const targetIdx = dropTarget.rowIdx + (dropTarget.position === "after" ? 1 : 0);
    moveBlock(dragFromIdx, targetIdx);
    setDragFromIdx(null);
    setDropTarget(null);
  }, [dragFromIdx, dropTarget, moveBlock]);

  function resolveDropIndicator(rowIdx: number): DropPosition | null {
    if (dragFromIdx == null || !dropTarget || dropTarget.rowIdx !== rowIdx) return null;
    const targetIdx = dropTarget.rowIdx + (dropTarget.position === "after" ? 1 : 0);
    // Hide indicator on no-op drops (dropping into the source's own slot).
    if (targetIdx === dragFromIdx || targetIdx === dragFromIdx + 1) return null;
    return dropTarget.position;
  }

  if (visibleBlocks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-4 py-10 text-center">
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Пока нет блоков. Добавьте первый.
        </p>
        <BlockTypeMenu onSelect={(t) => insertAt(0, t)} align="center">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-[length:var(--text-12)] font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить блок
          </button>
        </BlockTypeMenu>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {visibleBlocks.map((block) => {
        const realIdx = blocks.indexOf(block);
        return (
          <ArticleBodyBlockRow
            key={block.id}
            articleSlug={articleSlug}
            block={block}
            index={realIdx}
            onChangeText={(text) => updateBlock(block.id, text)}
            onChangeData={(patch) => updateBlockData(block.id, patch)}
            onChangeType={(type) => updateBlockType(block.id, type)}
            onSplit={(before, after) => splitBlock(block.id, before, after)}
            onDeleteEmpty={() => deleteEmptyAndFocusPrev(block.id)}
            focus={focusReq?.id === block.id ? focusReq : undefined}
            onInsertAfter={(t) => insertAt(realIdx + 1, t)}
            onRemove={() => removeBlock(block.id)}
            onDragStart={(idx) => setDragFromIdx(idx)}
            onDragEnd={() => {
              setDragFromIdx(null);
              setDropTarget(null);
            }}
            onDragOverRow={handleDragOverRow}
            onDropRow={handleDropRow}
            isDragging={dragFromIdx === realIdx}
            dropIndicator={resolveDropIndicator(realIdx)}
          />
        );
      })}
    </div>
  );
}
