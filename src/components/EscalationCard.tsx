'use client'

import React from 'react'
import { EscalationResult } from '@/domain/escalation'

interface EscalationCardProps {
  escalation: EscalationResult
}

export function EscalationCard({ escalation }: EscalationCardProps) {
  if (!escalation.shouldEscalate) {
    return null
  }

  const isCritical = escalation.riskLevel === 'CRITICAL'

  return (
    <aside
      aria-label="Professional Escalation Advisory"
      className={`relative w-full rounded-2xl border p-5 transition-all ${
        isCritical
          ? 'border-rose-200 bg-rose-50/90 text-rose-950 shadow-sm shadow-rose-100/50 dark:border-red-500/80 dark:bg-red-950/40 dark:text-red-100 dark:shadow-red-950/50'
          : 'border-amber-200 bg-amber-50/90 text-amber-950 shadow-sm shadow-amber-100/50 dark:border-amber-500/80 dark:bg-amber-950/40 dark:text-amber-100 dark:shadow-amber-950/50'
      } backdrop-blur-md`}
      data-testid="escalation-card"
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 flex-shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 border border-rose-200 dark:bg-red-500/20 dark:text-red-400 dark:border-transparent">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-rose-950 dark:text-white">
              Chartered Accountant (CA) Escalation Recommended
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-red-800 dark:text-red-200 dark:border-red-600' : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-800 dark:text-amber-200 dark:border-amber-600'
              }`}
            >
              {escalation.riskLevel} Risk
            </span>
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-rose-950/90 dark:text-gray-300">
            Under NoticeSaathi&apos;s ₹5,00,000 MSME triage policy, this notice involves significant financial exposure or statutory allegations (e.g. Section 74, Section 67, or registration cancellation). Review the draft reply, verify all supporting invoices and records, and consult a qualified Chartered Accountant before filing on the GST portal.
          </p>

          <ul className="mt-3 space-y-1.5 text-xs">
            {escalation.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-rose-950 dark:text-gray-200">
                <span className="text-rose-600 dark:text-red-400 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-white/80 px-2.5 py-1 text-red-900 border border-red-200 dark:bg-black/40 dark:text-gray-300 dark:border-white/10">
              Recommended: Section 75(4) Personal Hearing Application
            </span>
            <span className="rounded bg-white/80 px-2.5 py-1 text-red-900 border border-red-200 dark:bg-black/40 dark:text-gray-300 dark:border-white/10">
              Maintain: GSTR-2B Invoices &amp; E-way Bills
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
