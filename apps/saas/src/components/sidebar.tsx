"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Input,
} from "@rocketmind/ui";
import {
  Plus,
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  Pencil,
  Trash2,
  LogOut,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  CircleDashed,
  Sun,
  Moon,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  markProjectAsSeen,
  useExperts,
  useExpertSessions,
  useNewProjects,
  useProjects,
} from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { useManager } from "@/lib/hooks";
import { NewProjectModal } from "@/components/new-project-modal";
import type {
  ExpertCodename,
  ExpertSessionStatus,
  Project,
} from "@/lib/types";
import { pickExpertForProject } from "@/lib/utils";
import { toast } from "sonner";

const PIPELINE_ORDER: ExpertCodename[] = ["R1", "R2", "R+", "R3", "R4", "R5"];

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const drawerMode = !!onNavigate;

  const {
    activeProjects,
    archivedProjects,
    renameProject,
    deleteProject,
    archiveProject,
    restoreProject,
  } = useProjects();
  const manager = useManager();
  const newProjects = useNewProjects();

  const [showArchived, setShowArchived] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeProjectId = params?.id as string | undefined;
  const activeExpertCodename =
    (searchParams?.get("expert") as ExpertCodename | null) ?? null;
  const isOnManager = pathname === "/manager";

  // Drawer vs desktop: разные состояния expand для UX
  const [drawerExpandedIds, setDrawerExpandedIds] = useState<Set<string>>(
    activeProjectId ? new Set([activeProjectId]) : new Set()
  );
  const [desktopExpandedIds, setDesktopExpandedIds] = useState<Set<string>>(
    activeProjectId ? new Set([activeProjectId]) : new Set()
  );
  useEffect(() => {
    if (!drawerMode && activeProjectId) {
      setDesktopExpandedIds((prev) => new Set([...prev, activeProjectId]));
    }
  }, [activeProjectId, drawerMode]);

  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set());
  const [pendingArchivedDeleteIds, setPendingArchivedDeleteIds] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  useEffect(() => {
    if (renamingId) renameInputRef.current?.focus();
  }, [renamingId]);

  function handleProjectClick(p: Project) {
    // Помечаем как прочитанный при первом клике
    if (newProjects.has(p.id)) markProjectAsSeen(p.id);
    // Открываем чат с текущим экспертом, чтобы он подсветился в sidebar
    const expert = pickExpertForProject(p);
    router.push(`/projects/${p.id}?expert=${encodeURIComponent(expert)}`);
    // В drawer-режиме также раскрываем, но не закрываем меню — пусть пользователь видит pipeline
    const toggleExpand = (prev: Set<string>) => {
      const next = new Set(prev);
      if (!next.has(p.id)) next.add(p.id);
      return next;
    };
    if (drawerMode) setDrawerExpandedIds(toggleExpand);
    else setDesktopExpandedIds(toggleExpand);
    onNavigate?.();
  }

  function toggleExpand(projectId: string) {
    const updater = (prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    };
    if (drawerMode) setDrawerExpandedIds(updater);
    else setDesktopExpandedIds(updater);
  }

  function startRename(p: Project) {
    setRenamingId(p.id);
    setRenameValue(p.name);
  }

  function handleRenameSubmit() {
    if (!renamingId) return;
    const name = renameValue.trim();
    if (name) renameProject(renamingId, name);
    setRenamingId(null);
    setRenameValue("");
  }

  function handleArchive(p: Project) {
    let undone = false;
    setPendingDeleteIds((prev) => new Set([...prev, p.id]));
    archiveProject(p.id);
    toast(`Проект «${p.name}» архивирован`, {
      duration: 8000,
      action: {
        label: "Отменить",
        onClick: () => {
          undone = true;
          restoreProject(p.id);
          setPendingDeleteIds((prev) => {
            const n = new Set(prev);
            n.delete(p.id);
            return n;
          });
        },
      },
      onAutoClose: () => {
        if (!undone) {
          setPendingDeleteIds((prev) => {
            const n = new Set(prev);
            n.delete(p.id);
            return n;
          });
        }
      },
      onDismiss: () => {
        if (!undone) {
          setPendingDeleteIds((prev) => {
            const n = new Set(prev);
            n.delete(p.id);
            return n;
          });
        }
      },
    });
  }

  function handleDeleteArchived(p: Project) {
    let undone = false;
    setPendingArchivedDeleteIds((prev) => new Set([...prev, p.id]));
    toast(`Проект «${p.name}» удалён`, {
      duration: 8000,
      action: {
        label: "Отменить",
        onClick: () => {
          undone = true;
          setPendingArchivedDeleteIds((prev) => {
            const n = new Set(prev);
            n.delete(p.id);
            return n;
          });
        },
      },
      onAutoClose: () => {
        if (undone) return;
        deleteProject(p.id);
        setPendingArchivedDeleteIds((prev) => {
          const n = new Set(prev);
          n.delete(p.id);
          return n;
        });
      },
      onDismiss: () => {
        if (undone) return;
        deleteProject(p.id);
        setPendingArchivedDeleteIds((prev) => {
          const n = new Set(prev);
          n.delete(p.id);
          return n;
        });
      },
    });
  }

  const visibleActiveProjects = activeProjects.filter((p) => !pendingDeleteIds.has(p.id));

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-background ${
        drawerMode ? "w-full" : "w-[312px]"
      }`}
    >
      <LogoHeader onClose={onNavigate} />

      <div className="flex-1 overflow-y-auto pl-4">
        {/* ── R-менеджер (верхнеуровневая сущность) ───────────────────────── */}
        <div className="pr-4 py-3">
          <Link
            href="/manager"
            onClick={() => onNavigate?.()}
            className={`flex items-center gap-2 rounded-sm p-2 transition-colors ${
              isOnManager
                ? "bg-rm-gray-1 text-foreground"
                : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
            }`}
          >
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <Image
                src={manager.avatar_url}
                alt={manager.name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[length:var(--text-14)] text-foreground">
                {manager.name}
              </p>
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                {manager.role}
              </p>
            </div>
            {isOnManager && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--rm-yellow-100)]"
                aria-hidden
              />
            )}
          </Link>
        </div>

        {/* Divider — подчёркивает, что R-менеджер отдельный уровень */}
        <div className="h-px bg-border mr-4" />

        {/* ── Проекты header ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 pr-4 py-3">
          <Link
            href="/dashboard"
            onClick={() => onNavigate?.()}
            className="flex-1 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            Проекты
          </Link>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            aria-label="Новый проект"
            className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm bg-rm-gray-1 text-muted-foreground hover:bg-rm-gray-2 hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="h-px bg-border mr-4" />

        {/* Empty state */}
        {visibleActiveProjects.length === 0 && (
          <p className="py-4 pr-4 text-center text-[length:var(--text-12)] text-muted-foreground">
            Нет проектов.{" "}
            <Link
              href="/manager"
              onClick={() => onNavigate?.()}
              className="text-foreground underline underline-offset-2"
            >
              Обсудить с R-менеджером
            </Link>
          </p>
        )}

        {/* Project groups */}
        {visibleActiveProjects.map((p, idx) => {
          const isExpanded = drawerMode
            ? drawerExpandedIds.has(p.id)
            : desktopExpandedIds.has(p.id);
          return (
            <div key={p.id}>
              <ProjectItemWithExperts
                project={p}
                isActive={p.id === activeProjectId}
                isExpanded={isExpanded}
                isNew={newProjects.has(p.id)}
                activeExpertCodename={activeExpertCodename}
                isRenaming={p.id === renamingId}
                renameValue={renameValue}
                renameInputRef={renameInputRef}
                onOpen={() => handleProjectClick(p)}
                onToggle={() => toggleExpand(p.id)}
                onExpertSelect={(codename) => {
                  if (newProjects.has(p.id)) markProjectAsSeen(p.id);
                  router.push(`/projects/${p.id}?expert=${encodeURIComponent(codename)}`);
                  onNavigate?.();
                }}
                onRenameChange={setRenameValue}
                onRenameSubmit={handleRenameSubmit}
                onRenameCancel={() => setRenamingId(null)}
                onStartRename={() => startRename(p)}
                onArchive={() => handleArchive(p)}
              />
              {idx < visibleActiveProjects.length - 1 && (
                <div className="h-px bg-border mr-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Архив */}
      {archivedProjects.length > 0 && (
        <div className="border-t border-border pl-4">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="flex w-full items-center gap-2 pr-4 py-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`h-2 w-2 transition-transform ${showArchived ? "" : "-rotate-90"}`}
            />
            Архив ({archivedProjects.length})
          </button>
          <Collapsible open={showArchived}>
            <div className="pb-2">
              {archivedProjects
                .filter((p) => !pendingArchivedDeleteIds.has(p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    className="group flex items-center gap-1 rounded-sm pr-2 py-1.5 text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground cursor-pointer transition-colors"
                    onClick={() => {
                      if (newProjects.has(p.id)) markProjectAsSeen(p.id);
                      router.push(`/projects/${p.id}`);
                      onNavigate?.();
                    }}
                  >
                    <Archive className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    <span className="flex-1 truncate text-[length:var(--text-14)] opacity-60">
                      {p.name}
                    </span>
                    <button
                      className="shrink-0 rounded-sm p-1 text-muted-foreground hover:bg-rm-gray-2 hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreProject(p.id);
                        toast.success(`Проект «${p.name}» восстановлен`);
                      }}
                      title="Восстановить"
                    >
                      <ArchiveRestore className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="shrink-0 rounded-sm p-1 text-[var(--rm-red-500)] hover:bg-rm-gray-2 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteArchived(p);
                      }}
                      title="Удалить навсегда"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          </Collapsible>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border px-3 py-2">
        <UserMenu user={user} onLogout={logout} />
      </div>

      {/* Модалка быстрого создания */}
      <NewProjectModal
        open={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
      />
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjectItemWithExperts — группа проекта с раскрывающимся списком R-экспертов
// ─────────────────────────────────────────────────────────────────────────────

function ProjectItemWithExperts({
  project,
  isActive,
  isExpanded,
  isNew,
  activeExpertCodename,
  isRenaming,
  renameValue,
  renameInputRef,
  onOpen,
  onToggle,
  onExpertSelect,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  onStartRename,
  onArchive,
}: {
  project: Project;
  isActive: boolean;
  isExpanded: boolean;
  isNew: boolean;
  activeExpertCodename: ExpertCodename | null;
  isRenaming: boolean;
  renameValue: string;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  onOpen: () => void;
  onToggle: () => void;
  onExpertSelect: (codename: ExpertCodename) => void;
  onRenameChange: (v: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onStartRename: () => void;
  onArchive: () => void;
}) {
  return (
    <div className="flex flex-col gap-1 py-4 pr-4">
      {isRenaming ? (
        <Input
          ref={renameInputRef}
          size="sm"
          value={renameValue}
          onChange={(e) => onRenameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRenameSubmit();
            if (e.key === "Escape") onRenameCancel();
          }}
          onBlur={onRenameSubmit}
        />
      ) : (
        <div
          data-new={isNew || undefined}
          className={`group flex items-center gap-2 rounded-sm p-2 cursor-pointer transition-colors ${
            isActive
              ? "bg-rm-gray-1 text-foreground"
              : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
          } data-[new=true]:bg-[var(--rm-yellow-10)] data-[new=true]:text-foreground data-[new=true]:rm-new-pulse`}
          onClick={onOpen}
        >
          {/* Chevron — раскрывает/сворачивает без навигации. Тап-зона расширена до 28px */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="-m-2 shrink-0 flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-2 hover:text-foreground transition-colors"
            aria-label={isExpanded ? "Свернуть экспертов" : "Раскрыть экспертов"}
          >
            <ChevronRight
              className={`h-2 w-2 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
          <span
            className="flex-1 truncate text-[length:var(--text-14)]"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onStartRename();
            }}
            title="Двойной клик — переименовать"
          >
            {project.name}
          </span>
          {/* Прогресс N/M — рядом с именем */}
          <span className="shrink-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.04em] text-muted-foreground">
            {project.experts_completed}/{project.experts_total}
          </span>
          {/* Меню действий */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm p-0.5 hover:bg-rm-gray-2"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[70] w-40">
              <DropdownMenuItem onClick={onStartRename}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Переименовать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="mr-2 h-3.5 w-3.5" />
                Архивировать
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* R-команда (nested) */}
      <Collapsible open={isExpanded}>
        <ExpertsNested
          projectId={project.id}
          activeExpertCodename={isActive ? activeExpertCodename : null}
          currentExpertCodename={project.current_expert_codename}
          onExpertSelect={onExpertSelect}
        />
      </Collapsible>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExpertsNested — список R-экспертов под проектом с статусами
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ExpertSessionStatus, string> = {
  not_started: "Не начата",
  in_progress: "В работе",
  awaiting_validation: "Ждёт валидации",
  completed: "Завершена",
};

