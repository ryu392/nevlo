"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ErrorBanner } from "@/components/ui/error-banner"
import { Header } from "@/components/ui/header"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { generateAISet } from "@/lib/api-client"
import { useCaptureStore } from "@/stores/capture-store"
import type { Difficulty, ReviewCard } from "@/types"

const SUBJECTS = [
  "수학",
  "물리학",
  "화학",
  "생물학",
  "선형대수",
  "미적분",
  "통계학",
  "영어",
] as const

const DIFFICULTIES: Difficulty[] = ["쉬움", "보통", "어려움"]
const COUNTS = [3, 5, 8] as const

export default function AIConfigPage() {
  const router = useRouter()
  const setReviewCards = useCaptureStore((s) => s.setReviewCards)
  const setError = useCaptureStore((s) => s.setError)
  const error = useCaptureStore((s) => s.error)

  const [subject, setSubject] = useState<string>("수학")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("보통")
  const [count, setCount] = useState<number>(5)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!topic.trim()) {
      setError("주제를 입력해주세요.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await generateAISet({ subject, topic, difficulty, count })
      const mapped: ReviewCard[] = res.cards.map((c) => ({
        id: crypto.randomUUID(),
        problemText: c.problemText,
        source: topic,
        ideas: [],
        steps: c.steps,
        difficulty: c.difficulty ?? difficulty,
        loading: false,
      }))
      setReviewCards(mapped)
      router.push("/review")
    } catch (e) {
      setError(e instanceof Error ? e.message : "생성 실패. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center text-center py-24 px-6">
          <Spinner size={44} />
          <p className="text-[17px] font-bold mt-5">{topic}</p>
          <p className="text-[14px] text-ink-muted mt-[6px]">
            {count}개 문제 생성 중 · {difficulty}
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="AI 세트 생성" backTo="/home" />
      <section className="px-5 pt-5 pb-8 animate-[fadeUp_0.3s_ease_both]">
        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <div className="bg-accent/10 rounded-[14px] px-4 py-[14px] mb-5 border border-accent/20">
          <div className="text-[14px] font-bold text-accent mb-[3px]">
            AI가 연습 문제를 만들어드려요
          </div>
          <div className="text-[13px] text-accent/80">
            주제를 입력하면 LaTeX 수식이 포함된 문제와 풀이를 생성합니다.
          </div>
        </div>

        <Label>과목</Label>
        <div className="flex gap-[7px] flex-wrap mb-2">
          {SUBJECTS.map((s) => (
            <PillButton
              key={s}
              active={subject === s}
              onClick={() => setSubject(s)}
            >
              {s}
            </PillButton>
          ))}
        </div>
        <Input
          placeholder="직접 입력..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <Label>구체적인 주제</Label>
        <Input
          placeholder="예: 좌표계 변환, 행렬의 역행렬, 극한의 정의..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <Label>난이도</Label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <ToggleButton
              key={d}
              active={difficulty === d}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </ToggleButton>
          ))}
        </div>

        <Label>카드 수</Label>
        <div className="flex gap-2">
          {COUNTS.map((n) => (
            <ToggleButton
              key={n}
              active={count === n}
              onClick={() => setCount(n)}
            >
              {n}개
            </ToggleButton>
          ))}
        </div>

        <Button
          fullWidth
          variant="accent"
          className="mt-6"
          onClick={submit}
          disabled={!topic.trim()}
        >
          세트 생성하기
        </Button>
      </section>
    </>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold text-ink-subtle uppercase tracking-[1.5px] mb-2 mt-[18px]">
      {children}
    </div>
  )
}

function PillButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-[13px] py-[7px] rounded-full border text-[13px] transition ${
        active
          ? "border-accent bg-accent/10 text-accent font-bold"
          : "border-border bg-bg text-ink-muted hover:border-accent/50"
      }`}
    >
      {children}
    </button>
  )
}

function ToggleButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 px-2 rounded-[12px] border-[1.5px] text-[14px] transition ${
        active
          ? "border-accent bg-accent/10 text-accent font-bold"
          : "border-border bg-bg text-ink-muted hover:border-accent/50"
      }`}
    >
      {children}
    </button>
  )
}
