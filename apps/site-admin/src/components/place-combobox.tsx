"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";

type Place = { id: string; name: string };

type Props = {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function PlaceCombobox({ value, onChange, placeholder, autoFocus }: Props) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch("/api/places")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Place[]) => setPlaces(rows))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, []);

  const q = value.trim().toLowerCase();
  const filtered = q
    ? places.filter((p) => p.name.toLowerCase().includes(q))
    : places;
  const showCreateHint =
    !!q && !places.some((p) => p.name.toLowerCase() === q);

  return (
    <div ref={rootRef} className="relative">
      <Input
        size="sm"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder ?? "Например: Москва, БЦ Меркурий"}
        autoFocus={autoFocus}
      />
      {open && (filtered.length > 0 || showCreateHint) && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-60 overflow-auto rounded-sm border border-border bg-popover p-1 shadow-md">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChange(p.name);
                setOpen(false);
              }}
              className="block w-full rounded-sm px-2 py-1.5 text-left text-[length:var(--text-12)] text-popover-foreground hover:bg-rm-gray-1"
            >
              {p.name}
            </button>
          ))}
          {showCreateHint && (
            <div className="px-2 py-1.5 text-[length:var(--text-11)] text-muted-foreground">
              Новое место: «{value.trim()}» — сохранится при создании
            </div>
          )}
        </div>
      )}
    </div>
  );
}
