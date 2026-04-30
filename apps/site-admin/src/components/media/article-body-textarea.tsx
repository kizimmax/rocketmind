"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Bold,
  ChevronDown,
  CornerDownLeft,
  Heading3,
  Heading4,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Type,
  type LucideIcon,
} from "lucide-react";
import type { ArticleBodyBlockType } from "@/lib/types";
import { BlockTypeMenu } from "./block-type-menu";
import { detectListMode, transformLines, type ListMode } from "./list-helpers";

const NBSP = " ";
const BULLET_RE = /^(\s*)([-•·–—])\s+/;
const NUMBERED_RE = /^(\s*)(\d+)([.)])\s+/;

function continueListPrefix(
  currentLine: string,
): { next: string; clearCurrent: boolean } | null {
  const num = currentLine.match(NUMBERED_RE);
  if (num) {
    const [, indent, n, sep] = num;
    const rest = currentLine.slice(num[0].length);
    if (!rest.trim()) return { next: "", clearCurrent: true };
    return { next: `${indent}${Number(n) + 1}${sep} `, clearCurrent: false };
  }
  const bul = currentLine.match(BULLET_RE);
  if (bul) {
    const [, indent, marker] = bul;
    const rest = currentLine.slice(bul[0].length);
    if (!rest.trim()) return { next: "", clearCurrent: true };
    return { next: `${indent}${marker} `, clearCurrent: false };
  }
  return null;
}

interface Props {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  blockType: ArticleBodyBlockType;
  /** Applied to both overlay and textarea so wrapping stays aligned. */
  textClassName?: string;
  /** Явный запрос на перевод фокуса в textarea. `nonce` обязан быть уникальным
   *  для каждого запроса — так useLayoutEffect перефокусируется даже когда
   *  целевой блок не монтируется заново (напр. фокус прыгает на соседний
   *  существующий блок после удаления). */
  focus?: { nonce: number; position: "start" | "end" };
  /** Если передан — в toolbar появляется выпадающий список выбора типа блока
   *  (заголовок H3/H4, параграф, цитата). Для H2-заголовков секции (где тип
   *  фиксирован) — не передавайте. Контент блока сохраняется. */
  onChangeType?: (type: ArticleBodyBlockType) => void;
  /** Если передан — Enter (без Shift и не в продолжении списка) сплитит блок:
   *  текст до курсора остаётся в текущем, после — уходит в новый параграф ниже.
   *  Shift+Enter по-прежнему вставляет soft-break (\n). */
  onSplit?: (before: string, after: string) => void;
  /** Если передан — Backspace в пустом блоке вызывает колбэк (удаление блока +
   *  фокус в конец предыдущего, см. editor). */
  onDeleteEmpty?: () => void;
}

const TYPE_LABEL: Record<ArticleBodyBlockType, { label: string; icon: LucideIcon }> = {
  h2: { label: "H2", icon: Heading3 },
  h3: { label: "H3", icon: Heading3 },
  h4: { label: "H4", icon: Heading4 },
  paragraph: { label: "Параграф", icon: Pilcrow },
  quote: { label: "Цитата", icon: Quote },
  image: { label: "Image", icon: Pilcrow },
  gallery: { label: "Gallery", icon: Pilcrow },
  video: { label: "Video", icon: Pilcrow },
  table: { label: "Table", icon: Pilcrow },
  list: { label: "List", icon: Pilcrow },
  callout: { label: "Callout", icon: Pilcrow },
};

