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
  const isUrgent = typeof deadline.remainingDays === 'number' && deadline.remainingDays <= 5 && !deadline.isExpired
  const isUncertain = deadline.status === 'uncertain' || !deadline.formattedDate || deadline.remainingDays === null

  return (
    <div className="mb-6 border-b border-dashed pb-4" style={{ borderColor: 'var(--color-border-strong)' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            Tax Demand Assessment Receipt
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white md:text-2xl">
            {notice.noticeTypeDescription}
          </h2>
        </div>
        {isUncertain ? (
          <div
            className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
            data-testid="deadline-badge-uncertain"
          >
            Check the deadline on your notice
          </div>
        ) : (
          <div
            className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
              deadline.isExpired
                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-red-900/60 dark:text-red-200 dark:border-red-500'
                : isUrgent
                ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-500'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-600'
            }`}
            data-testid="deadline-badge"
          >
            {deadline.isExpired ? 'Response Expired' : `${deadline.remainingDays} Days Left (${deadline.formattedDate})`}
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
        <span className="font-mono font-semibold text-slate-800 dark:text-gray-200" data-testid="taxpayer-gstin">
          {notice.taxpayerGstin || 'Not Cited'}
        </span>
      </div>
      <div>
        <span className="block text-slate-500 dark:text-gray-400">Notice DIN / Ref</span>
        <span className="font-mono font-semibold text-slate-800 dark:text-gray-200" data-testid="notice-reference">
          {notice.noticeReferenceNumber || 'Pending DIN'}
        </span>
      </div>
      <div>
        <span className="block text-slate-500 dark:text-gray-400">Notice Date</span>
        <span className="font-semibold text-slate-800 dark:text-gray-200">{notice.noticeDate || 'Not specified'}</span>
      </div>
      <div>
        <span className="block text-slate-500 dark:text-gray-400">Tax Period</span>
        <span className="font-semibold text-slate-800 dark:text-gray-200">{notice.taxPeriod || 'Specified Period'}</span>
      </div>
    </div>
  )
}

function FinancialBreakdown({ notice }: { notice: ExtractedNotice }) {
  return (
    <div
      className="mb-6 rounded-lg p-4 font-mono text-sm bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10"
    >
      <div className="flex justify-between py-1 text-slate-700 dark:text-gray-300">
        <span>Tax Demand</span>
        <span data-testid="amount-tax">₹{notice.taxDemand.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between py-1 text-slate-700 dark:text-gray-300">
        <span>Interest (Section 50 CGST)</span>
        <span data-testid="amount-interest">₹{notice.interestDemand.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between py-1 text-slate-700 dark:text-gray-300">
        <span>Penalty (Section 73 / Section 74)</span>
        <span data-testid="amount-penalty">₹{notice.penaltyDemand.toLocaleString('en-IN')}</span>
      </div>
      {notice.otherDemand > 0 && (
        <div className="flex justify-between py-1 text-slate-700 dark:text-gray-300">
          <span>Other Late Fee / Fees</span>
          <span>₹{notice.otherDemand.toLocaleString('en-IN')}</span>
        </div>
      )}
      <div
        className="mt-3 flex justify-between border-t border-dashed pt-3 text-base font-bold text-slate-900 dark:text-white"
        style={{ borderColor: 'var(--color-border-strong)' }}
      >
        <span>TOTAL STATED DUE</span>
        <span className="text-indigo-700 dark:text-indigo-300 font-extrabold" data-testid="amount-total">
          ₹{notice.totalStatedDemand.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  )
}

export function ReceiptSummary({ notice, totals, deadline }: ReceiptSummaryProps) {
  return (
    <div
      className="relative w-full rounded-2xl border p-6 backdrop-blur-md transition-all"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--receipt-shadow)',
      }}
      data-testid="receipt-summary"
    >
      <ReceiptHeader notice={notice} deadline={deadline} />
      <NoticeMetaGrid notice={notice} />
      <FinancialBreakdown notice={notice} />

      <div className="flex items-center gap-2 text-xs font-medium">
        {totals.isConsistent ? (
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400" data-testid="consistent-badge">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Line items match total stated demand exactly.
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300" data-testid="discrepancy-badge">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {totals.discrepancyMessage}
          </span>
        )}
      </div>
    </div>
  )
}