function ExpertsNested({
  projectId,
  activeExpertCodename,
  currentExpertCodename,
  onExpertSelect,
}: {
  projectId: string;
  activeExpertCodename: ExpertCodename | null;
  /** Текущий эксперт проекта — не затемняется даже если not_started. */
  currentExpertCodename: ExpertCodename | null;
  onExpertSelect: (codename: ExpertCodename) => void;
}) {
  const { experts } = useExperts();
  const { sessions } = useExpertSessions(projectId);

  return (
    <div className="flex flex-col gap-0.5">
      {PIPELINE_ORDER.map((codename) => {
        const expert = experts.find((e) => e.codename === codename);
        const session = sessions.find((s) => s.expert_codename === codename);
        if (!expert) return null;
        const status: ExpertSessionStatus = session?.status ?? "not_started";
        const isSelected = activeExpertCodename === codename;
        // Not_started экспертов приглушаем до 50%, кроме текущего эксперта проекта.
        // (DS §8.16 pipeline step dimmed state)
        const isDimmed =
          status === "not_started" && currentExpertCodename !== codename;
        const StatusIcon =
          status === "completed"
            ? CheckCircle2
            : status === "in_progress" || status === "awaiting_validation"
              ? CircleDashed
              : Circle;

        return (
          <div
            key={codename}
            onClick={() => onExpertSelect(codename)}
            className={`flex items-center gap-2 rounded-sm py-1 pr-2 cursor-pointer transition-colors ${
              isSelected
                ? "bg-rm-gray-2 text-foreground"
                : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
            } ${isDimmed ? "opacity-50 hover:opacity-100" : ""}`}
          >
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
              {expert.avatar_url && (
                <Image
                  src={expert.avatar_url}
                  alt={expert.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.04em]">
                  {codename}
                </span>
                <span className="truncate text-[length:var(--text-14)]">
                  {expert.name}
                </span>
              </div>
              <p className="truncate text-[length:var(--text-12)] text-muted-foreground">
                {expert.role}
              </p>
            </div>
            <StatusIcon
              aria-label={STATUS_LABEL[status]}
              className={`h-5 w-5 shrink-0 ${
                status === "completed"
                  ? "text-[var(--rm-yellow-100)]"
                  : status === "in_progress"
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Collapsible — grid row animation
// ─────────────────────────────────────────────────────────────────────────────

function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-200 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LogoHeader
// ─────────────────────────────────────────────────────────────────────────────

function LogoHeader({ onClose }: { onClose?: () => void }) {
  const { resolvedTheme } = useTheme();
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const src =
    resolvedTheme === "dark"
      ? `${bp}/text_logo_dark_background_en.svg`
      : `${bp}/text_logo_light_background_en.svg`;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <Link href="/dashboard" aria-label="На дашборд">
        <Image src={src} alt="Rocketmind" width={140} height={24} priority />
      </Link>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
          aria-label="Закрыть меню"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UserMenu
// ─────────────────────────────────────────────────────────────────────────────

type FontSize = "sm" | "md" | "lg";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: "100%",
  md: "112.5%",
  lg: "125%",
};

function applyFontSize(size: FontSize) {
  document.documentElement.style.fontSize = FONT_SIZE_MAP[size];
}

function UserMenu({
  user,
  onLogout,
}: {
  user: { email: string } | null;
  onLogout: () => void;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState<FontSize>("sm");

  useEffect(() => {
    const saved = (localStorage.getItem("rm-font-size") as FontSize) ?? "sm";
    setFontSize(saved);
    applyFontSize(saved);
  }, []);

  function handleFontSize(size: FontSize) {
    setFontSize(size);
    localStorage.setItem("rm-font-size", size);
    applyFontSize(size);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-rm-gray-1 transition-colors">
          <Avatar size="xs">
            <AvatarFallback>
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate text-left text-[length:var(--text-12)] text-muted-foreground">
            {user?.email}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="z-[70] w-64">
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="flex-1 text-[length:var(--text-16)]">Размер</span>
          <div className="flex gap-1">
            {(["sm", "md", "lg"] as const).map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => handleFontSize(s)}
                className={`flex h-9 w-9 items-center justify-center rounded-sm font-medium transition-colors ${
                  fontSize === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
                }`}
                style={{ fontSize: i === 0 ? "12px" : i === 1 ? "15px" : "18px" }}
              >
                Аа
              </button>
            ))}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="h-auto py-3 text-[length:var(--text-16)] [&_svg]:!size-5"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="mr-3 h-5 w-5" />
          ) : (
            <Moon className="mr-3 h-5 w-5" />
          )}
          {resolvedTheme === "dark" ? "Светлая тема" : "Тёмная тема"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="h-auto py-3 text-[length:var(--text-16)] [&_svg]:!size-5 text-[var(--rm-red-500)]"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
