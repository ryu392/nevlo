"use client"
import { create } from "zustand"
import type { DraftCard, ReviewCard } from "@/types"

interface CaptureState {
  files: File[]
  imageUrls: string[]
  drafts: DraftCard[]
  reviewCards: ReviewCard[]
  error: string
  addFiles: (files: File[]) => void
  removeFile: (index: number) => void
  resetImages: () => void
  setDrafts: (drafts: DraftCard[]) => void
  updateDraft: (id: string, patch: Partial<DraftCard>) => void
  addIdea: (id: string) => void
  removeIdea: (id: string, index: number) => void
  setReviewCards: (cards: ReviewCard[]) => void
  updateReviewCard: (index: number, patch: Partial<ReviewCard>) => void
  setError: (msg: string) => void
  resetAll: () => void
}

export const useCaptureStore = create<CaptureState>((set) => ({
  files: [],
  imageUrls: [],
  drafts: [],
  reviewCards: [],
  error: "",
  addFiles: (newFiles) =>
    set((s) => {
      const newUrls = newFiles.map((f) => URL.createObjectURL(f))
      return {
        files: [...s.files, ...newFiles],
        imageUrls: [...s.imageUrls, ...newUrls],
      }
    }),
  removeFile: (i) =>
    set((s) => {
      URL.revokeObjectURL(s.imageUrls[i])
      return {
        files: s.files.filter((_, j) => j !== i),
        imageUrls: s.imageUrls.filter((_, j) => j !== i),
      }
    }),
  resetImages: () =>
    set((s) => {
      for (const u of s.imageUrls) URL.revokeObjectURL(u)
      return { files: [], imageUrls: [] }
    }),
  setDrafts: (drafts) => set({ drafts }),
  updateDraft: (id, patch) =>
    set((s) => ({
      drafts: s.drafts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),
  addIdea: (id) =>
    set((s) => ({
      drafts: s.drafts.map((d) => {
        if (d.id !== id || !d.ideaInput.trim()) return d
        return {
          ...d,
          ideas: [...d.ideas, d.ideaInput.trim()],
          ideaInput: "",
        }
      }),
    })),
  removeIdea: (id, index) =>
    set((s) => ({
      drafts: s.drafts.map((d) =>
        d.id === id
          ? { ...d, ideas: d.ideas.filter((_, j) => j !== index) }
          : d,
      ),
    })),
  setReviewCards: (reviewCards) => set({ reviewCards }),
  updateReviewCard: (i, patch) =>
    set((s) => ({
      reviewCards: s.reviewCards.map((c, j) =>
        j === i ? { ...c, ...patch } : c,
      ),
    })),
  setError: (error) => set({ error }),
  resetAll: () =>
    set((s) => {
      for (const u of s.imageUrls) URL.revokeObjectURL(u)
      return {
        files: [],
        imageUrls: [],
        drafts: [],
        reviewCards: [],
        error: "",
      }
    }),
}))
