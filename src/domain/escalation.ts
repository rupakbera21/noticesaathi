import { ExtractedNotice } from '../schemas/notice'

export interface EscalationOptions {
  demandThresholdInr?: number // Default ₹5,00,000 for small businesses
  minExtractionConfidence?: number // Default 0.70
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface EscalationResult {
  shouldEscalate: boolean
  riskLevel: RiskLevel
  reasons: string[]
  recommendedActions: string[]
}

function checkFraudTrigger(notice: ExtractedNotice): string | null {
  const isFraud =
    notice.allegationsOfFraudOrWilfulSuppression ||
    notice.noticeType === 'DRC_01_DEMAND_FRAUD' ||
    notice.sectionsCited.some(s => s.includes('74'))
  return isFraud
    ? 'Allegation of fraud, wilful misstatement, or suppression of facts under Section 74. Carries heavy penalties and requires professional legal defence.'
    : null
}

function checkSectionTriggers(notice: ExtractedNotice): { reason: string; risk: RiskLevel } | null {
  if (notice.sectionsCited.some(s => s.includes('67'))) {
    return {
      reason: 'Notice relates to inspection, search, or seizure proceedings under Section 67.',
      risk: 'CRITICAL',
    }
  }
  const isCancel =
    notice.noticeType === 'REG_17_REGISTRATION_CANCEL' ||
    notice.sectionsCited.some(s => s.includes('29'))
  if (isCancel) {
    return {
      reason: 'Threat of GST registration cancellation under Section 29. Can halt all business operations.',
      risk: 'HIGH',
    }
  }
  return null
}

function checkFinancialAndConfidenceTriggers(
  notice: ExtractedNotice,
  threshold: number,
  minConfidence: number
): string[] {
  const reasons: string[] = []
  const total = Math.max(notice.totalStatedDemand, notice.taxDemand)
  if (total >= threshold) {
    reasons.push(
      `Total demand (₹${total.toLocaleString('en-IN')}) exceeds the ₹${threshold.toLocaleString('en-IN')} small-business risk threshold.`
    )
  }
  if (notice.extractionConfidence < minConfidence) {
    reasons.push(
      `Notice extraction confidence (${Math.round(notice.extractionConfidence * 100)}%) is below standard safety threshold. Manual verification by a professional is advised.`
    )
  }
  return reasons
}

/**
 * Pure deterministic escalation engine.
 * Complexity <= 8.
 */
export function evaluateEscalation(
  notice: ExtractedNotice,
  options: EscalationOptions = {}
): EscalationResult {
  const { demandThresholdInr = 500000, minExtractionConfidence = 0.7 } = options
  const reasons: string[] = []
  let riskLevel: RiskLevel = 'LOW'

  const fraudReason = checkFraudTrigger(notice)
  if (fraudReason) {
    reasons.push(fraudReason)
    riskLevel = 'CRITICAL'
  }

  const sectionRes = checkSectionTriggers(notice)
  if (sectionRes) {
    reasons.push(sectionRes.reason)
    if (riskLevel !== 'CRITICAL') riskLevel = sectionRes.risk
  }

  const extraReasons = checkFinancialAndConfidenceTriggers(notice, demandThresholdInr, minExtractionConfidence)
  for (const r of extraReasons) {
    reasons.push(r)
    if (riskLevel === 'LOW') riskLevel = 'MEDIUM'
  }

  const shouldEscalate = reasons.length > 0
  const recommendedActions = shouldEscalate
    ? [
        'Export the one-page CA Summary package.',
        'Do not submit a reply without consulting a qualified Chartered Accountant.',
        'Collect all relevant tax invoices and GSTR-1/3B filings for the stated period.',
      ]
    : [
        'Review the draft reply and gather the listed supporting documents.',
        'File the reply via the official GST portal before the deadline.',
      ]

  return { shouldEscalate, riskLevel, reasons, recommendedActions }
}
