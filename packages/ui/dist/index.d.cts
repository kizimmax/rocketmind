import { ClassValue } from 'clsx';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import { ThemeProvider as ThemeProvider$1 } from 'next-themes';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import { Button as Button$1 } from '@base-ui/react/button';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { Separator as Separator$1 } from '@base-ui/react/separator';
import { ToasterProps } from 'sonner';
import { Switch as Switch$1 } from '@base-ui/react/switch';
import { Tabs as Tabs$1 } from '@base-ui/react/tabs';
import { Tooltip as Tooltip$1 } from '@base-ui/react/tooltip';

declare function cn(...inputs: ClassValue[]): string;

declare function ThemeProvider({ children, ...props }: React$1.ComponentProps<typeof ThemeProvider$1>): react_jsx_runtime.JSX.Element;

declare const badgeVariants: (props?: ({
    variant?: "neutral" | "yellow-solid" | "yellow-subtle" | "violet-solid" | "violet-subtle" | "sky-solid" | "sky-subtle" | "terracotta-solid" | "terracotta-subtle" | "pink-solid" | "pink-subtle" | "blue-solid" | "blue-subtle" | "red-solid" | "red-subtle" | "green-solid" | "green-subtle" | "default" | "secondary" | "destructive" | "outline" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
type BadgeSize = VariantProps<typeof badgeVariants>["size"];
declare function Badge({ className, variant, size, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "secondary" | "destructive" | "outline" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "xs" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null | undefined;
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

declare const checkboxBaseClassName = "peer size-4 shrink-0 appearance-none rounded-sm border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-[var(--rm-yellow-100)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
declare const Checkbox: React$1.ForwardRefExoticComponent<Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    indeterminate?: boolean;
} & React$1.RefAttributes<HTMLInputElement>>;

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

declare const NavigationMenu: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuProps & React$1.RefAttributes<HTMLElement>, "ref"> & React$1.RefAttributes<HTMLElement>>;
declare const NavigationMenuList: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuListProps & React$1.RefAttributes<HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const NavigationMenuItem: React$1.ForwardRefExoticComponent<NavigationMenuPrimitive.NavigationMenuItemProps & React$1.RefAttributes<HTMLLIElement>>;
declare const NavigationMenuTrigger: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const NavigationMenuContent: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const NavigationMenuLink: React$1.ForwardRefExoticComponent<NavigationMenuPrimitive.NavigationMenuLinkProps & React$1.RefAttributes<HTMLAnchorElement>>;
declare const NavigationMenuViewport: React$1.ForwardRefExoticComponent<Omit<NavigationMenuPrimitive.NavigationMenuViewportProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const noteVariants: (props?: ({
    variant?: "neutral" | "error" | "info" | "success" | "warning" | "action" | null | undefined;
    tone?: "soft" | "filled" | null | undefined;
    disabled?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Note({ className, variant, tone, disabled, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof noteVariants>): react_jsx_runtime.JSX.Element;
declare function NoteEyebrow({ className, ...props }: React$1.ComponentProps<"p">): react_jsx_runtime.JSX.Element;
declare function NoteTitle({ className, ...props }: React$1.ComponentProps<"p">): react_jsx_runtime.JSX.Element;
declare function NoteDescription({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;

type RadioProps = Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "type">;
declare const radioBaseClassName = "peer size-4 shrink-0 appearance-none rounded-full border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40";
declare const Radio: React$1.ForwardRefExoticComponent<RadioProps & React$1.RefAttributes<HTMLInputElement>>;

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

declare const Toaster: ({ ...props }: ToasterProps) => react_jsx_runtime.JSX.Element;

declare function Switch({ className, size, ...props }: Switch$1.Root.Props & {
    size?: "sm" | "default";
}): react_jsx_runtime.JSX.Element;

declare function Tabs({ className, orientation, ...props }: Tabs$1.Root.Props): react_jsx_runtime.JSX.Element;
declare const tabsListVariants: (props?: ({
    variant?: "default" | "secondary" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function TabsList({ className, variant, ...props }: Tabs$1.List.Props & VariantProps<typeof tabsListVariants>): react_jsx_runtime.JSX.Element;
declare function TabsTrigger({ className, ...props }: Tabs$1.Tab.Props): react_jsx_runtime.JSX.Element;
declare function TabsContent({ className, ...props }: Tabs$1.Panel.Props): react_jsx_runtime.JSX.Element;

declare const textareaVariants: (props?: ({
    variant?: "default" | "chat" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const Textarea: React$1.ForwardRefExoticComponent<React$1.TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<(props?: ({
    variant?: "default" | "chat" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLTextAreaElement>>;

declare function TooltipProvider({ delay, ...props }: Tooltip$1.Provider.Props): react_jsx_runtime.JSX.Element;
declare function Tooltip({ ...props }: Tooltip$1.Root.Props): react_jsx_runtime.JSX.Element;
declare function TooltipTrigger({ ...props }: Tooltip$1.Trigger.Props): react_jsx_runtime.JSX.Element;
declare function TooltipContent({ className, side, sideOffset, align, alignOffset, children, ...props }: Tooltip$1.Popup.Props & Pick<Tooltip$1.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">): react_jsx_runtime.JSX.Element;

export { Badge, type BadgeSize, type BadgeVariant, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, GlowingEffect, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, Note, NoteDescription, NoteEyebrow, NoteTitle, Radio, SearchCombobox, type SearchComboboxOption, Separator, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, ThemeProvider, Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, badgeVariants, buttonVariants, checkboxBaseClassName, cn, noteVariants, radioBaseClassName, tabsListVariants, textareaVariants };
