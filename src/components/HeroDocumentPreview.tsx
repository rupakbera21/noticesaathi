'use client'

import React, { useState } from 'react'

function NoticeLayer({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`absolute inset-0 rounded-2xl border bg-[var(--surface-raised)] p-5 font-mono text-[11px] leading-relaxed transition-all duration-300 ${
        isVisible
          ? 'z-20 opacity-100 shadow-lg scale-100'
          : 'z-0 opacity-40 translate-x-3 translate-y-3 pointer-events-none scale-[0.98]'
      }`}
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div className="border-b border-dashed border-[var(--border-subtle)] pb-2 mb-3">
        <div className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
          FORM GST ASMT-10
        </div>
        <div className="text-[10px] text-[var(--text-secondary)]">[See rule 99(1)]</div>
      </div>
      <div className="space-y-1.5 text-[var(--text-secondary)]">
        <div>
          <span className="text-[var(--text-primary)] font-semibold">Ref:</span> ASMT10/DL/2024/0912
        </div>
        <div>
          <span className="text-[var(--text-primary)] font-semibold">Date:</span> 10/08/2024 |{' '}
          <span className="text-[var(--text-primary)] font-semibold">FY:</span> 2023-24
        </div>
        <div>
          <span className="text-[var(--text-primary)] font-semibold">GSTIN:</span> 07TESTU9999R1Z9
        </div>
        <div className="pt-2 text-[var(--text-primary)]">
          Discrepancy in GSTR-3B vs GSTR-2B ITC under Section 61.
        </div>
        <div className="pt-2 space-y-0.5">
          <div>• Tax Demand: ₹42,000</div>
          <div>• Interest under Sec 50: ₹3,500</div>
          <div>• Total Stated Demand: ₹45,500</div>
        </div>
        <div className="pt-2 text-[10px] italic">
          Furnish explanation within 30 days of receipt in FORM GST ASMT-11.
        </div>
      </div>
    </div>
  )
}

function ReceiptRows() {
  return (
    <div className="space-y-2 text-xs hero-items-animated">
      <div className="flex justify-between py-1 text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
        <span>Tax Assessment (ITC Discrepancy)</span>
        <span className="font-mono font-semibold tabular-nums text-[var(--text-primary)]">
          ₹42,000
        </span>
      </div>
      <div className="flex justify-between py-1 text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
        <span>Interest (Section 50 CGST)</span>
        <span className="font-mono font-semibold tabular-nums text-[var(--text-primary)]">
          ₹3,500
        </span>
      </div>
      <div className="flex justify-between py-1 text-[var(--text-secondary)]">
        <span>Penalty Stated</span>
        <span className="font-mono font-semibold tabular-nums text-[var(--text-primary)]">₹0</span>
      </div>
    </div>
  )
}

function ReceiptLayer({
  isVisible,
  onTrySample,
}: {
  isVisible: boolean
  onTrySample?: () => void
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-[var(--surface)] p-6 transition-all duration-300 hero-receipt-animated overflow-hidden ${
        isVisible ? 'z-20 opacity-100 shadow-xl' : 'z-0 opacity-0 pointer-events-none scale-95'
      }`}
      style={{
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--receipt-hero-shadow)',
      }}
    >
      {isVisible && <div className="receipt-top-highlight" aria-hidden="true" />}
      <div className="flex items-center justify-between border-b border-dashed border-[var(--border-subtle)] pb-3 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Assessed Demand Breakdown
          </span>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Scrutiny of Return (ASMT-10)
          </h3>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300">
          Rule 99 Match
        </span>
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 mb-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Total Stated Due
          </span>
          <span className="text-2xl font-black tabular-nums text-[var(--color-primary)]">
            ₹45,500
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
          <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>100% Deterministic Line-Item Arithmetic Match</span>
        </div>
      </div>

      <div className="receipt-perforation my-3 opacity-60" aria-hidden="true" />

      <ReceiptRows />

      <div className="mt-5 pt-3 border-t border-dashed border-[var(--border-subtle)] flex items-center justify-between">
        <span className="text-[11px] text-[var(--text-secondary)]">
          Deadline: Check date of receipt
        </span>
        {onTrySample && (
          <button
            type="button"
            onClick={onTrySample}
            className="text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
          >
            Load this sample in analyzer →
          </button>
        )}
      </div>
    </div>
  )
}

export function HeroDocumentPreview({ onTrySample }: { onTrySample?: () => void }) {
  const [viewState, setViewState] = useState<'summary' | 'notice'>('summary')

  return (
    <div
      className="relative w-full max-w-lg mx-auto lg:max-w-none"
      data-testid="hero-document-preview"
    >
      <div className="flex items-center justify-between pb-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span>Synthetic example</span>
        </div>
        <div
          role="tablist"
          aria-label="Document preview mode"
          className="relative inline-flex rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/80 backdrop-blur-xs p-1 shadow-xs"
        >
          <div
            className="absolute inset-y-1 rounded-lg bg-[var(--surface)] shadow-xs transition-transform duration-250 ease-out"
            style={{
              width: 'calc(50% - 4px)',
              transform: viewState === 'summary' ? 'translateX(0)' : 'translateX(calc(100% + 0px))',
            }}
            aria-hidden="true"
          />
          <button
            type="button"
            role="tab"
            aria-selected={viewState === 'summary'}
            onClick={() => setViewState('summary')}
            className={`relative z-10 rounded-lg px-3 py-1 text-xs font-semibold transition-colors duration-200 ${
              viewState === 'summary'
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ₹ Summary
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewState === 'notice'}
            onClick={() => setViewState('notice')}
            className={`relative z-10 rounded-lg px-3 py-1 text-xs font-semibold transition-colors duration-200 ${
              viewState === 'notice'
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Raw Notice
          </button>
        </div>
      </div>

      <div className="relative min-h-[340px]">
        {/* Violet radial glow backdrop */}
        <div
          className="pointer-events-none absolute -inset-6 sm:-inset-10 -z-10 rounded-3xl opacity-60 dark:opacity-40 blur-3xl hero-glow-animated"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(167, 139, 250, 0.35) 0%, rgba(99, 102, 241, 0.2) 45%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <NoticeLayer isVisible={viewState === 'notice'} />
        <ReceiptLayer isVisible={viewState === 'summary'} onTrySample={onTrySample} />
      </div>
    </div>
  )
}
