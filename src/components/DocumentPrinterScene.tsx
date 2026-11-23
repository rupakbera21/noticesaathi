'use client'

import React, { useMemo } from 'react'
import { AnalysisResponse } from './NoticeModalsAndResults'
import { usePrinterAnimation, AnimationPhase } from './usePrinterAnimation'

interface DocumentPrinterSceneProps {
  loading: boolean
  analysis: AnalysisResponse | null
  submittedText: string
  uploadedFile: { name: string; chars: number } | null
  onScrollToResult?: () => void
}

function PrinterSlot({
  phase,
  loading,
}: {
  phase: AnimationPhase
  loading: boolean
}) {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center my-1">
      {/* Violet-glass lip */}
      <div
        className="w-full max-w-xl h-1.5 rounded-full bg-gradient-to-r from-violet-500/20 via-violet-400/60 to-violet-500/20 dark:via-violet-400/80 blur-[0.5px] border-t border-violet-300/40"
        aria-hidden="true"
      />

      {/* Recessed slot opening */}
      <div className="relative w-full max-w-xl h-3 rounded-full bg-slate-900/90 dark:bg-black/95 border border-violet-900/40 shadow-inner flex items-center justify-center overflow-hidden">
        <div className="absolute inset-x-4 top-0.5 h-1 bg-black/80 rounded-full" />
      </div>

      {/* Printer status indicator pill */}
      {(loading || phase === 'processing' || phase === 'feeding-in') && (
        <div
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-violet-300/60 bg-violet-50/90 px-3 py-0.5 text-[10px] font-semibold text-violet-800 shadow-xs dark:border-violet-700/60 dark:bg-violet-950/80 dark:text-violet-200 transition-all animate-pulse"
          role="status"
          aria-live="polite"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-ping" />
          <span>Analyzing notice…</span>
        </div>
      )}

      {phase === 'settled' && (
        <div
          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 select-none"
          aria-hidden="true"
        >
          <span>↕ Scroll to inspect feed</span>
        </div>
      )}
    </div>
  )
}

function IncomingNoticeSheet({
  submittedText,
  uploadedFile,
  feedProgress,
}: {
  submittedText: string
  uploadedFile: { name: string; chars: number } | null
  feedProgress: number
}) {
  const previewLines = useMemo(() => {
    if (uploadedFile) return []
    return submittedText.split('\n').filter(Boolean).slice(0, 4)
  }, [submittedText, uploadedFile])

  const translateYPercent = Math.min(100, Math.max(0, feedProgress * 100))
  const opacity = Math.max(0.1, 1 - feedProgress * 0.85)

  return (
    <div
      className="relative w-full max-w-lg mx-auto h-24 overflow-hidden flex items-end justify-center"
      aria-hidden="true"
    >
      <div
        className="w-full rounded-t-xl border border-b-0 border-[var(--border-subtle)] bg-[var(--surface-raised)] p-3 shadow-xs font-mono text-[10px] text-[var(--text-secondary)] transition-transform duration-75 ease-linear will-change-transform"
        style={{
          transform: `translateY(${translateYPercent}%)`,
          opacity,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <div className="flex items-center justify-between border-b border-dashed border-[var(--border-subtle)] pb-1 mb-1.5">
          <span className="font-bold uppercase tracking-wider text-[var(--text-primary)] text-[9px]">
            {uploadedFile ? 'Uploaded Document' : 'Original Notice Input'}
          </span>
          <span className="text-[9px] text-[var(--text-subtle)]">
            {uploadedFile
              ? `${uploadedFile.chars.toLocaleString('en-IN')} chars`
              : `${submittedText.length.toLocaleString('en-IN')} chars`}
          </span>
        </div>

        {uploadedFile ? (
          <div className="flex items-center gap-2 py-1 text-xs text-[var(--text-primary)]">
            <span className="text-base">📄</span>
            <span className="font-semibold truncate">{uploadedFile.name}</span>
          </div>
        ) : (
          <div className="space-y-0.5 truncate leading-tight opacity-80">
            {previewLines.map((line, idx) => (
              <div key={idx} className="truncate">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OutgoingReceiptSheet({
  analysis,
  printProgress,
}: {
  analysis: AnalysisResponse
  printProgress: number
}) {
  const translateYPercent = -100 + Math.min(100, Math.max(0, printProgress * 100))
  const opacity = Math.min(1, Math.max(0, printProgress * 1.5))

  return (
    <div
      className="relative w-full max-w-lg mx-auto overflow-hidden flex items-start justify-center pt-0.5"
      style={{ minHeight: '120px' }}
      aria-hidden="true"
    >
      <div
        className="w-full rounded-b-xl border border-t-0 border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-md font-mono text-[11px] transition-transform duration-75 ease-linear will-change-transform"
        style={{
          transform: `translateY(${translateYPercent}%)`,
          opacity,
          borderColor: 'var(--border-subtle)',
          boxShadow: 'var(--receipt-shadow)',
        }}
      >
        <div className="flex items-center justify-between border-b border-dashed border-[var(--border-subtle)] pb-1.5 mb-2">
          <span className="font-bold text-[var(--text-primary)] text-xs">
            {analysis.notice.noticeTypeDescription || 'GST Notice Receipt'}
          </span>
          <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            Assessed
          </span>
        </div>

        <div className="space-y-1 text-[10px] text-[var(--text-secondary)]">
          <div className="flex justify-between">
            <span>Tax Demand</span>
            <span className="font-semibold text-[var(--text-primary)]">
              ₹{analysis.notice.taxDemand.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Interest (Sec 50)</span>
            <span className="font-semibold text-[var(--text-primary)]">
              ₹{analysis.notice.interestDemand.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="receipt-perforation my-1.5 opacity-60" />
          <div className="flex justify-between font-bold text-xs text-[var(--text-primary)] pt-0.5">
            <span>TOTAL DUE</span>
            <span className="text-[var(--color-primary)] font-black">
              ₹{analysis.notice.totalStatedDemand.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DocumentPrinterScene({
  loading,
  analysis,
  submittedText,
  uploadedFile,
  onScrollToResult,
}: DocumentPrinterSceneProps) {
  const { phase, feedProgress, printProgress, showViewResultPill, containerRef } =
    usePrinterAnimation({ loading, analysis, onScrollToResult })

  if (!loading && !analysis && submittedText.trim().length === 0 && !uploadedFile) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto py-2 my-2 transition-all"
      data-testid="printer-scene"
    >
      <IncomingNoticeSheet
        submittedText={submittedText}
        uploadedFile={uploadedFile}
        feedProgress={feedProgress}
      />

      <PrinterSlot phase={phase} loading={loading} />

      {analysis && (
        <OutgoingReceiptSheet analysis={analysis} printProgress={printProgress} />
      )}

      {showViewResultPill && onScrollToResult && (
        <button
          type="button"
          onClick={onScrollToResult}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 rounded-full bg-[var(--primary-action)] px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-[var(--primary-hover)] transition-all cursor-pointer"
        >
          <span>View result ↓</span>
        </button>
      )}
    </div>
  )
}
