"use client";

import { useState, useCallback } from "react";

export function useItemDnd<T>(items: T[], onReorder: (items: T[]) => void) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [draggableIdx, setDraggableIdx] = useState<number | null>(null);

  const onGripDown = useCallback((idx: number) => setDraggableIdx(idx), []);
  const onGripUp = useCallback(() => setDraggableIdx(null), []);

  const onDragStart = useCallback(
    (e: React.DragEvent, idx: number) => {
      setDragIdx(idx);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(idx));
    },
    []
  );

  const onDragOver = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (idx !== overIdx) setOverIdx(idx);
    },
    [overIdx]
  );

  const onDrop = useCallback(
    (e: React.DragEvent, targetIdx: number) => {
      e.preventDefault();
      const srcIdx = Number(e.dataTransfer.getData("text/plain"));
      if (isNaN(srcIdx) || srcIdx === targetIdx) {
        setDragIdx(null);
        setOverIdx(null);
        return;
      }
      const next = [...items];
      const [moved] = next.splice(srcIdx, 1);
      next.splice(targetIdx, 0, moved);
      onReorder(next);
      setDragIdx(null);
      setOverIdx(null);
      setDraggableIdx(null);
    },
    [items, onReorder]
  );

  const onDragEnd = useCallback(() => {
    setDragIdx(null);
    setOverIdx(null);
    setDraggableIdx(null);
  }, []);

  const move = useCallback(
    (idx: number, dir: "up" | "down") => {
      const targetIdx = dir === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return;
      const next = [...items];
      const [moved] = next.splice(idx, 1);
      next.splice(targetIdx, 0, moved);
      onReorder(next);
    },
    [items, onReorder]
  );

  function itemProps(idx: number) {
    return {
      draggable: draggableIdx === idx,
      onDragStart: (e: React.DragEvent) => onDragStart(e, idx),
      onDragOver: (e: React.DragEvent) => onDragOver(e, idx),
      onDrop: (e: React.DragEvent) => onDrop(e, idx),
      onDragEnd,
      isDragging: dragIdx === idx,
      isDragOver: overIdx === idx && dragIdx !== idx,
    };
  }

  return { itemProps, onGripDown, onGripUp, move, count: items.length };
}
