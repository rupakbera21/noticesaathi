import { GroundingValidator } from './groundingValidator'
import { ExtractedNotice } from '@/schemas/notice'
import { KbChunk } from '@/schemas/kb'

describe('Grounding Validator Engine', () => {
  const sampleChunks: KbChunk[] = [
    {
      id: 'cgst-act-sec-61',
      actOrRules: 'CGST_ACT_2017',
      identifier: 'Section 61',
      normalizedId: 'sec-61',
      title: 'Scrutiny of Returns',
      content: 'Proper officer may scrutinize the return...',
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
      normalizedId: 'rule-99',
      title: 'Scrutiny of returns in FORM GST ASMT-10',
      content: 'Where any return furnished by a registered person is selected for scrutiny...',
      effectiveDate: '2017-07-01',
      sourceUrl: 'https://cbic-gst.gov.in/rules.html',
      authority: 'CBIC',
      fetchedAt: '2026-11-21T00:00:00Z',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  ]

  const validator = new GroundingValidator(sampleChunks)

  const baseNotice: ExtractedNotice = {
    noticeType: 'ASMT_10_SCRUTINY',
    noticeTypeDescription: 'Scrutiny of Returns',
    issuingAuthority: 'CGST',
    taxpayerGstin: '27AABCU9603R1ZN',
    taxpayerTradeName: 'Bharat Traders',
    noticeReferenceNumber: 'ASMT-10/01',
    noticeDate: '2024-11-15',
    taxPeriod: '2023-24',
    sectionsCited: ['Section 61'],
    rulesCited: ['Rule 99'],
    formsCited: ['ASMT-10'],
    taxDemand: 45000,
    interestDemand: 4000,
    penaltyDemand: 0,
    otherDemand: 0,
    totalStatedDemand: 49000,
    replyDeadlineDate: '2024-12-15',
    replyDaysAllowed: 30,
    documentsRequested: [],
    statedGrounds: [],
    allegationsOfFraudOrWilfulSuppression: false,
    extractionConfidence: 0.95,
  }

  it('validates verified statutory citations with high score', () => {
    const res = validator.validateNoticeGrounding(baseNotice)
    expect(res.groundedCitations).toContain('Section 61')
    expect(res.groundedCitations).toContain('Rule 99')
    expect(res.groundingScore).toBeGreaterThanOrEqual(0.6)
  })

  it('detects unverified hallucinated provisions', () => {
    const noticeWithHallucination: ExtractedNotice = {
      ...baseNotice,
      sectionsCited: ['Section 999_FABRICATED'],
      rulesCited: ['Rule 888_FICTIONAL'],
      formsCited: [],
    }
    const res = validator.validateNoticeGrounding(noticeWithHallucination)
    expect(res.isFullyGrounded).toBe(false)
    expect(res.unverifiedCitations).toContain('Section 999_FABRICATED')
    expect(res.groundingScore).toBe(0)
    expect(res.notes[0]).toContain('Unverified provisions')
  })

  it('treats notices without citations as grounded with note', () => {
    const emptyNotice: ExtractedNotice = {
      ...baseNotice,
      sectionsCited: [],
      rulesCited: [],
      formsCited: [],
    }
    const res = validator.validateNoticeGrounding(emptyNotice)
    expect(res.isFullyGrounded).toBe(true)
    expect(res.groundingScore).toBe(1.0)
  })
})
