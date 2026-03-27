"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full border border-border",
  {
    variants: {
      size: {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const avatarFallbackFontSize: Record<string, string> = {
  xs: "text-[10px]",
  sm: "text-[length:var(--text-12)]",
  md: "text-[length:var(--text-14)]",
  lg: "text-[length:var(--text-16)]",
  xl: "text-[20px]",
}

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "md", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    data-size={size}
    className={cn(avatarVariants({ size, className }))}
    {...props}
  />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-[var(--rm-gray-1)] text-muted-foreground",
      "font-[family-name:var(--font-mono-family)] uppercase",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarFallback, AvatarImage, avatarVariants }
