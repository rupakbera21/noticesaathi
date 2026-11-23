import { InterestRule } from '../schemas/rule'

export interface InterestCalculationParams {
  taxAmount: number
  daysDelayed: number
  rule: InterestRule
  isUndueItc?: boolean
}

export interface InterestCalculationResult {
  taxAmount: number
  daysDelayed: number
  ratePercent: number
  dailyRate: number
  interestComputed: number
  ruleId: string
  ruleStatus: string
  sourceCitation: string
}

/**
 * Computes interest on delayed GST payment under Section 50 of the CGST Act.
 * Pure, deterministic function.
 * Standard rate is 18% p.a. under Sec 50(1); 24% under Sec 50(3) for undue ITC claims.
 */
export function calculateInterest(params: InterestCalculationParams): InterestCalculationResult {
  const { taxAmount, daysDelayed, rule, isUndueItc = false } = params

  if (taxAmount <= 0 || daysDelayed <= 0) {
    return {
      taxAmount: Math.max(0, taxAmount),
      daysDelayed: Math.max(0, daysDelayed),
      ratePercent: rule.parameters.ratePerAnnumPercent,
      dailyRate: 0,
      interestComputed: 0,
      ruleId: rule.id,
      ruleStatus: rule.status,
      sourceCitation: rule.sectionOrRule,
    }
  }

  const rate =
    isUndueItc && rule.parameters.undueItcRatePercent
      ? rule.parameters.undueItcRatePercent
      : rule.parameters.ratePerAnnumPercent

  // Daily rate based on standard 365-day year
  const dailyRate = rate / 100 / 365
  const rawInterest = taxAmount * dailyRate * daysDelayed
  const interestComputed = Math.round(rawInterest)

  return {
    taxAmount,
    daysDelayed,
    ratePercent: rate,
    dailyRate,
    interestComputed,
    ruleId: rule.id,
    ruleStatus: rule.status,
    sourceCitation: rule.sectionOrRule,
  }
}
