"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ArrowDown,
  ArrowUp,
  FileText,
  ImageUp,
  Images,
  Link as LinkIcon,
  Loader2,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Switch,
} from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import type {
  ArticleAside,
  ArticleLogoAsideItem,
  AsidePreviewCropMode,
  CtaEntity,
} from "@/lib/types";

const FILE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png";
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/svg+xml,image/gif";

type FileAside = Extract<ArticleAside, { kind: "file" }>;
type LinkAside = Extract<ArticleAside, { kind: "link" }>;
type ProductAside = Extract<ArticleAside, { kind: "product" }>;
type LogosAside = Extract<ArticleAside, { kind: "logos" }>;
type CtaAside = Extract<ArticleAside, { kind: "cta" }>;

// ── Logos: width bounds и шаг zoom (совпадает с клиентским зуммом на сайте) ──

export const LOGO_MIN_WIDTH = 80;
export const LOGO_MAX_WIDTH = 320;
export const LOGO_DEFAULT_WIDTH = 160;
export const LOGO_ZOOM_STEP = 16;

export type LogoGroup = "rocketmind" | "partners";

export interface LogoLibraryItem {
  src: string;
  name: string;
  group: LogoGroup;
}

const LOGO_GROUP_LABEL: Record<LogoGroup, string> = {
  rocketmind: "Rocketmind",
  partners: "Партнёры",
};
const LOGO_GROUP_ORDER: LogoGroup[] = ["rocketmind", "partners"];

