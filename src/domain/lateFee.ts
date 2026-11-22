import { LateFeeRule } from '../schemas/rule'

export interface LateFeeCalculationParams {
  daysDelayed: number
  isNilReturn: boolean
  rule: LateFeeRule
}

export interface LateFeeCalculationResult {
  daysDelayed: number
  isNilReturn: boolean
  feePerDayTotal: number
  maximumCap: number
  lateFeeComputed: number
  ruleId: string
  ruleStatus: string
  sourceCitation: string
}

/**
 * Computes late fee for delayed return filing under Section 47 of the CGST Act.
 * Pure, deterministic function.
 */
export function calculateLateFee(params: LateFeeCalculationParams): LateFeeCalculationResult {
  const { daysDelayed, isNilReturn, rule } = params

  if (daysDelayed <= 0) {
    return {
      daysDelayed: 0,
      isNilReturn,
      feePerDayTotal: isNilReturn ? rule.parameters.nilReturnFeePerDayTotal : rule.parameters.feePerDayTotal,
      maximumCap: isNilReturn ? rule.parameters.nilReturnMaximumCap : rule.parameters.maximumCapPerReturn,
      lateFeeComputed: 0,
      ruleId: rule.id,
      ruleStatus: rule.status,
      sourceCitation: rule.sectionOrRule,
    }
  }

  const dailyFee = isNilReturn
    ? rule.parameters.nilReturnFeePerDayTotal
    : rule.parameters.feePerDayTotal

  const maxCap = isNilReturn
    ? rule.parameters.nilReturnMaximumCap
    : rule.parameters.maximumCapPerReturn

  const uncappedFee = dailyFee * daysDelayed
  const lateFeeComputed = Math.min(uncappedFee, maxCap)

  return {
    daysDelayed,
    isNilReturn,
    feePerDayTotal: dailyFee,
    maximumCap: maxCap,
    lateFeeComputed,
    ruleId: rule.id,
    ruleStatus: rule.status,
    sourceCitation: rule.sectionOrRule,
  }
}
