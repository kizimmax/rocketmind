"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  Eye,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Note,
  Textarea,
} from "@rocketmind/ui";
import { toast } from "sonner";
import {
  markProjectAsSeen,
  useArtifacts,
  useExperts,
  useExpertMessages,
  useExpertSessions,
  useProject,
} from "@/lib/hooks";
import { ExpertChat } from "@/components/expert-chat";
import { FilePreviewDialog } from "@/components/file-preview-dialog";
import type { Artifact, ExpertCodename } from "@/lib/types";
import { pickExpertForProject } from "@/lib/utils";

// Pipeline + предзаданные названия артефактов для скелетонов панели
const PIPELINE_ORDER: ExpertCodename[] = ["R1", "R2", "R+", "R3", "R4", "R5"];
const EXPERT_ARTIFACT_TITLES: Record<ExpertCodename, string> = {
  R1: "Маркет-бриф",
  R2: "Сегменты ЦА",
  "R+": "Проверенные гипотезы",
  R3: "Бизнес-модель",
  R4: "MVP-план",
  R5: "Питч",
};

type ArtifactSlot =
  | { kind: "artifact"; artifact: Artifact }
  | { kind: "skeleton"; codename: ExpertCodename; title: string };

function buildArtifactSlots(artifacts: Artifact[]): ArtifactSlot[] {
  const slots: ArtifactSlot[] = [];
  for (const codename of PIPELINE_ORDER) {
    const forCode = artifacts.filter((a) => a.expert_codename === codename);
    if (forCode.length > 0) {
      for (const artifact of forCode) slots.push({ kind: "artifact", artifact });
    } else {
      slots.push({
        kind: "skeleton",
        codename,
        title: EXPERT_ARTIFACT_TITLES[codename],
      });
    }
  }
  return slots;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  created_at: string;
  /** Blob-URL для предпросмотра (если файл загружен через drag-drop). */
  url?: string;
  /** MIME-тип. */
  type?: string;
}

type PanelTab = "artifacts" | "files";

