import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { extractWithRules, RuleBasedExtractionResult } from '@/services/extract/ruleBasedExtract'
import { RetrievalEngine } from '@/services/retrieval/retrievalEngine'
import { evaluateEscalation } from '@/domain/escalation'
import { checkTotalsConsistency } from '@/domain/totals'
import { addDaysIST, parseDateIST, formatDateIST, getRemainingDaysIST } from '@/domain/dates'
import { calculateInterest } from '@/domain/interest'
import { ExtractedNotice, NoticeType } from '@/schemas/notice'
import { InterestRule } from '@/schemas/rule'
import { KbChunk } from '@/schemas/kb'
import chunksData from '../../../../data/kb/chunks.json'
import interestRuleData from '../../../../data/rules/interest-sec50.json'

const requestSchema = z.object({
  noticeText: z.string().min(20, 'Notice text is too short').max(25000, 'Notice text exceeds 25,000 characters'),
  language: z.enum(['en', 'hi', 'bn']).default('en'),
})

const retrievalEngine = new RetrievalEngine(chunksData as unknown as KbChunk[])
const interestRule = interestRuleData as unknown as InterestRule

function getNoticeTypeDesc(type: NoticeType, lang: string): string {
  if (lang === 'hi') {
    if (type === 'ASMT_10_SCRUTINY') return 'रिटर्न की जांच में विसंगति की सूचना (ASMT-10)'
    if (type === 'DRC_01_DEMAND_FRAUD') return 'मांग और कारण बताओ नोटिस - धारा 74 (धोखाधड़ी/गलत बयानी)'
    return 'जीएसटी नोटिस'
  }
  if (lang === 'bn') {
    if (type === 'ASMT_10_SCRUTINY') return 'রিটার্ন স্ক্রুটিনি সংক্রান্ত অসঙ্গতির নোটিশ (ASMT-10)'
    if (type === 'DRC_01_DEMAND_FRAUD') return 'ডিমান্ড ও কারণ দর্শানোর নোটিশ - ধারা ৭৪'
    return 'জিএসটি নোটিশ'
  }
  if (type === 'ASMT_10_SCRUTINY') return 'Scrutiny of Returns (ASMT-10)'
  if (type === 'DRC_01_DEMAND_FRAUD') return 'Demand Show Cause Notice (Section 74 - Fraud / Wilful Misstatement)'
  if (type === 'DRC_01_DEMAND_NON_FRAUD') return 'Demand Show Cause Notice (Section 73)'
  if (type === 'GSTR_3A_NON_FILER') return 'Notice to Return Defaulter (GSTR-3A)'
  if (type === 'REG_17_REGISTRATION_CANCEL') return 'Show Cause Notice for Registration Cancellation (REG-17)'
  return 'Official GST Notice'
}

function getSuggestedDocuments(type: NoticeType): string[] {
  if (type === 'ASMT_10_SCRUTINY') {
    return ['GSTR-2B ITC reconciliation sheet', 'Original supplier tax invoices', 'Bank payment proof of tax paid']
  }
  if (type === 'GSTR_3A_NON_FILER') {
    return ['Filed GSTR-3B return copy and ARN receipt', 'Challan payment receipt for tax liability']
  }
  return ['Copies of filed GST returns', 'Purchase and sales registers for the period']
}

