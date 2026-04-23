import { NextResponse } from "next/server"
import { extractText, getAnthropic, parseClaudeJSON } from "@/lib/anthropic"
import { badRequest, internalError, parseBody } from "@/lib/api-errors"
import { aiSetPrompt } from "@/lib/prompts/ai-set"
import { CLAUDE_MAX_TOKENS, CLAUDE_MODEL } from "@/config/models"
import type { AISetRequest, AISetResponse } from "@/types"

export async function POST(request: Request) {
  let body: AISetRequest
  try {
    body = await parseBody<AISetRequest>(request)
  } catch (e) {
    return badRequest("Invalid request body", String(e))
  }

  const { subject, topic, difficulty, count } = body
  if (!topic?.trim()) return badRequest("topic is required")
  if (!Number.isFinite(count) || count <= 0 || count > 12)
    return badRequest("count must be 1-12")

  try {
    const message = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS.aiSet,
      messages: [
        {
          role: "user",
          content: aiSetPrompt(subject, topic, difficulty, count),
        },
      ],
    })
    const raw = extractText(message)
    if (!raw) return internalError("Empty response from Claude")
    const result = parseClaudeJSON<AISetResponse>(raw)
    if (!result.cards?.length) return internalError("No cards returned")
    for (const card of result.cards) {
      if (!card.steps?.some((s) => s.isKey) && card.steps?.length) {
        const mid = Math.floor(card.steps.length / 2)
        card.steps[mid].isKey = true
        card.steps[mid].keyLabel = "핵심"
      }
    }
    return NextResponse.json(result)
  } catch (e) {
    console.error("[/api/ai-set]", e)
    return internalError("AI set generation failed", String(e))
  }
}

export const runtime = "nodejs"
