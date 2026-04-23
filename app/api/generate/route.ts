import { NextResponse } from "next/server"
import { extractText, getAnthropic, parseClaudeJSON } from "@/lib/anthropic"
import { badRequest, ensureKeyStep, internalError, parseBody } from "@/lib/api-errors"
import { generatePrompt } from "@/lib/prompts/generate"
import { CLAUDE_MAX_TOKENS, CLAUDE_MODEL } from "@/config/models"
import type { GenerateRequest, GenerateResponse } from "@/types"

export async function POST(request: Request) {
  let body: GenerateRequest
  try {
    body = await parseBody<GenerateRequest>(request)
  } catch (e) {
    return badRequest("Invalid request body", String(e))
  }

  const { problemText, ideas } = body
  if (!problemText?.trim()) return badRequest("problemText is required")
  if (!Array.isArray(ideas)) return badRequest("ideas must be an array")

  try {
    const message = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS.generate,
      messages: [{ role: "user", content: generatePrompt(problemText, ideas) }],
    })
    const raw = extractText(message)
    if (!raw) return internalError("Empty response from Claude")
    const result = ensureKeyStep(parseClaudeJSON<GenerateResponse>(raw))
    if (!result.steps?.length) return internalError("No steps returned")
    return NextResponse.json(result)
  } catch (e) {
    console.error("[/api/generate]", e)
    return internalError("Generation failed", String(e))
  }
}

export const runtime = "nodejs"
