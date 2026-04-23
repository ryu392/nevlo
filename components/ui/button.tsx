"use client"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-[14px] font-bold transition " +
  "active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-600",
  secondary:
    "bg-bg text-ink border border-border hover:bg-surface",
  ghost: "bg-transparent text-ink-muted hover:text-ink",
  accent: "bg-accent text-white hover:opacity-90",
  danger: "bg-danger text-white hover:opacity-90",
}

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-2 text-[13px]",
  md: "px-5 py-3 text-[14px]",
  lg: "px-6 py-4 text-[15px]",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "lg", fullWidth, className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          base,
          variantClass[variant],
          sizeClass[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      />
    )
  },
)
