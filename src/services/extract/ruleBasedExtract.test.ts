import { extractWithRules, crossCheckExtractions } from './ruleBasedExtract'
import { ExtractedNotice } from '../../schemas/notice'

describe('Rule-Based Notice Extractor', () => {
  const sampleAsmt10Text = `
    FORM GST ASMT-10
    [See rule 99(1)]
    Notice for intimating discrepancies in the return after scrutiny
    Reference No: ASMT10/2024/78219
    Date: 15/10/2024
    GSTIN: 27AABCU9603R1ZN
    Legal Name: M/s Bharat Traders
    
    This is to intimate that scrutiny of your return for tax period April 2023 to March 2024
    under Section 61 of the CGST Act, 2017 read with Rule 99 has revealed discrepancies.
    
    Tax: Rs 48,500
    Interest: Rs 4,210
    Penalty: Rs 0
    Total Demand: Rs 52,710
    
    You are hereby requested to furnish an explanation within 30 days of receipt of this notice.
  `

  it('correctly extracts ASMT-10 scrutiny notice fields', () => {
    const res = extractWithRules(sampleAsmt10Text)
    expect(res.detectedNoticeType).toBe('ASMT_10_SCRUTINY')
    expect(res.detectedGstin).toBe('27AABCU9603R1ZN')
    expect(res.detectedSections).toContain('Section 61')
    expect(res.detectedRules).toContain('Rule 99')
    expect(res.detectedForms).toContain('ASMT-10')
    expect(res.replyDaysAllowed).toBe(30)
    expect(res.detectedTaxAmount).toBe(48500)
    expect(res.detectedTotalAmount).toBe(52710)
    expect(res.hasFraudAllegations).toBe(false)
  })

  it('detects fraud allegations in Section 74 DRC-01 notices', () => {
    const fraudText = `
      FORM GST DRC-01
      Show Cause Notice under Section 74 of the CGST Act, 2017.
      It appears that tax has not been paid by reason of fraud and wilful misstatement of facts with intent to evade tax.
      Demand: Rs 150000
    `
    const res = extractWithRules(fraudText)
    expect(res.detectedNoticeType).toBe('DRC_01_DEMAND_FRAUD')
    expect(res.hasFraudAllegations).toBe(true)
    expect(res.detectedSections).toContain('Section 74')
  })

  it('detects GSTR-3A non-filer and REG-17 cancellation notices', () => {
    const gstr3a = extractWithRules(
      'FORM GST GSTR-3A under Section 46 for failure to furnish return within 15 days.'
    )
    expect(gstr3a.detectedNoticeType).toBe('GSTR_3A_NON_FILER')
    expect(gstr3a.replyDaysAllowed).toBe(15)

    const reg17 = extractWithRules(
      'FORM GST REG-17 Show Cause Notice for cancellation of registration under Section 29.'
    )
    expect(reg17.detectedNoticeType).toBe('REG_17_REGISTRATION_CANCEL')

    const rfd08 = extractWithRules('FORM GST RFD-08 Notice for rejection of refund application.')
    expect(rfd08.detectedNoticeType).toBe('RFD_08_REFUND_SCN')
  })

  it('crossCheckExtractions flags discrepancies when values disagree', () => {
    const ruleRes = extractWithRules(sampleAsmt10Text)
    const modelNotice: ExtractedNotice = {
      noticeType: 'OTHER_GST_NOTICE', // Discrepancy
      noticeTypeDescription: 'Other',
      issuingAuthority: 'CGST',
      taxpayerGstin: '29ABCDE1234F1Z5', // Discrepancy with 27AABCU9603R1ZN
      taxpayerTradeName: 'Bharat Traders',
      noticeReferenceNumber: 'ASMT10',
      noticeDate: '2024-10-15',
      taxPeriod: '2023-24',
      sectionsCited: ['Section 61'],
      rulesCited: ['Rule 99'],
      formsCited: ['ASMT-10'],
      taxDemand: 80000, // Discrepancy with 48500
      interestDemand: 4210,
      penaltyDemand: 0,
      otherDemand: 0,
      totalStatedDemand: 52710,
      replyDeadlineDate: '2024-11-15',
      replyDaysAllowed: 15, // Discrepancy (rules found 30)
      documentsRequested: [],
      statedGrounds: [],
      allegationsOfFraudOrWilfulSuppression: false,
      extractionConfidence: 0.9,
    }

    const flags = crossCheckExtractions(modelNotice, ruleRes)
    expect(flags.length).toBe(4)
    expect(flags.some(f => f.field === 'noticeType')).toBe(true)
    expect(flags.some(f => f.field === 'taxpayerGstin')).toBe(true)
    expect(flags.some(f => f.field === 'replyDaysAllowed')).toBe(true)
    expect(flags.some(f => f.field === 'taxDemand')).toBe(true)
  })
})
