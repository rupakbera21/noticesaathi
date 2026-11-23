'use client'

import React from 'react'
import { ExtractedNotice } from '@/schemas/notice'
import { TotalsConsistencyResult } from '@/domain/totals'
import { EscalationResult } from '@/domain/escalation'
import { ReceiptSummary } from './ReceiptSummary'
import { EscalationCard } from './EscalationCard'
import { ExplanationTabs } from './ExplanationTabs'
import { StatutoryCitations, CitationItem } from './StatutoryCitations'
import { DraftReplyModal } from './DraftReplyModal'

export interface AnalysisResponse {
  notice: ExtractedNotice
  totals: TotalsConsistencyResult
  escalation: EscalationResult
  citations: CitationItem[]
  explanation: string
  deadline: {
    status?: 'explicit' | 'derived' | 'uncertain'
    formattedDate: string | null
    remainingDays: number | null
    isExpired: boolean
    message?: string
  }
}

function ActiveNoticeBanner({
  label,
  onEditNotice,
}: {
  label?: string
  onEditNotice?: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-2.5 text-xs shadow-xs">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="font-semibold text-[var(--text-primary)]">
          {label || 'Analyzed Notice Result'}
        </span>
      </div>
      {onEditNotice && (
        <button
          type="button"
          onClick={onEditNotice}
          className="font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
          data-testid="edit-notice-btn"
        >
          <span>✏️ Edit notice</span>
        </button>
      )}
    </div>
  )
}

function NoticeSidebar({
  escalation,
  onOpenDraftModal,
}: {
  escalation: EscalationResult
  onOpenDraftModal: () => void
}) {
  return (
    <div className="lg:col-span-4 space-y-5">
      <div
        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-xs space-y-3.5"
        data-testid="next-steps-card"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Next Step
          </span>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">What to do next</h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Review the itemized discrepancies and prepare your formal response before filing on the
          GST portal.
        </p>
        <button
          type="button"
          onClick={onOpenDraftModal}
          className="w-full rounded-xl bg-[var(--primary-action)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs px-4 py-3 shadow-md shadow-indigo-200/50 dark:shadow-indigo-950/60 transition-all active:scale-98 text-center"
          data-testid="open-draft-modal-btn"
        >
          Prepare a draft reply →
        </button>
      </div>
      <EscalationCard escalation={escalation} />
    </div>
  )
}

export function NoticeModalsAndResults({
  analysis,
  noticeContextLabel,
  onEditNotice,
  language,
  loading,
  isDraftModalOpen,
  onLanguageChange,
  onOpenDraftModal,
  onCloseDraftModal,
}: {
  analysis: AnalysisResponse | null
  noticeContextLabel?: string
  onEditNotice?: () => void
  language: 'en' | 'hi' | 'bn'
  loading: boolean
  isDraftModalOpen: boolean
  onLanguageChange: (l: 'en' | 'hi' | 'bn') => void
  onOpenDraftModal: () => void
  onCloseDraftModal: () => void
}) {
  if (!analysis) return null
  return (
    <>
      <div
        id="analysis-results-section"
        className="space-y-6 animate-fade-in scroll-mt-24"
        data-testid="analysis-results"
      >
        <ActiveNoticeBanner label={noticeContextLabel} onEditNotice={onEditNotice} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <ReceiptSummary
              notice={analysis.notice}
              totals={analysis.totals}
              deadline={analysis.deadline}
            />
            <ExplanationTabs
              initialExplanation={analysis.explanation}
              onLanguageChange={onLanguageChange}
              currentLanguage={language}
              loading={loading}
            />
            <StatutoryCitations citations={analysis.citations} />
          </div>

          <NoticeSidebar escalation={analysis.escalation} onOpenDraftModal={onOpenDraftModal} />
        </div>
      </div>
      <DraftReplyModal
        notice={analysis.notice}
        isOpen={isDraftModalOpen}
        onClose={onCloseDraftModal}
      />
    </>
  )
}