export function ArticleBodyTextarea({
  value,
  onChange,
  placeholder,
  blockType,
  textClassName = "",
  focus,
  onChangeType,
  onSplit,
  onDeleteEmpty,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [selRange, setSelRange] = useState<{ start: number; end: number } | null>(null);
  const [focused, setFocused] = useState(false);
  // Tools внутри toolbar могут открывать поповеры (BlockTypeTrigger → DropdownMenu);
  // когда попвер активен — textarea теряет фокус, и без этого флага toolbar бы
  // размонтировался до того, как dropdown успеет отрендериться.
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const toolbarVisible = focused || typeMenuOpen;

  const supportsInline = blockType === "paragraph";

  // Перевод фокуса по запросу снаружи. Срабатывает каждый раз при изменении
  // `focus.nonce` — даже если DOM-узел textarea не пересоздаётся (нужно для
  // фокуса соседнего блока после backspace-удаления).
  useLayoutEffect(() => {
    if (!focus) return;
    const el = taRef.current;
    if (!el) return;
    el.focus();
    if (focus.position === "end") {
      const end = value.length;
      el.setSelectionRange(end, end);
    } else {
      el.setSelectionRange(0, 0);
    }
    // value специально не в deps — фокус инициируется нонсом.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.nonce]);

  const updateSel = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    setSelRange(start !== end ? { start, end } : null);
  }, []);

  const wrapSelection = useCallback(
    (left: string, right = left) => {
      if (!selRange) return;
      const { start, end } = selRange;
      const selected = value.slice(start, end);
      const next = value.slice(0, start) + left + selected + right + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        const el = taRef.current;
        if (!el) return;
        el.focus();
        const s = start + left.length;
        const e = end + left.length;
        el.setSelectionRange(s, e);
        setSelRange({ start: s, end: e });
      });
    },
    [selRange, value, onChange],
  );

  const insertNbsp = useCallback(() => {
    if (!selRange) return;
    const { start, end } = selRange;
    const replaced = value.slice(start, end).replace(/ /g, NBSP);
    const next = value.slice(0, start) + replaced + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const el = taRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(start, start + replaced.length);
    });
  }, [selRange, value, onChange]);

  const insertNewline = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const next = value.slice(0, pos) + "\n" + value.slice(pos);
    onChange(next);
    requestAnimationFrame(() => {
      const t = taRef.current;
      if (!t) return;
      t.focus();
      t.setSelectionRange(pos + 1, pos + 1);
    });
  }, [value, onChange]);

  const insertLink = useCallback(() => {
    if (!selRange) return;
    const { start, end } = selRange;
    const selected = value.slice(start, end) || "текст";
    const url = window.prompt("URL ссылки", "https://");
    if (!url) return;
    const replacement = `[${selected}](${url})`;
    const next = value.slice(0, start) + replacement + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const el = taRef.current;
      if (!el) return;
      el.focus();
      const s = start + 1;
      const e = s + selected.length;
      el.setSelectionRange(s, e);
    });
  }, [selRange, value, onChange]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Backspace в пустом блоке → удалить блок, фокус к предыдущему.
    if (e.key === "Backspace" && value === "" && onDeleteEmpty) {
      e.preventDefault();
      onDeleteEmpty();
      return;
    }

    if (supportsInline && (e.metaKey || e.ctrlKey)) {
      const key = e.key.toLowerCase();
      if (key === "b" && selRange) {
        e.preventDefault();
        wrapSelection("**");
        return;
      }
      if (key === "i" && selRange) {
        e.preventDefault();
        wrapSelection("*");
        return;
      }
      if (key === "k" && selRange) {
        e.preventDefault();
        insertLink();
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      const el = taRef.current;
      if (!el) return;
      const pos = el.selectionStart;
      const before = value.slice(0, pos);
      const after = value.slice(el.selectionEnd);
      const lineStart = before.lastIndexOf("\n") + 1;
      const currentLine = before.slice(lineStart);
      const cont = continueListPrefix(currentLine);

      // В продолжении списка — Enter продолжает список (поведение "как было").
      if (cont) {
        e.preventDefault();
        let newVal: string;
        let caret: number;
        if (cont.clearCurrent) {
          newVal = before.slice(0, lineStart) + "\n" + after;
          caret = lineStart + 1;
        } else {
          const insert = "\n" + cont.next;
          newVal = before + insert + after;
          caret = pos + insert.length;
        }
        onChange(newVal);
        requestAnimationFrame(() => {
          const t = taRef.current;
          if (!t) return;
          t.focus();
          t.setSelectionRange(caret, caret);
        });
        return;
      }

      // Вне списка и есть обработчик сплита — создаём новый параграф ниже.
      // Shift+Enter (попал бы в условие выше) — по-прежнему soft-break (\n).
      if (onSplit) {
        e.preventDefault();
        onSplit(before, after);
      }
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative min-h-[1.4em] w-full">
        {/* Overlay: задаёт высоту контейнера и подсвечивает NBSP при фокусе */}
        <div
          aria-hidden
          className={`pointer-events-none whitespace-pre-wrap break-words text-transparent ${textClassName}`}
        >
          {value.split("").map((ch, i) =>
            ch === NBSP ? (
              <span
                key={i}
                className={
                  focused
                    ? "rounded-sm bg-[var(--rm-violet-100)]/25 text-[var(--rm-violet-100)]"
                    : ""
                }
              >
                {focused ? "·" : NBSP}
              </span>
            ) : (
              <span key={i}>{ch}</span>
            ),
          )}
          {"​"}
        </div>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onSelect={updateSel}
          onKeyUp={updateSel}
          onMouseUp={updateSel}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={1}
          spellCheck={false}
          className={`absolute inset-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60 ${textClassName}`}
        />
      </div>

      {toolbarVisible && (
        <div
          className="absolute left-0 top-full z-30 mt-1 flex items-center gap-0.5 rounded-sm border border-border bg-popover px-1 py-1 shadow-md"
          onMouseDown={(e) => e.preventDefault()}
        >
          {onChangeType && (
            <>
              <BlockTypeTrigger
                blockType={blockType}
                onChangeType={onChangeType}
                open={typeMenuOpen}
                onOpenChange={setTypeMenuOpen}
              />
              <span className="mx-1 h-4 w-px bg-border" />
            </>
          )}
          {supportsInline && (
            <>
              <ListModeTabs
                mode={detectListMode(value)}
                onChange={(mode) => {
                  const next = transformLines(value, mode);
                  if (next !== value) onChange(next);
                }}
              />
              <span className="mx-1 h-4 w-px bg-border" />
              <ToolBtn
                disabled={!selRange}
                onClick={() => wrapSelection("**")}
                title="Жирный (Cmd/Ctrl+B)"
              >
                <Bold className="h-3 w-3" />
              </ToolBtn>
              <ToolBtn
                disabled={!selRange}
                onClick={() => wrapSelection("*")}
                title="Курсив (Cmd/Ctrl+I)"
              >
                <Italic className="h-3 w-3" />
              </ToolBtn>
              <ToolBtn
                disabled={!selRange}
                onClick={insertLink}
                title="Ссылка (Cmd/Ctrl+K)"
              >
                <LinkIcon className="h-3 w-3" />
              </ToolBtn>
              <span className="mx-1 h-4 w-px bg-border" />
            </>
          )}
          <ToolBtn
            disabled={!selRange}
            onClick={insertNbsp}
            title="Заменить пробелы в выделении на неразрывные"
          >
            нераз.&nbsp;пробел
          </ToolBtn>
          <ToolBtn onClick={insertNewline} title="Перенос строки внутри блока">
            <CornerDownLeft className="mr-1 h-3 w-3" /> перенос
          </ToolBtn>
        </div>
      )}
    </div>
  );
}

