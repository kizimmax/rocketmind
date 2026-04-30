"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import { Input, Textarea, cn } from "@rocketmind/ui";

type InputProps = ComponentProps<typeof Input>;
type TextareaProps = ComponentProps<typeof Textarea>;

const NBSP = " ";

function insertNbspAtCursor(
  el: HTMLInputElement | HTMLTextAreaElement,
  current: string,
  onChange: (next: string) => void,
) {
  const start = el.selectionStart ?? current.length;
  const end = el.selectionEnd ?? start;
  const next = current.slice(0, start) + NBSP + current.slice(end);
  onChange(next);
  requestAnimationFrame(() => {
    el.focus();
    el.selectionStart = el.selectionEnd = start + 1;
  });
}

function handleNbspKey(
  e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  current: string,
  onChange: (next: string) => void,
) {
  if (e.shiftKey && e.key === " " && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    insertNbspAtCursor(e.currentTarget, current, onChange);
  }
}

// Dummy export to not break cta-panel.tsx before we fix it
export function VisualizedNbsp({ value }: { value: string }) {
  return null;
}

function NbspOverlay({
  value,
  focused,
  selRange,
  selSpanRef,
}: {
  value: string;
  focused: boolean;
  selRange: { start: number; end: number } | null;
  selSpanRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const renderChars = (str: string) =>
    str.split("").map((ch, i) =>
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
      )
    );

  if (!selRange) {
    return <>{renderChars(value)}</>;
  }

  return (
    <>
      {renderChars(value.slice(0, selRange.start))}
      <span ref={selSpanRef}>{renderChars(value.slice(selRange.start, selRange.end))}</span>
      {renderChars(value.slice(selRange.end))}
    </>
  );
}

// ── NbspInput ──────────────────────────────────────────────────────────────

type NbspInputProps = Omit<InputProps, "onChange" | "value"> & {
  value: string;
  onChange: (next: string) => void;
  showPreview?: boolean;
};

export const NbspInput = forwardRef<HTMLInputElement, NbspInputProps>(
  function NbspInput(
    { value, onChange, onKeyDown, onFocus, onBlur, onSelect, onKeyUp, onMouseUp, onScroll, className, showPreview, ...rest },
    ref,
  ) {
    const innerRef = useRef<HTMLInputElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const selSpanRef = useRef<HTMLSpanElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const [focused, setFocused] = useState(false);
    const [selRange, setSelRange] = useState<{ start: number; end: number } | null>(null);
    const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({});

    const updateSel = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== null && end !== null && start !== end) {
        setSelRange({ start, end });
      } else {
        setSelRange(null);
      }
    }, []);

    useEffect(() => {
      if (selRange && selSpanRef.current && overlayRef.current) {
        const span = selSpanRef.current;
        setBtnStyle({
          top: span.offsetTop - 34, // 34px above the text
          left: span.offsetLeft + span.offsetWidth / 2, // centered horizontally
          transform: "translateX(-50%)",
        });
      }
    }, [selRange, value]);

    const replaceSpacesWithNbsp = () => {
      if (!selRange || !innerRef.current) return;
      const { start, end } = selRange;
      const selected = value.slice(start, end);
      const replaced = selected.replace(/ /g, NBSP);
      const next = value.slice(0, start) + replaced + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        const el = innerRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(start, start + replaced.length);
          setSelRange({ start, end: start + replaced.length });
        }
      });
    };

    return (
      <div className="relative w-full">
        <Input
          ref={innerRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            handleNbspKey(e, value, onChange);
            onKeyDown?.(e);
          }}
          onSelect={(e) => { updateSel(); onSelect?.(e); }}
          onKeyUp={(e) => { updateSel(); onKeyUp?.(e); }}
          onMouseUp={(e) => { updateSel(); onMouseUp?.(e); }}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onScroll={(e) => {
            if (overlayRef.current) {
              overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
            }
            onScroll?.(e);
          }}
          className={cn("relative z-0", className)}
          {...rest}
        />
        <div
          ref={overlayRef}
          aria-hidden
          className={cn(
            className,
            "absolute inset-0 z-10 pointer-events-none !text-transparent !bg-transparent !border-transparent !shadow-none overflow-hidden whitespace-pre"
          )}
        >
          <NbspOverlay value={value} focused={focused} selRange={selRange} selSpanRef={selSpanRef} />
        </div>
        
        {focused && selRange && (
          <div
            className="absolute z-30 pointer-events-auto"
            style={btnStyle}
            onMouseDown={(e) => e.preventDefault()} // Keep focus on input
          >
            <button
              type="button"
              onClick={replaceSpacesWithNbsp}
              title="Заменить пробелы в выделении на неразрывные"
              className="flex h-6 items-center justify-center rounded-sm border border-border bg-popover px-1.5 text-[length:var(--text-11)] font-medium text-foreground shadow-md transition-colors hover:bg-muted"
            >
              нераз.&nbsp;пробел
            </button>
          </div>
        )}
      </div>
    );
  },
);

