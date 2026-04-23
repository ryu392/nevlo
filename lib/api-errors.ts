import { NextResponse } from "next/server"
import type { APIError } from "@/types"

export function badRequest(error: string, details?: string) {
  return NextResponse.json<APIError>({ error, details }, { status: 400 })
}

export function internalError(error: string, details?: string) {
  return NextResponse.json<APIError>({ error, details }, { status: 500 })
}

export async function parseBody<T>(request: Request): Promise<T> {
  const body = (await request.json()) as T
  if (!body) throw new Error("Empty body")
  return body
}

export function ensureKeyStep<
  T extends { steps?: Array<{ isKey?: boolean; keyLabel?: string; label?: string }> },
>(r: T): T {
  if (!r.steps?.length) return r
  if (!r.steps.some((s) => s.isKey)) {
    const mid = Math.floor(r.steps.length / 2)
    r.steps[mid].isKey = true
    r.steps[mid].keyLabel = "핵심"
  }
  return r
}
