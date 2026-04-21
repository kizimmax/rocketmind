"use client";
import {
  DottedSurface,
  cn
} from "./chunk-EE3AAV6C.js";

// src/components/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { jsx } from "react/jsx-runtime";
function ThemeProvider({
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(NextThemesProvider, { ...props, children });
}

// src/components/ui/avatar.tsx
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import { jsx as jsx2 } from "react/jsx-runtime";
var avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full border border-border",
  {
    variants: {
      size: {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var Avatar = React.forwardRef(({ className, size = "md", ...props }, ref) => /* @__PURE__ */ jsx2(
  AvatarPrimitive.Root,
  {
    ref,
    "data-slot": "avatar",
    "data-size": size,
    className: cn(avatarVariants({ size, className })),
    ...props
  }
));
Avatar.displayName = "Avatar";
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  AvatarPrimitive.Image,
  {
    ref,
    "data-slot": "avatar-image",
    className: cn("aspect-square h-full w-full object-cover", className),
    ...props
  }
));
AvatarImage.displayName = "AvatarImage";
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  AvatarPrimitive.Fallback,
  {
    ref,
    "data-slot": "avatar-fallback",
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-[var(--rm-gray-1)] text-muted-foreground",
      "font-[family-name:var(--font-mono-family)] uppercase",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = "AvatarFallback";

// src/components/ui/badge.tsx
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx3 } from "react/jsx-runtime";
var badgeVariants = cva2(
  // Base: flat, Loos Condensed, uppercase — consistent with buttons and labels
  "inline-flex items-center gap-1 rounded-sm border border-transparent px-2 whitespace-nowrap font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] transition-all",
  {
    variants: {
      variant: {
        // ── Neutral ──────────────────────────────────────────────────────
        neutral: "bg-[var(--rm-gray-1)] text-[var(--rm-gray-fg-sub)] border-[var(--border)]",
        // ── Yellow ───────────────────────────────────────────────────────
        "yellow-solid": "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] border-[var(--rm-yellow-700)]",
        "yellow-subtle": "bg-[var(--rm-yellow-900)] text-[var(--rm-yellow-fg-subtle)] border-[var(--rm-yellow-700)]",
        // ── Violet ───────────────────────────────────────────────────────
        "violet-solid": "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)] border-[var(--rm-violet-700)]",
        "violet-subtle": "bg-[var(--rm-violet-900)] text-[var(--rm-violet-fg-subtle)] border-[var(--rm-violet-700)]",
        // ── Sky ──────────────────────────────────────────────────────────
        "sky-solid": "bg-[var(--rm-sky-100)] text-[var(--rm-sky-fg)] border-[var(--rm-sky-700)]",
        "sky-subtle": "bg-[var(--rm-sky-900)] text-[var(--rm-sky-fg-subtle)] border-[var(--rm-sky-700)]",
        // ── Terracotta ───────────────────────────────────────────────────
        "terracotta-solid": "bg-[var(--rm-terracotta-100)] text-[var(--rm-terracotta-fg)] border-[var(--rm-terracotta-700)]",
        "terracotta-subtle": "bg-[var(--rm-terracotta-900)] text-[var(--rm-terracotta-fg-subtle)] border-[var(--rm-terracotta-700)]",
        // ── Pink ─────────────────────────────────────────────────────────
        "pink-solid": "bg-[var(--rm-pink-100)] text-[var(--rm-pink-fg)] border-[var(--rm-pink-700)]",
        "pink-subtle": "bg-[var(--rm-pink-900)] text-[var(--rm-pink-fg-subtle)] border-[var(--rm-pink-700)]",
        // ── Blue ─────────────────────────────────────────────────────────
        "blue-solid": "bg-[var(--rm-blue-100)] text-[var(--rm-blue-fg)] border-[var(--rm-blue-700)]",
        "blue-subtle": "bg-[var(--rm-blue-900)] text-[var(--rm-blue-fg-subtle)] border-[var(--rm-blue-700)]",
        // ── Red ──────────────────────────────────────────────────────────
        "red-solid": "bg-[var(--rm-red-100)] text-[var(--rm-red-fg)] border-[var(--rm-red-700)]",
        "red-subtle": "bg-[var(--rm-red-900)] text-[var(--rm-red-fg-subtle)] border-[var(--rm-red-700)]",
        // ── Green ────────────────────────────────────────────────────────
        "green-solid": "bg-[var(--rm-green-100)] text-[var(--rm-green-fg)] border-[var(--rm-green-700)]",
        "green-subtle": "bg-[var(--rm-green-900)] text-[var(--rm-green-fg-subtle)] border-[var(--rm-green-700)]",
        // ── Legacy shadcn aliases (backward compat) ──────────────────────
        default: "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] border-[var(--rm-yellow-700)]",
        secondary: "bg-[var(--rm-gray-1)] text-[var(--rm-gray-fg-sub)] border-[var(--border)]",
        destructive: "bg-[var(--rm-red-100)] text-[var(--rm-red-fg)] border-[var(--rm-red-700)]",
        outline: "border-border text-foreground"
      },
      size: {
        sm: "h-5 text-[length:var(--text-12)]",
        md: "h-6 text-[length:var(--text-12)]",
        lg: "h-7 text-[length:var(--text-14)]"
      }
    },
    defaultVariants: {
      variant: "neutral",
      size: "md"
    }
  }
);
function Badge({
  className,
  variant,
  size,
  ...props
}) {
  return /* @__PURE__ */ jsx3(
    "span",
    {
      className: cn(badgeVariants({ variant, size }), className),
      ...props
    }
  );
}

// src/components/ui/button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx4 } from "react/jsx-runtime";
var buttonVariants = cva3(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-clip-padding text-[length:var(--text-14)] font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:opacity-[0.88] active:opacity-[0.76] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "border-border bg-[var(--rm-gray-1)] text-foreground hover:bg-[var(--rm-gray-2)] active:bg-[var(--rm-gray-3)] aria-expanded:bg-[var(--rm-gray-2)] aria-expanded:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-sm px-2 text-[length:var(--text-12)] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-sm px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-micro": "size-5 rounded-sm text-[11px] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-sm in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx4(
    ButtonPrimitive,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/ui/card.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      "data-slot": "card",
      "data-size": size,
      className: cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-sm bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-sm *:[img:last-child]:rounded-b-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-sm px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      "data-slot": "card-title",
      className: cn(
        "text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      ),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function CardAction({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      "data-slot": "card-action",
      className: cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      "data-slot": "card-footer",
      className: cn(
        "flex items-center rounded-b-sm border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/checkbox.tsx
import * as React2 from "react";
import { Check, Minus } from "lucide-react";
import { jsx as jsx6, jsxs } from "react/jsx-runtime";
var checkboxBaseClassName = "peer size-5 shrink-0 appearance-none rounded-sm border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--checkbox-accent,var(--rm-yellow-100))] checked:bg-[var(--checkbox-accent,var(--rm-yellow-100))] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
var Checkbox = React2.forwardRef(
  ({ className, indeterminate = false, ...props }, forwardedRef) => {
    const internalRef = React2.useRef(null);
    React2.useImperativeHandle(forwardedRef, () => internalRef.current);
    React2.useEffect(() => {
      if (!internalRef.current) return;
      internalRef.current.indeterminate = indeterminate;
    }, [indeterminate]);
    return /* @__PURE__ */ jsxs("span", { className: "relative inline-flex size-5 shrink-0 items-center justify-center", children: [
      /* @__PURE__ */ jsx6(
        "input",
        {
          ...props,
          ref: internalRef,
          type: "checkbox",
          "data-slot": "checkbox",
          "aria-checked": indeterminate ? "mixed" : props["aria-checked"],
          className: cn(
            checkboxBaseClassName,
            indeterminate && "border-[var(--checkbox-accent,var(--rm-yellow-100))] bg-[var(--checkbox-accent,var(--rm-yellow-100))]",
            className
          )
        }
      ),
      indeterminate ? /* @__PURE__ */ jsx6(Minus, { className: "pointer-events-none absolute size-3.5 text-[var(--checkbox-accent-fg,var(--rm-yellow-fg))]", strokeWidth: 2.4 }) : /* @__PURE__ */ jsx6(
        Check,
        {
          className: "pointer-events-none absolute size-3.5 text-[var(--checkbox-accent-fg,var(--rm-yellow-fg))] opacity-0 transition-opacity duration-150 peer-checked:opacity-100",
          strokeWidth: 2.4
        }
      )
    ] });
  }
);
Checkbox.displayName = "Checkbox";

// src/components/ui/dot-grid-lens.tsx
import { useEffect as useEffect2, useRef as useRef2 } from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
var DOT_GRID_LENS_DEFAULTS = {
  gridGap: 20,
  baseRadius: 1.5,
  maxScale: 3.3,
  lensRadius: 120,
  accentColor: false
};
function DotGridLens({
  gridGap = DOT_GRID_LENS_DEFAULTS.gridGap,
  baseRadius = DOT_GRID_LENS_DEFAULTS.baseRadius,
  maxScale = DOT_GRID_LENS_DEFAULTS.maxScale,
  lensRadius = DOT_GRID_LENS_DEFAULTS.lensRadius,
  accentColor = DOT_GRID_LENS_DEFAULTS.accentColor,
  className,
  style
}) {
  const containerRef = useRef2(null);
  const canvasRef = useRef2(null);
  useEffect2(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isTouchOnly = !window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.classList.contains("dark");
      const baseRgb = isDark ? [64, 64, 64] : [203, 203, 203];
      const accentRgb = [255, 204, 0];
      const cols = Math.ceil(w / gridGap) + 1;
      const rows = Math.ceil(h / gridGap) + 1;
      const { x: mx, y: my } = mouse;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = i * gridGap;
          const py = j * gridGap;
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / lensRadius);
          const scale = 1 + (maxScale - 1) * t * t;
          const r = baseRadius * scale;
          let fillStyle;
          if (accentColor && t > 0) {
            const ri = Math.round(baseRgb[0] + (accentRgb[0] - baseRgb[0]) * t * t);
            const gi = Math.round(baseRgb[1] + (accentRgb[1] - baseRgb[1]) * t * t);
            const bi = Math.round(baseRgb[2] + (accentRgb[2] - baseRgb[2]) * t * t);
            fillStyle = `rgb(${ri},${gi},${bi})`;
          } else {
            fillStyle = isDark ? "#404040" : "#CBCBCB";
          }
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = fillStyle;
          ctx.fill();
        }
      }
    }
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    if (isTouchOnly || reducedMotion) {
      draw();
      return () => ro.disconnect();
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [gridGap, baseRadius, maxScale, lensRadius, accentColor]);
  return /* @__PURE__ */ jsx7(
    "div",
    {
      ref: containerRef,
      className,
      style: { overflow: "hidden", ...style },
      children: /* @__PURE__ */ jsx7("canvas", { ref: canvasRef, style: { display: "block" } })
    }
  );
}

// src/components/ui/dialog.tsx
import * as React3 from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { jsx as jsx8, jsxs as jsxs2 } from "react/jsx-runtime";
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogClose = DialogPrimitive.Close;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx8(
  DialogPrimitive.Overlay,
  {
    ref,
    "data-slot": "dialog-overlay",
    className: cn(
      "fixed inset-0 z-50 bg-[var(--rm-gray-alpha-600)]",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = "DialogOverlay";
var DialogContent = React3.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs2(DialogPortal, { children: [
  /* @__PURE__ */ jsx8(DialogOverlay, {}),
  /* @__PURE__ */ jsx8(
    DialogPrimitive.Content,
    {
      ref,
      "data-slot": "dialog-content",
      className: cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2",
        "rounded-lg border border-border bg-card p-6",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        className
      ),
      ...props,
      children
    }
  )
] }));
DialogContent.displayName = "DialogContent";
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-1.5", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn("flex justify-end gap-3 pt-4", className),
      ...props
    }
  );
}
var DialogTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx8(
  DialogPrimitive.Title,
  {
    ref,
    "data-slot": "dialog-title",
    className: cn(
      "font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-[-0.005em]",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = "DialogTitle";
var DialogDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx8(
  DialogPrimitive.Description,
  {
    ref,
    "data-slot": "dialog-description",
    className: cn("text-[length:var(--text-14)] text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = "DialogDescription";

// src/components/ui/dropdown-menu.tsx
import * as React4 from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { jsx as jsx9 } from "react/jsx-runtime";
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuContent = React4.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx9(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx9(
  DropdownMenuPrimitive.Content,
  {
    ref,
    "data-slot": "dropdown-menu-content",
    sideOffset,
    className: cn(
      "z-50 min-w-[160px] overflow-hidden rounded-sm border border-border bg-popover p-1 text-popover-foreground",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = "DropdownMenuContent";
var DropdownMenuItem = React4.forwardRef(({ className, destructive, ...props }, ref) => /* @__PURE__ */ jsx9(
  DropdownMenuPrimitive.Item,
  {
    ref,
    "data-slot": "dropdown-menu-item",
    className: cn(
      "relative flex items-center gap-2 h-8 px-2 py-1.5 rounded-sm",
      "text-[length:var(--text-14)] cursor-pointer select-none outline-none",
      "transition-colors duration-150",
      "focus:bg-[var(--rm-gray-2)] focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      destructive && "text-[var(--rm-red-100)] focus:bg-[var(--rm-red-900)] focus:text-[var(--rm-red-100)]",
      "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
      destructive && "[&_svg]:text-[var(--rm-red-100)]",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = "DropdownMenuItem";
var DropdownMenuSeparator = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    "data-slot": "dropdown-menu-separator",
    className: cn("-mx-1 my-1 h-px bg-border", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
var DropdownMenuLabel = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  DropdownMenuPrimitive.Label,
  {
    ref,
    "data-slot": "dropdown-menu-label",
    className: cn(
      "px-2 py-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// src/components/ui/glowing-effect.tsx
import { memo, useCallback, useEffect as useEffect3, useRef as useRef3 } from "react";
import { animate } from "motion/react";
import { Fragment, jsx as jsx10, jsxs as jsxs3 } from "react/jsx-runtime";
var GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true
  }) => {
    const containerRef = useRef3(null);
    const lastPosition = useRef3({ x: 0, y: 0 });
    const animationFrameRef = useRef3(0);
    const handleMove = useCallback(
      (e) => {
        if (!containerRef.current) return;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;
          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;
          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }
          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;
          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }
          const isActive = mouseX > left - proximity && mouseX < left + width + proximity && mouseY > top - proximity && mouseY < top + height + proximity;
          element.style.setProperty("--active", isActive ? "1" : "0");
          if (!isActive) return;
          const currentAngle = parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle = 180 * Math.atan2(mouseY - center[1], mouseX - center[0]) / Math.PI + 90;
          const angleDiff = (targetAngle - currentAngle + 180) % 360 - 180;
          const newAngle = currentAngle + angleDiff;
          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            }
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );
    useEffect3(() => {
      if (disabled) return;
      const handleScroll = () => handleMove();
      const handlePointerMove = (e) => handleMove(e);
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true
      });
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);
    const getGradient = () => {
      if (variant === "white") {
        return `repeating-conic-gradient(
          from 236.84deg at 50% 50%,
          var(--black),
          var(--black) calc(25% / var(--repeating-conic-gradient-times))
        )`;
      }
      if (variant === "yellow") {
        return `radial-gradient(circle, #FFCC00 10%, #FFCC0000 20%),
          radial-gradient(circle at 40% 40%, #FFB800 5%, #FFB80000 15%),
          radial-gradient(circle at 60% 60%, #FFE040 10%, #FFE04000 20%),
          radial-gradient(circle at 40% 60%, #FFA500 10%, #FFA50000 20%),
          repeating-conic-gradient(
            from 236.84deg at 50% 50%,
            #FFCC00 0%,
            #FFB800 calc(25% / var(--repeating-conic-gradient-times)),
            #FFE040 calc(50% / var(--repeating-conic-gradient-times)),
            #FFA500 calc(75% / var(--repeating-conic-gradient-times)),
            #FFCC00 calc(100% / var(--repeating-conic-gradient-times))
          )`;
      }
      return `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
        radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
        radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
        radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
        repeating-conic-gradient(
          from 236.84deg at 50% 50%,
          #dd7bbb 0%,
          #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
          #5a922c calc(50% / var(--repeating-conic-gradient-times)),
          #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
          #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
        )`;
    };
    return /* @__PURE__ */ jsxs3(Fragment, { children: [
      /* @__PURE__ */ jsx10(
        "div",
        {
          className: cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            variant === "yellow" && "border-[#FFCC00]",
            disabled && "!block"
          )
        }
      ),
      /* @__PURE__ */ jsx10(
        "div",
        {
          ref: containerRef,
          style: {
            "--blur": `${blur}px`,
            "--spread": spread,
            "--start": "0",
            "--active": "0",
            "--glowingeffect-border-width": `${borderWidth}px`,
            "--repeating-conic-gradient-times": "5",
            "--gradient": getGradient()
          },
          className: cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            className,
            disabled && "!hidden"
          ),
          children: /* @__PURE__ */ jsx10(
            "div",
            {
              className: cn(
                "glow",
                "rounded-[inherit]",
                'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
                "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
                "after:[background:var(--gradient)] after:[background-attachment:fixed]",
                "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
                "after:[mask-clip:padding-box,border-box]",
                "after:[mask-composite:intersect]",
                "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
              )
            }
          )
        }
      )
    ] });
  }
);
GlowingEffect.displayName = "GlowingEffect";

// src/components/ui/input.tsx
import * as React5 from "react";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx11 } from "react/jsx-runtime";
var inputVariants = cva4(
  "flex w-full rounded-sm border border-border bg-rm-gray-1 text-foreground placeholder:text-muted-foreground transition-all duration-150 outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive",
  {
    variants: {
      size: {
        xs: "h-7 px-3 text-[length:var(--text-12)]",
        sm: "h-8 px-3 text-[length:var(--text-12)]",
        md: "h-10 px-4 text-[length:var(--text-14)]",
        lg: "h-12 px-6 text-[length:var(--text-16)]"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var Input = React5.forwardRef(
  ({ className, size, type = "text", ...props }, ref) => {
    return /* @__PURE__ */ jsx11(
      "input",
      {
        ref,
        type,
        "data-slot": "input",
        className: cn(inputVariants({ size, className })),
        ...props
      }
    );
  }
);
Input.displayName = "Input";

// src/components/ui/input-otp.tsx
import * as React6 from "react";
import { jsx as jsx12 } from "react/jsx-runtime";
var InputOTP = React6.forwardRef(
  ({ length = 6, value = "", onChange, disabled, className, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const inputRefs = React6.useRef([]);
    const chars = value.split("");
    function handleChange(index, char) {
      if (char.length > 1) {
        const pasted = char.replace(/\D/g, "").slice(0, length);
        onChange?.(pasted);
        const focusIndex = Math.min(pasted.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
        return;
      }
      if (!/^\d?$/.test(char)) return;
      const next = [...chars];
      next[index] = char;
      for (let i = 0; i < length; i++) {
        if (next[i] === void 0) next[i] = "";
      }
      const newValue = next.join("").slice(0, length);
      onChange?.(newValue);
      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    function handleKeyDown(index, e) {
      if (e.key === "Backspace" && !chars[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    return /* @__PURE__ */ jsx12(
      "div",
      {
        ref,
        "data-slot": "input-otp",
        className: cn("flex gap-2", className),
        ...props,
        children: Array.from({ length }, (_, i) => /* @__PURE__ */ jsx12(
          "input",
          {
            ref: (el) => {
              inputRefs.current[i] = el;
            },
            type: "text",
            inputMode: "numeric",
            maxLength: length,
            value: chars[i] ?? "",
            disabled,
            "aria-invalid": ariaInvalid,
            autoComplete: i === 0 ? "one-time-code" : "off",
            className: cn(
              "size-11 text-center sm:size-14",
              "rounded-sm border border-border",
              "bg-rm-gray-1 text-foreground",
              "font-[family-name:var(--font-mono-family)] text-[length:var(--text-20)] sm:text-[length:var(--text-25)] tracking-[0.08em]",
              "transition-all duration-150",
              "outline-none focus-visible:border-ring",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "aria-invalid:border-destructive"
            ),
            onChange: (e) => handleChange(i, e.target.value),
            onKeyDown: (e) => handleKeyDown(i, e),
            onFocus: (e) => e.target.select()
          },
          i
        ))
      }
    );
  }
);
InputOTP.displayName = "InputOTP";

// src/components/ui/navigation-menu.tsx
import * as React7 from "react";
import { ChevronDown } from "lucide-react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { jsx as jsx13, jsxs as jsxs4 } from "react/jsx-runtime";
var NavigationMenu = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs4(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx13(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
var NavigationMenuList = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn("group flex flex-1 list-none items-center justify-center gap-0.5", className),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
var NavigationMenuItem = NavigationMenuPrimitive.Item;
var NavigationMenuTrigger = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs4(
  NavigationMenuPrimitive.Trigger,
  {
    ref,
    className: cn(
      "group inline-flex items-center gap-1 px-3 py-2 rounded-sm",
      "font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]",
      "text-muted-foreground hover:text-foreground hover:bg-accent",
      "data-[state=open]:bg-accent data-[state=open]:text-foreground",
      "transition-colors duration-150 cursor-pointer select-none",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx13(
        ChevronDown,
        {
          className: "relative size-3 transition-transform duration-200 group-data-[state=open]:rotate-180",
          strokeWidth: 1.5,
          "aria-hidden": true
        }
      )
    ]
  }
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
var NavigationMenuContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13(
  NavigationMenuPrimitive.Content,
  {
    ref,
    className: cn(
      "left-0 top-0 w-full",
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
      "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
      "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
      "md:absolute md:w-auto",
      className
    ),
    ...props
  }
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
var NavigationMenuLink = NavigationMenuPrimitive.Link;
var NavigationMenuViewport = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13("div", { className: "absolute left-0 top-full flex justify-center", children: /* @__PURE__ */ jsx13(
  NavigationMenuPrimitive.Viewport,
  {
    ref,
    className: cn(
      "origin-top-center relative mt-1.5 overflow-hidden rounded-sm border border-border bg-popover text-popover-foreground",
      "h-[var(--radix-navigation-menu-viewport-height)] w-full md:w-[var(--radix-navigation-menu-viewport-width)]",
      "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95",
      "duration-200",
      className
    ),
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

// src/components/ui/note.tsx
import { cva as cva5 } from "class-variance-authority";
import { jsx as jsx14 } from "react/jsx-runtime";
var noteVariants = cva5(
  "rounded-lg border p-4 transition-[border-color,background-color,color,opacity] duration-150",
  {
    variants: {
      variant: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        error: "",
        action: ""
      },
      tone: {
        soft: "",
        filled: ""
      },
      disabled: {
        true: "pointer-events-none opacity-40",
        false: ""
      }
    },
    compoundVariants: [
      {
        variant: ["neutral", "action"],
        tone: "soft",
        className: "border-border bg-card text-foreground"
      },
      {
        variant: ["neutral", "action"],
        tone: "filled",
        className: "border-border bg-[var(--rm-gray-1)] text-foreground"
      },
      {
        variant: "info",
        tone: "soft",
        className: "border-[var(--rm-blue-300)] bg-[var(--rm-blue-900)] text-[var(--rm-blue-fg-subtle)]"
      },
      {
        variant: "info",
        tone: "filled",
        className: "border-[var(--rm-blue-100)] bg-[var(--rm-blue-100)] text-[var(--rm-blue-fg)]"
      },
      {
        variant: "success",
        tone: "soft",
        className: "border-[var(--rm-green-300)] bg-[var(--rm-green-900)] text-[var(--rm-green-fg-subtle)]"
      },
      {
        variant: "success",
        tone: "filled",
        className: "border-[var(--rm-green-100)] bg-[var(--rm-green-100)] text-[var(--rm-green-fg)]"
      },
      {
        variant: "warning",
        tone: "soft",
        className: "border-[var(--rm-yellow-300)] bg-[var(--rm-yellow-900)] text-[var(--rm-yellow-fg-subtle)]"
      },
      {
        variant: "warning",
        tone: "filled",
        className: "border-[var(--rm-yellow-100)] bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)]"
      },
      {
        variant: "error",
        tone: "soft",
        className: "border-[var(--rm-red-300)] bg-[var(--rm-red-900)] text-[var(--rm-red-fg-subtle)]"
      },
      {
        variant: "error",
        tone: "filled",
        className: "border-[var(--rm-red-100)] bg-[var(--rm-red-100)] text-[var(--rm-red-fg)]"
      }
    ],
    defaultVariants: {
      variant: "neutral",
      tone: "soft",
      disabled: false
    }
  }
);
function Note({
  className,
  variant,
  tone,
  disabled,
  ...props
}) {
  return /* @__PURE__ */ jsx14(
    "div",
    {
      "data-slot": "note",
      className: cn(noteVariants({ variant, tone, disabled }), className),
      ...props
    }
  );
}
function NoteEyebrow({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    "p",
    {
      "data-slot": "note-eyebrow",
      className: cn(
        "text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] opacity-70",
        className
      ),
      ...props
    }
  );
}
function NoteTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    "p",
    {
      "data-slot": "note-title",
      className: cn("text-[length:var(--text-14)] font-medium text-current", className),
      ...props
    }
  );
}
function NoteDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    "div",
    {
      "data-slot": "note-description",
      className: cn("text-[length:var(--text-14)] leading-[1.5] opacity-80", className),
      ...props
    }
  );
}

// src/components/ui/radio.tsx
import * as React8 from "react";
import { jsx as jsx15, jsxs as jsxs5 } from "react/jsx-runtime";
var radioBaseClassName = "peer size-5 shrink-0 appearance-none rounded-full border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
var Radio = React8.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxs5("span", { className: "relative inline-flex size-5 shrink-0 items-center justify-center", children: [
    /* @__PURE__ */ jsx15(
      "input",
      {
        ...props,
        ref,
        type: "radio",
        "data-slot": "radio",
        className: cn(radioBaseClassName, className)
      }
    ),
    /* @__PURE__ */ jsx15("span", { className: "pointer-events-none absolute size-2.5 rounded-full bg-[var(--rm-yellow-100)] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" })
  ] });
});
Radio.displayName = "Radio";

// src/components/ui/scroll-area.tsx
import * as React9 from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { jsx as jsx16, jsxs as jsxs6 } from "react/jsx-runtime";
var ScrollArea = React9.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs6(
  ScrollAreaPrimitive.Root,
  {
    ref,
    "data-slot": "scroll-area",
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx16(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx16(ScrollBar, {}),
      /* @__PURE__ */ jsx16(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = "ScrollArea";
var ScrollBar = React9.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx16(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    "data-slot": "scroll-bar",
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2 border-l border-l-transparent p-px",
      orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent p-px",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx16(
      ScrollAreaPrimitive.ScrollAreaThumb,
      {
        className: cn(
          "relative flex-1 rounded-full",
          "bg-[var(--rm-gray-3)] hover:bg-[var(--rm-gray-4)]",
          "transition-colors duration-150"
        )
      }
    )
  }
));
ScrollBar.displayName = "ScrollBar";

// src/components/ui/search-combobox.tsx
import { useEffect as useEffect4, useMemo, useRef as useRef5, useState } from "react";
import { ChevronDown as ChevronDown2, Clock3, Search, Sparkles, X } from "lucide-react";
import { jsx as jsx17, jsxs as jsxs7 } from "react/jsx-runtime";
var sizeStyles = {
  xs: "h-7 px-3 text-[length:var(--text-12)]",
  sm: "h-8 px-3 text-[length:var(--text-12)]",
  md: "h-10 px-4 text-[length:var(--text-14)]",
  lg: "h-12 px-6 text-[length:var(--text-16)]"
};
var iconSizes = {
  xs: "size-3.5",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5"
};
function SearchCombobox({
  ariaLabel = "\u041F\u043E\u0438\u0441\u043A",
  className,
  defaultValue = "",
  disabled = false,
  emptyMessage = "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u0437\u0430\u043F\u0440\u043E\u0441.",
  error,
  onSelect,
  options,
  placeholder = "\u041D\u0430\u0439\u0442\u0438 \u0430\u0433\u0435\u043D\u0442\u0430, \u043A\u0435\u0439\u0441 \u0438\u043B\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435...",
  predefinedSuggestions = [],
  recentSearches = [],
  size = "md"
}) {
  const rootRef = useRef5(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(defaultValue);
  const [highlighted, setHighlighted] = useState(0);
  useEffect4(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);
  const trimmedQuery = query.trim().toLowerCase();
  const filteredOptions = useMemo(() => {
    if (!trimmedQuery) return options;
    return options.filter((option) => {
      const haystack = [option.label, option.meta, option.hint, option.value].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [options, trimmedQuery]);
  const suggestionGroups = useMemo(() => {
    if (trimmedQuery) return [];
    const groups = [];
    if (recentSearches.length > 0) {
      groups.push({
        id: "recent",
        title: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
        icon: /* @__PURE__ */ jsx17(Clock3, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
        items: recentSearches
      });
    } else {
      groups.push({
        id: "recent-empty",
        title: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
        icon: /* @__PURE__ */ jsx17(Clock3, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
        items: [],
        emptyText: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u0430. \u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0437 \u0433\u043E\u0442\u043E\u0432\u044B\u0445 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0435\u0432 \u043D\u0438\u0436\u0435."
      });
    }
    if (predefinedSuggestions.length > 0) {
      groups.push({
        id: "preset",
        title: recentSearches.length > 0 ? "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438" : "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438",
        icon: /* @__PURE__ */ jsx17(Sparkles, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
        items: predefinedSuggestions
      });
    }
    return groups;
  }, [predefinedSuggestions, recentSearches, size, trimmedQuery]);
  const navigableOptions = trimmedQuery ? filteredOptions : suggestionGroups.flatMap((group) => group.items);
  const currentHighlighted = highlighted >= navigableOptions.length ? 0 : highlighted;
  const handleSelect = (option) => {
    setQuery(option.label);
    setOpen(false);
    onSelect?.(option);
  };
  return /* @__PURE__ */ jsxs7("div", { className: cn("w-full", className), children: [
    /* @__PURE__ */ jsxs7("div", { ref: rootRef, className: "relative", children: [
      /* @__PURE__ */ jsx17(
        "div",
        {
          className: cn(
            "w-full rounded-sm border bg-rm-gray-1 text-foreground transition-all duration-150",
            error ? "border-destructive" : "border-border",
            disabled ? "opacity-40 cursor-not-allowed" : "focus-within:border-ring",
            open && !disabled && !error && "border-ring"
          ),
          children: /* @__PURE__ */ jsxs7(
            "div",
            {
              className: cn(
                "flex items-center gap-2",
                sizeStyles[size],
                size === "lg" ? "gap-3" : "gap-2"
              ),
              role: "combobox",
              "aria-expanded": open,
              "aria-haspopup": "listbox",
              "aria-controls": "rm-search-combobox-list",
              children: [
                /* @__PURE__ */ jsx17(Search, { className: `${iconSizes[size]} shrink-0 text-muted-foreground`, strokeWidth: 2.2 }),
                /* @__PURE__ */ jsx17(
                  "input",
                  {
                    "aria-label": ariaLabel,
                    className: "min-w-0 flex-1 bg-transparent text-inherit placeholder:text-muted-foreground focus:outline-none",
                    disabled,
                    onChange: (event) => {
                      setQuery(event.target.value);
                      setOpen(true);
                      setHighlighted(0);
                    },
                    onFocus: () => {
                      if (!disabled) {
                        setOpen(true);
                        setHighlighted(0);
                      }
                    },
                    onKeyDown: (event) => {
                      if (!navigableOptions.length) {
                        if (event.key === "Escape") setOpen(false);
                        return;
                      }
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setOpen(true);
                        setHighlighted((current) => (current + 1) % navigableOptions.length);
                      }
                      if (event.key === "ArrowUp") {
                        event.preventDefault();
                        setOpen(true);
                        setHighlighted((current) => (current - 1 + navigableOptions.length) % navigableOptions.length);
                      }
                      if (event.key === "Enter" && open) {
                        event.preventDefault();
                        handleSelect(navigableOptions[currentHighlighted] ?? navigableOptions[0]);
                      }
                      if (event.key === "Escape") {
                        setOpen(false);
                      }
                    },
                    placeholder,
                    spellCheck: false,
                    type: "text",
                    value: query
                  }
                ),
                query ? /* @__PURE__ */ jsx17(
                  "button",
                  {
                    "aria-label": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441",
                    className: "inline-flex items-center justify-center text-muted-foreground transition-all duration-150 hover:text-foreground disabled:pointer-events-none",
                    disabled,
                    onClick: () => {
                      setQuery("");
                      setOpen(true);
                      setHighlighted(0);
                    },
                    type: "button",
                    children: /* @__PURE__ */ jsx17(X, { className: iconSizes[size], strokeWidth: 2.2 })
                  }
                ) : /* @__PURE__ */ jsx17(
                  "button",
                  {
                    "aria-label": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A",
                    className: "inline-flex items-center justify-center text-muted-foreground transition-all duration-150 hover:text-foreground disabled:pointer-events-none",
                    disabled,
                    onClick: () => {
                      if (!disabled) {
                        setOpen((current) => !current);
                        setHighlighted(0);
                      }
                    },
                    type: "button",
                    children: /* @__PURE__ */ jsx17(ChevronDown2, { className: iconSizes[size], strokeWidth: 2.2 })
                  }
                )
              ]
            }
          )
        }
      ),
      open && !disabled && /* @__PURE__ */ jsx17("div", { className: "absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-lg border border-border bg-popover", children: /* @__PURE__ */ jsx17("div", { className: "max-h-[320px] overflow-auto p-1.5", children: !trimmedQuery && suggestionGroups.length > 0 ? /* @__PURE__ */ jsx17("div", { className: "space-y-1.5", children: suggestionGroups.map((group) => /* @__PURE__ */ jsxs7("div", { className: "rounded-md", children: [
        /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 px-2.5 py-2", children: [
          group.icon,
          /* @__PURE__ */ jsx17("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground", children: group.title })
        ] }),
        group.items.length > 0 ? /* @__PURE__ */ jsx17("ul", { className: "space-y-1", role: "listbox", children: group.items.map((option, index) => {
          const optionIndex = suggestionGroups.slice(0, suggestionGroups.findIndex((entry) => entry.id === group.id)).flatMap((entry) => entry.items).length + index;
          return /* @__PURE__ */ jsx17("li", { children: /* @__PURE__ */ jsxs7(
            "button",
            {
              className: cn(
                "flex w-full items-start justify-between gap-3 rounded-md border border-transparent px-2.5 py-2 text-left transition-all duration-150 hover:bg-rm-gray-1 hover:border-border",
                currentHighlighted === optionIndex && "bg-rm-gray-1 border-border"
              ),
              onClick: () => handleSelect(option),
              onMouseEnter: () => setHighlighted(optionIndex),
              type: "button",
              children: [
                /* @__PURE__ */ jsxs7("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx17("p", { className: "truncate text-[length:var(--text-14)] text-popover-foreground", children: option.label }),
                  option.meta ? /* @__PURE__ */ jsx17("p", { className: "mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground", children: option.meta }) : null
                ] }),
                option.hint ? /* @__PURE__ */ jsx17("span", { className: "shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground", children: option.hint }) : null
              ]
            }
          ) }, `${group.id}-${option.value}`);
        }) }) : /* @__PURE__ */ jsx17("div", { className: "px-2.5 pb-3 pt-1", children: /* @__PURE__ */ jsx17("p", { className: "text-[length:var(--text-12)] leading-relaxed text-muted-foreground", children: group.emptyText }) })
      ] }, group.id)) }) : filteredOptions.length > 0 ? /* @__PURE__ */ jsx17("ul", { className: "space-y-1", id: "rm-search-combobox-list", role: "listbox", children: filteredOptions.map((option, index) => /* @__PURE__ */ jsx17("li", { children: /* @__PURE__ */ jsxs7(
        "button",
        {
          className: cn(
            "flex w-full items-start justify-between gap-3 rounded-md border border-transparent px-2.5 py-2 text-left transition-all duration-150 hover:bg-rm-gray-1 hover:border-border",
            currentHighlighted === index && "bg-rm-gray-1 border-border"
          ),
          onClick: () => handleSelect(option),
          onMouseEnter: () => setHighlighted(index),
          type: "button",
          children: [
            /* @__PURE__ */ jsxs7("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx17("p", { className: "truncate text-[length:var(--text-14)] text-popover-foreground", children: option.label }),
              option.meta ? /* @__PURE__ */ jsx17("p", { className: "mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground", children: option.meta }) : null
            ] }),
            option.hint ? /* @__PURE__ */ jsx17("span", { className: "shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground", children: option.hint }) : null
          ]
        }
      ) }, option.value)) }) : /* @__PURE__ */ jsx17("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsx17("p", { className: "text-[length:var(--text-13)] text-muted-foreground", children: emptyMessage }) }) }) })
    ] }),
    error ? /* @__PURE__ */ jsx17("p", { className: "mt-1.5 text-[length:var(--text-12)] text-destructive", children: error }) : null
  ] });
}

// src/components/ui/separator.tsx
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { jsx as jsx18 } from "react/jsx-runtime";
function Separator2({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsx18(
    SeparatorPrimitive,
    {
      "data-slot": "separator",
      orientation,
      className: cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/show-more.tsx
import { ChevronDown as ChevronDown3 } from "lucide-react";
import { jsx as jsx19, jsxs as jsxs8 } from "react/jsx-runtime";
function ShowMore({
  expanded,
  onClick,
  label = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451",
  labelExpanded = "\u0421\u043A\u0440\u044B\u0442\u044C",
  fade = false,
  fadeBg = "var(--background)",
  className
}) {
  const btn = /* @__PURE__ */ jsxs8(
    "button",
    {
      type: "button",
      onClick,
      "aria-expanded": expanded,
      className: cn(
        "group/show-more flex w-full items-center gap-3 py-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground",
        !fade && className
      ),
      children: [
        /* @__PURE__ */ jsx19("span", { className: "h-px flex-1 bg-border transition-colors duration-[var(--duration-fast)] group-hover/show-more:bg-muted-foreground/30" }),
        /* @__PURE__ */ jsxs8("span", { className: "inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] transition-all duration-[var(--duration-fast)] group-hover/show-more:border-muted-foreground/40 group-hover/show-more:bg-[var(--rm-gray-1)]", children: [
          expanded ? labelExpanded : label,
          /* @__PURE__ */ jsx19(
            ChevronDown3,
            {
              size: 12,
              strokeWidth: 2.5,
              className: cn(
                "transition-transform duration-[var(--duration-base)]",
                expanded && "rotate-180"
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsx19("span", { className: "h-px flex-1 bg-border transition-colors duration-[var(--duration-fast)] group-hover/show-more:bg-muted-foreground/30" })
      ]
    }
  );
  if (!fade) return btn;
  return /* @__PURE__ */ jsxs8("div", { style: { position: "relative" }, className, children: [
    /* @__PURE__ */ jsx19(
      "div",
      {
        "aria-hidden": true,
        style: {
          position: "absolute",
          top: -72,
          left: 0,
          right: 0,
          height: 72,
          background: `linear-gradient(to bottom, transparent, ${fadeBg})`,
          opacity: expanded ? 0 : 1,
          transition: `opacity var(--duration-base) var(--ease-standard)`,
          pointerEvents: "none",
          zIndex: 9
        }
      }
    ),
    btn
  ] });
}
function ShowMorePanel({
  expanded,
  children,
  className,
  fade = false,
  collapsedHeight = 180
}) {
  return /* @__PURE__ */ jsx19(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateRows: expanded ? "1fr" : "0fr",
        transition: `grid-template-rows var(--duration-smooth) var(--ease-standard)`
      },
      children: /* @__PURE__ */ jsx19(
        "div",
        {
          style: { overflow: "hidden", minHeight: fade ? collapsedHeight : 0 },
          className,
          children
        }
      )
    }
  );
}

// src/components/ui/skeleton.tsx
import { jsx as jsx20 } from "react/jsx-runtime";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx20(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("animate-pulse rounded-sm bg-[var(--rm-gray-1)]", className),
      ...props
    }
  );
}

// src/components/ui/sonner.tsx
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";
import { jsx as jsx21 } from "react/jsx-runtime";
var Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx21(
    Sonner,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ jsx21(CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ jsx21(InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ jsx21(TriangleAlertIcon, { className: "size-4" }),
        error: /* @__PURE__ */ jsx21(OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ jsx21(Loader2Icon, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      toastOptions: {
        classNames: {
          toast: "cn-toast"
        }
      },
      ...props
    }
  );
};

// src/components/ui/switch.tsx
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { jsx as jsx22 } from "react/jsx-runtime";
function Switch({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx22(
    SwitchPrimitive.Root,
    {
      "data-slot": "switch",
      "data-size": size,
      className: cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-sm border border-border bg-rm-gray-1 p-[1px] transition-[background-color,border-color,box-shadow,opacity] duration-150 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-5 data-[size=sm]:w-8 data-checked:border-[var(--rm-yellow-100)] data-checked:bg-[var(--rm-yellow-100)] data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx22(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: "pointer-events-none block rounded-sm bg-foreground transition-[transform,background-color] duration-150 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3.5 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-checked/switch:bg-[var(--rm-yellow-fg)]"
        }
      )
    }
  );
}

// src/components/ui/table.tsx
import { jsx as jsx23 } from "react/jsx-runtime";
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx23("div", { "data-slot": "table-container", className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx23(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full border-collapse caption-bottom bg-card", className),
      ...props
    }
  ) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx23(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("bg-[var(--rm-gray-1)]", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx23(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx23(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: cn(
        "border-t border-border bg-[var(--rm-gray-1)] font-medium",
        className
      ),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx23(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "transition-colors duration-150",
        "hover:bg-[var(--rm-gray-2)]",
        "data-[selected=true]:bg-[var(--rm-yellow-900)]",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx23(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "h-10 px-4 text-left align-middle border-b border-border",
        "font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] font-medium uppercase tracking-[0.08em] text-muted-foreground",
        "[&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx23(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "px-4 py-3 align-middle border-b border-border",
        "text-[length:var(--text-14)]",
        "[&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCaption({ className, ...props }) {
  return /* @__PURE__ */ jsx23(
    "caption",
    {
      "data-slot": "table-caption",
      className: cn(
        "mt-4 text-[length:var(--text-14)] text-muted-foreground",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/tabs.tsx
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva as cva6 } from "class-variance-authority";
import { jsx as jsx24 } from "react/jsx-runtime";
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsx24(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      "data-orientation": orientation,
      className: cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      ),
      ...props
    }
  );
}
var tabsListVariants = cva6(
  "group/tabs-list inline-flex w-fit max-w-full items-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:w-full group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        default: "gap-1 rounded-sm border border-border bg-[var(--rm-gray-1)] p-1",
        secondary: "gap-4 rounded-none border-b border-border bg-transparent p-0"
      },
      size: {
        default: "group-data-horizontal/tabs:min-h-10",
        sm: "group-data-horizontal/tabs:min-h-8 p-0.5 gap-0.5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function TabsList({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx24(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      "data-variant": variant,
      "data-size": size,
      className: cn(tabsListVariants({ variant, size }), className),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ jsx24(
    TabsPrimitive.Tab,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "relative inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-sm border border-transparent px-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color,opacity] duration-150 ease-[var(--ease-standard)] group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:bg-[var(--rm-gray-2)] hover:text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:border-border data-active:bg-background data-active:text-foreground",
        "group-data-[size=sm]/tabs-list:h-7 group-data-[size=sm]/tabs-list:px-2",
        "group-data-[variant=secondary]/tabs-list:h-10 group-data-[variant=secondary]/tabs-list:rounded-none group-data-[variant=secondary]/tabs-list:border-transparent group-data-[variant=secondary]/tabs-list:bg-transparent group-data-[variant=secondary]/tabs-list:px-0 group-data-[variant=secondary]/tabs-list:hover:bg-transparent group-data-[variant=secondary]/tabs-list:data-active:border-transparent group-data-[variant=secondary]/tabs-list:data-active:bg-transparent",
        "after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-full after:bg-[var(--rm-yellow-100)] after:opacity-0 after:transition-opacity after:duration-150 group-data-[variant=secondary]/tabs-list:data-active:after:opacity-100",
        className
      ),
      ...props
    }
  );
}
function TabsContent({ className, ...props }) {
  return /* @__PURE__ */ jsx24(
    TabsPrimitive.Panel,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 text-[length:var(--text-14)] outline-none", className),
      ...props
    }
  );
}

// src/components/ui/textarea.tsx
import * as React11 from "react";
import { cva as cva7 } from "class-variance-authority";
import { jsx as jsx25 } from "react/jsx-runtime";
var textareaVariants = cva7(
  "flex w-full rounded-sm border border-border bg-rm-gray-1 text-foreground placeholder:text-muted-foreground transition-all duration-150 outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "min-h-[120px] resize-y px-4 py-3 text-[length:var(--text-14)] leading-[1.5]",
        chat: "min-h-[48px] max-h-[200px] resize-none overflow-auto px-4 py-3 text-[length:var(--text-16)] leading-[1.618]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Textarea = React11.forwardRef(
  ({ className, variant, ...props }, ref) => {
    return /* @__PURE__ */ jsx25(
      "textarea",
      {
        ref,
        "data-slot": "textarea",
        className: cn(textareaVariants({ variant, className })),
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/components/ui/slider.tsx
import { jsx as jsx26, jsxs as jsxs9 } from "react/jsx-runtime";
function Slider({
  value = 0,
  min = 0,
  max = 1,
  step,
  width = 62,
  className,
  animate: animate2 = false,
  animateKey,
  animationDuration = 15e3,
  animationDelay = 200,
  onChange,
  disabled = false
}) {
  const range = max - min || 1;
  const ratio = Math.max(0, Math.min(1, (value - min) / range));
  const fillPct = `${ratio * 100}%`;
  const animStyle = (name) => ({
    animationName: name,
    animationDuration: `${animationDuration}ms`,
    animationTimingFunction: "linear",
    animationFillMode: "both",
    animationDelay: `${animationDelay}ms`
  });
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      className: cn("relative flex-none", className),
      style: { width: typeof width === "number" ? `${width}px` : width, height: "8px" },
      children: [
        /* @__PURE__ */ jsx26("div", { className: "absolute inset-x-0 top-[3px] h-[2px] bg-border" }),
        /* @__PURE__ */ jsx26(
          "div",
          {
            className: "absolute left-0 top-[3px] h-[2px] bg-foreground",
            style: animate2 ? animStyle("rm-slider-fill") : { width: fillPct }
          },
          animate2 ? `fill-${String(animateKey)}` : void 0
        ),
        /* @__PURE__ */ jsx26(
          "div",
          {
            className: "absolute top-0 w-2 h-2 bg-foreground",
            style: animate2 ? animStyle("rm-slider-dot") : { left: `calc(${fillPct} - 4px)` }
          },
          animate2 ? `dot-${String(animateKey)}` : void 0
        ),
        onChange && !disabled && /* @__PURE__ */ jsx26(
          "input",
          {
            type: "range",
            min,
            max,
            step,
            value,
            onChange: (e) => onChange(Number(e.currentTarget.value)),
            className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          }
        )
      ]
    }
  );
}

// src/components/ui/tooltip.tsx
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { jsx as jsx27, jsxs as jsxs10 } from "react/jsx-runtime";
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx27(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsx27(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsx27(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx27(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx27(
    TooltipPrimitive.Positioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxs10(
        TooltipPrimitive.Popup,
        {
          "data-slot": "tooltip-content",
          className: cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          ),
          ...props,
          children: [
            children,
            /* @__PURE__ */ jsx27(TooltipPrimitive.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}

// src/components/ui/rich-text.tsx
import { jsx as jsx28, jsxs as jsxs11 } from "react/jsx-runtime";
var BULLET_RE = /^\s*[-•·–—]\s+(.*)$/;
var NUMBERED_RE = /^\s*\d+[.)]\s+(.*)$/;
function parseBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const bul = line.match(BULLET_RE);
    const num = line.match(NUMBERED_RE);
    if (bul) {
      if (current?.kind !== "ul") {
        if (current) blocks.push(current);
        current = { kind: "ul", items: [] };
      }
      current.items.push(bul[1]);
    } else if (num) {
      if (current?.kind !== "ol") {
        if (current) blocks.push(current);
        current = { kind: "ol", items: [] };
      }
      current.items.push(num[1]);
    } else if (line.trim() === "") {
      if (current) {
        blocks.push(current);
        current = null;
      }
    } else {
      if (current?.kind !== "paragraph") {
        if (current) blocks.push(current);
        current = { kind: "paragraph", lines: [] };
      }
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);
  return blocks;
}
function RichText({ text, className, blockClassName }) {
  if (!text) return null;
  const blocks = parseBlocks(text);
  if (blocks.length === 0) return null;
  return /* @__PURE__ */ jsx28("span", { className: cn("block", className), children: blocks.map((b, i) => {
    const isFirst = i === 0;
    if (b.kind === "ul") {
      return /* @__PURE__ */ jsx28(
        "ul",
        {
          className: cn(
            "list-disc pl-[1.25em]",
            !isFirst && "mt-1",
            "[&>li]:mb-1 [&>li:last-child]:mb-0",
            blockClassName
          ),
          children: b.items.map((it, j) => /* @__PURE__ */ jsx28("li", { children: it }, j))
        },
        i
      );
    }
    if (b.kind === "ol") {
      return /* @__PURE__ */ jsx28(
        "ol",
        {
          className: cn(
            "list-decimal pl-[1.5em]",
            !isFirst && "mt-1",
            "[&>li]:mb-1 [&>li:last-child]:mb-0",
            blockClassName
          ),
          children: b.items.map((it, j) => /* @__PURE__ */ jsx28("li", { children: it }, j))
        },
        i
      );
    }
    return /* @__PURE__ */ jsx28("p", { className: cn(!isFirst && "mt-1", blockClassName), children: b.lines.map((l, j) => /* @__PURE__ */ jsxs11("span", { children: [
      j > 0 && /* @__PURE__ */ jsx28("br", {}),
      l
    ] }, j)) }, i);
  }) });
}

// src/components/ui/styled-paragraphs.tsx
import { jsx as jsx29 } from "react/jsx-runtime";
function resolveStyledParagraphs(paragraphs, legacy, legacyDefaults = {}) {
  if (paragraphs && paragraphs.length > 0) {
    return paragraphs.filter((p) => p && (p.text ?? "").length > 0).map((p) => ({
      text: p.text,
      uppercase: p.uppercase === true,
      color: p.color === "primary" ? "primary" : "secondary"
    }));
  }
  if (legacy && legacy.trim().length > 0) {
    return [
      {
        text: legacy,
        uppercase: legacyDefaults.uppercase ?? false,
        color: legacyDefaults.color ?? "secondary"
      }
    ];
  }
  return [];
}
function styledParagraphClassName(p, opts = {}) {
  const theme = opts.theme ?? "dark";
  const size = opts.size ?? "18";
  const isPrimary = p.color === "primary";
  const textColor = theme === "light" ? isPrimary ? "text-[#0A0A0A]" : "text-[#666666]" : isPrimary ? "text-[#F0F0F0]" : "text-[#939393]";
  const sizeToken = size === "16" ? "text-[length:var(--text-16)]" : "text-[length:var(--text-18)]";
  if (p.uppercase) {
    return cn(
      "font-[family-name:var(--font-mono-family)]",
      sizeToken,
      "font-medium uppercase leading-[1.12] tracking-[0.02em]",
      textColor
    );
  }
  return cn(sizeToken, "leading-[1.2]", textColor);
}
function StyledParagraphs({
  paragraphs,
  theme = "dark",
  size = "18",
  className
}) {
  if (!paragraphs || paragraphs.length === 0) return null;
  return /* @__PURE__ */ jsx29("div", { className: cn("flex flex-col gap-3", className), children: paragraphs.map((p, i) => /* @__PURE__ */ jsx29(
    RichText,
    {
      text: p.text,
      className: styledParagraphClassName(p, { theme, size })
    },
    i
  )) });
}

// src/components/ui/partnership-block.tsx
import { jsx as jsx30, jsxs as jsxs12 } from "react/jsx-runtime";
function PartnershipBlock({
  caption,
  title,
  description,
  paragraphs,
  logos,
  photos,
  className
}) {
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: false,
    color: "secondary"
  });
  const hasParagraphs = resolvedParagraphs.length > 0;
  return /* @__PURE__ */ jsxs12(
    "div",
    {
      className: cn(
        "flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs12("div", { className: "flex flex-col gap-8 lg:max-w-[560px]", children: [
          /* @__PURE__ */ jsxs12("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx30("span", { className: "font-[family-name:var(--font-mono-family)] text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[var(--rm-yellow-100)]", children: caption }),
            /* @__PURE__ */ jsxs12("div", { className: "flex flex-col gap-6", children: [
              /* @__PURE__ */ jsx30("h3", { className: "font-[family-name:var(--font-heading-family)] text-[28px] md:text-[36px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]", children: title }),
              hasParagraphs && /* @__PURE__ */ jsx30(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" })
            ] })
          ] }),
          logos.length > 0 && /* @__PURE__ */ jsx30("div", { className: "flex items-center gap-8", children: logos.map((logo) => /* @__PURE__ */ jsx30(
            "img",
            {
              src: logo.src,
              alt: logo.alt,
              className: "h-auto w-auto max-h-[56px] max-w-[45%] object-contain"
            },
            logo.src
          )) })
        ] }),
        photos.length > 0 && /* @__PURE__ */ jsx30("div", { className: "grid grid-cols-2 gap-4 lg:w-[696px] shrink-0", children: photos.slice(0, 4).map((photo, i) => /* @__PURE__ */ jsx30("div", { className: "aspect-[340/252] overflow-hidden", children: /* @__PURE__ */ jsx30(
          "img",
          {
            src: photo.src,
            alt: photo.alt || "",
            className: "w-full h-full object-cover"
          }
        ) }, i)) })
      ]
    }
  );
}

// src/components/ui/product-card.tsx
import Link2 from "next/link";
import { Fragment as Fragment2, jsx as jsx31, jsxs as jsxs13 } from "react/jsx-runtime";
function ProductCard({
  title,
  description,
  icon,
  experts,
  tag,
  href,
  className
}) {
  const hasExperts = experts && experts.length > 0;
  const exactlyThree = hasExperts && experts.length === 3;
  const shown = hasExperts ? experts.slice(0, exactlyThree ? 3 : 2) : [];
  const extra = hasExperts && !exactlyThree ? Math.max(0, experts.length - 2) : 0;
  const rootCn = cn(
    "group relative flex flex-col p-5 md:p-8 md:h-full",
    "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
    "border border-[#404040] transition-[border-color] duration-75",
    "md:hover:z-10",
    "md:active:[border-color:var(--rm-yellow-100)]",
    className
  );
  const content = /* @__PURE__ */ jsxs13(Fragment2, { children: [
    /* @__PURE__ */ jsx31("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx31(
      GlowingEffect,
      {
        spread: 40,
        glow: false,
        disabled: false,
        proximity: 40,
        inactiveZone: 0.01,
        borderWidth: 1,
        variant: "yellow"
      }
    ) }),
    /* @__PURE__ */ jsx31("div", { className: "absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] text-[#404040] transition-all duration-200 group-hover:text-[#F0F0F0] group-hover:-top-[2px] group-hover:-right-[2px]", children: /* @__PURE__ */ jsx31("svg", { width: "11", height: "11", viewBox: "0 0 11 11", fill: "none", children: /* @__PURE__ */ jsx31(
      "path",
      {
        d: "M1 10L10 1M10 1H3M10 1V8",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ) }) }),
    /* @__PURE__ */ jsxs13("div", { className: cn("flex flex-col", icon ? "gap-6 md:gap-8" : ""), children: [
      icon && /* @__PURE__ */ jsxs13("div", { className: "relative flex items-center overflow-visible", children: [
        /* @__PURE__ */ jsx31("div", { className: "w-[120px] h-[120px] shrink-0 z-0", children: icon }),
        hasExperts && /* @__PURE__ */ jsxs13("div", { className: "flex items-center -ml-[18px] pb-10 pt-2 justify-end min-w-0", children: [
          shown.map((e, i) => /* @__PURE__ */ jsx31(
            "div",
            {
              className: cn(
                "w-[72px] h-[72px] min-w-[52px] min-h-[52px] rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center",
                i > 0 && "-ml-4"
              ),
              style: {
                backgroundImage: `url(${e.image})`,
                zIndex: shown.length + 1 - i
              }
            },
            e.name
          )),
          extra > 0 && /* @__PURE__ */ jsx31("div", { className: "w-[72px] h-[72px] min-w-[52px] min-h-[52px] rounded-full bg-[#1A1A1A] flex items-center justify-center -ml-4 z-[1]", children: /* @__PURE__ */ jsxs13("span", { className: "font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]", children: [
            "+",
            extra
          ] }) })
        ] }),
        tag && /* @__PURE__ */ jsx31("span", { className: "absolute left-0 bottom-[-22px] inline-flex items-center px-2.5 py-1 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466] z-10", children: tag })
      ] }),
      tag && !icon && /* @__PURE__ */ jsx31("span", { className: "inline-flex self-start items-center px-2.5 py-1 mb-4 md:mb-5 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466]", children: tag }),
      /* @__PURE__ */ jsxs13("div", { className: "flex flex-col gap-4 md:gap-5", children: [
        /* @__PURE__ */ jsx31("h3", { className: "font-heading font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] line-clamp-2 min-h-[2.4em] text-[20px] md:text-[clamp(16px,1.6vw,24px)]", children: title }),
        /* @__PURE__ */ jsx31("p", { className: "text-[14px] leading-[1.32] tracking-[0.01em] text-[#939393] h-[54px] overflow-hidden line-clamp-3", children: description })
      ] })
    ] })
  ] });
  if (href) {
    return /* @__PURE__ */ jsx31(Link2, { href, className: rootCn, children: content });
  }
  return /* @__PURE__ */ jsx31("div", { className: rootCn, children: content });
}

// src/components/ui/product-image-card.tsx
import Link3 from "next/link";
import { Fragment as Fragment3, jsx as jsx32, jsxs as jsxs14 } from "react/jsx-runtime";
function ImagePlaceholder() {
  return /* @__PURE__ */ jsx32("div", { className: "flex h-full w-full items-center justify-center bg-[#111] text-[#404040]", children: /* @__PURE__ */ jsxs14("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx32("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsx32("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ jsx32("path", { d: "m21 15-5-5L5 21" })
  ] }) });
}
var tagCn = "inline-flex items-center px-2.5 py-1 bg-[#3D3300] border border-[#4A3C00] font-[family-name:var(--font-mono-family)] text-[12px] font-medium uppercase tracking-[0.02em] leading-[1.2] text-[#FFE466]";
function ProductImageCard({
  title,
  description,
  image,
  tag,
  href,
  variant = "default",
  factoids = [],
  compact = false,
  className
}) {
  if (variant === "wide") {
    const maxFactoids = compact ? 2 : 3;
    const rootCn2 = cn(
      "group relative flex flex-col p-5 md:flex-row md:gap-8 md:p-8 md:pl-0 md:h-full",
      compact ? "md:min-h-[350px]" : "md:min-h-[424px]",
      "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
      "border border-[#404040] transition-[border-color] duration-75",
      "md:hover:z-10",
      "md:active:[border-color:var(--rm-yellow-100)]",
      className
    );
    const inner2 = /* @__PURE__ */ jsxs14(Fragment3, { children: [
      /* @__PURE__ */ jsx32("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx32(GlowingEffect, { spread: 40, glow: false, disabled: false, proximity: 40, inactiveZone: 0.01, borderWidth: 1, variant: "yellow" }) }),
      /* @__PURE__ */ jsx32("div", { className: "absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] text-[#404040] transition-all duration-200 group-hover:text-[#F0F0F0] group-hover:-top-[2px] group-hover:-right-[2px]", children: /* @__PURE__ */ jsx32("svg", { width: "11", height: "11", viewBox: "0 0 11 11", fill: "none", children: /* @__PURE__ */ jsx32("path", { d: "M1 10L10 1M10 1H3M10 1V8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
      /* @__PURE__ */ jsxs14("div", { className: "relative md:w-1/2 h-[220px] md:h-auto md:self-stretch overflow-hidden shrink-0", children: [
        image ? /* @__PURE__ */ jsx32("img", { src: image, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx32(ImagePlaceholder, {}),
        tag && /* @__PURE__ */ jsx32("span", { className: cn(tagCn, "hidden md:inline-flex absolute left-0 top-0 z-10"), children: tag })
      ] }),
      tag && /* @__PURE__ */ jsx32("div", { className: "md:hidden -mt-[22px]", children: /* @__PURE__ */ jsx32("span", { className: tagCn, children: tag }) }),
      /* @__PURE__ */ jsxs14("div", { className: "md:flex-1 flex flex-col md:justify-between gap-4 mt-6 md:mt-0 min-w-0", children: [
        /* @__PURE__ */ jsxs14("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx32("h3", { className: "font-heading font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] line-clamp-2 min-h-[2.4em] text-[20px] md:text-[clamp(16px,1.6vw,24px)]", children: title }),
          /* @__PURE__ */ jsx32("p", { className: "text-[14px] leading-[1.32] tracking-[0.01em] text-[#939393] line-clamp-3 h-[54px] overflow-hidden", children: description })
        ] }),
        factoids.length > 0 && /* @__PURE__ */ jsx32("div", { className: "hidden md:flex flex-col gap-4", children: factoids.slice(0, maxFactoids).map((f, i) => /* @__PURE__ */ jsxs14("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ jsx32("span", { className: "font-heading text-[24px] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0] shrink-0 w-[66px]", children: f.number }),
          /* @__PURE__ */ jsx32("p", { className: "text-[14px] leading-[1.32] tracking-[0.01em] text-[#F0F0F0] pt-[5px] line-clamp-2", children: f.text })
        ] }, i)) })
      ] })
    ] });
    if (href) return /* @__PURE__ */ jsx32(Link3, { href, className: rootCn2, children: inner2 });
    return /* @__PURE__ */ jsx32("div", { className: rootCn2, children: inner2 });
  }
  const rootCn = cn(
    "group relative flex flex-col p-5 md:p-8",
    "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
    "border border-[#404040] transition-[border-color] duration-75",
    "md:hover:z-10",
    "md:active:[border-color:var(--rm-yellow-100)]",
    className
  );
  const inner = /* @__PURE__ */ jsxs14(Fragment3, { children: [
    /* @__PURE__ */ jsx32(GlowingEffect, { spread: 40, glow: false, disabled: false, proximity: 40, inactiveZone: 0.01, borderWidth: 2, variant: "yellow" }),
    /* @__PURE__ */ jsx32("div", { className: "absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] text-[#404040] transition-all duration-200 group-hover:text-[#F0F0F0] group-hover:-top-[2px] group-hover:-right-[2px]", children: /* @__PURE__ */ jsx32("svg", { width: "11", height: "11", viewBox: "0 0 11 11", fill: "none", children: /* @__PURE__ */ jsx32("path", { d: "M1 10L10 1M10 1H3M10 1V8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
    /* @__PURE__ */ jsxs14("div", { className: "flex flex-col gap-6 md:gap-8", children: [
      /* @__PURE__ */ jsxs14("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx32("div", { className: "w-full h-[220px] overflow-hidden", children: image ? /* @__PURE__ */ jsx32("img", { src: image, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx32(ImagePlaceholder, {}) }),
        tag && /* @__PURE__ */ jsx32("div", { className: "-mt-[22px]", children: /* @__PURE__ */ jsx32("span", { className: tagCn, children: tag }) })
      ] }),
      /* @__PURE__ */ jsxs14("div", { className: "flex flex-col gap-4 md:gap-5", children: [
        /* @__PURE__ */ jsx32("h3", { className: "font-heading font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] line-clamp-2 min-h-[2.4em] text-[20px] md:text-[clamp(16px,1.6vw,24px)]", children: title }),
        /* @__PURE__ */ jsx32("p", { className: "text-[14px] leading-[1.32] tracking-[0.01em] text-[#939393] h-[54px] overflow-hidden line-clamp-3", children: description })
      ] })
    ] })
  ] });
  if (href) return /* @__PURE__ */ jsx32(Link3, { href, className: rootCn, children: inner });
  return /* @__PURE__ */ jsx32("div", { className: rootCn, children: inner });
}

// src/components/ui/breadcrumbs.tsx
import * as React12 from "react";
import { jsx as jsx33, jsxs as jsxs15 } from "react/jsx-runtime";
var Breadcrumbs = React12.forwardRef(
  ({ items, mobileScroll = true, className, ...props }, ref) => {
    const scrollRef = React12.useRef(null);
    React12.useEffect(() => {
      if (!mobileScroll) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollLeft = el.scrollWidth;
    }, [items, mobileScroll]);
    return /* @__PURE__ */ jsx33(
      "nav",
      {
        ref,
        "aria-label": "\u0425\u043B\u0435\u0431\u043D\u044B\u0435 \u043A\u0440\u043E\u0448\u043A\u0438",
        className: cn(
          mobileScroll && "breadcrumbs-scroll overflow-x-auto",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx33(
          "ol",
          {
            ref: scrollRef,
            className: cn(
              "flex items-center gap-3 whitespace-nowrap",
              mobileScroll && "min-w-max"
            ),
            children: items.map((item, i) => {
              const isLast = i === items.length - 1;
              return /* @__PURE__ */ jsxs15(
                "li",
                {
                  className: "flex items-center gap-2 text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em]",
                  children: [
                    item.href && !isLast ? /* @__PURE__ */ jsx33(
                      "a",
                      {
                        href: item.href,
                        className: "text-[color:var(--rm-gray-4)] transition-colors hover:text-[color:var(--rm-gray-fg-sub)]",
                        children: item.label
                      }
                    ) : /* @__PURE__ */ jsx33(
                      "span",
                      {
                        className: cn(
                          isLast ? "text-[color:var(--rm-gray-fg-sub)]" : "text-[color:var(--rm-gray-4)]"
                        ),
                        "aria-current": isLast ? "page" : void 0,
                        children: item.label
                      }
                    ),
                    !isLast && /* @__PURE__ */ jsx33(
                      "span",
                      {
                        className: "text-[color:var(--rm-gray-3)]",
                        "aria-hidden": true,
                        children: "/"
                      }
                    )
                  ]
                },
                `${item.label}-${i}`
              );
            })
          }
        )
      }
    );
  }
);
Breadcrumbs.displayName = "Breadcrumbs";

// src/components/ui/tag.tsx
import { cva as cva8 } from "class-variance-authority";
import { jsx as jsx34 } from "react/jsx-runtime";
var tagVariants = cva8(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border transition-colors",
    "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] leading-[1.16]"
  ],
  {
    variants: {
      size: {
        // Large — hero article page
        l: "h-7 px-2.5 text-[length:var(--text-14)]",
        // Medium — mobile hero
        m: "h-7 px-2.5 text-[length:var(--text-12)]",
        // Small — card tile
        s: "py-1 px-2 text-[length:var(--text-12)]"
      },
      state: {
        default: "bg-[color:var(--rm-gray-1)] border-[color:var(--rm-gray-3)] text-[color:var(--rm-gray-fg-sub)]",
        interactive: "bg-[color:var(--rm-gray-1)] border-[color:var(--rm-gray-3)] text-[color:var(--rm-gray-fg-sub)] hover:border-[color:var(--rm-gray-4)] hover:text-[color:var(--rm-gray-fg-main)] cursor-pointer",
        active: "bg-[color:var(--rm-yellow-100)] border-[color:var(--rm-yellow-100)] text-[color:var(--rm-yellow-fg)] cursor-pointer",
        disabled: "bg-[color:var(--rm-gray-1)] border-[color:var(--rm-gray-3)] text-[color:var(--rm-gray-3)] cursor-not-allowed opacity-60"
      }
    },
    defaultVariants: {
      size: "l",
      state: "default"
    }
  }
);
function Tag(props) {
  const { size, state, className, as, ...rest } = props;
  const classes = cn(tagVariants({ size, state }), className);
  if (as === "button") {
    return /* @__PURE__ */ jsx34(
      "button",
      {
        type: "button",
        ...rest,
        className: classes
      }
    );
  }
  if (as === "a") {
    return /* @__PURE__ */ jsx34("a", { ...rest, className: classes });
  }
  return /* @__PURE__ */ jsx34("span", { ...rest, className: classes });
}

// src/components/ui/author.tsx
import { Calendar } from "lucide-react";
import { Fragment as Fragment4, jsx as jsx35, jsxs as jsxs16 } from "react/jsx-runtime";
var dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric"
});
function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return dateFormatter.format(d) + " \u0433.";
}
function Author({
  name,
  avatarUrl,
  date,
  variant = "full",
  className,
  ...props
}) {
  const formatted = formatDate(date);
  const initials = name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("");
  if (variant === "short") {
    return /* @__PURE__ */ jsxs16(
      "div",
      {
        className: cn("flex items-center gap-2 text-[length:var(--text-14)] min-w-0 flex-nowrap", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxs16(Avatar, { size: "xs", className: "shrink-0 border-0", children: [
            avatarUrl ? /* @__PURE__ */ jsx35(AvatarImage, { src: avatarUrl, alt: name }) : null,
            /* @__PURE__ */ jsx35(AvatarFallback, { className: "text-[10px]", children: initials })
          ] }),
          /* @__PURE__ */ jsx35("span", { className: "min-w-0 flex-1 truncate font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[color:var(--rm-gray-fg-sub)]", children: name }),
          formatted && /* @__PURE__ */ jsxs16(Fragment4, { children: [
            /* @__PURE__ */ jsx35("span", { className: "mx-1 h-3 w-px shrink-0 bg-[color:var(--rm-gray-3)]", "aria-hidden": true }),
            /* @__PURE__ */ jsxs16("span", { className: "inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[color:var(--rm-gray-fg-sub)] leading-[1.32] tracking-[0.01em]", children: [
              /* @__PURE__ */ jsx35(Calendar, { className: "h-4 w-4", strokeWidth: 1.5, "aria-hidden": true }),
              formatted
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs16(
    "div",
    {
      className: cn("flex items-stretch gap-3", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxs16(Avatar, { size: "md", className: "shrink-0 border-0", children: [
          avatarUrl ? /* @__PURE__ */ jsx35(AvatarImage, { src: avatarUrl, alt: name }) : null,
          /* @__PURE__ */ jsx35(AvatarFallback, { className: "text-[length:var(--text-12)]", children: initials })
        ] }),
        /* @__PURE__ */ jsxs16("div", { className: "flex flex-col justify-center gap-1 min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx35("span", { className: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[color:var(--rm-gray-fg-main)] truncate", children: name }),
          formatted && /* @__PURE__ */ jsxs16("span", { className: "inline-flex items-center gap-1 text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[color:var(--rm-gray-fg-sub)]", children: [
            /* @__PURE__ */ jsx35(Calendar, { className: "h-4 w-4", strokeWidth: 1.5, "aria-hidden": true }),
            formatted
          ] })
        ] })
      ]
    }
  );
}

// src/components/ui/key-thoughts.tsx
import { jsx as jsx36 } from "react/jsx-runtime";
function KeyThoughts({ thoughts, className, ...props }) {
  if (!thoughts.length) return null;
  return /* @__PURE__ */ jsx36(
    "ul",
    {
      className: cn(
        "flex flex-col gap-5 border-l border-[color:var(--rm-gray-3)] pl-[26px]",
        className
      ),
      ...props,
      children: thoughts.map((t, i) => /* @__PURE__ */ jsx36(
        "li",
        {
          className: "font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-16)] uppercase tracking-[0.02em] leading-[1.12] text-[color:var(--rm-gray-fg-sub)]",
          children: t
        },
        i
      ))
    }
  );
}

// src/components/ui/article-nav.tsx
import { jsx as jsx37 } from "react/jsx-runtime";
function ArticleNav({
  items,
  activeId,
  onNavigate,
  className,
  ...props
}) {
  if (!items.length) return null;
  return /* @__PURE__ */ jsx37(
    "nav",
    {
      "aria-label": "\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0441\u0442\u0430\u0442\u044C\u0438",
      className: cn("flex w-[268px] flex-col gap-6", className),
      ...props,
      children: /* @__PURE__ */ jsx37("ul", { className: "flex flex-col gap-5", children: items.map((item) => {
        const isActive = item.id === activeId;
        return /* @__PURE__ */ jsx37("li", { children: /* @__PURE__ */ jsx37(
          "a",
          {
            href: `#${item.id}`,
            onClick: (e) => {
              if (!onNavigate) return;
              e.preventDefault();
              onNavigate(item.id);
            },
            "aria-current": isActive ? "true" : void 0,
            className: cn(
              "block font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-18)] uppercase tracking-[0.02em] leading-[1.12] transition-colors",
              isActive ? "text-[color:var(--rm-yellow-100)]" : "text-[color:var(--rm-gray-fg-sub)] hover:text-[color:var(--rm-gray-fg-main)]"
            ),
            children: item.label
          }
        ) }, item.id);
      }) })
    }
  );
}

// src/components/ui/article-card.tsx
import { ArrowUpRight } from "lucide-react";
import { Fragment as Fragment5, jsx as jsx38, jsxs as jsxs17 } from "react/jsx-runtime";
function ArticleCard({
  href,
  title,
  description,
  coverUrl,
  tags,
  authorName,
  authorAvatarUrl,
  date,
  maxTags = 3,
  className,
  ...props
}) {
  const visibleTags = (tags ?? []).slice(0, maxTags);
  return /* @__PURE__ */ jsxs17(
    "article",
    {
      className: cn(
        "group relative flex w-[350px] flex-col",
        "rounded-sm border border-[color:var(--rm-gray-3)]",
        "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
        "p-8",
        className
      ),
      ...props,
      children: [
        href && /* @__PURE__ */ jsxs17(Fragment5, { children: [
          /* @__PURE__ */ jsx38(
            "a",
            {
              href,
              className: "absolute inset-0 z-[1] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--rm-yellow-100)]",
              "aria-label": title
            }
          ),
          /* @__PURE__ */ jsx38(
            "span",
            {
              className: "absolute right-2 top-2 z-[2] inline-flex h-10 w-10 items-center justify-center rounded-sm text-[color:var(--rm-gray-fg-main)] transition-colors group-hover:text-[color:var(--rm-yellow-100)]",
              "aria-hidden": true,
              children: /* @__PURE__ */ jsx38(ArrowUpRight, { className: "h-5 w-5", strokeWidth: 1.5 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs17("div", { className: "relative -mx-[0] mb-[-53px] h-56 overflow-hidden", children: [
          coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            /* @__PURE__ */ jsx38(
              "img",
              {
                src: coverUrl,
                alt: "",
                className: "h-full w-full object-cover",
                "aria-hidden": true
              }
            )
          ) : /* @__PURE__ */ jsx38("div", { className: "h-full w-full bg-[color:var(--rm-gray-1)]", "aria-hidden": true }),
          /* @__PURE__ */ jsx38(
            "div",
            {
              className: "pointer-events-none absolute inset-0",
              style: {
                background: "linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.72) 22%, rgba(10,10,10,0) 100%)"
              },
              "aria-hidden": true
            }
          )
        ] }),
        visibleTags.length > 0 && /* @__PURE__ */ jsx38("div", { className: "relative z-[1] mt-[-24px] flex flex-wrap gap-x-2 gap-y-1", children: visibleTags.map((t) => /* @__PURE__ */ jsx38(Tag, { size: "s", children: t }, t)) }),
        /* @__PURE__ */ jsxs17("div", { className: "relative z-[1] mt-7 flex flex-col gap-5", children: [
          /* @__PURE__ */ jsxs17("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsx38("h3", { className: "font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] uppercase tracking-[-0.01em] leading-[1.2] text-[color:var(--rm-gray-fg-main)]", children: title }),
            description && /* @__PURE__ */ jsx38("p", { className: "line-clamp-3 text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[color:var(--rm-gray-fg-sub)]", children: description })
          ] }),
          authorName && /* @__PURE__ */ jsx38(
            Author,
            {
              variant: "short",
              name: authorName,
              avatarUrl: authorAvatarUrl,
              date
            }
          )
        ] })
      ]
    }
  );
}

// src/components/ui/for-whom-section.tsx
import { Fragment as Fragment6, jsx as jsx39, jsxs as jsxs18 } from "react/jsx-runtime";
function FactCard({ title, text }) {
  return /* @__PURE__ */ jsxs18("div", { className: "grid grid-rows-[subgrid] row-span-3 gap-4", children: [
    /* @__PURE__ */ jsx39("div", { className: "flex items-end", children: /* @__PURE__ */ jsx39("h4", { className: "h4 text-[#0A0A0A]", children: title }) }),
    /* @__PURE__ */ jsx39("div", { className: "h-0 w-full border-t border-[#404040]" }),
    /* @__PURE__ */ jsx39("div", { children: /* @__PURE__ */ jsx39(
      RichText,
      {
        text,
        className: "text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A] max-w-[480px]"
      }
    ) })
  ] });
}
function ForWhomSection({
  tag,
  title,
  titleSecondary,
  subtitle,
  paragraphs,
  facts,
  wideColumn = "right",
  className
}) {
  const resolvedParagraphsDesktop = resolveStyledParagraphs(paragraphs, subtitle, {
    uppercase: true,
    color: "primary"
  });
  const hasParagraphs = resolvedParagraphsDesktop.length > 0;
  return /* @__PURE__ */ jsxs18("section", { className: cn("w-full bg-[#F0F0F0] py-10 md:py-16 lg:py-20", className), children: [
    /* @__PURE__ */ jsxs18("div", { className: "hidden lg:flex flex-col gap-[104px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: [
      /* @__PURE__ */ jsxs18("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx39("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]", children: tag }),
        /* @__PURE__ */ jsxs18("div", { className: "flex", children: [
          /* @__PURE__ */ jsx39("div", { className: "w-1/2 shrink-0 pr-8", children: /* @__PURE__ */ jsxs18("h2", { className: "h2", children: [
            /* @__PURE__ */ jsx39("span", { className: "text-[#0A0A0A]", children: title }),
            titleSecondary ? /* @__PURE__ */ jsxs18(Fragment6, { children: [
              /* @__PURE__ */ jsx39("span", { className: "text-[#0A0A0A]", children: " " }),
              /* @__PURE__ */ jsx39("span", { className: "text-[#666666]", children: titleSecondary })
            ] }) : null
          ] }) }),
          hasParagraphs && /* @__PURE__ */ jsx39("div", { className: "w-1/2", children: /* @__PURE__ */ jsx39("div", { className: "max-w-[480px]", children: /* @__PURE__ */ jsx39(StyledParagraphs, { paragraphs: resolvedParagraphsDesktop, theme: "light", size: "18" }) }) })
        ] })
      ] }),
      (() => {
        let leftFacts;
        let rightFacts;
        if (facts.length === 2) {
          leftFacts = [facts[0]];
          rightFacts = [facts[1]];
        } else if (facts.length === 3) {
          if (wideColumn === "left") {
            leftFacts = [facts[0]];
            rightFacts = [facts[1], facts[2]];
          } else {
            leftFacts = [facts[0], facts[1]];
            rightFacts = [facts[2]];
          }
        } else {
          leftFacts = [facts[0], facts[1]];
          rightFacts = [facts[2], facts[3]];
        }
        const renderCard = (f, i) => /* @__PURE__ */ jsxs18("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx39("div", { className: "flex items-end", children: /* @__PURE__ */ jsx39("h4", { className: "h4 text-[#0A0A0A]", children: f.title }) }),
          /* @__PURE__ */ jsx39("div", { className: "h-0 w-full border-t border-[#404040]" }),
          /* @__PURE__ */ jsx39(
            RichText,
            {
              text: f.text,
              className: "text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]"
            }
          )
        ] }, i);
        return /* @__PURE__ */ jsxs18("div", { className: "flex", children: [
          /* @__PURE__ */ jsx39("div", { className: "w-1/2 flex gap-4 pr-4", children: leftFacts.map((f, i) => /* @__PURE__ */ jsx39("div", { className: "flex-1", children: renderCard(f, i) }, i)) }),
          /* @__PURE__ */ jsx39("div", { className: "w-1/2 flex gap-4", children: rightFacts.map((f, i) => /* @__PURE__ */ jsx39("div", { className: "flex-1", children: renderCard(f, i) }, i)) })
        ] });
      })()
    ] }),
    /* @__PURE__ */ jsxs18("div", { className: "flex lg:hidden flex-col gap-16 px-5 md:px-8", children: [
      /* @__PURE__ */ jsxs18("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx39("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]", children: tag }),
        /* @__PURE__ */ jsxs18("h2", { className: "h3", children: [
          /* @__PURE__ */ jsx39("span", { className: "text-[#0A0A0A]", children: title }),
          titleSecondary ? /* @__PURE__ */ jsxs18(Fragment6, { children: [
            /* @__PURE__ */ jsx39("span", { className: "text-[#0A0A0A]", children: " " }),
            /* @__PURE__ */ jsx39("span", { className: "text-[#666666]", children: titleSecondary })
          ] }) : null
        ] }),
        hasParagraphs && /* @__PURE__ */ jsx39("div", { className: "mt-1", children: /* @__PURE__ */ jsx39(StyledParagraphs, { paragraphs: resolvedParagraphsDesktop, theme: "light", size: "16" }) })
      ] }),
      /* @__PURE__ */ jsx39("div", { className: "flex flex-col gap-7", children: facts.map((f, i) => /* @__PURE__ */ jsx39("div", { className: "grid", style: { gridTemplateRows: "auto auto 1fr" }, children: /* @__PURE__ */ jsx39(FactCard, { ...f }) }, i)) })
    ] })
  ] });
}

// src/components/ui/contacts-section.tsx
import * as React13 from "react";

// src/components/icons/socials/vk.tsx
import { jsx as jsx40, jsxs as jsxs19 } from "react/jsx-runtime";
function VkIcon({ className, ...props }) {
  return /* @__PURE__ */ jsxs19(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      ...props,
      children: [
        /* @__PURE__ */ jsx40("rect", { x: "0.75", y: "0.75", width: "38.5", height: "38.5", rx: "4", stroke: "currentColor", strokeWidth: "1.5" }),
        /* @__PURE__ */ jsx40(
          "path",
          {
            d: "M10 14 L14.5 26 L17 26 L21.5 14",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx40(
          "path",
          {
            d: "M24 14 L24 26 M24 20.5 L30 14 M24 20.5 L30 26",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}

// src/components/icons/socials/telegram.tsx
import { jsx as jsx41, jsxs as jsxs20 } from "react/jsx-runtime";
function TelegramIcon({ className, ...props }) {
  return /* @__PURE__ */ jsxs20(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      ...props,
      children: [
        /* @__PURE__ */ jsx41("rect", { x: "0.75", y: "0.75", width: "38.5", height: "38.5", rx: "4", stroke: "currentColor", strokeWidth: "1.5" }),
        /* @__PURE__ */ jsx41(
          "path",
          {
            d: "M29.5 12.5 L10.5 20 L16.5 22.5 L19 28.5 L22.5 24.5 L27.5 28 L29.5 12.5 Z",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx41(
          "path",
          {
            d: "M16.5 22.5 L26 15.5 M19 28.5 L22.5 24.5",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}

// src/components/ui/contacts-section.tsx
import { Fragment as Fragment8, jsx as jsx42, jsxs as jsxs21 } from "react/jsx-runtime";
function SocialIcon({
  kind,
  iconSrc,
  className
}) {
  if (kind === "vk") return /* @__PURE__ */ jsx42(VkIcon, { className });
  if (kind === "telegram") return /* @__PURE__ */ jsx42(TelegramIcon, { className });
  if (!iconSrc) return null;
  return /* @__PURE__ */ jsx42(
    "span",
    {
      className: cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-sm border border-current",
        className
      ),
      children: /* @__PURE__ */ jsx42("img", { src: iconSrc, alt: "", className: "h-5 w-5 object-contain" })
    }
  );
}
function socialTooltipText(social) {
  const username = social.username || "";
  if (!username) return "";
  if (social.kind === "telegram") {
    return username.startsWith("@") ? username : `@${username}`;
  }
  if (social.kind === "vk") {
    return `vk.com/${username.replace(/^\//, "")}`;
  }
  return username;
}
function ParagraphItem({ paragraph }) {
  const color = paragraph.color === "primary" ? "text-[#0A0A0A]" : "text-[#404040]";
  const caps = paragraph.uppercase ? "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase tracking-[0.02em]" : "text-[length:var(--text-16)] leading-[1.28]";
  return /* @__PURE__ */ jsx42(
    RichText,
    {
      text: paragraph.text,
      className: cn(caps, color, "max-w-[480px]")
    }
  );
}
function SocialsItem({ socials }) {
  if (!socials.length) return null;
  return /* @__PURE__ */ jsx42(TooltipProvider, { delay: 150, children: /* @__PURE__ */ jsx42("div", { className: "flex flex-wrap items-center gap-2 text-[#0A0A0A]", children: socials.map((s) => {
    const label = socialTooltipText(s);
    const icon = /* @__PURE__ */ jsx42(
      SocialIcon,
      {
        kind: s.kind,
        iconSrc: s.iconSrc,
        className: "transition-colors group-hover/social:text-[#404040]"
      }
    );
    const trigger = s.url ? /* @__PURE__ */ jsx42(
      "a",
      {
        href: s.url,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": label || s.username,
        className: "group/social inline-flex text-[#0A0A0A] hover:text-[#404040]",
        children: icon
      }
    ) : /* @__PURE__ */ jsx42("span", { "aria-label": label || s.username, className: "group/social inline-flex", children: icon });
    if (!label) return /* @__PURE__ */ jsx42(React13.Fragment, { children: trigger }, s.id);
    return /* @__PURE__ */ jsxs21(Tooltip, { children: [
      /* @__PURE__ */ jsx42(TooltipTrigger, { render: trigger }),
      /* @__PURE__ */ jsx42(TooltipContent, { children: label })
    ] }, s.id);
  }) }) });
}
function PersonItem({ person }) {
  const socialLabel = person.social ? socialTooltipText(person.social) : "";
  return /* @__PURE__ */ jsxs21("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsx42(
      "div",
      {
        className: "h-14 w-14 shrink-0 rounded-sm bg-[#E0E0E0] bg-cover bg-center",
        style: person.avatar ? { backgroundImage: `url(${person.avatar})` } : void 0
      }
    ),
    /* @__PURE__ */ jsxs21("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
      /* @__PURE__ */ jsx42("div", { className: "text-[length:var(--text-16)] font-medium leading-[1.28] text-[#0A0A0A]", children: person.name }),
      person.role ? /* @__PURE__ */ jsx42("div", { className: "text-[length:var(--text-14)] leading-[1.32] text-[#404040]", children: person.role }) : null,
      person.phone ? /* @__PURE__ */ jsx42(
        "a",
        {
          href: `tel:${person.phone.replace(/[^+\d]/g, "")}`,
          className: "text-[length:var(--text-14)] leading-[1.32] text-[#0A0A0A] hover:text-[#404040]",
          children: person.phone
        }
      ) : null,
      person.social && (person.social.url || person.social.username) ? /* @__PURE__ */ jsx42(TooltipProvider, { delay: 150, children: /* @__PURE__ */ jsx42("div", { className: "mt-1 inline-flex text-[#0A0A0A]", children: /* @__PURE__ */ jsxs21(Tooltip, { children: [
        /* @__PURE__ */ jsx42(
          TooltipTrigger,
          {
            render: person.social.url ? /* @__PURE__ */ jsx42(
              "a",
              {
                href: person.social.url,
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": socialLabel || person.social.username,
                className: "inline-flex hover:text-[#404040]",
                children: /* @__PURE__ */ jsx42(
                  SocialIcon,
                  {
                    kind: person.social.kind,
                    iconSrc: person.social.iconSrc
                  }
                )
              }
            ) : /* @__PURE__ */ jsx42("span", { className: "inline-flex", children: /* @__PURE__ */ jsx42(
              SocialIcon,
              {
                kind: person.social.kind,
                iconSrc: person.social.iconSrc
              }
            ) })
          }
        ),
        socialLabel ? /* @__PURE__ */ jsx42(TooltipContent, { children: socialLabel }) : null
      ] }) }) }) : null
    ] })
  ] });
}
function CardItemRenderer({ item }) {
  if (item.kind === "paragraph") return /* @__PURE__ */ jsx42(ParagraphItem, { paragraph: item.paragraph });
  if (item.kind === "socials") return /* @__PURE__ */ jsx42(SocialsItem, { socials: item.socials });
  return /* @__PURE__ */ jsx42(PersonItem, { person: item.person });
}
function ContactCardView({ card }) {
  return /* @__PURE__ */ jsxs21("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsx42("div", { className: "flex items-end", children: /* @__PURE__ */ jsx42("h4", { className: "h4 text-[#0A0A0A]", children: card.title }) }),
    /* @__PURE__ */ jsx42("div", { className: "h-0 w-full border-t border-[#404040]" }),
    /* @__PURE__ */ jsx42("div", { className: "flex flex-col gap-4", children: card.items.map((item) => /* @__PURE__ */ jsx42(CardItemRenderer, { item }, item.id)) })
  ] });
}
function ContactsSection({
  tag,
  title,
  titleSecondary,
  subtitle,
  paragraphs,
  cards,
  className
}) {
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, subtitle, {
    uppercase: true,
    color: "primary"
  });
  const hasParagraphs = resolvedParagraphs.length > 0;
  const splitIndex = Math.ceil(cards.length / 2);
  const leftCards = cards.slice(0, splitIndex);
  const rightCards = cards.slice(splitIndex);
  return /* @__PURE__ */ jsxs21("section", { className: cn("w-full bg-[#F0F0F0] py-10 md:py-16 lg:py-20", className), children: [
    /* @__PURE__ */ jsxs21("div", { className: "hidden lg:flex flex-col gap-[104px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: [
      /* @__PURE__ */ jsxs21("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx42("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]", children: tag }),
        /* @__PURE__ */ jsxs21("div", { className: "flex", children: [
          /* @__PURE__ */ jsx42("div", { className: "w-1/2 shrink-0 pr-8", children: /* @__PURE__ */ jsxs21("h2", { className: "h2", children: [
            /* @__PURE__ */ jsx42("span", { className: "text-[#0A0A0A]", children: title }),
            titleSecondary ? /* @__PURE__ */ jsxs21(Fragment8, { children: [
              /* @__PURE__ */ jsx42("span", { className: "text-[#0A0A0A]", children: " " }),
              /* @__PURE__ */ jsx42("span", { className: "text-[#666666]", children: titleSecondary })
            ] }) : null
          ] }) }),
          hasParagraphs && /* @__PURE__ */ jsx42("div", { className: "w-1/2", children: /* @__PURE__ */ jsx42("div", { className: "max-w-[480px]", children: /* @__PURE__ */ jsx42(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "light", size: "18" }) }) })
        ] })
      ] }),
      cards.length > 0 && /* @__PURE__ */ jsxs21("div", { className: "flex", children: [
        /* @__PURE__ */ jsx42("div", { className: "w-1/2 flex gap-4 pr-4", children: leftCards.map((card) => /* @__PURE__ */ jsx42("div", { className: "flex-1", children: /* @__PURE__ */ jsx42(ContactCardView, { card }) }, card.id)) }),
        /* @__PURE__ */ jsx42("div", { className: "w-1/2 flex gap-4", children: rightCards.map((card) => /* @__PURE__ */ jsx42("div", { className: "flex-1", children: /* @__PURE__ */ jsx42(ContactCardView, { card }) }, card.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs21("div", { className: "flex lg:hidden flex-col gap-16 px-5 md:px-8", children: [
      /* @__PURE__ */ jsxs21("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx42("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]", children: tag }),
        /* @__PURE__ */ jsxs21("h2", { className: "h3", children: [
          /* @__PURE__ */ jsx42("span", { className: "text-[#0A0A0A]", children: title }),
          titleSecondary ? /* @__PURE__ */ jsxs21(Fragment8, { children: [
            /* @__PURE__ */ jsx42("span", { className: "text-[#0A0A0A]", children: " " }),
            /* @__PURE__ */ jsx42("span", { className: "text-[#666666]", children: titleSecondary })
          ] }) : null
        ] }),
        hasParagraphs && /* @__PURE__ */ jsx42("div", { className: "mt-1", children: /* @__PURE__ */ jsx42(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "light", size: "16" }) })
      ] }),
      /* @__PURE__ */ jsx42("div", { className: "flex flex-col gap-7", children: cards.map((card) => /* @__PURE__ */ jsx42(ContactCardView, { card }, card.id)) })
    ] })
  ] });
}

// src/components/ui/process-section.tsx
import { useEffect as useEffect6, useRef as useRef7, useState as useState2, useCallback as useCallback2 } from "react";
import { Fragment as Fragment9, jsx as jsx43, jsxs as jsxs22 } from "react/jsx-runtime";
function TimelineColumn({
  isActive,
  isLast,
  fillProgress
}) {
  return /* @__PURE__ */ jsxs22("div", { className: "relative w-px shrink-0 self-stretch", children: [
    /* @__PURE__ */ jsx43("div", { className: "absolute inset-0 bg-[#404040]" }),
    /* @__PURE__ */ jsx43(
      "div",
      {
        className: "absolute top-0 left-0 right-0 h-full origin-top bg-[#F0F0F0]",
        style: {
          transform: `scaleY(${isLast ? isActive ? 1 : 0 : fillProgress})`,
          transition: "transform 0.2s ease-out"
        }
      }
    ),
    /* @__PURE__ */ jsx43(
      "div",
      {
        className: "absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 shrink-0 transition-all duration-300",
        style: {
          backgroundColor: isActive ? "#F0F0F0" : "#0A0A0A",
          border: `2px solid ${isActive ? "#F0F0F0" : "#404040"}`
        }
      }
    )
  ] });
}
function StepCard({
  step,
  isActive,
  isLast,
  fillProgress,
  className,
  titleClass
}) {
  return /* @__PURE__ */ jsxs22("div", { className: cn("flex gap-10 max-w-[364px]", className), children: [
    /* @__PURE__ */ jsx43(TimelineColumn, { isActive, isLast, fillProgress }),
    /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-3 pb-16", children: [
      /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx43(
          "span",
          {
            className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] transition-colors duration-300",
            style: { color: isActive ? "#F0F0F0" : "#404040" },
            children: step.number
          }
        ),
        /* @__PURE__ */ jsx43(
          "h3",
          {
            className: cn(titleClass || "h3", "transition-colors duration-300"),
            style: { color: isActive ? "#F0F0F0" : "#939393" },
            children: step.title
          }
        )
      ] }),
      /* @__PURE__ */ jsx43("div", { style: { color: isActive ? "#939393" : "rgba(147,147,147,0.5)" }, children: /* @__PURE__ */ jsx43(
        RichText,
        {
          text: step.text,
          className: "text-[length:var(--text-16)] leading-[1.28] transition-colors duration-300"
        }
      ) }),
      /* @__PURE__ */ jsx43(
        "span",
        {
          className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] transition-colors duration-300",
          style: { color: isActive ? "#FFCC00" : "#939393" },
          children: step.duration
        }
      )
    ] })
  ] });
}
function ParticipantsBlock({
  tag,
  participants,
  className
}) {
  return /* @__PURE__ */ jsxs22("div", { className: cn("bg-[#121212] rounded p-8 flex flex-col gap-8 max-w-[648px]", className), children: [
    /* @__PURE__ */ jsx43("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
    /* @__PURE__ */ jsx43("div", { className: "flex flex-col gap-5", children: participants.map((p, i) => /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx43("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]", children: p.role }),
      /* @__PURE__ */ jsx43(
        RichText,
        {
          text: p.text,
          className: "text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
        }
      )
    ] }, i)) })
  ] });
}
function AcademyStepCard({
  step,
  isFirst,
  className
}) {
  return /* @__PURE__ */ jsxs22(
    "div",
    {
      className: cn(
        "flex flex-col gap-2 border-[#404040] py-5 lg:flex-row lg:items-center lg:gap-4 lg:py-8",
        isFirst ? "border-t border-b" : "border-b",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs22("div", { className: "flex items-start gap-6 lg:w-1/2 lg:items-center", children: [
          /* @__PURE__ */ jsx43("span", { className: "flex-1 h4 text-[#F0F0F0]", children: step.title }),
          /* @__PURE__ */ jsx43("span", { className: "w-[100px] shrink-0 text-right lg:text-left lg:order-first font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: step.number })
        ] }),
        /* @__PURE__ */ jsx43("div", { className: "pl-0 lg:w-1/2 lg:pl-4", children: /* @__PURE__ */ jsx43(
          RichText,
          {
            text: step.text,
            className: "text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
          }
        ) })
      ]
    }
  );
}
function useStepProgress(stepCount) {
  const [activeIndex, setActiveIndex] = useState2(-1);
  const [fills, setFills] = useState2(() => Array(stepCount).fill(0));
  const containerRef = useRef7(null);
  const update = useCallback2(() => {
    const container = containerRef.current;
    if (!container) return;
    const allStepEls = container.querySelectorAll("[data-step]");
    const stepEls = Array.from(allStepEls).filter((el) => el.offsetHeight > 0);
    if (stepEls.length === 0) return;
    const trigger = window.innerHeight * 0.45;
    let newActive = -1;
    const newFills = Array(stepCount).fill(0);
    stepEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= trigger) {
        newActive = i;
      }
      if (i < stepEls.length - 1) {
        const nextRect = stepEls[i + 1].getBoundingClientRect();
        const distance = nextRect.top - rect.top;
        if (distance > 0) {
          const progress = (trigger - rect.top) / distance;
          newFills[i] = Math.max(0, Math.min(1, progress));
        }
      }
    });
    setActiveIndex(newActive);
    setFills(newFills);
  }, [stepCount]);
  useEffect6(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [update]);
  return { activeIndex, fills, containerRef };
}
function ProcessSection({
  tag,
  title,
  titleSecondary,
  subtitle,
  subtitleUppercase = true,
  description,
  paragraphs,
  descriptionParagraphs,
  steps,
  participantsTag,
  participants,
  variant = "product",
  className
}) {
  const { activeIndex, fills, containerRef } = useStepProgress(steps.length);
  const hasParticipants = participants && participants.length > 0 && participantsTag;
  const isAcademy = variant === "academy";
  const legacyMapped = paragraphs && paragraphs.length > 0 ? void 0 : descriptionParagraphs && descriptionParagraphs.length > 0 ? descriptionParagraphs.filter((p) => p && (p.text ?? "").length > 0).map((p) => ({ text: p.text, uppercase: p.uppercase !== false, color: "secondary" })) : void 0;
  const resolvedParagraphs = resolveStyledParagraphs(
    paragraphs ?? legacyMapped,
    description,
    { uppercase: true, color: "secondary" }
  );
  const subtitleClassDesktop = subtitleUppercase ? "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]" : "text-[length:var(--text-18)] leading-[1.2] text-[#F0F0F0]";
  const subtitleClassSmall = subtitleUppercase ? "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]" : "text-[length:var(--text-16)] leading-[1.28] text-[#F0F0F0]";
  return /* @__PURE__ */ jsxs22(
    "section",
    {
      ref: containerRef,
      className: cn("w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20", className),
      children: [
        /* @__PURE__ */ jsxs22("div", { className: "hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: [
          /* @__PURE__ */ jsxs22("div", { className: "w-1/2 shrink-0 pr-8 flex flex-col", children: [
            /* @__PURE__ */ jsx43("div", { className: "flex-1 pb-10", children: /* @__PURE__ */ jsx43("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-8 max-w-[560px]", children: [
              /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx43("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
                /* @__PURE__ */ jsxs22("h2", { className: "h2", children: [
                  /* @__PURE__ */ jsx43("span", { className: "text-[#F0F0F0]", children: title }),
                  titleSecondary ? /* @__PURE__ */ jsxs22(Fragment9, { children: [
                    /* @__PURE__ */ jsx43("span", { className: "text-[#F0F0F0]", children: " " }),
                    /* @__PURE__ */ jsx43("span", { className: "text-[#939393]", children: titleSecondary })
                  ] }) : null
                ] })
              ] }),
              /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx43(RichText, { text: subtitle, className: subtitleClassDesktop }),
                /* @__PURE__ */ jsx43(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "18" })
              ] })
            ] }) }) }),
            hasParticipants && /* @__PURE__ */ jsx43("div", { className: "max-w-[648px]", children: /* @__PURE__ */ jsx43(ParticipantsBlock, { tag: participantsTag, participants }) })
          ] }),
          /* @__PURE__ */ jsx43("div", { className: "w-1/2 pt-10", children: /* @__PURE__ */ jsx43("div", { className: "flex flex-col", children: isAcademy ? steps.map((step, i) => /* @__PURE__ */ jsx43(AcademyStepCard, { step, isFirst: i === 0 }, i)) : steps.map((step, i) => /* @__PURE__ */ jsx43("div", { "data-step": true, children: /* @__PURE__ */ jsx43(
            StepCard,
            {
              step,
              isActive: i <= activeIndex,
              isLast: i === steps.length - 1,
              fillProgress: fills[i]
            }
          ) }, i)) }) })
        ] }),
        /* @__PURE__ */ jsxs22("div", { className: "hidden md:flex lg:hidden gap-10 px-8", children: [
          /* @__PURE__ */ jsxs22("div", { className: "w-[45%] shrink-0 flex flex-col", children: [
            /* @__PURE__ */ jsx43("div", { className: "flex-1 pb-10", children: /* @__PURE__ */ jsx43("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx43("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
                /* @__PURE__ */ jsxs22("h2", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em]", children: [
                  /* @__PURE__ */ jsx43("span", { className: "text-[#F0F0F0]", children: title }),
                  titleSecondary ? /* @__PURE__ */ jsxs22(Fragment9, { children: [
                    /* @__PURE__ */ jsx43("span", { className: "text-[#F0F0F0]", children: " " }),
                    /* @__PURE__ */ jsx43("span", { className: "text-[#939393]", children: titleSecondary })
                  ] }) : null
                ] })
              ] }),
              /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx43(RichText, { text: subtitle, className: subtitleClassSmall }),
                /* @__PURE__ */ jsx43(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" })
              ] })
            ] }) }) }),
            hasParticipants && /* @__PURE__ */ jsx43(
              ParticipantsBlock,
              {
                tag: participantsTag,
                participants,
                className: "p-5 max-w-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsx43("div", { className: "flex-1 pt-10", children: /* @__PURE__ */ jsx43("div", { className: "flex flex-col", children: isAcademy ? steps.map((step, i) => /* @__PURE__ */ jsx43(AcademyStepCard, { step, isFirst: i === 0, className: "lg:flex-col lg:items-start" }, i)) : steps.map((step, i) => /* @__PURE__ */ jsx43("div", { "data-step": true, children: /* @__PURE__ */ jsx43(
            StepCard,
            {
              step,
              isActive: i <= activeIndex,
              isLast: i === steps.length - 1,
              fillProgress: fills[i],
              className: "max-w-none",
              titleClass: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em]"
            }
          ) }, i)) }) })
        ] }),
        /* @__PURE__ */ jsxs22("div", { className: "flex md:hidden flex-col px-5", children: [
          /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-4 mb-10", children: [
            /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx43("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
              /* @__PURE__ */ jsxs22("h2", { className: "h3", children: [
                /* @__PURE__ */ jsx43("span", { className: "text-[#F0F0F0]", children: title }),
                titleSecondary ? /* @__PURE__ */ jsxs22(Fragment9, { children: [
                  /* @__PURE__ */ jsx43("span", { className: "text-[#F0F0F0]", children: " " }),
                  /* @__PURE__ */ jsx43("span", { className: "text-[#939393]", children: titleSecondary })
                ] }) : null
              ] })
            ] }),
            /* @__PURE__ */ jsxs22("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx43(RichText, { text: subtitle, className: subtitleClassSmall }),
              /* @__PURE__ */ jsx43(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" })
            ] })
          ] }),
          /* @__PURE__ */ jsx43("div", { className: "flex flex-col", children: isAcademy ? steps.map((step, i) => /* @__PURE__ */ jsx43(AcademyStepCard, { step, isFirst: i === 0 }, i)) : steps.map((step, i) => /* @__PURE__ */ jsx43("div", { "data-step": true, children: /* @__PURE__ */ jsx43(
            StepCard,
            {
              step,
              isActive: i <= activeIndex,
              isLast: i === steps.length - 1,
              fillProgress: fills[i]
            }
          ) }, i)) }),
          hasParticipants && /* @__PURE__ */ jsx43("div", { className: "mt-4", children: /* @__PURE__ */ jsx43(ParticipantsBlock, { tag: participantsTag, participants }) })
        ] })
      ]
    }
  );
}

