import "server-only"
import Anthropic from "@anthropic-ai/sdk"

let client: Anthropic | null = null

export function getAnthropic(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Copy .env.local.example to .env.local.",
      )
    }
    client = new Anthropic({ apiKey })
  }
  return client
}

export function extractText(message: Anthropic.Message): string {
  return message.content.find((b) => b.type === "text")?.text ?? ""
}

export function parseClaudeJSON<T>(raw: string): T {
  const clean = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
  return JSON.parse(clean) as T
}
