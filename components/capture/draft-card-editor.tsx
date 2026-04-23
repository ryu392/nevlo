"use client"
import type { DraftCard } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Chip } from "@/components/ui/chip"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  draft: DraftCard
  onPatch: (patch: Partial<DraftCard>) => void
  onAddIdea: () => void
  onRemoveIdea: (index: number) => void
}

export function DraftCardEditor({
  draft,
  onPatch,
  onAddIdea,
  onRemoveIdea,
}: Props) {
  const isLow = draft.confidence === "low" && !draft.loading
  return (
    <article
      className={`bg-surface rounded-2xl p-4 mb-3 border-[1.5px] animate-[fadeUp_0.3s_ease_both] ${
        isLow ? "border-warning/50" : "border-border"
      }`}
    >
      <div className="flex gap-3 mb-3">
        {draft.imageUrl && (
          <img
            src={draft.imageUrl}
            alt=""
            className="w-[72px] h-[72px] rounded-[10px] object-cover shrink-0 border border-border"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-[6px]">
            <span className="text-[12px] font-bold text-ink-subtle">
              문제{draft.page ? ` ${draft.page}번` : ""}
            </span>
            {draft.loading ? (
              <span className="flex items-center gap-[5px] text-[12px] text-ink-subtle">
                <Spinner size={14} /> 인식 중...
              </span>
            ) : isLow ? (
              <Badge tone="warning">⚠ 확인 필요</Badge>
            ) : (
              <Badge tone="success">✓ 완료</Badge>
            )}
          </div>
          {draft.loading ? (
            <Skeleton className="h-[60px]" />
          ) : (
            <Textarea
              value={draft.text}
              onChange={(e) => onPatch({ text: e.target.value })}
              placeholder="문제 내용 수정 가능"
              aria-label="문제 내용"
            />
          )}
        </div>
      </div>

      {!draft.loading && (
        <>
          <div className="flex gap-2 mb-[10px]">
            <Input
              placeholder="교재명"
              value={draft.source}
              onChange={(e) => onPatch({ source: e.target.value })}
              className="flex-1 !text-[13px] !py-[9px]"
            />
            <Input
              placeholder="p."
              value={draft.page}
              onChange={(e) => onPatch({ page: e.target.value })}
              className="!w-[55px] !text-[13px] !py-[9px]"
            />
          </div>
          <p className="text-[11px] font-bold text-ink-subtle tracking-wider mb-[6px]">
            핵심 아이디어 (선택)
          </p>
          <div className="mb-[6px] flex flex-wrap gap-[5px]">
            {draft.ideas.map((idea, k) => (
              <Chip
                key={`${idea}-${k}`}
                label={idea}
                onRemove={() => onRemoveIdea(k)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={draft.ideaInput}
              onChange={(e) => onPatch({ ideaInput: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onAddIdea()}
              placeholder="놓친 아이디어..."
              className="flex-1 !text-[13px] !py-[9px]"
            />
            <button
              type="button"
              onClick={onAddIdea}
              className="px-[14px] py-[9px] rounded-[10px] border border-border bg-bg text-[14px] hover:bg-surface transition"
              aria-label="아이디어 추가"
            >
              +
            </button>
          </div>
        </>
      )}
    </article>
  )
}
