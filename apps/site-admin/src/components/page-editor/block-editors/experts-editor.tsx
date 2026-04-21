"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState, useRef } from "react";
import { GripVertical, Search, Plus, X, UserCircle } from "lucide-react";
import { MdText } from "@/components/md-text";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import { useItemDnd } from "@/lib/use-item-dnd";

// ── Types ──────────────────────────────────────────────────────────────────────

type ExpertInfo = {
  slug: string;
  name: string;
  tag: string;
  shortBio: string;
  bio: string;
  image: string | null;
};

interface ExpertsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

// ── Circle pattern SVG (matches the UI component) ────────────────────────────

function CirclePattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 698 349" fill="none" className={className} preserveAspectRatio="xMidYMid meet">
      <circle cx="137.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="277.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="417.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="557.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="137.5" cy="244.5" r="88" stroke="#404040" />
      <circle cx="417.5" cy="244.5" r="88" stroke="#404040" />
      <circle cx="277.5" cy="244.5" r="88" stroke="#404040" />
      <circle cx="557.5" cy="244.5" r="88" stroke="#404040" />
    </svg>
  );
}

// ── Expert Selector Dropdown ─────────────────────────────────────────────────

function ExpertSelector({
  onSelect,
  excludeSlugs,
}: {
  onSelect: (slug: string) => void;
  excludeSlugs: string[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [experts, setExperts] = useState<ExpertInfo[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    apiFetch("/api/experts")
      .then((r) => r.json())
      .then(setExperts)
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = experts
    .filter((e) => !excludeSlugs.includes(e.slug))
    .filter(
      (e) =>
        !query ||
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.slug.toLowerCase().includes(query.toLowerCase()),
    );

  async function createExpert() {
    if (!newName.trim()) return;
    const slug = newName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zа-яё0-9-]/gi, "");
    try {
      const res = await apiFetch("/api/experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: newName.trim() }),
      });
      if (res.ok) {
        onSelect(slug);
        setOpen(false);
        setCreating(false);
        setNewName("");
      }
    } catch {}
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-center gap-2 rounded border border-dashed border-[#404040] bg-[#121212] px-6 py-10 text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00] cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase tracking-[0.02em]">
          Добавить эксперта
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded border border-[#404040] bg-[#1a1a1a] shadow-xl">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-[#404040] px-3 py-2">
            <Search className="h-4 w-4 text-[#939393]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти эксперта..."
              className="flex-1 bg-transparent text-sm text-[#F0F0F0] outline-none placeholder:text-[#939393]"
              autoFocus
            />
          </div>

          {/* List */}
          <div className="max-h-[240px] overflow-auto">
            {filtered.map((expert) => (
              <button
                key={expert.slug}
                type="button"
                onClick={() => {
                  onSelect(expert.slug);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#2a2a2a] cursor-pointer"
              >
                {expert.image ? (
                  <div
                    className="h-8 w-8 shrink-0 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${expert.image})` }}
                  />
                ) : (
                  <UserCircle className="h-8 w-8 shrink-0 text-[#404040]" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#F0F0F0]">{expert.name}</span>
                  <span className="text-xs text-[#939393]">{expert.tag}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && !creating && (
              <div className="px-3 py-4 text-center text-sm text-[#939393]">
                Нет результатов
              </div>
            )}
          </div>

          {/* Create new */}
          <div className="border-t border-[#404040]">
            {!creating ? (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[#FFCC00] hover:bg-[#2a2a2a] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Создать нового эксперта
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Имя Фамилия"
                  className="flex-1 rounded bg-[#2a2a2a] px-2 py-1.5 text-sm text-[#F0F0F0] outline-none placeholder:text-[#939393]"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && createExpert()}
                />
                <button
                  type="button"
                  onClick={createExpert}
                  className="rounded bg-[#FFCC00] px-3 py-1.5 text-xs font-medium text-[#0A0A0A] cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => { setCreating(false); setNewName(""); }}
                  className="text-[#939393] hover:text-[#F0F0F0] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Desktop-style Expert Card Preview ────────────────────────────────────────

function ExpertCardPreview({
  expert,
  index,
  dnd,
  onRemove,
}: {
  expert: ExpertInfo;
  index: number;
  dnd: ReturnType<typeof useItemDnd<string>>;
  onRemove: () => void;
}) {
  const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
    dnd.itemProps(index);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group/card relative flex gap-8 bg-[#121212] p-8 h-[349px] transition-all ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      {/* Drag & delete controls */}
      <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
        <div
          className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] select-none active:cursor-grabbing"
          onMouseDown={() => dnd.onGripDown(index)}
          onMouseUp={dnd.onGripUp}
        >
          <GripVertical className="h-2.5 w-2.5" />
        </div>
        <ItemMoveButtons index={index} count={dnd.count} onMove={dnd.move} />
        <InlineConfirmDelete
          onConfirm={onRemove}
          className="bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#ED4843]"
        />
      </div>

      {/* Photo */}
      <div className="flex-1 shrink-0 bg-[#2a2a2a] bg-cover bg-center" style={expert.image ? { backgroundImage: `url(${expert.image})` } : undefined}>
        {!expert.image && (
          <div className="flex h-full items-center justify-center">
            <UserCircle className="h-16 w-16 text-[#404040]" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-2">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
          {expert.tag || "Эксперт продукта"}
        </span>
        <div className="flex flex-1 flex-col gap-6">
          <h3 className="h3 text-[#F0F0F0]">{expert.name || "Имя Фамилия"}</h3>
          <div className="flex flex-1 items-end">
            <MdText
              value={expert.bio}
              placeholder="Биография эксперта"
              className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Editor ──────────────────────────────────────────────────────────────

export function ExpertsEditor({ data, onUpdate }: ExpertsEditorProps) {
  const slugs = (data.experts as string[]) || [];
  const [resolvedExperts, setResolvedExperts] = useState<ExpertInfo[]>([]);

  const dnd = useItemDnd(slugs, (reordered) => onUpdate({ experts: reordered }));

  // Fetch expert data for all slugs
  useEffect(() => {
    if (slugs.length === 0) {
      setResolvedExperts([]);
      return;
    }
    apiFetch("/api/experts")
      .then((r) => r.json())
      .then((all: ExpertInfo[]) => {
        const map = new Map(all.map((e) => [e.slug, e]));
        setResolvedExperts(
          slugs
            .map((s) => map.get(s))
            .filter(Boolean) as ExpertInfo[],
        );
      })
      .catch(() => {});
  }, [slugs.join(",")]);

  function addExpert(slug: string) {
    onUpdate({ experts: [...slugs, slug] });
  }

  function removeExpert(index: number) {
    onUpdate({ experts: slugs.filter((_, i) => i !== index) });
  }

  const isOdd = resolvedExperts.length % 2 !== 0;

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-8 xl:px-14">
        {/* Desktop-like 2-column grid */}
        <div className="grid grid-cols-2 gap-1 mb-4">
          {resolvedExperts.map((expert, index) => (
            <ExpertCardPreview
              key={expert.slug}
              expert={expert}
              index={index}
              dnd={dnd}
              onRemove={() => removeExpert(index)}
            />
          ))}
          {isOdd && (
            <div className="flex items-center justify-center h-[349px] p-4">
              <CirclePattern className="w-full h-full" />
            </div>
          )}
        </div>

        {/* Selector */}
        <ExpertSelector onSelect={addExpert} excludeSlugs={slugs} />
      </div>
    </div>
  );
}
