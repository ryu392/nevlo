"use client"
import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full bg-surface border border-border rounded-[12px] px-[14px] py-[12px]",
        "text-[14px] text-ink placeholder:text-ink-subtle",
        "outline-none focus:border-brand transition",
        className,
      )}
      {...rest}
    />
  )
})
