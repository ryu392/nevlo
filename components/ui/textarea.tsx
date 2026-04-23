"use client"
import { forwardRef, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-surface border border-border rounded-[12px] px-[11px] py-[9px]",
        "text-[13px] leading-[1.7] text-ink placeholder:text-ink-subtle",
        "outline-none focus:border-brand transition resize-y min-h-[64px]",
        className,
      )}
      {...rest}
    />
  )
})
