"use client"
import { useRouter } from "next/navigation"
import { FixedCTA } from "@/components/ui/fixed-cta"
import { Header } from "@/components/ui/header"
import { Spinner } from "@/components/ui/spinner"
import { DraftCardEditor } from "@/components/capture/draft-card-editor"
import { generateSolution } from "@/lib/api-client"
import { useCaptureStore } from "@/stores/capture-store"
import type { ReviewCard } from "@/types"

export default function CaptureEditPage() {
  const router = useRouter()
  const {
    drafts,
    updateDraft,
    addIdea,
    removeIdea,
    setReviewCards,
    updateReviewCard,
  } = useCaptureStore()

  const doneCount = drafts.filter((d) => !d.loading).length
  const allDone = doneCount === drafts.length && drafts.length > 0

  const generate = () => {
    const initial: ReviewCard[] = drafts.map((d) => ({
      id: crypto.randomUUID(),
      problemText: d.text,
      imageUrl: d.imageUrl,
      source: d.source,
      page: d.page,
      ideas: d.ideas,
      steps: [],
      difficulty: "보통",
      loading: true,
    }))
    setReviewCards(initial)
    router.push("/review")

    drafts.forEach(async (d, i) => {
      try {
        const res = await generateSolution({
          problemText: d.text,
          ideas: d.ideas,
        })
        updateReviewCard(i, {
          steps: res.steps,
          difficulty: res.difficulty,
          loading: false,
        })
      } catch {
        updateReviewCard(i, { loading: false })
      }
    })
  }

  return (
    <>
      <Header
        title="카드 편집"
        backTo="/capture"
        right={
          <div className="flex items-center gap-[6px]">
            {!allDone && <Spinner size={16} />}
            <span
              className={`text-[13px] font-semibold ${
                allDone ? "text-success" : "text-ink-muted"
              }`}
            >
              {doneCount}/{drafts.length} 완료
            </span>
          </div>
        }
      />
      <section className="px-5 pt-4">
        {drafts.map((d) => (
          <DraftCardEditor
            key={d.id}
            draft={d}
            onPatch={(patch) => updateDraft(d.id, patch)}
            onAddIdea={() => addIdea(d.id)}
            onRemoveIdea={(k) => removeIdea(d.id, k)}
          />
        ))}
      </section>
      <FixedCTA
        label={allDone ? "풀이 생성하기 →" : "인식 완료 후 생성 가능"}
        onClick={generate}
        disabled={!allDone}
      />
    </>
  )
}