export default function ProjectClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project = useProject(id);
  const { getExpert } = useExperts();
  const { artifacts } = useArtifacts(id);
  const { sessions } = useExpertSessions(id);
  const [artifactsOpen, setArtifactsOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // При первом открытии проекта — снимаем pulse-флаг в sidebar
  useEffect(() => {
    markProjectAsSeen(id);
  }, [id]);

  // Активный эксперт: из URL ?expert=…, иначе pickExpertForProject (current/R5/R1)
  const expertParam = searchParams?.get("expert") as ExpertCodename | null;
  const activeExpertCodename: ExpertCodename =
    expertParam ?? (project ? pickExpertForProject(project) : "R1");

  // Синхронизируем URL, чтобы sidebar корректно подсвечивал эксперта
  useEffect(() => {
    if (!expertParam && project) {
      router.replace(`/projects/${id}?expert=${encodeURIComponent(activeExpertCodename)}`, {
        scroll: false,
      });
    }
  }, [expertParam, project, id, activeExpertCodename, router]);

  const activeExpert = useMemo(
    () => getExpert(activeExpertCodename),
    [activeExpertCodename, getExpert]
  );

  const activeSession = useMemo(
    () => sessions.find((s) => s.expert_codename === activeExpertCodename),
    [sessions, activeExpertCodename]
  );
  const activeMessages = useExpertMessages(activeSession?.id);

  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);

  const handleDownload = useCallback((artifact: Artifact) => {
    const body = `${artifact.title}\n\nЭксперт: ${artifact.expert_codename}\nТип: ${artifact.type}\n\n${artifact.preview}\n`;
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Скачан «${artifact.title}»`);
  }, []);

  const handleHoverArtifact = useCallback((id: string | null) => {
    setActiveArtifactId(id);
  }, []);

  // Пользовательские файлы — отдельная вкладка, ожидают валидации экспертом.
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [panelTab, setPanelTab] = useState<PanelTab>("artifacts");
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const handleAddFiles = useCallback(
    (
      files: Array<{ name: string; size: number; url?: string; type?: string }>
    ) => {
      if (files.length === 0) return;
      const added: UploadedFile[] = files.map((f) => ({
        id: `uf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: f.name,
        size: f.size,
        url: f.url,
        type: f.type,
        created_at: new Date().toISOString(),
      }));
      setUploadedFiles((prev) => [...prev, ...added]);
      toast.success(
        added.length === 1
          ? `Файл «${added[0].name}» добавлен`
          : `Добавлено ${added.length} файлов`
      );
    },
    []
  );

  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // Drag-drop в правую панель: файл сразу попадает в «Файлы» + активирует вкладку.
  const [isPanelDragOver, setIsPanelDragOver] = useState(false);
  const panelDragCounter = useRef(0);

  function handlePanelDragEnter(e: React.DragEvent) {
    if (!Array.from(e.dataTransfer?.types ?? []).includes("Files")) return;
    e.preventDefault();
    panelDragCounter.current += 1;
    setIsPanelDragOver(true);
  }
  function handlePanelDragOver(e: React.DragEvent) {
    if (!Array.from(e.dataTransfer?.types ?? []).includes("Files")) return;
    e.preventDefault();
  }
  function handlePanelDragLeave(e: React.DragEvent) {
    if (!Array.from(e.dataTransfer?.types ?? []).includes("Files")) return;
    e.preventDefault();
    panelDragCounter.current = Math.max(0, panelDragCounter.current - 1);
    if (panelDragCounter.current === 0) setIsPanelDragOver(false);
  }
  function handlePanelDrop(e: React.DragEvent) {
    if (!Array.from(e.dataTransfer?.types ?? []).includes("Files")) return;
    e.preventDefault();
    panelDragCounter.current = 0;
    setIsPanelDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) {
      handleAddFiles(nativeToUpload(dropped));
      setPanelTab("files");
    }
  }

  const artifactSlots = useMemo(() => buildArtifactSlots(artifacts), [artifacts]);

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="space-y-3 text-center">
          <Note variant="error">Проект не найден</Note>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            На дашборд
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* ── CENTER: expert chat ────────────────────────────────────────────── */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Header: название проекта + % готовности + toggle; снизу — прогресс-бар 2px.
            На мобильных данные отображаются в MobileHeader — тут скрываем. */}
        <div className="relative hidden h-12 shrink-0 items-center gap-4 border-b border-border px-4 lg:flex">
          <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
            {project.name}
          </p>

          <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-100)]">
            {project.score ?? 0}%
          </p>

          <button
            type="button"
            onClick={() => setArtifactsOpen((v) => !v)}
            aria-label={
              artifactsOpen ? "Свернуть панель артефактов" : "Раскрыть панель артефактов"
            }
            className="hidden items-center justify-center border-0 bg-transparent text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            {artifactsOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>

          <div
            aria-hidden
            className="absolute bottom-0 left-0 h-0.5 bg-[var(--rm-yellow-100)] transition-[width] duration-500 ease-out"
            style={{ width: `${project.score ?? 0}%` }}
          />
        </div>

        {/* Chat */}
        {activeExpert ? (
          <ExpertChat
            expert={activeExpert}
            initialMessages={activeMessages}
            sessionStatus={activeSession?.status}
            artifacts={artifacts}
            activeArtifactId={activeArtifactId}
            onArtifactHover={handleHoverArtifact}
            onArtifactPreview={setPreviewArtifact}
            onArtifactDownload={handleDownload}
            onArtifactsOpenRequest={() => setSheetOpen(true)}
            artifactsScore={project.score}
            onFilesUpload={handleAddFiles}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Выберите эксперта в левом меню
          </div>
        )}
      </div>

      {/* ── RIGHT: artifacts panel (collapsible) ───────────────────────────── */}
      <aside
        aria-hidden={!artifactsOpen}
        onDragEnter={handlePanelDragEnter}
        onDragOver={handlePanelDragOver}
        onDragLeave={handlePanelDragLeave}
        onDrop={handlePanelDrop}
        className={`relative hidden shrink-0 overflow-hidden border-l bg-background transition-[width,border-color,opacity] duration-300 ease-out lg:flex lg:flex-col ${
          artifactsOpen
            ? "w-80 border-border opacity-100"
            : "w-0 border-transparent opacity-0"
        }`}
      >
        {isPanelDragOver && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center border-2 border-dashed border-[var(--rm-yellow-100)] bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-foreground">
              <Plus className="h-8 w-8 text-[var(--rm-yellow-100)]" />
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em]">
                Отпустите, чтобы загрузить
              </p>
            </div>
          </div>
        )}
        <div className="flex w-80 shrink-0 flex-col">
          <PanelTabs
            tab={panelTab}
            onChange={setPanelTab}
            artifactsCount={artifacts.length}
            filesCount={uploadedFiles.length}
          />
          <div className="flex-1 overflow-y-auto p-3">
            {panelTab === "artifacts" ? (
              <div className="space-y-2">
                {artifactSlots.map((slot) =>
                  slot.kind === "artifact" ? (
                    <ArtifactCard
                      key={slot.artifact.id}
                      artifact={slot.artifact}
                      isActive={activeArtifactId === slot.artifact.id}
                      onHover={handleHoverArtifact}
                      onPreview={() => setPreviewArtifact(slot.artifact)}
                      onDownload={() => handleDownload(slot.artifact)}
                    />
                  ) : (
                    <ArtifactSkeletonCard
                      key={`skel-${slot.codename}`}
                      codename={slot.codename}
                      title={slot.title}
                    />
                  )
                )}
              </div>
            ) : (
              <FilesTab
                files={uploadedFiles}
                onAdd={handleAddFiles}
                onRemove={handleRemoveFile}
                onPreview={setPreviewFile}
              />
            )}
          </div>
        </div>
      </aside>

      {/* Mobile bottom-sheet — выезжает снизу, закрывается свайпом за handle */}
      <MobileArtifactsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        slots={artifactSlots}
        artifactsCount={artifacts.length}
        uploadedFiles={uploadedFiles}
        tab={panelTab}
        onTabChange={setPanelTab}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
        onFilePreview={setPreviewFile}
        activeArtifactId={activeArtifactId}
        score={project.score}
        onHover={handleHoverArtifact}
        onPreview={setPreviewArtifact}
        onDownload={handleDownload}
      />

      <ArtifactPreviewDialog
        artifact={previewArtifact}
        onOpenChange={(open) => !open && setPreviewArtifact(null)}
        onDownload={handleDownload}
      />

      <FilePreviewDialog
        file={previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile artifacts sheet — выезжает снизу, закрывается свайпом за drag-handle
// ─────────────────────────────────────────────────────────────────────────────

function MobileArtifactsSheet({
  open,
  onOpenChange,
  slots,
  artifactsCount,
  uploadedFiles,
  tab,
  onTabChange,
  onAddFiles,
  onRemoveFile,
  onFilePreview,
  activeArtifactId,
  score,
  onHover,
  onPreview,
  onDownload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots: ArtifactSlot[];
  artifactsCount: number;
  uploadedFiles: UploadedFile[];
  tab: PanelTab;
  onTabChange: (t: PanelTab) => void;
  onAddFiles: (
    files: Array<{ name: string; size: number; url?: string; type?: string }>
  ) => void;
  onRemoveFile: (id: string) => void;
  onFilePreview: (file: UploadedFile) => void;
  activeArtifactId: string | null;
  score: number | null;
  onHover: (id: string | null) => void;
  onPreview: (a: Artifact) => void;
  onDownload: (a: Artifact) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startY: 0, dy: 0, active: false, pointerId: 0 });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = {
      startY: e.clientY,
      dy: 0,
      active: true,
      pointerId: e.pointerId,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (contentRef.current) contentRef.current.style.transition = "none";
    if (overlayRef.current) overlayRef.current.style.transition = "none";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const dy = Math.max(0, e.clientY - drag.current.startY);
    drag.current.dy = dy;
    const el = contentRef.current;
    if (el) {
      el.style.transform = `translateY(${dy}px)`;
      // Затухание подложки пропорционально прогрессу свайпа
      const progress = Math.min(1, dy / Math.max(1, el.offsetHeight));
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(1 - progress);
      }
    }
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(drag.current.pointerId);
    } catch {}
    const { dy } = drag.current;
    const el = contentRef.current;
    if (!el) return;

    if (dy > 120) {
      // Отключаем встроенные data-state=closed keyframes — слайд и fade
      // ведём через transform/opacity, иначе Radix проиграет вторую анимацию.
      el.classList.add("rm-sheet-manual-close");
      el.style.transition = "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)";
      el.style.transform = "translateY(100%)";
      if (overlayRef.current) {
        overlayRef.current.classList.add("rm-sheet-manual-close");
        overlayRef.current.style.transition =
          "opacity 220ms cubic-bezier(0.32, 0.72, 0, 1)";
        overlayRef.current.style.opacity = "0";
      }
      const done = () => {
        el.removeEventListener("transitionend", done);
        onOpenChange(false);
      };
      el.addEventListener("transitionend", done);
    } else {
      el.style.transition = "transform 200ms ease-out";
      el.style.transform = "";
      if (overlayRef.current) {
        overlayRef.current.style.transition = "opacity 200ms ease-out";
        overlayRef.current.style.opacity = "";
      }
    }
  }

  // Перед каждым открытием сбрасываем inline-стили и класс manual-close,
  // чтобы следующая открытие-анимация сыграла чисто.
  useEffect(() => {
    if (!open) return;
    const el = contentRef.current;
    if (el) {
      el.classList.remove("rm-sheet-manual-close");
      el.style.transition = "";
      el.style.transform = "";
    }
    const ov = overlayRef.current;
    if (ov) {
      ov.classList.remove("rm-sheet-manual-close");
      ov.style.transition = "";
      ov.style.opacity = "";
    }
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          ref={overlayRef}
          className="rm-sheet-overlay fixed inset-0 z-50 bg-[var(--rm-gray-alpha-600)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 lg:hidden"
        />
        <DialogPrimitive.Content
          ref={contentRef}
          className="rm-sheet fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col rounded-t-lg border-t border-border bg-card lg:hidden"
        >
          {/* Drag handle — потянуть вниз чтобы закрыть */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            className="flex h-7 shrink-0 cursor-grab items-center justify-center touch-none"
          >
            <span className="h-1 w-10 rounded-full bg-foreground/50" />
          </div>
          <DialogPrimitive.Title className="sr-only">
            Артефакты · {artifactsCount}
          </DialogPrimitive.Title>
          <PanelTabs
            tab={tab}
            onChange={onTabChange}
            artifactsCount={artifactsCount}
            filesCount={uploadedFiles.length}
            score={score}
          />
          <div className="flex-1 overflow-y-auto p-3">
            {tab === "artifacts" ? (
              <div className="space-y-2">
                {slots.map((slot) =>
                  slot.kind === "artifact" ? (
                    <ArtifactCard
                      key={slot.artifact.id}
                      artifact={slot.artifact}
                      isActive={activeArtifactId === slot.artifact.id}
                      onHover={onHover}
                      onPreview={() => onPreview(slot.artifact)}
                      onDownload={() => onDownload(slot.artifact)}
                    />
                  ) : (
                    <ArtifactSkeletonCard
                      key={`skel-${slot.codename}`}
                      codename={slot.codename}
                      title={slot.title}
                    />
                  )
                )}
              </div>
            ) : (
              <FilesTab
                files={uploadedFiles}
                onAdd={onAddFiles}
                onRemove={onRemoveFile}
                onPreview={onFilePreview}
              />
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Artifact card + empty
// ─────────────────────────────────────────────────────────────────────────────

function ArtifactCard({
  artifact,
  isActive,
  onHover,
  onPreview,
  onDownload,
  onDelete,
}: {
  artifact: Artifact;
  isActive: boolean;
  onHover: (id: string | null) => void;
  onPreview: () => void;
  onDownload: () => void;
  onDelete?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isActive]);

  return (
    <div
      ref={ref}
      data-artifact-id={artifact.id}
      onClick={onPreview}
      onMouseEnter={() => onHover(artifact.id)}
      onMouseLeave={() => onHover(null)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-sm border bg-background transition-colors ${
        isActive
          ? "border-[var(--rm-yellow-100)]"
          : "border-border hover:border-[var(--rm-yellow-100)]"
      }`}
    >
      {/* Hover-подсказки: «Посмотреть» всегда, «Удалить» если артефакт пользовательский */}
      <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto">
        <span
          aria-hidden
          className="inline-flex items-center gap-1 rounded-sm bg-foreground px-2 py-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-background"
        >
          <Eye className="h-3.5 w-3.5" />
          Посмотреть
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Удалить"
            aria-label="Удалить артефакт"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-rm-gray-1 text-muted-foreground transition-colors hover:bg-[var(--rm-red-500)] hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {/* Header: иконка + название + кодовое имя эксперта */}
      <div className="flex items-center gap-2 px-3 pt-3">
        <FileText className="h-5 w-5 shrink-0 text-foreground" />
        <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-foreground">
          {artifact.title}
        </p>
        <span className="shrink-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-muted-foreground">
          {artifact.expert_codename}
        </span>
      </div>
      {/* Body: превью (copy 12) + кнопка скачивания справа */}
      <div className="flex items-stretch pt-3">
        <div className="min-w-0 flex-1 px-3 pb-4">
          <p className="rm-clamp-3 font-[family-name:var(--font-caption-family)] text-[length:var(--text-12)] font-normal leading-[1.36] tracking-[0.02em] text-muted-foreground">
            {artifact.preview}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          title="Скачать"
          aria-label="Скачать артефакт"
          className="flex w-10 shrink-0 items-center justify-center self-stretch rounded-tl-[4px] rounded-br-[4px] bg-rm-gray-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function ArtifactSkeletonCard({
  codename,
  title,
}: {
  codename: ExpertCodename;
  title: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-sm border border-transparent bg-rm-gray-1">
      {/* Header: иконка + название + кодовое имя эксперта, все приглушены */}
      <div className="flex items-center gap-2 px-3 pt-3">
        <FileText className="h-5 w-5 shrink-0 text-muted-foreground/40" />
        <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-muted-foreground/60">
          {title}
        </p>
        <span className="shrink-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-muted-foreground/40">
          {codename}
        </span>
      </div>
      {/* Skeleton-полосы вместо превью */}
      <div className="flex flex-col gap-[9px] px-3 pb-4 pt-3">
        <span className="h-px w-[85%] bg-muted-foreground/20" />
        <span className="h-px w-[70%] bg-muted-foreground/20" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Табы панели и вкладка «Файлы»
// ─────────────────────────────────────────────────────────────────────────────

function PanelTabs({
  tab,
  onChange,
  artifactsCount,
  filesCount,
  score,
}: {
  tab: PanelTab;
  onChange: (t: PanelTab) => void;
  artifactsCount: number;
  filesCount: number;
  score?: number | null;
}) {
  return (
    <div className="relative flex h-12 shrink-0 items-center border-b border-border px-2">
      <div className="flex flex-1 items-center gap-1">
        <TabButton
          active={tab === "artifacts"}
          onClick={() => onChange("artifacts")}
          label={`Артефакты · ${artifactsCount}`}
        />
        <TabButton
          active={tab === "files"}
          onClick={() => onChange("files")}
          label={`Файлы · ${filesCount}`}
        />
      </div>
      {score != null && (
        <p className="pr-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-100)]">
          {score}%
        </p>
      )}
      {score != null && (
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-0.5 bg-[var(--rm-yellow-100)] transition-[width] duration-500 ease-out"
          style={{ width: `${score}%` }}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative px-2 pt-3 pb-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-colors ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-2 bottom-0 h-0.5 bg-foreground"
        />
      )}
    </button>
  );
}

function FilesTab({
  files,
  onAdd,
  onRemove,
  onPreview,
}: {
  files: UploadedFile[];
  onAdd: (
    files: Array<{ name: string; size: number; url?: string; type?: string }>
  ) => void;
  onRemove: (id: string) => void;
  onPreview: (file: UploadedFile) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false);

  function handleSaveText(title: string, content: string) {
    const trimmedTitle = title.trim();
    // Если имя пустое — берём первые 6 слов текста; fallback — «Заметка».
    const fallbackFromContent = content
      .replace(/^#+\s*/, "") // убираем markdown-заголовки в начале
      .trim()
      .split(/\s+/)
      .slice(0, 6)
      .join(" ")
      .slice(0, 60);
    const safeTitle = trimmedTitle || fallbackFromContent || "Заметка";
    const filename = safeTitle.toLowerCase().endsWith(".md")
      ? safeTitle
      : `${safeTitle}.md`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    onAdd([{ name: filename, size: blob.size, url, type: "text/markdown" }]);
    setIsTextDialogOpen(false);
  }

  return (
    <div className="space-y-2">
      <p className="px-1 pb-2 text-[length:var(--text-12)] leading-[1.36] text-muted-foreground">
        Добавьте справочные документы, данные или файлы, которые эксперты будет
        использовать в качестве контекста. Вы можете попросить экспертов загрузить
        или отредактировать файлы в этом проекте.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-1 items-center justify-start gap-1.5 rounded-sm border-0 bg-transparent px-3 py-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:bg-rm-gray-1 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить файлы
        </button>
        <button
          type="button"
          onClick={() => setIsTextDialogOpen(true)}
          title="Добавить текст"
          aria-label="Добавить текст"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-rm-gray-1 hover:text-foreground"
        >
          <FileText className="h-4 w-4" />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          if (picked.length > 0) onAdd(nativeToUpload(picked));
          e.target.value = "";
        }}
      />
      <AddTextDialog
        open={isTextDialogOpen}
        onOpenChange={setIsTextDialogOpen}
        onSave={handleSaveText}
      />
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <p className="text-[length:var(--text-12)] text-muted-foreground">
            Файлы появятся здесь. Их нужно провалидировать с экспертом, прежде чем они станут артефактами.
          </p>
        </div>
      ) : (
        files.map((f) => (
          <FileRow
            key={f.id}
            file={f}
            onPreview={() => onPreview(f)}
            onRemove={() => onRemove(f.id)}
          />
        ))
      )}
    </div>
  );
}

function FileRow({
  file,
  onPreview,
  onRemove,
}: {
  file: UploadedFile;
  onPreview: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      onClick={onPreview}
      className="group flex cursor-pointer items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 transition-colors hover:border-[var(--rm-yellow-100)]"
    >
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <p className="min-w-0 flex-1 truncate text-[length:var(--text-14)] text-foreground">
        {file.name}
      </p>
      <span className="shrink-0 text-[length:var(--text-12)] text-muted-foreground group-hover:hidden">
        {formatFileSize(file.size)}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Удалить ${file.name}`}
        title="Удалить"
        className="hidden h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-rm-gray-1 hover:text-foreground group-hover:flex"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AddTextDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, content: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setContent("");
    }
  }, [open]);

  function handleSave() {
    if (!content.trim()) return;
    onSave(title, content);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-lg flex-col gap-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="font-[family-name:var(--font-heading-family)] uppercase">
            Добавьте текст
          </DialogTitle>
          <DialogDescription>
            Вставьте или введите текст ниже. Он будет сохранён как файл, на который эксперты смогут ссылаться.
          </DialogDescription>
        </DialogHeader>
        <DialogClose
          aria-label="Закрыть"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-rm-gray-1 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </DialogClose>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Название (без расширения)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Markdown-текст…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="min-h-[200px] font-[family-name:var(--font-caption-family)] text-[length:var(--text-14)]"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={!content.trim()}
          >
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function nativeToUpload(
  files: File[]
): Array<{ name: string; size: number; url: string; type: string }> {
  return files.map((f) => ({
    name: f.name,
    size: f.size,
    url: URL.createObjectURL(f),
    type: f.type,
  }));
}

function ArtifactPreviewDialog({
  artifact,
  onOpenChange,
  onDownload,
}: {
  artifact: Artifact | null;
  onOpenChange: (open: boolean) => void;
  onDownload: (a: Artifact) => void;
}) {
  return (
    <Dialog open={!!artifact} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {artifact && (
          <>
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-heading-family)] uppercase">
                {artifact.title}
              </DialogTitle>
              <DialogDescription className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
                {artifact.expert_codename} · {artifact.type}
              </DialogDescription>
            </DialogHeader>
            <p className="whitespace-pre-wrap text-[length:var(--text-14)] text-foreground">
              {artifact.preview}
            </p>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onDownload(artifact)}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Скачать
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmptyArtifacts() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
      <FileText className="h-6 w-6 text-muted-foreground" />
      <p className="text-[length:var(--text-12)] text-muted-foreground">
        Артефакты появятся, когда эксперты завершат этапы и вы валидируете их.
      </p>
    </div>
  );
}
