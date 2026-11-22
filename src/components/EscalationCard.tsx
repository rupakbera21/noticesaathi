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
      className={`relative w-full rounded-xl border p-5 transition-all ${
        isCritical
          ? 'border-red-300 bg-red-50 text-red-950 shadow-red-100 dark:border-red-500/80 dark:bg-red-950/40 dark:text-red-100 dark:shadow-red-950/50'
          : 'border-amber-300 bg-amber-50 text-amber-950 shadow-amber-100 dark:border-amber-500/80 dark:bg-amber-950/40 dark:text-amber-100 dark:shadow-amber-950/50'
      } shadow-xl backdrop-blur-md`}
      data-testid="escalation-card"
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 flex-shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
            ⚠️
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-red-950 dark:text-white">
              Chartered Accountant (CA) Escalation Recommended
            </h3>
            <span
              className={`rounded px-2 py-0.5 text-xs font-black uppercase ${
                isCritical ? 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-200' : 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200'
              }`}
            >
              {escalation.riskLevel} Risk
            </span>
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-red-900/90 dark:text-gray-300">
            This notice contains high-stakes statutory allegations or financial liabilities that
            carry severe legal consequences if mishandled. We strongly advise taking your books of accounts to a qualified CA or GST Practitioner.
          </p>

          <ul className="mt-3 space-y-1.5 text-xs">
            {escalation.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-red-950 dark:text-gray-200">
                <span className="text-red-600 dark:text-red-400">•</span>
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
