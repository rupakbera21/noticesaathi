'use client'

import React from 'react'

interface NoticeCardItem {
  form: string
  tag: string
  section: string
  desc: string
  deadline: string
  sampleKey?: 'asmt10' | 'drc01' | 'gstr3a' | 'drc01a'
}

const SUPPORTED_NOTICES: NoticeCardItem[] = [
  {
    form: 'FORM GST ASMT-10',
    tag: 'Scrutiny of Returns',
    section: 'Section 61 / Rule 99',
    desc: 'Discrepancies found upon return scrutiny (e.g. Input Tax Credit availed in GSTR-3B exceeds GSTR-2B statement).',
    deadline: '30 days standard',
    sampleKey: 'asmt10',
  },
  {
    form: 'FORM GST DRC-01',
    tag: 'Show Cause Notice (SCN)',
    section: 'Section 73 & Section 74',
    desc: 'Formal demand for unpaid tax, interest, or penalty. Section 74 flags fraud, wilful suppression, and invokes human CA escalation.',
    deadline: '30 days standard',
    sampleKey: 'drc01',
  },
  {
    form: 'FORM GST GSTR-3A',
    tag: 'Notice to Return Defaulter',
    section: 'Section 46 / Rule 68',
    desc: 'Issued to registered taxpayers who fail to file periodic returns (GSTR-3B or GSTR-1) within statutory due dates.',
    deadline: '15 days statutory',
    sampleKey: 'gstr3a',
  },
  {
    form: 'FORM GST DRC-01A',
    tag: 'Pre-Notice Intimation',
    section: 'Rule 142(1A)',
    desc: 'Communication of tax ascertainment prior to issuance of a formal Show Cause Notice, providing an opportunity to pay or contest.',
    deadline: '15 to 30 days',
    sampleKey: 'drc01a',
  },
]

function NoticeCard({
  notice,
  onLoadSample,
}: {
  notice: NoticeCardItem
  onLoadSample: (key: 'asmt10' | 'drc01' | 'gstr3a' | 'drc01a') => void
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-xs space-y-2.5 transition-all">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
          {notice.form}
        </span>
        <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">
          {notice.deadline}
        </span>
      </div>
      <h3 className="text-sm font-bold text-[var(--text-primary)]">{notice.tag}</h3>
      <p className="text-[11px] font-mono text-[var(--text-subtle)]">{notice.section}</p>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{notice.desc}</p>
      {notice.sampleKey && (
        <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-end">
          <button
            type="button"
            onClick={() => notice.sampleKey && onLoadSample(notice.sampleKey)}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
          >
            Try this sample →
          </button>
        </div>
      )}
    </div>
  )
}

export function SupportedNoticesSection() {
  function handleLoadSample(key: 'asmt10' | 'drc01' | 'gstr3a' | 'drc01a') {
    window.dispatchEvent(new CustomEvent('noticesaathi:load-sample', { detail: key }))
  }

  return (
    <section id="supported-notices" className="w-full max-w-4xl space-y-6 pt-10">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
          Coverage
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
          Supported GST Notices
        </h2>
        <p className="text-xs text-[var(--text-secondary)] max-w-xl">
          Tailored parsing and statutory cross-checking across the most common notices received by
          Indian traders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPORTED_NOTICES.map((n, idx) => (
          <NoticeCard key={idx} notice={n} onLoadSample={handleLoadSample} />
        ))}
      </div>
    </section>
  )
}
