'use client'

import React from 'react'
import { HeroDocumentPreview } from './HeroDocumentPreview'
import { InteractiveDots } from './InteractiveDots'

export function HomeHero() {
  function handleAnalyzeClick() {
    const el =
      document.getElementById('analyzer-workspace') || document.getElementById('notice-input')
    if (el) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      const input = document.getElementById('notice-input')
      if (input) input.focus()
    }
  }

  function handleTrySampleClick() {
    window.dispatchEvent(new CustomEvent('noticesaathi:load-sample', { detail: 'asmt10' }))
    const el = document.getElementById('analyzer-workspace')
    if (el) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }

  return (
    <section className="relative w-full max-w-6xl mx-auto py-8 md:py-14">
      <InteractiveDots />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Editorial Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="space-y-3">
            <h1
              className="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
              data-testid="heading"
            >
              Understand your GST notice.
            </h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              See the amounts listed in your notice, understand what it’s asking for, and prepare a
              draft response.
            </p>
          </div>

          {/* Action Hierarchy */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleAnalyzeClick}
              className="group inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary-action)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm px-6 py-3 shadow-md shadow-indigo-200/50 dark:shadow-indigo-950/60 transition-all active:scale-98"
            >
              <span>Analyze a notice</span>
              <span className="inline-block transition-transform duration-150 group-hover:translate-x-[3px]">
                →
              </span>
            </button>
            <button
              type="button"
              onClick={handleTrySampleClick}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] font-semibold text-sm px-5 py-3 shadow-xs hover:border-[var(--border-strong)] transition-all active:scale-98"
            >
              Try a sample
            </button>
          </div>

          {/* Language Availability */}
          <div className="flex items-center gap-2 pt-2 text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">Available in:</span>
            <span>English</span>
            <span>•</span>
            <span>हिन्दी (Hindi)</span>
            <span>•</span>
            <span>বাংলা (Bengali)</span>
          </div>
        </div>

        {/* Right Transformation Preview Column */}
        <div className="lg:col-span-6">
          <HeroDocumentPreview onTrySample={handleTrySampleClick} />
        </div>
      </div>
    </section>
  )
}
