import fc from 'fast-check'
import { calculateLateFee } from './lateFee'
import { LateFeeRule } from '../schemas/rule'

const mockLateFeeRule: LateFeeRule = {
  id: 'rule-sec47-gstr3b-v1',
  name: 'Late Fee for GSTR-3B',
  sectionOrRule: 'Section 47 of CGST Act',
  description: 'Late fee for delayed filing of return',
  sourceUrl: 'https://taxinformation.cbic.gov.in',
  effectiveFrom: '2021-06-01',
  effectiveTo: null,
  status: 'draft',
  verifiedBy: null,
  verifiedOn: null,
  parameters: {
    feePerDayCgst: 25,
    feePerDaySgst: 25,
    feePerDayTotal: 50,
    nilReturnFeePerDayTotal: 20,
    maximumCapPerReturn: 5000,
    nilReturnMaximumCap: 500,
  },
}

describe('Late Fee Calculation Engine (Section 47)', () => {
  it('computes regular late fee correctly without exceeding cap', () => {
    // 10 days * 50 = ₹500
    const res = calculateLateFee({
      daysDelayed: 10,
      isNilReturn: false,
      rule: mockLateFeeRule,
    })
    expect(res.lateFeeComputed).toBe(500)
    expect(res.feePerDayTotal).toBe(50)
  })

  it('caps late fee at maximum cap for long delays', () => {
    // 200 days * 50 = ₹10,000 -> capped at ₹5,000
    const res = calculateLateFee({
      daysDelayed: 200,
      isNilReturn: false,
      rule: mockLateFeeRule,
    })
    expect(res.lateFeeComputed).toBe(5000)
  })

  it('applies reduced rate and cap for nil returns', () => {
    // 10 days * 20 = ₹200
    const res = calculateLateFee({
      daysDelayed: 10,
      isNilReturn: true,
      rule: mockLateFeeRule,
    })
    expect(res.lateFeeComputed).toBe(200)

    // 50 days * 20 = ₹1,000 -> capped at ₹500 for nil returns
    const cappedNil = calculateLateFee({
      daysDelayed: 50,
      isNilReturn: true,
      rule: mockLateFeeRule,
    })
    expect(cappedNil.lateFeeComputed).toBe(500)
  })

  // Property-based test: Never exceeds maximum cap
  it('property: late fee never exceeds configured cap', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 2000 }), fc.boolean(), (days, isNil) => {
        const res = calculateLateFee({
          daysDelayed: days,
          isNilReturn: isNil,
          rule: mockLateFeeRule,
        })
        const expectedCap = isNil
          ? mockLateFeeRule.parameters.nilReturnMaximumCap
          : mockLateFeeRule.parameters.maximumCapPerReturn
        expect(res.lateFeeComputed).toBeLessThanOrEqual(expectedCap)
        expect(res.lateFeeComputed).toBeGreaterThanOrEqual(0)
      })
    )
  })
})
