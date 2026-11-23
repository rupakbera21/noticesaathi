'use client'

import React from 'react'

export interface ExcerptInfo {
  label: string
  lines: string
  before: string
  highlight: string
  after: string
}

export function getNoticeExcerpt(
  notice: { taxpayerGstin?: string | null; noticeReferenceNumber?: string | null; taxDemand: number },
  type: 'tax' | 'interest'
): ExcerptInfo | null {
  const isAsmt10 =
    (notice.taxpayerGstin === '07TESTU9999R1Z9' ||
      notice.noticeReferenceNumber === 'ASMT10/DL/2024/0912') &&
    notice.taxDemand === 42000

  if (isAsmt10) {
    if (type === 'tax') {
      return {
        label: 'FORM GST ASMT-10',
        lines: 'Lines 15–18',
        before:
          'Input Tax Credit availed in Table 4(A)(5) of GSTR-3B exceeds ITC available in GSTR-2B by Rs 42,000.\n\n',
        highlight: 'Tax: Rs 42,000',
        after: '\nInterest under Sec 50: Rs 3,500',
      }
    }
    return {
      label: 'FORM GST ASMT-10',
      lines: 'Lines 18–20',
      before: 'Tax: Rs 42,000\n',
      highlight: 'Interest under Sec 50: Rs 3,500',
      after: '\nPenalty: Rs 0\nTotal Stated Demand: Rs 45,500',
    }
  }

  const isDrc01 =
    (notice.taxpayerGstin === '27FAKEX0000R1Z2' ||
      notice.noticeReferenceNumber === 'DRC01/MH/2024/7712') &&
    notice.taxDemand === 680000

  if (isDrc01) {
    if (type === 'tax') {
      return {
        label: 'FORM GST DRC-01',
        lines: 'Lines 34–37',
        before: 'Show Cause Notice under Section 74 of the CGST Act, 2017.\n',
        highlight: 'Tax: Rs 6,80,000',
        after: '\nInterest under Sec 50: Rs 1,12,000',
      }
    }
    return {
      label: 'FORM GST DRC-01',
      lines: 'Lines 37–39',
      before: 'Tax: Rs 6,80,000\n',
      highlight: 'Interest under Sec 50: Rs 1,12,000',
      after: '\nPenalty under Sec 74: Rs 6,80,000',
    }
  }

  return null
}

export function SourceExcerptView({ excerpt, id }: { excerpt: ExcerptInfo; id: string }) {
  return (
    <div
      id={id}
      role="region"
      aria-label={`${excerpt.label} excerpt`}
      className="my-2 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)] dark:border-indigo-900/60 dark:bg-indigo-950/40"
    >
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-sans">
        <span>Verified Synthetic Notice Excerpt</span>
        <span className="font-normal text-slate-500 dark:text-slate-400">{excerpt.lines}</span>
      </div>
      <p className="select-text whitespace-pre-wrap font-mono">
        {excerpt.before}
        <mark className="rounded bg-violet-200 px-1 py-0.5 font-bold text-violet-950 dark:bg-violet-900/80 dark:text-violet-100">
          {excerpt.highlight}
        </mark>
        {excerpt.after}
      </p>
    </div>
  )
}
