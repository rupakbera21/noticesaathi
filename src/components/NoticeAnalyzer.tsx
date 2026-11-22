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

const SAMPLES = {
  asmt10: `FORM GST ASMT-10
[See rule 99(1)]
Notice for intimating discrepancies in the return after scrutiny
Reference No: ASMT10/DL/2024/0912
Date: 10/08/2024
GSTIN: 07TESTU9999R1Z9
Legal Name: M/s Apex Synthetic Supplies
Tax Period: FY 2023-24

This is to intimate that scrutiny of your return for the tax period under Section 61 of the CGST Act, 2017 read with Rule 99 has revealed discrepancy:
Input Tax Credit availed in Table 4(A)(5) of GSTR-3B exceeds ITC available in GSTR-2B by Rs 42,000.

Tax: Rs 42,000
Interest under Sec 50: Rs 3,500
Penalty: Rs 0
Total Stated Demand: Rs 45,500

You are requested to furnish an explanation within 30 days of receipt of this notice in FORM GST ASMT-11.`,

  drc01Fraud: `FORM GST DRC-01
[See rule 142(1)]
Summary of Show Cause Notice
Reference No: DRC01/MH/2024/7712
Date: 04/09/2024
GSTIN: 27FAKEX0000R1Z2
Legal Name: M/s Fictional Metal Works
Tax Period: July 2022 to March 2023

Show Cause Notice under Section 74 of the CGST Act, 2017.
It appears that outward tax liability has been evaded by reason of fraud and wilful misstatement of turnover with deliberate suppression of facts.

Tax: Rs 6,80,000
Interest under Sec 50: Rs 1,12,000
Penalty under Sec 74: Rs 6,80,000
Total Stated Demand: Rs 14,72,000

You are directed to show cause within 30 days why the demand should not be confirmed.`,

  gstr3a: `FORM GSTR-3A
[See rule 68]
Notice to return defaulter under Section 46 for not filing return
Reference No: GSTR3A/KA/2024/3391
Date: 25/08/2024
GSTIN: 29MOCKY1111R1Z8
Legal Name: M/s Synthetic Retailers

Being a registered taxable person, you have not furnished return in GSTR-3B for the month of July 2024.
You are hereby given notice under Section 46 of the CGST Act, 2017 to furnish the said return within 15 days, failing which the tax liability will be assessed under Section 62.`,
}

export interface AnalysisResponse {
  notice: ExtractedNotice
  totals: TotalsConsistencyResult
  escalation: EscalationResult
  citations: CitationItem[]
  explanation: string
  deadline: {
    formattedDate: string
    remainingDays: number
    isExpired: boolean
  }
}

function SampleNoticeButtons({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-400">Try sample notice:</span>
      <button
        onClick={() => onSelect(SAMPLES.asmt10)}
        className="rounded-md border border-purple-800 bg-purple-950/40 px-3 py-1 text-xs text-purple-300 hover:bg-purple-900/60 transition-colors"
        data-testid="sample-asmt10-btn"
      >
        ASMT-10 (Scrutiny)
      </button>
      <button
        onClick={() => onSelect(SAMPLES.drc01Fraud)}
        className="rounded-md border border-red-800 bg-red-950/40 px-3 py-1 text-xs text-red-300 hover:bg-red-900/60 transition-colors"
        data-testid="sample-drc01-btn"
      >
        DRC-01 (§74 Fraud)
      </button>
      <button
        onClick={() => onSelect(SAMPLES.gstr3a)}
        className="rounded-md border border-amber-800 bg-amber-950/40 px-3 py-1 text-xs text-amber-300 hover:bg-amber-900/60 transition-colors"
        data-testid="sample-gstr3a-btn"
      >
        GSTR-3A (Non-Filer)
      </button>
    </div>
  )
}

