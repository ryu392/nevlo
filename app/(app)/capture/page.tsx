"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { ImageDropzone } from "@/components/capture/image-dropzone"
import { ImageGrid } from "@/components/capture/image-grid"
import { ocrImages } from "@/lib/api-client"
import { useCaptureStore } from "@/stores/capture-store"
import type { DraftCard } from "@/types"

export default function CapturePage() {
  const router = useRouter()
  const { files, imageUrls, addFiles, removeFile, setDrafts, setError } =
    useCaptureStore()

  const startOCR = async () => {
    if (!files.length) return
    // Seed one draft per file in loading state, show progress in editor.
    const initialDrafts: DraftCard[] = files.map((_, i) => ({
      id: `ocr-${i}`,
      imageUrl: imageUrls[i],
      text: "",
      source: "",
      page: "",
      confidence: null,
      ideas: [],
      ideaInput: "",
      loading: true,
    }))
    setDrafts(initialDrafts)
    router.push("/capture/edit")

    try {
      const { results } = await ocrImages(files)
      const expanded: DraftCard[] = []
      results
        .sort((a, b) => a.fileIndex - b.fileIndex)
        .forEach((r) => {
          if (!r.problems.length) {
            expanded.push({
              id: `ocr-${r.fileIndex}-err`,
              imageUrl: imageUrls[r.fileIndex],
              text: "인식 실패 — 직접 입력해주세요.",
              source: "",
              page: "",
              confidence: "low",
              ideas: [],
              ideaInput: "",
              loading: false,
            })
            return
          }
          r.problems.forEach((p, k) => {
            expanded.push({
              id: `ocr-${r.fileIndex}-${k}`,
              imageUrl: imageUrls[r.fileIndex],
              text: p.problemText ?? "",
              source: "",
              page: p.problemNumber != null ? String(p.problemNumber) : "",
              confidence: p.confidence ?? "medium",
              ideas: [],
              ideaInput: "",
              loading: false,
            })
          })
        })
      setDrafts(expanded)
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR 실패")
    }
  }

  return (
    <>
      <Header title="문제 촬영" backTo="/home" />
      <section className="px-5 pt-5 pb-8 animate-[fadeUp_0.3s_ease_both]">
        <ImageDropzone count={imageUrls.length} onPick={addFiles} />
        <ImageGrid urls={imageUrls} onRemove={removeFile} />
        <p className="text-[12px] text-ink-subtle mt-3 mb-3 text-center">
          한 장에 여러 문제가 있어도 자동으로 분리됩니다
        </p>
        <Button fullWidth onClick={startOCR} disabled={!imageUrls.length}>
          OCR 시작 →
        </Button>
      </section>
    </>
  )
}
