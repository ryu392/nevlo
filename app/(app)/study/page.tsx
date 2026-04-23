"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Header } from "@/components/ui/header"
import { ProgressBar } from "@/components/ui/progress-bar"
import { FeedbackButtons } from "@/components/flashcard/feedback-buttons"
import { ProblemView } from "@/components/flashcard/problem-view"
import { StepTimeline } from "@/components/flashcard/step-timeline"
import { selectDueCards, useCardsStore } from "@/stores/cards-store"
import { useSessionStore } from "@/stores/session-store"
import { useStreakStore } from "@/stores/streak-store"
import { useUIStore } from "@/stores/ui-store"
import type { FSRSRating } from "@/types"

export default function StudyPage() {
  const router = useRouter()
  const cards = useCardsStore((s) => s.cards)
  const submitFeedback = useCardsStore((s) => s.submitFeedback)
  const session = useSessionStore()
  const tickStreak = useStreakStore((s) => s.tick)
  const fireConfetti = useUIStore((s) => s.fireConfetti)

  const [revealedCount, setRevealedCount] = useState<number | null>(null)

  const [queue] = useState(() => selectDueCards(cards))
  const card = queue[session.index]

  if (!queue.length) {
    return (
      <>
        <Header />
        <EmptyState
          title="오늘 복습할 카드가 없어요!"
          description="문제를 등록하거나 내일 다시 오세요."
          action={
            <Link href="/home" className="block">
              <Button fullWidth>홈으로</Button>
            </Link>
          }
        />
      </>
    )
  }

  if (!card) return null

  const onRate = (rating: FSRSRating) => {
    submitFeedback(card.id, rating)
    session.record({
      cardId: card.id,
      rating,
      problemText: card.problemText.slice(0, 40),
    })
    tickStreak()
    setRevealedCount(null)
    if (session.index < queue.length - 1) {
      session.next()
    } else {
      fireConfetti(2000)
      router.push("/study/done")
    }
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-bg">
        <div className="px-5 py-[14px] flex items-center justify-between border-b border-surface-2">
          <Link
            href="/home"
            className="text-[14px] text-ink-muted hover:text-ink transition"
          >
            ← 그만두기
          </Link>
          <span className="text-[14px] font-semibold text-ink-muted">
            {session.index + 1} / {queue.length}
          </span>
        </div>
        <ProgressBar value={session.index} max={queue.length} />
      </div>

      <section className="px-5 pt-5 pb-8 animate-[fadeUp_0.3s_ease_both]">
        <div className="flex gap-[6px] mb-4">
          {card.source && (
            <Badge>
              {card.source}
              {card.page ? ` p.${card.page}` : ""}
            </Badge>
          )}
          {card.difficulty && <Badge>{card.difficulty}</Badge>}
        </div>

        {session.phase === "problem" && (
          <div className="animate-[fadeUp_0.3s_ease_both]">
            <ProblemView text={card.problemText} />
            <p className="text-center text-[14px] text-ink-subtle mb-4">
              풀이를 머릿속으로 떠올려보세요
            </p>
            <Button
              fullWidth
              onClick={() => {
                setRevealedCount(null)
                session.setPhase("hint")
              }}
            >
              풀이 확인하기
            </Button>
          </div>
        )}

        {session.phase === "hint" && (
          <div className="animate-[fadeUp_0.3s_ease_both]">
            <ProblemView text={card.problemText} />
            <StepTimeline
              steps={card.steps}
              mode="full"
              revealedCount={revealedCount ?? 0}
              onRevealNext={() =>
                setRevealedCount((c) => Math.min((c ?? 0) + 1, card.steps.length))
              }
            />
            {(revealedCount === null || revealedCount < card.steps.length) && (
              <div className="mt-4">
                <Button
                  fullWidth
                  onClick={() => setRevealedCount(card.steps.length)}
                >
                  전체 풀이 보기
                </Button>
              </div>
            )}
            {revealedCount !== null && revealedCount >= card.steps.length && (
              <div className="border-t border-surface-2 pt-4 mt-4">
                <p className="text-center text-[14px] text-ink-subtle mb-3">
                  얼마나 기억하고 있었나요?
                </p>
                <FeedbackButtons onSubmit={onRate} />
              </div>
            )}
          </div>
        )}
      </section>
    </>
  )
}
