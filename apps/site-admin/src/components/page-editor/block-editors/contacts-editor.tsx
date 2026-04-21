"use client";

import { useEffect, useRef, useState } from "react";
import {
  GripVertical,
  Plus,
  Search,
  Upload,
  UserCircle,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { InlineEdit } from "@/components/inline-edit";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import { InsertButton } from "@/components/insert-button";
import { ParagraphsEditor, paragraphClassName, type StyledParagraph } from "@/components/paragraphs-editor";
import { useItemDnd } from "@/lib/use-item-dnd";
import { VkIcon, TelegramIcon } from "@rocketmind/ui";
import type {
  ContactCard,
  ContactCardItem,
  ContactCardPerson,
  ContactSocial,
  ContactSocialKind,
} from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────────

type ExpertInfo = {
  slug: string;
  name: string;
  tag: string;
  shortBio: string;
  bio: string;
  image: string | null;
};

interface ContactsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const rid = () => Math.random().toString(36).slice(2, 10);

// ── Icon helpers ──────────────────────────────────────────────────────────────

function SocialIconPreview({
  kind,
  iconSrc,
  className,
}: {
  kind: ContactSocialKind;
  iconSrc?: string;
  className?: string;
}) {
  if (kind === "vk") return <VkIcon className={className} />;
  if (kind === "telegram") return <TelegramIcon className={className} />;
  if (!iconSrc) {
    return (
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-sm border border-dashed border-current ${className ?? ""}`}
      >
        <Upload className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-sm border border-current ${className ?? ""}`}
    >
      <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
    </span>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Expert picker (reused from experts-editor) ────────────────────────────────

function ExpertPicker({
  selected,
  onSelect,
  onClear,
}: {
  selected?: ExpertInfo | null;
  onSelect: (slug: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [experts, setExperts] = useState<ExpertInfo[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    apiFetch("/api/experts")
      .then((r) => r.json())
      .then(setExperts)
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = experts.filter(
    (e) =>
      !query ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.slug.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      {selected ? (
        <div className="flex items-center gap-3 rounded border border-[#404040] bg-[#121212] px-3 py-2">
          {selected.image ? (
            <div
              className="h-10 w-10 shrink-0 rounded-sm bg-cover bg-center"
              style={{ backgroundImage: `url(${selected.image})` }}
            />
          ) : (
            <UserCircle className="h-10 w-10 shrink-0 text-[#404040]" />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-medium text-[#F0F0F0]">{selected.name}</span>
            <span className="truncate text-xs text-[#939393]">{selected.tag}</span>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-[#939393] hover:text-[#F0F0F0] cursor-pointer"
            title="Убрать эксперта"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-2 rounded border border-dashed border-[#404040] bg-[#121212] px-3 py-2 text-[#939393] hover:border-[#FFCC00] hover:text-[#FFCC00] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Выбрать эксперта (аватар + имя + роль)</span>
        </button>
      )}

      {open && !selected && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded border border-[#404040] bg-[#1a1a1a] shadow-xl">
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
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-[#939393]">Нет результатов</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Social editor (inline row of icons + fields) ──────────────────────────────

function SocialEditor({
  social,
  onChange,
  onRemove,
}: {
  social: ContactSocial;
  onChange: (next: ContactSocial) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onChange({ ...social, iconSrc: dataUrl });
    e.target.value = "";
  }

  return (
    <div className="flex items-start gap-2 rounded border border-[#404040] bg-[#121212] p-2">
      {/* Icon preview / kind selector */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-[#F0F0F0]">
          <SocialIconPreview kind={social.kind} iconSrc={social.iconSrc} />
        </div>
        <div className="flex gap-0.5">
          {(["vk", "telegram", "custom"] as ContactSocialKind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onChange({ ...social, kind: k })}
              className={`rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                social.kind === k
                  ? "bg-[#FFCC00] text-[#0A0A0A]"
                  : "bg-[#2a2a2a] text-[#939393] hover:text-[#F0F0F0]"
              }`}
            >
              {k === "vk" ? "ВК" : k === "telegram" ? "TG" : "свой"}
            </button>
          ))}
        </div>
        {social.kind === "custom" && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/svg+xml,image/png"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] uppercase tracking-wider text-[#939393] hover:text-[#FFCC00] cursor-pointer"
            >
              {social.iconSrc ? "заменить" : "загрузить"}
            </button>
          </>
        )}
      </div>

      {/* Fields */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <input
          type="text"
          value={social.username}
          onChange={(e) => onChange({ ...social, username: e.target.value })}
          placeholder={
            social.kind === "telegram"
              ? "никнейм (без @)"
              : social.kind === "vk"
                ? "никнейм (vk.com/...)"
                : "никнейм для тултипа"
          }
          className="rounded bg-[#2a2a2a] px-2 py-1.5 text-sm text-[#F0F0F0] outline-none placeholder:text-[#939393]"
        />
        <input
          type="text"
          value={social.url}
          onChange={(e) => onChange({ ...social, url: e.target.value })}
          placeholder="Ссылка на соцсеть (https://...)"
          className="rounded bg-[#2a2a2a] px-2 py-1.5 text-sm text-[#F0F0F0] outline-none placeholder:text-[#939393]"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        title="Удалить"
        className="text-[#939393] hover:text-[#ED4843] cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function newSocial(kind: ContactSocialKind = "telegram"): ContactSocial {
  return { id: rid(), kind, username: "", url: "" };
}

// ── Item renderers ────────────────────────────────────────────────────────────

function ParagraphItemEditor({
  item,
  onChange,
}: {
  item: Extract<ContactCardItem, { kind: "paragraph" }>;
  onChange: (next: Extract<ContactCardItem, { kind: "paragraph" }>) => void;
}) {
  const previewClass = paragraphClassName(item.paragraph, { theme: "light", size: "16" });
  return (
    <InlineEdit
      value={item.paragraph.text}
      onSave={(v) => onChange({ ...item, paragraph: { ...item.paragraph, text: v } })}
      multiline
      placeholder="Абзац..."
    >
      <div className={`${previewClass} max-w-[480px]`}>
        {item.paragraph.text || "Абзац..."}
      </div>
    </InlineEdit>
  );
}

function SocialsItemEditor({
  item,
  onChange,
}: {
  item: Extract<ContactCardItem, { kind: "socials" }>;
  onChange: (next: Extract<ContactCardItem, { kind: "socials" }>) => void;
}) {
  function updateSocial(idx: number, next: ContactSocial) {
    onChange({ ...item, socials: item.socials.map((s, i) => (i === idx ? next : s)) });
  }
  function removeSocial(idx: number) {
    onChange({ ...item, socials: item.socials.filter((_, i) => i !== idx) });
  }
  function addSocial() {
    const usedKinds = new Set(item.socials.map((s) => s.kind));
    const nextKind: ContactSocialKind = !usedKinds.has("telegram")
      ? "telegram"
      : !usedKinds.has("vk")
        ? "vk"
        : "custom";
    onChange({ ...item, socials: [...item.socials, newSocial(nextKind)] });
  }

  return (
    <div className="flex flex-col gap-2">
      {item.socials.map((social, idx) => (
        <SocialEditor
          key={social.id}
          social={social}
          onChange={(next) => updateSocial(idx, next)}
          onRemove={() => removeSocial(idx)}
        />
      ))}
      <button
        type="button"
        onClick={addSocial}
        className="flex items-center justify-center gap-1.5 rounded border border-dashed border-[#404040] bg-[#121212] px-3 py-1.5 text-xs uppercase tracking-wider text-[#939393] hover:border-[#FFCC00] hover:text-[#FFCC00] cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        Соцсеть
      </button>
    </div>
  );
}

function PersonItemEditor({
  item,
  onChange,
}: {
  item: Extract<ContactCardItem, { kind: "person" }>;
  onChange: (next: Extract<ContactCardItem, { kind: "person" }>) => void;
}) {
  const [resolved, setResolved] = useState<ExpertInfo | null>(null);

  useEffect(() => {
    const slug = item.person.expertSlug;
    if (!slug) {
      setResolved(null);
      return;
    }
    apiFetch("/api/experts")
      .then((r) => r.json())
      .then((all: ExpertInfo[]) => setResolved(all.find((e) => e.slug === slug) ?? null))
      .catch(() => {});
  }, [item.person.expertSlug]);

  function patch(p: Partial<ContactCardPerson>) {
    onChange({ ...item, person: { ...item.person, ...p } });
  }

  const social = item.person.social;

  return (
    <div className="flex flex-col gap-2 rounded border border-[#404040] bg-[#121212] p-2">
      <ExpertPicker
        selected={resolved}
        onSelect={(slug) => patch({ expertSlug: slug })}
        onClear={() => patch({ expertSlug: undefined })}
      />

      <input
        type="text"
        value={item.person.phone ?? ""}
        onChange={(e) => patch({ phone: e.target.value })}
        placeholder="Номер телефона (+7 ...)"
        className="rounded bg-[#2a2a2a] px-2 py-1.5 text-sm text-[#F0F0F0] outline-none placeholder:text-[#939393]"
      />

      {social ? (
        <div className="flex flex-col gap-1 rounded border border-[#2a2a2a] bg-[#0a0a0a] p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#939393]">Соцсеть</span>
            <button
              type="button"
              onClick={() => patch({ social: undefined })}
              className="text-[#939393] hover:text-[#ED4843] cursor-pointer"
              title="Убрать соцсеть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SocialEditor
            social={{ id: "person-social", ...social }}
            onChange={(next) =>
              patch({
                social: {
                  kind: next.kind,
                  iconSrc: next.iconSrc,
                  username: next.username,
                  url: next.url,
                },
              })
            }
            onRemove={() => patch({ social: undefined })}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            patch({ social: { kind: "telegram", username: "", url: "" } })
          }
          className="flex items-center justify-center gap-1.5 rounded border border-dashed border-[#404040] bg-[#121212] px-3 py-1.5 text-xs uppercase tracking-wider text-[#939393] hover:border-[#FFCC00] hover:text-[#FFCC00] cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Соцсеть / мессенджер
        </button>
      )}
    </div>
  );
}

function CardItemEditor({
  item,
  onChange,
  onRemove,
  index,
  dnd,
}: {
  item: ContactCardItem;
  onChange: (next: ContactCardItem) => void;
  onRemove: () => void;
  index: number;
  dnd: ReturnType<typeof useItemDnd<ContactCardItem>>;
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
      className={`group/item relative ${isDragging ? "opacity-60" : ""}`}
    >
      <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/item:opacity-100">
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

      {item.kind === "paragraph" && (
        <ParagraphItemEditor
          item={item}
          onChange={(next) => onChange(next)}
        />
      )}
      {item.kind === "socials" && (
        <SocialsItemEditor item={item} onChange={(next) => onChange(next)} />
      )}
      {item.kind === "person" && (
        <PersonItemEditor item={item} onChange={(next) => onChange(next)} />
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function CardEditor({
  card,
  index,
  dnd,
  onChange,
  onRemove,
}: {
  card: ContactCard;
  index: number;
  dnd: ReturnType<typeof useItemDnd<ContactCard>>;
  onChange: (next: ContactCard) => void;
  onRemove: () => void;
}) {
  const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
    dnd.itemProps(index);

  const itemsDnd = useItemDnd(card.items, (reordered) => onChange({ ...card, items: reordered }));

  function updateItem(idx: number, next: ContactCardItem) {
    onChange({ ...card, items: card.items.map((it, i) => (i === idx ? next : it)) });
  }

  function removeItem(idx: number) {
    onChange({ ...card, items: card.items.filter((_, i) => i !== idx) });
  }

  function addParagraph() {
    const it: ContactCardItem = {
      id: rid(),
      kind: "paragraph",
      paragraph: { text: "", color: "secondary" },
    };
    onChange({ ...card, items: [...card.items, it] });
  }
  function addSocials() {
    const it: ContactCardItem = {
      id: rid(),
      kind: "socials",
      socials: [newSocial("telegram"), newSocial("vk")],
    };
    onChange({ ...card, items: [...card.items, it] });
  }
  function addPerson() {
    const it: ContactCardItem = {
      id: rid(),
      kind: "person",
      person: {},
    };
    onChange({ ...card, items: [...card.items, it] });
  }

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group/card relative flex min-w-0 flex-1 flex-col gap-4 transition-all ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      {/* Card controls */}
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

      {/* Title */}
      <div className="flex items-end">
        <InlineEdit
          value={card.title}
          onSave={(v) => onChange({ ...card, title: v })}
          placeholder="Заголовок карточки"
        >
          <span className="h4 text-[#0A0A0A]">{card.title || "Заголовок"}</span>
        </InlineEdit>
      </div>
      <div className="h-0 w-full border-t border-[#404040]" />

      {/* Items */}
      <div className="flex flex-col gap-3">
        {card.items.map((item, idx) => (
          <CardItemEditor
            key={item.id}
            item={item}
            onChange={(next) => updateItem(idx, next)}
            onRemove={() => removeItem(idx)}
            index={idx}
            dnd={itemsDnd}
          />
        ))}
      </div>

      {/* Add-item buttons */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={addParagraph}
          className="flex items-center gap-1 rounded border border-dashed border-[#404040] bg-[#F0F0F0] px-2 py-1 text-[11px] uppercase tracking-wider text-[#404040] hover:border-[#0A0A0A] hover:text-[#0A0A0A] cursor-pointer"
        >
          <Plus className="h-3 w-3" /> Абзац
        </button>
        <button
          type="button"
          onClick={addSocials}
          className="flex items-center gap-1 rounded border border-dashed border-[#404040] bg-[#F0F0F0] px-2 py-1 text-[11px] uppercase tracking-wider text-[#404040] hover:border-[#0A0A0A] hover:text-[#0A0A0A] cursor-pointer"
        >
          <Plus className="h-3 w-3" /> Соцсети
        </button>
        <button
          type="button"
          onClick={addPerson}
          className="flex items-center gap-1 rounded border border-dashed border-[#404040] bg-[#F0F0F0] px-2 py-1 text-[11px] uppercase tracking-wider text-[#404040] hover:border-[#0A0A0A] hover:text-[#0A0A0A] cursor-pointer"
        >
          <Plus className="h-3 w-3" /> Контакт-персона
        </button>
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export function ContactsEditor({ data, onUpdate }: ContactsEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const paragraphs = (data.paragraphs as StyledParagraph[] | undefined) ?? [];
  const cards = ((data.cards as ContactCard[] | undefined) ?? []).map((c) => ({
    id: c.id ?? rid(),
    title: c.title ?? "",
    items: (c.items ?? []).map((it) => ({ ...it, id: it.id ?? rid() })),
  }));

  function setCards(next: ContactCard[]) {
    onUpdate({ cards: next });
  }

  const dnd = useItemDnd(cards, (reordered) => setCards(reordered));

  function updateCard(idx: number, next: ContactCard) {
    setCards(cards.map((c, i) => (i === idx ? next : c)));
  }
  function removeCard(idx: number) {
    setCards(cards.filter((_, i) => i !== idx));
  }
  function insertCard(atIndex: number) {
    const fresh: ContactCard = { id: rid(), title: "", items: [] };
    const next = [...cards];
    next.splice(atIndex, 0, fresh);
    setCards(next);
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#F0F0F0] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-8 xl:px-14">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="lg:w-1/2 lg:shrink-0 lg:pr-8">
            <InlineEdit value={tag} onSave={(v) => onUpdate({ tag: v })} placeholder="контакты">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
                {tag || "тег"}
              </span>
            </InlineEdit>
            <div className="mt-3 flex flex-col gap-1">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="h2 text-[#0A0A0A]">{title || "Заголовок"}</h2>
              </InlineEdit>
              <InlineEdit
                value={titleSecondary}
                onSave={(v) => onUpdate({ titleSecondary: v })}
                placeholder="Дополнительная часть (серая)"
              >
                <span className="h2 text-[#666666] block">{titleSecondary || "доп. часть"}</span>
              </InlineEdit>
            </div>
          </div>
          <div className="lg:w-1/2">
            <ParagraphsEditor
              paragraphs={paragraphs}
              onChange={(next) => onUpdate({ paragraphs: next })}
              theme="light"
              defaults={{ uppercase: true, color: "primary" }}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="flex items-stretch">
          {cards.map((card, index) => (
            <div key={card.id} className="flex min-w-0 flex-1 items-stretch">
              {cards.length < 4 && <InsertButton onClick={() => insertCard(index)} />}
              <div className="min-w-0 flex-1 px-1">
                <CardEditor
                  card={card}
                  index={index}
                  dnd={dnd}
                  onChange={(next) => updateCard(index, next)}
                  onRemove={() => removeCard(index)}
                />
              </div>
            </div>
          ))}
          {cards.length < 4 && <InsertButton onClick={() => insertCard(cards.length)} />}
          {cards.length === 0 && (
            <button
              type="button"
              onClick={() => insertCard(0)}
              className="flex w-full items-center justify-center gap-2 rounded border border-dashed border-[#404040] bg-[#F0F0F0] px-6 py-10 text-[#404040] hover:border-[#0A0A0A] hover:text-[#0A0A0A] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase tracking-[0.02em]">
                Добавить карточку
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
