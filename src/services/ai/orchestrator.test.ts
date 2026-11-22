import { AiOrchestrator } from './orchestrator'
import { ReplyDrafter } from './replyDrafter'
import { ExtractedNotice } from '@/schemas/notice'
import { KbChunk } from '@/schemas/kb'

describe('AI Orchestrator and Reply Drafter', () => {
  const sampleChunks: KbChunk[] = [
    {
      id: 'cgst-act-sec-61',
      actOrRules: 'CGST_ACT_2017',
      identifier: 'Section 61',
      normalizedId: 'sec-61',
      title: 'Scrutiny of Returns',
      content: 'Proper officer may scrutinize return in ASMT-10...',
      effectiveDate: '2017-07-01',
      sourceUrl: 'https://cbic-gst.gov.in/act.html',
      authority: 'CBIC',
      fetchedAt: '2026-11-21T00:00:00Z',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'cgst-rules-rule-99',
      actOrRules: 'CGST_RULES_2017',
      identifier: 'Rule 99',
      normalizedId: 'asmt-10',
      title: 'Scrutiny of returns in FORM GST ASMT-10',
      content: 'Where any return furnished by a registered person is selected for scrutiny in ASMT-10...',
      effectiveDate: '2017-07-01',
      sourceUrl: 'https://cbic-gst.gov.in/rules.html',
      authority: 'CBIC',
      fetchedAt: '2026-11-21T00:00:00Z',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  ]

  const orchestrator = new AiOrchestrator({
    kbChunks: sampleChunks,
  })

  const sampleNoticeText = `
    FORM GST ASMT-10
    Reference No: ASMT10/2024/1102
    Date: 20/11/2024
    GSTIN: 27AABCU9603R1ZN
    Legal Name: M/s Bharat Traders
    Notice for intimating discrepancies in return under Section 61.
    Tax: Rs 60,000
    Interest: Rs 5,400
    Penalty: Rs 0
    Total: Rs 65,400
    Furnish reply within 30 days.
  `

  it('falls back seamlessly to rule-based extraction when no API keys are provided', async () => {
    const res = await orchestrator.extractNoticeFacts(sampleNoticeText)
    expect(res.providerUsed).toBe('RULE_BASED_FALLBACK')
    expect(res.notice.noticeType).toBe('ASMT_10_SCRUTINY')
    expect(res.notice.taxpayerGstin).toBe('27AABCU9603R1ZN')
    expect(res.notice.taxDemand).toBe(60000)
    expect(res.latencyMs).toBeGreaterThanOrEqual(0)
    expect(res.grounding.isFullyGrounded).toBe(true)
  })

  it('generates fallback explanations in all supported languages', async () => {
    const extractRes = await orchestrator.extractNoticeFacts(sampleNoticeText)
    const en = await orchestrator.generateExplanation(extractRes.notice, 'Section 61 CBIC rule', 'en')
    const hi = await orchestrator.generateExplanation(extractRes.notice, 'धारा 61 नियम', 'hi')
    const bn = await orchestrator.generateExplanation(extractRes.notice, 'ধারা ৬১ নিয়ম', 'bn')

    expect(en).toContain('This notice relates to')
    expect(hi).toContain('यह नोटिस')
    expect(bn).toContain('এই নোটিশটি')
  })

  it('ReplyDrafter generates structured legal draft reply', async () => {
    const drafter = new ReplyDrafter()
    const notice: ExtractedNotice = {
      noticeType: 'ASMT_10_SCRUTINY',
      noticeTypeDescription: 'Scrutiny of returns',
      issuingAuthority: 'Superintendent Range 1, Delhi',
      taxpayerGstin: '07AAAAA0000A1Z5',
      taxpayerTradeName: 'Capital Suppliers',
      noticeReferenceNumber: 'ASMT10/2024/77',
      noticeDate: '2024-11-20',
      taxPeriod: '2023-24',
      sectionsCited: ['Section 61'],
      rulesCited: ['Rule 99'],
      formsCited: ['ASMT-10'],
      taxDemand: 30000,
      interestDemand: 2000,
      penaltyDemand: 0,
      otherDemand: 0,
      totalStatedDemand: 32000,
      replyDeadlineDate: '2024-12-20',
      replyDaysAllowed: 30,
      documentsRequested: ['GSTR-2B reconciliation', 'Tax invoices'],
      statedGrounds: ['Reconciliation difference'],
      allegationsOfFraudOrWilfulSuppression: false,
      extractionConfidence: 0.95,
    }

    const draft = await drafter.generateReply(notice, 'Section 16(2) compliance notes', 'All taxes paid via net banking.')
    expect(draft.noticeReference).toBe('ASMT10/2024/77')
    expect(draft.factualSubmissions.length).toBeGreaterThan(0)
    expect(draft.statutoryGrounds.length).toBeGreaterThan(0)
    expect(draft.fullReplyText).toContain('Capital Suppliers')
    expect(draft.fullReplyText).toContain('Section 75(4)')
  })
})
