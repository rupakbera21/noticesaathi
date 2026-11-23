import React from 'react'
import Link from 'next/link'

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Add a notice',
      desc: 'Upload your GST portal notice in PDF format or paste the raw notice text directly.',
    },
    {
      num: '02',
      title: 'Review the summary',
      desc: 'See stated line items checked via arithmetic code against statutory provisions and deadlines.',
    },
    {
      num: '03',
      title: 'Prepare your response',
      desc: 'Generate a structured Section 75(4) formal draft reply with personal hearing prayer.',
    },
  ]

  return (
    <section id="how-it-works" className="w-full max-w-4xl space-y-6 pt-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
          Workflow
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
          How NoticeSaathi Works
        </h2>
        <p className="text-xs text-[var(--text-secondary)] max-w-xl">
          Three clear steps from receiving an official notice to preparing a grounded legal
          response.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map(step => (
          <div
            key={step.num}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-xs transition-all"
          >
            <div className="text-xs font-bold text-[var(--color-primary)] pb-2 font-mono">
              Step {step.num}
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] pb-1.5">{step.title}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: (
      <svg
        className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Rule-Based Math Check',
    desc: 'Stated line items are checked via code arithmetic to verify tax, interest, and penalty figures match the department&apos;s total stated due.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: 'Official Statutory Citations',
    desc: 'Legal provisions cited in the notice (Section 61, 73, 74, 50, Rule 99) are matched against curated Central GST Act and Rules records.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-purple-600 dark:text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    ),
    title: 'Plain Regional Explanations',
    desc: 'Understand technical allegations in your language of comfort—switch between English, Hindi (हिन्दी), and Bengali (বাংলা).',
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-amber-600 dark:text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
    title: 'Section 75(4) Draft Reply',
    desc: 'Generates a structured reply framework, explicitly requesting a personal hearing before any adverse tax decision is finalized.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-rose-600 dark:text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    title: 'Chartered Accountant (CA) Triage',
    desc: 'Identifies high-stakes notices—Section 74 fraud allegations, cancellation, or amounts exceeding ₹5,00,000—and advises professional CA consultation.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-sky-600 dark:text-sky-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Response Deadline Tracking',
    desc: 'Tracks reply windows in Indian Standard Time (IST). When dates or reply windows cannot be established, prompts you to verify directly on the notice.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-4xl space-y-6 pt-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Capabilities
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          Built for Indian Small Traders
        </h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          Combining code-based financial verification with statutory guidance to demystify complex
          tax communications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border p-5 backdrop-blur-md transition-all bg-white border-slate-200 shadow-sm hover:border-indigo-400 dark:bg-[#121224] dark:border-[#252542] dark:hover:border-indigo-500/40"
          >
            <div className="pb-2.5">{f.icon}</div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-1">{f.title}</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function MeasurementSection() {
  return (
    <section className="w-full max-w-4xl space-y-4 pt-10">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
              Verification &amp; Evidence
            </span>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              How We Measured Accuracy
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Every build of NoticeSaathi is tested against a gold-standard dataset of synthetic
              Indian GST notices (ASMT-10, DRC-01, GSTR-3A, and DRC-01A). In automated tests, our
              extraction and triage pipeline achieves 100% classification accuracy, 100% arithmetic
              demand consistency, and 100% recall on high-risk CA escalations.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-mono text-[var(--text-secondary)]">
              <div>
                <span className="font-bold text-[var(--text-primary)]">4</span> Synthetic Notices
              </div>
              <div>•</div>
              <div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">100%</span>{' '}
                Demand Accuracy
              </div>
              <div>•</div>
              <div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">100%</span> CA
                Escalation Recall
              </div>
            </div>
          </div>
          <Link
            href="/trust"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary-action)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs px-4 py-2.5 transition-colors self-start md:self-auto shrink-0 shadow-xs"
          >
            Read Trust &amp; Metrics →
          </Link>
        </div>
      </div>
    </section>
  )
}

export { SupportedNoticesSection } from './SupportedNoticesSection'
export { FaqSection } from './FaqSection'
