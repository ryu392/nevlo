"use client"
import katex from "katex"
import { useMemo } from "react"
import type { CSSProperties, ReactNode } from "react"

interface Props {
  text: string
  className?: string
  style?: CSSProperties
}

export function MathText({ text, className, style }: Props) {
  const parts = useMemo(() => renderParts(text), [text])
  return (
    <span className={className} style={style}>
      {parts}
    </span>
  )
}

function renderParts(text: string): ReactNode[] {
  if (!text) return []
  const chunks = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)
  return chunks.map((c, i) => {
    if (c.startsWith("$$") && c.endsWith("$$") && c.length > 4) {
      try {
        const html = katex.renderToString(c.slice(2, -2), {
          throwOnError: false,
          displayMode: true,
        })
        return (
          <span
            key={i}
            className="block text-center my-2"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      } catch {
        return <span key={i}>{c}</span>
      }
    }
    if (c.startsWith("$") && c.endsWith("$") && c.length > 2) {
      try {
        const html = katex.renderToString(c.slice(1, -1), {
          throwOnError: false,
          displayMode: false,
        })
        return (
          <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
        )
      } catch {
        return <span key={i}>{c}</span>
      }
    }
    return <span key={i}>{c}</span>
  })
}
