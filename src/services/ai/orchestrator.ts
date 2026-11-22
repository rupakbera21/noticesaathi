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

const PLAIN_SECTION_MAP: Record<string, { hi: string; bn: string; en: string }> = {
  'Section 74': {
    hi: 'धारा 74 (धोखाधड़ी/गलत बयानी): विभाग का आरोप है कि कर का भुगतान जानबूझकर छुपाया गया है। इसमें तुरंत सीए से परामर्श लेना अनिवार्य है।',
    bn: 'ধারা 74 (প্রতারণা/তথ্য গোপন): বিভাগ অভিযোগ করেছে যে করের তথ্য গোপন করা হয়েছে। একজন যোগ্য সিএ-র পরামর্শ নেওয়া আবশ্যক।',
    en: 'Section 74 (Fraud/Wilful Suppression): Allegations that tax was suppressed. Mandatory CA consultation required.',
  },
  'Section 73': {
    hi: 'धारा 73 (सामान्य कर विसंगति): बिना किसी धोखाधड़ी के सामान्य कर अंतर या देरी।',
    bn: 'ধারা 73 (সাধারণ অসংগতি): কোনো প্রতারণা ছাড়া সাধারণ করের হিসাবজনিত অমিল।',
    en: 'Section 73 (General Discrepancy): Standard determination of tax discrepancy without allegations of fraud.',
  },
  'Section 50': {
    hi: 'धारा 50 (ब्याज): कर भुगतान में देरी पर 18% वार्षिक की दर से लगने वाला साधारण कानूनी ब्याज।',
    bn: 'ধারা 50 (সুদ): বকেয়া কর পরিশোধে বিলম্বের কারণে ১৮% হারে সাধারণ আইনানুগ সুদ।',
    en: 'Section 50 (Interest): Statutory simple interest on delayed tax payment (18% standard).',
  },
  'Section 61': {
    hi: 'धारा 61 (स्क्रूटिनी): दाखिल किए गए रिटर्न (GSTR-3B बनाम GSTR-2B) की विभागीय जांच व मिलान।',
    bn: 'ধারা 61 (রিটার্ন স্ক্রুটিনি): দাখিল করা রিটার্নের বিভাগীয় পরীক্ষা ও আইটিসি যাচাই।',
    en: 'Section 61 (Scrutiny): Departmental verification and discrepancy check of filed returns.',
  },
  'Section 46': {
    hi: 'धारा 46 (रिटर्न डिफ़ॉल्ट): नियत समय पर मासिक या त्रैमासिक रिटर्न दाखिल न करने पर चेतावनी।',
    bn: 'ধারা 46 (রিটার্ন ডিফল্ট): নির্দিষ্ট সময়ে রিটার্ন দাখিল না করার কারণে সতর্কবার্তা।',
    en: 'Section 46 (Return Default): Formal statutory notice to furnish overdue periodic returns.',
  },
  'Section 47': {
    hi: 'धारा 47 (विलंब शुल्क): समय पर रिटर्न न भरने पर प्रतिदिन के हिसाब से लगने वाली लेट फीस।',
    bn: 'ধারা 47 (লেট ফি): সময়মতো রিটার্ন জমা না দেওয়ার কারণে দৈনিক নির্ধারিত লেট ফি।',
    en: 'Section 47 (Late Fees): Statutory daily capped late fees for overdue returns.',
  },
  'Section 16': {
    hi: 'धारा 16 (आईटीसी पात्रता): खरीदारी पर इनपुट टैक्स क्रेडिट का दावा करने की कानूनी शर्तें व बिल।',
    bn: 'ধারা 16 (আইটিসি যোগ্যতা): কেনাকাটার ওপর ইনপুট ট্যাক্স ক্রেডিট পাওয়ার আইনগত শর্তাবলী।',
    en: 'Section 16 (ITC Eligibility): Statutory criteria and invoice evidence required to claim Input Tax Credit.',
  },
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
    const amount = `₹${notice.totalStatedDemand.toLocaleString('en-IN')}`
    const plainCitations = notice.sectionsCited
      .map(s => PLAIN_SECTION_MAP[s]?.[language] || `${s}`)
      .join('\n• ')

    if (language === 'hi') {
      return `यह नोटिस ${getNoticeTypeDesc(notice.noticeType, 'hi')} के संबंध में जारी किया गया है। विभाग ने कुल ${amount} की मांग की है। आधिकारिक प्रावधानों के अनुसार कृपया नियत समय सीमा में अपना विधिवत उत्तर प्रस्तुत करें।\n\nसमीक्षा एवं कानूनी प्रावधान:\n• ${plainCitations || citationsSummary}`
    }
    if (language === 'bn') {
      return `এই নোটিশটি ${getNoticeTypeDesc(notice.noticeType, 'bn')} সংক্রান্ত। মোট দাবিকৃত অর্থ ${amount}। সরকারি নিয়মাবলী মেনে নির্দিষ্ট সময়সীমার মধ্যে যথাযথ জবাব দাখিল করুন।\n\nআইনগত বিধান ও পর্যালোচনা:\n• ${plainCitations || citationsSummary}`
    }
    return `This notice relates to ${notice.noticeTypeDescription}. Total demand stated is ${amount}. In accordance with statutory requirements, a formal submission should be tendered within the allowed reply window.\n\nStatutory Context & Review:\n• ${plainCitations || citationsSummary}`
  }
}
