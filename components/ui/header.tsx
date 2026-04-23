"use client"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { Wordmark } from "@/components/logo/wordmark"

export function Header({
  title,
  backTo,
  right,
}: {
  title?: string
  backTo?: string | true
  right?: ReactNode
}) {
  const router = useRouter()
  const onBack = () => {
    if (backTo === true) router.back()
    else if (typeof backTo === "string") router.push(backTo)
  }
  return (
    <header className="sticky top-0 z-10 bg-bg border-b border-surface-2 px-5 py-[14px] flex items-center justify-between">
      {backTo ? (
        <button
          onClick={onBack}
          className="text-[14px] text-ink-muted hover:text-ink transition"
        >
          ← {title}
        </button>
      ) : (
        <Wordmark size={20} />
      )}
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}
