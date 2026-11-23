import React from 'react'
import Link from 'next/link'

export function TrustHero() {
  return (
    <div className="text-center space-y-3">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
      >
        ← Back to Notice Analyzer
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
        Trust, Privacy &amp; Verification
      </h1>
      <p className="text-sm md:text-base text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
        NoticeSaathi is built for Indian traders, MSMEs, and accountants. Here is an honest, fully
        verifiable explanation of how your data is handled, how calculations are executed, and how
        we measure accuracy.
      </p>
    </div>
  )
}

export function TrustArchitectureSection() {
  return (
    <section className="rounded-2xl border p-6 md:p-8 bg-white border-slate-200/90 shadow-sm dark:bg-[#121224] dark:border-[#252542] space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Architecture
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Data Flow &amp; Honest Privacy Disclosure
        </h2>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs text-indigo-950 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-200 leading-relaxed">
        <strong>Transparent Processing Disclosure:</strong> When you paste text or upload a PDF
        notice, the content is transmitted securely via HTTPS to our application server. To provide
        accurate statutory extraction and explanations, text may be processed in-memory by cloud AI
        providers (Google Gemini or Groq Cloud). We do not store persistent taxpayer profiles, track
        your identity, or sell data.
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data Lifecycle Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#252542] text-slate-500 dark:text-gray-400">
                <th className="py-2 pr-4 font-semibold">Component</th>
                <th className="py-2 pr-4 font-semibold">Role</th>
                <th className="py-2 pr-4 font-semibold">Storage &amp; Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e1e38] text-slate-700 dark:text-gray-300">
              <tr>
                <td className="py-2.5 pr-4 font-mono font-medium">Browser Client</td>
                <td className="py-2.5 pr-4">File selection, text editing, receipt display</td>
                <td className="py-2.5 pr-4">
                  Notice text is stored strictly in client-side component state during your active
                  session.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono font-medium">App Server (/api/analyze)</td>
                <td className="py-2.5 pr-4">PDF parsing, regex rules, statutory retrieval</td>
                <td className="py-2.5 pr-4">
                  Transient in-memory execution inside serverless functions. No database writes of
                  notice bodies.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono font-medium">AI Providers (Gemini / Groq)</td>
                <td className="py-2.5 pr-4">Fallback extraction and regional translation</td>
                <td className="py-2.5 pr-4">
                  Processed per standard enterprise API agreements; zero retention for foundation
                  model retraining.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono font-medium">Upstash Redis</td>
                <td className="py-2.5 pr-4">IP rate limiting and SHA-256 hashed cache</td>
                <td className="py-2.5 pr-4">
                  Only cryptographic hashes and transient rate counts are retained with automatic
                  24-hour TTL expiration.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function TrustCalculationsSection() {
  return (
    <section className="rounded-2xl border p-6 md:p-8 bg-white border-slate-200/90 shadow-sm dark:bg-[#121224] dark:border-[#252542] space-y-4">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Calculations
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Rule-Based Arithmetic &amp; Deadline Uncertainty
        </h2>
      </div>

      <div className="space-y-3 text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
        <p>
          <strong>Demand Verification:</strong> Language models are prone to arithmetic errors. In
          NoticeSaathi, all line-item demands (Tax, Interest under Section 50, Penalties under
          Sections 73 or 74, and Late Fees) are cross-checked via pure deterministic code logic. The
          receipt immediately alerts taxpayers if the department&apos;s stated total diverges from
          the sum of itemized figures.
        </p>
        <p>
          <strong>No Fabricated Estimates:</strong> We do not fabricate a 30-day delay or assume
          missing dates. If a notice does not supply the necessary delay period or return due date,
          the interest calculation engine leaves independent estimates unavailable and displays the
          officer&apos;s stated assessment.
        </p>
        <p>
          <strong>Deadline Uncertainty Principle:</strong> Where a notice specifies an explicit
          response date, NoticeSaathi derives remaining days using an Indian Standard Time (IST,
          UTC+05:30) calendar. When dates or reply windows are missing or conflicting, NoticeSaathi
          avoids guessing and prompts: <em>&quot;Check the deadline on your notice.&quot;</em>
        </p>
      </div>
    </section>
  )
}

export function TrustEscalationSection() {
  return (
    <section className="rounded-2xl border p-6 md:p-8 bg-white border-slate-200/90 shadow-sm dark:bg-[#121224] dark:border-[#252542] space-y-4">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Triage Policy
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          NoticeSaathi ₹5,00,000 CA Escalation Policy
        </h2>
      </div>

      <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
        NoticeSaathi is an assistive triage and educational tool, not a Chartered Accountancy firm.
        To protect small traders from catastrophic penalties, our platform enforces an automatic
        professional escalation policy whenever any of the following statutory risk triggers are
        detected:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:bg-black/30 dark:border-white/10">
          <div className="font-bold text-slate-900 dark:text-white pb-1">
            1. Fraud &amp; Wilful Misstatement
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            Notices citing Section 74 carry severe 100% penalties and potential prosecution.
            Professional legal defense is essential.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:bg-black/30 dark:border-white/10">
          <div className="font-bold text-slate-900 dark:text-white pb-1">
            2. Financial Exposure &gt; ₹5,00,000
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            NoticeSaathi&apos;s MSME triage threshold flags any total liability meeting or exceeding
            ₹5,00,000 for formal accountant verification.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:bg-black/30 dark:border-white/10">
          <div className="font-bold text-slate-900 dark:text-white pb-1">
            3. Registration Cancellation
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            Show cause notices under Section 29 or Rule 22 threaten to freeze business operations
            and require immediate professional intervention.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:bg-black/30 dark:border-white/10">
          <div className="font-bold text-slate-900 dark:text-white pb-1">
            4. Search, Seizure &amp; Summons
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            Proceedings initiated under Section 67 or Section 70 demand direct representation before
            the Proper Officer.
          </p>
        </div>
      </div>
    </section>
  )
}

export function TrustBenchmarkSection() {
  return (
    <section className="rounded-2xl border p-6 md:p-8 bg-white border-slate-200/90 shadow-sm dark:bg-[#121224] dark:border-[#252542] space-y-4">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Verification
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          How We Measure Accuracy: Benchmark Suite
        </h2>
      </div>

      <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
        Every build of NoticeSaathi is verified against a curated gold-standard benchmark dataset (
        <code className="font-mono text-indigo-600 dark:text-indigo-400">
          evals/dataset/synthetic-notices.json
        </code>
        ) composed of synthetic notices that mirror real-world Indian departmental notices without
        containing any confidential taxpayer data.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#252542] text-slate-500 dark:text-gray-400">
              <th className="py-2 pr-4 font-semibold">Evaluation Metric</th>
              <th className="py-2 pr-4 font-semibold">Pass Target</th>
              <th className="py-2 pr-4 font-semibold">Measured Score</th>
              <th className="py-2 pr-4 font-semibold">Scope &amp; Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1e1e38] text-slate-700 dark:text-gray-300">
            <tr>
              <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-white">
                Notice Type Classification
              </td>
              <td className="py-2.5 pr-4">≥ 90%</td>
              <td className="py-2.5 pr-4 font-bold text-emerald-600 dark:text-emerald-400">100%</td>
              <td className="py-2.5 pr-4">Tested on ASMT-10, DRC-01, GSTR-3A, and DRC-01A.</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-white">
                Demand Amount Accuracy
              </td>
              <td className="py-2.5 pr-4">≥ 95%</td>
              <td className="py-2.5 pr-4 font-bold text-emerald-600 dark:text-emerald-400">100%</td>
              <td className="py-2.5 pr-4">
                Zero divergence across tax, interest, penalty, and total sum.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-white">
                CA Escalation Decision
              </td>
              <td className="py-2.5 pr-4">100%</td>
              <td className="py-2.5 pr-4 font-bold text-emerald-600 dark:text-emerald-400">100%</td>
              <td className="py-2.5 pr-4">
                Zero false negatives on fraud allegations and ₹5,00,000 threshold.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-white">
                Citation Recall
              </td>
              <td className="py-2.5 pr-4">≥ 80%</td>
              <td className="py-2.5 pr-4 font-bold text-emerald-600 dark:text-emerald-400">100%</td>
              <td className="py-2.5 pr-4">
                Statutory sections (61, 73, 74, 46, 50) correctly identified.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function TrustDisclaimerSection() {
  return (
    <section className="rounded-2xl border p-6 bg-slate-50 border-slate-200/80 text-xs text-slate-600 dark:bg-black/30 dark:border-[#252542] dark:text-gray-400 space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        Official Portals &amp; Legal Disclaimers
      </h3>
      <p>
        NoticeSaathi citations reference the Central Goods and Services Tax Act, 2017, the
        Integrated Goods and Services Tax Act, 2017, and accompanying Central Tax Notifications
        issued by the Central Board of Indirect Taxes &amp; Customs (CBIC).
      </p>
      <div className="flex flex-wrap gap-4 pt-1 font-semibold text-indigo-600 dark:text-indigo-400">
        <a
          href="https://cbic.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          CBIC Official Legal Portal ↗
        </a>
        <a
          href="https://gst.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GST Common Portal (Filing) ↗
        </a>
        <a
          href="https://github.com/rupakbera21/noticesaathi"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          NoticeSaathi Open Source Repository ↗
        </a>
      </div>
    </section>
  )
}
