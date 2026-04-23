"use client"
import Link from "next/link"
import type { ReactNode } from "react"

export function SectionLink({
  href,
  icon,
  title,
  subtitle,
  disabled,
  onClick,
}: {
  href: string
  icon: ReactNode
  title: string
  subtitle: string
  disabled?: boolean
  onClick?: () => void
}) {
  const inner = (
    <div
      className={`bg-surface rounded-2xl py-4 px-5 flex items-center gap-[14px] mb-2 transition ${
        disabled ? "opacity-50 pointer-events-none" : "hover:bg-surface-2"
      }`}
    >
      <div className="shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="text-[15px] font-bold">{title}</div>
        <div className="text-[12px] text-ink-subtle mt-[2px]">{subtitle}</div>
      </div>
      <span className="text-ink-subtle">→</span>
    </div>
  )
  if (disabled)
    return (
      <div aria-disabled className="cursor-default">
        {inner}
      </div>
    )
  return (
    <Link href={href} onClick={onClick} className="block">
      {inner}
    </Link>
  )
}