function BlockTypeTrigger({
  blockType,
  onChangeType,
  open,
  onOpenChange,
}: {
  blockType: ArticleBodyBlockType;
  onChangeType: (type: ArticleBodyBlockType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const meta = TYPE_LABEL[blockType];
  const Icon = meta.icon;
  return (
    <BlockTypeMenu
      open={open}
      onOpenChange={onOpenChange}
      onSelect={(type) => {
        onChangeType(type);
        onOpenChange(false);
      }}
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        title="Сменить тип блока (контент сохраняется)"
        className="flex h-6 items-center gap-1 rounded-sm px-1.5 text-[length:var(--text-11)] font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Icon className="h-3 w-3" />
        {meta.label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
    </BlockTypeMenu>
  );
}

function ListModeTabs({
  mode,
  onChange,
}: {
  mode: ListMode;
  onChange: (mode: ListMode) => void;
}) {
  return (
    <div className="flex items-center gap-0 rounded-sm bg-muted/60 p-0.5">
      <TabBtn active={mode === "none"} onClick={() => onChange("none")} title="Обычный текст">
        <Type className="h-3 w-3" />
      </TabBtn>
      <TabBtn active={mode === "bullet"} onClick={() => onChange("bullet")} title="Маркированный список">
        <List className="h-3 w-3" />
      </TabBtn>
      <TabBtn
        active={mode === "numbered"}
        onClick={() => onChange("numbered")}
        title="Нумерованный список"
      >
        <ListOrdered className="h-3 w-3" />
      </TabBtn>
    </div>
  );
}

function TabBtn({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`flex h-5 items-center justify-center rounded-sm px-1.5 text-[length:var(--text-11)] font-medium transition-colors ${
        active
          ? "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ToolBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      title={title}
      className="flex h-6 items-center justify-center rounded-sm px-1.5 text-[length:var(--text-11)] font-medium text-foreground transition-colors enabled:hover:bg-muted disabled:opacity-40"
    >
      {children}
    </button>
  );
}
