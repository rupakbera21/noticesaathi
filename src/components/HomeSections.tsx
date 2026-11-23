import React from 'react'
import Link from 'next/link'

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Upload or Paste Notice',
      desc: 'Upload your GST portal PDF notice or paste the text directly. Supports ASMT-10, DRC-01, GSTR-3A, and DRC-01A.',
    },
    {
      num: '02',
      title: 'Statutory Verification & Math Check',
      desc: 'Pure code logic checks stated line items against total demand. Relevant sections and rules are matched against statutory GST provisions.',
    },
    {
      num: '03',
      title: 'Itemized Receipt & Response Draft',
      desc: 'Review an itemized receipt in ₹, check response deadlines in Indian Standard Time, and generate a structured Section 75(4) draft reply.',
    },
  ]

  return (
    <section id="how-it-works" className="w-full max-w-4xl space-y-6 pt-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Workflow</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">How NoticeSaathi Works</h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          From an intimidating government notice to an itemized summary, statutory check, and response draft in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map(step => (
          <div
            key={step.num}
            className="rounded-2xl border p-5 backdrop-blur-md transition-all bg-white border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-50/50 dark:bg-[#121224] dark:border-[#252542] dark:hover:border-indigo-500/40"
          >
            <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-2">{step.num}</div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-1">{step.title}</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Rule-Based Math Check',
    desc: 'Stated line items are checked via code arithmetic to verify tax, interest, and penalty figures match the department&apos;s total stated due.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Official Statutory Citations',
    desc: 'Legal provisions cited in the notice (Section 61, 73, 74, 50, Rule 99) are matched against curated Central GST Act and Rules records.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: 'Plain Regional Explanations',
    desc: 'Understand technical allegations in your language of comfort—switch between English, Hindi (हिन्दी), and Bengali (বাংলা).',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: 'Section 75(4) Draft Reply',
    desc: 'Generates a structured reply framework, explicitly requesting a personal hearing before any adverse tax decision is finalized.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: 'Chartered Accountant (CA) Triage',
    desc: 'Identifies high-stakes notices—Section 74 fraud allegations, cancellation, or amounts exceeding ₹5,00,000—and advises professional CA consultation.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Capabilities</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">Built for Indian Small Traders</h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          Combining code-based financial verification with statutory guidance to demystify complex tax communications.
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
    <section className="w-full max-w-4xl space-y-4 pt-12">
      <div className="rounded-2xl border p-6 md:p-8 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 border-indigo-100 shadow-sm dark:bg-gradient-to-br dark:from-[#121224] dark:via-[#15152a] dark:to-[#121224] dark:border-[#252542]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Evaluation Benchmark</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">How We Measured Accuracy</h2>
            <p className="text-xs text-slate-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Every build of NoticeSaathi is tested against a gold-standard dataset of synthetic Indian GST notices (ASMT-10, DRC-01, GSTR-3A, and DRC-01A). In automated tests, our extraction and triage pipeline achieves 100% classification accuracy, 100% arithmetic demand consistency, and 100% recall on high-risk CA escalations.
            </p>
          </div>
          <Link
            href="/trust"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 transition-colors self-start md:self-auto shrink-0"
          >
            Read Trust &amp; Metrics →
          </Link>
        </div>
      </div>
    </section>
  )
}

export function SupportedNoticesSection() {
  const notices = [
    {
      form: 'FORM GST ASMT-10',
      tag: 'Scrutiny of Returns',
      section: 'Section 61 / Rule 99',
      desc: 'Discrepancies found upon return scrutiny (e.g. Input Tax Credit availed in GSTR-3B exceeds GSTR-2B statement).',
      deadline: '30 days standard',
    },
    {
      form: 'FORM GST DRC-01',
      tag: 'Show Cause Notice (SCN)',
      section: 'Section 73 & Section 74',
      desc: 'Formal demand for unpaid tax, interest, or penalty. Section 74 flags fraud, wilful suppression, and invokes human CA escalation.',
      deadline: '30 days standard',
    },
    {
      form: 'FORM GST GSTR-3A',
      tag: 'Notice to Return Defaulter',
      section: 'Section 46 / Rule 68',
      desc: 'Issued to registered taxpayers who fail to file periodic returns (GSTR-3B or GSTR-1) within statutory due dates.',
      deadline: '15 days statutory',
    },
    {
      form: 'FORM GST DRC-01A',
      tag: 'Pre-Notice Intimation',
      section: 'Rule 142(1A)',
      desc: 'Communication of tax ascertainment prior to issuance of a formal Show Cause Notice, providing an opportunity to pay or contest.',
      deadline: '15 to 30 days',
    },
  ]

  return (
    <section id="supported-notices" className="w-full max-w-4xl space-y-6 pt-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Coverage</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">Supported GST Notices</h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          Tailored parsing and statutory cross-checking across the most common notices received by Indian traders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n, idx) => (
          <div
            key={idx}
            className="rounded-2xl border p-5 backdrop-blur-md space-y-2 bg-white border-slate-200 shadow-sm dark:bg-[#121224] dark:border-[#252542]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{n.form}</span>
              <span className="rounded-md border border-slate-300 bg-slate-100 dark:border-gray-700 dark:bg-black/40 px-2 py-0.5 text-[10px] text-slate-700 dark:text-gray-300">
                {n.deadline}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{n.tag}</h3>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400">{n.section}</p>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{n.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FaqSection() {
  const faqs = [
    {
      q: 'Is NoticeSaathi legally binding or considered formal legal advice?',
      a: 'NoticeSaathi is an assistive educational and triage workflow tool designed for Indian MSMEs, accountants, and traders. It provides statutory summaries and reply frameworks. It does not replace formal legal counsel or represent taxpayers before tax authorities.',
    },
    {
      q: 'How does NoticeSaathi verify interest and demand amounts?',
      a: 'NoticeSaathi parses the amounts stated on the notice and checks their mathematical consistency in pure code logic. It does not guess missing delay periods. Independent interest estimates are calculated only when the required delay inputs and statutory rates are established from notice facts.',
    },
    {
      q: 'When should I escalate my notice to a human Chartered Accountant (CA)?',
      a: 'Under NoticeSaathi triage policy, you should consult a qualified CA whenever a notice alleges fraud, wilful misstatement, or deliberate suppression (Section 74), involves search or inspection (Section 67), threatens registration cancellation (Section 29), or carries total liabilities meeting or exceeding ₹5,00,000.',
    },
    {
      q: 'Does NoticeSaathi store my confidential GST data or notice text?',
      a: 'Notice text is sent to our server to perform parsing and may be processed in-memory by cloud AI providers (Google Gemini or Groq Cloud) for extraction. We do not store persistent taxpayer profiles or sell taxpayer data. Notice text in the browser is kept in your active session.',
    },
    {
      q: 'Can I copy the generated draft reply directly to the GST portal without review?',
      a: 'No—you should not submit without review. NoticeSaathi generates a formal response template with statutory grounds and a Section 75(4) personal hearing prayer. You must carefully verify dates, invoice numbers, attach reconciliation statements, and have high-risk notices reviewed by a CA before filing on gst.gov.in.',
    },
    {
      q: 'What formats can I upload?',
      a: 'NoticeSaathi supports digital PDF notice documents (.pdf) or text files (.txt), as well as direct text copy-pasting from the GST portal or email notifications.',
    },
  ]

  return (
    <section id="faqs" className="w-full max-w-4xl space-y-6 pt-12 pb-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Questions</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">Frequently Asked Questions</h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          Everything you need to know about safety, accuracy, and responding to GST notices.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border p-4 backdrop-blur-md transition-all bg-white border-slate-200 shadow-sm open:border-indigo-400 dark:bg-[#121224] dark:border-[#252542] dark:open:border-indigo-500/50"
          >
            <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
              <span>{faq.q}</span>
              <span className="ml-2 text-indigo-600 dark:text-indigo-400 transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="pt-3 text-xs leading-relaxed text-slate-600 dark:text-gray-400">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
