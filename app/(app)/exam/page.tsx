"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ErrorBanner } from "@/components/ui/error-banner"
import { Header } from "@/components/ui/header"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ImageDropzone } from "@/components/capture/image-dropzone"
import { ImageGrid } from "@/components/capture/image-grid"
import { analyzeExam } from "@/lib/api-client"
import { parseWrongQs } from "@/lib/utils"
import { useExamStore } from "@/stores/exam-store"

export default function ExamPage() {
  const router = useRouter()
  const {
    files,
    imageUrls,
    examName,
    subject,
    wrongQsInput,
    error,
    addFiles,
    removeFile,
    setExamName,
    setSubject,
    setWrongQsInput,
    setResult,
    setError,
  } = useExamStore()
  const [loading, setLoading] = useState(false)

  const canSubmit = wrongQsInput.trim().length > 0

  const submit = async () => {
    const wrongQs = parseWrongQs(wrongQsInput)
    if (!wrongQs.length) {
      setError("틀린 문항 번호를 입력해주세요.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const result = await analyzeExam({
        files,
        wrongQs,
        subject: subject || "수학",
        examName: examName || "모의고사",
      })
      setResult(result)
      router.push("/exam/result")
    } catch (e) {
      setError(e instanceof Error ? e.message : "분석 실패. 다시 시도해주세요.")
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
          <p className="text-[17px] font-bold mt-5">
            {examName || "모의고사"} 분석 중
          </p>
          <p className="text-[14px] text-ink-muted mt-[6px]">
            오답 패턴과 취약 단원을 추려내는 중이에요.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="모의고사 리뷰" backTo="/home" />
      <section className="px-5 pt-5 pb-8 animate-[fadeUp_0.3s_ease_both]">
        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <div className="bg-brand/5 rounded-[14px] px-4 py-[14px] mb-5 border border-brand/20">
          <div className="text-[14px] font-bold text-brand mb-[3px]">
            오답을 분석해 약점을 찾아드려요
          </div>
          <div className="text-[13px] text-brand/80">
            시험지 사진과 틀린 문항 번호만 있으면 충분합니다.
          </div>
        </div>

        <Label>시험지 이미지 (선택)</Label>
        <ImageDropzone
          count={imageUrls.length}
          onPick={addFiles}
          label="시험지 사진 추가"
          hint="여러 장 가능 · 생략 가능"
        />
        <ImageGrid urls={imageUrls} onRemove={removeFile} />

        <Label>시험명</Label>
        <Input
          placeholder="예: 3월 모의고사"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />

        <Label>과목</Label>
        <Input
          placeholder="수학"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <Label>틀린 문항 번호</Label>
        <Input
          placeholder="예: 12, 18, 21, 27, 30"
          value={wrongQsInput}
          onChange={(e) => setWrongQsInput(e.target.value)}
        />

        <Button
          fullWidth
          className="mt-6"
          onClick={submit}
          disabled={!canSubmit}
        >
          심층 리뷰 시작
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
