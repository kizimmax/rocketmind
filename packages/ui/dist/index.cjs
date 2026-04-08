"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AccordionFAQ: () => AccordionFAQ,
  Avatar: () => Avatar,
  AvatarFallback: () => AvatarFallback,
  AvatarImage: () => AvatarImage,
  Badge: () => Badge,
  Button: () => Button,
  CTASectionDark: () => CTASectionDark,
  CTASectionYellow: () => CTASectionYellow,
  Card: () => Card,
  CardAction: () => CardAction,
  CardContent: () => CardContent,
  CardDescription: () => CardDescription,
  CardFooter: () => CardFooter,
  CardHeader: () => CardHeader,
  CardTitle: () => CardTitle,
  Checkbox: () => Checkbox,
  DOT_GRID_LENS_DEFAULTS: () => DOT_GRID_LENS_DEFAULTS,
  Dialog: () => Dialog,
  DialogClose: () => DialogClose,
  DialogContent: () => DialogContent,
  DialogDescription: () => DialogDescription,
  DialogFooter: () => DialogFooter,
  DialogHeader: () => DialogHeader,
  DialogOverlay: () => DialogOverlay,
  DialogPortal: () => DialogPortal,
  DialogTitle: () => DialogTitle,
  DialogTrigger: () => DialogTrigger,
  DotGridLens: () => DotGridLens,
  DropdownMenu: () => DropdownMenu,
  DropdownMenuContent: () => DropdownMenuContent,
  DropdownMenuGroup: () => DropdownMenuGroup,
  DropdownMenuItem: () => DropdownMenuItem,
  DropdownMenuLabel: () => DropdownMenuLabel,
  DropdownMenuPortal: () => DropdownMenuPortal,
  DropdownMenuSeparator: () => DropdownMenuSeparator,
  DropdownMenuTrigger: () => DropdownMenuTrigger,
  ForWhomSection: () => ForWhomSection,
  GlowingEffect: () => GlowingEffect,
  InfiniteLogoMarquee: () => InfiniteLogoMarquee,
  Input: () => Input,
  InputOTP: () => InputOTP,
  MobileNav: () => MobileNav,
  NavigationMenu: () => NavigationMenu,
  NavigationMenuContent: () => NavigationMenuContent,
  NavigationMenuItem: () => NavigationMenuItem,
  NavigationMenuLink: () => NavigationMenuLink,
  NavigationMenuList: () => NavigationMenuList,
  NavigationMenuTrigger: () => NavigationMenuTrigger,
  NavigationMenuViewport: () => NavigationMenuViewport,
  Note: () => Note,
  NoteDescription: () => NoteDescription,
  NoteEyebrow: () => NoteEyebrow,
  NoteTitle: () => NoteTitle,
  ProcessSection: () => ProcessSection,
  ProductCard: () => ProductCard,
  Radio: () => Radio,
  ResultsSection: () => ResultsSection,
  RocketmindMenu: () => RocketmindMenu,
  ScrollArea: () => ScrollArea,
  ScrollBar: () => ScrollBar,
  SearchCombobox: () => SearchCombobox,
  Separator: () => Separator2,
  ShowMore: () => ShowMore,
  ShowMorePanel: () => ShowMorePanel,
  SiteFooter: () => SiteFooter,
  SiteHeader: () => SiteHeader,
  Skeleton: () => Skeleton,
  Slider: () => Slider,
  Switch: () => Switch,
  Table: () => Table,
  TableBody: () => TableBody,
  TableCaption: () => TableCaption,
  TableCell: () => TableCell,
  TableFooter: () => TableFooter,
  TableHead: () => TableHead,
  TableHeader: () => TableHeader,
  TableRow: () => TableRow,
  Tabs: () => Tabs,
  TabsContent: () => TabsContent,
  TabsList: () => TabsList,
  TabsTrigger: () => TabsTrigger,
  Textarea: () => Textarea,
  ThemeProvider: () => ThemeProvider,
  Toaster: () => Toaster,
  Tooltip: () => Tooltip,
  TooltipContent: () => TooltipContent,
  TooltipProvider: () => TooltipProvider,
  TooltipTrigger: () => TooltipTrigger,
  avatarVariants: () => avatarVariants,
  badgeVariants: () => badgeVariants,
  buttonVariants: () => buttonVariants,
  checkboxBaseClassName: () => checkboxBaseClassName,
  cn: () => cn,
  inputVariants: () => inputVariants,
  noteVariants: () => noteVariants,
  radioBaseClassName: () => radioBaseClassName,
  rocketmindMenuItems: () => HEADER_NAV,
  tabsListVariants: () => tabsListVariants,
  textareaVariants: () => textareaVariants
});
module.exports = __toCommonJS(index_exports);

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/theme-provider.tsx
var import_next_themes = require("next-themes");
var import_jsx_runtime = require("react/jsx-runtime");
function ThemeProvider({
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_next_themes.ThemeProvider, { ...props, children });
}

