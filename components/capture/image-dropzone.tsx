"use client"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { CameraIcon } from "@/components/ui/icons"

export function ImageDropzone({
  count,
  onPick,
  label = "사진 선택하기",
  hint = "탭하여 갤러리 열기 · 여러 장 가능",
}: {
  count: number
  onPick: (files: File[]) => void
  label?: string
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasFiles = count > 0
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          if (files.length) onPick(files)
          e.target.value = ""
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full bg-surface rounded-[16px] border-[1.5px] border-dashed px-5 py-9 text-center transition",
          hasFiles ? "border-brand text-brand" : "border-border text-ink-muted",
        )}
      >
        <CameraIcon size={36} className="mx-auto mb-[10px]" />
        <div className="text-[15px] font-semibold">
          {hasFiles ? `${count}장 선택됨` : label}
        </div>
        <div className="text-[13px] text-ink-subtle mt-1">{hint}</div>
      </button>
    </>
  )
}
