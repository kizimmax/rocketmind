"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit max-w-full items-center text-muted-foreground group-data-horizontal/tabs:min-h-10 group-data-vertical/tabs:h-fit group-data-vertical/tabs:w-full group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        default: "gap-1 rounded-sm border border-border bg-[var(--rm-gray-1)] p-1",
        secondary: "gap-4 rounded-none border-b border-border bg-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-sm border border-transparent px-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color,opacity] duration-150 ease-[var(--ease-standard)] group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:bg-[var(--rm-gray-2)] hover:text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-active:border-border data-active:bg-background data-active:text-foreground",
        "group-data-[variant=secondary]/tabs-list:h-10 group-data-[variant=secondary]/tabs-list:rounded-none group-data-[variant=secondary]/tabs-list:border-transparent group-data-[variant=secondary]/tabs-list:bg-transparent group-data-[variant=secondary]/tabs-list:px-0 group-data-[variant=secondary]/tabs-list:hover:bg-transparent group-data-[variant=secondary]/tabs-list:data-active:border-transparent group-data-[variant=secondary]/tabs-list:data-active:bg-transparent",
        "after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-full after:bg-[var(--rm-yellow-100)] after:opacity-0 after:transition-opacity after:duration-150 group-data-[variant=secondary]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-[length:var(--text-14)] outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