// src/components/ui/avatar.tsx
var React = __toESM(require("react"), 1);
var AvatarPrimitive = __toESM(require("@radix-ui/react-avatar"), 1);
var import_class_variance_authority = require("class-variance-authority");
var import_jsx_runtime2 = require("react/jsx-runtime");
var avatarVariants = (0, import_class_variance_authority.cva)(
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
var Avatar = React.forwardRef(({ className, size = "md", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  AvatarPrimitive.Image,
  {
    ref,
    "data-slot": "avatar-image",
    className: cn("aspect-square h-full w-full object-cover", className),
    ...props
  }
));
AvatarImage.displayName = "AvatarImage";
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime3 = require("react/jsx-runtime");
var badgeVariants = (0, import_class_variance_authority2.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "span",
    {
      className: cn(badgeVariants({ variant, size }), className),
      ...props
    }
  );
}

// src/components/ui/button.tsx
var import_button = require("@base-ui/react/button");
var import_class_variance_authority3 = require("class-variance-authority");
var import_jsx_runtime4 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority3.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_button.Button,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/ui/card.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function CardAction({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
var React2 = __toESM(require("react"), 1);
var import_lucide_react = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var checkboxBaseClassName = "peer size-5 shrink-0 appearance-none rounded-sm border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--checkbox-accent,var(--rm-yellow-100))] checked:bg-[var(--checkbox-accent,var(--rm-yellow-100))] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
var Checkbox = React2.forwardRef(
  ({ className, indeterminate = false, ...props }, forwardedRef) => {
    const internalRef = React2.useRef(null);
    React2.useImperativeHandle(forwardedRef, () => internalRef.current);
    React2.useEffect(() => {
      if (!internalRef.current) return;
      internalRef.current.indeterminate = indeterminate;
    }, [indeterminate]);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "relative inline-flex size-5 shrink-0 items-center justify-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      indeterminate ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react.Minus, { className: "pointer-events-none absolute size-3.5 text-[var(--checkbox-accent-fg,var(--rm-yellow-fg))]", strokeWidth: 2.4 }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        import_lucide_react.Check,
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
var import_react = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  const containerRef = (0, import_react.useRef)(null);
  const canvasRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      ref: containerRef,
      className,
      style: { overflow: "hidden", ...style },
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("canvas", { ref: canvasRef, style: { display: "block" } })
    }
  );
}

// src/components/ui/dialog.tsx
var React3 = __toESM(require("react"), 1);
var DialogPrimitive = __toESM(require("@radix-ui/react-dialog"), 1);
var import_jsx_runtime8 = require("react/jsx-runtime");
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogClose = DialogPrimitive.Close;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
var DialogContent = React3.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(DialogPortal, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DialogOverlay, {}),
  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-1.5", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn("flex justify-end gap-3 pt-4", className),
      ...props
    }
  );
}
var DialogTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
var DialogDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
var React4 = __toESM(require("react"), 1);
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"), 1);
var import_jsx_runtime9 = require("react/jsx-runtime");
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuContent = React4.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var DropdownMenuItem = React4.forwardRef(({ className, destructive, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var DropdownMenuSeparator = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    "data-slot": "dropdown-menu-separator",
    className: cn("-mx-1 my-1 h-px bg-border", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
var DropdownMenuLabel = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var import_react2 = require("react");
var import_react3 = require("motion/react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var GlowingEffect = (0, import_react2.memo)(
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
    const containerRef = (0, import_react2.useRef)(null);
    const lastPosition = (0, import_react2.useRef)({ x: 0, y: 0 });
    const animationFrameRef = (0, import_react2.useRef)(0);
    const handleMove = (0, import_react2.useCallback)(
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
          (0, import_react3.animate)(currentAngle, newAngle, {
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
    (0, import_react2.useEffect)(() => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
var React5 = __toESM(require("react"), 1);
var import_class_variance_authority4 = require("class-variance-authority");
var import_jsx_runtime11 = require("react/jsx-runtime");
var inputVariants = (0, import_class_variance_authority4.cva)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
var React6 = __toESM(require("react"), 1);
var import_jsx_runtime12 = require("react/jsx-runtime");
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
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "div",
      {
        ref,
        "data-slot": "input-otp",
        className: cn("flex gap-2", className),
        ...props,
        children: Array.from({ length }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
var React7 = __toESM(require("react"), 1);
var import_lucide_react2 = require("lucide-react");
var NavigationMenuPrimitive = __toESM(require("@radix-ui/react-navigation-menu"), 1);
var import_jsx_runtime13 = require("react/jsx-runtime");
var NavigationMenu = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
    ...props,
    children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
var NavigationMenuList = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn("group flex flex-1 list-none items-center justify-center gap-0.5", className),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
var NavigationMenuItem = NavigationMenuPrimitive.Item;
var NavigationMenuTrigger = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        import_lucide_react2.ChevronDown,
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
var NavigationMenuContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
var NavigationMenuViewport = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "absolute left-0 top-full flex justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
var import_class_variance_authority5 = require("class-variance-authority");
var import_jsx_runtime14 = require("react/jsx-runtime");
var noteVariants = (0, import_class_variance_authority5.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "div",
    {
      "data-slot": "note",
      className: cn(noteVariants({ variant, tone, disabled }), className),
      ...props
    }
  );
}
function NoteEyebrow({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "p",
    {
      "data-slot": "note-title",
      className: cn("text-[length:var(--text-14)] font-medium text-current", className),
      ...props
    }
  );
}
function NoteDescription({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "div",
    {
      "data-slot": "note-description",
      className: cn("text-[length:var(--text-14)] leading-[1.5] opacity-80", className),
      ...props
    }
  );
}

// src/components/ui/radio.tsx
var React8 = __toESM(require("react"), 1);
var import_jsx_runtime15 = require("react/jsx-runtime");
var radioBaseClassName = "peer size-5 shrink-0 appearance-none rounded-full border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
var Radio = React8.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: "relative inline-flex size-5 shrink-0 items-center justify-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "input",
      {
        ...props,
        ref,
        type: "radio",
        "data-slot": "radio",
        className: cn(radioBaseClassName, className)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "pointer-events-none absolute size-2.5 rounded-full bg-[var(--rm-yellow-100)] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" })
  ] });
});
Radio.displayName = "Radio";

// src/components/ui/scroll-area.tsx
var React9 = __toESM(require("react"), 1);
var ScrollAreaPrimitive = __toESM(require("@radix-ui/react-scroll-area"), 1);
var import_jsx_runtime16 = require("react/jsx-runtime");
var ScrollArea = React9.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
  ScrollAreaPrimitive.Root,
  {
    ref,
    "data-slot": "scroll-area",
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ScrollBar, {}),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = "ScrollArea";
var ScrollBar = React9.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
    children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
var import_react4 = require("react");
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime17 = require("react/jsx-runtime");
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
  const rootRef = (0, import_react4.useRef)(null);
  const [open, setOpen] = (0, import_react4.useState)(false);
  const [query, setQuery] = (0, import_react4.useState)(defaultValue);
  const [highlighted, setHighlighted] = (0, import_react4.useState)(0);
  (0, import_react4.useEffect)(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);
  const trimmedQuery = query.trim().toLowerCase();
  const filteredOptions = (0, import_react4.useMemo)(() => {
    if (!trimmedQuery) return options;
    return options.filter((option) => {
      const haystack = [option.label, option.meta, option.hint, option.value].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [options, trimmedQuery]);
  const suggestionGroups = (0, import_react4.useMemo)(() => {
    if (trimmedQuery) return [];
    const groups = [];
    if (recentSearches.length > 0) {
      groups.push({
        id: "recent",
        title: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
        icon: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react3.Clock3, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
        items: recentSearches
      });
    } else {
      groups.push({
        id: "recent-empty",
        title: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
        icon: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react3.Clock3, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
        items: [],
        emptyText: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u0430. \u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0437 \u0433\u043E\u0442\u043E\u0432\u044B\u0445 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0435\u0432 \u043D\u0438\u0436\u0435."
      });
    }
    if (predefinedSuggestions.length > 0) {
      groups.push({
        id: "preset",
        title: recentSearches.length > 0 ? "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438" : "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438",
        icon: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react3.Sparkles, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
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
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: cn("w-full", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { ref: rootRef, className: "relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        "div",
        {
          className: cn(
            "w-full rounded-sm border bg-rm-gray-1 text-foreground transition-all duration-150",
            error ? "border-destructive" : "border-border",
            disabled ? "opacity-40 cursor-not-allowed" : "focus-within:border-ring",
            open && !disabled && !error && "border-ring"
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react3.Search, { className: `${iconSizes[size]} shrink-0 text-muted-foreground`, strokeWidth: 2.2 }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
                query ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
                    children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react3.X, { className: iconSizes[size], strokeWidth: 2.2 })
                  }
                ) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
                    children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react3.ChevronDown, { className: iconSizes[size], strokeWidth: 2.2 })
                  }
                )
              ]
            }
          )
        }
      ),
      open && !disabled && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-lg border border-border bg-popover", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "max-h-[320px] overflow-auto p-1.5", children: !trimmedQuery && suggestionGroups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "space-y-1.5", children: suggestionGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "rounded-md", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-2 px-2.5 py-2", children: [
          group.icon,
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground", children: group.title })
        ] }),
        group.items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("ul", { className: "space-y-1", role: "listbox", children: group.items.map((option, index) => {
          const optionIndex = suggestionGroups.slice(0, suggestionGroups.findIndex((entry) => entry.id === group.id)).flatMap((entry) => entry.items).length + index;
          return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "truncate text-[length:var(--text-14)] text-popover-foreground", children: option.label }),
                  option.meta ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground", children: option.meta }) : null
                ] }),
                option.hint ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground", children: option.hint }) : null
              ]
            }
          ) }, `${group.id}-${option.value}`);
        }) }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "px-2.5 pb-3 pt-1", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-[length:var(--text-12)] leading-relaxed text-muted-foreground", children: group.emptyText }) })
      ] }, group.id)) }) : filteredOptions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("ul", { className: "space-y-1", id: "rm-search-combobox-list", role: "listbox", children: filteredOptions.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
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
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "min-w-0", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "truncate text-[length:var(--text-14)] text-popover-foreground", children: option.label }),
              option.meta ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground", children: option.meta }) : null
            ] }),
            option.hint ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground", children: option.hint }) : null
          ]
        }
      ) }, option.value)) }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "px-3 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-[length:var(--text-13)] text-muted-foreground", children: emptyMessage }) }) }) })
    ] }),
    error ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "mt-1.5 text-[length:var(--text-12)] text-destructive", children: error }) : null
  ] });
}

