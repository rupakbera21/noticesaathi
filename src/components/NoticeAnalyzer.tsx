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
import { NoticeUploadZone } from './NoticeUploadZone'
import { SampleNoticeButtons, SampleKey } from './SampleNoticeButtons'

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

function UploadSuccessBanner({
  uploadedFile,
  onClearUpload,
}: {
  uploadedFile: { name: string; chars: number }
  onClearUpload: () => void
}) {
  return (
    <div
      className="mb-3 flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-800 dark:text-emerald-300"
      data-testid="upload-success-pill"
    >
      <span className="flex items-center gap-1.5 font-medium">
        <span>✓</span>
        <span>
          Extracted from <strong>{uploadedFile.name}</strong> (
          {uploadedFile.chars.toLocaleString('en-IN')} chars)
        </span>
      </span>
      <button
        type="button"
        onClick={onClearUpload}
        className="text-emerald-700 dark:text-emerald-400 hover:underline text-[10px]"
      >
        Clear
      </button>
    </div>
  )
}

function NoticeActionBar({
  language,
  onLanguageChange,
  onAnalyze,
  loading,
  disabled,
}: {
  language: 'en' | 'hi' | 'bn'
  onLanguageChange: (v: 'en' | 'hi' | 'bn') => void
  onAnalyze: () => void
  loading: boolean
  disabled: boolean
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-gray-400">Language:</span>
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value as 'en' | 'hi' | 'bn')}
          className="rounded-lg border bg-white border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-xs dark:bg-black/60 dark:text-gray-200 dark:border-[#252542] focus:outline-none"
          data-testid="language-select"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="bn">বাংলা (Bengali)</option>
        </select>
      </div>

      <button
        onClick={onAnalyze}
        disabled={disabled}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md shadow-indigo-200/50 dark:from-[#3521C1] dark:via-[#4338CA] dark:to-[#585EF8] dark:shadow-indigo-950/50 px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-40"
        data-testid="analyze-notice-btn"
      >
        {loading ? 'Analyzing Demand...' : 'Analyze GST Notice →'}
      </button>
    </div>
  )
}

function NoticeInputCard({
  noticeText,
  setNoticeText,
  uploadedFile,
  onClearUpload,
  onTextExtracted,
  language,
  onLanguageChange,
  onAnalyze,
  loading,
  error,
  onError,
}: {
  noticeText: string
  setNoticeText: (v: string) => void
  uploadedFile: { name: string; chars: number } | null
  onClearUpload: () => void
  onTextExtracted: (text: string, filename: string, charCount: number) => void
  language: 'en' | 'hi' | 'bn'
  onLanguageChange: (v: 'en' | 'hi' | 'bn') => void
  onAnalyze: () => void
  loading: boolean
  error: string | null
  onError: (err: string) => void
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 backdrop-blur-md dark:bg-[#121224] dark:border-[#252542]">
      {/* Visual highlight accent border across the top of the intake card */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-90" />

      <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <label
          htmlFor="notice-input"
          className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-300"
        >
          Paste Notice Text or Upload File
        </label>
        <div className="flex items-center gap-3">
          <NoticeUploadZone onTextExtracted={onTextExtracted} onError={onError} />
          <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
            {noticeText.length.toLocaleString('en-IN')} / 25,000 chars
          </span>
        </div>
      </div>

      {uploadedFile && (
        <UploadSuccessBanner uploadedFile={uploadedFile} onClearUpload={onClearUpload} />
      )}

      <textarea
        id="notice-input"
        rows={7}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 font-mono text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:bg-black/50 dark:border-[#252542] dark:text-gray-200 dark:placeholder-gray-500"
        placeholder="Paste notice text (e.g. FORM GST ASMT-10, DRC-01, GSTR-3A) or upload a PDF above..."
        value={noticeText}
        onChange={e => setNoticeText(e.target.value)}
        data-testid="notice-input-textarea"
      />

      {error && (
        <div
          className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
          data-testid="error-banner"
        >
          {error}
        </div>
      )}

      <NoticeActionBar
        language={language}
        onLanguageChange={onLanguageChange}
        onAnalyze={onAnalyze}
        loading={loading}
        disabled={loading || noticeText.trim().length === 0}
      />

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-white/5 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <svg
            className="h-3.5 w-3.5 text-slate-400 dark:text-gray-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Notice text is sent to our server for analysis and may be processed by Google Gemini or
          Groq.
        </span>
        <a
          href="/trust"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Privacy Policy &amp; Architecture →
        </a>
      </div>
    </div>
  )
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

export function NoticeAnalyzer() {
  const [noticeText, setNoticeText] = useState('')
  const [selectedSample, setSelectedSample] = useState<SampleKey | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; chars: number } | null>(null)
  const [language, setLanguage] = useState<'en' | 'hi' | 'bn'>('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)

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
