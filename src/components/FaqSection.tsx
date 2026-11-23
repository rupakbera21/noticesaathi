import React from 'react'

const FAQS = [
  {
    q: 'Does NoticeSaathi store my confidential GST data or notice text?',
    a: 'Notice text is sent to our server to perform parsing and may be processed by Google Gemini or Groq Cloud for extraction. We do not store persistent taxpayer profiles or sell data. Notice text in your browser is kept in your active session. Upstream cloud provider logging and retention are subject to provider API policies.',
  },
  {
    q: 'Can I copy the generated draft reply directly to the GST portal without review?',
    a: 'No. You must review the draft before submitting. NoticeSaathi generates an editable working reply template with statutory grounds and a Section 75(4) personal hearing prayer. You should verify dates and invoice numbers, attach reconciliation statements, and consult a Chartered Accountant on high-risk matters.',
  },
  {
    q: 'When should I escalate my notice to a human Chartered Accountant (CA)?',
    a: 'Under NoticeSaathi triage policy, you should consult a qualified CA whenever a notice alleges fraud, wilful misstatement, or deliberate suppression (Section 74), involves search or inspection (Section 67), threatens registration cancellation (Section 29), or carries total liabilities meeting or exceeding ₹5,00,000.',
  },
  {
    q: 'How does NoticeSaathi verify interest and demand amounts?',
    a: 'NoticeSaathi parses the amounts stated on the notice and checks their mathematical consistency in pure code logic. It does not guess missing delay periods. Independent interest estimates are calculated only when the required delay inputs and statutory rates are established from notice facts.',
  },
  {
    q: 'Is NoticeSaathi legally binding or considered formal legal advice?',
    a: 'NoticeSaathi is an assistive educational and triage workflow tool designed for Indian MSMEs, accountants, and traders. It provides statutory summaries and reply frameworks. It does not replace formal legal counsel or represent taxpayers before tax authorities.',
  },
  {
    q: 'What formats can I upload?',
    a: 'NoticeSaathi supports digital PDF notice documents (.pdf) or text files (.txt), as well as direct text copy-pasting from the GST portal or email notifications.',
  },
]

export function FaqSection() {
  return (
    <section id="faqs" className="w-full max-w-4xl space-y-6 pt-12 pb-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
          Questions
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-[var(--text-secondary)] max-w-xl">
          Essential information on data privacy, reply drafting, and CA escalation.
        </p>
      </div>

      <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {FAQS.map((faq, i) => (
          <details key={i} className="group py-4 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--primary-action)] list-none">
              <span>{faq.q}</span>
              <span
                className="ml-4 shrink-0 text-xs text-[var(--text-secondary)] transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                ▾
              </span>
            </summary>
            <p className="pt-2 text-xs leading-relaxed text-[var(--text-secondary)] max-w-3xl">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
