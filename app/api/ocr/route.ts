import { NextResponse } from "next/server"
import { extractText, getAnthropic, parseClaudeJSON } from "@/lib/anthropic"
import { badRequest, internalError } from "@/lib/api-errors"
import { ocrPrompt } from "@/lib/prompts/ocr"
import { CLAUDE_MAX_TOKENS, CLAUDE_MODEL } from "@/config/models"
import type { OCRFileResult, OCRProblem } from "@/types"

function parseOCRResult(value: unknown): OCRProblem[] {
  if (Array.isArray(value)) return value as OCRProblem[]
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) return v as OCRProblem[]
    }
    if ("problemText" in obj) return [obj as unknown as OCRProblem]
  }
  return []
}

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

  if (!files.length) return badRequest("At least one file is required")

  const anthropic = getAnthropic()

  const results: OCRFileResult[] = await Promise.all(
    files.map(async (file, fileIndex) => {
      try {
        const buf = Buffer.from(await file.arrayBuffer())
        const mediaType = (file.type || "image/jpeg") as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif"
        const msg = await anthropic.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: CLAUDE_MAX_TOKENS.ocr,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType,
                    data: buf.toString("base64"),
                  },
                },
                { type: "text", text: ocrPrompt() },
              ],
            },
          ],
        })
        const raw = extractText(msg)
        const problems = parseOCRResult(parseClaudeJSON(raw))
        return { fileIndex, problems }
      } catch (e) {
        console.error("[/api/ocr]", e)
        return { fileIndex, problems: [], error: String(e) }
      }
    }),
  )

  return NextResponse.json({ results })
}

export const runtime = "nodejs"
