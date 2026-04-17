"use client";

import { useRef } from "react";
import { Plus, Trash2, GripVertical, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useItemDnd } from "@/lib/use-item-dnd";

export interface LogoCell {
  id: string;
  src: string;
  alt?: string;
  size: "S" | "M" | "L";
  /** Logo padding inside the cell in px. Zoom in/out changes by ZOOM_STEP. */
  padding?: number;
}

interface LogoGridEditorProps {
  cells: LogoCell[];
  onUpdate: (cells: LogoCell[]) => void;
  onLoadPreset?: () => void;
  loadingPreset?: boolean;
}

const SIZE_SPAN: Record<LogoCell["size"], number> = { S: 1, M: 2, L: 4 };

const DEFAULT_PADDING = 20;
const ZOOM_STEP = 2;
const MIN_PADDING = 0;
const MAX_PADDING = 36;

export function LogoGridEditor({ cells, onUpdate, onLoadPreset, loadingPreset }: LogoGridEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dnd = useItemDnd(cells, (reordered) => onUpdate(reordered));

  function updateCell(id: string, patch: Partial<LogoCell>) {
    onUpdate(cells.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCell(id: string) {
    onUpdate(cells.filter((c) => c.id !== id));
  }

  function zoomIn(id: string, currentPadding: number) {
    const next = Math.max(MIN_PADDING, currentPadding - ZOOM_STEP);
    updateCell(id, { padding: next });
  }

  function zoomOut(id: string, currentPadding: number) {
    const next = Math.min(MAX_PADDING, currentPadding + ZOOM_STEP);
    updateCell(id, { padding: next });
  }

  function handleAddClick() {
    fileInputRef.current?.click();
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const readers = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    const newCells: LogoCell[] = readers.map((src, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      src,
      alt: files[i].name.replace(/\.[^.]+$/, ""),
      size: "S",
    }));

    onUpdate([...cells, ...newCells]);
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[length:var(--text-14)] font-medium text-foreground">
            Сетка логотипов
          </span>
          <span className="text-[length:var(--text-12)] text-muted-foreground">
            Перетаскивайте ячейки, зум лупой на каждом логотипе
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onLoadPreset && (
            <button
              type="button"
              onClick={onLoadPreset}
              disabled={loadingPreset}
              className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-foreground hover:bg-muted disabled:opacity-50"
              title="Загрузить логотипы из clip-logos"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingPreset ? "animate-spin" : ""}`} />
              Из clip-logos
            </button>
          )}
          <button
            type="button"
            onClick={handleAddClick}
            className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {cells.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-sm border border-dashed border-border text-[length:var(--text-12)] text-muted-foreground">
          Пока нет логотипов. Нажмите «Добавить».
        </div>
      ) : (
        <div
          className="grid grid-cols-4 auto-rows-[80px] gap-px bg-[#1A1A1A] border border-[#404040]"
          style={{ gridAutoFlow: "dense" }}
        >
          {cells.map((cell, idx) => {
            const padding = cell.padding ?? DEFAULT_PADDING;
            const isAtMin = padding <= MIN_PADDING;
            const props = dnd.itemProps(idx);

            return (
              <div
                key={cell.id}
                {...props}
                className={`group relative flex items-center justify-center bg-[#121212] ${props.isDragging ? "opacity-30" : ""} ${props.isDragOver ? "ring-2 ring-[#FFCC00]" : ""}`}
                style={{
                  gridColumn: `span ${SIZE_SPAN[cell.size]} / span ${SIZE_SPAN[cell.size]}`,
                  padding: `${padding}px`,
                }}
              >
                {cell.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cell.src}
                    alt={cell.alt ?? ""}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                )}

                {/* Drag grip — top left */}
                <button
                  type="button"
                  onMouseDown={() => dnd.onGripDown(idx)}
                  onMouseUp={() => dnd.onGripUp()}
                  className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-sm bg-[#1A1A1A] text-[#939393] opacity-0 transition-opacity group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                  title="Перетащить"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>

                {/* Delete — top right */}
                <button
                  type="button"
                  onClick={() => removeCell(cell.id)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-sm bg-[#1A1A1A] text-[#F0F0F0] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
                  title="Удалить"
                >
                  <Trash2 className="h-3 w-3" />
                </button>

                {/* Zoom out (−) — bottom left */}
                <button
                  type="button"
                  onClick={() => zoomOut(cell.id, padding)}
                  disabled={padding >= MAX_PADDING}
                  className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-sm bg-[#1A1A1A] text-[#F0F0F0] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#404040] disabled:cursor-not-allowed disabled:opacity-30"
                  title="Уменьшить логотип"
                >
                  <ZoomOut className="h-3 w-3" />
                </button>

                {/* Zoom in (+) — bottom right, disabled at edges */}
                <button
                  type="button"
                  onClick={() => zoomIn(cell.id, padding)}
                  disabled={isAtMin}
                  className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-sm bg-[#1A1A1A] text-[#F0F0F0] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#404040] disabled:cursor-not-allowed disabled:opacity-30"
                  title="Увеличить логотип"
                >
                  <ZoomIn className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
