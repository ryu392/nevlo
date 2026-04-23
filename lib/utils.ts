type ClassValue = string | number | null | undefined | false | Record<string, boolean>

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input))
      continue
    }
    for (const [key, value] of Object.entries(input)) {
      if (value) out.push(key)
    }
  }
  return out.join(" ")
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "..." : text
}

export function parseWrongQs(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map((n) => parseInt(n, 10))
    .filter((n) => !Number.isNaN(n) && n > 0)
}
