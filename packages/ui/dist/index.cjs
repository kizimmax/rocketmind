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
  Badge: () => Badge,
  Button: () => Button,
  Card: () => Card,
  CardAction: () => CardAction,
  CardContent: () => CardContent,
  CardDescription: () => CardDescription,
  CardFooter: () => CardFooter,
  CardHeader: () => CardHeader,
  CardTitle: () => CardTitle,
  Checkbox: () => Checkbox,
  GlowingEffect: () => GlowingEffect,
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
  Radio: () => Radio,
  SearchCombobox: () => SearchCombobox,
  Separator: () => Separator,
  Switch: () => Switch,
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
  badgeVariants: () => badgeVariants,
  buttonVariants: () => buttonVariants,
  checkboxBaseClassName: () => checkboxBaseClassName,
  cn: () => cn,
  noteVariants: () => noteVariants,
  radioBaseClassName: () => radioBaseClassName,
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

// src/components/ui/badge.tsx
var import_class_variance_authority = require("class-variance-authority");
var import_jsx_runtime2 = require("react/jsx-runtime");
var badgeVariants = (0, import_class_variance_authority.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "span",
    {
      className: cn(badgeVariants({ variant, size }), className),
      ...props
    }
  );
}

// src/components/ui/button.tsx
var import_button = require("@base-ui/react/button");
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime3 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority2.cva)(
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
        "icon-xs": "size-6 rounded-sm in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-sm in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9"
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_button.Button,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/ui/card.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function CardAction({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var React = __toESM(require("react"), 1);
var import_lucide_react = require("lucide-react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var checkboxBaseClassName = "peer size-4 shrink-0 appearance-none rounded-sm border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-[var(--rm-yellow-100)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
var Checkbox = React.forwardRef(
  ({ className, indeterminate = false, ...props }, forwardedRef) => {
    const internalRef = React.useRef(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current);
    React.useEffect(() => {
      if (!internalRef.current) return;
      internalRef.current.indeterminate = indeterminate;
    }, [indeterminate]);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "relative inline-flex size-4 shrink-0 items-center justify-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          ...props,
          ref: internalRef,
          type: "checkbox",
          "data-slot": "checkbox",
          "aria-checked": indeterminate ? "mixed" : props["aria-checked"],
          className: cn(
            checkboxBaseClassName,
            indeterminate && "border-[var(--rm-yellow-100)] bg-[var(--rm-yellow-100)]",
            className
          )
        }
      ),
      indeterminate ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react.Minus, { className: "pointer-events-none absolute size-3 text-[var(--rm-yellow-fg)]", strokeWidth: 2.4 }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        import_lucide_react.Check,
        {
          className: "pointer-events-none absolute size-3 text-[var(--rm-yellow-fg)] opacity-0 transition-opacity duration-150 peer-checked:opacity-100",
          strokeWidth: 2.4
        }
      )
    ] });
  }
);
Checkbox.displayName = "Checkbox";

// src/components/ui/glowing-effect.tsx
var import_react = require("react");
var import_react2 = require("motion/react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var GlowingEffect = (0, import_react.memo)(
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
    const containerRef = (0, import_react.useRef)(null);
    const lastPosition = (0, import_react.useRef)({ x: 0, y: 0 });
    const animationFrameRef = (0, import_react.useRef)(0);
    const handleMove = (0, import_react.useCallback)(
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
          (0, import_react2.animate)(currentAngle, newAngle, {
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
    (0, import_react.useEffect)(() => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
          children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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

// src/components/ui/navigation-menu.tsx
var React2 = __toESM(require("react"), 1);
var import_lucide_react2 = require("lucide-react");
var NavigationMenuPrimitive = __toESM(require("@radix-ui/react-navigation-menu"), 1);
var import_jsx_runtime7 = require("react/jsx-runtime");
var NavigationMenu = React2.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
    ...props,
    children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
var NavigationMenuList = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn("group flex flex-1 list-none items-center justify-center gap-0.5", className),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
var NavigationMenuItem = NavigationMenuPrimitive.Item;
var NavigationMenuTrigger = React2.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
var NavigationMenuContent = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
var NavigationMenuViewport = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "absolute left-0 top-full flex justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
var import_class_variance_authority3 = require("class-variance-authority");
var import_jsx_runtime8 = require("react/jsx-runtime");
var noteVariants = (0, import_class_variance_authority3.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "div",
    {
      "data-slot": "note",
      className: cn(noteVariants({ variant, tone, disabled }), className),
      ...props
    }
  );
}
function NoteEyebrow({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "p",
    {
      "data-slot": "note-title",
      className: cn("text-[length:var(--text-14)] font-medium text-current", className),
      ...props
    }
  );
}
function NoteDescription({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "div",
    {
      "data-slot": "note-description",
      className: cn("text-[length:var(--text-14)] leading-[1.5] opacity-80", className),
      ...props
    }
  );
}

// src/components/ui/radio.tsx
var React3 = __toESM(require("react"), 1);
var import_jsx_runtime9 = require("react/jsx-runtime");
var radioBaseClassName = "peer size-4 shrink-0 appearance-none rounded-full border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
var Radio = React3.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "relative inline-flex size-4 shrink-0 items-center justify-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "input",
      {
        ...props,
        ref,
        type: "radio",
        "data-slot": "radio",
        className: cn(radioBaseClassName, className)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "pointer-events-none absolute size-2 rounded-full bg-[var(--rm-yellow-100)] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" })
  ] });
});
Radio.displayName = "Radio";

