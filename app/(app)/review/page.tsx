"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FixedCTA } from "@/components/ui/fixed-cta"
import { Header } from "@/components/ui/header"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { MathText } from "@/components/math/math-text"
import { StepTimeline } from "@/components/flashcard/step-timeline"
import { DifficultyBadge } from "@/components/flashcard/difficulty-badge"
import { generateSolution } from "@/lib/api-client"
import { truncate } from "@/lib/utils"
import { useCardsStore } from "@/stores/cards-store"
import { useCaptureStore } from "@/stores/capture-store"
import { useUIStore } from "@/stores/ui-store"

export default function ReviewSolutionsPage() {
  const router = useRouter()
  const { reviewCards, updateReviewCard, resetAll } = useCaptureStore()
  const addCards = useCardsStore((s) => s.addCards)
  const fireConfetti = useUIStore((s) => s.fireConfetti)

  const readyCount = reviewCards.filter((c) => !c.loading).length
  const allReady = readyCount === reviewCards.length && reviewCards.length > 0

  const regen = async (index: number) => {
    const card = reviewCards[index]
    updateReviewCard(index, { loading: true })
    try {
      const res = await generateSolution({
        problemText: card.problemText,
        ideas: card.ideas,
      })
      updateReviewCard(index, {
        steps: res.steps,
        difficulty: res.difficulty ?? card.difficulty,
        loading: false,
      })
    } catch {
      updateReviewCard(index, { loading: false })
    }
  }

  const save = () => {
    addCards(
      reviewCards.map((rc) => ({
        problemText: rc.problemText,
        imageUrl: rc.imageUrl,
        source: rc.source,
        page: rc.page,
        subject: "수학",
        difficulty: rc.difficulty,
        ideas: rc.ideas,
        steps: rc.steps,
      })),
    )
    fireConfetti()
    const count = reviewCards.length
    resetAll()
    router.push(`/review/done?n=${count}`)
  }

  return (
    <>
      <Header
        title="풀이 검토"
        backTo="/home"
        right={
          <div className="flex items-center gap-[6px]">
            {!allReady && <Spinner size={16} />}
            <span
              className={`text-[13px] font-semibold ${
                allReady ? "text-success" : "text-ink-muted"
              }`}
            >
              {readyCount}/{reviewCards.length}
            </span>
          </div>
        }
      />
      <section className="px-5 pt-3">
        <p className="text-[13px] text-ink-subtle mb-[14px]">
          풀이를 확인하고 저장하세요. 카드별 재생성 가능.
        </p>
        {reviewCards.map((card, ci) => (
          <article
            key={card.id}
            className="bg-surface rounded-2xl p-4 mb-3 border border-border animate-[fadeUp_0.3s_ease_both]"
          >
            <div className="flex justify-between items-start gap-2 mb-[10px]">
              <div className="flex-1">
                <div className="flex gap-[6px] items-center mb-[5px]">
                  <Badge>문제 {ci + 1}</Badge>
                  <DifficultyBadge difficulty={card.difficulty} />
                </div>
                <div className="text-[13px] text-ink-muted leading-[1.6]">
                  <MathText text={truncate(card.problemText, 100)} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => regen(ci)}
                className="shrink-0 px-[11px] py-[6px] rounded-[9px] border border-border bg-bg text-[12px] text-ink-muted hover:bg-surface-2 transition"
              >
                ↻ 재생성
              </button>
            </div>
            <div className="border-t border-border pt-[10px]">
              {card.loading ? (
                <div className="flex items-center gap-[10px] py-2">
                  <Spinner size={18} />
                  <span className="text-[13px] text-ink-subtle">
                    풀이 생성 중...
                  </span>
                </div>
              ) : card.steps.length === 0 ? (
                <p className="text-[13px] text-danger">
                  생성 실패 — 재생성을 눌러주세요
                </p>
              ) : (
                <StepTimeline steps={card.steps} mode="full" />
              )}
            </div>
          </article>
        ))}
      </section>
      <FixedCTA
        label={allReady ? `${reviewCards.length}개 카드 저장하기` : "풀이 생성 중..."}
        onClick={save}
        disabled={!allReady}
      />
    </>
  )
}
