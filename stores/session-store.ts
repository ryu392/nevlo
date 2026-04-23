"use client"
import { create } from "zustand"
import type { FSRSRating } from "@/types"

export type StudyPhase = "problem" | "hint" | "full"

export interface SessionResult {
  cardId: string
  rating: FSRSRating
  problemText: string
}

interface SessionState {
  index: number
  phase: StudyPhase
  results: SessionResult[]
  start: () => void
  setPhase: (phase: StudyPhase) => void
  record: (result: SessionResult) => void
  next: () => void
  reset: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  index: 0,
  phase: "problem",
  results: [],
  start: () => set({ index: 0, phase: "problem", results: [] }),
  setPhase: (phase) => set({ phase }),
  record: (result) => set((s) => ({ results: [...s.results, result] })),
  next: () => set((s) => ({ index: s.index + 1, phase: "problem" })),
  reset: () => set({ index: 0, phase: "problem", results: [] }),
}))