// ── NbspTextarea ───────────────────────────────────────────────────────────

type NbspTextareaProps = Omit<TextareaProps, "onChange" | "value"> & {
  value: string;
  onChange: (next: string) => void;
  showPreview?: boolean;
};

export const NbspTextarea = forwardRef<HTMLTextAreaElement, NbspTextareaProps>(
  function NbspTextarea(
    { value, onChange, onKeyDown, onFocus, onBlur, onSelect, onKeyUp, onMouseUp, onScroll, className, showPreview, ...rest },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const selSpanRef = useRef<HTMLSpanElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const [focused, setFocused] = useState(false);
    const [selRange, setSelRange] = useState<{ start: number; end: number } | null>(null);
    const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({});

    const updateSel = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== null && end !== null && start !== end) {
        setSelRange({ start, end });
      } else {
        setSelRange(null);
      }
    }, []);

    useEffect(() => {
      if (selRange && selSpanRef.current && overlayRef.current) {
        const span = selSpanRef.current;
        setBtnStyle({
          top: span.offsetTop - 34,
          left: span.offsetLeft + span.offsetWidth / 2,
          transform: "translateX(-50%)",
        });
      }
    }, [selRange, value]);

    const replaceSpacesWithNbsp = () => {
      if (!selRange || !innerRef.current) return;
      const { start, end } = selRange;
      const selected = value.slice(start, end);
      const replaced = selected.replace(/ /g, NBSP);
      const next = value.slice(0, start) + replaced + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        const el = innerRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(start, start + replaced.length);
          setSelRange({ start, end: start + replaced.length });
        }
      });
    };

    return (
      <div className="relative w-full">
        <Textarea
          ref={innerRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            handleNbspKey(e, value, onChange);
            onKeyDown?.(e);
          }}
          onSelect={(e) => { updateSel(); onSelect?.(e); }}
          onKeyUp={(e) => { updateSel(); onKeyUp?.(e); }}
          onMouseUp={(e) => { updateSel(); onMouseUp?.(e); }}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onScroll={(e) => {
            if (overlayRef.current) {
              overlayRef.current.scrollTop = e.currentTarget.scrollTop;
              overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
            }
            onScroll?.(e);
          }}
          className={cn("relative z-0", className)}
          {...rest}
        />
        <div
          ref={overlayRef}
          aria-hidden
          className={cn(
            className,
            "absolute inset-0 z-10 pointer-events-none !text-transparent !bg-transparent !border-transparent !shadow-none overflow-hidden whitespace-pre-wrap break-words"
          )}
        >
          <NbspOverlay value={value} focused={focused} selRange={selRange} selSpanRef={selSpanRef} />
        </div>

        {focused && selRange && (
          <div
            className="absolute z-30 pointer-events-auto"
            style={btnStyle}
            onMouseDown={(e) => e.preventDefault()}
          >
            <button
              type="button"
              onClick={replaceSpacesWithNbsp}
              title="Заменить пробелы в выделении на неразрывные"
              className="flex h-6 items-center justify-center rounded-sm border border-border bg-popover px-1.5 text-[length:var(--text-11)] font-medium text-foreground shadow-md transition-colors hover:bg-muted"
            >
              нераз.&nbsp;пробел
            </button>
          </div>
        )}
      </div>
    );
  },
);
