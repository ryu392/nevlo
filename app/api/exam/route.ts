import { NextResponse } from "next/server"
import type Anthropic from "@anthropic-ai/sdk"
import { extractText, getAnthropic, parseClaudeJSON } from "@/lib/anthropic"
import { badRequest, internalError } from "@/lib/api-errors"
import { examPrompt } from "@/lib/prompts/exam"
import { CLAUDE_MAX_TOKENS, CLAUDE_MODEL } from "@/config/models"
import type { ExamResult } from "@/types"

export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch (e) {
    return badRequest("Invalid form data", String(e))
  }

  const files = formData
    .getAll("files")
    .filter((v): v is File => v instanceof File)
  const wrongQsRaw = formData.get("wrongQs")
  const subject = (formData.get("subject") as string | null) ?? "수학"
  const examName = (formData.get("examName") as string | null) ?? "모의고사"

  let wrongQs: number[] = []
  try {
    wrongQs = JSON.parse((wrongQsRaw as string) ?? "[]")
  } catch {
    return badRequest("Invalid wrongQs")
  }
  if (!Array.isArray(wrongQs) || !wrongQs.length)
    return badRequest("wrongQs must be a non-empty array")

  try {
    const imageBlocks: Anthropic.ImageBlockParam[] = await Promise.all(
      files.map(async (file) => {
        const buf = Buffer.from(await file.arrayBuffer())
        const mediaType = (file.type || "image/jpeg") as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif"
        return {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: buf.toString("base64"),
          },
        }
      }),
    )

    const message = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS.exam,
      messages: [
        {
          role: "user",
          content: [
            ...imageBlocks,
            { type: "text", text: examPrompt(wrongQs, subject, examName) },
          ],
        },
      ],
    })

    const raw = extractText(message)
    if (!raw) return internalError("Empty response from Claude")
    const analysis = parseClaudeJSON<Omit<ExamResult, "examName" | "subject" | "wrongCount">>(
      raw,
    )
    const result: ExamResult = {
      examName,
      subject,
      wrongCount: wrongQs.length,
      ...analysis,
    }
    return NextResponse.json(result)
  } catch (e) {
    console.error("[/api/exam]", e)
    return internalError("Exam analysis failed", String(e))
  }
}

export const runtime = "nodejs"
