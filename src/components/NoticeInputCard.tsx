'use client'

import React from 'react'
import { NoticeUploadZone } from './NoticeUploadZone'

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
        <label
          htmlFor="language-select"
          className="text-xs font-semibold text-[var(--text-secondary)]"
        >
          Response language:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={e => onLanguageChange(e.target.value as 'en' | 'hi' | 'bn')}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-xs focus:outline-none focus:border-[var(--primary-action)]"
          data-testid="language-select"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="bn">বাংলা (Bengali)</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={disabled}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[var(--primary-action)] hover:bg-[var(--primary-hover)] text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-950/50 px-6 py-2.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid="analyze-notice-btn"
      >
        {loading ? 'Analyzing notice…' : 'Analyze GST notice →'}
      </button>
    </div>
  )
}

function PrivacyNoticeFooter() {
  return (
    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 text-[11px] text-[var(--text-secondary)]">
      <span className="flex items-center gap-1.5">
        <svg
          className="h-3.5 w-3.5 text-[var(--text-subtle)] shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
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
      <a href="/trust" className="text-[var(--color-primary)] hover:underline font-medium">
        Privacy Policy &amp; Architecture →
      </a>
    </div>
  )
}

export function NoticeInputCard({
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
    <div
      className="relative overflow-hidden rounded-2xl border bg-[var(--surface)] p-5 transition-all"
      style={{
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--receipt-shadow)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <label
          htmlFor="notice-input"
          className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]"
        >
          Paste Notice Text or Upload File
        </label>
        <div className="flex items-center gap-3">
          <NoticeUploadZone onTextExtracted={onTextExtracted} onError={onError} />
          <span className="text-xs font-medium tabular-nums text-[var(--text-secondary)]">
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
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:bg-[var(--surface)] focus:border-[var(--primary-action)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)]"
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

      <PrivacyNoticeFooter />
    </div>
  )
}
