'use client'

import React, { useState, useRef } from 'react'

export function NoticeUploadZone({
  onTextExtracted,
  onError,
}: {
  onTextExtracted: (text: string, filename: string, charCount: number) => void
  onError: (err: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to parse file')
      onTextExtracted(data.text, file.name, data.charCount)
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
        data-testid="pdf-file-input"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-indigo-500/40 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-all active:scale-95 disabled:opacity-50"
        data-testid="upload-pdf-btn"
      >
        <span>{uploading ? '⏳ Reading...' : '📄 Upload PDF / TXT'}</span>
      </button>
    </div>
  )
}
