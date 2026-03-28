"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
  Sun,
  Moon,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useCases, useCaseAgents } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { getInitials } from "@/lib/utils";
import type { Case } from "@/lib/types";
import { toast } from "sonner";

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const drawerMode = !!onNavigate;

  const {
    activeCases,
    archivedCases,
    createCase,
    archiveCase,
    restoreCase,
    renameCase,
    deleteCase,
  } = useCases();
  const [showArchived, setShowArchived] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const activeCaseId =
    (params?.id as string | undefined) ??
    searchParams?.get("caseId") ??
    undefined;
  const activeAgentId = searchParams?.get("agent") ?? null;

  // Drawer mode: set of expanded case ids
  const [drawerExpandedIds, setDrawerExpandedIds] = useState<Set<string>>(
    activeCaseId ? new Set([activeCaseId]) : new Set()
  );
  // Desktop mode: set of expanded case ids; adds activeCaseId when navigating via agent
  const [desktopExpandedIds, setDesktopExpandedIds] = useState<Set<string>>(
    activeCaseId ? new Set([activeCaseId]) : new Set()
  );
  useEffect(() => {
    if (!drawerMode && activeCaseId) {
      setDesktopExpandedIds((prev) => new Set([...prev, activeCaseId]));
    }
  }, [activeCaseId, drawerMode]);

  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set());

  const [isCreating, setIsCreating] = useState(false);
  const [newCaseName, setNewCaseName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const createInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating) createInputRef.current?.focus();
  }, [isCreating]);

  useEffect(() => {
    if (renamingId) renameInputRef.current?.focus();
  }, [renamingId]);

  function handleCreateCase() {
    const name = newCaseName.trim();
    if (!name) {
      setIsCreating(false);
      return;
    }
    const newCase = createCase(name);
    setNewCaseName("");
    setIsCreating(false);
    toast.success(`Кейс «${name}» создан`);
    router.push(`/cases/${newCase.id}`);
    onNavigate?.();
  }

  function handleCancelCreate() {
    setNewCaseName("");
    setIsCreating(false);
  }

  function handleDeleteArchived(c: Case) {
    let undone = false;

    // Optimistically hide from list while toast is showing
    setPendingDeleteIds((prev) => new Set([...prev, c.id]));

    toast(`Кейс «${c.name}» удалён`, {
      duration: 10000,
      action: { label: "Отменить", onClick: () => {
        undone = true;
        setPendingDeleteIds((prev) => { const n = new Set(prev); n.delete(c.id); return n; });
      }},
      onAutoClose: () => {
        if (undone) return;
        deleteCase(c.id);
        setPendingDeleteIds((prev) => { const n = new Set(prev); n.delete(c.id); return n; });
        toast(`Кейс «${c.name}» удалён навсегда`);
      },
      onDismiss: () => {
        if (undone) return;
        deleteCase(c.id);
        setPendingDeleteIds((prev) => { const n = new Set(prev); n.delete(c.id); return n; });
        toast(`Кейс «${c.name}» удалён навсегда`);
      },
    });
  }

  function handleRenameCase() {
    if (!renamingId) return;
    const name = renameValue.trim();
    if (name) renameCase(renamingId, name);
    setRenamingId(null);
    setRenameValue("");
  }

  function startRename(c: Case) {
    setRenamingId(c.id);
    setRenameValue(c.name);
  }

  return (
    <aside className={`flex h-full flex-col border-r border-border bg-background ${drawerMode ? "w-full" : "w-[312px]"}`}>
      {/* Logo */}
      <LogoHeader onClose={onNavigate} />

      {/* Scrollable content — left padding 16px matches Figma container pl */}
      <div className="flex-1 overflow-y-auto pl-4">

        {/* КЕЙСЫ header — padding: 12px 16px 12px 0, gap: 8px */}
        <div className="flex items-center gap-2 pr-4 py-3">
          <span className="flex-1 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
            Кейсы
          </span>
          {/* + button: 24×24px, bg: rm-gray-1, rounded: 4px */}
          <button
            onClick={() => setIsCreating(true)}
            className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm bg-rm-gray-1 text-muted-foreground hover:bg-rm-gray-2 hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Inline create new case — animated */}
        <Collapsible open={isCreating}>
          <div className="pr-4 pb-3 flex flex-col gap-2">
            <Input
              ref={createInputRef}
              size="sm"
              placeholder="Название кейса"
              value={newCaseName}
              onChange={(e) => setNewCaseName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCase();
                if (e.key === "Escape") handleCancelCreate();
              }}
            />
            {/* Explicit confirm/cancel — mobile-friendly, no onBlur trap */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreateCase}
                className="flex-1 rounded-sm bg-foreground py-1.5 text-[length:var(--text-12)] font-medium text-background transition-opacity hover:opacity-80 active:opacity-70"
              >
                Создать
              </button>
              <button
                type="button"
                onClick={handleCancelCreate}
                className="flex-1 rounded-sm border border-border py-1.5 text-[length:var(--text-12)] text-muted-foreground transition-colors hover:bg-rm-gray-1 hover:text-foreground"
              >
                Отмена
              </button>
            </div>
          </div>
        </Collapsible>

        {/* Divider after header */}
        <div className="h-px bg-border mr-4" />

        {/* Empty state */}
        {activeCases.length === 0 && !isCreating && (
          <p className="py-4 pr-4 text-center text-[length:var(--text-12)] text-muted-foreground">
            Нет кейсов.{" "}
            <button
              onClick={() => setIsCreating(true)}
              className="text-foreground underline underline-offset-2"
            >
              Создать первый
            </button>
          </p>
        )}

        {/* Case groups with dividers between them */}
        {activeCases.map((c, idx) => {
          const isExpanded = drawerMode
            ? drawerExpandedIds.has(c.id)
            : desktopExpandedIds.has(c.id);

          return (
          <div key={c.id}>
            <CaseItemWithAgents
              caseItem={c}
              isActive={c.id === activeCaseId}
              isExpanded={isExpanded}
              activeAgentId={activeAgentId}
              isRenaming={c.id === renamingId}
              renameValue={renameValue}
              renameInputRef={renameInputRef}
              onSelect={() => {
                if (drawerMode) {
                  setDrawerExpandedIds((prev) => {
                    const next = new Set(prev);
                    next.has(c.id) ? next.delete(c.id) : next.add(c.id);
                    return next;
                  });
                } else {
                  setDesktopExpandedIds((prev) => {
                    const next = new Set(prev);
                    next.has(c.id) ? next.delete(c.id) : next.add(c.id);
                    return next;
                  });
                }
              }}
              onAgentSelect={(agentId) => {
                router.push(`/cases/${c.id}?agent=${agentId}`);
                onNavigate?.();
              }}
              onRenameChange={setRenameValue}
              onRenameSubmit={handleRenameCase}
              onRenameCancel={() => setRenamingId(null)}
              onStartRename={() => startRename(c)}
              onArchive={() => archiveCase(c.id)}
              onDelete={() => deleteCase(c.id)}
              onNavigate={onNavigate}
            />
            {/* Divider between case groups */}
            {idx < activeCases.length - 1 && (
              <div className="h-px bg-border mr-4" />
            )}
          </div>
          );
        })}
      </div>

      {/* Archive — pinned above footer */}
      {archivedCases.length > 0 && (
        <div className="border-t border-border pl-4">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="flex w-full items-center gap-2 pr-4 py-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`h-2 w-2 transition-transform ${showArchived ? "" : "-rotate-90"}`}
            />
            Архив ({archivedCases.length})
          </button>
          <Collapsible open={showArchived}>
            <div className="pb-2">
              {archivedCases
                .filter((c) => !pendingDeleteIds.has(c.id))
                .map((c) => (
                <div
                  key={c.id}
                  className="group flex items-center gap-1 rounded-sm pr-2 py-1.5 text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground cursor-pointer transition-colors"
                  onClick={() => router.push(`/cases/${c.id}`)}
                >
                  <Archive className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  <span className="flex-1 truncate text-[length:var(--text-14)] opacity-60">
                    {c.name}
                  </span>
                  {/* Restore — always visible */}
                  <button
                    className="shrink-0 rounded-sm p-1 text-muted-foreground hover:bg-rm-gray-2 hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreCase(c.id);
                      toast.success(`Кейс «${c.name}» восстановлен`);
                    }}
                    title="Восстановить"
                  >
                    <ArchiveRestore className="h-3.5 w-3.5" />
                  </button>
                  {/* Delete — always visible */}
                  <button
                    className="shrink-0 rounded-sm p-1 text-[var(--rm-red-500)] hover:bg-rm-gray-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteArchived(c);
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

      {/* Footer — user menu */}
      <div className="border-t border-border px-3 py-2">
        <UserMenu user={user} onLogout={logout} />
      </div>
    </aside>
  );
}

// --- Case group with nested agents ---

function CaseItemWithAgents({
  caseItem,
  isActive,
  isExpanded,
  activeAgentId,
  isRenaming,
  renameValue,
  renameInputRef,
  onSelect,
  onAgentSelect,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  onStartRename,
  onArchive,
  onDelete,
  onNavigate,
}: {
  caseItem: Case;
  isActive: boolean;
  isExpanded: boolean;
  activeAgentId: string | null;
  isRenaming: boolean;
  renameValue: string;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: () => void;
  onAgentSelect: (agentId: string) => void;
  onRenameChange: (v: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onStartRename: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onNavigate?: () => void;
}) {
  // Case group: padding 16px top/bottom/right, 0 left (inherited from pl-4 parent), gap 4px
  return (
    <div className="flex flex-col gap-1 py-4 pr-4">
      {/* Case header row: padding 8px all, gap 8px, bg rm-gray-1 when active, rounded 4px */}
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
          className={`group flex items-center gap-2 rounded-sm p-2 cursor-pointer transition-colors ${
            isActive
              ? "bg-rm-gray-1 text-foreground"
              : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
          }`}
          onClick={onSelect}
        >
          {/* Chevron: 8×8px (h-2 w-2) */}
          <ChevronRight
            className={`h-2 w-2 shrink-0 transition-transform text-muted-foreground ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
          <span className="flex-1 truncate text-[length:var(--text-14)]">
            {caseItem.name}
          </span>
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
              <DropdownMenuItem
                onClick={onDelete}
                className="text-[var(--rm-red-500)]"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Agents — animated expand/collapse */}
      <Collapsible open={isExpanded}>
        <CaseAgentsNested
          caseId={caseItem.id}
          activeAgentId={activeAgentId}
          onAgentSelect={onAgentSelect}
          onNavigate={onNavigate}
        />
      </Collapsible>
    </div>
  );
}

// --- Agents nested under active case ---

function CaseAgentsNested({
  caseId,
  activeAgentId,
  onAgentSelect,
  onNavigate,
}: {
  caseId: string;
  activeAgentId: string | null;
  onAgentSelect: (agentId: string) => void;
  onNavigate?: () => void;
}) {
  const { agents } = useCaseAgents(caseId);
  const router = useRouter();

  return (
    <>
      {agents.map((agent) => {
        const isSelected = agent.id === activeAgentId;
        return (
          // Agent row: padding 4px top/bottom, 8px right, 0 left, gap 8px
          // bg rm-gray-1 always; rm-gray-2 when selected
          <div
            key={agent.id}
            onClick={() => onAgentSelect(agent.id)}
            className={`flex items-center gap-2 rounded-sm py-1 pr-2 cursor-pointer transition-colors ${
              isSelected
                ? "bg-rm-gray-2 text-foreground"
                : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
            }`}
          >
            {/* Avatar: 40×40px (size="md"), no border */}
            <Avatar size="md" className="border-0 shrink-0">
              {agent.avatar_url && <AvatarImage src={agent.avatar_url} />}
              <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
            </Avatar>
            <span className="truncate text-[length:var(--text-14)]">
              {agent.name}
            </span>
          </div>
        );
      })}

      {/* Add agent row */}
      <button
        onClick={() => {
          router.push(`/agents?caseId=${caseId}`);
          onNavigate?.();
        }}
        className="mt-1 relative flex w-full items-center gap-2 rounded-sm py-1 pr-2 text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors group/add"
      >
        {/* Dashed border: 4px dash, 12px gap (3× rarer than default) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-100 group-hover/add:opacity-0 transition-opacity"
        >
          <rect
            x="0.5"
            y="0.5"
            rx="3"
            ry="3"
            fill="none"
            stroke="var(--rm-gray-3)"
            strokeDasharray="4 4"
            style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
          />
        </svg>
        <span className="h-10 w-10 shrink-0 flex items-center justify-center">
          <Plus className="h-3.5 w-3.5" />
        </span>
        <span className="text-[length:var(--text-14)]">Агент</span>
      </button>
    </>
  );
}

// --- Animated collapse/expand ---

function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-200 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

// --- Logo header ---

function LogoHeader({ onClose }: { onClose?: () => void }) {
  const { resolvedTheme } = useTheme();
  const src =
    resolvedTheme === "dark"
      ? "/text_logo_dark_background_en.svg"
      : "/text_logo_light_background_en.svg";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <Image src={src} alt="Rocketmind" width={140} height={24} priority />
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

// --- User menu (avatar dropdown) ---

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
        {/* Font size */}
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
