'use client'

import React, { useMemo } from 'react'

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
        <strong
          key={index}
          className="font-bold text-[var(--text-primary)]"
        >
          {inner}
        </strong>
      )
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
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

function parseListMatch(line: string): { type: 'ordered' | 'unordered'; num?: string; text: string } | null {
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
  let currentList: { type: 'ordered' | 'unordered'; items: Array<{ num?: string; text: string }> } | null = null
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

function RenderBlock({ block, index }: { block: Block; index: number }) {
  if (block.type === 'heading' && block.text) {
    return (
      <h4
        key={index}
        className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mt-4 mb-2 flex items-center gap-1.5 border-b border-[var(--border-subtle)] pb-1"
      >
        <span>{block.text}</span>
      </h4>
    )
  }

  if (block.type === 'ordered' && block.items) {
    return (
      <ol key={index} className="space-y-2 my-2.5 pl-4 list-decimal marker:font-bold marker:text-[var(--color-primary)]">
        {block.items.map((item, itemIdx) => (
          <li key={itemIdx} className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] pl-1">
            {renderInlineFormatted(item.text)}
          </li>
        ))}
      </ol>
    )
  }

  if (block.type === 'unordered' && block.items) {
    return (
      <ul key={index} className="space-y-2 my-2.5 pl-4 list-disc marker:text-[var(--color-primary)]">
        {block.items.map((item, itemIdx) => (
          <li key={itemIdx} className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] pl-1">
            {renderInlineFormatted(item.text)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p key={index} className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] mb-3">
      {block.text ? renderInlineFormatted(block.text) : null}
    </p>
  )
}

export function FormattedExplanation({ text }: { text: string }) {
  const blocks = useMemo(() => parseExplanationBlocks(text), [text])

  if (!text || text.trim().length === 0) {
    return null
  }

  return (
    <div className="space-y-1" data-testid="formatted-explanation">
      {blocks.map((block, idx) => (
        <RenderBlock key={idx} block={block} index={idx} />
      ))}
    </div>
  )
}
