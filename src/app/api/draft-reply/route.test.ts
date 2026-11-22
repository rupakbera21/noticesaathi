/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST } from './route'
import { ExtractedNotice } from '@/schemas/notice'

describe('POST /api/draft-reply', () => {
  const sampleNotice: ExtractedNotice = {
    noticeType: 'ASMT_10_SCRUTINY',
    noticeTypeDescription: 'Scrutiny of Returns',
    issuingAuthority: 'Superintendent of Central Tax, Range-I, Mumbai',
    taxpayerGstin: '27AABCU9603R1ZN',
    taxpayerTradeName: 'Bharat Traders',
    noticeReferenceNumber: 'ASMT10/2024/8891',
    noticeDate: '2024-11-15',
    taxPeriod: 'April 2023 to March 2024',
    sectionsCited: ['Section 61'],
    rulesCited: ['Rule 99'],
    formsCited: ['ASMT-10'],
    taxDemand: 48500,
    interestDemand: 4210,
    penaltyDemand: 0,
    otherDemand: 0,
    totalStatedDemand: 52710,
    replyDeadlineDate: '2024-12-15',
    replyDaysAllowed: 30,
    documentsRequested: ['GSTR-2B reconciliation', 'Tax invoices'],
    statedGrounds: ['Mismatch in ITC'],
    allegationsOfFraudOrWilfulSuppression: false,
    extractionConfidence: 0.95,
  }

  it('generates a complete formal reply draft adhering to legal format', async () => {
    const req = new NextRequest('http://localhost:3000/api/draft-reply', {
      method: 'POST',
      body: JSON.stringify({
        notice: sampleNotice,
        userNotes: 'All supplier tax invoices were cleared through bank RTGS.',
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.draft).toBeDefined()
    expect(body.draft.noticeReference).toBe('ASMT10/2024/8891')
    expect(body.draft.taxpayerGstin).toBe('27AABCU9603R1ZN')
    expect(body.draft.subject).toContain('Reply to Notice')
    expect(body.draft.statutoryGrounds.length).toBeGreaterThan(0)
    expect(body.draft.enclosedDocuments.length).toBeGreaterThan(0)
    expect(body.draft.fullReplyText).toContain('Section 75(4)')
  })

  it('flags CA escalation warning when high demand or fraud allegations exist', async () => {
    const highDemandNotice: ExtractedNotice = {
      ...sampleNotice,
      totalStatedDemand: 800000, // > 5,00,000 threshold
      allegationsOfFraudOrWilfulSuppression: true,
    }

    const req = new NextRequest('http://localhost:3000/api/draft-reply', {
      method: 'POST',
      body: JSON.stringify({ notice: highDemandNotice }),
    })

    const res = await POST(req)
    const body = await res.json()
    expect(body.draft.caEscalationWarning).toContain('Chartered Accountant')
  })

  it('rejects invalid notice payloads', async () => {
    const req = new NextRequest('http://localhost:3000/api/draft-reply', {
      method: 'POST',
      body: JSON.stringify({ notice: { invalidField: true } }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
