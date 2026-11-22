import fs from 'fs'
import path from 'path'
import { extractWithRules } from '@/services/extract/ruleBasedExtract'
import { evaluateEscalation } from '@/domain/escalation'
import { GroundingValidator } from '@/services/ai/groundingValidator'
import { getNoticeTypeDesc, getSuggestedDocuments } from '@/domain/noticeMetadata'
import { addDaysIST, parseDateIST, formatDateIST } from '@/domain/dates'
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
  const rawDate = ruleResult.detectedDates[0] || '2024-11-20'
  const noticeDateObj = parseDateIST(rawDate)
  const replyDays = ruleResult.replyDaysAllowed || 30
  const deadlineObj = addDaysIST(noticeDateObj, replyDays)

  const taxDemand = ruleResult.detectedTaxAmount || 0
  const interestDemand = ruleResult.detectedInterestAmount || 0
  const penaltyDemand = ruleResult.detectedPenaltyAmount || 0
  const totalStatedDemand = ruleResult.detectedTotalAmount || (taxDemand + interestDemand + penaltyDemand)

  const notice = {
    noticeType: ruleResult.detectedNoticeType,
    noticeTypeDescription: getNoticeTypeDesc(ruleResult.detectedNoticeType),
    issuingAuthority: 'Proper Officer, Central GST',
    taxpayerGstin: ruleResult.detectedGstin,
    taxpayerTradeName: null,
    noticeReferenceNumber: ruleResult.detectedDinOrRef,
    noticeDate: formatDateIST(noticeDateObj),
    taxPeriod: 'Specified Tax Period',
    sectionsCited: ruleResult.detectedSections,
    rulesCited: ruleResult.detectedRules,
    formsCited: ruleResult.detectedForms,
    taxDemand,
    interestDemand,
    penaltyDemand,
    otherDemand: 0,
    totalStatedDemand,
    replyDeadlineDate: deadlineObj.toISOString().split('T')[0] ?? '',
    replyDaysAllowed: replyDays,
    documentsRequested: getSuggestedDocuments(ruleResult.detectedNoticeType),
    statedGrounds: ['Reconciliation difference'],
    allegationsOfFraudOrWilfulSuppression: ruleResult.hasFraudAllegations,
    extractionConfidence: 0.90,
  }

  const escalation = evaluateEscalation(notice)
  const grounding = validator.validateNoticeGrounding(notice)

  const isTypeMatch = notice.noticeType === item.goldLabels.noticeType
  const isDemandMatch = Math.abs(notice.totalStatedDemand - item.goldLabels.totalDemand) <= 10
  const isEscalationMatch = escalation.shouldEscalate === item.goldLabels.shouldEscalateToCA
  const foundInGold = item.goldLabels.sectionsCited.filter((s: string) => notice.sectionsCited.includes(s)).length

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
    const citationRecall = totalSectionsGold > 0 ? Math.round((totalSectionsFound / totalSectionsGold) * 100) : 100
    const avgGrounding = Math.round((totalGroundingScore / n) * 100)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

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

    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2))

    expect(typeAccuracy).toBeGreaterThanOrEqual(80)
    expect(demandAccuracy).toBeGreaterThanOrEqual(80)
    expect(escalationAccuracy).toBeGreaterThanOrEqual(80)
    expect(citationRecall).toBeGreaterThanOrEqual(80)
  })
})