function buildNoticeFacts(ruleExtracted: RuleBasedExtractionResult, language: string) {
  const rawDate = ruleExtracted.detectedDates[0] || '2024-11-20'
  const noticeDateObj = parseDateIST(rawDate)
  const replyDays = ruleExtracted.replyDaysAllowed || 30
  const deadlineObj = addDaysIST(noticeDateObj, replyDays)
  const deadlineIso = deadlineObj.toISOString().split('T')[0] ?? ''
  const remainingDays = getRemainingDaysIST(deadlineObj)

  const taxDemand = ruleExtracted.detectedTaxAmount || 0
  const interestDemand = ruleExtracted.detectedInterestAmount || 0
  const penaltyDemand = ruleExtracted.detectedPenaltyAmount || 0
  const statedTotal = ruleExtracted.detectedTotalAmount || (taxDemand + interestDemand + penaltyDemand)

  const notice: ExtractedNotice = {
    noticeType: ruleExtracted.detectedNoticeType,
    noticeTypeDescription: getNoticeTypeDesc(ruleExtracted.detectedNoticeType, language),
    issuingAuthority: 'Proper Officer, Central GST',
    taxpayerGstin: ruleExtracted.detectedGstin,
    taxpayerTradeName: null,
    noticeReferenceNumber: ruleExtracted.detectedDinOrRef,
    noticeDate: formatDateIST(noticeDateObj),
    taxPeriod: 'Specified Tax Period',
    sectionsCited: ruleExtracted.detectedSections,
    rulesCited: ruleExtracted.detectedRules,
    formsCited: ruleExtracted.detectedForms,
    taxDemand,
    interestDemand,
    penaltyDemand,
    otherDemand: 0,
    totalStatedDemand: statedTotal,
    replyDeadlineDate: deadlineIso,
    replyDaysAllowed: replyDays,
    documentsRequested: getSuggestedDocuments(ruleExtracted.detectedNoticeType),
    statedGrounds: ['Discrepancy identified in tax return / outward supply reconciliation'],
    allegationsOfFraudOrWilfulSuppression: ruleExtracted.hasFraudAllegations,
    extractionConfidence: 0.90,
  }

  return { notice, deadlineObj, remainingDays, taxDemand, interestDemand, penaltyDemand, statedTotal }
}

function generatePlainExplanation(
  notice: ExtractedNotice,
  citations: Array<{ identifier: string }>,
  lang: string
): string {
  const citedNames = citations.map(c => c.identifier).join(', ')
  if (lang === 'hi') {
    return `यह नोटिस ${notice.noticeTypeDescription} के अंतर्गत जारी किया गया है। विभाग ने कुल ₹${notice.totalStatedDemand.toLocaleString('en-IN')} की राशि का उल्लेख किया है। आधिकारिक प्रावधानों (${citedNames}) के अनुसार, आपको नियत समय के भीतर अपना स्पष्टीकरण प्रस्तुत करना चाहिए।`
  }
  if (lang === 'bn') {
    return `এই নোটিশটি ${notice.noticeTypeDescription}-এর অধীনে জারি করা হয়েছে। মোট দাবির পরিমাণ ₹${notice.totalStatedDemand.toLocaleString('en-IN')}। সরকারি নিয়মাবলী (${citedNames}) অনুযায়ী নির্দিষ্ট সময়ের মধ্যে উত্তর দেওয়া আবশ্যক।`
  }
  return `This notice is an official communication regarding ${notice.noticeTypeDescription}. The tax authority has stated a total demand of ₹${notice.totalStatedDemand.toLocaleString('en-IN')}. Under the applicable statutory provisions (${citedNames}), you are required to submit an explanation or payment within the allotted response window.`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 })
    }

    const { noticeText, language } = parsed.data
    const ruleExtracted = extractWithRules(noticeText)
    const facts = buildNoticeFacts(ruleExtracted, language)

    const escalation = evaluateEscalation(facts.notice)
    const totals = checkTotalsConsistency({
      taxDemand: facts.taxDemand,
      interestDemand: facts.interestDemand,
      penaltyDemand: facts.penaltyDemand,
      statedTotal: facts.statedTotal,
    })

    const interestCalc = facts.taxDemand > 0
      ? calculateInterest({ taxAmount: facts.taxDemand, daysDelayed: 30, rule: interestRule })
      : null

    const query = [...facts.notice.sectionsCited, ...facts.notice.formsCited, facts.notice.noticeTypeDescription].join(' ')
    const citations = retrievalEngine.search(query, 3).map(r => ({
      id: r.chunk.id,
      identifier: r.chunk.identifier,
      title: r.chunk.title,
      contentSnippet: r.chunk.content.slice(0, 180) + '...',
      sourceUrl: r.chunk.sourceUrl,
      authority: r.chunk.authority,
    }))

    const explanation = generatePlainExplanation(facts.notice, citations, language)

    return NextResponse.json({
      success: true,
      notice: facts.notice,
      deadline: {
        formattedDate: formatDateIST(facts.deadlineObj),
        remainingDays: facts.remainingDays,
        isExpired: facts.remainingDays < 0,
      },
      totals,
      interestCalc,
      escalation,
      citations,
      explanation,
    })
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to analyze notice', details }, { status: 500 })
  }
}
