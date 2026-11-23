import fc from 'fast-check'
import { calculateInterest } from './interest'
import { InterestRule } from '../schemas/rule'

const mockInterestRule: InterestRule = {
  id: 'rule-sec50-standard-v1',
  name: 'Standard Interest on Delayed Tax',
  sectionOrRule: 'Section 50(1) of CGST Act',
  description: 'Interest on delayed payment of tax at 18% p.a.',
  sourceUrl: 'https://taxinformation.cbic.gov.in',
  effectiveFrom: '2017-07-01',
  effectiveTo: null,
  status: 'draft',
  verifiedBy: null,
  verifiedOn: null,
  parameters: {
    ratePerAnnumPercent: 18,
    calculationBasis: 'NET_CASH_LIABILITY',
    undueItcRatePercent: 24,
  },
}

describe('Interest Calculation Engine (Section 50)', () => {
  it('calculates interest correctly on worked example', () => {
    // Official worked example:
    // Tax demand = ₹1,00,000, 30 days delayed at 18% p.a.
    // 100000 * 0.18 / 365 * 30 = 1479.45 -> rounds to ₹1479
    const res = calculateInterest({
      taxAmount: 100000,
      daysDelayed: 30,
      rule: mockInterestRule,
    })
    expect(res.interestComputed).toBe(1479)
    expect(res.ratePercent).toBe(18)
    expect(res.ruleStatus).toBe('draft')
  })

  it('returns 0 interest for 0 or negative days and amounts', () => {
    expect(
      calculateInterest({ taxAmount: 50000, daysDelayed: 0, rule: mockInterestRule })
        .interestComputed
    ).toBe(0)
    expect(
      calculateInterest({ taxAmount: 50000, daysDelayed: -10, rule: mockInterestRule })
        .interestComputed
    ).toBe(0)
    expect(
      calculateInterest({ taxAmount: 0, daysDelayed: 30, rule: mockInterestRule }).interestComputed
    ).toBe(0)
  })

  it('uses 24% rate for undue ITC claims when specified', () => {
    const res = calculateInterest({
      taxAmount: 100000,
      daysDelayed: 30,
      rule: mockInterestRule,
      isUndueItc: true,
    })
    expect(res.ratePercent).toBe(24)
    // 100000 * 0.24 / 365 * 30 = 1972.60 -> rounds to ₹1973
    expect(res.interestComputed).toBe(1973)
  })

  // Property-based test: Monotonicity
  it('property: interest is monotonically non-decreasing with days and amount', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 1000000 }),
        fc.integer({ min: 1, max: 365 }),
        fc.integer({ min: 1, max: 100 }),
        (tax, days, extraDays) => {
          const res1 = calculateInterest({
            taxAmount: tax,
            daysDelayed: days,
            rule: mockInterestRule,
          })
          const res2 = calculateInterest({
            taxAmount: tax,
            daysDelayed: days + extraDays,
            rule: mockInterestRule,
          })
          expect(res2.interestComputed).toBeGreaterThanOrEqual(res1.interestComputed)
        }
      )
    )
  })
})