// src/components/ui/separator.tsx
var import_separator = require("@base-ui/react/separator");
var import_jsx_runtime18 = require("react/jsx-runtime");
function Separator2({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    import_separator.Separator,
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
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
function ShowMore({
  expanded,
  onClick,
  label = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451",
  labelExpanded = "\u0421\u043A\u0440\u044B\u0442\u044C",
  fade = false,
  fadeBg = "var(--background)",
  className
}) {
  const btn = /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "h-px flex-1 bg-border transition-colors duration-[var(--duration-fast)] group-hover/show-more:bg-muted-foreground/30" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: "inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] transition-all duration-[var(--duration-fast)] group-hover/show-more:border-muted-foreground/40 group-hover/show-more:bg-[var(--rm-gray-1)]", children: [
          expanded ? labelExpanded : label,
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            import_lucide_react4.ChevronDown,
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
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "h-px flex-1 bg-border transition-colors duration-[var(--duration-fast)] group-hover/show-more:bg-muted-foreground/30" })
      ]
    }
  );
  if (!fade) return btn;
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { style: { position: "relative" }, className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateRows: expanded ? "1fr" : "0fr",
        transition: `grid-template-rows var(--duration-smooth) var(--ease-standard)`
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
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
var import_jsx_runtime20 = require("react/jsx-runtime");
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("animate-pulse rounded-sm bg-[var(--rm-gray-1)]", className),
      ...props
    }
  );
}

// src/components/ui/sonner.tsx
var import_next_themes2 = require("next-themes");
var import_sonner = require("sonner");
var import_lucide_react5 = require("lucide-react");
var import_jsx_runtime21 = require("react/jsx-runtime");
var Toaster = ({ ...props }) => {
  const { theme = "system" } = (0, import_next_themes2.useTheme)();
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    import_sonner.Toaster,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react5.CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react5.InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react5.TriangleAlertIcon, { className: "size-4" }),
        error: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react5.OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react5.Loader2Icon, { className: "size-4 animate-spin" })
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
var import_switch = require("@base-ui/react/switch");
var import_jsx_runtime22 = require("react/jsx-runtime");
function Switch({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    import_switch.Switch.Root,
    {
      "data-slot": "switch",
      "data-size": size,
      className: cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-sm border border-border bg-rm-gray-1 p-[1px] transition-[background-color,border-color,box-shadow,opacity] duration-150 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-5 data-[size=sm]:w-8 data-checked:border-[var(--rm-yellow-100)] data-checked:bg-[var(--rm-yellow-100)] data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        import_switch.Switch.Thumb,
        {
          "data-slot": "switch-thumb",
          className: "pointer-events-none block rounded-sm bg-foreground transition-[transform,background-color] duration-150 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3.5 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-checked/switch:bg-[var(--rm-yellow-fg)]"
        }
      )
    }
  );
}

// src/components/ui/table.tsx
var import_jsx_runtime23 = require("react/jsx-runtime");
function Table({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { "data-slot": "table-container", className: "relative w-full overflow-auto", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full border-collapse caption-bottom bg-card", className),
      ...props
    }
  ) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("bg-[var(--rm-gray-1)]", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
var import_tabs = require("@base-ui/react/tabs");
var import_class_variance_authority6 = require("class-variance-authority");
var import_jsx_runtime24 = require("react/jsx-runtime");
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_tabs.Tabs.Root,
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
var tabsListVariants = (0, import_class_variance_authority6.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_tabs.Tabs.List,
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
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_tabs.Tabs.Tab,
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
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_tabs.Tabs.Panel,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 text-[length:var(--text-14)] outline-none", className),
      ...props
    }
  );
}

// src/components/ui/textarea.tsx
var React11 = __toESM(require("react"), 1);
var import_class_variance_authority7 = require("class-variance-authority");
var import_jsx_runtime25 = require("react/jsx-runtime");
var textareaVariants = (0, import_class_variance_authority7.cva)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
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
var import_jsx_runtime26 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
    "div",
    {
      className: cn("relative flex-none", className),
      style: { width: typeof width === "number" ? `${width}px` : width, height: "8px" },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "absolute inset-x-0 top-[3px] h-[2px] bg-border" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          "div",
          {
            className: "absolute left-0 top-[3px] h-[2px] bg-foreground",
            style: animate2 ? animStyle("rm-slider-fill") : { width: fillPct }
          },
          animate2 ? `fill-${String(animateKey)}` : void 0
        ),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          "div",
          {
            className: "absolute top-0 w-2 h-2 bg-foreground",
            style: animate2 ? animStyle("rm-slider-dot") : { left: `calc(${fillPct} - 4px)` }
          },
          animate2 ? `dot-${String(animateKey)}` : void 0
        ),
        onChange && !disabled && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
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
var import_tooltip = require("@base-ui/react/tooltip");
var import_jsx_runtime27 = require("react/jsx-runtime");
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
    import_tooltip.Tooltip.Provider,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_tooltip.Tooltip.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_tooltip.Tooltip.Trigger, { "data-slot": "tooltip-trigger", ...props });
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
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_tooltip.Tooltip.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
    import_tooltip.Tooltip.Positioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
        import_tooltip.Tooltip.Popup,
        {
          "data-slot": "tooltip-content",
          className: cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          ),
          ...props,
          children: [
            children,
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_tooltip.Tooltip.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}

// src/components/ui/product-card.tsx
var import_jsx_runtime28 = require("react/jsx-runtime");
function ProductCard({
  title,
  description,
  image,
  href,
  className
}) {
  const content = /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: cn(
    "flex flex-col gap-8 border border-[#404040] p-5 md:p-8",
    "transition-colors hover:border-[#606060]",
    className
  ), children: [
    image && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "shrink-0", children: image }),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h3", { className: "h4 text-[#F0F0F0]", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]", children: description })
    ] })
  ] });
  if (href) {
    return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("a", { href, className: "block", children: content });
  }
  return content;
}

