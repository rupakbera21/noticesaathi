import React from 'react'

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Upload or Paste Notice',
      desc: 'Upload your GST portal PDF notice or paste the text directly. Supports ASMT-10, DRC-01, GSTR-3A, and DRC-01A.',
    },
    {
      num: '02',
      title: 'Mathematical & Statutory Audit',
      desc: 'Deterministic algorithms verify tax totals, Section 50 interest (18%/24% p.a.), and Section 47 late fees while AI retrieves CBIC citations.',
    },
    {
      num: '03',
      title: 'Grounded Response & Legal Draft',
      desc: 'Get an itemized receipt in ₹, check the IST deadline countdown, review required documents, and download a Section 75(4) draft reply.',
    },
  ]

  return (
    <section id="how-it-works" className="w-full max-w-4xl space-y-6 pt-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Workflow</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">How NoticeSaathi Works</h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          From an intimidating government notice to a fully audited response plan in under 60 seconds.
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

export function FeaturesSection() {
  const features = [
    {
      icon: '🧮',
      title: 'Zero-Hallucination Math',
      desc: 'Models are barred from calculating. Section 50 interest (18%/24% p.a.) and Section 47 late fees are executed strictly by audited code engines.',
    },
    {
      icon: '📚',
      title: 'CBIC Statutory Grounding',
      desc: 'Every legal claim is verified against official Central Board of Indirect Taxes & Customs (CBIC) statutory chunks and official gazettes.',
    },
    {
      icon: '🗣️',
      title: 'Plain Regional Explanations',
      desc: 'Understand technical allegations in your preferred language—switch seamlessly between English, Hindi (हिन्दी), and Bengali (বাংলা).',
    },
    {
      icon: '⚖️',
      title: 'Section 75(4) Reply Drafter',
      desc: 'One-click generation of a formal legal reply to the Proper Officer, formally reserving your statutory right to a personal hearing.',
    },
    {
      icon: '🚨',
      title: 'CA Escalation Sentinel',
      desc: 'Automatically identifies high-risk triggers—such as Section 74 fraud, cancellation, or demands > ₹5,00,000—requiring a human CA.',
    },
    {
      icon: '⏱️',
      title: 'IST Deadline Countdown',
      desc: 'Real-time countdown in Indian Standard Time (UTC+5:30) ensuring statutory reply deadlines (15 or 30 days) are never missed.',
    },
  ]

  return (
    <section id="features" className="w-full max-w-4xl space-y-6 pt-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Capabilities</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">Architected for Small Traders</h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          Combining deterministic financial math with multimodal AI retrieval for trustworthy notice analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border p-5 backdrop-blur-md transition-all bg-white border-slate-200 shadow-sm hover:border-indigo-400 dark:bg-[#121224] dark:border-[#252542] dark:hover:border-indigo-500/40"
          >
            <div className="text-2xl pb-2">{f.icon}</div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-1">{f.title}</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
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
      a: 'NoticeSaathi is an educational and workflow automation copilot designed for Indian MSMEs, accountants, and traders. It provides preliminary statutory triage and drafts grounded replies. It does not replace formal legal counsel or represent you before tax authorities.',
    },
    {
      q: 'How do you guarantee the interest and penalty amounts are accurate?',
      a: 'Large Language Models are strictly barred from performing math. All liability amounts, Section 50 simple interest (18% p.a. standard, 24% p.a. for undue ITC), and Section 47 late fees are computed deterministically in code according to statutory rules.',
    },
    {
      q: 'When should I escalate my notice to a human Chartered Accountant (CA)?',
      a: 'You should escalate whenever a notice alleges fraud, wilful misstatement, or deliberate suppression of facts (Section 74), threatens search or seizure (Section 67), proposes registration cancellation, or involves demands exceeding ₹5,00,000.',
    },
    {
      q: 'Does NoticeSaathi store my confidential GST data or notice text?',
      a: 'No. NoticeSaathi adheres to a strict zero-retention privacy policy. Notice text is processed in-memory and never written to server databases. User notice history resides exclusively inside your own browser local storage.',
    },
    {
      q: 'Can I copy the generated draft reply directly to the GST portal?',
      a: 'Yes. The legal draft is generated in formal legal format with official reference numbers, factual submissions, statutory grounds, and a formal prayer for Personal Hearing under Section 75(4). You can copy or print it to submit under Services > User Services > View Additional Notices and Orders on gst.gov.in.',
    },
    {
      q: 'What formats can I upload?',
      a: 'NoticeSaathi supports uploading digital PDF notice documents (.pdf) or text files (.txt), as well as direct text copy-pasting from the GST portal or email notifications.',
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
