import { checkTotalsConsistency } from './totals'
import { evaluateEscalation } from './escalation'
import { normalizeNoticeText, fnv1a32, computeNoticeHash } from './fingerprint'
import { parseDateIST, nowInIST } from './dates'
import { ExtractedNotice } from '../schemas/notice'

describe('Totals Consistency Engine', () => {
  it('confirms consistent breakdown', () => {
    const res = checkTotalsConsistency({
      taxDemand: 45000,
      interestDemand: 4200,
      penaltyDemand: 5000,
      statedTotal: 54200,
    })
    expect(res.isConsistent).toBe(true)
    expect(res.hasDiscrepancy).toBe(false)
    expect(res.discrepancyMessage).toBeNull()
  })

  it('flags discrepancies beyond ₹1 tolerance', () => {
    const res = checkTotalsConsistency({
      taxDemand: 45000,
      interestDemand: 4200,
      penaltyDemand: 5000,
      statedTotal: 60000, // Discrepancy
    })
    expect(res.isConsistent).toBe(false)
    expect(res.hasDiscrepancy).toBe(true)
    expect(res.discrepancyMessage).toContain('Total mismatch')
  })
})

describe('Escalation Engine', () => {
  const baseNotice: ExtractedNotice = {
    noticeType: 'ASMT_10_SCRUTINY',
    noticeTypeDescription: 'Scrutiny of return',
    issuingAuthority: 'Superintendent CGST',
    taxpayerGstin: '27AABCU9603R1ZN',
    taxpayerTradeName: 'Fictional Traders',
    noticeReferenceNumber: 'ASMT/2024/001',
    noticeDate: '2024-11-01',
    taxPeriod: '2023-24',
    sectionsCited: ['Section 61'],
    rulesCited: ['Rule 99'],
    formsCited: ['ASMT-10'],
    taxDemand: 45000,
    interestDemand: 4000,
    penaltyDemand: 0,
    otherDemand: 0,
    totalStatedDemand: 49000,
    replyDeadlineDate: '2024-12-01',
    replyDaysAllowed: 30,
    documentsRequested: ['Invoices'],
    statedGrounds: ['Mismatch in ITC'],
    allegationsOfFraudOrWilfulSuppression: false,
    extractionConfidence: 0.95,
  }

  it('does not escalate routine, small-value scrutiny notices', () => {
    const res = evaluateEscalation(baseNotice)
    expect(res.shouldEscalate).toBe(false)
    expect(res.riskLevel).toBe('LOW')
  })

  it('escalates Section 74 / fraud allegations as CRITICAL', () => {
    const fraudNotice: ExtractedNotice = {
      ...baseNotice,
      noticeType: 'DRC_01_DEMAND_FRAUD',
      sectionsCited: ['Section 74'],
      allegationsOfFraudOrWilfulSuppression: true,
    }
    const res = evaluateEscalation(fraudNotice)
    expect(res.shouldEscalate).toBe(true)
    expect(res.riskLevel).toBe('CRITICAL')
    expect(res.reasons.some(r => r.includes('Section 74'))).toBe(true)
  })

  it('escalates registration cancellation notices as HIGH', () => {
    const cancelNotice: ExtractedNotice = {
      ...baseNotice,
      noticeType: 'REG_17_REGISTRATION_CANCEL',
      sectionsCited: ['Section 29'],
    }
    const res = evaluateEscalation(cancelNotice)
    expect(res.shouldEscalate).toBe(true)
    expect(res.riskLevel).toBe('HIGH')
  })

  it('escalates high demand exceeding threshold', () => {
    const highDemandNotice: ExtractedNotice = {
      ...baseNotice,
      totalStatedDemand: 750000,
    }
    const res = evaluateEscalation(highDemandNotice, { demandThresholdInr: 500000 })
    expect(res.shouldEscalate).toBe(true)
    expect(res.riskLevel).toBe('MEDIUM')
  })

  it('escalates low extraction confidence as MEDIUM', () => {
    const lowConfNotice: ExtractedNotice = {
      ...baseNotice,
      extractionConfidence: 0.5,
    }
    const res = evaluateEscalation(lowConfNotice)
    expect(res.shouldEscalate).toBe(true)
    expect(res.riskLevel).toBe('MEDIUM')
  })
})

describe('Fingerprint Engine', () => {
  it('normalizes whitespace and case deterministically', () => {
    const t1 = 'NOTICE UNDER SECTION 61\n\nTax: Rs 50,000'
    const t2 = '   notice under section 61\nTax: Rs 50,000   '
    expect(normalizeNoticeText(t1)).toBe(normalizeNoticeText(t2))
    expect(normalizeNoticeText('')).toBe('')
  })

  it('computes 32-bit FNV-1a hash and cache keys', () => {
    const h1 = fnv1a32('test-string')
    const h2 = fnv1a32('test-string')
    expect(h1).toBe(h2)
    expect(h1.length).toBe(8)

    const res = computeNoticeHash('Notice content under Section 61', { language: 'hi' })
    expect(res.fingerprint).toBeDefined()
    expect(res.cacheKey).toBeDefined()
  })

  it('handles invalid date parsing and nowInIST', () => {
    expect(() => parseDateIST('not-a-date')).toThrow('Unable to parse date string')
    expect(nowInIST()).toBeInstanceOf(Date)
  })

  it('barrel export index exposes all engines', async () => {
    const domain = await import('./index')
    expect(domain.calculateInterest).toBeDefined()
    expect(domain.calculateLateFee).toBeDefined()
    expect(domain.evaluateEscalation).toBeDefined()
    expect(domain.checkTotalsConsistency).toBeDefined()
  })
})
