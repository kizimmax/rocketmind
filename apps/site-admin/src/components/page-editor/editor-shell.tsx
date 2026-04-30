"use client";

import { apiFetch } from "@/lib/api-client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ImagePlus, Upload, Trash2 } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Separator,
  Switch,
} from "@rocketmind/ui";
import { toast } from "sonner";
import type { SitePage, FormEntity } from "@/lib/types";
import { useEditor } from "@/lib/use-editor";
import { useAdminStore } from "@/lib/store";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { InlineEdit } from "@/components/inline-edit";
import { EditorToolbar } from "./editor-toolbar";
import { BlockList } from "./block-list";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

const DESC_REC_MIN = 60;
const DESC_REC_MAX = 120;

// ── Human-readable change descriptions ─────────────────────────────────────

const BLOCK_LABELS: Record<string, string> = {
  hero: "Hero",
  logoMarquee: "Логотипы",
  about: "О продукте",
  audience: "Аудитория",
  tools: "Инструменты",
  results: "Результаты",
  process: "Процесс",
  experts: "Эксперты",
  aboutRocketmind: "О Rocketmind",
  pageBottom: "Низ страницы",
};

function getChangesDescription(original: SitePage, current: SitePage): string[] {
  const changes: string[] = [];

  const fields: Array<[keyof SitePage, string]> = [
    ["menuTitle", "Название в меню"],
    ["slug", "Slug (URL)"],
    ["menuDescription", "Описание в меню"],
    ["metaTitle", "Meta Title"],
    ["metaDescription", "Meta Description"],
    ["cardTitle", "Название на карточке"],
    ["cardDescription", "Описание на карточке"],
  ];

  for (const [key, label] of fields) {
    if (original[key] !== current[key]) changes.push(label);
  }

  if (original.status !== current.status) changes.push("Статус публикации");

  const origMap = new Map(original.blocks.map((b) => [b.id, b]));
  let orderChanged = false;

  for (const block of current.blocks) {
    const orig = origMap.get(block.id);
    if (!orig) continue;
    const label = BLOCK_LABELS[block.type] || block.type;
    if (orig.enabled !== block.enabled) changes.push(`Блок «${label}» — видимость`);
    if (orig.order !== block.order) orderChanged = true;
    if (JSON.stringify(orig.data) !== JSON.stringify(block.data))
      changes.push(`Блок «${label}» — контент`);
  }

  if (orderChanged) changes.push("Порядок блоков");

  return changes;
}

// ── Product Card Preview ───────────────────────────────────────────────────

const EXPERT_TAG_CLASSES =
  "inline-flex items-center px-2.5 py-1 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466]";

function ExpertTagBadge({ className }: { className?: string }) {
  return (
    <span className={`${EXPERT_TAG_CLASSES} ${className ?? ""}`}>Экспертный продукт</span>
  );
}

type CardExpert = { name: string; image: string | null };

function ExpertAvatars({ experts }: { experts: CardExpert[] }) {
  if (experts.length === 0) return null;
  const shown = experts.slice(0, 2);
  const extra = Math.max(0, experts.length - 2);
  return (
    <div className="flex items-center -ml-[18px] pb-10 pt-2 justify-end min-w-0">
      {shown.map((e, i) => (
        <div
          key={`${e.name}-${i}`}
          className={`w-[72px] h-[72px] min-w-[52px] min-h-[52px] rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center ${
            i > 0 ? "-ml-4" : ""
          }`}
          style={{
            backgroundImage: e.image ? `url(${e.image})` : undefined,
            zIndex: shown.length + 1 - i,
          }}
        />
      ))}
      {extra > 0 && (
        <div className="w-[72px] h-[72px] min-w-[52px] min-h-[52px] rounded-full bg-[#1A1A1A] flex items-center justify-center -ml-4 z-[1]">
          <span className="font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
            +{extra}
          </span>
        </div>
      )}
    </div>
  );
}

