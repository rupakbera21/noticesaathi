import React from 'react'

const FAQS = [
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

export function FaqSection() {
  return (
    <section id="faqs" className="w-full max-w-4xl space-y-6 pt-12 pb-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Questions
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
          Everything you need to know about safety, accuracy, and responding to GST notices.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border p-4 backdrop-blur-md transition-all bg-white border-slate-200 shadow-sm open:border-indigo-400 dark:bg-[#121224] dark:border-[#252542] dark:open:border-indigo-500/50"
          >
            <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
              <span>{faq.q}</span>
              <span className="ml-2 text-indigo-600 dark:text-indigo-400 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <p className="pt-3 text-xs leading-relaxed text-slate-600 dark:text-gray-400">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
