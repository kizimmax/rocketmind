"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "rm-dialog-overlay fixed inset-0 z-50 bg-border/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = "DialogOverlay"

type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /**
   * На мобильном (<lg) модалка открывается как bottom sheet с drag-handle и
   * свайп-закрытием. На desktop — центральный модал. Отключить можно прокинув
   * `mobileSheet={false}` (например, для медиа-просмотра, где нужна вся высота).
   */
  mobileSheet?: boolean
  /** Доп.классы для внутреннего scroll-wrapper. По умолчанию `p-6`. */
  bodyClassName?: string
}

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, mobileSheet = true, bodyClassName, ...props }, ref) => {
  const innerRef = React.useRef<HTMLDivElement | null>(null)
  const overlayRef = React.useRef<HTMLDivElement | null>(null)
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null)

  // Связываем внешний ref с внутренним
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    },
    [ref],
  )

  // ── Mobile keyboard handling через visualViewport ───────────────────────
  // Когда клавиатура открыта, viewport.height уменьшается. Поднимаем sheet
  // к верху экрана с отступом 16px и включаем внутренний скролл.
  React.useEffect(() => {
    if (!mobileSheet) return
    if (typeof window === "undefined") return
    const vv = window.visualViewport
    if (!vv) return

    const TOP_GAP = 16
    const apply = () => {
      const el = innerRef.current
      if (!el) return
      const isMobile = window.matchMedia("(max-width: 1023px)").matches
      if (!isMobile) {
        el.style.removeProperty("--rm-sheet-h")
        el.style.removeProperty("--rm-sheet-translate")
        return
      }
      // Высота клавиатуры = window.innerHeight - vv.height - vv.offsetTop
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      if (kb > 80) {
        // клавиатура открыта — поднимаем sheet над ней через `bottom`
        // (transform не используем, чтобы не конфликтовать с drag-to-close).
        el.style.setProperty("--rm-sheet-h", `${vv.height - TOP_GAP}px`)
        el.style.bottom = `${kb}px`
      } else {
        el.style.removeProperty("--rm-sheet-h")
        el.style.removeProperty("bottom")
      }
    }
    apply()
    vv.addEventListener("resize", apply)
    vv.addEventListener("scroll", apply)
    return () => {
      vv.removeEventListener("resize", apply)
      vv.removeEventListener("scroll", apply)
    }
  }, [mobileSheet])

  // ── Mobile drag-to-close ────────────────────────────────────────────────
  const drag = React.useRef({ startY: 0, dy: 0, active: false, pointerId: 0 })

  function onHandleDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!mobileSheet) return
    drag.current = { startY: e.clientY, dy: 0, active: true, pointerId: e.pointerId }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (innerRef.current) innerRef.current.style.transition = "none"
    if (overlayRef.current) overlayRef.current.style.transition = "none"
  }

  function onHandleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return
    const dy = Math.max(0, e.clientY - drag.current.startY)
    drag.current.dy = dy
    const el = innerRef.current
    if (el) {
      el.style.transform = `translateY(${dy}px)`
      const progress = Math.min(1, dy / Math.max(1, el.offsetHeight))
      if (overlayRef.current) overlayRef.current.style.opacity = String(1 - progress)
    }
  }

  function onHandleEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return
    drag.current.active = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(drag.current.pointerId)
    } catch {}
    const { dy } = drag.current
    const el = innerRef.current
    if (!el) return
    if (dy > 120) {
      el.classList.add("rm-sheet-manual-close")
      el.style.transition = "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)"
      el.style.transform = "translateY(100%)"
      if (overlayRef.current) {
        overlayRef.current.classList.add("rm-sheet-manual-close")
        overlayRef.current.style.transition = "opacity 220ms cubic-bezier(0.32, 0.72, 0, 1)"
        overlayRef.current.style.opacity = "0"
      }
      const close = () => {
        el.removeEventListener("transitionend", close)
        // Через скрытый DialogClose, чтобы Radix корректно снял scroll-lock
        closeBtnRef.current?.click()
      }
      el.addEventListener("transitionend", close)
    } else {
      el.style.transition = "transform 200ms ease-out"
      el.style.transform = ""
      if (overlayRef.current) {
        overlayRef.current.style.transition = "opacity 200ms ease-out"
        overlayRef.current.style.opacity = ""
      }
    }
  }

  // Reset inline стили при каждом открытии
  const dataState = (props as Record<string, unknown>)["data-state"]
  React.useEffect(() => {
    const el = innerRef.current
    if (!el) return
    el.classList.remove("rm-sheet-manual-close")
    el.style.transition = ""
    el.style.transform = ""
    el.style.removeProperty("bottom")
    el.style.removeProperty("--rm-sheet-h")
    if (overlayRef.current) {
      overlayRef.current.classList.remove("rm-sheet-manual-close")
      overlayRef.current.style.transition = ""
      overlayRef.current.style.opacity = ""
    }
  }, [dataState])

  return (
    <DialogPortal>
      <DialogOverlay ref={overlayRef} />
      <DialogPrimitive.Content
        ref={setRefs}
        data-slot="dialog-content"
        data-mobile-sheet={mobileSheet ? "true" : "false"}
        className={cn(
          "rm-dialog fixed z-50 border border-border bg-card",
          mobileSheet
            ? [
                // Mobile sheet base — без padding на самой панели; padding в body-wrapper
                "rm-sheet max-lg:inset-x-0 max-lg:bottom-0 max-lg:flex max-lg:flex-col",
                "max-lg:rounded-t-lg max-lg:border-t",
                "max-lg:max-h-[var(--rm-sheet-h,85dvh)] max-lg:overflow-hidden",
                "max-lg:data-[state=open]:animate-in max-lg:data-[state=open]:slide-in-from-bottom-full max-lg:data-[state=open]:duration-[260ms] max-lg:data-[state=open]:[animation-timing-function:cubic-bezier(0.32,0.72,0,1)]",
                "max-lg:data-[state=closed]:animate-out max-lg:data-[state=closed]:slide-out-to-bottom-full max-lg:data-[state=closed]:duration-200",
                // Desktop center modal
                "lg:left-1/2 lg:top-1/2 lg:bottom-auto lg:right-auto lg:w-full lg:max-w-[480px] lg:-translate-x-1/2 lg:-translate-y-1/2",
                "lg:rounded-lg lg:flex lg:flex-col lg:max-h-[85dvh] lg:overflow-hidden",
                "lg:data-[state=open]:animate-in lg:data-[state=open]:fade-in-0 lg:data-[state=open]:slide-in-from-bottom-8 lg:data-[state=open]:duration-500 lg:data-[state=open]:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "lg:data-[state=closed]:animate-out lg:data-[state=closed]:fade-out-0 lg:data-[state=closed]:slide-out-to-bottom-4 lg:data-[state=closed]:duration-200 lg:data-[state=closed]:[animation-timing-function:cubic-bezier(0.55,0.085,0.68,0.53)]",
              ]
            : [
                // Always center modal
                "left-1/2 top-1/2 w-[calc(100vw-32px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg p-6",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 data-[state=open]:duration-500 data-[state=open]:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=closed]:duration-200 data-[state=closed]:[animation-timing-function:cubic-bezier(0.55,0.085,0.68,0.53)]",
              ],
          className
        )}
        {...props}
      >
        <DialogPrimitive.Close
          ref={closeBtnRef}
          aria-hidden
          tabIndex={-1}
          className="sr-only"
        />
        {mobileSheet && (
          <div
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleEnd}
            onPointerCancel={onHandleEnd}
            className="hidden max-lg:flex h-7 shrink-0 cursor-grab items-center justify-center touch-none"
            aria-hidden
          >
            <span className="h-1 w-10 rounded-full bg-foreground/50" />
          </div>
        )}
        {mobileSheet ? (
          <div
            className={cn(
              "flex-1 overflow-y-auto overscroll-contain",
              "p-6 max-lg:pt-0",
              bodyClassName
            )}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex justify-end gap-3 pt-4", className)}
      {...props}
    />
  )
}

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn(
      "font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-[-0.005em]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-[length:var(--text-14)] text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
// Re-export X icon — не используется здесь, оставлен для обратной совместимости
export { X as DialogCloseIcon }