function ProductCardPreview({
  page,
  isImageCard,
  hasExperts,
  experts,
  onUpdateMeta,
  onUpdateBlock,
}: {
  page: SitePage;
  isImageCard: boolean;
  hasExperts: boolean;
  experts: CardExpert[];
  onUpdateMeta: (field: keyof SitePage, value: string) => void;
  onUpdateBlock: (blockId: string, data: Record<string, unknown>) => void;
}) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const heroBlock = page.blocks.find((b) => b.type === "hero");
  const cardImageData = (heroBlock?.data?.heroImageData as string) || "";

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !heroBlock) return;
    const reader = new FileReader();
    reader.onload = () => onUpdateBlock(heroBlock.id, { heroImageData: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleImageDelete() {
    if (heroBlock) onUpdateBlock(heroBlock.id, { heroImageData: "" });
  }

  if (isImageCard) {
    return (
      <div className="relative rounded-sm border border-[#404040] bg-[#0A0A0A]">
        {/* Arrow button — top right */}
        <div className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-sm border border-[#404040]">
          <ArrowUpRight className="h-3 w-3 text-[#F0F0F0]" />
        </div>

        {/* Image 4:3 (landscape) */}
        {cardImageData ? (
          <div className="group/img relative">
            <div
              className="w-full bg-cover bg-center"
              style={{ aspectRatio: "4/3", backgroundImage: `url(${cardImageData})` }}
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 transition-opacity group-hover/img:opacity-100">
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                className="flex h-7 items-center gap-1 rounded-sm bg-[#1a1a1a]/80 px-2 text-[length:var(--text-12)] text-[#F0F0F0] backdrop-blur hover:bg-[#1a1a1a]"
              >
                <Upload className="h-3 w-3" />
                Заменить
              </button>
              <button
                type="button"
                onClick={handleImageDelete}
                className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imgInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 border-b border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
            style={{ aspectRatio: "4/3" }}
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-[length:var(--text-14)]">Изображение</span>
          </button>
        )}
        <input
          ref={imgInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Expert tag — overlaps image bottom by 22px (matches site) */}
        {hasExperts && (
          <div className="relative -mt-[22px] px-8">
            <ExpertTagBadge />
          </div>
        )}

        {/* Card text */}
        <div className={`flex h-[156px] flex-col justify-between gap-6 p-8 ${hasExperts ? "pt-5" : ""}`}>
          <InlineEdit
            value={page.cardTitle}
            onSave={(v) => onUpdateMeta("cardTitle", v)}
            multiline
            placeholder="Название на карточке"
          >
            <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-tight text-[#F0F0F0]">
              {page.cardTitle || "Название"}
            </span>
          </InlineEdit>

          <InlineEdit
            value={page.cardDescription}
            onSave={(v) => onUpdateMeta("cardDescription", v)}
            multiline
            placeholder="Описание на карточке"
          >
            <span className="text-[length:var(--text-14)] leading-[1.32] text-[#939393]">
              {page.cardDescription || "Описание продукта"}
            </span>
          </InlineEdit>
        </div>
      </div>
    );
  }

  // Default: icon-based card (consulting)
  return (
    <div className="relative rounded-sm border border-[#404040] bg-[#0A0A0A] p-8">
      <div className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-sm border border-[#404040]">
        <ArrowUpRight className="h-3 w-3 text-[#F0F0F0]" />
      </div>
      <div className="relative mb-8 flex items-center overflow-visible">
      {cardImageData ? (
        <div className="group/icon relative h-[120px] w-[120px] shrink-0 z-0">
          <div
            className="h-full w-full rounded-sm bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${cardImageData})` }}
          />
          <div className="absolute left-1 top-1 flex items-center gap-1 opacity-0 transition-opacity group-hover/icon:opacity-100">
            <button
              type="button"
              onClick={() => imgInputRef.current?.click()}
              className="flex h-6 items-center gap-1 rounded-sm bg-[#1a1a1a]/80 px-1.5 text-[length:var(--text-10)] text-[#F0F0F0] backdrop-blur hover:bg-[#1a1a1a]"
            >
              <Upload className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleImageDelete}
              className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => imgInputRef.current?.click()}
          className="flex h-[120px] w-[120px] shrink-0 cursor-pointer items-center justify-center rounded-sm border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
        >
          <ImagePlus className="h-6 w-6" />
        </button>
      )}
      <ExpertAvatars experts={experts} />
      {hasExperts && (
        <ExpertTagBadge className="absolute left-0 bottom-[-22px] z-10" />
      )}
      </div>
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div className={`flex h-[156px] flex-col justify-between gap-6 ${hasExperts ? "mt-3" : ""}`}>
        <InlineEdit
          value={page.cardTitle}
          onSave={(v) => onUpdateMeta("cardTitle", v)}
          multiline
          placeholder="Название на карточке"
        >
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-tight text-[#F0F0F0]">
            {page.cardTitle || "Название"}
          </span>
        </InlineEdit>

        <InlineEdit
          value={page.cardDescription}
          onSave={(v) => onUpdateMeta("cardDescription", v)}
          multiline
          placeholder="Описание на карточке"
        >
          <span className="text-[length:var(--text-14)] leading-[1.32] text-[#939393]">
            {page.cardDescription || "Описание продукта"}
          </span>
        </InlineEdit>
      </div>
    </div>
  );
}

// ── Page-level form selector ───────────────────────────────────────────────

function PageFormSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (next: string | undefined) => void;
}) {
  const [forms, setForms] = useState<FormEntity[]>([]);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/forms")
      .then((r) => r.json() as Promise<FormEntity[]>)
      .then((all) => {
        if (cancelled) return;
        setForms(all.filter((f) => f.scope !== "article"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-1.5 rounded-sm border border-[#404040] bg-[#0A0A0A] p-4">
      <span className="text-[length:var(--text-14)] font-medium text-[#F0F0F0]">
        Форма страницы
      </span>
      <span className="text-[length:var(--text-12)] text-[#939393]">
        Открывается при клике на любую CTA-кнопку этой страницы и на карточки
        в блоке «Услуги». Перебивает форму, заданную в самом CTA.
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="mt-1 h-9 rounded-sm border border-[#404040] bg-[#0A0A0A] px-2 text-[length:var(--text-13)] text-[#F0F0F0]"
      >
        <option value="">— не задано —</option>
        {forms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name || f.id}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

interface EditorShellProps {
  initialPage: SitePage;
}

export function EditorShell({ initialPage }: EditorShellProps) {
  const router = useRouter();
  const { savePage } = useAdminStore();
  const {
    page,
    original,
    isDirty,
    canUndo,
    canRedo,
    updateMeta,
    updateBlock,
    toggleBlock,
    reorderBlocks,
    insertBlock,
    deleteBlock,
    updateStatus,
    undo,
    redo,
    markSaved,
    discard,
  } = useEditor(initialPage);

  const { setDirty, pendingHref, clearPending } = useNavigationGuard();

  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [navigateTarget, setNavigateTarget] = useState<string | null>(null);

  // Sync dirty state to navigation guard
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  // Cleanup on unmount
  useEffect(() => {
    return () => setDirty(false);
  }, [setDirty]);

  // React to header navigation attempts
  useEffect(() => {
    if (pendingHref) {
      setNavigateTarget(pendingHref);
      setShowUnsavedDialog(true);
      clearPending();
    }
  }, [pendingHref, clearPending]);

  const descLen = (page.menuDescription || "").length;
  const descColor =
    descLen === 0
      ? "text-muted-foreground"
      : descLen < DESC_REC_MIN
        ? "text-[var(--rm-yellow-100)]"
        : descLen > DESC_REC_MAX
          ? "text-destructive"
          : "text-[var(--rm-green-100)]";

  async function handleSave() {
    const savedPage = { ...page, updatedAt: new Date().toISOString() };
    await savePage(savedPage);
    markSaved(savedPage);
    toast.success("Изменения сохранены и записаны в файл");
  }

  const pagesHref =
    page.sectionId === "cases"
      ? "/cases"
      : page.sectionId === "media"
        ? "/media"
        : `/pages?section=${page.sectionId}`;

  function handleBack() {
    if (isDirty) {
      setNavigateTarget(pagesHref);
      setShowUnsavedDialog(true);
    } else {
      router.push(pagesHref);
    }
  }

  async function handleSaveAndNavigate() {
    await handleSave();
    setShowUnsavedDialog(false);
    router.push(navigateTarget || pagesHref);
  }

  function handleDiscardAndNavigate() {
    discard();
    setShowUnsavedDialog(false);
    router.push(navigateTarget || pagesHref);
  }

  function handleCancelDialog() {
    setShowUnsavedDialog(false);
    setNavigateTarget(null);
  }

  const changes = isDirty ? getChangesDescription(original, page) : [];

  const expertSlugs = useMemo(() => {
    const expertsBlock = page.blocks.find((b) => b.type === "experts");
    return (expertsBlock?.data?.experts as string[] | undefined) ?? [];
  }, [page.blocks]);

  const hasExperts = expertSlugs.length > 0;
  const expertProduct =
    typeof page.expertProduct === "boolean" ? page.expertProduct : hasExperts;

  const [resolvedExperts, setResolvedExperts] = useState<CardExpert[]>([]);

  useEffect(() => {
    if (expertSlugs.length === 0) {
      setResolvedExperts([]);
      return;
    }
    let cancelled = false;
    apiFetch("/api/experts")
      .then((r) => r.json())
      .then((all: Array<{ slug: string; name: string; image: string | null }>) => {
        if (cancelled) return;
        const map = new Map(all.map((e) => [e.slug, e]));
        setResolvedExperts(
          expertSlugs
            .map((s) => map.get(s))
            .filter(Boolean)
            .map((e) => ({ name: e!.name, image: e!.image })),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [expertSlugs]);

  return (
    <div className="flex flex-1 flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <Button variant="ghost" size="icon-sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-[length:var(--text-18)] font-semibold text-foreground">
            {page.menuTitle || "Без названия"}
          </h1>
          <p className="text-[length:var(--text-12)] text-muted-foreground">
            /{page.sectionId}/{page.slug}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
       <div className="mx-auto w-full max-w-[1400px]">
        {/* ── Top section: left fields + right card ──────────────── */}
        {page.caseType !== "mini" && (
        <div className="mb-8 flex flex-col gap-8 lg:flex-row">
          {/* Left column — inputs */}
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
              Основная информация
            </h2>

            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Название в меню
              </label>
              <Input
                size="sm"
                value={page.menuTitle}
                onChange={(e) => updateMeta("menuTitle", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Slug (URL)
              </label>
              <Input
                size="sm"
                value={page.slug}
                onChange={(e) => updateMeta("slug", e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Описание в меню
              </label>
              <Textarea
                value={page.menuDescription}
                onChange={(e) => updateMeta("menuDescription", e.target.value)}
                className="min-h-[60px] text-[length:var(--text-14)]"
              />
              <div className="flex items-center gap-2">
                <span className={`text-[length:var(--text-12)] font-medium ${descColor}`}>
                  {descLen}/{DESC_REC_MIN}–{DESC_REC_MAX}
                </span>
                <span className="text-[length:var(--text-10)] text-muted-foreground">
                  Рекомендуется {DESC_REC_MIN}–{DESC_REC_MAX} символов
                </span>
              </div>
            </div>

            <Separator />

            <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
              SEO
            </h2>

            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Meta Title
              </label>
              <Input
                size="sm"
                value={page.metaTitle}
                onChange={(e) => updateMeta("metaTitle", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Meta Description
              </label>
              <Textarea
                value={page.metaDescription}
                onChange={(e) => updateMeta("metaDescription", e.target.value)}
                className="min-h-[60px] text-[length:var(--text-14)]"
              />
            </div>
          </div>

          {/* Right column — product card preview (Figma design) */}
          {page.sectionId !== "unique" && (
          <div className="flex flex-col gap-3 lg:w-[380px] lg:shrink-0">
            <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
              Карточка продукта
            </h2>

            <ProductCardPreview
              page={page}
              isImageCard={page.sectionId === "academy" || page.sectionId === "ai-products" || page.sectionId === "media"}
              hasExperts={expertProduct}
              experts={resolvedExperts}
              onUpdateMeta={updateMeta}
              onUpdateBlock={updateBlock}
            />

            {/* Expert product toggle */}
            <div className="mt-2 flex items-start justify-between gap-4 rounded-sm border border-[#404040] bg-[#0A0A0A] p-4">
              <div className="flex flex-col gap-1">
                <span className="text-[length:var(--text-14)] font-medium text-[#F0F0F0]">
                  Экспертный продукт
                </span>
                <span className="text-[length:var(--text-12)] text-[#939393]">
                  Показывает тег, выносит описание в шапку и добавляет блок экспертов в hero.
                </span>
              </div>
              <Switch
                checked={expertProduct}
                onCheckedChange={(v) => updateMeta("expertProduct", v)}
              />
            </div>

            {/* Visibility toggles — только для разделов consulting / academy / ai-products.
                Неявный default = true (undefined трактуется как «показывать»). */}
            {(page.sectionId === "consulting" ||
              page.sectionId === "academy" ||
              page.sectionId === "ai-products") && (
              <>
                <div className="flex items-start justify-between gap-4 rounded-sm border border-[#404040] bg-[#0A0A0A] p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[length:var(--text-14)] font-medium text-[#F0F0F0]">
                      Показывать в меню
                    </span>
                    <span className="text-[length:var(--text-12)] text-[#939393]">
                      Выпадающее меню в шапке и список на странице «Продукты».
                    </span>
                  </div>
                  <Switch
                    checked={page.showInMenu !== false}
                    onCheckedChange={(v) => updateMeta("showInMenu", v)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4 rounded-sm border border-[#404040] bg-[#0A0A0A] p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[length:var(--text-14)] font-medium text-[#F0F0F0]">
                      Показывать в футере
                    </span>
                    <span className="text-[length:var(--text-12)] text-[#939393]">
                      Колонка со списком продуктов в футере сайта.
                    </span>
                  </div>
                  <Switch
                    checked={page.showInFooter !== false}
                    onCheckedChange={(v) => updateMeta("showInFooter", v)}
                  />
                </div>

                <PageFormSelector
                  value={page.formId}
                  onChange={(v) => updateMeta("formId", v)}
                />
              </>
            )}
          </div>
          )}
        </div>
        )}

        {page.caseType !== "mini" && <Separator className="mb-8" />}

        {/* Blocks */}
        <div className="space-y-4">
          {page.caseType !== "mini" && (
            <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
              Блоки страницы
            </h2>
          )}

          <BlockList
            blocks={page.blocks}
            sectionId={page.sectionId}
            pageSlug={page.slug}
            hasExperts={expertProduct}
            experts={resolvedExperts}
            onToggleBlock={toggleBlock}
            onUpdateBlock={updateBlock}
            onReorderBlocks={reorderBlocks}
            onInsertBlock={insertBlock}
            onDeleteBlock={deleteBlock}
            disableInsert={page.caseType === "mini"}
          />
        </div>
       </div>
      </div>

      {/* Toolbar */}
      <EditorToolbar
        isDirty={isDirty}
        canUndo={canUndo}
        canRedo={canRedo}
        isPublished={page.status === "published"}
        onUndo={undo}
        onRedo={redo}
        onTogglePublish={(published) =>
          updateStatus(published ? "published" : "hidden")
        }
        onSave={handleSave}
        onCancel={handleBack}
      />

      {/* Unsaved changes dialog */}
      <UnsavedChangesDialog
        open={showUnsavedDialog}
        changes={changes}
        onCancel={handleCancelDialog}
        onDiscard={handleDiscardAndNavigate}
        onSave={handleSaveAndNavigate}
      />
    </div>
  );
}
