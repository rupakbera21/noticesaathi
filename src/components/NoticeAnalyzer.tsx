'use client'

import React, { useState, useEffect } from 'react'
import { SampleNoticeButtons, SampleKey, getSampleNoticeText } from './SampleNoticeButtons'
import { NoticeInputCard } from './NoticeInputCard'
import { NoticeModalsAndResults, AnalysisResponse } from './NoticeModalsAndResults'

export type { AnalysisResponse }

function getNoticeContextLabel(
  uploadedFile: { name: string; chars: number } | null,
  selectedSample: SampleKey | null,
  noticeTextLength: number
) {
  if (uploadedFile) {
    return `Uploaded File: ${uploadedFile.name} (${uploadedFile.chars.toLocaleString('en-IN')} chars)`
  }
  if (selectedSample) {
    return `Synthetic Sample: ${selectedSample.toUpperCase()} (${noticeTextLength.toLocaleString('en-IN')} chars)`
  }
  return `Notice Input (${noticeTextLength.toLocaleString('en-IN')} chars)`
}

function scrollToNoticeInput() {
  const el = document.getElementById('notice-input')
  if (el) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    el.focus()
  }
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
        scrollToNoticeInput()
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
  const state = useNoticeState()

  return (
    <div className="w-full max-w-4xl space-y-6" data-testid="notice-analyzer">
      <SampleNoticeButtons
        selectedSample={state.selectedSample}
        onSelect={(key, t) => {
          state.setSelectedSample(key)
          state.setNoticeText(t)
          state.setUploadedFile(null)
          state.setAnalysis(null)
        }}
      />
      <NoticeInputCard
        noticeText={state.noticeText}
        setNoticeText={t => {
          state.setNoticeText(t)
          state.setSelectedSample(null)
        }}
        uploadedFile={state.uploadedFile}
        onClearUpload={() => {
          state.setUploadedFile(null)
          state.setNoticeText('')
        }}
        onTextExtracted={(txt, fn, count) => {
          state.setNoticeText(txt)
          state.setUploadedFile({ name: fn, chars: count })
          state.setSelectedSample(null)
          state.setAnalysis(null)
          state.setError(null)
        }}
        language={state.language}
        onLanguageChange={l => {
          state.setLanguage(l)
          if (state.analysis) state.handleAnalyze(l)
        }}
        onAnalyze={() => state.handleAnalyze()}
        loading={state.loading}
        error={state.error}
        onError={msg => state.setError(msg)}
      />
      <NoticeModalsAndResults
        analysis={state.analysis}
        noticeContextLabel={getNoticeContextLabel(
          state.uploadedFile,
          state.selectedSample,
          state.noticeText.length
        )}
        onEditNotice={scrollToNoticeInput}
        language={state.language}
        loading={state.loading}
        isDraftModalOpen={state.isDraftModalOpen}
        onLanguageChange={l => {
          state.setLanguage(l)
          state.handleAnalyze(l)
        }}
        onOpenDraftModal={() => state.setIsDraftModalOpen(true)}
        onCloseDraftModal={() => state.setIsDraftModalOpen(false)}
      />
    </div>
  )
}
