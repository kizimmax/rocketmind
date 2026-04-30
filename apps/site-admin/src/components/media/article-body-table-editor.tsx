"use client";

import { useEffect, useRef, useState } from "react";
import { GripHorizontal, GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@rocketmind/ui";

interface Props {
  rows: string[][];
  hasHeader: boolean;
  onChange: (patch: { rows?: string[][]; hasHeader?: boolean }) => void;
}

const MIN_COL_PX = 120;
const MAX_COL_PX = 280;
const COL_GAP_PX = 16;
const ROW_CTRL_W = 32; // ширина левой control-колонки (вне видимости пользователя — drag/delete рендерим как floating overlay у row)
const COL_CTRL_H = 28; // высота верхней control-строки

type DragKind = "row" | "col";

/**
 * Редактор табличного блока. Использует нативный `<table>` для гарантированно
 * горизонтального layout'а колонок (CSS Grid с динамическим
 * grid-template-columns в этом контексте давал коллапс — table layout надёжнее).
 *
 * Структура DOM:
 *   <table border-separate border-spacing-x-4 border-spacing-y-0>
 *     <colgroup>           — фиксируем ширину каждого col'а через max-width
 *     <thead><tr>          — control-row: пустой угол + col-headers (drag/delete на hover)
 *     <tbody>              — для каждой строки: <tr> с row-control-td + data-td'ами
 *
 * Контролы:
 *   - На hover колонки в её control-th показываются drag handle (GripHorizontal)
 *     и trash; вся th draggable=true → DnD колонки.
 *   - На hover строки в её row-control-td (слева, ширина 32px) аналогично:
 *     GripVertical + trash, td draggable=true → DnD строки.
 *   - Insert «+» появляются как абсолютные overlay'и внутри ячеек
 *     (top/bottom для строк, left/right для колонок) и подсвечиваются
 *     при drag-and-drop.
 *
 * Перенос текста: `max-width: 280px` на `<td>` + `word-break: break-word` →
 * колонка авто-растёт по самой длинной строке, но не шире 280px.
 *
 * Скролл и фейды: внешний `overflow-x-auto` + два gradient-фейда
 * (left/right) с opacity по фактическому scrollLeft/scrollWidth.
 */
export function ArticleBodyTableEditor({ rows, hasHeader, onChange }: Props) {
  const cols = rows[0]?.length ?? 0;
  const rowCount = rows.length;

  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const [drag, setDrag] = useState<{ kind: DragKind; index: number } | null>(
    null,
  );
  const [drop, setDrop] = useState<{
    kind: DragKind;
    at: number;
    side: "before" | "after";
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const overflows = el.scrollWidth - el.clientWidth > 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setFade({
        left: overflows && el.scrollLeft > 1,
        right: overflows && !atEnd,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [rowCount, cols]);

  // ── Mutators ──────────────────────────────────────────────────────────────

  function setCell(r: number, c: number, value: string) {
    onChange({
      rows: rows.map((row, ri) =>
        ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row,
      ),
    });
  }

  function insertColumn(at: number) {
    onChange({
      rows: rows.map((row) => {
        const copy = [...row];
        copy.splice(at, 0, "");
        return copy;
      }),
    });
  }

  function deleteColumn(at: number) {
    if (cols <= 1) return;
    onChange({ rows: rows.map((row) => row.filter((_, ci) => ci !== at)) });
  }

  function moveColumn(from: number, to: number) {
    const adjusted = to > from ? to - 1 : to;
    if (from === adjusted) return;
    onChange({
      rows: rows.map((row) => {
        const arr = [...row];
        const [item] = arr.splice(from, 1);
        arr.splice(adjusted, 0, item);
        return arr;
      }),
    });
  }

  function insertRow(at: number) {
    const next = [...rows];
    next.splice(at, 0, Array(cols).fill(""));
    onChange({ rows: next });
  }

  function deleteRow(at: number) {
    if (rowCount <= 1) return;
    onChange({ rows: rows.filter((_, ri) => ri !== at) });
  }

  function moveRow(from: number, to: number) {
    const adjusted = to > from ? to - 1 : to;
    if (from === adjusted) return;
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(adjusted, 0, item);
    onChange({ rows: next });
  }

  // ── DnD ───────────────────────────────────────────────────────────────────

  function startDrag(kind: DragKind, index: number, e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${kind}:${index}`);
    setDrag({ kind, index });
  }

  function endDrag() {
    if (drag && drop && drag.kind === drop.kind) {
      const targetIdx = drop.at + (drop.side === "after" ? 1 : 0);
      if (drag.kind === "col") moveColumn(drag.index, targetIdx);
      else moveRow(drag.index, targetIdx);
    }
    setDrag(null);
    setDrop(null);
  }

  function dropOn(kind: DragKind, at: number, side: "before" | "after") {
    if (!drag || drag.kind !== kind) return;
    setDrop({ kind, at, side });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col gap-2"
      onMouseLeave={() => {
        setHoverRow(null);
        setHoverCol(null);
      }}
    >
      <label className="inline-flex w-fit select-none items-center gap-2 text-[length:var(--text-12)] text-muted-foreground">
        <input
          type="checkbox"
          checked={hasHeader}
          onChange={(e) => onChange({ hasHeader: e.target.checked })}
          className="h-3.5 w-3.5 rounded-sm border border-border bg-background accent-[var(--rm-violet-100)]"
        />
        Первая строка — шапка
      </label>

      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto rounded-sm border border-border bg-[color:var(--rm-gray-1)]/20 [scrollbar-width:thin]"
          onDragEnd={endDrag}
          onDrop={(e) => {
            e.preventDefault();
            endDrag();
          }}
          onDragOver={(e) => {
            if (drag) e.preventDefault();
          }}
        >
          <table
            className="w-max border-separate"
            style={{
              borderSpacing: `${COL_GAP_PX}px 0`,
              borderCollapse: "separate",
            }}
          >
            <colgroup>
              <col style={{ width: `${ROW_CTRL_W}px` }} />
              {Array.from({ length: cols }).map((_, ci) => (
                <col key={ci} />
              ))}
            </colgroup>

            {/* Control-row: empty corner + col-controls */}
            <thead>
              <tr style={{ height: `${COL_CTRL_H}px` }}>
                <th />
                {Array.from({ length: cols }).map((_, ci) => (
                  <ColControlTh
                    key={ci}
                    cols={cols}
                    visible={hoverCol === ci || drag?.kind === "col"}
                    isDragging={drag?.kind === "col" && drag.index === ci}
                    onEnter={() => setHoverCol(ci)}
                    onDragStart={(e) => startDrag("col", ci, e)}
                    onDelete={() => deleteColumn(ci)}
                  />
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  <RowControlTd
                    rows={rowCount}
                    visible={hoverRow === ri || drag?.kind === "row"}
                    isDragging={drag?.kind === "row" && drag.index === ri}
                    onEnter={() => setHoverRow(ri)}
                    onDragStart={(e) => startDrag("row", ri, e)}
                    onDelete={() => deleteRow(ri)}
                  />
                  {row.map((cell, ci) => (
                    <DataTd
                      key={ci}
                      value={cell}
                      isHeader={hasHeader && ri === 0}
                      ri={ri}
                      ci={ci}
                      cols={cols}
                      rows={rowCount}
                      colHovered={hoverCol === ci}
                      rowHovered={hoverRow === ri}
                      drag={drag}
                      drop={drop}
                      onChange={(v) => setCell(ri, ci, v)}
                      onEnter={() => {
                        setHoverCol(ci);
                        setHoverRow(ri);
                      }}
                      onInsertColLeft={() => insertColumn(ci)}
                      onInsertColRight={() => insertColumn(ci + 1)}
                      onInsertRowAbove={() => insertRow(ri)}
                      onInsertRowBelow={() => insertRow(ri + 1)}
                      onDropOnCol={(side) => dropOn("col", ci, side)}
                      onDropOnRow={(side) => dropOn("row", ri, side)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-200",
            fade.left ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity duration-200",
            fade.right ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => insertRow(rowCount)}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-12)] font-medium text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-[var(--rm-violet-100)]"
        >
          <Plus className="h-3 w-3" />
          Строка
        </button>
        <button
          type="button"
          onClick={() => insertColumn(cols)}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-1 text-[length:var(--text-12)] font-medium text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-[var(--rm-violet-100)]"
        >
          <Plus className="h-3 w-3" />
          Колонка
        </button>
        <span className="ml-auto text-[length:var(--text-11)] text-muted-foreground">
          {rowCount} × {cols}
        </span>
      </div>
    </div>
  );
}

// ── Column control th ─────────────────────────────────────────────────────

function ColControlTh({
  cols,
  visible,
  isDragging,
  onEnter,
  onDragStart,
  onDelete,
}: {
  cols: number;
  visible: boolean;
  isDragging: boolean;
  onEnter: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDelete: () => void;
}) {
  return (
    <th
      className={cn(
        "relative align-middle transition-colors",
        visible && "bg-[color:var(--rm-violet-100)]/8 rounded-t-sm",
        isDragging && "opacity-40",
      )}
      onMouseEnter={onEnter}
      draggable={visible}
      onDragStart={onDragStart}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-1 transition-opacity",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <button
          type="button"
          title="Перетащить колонку"
          className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
        >
          <GripHorizontal className="h-3.5 w-3.5" />
        </button>
        {cols > 1 && (
          <button
            type="button"
            title="Удалить колонку"
            onClick={onDelete}
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </th>
  );
}

// ── Row control td ────────────────────────────────────────────────────────

function RowControlTd({
  rows,
  visible,
  isDragging,
  onEnter,
  onDragStart,
  onDelete,
}: {
  rows: number;
  visible: boolean;
  isDragging: boolean;
  onEnter: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDelete: () => void;
}) {
  return (
    <td
      className={cn(
        "relative align-middle transition-colors",
        visible && "bg-[color:var(--rm-violet-100)]/8 rounded-l-sm",
        isDragging && "opacity-40",
      )}
      onMouseEnter={onEnter}
      draggable={visible}
      onDragStart={onDragStart}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 transition-opacity",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <button
          type="button"
          title="Перетащить строку"
          className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        {rows > 1 && (
          <button
            type="button"
            title="Удалить строку"
            onClick={onDelete}
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </td>
  );
}

// ── Data td ───────────────────────────────────────────────────────────────

interface DataTdProps {
  value: string;
  isHeader: boolean;
  ri: number;
  ci: number;
  cols: number;
  rows: number;
  colHovered: boolean;
  rowHovered: boolean;
  drag: { kind: DragKind; index: number } | null;
  drop: { kind: DragKind; at: number; side: "before" | "after" } | null;
  onChange: (v: string) => void;
  onEnter: () => void;
  onInsertColLeft: () => void;
  onInsertColRight: () => void;
  onInsertRowAbove: () => void;
  onInsertRowBelow: () => void;
  onDropOnCol: (side: "before" | "after") => void;
  onDropOnRow: (side: "before" | "after") => void;
}

function DataTd({
  value,
  isHeader,
  ri,
  ci,
  colHovered,
  rowHovered,
  drag,
  drop,
  onChange,
  onEnter,
  onInsertColLeft,
  onInsertColRight,
  onInsertRowAbove,
  onInsertRowBelow,
  onDropOnCol,
  onDropOnRow,
}: DataTdProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [value]);

  const isFirstInRow = ci === 0;

  // Vertical insert-полосы рендерим в каждой ячейке колонки — стекуются
  // по высоте, образуя сплошную вертикальную полосу через все строки колонки.
  const showColInsertLeft = drag?.kind === "col" || colHovered;
  const showColInsertRight = drag?.kind === "col" || colHovered;
  // Horizontal — только в первой ячейке строки (растягиваем на всю ширину
  // через spanRow).
  const showRowInsertTop = (drag?.kind === "row" || rowHovered) && isFirstInRow;
  const showRowInsertBottom =
    (drag?.kind === "row" || rowHovered) && isFirstInRow;

  const colDropMatchLeft =
    drop?.kind === "col" && drop.at === ci && drop.side === "before";
  const colDropMatchRight =
    drop?.kind === "col" && drop.at === ci && drop.side === "after";
  const rowDropMatchTop =
    drop?.kind === "row" && drop.at === ri && drop.side === "before";
  const rowDropMatchBottom =
    drop?.kind === "row" && drop.at === ri && drop.side === "after";

  return (
    <td
      className={cn(
        "relative align-top",
        ri > 0 && "border-t border-[color:var(--rm-gray-3)]",
      )}
      style={{
        minWidth: `${MIN_COL_PX}px`,
        maxWidth: `${MAX_COL_PX}px`,
      }}
      onMouseEnter={onEnter}
    >
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          const ta = e.currentTarget;
          ta.style.height = "auto";
          ta.style.height = ta.scrollHeight + "px";
        }}
        placeholder={isHeader ? "Заголовок" : "Ячейка"}
        rows={1}
        className={cn(
          "block w-full resize-none border-0 bg-transparent outline-none",
          isHeader ? "py-[11px]" : "py-[14px]",
          isHeader
            ? "text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[color:var(--rm-gray-fg-sub)] placeholder:text-[color:var(--rm-gray-fg-sub)]/50"
            : "text-[length:var(--text-16)] leading-[1.28] text-[color:var(--rm-gray-fg-main)] placeholder:text-[color:var(--rm-gray-fg-sub)]/50",
          "[overflow-wrap:anywhere] break-words",
        )}
      />

      {/* Vertical insert/drop bars — стекуются по высоте всех строк колонки */}
      {showColInsertLeft && (
        <InsertBar
          orientation="vertical"
          side="left"
          highlighted={colDropMatchLeft}
          isDropTarget={drag?.kind === "col"}
          onClick={onInsertColLeft}
          onDragOver={() => onDropOnCol("before")}
        />
      )}
      {showColInsertRight && (
        <InsertBar
          orientation="vertical"
          side="right"
          highlighted={colDropMatchRight}
          isDropTarget={drag?.kind === "col"}
          onClick={onInsertColRight}
          onDragOver={() => onDropOnCol("after")}
        />
      )}

      {/* Horizontal insert/drop bars — на всю ширину строки. Рендерятся
          только в первой ячейке строки и за счёт right: -100vw
          растягиваются вправо до конца видимой строки. */}
      {showRowInsertTop && (
        <InsertBar
          orientation="horizontal"
          side="top"
          highlighted={rowDropMatchTop}
          isDropTarget={drag?.kind === "row"}
          onClick={onInsertRowAbove}
          onDragOver={() => onDropOnRow("before")}
          spanRow
        />
      )}
      {showRowInsertBottom && (
        <InsertBar
          orientation="horizontal"
          side="bottom"
          highlighted={rowDropMatchBottom}
          isDropTarget={drag?.kind === "row"}
          onClick={onInsertRowBelow}
          onDragOver={() => onDropOnRow("after")}
          spanRow
        />
      )}
    </td>
  );
}

// ── InsertBar ─────────────────────────────────────────────────────────────

function InsertBar({
  orientation,
  side,
  highlighted,
  isDropTarget,
  onClick,
  onDragOver,
  spanRow,
}: {
  orientation: "vertical" | "horizontal";
  side: "left" | "right" | "top" | "bottom";
  highlighted: boolean;
  isDropTarget: boolean;
  onClick: () => void;
  onDragOver: () => void;
  spanRow?: boolean;
}) {
  const baseClass =
    orientation === "vertical"
      ? "absolute top-0 bottom-0 z-10 flex w-2 cursor-pointer items-center justify-center"
      : "absolute left-0 right-0 z-10 flex h-2 cursor-pointer items-center justify-center";

  let sideClass = "";
  if (side === "left") sideClass = "-left-2";
  if (side === "right") sideClass = "-right-2";
  if (side === "top") sideClass = "-top-1";
  if (side === "bottom") sideClass = "-bottom-1";

  // Растягиваем горизонтальную полосу влево (за пределы first-cell, чтобы
  // покрыть и control-td) и вправо (через right: -100vw — overflow-x-auto
  // обрежет «лишнее»). Используется только при spanRow=true.
  const spanRowStyle: React.CSSProperties | undefined = spanRow
    ? {
        left: `-${ROW_CTRL_W + COL_GAP_PX}px`,
        right: "-100vw",
      }
    : undefined;

  return (
    <div
      className={cn(baseClass, sideClass, "group/insert")}
      style={spanRowStyle}
      onClick={onClick}
      onDragOver={(e) => {
        if (isDropTarget) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          onDragOver();
        }
      }}
    >
      <div
        className={cn(
          orientation === "vertical"
            ? "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors"
            : "absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-colors",
          highlighted
            ? "bg-[var(--rm-violet-100)]"
            : "bg-transparent group-hover/insert:bg-[var(--rm-violet-100)]/40",
        )}
      />
      <div
        className={cn(
          "z-10 flex h-4 w-4 items-center justify-center rounded-full border border-[var(--rm-violet-100)] bg-background text-[var(--rm-violet-100)] opacity-0 transition-opacity",
          "group-hover/insert:opacity-100",
          highlighted && "opacity-100",
        )}
      >
        <Plus className="h-3 w-3" />
      </div>
    </div>
  );
}
