'use client'

import React, { useMemo } from 'react'
import { findReportHighlights, HighlightSpan } from './reportHighlighting'

export interface Block {
  type: 'heading' | 'paragraph' | 'ordered' | 'unordered'
  text?: string
  items?: Array<{ num?: string; text: string }>
}

export function renderInlineFormatted(text: string): React.ReactNode[] {
  // Splits by **bold text**
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2)
      return (
        <strong key={index} className="font-bold text-[var(--text-primary)]">
          {inner}
        </strong>
      )
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

export function renderHighlightedText(
  text: string,
  highlights: HighlightSpan[]
): React.ReactNode[] {
  if (!highlights || highlights.length === 0) {
    return renderInlineFormatted(text)
  }

  const matches: Array<{ phrase: string; index: number; globalIndex: number }> = []
  highlights.forEach((hl, gIdx) => {
    const idx = text.indexOf(hl.phrase)
    if (idx !== -1) {
      matches.push({ phrase: hl.phrase, index: idx, globalIndex: gIdx })
    }
  })

  if (matches.length === 0) {
    return renderInlineFormatted(text)
  }

  matches.sort((a, b) => a.index - b.index)

  const nodes: React.ReactNode[] = []
  let cursor = 0

  for (const m of matches) {
    if (m.index < cursor) continue
    if (m.index > cursor) {
      nodes.push(
        <React.Fragment key={`pre-${cursor}`}>
          {renderInlineFormatted(text.slice(cursor, m.index))}
        </React.Fragment>
      )
    }
    nodes.push(
      <mark
        key={`mark-${m.globalIndex}-${m.index}`}
        className="report-highlight-mark"
        style={{ animationDelay: `${m.globalIndex * 140}ms` }}
      >
        {renderInlineFormatted(m.phrase)}
      </mark>
    )
    cursor = m.index + m.phrase.length
  }

  if (cursor < text.length) {
    nodes.push(
      <React.Fragment key={`post-${cursor}`}>
        {renderInlineFormatted(text.slice(cursor))}
      </React.Fragment>
    )
  }

  return nodes
}

function isHeadingLine(line: string): boolean {
  return (
    (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) ||
    /^#{1,4}\s+/.test(line)
  )
}

function cleanHeadingText(line: string): string {
  return line
    .replace(/^(\*{2}|#{1,4}\s*)/, '')
    .replace(/\*{2}:?$/, '')
    .trim()
}

function parseListMatch(
  line: string
): { type: 'ordered' | 'unordered'; num?: string; text: string } | null {
  const orderedMatch = line.match(/^([0-9]+|[০-৯]+|[०-९]+)[\.\)]\s+(.*)$/)
  if (orderedMatch && orderedMatch[1] && orderedMatch[2]) {
    return { type: 'ordered', num: orderedMatch[1], text: orderedMatch[2] }
  }
  const unorderedMatch = line.match(/^[-*•]\s+(.*)$/)
  if (unorderedMatch && unorderedMatch[1]) {
    return { type: 'unordered', text: unorderedMatch[1] }
  }
  return null
}

export function parseExplanationBlocks(rawText: string): Block[] {
  const lines = rawText.split(/\r?\n/)
  const blocks: Block[] = []
  let currentList: {
    type: 'ordered' | 'unordered'
    items: Array<{ num?: string; text: string }>
  } | null = null
  let currentParagraph: string[] = []

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', text: currentParagraph.join(' ') })
      currentParagraph = []
    }
  }

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList)
      currentList = null
    }
  }

  for (const rawLine of lines) {
    const line = (rawLine ?? '').trim()
    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    if (isHeadingLine(line)) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', text: cleanHeadingText(line) })
      continue
    }

    const listMatch = parseListMatch(line)
    if (listMatch) {
      flushParagraph()
      if (!currentList || currentList.type !== listMatch.type) {
        flushList()
        currentList = { type: listMatch.type, items: [] }
      }
      currentList.items.push(listMatch)
      continue
    }

    flushList()
    currentParagraph.push(line)
  }

  flushParagraph()
  flushList()
  return blocks
}

function RenderBlock({
  block,
  index,
  highlights,
}: {
  block: Block
  index: number
  highlights: HighlightSpan[]
}) {
  if (block.type === 'heading' && block.text) {
    return (
      <h4
        key={index}
        className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mt-4 mb-2 flex items-center gap-1.5 border-b border-[var(--border-subtle)] pb-1"
      >
        <span>{renderHighlightedText(block.text, highlights)}</span>
      </h4>
    )
  }

  if (block.type === 'ordered' && block.items) {
    return (
      <ol
        key={index}
        className="space-y-2 my-2.5 pl-4 list-decimal marker:font-bold marker:text-[var(--color-primary)]"
      >
        {block.items.map((item, itemIdx) => (
          <li
            key={itemIdx}
            className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] pl-1"
          >
            {renderHighlightedText(item.text, highlights)}
          </li>
        ))}
      </ol>
    )
  }

  if (block.type === 'unordered' && block.items) {
    return (
      <ul
        key={index}
        className="space-y-2 my-2.5 pl-4 list-disc marker:text-[var(--color-primary)]"
      >
        {block.items.map((item, itemIdx) => (
          <li
            key={itemIdx}
            className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] pl-1"
          >
            {renderHighlightedText(item.text, highlights)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p key={index} className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] mb-3">
      {block.text ? renderHighlightedText(block.text, highlights) : null}
    </p>
  )
}

export function FormattedExplanation({ text }: { text: string }) {
  const blocks = useMemo(() => parseExplanationBlocks(text), [text])
  const highlights = useMemo(() => findReportHighlights(text), [text])

  if (!text || text.trim().length === 0) {
    return null
  }

  return (
    <div className="space-y-1" data-testid="formatted-explanation">
      {blocks.map((block, idx) => (
        <RenderBlock key={idx} block={block} index={idx} highlights={highlights} />
      ))}
    </div>
  )
}
