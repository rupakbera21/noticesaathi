'use client'

import React, { useState } from 'react'
import { ExtractedNotice } from '@/schemas/notice'
import { TotalsConsistencyResult } from '@/domain/totals'
import { EscalationResult } from '@/domain/escalation'
import { ReceiptSummary } from './ReceiptSummary'
import { EscalationCard } from './EscalationCard'
import { ExplanationTabs } from './ExplanationTabs'
import { StatutoryCitations, CitationItem } from './StatutoryCitations'
import { DraftReplyModal } from './DraftReplyModal'
import { SampleNoticeButtons, SampleKey } from './SampleNoticeButtons'
import { NoticeInputCard } from './NoticeInputCard'

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

function NoticeModalsAndResults({
  analysis,
  language,
  loading,
  isDraftModalOpen,
  onLanguageChange,
  onOpenDraftModal,
  onCloseDraftModal,
}: {
  analysis: AnalysisResponse | null
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
      <div className="space-y-6 animate-fade-in" data-testid="analysis-results">
        <ReceiptSummary
          notice={analysis.notice}
          totals={analysis.totals}
          deadline={analysis.deadline}
        />
        <EscalationCard escalation={analysis.escalation} />
        <div className="flex justify-end">
          <button
            onClick={onOpenDraftModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200/60 dark:bg-gradient-to-r dark:from-[#3521C1] dark:via-[#4338CA] dark:to-[#585EF8] dark:shadow-indigo-950/50 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
            data-testid="open-draft-modal-btn"
          >
            ✍️ Draft Formal Portal Reply under Section 75(4) →
          </button>
        </div>
        <ExplanationTabs
          initialExplanation={analysis.explanation}
          onLanguageChange={onLanguageChange}
          currentLanguage={language}
          loading={loading}
        />
        <StatutoryCitations citations={analysis.citations} />
      </div>
      <DraftReplyModal
        notice={analysis.notice}
        isOpen={isDraftModalOpen}
        onClose={onCloseDraftModal}
      />
    </>
  )
}

function useNoticeState() {
  const [noticeText, setNoticeText] = useState('')
  const [selectedSample, setSelectedSample] = useState<SampleKey | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; chars: number } | null>(null)
  const [language, setLanguage] = useState<'en' | 'hi' | 'bn'>('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)

  return {
    noticeText, setNoticeText,
    selectedSample, setSelectedSample,
    uploadedFile, setUploadedFile,
    language, setLanguage,
    loading, setLoading,
    error, setError,
    analysis, setAnalysis,
    isDraftModalOpen, setIsDraftModalOpen,
  }
}

export function NoticeAnalyzer() {
  const {
    noticeText, setNoticeText,
    selectedSample, setSelectedSample,
    uploadedFile, setUploadedFile,
    language, setLanguage,
    loading, setLoading,
    error, setError,
    analysis, setAnalysis,
    isDraftModalOpen, setIsDraftModalOpen,
  } = useNoticeState()

  async function handleAnalyze(selectedLang: 'en' | 'hi' | 'bn' = language) {
    if (noticeText.trim().length < 20) {
      setError('Please enter at least 20 characters of the notice text.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noticeText, language: selectedLang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to analyze notice')
      setAnalysis(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-6" data-testid="notice-analyzer">
      <SampleNoticeButtons
        selectedSample={selectedSample}
        onSelect={(key, t) => {
          setSelectedSample(key)
          setNoticeText(t)
          setUploadedFile(null)
          setAnalysis(null)
        }}
      />
      <NoticeInputCard
        noticeText={noticeText}
        setNoticeText={t => {
          setNoticeText(t)
          setSelectedSample(null)
        }}
        uploadedFile={uploadedFile}
        onClearUpload={() => {
          setUploadedFile(null)
          setNoticeText('')
        }}
        onTextExtracted={(txt, fn, count) => {
          setNoticeText(txt)
          setUploadedFile({ name: fn, chars: count })
          setSelectedSample(null)
          setAnalysis(null)
          setError(null)
        }}
        language={language}
        onLanguageChange={l => {
          setLanguage(l)
          if (analysis) handleAnalyze(l)
        }}
        onAnalyze={() => handleAnalyze()}
        loading={loading}
        error={error}
        onError={msg => setError(msg)}
      />
      <NoticeModalsAndResults
        analysis={analysis}
        language={language}
        loading={loading}
        isDraftModalOpen={isDraftModalOpen}
        onLanguageChange={l => {
          setLanguage(l)
          handleAnalyze(l)
        }}
        onOpenDraftModal={() => setIsDraftModalOpen(true)}
        onCloseDraftModal={() => setIsDraftModalOpen(false)}
      />
    </div>
  )
}
