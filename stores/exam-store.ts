"use client"
import { create } from "zustand"
import type { ExamResult } from "@/types"

interface ExamState {
  files: File[]
  imageUrls: string[]
  examName: string
  subject: string
  wrongQsInput: string
  result: ExamResult | null
  error: string
  addFiles: (files: File[]) => void
  removeFile: (index: number) => void
  setExamName: (name: string) => void
  setSubject: (subject: string) => void
  setWrongQsInput: (input: string) => void
  setResult: (result: ExamResult | null) => void
  setError: (msg: string) => void
  resetInputs: () => void
}

export const useExamStore = create<ExamState>((set) => ({
  files: [],
  imageUrls: [],
  examName: "",
  subject: "수학",
  wrongQsInput: "",
  result: null,
  error: "",
  addFiles: (newFiles) =>
    set((s) => {
      const urls = newFiles.map((f) => URL.createObjectURL(f))
      return {
        files: [...s.files, ...newFiles],
        imageUrls: [...s.imageUrls, ...urls],
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
  setExamName: (examName) => set({ examName }),
  setSubject: (subject) => set({ subject }),
  setWrongQsInput: (wrongQsInput) => set({ wrongQsInput }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  resetInputs: () =>
    set((s) => {
      for (const u of s.imageUrls) URL.revokeObjectURL(u)
      return {
        files: [],
        imageUrls: [],
        examName: "",
        subject: "수학",
        wrongQsInput: "",
        error: "",
      }
    }),
}))
