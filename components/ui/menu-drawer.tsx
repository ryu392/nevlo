"use client"
import Link from "next/link"
import { useEffect } from "react"
import { useUIStore } from "@/stores/ui-store"

const links = [
  { href: "/mypage", label: "마이페이지" },
  { href: "/deck", label: "내 덱 관리" },
  { href: "/settings", label: "설정" },
]

export function MenuDrawer() {
  const menuOpen = useUIStore((s) => s.menuOpen)
  const setMenuOpen = useUIStore((s) => s.setMenuOpen)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen, setMenuOpen])

  if (!menuOpen) return null
  return (
    <div
      className="fixed inset-0 z-30 bg-black/30"
      onClick={() => setMenuOpen(false)}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-[75%] max-w-[300px] bg-bg border-l border-border py-5"
        style={{ animation: "slideIn 0.3s ease" }}
      >
        <div className="px-5 pb-4 border-b border-surface-2">
          <div className="flex items-center gap-[10px]">
            <div className="w-[38px] h-[38px] rounded-full bg-brand-50 flex items-center justify-center text-[15px] font-bold text-brand">
              N
            </div>
            <div>
              <div className="text-[15px] font-bold">김민건</div>
              <div className="text-[12px] text-ink-subtle">월간 구독</div>
            </div>
          </div>
        </div>
        <nav>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-[15px] border-b border-surface-2 text-[15px] hover:bg-surface transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  )
}

export function MenuButton() {
  const setMenuOpen = useUIStore((s) => s.setMenuOpen)
  return (
    <button
      type="button"
      onClick={() => setMenuOpen(true)}
      className="p-1"
      aria-label="메뉴 열기"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-ink-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  )
}
