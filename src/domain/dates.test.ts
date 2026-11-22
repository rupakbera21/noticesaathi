import fc from 'fast-check'
import {
  parseDateIST,
  addDaysIST,
  daysBetweenIST,
  getRemainingDaysIST,
  formatDateIST,
} from './dates'

describe('IST Date Arithmetic Engine', () => {
  it('parses DD/MM/YYYY and YYYY-MM-DD correctly', () => {
    const d1 = parseDateIST('15/12/2024')
    expect(d1.getUTCDate()).toBe(15)
    expect(d1.getUTCMonth()).toBe(11) // Dec is 11
    expect(d1.getUTCFullYear()).toBe(2024)

    const d2 = parseDateIST('2024-06-30')
    expect(d2.getUTCDate()).toBe(30)
    expect(d2.getUTCMonth()).toBe(5) // Jun is 5
  })

  it('handles leap years correctly (e.g. Feb 29, 2024)', () => {
    const leapDate = parseDateIST('2024-02-28')
    const nextDay = addDaysIST(leapDate, 1)
    expect(nextDay.getUTCDate()).toBe(29)
    expect(nextDay.getUTCMonth()).toBe(1) // Feb
  })

  it('handles month end rollovers correctly', () => {
    const marchEnd = parseDateIST('2024-03-31')
    const aprilFirst = addDaysIST(marchEnd, 1)
    expect(aprilFirst.getUTCDate()).toBe(1)
    expect(aprilFirst.getUTCMonth()).toBe(3) // Apr
  })

  it('computes remaining days with an injected clock', () => {
    const fakeClock = () => new Date('2024-11-20T10:00:00Z')
    const deadline = parseDateIST('2024-12-15')
    const remaining = getRemainingDaysIST(deadline, fakeClock)
    expect(remaining).toBeGreaterThan(0)
  })

  it('formats dates into standard Indian notation', () => {
    const d = parseDateIST('2024-12-15')
    expect(formatDateIST(d)).toBe('15 Dec 2024')
  })

  // Property-based test with fast-check: Monotonicity
  it('property: addDaysIST(d, a + b) === addDaysIST(addDaysIST(d, a), b)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (a, b) => {
          const base = new Date('2024-01-01T00:00:00Z')
          const singleStep = addDaysIST(base, a + b)
          const twoSteps = addDaysIST(addDaysIST(base, a), b)
          expect(singleStep.getTime()).toBe(twoSteps.getTime())
        }
      )
    )
  })

  it('property: daysBetweenIST is antisymmetric', () => {
    fc.assert(
      fc.property(fc.integer({ min: -365, max: 365 }), days => {
        const d1 = new Date('2024-06-01T00:00:00Z')
        const d2 = addDaysIST(d1, days)
        expect(daysBetweenIST(d1, d2)).toBe(days)
        const back = daysBetweenIST(d2, d1)
        expect(back === 0 ? 0 : back).toBe(days === 0 ? 0 : -days)
      })
    )
  })
})
