import type { Confidence, Difficulty, SolutionStep } from "./card"

export interface OCRProblem {
  problemNumber: number | null
  problemText: string
  confidence: Confidence
}

export interface OCRFileResult {
  fileIndex: number
  problems: OCRProblem[]
  error?: string
}

export interface OCRResponse {
  results: OCRFileResult[]
}

export interface GenerateRequest {
  problemText: string
  ideas: string[]
}

export interface GenerateResponse {
  steps: SolutionStep[]
  difficulty: Difficulty
}

export interface AISetRequest {
  subject: string
  topic: string
  difficulty: Difficulty
  count: number
}

export interface AISetCard {
  problemText: string
  steps: SolutionStep[]
  difficulty: Difficulty
}

export interface AISetResponse {
  cards: AISetCard[]
}

export interface WeakPoint {
  topic: string
  questionNums: number[]
  severity: "high" | "medium" | "low"
  advice: string
}

export interface ExamResult {
  examName: string
  subject: string
  wrongCount: number
  estimatedScore: number
  weakPoints: WeakPoint[]
  summary: string
}

export interface APIError {
  error: string
  details?: string
}
