/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST } from './route'

describe('POST /api/analyze', () => {
  const sampleNoticeText = `
    FORM GST ASMT-10
    Reference No: ASMT10/2024/9912
    Date: 15/10/2024
    GSTIN: 27AABCU9603R1ZN
    Legal Name: Bharat Traders
    Notice for intimating discrepancies in return under Section 61 read with Rule 99.
    Tax: Rs 50,000
    Interest: Rs 4,500
    Penalty: Rs 0
    Total: Rs 54,500
    Furnish reply within 30 days.
  `

  it('analyzes notice and returns structured facts, deterministic calculations, and citations', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        noticeText: sampleNoticeText,
        language: 'en',
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.notice.noticeType).toBe('ASMT_10_SCRUTINY')
    expect(body.notice.taxDemand).toBe(50000)
    expect(body.notice.totalStatedDemand).toBe(54500)
    expect(body.totals.isConsistent).toBe(true)
    expect(body.escalation.shouldEscalate).toBe(false)
    expect(body.citations.length).toBeGreaterThan(0)
    expect(body.explanation).toContain('Scrutiny of Returns')
  })

  it('generates Hindi explanations when requested', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        noticeText: sampleNoticeText,
        language: 'hi',
      }),
    })

    const res = await POST(req)
    const body = await res.json()
    expect(body.explanation).toContain('यह नोटिस')
  })

  it('generates Bengali explanations when requested', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        noticeText: sampleNoticeText,
        language: 'bn',
      }),
    })

    const res = await POST(req)
    const body = await res.json()
    expect(body.explanation).toContain('এই নোটিশটি')
  })

  it('rejects payloads shorter than 20 characters', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ noticeText: 'too short' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('escalates Section 74 fraud notices in the analysis response', async () => {
    const fraudText = `
      FORM GST DRC-01
      Show Cause Notice under Section 74 for fraud and wilful misstatement to evade tax.
      Total Demand: Rs 9,00,000
      Reply within 30 days.
    `
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ noticeText: fraudText }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(body.escalation.shouldEscalate).toBe(true)
    expect(body.escalation.riskLevel).toBe('CRITICAL')
  })

  it('analyzes non-filer GSTR-3A notices correctly', async () => {
    const gstr3aText = `
      FORM GST GSTR-3A
      Notice to return defaulter under Section 46 for failure to furnish return.
      Tax Demand: Rs 12,000
      Furnish return within 15 days.
    `
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ noticeText: gstr3aText }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(body.notice.noticeType).toBe('GSTR_3A_NON_FILER')
    expect(body.notice.documentsRequested).toContain('Filed GSTR-3B return copy and ARN receipt')
  })

  it('preserves deadline uncertainty when notice lacks date and reply period', async () => {
    const textWithoutDate = `
      FORM GST ASMT-10
      Reference No: ASMT10/2024/0001
      GSTIN: 27AABCU9603R1ZN
      Discrepancies in return under Section 61.
      Tax Demand: Rs 25,000
      Total: Rs 25,000
    `
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ noticeText: textWithoutDate }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(body.deadline.status).toBe('uncertain')
    expect(body.deadline.formattedDate).toBeNull()
    expect(body.deadline.message).toBe('Check the deadline on your notice')
    expect(body.deadline.isExpired).toBe(false)
  })

  it('returns interestCalc as null when delay period cannot be established from notice facts', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ noticeText: sampleNoticeText }),
    })
    const res = await POST(req)
    const body = await res.json()
    // Stated amounts in notice are preserved, but ungrounded 30-day calculation is not fabricated
    expect(body.interestCalc).toBeNull()
    expect(body.notice.interestDemand).toBe(4500)
  })
})
