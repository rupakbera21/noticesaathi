'use client'

import React, { useState } from 'react'

interface ExplanationTabsProps {
  initialExplanation: string
  onLanguageChange: (lang: 'en' | 'hi' | 'bn') => void
  currentLanguage: 'en' | 'hi' | 'bn'
  loading: boolean
}

function LanguageTabButtons({
  activeTab,
  onTabClick,
}: {
  activeTab: 'en' | 'hi' | 'bn'
  onTabClick: (lang: 'en' | 'hi' | 'bn') => void
}) {
  const tabs: Array<{ id: 'en' | 'hi' | 'bn'; label: string }> = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी (Hindi)' },
    { id: 'bn', label: 'বাংলা (Bengali)' },
  ]

  return (
    <div className="flex rounded-lg bg-slate-100 dark:bg-black/40 p-1" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white font-medium'
          }`}
          onClick={() => onTabClick(tab.id)}
          data-testid={`tab-${tab.id}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
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
      className="w-full rounded-2xl border p-5 backdrop-blur-md shadow-xs"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      data-testid="explanation-tabs"
    >
      <div
        className="flex flex-wrap items-center justify-between border-b pb-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Plain-Language Legal Explanation
        </h3>
        <LanguageTabButtons activeTab={activeTab} onTabClick={handleTabClick} />
      </div>

      <div
        className="mt-4 min-h-[120px] text-sm leading-relaxed text-slate-800 dark:text-gray-200"
        data-testid="explanation-content"
      >
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