function NoticeInputCard({
  noticeText,
  setNoticeText,
  language,
  onLanguageChange,
  onAnalyze,
  loading,
  error,
}: {
  noticeText: string
  setNoticeText: (v: string) => void
  language: 'en' | 'hi' | 'bn'
  onLanguageChange: (v: 'en' | 'hi' | 'bn') => void
  onAnalyze: () => void
  loading: boolean
  error: string | null
}) {
  return (
    <div className="rounded-2xl border p-5 shadow-xl backdrop-blur-md" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between pb-3">
        <label htmlFor="notice-input" className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Paste Official GST Notice Text / SCN
        </label>
        <span className="text-xs text-gray-500">{noticeText.length.toLocaleString('en-IN')} / 25,000 chars</span>
      </div>

      <textarea
        id="notice-input"
        rows={7}
        className="w-full rounded-xl border bg-black/50 p-4 font-mono text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        style={{ borderColor: 'var(--color-border)' }}
        placeholder="Paste or type notice text here (e.g. FORM GST ASMT-10, DRC-01, GSTR-3A)..."
        value={noticeText}
        onChange={e => setNoticeText(e.target.value)}
        data-testid="notice-input-textarea"
      />

      {error && <div className="mt-3 rounded-lg border border-red-800 bg-red-950/50 p-3 text-xs text-red-300" data-testid="error-banner">{error}</div>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400">Language:</span>
          <select
            value={language}
            onChange={e => onLanguageChange(e.target.value as 'en' | 'hi' | 'bn')}
            className="rounded-lg border bg-black/60 px-3 py-1.5 text-xs text-gray-200 focus:outline-none"
            style={{ borderColor: 'var(--color-border)' }}
            data-testid="language-select"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>

        <button
          onClick={onAnalyze}
          disabled={loading || noticeText.trim().length === 0}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 hover:bg-purple-500 disabled:opacity-40"
          data-testid="analyze-notice-btn"
        >
          {loading ? 'Analyzing Demand...' : 'Analyze GST Notice →'}
        </button>
      </div>
    </div>
  )
}

function AnalysisResultsView({
  analysis,
  language,
  loading,
  onLanguageChange,
  onOpenDraftModal,
}: {
  analysis: AnalysisResponse
  language: 'en' | 'hi' | 'bn'
  loading: boolean
  onLanguageChange: (lang: 'en' | 'hi' | 'bn') => void
  onOpenDraftModal: () => void
}) {
  return (
    <div className="space-y-6 animate-fade-in" data-testid="analysis-results">
      <ReceiptSummary notice={analysis.notice} totals={analysis.totals} deadline={analysis.deadline} />
      <EscalationCard escalation={analysis.escalation} />
      <div className="flex justify-end">
        <button
          onClick={onOpenDraftModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 hover:brightness-110"
          data-testid="open-draft-modal-btn"
        >
          ✍️ Draft Formal Portal Reply under Section 75(4) →
        </button>
      </div>
      <ExplanationTabs initialExplanation={analysis.explanation} onLanguageChange={onLanguageChange} currentLanguage={language} loading={loading} />
      <StatutoryCitations citations={analysis.citations} />
    </div>
  )
}

export function NoticeAnalyzer() {
  const [noticeText, setNoticeText] = useState('')
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
      <SampleNoticeButtons onSelect={t => { setNoticeText(t); setAnalysis(null); }} />

      <NoticeInputCard
        noticeText={noticeText}
        setNoticeText={setNoticeText}
        language={language}
        onLanguageChange={l => { setLanguage(l); if (analysis) handleAnalyze(l); }}
        onAnalyze={() => handleAnalyze()}
        loading={loading}
        error={error}
      />

      {analysis && (
        <AnalysisResultsView
          analysis={analysis}
          language={language}
          loading={loading}
          onLanguageChange={l => { setLanguage(l); handleAnalyze(l); }}
          onOpenDraftModal={() => setIsDraftModalOpen(true)}
        />
      )}

      {analysis && (
        <DraftReplyModal notice={analysis.notice} isOpen={isDraftModalOpen} onClose={() => setIsDraftModalOpen(false)} />
      )}
    </div>
  )
}