// src/components/ui/results-section.tsx
import { useEffect as useEffect7, useRef as useRef8, useState as useState3, useCallback as useCallback3 } from "react";
import { Fragment as Fragment10, jsx as jsx44, jsxs as jsxs23 } from "react/jsx-runtime";
var STEP_OFFSET = 88;
var STAGGER = 0.18;
var CARD_DURATION = 0.25;
function useResultsScroll(cardCount) {
  const [progresses, setProgresses] = useState3(() => {
    const arr = Array(cardCount).fill(0);
    arr[0] = 1;
    return arr;
  });
  const sectionRef = useRef8(null);
  const update = useCallback3(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const trigger = window.innerHeight * 0.45;
    const scrollProgress = Math.max(
      0,
      Math.min(1, (trigger - rect.top) / rect.height)
    );
    const newProgresses = [];
    for (let i = 0; i < cardCount; i++) {
      if (i === 0) {
        newProgresses.push(1);
        continue;
      }
      const start = (i - 1) * STAGGER;
      const p = Math.max(0, Math.min(1, (scrollProgress - start) / CARD_DURATION));
      newProgresses.push(p);
    }
    setProgresses(newProgresses);
  }, [cardCount]);
  useEffect7(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [update]);
  return { progresses, sectionRef };
}
function ResultsSection({
  tag,
  title,
  titleSecondary,
  description,
  paragraphs,
  cards,
  className
}) {
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: false,
    color: "secondary"
  });
  const hasParagraphs = resolvedParagraphs.length > 0;
  const { progresses, sectionRef } = useResultsScroll(cards.length);
  const contentHeight = STEP_OFFSET * (cards.length - 1) + 240;
  let currentIndex = 0;
  for (let j = cards.length - 1; j >= 0; j--) {
    if (progresses[j] >= 1) {
      currentIndex = j;
      break;
    }
  }
  return /* @__PURE__ */ jsxs23(
    "section",
    {
      ref: sectionRef,
      className: cn("w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20", className),
      children: [
        /* @__PURE__ */ jsx44("div", { className: "hidden lg:block mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: /* @__PURE__ */ jsxs23("div", { className: "relative", style: { minHeight: `${contentHeight}px` }, children: [
          /* @__PURE__ */ jsxs23("div", { className: "flex flex-col gap-2 max-w-[560px]", children: [
            /* @__PURE__ */ jsx44("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
            /* @__PURE__ */ jsxs23("div", { className: "flex flex-col gap-6", children: [
              /* @__PURE__ */ jsxs23("h2", { className: "h2", children: [
                /* @__PURE__ */ jsx44("span", { className: "text-[#F0F0F0]", children: title }),
                titleSecondary ? /* @__PURE__ */ jsxs23(Fragment10, { children: [
                  /* @__PURE__ */ jsx44("span", { className: "text-[#F0F0F0]", children: " " }),
                  /* @__PURE__ */ jsx44("span", { className: "text-[#939393]", children: titleSecondary })
                ] }) : null
              ] }),
              hasParagraphs && /* @__PURE__ */ jsx44(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "18" })
            ] })
          ] }),
          /* @__PURE__ */ jsx44("div", { className: "absolute bottom-0 left-0 right-0 flex", children: cards.map((card, i) => {
            const progress = progresses[i];
            const offset = i === 0 ? 0 : -i * STEP_OFFSET * (1 - progress);
            const isCurrent = i === currentIndex;
            const isPast = progress >= 1 && !isCurrent;
            return /* @__PURE__ */ jsx44(
              "div",
              {
                className: "flex-1",
                style: { transform: `translateY(${offset}px)` },
                children: /* @__PURE__ */ jsxs23(
                  "div",
                  {
                    className: cn(
                      "flex flex-col justify-between p-8 h-[240px] border transition-colors duration-300",
                      isCurrent ? "bg-[#FFCC00] border-[#FFCC00]" : "border-[#404040]"
                    ),
                    children: [
                      /* @__PURE__ */ jsx44(
                        "h3",
                        {
                          className: cn(
                            "font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] transition-colors duration-300",
                            isCurrent ? "text-[#0A0A0A]" : isPast ? "text-[#FFCC00]" : "text-[#F0F0F0]"
                          ),
                          children: card.title
                        }
                      ),
                      /* @__PURE__ */ jsx44(
                        RichText,
                        {
                          text: card.text,
                          className: cn(
                            "text-[length:var(--text-16)] leading-[1.28] transition-colors duration-300",
                            isCurrent ? "text-[#0A0A0A]" : "text-[#939393]"
                          )
                        }
                      )
                    ]
                  }
                )
              },
              i
            );
          }) })
        ] }) }),
        /* @__PURE__ */ jsxs23("div", { className: "hidden md:flex lg:hidden flex-col px-8", children: [
          /* @__PURE__ */ jsxs23("div", { className: "flex flex-col gap-2 mb-6", children: [
            /* @__PURE__ */ jsx44("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
            /* @__PURE__ */ jsxs23("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxs23("h2", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em]", children: [
                /* @__PURE__ */ jsx44("span", { className: "text-[#F0F0F0]", children: title }),
                titleSecondary ? /* @__PURE__ */ jsxs23(Fragment10, { children: [
                  /* @__PURE__ */ jsx44("span", { className: "text-[#F0F0F0]", children: " " }),
                  /* @__PURE__ */ jsx44("span", { className: "text-[#939393]", children: titleSecondary })
                ] }) : null
              ] }),
              hasParagraphs && /* @__PURE__ */ jsx44(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" })
            ] })
          ] }),
          /* @__PURE__ */ jsx44("div", { className: "grid grid-cols-2 gap-2", children: cards.map((card, i) => /* @__PURE__ */ jsxs23(
            "div",
            {
              className: "bg-[#FFCC00] flex flex-col justify-between p-5 h-[240px]",
              children: [
                /* @__PURE__ */ jsx44("h3", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]", children: card.title }),
                /* @__PURE__ */ jsx44(
                  RichText,
                  {
                    text: card.text,
                    className: "text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]"
                  }
                )
              ]
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs23("div", { className: "flex md:hidden flex-col px-5", children: [
          /* @__PURE__ */ jsxs23("div", { className: "flex flex-col gap-2 mb-6", children: [
            /* @__PURE__ */ jsx44("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
            /* @__PURE__ */ jsxs23("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxs23("h2", { className: "h3", children: [
                /* @__PURE__ */ jsx44("span", { className: "text-[#F0F0F0]", children: title }),
                titleSecondary ? /* @__PURE__ */ jsxs23(Fragment10, { children: [
                  /* @__PURE__ */ jsx44("span", { className: "text-[#F0F0F0]", children: " " }),
                  /* @__PURE__ */ jsx44("span", { className: "text-[#939393]", children: titleSecondary })
                ] }) : null
              ] }),
              hasParagraphs && /* @__PURE__ */ jsx44(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" })
            ] })
          ] }),
          /* @__PURE__ */ jsx44(
            "div",
            {
              className: "overflow-x-auto -mx-5",
              style: { scrollbarWidth: "none" },
              children: /* @__PURE__ */ jsx44("div", { className: "px-5 w-fit", children: /* @__PURE__ */ jsx44(
                "div",
                {
                  className: "grid grid-rows-2 gap-2",
                  style: {
                    gridTemplateColumns: `repeat(${Math.ceil(cards.length / 2)}, 350px)`
                  },
                  children: cards.map((card, i) => /* @__PURE__ */ jsxs23(
                    "div",
                    {
                      className: "bg-[#FFCC00] flex flex-col justify-between p-5 h-[240px]",
                      children: [
                        /* @__PURE__ */ jsx44("h3", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]", children: card.title }),
                        /* @__PURE__ */ jsx44("p", { className: "text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]", children: card.text })
                      ]
                    },
                    i
                  ))
                }
              ) })
            }
          )
        ] })
      ]
    }
  );
}

