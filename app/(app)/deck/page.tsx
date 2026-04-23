"use client"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Header } from "@/components/ui/header"
import { Input } from "@/components/ui/input"
import { MathText } from "@/components/math/math-text"
import { DifficultyBadge } from "@/components/flashcard/difficulty-badge"
import { isDue } from "@/lib/fsrs"
import { truncate } from "@/lib/utils"
import { useCardsStore } from "@/stores/cards-store"

type Filter = "all" | "due" | "scheduled"

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "due", label: "복습 필요" },
  { value: "scheduled", label: "예정됨" },
]

export default function DeckPage() {
  const cards = useCardsStore((s) => s.cards)
  const deleteCard = useCardsStore((s) => s.deleteCard)
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cards
      .filter((c) => {
        if (filter === "due" && !isDue(c.fsrs)) return false
        if (filter === "scheduled" && isDue(c.fsrs)) return false
        if (!q) return true
        return (
          c.problemText.toLowerCase().includes(q) ||
          (c.source ?? "").toLowerCase().includes(q)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [cards, filter, query])

  if (cards.length === 0) {
    return (
      <>
        <Header title="내 덱 관리" backTo="/home" />
        <EmptyState
          title="카드가 아직 없어요"
          description="문제를 찍거나 AI로 세트를 만들어 시작해보세요."
          action={
            <div className="flex gap-2 w-full max-w-[280px] mx-auto">
              <Link href="/capture" className="flex-1">
                <Button variant="secondary" fullWidth>
                  촬영
                </Button>
              </Link>
              <Link href="/ai" className="flex-1">
                <Button variant="accent" fullWidth>
                  AI 생성
                </Button>
              </Link>
            </div>
          }
        />
      </>
    )
  }

  return (
    <>
      <Header
        title="내 덱 관리"
        backTo="/home"
        right={
          <span className="text-[13px] font-semibold text-ink-muted">
            {cards.length}개
          </span>
        }
      />
      <section className="px-5 pt-4 pb-8">
        <Input
          placeholder="문제·출처로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2 mt-3 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`flex-1 py-[10px] rounded-[10px] text-[13px] font-semibold border transition ${
                filter === f.value
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-bg text-ink-muted hover:border-brand/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-[14px] text-ink-muted py-10">
            조건에 맞는 카드가 없어요.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => {
              const due = isDue(c.fsrs)
              return (
                <article
                  key={c.id}
                  className="bg-surface rounded-[12px] px-[14px] py-3 animate-[fadeUp_0.3s_ease_both]"
                >
                  <div className="text-[14px] leading-[1.6] mb-[8px]">
                    <MathText text={truncate(c.problemText, 90)} />
                  </div>
                  <div className="flex items-center gap-[6px] flex-wrap">
                    {c.source && <Badge tone="info">{c.source}</Badge>}
                    <DifficultyBadge difficulty={c.difficulty} />
                    <div className="flex-1" />
                    <span
                      className={`text-[11px] font-semibold ${
                        due ? "text-danger" : "text-brand"
                      }`}
                    >
                      {due ? "복습 필요" : "예정됨"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("이 카드를 삭제할까요?")) deleteCard(c.id)
                      }}
                      className="text-[11px] text-ink-subtle hover:text-danger transition px-[6px]"
                    >
                      삭제
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
