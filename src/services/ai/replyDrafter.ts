import { ExtractedNotice, DraftReply } from '@/schemas/notice'
import { evaluateEscalation } from '@/domain/escalation'
import { AiProvider } from './types'

export class ReplyDrafter {
  private provider?: AiProvider

  constructor(provider?: AiProvider) {
    this.provider = provider
  }

  public async generateReply(
    notice: ExtractedNotice,
    citationsSummary: string,
    userNotes?: string
  ): Promise<DraftReply> {
    if (this.provider) {
      try {
        return await this.provider.draftReply(notice, citationsSummary, userNotes)
      } catch {
        // Fall back to deterministic template drafter
      }
    }

    return this.buildDeterministicReply(notice, citationsSummary, userNotes)
  }

  private buildDeterministicReply(
    notice: ExtractedNotice,
    citationsSummary: string,
    userNotes?: string
  ): DraftReply {
    const today = new Date().toISOString().split('T')[0] ?? '2024-11-20'
    const ref = notice.noticeReferenceNumber ?? 'Notice Cited Above'
    const gstin = notice.taxpayerGstin ?? 'Registered GSTIN'
    const authority = notice.issuingAuthority ?? 'The Proper Officer, Goods and Services Tax'

    const grounds = [
      {
        provision: notice.sectionsCited[0] ?? 'Section 16(2) of CGST Act, 2017',
        explanation: 'The registered person has satisfied all primary statutory conditions: possession of valid tax invoice, receipt of goods/services, and timely reporting in returns.',
      },
      {
        provision: 'Circular No. 183/15/2022-GST',
        explanation: 'Clarification regarding treatment of discrepancies in GSTR-2A vs GSTR-3B for bona fide tax payments.',
      },
    ]

    const docs = notice.documentsRequested.length > 0
      ? notice.documentsRequested
      : ['Tax invoices & delivery challans', 'GSTR-2B reconciliation report', 'Bank payment vouchers reflecting tax paid']

    const submissions = [
      `That the taxpayer has consistently complied with the provisions of the CGST/SGST Act, 2017 for the relevant tax period (${notice.taxPeriod ?? 'specified period'}).`,
      `That the apparent discrepancy highlighted in notice reference ${ref} arises out of outward supplier reporting delays rather than non-payment of tax.`,
      userNotes ? `Additional taxpayer facts: ${userNotes}` : 'All underlying tax liabilities have been discharged through cash or valid input tax credit.',
    ]

    const escalation = evaluateEscalation(notice)
    const caWarning = escalation.shouldEscalate
      ? `NoticeSaathi triage policy recommends professional review by a Chartered Accountant before submission (${escalation.reasons[0] ?? 'high-risk flags'}). Taxpayers should verify draft facts and attach primary records before filing.`
      : null

    const fullText = [
      `To,\n${authority}\n`,
      `Date: ${today}\n`,
      `Subject: Reply to Notice Ref: ${ref} in respect of GSTIN: ${gstin}\n`,
      `Respected Sir/Madam,\n`,
      `With reference to the notice cited above, the taxpayer respectfully submits the following clarification:\n`,
      ...submissions.map((s, idx) => `${idx + 1}. ${s}`),
      `\nStatutory Grounds & Clarifications:\n` + citationsSummary,
      `\nEnclosed Documents:\n` + docs.map((d, idx) => `  Annexure ${idx + 1}: ${d}`).join('\n'),
      `\nPrayer:\nIn view of the above facts, it is respectfully requested that the proposed proceedings or demands be dropped. In the event of any adverse view, the taxpayer requests an opportunity of personal hearing under Section 75(4) of the CGST Act.`,
      `\nYours faithfully,\nAuthorized Signatory\n${notice.taxpayerTradeName ?? 'Taxpayer'}`,
    ].join('\n')

    return {
      noticeReference: ref,
      taxpayerGstin: gstin,
      taxpayerName: notice.taxpayerTradeName,
      issuingAuthority: authority,
      dateOfReply: today,
      subject: `Reply to Notice ${ref} - Submission of Compliance Details`,
      openingStatement: `The taxpayer acknowledges receipt of communication ${ref} and submits this explanation within the statutory response period.`,
      factualSubmissions: submissions,
      statutoryGrounds: grounds,
      enclosedDocuments: docs,
      prayerOrReliefSought: 'Request to verify submitted records and drop proposed demand, with personal hearing requested if any adverse decision is contemplated.',
      caEscalationWarning: caWarning,
      fullReplyText: fullText,
    }
  }
}