// src/components/ui/for-whom-section.tsx
var import_jsx_runtime29 = require("react/jsx-runtime");
function FactCard({ title, text }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h4", { className: "h4 text-[#0A0A0A]", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "h-0 w-full border-t border-[#404040]" }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A] max-w-[480px]", children: text })
  ] });
}
function ForWhomSection({
  tag,
  title,
  subtitle,
  facts,
  wideColumn = "right",
  className
}) {
  let col1;
  let col2;
  if (facts.length === 2) {
    col1 = [facts[0]];
    col2 = [facts[1]];
  } else if (facts.length === 3) {
    if (wideColumn === "left") {
      col1 = [facts[0]];
      col2 = [facts[1], facts[2]];
    } else {
      col1 = [facts[0], facts[1]];
      col2 = [facts[2]];
    }
  } else {
    const mid = Math.ceil(facts.length / 2);
    col1 = facts.slice(0, mid);
    col2 = facts.slice(mid);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("section", { className: cn("w-full bg-[#F0F0F0] py-10 lg:py-20", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "hidden lg:flex flex-col gap-[104px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: [
      /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]", children: tag }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "w-1/2 shrink-0 pr-8", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h2", { className: "h2 text-[#0A0A0A]", children: title }) }),
          subtitle && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "w-1/2", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A] max-w-[480px]", children: subtitle }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex", children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "w-1/2 shrink-0 pr-8 flex gap-8", children: col1.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(FactCard, { ...f }) }, i)) }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "w-1/2 flex gap-8", children: col2.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(FactCard, { ...f }) }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex lg:hidden flex-col gap-16 px-5 md:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]", children: tag }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h2", { className: "h3 text-[#0A0A0A]", children: title }),
        subtitle && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A] mt-1", children: subtitle })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "flex flex-col gap-7", children: facts.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(FactCard, { ...f }, i)) })
    ] })
  ] });
}

// src/components/ui/process-section.tsx
var import_react5 = require("react");
var import_jsx_runtime30 = require("react/jsx-runtime");
function TimelineColumn({
  isActive,
  isLast,
  fillProgress
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "relative w-4 shrink-0 flex flex-col items-center self-stretch", children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "w-px h-[2px] bg-[#404040]" }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
      "div",
      {
        className: "w-4 h-4 shrink-0 transition-all duration-300",
        style: {
          backgroundColor: isActive ? "#F0F0F0" : "#0A0A0A",
          border: `2px solid ${isActive ? "#F0F0F0" : "#404040"}`
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "w-px flex-1 relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "absolute inset-0 bg-[#404040]" }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        "div",
        {
          className: "absolute top-0 left-0 right-0 h-full origin-top bg-[#F0F0F0]",
          style: {
            transform: `scaleY(${isLast ? isActive ? 1 : 0 : fillProgress})`,
            transition: "transform 0.2s ease-out"
          }
        }
      )
    ] })
  ] });
}
function StepCard({
  step,
  isActive,
  isLast,
  fillProgress
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex gap-10 max-w-[364px]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(TimelineColumn, { isActive, isLast, fillProgress }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-3 pb-16", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
          "span",
          {
            className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] transition-colors duration-300",
            style: { color: isActive ? "#F0F0F0" : "#404040" },
            children: step.number
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
          "h3",
          {
            className: "h3 transition-colors duration-300",
            style: { color: isActive ? "#F0F0F0" : "#939393" },
            children: step.title
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        "p",
        {
          className: "text-[length:var(--text-16)] leading-[1.28] transition-colors duration-300",
          style: { color: isActive ? "#939393" : "rgba(147,147,147,0.5)" },
          children: step.text
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
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
  participants
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "bg-[#121212] rounded p-8 flex flex-col gap-8 max-w-[648px]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "flex flex-col gap-5", children: participants.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]", children: p.role }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-[length:var(--text-16)] leading-[1.28] text-[#939393]", children: p.text })
    ] }, i)) })
  ] });
}
function useStepProgress(stepCount) {
  const [activeIndex, setActiveIndex] = (0, import_react5.useState)(-1);
  const [fills, setFills] = (0, import_react5.useState)(() => Array(stepCount).fill(0));
  const containerRef = (0, import_react5.useRef)(null);
  const update = (0, import_react5.useCallback)(() => {
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
  (0, import_react5.useEffect)(() => {
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
  subtitle,
  description,
  steps,
  participantsTag,
  participants,
  className
}) {
  const { activeIndex, fills, containerRef } = useStepProgress(steps.length);
  const hasParticipants = participants && participants.length > 0 && participantsTag;
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
    "section",
    {
      ref: containerRef,
      className: cn("w-full bg-[#0A0A0A] border-t border-border py-10 lg:py-20", className),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "w-1/2 shrink-0 pr-8 flex flex-col", children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "flex-1 pb-10", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "sticky top-24", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-8 max-w-[560px]", children: [
              /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
                /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { className: "h2 text-[#F0F0F0]", children: title })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]", children: subtitle }),
                description && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]", children: description })
              ] })
            ] }) }) }),
            hasParticipants && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "max-w-[648px]", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(ParticipantsBlock, { tag: participantsTag, participants }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "w-1/2 pt-10", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "flex flex-col", children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { "data-step": true, children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
            StepCard,
            {
              step,
              isActive: i <= activeIndex,
              isLast: i === steps.length - 1,
              fillProgress: fills[i]
            }
          ) }, i)) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex lg:hidden flex-col px-5 md:px-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-4 mb-10", children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
              /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { className: "h3 text-[#F0F0F0]", children: title })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]", children: subtitle }),
              description && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]", children: description })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "flex flex-col", children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { "data-step": true, children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
            StepCard,
            {
              step,
              isActive: i <= activeIndex,
              isLast: i === steps.length - 1,
              fillProgress: fills[i]
            }
          ) }, i)) }),
          hasParticipants && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "mt-4", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(ParticipantsBlock, { tag: participantsTag, participants }) })
        ] })
      ]
    }
  );
}

