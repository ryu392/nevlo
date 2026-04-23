"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Card, FSRSRating } from "@/types"
import { defaultFSRS, initFSRS, isDue, updateFSRS, urgencyScore } from "@/lib/fsrs"

interface CardsState {
  cards: Card[]
  addCard: (card: Omit<Card, "id" | "createdAt" | "fsrs">) => void
  addCards: (cards: Omit<Card, "id" | "createdAt" | "fsrs">[]) => void
  updateCard: (id: string, patch: Partial<Card>) => void
  deleteCard: (id: string) => void
  submitFeedback: (id: string, rating: FSRSRating) => void
  clear: () => void
}

export const useCardsStore = create<CardsState>()(
  persist(
    (set) => ({
      cards: [],
      addCard: (partial) =>
        set((s) => ({
          cards: [
            ...s.cards,
            {
              ...partial,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              fsrs: defaultFSRS(),
            },
          ],
        })),
      addCards: (partials) =>
        set((s) => ({
          cards: [
            ...s.cards,
            ...partials.map((p) => ({
              ...p,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              fsrs: defaultFSRS(),
            })),
          ],
        })),
      updateCard: (id, patch) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCard: (id) =>
        set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),
      submitFeedback: (id, rating) =>
        set((s) => ({
          cards: s.cards.map((c) => {
            if (c.id !== id) return c
            const nextFsrs = c.fsrs.reps === 0
              ? initFSRS(rating)
              : updateFSRS(c.fsrs, rating)
            return { ...c, fsrs: nextFsrs }
          }),
        })),
      clear: () => set({ cards: [] }),
    }),
    { name: "nevlo:cards" },
  ),
)

export function selectDueCards(cards: Card[]): Card[] {
  return cards
    .filter((c) => isDue(c.fsrs))
    .sort((a, b) => urgencyScore(b.fsrs) - urgencyScore(a.fsrs))
}

export function selectStats(cards: Card[]) {
  const totalReps = cards.reduce((a, c) => a + c.fsrs.reps, 0)
  const totalLapses = cards.reduce((a, c) => a + c.fsrs.lapses, 0)
  const accuracy = totalReps === 0
    ? 0
    : Math.round(100 - (totalLapses / Math.max(totalReps, 1)) * 100)
  return {
    count: cards.length,
    totalReps,
    totalLapses,
    accuracy,
    dueCount: cards.filter((c) => isDue(c.fsrs)).length,
  }
}
