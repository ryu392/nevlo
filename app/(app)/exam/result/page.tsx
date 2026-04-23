"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Header } from "@/components/ui/header"
import { useExamStore } from "@/stores/exam-store"
import type { WeakPoint } from "@/types"

const SEVERITY: Record<WeakPoint["severity"], { label: string; tone: string }> = {
  high: { label: "높음", tone: "bg-danger/10 text-danger border-danger/30" },
  medium: { label: "보통", tone: "bg-warning/10 text-warning border-warning/30" },
  low: { label: "낮음", tone: "bg-brand/10 text-brand border-brand/30" },
}

export default function ExamResultPage() {
  const router = useRouter()
  const result = useExamStore((s) => s.result)
  const resetInputs = useExamStore((s) => s.resetInputs)
  const setResult = useExamStore((s) => s.setResult)

  useEffect(() => {
    if (!result) router.replace("/exam")
  }, [result, router])

  if (!result) {
    return (
      <>
        <Header />
        <EmptyState
          title="분석 결과가 없어요"
          description="다시 시도해주세요."
        />
      </>
    )
  }

  const goHome = () => {
    resetInputs()
    setResult(null)
    router.push("/home")
  }

  return (
    <>
      <Header title="리뷰 결과" backTo="/home" />
      <section className="px-5 pt-5 pb-10 animate-[fadeUp_0.3s_ease_both]">
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <div className="text-[17px] font-extrabold">{result.examName}</div>
            <div className="text-[13px] text-ink-muted mt-[2px]">
              {result.subject} · {result.wrongCount}문항 오답
            </div>
          </div>
          <div className="text-right">
            <div className="text-[32px] font-extrabold text-warning leading-none">
              {result.estimatedScore}
            </div>
            <div className="text-[11px] text-ink-subtle mt-1">예상 점수</div>
          </div>
        </div>

        <div className="bg-surface rounded-[14px] px-4 py-[14px] mb-5 text-[14px] leading-[1.7] text-ink-muted">
          {result.summary}
        </div>

        <div className="text-[11px] font-bold text-ink-subtle uppercase tracking-[1.5px] mb-3">
          약점 분석
        </div>
        <div className="space-y-2">
          {result.weakPoints.map((wp, i) => (
            <article
              key={i}
              className="bg-surface rounded-[12px] px-[14px] py-3 animate-[fadeUp_0.3s_ease_both]"
            >
              <div className="flex justify-between items-start gap-2 mb-[6px]">
                <span className="text-[14px] font-bold">{wp.topic}</span>
                <span
                  className={`text-[11px] px-[8px] py-[3px] rounded-[8px] border shrink-0 ${SEVERITY[wp.severity].tone}`}
                >
                  {wp.questionNums.join(", ")}번
                </span>
              </div>
              <p className="text-[13px] text-ink-muted leading-[1.6]">
                {wp.advice}
              </p>
            </article>
          ))}
        </div>

        <Button fullWidth className="mt-8" onClick={goHome}>
          홈으로
        </Button>
      </section>
    </>
  )
}