// src/components/ui/results-section.tsx
var import_react6 = require("react");
var import_jsx_runtime31 = require("react/jsx-runtime");
var STEP_OFFSET = 88;
var STAGGER = 0.18;
var CARD_DURATION = 0.25;
function useResultsScroll(cardCount) {
  const [progresses, setProgresses] = (0, import_react6.useState)(() => {
    const arr = Array(cardCount).fill(0);
    arr[0] = 1;
    return arr;
  });
  const sectionRef = (0, import_react6.useRef)(null);
  const update = (0, import_react6.useCallback)(() => {
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
  (0, import_react6.useEffect)(() => {
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
  description,
  cards,
  className
}) {
  const { progresses, sectionRef } = useResultsScroll(cards.length);
  const contentHeight = STEP_OFFSET * (cards.length - 1) + 240;
  let currentIndex = 0;
  for (let j = cards.length - 1; j >= 0; j--) {
    if (progresses[j] >= 1) {
      currentIndex = j;
      break;
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
    "section",
    {
      ref: sectionRef,
      className: cn("w-full bg-[#0A0A0A] border-t border-border py-10 lg:py-20", className),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "hidden lg:block mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "relative", style: { minHeight: `${contentHeight}px` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex flex-col gap-2 max-w-[560px]", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex flex-col gap-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("h2", { className: "h2 text-[#F0F0F0]", children: title }),
              description && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("p", { className: "text-[length:var(--text-18)] leading-[1.2] text-[#939393]", children: description })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "absolute bottom-0 left-0 right-0 flex", children: cards.map((card, i) => {
            const progress = progresses[i];
            const offset = i === 0 ? 0 : -i * STEP_OFFSET * (1 - progress);
            const isCurrent = i === currentIndex;
            const isPast = progress >= 1 && !isCurrent;
            return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
              "div",
              {
                className: "flex-1",
                style: { transform: `translateY(${offset}px)` },
                children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
                  "div",
                  {
                    className: cn(
                      "flex flex-col justify-between p-8 h-[240px] border transition-colors duration-300",
                      isCurrent ? "bg-[#FFCC00] border-[#FFCC00]" : "border-[#404040]"
                    ),
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
                        "h3",
                        {
                          className: cn(
                            "font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] transition-colors duration-300",
                            isCurrent ? "text-[#0A0A0A]" : isPast ? "text-[#FFCC00]" : "text-[#F0F0F0]"
                          ),
                          children: card.title
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
                        "p",
                        {
                          className: cn(
                            "text-[length:var(--text-16)] leading-[1.28] transition-colors duration-300",
                            isCurrent ? "text-[#0A0A0A]" : "text-[#939393]"
                          ),
                          children: card.text
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
        /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex lg:hidden flex-col px-5 md:px-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex flex-col gap-2 mb-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]", children: tag }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("h2", { className: "h3 text-[#F0F0F0]", children: title }),
              description && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("p", { className: "text-[length:var(--text-16)] leading-[1.28] text-[#939393]", children: description })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
            "div",
            {
              className: "overflow-x-auto -mx-5 md:-mx-8",
              style: { scrollbarWidth: "none" },
              children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "px-5 md:px-8 w-fit", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
                "div",
                {
                  className: "grid grid-rows-2 gap-2",
                  style: {
                    gridTemplateColumns: `repeat(${Math.ceil(cards.length / 2)}, 350px)`
                  },
                  children: cards.map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
                    "div",
                    {
                      className: "bg-[#FFCC00] flex flex-col justify-between p-5 h-[240px]",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("h3", { className: "font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]", children: card.title }),
                        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("p", { className: "text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]", children: card.text })
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

// src/components/ui/accordion-faq.tsx
var import_react7 = require("@base-ui/react");
var import_jsx_runtime32 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: cn("w-full max-w-3xl", className), children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_react7.Accordion.Root, { defaultValue: defaultOpen, className: "w-full", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
    import_react7.Accordion.Item,
    {
      value: item.id,
      className: "border-b border-border",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_react7.Accordion.Header, { children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(import_react7.Accordion.Trigger, { className: "w-full text-left py-5 pl-6 md:pl-14 flex items-start gap-4 cursor-pointer text-foreground/20 transition-colors duration-200 data-[panel-open]:text-primary hover:text-foreground/50", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] mt-2 shrink-0 tabular-nums", children: item.id }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "font-[family-name:var(--font-heading-family)] font-bold uppercase text-3xl md:text-[length:var(--text-52)] leading-none tracking-[-0.02em]", children: item.q })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_react7.Accordion.Panel, { className: "accordion-05-panel", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "pb-6 pl-6 md:px-20 text-[length:var(--text-14)] text-muted-foreground", children: item.a }) }) })
      ]
    },
    item.id
  )) }) });
}

// src/components/ui/cta-section-dark.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
function CTASectionDark({
  heading = "\u0425\u043E\u0442\u0438\u0442\u0435 \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0430\u043A \u043A\u043E\u043C\u0430\u043D\u0434\u0430 Rocketmind \u0440\u0435\u0448\u0438\u0442 \u0432\u0430\u0448\u0443 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443?",
  body = "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0443 \u2014 \u043C\u044B \u043F\u0440\u043E\u0432\u0435\u0434\u0451\u043C \u044D\u043A\u0441\u043F\u0440\u0435\u0441\u0441\u2011\u043E\u0446\u0435\u043D\u043A\u0443 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438, \u043E\u0431\u043E\u0437\u043D\u0430\u0447\u0438\u043C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0435 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u043C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0448\u0430\u0433",
  buttonText = "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443",
  href = "#contact",
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("section", { className: cn("dark bg-background text-foreground", className), children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 pb-14 xl:pb-20", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "relative overflow-hidden border border-border bg-[#0A0A0A] min-h-[320px] xl:min-h-[424px]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      "div",
      {
        className: "absolute pointer-events-none",
        style: {
          width: 789,
          height: 789,
          left: "calc(39.6%)",
          top: -182
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      "div",
      {
        className: "absolute inset-0 pointer-events-none",
        style: {
          background: "linear-gradient(90deg, rgba(10,10,10,1) 38%, rgba(10,10,10,0) 80%)"
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "relative z-10 flex flex-col gap-9 p-8 xl:p-14 xl:max-w-[764px]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("h2", { className: "font-heading text-[28px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-foreground", children: heading }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { className: "text-[15px] xl:text-[18px] leading-[1.2] text-muted-foreground xl:max-w-[672px]", children: body })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
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
var import_jsx_runtime34 = require("react/jsx-runtime");
function SpiralMobile({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
    "svg",
    {
      className,
      viewBox: "0 0 353 571",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
        "path",
        {
          d: "M0.722732 352.267L78.3109 352.267C79.9663 352.169 81.6264 352.119 83.2889 352.12C84.5725 352.12 85.8512 352.167 87.1229 352.26L135.225 352.26C135.25 352.26 135.274 352.263 135.297 352.267L352.099 352.267C351.495 157.943 194.439 0.882944 0.441071 0.882921L0.441071 -1.54108e-05C195.017 7.63774e-06 352.52 157.6 352.981 352.535C352.982 352.543 352.984 352.552 352.984 352.561L352.984 352.595C352.993 352.631 353 352.669 353 352.709C353 352.748 352.993 352.786 352.984 352.823L352.984 353.392C352.984 353.401 352.981 353.41 352.98 353.418C352.52 473.47 255.519 570.479 135.679 570.585C135.666 570.788 135.518 570.953 135.323 570.99C135.294 570.996 135.264 571 135.234 571C134.998 571 134.808 570.815 134.795 570.582C117.234 570.503 99.853 567.005 83.6222 560.271C67.1798 553.45 52.2405 543.446 39.6581 530.833C27.0749 518.22 17.0958 503.244 10.291 486.762C3.59834 470.552 0.108257 453.197 0.00519946 435.66C0.00324634 435.643 4.19933e-05 435.626 1.14765e-05 435.609L1.15128e-05 434.778C4.20312e-05 434.759 0.00382621 434.741 0.006054 434.723C0.113202 424.059 2.25676 413.51 6.32689 403.651C10.5104 393.519 16.6449 384.313 24.3797 376.559C32.1156 368.805 41.3003 362.655 51.4082 358.462C57.4569 355.952 63.7655 354.173 70.201 353.15L0.722732 353.15C0.479202 353.15 0.281692 352.953 0.281692 352.709C0.281692 352.465 0.479202 352.267 0.722732 352.267ZM78.3342 353.15C69.2049 353.696 60.2178 355.762 51.7459 359.277C41.7452 363.427 32.6581 369.51 25.0043 377.183C17.3513 384.854 11.281 393.963 7.14174 403.988C3.05504 413.888 0.931653 424.49 0.884655 435.201C0.884716 435.22 0.885449 435.239 0.88551 435.258L83.0718 435.258L83.0718 417.921C82.9238 416.909 82.847 415.882 82.847 414.847C82.847 414.12 82.9271 413.412 83.0787 412.729L83.0787 353.15L78.3342 353.15ZM83.5128 436.165C83.5076 436.165 83.5025 436.164 83.4973 436.163L0.890697 436.163C1.05699 453.414 4.52143 470.477 11.1058 486.425C17.8664 502.8 27.7805 517.679 40.2817 530.21C52.7822 542.741 67.6246 552.679 83.9599 559.455C100.083 566.144 117.348 569.621 134.793 569.7L134.793 436.165L83.5128 436.165ZM98.3545 435.281C94.8645 434.311 91.6484 432.452 89.0429 429.84C86.7192 427.51 84.993 424.695 83.9608 421.632L83.9608 435.281L98.3545 435.281ZM83.9608 415.511L83.9608 417.906C84.6075 422.163 86.5925 426.133 89.6674 429.216C93.3783 432.935 98.3804 435.063 103.618 435.162L103.618 415.511L83.9608 415.511ZM134.784 399.721C133.601 387.857 128.368 376.702 119.883 368.197C111.1 359.393 99.4854 354.081 87.1849 353.15L83.9616 353.15L83.9616 404.04L94.0751 404.04C94.078 404.04 94.0809 404.041 94.0837 404.041L104.05 404.041C104.053 404.041 104.056 404.04 104.059 404.04L134.784 404.041L134.784 399.721ZM93.6341 405.332C88.8365 405.51 84.9291 408.683 83.9616 412.839L83.9616 414.62L93.6341 414.62L93.6341 405.332ZM83.9616 404.924L83.9616 410.313C85.2959 407.754 87.7245 405.789 90.6735 404.924L83.9616 404.924ZM93.6384 353.15C103.743 355.182 113.112 360.16 120.508 367.573C127.771 374.854 132.691 384.043 134.784 393.965L134.784 353.15L93.6384 353.15ZM94.5161 404.924L94.5161 414.628L103.618 414.628L103.618 404.924L94.5161 404.924ZM104.5 404.924L104.5 414.981C104.505 415.009 104.508 415.039 104.508 415.07L104.508 435.161C112.557 435.029 120.248 431.768 125.95 426.054C130.825 421.167 133.91 414.821 134.784 408.04L134.784 404.924L104.5 404.924ZM134.784 412.518C133.331 417.826 130.525 422.717 126.574 426.677C122.255 431.006 116.826 433.967 110.957 435.281L134.784 435.281L134.784 412.518ZM135.675 353.15L135.675 399.768C135.81 401.159 135.891 402.558 135.915 403.965L135.923 404.051L135.923 404.881C135.923 404.919 135.917 404.955 135.908 404.99C135.878 406.012 135.801 407.028 135.675 408.035L135.675 435.651C135.678 435.674 135.682 435.698 135.682 435.722L135.682 569.702C255.121 569.595 351.784 472.838 352.1 353.15L135.675 353.15Z",
          fill: "#FFE066"
        }
      )
    }
  );
}
function SpiralDesktop({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
    "svg",
    {
      className,
      viewBox: "0 0 647 401",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
        "path",
        {
          d: "M399.155 399.564V311.561C399.043 309.683 398.986 307.8 398.988 305.915C398.988 304.459 399.041 303.009 399.147 301.566V247.007C399.147 246.979 399.15 246.952 399.155 246.925V1.02195C178.965 1.70684 1.00047 179.844 1.00046 399.883H0C1.64792e-05 179.19 178.577 0.543883 399.457 0.0214942C399.468 0.0208892 399.478 0.018565 399.488 0.0185631H399.526C399.567 0.00753993 399.61 0 399.655 0C399.7 0 399.743 0.00753993 399.784 0.0185631H400.429C400.439 0.0185631 400.449 0.0218754 400.459 0.0224712C536.489 0.543841 646.411 110.566 646.531 246.492C646.761 246.507 646.947 246.674 646.989 246.896C646.996 246.929 647.001 246.963 647.001 246.997C647.001 247.265 646.791 247.481 646.527 247.495C646.438 267.413 642.474 287.127 634.844 305.537C627.115 324.186 615.78 341.131 601.488 355.402C587.196 369.674 570.227 380.993 551.551 388.711C533.183 396.302 513.519 400.261 493.647 400.378C493.628 400.38 493.609 400.384 493.589 400.384H492.647C492.626 400.384 492.606 400.379 492.586 400.377C480.502 400.255 468.549 397.824 457.377 393.208C445.897 388.463 435.465 381.504 426.68 372.731C417.893 363.957 410.925 353.54 406.173 342.075C403.33 335.214 401.314 328.059 400.155 320.759V399.564C400.155 399.84 399.931 400.064 399.655 400.064C399.379 400.064 399.155 399.84 399.155 399.564ZM400.155 311.535C400.774 321.889 403.115 332.083 407.098 341.692C411.799 353.035 418.693 363.342 427.386 372.023C436.079 380.703 446.4 387.588 457.759 392.283C468.977 396.919 480.99 399.327 493.127 399.38C493.149 399.38 493.17 399.379 493.192 399.379V306.161H473.547C472.4 306.329 471.237 306.416 470.064 306.416C469.241 306.416 468.438 306.325 467.663 306.153H400.155V311.535ZM494.219 305.661C494.219 305.667 494.218 305.673 494.217 305.678V399.373C513.764 399.185 533.098 395.255 551.169 387.787C569.724 380.119 586.582 368.874 600.782 354.695C614.98 340.516 626.241 323.682 633.92 305.154C641.499 286.867 645.438 267.284 645.528 247.498H494.219V305.661ZM493.217 288.827C492.119 292.785 490.012 296.433 487.052 299.388C484.413 302.024 481.222 303.982 477.752 305.153H493.217V288.827ZM470.816 305.153H473.53C478.354 304.419 482.852 302.168 486.345 298.68C490.56 294.471 492.971 288.798 493.083 282.857H470.816V305.153ZM452.924 247.507C439.481 248.849 426.842 254.785 417.205 264.409C407.229 274.371 401.209 287.544 400.155 301.496V305.152H457.818V293.681C457.818 293.677 457.819 293.674 457.819 293.671V282.367C457.819 282.364 457.818 282.36 457.818 282.357L457.819 247.507H452.924ZM459.283 294.181C459.484 299.623 463.08 304.054 467.788 305.152H469.807V294.181H459.283ZM458.819 305.152H464.926C462.026 303.638 459.8 300.884 458.819 297.539V305.152ZM400.155 294.176C402.457 282.715 408.098 272.088 416.497 263.7C424.747 255.462 435.16 249.881 446.403 247.507H400.155V294.176ZM458.819 293.181H469.816V282.857H458.819V293.181ZM458.819 281.857H470.215C470.248 281.85 470.281 281.847 470.316 281.847H493.081C492.932 272.718 489.238 263.995 482.762 257.528C477.225 251.998 470.034 248.499 462.35 247.507H458.819V281.857ZM467.425 247.507C473.439 249.155 478.981 252.339 483.468 256.819C488.374 261.718 491.728 267.876 493.217 274.532V247.507H467.425ZM400.155 246.497H452.978C454.553 246.344 456.14 246.252 457.733 246.225L457.831 246.216H458.772C458.814 246.216 458.855 246.222 458.895 246.232C460.053 246.266 461.204 246.354 462.345 246.497H493.637C493.663 246.493 493.69 246.489 493.717 246.489H645.531C645.409 111.017 535.773 1.37951 400.155 1.02097V246.497Z",
          fill: "#FFE066"
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
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("section", { className: cn("px-5 md:px-8 xl:px-14 pb-5 md:pb-8 xl:pb-14", className), children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "mx-auto max-w-[1512px]", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "bg-[#FFCC00] relative overflow-hidden rounded-none aspect-[353/571] md:aspect-auto md:min-h-[320px] xl:min-h-[400px]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      "div",
      {
        className: "absolute inset-0 pointer-events-none md:hidden",
        "aria-hidden": "true",
        children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(SpiralMobile, { className: "w-full h-full object-cover object-center" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      "div",
      {
        className: "absolute right-0 top-0 bottom-0 pointer-events-none hidden md:flex items-center",
        "aria-hidden": "true",
        children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(SpiralDesktop, { className: "h-full w-auto object-contain" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "relative z-10 p-5 md:px-8 md:py-11 xl:px-14", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "flex flex-col gap-9 md:max-w-[75%] lg:max-w-[50%]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("h2", { className: "font-heading text-[24px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.2] md:leading-[1.08] tracking-[-0.01em] md:tracking-[-0.02em] text-[#0A0A0A]", children: heading }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("p", { className: "text-[14px] md:text-[15px] xl:text-[18px] leading-[1.32] text-[#0A0A0A]", children: body })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
var import_jsx_runtime35 = require("react/jsx-runtime");
function LogoSequence({
  logos,
  gap,
  maxLogoHeight
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
    "div",
    {
      className: "flex shrink-0 items-center py-[10px]",
      style: { gap: `${gap}px`, paddingRight: `${gap}px` },
      children: logos.map((logo) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        "div",
        {
          className: "flex shrink-0 items-center justify-center opacity-90",
          children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
    "div",
    {
      className: cn(
        "relative w-full overflow-hidden",
        className
      ),
      style: buildFadeMask(fadeWidth),
      children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: `partner-logo-marquee-track${reverse ? " partner-logo-marquee-track--ltr" : ""}`, style: marqueeStyle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(LogoSequence, { logos, gap, maxLogoHeight }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(LogoSequence, { logos, gap, maxLogoHeight })
      ] })
    }
  );
}

// src/components/ui/mobile-nav.tsx
var import_react8 = require("react");
var import_react_dom = require("react-dom");
var import_react9 = require("motion/react");
var import_link = __toESM(require("next/link"), 1);

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
    href: "/consulting",
    label: "\u041A\u043E\u043D\u0441\u0430\u043B\u0442\u0438\u043D\u0433 \u0438 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438",
    items: CONSULTING_SERVICES
  },
  {
    href: "/academy",
    label: "\u041E\u043D\u043B\u0430\u0439\u043D-\u0448\u043A\u043E\u043B\u0430",
    items: ACADEMY_COURSES
  },
  {
    href: "/ai-products",
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
var import_jsx_runtime36 = require("react/jsx-runtime");
function BurgerIcon({
  open,
  barClass = "bg-foreground"
}) {
  const bar = cn(
    "absolute left-0 block h-[2px] w-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
    barClass
  );
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "relative h-[10px] w-[40px]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: cn(bar, open ? "top-[4px] rotate-45" : "top-0") }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: cn(bar, open ? "top-[4px] -rotate-45" : "top-[8px]") })
  ] });
}
function MobileNav({ className }) {
  const [isOpen, setIsOpen] = (0, import_react8.useState)(false);
  const [accordions, setAccordions] = (0, import_react8.useState)({});
  const [mounted, setMounted] = (0, import_react8.useState)(false);
  const [origin, setOrigin] = (0, import_react8.useState)(null);
  const triggerRef = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => setMounted(true), []);
  const open = (0, import_react8.useCallback)(() => {
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
  const close = (0, import_react8.useCallback)(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, []);
  const toggleAccordion = (0, import_react8.useCallback)((label) => {
    setAccordions((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);
  (0, import_react8.useEffect)(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  (0, import_react8.useEffect)(() => {
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
  const overlay = mounted ? (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_react9.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
      import_react9.motion.div,
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
          origin && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            "button",
            {
              type: "button",
              onClick: close,
              className: "absolute flex h-7 w-10 items-center justify-center",
              style: { top: origin.top, right: origin.right },
              "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E",
              children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(BurgerIcon, { open: true, barClass: "bg-black" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
            "nav",
            {
              className: "flex flex-col px-5 pb-16 pt-28 md:px-24",
              "aria-label": "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "mb-6 font-mono text-[11px] uppercase tracking-[0.1em] text-black/30", children: "Navigation" }),
                HEADER_NAV.map((item, index) => {
                  const hasDropdown = item.items && item.items.length > 0;
                  const isExpanded = accordions[item.label] ?? false;
                  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                    import_react9.motion.div,
                    {
                      initial: { opacity: 0, y: 16 },
                      animate: { opacity: 1, y: 0 },
                      transition: {
                        delay: 0.25 + index * 0.07,
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1]
                      },
                      className: "border-b border-black/10",
                      children: hasDropdown ? /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(import_jsx_runtime36.Fragment, { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleAccordion(item.label),
                            className: "flex w-full items-center justify-between gap-4 py-5 font-mono text-[22px] font-light uppercase leading-[1.16] tracking-[0.02em] text-black",
                            "aria-expanded": isExpanded,
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { children: item.label }),
                              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
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
                                  children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { d: "M1 1L5 5L9 1" })
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_react9.AnimatePresence, { initial: false, children: isExpanded && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                          import_react9.motion.div,
                          {
                            initial: { height: 0, opacity: 0 },
                            animate: { height: "auto", opacity: 1 },
                            exit: { height: 0, opacity: 0 },
                            transition: {
                              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                              opacity: { duration: 0.25 }
                            },
                            className: "overflow-hidden",
                            children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "grid gap-0.5 pb-5", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                                import_link.default,
                                {
                                  href: item.href,
                                  onClick: close,
                                  className: "rounded-sm px-3 py-3 transition-colors duration-150 hover:bg-black/5 border-b border-black/10 mb-1",
                                  children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "block font-mono text-[13px] uppercase tracking-[0.06em] text-black/50", children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0443" })
                                }
                              ),
                              item.items.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
                                import_link.default,
                                {
                                  href: sub.href,
                                  onClick: close,
                                  className: "rounded-sm px-3 py-3 transition-colors duration-150 hover:bg-black/5",
                                  children: [
                                    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "block font-mono text-[13px] uppercase tracking-[0.06em] text-black", children: sub.title }),
                                    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "mt-1 block text-[13px] leading-[1.45] text-black/50", children: sub.description })
                                  ]
                                },
                                sub.href
                              ))
                            ] })
                          }
                        ) })
                      ] }) : /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                        import_link.default,
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
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: cn("hero-burger", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      "button",
      {
        ref: triggerRef,
        type: "button",
        onClick: isOpen ? close : open,
        className: "relative z-[60] flex h-7 w-10 items-center justify-center",
        "aria-label": isOpen ? "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E" : "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E",
        "aria-expanded": isOpen,
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(BurgerIcon, { open: isOpen })
      }
    ),
    overlay
  ] });
}

// src/components/ui/rocketmind-menu.tsx
var import_link2 = __toESM(require("next/link"), 1);
var import_navigation = require("next/navigation");
var import_jsx_runtime37 = require("react/jsx-runtime");
function RocketmindMenu({
  className,
  itemClassName,
  showDropdowns = true
}) {
  const dropdownItems = showDropdowns ? HEADER_NAV.filter((item) => item.items && item.items.length > 0) : [];
  const plainItems = HEADER_NAV.filter(
    (item) => !showDropdowns || !item.items || item.items.length === 0
  );
  const linkClass = cn(
    "inline-flex items-center gap-3 whitespace-nowrap px-3 py-2 rounded-sm",
    "font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px]",
    "text-foreground transition-[color,opacity] duration-150 hover:opacity-[0.88]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    itemClassName
  );
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: cn("relative z-10 flex items-center", className), children: [
    dropdownItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      NavigationMenu,
      {
        className: cn(
          "relative flex max-w-max items-center",
          "[&>div]:left-auto [&>div]:right-0 [&>div]:justify-end"
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(NavigationMenuList, { className: "flex list-none items-center gap-0.5", children: dropdownItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          DropdownSection,
          {
            item,
            itemClassName
          },
          item.label
        )) })
      }
    ),
    plainItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("nav", { className: "flex list-none items-center gap-0.5", children: plainItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_link2.default, { href: item.href, className: linkClass, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { children: item.label }) }, item.label)) })
  ] });
}
function DropdownSection({
  item,
  itemClassName
}) {
  const router = (0, import_navigation.useRouter)();
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(NavigationMenuItem, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      NavigationMenuTrigger,
      {
        className: cn(
          "inline-flex items-center gap-3 whitespace-nowrap px-3 py-2 rounded-sm",
          "font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px]",
          "text-foreground bg-transparent hover:bg-transparent hover:opacity-[0.88]",
          "data-[state=open]:bg-transparent data-[state=open]:opacity-[0.88]",
          "transition-[color,opacity] duration-150 cursor-pointer select-none",
          itemClassName
        ),
        onClick: () => router.push(item.href),
        children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { children: item.label })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(NavigationMenuContent, { children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      "ul",
      {
        className: cn(
          "grid gap-0.5 p-2",
          item.items.length > 4 ? "w-[680px] grid-cols-3" : "w-[420px] grid-cols-2"
        ),
        children: item.items.map((navItem) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(NavigationMenuLink, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
          import_link2.default,
          {
            href: navItem.href,
            className: "flex flex-col rounded-sm px-2.5 py-2 text-left transition-[background-color,color,opacity] duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "font-mono text-[11px] uppercase tracking-[0.08em] text-foreground", children: navItem.title }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "mt-0.5 text-[12px] leading-[1.4] text-muted-foreground", children: navItem.description })
            ]
          }
        ) }) }, navItem.href))
      }
    ) })
  ] });
}

// src/components/ui/site-footer.tsx
var import_link3 = __toESM(require("next/link"), 1);
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime38 = require("react/jsx-runtime");
var COMPANY_LINKS = [
  { href: "/about", label: "\u041E Rocketmind" },
  { href: "/cases", label: "\u041A\u0435\u0439\u0441\u044B" },
  { href: "/media", label: "\u041C\u0435\u0434\u0438\u0430" },
  ...LEGAL_LINKS.map((l) => ({ href: l.href, label: l.label }))
];
function FooterColumn({ title, links }) {
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("p", { className: "font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/50", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("ul", { className: "mt-4 flex flex-col gap-2.5", children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
      import_link3.default,
      {
        href: link.href,
        scroll: false,
        onClick: () => window.scrollTo(0, 0),
        className: "text-[14px] leading-[1.5] text-muted-foreground transition-colors duration-150 hover:text-foreground",
        children: link.label
      }
    ) }, link.href)) })
  ] });
}
function SiteFooter({ basePath = "", className }) {
  const consultingLinks = CONSULTING_SERVICES.map((s) => ({
    href: s.href,
    label: s.title
  }));
  const academyLinks = ACADEMY_COURSES.map((s) => ({
    href: s.href,
    label: s.title
  }));
  const aiProductLinks = AI_PRODUCTS.map((s) => ({
    href: s.href,
    label: s.title
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("footer", { className: className ?? "border-t border-border bg-background", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "mx-auto max-w-[1512px] px-5 py-12 md:px-8 md:py-16 xl:px-14", children: [
    /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(import_link3.default, { href: "/", className: "inline-flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
        "img",
        {
          src: `${basePath}/with_descriptor_dark_background_en.svg`,
          alt: "Rocketmind",
          className: "h-[42px] w-auto"
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
        "button",
        {
          type: "button",
          onClick: () => window.scrollTo({ top: 0 }),
          "aria-label": "\u041D\u0430\u0432\u0435\u0440\u0445",
          className: "inline-flex items-center justify-center w-10 h-10 rounded-sm bg-secondary text-secondary-foreground transition-opacity duration-150 hover:opacity-[0.88] cursor-pointer",
          children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(import_lucide_react6.ChevronUp, { size: 20, strokeWidth: 2 })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "flex flex-col justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FooterColumn, { title: "\u041A\u043E\u043D\u0441\u0430\u043B\u0442\u0438\u043D\u0433", links: consultingLinks.slice(0, 4) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("p", { className: "mt-8 text-[13px] text-muted-foreground/50 hidden md:block", children: [
          "\xA9 ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Rocketmind"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FooterColumn, { title: "\xA0", links: consultingLinks.slice(4) }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "flex flex-col gap-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FooterColumn, { title: "\u041E\u043D\u043B\u0430\u0439\u043D-\u0448\u043A\u043E\u043B\u0430", links: academyLinks }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FooterColumn, { title: "AI-\u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B", links: aiProductLinks })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FooterColumn, { title: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F", links: COMPANY_LINKS })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("p", { className: "mt-10 text-[13px] text-muted-foreground/50 md:hidden", children: [
      "\xA9 ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Rocketmind"
    ] })
  ] }) });
}

// src/components/ui/site-header.tsx
var import_react10 = require("react");
var import_link4 = __toESM(require("next/link"), 1);
var import_navigation2 = require("next/navigation");
var import_jsx_runtime39 = require("react/jsx-runtime");
function SiteHeader({ basePath = "", className }) {
  const pathname = (0, import_navigation2.usePathname)();
  const isHome = pathname === "/";
  const [isVisible, setIsVisible] = (0, import_react10.useState)(!isHome);
  (0, import_react10.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    "header",
    {
      className: cn(
        "fixed top-0 left-0 right-0 z-50 w-full h-16 bg-background border-b border-border flex items-center transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none",
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("div", { className: "mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-5 md:px-8 xl:px-14", children: [
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(import_link4.default, { href: "/", className: "flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          "img",
          {
            src: `${basePath}/text_logo_dark_background_en.svg`,
            alt: "Rocketmind",
            className: "h-auto w-[120px] md:w-[144px]"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          RocketmindMenu,
          {
            className: "hero-menu-desktop ml-auto flex-1 items-center justify-end gap-5 lg:gap-7",
            itemClassName: "!text-[18px]",
            showDropdowns: true
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(MobileNav, { className: "ml-auto" })
      ] })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccordionFAQ,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ForWhomSection,
  GlowingEffect,
  InfiniteLogoMarquee,
  Input,
  InputOTP,
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
  ProcessSection,
  ProductCard,
  Radio,
  ResultsSection,
  RocketmindMenu,
  ScrollArea,
  ScrollBar,
  SearchCombobox,
  Separator,
  ShowMore,
  ShowMorePanel,
  SiteFooter,
  SiteHeader,
  Skeleton,
  Slider,
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
  Textarea,
  ThemeProvider,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  avatarVariants,
  badgeVariants,
  buttonVariants,
  checkboxBaseClassName,
  cn,
  inputVariants,
  noteVariants,
  radioBaseClassName,
  rocketmindMenuItems,
  tabsListVariants,
  textareaVariants
});
