import fs from 'fs'
import path from 'path'
import { extractWithRules } from '@/services/extract/ruleBasedExtract'
import { evaluateEscalation } from '@/domain/escalation'
import { GroundingValidator } from '@/services/ai/groundingValidator'
import { getNoticeTypeDesc, getSuggestedDocuments } from '@/domain/noticeMetadata'
import { parseDateIST, formatDateIST, resolveNoticeDeadline } from '@/domain/dates'
import { checkTotalsConsistency } from '@/domain/totals'
import { KbChunk } from '@/schemas/kb'

interface SyntheticEvalItem {
  id: string
  title: string
  rawText: string
  goldLabels: {
    noticeType: string
    totalDemand: number
    shouldEscalateToCA: boolean
    sectionsCited: string[]
  }
}

function evaluateSingleNotice(item: SyntheticEvalItem, validator: GroundingValidator) {
  const ruleResult = extractWithRules(item.rawText)
  const rawDate = ruleResult.detectedDates[0] || null
  let noticeDateFormatted: string | null = null
  if (rawDate) {
    try {
      noticeDateFormatted = formatDateIST(parseDateIST(rawDate))
    } catch {
      noticeDateFormatted = null
    }
  }

  const taxDemand = ruleResult.detectedTaxAmount || 0
  const interestDemand = ruleResult.detectedInterestAmount || 0
  const penaltyDemand = ruleResult.detectedPenaltyAmount || 0
  const totalStatedDemand =
    ruleResult.detectedTotalAmount || taxDemand + interestDemand + penaltyDemand

  const deadline = resolveNoticeDeadline({
    noticeDate: rawDate,
    serviceDate: ruleResult.detectedServiceDate,
    replyDeadlineDate: ruleResult.detectedExplicitDeadline,
    replyDaysAllowed: ruleResult.replyDaysAllowed,
    isReceiptBased: ruleResult.isReceiptBased,
  })

  const notice = {
    noticeType: ruleResult.detectedNoticeType,
    noticeTypeDescription: getNoticeTypeDesc(ruleResult.detectedNoticeType),
    issuingAuthority: 'Proper Officer, Central GST',
    taxpayerGstin: ruleResult.detectedGstin,
    taxpayerTradeName: null,
    noticeReferenceNumber: ruleResult.detectedDinOrRef,
    noticeDate: noticeDateFormatted,
    taxPeriod: 'Specified Tax Period',
    sectionsCited: ruleResult.detectedSections,
    rulesCited: ruleResult.detectedRules,
    formsCited: ruleResult.detectedForms,
    taxDemand,
    interestDemand,
    penaltyDemand,
    otherDemand: 0,
    totalStatedDemand,
    replyDeadlineDate: deadline.formattedDate,
    replyDaysAllowed: ruleResult.replyDaysAllowed,
    documentsRequested: getSuggestedDocuments(ruleResult.detectedNoticeType),
    statedGrounds: ['Reconciliation difference'],
    allegationsOfFraudOrWilfulSuppression: ruleResult.hasFraudAllegations,
    extractionConfidence: 0.9,
  }

  const escalation = evaluateEscalation(notice)
  const grounding = validator.validateNoticeGrounding(notice)

  const isTypeMatch = notice.noticeType === item.goldLabels.noticeType
  const isDemandMatch = Math.abs(notice.totalStatedDemand - item.goldLabels.totalDemand) <= 10
  const isEscalationMatch = escalation.shouldEscalate === item.goldLabels.shouldEscalateToCA
  const foundInGold = item.goldLabels.sectionsCited.filter((s: string) =>
    notice.sectionsCited.includes(s)
  ).length

  return {
    id: item.id,
    title: item.title,
    isTypeMatch,
    isDemandMatch,
    isEscalationMatch,
    extractedDemand: notice.totalStatedDemand,
    goldDemand: item.goldLabels.totalDemand,
    groundingScore: grounding.groundingScore,
    foundInGold,
    goldSectionsCount: item.goldLabels.sectionsCited.length,
  }
}

