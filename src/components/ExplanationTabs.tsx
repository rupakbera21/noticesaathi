'use client'

import React, { useState } from 'react'

interface ExplanationTabsProps {
  initialExplanation: string
  onLanguageChange: (lang: 'en' | 'hi' | 'bn') => void
  currentLanguage: 'en' | 'hi' | 'bn'
  loading: boolean
}

export function ExplanationTabs({
  initialExplanation,
  onLanguageChange,
  currentLanguage,
  loading,
}: ExplanationTabsProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'bn'>(currentLanguage)

  function handleTabClick(lang: 'en' | 'hi' | 'bn') {
    setActiveTab(lang)
    onLanguageChange(lang)
  }

  return (
    <div
      className="w-full rounded-xl border p-5 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      data-testid="explanation-tabs"
    >
      <div className="flex flex-wrap items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Plain-Language Legal Explanation
        </h3>
        <div className="flex rounded-lg bg-slate-100 dark:bg-black/40 p-1" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'en'}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'en'
                ? 'bg-[#3733C8] text-white shadow dark:bg-indigo-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => handleTabClick('en')}
            data-testid="tab-en"
          >
            English
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'hi'}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'hi'
                ? 'bg-[#3733C8] text-white shadow dark:bg-indigo-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => handleTabClick('hi')}
            data-testid="tab-hi"
          >
            हिन्दी (Hindi)
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'bn'}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'bn'
                ? 'bg-[#3733C8] text-white shadow dark:bg-indigo-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => handleTabClick('bn')}
            data-testid="tab-bn"
          >
            বাংলা (Bengali)
          </button>
        </div>
      </div>

      <div className="mt-4 min-h-[120px] text-sm leading-relaxed text-slate-800 dark:text-gray-200" data-testid="explanation-content">
        {loading ? (
          <div className="flex h-24 items-center justify-center text-xs text-gray-400 animate-pulse">
            Generating explanation in selected language...
          </div>
        ) : (
          <div className="whitespace-pre-line">{initialExplanation}</div>
        )}
      </div>
    </div>
  )
}
