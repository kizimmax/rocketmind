"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { Input } from "@rocketmind/ui";

const NBSP = " ";

type NativeProps = React.ComponentProps<typeof Input>;

type Props = Omit<NativeProps, "value" | "onChange"> & {
  value: string;
  onChange: (next: string) => void;
};

/**
 * Input + кнопка вставки неразрывного пробела (U+00A0) в позицию курсора.
 * Используется для полей H1 prefix/accent на tag-страницах и категориях
 * каталога, чтобы вёрстка короткой части заголовка не разъезжалась
 * («Все продукты», «AI продукты» и т.п.).
 */
export const NbspInput = forwardRef<HTMLInputElement, Props>(
  function NbspInput({ value, onChange, ...rest }, externalRef) {
    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(externalRef, () => innerRef.current!);

    function insertNbsp() {
      const el = innerRef.current;
      if (!el) {
        onChange((value ?? "") + NBSP);
        return;
      }
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      const next = value.slice(0, start) + NBSP + value.slice(end);
      onChange(next);
      // Восстанавливаем позицию курсора после re-render.
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + 1;
        el.setSelectionRange(pos, pos);
      });
    }

    return (
      <div className="relative">
        <Input
          ref={innerRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-9"
          {...rest}
        />
        <button
          type="button"
          onClick={insertNbsp}
          tabIndex={-1}
          aria-label="Вставить неразрывный пробел"
          title="Вставить неразрывный пробел (U+00A0)"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono text-[length:var(--text-10)] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          нп
        </button>
      </div>
    );
  },
);