describe('Automated Benchmark Evaluation Suite', () => {
  const datasetPath = path.join(process.cwd(), 'evals', 'dataset', 'synthetic-notices.json')
  const chunksPath = path.join(process.cwd(), 'data', 'kb', 'chunks.json')
  const outputDir = path.join(process.cwd(), 'evals', 'results')
  const outputPath = path.join(outputDir, 'baseline-eval.json')

  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'))
  const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8')) as KbChunk[]
  const validator = new GroundingValidator(chunks)

  it('evaluates all synthetic notices and verifies >= 80% accuracy across all criteria', () => {
    let typeCorrect = 0
    let totalDemandCorrect = 0
    let escalationCorrect = 0
    let totalSectionsGold = 0
    let totalSectionsFound = 0
    let totalGroundingScore = 0

    const results = []

    for (const item of dataset.notices) {
      const evalItem = evaluateSingleNotice(item, validator)
      if (evalItem.isTypeMatch) typeCorrect++
      if (evalItem.isDemandMatch) totalDemandCorrect++
      if (evalItem.isEscalationMatch) escalationCorrect++

      totalSectionsGold += evalItem.goldSectionsCount
      totalSectionsFound += evalItem.foundInGold
      totalGroundingScore += evalItem.groundingScore

      results.push(evalItem)
    }

    const n = dataset.notices.length
    const typeAccuracy = Math.round((typeCorrect / n) * 100)
    const demandAccuracy = Math.round((totalDemandCorrect / n) * 100)
    const escalationAccuracy = Math.round((escalationCorrect / n) * 100)
    const citationRecall =
      totalSectionsGold > 0 ? Math.round((totalSectionsFound / totalSectionsGold) * 100) : 100
    const avgGrounding = Math.round((totalGroundingScore / n) * 100)

    const summary = {
      timestamp: new Date().toISOString(),
      datasetVersion: dataset.schemaVersion,
      totalEvaluated: n,
      metrics: {
        noticeTypeAccuracyPct: typeAccuracy,
        totalDemandAccuracyPct: demandAccuracy,
        escalationDecisionAccuracyPct: escalationAccuracy,
        citationRecallPct: citationRecall,
        averageGroundingScorePct: avgGrounding,
      },
      detailedResults: results,
    }

    const shouldWrite = process.env.UPDATE_SNAPSHOTS === 'true' || !fs.existsSync(outputPath)
    if (shouldWrite) {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
      fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2))
    }

    expect(typeAccuracy).toBeGreaterThanOrEqual(80)
    expect(demandAccuracy).toBeGreaterThanOrEqual(80)
    expect(escalationAccuracy).toBeGreaterThanOrEqual(80)
    expect(citationRecall).toBeGreaterThanOrEqual(80)
  })

  describe('Integration Boundary & Uncertainty Scenarios', () => {
    it('handles notices with missing dates by preserving uncertain deadline state', () => {
      const rawText = `
        FORM GST ASMT-10
        Discrepancy notice under Section 61.
        Tax Demand: Rs 20,000
        Total: Rs 20,000
      `
      const ruleResult = extractWithRules(rawText)
      const res = resolveNoticeDeadline({
        noticeDate: ruleResult.detectedDates[0] || null,
        serviceDate: ruleResult.detectedServiceDate,
        replyDeadlineDate: ruleResult.detectedExplicitDeadline,
        replyDaysAllowed: ruleResult.replyDaysAllowed,
      })
      expect(res.status).toBe('uncertain')
      expect(res.formattedDate).toBeNull()
      expect(res.message).toBe('Check the deadline on your notice')
    })

    it('handles conflicting date strings gracefully without crashing', () => {
      const res = resolveNoticeDeadline({
        noticeDate: 'invalid-not-a-date',
        replyDaysAllowed: 30,
      })
      expect(res.status).toBe('uncertain')
      expect(res.deadlineDate).toBeNull()
    })

    it('identifies demand discrepancies when line items do not sum to stated total', () => {
      const totalsCheck = checkTotalsConsistency({
        taxDemand: 100000,
        interestDemand: 10000,
        penaltyDemand: 5000,
        statedTotal: 150000, // Discrepancy of 35000
      })
      expect(totalsCheck.isConsistent).toBe(false)
      expect(totalsCheck.hasDiscrepancy).toBe(true)
      expect(totalsCheck.discrepancyMessage).toContain('Total mismatch')
    })

    it('triggers CA escalation for demands crossing the ₹5,00,000 triage threshold', () => {
      const notice = {
        noticeType: 'ASMT_10_SCRUTINY' as const,
        noticeTypeDescription: 'Scrutiny of Returns',
        issuingAuthority: null,
        taxpayerGstin: '07TESTU9999R1Z9',
        taxpayerTradeName: null,
        noticeReferenceNumber: null,
        noticeDate: '2024-11-01',
        serviceDate: null,
        taxPeriod: null,
        sectionsCited: ['Section 61'],
        rulesCited: [],
        formsCited: ['ASMT-10'],
        taxDemand: 520000,
        interestDemand: 0,
        penaltyDemand: 0,
        otherDemand: 0,
        totalStatedDemand: 520000,
        replyDeadlineDate: null,
        replyDaysAllowed: 30,
        documentsRequested: [],
        statedGrounds: [],
        allegationsOfFraudOrWilfulSuppression: false,
        extractionConfidence: 0.95,
      }
      const escalation = evaluateEscalation(notice)
      expect(escalation.shouldEscalate).toBe(true)
      expect(escalation.reasons.some(r => r.includes('5,00,000'))).toBe(true)
    })
  })
})
