import { ClassValue } from 'clsx';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { ReactNode } from 'react';
import { ThemeProvider as ThemeProvider$1 } from 'next-themes';
import * as class_variance_authority_types from 'class-variance-authority/types';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { VariantProps } from 'class-variance-authority';
import { Button as Button$1 } from '@base-ui/react/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { Separator as Separator$1 } from '@base-ui/react/separator';
import { ToasterProps } from 'sonner';
import { Switch as Switch$1 } from '@base-ui/react/switch';
import { Tabs as Tabs$1 } from '@base-ui/react/tabs';
import { Tooltip as Tooltip$1 } from '@base-ui/react/tooltip';

declare function cn(...inputs: ClassValue[]): string;

declare function ThemeProvider({ children, ...props }: React$1.ComponentProps<typeof ThemeProvider$1>): react_jsx_runtime.JSX.Element;

declare const avatarVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const Avatar: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & VariantProps<(props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLSpanElement>>;
declare const AvatarImage: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarImageProps & React$1.RefAttributes<HTMLImageElement>, "ref"> & React$1.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarFallbackProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

declare const badgeVariants: (props?: ({
    variant?: "neutral" | "yellow-solid" | "yellow-subtle" | "violet-solid" | "violet-subtle" | "sky-solid" | "sky-subtle" | "terracotta-solid" | "terracotta-subtle" | "pink-solid" | "pink-subtle" | "blue-solid" | "blue-subtle" | "red-solid" | "red-subtle" | "green-solid" | "green-subtle" | "default" | "secondary" | "destructive" | "outline" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
type BadgeSize = VariantProps<typeof badgeVariants>["size"];
declare function Badge({ className, variant, size, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "secondary" | "destructive" | "outline" | "ghost" | null | undefined;
    size?: "xs" | "sm" | "lg" | "default" | "icon" | "icon-micro" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, ...props }: Button$1.Props & VariantProps<typeof buttonVariants>): react_jsx_runtime.JSX.Element;

declare function Card({ className, size, ...props }: React$1.ComponentProps<"div"> & {
    size?: "default" | "sm";
}): react_jsx_runtime.JSX.Element;
declare function CardHeader({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardTitle({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardDescription({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardAction({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardContent({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardFooter({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;

declare const checkboxBaseClassName = "peer size-5 shrink-0 appearance-none rounded-sm border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--checkbox-accent,var(--rm-yellow-100))] checked:bg-[var(--checkbox-accent,var(--rm-yellow-100))] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
declare const Checkbox: React$1.ForwardRefExoticComponent<Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    indeterminate?: boolean;
} & React$1.RefAttributes<HTMLInputElement>>;

declare const DOT_GRID_LENS_DEFAULTS: {
    readonly gridGap: 20;
    readonly baseRadius: 1.5;
    readonly maxScale: 3.3;
    readonly lensRadius: 120;
    readonly accentColor: false;
};
interface DotGridLensProps {
    /** Grid step in px (min 16 recommended for performance). Default: 20 */
    gridGap?: number;
    /** Base dot radius in px. Default: 1.5 */
    baseRadius?: number;
    /** Dot scale multiplier at lens center. Default: 3.3 */
    maxScale?: number;
    /** Lens influence radius in px. Default: 120 */
    lensRadius?: number;
    /** Enable yellow accent color interpolation on hover (hero variant). Default: false */
    accentColor?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare function DotGridLens({ gridGap, baseRadius, maxScale, lensRadius, accentColor, className, style, }: DotGridLensProps): react_jsx_runtime.JSX.Element;

declare const Dialog: React$1.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const DialogOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogContent: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare function DialogHeader({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
declare function DialogFooter({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
declare const DialogTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const DropdownMenu: React$1.FC<DropdownMenuPrimitive.DropdownMenuProps>;
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React$1.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    destructive?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

interface GlowingEffectProps {
    blur?: number;
    inactiveZone?: number;
    proximity?: number;
    spread?: number;
    variant?: "default" | "white" | "yellow";
    glow?: boolean;
    className?: string;
    disabled?: boolean;
    movementDuration?: number;
    borderWidth?: number;
}
declare const GlowingEffect: React$1.MemoExoticComponent<({ blur, inactiveZone, proximity, spread, variant, glow, className, movementDuration, borderWidth, disabled, }: GlowingEffectProps) => react_jsx_runtime.JSX.Element>;

declare const inputVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const Input: React$1.ForwardRefExoticComponent<Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "size"> & VariantProps<(props?: ({
    size?: "xs" | "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLInputElement>>;

interface InputOTPProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    "aria-invalid"?: boolean;
}
declare const InputOTP: React$1.ForwardRefExoticComponent<InputOTPProps & React$1.RefAttributes<HTMLDivElement>>;

declare const NavigationMenu: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuProps & React$1.RefAttributes<HTMLElement>, "ref"> & React$1.RefAttributes<HTMLElement>>;
declare const NavigationMenuList: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuListProps & React$1.RefAttributes<HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const NavigationMenuItem: React$1.ForwardRefExoticComponent<NavigationMenuPrimitive.NavigationMenuItemProps & React$1.RefAttributes<HTMLLIElement>>;
declare const NavigationMenuTrigger: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const NavigationMenuContent: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const NavigationMenuLink: React$1.ForwardRefExoticComponent<NavigationMenuPrimitive.NavigationMenuLinkProps & React$1.RefAttributes<HTMLAnchorElement>>;
declare const NavigationMenuViewport: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuViewportProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const noteVariants: (props?: ({
    variant?: "neutral" | "error" | "info" | "success" | "warning" | "action" | null | undefined;
    tone?: "filled" | "soft" | null | undefined;
    disabled?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Note({ className, variant, tone, disabled, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof noteVariants>): react_jsx_runtime.JSX.Element;
declare function NoteEyebrow({ className, ...props }: React$1.ComponentProps<"p">): react_jsx_runtime.JSX.Element;
declare function NoteTitle({ className, ...props }: React$1.ComponentProps<"p">): react_jsx_runtime.JSX.Element;
declare function NoteDescription({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;

type RadioProps = Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "type">;
declare const radioBaseClassName = "peer size-5 shrink-0 appearance-none rounded-full border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
declare const Radio: React$1.ForwardRefExoticComponent<RadioProps & React$1.RefAttributes<HTMLInputElement>>;

declare const ScrollArea: React$1.ForwardRefExoticComponent<Omit<ScrollAreaPrimitive.ScrollAreaProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const ScrollBar: React$1.ForwardRefExoticComponent<Omit<ScrollAreaPrimitive.ScrollAreaScrollbarProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type SearchComboboxOption = {
    value: string;
    label: string;
    meta?: string;
    hint?: string;
};
type SearchComboboxSize = "xs" | "sm" | "md" | "lg";
type SearchComboboxProps = {
    ariaLabel?: string;
    className?: string;
    defaultValue?: string;
    disabled?: boolean;
    emptyMessage?: string;
    error?: string;
    onSelect?: (option: SearchComboboxOption) => void;
    options: SearchComboboxOption[];
    placeholder?: string;
    predefinedSuggestions?: SearchComboboxOption[];
    recentSearches?: SearchComboboxOption[];
    size?: SearchComboboxSize;
};
declare function SearchCombobox({ ariaLabel, className, defaultValue, disabled, emptyMessage, error, onSelect, options, placeholder, predefinedSuggestions, recentSearches, size, }: SearchComboboxProps): react_jsx_runtime.JSX.Element;

declare function Separator({ className, orientation, ...props }: Separator$1.Props): react_jsx_runtime.JSX.Element;

interface ShowMoreProps {
    expanded: boolean;
    onClick: () => void;
    label?: string;
    labelExpanded?: string;
    /**
     * Fade mode: renders a gradient above the button that fades out
     * the last portion of the collapsed content.
     * Use together with ShowMorePanel fade + collapsedHeight.
     */
    fade?: boolean;
    /** CSS color value for gradient end. Default: var(--background) */
    fadeBg?: string;
    /** Height of the fade gradient above the button (px). Default: 72 */
    fadeHeight?: number;
    /** Height of the solid background skirt below the button's center line (px).
     *  Use to hide content sitting visually behind the button when ShowMore is
     *  pulled up over preceding content via negative margin. Default: 0 */
    fadeBelow?: number;
    className?: string;
}
declare function ShowMore({ expanded, onClick, label, labelExpanded, fade, fadeBg, fadeHeight, fadeBelow, className, }: ShowMoreProps): react_jsx_runtime.JSX.Element;
interface ShowMorePanelProps {
    expanded: boolean;
    children: React$1.ReactNode;
    className?: string;
    /**
     * Show partial content when collapsed (instead of collapsing to zero).
     * Pairs with fade on ShowMore for the gradient hint effect.
     */
    fade?: boolean;
    /** Visible height when collapsed. Only used when fade=true. Default: 180 */
    collapsedHeight?: number;
}
/**
 * Animated container for ShowMore content.
 * Uses CSS grid-template-rows trick for smooth height animation — no JS measurement needed.
 */
declare function ShowMorePanel({ expanded, children, className, fade, collapsedHeight, }: ShowMorePanelProps): react_jsx_runtime.JSX.Element;

declare function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;

declare const Toaster: ({ ...props }: ToasterProps) => react_jsx_runtime.JSX.Element;

declare function Switch({ className, size, ...props }: Switch$1.Root.Props & {
    size?: "sm" | "default";
}): react_jsx_runtime.JSX.Element;

declare function Table({ className, ...props }: React$1.HTMLAttributes<HTMLTableElement>): react_jsx_runtime.JSX.Element;
declare function TableHeader({ className, ...props }: React$1.HTMLAttributes<HTMLTableSectionElement>): react_jsx_runtime.JSX.Element;
declare function TableBody({ className, ...props }: React$1.HTMLAttributes<HTMLTableSectionElement>): react_jsx_runtime.JSX.Element;
declare function TableFooter({ className, ...props }: React$1.HTMLAttributes<HTMLTableSectionElement>): react_jsx_runtime.JSX.Element;
declare function TableRow({ className, ...props }: React$1.HTMLAttributes<HTMLTableRowElement>): react_jsx_runtime.JSX.Element;
declare function TableHead({ className, ...props }: React$1.ThHTMLAttributes<HTMLTableCellElement>): react_jsx_runtime.JSX.Element;
declare function TableCell({ className, ...props }: React$1.TdHTMLAttributes<HTMLTableCellElement>): react_jsx_runtime.JSX.Element;
declare function TableCaption({ className, ...props }: React$1.HTMLAttributes<HTMLTableCaptionElement>): react_jsx_runtime.JSX.Element;

declare function Tabs({ className, orientation, ...props }: Tabs$1.Root.Props): react_jsx_runtime.JSX.Element;
declare const tabsListVariants: (props?: ({
    variant?: "default" | "secondary" | null | undefined;
    size?: "sm" | "default" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function TabsList({ className, variant, size, ...props }: Tabs$1.List.Props & VariantProps<typeof tabsListVariants>): react_jsx_runtime.JSX.Element;
declare function TabsTrigger({ className, ...props }: Tabs$1.Tab.Props): react_jsx_runtime.JSX.Element;
declare function TabsContent({ className, ...props }: Tabs$1.Panel.Props): react_jsx_runtime.JSX.Element;

declare const textareaVariants: (props?: ({
    variant?: "default" | "chat" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const Textarea: React$1.ForwardRefExoticComponent<React$1.TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<(props?: ({
    variant?: "default" | "chat" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLTextAreaElement>>;

interface SliderProps {
    /** Current value (ignored in animate mode) */
    value?: number;
    /** Minimum value. Default 0. */
    min?: number;
    /** Maximum value. Default 1. */
    max?: number;
    /** Step increment (interactive mode only) */
    step?: number;
    /** Width in px or CSS string ("100%"). Default 62. */
    width?: number | string;
    /** Extra className on the root element */
    className?: string;
    /** Run CSS keyframe animation: fill 0 → 100% */
    animate?: boolean;
    /**
     * Changing this value re-mounts the animated fill/dot, restarting the
     * animation. Pass `activeCase` (or any key) that changes on each cycle.
     */
    animateKey?: unknown;
    /** Animation duration in ms. Default 15 000. */
    animationDuration?: number;
    /** Animation delay in ms. Default 200. */
    animationDelay?: number;
    /** When provided, overlays an invisible <input type="range"> for interaction. */
    onChange?: (value: number) => void;
    disabled?: boolean;
}
/**
 * Slider — визуальный индикатор прогресса / интерактивный слайдер.
 *
 * Figma: 62 × 8 px | track #border | fill + dot #foreground
 *
 * Режимы:
 * - `animate` — CSS-анимация заполнения (прогресс-бар, блок кейсов)
 * - `onChange` — интерактивный, поверх рисует невидимый <input type="range">
 * - статический — отображает `value` без анимации и без взаимодействия
 */
declare function Slider({ value, min, max, step, width, className, animate, animateKey, animationDuration, animationDelay, onChange, disabled, }: SliderProps): react_jsx_runtime.JSX.Element;

declare function TooltipProvider({ delay, ...props }: Tooltip$1.Provider.Props): react_jsx_runtime.JSX.Element;
declare function Tooltip({ ...props }: Tooltip$1.Root.Props): react_jsx_runtime.JSX.Element;
declare function TooltipTrigger({ ...props }: Tooltip$1.Trigger.Props): react_jsx_runtime.JSX.Element;
declare function TooltipContent({ className, side, sideOffset, align, alignOffset, children, ...props }: Tooltip$1.Popup.Props & Pick<Tooltip$1.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">): react_jsx_runtime.JSX.Element;

type StyledParagraphColor = "primary" | "secondary";
type StyledParagraph = {
    text: string;
    uppercase?: boolean;
    color?: StyledParagraphColor;
};
type StyledParagraphsTheme = "dark" | "light";
type StyledParagraphsSize = "18" | "16";
type StyledParagraphsProps = {
    paragraphs: StyledParagraph[];
    theme?: StyledParagraphsTheme;
    size?: StyledParagraphsSize;
    className?: string;
};
/**
 * Canonicalize a possibly-legacy paragraphs list + legacy description string.
 *
 * - If `paragraphs` is non-empty → use it (applying defaults).
 * - Else if `legacy` is a non-empty string → wrap it with `legacyDefaults`.
 * - Else return [].
 */
declare function resolveStyledParagraphs(paragraphs: StyledParagraph[] | undefined, legacy: string | undefined, legacyDefaults?: {
    uppercase?: boolean;
    color?: StyledParagraphColor;
}): StyledParagraph[];
declare function styledParagraphClassName(p: StyledParagraph, opts?: {
    theme?: StyledParagraphsTheme;
    size?: StyledParagraphsSize;
}): string;
/**
 * Renders a list of styled paragraphs with per-paragraph caps + color.
 * Returns null when paragraphs list is empty.
 */
declare function StyledParagraphs({ paragraphs, theme, size, className, }: StyledParagraphsProps): react_jsx_runtime.JSX.Element | null;

interface PartnershipLogo {
    src: string;
    alt: string;
}
interface PartnershipPhoto {
    src: string;
    alt?: string;
}
interface PartnershipBlockProps {
    /** Yellow caption label (e.g. "Партнёрства") */
    caption: string;
    /** Main heading */
    title: string;
    /** Legacy single-string description (plain secondary text). */
    description?: string;
    /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
    paragraphs?: StyledParagraph[];
    /** Partner logos (max ~4, displayed inline) */
    logos: PartnershipLogo[];
    /** Photos for 2×2 grid (exactly 4) */
    photos: PartnershipPhoto[];
    className?: string;
}
declare function PartnershipBlock({ caption, title, description, paragraphs, logos, photos, className, }: PartnershipBlockProps): react_jsx_runtime.JSX.Element;

interface ProductCardExpert {
    name: string;
    image: string;
}
interface ProductCardProps {
    /** Product title (uppercase, max 2 lines) */
    title: string;
    /** Short description (max 3 lines, ellipsis on overflow) */
    description: string;
    /** 120×120 icon element (consulting section only) */
    icon?: React$1.ReactNode;
    /** Expert avatars — first 2 shown, rest collapsed into "+N" */
    experts?: ProductCardExpert[];
    /** Yellow badge label (e.g. "Экспертный продукт") */
    tag?: string;
    /** Makes the entire card a link */
    href?: string;
    className?: string;
}
declare function ProductCard({ title, description, icon, experts, tag, href, className, }: ProductCardProps): react_jsx_runtime.JSX.Element;

interface ProductImageCardFactoid {
    number: string;
    text: string;
}
interface ProductImageCardProps {
    /** Product title (uppercase, max 2 lines) */
    title: string;
    /** Short description */
    description: string;
    /** Cover image URL */
    image?: string;
    /** Yellow badge label */
    tag?: string;
    /** Makes the entire card a link */
    href?: string;
    /** "default" = 1 column, "wide" = 2 columns with factoids on desktop */
    variant?: "default" | "wide";
    /** Hero factoids for the wide variant (desktop only, max 3) */
    factoids?: ProductImageCardFactoid[];
    /** Compact wide: min-h 350px, max 2 factoids (for mixed grids with 1-col cards) */
    compact?: boolean;
    className?: string;
}
declare function ProductImageCard({ title, description, image, tag, href, variant, factoids, compact, className, }: ProductImageCardProps): react_jsx_runtime.JSX.Element;

interface BreadcrumbItem {
    label: string;
    href?: string;
}
interface BreadcrumbsProps extends React$1.HTMLAttributes<HTMLElement> {
    items: BreadcrumbItem[];
    /** Mobile: horizontal scroll anchored to the end (last item visible) */
    mobileScroll?: boolean;
}
/**
 * Breadcrumbs — путь навигации.
 *
 * Desktop: row gap-3, item gap-2, text Copy 14.
 * Mobile (`mobileScroll`): горизонтальный скролл, прижатый к концу — видна текущая позиция.
 */
declare const Breadcrumbs: React$1.ForwardRefExoticComponent<BreadcrumbsProps & React$1.RefAttributes<HTMLElement>>;

declare const tagVariants: (props?: ({
    size?: "s" | "l" | "m" | null | undefined;
    state?: "default" | "disabled" | "active" | "interactive" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type TagSize = NonNullable<VariantProps<typeof tagVariants>["size"]>;
type TagState = NonNullable<VariantProps<typeof tagVariants>["state"]>;
type TagOwnProps = VariantProps<typeof tagVariants> & {
    asChild?: boolean;
};
type TagAsButton = TagOwnProps & Omit<React$1.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
    as: "button";
};
type TagAsAnchor = TagOwnProps & Omit<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, "size"> & {
    as: "a";
};
type TagAsSpan = TagOwnProps & Omit<React$1.HTMLAttributes<HTMLSpanElement>, "size"> & {
    as?: "span";
};
type TagProps = TagAsButton | TagAsAnchor | TagAsSpan;
/**
 * Tag — тег для статьи / медиа-раздела.
 * Размеры: L (article hero), M (mobile hero), S (article card).
 * Состояния: default, interactive, active (yellow), disabled.
 */
declare function Tag(props: TagProps): react_jsx_runtime.JSX.Element;

interface AuthorProps extends React$1.HTMLAttributes<HTMLDivElement> {
    name: string;
    avatarUrl?: string | null;
    /** ISO date string */
    date?: string;
    /** Full — 2-line (name, date on separate row with calendar). Short — single row (name + date). */
    variant?: "full" | "short";
    /**
     * Если `false` и `avatarUrl` отсутствует/пустой — не рендерим круглый блок
     * с инициалами (в карточках медиа дизайнер решает не показывать заглушку).
     * По умолчанию `true` — прежнее поведение с fallback-инициалами.
     */
    showAvatarFallback?: boolean;
}
/**
 * Author — блок «автор + дата» для hero статьи (Full) и карточки (Short).
 */
declare function Author({ name, avatarUrl, date, variant, showAvatarFallback, className, ...props }: AuthorProps): react_jsx_runtime.JSX.Element;

interface KeyThoughtsProps extends React$1.HTMLAttributes<HTMLUListElement> {
    thoughts: string[];
}
/**
 * KeyThoughts — закреплённые «ключевые мысли» редактора.
 * Вертикальная полоса слева + Label 16 UPPER.
 */
declare function KeyThoughts({ thoughts, className, ...props }: KeyThoughtsProps): react_jsx_runtime.JSX.Element | null;

interface ArticleNavItem {
    id: string;
    label: string;
}
interface ArticleNavProps extends React$1.HTMLAttributes<HTMLElement> {
    items: ArticleNavItem[];
    activeId?: string | null;
    /** Called when user clicks a nav item. If omitted, uses href="#id". */
    onNavigate?: (id: string) => void;
}
/**
 * ArticleNav — левая ToC-навигация статьи, автосборка из H2-заголовков тела.
 * Width 268 (fixed), items Label 18 UPPER, activeId подсвечивается жёлтым.
 * Возвращает null если items пусты — компонент не рендерится.
 */
declare function ArticleNav({ items, activeId, onNavigate, className, ...props }: ArticleNavProps): react_jsx_runtime.JSX.Element | null;

type ArticleCardVariant = "default" | "wide";
/** 8 акцентных DS-палитр (см. `design/design-system.md` §1.4). */
type ArticleCardTypeBadgeColor = "yellow" | "violet" | "sky" | "terracotta" | "pink" | "blue" | "red" | "green";
interface ArticleCardProps extends React$1.HTMLAttributes<HTMLElement> {
    /** If omitted — карточка рендерится как статичное превью без ссылки и без стрелки-выноски. */
    href?: string;
    title: string;
    description?: string;
    coverUrl?: string | null;
    tags?: string[];
    authorName?: string;
    authorAvatarUrl?: string | null;
    date?: string;
    /** Max tags to show (excess are clipped). Default 3. */
    maxTags?: number;
    /**
     * Бейдж типа статьи. Рендерится первым в ленте тегов с фоном из DS-палитры.
     * Используется для системных типов «Урок» (sky) / «Кейс» (terracotta);
     * на странице самой статьи такие теги выводятся как обычные, без `typeBadge`.
     */
    typeBadge?: {
        label: string;
        color: ArticleCardTypeBadgeColor;
    };
    /**
     * "default" — обычная карточка (обложка сверху, контент ниже).
     * "wide" — широкая: обложка слева, теги и автор справа, заголовок с описанием
     *   во всю ширину под обложкой.
     * Default "default".
     */
    variant?: ArticleCardVariant;
}
/**
 * ArticleCard — floating glass-панель для списка статей на /media.
 *
 * Варианты:
 * - default: обложка сверху (overlap), теги снизу обложки, title+description+author.
 * - wide: обложка слева (~60%), справа колонка с тегами сверху и автором снизу,
 *   title+description во всю ширину ниже.
 *
 * Высота карточки фиксирована. Типографика заголовка и описания адаптивна:
 * система клэмпит заголовок по `maxTitleLines` и, измерив сколько строк он
 * фактически занял, выбирает количество строк описания так, чтобы карточка
 * сохраняла одинаковую высоту в сетке.
 *
 * Адаптивные правила (lines of title → lines of description):
 *   default: 1→5, 2→3, 3→2
 *   wide:    1→2, 2→1
 */
declare function ArticleCard({ href, title, description, coverUrl, tags, authorName, authorAvatarUrl, date, maxTags, typeBadge, variant, className, ...props }: ArticleCardProps): react_jsx_runtime.JSX.Element;

type GlossaryTermItem = {
    slug: string;
    title: string;
    /** Href куда ведёт ссылка на термин. Обычно `/media/glossary/{slug}`. */
    href: string;
    tagIds?: string[];
};
type GlossaryScript = "cyrillic" | "latin";
/**
 * Возвращает скрипт первой буквы (cyrillic/latin). Используется для разделения
 * списка на две вкладки А-Я / A-Z. Термины не на буквах (#, цифры) попадают
 * в latin bucket.
 */
declare function getGlossaryTermScript(title: string): GlossaryScript;
/**
 * Группирующая буква (uppercase). Ё схлопывается в Е. Для не-буквенных
 * символов возвращает "#".
 */
declare function getGlossaryTermLetter(title: string): string;
interface GlossaryWidgetProps extends React$1.HTMLAttributes<HTMLElement> {
    /** Все термины. Компонент сам сортирует и группирует. */
    items: GlossaryTermItem[];
    /** Ссылка на full-страницу глоссария. Дефолт `/media/glossary`. */
    fullPageHref?: string;
    /** Заголовок виджета. Дефолт «ГЛОССАРИЙ». */
    heading?: string;
    /** Placeholder поиска. */
    searchPlaceholder?: string;
    /** Максимум терминов всего. По дефолту показываем все. */
    maxItems?: number;
    /**
     * Если задано — шапка (название + ссылка + поиск) закрепляется `sticky`
     * на указанном значении `top` (CSS value, напр. "7rem"). Список терминов
     * прокручивается вместе со страницей и уходит в фейд под шапкой через
     * gradient-хвост. Если не задано — классическая раскладка одной карточкой.
     */
    stickyTop?: string;
}
/**
 * GlossaryWidget — aside-колонка на /media с превью глоссария.
 * Показывает header со стрелкой (ссылка на полный глоссарий), поиск
 * и сгруппированный по буквам список терминов.
 */
declare function GlossaryWidget({ items, fullPageHref, heading, searchPlaceholder, maxItems, stickyTop, className, ...props }: GlossaryWidgetProps): react_jsx_runtime.JSX.Element;
interface GlossaryListProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Все термины. */
    items: GlossaryTermItem[];
    /** Активный скрипт. */
    script: GlossaryScript;
}
/**
 * GlossaryList — 4-колоночный (multi-column) список терминов для /media/glossary.
 * Принимает уже отфильтрованные по script/tag/query термины и рендерит их
 * сгруппированными по букве с letter-headings.
 */
declare function GlossaryList({ items, script, className, ...props }: GlossaryListProps): react_jsx_runtime.JSX.Element;
/**
 * ScriptToggle — переключатель А-Я / A-Z для страницы глоссария.
 */
interface GlossaryScriptToggleProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: GlossaryScript;
    onChange: (script: GlossaryScript) => void;
}
declare function GlossaryScriptToggle({ value, onChange, className, ...props }: GlossaryScriptToggleProps): react_jsx_runtime.JSX.Element;

type ArticleBodyBlockType = "h2" | "h3" | "h4" | "paragraph" | "quote" | "image" | "gallery" | "video" | "table";
/** Структура table-блока (см. Figma 1417:24035 / 1446:34320). */
interface ArticleTableData {
    /** Прямоугольный массив ячеек: rows[r][c]. Все строки имеют одинаковую длину. */
    rows: string[][];
    /** Если true — первая строка рендерится как шапка (label-стиль, muted color). */
    hasHeader: boolean;
}
interface ArticleGalleryItem {
    id: string;
    title: string;
    src: string;
    /** Тип контента таба. Default — image (для обратной совместимости). */
    kind?: "image" | "video";
    /** Опциональная подпись под активным медиа. Пустая — не рендерится. */
    caption?: string;
}
/**
 * Карточка фактоида (factoid-grid). Большая цифра H2 + текст-описание Copy 16.
 * `accent: true` — жёлтая подложка `--rm-yellow-100` с тёмным текстом.
 */
interface FactoidCardData {
    id: string;
    number: string;
    text: string;
    accent: boolean;
    /**
     * Принудительно начать новую строку с этой карточки. Реализуется через
     * `grid-column-start: 1` — пустые ячейки предыдущей строки остаются
     * пустыми (фон `--rm-gray-3` остаётся видим, как разделитель). Кнопка
     * «Карточка ниже» в редакторе ставит этот флаг.
     */
    newRow?: boolean;
}
interface ArticleBodyBlock {
    id: string;
    type: ArticleBodyBlockType;
    data: {
        text?: string;
    } & Record<string, unknown>;
}
interface ArticleBodyProps extends React$1.HTMLAttributes<HTMLDivElement> {
    blocks: ArticleBodyBlock[];
}
declare function slugify(input: string): string;
/**
 * FactoidGrid — section-level сетка карточек-фактоидов. Рендерится поверх
 * содержимого секции (всегда сверху, под H2), не как блок тела статьи.
 *
 * Кол-во колонок: явный `cols` (если задан) или авто-кламп по `cards.length`
 * (max 3). Колонки задаются inline через `grid-template-columns` — Tailwind
 * не нужен, гарантирует что при `cols=3` и виде ≥768 рендерится именно 3 кол.
 *
 * Бордеры — поячеечно (right + bottom всегда; первая строка — top; первая
 * колонка — left). У пустых ячеек неполного последнего ряда рамок нет —
 * никто их не рисует.
 *
 * Третья карточка визуально вылезает в col-4 — это делает обёртка
 * [data-section-factoids] + sync в article-page-client.
 */
declare function FactoidGrid({ cards, cols, className, }: {
    cards: FactoidCardData[];
    cols?: 1 | 2 | 3;
    className?: string;
}): react_jsx_runtime.JSX.Element | null;
/**
 * ArticleBody — тело статьи /media/[slug]. Рендерит типизированные блоки
 * (h2/h3/paragraph/quote) с единой логикой вертикального ритма.
 * См. DS MD §11.7 для таблицы отступов.
 *
 * H2 получают id = slugify(text) — используются ArticleNav scrollspy-ом и
 * якорными ссылками.
 */
declare function ArticleBody({ blocks, className, ...props }: ArticleBodyProps): react_jsx_runtime.JSX.Element | null;

interface VideoPlayerProps extends Omit<React$1.VideoHTMLAttributes<HTMLVideoElement>, "controls" | "onError"> {
    /** URL исходного видеофайла. Обязательный. */
    src: string;
    /** Постер-картинка до старта воспроизведения. */
    poster?: string;
    /** Классы для внешнего контейнера. */
    className?: string;
    /** Расширение классов для самого `<video>`. По умолчанию object-contain. */
    videoClassName?: string;
    /** Aspect-ratio контейнера до загрузки метаданных. Default: 16/9. */
    aspectRatio?: number;
}
/**
 * VideoPlayer — кастомный плеер поверх HTML5 `<video>`.
 * Контролы: play/pause, scrubber, time, volume slider, fullscreen.
 * Клавиши: Space/K — play/pause, ←/→ — ±5s, ↑/↓ — громкость ±5%,
 * M — mute, F — fullscreen, Home/End — в начало/конец.
 * Контролы автоскрываются через 2s при воспроизведении, показываются
 * на hover/mousemove/focus. При паузе/на постере — всегда видны.
 */
declare function VideoPlayer({ src, poster, className, videoClassName, aspectRatio, preload, playsInline, ...rest }: VideoPlayerProps): react_jsx_runtime.JSX.Element;

interface ExpertQuoteItem {
    id: string;
    /** Label — UPPERCASE тезис (Label 18 desktop / Label 16 mobile). */
    label?: string;
    /** Параграфы основного текста цитаты (Copy 16). */
    paragraphs?: string[];
    /** Имя автора (обязательно — хотя бы fallback). */
    name: string;
    /** Должность / роль. */
    role: string;
    /** URL аватара, 72×72 desktop / 64×64 mobile. */
    avatarUrl?: string | null;
}
interface ExpertQuoteStackProps {
    quotes: ExpertQuoteItem[];
    /**
     * Вариант раскладки:
     *  - `mobile` — column-стэк с горизонтальным разделителем между text и
     *    author внутри каждой цитаты, маленькие padding'и (20px);
     *  - `narrow` — column в одной рамке, автор плашкой внизу, padding 32;
     *  - `wide` — row-split: слева текст, справа автор, внутренний vertical
     *    divider. Все элементы сетки делят общую рамку.
     */
    variant: "mobile" | "narrow" | "wide";
    className?: string;
}
/**
 * ExpertQuoteStack — монолитный блок из одной или нескольких цитат экспертов.
 * Все цитаты делят общую рамку #404040; между ними — горизонтальный
 * разделитель в один пиксель. Тёмная палитра фиксирована, независимо от
 * темы страницы (спец-виджет — как Gallery/VideoPlayer).
 */
declare function ExpertQuoteStack({ quotes, variant, className, }: ExpertQuoteStackProps): react_jsx_runtime.JSX.Element | null;

type SectionAsideChipCropMode = "top" | "center";
interface SectionAsideChipProps extends Omit<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
    /** Текст внутри chip — название файла или ссылки. */
    title: string;
    /** Переход: для файла — fileUrl, для внешней ссылки — url. */
    href: string;
    /** Открывать ли превью 3:2 сверху. */
    showPreview?: boolean;
    /** Ручной preview-image URL (только когда showPreview=true). */
    previewImageUrl?: string;
    /** Как позиционировать превью при кропе 3:2: от верха картинки или по центру. */
    previewCropMode?: SectionAsideChipCropMode;
    /** `true` → `target=_blank`; для скачивания файла можно передать `download`. */
    external?: boolean;
    /** Если нужно скачивание (для файла) — передайте name. Передаёт атрибут `download`. */
    download?: string;
}
/**
 * SectionAsideChip — единый виджет правой колонки для файла и внешней ссылки.
 * С превью — крупная карточка 3:2 сверху + строка с названием и стрелкой ↗.
 * Без превью — компактная строка с названием и стрелкой.
 *
 * Вся карточка — кликабельная область (anchor). Иконка ↗ видимо усиливает
 * affordance перехода, но сам по себе не захватывает клик — весь блок ссылка.
 */
declare const SectionAsideChip: React$1.ForwardRefExoticComponent<SectionAsideChipProps & React$1.RefAttributes<HTMLAnchorElement>>;

interface SectionAsideProductCardExpert {
    name: string;
    image: string | null;
}
interface SectionAsideProductCardProps extends Omit<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
    /** URL страницы продукта (например `/consulting/ecosystem-strategy`). */
    href: string;
    /** Заголовок продукта (uppercase, 1–2 строки). */
    title: string;
    /** Короткое описание. */
    description?: string;
    /** Cover-иллюстрация продукта (если есть — convention `/images/products/<cat>/<slug>/cover.*`). */
    coverUrl?: string | null;
    /** Эксперты — первые 2 показываются, остальные → «+N». */
    experts?: SectionAsideProductCardExpert[];
    /**
     * Визуальный вариант:
     * - `default` — 72×72 thumb + аватары экспертов (используется для consulting).
     * - `image` — широкая картинка 286×191 с bottom-fade градиентом, без экспертов
     *   (см. Figma 1562:26932 — используется для academy/ai-products).
     */
    variant?: "default" | "image";
}
/**
 * Мини-карточка продукта для правой колонки секции статьи.
 * Варианты:
 *   - `default` — верхний ряд: 72×72 cover + аватары экспертов (2 + «+N»).
 *   - `image` — широкая cover-картинка с bottom-fade градиентом, без экспертов.
 * Ниже — заголовок uppercase bold + описание. Стрелка ↗ в правом верхнем углу.
 */
declare const SectionAsideProductCard: React$1.ForwardRefExoticComponent<SectionAsideProductCardProps & React$1.RefAttributes<HTMLAnchorElement>>;

type RichTextProps = {
    text: string;
    className?: string;
    /** Class for inner <p>, <ul>, <ol> elements. */
    blockClassName?: string;
};
/**
 * Renders text with markdown-style list recognition:
 *   - "- text" / "• text" → bullet list
 *   - "1. text" / "1) text" → numbered list
 *   - newline → paragraph break
 *
 * Lists get 4px top spacing and 4px between items.
 */
declare function RichText({ text, className, blockClassName }: RichTextProps): react_jsx_runtime.JSX.Element | null;

type ForWhomFact = {
    title: string;
    text: string;
};
type ForWhomSectionProps = {
    /** Section tag, e.g. "для кого" */
    tag: string;
    /** Main heading */
    title: string;
    /** Secondary (gray) part of heading — rendered in same h2 for SEO */
    titleSecondary?: string;
    /** Subtitle / lead text (optional) — legacy single string (uppercase primary). */
    subtitle?: string;
    /** Structured paragraphs with per-paragraph caps + color. Supersedes `subtitle` when provided. */
    paragraphs?: StyledParagraph[];
    /** 2–4 fact cards */
    facts: ForWhomFact[];
    /**
     * When 3 facts: which column gets the wide (single) card.
     * "left" = wide card in column 1 (2 cards in column 2)
     * "right" = wide card in column 2 (2 cards in column 1)
     * Default: "right"
     */
    wideColumn?: "left" | "right";
    className?: string;
};
declare function ForWhomSection({ tag, title, titleSecondary, subtitle, paragraphs, facts, wideColumn, className, }: ForWhomSectionProps): react_jsx_runtime.JSX.Element;

type SocialKind = "vk" | "telegram" | "max" | "custom";
type ContactSocial = {
    id: string;
    kind: SocialKind;
    /** For custom kind — URL/data-URL to SVG or PNG icon. */
    iconSrc?: string;
    username: string;
    url: string;
};
type ContactPersonData = {
    /** Rendered avatar URL (resolved by the host app from an expert slug or custom upload). */
    avatar: string | null;
    name: string;
    role: string;
    phone?: string;
    social?: {
        kind: SocialKind;
        iconSrc?: string;
        username: string;
        url: string;
    };
};
type ContactCardItem = {
    id: string;
    kind: "paragraph";
    paragraph: StyledParagraph;
} | {
    id: string;
    kind: "socials";
    socials: ContactSocial[];
} | {
    id: string;
    kind: "person";
    person: ContactPersonData;
};
type ContactCard = {
    id: string;
    title: string;
    items: ContactCardItem[];
};
type ContactsSectionProps = {
    tag: string;
    title: string;
    titleSecondary?: string;
    subtitle?: string;
    paragraphs?: StyledParagraph[];
    cards: ContactCard[];
    className?: string;
};
declare function ContactsSection({ tag, title, titleSecondary, subtitle, paragraphs, cards, className, }: ContactsSectionProps): react_jsx_runtime.JSX.Element;

declare function VkIcon({ className, ...props }: React$1.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function TelegramIcon({ className, ...props }: React$1.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function MaxIcon({ className, ...props }: React$1.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

type ProcessStep = {
    number: string;
    title: string;
    text: string;
    duration: string;
};
type ProcessParticipant = {
    role: string;
    text: string;
};
/** @deprecated Use `StyledParagraph` from `@rocketmind/ui` instead. */
type ProcessDescriptionParagraph = {
    text: string;
    /** If true, paragraph renders in the uppercase label-18 mono style. */
    uppercase?: boolean;
};
type ProcessSectionProps = {
    tag: string;
    title: string;
    titleSecondary?: string;
    subtitle: string;
    /** If true (default), subtitle renders in uppercase label-18 mono. */
    subtitleUppercase?: boolean;
    /** Legacy single-string description (uppercase mono). */
    description?: string;
    /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
    paragraphs?: StyledParagraph[];
    /** @deprecated Use `paragraphs` instead. */
    descriptionParagraphs?: ProcessDescriptionParagraph[];
    steps: ProcessStep[];
    participantsTag?: string;
    participants?: ProcessParticipant[];
    /** "product" (default) = timeline animation, "academy" = horizontal flat steps */
    variant?: "product" | "academy";
    className?: string;
};
declare function ProcessSection({ tag, title, titleSecondary, subtitle, subtitleUppercase, description, paragraphs, descriptionParagraphs, steps, participantsTag, participants, variant, className, }: ProcessSectionProps): react_jsx_runtime.JSX.Element;

type ResultCard = {
    title: string;
    text: string;
};
type ResultsSectionProps = {
    tag: string;
    title: string;
    titleSecondary?: string;
    /** Legacy single-string description (plain secondary text). */
    description?: string;
    /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
    paragraphs?: StyledParagraph[];
    cards: ResultCard[];
    className?: string;
};
declare function ResultsSection({ tag, title, titleSecondary, description, paragraphs, cards, className, }: ResultsSectionProps): react_jsx_runtime.JSX.Element;

interface ServiceCardData {
    /** Card heading (uppercase) */
    title: string;
    /** Paragraph array — each entry renders as a separate <p> */
    paragraphs: string[];
    /** Show the arrow icon in the top-right corner */
    showArrow?: boolean;
    /** Optional link target — makes the whole card clickable */
    href?: string;
    /** Bento grid sizing (1–2 cols / 1–2 rows). Defaults to 1/1. */
    colSpan?: 1 | 2;
    rowSpan?: 1 | 2;
    /** Highlight card with yellow background (featured variant) */
    featured?: boolean;
    /** For wide cards (colSpan=2): render paragraphs in two columns */
    paragraphsTwoCol?: boolean;
}
interface ServicesSectionProps {
    tag?: string;
    title: string;
    titleSecondary?: string;
    /** Legacy single-string description (plain secondary text). */
    description?: string;
    /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
    paragraphs?: StyledParagraph[];
    cards: ServiceCardData[];
    className?: string;
    /**
     * Click-handler карточки. Если задан — карточка рендерится как `<button>`
     * (даже если у неё есть `href`). Используется для открытия формы страницы
     * с предзаданным чипсом = заголовок карточки.
     */
    onCardClick?: (card: ServiceCardData) => void;
}
declare function ServicesSection({ tag, title, titleSecondary, description, paragraphs, cards, className, onCardClick, }: ServicesSectionProps): react_jsx_runtime.JSX.Element | null;
/**
 * Assign bento-style sizing to cards based on content volume, then sort so
 * larger cards tend to come first for dense packing on a 4-column grid.
 */
declare function repackBento(cards: ServiceCardData[]): ServiceCardData[];

type Expert = {
    tag?: string;
    name: string;
    shortBio?: string;
    bio: string;
    image: string | null;
};
type ExpertsSectionProps = {
    experts: Expert[];
    className?: string;
};
declare function ExpertsSection({ experts, className, }: ExpertsSectionProps): react_jsx_runtime.JSX.Element | null;

type HeroExpert = {
    name: string;
    tag?: string;
    image: string | null;
};
type HeroExpertsProps = {
    experts: HeroExpert[];
    /** Optional quote shown below the expert block */
    quote?: string;
    /** Max avatars before collapsing the rest into a "+N" counter. Default: 20 */
    maxVisible?: number;
    className?: string;
};
declare function HeroExperts({ experts, quote, maxVisible, className, }: HeroExpertsProps): react_jsx_runtime.JSX.Element | null;

type ToolCard = {
    number: string;
    title: string;
    text: string;
    icon?: string | null;
    wide?: boolean;
    /** Yellow accent card: filled #FFCC00 background, dark text. */
    accent?: boolean;
};
type ToolsSectionProps = {
    tag: string;
    title: string;
    titleSecondary?: string;
    /** Legacy single-string description (uppercase mono secondary). */
    description?: string;
    /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
    paragraphs?: StyledParagraph[];
    tools: ToolCard[];
    /** Show icons instead of numbers */
    useIcons?: boolean;
    /** Render description under the heading (full width) instead of to the right. Desktop only. */
    descriptionBelow?: boolean;
    className?: string;
};
declare function ToolsSection({ tag, title, titleSecondary, description, paragraphs, tools, useIcons, descriptionBelow, className, }: ToolsSectionProps): react_jsx_runtime.JSX.Element;

type AccordionFAQItem = {
    id: string;
    q: string;
    a: string;
};
type AccordionFAQProps = {
    items?: AccordionFAQItem[];
    /** Which items are open by default (by id). Default: ["3"] */
    defaultOpen?: string[];
    className?: string;
};
declare function AccordionFAQ({ items, defaultOpen, className, }: AccordionFAQProps): react_jsx_runtime.JSX.Element;

type CTASectionDarkProps = {
    /** Heading text */
    heading?: string;
    /** Body text below heading */
    body?: string;
    /** Button label */
    buttonText?: string;
    /** Button href */
    href?: string;
    className?: string;
};
/**
 * CTA Dark — тёмный блок с жёлтой кнопкой и декоративным кругом.
 *
 * Figma: 1400×424 px
 * - Фон: #0A0A0A (dark bg)
 * - Кнопка: --rm-yellow-100 (#FFCC00)
 * - Декор: круг 789×789 px с dot-pattern и yellow radial glow
 */
declare function CTASectionDark({ heading, body, buttonText, href, className, }: CTASectionDarkProps): react_jsx_runtime.JSX.Element;

type CTASectionYellowProps = {
    /** Heading text */
    heading?: string;
    /** Body text below heading */
    body?: string;
    /** Button label */
    buttonText?: string;
    /** Button href. Игнорируется, если передан `onClick`. */
    href?: string;
    /** Если задан — кнопка рендерится как `<button>` и вызывает onClick (для открытия модалки). */
    onClick?: () => void;
    /**
     * Варианты вёрстки.
     * - `"default"` — полноразмерный CTA для конца страницы (с боковыми отступами,
     *   крупный H1/H2-заголовок, fixed aspect ratio).
     * - `"article"` — компактный для тела статьи: full-bleed (без боковых px),
     *   заголовок H3, меньше внутренних отступов.
     */
    variant?: "default" | "article";
    className?: string;
};
/**
 * CTA Yellow — жёлтый блок с золотым сечением.
 *
 * Figma: 458-436 (desktop 646×400) / 458-437 (mobile 353×571)
 * - Фон: #FFCC00 (--rm-yellow-100)
 * - Текст/кнопка: #0A0A0A
 * - Спираль: #FFE066 (--rm-yellow-300)
 */
declare function CTASectionYellow({ heading, body, buttonText, href, onClick, variant, className, }: CTASectionYellowProps): react_jsx_runtime.JSX.Element;

type CTASectionMiniProps = {
    heading?: string;
    body?: string;
    buttonText?: string;
    href?: string;
    onClick?: () => void;
    className?: string;
};
/**
 * Mini-CTA для правой колонки статей — компактный жёлтый блок,
 * визуально соразмерный sidebar-айтемам (~300px ширина).
 */
declare function CTASectionMini({ heading, body, buttonText, href, onClick, className, }: CTASectionMiniProps): react_jsx_runtime.JSX.Element;

type FormFieldsConfig = {
    name: boolean;
    email: boolean;
    phone: boolean;
    message: boolean;
};
type FormChipsConfig = {
    enabled: boolean;
    multi: boolean;
    label: string;
};
type FormConsentLink = {
    id: string;
    label: string;
    url: string;
};
type FormConsentConfig = {
    text: string;
    links: FormConsentLink[];
};
type FormSuccessGift = {
    kind: "file" | "link";
    url: string;
    label: string;
};
type FormEntity = {
    id: string;
    name: string;
    scope: "product" | "article" | "both";
    title: string;
    description: string;
    submitButtonText: string;
    successMessage: string;
    successGift?: FormSuccessGift | null;
    fields: FormFieldsConfig;
    chips: FormChipsConfig;
    consent: FormConsentConfig;
};
type OpenContext = {
    /** Заголовок одного предвыбранного чипса (например, заголовок карточки услуги). */
    chipPrefilled?: string;
    /** Все доступные чипсы для этой страницы (заголовки карточек блока «Услуги»). */
    availableChips?: string[];
    /**
     * Конфиг чипсов из блока «Услуги» страницы (multi/label). Если не передан —
     * чипсы не рендерятся вообще, даже при наличии `availableChips`.
     */
    chipsConfig?: {
        multi?: boolean;
        label?: string;
    };
};
type ModalContextValue = {
    openForm: (formId: string, ctx?: OpenContext) => void;
};
declare function useFormModal(): ModalContextValue;
type SubmitHandler = (form: FormEntity, payload: Record<string, unknown>) => Promise<void> | void;
declare function ModalProvider({ forms, children, onSubmit, defaultConsentLinks, }: {
    forms: FormEntity[];
    children: ReactNode;
    onSubmit?: SubmitHandler;
    /**
     * Дефолтные ссылки на документы для consent-чекбокса (Политика, согласие на
     * обработку ПД и т.п.). Используются, когда у формы `consent.links` пустой —
     * то есть админ не задал кастомные ссылки. Передавать relative paths
     * (`/legal/...`) — они переживают смену домена и base-path.
     */
    defaultConsentLinks?: FormConsentLink[];
}): react_jsx_runtime.JSX.Element;
declare function DynamicForm({ form, chipPrefilled, availableChips, chipsConfig, defaultConsentLinks, onSubmit, }: {
    form: FormEntity;
    chipPrefilled?: string;
    availableChips?: string[];
    /**
     * Конфиг чипсов из контекста открытия (multi/label). Передаётся блоком
     * «Услуги» страницы — там же админ настраивает single/multi и заголовок.
     * Если не передан, чипсы не рендерятся.
     */
    chipsConfig?: {
        multi?: boolean;
        label?: string;
    };
    /** Дефолтные ссылки consent — используются если у формы `consent.links` пуст. */
    defaultConsentLinks?: FormConsentLink[];
    onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
}): react_jsx_runtime.JSX.Element;

type LogoMarqueeItem = {
    alt: string;
    src: string;
    width?: number;
    height?: number;
};
type InfiniteLogoMarqueeProps = {
    className?: string;
    logos: LogoMarqueeItem[];
    /** Duration of one full loop in seconds. Default: 83 */
    speedSeconds?: number;
    /** Gap between logos in pixels. Default: 67 */
    gap?: number;
    /** Maximum logo height in pixels. Default: 39 */
    maxLogoHeight?: number;
    /** Width of the fade mask on each edge in pixels. Default: 44 */
    fadeWidth?: number;
    /** Reverse scroll direction (left-to-right). Default: false */
    reverse?: boolean;
};
declare function InfiniteLogoMarquee({ className, logos, speedSeconds, gap, maxLogoHeight, fadeWidth, reverse, }: InfiniteLogoMarqueeProps): react_jsx_runtime.JSX.Element | null;

/**
 * Единый источник данных навигации сайта.
 * Используется в Header (RocketmindMenu), MobileNav и Footer.
 */
type NavItem = {
    href: string;
    title: string;
    description: string;
};
type NavSection = {
    href: string;
    label: string;
    items?: NavItem[];
};
declare const HEADER_NAV: NavSection[];

declare function MobileNav({ className, nav, }: {
    className?: string;
    /** Navigation tree. Falls back to the hardcoded HEADER_NAV when omitted. */
    nav?: NavSection[];
}): react_jsx_runtime.JSX.Element;

type RocketmindMenuProps = {
    className?: string;
    itemClassName?: string;
    showDropdowns?: boolean;
    /** Navigation tree. Falls back to the hardcoded HEADER_NAV when omitted. */
    nav?: NavSection[];
};
declare function RocketmindMenu({ className, itemClassName, showDropdowns, nav, }: RocketmindMenuProps): react_jsx_runtime.JSX.Element;

interface WaveAnimationProps {
    /** Fixed width in px. If omitted, the component fills the parent container. */
    width?: number;
    /** Fixed height in px. If omitted, the component fills the parent container. */
    height?: number;
    pointSize?: number;
    waveSpeed?: number;
    waveIntensity?: number;
    particleColor?: string;
    gridDistance?: number;
    /** Depth (distance from camera) where fade starts. Default 20. */
    fadeNear?: number;
    /** Depth where fade reaches 0. Default 200. */
    fadeFar?: number;
    className?: string;
}
declare function WaveAnimation({ width, height, pointSize, waveSpeed, waveIntensity, particleColor, gridDistance, fadeNear, fadeFar, className, }: WaveAnimationProps): react_jsx_runtime.JSX.Element;

type DottedSurfaceProps = Omit<React__default.ComponentProps<'div'>, 'ref'>;
declare function DottedSurface({ className, ...props }: DottedSurfaceProps): react_jsx_runtime.JSX.Element;

type SiteFooterProps = {
    /** Base path for static assets (logo). Default: "" */
    basePath?: string;
    className?: string;
    /** Content rendered on top of the DottedSurface area (e.g. chat widget) */
    children?: React.ReactNode;
    /** Navigation tree (header sections). When omitted, falls back to hardcoded constants. */
    nav?: NavSection[];
    /** Company column links. When omitted, falls back to hardcoded defaults + LEGAL_LINKS. */
    companyLinks?: {
        href: string;
        label: string;
    }[];
    /** Legal column links. When omitted, falls back to LEGAL_LINKS. */
    legalLinks?: {
        href: string;
        label: string;
    }[];
};
declare function SiteFooter({ basePath, className, children, nav, companyLinks, legalLinks, }: SiteFooterProps): react_jsx_runtime.JSX.Element;

type SiteHeaderCta = {
    /** Текст кнопки (например, «Оставить заявку»). Если пусто — кнопка не рендерится. */
    buttonText?: string;
    /** ID формы, открывается по клику. Если пусто — кнопка не рендерится. */
    formId?: string;
};
type SiteHeaderProps = {
    /** Base path for static assets (logo). Default: "" */
    basePath?: string;
    className?: string;
    /** Navigation tree. Falls back to the hardcoded HEADER_NAV when omitted. */
    nav?: NavSection[];
    /**
     * CTA-кнопка справа от меню (на мобиле — слева от бургера). Открывает форму
     * по `formId` через `ModalProvider`. Если `buttonText` или `formId` пусты —
     * не рендерится.
     */
    cta?: SiteHeaderCta;
};
declare function SiteHeader({ basePath, className, nav, cta, }: SiteHeaderProps): react_jsx_runtime.JSX.Element;

export { AccordionFAQ, type AccordionFAQItem, type AccordionFAQProps, ArticleBody, type ArticleBodyBlock, type ArticleBodyBlockType, type ArticleBodyProps, ArticleCard, type ArticleCardProps, type ArticleCardTypeBadgeColor, type ArticleCardVariant, type ArticleGalleryItem, ArticleNav, type ArticleNavItem, type ArticleNavProps, type ArticleTableData, Author, type AuthorProps, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeSize, type BadgeVariant, type BreadcrumbItem, Breadcrumbs, type BreadcrumbsProps, Button, CTASectionDark, type CTASectionDarkProps, CTASectionMini, type CTASectionMiniProps, CTASectionYellow, type CTASectionYellowProps, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, type ContactCard, type ContactCardItem, type ContactPersonData, type ContactSocial, ContactsSection, type ContactsSectionProps, DOT_GRID_LENS_DEFAULTS, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DotGridLens, type DotGridLensProps, DottedSurface, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, DynamicForm, type Expert, type ExpertQuoteItem, ExpertQuoteStack, type ExpertQuoteStackProps, ExpertsSection, type ExpertsSectionProps, type FactoidCardData, FactoidGrid, type ForWhomFact, ForWhomSection, type ForWhomSectionProps, type FormChipsConfig, type FormConsentConfig, type FormConsentLink, type FormEntity, type FormFieldsConfig, type FormSuccessGift, GlossaryList, type GlossaryListProps, type GlossaryScript, GlossaryScriptToggle, type GlossaryScriptToggleProps, type GlossaryTermItem, GlossaryWidget, type GlossaryWidgetProps, GlowingEffect, type HeroExpert, HeroExperts, type HeroExpertsProps, InfiniteLogoMarquee, type InfiniteLogoMarqueeProps, Input, InputOTP, type InputOTPProps, KeyThoughts, type KeyThoughtsProps, type LogoMarqueeItem, MaxIcon, MobileNav, ModalProvider, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, Note, NoteDescription, NoteEyebrow, NoteTitle, PartnershipBlock, type PartnershipBlockProps, type PartnershipLogo, type PartnershipPhoto, type ProcessDescriptionParagraph, type ProcessParticipant, ProcessSection, type ProcessSectionProps, type ProcessStep, ProductCard, type ProductCardExpert, type ProductCardProps, ProductImageCard, type ProductImageCardFactoid, type ProductImageCardProps, Radio, type ResultCard, ResultsSection, type ResultsSectionProps, RichText, type RichTextProps, RocketmindMenu, ScrollArea, ScrollBar, SearchCombobox, type SearchComboboxOption, SectionAsideChip, type SectionAsideChipCropMode, type SectionAsideChipProps, SectionAsideProductCard, type SectionAsideProductCardExpert, type SectionAsideProductCardProps, Separator, type ServiceCardData, ServicesSection, type ServicesSectionProps, ShowMore, ShowMorePanel, type ShowMorePanelProps, type ShowMoreProps, SiteFooter, type SiteFooterProps, SiteHeader, type SiteHeaderCta, type SiteHeaderProps, Skeleton, Slider, type SliderProps, type SocialKind, type StyledParagraph, type StyledParagraphColor, StyledParagraphs, type StyledParagraphsProps, type StyledParagraphsSize, type StyledParagraphsTheme, Switch, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Tag, type TagProps, type TagSize, type TagState, TelegramIcon, Textarea, ThemeProvider, Toaster, type ToolCard, ToolsSection, type ToolsSectionProps, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, VideoPlayer, type VideoPlayerProps, VkIcon, WaveAnimation, type WaveAnimationProps, avatarVariants, badgeVariants, buttonVariants, checkboxBaseClassName, cn, getGlossaryTermLetter, getGlossaryTermScript, inputVariants, noteVariants, radioBaseClassName, repackBento, resolveStyledParagraphs, HEADER_NAV as rocketmindMenuItems, slugify as slugifyArticleHeading, styledParagraphClassName, tabsListVariants, tagVariants, textareaVariants, useFormModal };