export interface ProductListItem {
  slug: string;
  category: "consulting" | "academy" | "ai-products";
  cardTitle: string;
  cardDescription: string;
  coverUrl: string | null;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

async function uploadToArticle(
  articleSlug: string,
  file: File,
  kind: "file" | "preview",
): Promise<{ url: string; fileName: string; mime: string; size: number }> {
  const dataUrl = await readAsDataUrl(file);
  const res = await apiFetch(`/api/articles/${articleSlug}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, dataUrl, fileName: file.name }),
  });
  if (!res.ok) {
    let err = "upload failed";
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) err = j.error;
    } catch {}
    throw new Error(err);
  }
  return (await res.json()) as {
    url: string;
    fileName: string;
    mime: string;
    size: number;
  };
}

// ── Shared row wrapper ──────────────────────────────────────────────────────

interface RowProps {
  icon: React.ReactNode;
  label: string;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  children: React.ReactNode;
}

function AsideRowShell({
  icon,
  label,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: RowProps) {
  return (
    <div className="group/aside rounded-sm border border-border bg-background/50 p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground">
          {icon}
          {label}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/aside:opacity-100">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Вверх"
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Вниз"
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            title="Удалить"
            className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Preview toggle + upload — общее для file и link ─────────────────────────

interface PreviewControlsProps {
  articleSlug: string;
  showPreview: boolean;
  previewImageUrl?: string;
  cropMode: AsidePreviewCropMode;
  onToggle: (v: boolean) => void;
  onPreviewUrl: (url?: string) => void;
  onCropModeChange: (mode: AsidePreviewCropMode) => void;
}

function PreviewControls({
  articleSlug,
  showPreview,
  previewImageUrl,
  cropMode,
  onToggle,
  onPreviewUrl,
  onCropModeChange,
}: PreviewControlsProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const res = await uploadToArticle(articleSlug, file, "preview");
      onPreviewUrl(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  const objectPosition = cropMode === "top" ? "center top" : "center center";

  return (
    <div className="mt-2">
      <label className="flex items-center justify-between gap-2 text-[length:var(--text-11)]">
        <span className="text-muted-foreground">Показывать превью 3:2</span>
        <Switch checked={showPreview} onCheckedChange={onToggle} />
      </label>

      {showPreview && (
        <div className="mt-2">
          {previewImageUrl ? (
            <div className="relative w-full">
              <div className="relative w-full overflow-hidden rounded-sm border border-border">
                <div style={{ aspectRatio: "3 / 2" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImageUrl}
                    alt="Превью"
                    className="h-full w-full object-cover"
                    style={{ objectPosition }}
                  />
                </div>
              </div>

              {/* Справа вверху: удалить + переключатель кропа (top/center) */}
              <div className="absolute right-1 top-1 flex flex-col items-center gap-1 rounded-sm bg-background/80 p-0.5">
                <CropBtn
                  active={cropMode === "top"}
                  onClick={() => onCropModeChange("top")}
                  title="Превью от верха"
                >
                  <AlignVerticalJustifyStart className="h-3 w-3" />
                </CropBtn>
                <CropBtn
                  active={cropMode === "center"}
                  onClick={() => onCropModeChange("center")}
                  title="Превью по центру"
                >
                  <AlignVerticalJustifyCenter className="h-3 w-3" />
                </CropBtn>
                <button
                  type="button"
                  onClick={() => onPreviewUrl(undefined)}
                  title="Убрать превью"
                  className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background/50 px-2 py-3 text-[length:var(--text-11)] text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-foreground">
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                hidden
                onChange={handleFile}
              />
              {uploading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Загрузка…
                </>
              ) : (
                <>
                  <ImageUp className="h-3 w-3" /> Загрузить превью (3:2)
                </>
              )}
            </label>
          )}
          {error && (
            <p className="mt-1 text-[length:var(--text-10)] text-[#ED4843]">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CropBtn({
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
      onClick={onClick}
      title={title}
      className={`flex h-5 w-5 items-center justify-center rounded-sm transition-colors ${
        active
          ? "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// ── File editor ────────────────────────────────────────────────────────────

interface AsideItemProps {
  articleSlug: string;
  onChange: (next: ArticleAside) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function AsideFileEditor({
  aside,
  ...shell
}: AsideItemProps & { aside: FileAside }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const res = await uploadToArticle(shell.articleSlug, file, "file");
      shell.onChange({
        ...aside,
        fileUrl: res.url,
        fileName: res.fileName,
        displayName: aside.displayName || res.fileName.replace(/\.[^.]+$/, ""),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <AsideRowShell
      icon={<FileText className="h-3 w-3" />}
      label="Файл"
      onRemove={shell.onRemove}
      onMoveUp={shell.onMoveUp}
      onMoveDown={shell.onMoveDown}
      canMoveUp={shell.canMoveUp}
      canMoveDown={shell.canMoveDown}
    >
      {aside.fileUrl ? (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-sm bg-muted/40 px-2 py-1.5 text-[length:var(--text-11)]">
          <span className="truncate" title={aside.fileName}>
            {aside.fileName}
          </span>
          <label className="shrink-0 cursor-pointer text-[length:var(--text-10)] text-[var(--rm-violet-100)] hover:underline">
            <input
              type="file"
              accept={FILE_ACCEPT}
              hidden
              onChange={handleFile}
            />
            заменить
          </label>
        </div>
      ) : (
        <label className="mb-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background/50 px-2 py-3 text-[length:var(--text-11)] text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-foreground">
          <input type="file" accept={FILE_ACCEPT} hidden onChange={handleFile} />
          {uploading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Загрузка…
            </>
          ) : (
            <>
              <Upload className="h-3 w-3" /> PDF / DOCX / XLSX / JPG / PNG
            </>
          )}
        </label>
      )}
      {error && (
        <p className="mb-2 text-[length:var(--text-10)] text-[#ED4843]">
          {error}
        </p>
      )}

      <Input
        value={aside.displayName}
        onChange={(e) =>
          shell.onChange({ ...aside, displayName: e.target.value })
        }
        placeholder="Название файла"
        className="h-7 text-[length:var(--text-12)]"
      />

      <PreviewControls
        articleSlug={shell.articleSlug}
        showPreview={aside.showPreview}
        previewImageUrl={aside.previewImageUrl}
        cropMode={aside.previewCropMode ?? "top"}
        onToggle={(v) => shell.onChange({ ...aside, showPreview: v })}
        onPreviewUrl={(url) =>
          shell.onChange({ ...aside, previewImageUrl: url })
        }
        onCropModeChange={(mode) =>
          shell.onChange({ ...aside, previewCropMode: mode })
        }
      />
    </AsideRowShell>
  );
}

// ── Link editor ────────────────────────────────────────────────────────────

export function AsideLinkEditor({
  aside,
  ...shell
}: AsideItemProps & { aside: LinkAside }) {
  return (
    <AsideRowShell
      icon={<LinkIcon className="h-3 w-3" />}
      label="Ссылка"
      onRemove={shell.onRemove}
      onMoveUp={shell.onMoveUp}
      onMoveDown={shell.onMoveDown}
      canMoveUp={shell.canMoveUp}
      canMoveDown={shell.canMoveDown}
    >
      <Input
        value={aside.url}
        onChange={(e) => shell.onChange({ ...aside, url: e.target.value })}
        placeholder="https://…"
        className="mb-2 h-7 text-[length:var(--text-12)]"
        type="url"
      />
      <Input
        value={aside.displayName}
        onChange={(e) =>
          shell.onChange({ ...aside, displayName: e.target.value })
        }
        placeholder="Название ссылки"
        className="h-7 text-[length:var(--text-12)]"
      />

      <PreviewControls
        articleSlug={shell.articleSlug}
        showPreview={aside.showPreview}
        previewImageUrl={aside.previewImageUrl}
        cropMode={aside.previewCropMode ?? "top"}
        onToggle={(v) => shell.onChange({ ...aside, showPreview: v })}
        onPreviewUrl={(url) =>
          shell.onChange({ ...aside, previewImageUrl: url })
        }
        onCropModeChange={(mode) =>
          shell.onChange({ ...aside, previewCropMode: mode })
        }
      />
    </AsideRowShell>
  );
}

// ── Product editor ─────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<ProductListItem["category"], string> = {
  consulting: "Консалтинг",
  academy: "Онлайн-школа",
  "ai-products": "AI-продукты",
};

let productsCache: Promise<ProductListItem[]> | null = null;

function loadProducts(): Promise<ProductListItem[]> {
  if (!productsCache) {
    productsCache = apiFetch("/api/products")
      .then((r) => (r.ok ? (r.json() as Promise<ProductListItem[]>) : []))
      .catch(() => [] as ProductListItem[]);
  }
  return productsCache;
}

export function AsideProductEditor({
  aside,
  ...shell
}: AsideItemProps & { aside: ProductAside }) {
  const [products, setProducts] = useState<ProductListItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadProducts().then((list) => {
      if (!cancelled) setProducts(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped: Record<ProductListItem["category"], ProductListItem[]> = {
    consulting: [],
    academy: [],
    "ai-products": [],
  };
  for (const p of products ?? []) {
    grouped[p.category].push(p);
  }

  const currentValue = aside.productSlug
    ? `${aside.productCategory}:${aside.productSlug}`
    : "";

  function onSelect(value: string) {
    if (!value) {
      shell.onChange({
        ...aside,
        productSlug: "",
        productCategory: "consulting",
      });
      return;
    }
    const [category, slug] = value.split(":");
    shell.onChange({
      ...aside,
      productSlug: slug,
      productCategory: category as ProductAside["productCategory"],
    });
  }

  const selected = (products ?? []).find(
    (p) =>
      p.slug === aside.productSlug && p.category === aside.productCategory,
  );

  return (
    <AsideRowShell
      icon={<Package className="h-3 w-3" />}
      label="Продукт"
      onRemove={shell.onRemove}
      onMoveUp={shell.onMoveUp}
      onMoveDown={shell.onMoveDown}
      canMoveUp={shell.canMoveUp}
      canMoveDown={shell.canMoveDown}
    >
      <select
        value={currentValue}
        onChange={(e) => onSelect(e.target.value)}
        className="h-7 w-full rounded-sm border border-border bg-background px-2 text-[length:var(--text-12)] text-foreground outline-none focus:border-[var(--rm-violet-100)]"
      >
        <option value="">— выберите продукт —</option>
        {(Object.keys(grouped) as ProductListItem["category"][]).map((cat) =>
          grouped[cat].length > 0 ? (
            <optgroup key={cat} label={CATEGORY_LABEL[cat]}>
              {grouped[cat].map((p) => (
                <option key={`${cat}:${p.slug}`} value={`${cat}:${p.slug}`}>
                  {p.cardTitle}
                </option>
              ))}
            </optgroup>
          ) : null,
        )}
      </select>
      {products === null && (
        <p className="mt-1 text-[length:var(--text-10)] text-muted-foreground">
          Загружаю список продуктов…
        </p>
      )}
      {selected && (
        <p className="mt-1 text-[length:var(--text-10)] text-muted-foreground">
          {CATEGORY_LABEL[selected.category]} · /{selected.category}/
          {selected.slug}
        </p>
      )}
    </AsideRowShell>
  );
}

// ── Logos editor ───────────────────────────────────────────────────────────

let logoLibraryCache: Promise<LogoLibraryItem[]> | null = null;

function loadLogoLibrary(): Promise<LogoLibraryItem[]> {
  if (!logoLibraryCache) {
    logoLibraryCache = apiFetch("/api/logos")
      .then((r) => (r.ok ? (r.json() as Promise<LogoLibraryItem[]>) : []))
      .catch(() => [] as LogoLibraryItem[]);
  }
  return logoLibraryCache;
}

function invalidateLogoLibrary() {
  logoLibraryCache = null;
}

function newLogoItemId(): string {
  return `l_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function clampLogoWidth(value: number): number {
  return Math.max(
    LOGO_MIN_WIDTH,
    Math.min(LOGO_MAX_WIDTH, Math.round(value)),
  );
}

/**
 * Монохромное превью логотипа через mask-image. Работает и для SVG,
 * и для PNG — альфа берётся как маска, цвет заливается токеном DS.
 * На сайте используется аналогичный рендер — см. `AsideItem` в article-page-client.
 */
function LogoMaskPreview({
  src,
  widthPx,
  color = "var(--rm-gray-fg-sub)",
  className = "",
}: {
  src: string;
  widthPx: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        width: widthPx,
        height: 32,
        backgroundColor: color,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export function AsideLogosEditor({
  aside,
  ...shell
}: AsideItemProps & { aside: LogosAside }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function updateLogo(id: string, patch: Partial<ArticleLogoAsideItem>) {
    shell.onChange({
      ...aside,
      logos: aside.logos.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  }

  function removeLogo(id: string) {
    shell.onChange({
      ...aside,
      logos: aside.logos.filter((l) => l.id !== id),
    });
  }

  function addFromLibrary(src: string) {
    shell.onChange({
      ...aside,
      logos: [
        ...aside.logos,
        { id: newLogoItemId(), src, widthPx: LOGO_DEFAULT_WIDTH },
      ],
    });
  }

  return (
    <AsideRowShell
      icon={<Images className="h-3 w-3" />}
      label="Логотипы"
      onRemove={shell.onRemove}
      onMoveUp={shell.onMoveUp}
      onMoveDown={shell.onMoveDown}
      canMoveUp={shell.canMoveUp}
      canMoveDown={shell.canMoveDown}
    >
      <div className="flex flex-col gap-2">
        {aside.logos.length === 0 ? (
          <p className="rounded-sm border border-dashed border-border bg-background/30 px-2 py-3 text-center text-[length:var(--text-11)] text-muted-foreground">
            Пока нет логотипов.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {aside.logos.map((logo) => (
              <li
                key={logo.id}
                className="flex items-center gap-2 rounded-sm border border-border bg-background/50 p-1.5"
              >
                <div className="flex h-8 flex-1 items-center overflow-hidden">
                  <LogoMaskPreview src={logo.src} widthPx={logo.widthPx} />
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      updateLogo(logo.id, {
                        widthPx: clampLogoWidth(logo.widthPx - LOGO_ZOOM_STEP),
                      })
                    }
                    disabled={logo.widthPx <= LOGO_MIN_WIDTH}
                    aria-label="Уменьшить ширину"
                    title="Уменьшить ширину"
                    className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[36px] text-center font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground tabular-nums">
                    {logo.widthPx}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateLogo(logo.id, {
                        widthPx: clampLogoWidth(logo.widthPx + LOGO_ZOOM_STEP),
                      })
                    }
                    disabled={logo.widthPx >= LOGO_MAX_WIDTH}
                    aria-label="Увеличить ширину"
                    title="Увеличить ширину"
                    className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeLogo(logo.id)}
                  aria-label="Убрать логотип"
                  title="Убрать"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-background/50 px-2 py-1.5 text-[length:var(--text-11)] font-medium text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-[var(--rm-violet-100)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить логотип
        </button>
      </div>

      <LogoPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(src) => {
          addFromLibrary(src);
          setPickerOpen(false);
        }}
      />
    </AsideRowShell>
  );
}

// ── Picker-диалог: библиотека + загрузка SVG ────────────────────────────────

function LogoPickerDialog({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPick: (src: string) => void;
}) {
  const [library, setLibrary] = useState<LogoLibraryItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadLogoLibrary().then((list) => {
      if (!cancelled) setLibrary(list);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const src = library ?? [];
    const byGroup: Record<LogoGroup, LogoLibraryItem[]> = {
      rocketmind: [],
      partners: [],
    };
    for (const item of src) {
      if (q && !item.name.toLowerCase().includes(q)) continue;
      byGroup[item.group].push(item);
    }
    return byGroup;
  }, [library, query]);

  const totalFiltered = grouped.rocketmind.length + grouped.partners.length;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const res = await apiFetch("/api/logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      if (!res.ok) {
        let err = "upload failed";
        try {
          const j = (await res.json()) as { error?: string };
          if (j?.error) err = j.error;
        } catch {}
        throw new Error(err);
      }
      const { url } = (await res.json()) as { url: string };
      invalidateLogoLibrary();
      // Сразу вставим в aside, не заставляя админа ещё раз кликать по плитке.
      onPick(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] gap-4">
        <DialogHeader>
          <DialogTitle>Выбрать логотип</DialogTitle>
        </DialogHeader>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-background/50 px-3 py-3 text-[length:var(--text-12)] text-muted-foreground transition-colors hover:border-[var(--rm-violet-100)] hover:text-foreground">
          <input
            type="file"
            accept="image/svg+xml"
            hidden
            onChange={handleUpload}
          />
          {uploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Загрузка…
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" /> Загрузить SVG (до 512KB)
            </>
          )}
        </label>
        {uploadError && (
          <p className="text-[length:var(--text-11)] text-[#ED4843]">
            {uploadError}
          </p>
        )}

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени…"
          className="h-8 text-[length:var(--text-12)]"
        />

        {library === null ? (
          <p className="text-[length:var(--text-11)] text-muted-foreground">
            Загружаю библиотеку логотипов…
          </p>
        ) : totalFiltered === 0 ? (
          <p className="text-[length:var(--text-11)] text-muted-foreground">
            {query
              ? "Ничего не найдено."
              : "Библиотека пуста. Загрузите первый SVG выше."}
          </p>
        ) : (
          <div className="flex max-h-[440px] flex-col gap-4 overflow-y-auto">
            {LOGO_GROUP_ORDER.map((group) => {
              const items = grouped[group];
              if (items.length === 0) return null;
              return (
                <section key={group} className="flex flex-col gap-2">
                  <h5 className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground">
                    {LOGO_GROUP_LABEL[group]}
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {items.map((item) => (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => onPick(item.src)}
                        title={item.name}
                        className="group flex flex-col items-center gap-1 rounded-sm border border-border bg-[color:var(--rm-gray-1)]/40 p-2 transition-colors hover:border-[var(--rm-violet-100)] hover:bg-[color:var(--rm-gray-1)]/60"
                      >
                        <div className="flex h-10 w-full items-center justify-center">
                          <LogoMaskPreview
                            src={item.src}
                            widthPx={120}
                            color="var(--rm-gray-fg-main)"
                            className="transition-colors group-hover:bg-[color:var(--rm-violet-100)]"
                          />
                        </div>
                        <span className="w-full truncate text-center text-[length:var(--text-10)] text-muted-foreground">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── CTA aside editor ────────────────────────────────────────────────────────

export function AsideCtaEditor({
  aside,
  ...shell
}: AsideItemProps & { aside: CtaAside }) {
  const [ctas, setCtas] = useState<CtaEntity[]>([]);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/ctas")
      .then((r) => r.json() as Promise<CtaEntity[]>)
      .then((all) => {
        if (cancelled) return;
        setCtas(all.filter((c) => c.scope !== "product"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = ctas.find((c) => c.id === aside.ctaId);

  return (
    <AsideRowShell
      icon={<MousePointerClickIcon />}
      label="CTA-блок"
      onRemove={shell.onRemove}
      onMoveUp={shell.onMoveUp}
      onMoveDown={shell.onMoveDown}
      canMoveUp={shell.canMoveUp}
      canMoveDown={shell.canMoveDown}
    >
      <select
        value={aside.ctaId}
        onChange={(e) => shell.onChange({ ...aside, ctaId: e.target.value })}
        className="h-7 w-full rounded-sm border border-border bg-background px-1.5 text-[length:var(--text-12)] text-foreground"
      >
        <option value="">— выберите CTA —</option>
        {ctas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || c.id}
          </option>
        ))}
      </select>

      {selected && (
        <p className="mt-1.5 text-[length:var(--text-11)] text-muted-foreground">
          «{selected.heading || "(без заголовка)"}» —{" "}
          {selected.formId
            ? `форма: ${selected.formId}`
            : "форма не задана"}
        </p>
      )}
      {selected && !selected.formId && (
        <p className="mt-1 text-[length:var(--text-11)] text-[#ED4843]">
          У выбранного CTA не задана форма — кнопка не откроет модалку.
        </p>
      )}
    </AsideRowShell>
  );
}

function MousePointerClickIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4.1 12 6" />
      <path d="m5.1 8-2.9-.8" />
      <path d="m6 12-1.9 2" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
    </svg>
  );
}
