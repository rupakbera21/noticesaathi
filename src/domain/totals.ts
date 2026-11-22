export interface TotalsBreakdown {
  taxDemand: number
  interestDemand: number
  penaltyDemand: number
  otherDemand?: number
  statedTotal: number
}

export interface TotalsConsistencyResult {
  computedTotal: number
  statedTotal: number
  difference: number
  isConsistent: boolean
  hasDiscrepancy: boolean
  discrepancyMessage: string | null
}

/**
 * Checks consistency between individual demand items and stated total amount.
 * Pure function. Uses ₹1 tolerance for minor rounding differences.
 */
export function checkTotalsConsistency(breakdown: TotalsBreakdown): TotalsConsistencyResult {
  const {
    taxDemand = 0,
    interestDemand = 0,
    penaltyDemand = 0,
    otherDemand = 0,
    statedTotal = 0,
  } = breakdown

  const computedTotal = Math.round((taxDemand + interestDemand + penaltyDemand + otherDemand) * 100) / 100
  const normalizedStated = Math.round(statedTotal * 100) / 100
  const difference = Math.round(Math.abs(computedTotal - normalizedStated) * 100) / 100

  // Discrepancy if difference is greater than ₹1
  const isConsistent = difference <= 1.0

  const discrepancyMessage = isConsistent
    ? null
    : `Total mismatch: Sum of tax (₹${taxDemand}) + interest (₹${interestDemand}) + penalty (₹${penaltyDemand}) = ₹${computedTotal}, but notice states ₹${statedTotal}.`

  return {
    computedTotal,
    statedTotal: normalizedStated,
    difference,
    isConsistent,
    hasDiscrepancy: !isConsistent,
    discrepancyMessage,
  }
}
