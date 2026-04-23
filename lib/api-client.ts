import type {
  AISetRequest,
  AISetResponse,
  ExamResult,
  GenerateRequest,
  GenerateResponse,
  OCRResponse,
} from "@/types"

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    try {
      const data = await res.json()
      throw new Error(data.error ?? `HTTP ${res.status}`)
    } catch {
      throw new Error(`HTTP ${res.status}`)
    }
  }
  return (await res.json()) as T
}

export async function ocrImages(files: File[]): Promise<OCRResponse> {
  const fd = new FormData()
  for (const f of files) fd.append("files", f)
  const res = await fetch("/api/ocr", { method: "POST", body: fd })
  return handle<OCRResponse>(res)
}

export async function generateSolution(
  req: GenerateRequest,
): Promise<GenerateResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  return handle<GenerateResponse>(res)
}

export async function generateAISet(req: AISetRequest): Promise<AISetResponse> {
  const res = await fetch("/api/ai-set", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  return handle<AISetResponse>(res)
}

export async function analyzeExam(data: {
  files: File[]
  wrongQs: number[]
  subject?: string
  examName?: string
}): Promise<ExamResult> {
  const fd = new FormData()
  for (const f of data.files) fd.append("files", f)
  fd.append("wrongQs", JSON.stringify(data.wrongQs))
  if (data.subject) fd.append("subject", data.subject)
  if (data.examName) fd.append("examName", data.examName)
  const res = await fetch("/api/exam", { method: "POST", body: fd })
  return handle<ExamResult>(res)
}