// src/components/ui/search-combobox.tsx
var import_react3 = require("react");
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime10 = require("react/jsx-runtime");
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
  const rootRef = (0, import_react3.useRef)(null);
  const [open, setOpen] = (0, import_react3.useState)(false);
  const [query, setQuery] = (0, import_react3.useState)(defaultValue);
  const [highlighted, setHighlighted] = (0, import_react3.useState)(0);
  (0, import_react3.useEffect)(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);
  const trimmedQuery = query.trim().toLowerCase();
  const filteredOptions = (0, import_react3.useMemo)(() => {
    if (!trimmedQuery) return options;
    return options.filter((option) => {
      const haystack = [option.label, option.meta, option.hint, option.value].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [options, trimmedQuery]);
  const suggestionGroups = (0, import_react3.useMemo)(() => {
    if (trimmedQuery) return [];
    const groups = [];
    if (recentSearches.length > 0) {
      groups.push({
        id: "recent",
        title: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
        icon: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.Clock3, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
        items: recentSearches
      });
    } else {
      groups.push({
        id: "recent-empty",
        title: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0438\u0441\u043A\u0430",
        icon: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.Clock3, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
        items: [],
        emptyText: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u0430. \u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0437 \u0433\u043E\u0442\u043E\u0432\u044B\u0445 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0435\u0432 \u043D\u0438\u0436\u0435."
      });
    }
    if (predefinedSuggestions.length > 0) {
      groups.push({
        id: "preset",
        title: recentSearches.length > 0 ? "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438" : "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438",
        icon: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.Sparkles, { className: `${iconSizes[size]} text-muted-foreground`, strokeWidth: 2.2 }),
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
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cn("w-full", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { ref: rootRef, className: "relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "div",
        {
          className: cn(
            "w-full rounded-sm border bg-rm-gray-1 text-foreground transition-all duration-150",
            error ? "border-destructive" : "border-border",
            disabled ? "opacity-40 cursor-not-allowed" : "focus-within:border-ring",
            open && !disabled && !error && "border-ring"
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.Search, { className: `${iconSizes[size]} shrink-0 text-muted-foreground`, strokeWidth: 2.2 }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
                query ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
                    children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.X, { className: iconSizes[size], strokeWidth: 2.2 })
                  }
                ) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
                    children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react3.ChevronDown, { className: iconSizes[size], strokeWidth: 2.2 })
                  }
                )
              ]
            }
          )
        }
      ),
      open && !disabled && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-lg border border-border bg-popover", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "max-h-[320px] overflow-auto p-1.5", children: !trimmedQuery && suggestionGroups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "space-y-1.5", children: suggestionGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "rounded-md", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-2 px-2.5 py-2", children: [
          group.icon,
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground", children: group.title })
        ] }),
        group.items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("ul", { className: "space-y-1", role: "listbox", children: group.items.map((option, index) => {
          const optionIndex = suggestionGroups.slice(0, suggestionGroups.findIndex((entry) => entry.id === group.id)).flatMap((entry) => entry.items).length + index;
          return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "truncate text-[length:var(--text-14)] text-popover-foreground", children: option.label }),
                  option.meta ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground", children: option.meta }) : null
                ] }),
                option.hint ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground", children: option.hint }) : null
              ]
            }
          ) }, `${group.id}-${option.value}`);
        }) }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "px-2.5 pb-3 pt-1", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-[length:var(--text-12)] leading-relaxed text-muted-foreground", children: group.emptyText }) })
      ] }, group.id)) }) : filteredOptions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("ul", { className: "space-y-1", id: "rm-search-combobox-list", role: "listbox", children: filteredOptions.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
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
            /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "min-w-0", children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "truncate text-[length:var(--text-14)] text-popover-foreground", children: option.label }),
              option.meta ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "mt-0.5 truncate text-[length:var(--text-12)] text-muted-foreground", children: option.meta }) : null
            ] }),
            option.hint ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "shrink-0 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground", children: option.hint }) : null
          ]
        }
      ) }, option.value)) }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "px-3 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-[length:var(--text-13)] text-muted-foreground", children: emptyMessage }) }) }) })
    ] }),
    error ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "mt-1.5 text-[length:var(--text-12)] text-destructive", children: error }) : null
  ] });
}