// src/components/ui/services-section.tsx
import { Fragment as Fragment11, jsx as jsx45, jsxs as jsxs24 } from "react/jsx-runtime";
function Arrow({ featured }) {
  return /* @__PURE__ */ jsx45(
    "div",
    {
      className: cn(
        "absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] transition-all duration-200",
        featured ? "text-[#0A0A0A] group-hover/card:text-[#F0F0F0]" : "text-[#404040] group-hover/card:text-[#0A0A0A]",
        "group-hover/card:-top-[2px] group-hover/card:-right-[2px]"
      ),
      children: /* @__PURE__ */ jsx45("svg", { width: "11", height: "11", viewBox: "0 0 11 11", fill: "none", children: /* @__PURE__ */ jsx45("path", { d: "M1 10L10 1M10 1H3M10 1V8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
    }
  );
}
function ServiceCard({ card }) {
  const colSpan = card.colSpan ?? 1;
  const rowSpan = card.rowSpan ?? 1;
  const featured = card.featured === true;
  const rootCn = cn(
    "group/card relative flex flex-col gap-5 p-6 md:p-8 h-full -ml-px -mt-px",
    "transition-colors duration-150",
    featured ? "z-10 bg-[var(--rm-yellow-100)] border border-[var(--rm-yellow-100)] hover:bg-[#0A0A0A] hover:border-[#404040]" : "bg-[#0A0A0A] border border-[#404040] hover:z-10 hover:bg-[var(--rm-yellow-100)] hover:border-[var(--rm-yellow-100)]",
    colSpan === 2 && "md:col-span-2",
    rowSpan === 2 && "lg:row-span-2"
  );
  const content = /* @__PURE__ */ jsxs24(Fragment11, { children: [
    !featured && /* @__PURE__ */ jsx45(GlowingEffect, { spread: 40, glow: false, disabled: false, proximity: 40, inactiveZone: 0.01, borderWidth: 1, variant: "yellow" }),
    card.showArrow !== false && /* @__PURE__ */ jsx45(Arrow, { featured }),
    /* @__PURE__ */ jsx45(
      "h3",
      {
        className: cn(
          "font-[family-name:var(--font-heading-family)] text-[24px] md:text-[28px] font-bold uppercase leading-[1.16] tracking-[-0.01em] transition-colors duration-150 pr-8",
          featured ? "text-[#0A0A0A] group-hover/card:text-[#F0F0F0]" : "text-[#F0F0F0] group-hover/card:text-[#0A0A0A]"
        ),
        children: card.title || "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0441\u043B\u0443\u0433\u0438"
      }
    ),
    /* @__PURE__ */ jsx45(
      "div",
      {
        className: cn(
          "gap-3 md:gap-x-10",
          card.paragraphsTwoCol && colSpan === 2 ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
        ),
        children: (card.paragraphs.length > 0 ? card.paragraphs : [""]).map((p, i) => /* @__PURE__ */ jsx45(
          "p",
          {
            className: cn(
              "text-[14px] md:text-[15px] leading-[1.4] transition-colors duration-150",
              featured ? "text-[#0A0A0A] group-hover/card:text-[#939393]" : "text-[#939393] group-hover/card:text-[#0A0A0A]"
            ),
            children: p || "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0443\u0441\u043B\u0443\u0433\u0438"
          },
          i
        ))
      }
    )
  ] });
  if (card.href) {
    return /* @__PURE__ */ jsx45("a", { href: card.href, className: rootCn, children: content });
  }
  return /* @__PURE__ */ jsx45("div", { className: rootCn, children: content });
}
function ServicesSection({
  tag,
  title,
  titleSecondary,
  description,
  paragraphs,
  cards,
  className
}) {
  if (!cards || cards.length === 0) return null;
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: false,
    color: "secondary"
  });
  const hasParagraphs = resolvedParagraphs.length > 0;
  return /* @__PURE__ */ jsx45("section", { className: cn("w-full border-t border-[#404040] bg-[#0A0A0A] py-10 md:py-16 lg:py-20", className), children: /* @__PURE__ */ jsxs24("div", { className: "mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: [
    /* @__PURE__ */ jsxs24("div", { className: "mb-8 md:mb-12 flex flex-col gap-4 lg:flex-row lg:gap-10", children: [
      /* @__PURE__ */ jsxs24("div", { className: "flex flex-col gap-4 lg:w-1/2", children: [
        tag && /* @__PURE__ */ jsx45("span", { className: "font-[family-name:var(--font-mono-family)] text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[var(--rm-yellow-100)]", children: tag }),
        /* @__PURE__ */ jsxs24("h2", { className: "font-[family-name:var(--font-heading-family)] text-[28px] md:text-[36px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]", children: [
          /* @__PURE__ */ jsx45("span", { className: "text-[#F0F0F0]", children: title }),
          titleSecondary ? /* @__PURE__ */ jsxs24(Fragment11, { children: [
            /* @__PURE__ */ jsx45("span", { className: "text-[#F0F0F0]", children: " " }),
            /* @__PURE__ */ jsx45("span", { className: "text-[#939393]", children: titleSecondary })
          ] }) : null
        ] })
      ] }),
      hasParagraphs && /* @__PURE__ */ jsx45("div", { className: "lg:w-1/2 lg:flex lg:items-end", children: /* @__PURE__ */ jsx45(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" }) })
    ] }),
    /* @__PURE__ */ jsx45("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 auto-rows-[minmax(260px,auto)]", children: cards.map((card, i) => /* @__PURE__ */ jsx45(ServiceCard, { card }, i)) })
  ] }) });
}
function repackBento(cards) {
  const scored = cards.map((c) => {
    const textLen = c.paragraphs.reduce((n, p) => n + (p?.length || 0), 0) + (c.title?.length || 0);
    let size;
    if (textLen > 260) size = { colSpan: 2, rowSpan: 2 };
    else if (textLen > 140) size = { colSpan: 2, rowSpan: 1 };
    else if (textLen > 60) size = { colSpan: 1, rowSpan: 2 };
    else size = { colSpan: 1, rowSpan: 1 };
    return { ...c, ...size, _score: textLen };
  });
  scored.sort((a, b) => b._score - a._score);
  return scored.map(({ _score: _s, ...c }) => c);
}

// src/components/ui/experts-section.tsx
import { jsx as jsx46, jsxs as jsxs25 } from "react/jsx-runtime";
function CirclePattern({ className }) {
  return /* @__PURE__ */ jsxs25(
    "svg",
    {
      viewBox: "0 0 698 349",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      preserveAspectRatio: "xMidYMid meet",
      children: [
        /* @__PURE__ */ jsx46("circle", { cx: "137.5", cy: "104.5", r: "88", stroke: "#404040" }),
        /* @__PURE__ */ jsx46("circle", { cx: "277.5", cy: "104.5", r: "88", stroke: "#404040" }),
        /* @__PURE__ */ jsx46("circle", { cx: "417.5", cy: "104.5", r: "88", stroke: "#404040" }),
        /* @__PURE__ */ jsx46("circle", { cx: "557.5", cy: "104.5", r: "88", stroke: "#404040" }),
        /* @__PURE__ */ jsx46("circle", { cx: "137.5", cy: "244.5", r: "88", stroke: "#404040" }),
        /* @__PURE__ */ jsx46("circle", { cx: "417.5", cy: "244.5", r: "88", stroke: "#404040" }),
        /* @__PURE__ */ jsx46("circle", { cx: "277.5", cy: "244.5", r: "88", stroke: "#404040" }),
        /* @__PURE__ */ jsx46("circle", { cx: "557.5", cy: "244.5", r: "88", stroke: "#404040" })
      ]
    }
  );
}
function ExpertCardHorizontal({ expert }) {
  return /* @__PURE__ */ jsxs25("div", { className: "flex bg-[#121212] p-8 gap-8 h-[349px]", children: [
    /* @__PURE__ */ jsx46(
      "div",
      {
        className: "w-full h-full shrink-0 bg-cover bg-center",
        style: {
          backgroundImage: `url(${expert.image})`,
          flex: "1 1 0"
        }
      }
    ),
    /* @__PURE__ */ jsxs25("div", { className: "flex flex-col gap-2 flex-1", children: [
      /* @__PURE__ */ jsx46("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: expert.tag ?? "\u042D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430" }),
      /* @__PURE__ */ jsxs25("div", { className: "flex flex-col gap-6 flex-1", children: [
        /* @__PURE__ */ jsx46("h3", { className: "h3 text-[#F0F0F0]", children: expert.name }),
        /* @__PURE__ */ jsx46("div", { className: "flex-1 flex items-end", children: /* @__PURE__ */ jsx46(
          RichText,
          {
            text: expert.bio,
            className: "text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]"
          }
        ) })
      ] })
    ] })
  ] });
}
function ExpertCardVertical({ expert }) {
  return /* @__PURE__ */ jsxs25("div", { className: "flex flex-col bg-[#121212] p-5 gap-8", children: [
    /* @__PURE__ */ jsx46(
      "div",
      {
        className: "w-full h-[272px] bg-cover bg-center",
        style: { backgroundImage: `url(${expert.image})` }
      }
    ),
    /* @__PURE__ */ jsxs25("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx46("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: expert.tag ?? "\u042D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430" }),
      /* @__PURE__ */ jsxs25("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx46("h3", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]", children: expert.name }),
        /* @__PURE__ */ jsx46(
          RichText,
          {
            text: expert.bio,
            className: "text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
          }
        )
      ] })
    ] })
  ] });
}
function ExpertsSection({
  experts,
  className
}) {
  if (experts.length === 0) return null;
  const isOdd = experts.length % 2 !== 0;
  return /* @__PURE__ */ jsxs25(
    "section",
    {
      className: cn(
        "w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20",
        className
      ),
      children: [
        /* @__PURE__ */ jsx46("div", { className: "hidden lg:block mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: /* @__PURE__ */ jsxs25("div", { className: "grid grid-cols-2 gap-1", children: [
          experts.map((expert, i) => /* @__PURE__ */ jsx46(ExpertCardHorizontal, { expert }, i)),
          isOdd && /* @__PURE__ */ jsx46("div", { className: "flex items-center justify-center h-[349px] p-4", children: /* @__PURE__ */ jsx46(CirclePattern, { className: "w-full h-full" }) })
        ] }) }),
        /* @__PURE__ */ jsx46("div", { className: "hidden md:block lg:hidden px-8", children: /* @__PURE__ */ jsx46("div", { className: "flex flex-col gap-1", children: experts.map((expert, i) => /* @__PURE__ */ jsx46(ExpertCardHorizontal, { expert }, i)) }) }),
        /* @__PURE__ */ jsx46("div", { className: "block md:hidden px-5", children: /* @__PURE__ */ jsx46("div", { className: "flex flex-col gap-1", children: experts.map((expert, i) => /* @__PURE__ */ jsx46(ExpertCardVertical, { expert }, i)) }) })
      ]
    }
  );
}

