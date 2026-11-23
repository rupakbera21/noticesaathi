'use client'

import React, { useState, useEffect } from 'react'
import { ExtractedNotice, DraftReply } from '@/schemas/notice'

interface DraftReplyModalProps {
  notice: ExtractedNotice
  isOpen: boolean
  onClose: () => void
}

function DraftReplyEditor({
  userNotes,
  setUserNotes,
  onGenerate,
  loading,
}: {
  userNotes: string
  setUserNotes: (v: string) => void
  onGenerate: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-gray-300">
          Taxpayer Notes &amp; Payment/Invoice Details (Optional)
        </label>
        <textarea
          className="mt-2 w-full rounded-lg border bg-slate-50 border-slate-300 p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/40 dark:text-white dark:border-[#252542]"
          rows={4}
          placeholder="e.g. All tax invoices were paid via Bank RTGS on 15/04/2023. GSTR-2B reconciliation is annexed showing bona fide outward tax compliance."
          value={userNotes}
          onChange={e => setUserNotes(e.target.value)}
          data-testid="user-notes-input"
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full rounded-xl bg-[#3733C8] hover:bg-[#2B28A8] text-white shadow-md shadow-indigo-100 dark:bg-gradient-to-r dark:from-[#3521C1] dark:via-[#4338CA] dark:to-[#585EF8] dark:shadow-indigo-950/50 py-3 text-xs font-bold uppercase tracking-wider transition-transform active:scale-98 disabled:opacity-50"
        data-testid="generate-draft-btn"
      >
        {loading ? 'Drafting Grounded Legal Reply...' : 'Generate Legal Draft Reply'}
      </button>
    </div>
  )
}

function DraftReplyViewer({
  draft,
  onCopy,
  copied,
}: {
  draft: DraftReply
  onCopy: () => void
  copied: boolean
}) {
  function handleDownload() {
    const blob = new Blob([draft.fullReplyText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `GST_Reply_Draft_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/30 p-3.5 text-xs text-amber-900 dark:text-amber-200">
        <span className="font-bold">Review guidance:</span> Check all dates, invoice numbers, and
        facts carefully. Attach supporting reconciliation statements, and seek formal review by a
        Chartered Accountant where flagged before submitting to the GST portal.
      </div>
      {draft.caEscalationWarning && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-900 dark:border-red-500/80 dark:bg-red-950/40 dark:text-red-200">
          ⚠️ {draft.caEscalationWarning}
        </div>
      )}
      <div
        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 font-mono text-xs leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap max-h-[50vh] overflow-y-auto"
        data-testid="draft-reply-text"
      >
        {draft.fullReplyText}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
        >
          Download .txt
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
          data-testid="copy-reply-btn"
        >
          {copied ? '✓ Copied to Clipboard!' : 'Copy Reply to Clipboard'}
        </button>
      </div>
    </div>
  )
}

function DraftModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="flex items-center justify-between border-b pb-4"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Formal GST Portal Reply Drafter
        </h3>
        <p className="text-xs text-slate-600 dark:text-gray-400">
          Grounded legal submission under Section 75(4) of the CGST Act, 2017.
        </p>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
        data-testid="close-modal-btn"
      >
        ✕
      </button>
    </div>
  )
}

export function DraftReplyModal({ notice, isOpen, onClose }: DraftReplyModalProps) {
  const [userNotes, setUserNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState<DraftReply | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleGenerateDraft() {
    setLoading(true)
    try {
      const res = await fetch('/api/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice, userNotes }),
      })
      const data = await res.json()
      if (data.success) {
        setDraft(data.draft)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!draft) return
    navigator.clipboard.writeText(draft.fullReplyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Formal GST Reply Generator"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75"
      data-testid="draft-reply-modal"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border p-6 shadow-2xl bg-white border-slate-200 dark:bg-[#0F0F1E] dark:border-[#252542]">
        <DraftModalHeader onClose={onClose} />
        <div className="flex-1 overflow-y-auto py-4">
          {!draft ? (
            <DraftReplyEditor
              userNotes={userNotes}
              setUserNotes={setUserNotes}
              onGenerate={handleGenerateDraft}
              loading={loading}
            />
          ) : (
            <DraftReplyViewer draft={draft} onCopy={handleCopy} copied={copied} />
          )}
        </div>
        <div
          className="flex justify-end gap-3 border-t pt-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
