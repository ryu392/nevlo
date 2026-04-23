"use client"
import { useMemo } from "react"
import { Header } from "@/components/ui/header"
import { MenuButton } from "@/components/ui/menu-drawer"
import { StreakStrip } from "@/components/home/streak-strip"
import { QuickActions } from "@/components/home/quick-actions"
import { SectionLink } from "@/components/home/section-link"
import { BookIcon, FileIcon, FolderIcon } from "@/components/ui/icons"
import { selectDueCards, useCardsStore } from "@/stores/cards-store"
import { useSessionStore } from "@/stores/session-store"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const cards = useCardsStore((s) => s.cards)
  const startSession = useSessionStore((s) => s.start)
  const due = useMemo(() => selectDueCards(cards), [cards])

  const onStudy = () => {
    if (!due.length) return
    startSession()
    router.push("/study")
  }

  return (
    <>
      <Header right={<MenuButton />} />
      <section className="px-5 pt-5 pb-8 animate-[fadeUp_0.3s_ease_both]">
        <StreakStrip />

        <h2 className="text-[11px] font-bold text-ink-subtle uppercase tracking-[1.5px] mb-2 mt-5">
          카드 만들기
        </h2>
        <QuickActions />

        <h2 className="text-[11px] font-bold text-ink-subtle uppercase tracking-[1.5px] mb-2 mt-4">
          학습
        </h2>
        <SectionLink
          href="/study"
          onClick={onStudy}
          icon={<BookIcon className="text-success" />}
          title="학습하기"
          subtitle={`오늘 ${due.length}개 예정`}
          disabled={due.length === 0}
        />
        <SectionLink
          href="/deck"
          icon={<FolderIcon className="text-info" />}
          title="내 덱 보기"
          subtitle={`${cards.length}개 카드`}
        />
        <SectionLink
          href="/exam"
          icon={<FileIcon className="text-warning" />}
          title="모의고사 리뷰"
          subtitle="AI 심층 분석"
        />
      </section>
    </>
  )
}