// src/components/ui/separator.tsx
var import_separator = require("@base-ui/react/separator");
var import_jsx_runtime11 = require("react/jsx-runtime");
function Separator({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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

// src/components/ui/sonner.tsx
var import_next_themes2 = require("next-themes");
var import_sonner = require("sonner");
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var Toaster = ({ ...props }) => {
  const { theme = "system" } = (0, import_next_themes2.useTheme)();
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    import_sonner.Toaster,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react4.CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react4.InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react4.TriangleAlertIcon, { className: "size-4" }),
        error: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react4.OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react4.Loader2Icon, { className: "size-4 animate-spin" })
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
var import_jsx_runtime13 = require("react/jsx-runtime");
function Switch({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    import_switch.Switch.Root,
    {
      "data-slot": "switch",
      "data-size": size,
      className: cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-border bg-rm-gray-1 p-[1px] transition-[background-color,border-color,box-shadow,opacity] duration-150 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7 data-checked:border-[var(--rm-yellow-100)] data-checked:bg-[var(--rm-yellow-100)] data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        import_switch.Switch.Thumb,
        {
          "data-slot": "switch-thumb",
          className: "pointer-events-none block rounded-full bg-foreground transition-[transform,background-color] duration-150 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-checked/switch:bg-[var(--rm-yellow-fg)]"
        }
      )
    }
  );
}

// src/components/ui/tabs.tsx
var import_tabs = require("@base-ui/react/tabs");
var import_class_variance_authority4 = require("class-variance-authority");
var import_jsx_runtime14 = require("react/jsx-runtime");
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
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
var tabsListVariants = (0, import_class_variance_authority4.cva)(
  "group/tabs-list inline-flex w-fit max-w-full items-center text-muted-foreground group-data-horizontal/tabs:min-h-10 group-data-vertical/tabs:h-fit group-data-vertical/tabs:w-full group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        default: "gap-1 rounded-sm border border-border bg-[var(--rm-gray-1)] p-1",
        secondary: "gap-4 rounded-none border-b border-border bg-transparent p-0"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    import_tabs.Tabs.List,
    {
      "data-slot": "tabs-list",
      "data-variant": variant,
      className: cn(tabsListVariants({ variant }), className),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    import_tabs.Tabs.Tab,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "relative inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-sm border border-transparent px-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color,opacity] duration-150 ease-[var(--ease-standard)] group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:bg-[var(--rm-gray-2)] hover:text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:border-border data-active:bg-background data-active:text-foreground",
        "group-data-[variant=secondary]/tabs-list:h-10 group-data-[variant=secondary]/tabs-list:rounded-none group-data-[variant=secondary]/tabs-list:border-transparent group-data-[variant=secondary]/tabs-list:bg-transparent group-data-[variant=secondary]/tabs-list:px-0 group-data-[variant=secondary]/tabs-list:hover:bg-transparent group-data-[variant=secondary]/tabs-list:data-active:border-transparent group-data-[variant=secondary]/tabs-list:data-active:bg-transparent",
        "after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-full after:bg-[var(--rm-yellow-100)] after:opacity-0 after:transition-opacity after:duration-150 group-data-[variant=secondary]/tabs-list:data-active:after:opacity-100",
        className
      ),
      ...props
    }
  );
}
function TabsContent({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    import_tabs.Tabs.Panel,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 text-[length:var(--text-14)] outline-none", className),
      ...props
    }
  );
}

// src/components/ui/textarea.tsx
var React5 = __toESM(require("react"), 1);
var import_class_variance_authority5 = require("class-variance-authority");
var import_jsx_runtime15 = require("react/jsx-runtime");
var textareaVariants = (0, import_class_variance_authority5.cva)(
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
var Textarea = React5.forwardRef(
  ({ className, variant, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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

// src/components/ui/tooltip.tsx
var import_tooltip = require("@base-ui/react/tooltip");
var import_jsx_runtime16 = require("react/jsx-runtime");
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    import_tooltip.Tooltip.Provider,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_tooltip.Tooltip.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_tooltip.Tooltip.Trigger, { "data-slot": "tooltip-trigger", ...props });
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
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_tooltip.Tooltip.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    import_tooltip.Tooltip.Positioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
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
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_tooltip.Tooltip.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  GlowingEffect,
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
  Radio,
  SearchCombobox,
  Separator,
  Switch,
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
  badgeVariants,
  buttonVariants,
  checkboxBaseClassName,
  cn,
  noteVariants,
  radioBaseClassName,
  tabsListVariants,
  textareaVariants
});
