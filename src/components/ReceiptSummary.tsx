'use client'

import React from 'react'
import { ExtractedNotice } from '@/schemas/notice'
import { TotalsConsistencyResult } from '@/domain/totals'

interface ReceiptSummaryProps {
  notice: ExtractedNotice
  totals: TotalsConsistencyResult
  deadline: {
    status?: 'explicit' | 'derived' | 'uncertain'
    formattedDate: string | null
    remainingDays: number | null
    isExpired: boolean
    message?: string
  }
}

function ReceiptHeader({
  notice,
  deadline,
}: {
  notice: ExtractedNotice
  deadline: ReceiptSummaryProps['deadline']
}) {
  const isUrgent =
    typeof deadline.remainingDays === 'number' && deadline.remainingDays <= 5 && !deadline.isExpired
  const isUncertain =
    deadline.status === 'uncertain' || !deadline.formattedDate || deadline.remainingDays === null

  return (
    <div className="mb-6 border-b border-dashed border-[var(--border-subtle)] pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-primary)]">
              Assessed Notice Receipt
            </span>
            <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
              {notice.formsCited[0] || 'GST Notice'}
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--text-primary)] md:text-2xl">
            {notice.noticeTypeDescription}
          </h2>
        </div>
        {isUncertain ? (
          <div
            className="rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
            data-testid="deadline-badge-uncertain"
          >
            Check the deadline on your notice
          </div>
        ) : (
          <div
            className={`rounded-full px-3.5 py-1 text-xs font-bold tracking-wide uppercase ${
              deadline.isExpired
                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-500'
                : isUrgent
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-500'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600'
            }`}
            data-testid="deadline-badge"
          >
            {deadline.isExpired
              ? `Response Expired (${deadline.formattedDate})`
              : `${deadline.remainingDays} Days Left (${deadline.formattedDate})`}
          </div>
        )}
      </div>
    </div>
  )
}

function NoticeMetaGrid({ notice }: { notice: ExtractedNotice }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
      <div>
        <span className="block text-slate-500 dark:text-gray-400">Taxpayer GSTIN</span>
        <span
          className="font-mono font-semibold text-slate-800 dark:text-gray-200"
          data-testid="taxpayer-gstin"
        >
          {notice.taxpayerGstin || 'Not Cited'}
        </span>
      </div>
      <div>
        <span className="block text-slate-500 dark:text-gray-400">Notice DIN / Ref</span>
        <span
          className="font-mono font-semibold text-slate-800 dark:text-gray-200"
          data-testid="notice-reference"
        >
          {notice.noticeReferenceNumber || 'Pending DIN'}
        </span>
      </div>
      <div>
        <span className="block text-slate-500 dark:text-gray-400">Notice Date</span>
        <span className="font-semibold text-slate-800 dark:text-gray-200">
          {notice.noticeDate || 'Not specified'}
        </span>
      </div>
      <div>
        <span className="block text-slate-500 dark:text-gray-400">Tax Period</span>
        <span className="font-semibold text-slate-800 dark:text-gray-200">
          {notice.taxPeriod || 'Specified Period'}
        </span>
      </div>
    </div>
  )
}

function FinancialBreakdown({ notice }: { notice: ExtractedNotice }) {
  return (
    <div className="mb-6 rounded-xl p-4 font-mono text-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
      <div className="flex justify-between py-1.5 text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
        <span>Tax Demand</span>
        <span
          className="font-semibold tabular-nums text-[var(--text-primary)]"
          data-testid="amount-tax"
        >
          ₹{notice.taxDemand.toLocaleString('en-IN')}
        </span>
      </div>
      <div className="flex justify-between py-1.5 text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
        <span>Interest (Section 50 CGST)</span>
        <span
          className="font-semibold tabular-nums text-[var(--text-primary)]"
          data-testid="amount-interest"
        >
          ₹{notice.interestDemand.toLocaleString('en-IN')}
        </span>
      </div>
      <div className="flex justify-between py-1.5 text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
        <span>Penalty (Section 73 / Section 74)</span>
        <span
          className="font-semibold tabular-nums text-[var(--text-primary)]"
          data-testid="amount-penalty"
        >
          ₹{notice.penaltyDemand.toLocaleString('en-IN')}
        </span>
      </div>
      {notice.otherDemand > 0 && (
        <div className="flex justify-between py-1.5 text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
          <span>Other Late Fee / Fees</span>
          <span className="font-semibold tabular-nums text-[var(--text-primary)]">
            ₹{notice.otherDemand.toLocaleString('en-IN')}
          </span>
        </div>
      )}
      <div className="mt-3 flex justify-between border-t border-dashed border-[var(--border-strong)] pt-3 text-sm font-bold text-[var(--text-primary)]">
        <span>TOTAL STATED DUE</span>
        <span
          className="text-base text-[var(--color-primary)] font-black tabular-nums"
          data-testid="amount-total"
        >
          ₹{notice.totalStatedDemand.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  )
}

export function ReceiptSummary({ notice, totals, deadline }: ReceiptSummaryProps) {
  return (
    <div
      className="relative w-full rounded-2xl border bg-[var(--surface)] p-6 transition-all"
      style={{
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--receipt-shadow)',
      }}
      data-testid="receipt-summary"
    >
      <ReceiptHeader notice={notice} deadline={deadline} />
      <NoticeMetaGrid notice={notice} />
      <FinancialBreakdown notice={notice} />

      <div className="flex items-center gap-2 text-xs font-medium">
        {totals.isConsistent ? (
          <span
            className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400"
            data-testid="consistent-badge"
          >
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Line items match total stated demand exactly.
          </span>
        ) : (
          <span
            className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300"
            data-testid="discrepancy-badge"
          >
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {totals.discrepancyMessage}
          </span>
        )}
      </div>
    </div>
  )
}
