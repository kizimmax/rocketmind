import { ClassValue } from 'clsx';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
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
    className?: string;
}
declare function ShowMore({ expanded, onClick, label, labelExpanded, fade, fadeBg, className, }: ShowMoreProps): react_jsx_runtime.JSX.Element;
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
    /** Description text */
    description: string;
    /** Partner logos (max ~4, displayed inline) */
    logos: PartnershipLogo[];
    /** Photos for 2×2 grid (exactly 4) */
    photos: PartnershipPhoto[];
    className?: string;
}
declare function PartnershipBlock({ caption, title, description, logos, photos, className, }: PartnershipBlockProps): react_jsx_runtime.JSX.Element;

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
    /** Subtitle / lead text (optional) */
    subtitle?: string;
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
declare function ForWhomSection({ tag, title, titleSecondary, subtitle, facts, wideColumn, className, }: ForWhomSectionProps): react_jsx_runtime.JSX.Element;

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
type ProcessSectionProps = {
    tag: string;
    title: string;
    titleSecondary?: string;
    subtitle: string;
    description?: string;
    steps: ProcessStep[];
    participantsTag?: string;
    participants?: ProcessParticipant[];
    /** "product" (default) = timeline animation, "academy" = horizontal flat steps */
    variant?: "product" | "academy";
    className?: string;
};
declare function ProcessSection({ tag, title, titleSecondary, subtitle, description, steps, participantsTag, participants, variant, className, }: ProcessSectionProps): react_jsx_runtime.JSX.Element;

type ResultCard = {
    title: string;
    text: string;
};
type ResultsSectionProps = {
    tag: string;
    title: string;
    titleSecondary?: string;
    description?: string;
    cards: ResultCard[];
    className?: string;
};
declare function ResultsSection({ tag, title, titleSecondary, description, cards, className, }: ResultsSectionProps): react_jsx_runtime.JSX.Element;

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
    description?: string;
    cards: ServiceCardData[];
    className?: string;
}
declare function ServicesSection({ tag, title, titleSecondary, description, cards, className, }: ServicesSectionProps): react_jsx_runtime.JSX.Element | null;
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
};
type ToolsSectionProps = {
    tag: string;
    title: string;
    titleSecondary?: string;
    description?: string;
    tools: ToolCard[];
    /** Show icons instead of numbers */
    useIcons?: boolean;
    className?: string;
};
declare function ToolsSection({ tag, title, titleSecondary, description, tools, useIcons, className, }: ToolsSectionProps): react_jsx_runtime.JSX.Element;

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
    /** Button href */
    href?: string;
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
declare function CTASectionYellow({ heading, body, buttonText, href, className, }: CTASectionYellowProps): react_jsx_runtime.JSX.Element;

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

declare function MobileNav({ className }: {
    className?: string;
}): react_jsx_runtime.JSX.Element;

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

type RocketmindMenuProps = {
    className?: string;
    itemClassName?: string;
    showDropdowns?: boolean;
};
declare function RocketmindMenu({ className, itemClassName, showDropdowns, }: RocketmindMenuProps): react_jsx_runtime.JSX.Element;

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

type SiteFooterProps = {
    /** Base path for static assets (logo). Default: "" */
    basePath?: string;
    className?: string;
    /** Content rendered on top of the WaveAnimation area (e.g. chat widget) */
    children?: React.ReactNode;
};
declare function SiteFooter({ basePath, className, children }: SiteFooterProps): react_jsx_runtime.JSX.Element;

type SiteHeaderProps = {
    /** Base path for static assets (logo). Default: "" */
    basePath?: string;
    className?: string;
};
declare function SiteHeader({ basePath, className }: SiteHeaderProps): react_jsx_runtime.JSX.Element;

export { AccordionFAQ, type AccordionFAQItem, type AccordionFAQProps, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeSize, type BadgeVariant, Button, CTASectionDark, type CTASectionDarkProps, CTASectionYellow, type CTASectionYellowProps, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, DOT_GRID_LENS_DEFAULTS, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DotGridLens, type DotGridLensProps, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, type Expert, ExpertsSection, type ExpertsSectionProps, type ForWhomFact, ForWhomSection, type ForWhomSectionProps, GlowingEffect, type HeroExpert, HeroExperts, type HeroExpertsProps, InfiniteLogoMarquee, type InfiniteLogoMarqueeProps, Input, InputOTP, type InputOTPProps, type LogoMarqueeItem, MobileNav, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, Note, NoteDescription, NoteEyebrow, NoteTitle, PartnershipBlock, type PartnershipBlockProps, type PartnershipLogo, type PartnershipPhoto, type ProcessParticipant, ProcessSection, type ProcessSectionProps, type ProcessStep, ProductCard, type ProductCardExpert, type ProductCardProps, ProductImageCard, type ProductImageCardFactoid, type ProductImageCardProps, Radio, type ResultCard, ResultsSection, type ResultsSectionProps, RichText, type RichTextProps, RocketmindMenu, ScrollArea, ScrollBar, SearchCombobox, type SearchComboboxOption, Separator, type ServiceCardData, ServicesSection, type ServicesSectionProps, ShowMore, ShowMorePanel, type ShowMorePanelProps, type ShowMoreProps, SiteFooter, type SiteFooterProps, SiteHeader, type SiteHeaderProps, Skeleton, Slider, type SliderProps, Switch, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, ThemeProvider, Toaster, type ToolCard, ToolsSection, type ToolsSectionProps, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, WaveAnimation, type WaveAnimationProps, avatarVariants, badgeVariants, buttonVariants, checkboxBaseClassName, cn, inputVariants, noteVariants, radioBaseClassName, repackBento, HEADER_NAV as rocketmindMenuItems, tabsListVariants, textareaVariants };