// src/components/ui/hero-experts.tsx
import { useState as useState4, useRef as useRef9, useEffect as useEffect8, useCallback as useCallback4 } from "react";
import { jsx as jsx47, jsxs as jsxs26 } from "react/jsx-runtime";
var AVATAR_SIZE = 80;
var AVATAR_OVERLAP = 16;
var EFFECTIVE_WIDTH = AVATAR_SIZE - AVATAR_OVERLAP;
var COLLAPSE_MS = 180;
function Avatar2({
  expert,
  overlap = false,
  lifted = false,
  zIndex,
  onHover,
  onLeave
}) {
  return /* @__PURE__ */ jsx47(
    "div",
    {
      onMouseEnter: onHover,
      onMouseLeave: onLeave,
      onClick: onHover,
      className: `relative shrink-0 rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center cursor-pointer transition-transform duration-200 ease-out ${overlap ? "-ml-4 first:ml-0" : ""} ${lifted ? "-translate-y-2.5" : ""}`,
      style: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        zIndex,
        backgroundImage: expert.image ? `url(${expert.image})` : void 0
      },
      "aria-label": expert.name,
      children: !expert.image && /* @__PURE__ */ jsx47("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsx47("span", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold text-[#F0F0F0]", children: expert.name.slice(0, 1) }) })
    }
  );
}
function SingleExpert({ expert, quote }) {
  return /* @__PURE__ */ jsxs26("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs26("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx47(
        "div",
        {
          className: "relative shrink-0 rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center",
          style: {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            backgroundImage: expert.image ? `url(${expert.image})` : void 0
          },
          children: !expert.image && /* @__PURE__ */ jsx47("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsx47("span", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold text-[#F0F0F0]", children: expert.name.slice(0, 1) }) })
        }
      ),
      /* @__PURE__ */ jsxs26("div", { className: "flex flex-col justify-center gap-1", children: [
        /* @__PURE__ */ jsx47("span", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]", children: expert.name }),
        expert.tag && /* @__PURE__ */ jsx47("span", { className: "text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]", children: expert.tag })
      ] })
    ] }),
    quote && /* @__PURE__ */ jsx47("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]", children: quote })
  ] });
}
function MultiExperts({
  experts,
  quote,
  maxVisible
}) {
  const containerRef = useRef9(null);
  const containerWidthRef = useRef9(0);
  const [containerWidth, setContainerWidth] = useState4(0);
  const [dynamicMax, setDynamicMax] = useState4(maxVisible);
  const [activeIndex, setActiveIndex] = useState4(null);
  const [tipVisible, setTipVisible] = useState4(false);
  const [tipLeft, setTipLeft] = useState4(0);
  const [tipFlipped, setTipFlipped] = useState4(false);
  const [tipContent, setTipContent] = useState4(null);
  const pendingRef = useRef9(null);
  const timerRef = useRef9(null);
  useEffect8(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      containerWidthRef.current = w;
      setContainerWidth(w);
      const n = Math.max(1, Math.floor((w - AVATAR_OVERLAP) / EFFECTIVE_WIDTH));
      setDynamicMax(n);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect8(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  const effectiveMax = Math.min(dynamicMax, maxVisible);
  const visible = experts.slice(0, effectiveMax);
  const computeLeft = useCallback4(
    (i) => i * EFFECTIVE_WIDTH + AVATAR_SIZE / 2,
    []
  );
  const computeFlipped = useCallback4(
    (left) => left > containerWidthRef.current / 2,
    []
  );
  const showTip = (left, flipped, content) => {
    setTipLeft(left);
    setTipFlipped(flipped);
    setTipContent(content);
    setTipVisible(true);
  };
  const handleHover = (index, expert) => {
    setActiveIndex(index);
    const left = computeLeft(index);
    const flipped = computeFlipped(left);
    if (timerRef.current) {
      pendingRef.current = { left, flipped, content: expert };
      return;
    }
    if (tipVisible) {
      pendingRef.current = { left, flipped, content: expert };
      setTipVisible(false);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        if (pendingRef.current) {
          const p = pendingRef.current;
          pendingRef.current = null;
          showTip(p.left, p.flipped, p.content);
        }
      }, COLLAPSE_MS);
    } else {
      showTip(left, flipped, expert);
    }
  };
  const handleLeave = (index) => {
    setActiveIndex((prev) => prev === index ? null : prev);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingRef.current = null;
    setTipVisible(false);
  };
  return /* @__PURE__ */ jsxs26("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs26("div", { className: "relative w-full", ref: containerRef, children: [
      /* @__PURE__ */ jsx47(
        "div",
        {
          className: "pointer-events-none absolute z-50 bottom-full mb-3",
          style: {
            left: tipLeft,
            transform: tipFlipped ? "translateX(-100%)" : "translateX(0)"
          },
          children: /* @__PURE__ */ jsx47(
            "div",
            {
              className: `w-max bg-[#121212] px-5 py-4 will-change-[opacity,transform] ${tipFlipped ? "border-r" : "border-l"} border-[#F0F0F0]`,
              style: {
                // Clamp to available space so tooltip never overflows the container edge
                maxWidth: containerWidth > 0 ? Math.min(600, tipFlipped ? tipLeft : containerWidth - tipLeft) : 600,
                opacity: tipVisible ? 1 : 0,
                transform: tipVisible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity ${COLLAPSE_MS}ms ease-out, transform ${COLLAPSE_MS}ms ease-out`
              },
              children: tipContent && /* @__PURE__ */ jsxs26("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx47("span", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]", children: tipContent.name }),
                tipContent.tag && /* @__PURE__ */ jsx47("span", { className: "text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]", children: tipContent.tag })
              ] })
            }
          )
        }
      ),
      /* @__PURE__ */ jsx47("div", { className: "flex items-center", children: visible.map((expert, i) => /* @__PURE__ */ jsx47(
        Avatar2,
        {
          expert,
          overlap: i > 0,
          lifted: activeIndex === i,
          zIndex: activeIndex === i ? visible.length + 10 : visible.length - i,
          onHover: () => handleHover(i, expert),
          onLeave: () => handleLeave(i)
        },
        `${expert.name}-${i}`
      )) })
    ] }),
    quote && /* @__PURE__ */ jsx47("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]", children: quote })
  ] });
}
function HeroExperts({
  experts,
  quote,
  maxVisible = 20,
  className
}) {
  if (experts.length === 0) return null;
  return /* @__PURE__ */ jsx47("div", { className, children: experts.length === 1 ? /* @__PURE__ */ jsx47(SingleExpert, { expert: experts[0], quote }) : /* @__PURE__ */ jsx47(MultiExperts, { experts, quote, maxVisible }) });
}

// src/components/ui/tools-section.tsx
import { Fragment as Fragment12, jsx as jsx48, jsxs as jsxs27 } from "react/jsx-runtime";
function ToolCardItem({
  tool,
  useIcons
}) {
  return /* @__PURE__ */ jsxs27("div", { className: "flex flex-col gap-4 h-full", children: [
    /* @__PURE__ */ jsx48("div", { className: "flex items-end", children: useIcons && tool.icon ? /* @__PURE__ */ jsx48(
      "div",
      {
        className: "h-[86px] w-[86px] bg-contain bg-center bg-no-repeat",
        style: { backgroundImage: `url(${tool.icon})` }
      }
    ) : /* @__PURE__ */ jsx48("span", { className: "font-[family-name:var(--font-mono-family)] text-[80px] font-medium leading-[1.08] tracking-[0.02em] text-transparent [-webkit-text-stroke:1px_#404040]", children: tool.number }) }),
    /* @__PURE__ */ jsx48("h4", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]", children: tool.title }),
    /* @__PURE__ */ jsx48(
      RichText,
      {
        text: tool.text,
        className: "text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
      }
    )
  ] });
}
function ToolsSection({
  tag,
  title,
  titleSecondary,
  description,
  paragraphs,
  tools,
  useIcons,
  descriptionBelow,
  className
}) {
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: true,
    color: "secondary"
  });
  const hasParagraphs = resolvedParagraphs.length > 0;
  return /* @__PURE__ */ jsxs27(
    "section",
    {
      className: cn(
        "w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs27("div", { className: "hidden lg:flex flex-col gap-[88px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: [
          descriptionBelow ? /* @__PURE__ */ jsxs27("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs27("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx48("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
              /* @__PURE__ */ jsxs27("h2", { className: "h2", children: [
                /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: title }),
                titleSecondary ? /* @__PURE__ */ jsxs27(Fragment12, { children: [
                  /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: " " }),
                  /* @__PURE__ */ jsx48("span", { className: "text-[#939393]", children: titleSecondary })
                ] }) : null
              ] })
            ] }),
            hasParagraphs && /* @__PURE__ */ jsx48("div", { className: "max-w-[668px]", children: /* @__PURE__ */ jsx48(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "18" }) })
          ] }) : /* @__PURE__ */ jsxs27("div", { className: "flex", children: [
            /* @__PURE__ */ jsxs27("div", { className: "w-1/2 shrink-0 pr-8 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx48("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
              /* @__PURE__ */ jsxs27("h2", { className: "h2", children: [
                /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: title }),
                titleSecondary ? /* @__PURE__ */ jsxs27(Fragment12, { children: [
                  /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: " " }),
                  /* @__PURE__ */ jsx48("span", { className: "text-[#939393]", children: titleSecondary })
                ] }) : null
              ] })
            ] }),
            hasParagraphs && /* @__PURE__ */ jsx48("div", { className: "w-1/2 flex items-end", children: /* @__PURE__ */ jsx48("div", { className: "max-w-[668px]", children: /* @__PURE__ */ jsx48(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "18" }) }) })
          ] }),
          (() => {
            const totalUnits = tools.reduce((sum, t) => sum + (t.wide ? 2 : 1), 0);
            let col = 1;
            return /* @__PURE__ */ jsx48(
              "div",
              {
                className: "grid",
                style: { gridTemplateColumns: `repeat(${totalUnits}, 1fr)` },
                children: tools.map((tool, i) => {
                  const span = tool.wide ? 2 : 1;
                  const start = col;
                  col += span;
                  return /* @__PURE__ */ jsx48(
                    "div",
                    {
                      className: "border border-[#404040] p-8",
                      style: { gridColumn: `${start} / span ${span}` },
                      children: /* @__PURE__ */ jsx48(ToolCardItem, { tool, useIcons })
                    },
                    i
                  );
                })
              }
            );
          })()
        ] }),
        /* @__PURE__ */ jsxs27("div", { className: "hidden md:flex lg:hidden flex-col gap-10 px-8", children: [
          /* @__PURE__ */ jsxs27("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx48("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
            /* @__PURE__ */ jsxs27("h2", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em]", children: [
              /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: title }),
              titleSecondary ? /* @__PURE__ */ jsxs27(Fragment12, { children: [
                /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: " " }),
                /* @__PURE__ */ jsx48("span", { className: "text-[#939393]", children: titleSecondary })
              ] }) : null
            ] }),
            hasParagraphs && /* @__PURE__ */ jsx48("div", { className: "mt-2", children: /* @__PURE__ */ jsx48(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" }) })
          ] }),
          /* @__PURE__ */ jsx48("div", { className: "grid grid-cols-2 gap-px bg-[#404040]", children: tools.map((tool, i) => /* @__PURE__ */ jsx48("div", { className: "bg-[#0A0A0A] p-8", children: /* @__PURE__ */ jsx48(ToolCardItem, { tool, useIcons }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxs27("div", { className: "flex md:hidden flex-col gap-8 px-5", children: [
          /* @__PURE__ */ jsxs27("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx48("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
            /* @__PURE__ */ jsxs27("h2", { className: "h3", children: [
              /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: title }),
              titleSecondary ? /* @__PURE__ */ jsxs27(Fragment12, { children: [
                /* @__PURE__ */ jsx48("span", { className: "text-[#F0F0F0]", children: " " }),
                /* @__PURE__ */ jsx48("span", { className: "text-[#939393]", children: titleSecondary })
              ] }) : null
            ] }),
            hasParagraphs && /* @__PURE__ */ jsx48(StyledParagraphs, { paragraphs: resolvedParagraphs, theme: "dark", size: "16" })
          ] }),
          /* @__PURE__ */ jsx48("div", { className: "flex flex-col", children: tools.map((tool, i) => /* @__PURE__ */ jsx48("div", { className: "border border-[#404040] p-6", children: /* @__PURE__ */ jsx48(ToolCardItem, { tool, useIcons }) }, i)) })
        ] })
      ]
    }
  );
}

// src/components/ui/accordion-faq.tsx
import { Accordion } from "@base-ui/react";
import { jsx as jsx49, jsxs as jsxs28 } from "react/jsx-runtime";
var DEFAULT_ITEMS = [
  { id: "1", q: "\u0427\u0442\u043E \u0442\u0430\u043A\u043E\u0435 Rocketmind?", a: "Rocketmind \u2014 SaaS-\u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0441 \u0433\u043E\u0442\u043E\u0432\u044B\u043C\u0438 AI-\u0430\u0433\u0435\u043D\u0442\u0430\u043C\u0438 \u0434\u043B\u044F \u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043A\u0435\u0439\u0441\u043E\u0432. \u041A\u0430\u0436\u0434\u044B\u0439 \u0430\u0433\u0435\u043D\u0442 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043D\u0430 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0439 \u0437\u0430\u0434\u0430\u0447\u0435: \u0430\u043D\u0430\u043B\u0438\u0437, \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F, \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u0440\u044B\u043D\u043A\u0430, \u0442\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0433\u0438\u043F\u043E\u0442\u0435\u0437." },
  { id: "2", q: "\u041A\u0430\u043A \u043D\u0430\u0447\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443?", a: "\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 /a/{agent_slug}, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 email \u2014 \u0438 \u0441\u0440\u0430\u0437\u0443 \u043D\u0430\u0447\u0438\u043D\u0430\u0439\u0442\u0435 \u0434\u0438\u0430\u043B\u043E\u0433. \u041D\u0438\u043A\u0430\u043A\u0438\u0445 \u0434\u043E\u043B\u0433\u0438\u0445 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0439 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A." },
  { id: "3", q: "\u0427\u0442\u043E \u0443\u043C\u0435\u044E\u0442 \u0430\u0433\u0435\u043D\u0442\u044B?", a: "\u0410\u0433\u0435\u043D\u0442\u044B \u0432\u0435\u0434\u0443\u0442 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0434\u0438\u0430\u043B\u043E\u0433, \u0437\u0430\u0434\u0430\u044E\u0442 \u0443\u0442\u043E\u0447\u043D\u044F\u044E\u0449\u0438\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u0438 \u0432 \u043A\u043E\u043D\u0446\u0435 \u0444\u043E\u0440\u043C\u0438\u0440\u0443\u044E\u0442 \u0433\u043E\u0442\u043E\u0432\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442: \u043E\u0442\u0447\u0451\u0442, \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044E \u0438\u043B\u0438 \u0441\u0441\u044B\u043B\u043A\u0443 \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0448\u0430\u0433." },
  { id: "4", q: "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B \u043B\u0438 \u043C\u043E\u0438 \u0434\u0430\u043D\u043D\u044B\u0435?", a: "\u0412\u0441\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0437\u0430\u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u044B \u0438 \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u0438\u0437\u043E\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E. \u0410\u0433\u0435\u043D\u0442 \u0432\u0438\u0434\u0438\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0432\u0430\u0448\u0435\u0433\u043E \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u043A\u0435\u0439\u0441\u0430 \u2014 \u043D\u0438\u0447\u0435\u0433\u043E \u0431\u043E\u043B\u044C\u0448\u0435." },
  { id: "5", q: "\u041A\u0430\u043A\u0438\u0435 \u0442\u0430\u0440\u0438\u0444\u044B?", a: "\u041F\u0435\u0440\u0432\u044B\u0439 \u043A\u0435\u0439\u0441 \u2014 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E. \u0414\u0430\u043B\u0435\u0435 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043E\u0442 990 \u20BD/\u043C\u0435\u0441, \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442 \u043D\u0435\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u044B\u0435 \u0434\u0438\u0430\u043B\u043E\u0433\u0438 \u0441 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u043C\u0438 \u0430\u0433\u0435\u043D\u0442\u0430\u043C\u0438." }
];
function AccordionFAQ({
  items = DEFAULT_ITEMS,
  defaultOpen = ["3"],
  className
}) {
  return /* @__PURE__ */ jsx49("div", { className: cn("w-full max-w-3xl", className), children: /* @__PURE__ */ jsx49(Accordion.Root, { defaultValue: defaultOpen, className: "w-full", children: items.map((item) => /* @__PURE__ */ jsxs28(
    Accordion.Item,
    {
      value: item.id,
      className: "border-b border-border",
      children: [
        /* @__PURE__ */ jsx49(Accordion.Header, { children: /* @__PURE__ */ jsxs28(Accordion.Trigger, { className: "w-full text-left py-5 pl-6 md:pl-14 flex items-start gap-4 cursor-pointer text-foreground/20 transition-colors duration-200 data-[panel-open]:text-primary hover:text-foreground/50", children: [
          /* @__PURE__ */ jsx49("span", { className: "text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] mt-2 shrink-0 tabular-nums", children: item.id }),
          /* @__PURE__ */ jsx49("span", { className: "font-[family-name:var(--font-heading-family)] font-bold uppercase text-3xl md:text-[length:var(--text-52)] leading-none tracking-[-0.02em]", children: item.q })
        ] }) }),
        /* @__PURE__ */ jsx49(Accordion.Panel, { className: "accordion-05-panel", children: /* @__PURE__ */ jsx49("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx49("p", { className: "pb-6 pl-6 md:px-20 text-[length:var(--text-14)] text-muted-foreground", children: item.a }) }) })
      ]
    },
    item.id
  )) }) });
}

// src/components/ui/cta-section-dark.tsx
import { jsx as jsx50, jsxs as jsxs29 } from "react/jsx-runtime";
function CTASectionDark({
  heading = "\u0425\u043E\u0442\u0438\u0442\u0435 \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0430\u043A \u043A\u043E\u043C\u0430\u043D\u0434\u0430 Rocketmind \u0440\u0435\u0448\u0438\u0442 \u0432\u0430\u0448\u0443 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443?",
  body = "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0443 \u2014 \u043C\u044B \u043F\u0440\u043E\u0432\u0435\u0434\u0451\u043C \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441\u2011\u043E\u0446\u0435\u043D\u043A\u0443 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438, \u043E\u0431\u043E\u0437\u043D\u0430\u0447\u0438\u043C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0435 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u043C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0448\u0430\u0433",
  buttonText = "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443",
  href = "#contact",
  className
}) {
  return /* @__PURE__ */ jsx50("section", { className: cn("dark bg-background text-foreground", className), children: /* @__PURE__ */ jsx50("div", { className: "mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 pb-14 xl:pb-20", children: /* @__PURE__ */ jsxs29("div", { className: "relative overflow-hidden border border-border bg-[#0A0A0A] min-h-[320px] xl:min-h-[424px]", children: [
    /* @__PURE__ */ jsx50(
      "div",
      {
        className: "absolute pointer-events-none",
        style: {
          width: 789,
          height: 789,
          left: "calc(39.6%)",
          top: -182
        },
        children: /* @__PURE__ */ jsx50(
          "div",
          {
            className: "w-full h-full rounded-full",
            style: {
              backgroundImage: [
                "radial-gradient(circle at 50% 50%, transparent 86%, rgba(219,200,0,0.14) 100%)",
                "radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)"
              ].join(", "),
              backgroundSize: "100% 100%, 24px 24px",
              backgroundRepeat: "no-repeat, repeat"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx50(
      "div",
      {
        className: "absolute inset-0 pointer-events-none",
        style: {
          background: "linear-gradient(90deg, rgba(10,10,10,1) 38%, rgba(10,10,10,0) 80%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs29("div", { className: "relative z-10 flex flex-col gap-9 p-8 xl:p-14 xl:max-w-[764px]", children: [
      /* @__PURE__ */ jsxs29("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx50("h2", { className: "font-heading text-[28px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-foreground", children: heading }),
        /* @__PURE__ */ jsx50("p", { className: "text-[15px] xl:text-[18px] leading-[1.2] text-muted-foreground xl:max-w-[672px]", children: body })
      ] }),
      /* @__PURE__ */ jsx50(
        "a",
        {
          href,
          className: "w-fit flex items-center gap-3 bg-[var(--rm-yellow-100)] text-[#0A0A0A] px-6 py-[14px] font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-[4px] transition-opacity hover:opacity-85 active:opacity-70",
          children: buttonText
        }
      )
    ] })
  ] }) }) });
}

// src/components/ui/cta-section-yellow.tsx
import { jsx as jsx51, jsxs as jsxs30 } from "react/jsx-runtime";
function SpiralMobile({ className }) {
  return /* @__PURE__ */ jsx51(
    "svg",
    {
      className,
      viewBox: "0 0 353 571",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsx51(
        "path",
        {
          d: "M0.722732 352.267L78.3109 352.267C79.9663 352.169 81.6264 352.119 83.2889 352.12C84.5725 352.12 85.8512 352.167 87.1229 352.26L135.225 352.26C135.25 352.26 135.274 352.263 135.297 352.267L352.099 352.267C351.495 157.943 194.439 0.882944 0.441071 0.882921L0.441071 -1.54108e-05C195.017 7.63774e-06 352.52 157.6 352.981 352.535C352.982 352.543 352.984 352.552 352.984 352.561L352.984 352.595C352.993 352.631 353 352.669 353 352.709C353 352.748 352.993 352.786 352.984 352.823L352.984 353.392C352.984 353.401 352.981 353.41 352.98 353.418C352.52 473.47 255.519 570.479 135.679 570.585C135.666 570.788 135.518 570.953 135.323 570.99C135.294 570.996 135.264 571 135.234 571C134.998 571 134.808 570.815 134.795 570.582C117.234 570.503 99.853 567.005 83.6222 560.271C67.1798 553.45 52.2405 543.446 39.6581 530.833C27.0749 518.22 17.0958 503.244 10.291 486.762C3.59834 470.552 0.108257 453.197 0.00519946 435.66C0.00324634 435.643 4.19933e-05 435.626 1.14765e-05 435.609L1.15128e-05 434.778C4.20312e-05 434.759 0.00382621 434.741 0.006054 434.723C0.113202 424.059 2.25676 413.51 6.32689 403.651C10.5104 393.519 16.6449 384.313 24.3797 376.559C32.1156 368.805 41.3003 362.655 51.4082 358.462C57.4569 355.952 63.7655 354.173 70.201 353.15L0.722732 353.15C0.479202 353.15 0.281692 352.953 0.281692 352.709C0.281692 352.465 0.479202 352.267 0.722732 352.267ZM78.3342 353.15C69.2049 353.696 60.2178 355.762 51.7459 359.277C41.7452 363.427 32.6581 369.51 25.0043 377.183C17.3513 384.854 11.281 393.963 7.14174 403.988C3.05504 413.888 0.931653 424.49 0.884655 435.201C0.884716 435.22 0.885449 435.239 0.88551 435.258L83.0718 435.258L83.0718 417.921C82.9238 416.909 82.847 415.882 82.847 414.847C82.847 414.12 82.9271 413.412 83.0787 412.729L83.0787 353.15L78.3342 353.15ZM83.5128 436.165C83.5076 436.165 83.5025 436.164 83.4973 436.163L0.890697 436.163C1.05699 453.414 4.52143 470.477 11.1058 486.425C17.8664 502.8 27.7805 517.679 40.2817 530.21C52.7822 542.741 67.6246 552.679 83.9599 559.455C100.083 566.144 117.348 569.621 134.793 569.7L134.793 436.165L83.5128 436.165ZM98.3545 435.281C94.8645 434.311 91.6484 432.452 89.0429 429.84C86.7192 427.51 84.993 424.695 83.9608 421.632L83.9608 435.281L98.3545 435.281ZM83.9608 415.511L83.9608 417.906C84.6075 422.163 86.5925 426.133 89.6674 429.216C93.3783 432.935 98.3804 435.063 103.618 435.162L103.618 415.511L83.9608 415.511ZM134.784 399.721C133.601 387.857 128.368 376.702 119.883 368.197C111.1 359.393 99.4854 354.081 87.1849 353.15L83.9616 353.15L83.9616 404.04L94.0751 404.04C94.078 404.04 94.0809 404.041 94.0837 404.041L104.05 404.041C104.053 404.041 104.056 404.04 104.059 404.04L134.784 404.041L134.784 399.721ZM93.6341 405.332C88.8365 405.51 84.9291 408.683 83.9616 412.839L83.9616 414.62L93.6341 414.62L93.6341 405.332ZM83.9616 404.924L83.9616 410.313C85.2959 407.754 87.7245 405.789 90.6735 404.924L83.9616 404.924ZM93.6384 353.15C103.743 355.182 113.112 360.16 120.508 367.573C127.771 374.854 132.691 384.043 134.784 393.965L134.784 353.15L93.6384 353.15ZM94.5161 404.924L94.5161 414.628L103.618 414.628L103.618 404.924L94.5161 404.924ZM104.5 404.924L104.5 414.981C104.505 415.009 104.508 415.039 104.508 415.07L104.508 435.161C112.557 435.029 120.248 431.768 125.95 426.054C130.825 421.167 133.91 414.821 134.784 408.04L134.784 404.924L104.5 404.924ZM134.784 412.518C133.331 417.826 130.525 422.717 126.574 426.677C122.255 431.006 116.826 433.967 110.957 435.281L134.784 435.281L134.784 412.518ZM135.675 353.15L135.675 399.768C135.81 401.159 135.891 402.558 135.915 403.965L135.923 404.051L135.923 404.881C135.923 404.919 135.917 404.955 135.908 404.99C135.878 406.012 135.801 407.028 135.675 408.035L135.675 435.651C135.678 435.674 135.682 435.698 135.682 435.722L135.682 569.702C255.121 569.595 351.784 472.838 352.1 353.15L135.675 353.15Z",
          fill: "#B38F00"
        }
      )
    }
  );
}
function SpiralDesktop({ className }) {
  return /* @__PURE__ */ jsx51(
    "svg",
    {
      className,
      viewBox: "0 0 647 401",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsx51(
        "path",
        {
          d: "M399.155 399.564V311.561C399.043 309.683 398.986 307.8 398.988 305.915C398.988 304.459 399.041 303.009 399.147 301.566V247.007C399.147 246.979 399.15 246.952 399.155 246.925V1.02195C178.965 1.70684 1.00047 179.844 1.00046 399.883H0C1.64792e-05 179.19 178.577 0.543883 399.457 0.0214942C399.468 0.0208892 399.478 0.018565 399.488 0.0185631H399.526C399.567 0.00753993 399.61 0 399.655 0C399.7 0 399.743 0.00753993 399.784 0.0185631H400.429C400.439 0.0185631 400.449 0.0218754 400.459 0.0224712C536.489 0.543841 646.411 110.566 646.531 246.492C646.761 246.507 646.947 246.674 646.989 246.896C646.996 246.929 647.001 246.963 647.001 246.997C647.001 247.265 646.791 247.481 646.527 247.495C646.438 267.413 642.474 287.127 634.844 305.537C627.115 324.186 615.78 341.131 601.488 355.402C587.196 369.674 570.227 380.993 551.551 388.711C533.183 396.302 513.519 400.261 493.647 400.378C493.628 400.38 493.609 400.384 493.589 400.384H492.647C492.626 400.384 492.606 400.379 492.586 400.377C480.502 400.255 468.549 397.824 457.377 393.208C445.897 388.463 435.465 381.504 426.68 372.731C417.893 363.957 410.925 353.54 406.173 342.075C403.33 335.214 401.314 328.059 400.155 320.759V399.564C400.155 399.84 399.931 400.064 399.655 400.064C399.379 400.064 399.155 399.84 399.155 399.564ZM400.155 311.535C400.774 321.889 403.115 332.083 407.098 341.692C411.799 353.035 418.693 363.342 427.386 372.023C436.079 380.703 446.4 387.588 457.759 392.283C468.977 396.919 480.99 399.327 493.127 399.38C493.149 399.38 493.17 399.379 493.192 399.379V306.161H473.547C472.4 306.329 471.237 306.416 470.064 306.416C469.241 306.416 468.438 306.325 467.663 306.153H400.155V311.535ZM494.219 305.661C494.219 305.667 494.218 305.673 494.217 305.678V399.373C513.764 399.185 533.098 395.255 551.169 387.787C569.724 380.119 586.582 368.874 600.782 354.695C614.98 340.516 626.241 323.682 633.92 305.154C641.499 286.867 645.438 267.284 645.528 247.498H494.219V305.661ZM493.217 288.827C492.119 292.785 490.012 296.433 487.052 299.388C484.413 302.024 481.222 303.982 477.752 305.153H493.217V288.827ZM470.816 305.153H473.53C478.354 304.419 482.852 302.168 486.345 298.68C490.56 294.471 492.971 288.798 493.083 282.857H470.816V305.153ZM452.924 247.507C439.481 248.849 426.842 254.785 417.205 264.409C407.229 274.371 401.209 287.544 400.155 301.496V305.152H457.818V293.681C457.818 293.677 457.819 293.674 457.819 293.671V282.367C457.819 282.364 457.818 282.36 457.818 282.357L457.819 247.507H452.924ZM459.283 294.181C459.484 299.623 463.08 304.054 467.788 305.152H469.807V294.181H459.283ZM458.819 305.152H464.926C462.026 303.638 459.8 300.884 458.819 297.539V305.152ZM400.155 294.176C402.457 282.715 408.098 272.088 416.497 263.7C424.747 255.462 435.16 249.881 446.403 247.507H400.155V294.176ZM458.819 293.181H469.816V282.857H458.819V293.181ZM458.819 281.857H470.215C470.248 281.85 470.281 281.847 470.316 281.847H493.081C492.932 272.718 489.238 263.995 482.762 257.528C477.225 251.998 470.034 248.499 462.35 247.507H458.819V281.857ZM467.425 247.507C473.439 249.155 478.981 252.339 483.468 256.819C488.374 261.718 491.728 267.876 493.217 274.532V247.507H467.425ZM400.155 246.497H452.978C454.553 246.344 456.14 246.252 457.733 246.225L457.831 246.216H458.772C458.814 246.216 458.855 246.222 458.895 246.232C460.053 246.266 461.204 246.354 462.345 246.497H493.637C493.663 246.493 493.69 246.489 493.717 246.489H645.531C645.409 111.017 535.773 1.37951 400.155 1.02097V246.497Z",
          fill: "#B38F00"
        }
      )
    }
  );
}
function CTASectionYellow({
  heading = "\u0425\u043E\u0442\u0438\u0442\u0435 \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0430\u043A \u043A\u043E\u043C\u0430\u043D\u0434\u0430 Rocketmind \u0440\u0435\u0448\u0438\u0442 \u0432\u0430\u0448\u0443 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443?",
  body = "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0443 \u2014 \u043C\u044B \u043F\u0440\u043E\u0432\u0435\u0434\u0451\u043C \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441\u2011\u043E\u0446\u0435\u043D\u043A\u0443 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438, \u043E\u0431\u043E\u0437\u043D\u0430\u0447\u0438\u043C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0435 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u043C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0448\u0430\u0433",
  buttonText = "\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443",
  href = "#contact",
  className
}) {
  return /* @__PURE__ */ jsx51("section", { className: cn("px-5 md:px-8 xl:px-14 pb-5 md:pb-8 xl:pb-14", className), children: /* @__PURE__ */ jsx51("div", { className: "mx-auto max-w-[1512px]", children: /* @__PURE__ */ jsxs30("div", { className: "bg-[#FFCC00] relative overflow-hidden rounded-none aspect-[353/571] md:aspect-auto md:min-h-[320px] xl:min-h-[400px]", children: [
    /* @__PURE__ */ jsx51(
      "div",
      {
        className: "absolute inset-0 pointer-events-none md:hidden",
        "aria-hidden": "true",
        children: /* @__PURE__ */ jsx51(SpiralMobile, { className: "w-full h-full object-cover object-center" })
      }
    ),
    /* @__PURE__ */ jsx51(
      "div",
      {
        className: "absolute right-0 top-0 bottom-0 pointer-events-none hidden md:flex items-center",
        "aria-hidden": "true",
        children: /* @__PURE__ */ jsx51(SpiralDesktop, { className: "h-full w-auto object-contain" })
      }
    ),
    /* @__PURE__ */ jsx51("div", { className: "relative z-10 p-5 md:px-8 md:py-11 xl:px-14", children: /* @__PURE__ */ jsxs30("div", { className: "flex flex-col gap-9 md:max-w-[75%] lg:max-w-[50%]", children: [
      /* @__PURE__ */ jsxs30("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx51("h2", { className: "font-heading text-[24px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.2] md:leading-[1.08] tracking-[-0.01em] md:tracking-[-0.02em] text-[#0A0A0A]", children: heading }),
        /* @__PURE__ */ jsx51("p", { className: "text-[14px] md:text-[15px] xl:text-[18px] leading-[1.32] text-[#0A0A0A]", children: body })
      ] }),
      /* @__PURE__ */ jsx51(
        "a",
        {
          href,
          className: "w-fit flex items-center justify-center bg-[#0A0A0A] text-[#F0F0F0] px-6 py-[14px] font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-sm transition-opacity hover:opacity-85 active:opacity-70",
          children: buttonText
        }
      )
    ] }) })
  ] }) }) });
}

// src/components/ui/infinite-logo-marquee.tsx
import { jsx as jsx52, jsxs as jsxs31 } from "react/jsx-runtime";
function LogoSequence({
  logos,
  gap,
  maxLogoHeight
}) {
  return /* @__PURE__ */ jsx52(
    "div",
    {
      className: "flex shrink-0 items-center py-[10px]",
      style: { gap: `${gap}px`, paddingRight: `${gap}px` },
      children: logos.map((logo) => /* @__PURE__ */ jsx52(
        "div",
        {
          className: "flex shrink-0 items-center justify-center opacity-90",
          children: /* @__PURE__ */ jsx52(
            "img",
            {
              src: logo.src,
              alt: logo.alt,
              width: logo.width,
              height: logo.height,
              loading: "eager",
              decoding: "async",
              className: "h-auto w-auto object-contain",
              style: { maxHeight: `${maxLogoHeight}px` }
            }
          )
        },
        logo.src
      ))
    }
  );
}
var buildFadeMask = (fadeWidth) => ({
  maskImage: `linear-gradient(90deg, transparent 0, #000 ${fadeWidth}px, #000 calc(100% - ${fadeWidth}px), transparent 100%)`,
  WebkitMaskImage: `linear-gradient(90deg, transparent 0, #000 ${fadeWidth}px, #000 calc(100% - ${fadeWidth}px), transparent 100%)`
});
function InfiniteLogoMarquee({
  className,
  logos,
  speedSeconds = 83,
  gap = 67,
  maxLogoHeight = 39,
  fadeWidth = 44,
  reverse = false
}) {
  if (logos.length === 0) {
    return null;
  }
  const marqueeStyle = {
    "--hero-marquee-duration": `${speedSeconds}s`
  };
  return /* @__PURE__ */ jsx52(
    "div",
    {
      className: cn(
        "relative w-full overflow-hidden",
        className
      ),
      style: buildFadeMask(fadeWidth),
      children: /* @__PURE__ */ jsxs31("div", { className: `partner-logo-marquee-track${reverse ? " partner-logo-marquee-track--ltr" : ""}`, style: marqueeStyle, children: [
        /* @__PURE__ */ jsx52(LogoSequence, { logos, gap, maxLogoHeight }),
        /* @__PURE__ */ jsx52(LogoSequence, { logos, gap, maxLogoHeight })
      ] })
    }
  );
}

// src/components/ui/mobile-nav.tsx
import { useState as useState5, useCallback as useCallback5, useEffect as useEffect9, useRef as useRef10 } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Link4 from "next/link";

// src/content/site-nav.ts
var CONSULTING_SERVICES = [
  {
    href: "/consulting/ecosystem-strategy",
    title: "\u042D\u043A\u043E\u0441\u0438\u0441\u0442\u0435\u043C\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F",
    description: "\u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u043E\u0442 \u043B\u0438\u043D\u0435\u0439\u043D\u043E\u0439 \u043C\u043E\u0434\u0435\u043B\u0438 \u043A \u044D\u043A\u043E\u0441\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0439 \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u0435 \u0440\u043E\u0441\u0442\u0430."
  },
  {
    href: "/consulting/digital-platform",
    title: "\u0426\u0438\u0444\u0440\u043E\u0432\u0430\u044F \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430",
    description: "\u0412\u043D\u0435\u0434\u0440\u0435\u043D\u0438\u0435 \u0446\u0438\u0444\u0440\u043E\u0432\u043E\u0439 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B \u0432 \u0432\u0430\u0448 \u0431\u0438\u0437\u043D\u0435\u0441."
  },
  {
    href: "/consulting/smart-analytics",
    title: "\u0423\u043C\u043D\u0430\u044F \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430",
    description: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430 \u0434\u043B\u044F \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044F \u0431\u0438\u0437\u043D\u0435\u0441\u0430 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0434\u0430\u043D\u043D\u044B\u0445."
  },
  {
    href: "/consulting/team-readiness",
    title: "\u0413\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u043A\u043E\u043C\u0430\u043D\u0434\u044B",
    description: "\u0414\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043A \u0442\u0440\u0430\u043D\u0441\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438."
  },
  {
    href: "/consulting/strategy-sessions",
    title: "\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438",
    description: "\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0438 \u0434\u0438\u0437\u0430\u0439\u043D-\u0441\u0435\u0441\u0441\u0438\u0438 \u0434\u043B\u044F \u0432\u0430\u0448\u0435\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u044B."
  },
  {
    href: "/consulting/design-sprints",
    title: "\u0414\u0438\u0437\u0430\u0439\u043D-\u0441\u043F\u0440\u0438\u043D\u0442\u044B",
    description: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0434\u0438\u0437\u0430\u0439\u043D-\u0441\u043F\u0440\u0438\u043D\u0442\u043E\u0432 \u0434\u043B\u044F \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u0442\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0438\u0434\u0435\u0439."
  },
  {
    href: "/consulting/skolkovo",
    title: "\u0420\u0435\u0437\u0438\u0434\u0435\u043D\u0442 \u0421\u043A\u043E\u043B\u043A\u043E\u0432\u043E",
    description: "\u041F\u043E\u043C\u043E\u0449\u044C \u0432 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u0440\u0435\u0437\u0438\u0434\u0435\u043D\u0442\u0430 \u0421\u043A\u043E\u043B\u043A\u043E\u0432\u043E."
  },
  {
    href: "/consulting/business-readiness",
    title: "\u0413\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u0431\u0438\u0437\u043D\u0435\u0441\u0430",
    description: "\u0414\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438 \u0431\u0438\u0437\u043D\u0435\u0441\u0430 \u043A \u0442\u0440\u0430\u043D\u0441\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438."
  }
];
var ACADEMY_COURSES = [
  {
    href: "/academy/business-design-teams",
    title: "\u0411\u0438\u0437\u043D\u0435\u0441-\u0434\u0438\u0437\u0430\u0439\u043D \u0434\u043B\u044F \u043A\u043E\u043C\u0430\u043D\u0434",
    description: "\u041F\u0440\u0430\u043A\u0442\u0438\u043A\u0443\u043C \u043F\u043E \u0431\u0438\u0437\u043D\u0435\u0441-\u0434\u0438\u0437\u0430\u0439\u043D\u0443 \u0434\u043B\u044F \u043A\u043E\u043C\u0430\u043D\u0434."
  },
  {
    href: "/academy/business-design-quickstart",
    title: "\u0411\u0438\u0437\u043D\u0435\u0441-\u0434\u0438\u0437\u0430\u0439\u043D. \u0411\u044B\u0441\u0442\u0440\u044B\u0439 \u0441\u0442\u0430\u0440\u0442",
    description: "\u0418\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439 \u043A\u0443\u0440\u0441 \u043F\u043E \u043E\u0441\u043D\u043E\u0432\u0430\u043C \u0431\u0438\u0437\u043D\u0435\u0441-\u0434\u0438\u0437\u0430\u0439\u043D\u0430."
  }
];
var AI_PRODUCTS = [
  {
    href: "/ai-products/hypothesis-testing",
    title: "\u0422\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0433\u0438\u043F\u043E\u0442\u0435\u0437",
    description: "\u0418\u0418-\u0430\u0433\u0435\u043D\u0442 \u043F\u043E \u0442\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044E \u0431\u0438\u0437\u043D\u0435\u0441-\u0433\u0438\u043F\u043E\u0442\u0435\u0437."
  },
  {
    href: "/ai-products/business-modeling",
    title: "\u041C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0431\u0438\u0437\u043D\u0435\u0441\u0430",
    description: "SaaS \u0418\u0418-\u0441\u0435\u0440\u0432\u0438\u0441 \u043C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0431\u0438\u0437\u043D\u0435\u0441\u0430."
  }
];
var HEADER_NAV = [
  {
    href: "/products?filter=consulting",
    label: "\u041A\u043E\u043D\u0441\u0430\u043B\u0442\u0438\u043D\u0433 \u0438 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438",
    items: CONSULTING_SERVICES
  },
  {
    href: "/products?filter=academy",
    label: "\u041E\u043D\u043B\u0430\u0439\u043D-\u0448\u043A\u043E\u043B\u0430",
    items: ACADEMY_COURSES
  },
  {
    href: "/products?filter=ai-products",
    label: "AI-\u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B",
    items: AI_PRODUCTS
  },
  { href: "/about", label: "\u041E Rocketmind" },
  { href: "/media", label: "\u041C\u0435\u0434\u0438\u0430" }
];
var LEGAL_LINKS = [
  { href: "/legal/privacy-policy", label: "\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" },
  { href: "/legal/data-consent", label: "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445" },
  { href: "/legal/marketing-consent", label: "\u0420\u0435\u043A\u043B\u0430\u043C\u043D\u043E\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435" }
];

// src/components/ui/mobile-nav.tsx
import { Fragment as Fragment13, jsx as jsx53, jsxs as jsxs32 } from "react/jsx-runtime";
function BurgerIcon({
  open,
  barClass = "bg-foreground"
}) {
  const bar = cn(
    "absolute left-0 block h-[2px] w-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
    barClass
  );
  return /* @__PURE__ */ jsxs32("div", { className: "relative h-[10px] w-[40px]", children: [
    /* @__PURE__ */ jsx53("span", { className: cn(bar, open ? "top-[4px] rotate-45" : "top-0") }),
    /* @__PURE__ */ jsx53("span", { className: cn(bar, open ? "top-[4px] -rotate-45" : "top-[8px]") })
  ] });
}
function MobileNav({
  className,
  nav
}) {
  const navItems = nav ?? HEADER_NAV;
  const [isOpen, setIsOpen] = useState5(false);
  const [accordions, setAccordions] = useState5({});
  const [mounted, setMounted] = useState5(false);
  const [origin, setOrigin] = useState5(null);
  const triggerRef = useRef10(null);
  useEffect9(() => setMounted(true), []);
  const open = useCallback5(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setOrigin({
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        top: r.top,
        right: window.innerWidth - r.right
      });
    }
    setAccordions({});
    setIsOpen(true);
  }, []);
  const close = useCallback5(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, []);
  const toggleAccordion = useCallback5((label) => {
    setAccordions((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);
  useEffect9(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  useEffect9(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);
  const cx = origin?.cx ?? (typeof window !== "undefined" ? window.innerWidth - 28 : 360);
  const cy = origin?.cy ?? 28;
  const clipOrigin = `${cx}px ${cy}px`;
  const overlay = mounted ? createPortal(
    /* @__PURE__ */ jsx53(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs32(
      motion.div,
      {
        initial: { clipPath: `circle(0px at ${clipOrigin})` },
        animate: {
          clipPath: `circle(2000px at ${clipOrigin})`,
          transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
          clipPath: `circle(0px at ${clipOrigin})`,
          transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] }
        },
        className: "fixed inset-0 z-[55] overflow-y-auto bg-white",
        children: [
          origin && /* @__PURE__ */ jsx53(
            "button",
            {
              type: "button",
              onClick: close,
              className: "absolute flex h-7 w-10 items-center justify-center",
              style: { top: origin.top, right: origin.right },
              "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E",
              children: /* @__PURE__ */ jsx53(BurgerIcon, { open: true, barClass: "bg-black" })
            }
          ),
          /* @__PURE__ */ jsxs32(
            "nav",
            {
              className: "flex flex-col px-5 pb-16 pt-28 md:px-24",
              "aria-label": "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F",
              children: [
                /* @__PURE__ */ jsx53("p", { className: "mb-6 font-mono text-[11px] uppercase tracking-[0.1em] text-black/30", children: "Navigation" }),
                navItems.map((item, index) => {
                  const hasDropdown = item.items && item.items.length > 0;
                  const isExpanded = accordions[item.label] ?? false;
                  return /* @__PURE__ */ jsx53(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 16 },
                      animate: { opacity: 1, y: 0 },
                      transition: {
                        delay: 0.25 + index * 0.07,
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1]
                      },
                      className: "border-b border-black/10",
                      children: hasDropdown ? /* @__PURE__ */ jsxs32(Fragment13, { children: [
                        /* @__PURE__ */ jsxs32(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleAccordion(item.label),
                            className: "flex w-full items-center justify-between gap-4 py-5 font-mono text-[22px] font-light uppercase leading-[1.16] tracking-[0.02em] text-black",
                            "aria-expanded": isExpanded,
                            children: [
                              /* @__PURE__ */ jsx53("span", { children: item.label }),
                              /* @__PURE__ */ jsx53(
                                "svg",
                                {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  width: "12",
                                  height: "7",
                                  viewBox: "0 0 10 6",
                                  fill: "none",
                                  stroke: "currentColor",
                                  strokeWidth: "1.5",
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  className: cn(
                                    "shrink-0 text-black/30 transition-transform duration-300",
                                    isExpanded && "rotate-180"
                                  ),
                                  children: /* @__PURE__ */ jsx53("path", { d: "M1 1L5 5L9 1" })
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx53(AnimatePresence, { initial: false, children: isExpanded && /* @__PURE__ */ jsx53(
                          motion.div,
                          {
                            initial: { height: 0, opacity: 0 },
                            animate: { height: "auto", opacity: 1 },
                            exit: { height: 0, opacity: 0 },
                            transition: {
                              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                              opacity: { duration: 0.25 }
                            },
                            className: "overflow-hidden",
                            children: /* @__PURE__ */ jsxs32("div", { className: "grid gap-0.5 pb-5", children: [
                              /* @__PURE__ */ jsx53(
                                Link4,
                                {
                                  href: item.href,
                                  onClick: close,
                                  className: "rounded-sm px-3 py-3 transition-colors duration-150 hover:bg-black/5 border-b border-black/10 mb-1",
                                  children: /* @__PURE__ */ jsx53("span", { className: "block font-mono text-[13px] uppercase tracking-[0.06em] text-black/50", children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0443" })
                                }
                              ),
                              item.items.map((sub) => /* @__PURE__ */ jsxs32(
                                Link4,
                                {
                                  href: sub.href,
                                  onClick: close,
                                  className: "rounded-sm px-3 py-3 transition-colors duration-150 hover:bg-black/5",
                                  children: [
                                    /* @__PURE__ */ jsx53("span", { className: "block font-mono text-[13px] uppercase tracking-[0.06em] text-black", children: sub.title }),
                                    /* @__PURE__ */ jsx53("span", { className: "mt-1 block text-[13px] leading-[1.45] text-black/50", children: sub.description })
                                  ]
                                },
                                sub.href
                              ))
                            ] })
                          }
                        ) })
                      ] }) : /* @__PURE__ */ jsx53(
                        Link4,
                        {
                          href: item.href,
                          onClick: close,
                          className: "block py-5 font-mono text-[22px] font-light uppercase leading-[1.16] tracking-[0.02em] text-black",
                          children: item.label
                        }
                      )
                    },
                    item.label
                  );
                })
              ]
            }
          )
        ]
      },
      "mobile-nav-circle"
    ) }),
    document.body
  ) : null;
  return /* @__PURE__ */ jsxs32("div", { className: cn("hero-burger", className), children: [
    /* @__PURE__ */ jsx53(
      "button",
      {
        ref: triggerRef,
        type: "button",
        onClick: isOpen ? close : open,
        className: "relative z-[60] flex h-7 w-10 items-center justify-center",
        "aria-label": isOpen ? "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E" : "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E",
        "aria-expanded": isOpen,
        children: /* @__PURE__ */ jsx53(BurgerIcon, { open: isOpen })
      }
    ),
    overlay
  ] });
}

// src/components/ui/rocketmind-menu.tsx
import Link5 from "next/link";
import { useRouter } from "next/navigation";
import { jsx as jsx54, jsxs as jsxs33 } from "react/jsx-runtime";
function RocketmindMenu({
  className,
  itemClassName,
  showDropdowns = true,
  nav
}) {
  const source = nav ?? HEADER_NAV;
  const dropdownItems = showDropdowns ? source.filter((item) => item.items && item.items.length > 0) : [];
  const plainItems = source.filter(
    (item) => !showDropdowns || !item.items || item.items.length === 0
  );
  const linkClass = cn(
    "inline-flex items-center gap-3 whitespace-nowrap px-2.5 py-2 rounded-sm",
    "font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px]",
    "text-foreground transition-[color,opacity] duration-150 hover:opacity-[0.88]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    itemClassName
  );
  return (
    // gap-0.5 at the end wins over gap-5 lg:gap-7 coming from className via tailwind-merge
    /* @__PURE__ */ jsxs33("div", { className: cn("relative z-10 flex items-center", className, "gap-0 lg:gap-0"), children: [
      dropdownItems.length > 0 && /* @__PURE__ */ jsx54(
        NavigationMenu,
        {
          className: cn(
            "relative flex max-w-max items-center",
            "[&>div]:left-auto [&>div]:right-0 [&>div]:justify-end"
          ),
          children: /* @__PURE__ */ jsx54(NavigationMenuList, { className: "flex list-none items-center gap-0.5", children: dropdownItems.map((item) => /* @__PURE__ */ jsx54(
            DropdownSection,
            {
              item,
              itemClassName
            },
            item.label
          )) })
        }
      ),
      plainItems.length > 0 && /* @__PURE__ */ jsx54("nav", { className: "flex list-none items-center gap-0.5", children: plainItems.map((item) => /* @__PURE__ */ jsx54(Link5, { href: item.href, className: linkClass, children: /* @__PURE__ */ jsx54("span", { children: item.label }) }, item.label)) })
    ] })
  );
}
function DropdownSection({
  item,
  itemClassName
}) {
  const router = useRouter();
  return /* @__PURE__ */ jsxs33(NavigationMenuItem, { children: [
    /* @__PURE__ */ jsx54(
      NavigationMenuTrigger,
      {
        className: cn(
          "inline-flex items-center gap-3 whitespace-nowrap px-2.5 py-2 rounded-sm",
          "font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px]",
          "text-foreground bg-transparent hover:bg-transparent hover:opacity-[0.88]",
          "data-[state=open]:bg-transparent data-[state=open]:opacity-[0.88]",
          "transition-[color,opacity] duration-150 cursor-pointer select-none",
          itemClassName
        ),
        onClick: () => router.push(item.href),
        children: /* @__PURE__ */ jsx54("span", { children: item.label })
      }
    ),
    /* @__PURE__ */ jsx54(NavigationMenuContent, { children: /* @__PURE__ */ jsx54(
      "ul",
      {
        className: cn(
          "grid gap-0.5 p-2",
          item.items.length > 4 ? "w-[680px] grid-cols-3" : "w-[420px] grid-cols-2"
        ),
        children: item.items.map((navItem) => /* @__PURE__ */ jsx54("li", { children: /* @__PURE__ */ jsx54(NavigationMenuLink, { asChild: true, children: /* @__PURE__ */ jsxs33(
          Link5,
          {
            href: navItem.href,
            className: "flex flex-col rounded-sm px-2.5 py-2 text-left transition-[background-color,color,opacity] duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            children: [
              /* @__PURE__ */ jsx54("span", { className: "font-mono text-[11px] uppercase tracking-[0.08em] text-foreground", children: navItem.title }),
              /* @__PURE__ */ jsx54("span", { className: "mt-0.5 text-[12px] leading-[1.4] text-muted-foreground", children: navItem.description })
            ]
          }
        ) }) }, navItem.href))
      }
    ) })
  ] });
}

// src/components/ui/wave-animation.tsx
import { useEffect as useEffect10, useRef as useRef11 } from "react";
import * as THREE from "three";
import { jsx as jsx55 } from "react/jsx-runtime";
function WaveAnimation({
  width,
  height,
  pointSize = 1.5,
  waveSpeed = 2,
  waveIntensity = 8,
  particleColor = "#ffffff",
  gridDistance = 5,
  fadeNear = 20,
  fadeFar = 200,
  className
}) {
  const containerRef = useRef11(null);
  useEffect10(() => {
    const container = containerRef.current;
    if (!container) return;
    const fixed = typeof width === "number" && typeof height === "number";
    const initialW = fixed ? width : container.clientWidth || 1;
    const initialH = fixed ? height : container.clientHeight || 1;
    const fov = 60;
    const dpr = window.devicePixelRatio;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(initialW, initialH);
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, initialW / initialH, 1, 4e3);
    camera.position.set(0, 0, 10);
    const geo = new THREE.BufferGeometry();
    const buildPositions = (w, h) => {
      const positions = [];
      const gridWidth = 400 * (w / h);
      const depth = 400;
      for (let x = 0; x < gridWidth; x += gridDistance) {
        for (let z = 0; z < depth; z += gridDistance) {
          positions.push(-gridWidth / 2 + x, -30, -depth / 2 + z);
        }
      }
      return new THREE.Float32BufferAttribute(positions, 3);
    };
    geo.setAttribute("position", buildPositions(initialW, initialH));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        u_time: { value: 0 },
        u_point_size: { value: pointSize },
        u_color: { value: new THREE.Color(particleColor) },
        u_fade_near: { value: fadeNear },
        u_fade_far: { value: fadeFar }
      },
      vertexShader: `
        #define M_PI 3.1415926535897932384626433832795
        precision mediump float;
        uniform float u_time;
        uniform float u_point_size;
        uniform float u_fade_near;
        uniform float u_fade_far;
        varying float v_alpha;

        void main() {
          vec3 p = position;
          p.y += (
            cos(p.x / M_PI * ${waveIntensity.toFixed(1)} + u_time * ${waveSpeed.toFixed(1)}) +
            sin(p.z / M_PI * ${waveIntensity.toFixed(1)} + u_time * ${waveSpeed.toFixed(1)})
          );
          vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
          vec4 clipPos = projectionMatrix * mvPos;
          float depth = -mvPos.z;
          float depthFade = 1.0 - smoothstep(u_fade_near, u_fade_far, depth);
          float ndcY = clipPos.y / clipPos.w;
          float topFade = 1.0 - smoothstep(0.80, 1.0, ndcY);
          v_alpha = depthFade * topFade;
          gl_PointSize = u_point_size;
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform vec3 u_color;
        varying float v_alpha;
        void main() {
          gl_FragColor = vec4(u_color, v_alpha);
        }
      `
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    const clock = new THREE.Clock();
    let animationId = 0;
    const render = () => {
      mat.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };
    render();
    const resize = (w, h) => {
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const next = buildPositions(w, h);
      geo.setAttribute("position", next);
      geo.attributes.position.needsUpdate = true;
    };
    let observer = null;
    const onWindowResize = () => {
      resize(window.innerWidth, window.innerHeight);
    };
    if (!fixed) {
      observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width: w, height: h } = entry.contentRect;
        resize(w, h);
      });
      observer.observe(container);
    } else if (!width && !height) {
      window.addEventListener("resize", onWindowResize);
    }
    return () => {
      cancelAnimationFrame(animationId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", onWindowResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, [
    width,
    height,
    pointSize,
    waveSpeed,
    waveIntensity,
    particleColor,
    gridDistance,
    fadeNear,
    fadeFar
  ]);
  const hasFixedSize = typeof width === "number" && typeof height === "number";
  return /* @__PURE__ */ jsx55(
    "div",
    {
      ref: containerRef,
      className: cn("overflow-hidden", className),
      style: hasFixedSize ? { width, height } : { width: "100%", height: "100%" }
    }
  );
}

// src/components/ui/site-footer.tsx
import Link6 from "next/link";
import dynamic from "next/dynamic";
import { ChevronUp } from "lucide-react";
import { jsx as jsx56, jsxs as jsxs34 } from "react/jsx-runtime";
var DottedSurface2 = dynamic(
  () => import("./dotted-surface-OKVVT7AA.js").then((m) => m.DottedSurface),
  { ssr: false, loading: () => null }
);
var DEFAULT_COMPANY_LINKS = [
  { href: "/about", label: "\u041E Rocketmind" },
  { href: "/cases", label: "\u041A\u0435\u0439\u0441\u044B" },
  { href: "/media", label: "\u041C\u0435\u0434\u0438\u0430" }
];
var CONSULTING_HREF = "/products?filter=consulting";
var ACADEMY_HREF = "/products?filter=academy";
var AI_PRODUCTS_HREF = "/products?filter=ai-products";
function pickItems(nav, hrefMatch) {
  if (!nav) return null;
  const section = nav.find((s) => s.href === hrefMatch || s.href.endsWith(hrefMatch));
  return section?.items ?? null;
}
function FooterColumn({ title, links }) {
  return /* @__PURE__ */ jsxs34("div", { children: [
    /* @__PURE__ */ jsx56("p", { className: "font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/50", children: title }),
    /* @__PURE__ */ jsx56("ul", { className: "mt-4 flex flex-col gap-2.5", children: links.map((link) => /* @__PURE__ */ jsx56("li", { children: /* @__PURE__ */ jsx56(
      Link6,
      {
        href: link.href,
        className: "text-[14px] leading-[1.5] text-muted-foreground transition-colors duration-150 hover:text-foreground",
        children: link.label
      }
    ) }, link.href)) })
  ] });
}
function SiteFooter({
  basePath = "",
  className,
  children,
  nav,
  companyLinks,
  legalLinks
}) {
  const consultingItems = pickItems(nav, CONSULTING_HREF) ?? CONSULTING_SERVICES;
  const academyItems = pickItems(nav, ACADEMY_HREF) ?? ACADEMY_COURSES;
  const aiProductItems = pickItems(nav, AI_PRODUCTS_HREF) ?? AI_PRODUCTS;
  const consultingLinks = consultingItems.map((s) => ({ href: s.href, label: s.title }));
  const academyLinks = academyItems.map((s) => ({ href: s.href, label: s.title }));
  const aiProductLinks = aiProductItems.map((s) => ({ href: s.href, label: s.title }));
  const resolvedLegalLinks = legalLinks ?? LEGAL_LINKS.map((l) => ({ href: l.href, label: l.label }));
  const resolvedCompanyLinks = [
    ...companyLinks ?? DEFAULT_COMPANY_LINKS,
    ...resolvedLegalLinks
  ];
  return /* @__PURE__ */ jsxs34("footer", { className: className ?? "relative overflow-hidden border-t border-border bg-background", children: [
    /* @__PURE__ */ jsxs34("div", { className: "relative z-10 mx-auto max-w-[1512px] px-5 py-12 md:px-8 md:py-16 xl:px-14", children: [
      /* @__PURE__ */ jsxs34("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx56(Link6, { href: "/", className: "inline-flex items-center", children: /* @__PURE__ */ jsx56(
          "img",
          {
            src: `${basePath}/with_descriptor_dark_background_en.svg`,
            alt: "Rocketmind",
            className: "h-[42px] w-auto"
          }
        ) }),
        /* @__PURE__ */ jsx56(
          "button",
          {
            type: "button",
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            "aria-label": "\u041D\u0430\u0432\u0435\u0440\u0445",
            className: "inline-flex items-center justify-center w-10 h-10 rounded-sm bg-secondary text-secondary-foreground transition-opacity duration-150 hover:opacity-[0.88] cursor-pointer",
            children: /* @__PURE__ */ jsx56(ChevronUp, { size: 20, strokeWidth: 2 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs34("div", { className: "mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12", children: [
        /* @__PURE__ */ jsxs34("div", { className: "flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx56(FooterColumn, { title: "\u041A\u043E\u043D\u0441\u0430\u043B\u0442\u0438\u043D\u0433", links: consultingLinks.slice(0, 4) }),
          /* @__PURE__ */ jsxs34("p", { className: "mt-8 text-[13px] text-muted-foreground/50 hidden md:block", children: [
            "\xA9 ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " Rocketmind"
          ] })
        ] }),
        /* @__PURE__ */ jsx56(FooterColumn, { title: "\xA0", links: consultingLinks.slice(4) }),
        /* @__PURE__ */ jsxs34("div", { className: "flex flex-col gap-10", children: [
          /* @__PURE__ */ jsx56(FooterColumn, { title: "\u041E\u043D\u043B\u0430\u0439\u043D-\u0448\u043A\u043E\u043B\u0430", links: academyLinks }),
          /* @__PURE__ */ jsx56(FooterColumn, { title: "AI-\u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B", links: aiProductLinks })
        ] }),
        /* @__PURE__ */ jsx56(FooterColumn, { title: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F", links: resolvedCompanyLinks })
      ] }),
      /* @__PURE__ */ jsxs34("p", { className: "mt-10 text-[13px] text-muted-foreground/50 md:hidden", children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Rocketmind"
      ] })
    ] }),
    /* @__PURE__ */ jsxs34("div", { className: "relative h-[440px] md:h-[460px]", children: [
      /* @__PURE__ */ jsx56(DottedSurface2, {}),
      children && /* @__PURE__ */ jsx56("div", { className: "pointer-events-auto absolute inset-0 z-10 flex flex-col justify-end", children })
    ] })
  ] });
}

// src/components/ui/site-header.tsx
import { useEffect as useEffect11, useState as useState6 } from "react";
import Link7 from "next/link";
import { usePathname } from "next/navigation";
import { jsx as jsx57, jsxs as jsxs35 } from "react/jsx-runtime";
function SiteHeader({ basePath = "", className, nav }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isVisible, setIsVisible] = useState6(!isHome);
  useEffect11(() => {
    if (!isHome) {
      setIsVisible(true);
      return;
    }
    const handleScroll = () => {
      const heroMidpoint = window.innerHeight / 2;
      setIsVisible(window.scrollY > heroMidpoint);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);
  return /* @__PURE__ */ jsx57(
    "header",
    {
      className: cn(
        "fixed top-0 left-0 right-0 z-50 w-full h-16 bg-background border-b border-border flex items-center transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none",
        className
      ),
      children: /* @__PURE__ */ jsxs35("div", { className: "mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-5 md:px-8 xl:px-14", children: [
        /* @__PURE__ */ jsx57(Link7, { href: "/", className: "flex items-center", children: /* @__PURE__ */ jsx57(
          "img",
          {
            src: `${basePath}/text_logo_dark_background_en.svg`,
            alt: "Rocketmind",
            className: "h-auto w-[120px] md:w-[144px]"
          }
        ) }),
        /* @__PURE__ */ jsx57(
          RocketmindMenu,
          {
            className: "hero-menu-desktop ml-auto flex-1 items-center justify-end gap-5 lg:gap-7",
            itemClassName: "!text-[18px]",
            showDropdowns: true,
            nav
          }
        ),
        /* @__PURE__ */ jsx57(MobileNav, { className: "ml-auto", nav })
      ] })
    }
  );
}
export {
  AccordionFAQ,
  ArticleCard,
  ArticleNav,
  Author,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumbs,
  Button,
  CTASectionDark,
  CTASectionYellow,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  ContactsSection,
  DOT_GRID_LENS_DEFAULTS,
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
  DotGridLens,
  DottedSurface,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ExpertsSection,
  ForWhomSection,
  GlowingEffect,
  HeroExperts,
  InfiniteLogoMarquee,
  Input,
  InputOTP,
  KeyThoughts,
  MobileNav,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  Note,
  NoteDescription,
  NoteEyebrow,
  NoteTitle,
  PartnershipBlock,
  ProcessSection,
  ProductCard,
  ProductImageCard,
  Radio,
  ResultsSection,
  RichText,
  RocketmindMenu,
  ScrollArea,
  ScrollBar,
  SearchCombobox,
  Separator2 as Separator,
  ServicesSection,
  ShowMore,
  ShowMorePanel,
  SiteFooter,
  SiteHeader,
  Skeleton,
  Slider,
  StyledParagraphs,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  TelegramIcon,
  Textarea,
  ThemeProvider,
  Toaster,
  ToolsSection,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  VkIcon,
  WaveAnimation,
  avatarVariants,
  badgeVariants,
  buttonVariants,
  checkboxBaseClassName,
  cn,
  inputVariants,
  noteVariants,
  radioBaseClassName,
  repackBento,
  resolveStyledParagraphs,
  HEADER_NAV as rocketmindMenuItems,
  styledParagraphClassName,
  tabsListVariants,
  tagVariants,
  textareaVariants
};
