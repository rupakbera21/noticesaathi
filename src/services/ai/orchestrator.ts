import { ExtractedNotice } from '@/schemas/notice'
import { KbChunk } from '@/schemas/kb'
import { ModelProviderName } from './types'
import { GeminiProvider } from './geminiProvider'
import { GroqProvider } from './groqProvider'
import { CircuitBreaker } from './circuitBreaker'
import { GroundingValidator, GroundingValidationResult } from './groundingValidator'
import { extractWithRules, crossCheckExtractions, DiscrepancyFlag } from '@/services/extract/ruleBasedExtract'
import { formatDateIST, parseDateIST, addDaysIST } from '@/domain/dates'
import { getNoticeTypeDesc, getSuggestedDocuments } from '@/domain/noticeMetadata'

export interface OrchestrationResult {
  notice: ExtractedNotice
  providerUsed: ModelProviderName
  modelName: string
  latencyMs: number
  discrepancyFlags: DiscrepancyFlag[]
  grounding: GroundingValidationResult
}

export class AiOrchestrator {
  private gemini?: GeminiProvider
  private groq?: GroqProvider
  private geminiBreaker = new CircuitBreaker()
  private groqBreaker = new CircuitBreaker()
  private groundingValidator: GroundingValidator

  constructor(options: {
    geminiApiKey?: string
    groqApiKey?: string
    kbChunks: KbChunk[]
  }) {
    if (options.geminiApiKey) {
      this.gemini = new GeminiProvider(options.geminiApiKey)
    }
    if (options.groqApiKey) {
      this.groq = new GroqProvider(options.groqApiKey)
    }
    this.groundingValidator = new GroundingValidator(options.kbChunks)
  }

  public async extractNoticeFacts(noticeText: string): Promise<OrchestrationResult> {
    const startTime = Date.now()
    const ruleExtracted = extractWithRules(noticeText)

    // 1. Try Gemini
    if (this.gemini && this.geminiBreaker.isAvailable()) {
      try {
        const notice = await this.gemini.extractNotice(noticeText)
        this.geminiBreaker.recordSuccess()
        return this.buildResult(notice, 'GEMINI', this.gemini.modelId, startTime, ruleExtracted)
      } catch {
        this.geminiBreaker.recordFailure()
      }
    }

    // 2. Try Groq
    if (this.groq && this.groqBreaker.isAvailable()) {
      try {
        const notice = await this.groq.extractNotice(noticeText)
        this.groqBreaker.recordSuccess()
        return this.buildResult(notice, 'GROQ', this.groq.modelId, startTime, ruleExtracted)
      } catch {
        this.groqBreaker.recordFailure()
      }
    }

    // 3. Deterministic rule-based fallback
    const fallbackNotice = this.convertRuleToExtractedNotice(ruleExtracted)
    return this.buildResult(fallbackNotice, 'RULE_BASED_FALLBACK', 'deterministic-v1', startTime, ruleExtracted)
  }

  private convertRuleToExtractedNotice(r: ReturnType<typeof extractWithRules>): ExtractedNotice {
    const rawDate = r.detectedDates[0] || '2024-11-20'
    const noticeDateObj = parseDateIST(rawDate)
    const replyDays = r.replyDaysAllowed || 30
    const deadlineObj = addDaysIST(noticeDateObj, replyDays)
    const deadlineIso = deadlineObj.toISOString().split('T')[0] ?? ''

    const taxDemand = r.detectedTaxAmount || 0
    const interestDemand = r.detectedInterestAmount || 0
    const penaltyDemand = r.detectedPenaltyAmount || 0
    const totalStatedDemand = r.detectedTotalAmount || (taxDemand + interestDemand + penaltyDemand)

    return {
      noticeType: r.detectedNoticeType,
      noticeTypeDescription: getNoticeTypeDesc(r.detectedNoticeType),
      issuingAuthority: 'Proper Officer, Central GST',
      taxpayerGstin: r.detectedGstin,
      taxpayerTradeName: null,
      noticeReferenceNumber: r.detectedDinOrRef,
      noticeDate: formatDateIST(noticeDateObj),
      taxPeriod: 'Specified Tax Period',
      sectionsCited: r.detectedSections,
      rulesCited: r.detectedRules,
      formsCited: r.detectedForms,
      taxDemand,
      interestDemand,
      penaltyDemand,
      otherDemand: 0,
      totalStatedDemand,
      replyDeadlineDate: deadlineIso,
      replyDaysAllowed: replyDays,
      documentsRequested: getSuggestedDocuments(r.detectedNoticeType),
      statedGrounds: ['Identified discrepancy in outward/inward supplies'],
      allegationsOfFraudOrWilfulSuppression: r.hasFraudAllegations,
      extractionConfidence: 0.85,
    }
  }

  private buildResult(
    notice: ExtractedNotice,
    providerUsed: ModelProviderName,
    modelName: string,
    startTime: number,
    ruleResult: ReturnType<typeof extractWithRules>
  ): OrchestrationResult {
    const discrepancyFlags = crossCheckExtractions(notice, ruleResult)
    const grounding = this.groundingValidator.validateNoticeGrounding(notice)

    return {
      notice,
      providerUsed,
      modelName,
      latencyMs: Date.now() - startTime,
      discrepancyFlags,
      grounding,
    }
  }

  public async generateExplanation(
    notice: ExtractedNotice,
    citationsSummary: string,
    language: 'en' | 'hi' | 'bn'
  ): Promise<string> {
    if (this.gemini && this.geminiBreaker.isAvailable()) {
      try {
        const res = await this.gemini.generateExplanation(notice, citationsSummary, language)
        this.geminiBreaker.recordSuccess()
        return res
      } catch {
        this.geminiBreaker.recordFailure()
      }
    }

    if (this.groq && this.groqBreaker.isAvailable()) {
      try {
        const res = await this.groq.generateExplanation(notice, citationsSummary, language)
        this.groqBreaker.recordSuccess()
        return res
      } catch {
        this.groqBreaker.recordFailure()
      }
    }

    return this.buildFallbackExplanation(notice, citationsSummary, language)
  }

  private buildFallbackExplanation(
    notice: ExtractedNotice,
    citationsSummary: string,
    language: 'en' | 'hi' | 'bn'
  ): string {
    const cited = notice.sectionsCited.join(', ') || 'applicable provisions'
    const amount = `₹${notice.totalStatedDemand.toLocaleString('en-IN')}`

    if (language === 'hi') {
      return `यह नोटिस ${getNoticeTypeDesc(notice.noticeType, 'hi')} के संबंध में जारी किया गया है। विभाग ने कुल ${amount} की मांग की है। आधिकारिक प्रावधानों (${cited}) के अनुसार कृपया नियत समय सीमा में अपना उत्तर दें।\n\nसमीक्षा: ${citationsSummary}`
    }
    if (language === 'bn') {
      return `এই নোটিশটি ${getNoticeTypeDesc(notice.noticeType, 'bn')} সংক্রান্ত। মোট দাবি ${amount}। সরকারি ধারা (${cited}) মেনে নির্দিষ্ট সময়ের মধ্যে উত্তর দিন।\n\nসংশ্লিষ্ট তথ্য: ${citationsSummary}`
    }
    return `This notice relates to ${notice.noticeTypeDescription}. Total demand stated is ${amount}. In accordance with statutory requirements (${cited}), a formal submission should be tendered within the allowed reply window.\n\nStatutory Context: ${citationsSummary}`
  }
}
