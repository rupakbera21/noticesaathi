'use client'

import React, { useState, useEffect } from 'react'
import { ExtractedNotice } from '@/schemas/notice'
import { TotalsConsistencyResult } from '@/domain/totals'
import { EscalationResult } from '@/domain/escalation'
import { ReceiptSummary } from './ReceiptSummary'
import { EscalationCard } from './EscalationCard'
import { ExplanationTabs } from './ExplanationTabs'
import { StatutoryCitations, CitationItem } from './StatutoryCitations'
import { DraftReplyModal } from './DraftReplyModal'
import { SampleNoticeButtons, SampleKey, getSampleNoticeText } from './SampleNoticeButtons'
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Document Column */}
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

          {/* Actionable Next-Step Sidebar */}
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
                Review the itemized discrepancies and prepare your formal response before filing on
                the GST portal.
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
            <EscalationCard escalation={analysis.escalation} />
          </div>
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

function useNoticeState() {
  const [noticeText, setNoticeText] = useState('')
  const [selectedSample, setSelectedSample] = useState<SampleKey | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; chars: number } | null>(null)
  const [language, setLanguage] = useState<'en' | 'hi' | 'bn'>('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)

  useEffect(() => {
    const handleLoadSample = (e: Event) => {
      const customEvent = e as CustomEvent<SampleKey>
      const key = customEvent.detail
      const sampleText = getSampleNoticeText(key)
      if (sampleText) {
        setSelectedSample(key)
        setNoticeText(sampleText)
        setUploadedFile(null)
        setAnalysis(null)
        setError(null)
        const el = document.getElementById('notice-input')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          el.focus()
        }
      }
    }
    window.addEventListener('noticesaathi:load-sample', handleLoadSample)
    return () => window.removeEventListener('noticesaathi:load-sample', handleLoadSample)
  }, [])

  const handleAnalyze = async (selectedLang: 'en' | 'hi' | 'bn' = language) => {
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

  return {
    noticeText,
    setNoticeText,
    selectedSample,
    setSelectedSample,
    uploadedFile,
    setUploadedFile,
    language,
    setLanguage,
    loading,
    setLoading,
    error,
    setError,
    analysis,
    setAnalysis,
    isDraftModalOpen,
    setIsDraftModalOpen,
    handleAnalyze,
  }
}

export function NoticeAnalyzer() {
  const {
    noticeText,
    setNoticeText,
    selectedSample,
    setSelectedSample,
    uploadedFile,
    setUploadedFile,
    language,
    setLanguage,
    loading,
    error,
    setError,
    analysis,
    setAnalysis,
    isDraftModalOpen,
    setIsDraftModalOpen,
    handleAnalyze,
  } = useNoticeState()

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
