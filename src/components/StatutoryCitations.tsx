'use client'

import React from 'react'

export interface CitationItem {
  id: string
  identifier: string
  title: string
  contentSnippet: string
  sourceUrl: string
  authority: string
}

interface StatutoryCitationsProps {
  citations: CitationItem[]
}

export function StatutoryCitations({ citations }: StatutoryCitationsProps) {
  if (!citations || citations.length === 0) {
    return null
  }

  return (
    <div
      className="w-full rounded-2xl border p-5 backdrop-blur-md shadow-xs"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      data-testid="statutory-citations"
    >
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        Verified CBIC Statutory Provisions &amp; Citations
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {citations.map((c, idx) => (
          <div
            key={idx}
            className="rounded-xl p-3.5 text-xs bg-slate-50/80 border border-slate-200/90 shadow-xs dark:bg-black/50 dark:border-white/10"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-900 dark:text-white">{c.identifier}</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400">
                {c.authority}
              </span>
            </div>
            <p className="mt-1 font-semibold text-slate-800 dark:text-gray-200">{c.title}</p>
            <p className="mt-1 text-slate-600 dark:text-gray-400 leading-relaxed">
              {c.contentSnippet}
            </p>
            <a
              href={c.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Verify on Official CBIC Portal →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
