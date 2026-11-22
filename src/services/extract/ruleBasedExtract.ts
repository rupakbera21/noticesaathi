import { ExtractedNotice, NoticeType } from '../../schemas/notice'

export interface DiscrepancyFlag {
  field: string
  ruleValue: string | number | null
  modelValue: string | number | null
  message: string
}

export interface RuleBasedExtractionResult {
  detectedNoticeType: NoticeType
  detectedSections: string[]
  detectedRules: string[]
  detectedForms: string[]
  detectedGstin: string | null
  detectedDinOrRef: string | null
  detectedDates: string[]
  replyDaysAllowed: number | null
  detectedTaxAmount: number | null
  detectedInterestAmount: number | null
  detectedPenaltyAmount: number | null
  detectedTotalAmount: number | null
  hasFraudAllegations: boolean
}

// Regex patterns for GST notices
const GSTIN_REGEX = /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/i
const SECTION_REGEX = /\b(?:Section|Sec\.?)\s*(\d{1,3}(?:\([0-9a-zA-Z]+\))*)/gi
const RULE_REGEX = /\bRule\s*(\d{1,3}(?:\([0-9a-zA-Z]+\))*)/gi
const FORM_REGEX = /\b(?:FORM\s+)?(ASMT[- ]?10|DRC[- ]?01[A-Za-z]?|GSTR[- ]?3A|REG[- ]?17|RFD[- ]?08|GSTR[- ]?3B|GSTR[- ]?1|GSTR[- ]?9)\b/gi
const DIN_REGEX = /\b(?:DIN|Document Identification Number)[\s:-]*([0-9A-Z]{10,25})\b/i
const REPLY_DAYS_REGEX = /\b(?:within|period of)\s+(\d{1,2})\s+days\b/i

const TAX_AMOUNT_REGEX = /(?:Tax\s*(?:Demand|Due|Amount|Payable)?|Demand|CGST\s*\+\s*SGST)(?!\s*period)\s*[:=]?\s*₹?[\s]*(?:Rs\.?[\s]*)?([\d,]+(?:\.\d{2})?)/i
const INTEREST_AMOUNT_REGEX = /Interest(?:\s*(?:under\s+Sec(?:tion)?\s*\d{1,3}|Demand|Due|Amount))*\s*[:=]?\s*₹?[\s]*(?:Rs\.?[\s]*)?([\d,]+(?:\.\d{2})?)/i
const PENALTY_AMOUNT_REGEX = /Penalty(?:\s*(?:under\s+Sec(?:tion)?\s*\d{1,3}|Demand|Due|Amount))*\s*[:=]?\s*₹?[\s]*(?:Rs\.?[\s]*)?([\d,]+(?:\.\d{2})?)/i
const TOTAL_AMOUNT_REGEX = /(?:Total\s*(?:Stated\s*)?(?:Demand|Amount|Due|Payable)?|Grand\s*Total)\s*[:=]?\s*₹?[\s]*(?:Rs\.?[\s]*)?([\d,]+(?:\.\d{2})?)/i

const FRAUD_KEYWORDS = [
  'fraud',
  'wilful misstatement',
  'wilful mis-statement',
  'suppression of facts',
  'intent to evade',
]

function parseAmount(matchStr: string | undefined): number | null {
  if (!matchStr) return null
  const clean = matchStr.replace(/,/g, '').trim()
  const val = parseFloat(clean)
  return isNaN(val) ? null : val
}

function detectCitations(text: string): { sections: string[]; rules: string[]; forms: string[] } {
  const sections: string[] = []
  let sMatch: RegExpExecArray | null
  const sRegex = new RegExp(SECTION_REGEX)
  while ((sMatch = sRegex.exec(text)) !== null) {
    if (sMatch[1]) sections.push(`Section ${sMatch[1]}`)
  }

  const rules: string[] = []
  let rMatch: RegExpExecArray | null
  const rRegex = new RegExp(RULE_REGEX)
  while ((rMatch = rRegex.exec(text)) !== null) {
    if (rMatch[1]) rules.push(`Rule ${rMatch[1]}`)
  }

  const forms: string[] = []
  let fMatch: RegExpExecArray | null
  const fRegex = new RegExp(FORM_REGEX)
  while ((fMatch = fRegex.exec(text)) !== null) {
    if (fMatch[1]) {
      const normalizedForm = fMatch[1].replace(/\s+/g, '-').toUpperCase()
      if (!forms.includes(normalizedForm)) {
        forms.push(normalizedForm)
      }
    }
  }

  return {
    sections: Array.from(new Set(sections)),
    rules: Array.from(new Set(rules)),
    forms: Array.from(new Set(forms)),
  }
}

interface NoticePatternMatcher {
  type: NoticeType
  form?: string
  keyword?: string
  section?: string
}

const NOTICE_PATTERNS: NoticePatternMatcher[] = [
  { type: 'ASMT_10_SCRUTINY', form: 'ASMT-10', keyword: 'scrutiny of return', section: '61' },
  { type: 'GSTR_3A_NON_FILER', form: 'GSTR-3A', keyword: 'non-filer', section: '46' },
  { type: 'REG_17_REGISTRATION_CANCEL', form: 'REG-17', keyword: 'cancellation of registration', section: '29' },
  { type: 'RFD_08_REFUND_SCN', form: 'RFD-08', keyword: 'rejection of refund' },
]

function matchesPattern(p: NoticePatternMatcher, lower: string, forms: string[], sections: string[]): boolean {
  if (p.form && forms.includes(p.form)) return true
  if (p.keyword && lower.includes(p.keyword)) return true
  if (p.section) {
    const targetSection = p.section
    if (sections.some(s => s.includes(targetSection))) return true
  }
  return false
}

function detectNoticeType(
  lower: string,
  forms: string[],
  sections: string[]
): { noticeType: NoticeType; hasFraud: boolean } {
  const hasFraud = FRAUD_KEYWORDS.some(kw => lower.includes(kw)) || sections.some(s => s.includes('74'))

  for (const pattern of NOTICE_PATTERNS) {
    if (matchesPattern(pattern, lower, forms, sections)) {
      return { noticeType: pattern.type, hasFraud }
    }
  }

  if (forms.includes('DRC-01') || lower.includes('drc-01') || lower.includes('show cause notice') || lower.includes('demand')) {
    return { noticeType: hasFraud ? 'DRC_01_DEMAND_FRAUD' : 'DRC_01_DEMAND_NON_FRAUD', hasFraud }
  }

  return { noticeType: 'OTHER_GST_NOTICE', hasFraud }
}

function detectAmounts(text: string) {
  const taxMatch = text.match(TAX_AMOUNT_REGEX)
  const interestMatch = text.match(INTEREST_AMOUNT_REGEX)
  const penaltyMatch = text.match(PENALTY_AMOUNT_REGEX)
  const totalMatch = text.match(TOTAL_AMOUNT_REGEX)

  return {
    detectedTaxAmount: parseAmount(taxMatch?.[1]),
    detectedInterestAmount: parseAmount(interestMatch?.[1]),
    detectedPenaltyAmount: parseAmount(penaltyMatch?.[1]),
    detectedTotalAmount: parseAmount(totalMatch?.[1]),
  }
}

function detectIdentifiers(text: string) {
  const gstinMatch = text.match(GSTIN_REGEX)
  const dinMatch = text.match(DIN_REGEX)
  const daysMatch = text.match(REPLY_DAYS_REGEX)
  const detectedDates = Array.from(text.matchAll(/\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/g)).map(m => m[0])

  return {
    detectedGstin: gstinMatch ? gstinMatch[0].toUpperCase() : null,
    detectedDinOrRef: dinMatch && dinMatch[1] ? dinMatch[1] : null,
    replyDaysAllowed: daysMatch && daysMatch[1] ? parseInt(daysMatch[1], 10) : null,
    detectedDates,
  }
}

/**
 * Deterministic rule-based extractor for GST notices.
 * Operates purely via pattern matching without any LLM calls.
 */
export function extractWithRules(rawNoticeText: string): RuleBasedExtractionResult {
  const text = rawNoticeText || ''
  const lower = text.toLowerCase()

  const citations = detectCitations(text)
  const typeResult = detectNoticeType(lower, citations.forms, citations.sections)
  const amounts = detectAmounts(text)
  const identifiers = detectIdentifiers(text)

  return {
    detectedNoticeType: typeResult.noticeType,
    detectedSections: citations.sections,
    detectedRules: citations.rules,
    detectedForms: citations.forms,
    detectedGstin: identifiers.detectedGstin,
    detectedDinOrRef: identifiers.detectedDinOrRef,
    detectedDates: identifiers.detectedDates,
    replyDaysAllowed: identifiers.replyDaysAllowed,
    detectedTaxAmount: amounts.detectedTaxAmount,
    detectedInterestAmount: amounts.detectedInterestAmount,
    detectedPenaltyAmount: amounts.detectedPenaltyAmount,
    detectedTotalAmount: amounts.detectedTotalAmount,
    hasFraudAllegations: typeResult.hasFraud,
  }
}

/**
 * Cross-checks model extracted notice against deterministic rule extraction.
 * Any mismatch generates a discrepancy flag for the review screen.
 */
export function crossCheckExtractions(
  model: ExtractedNotice,
  rules: RuleBasedExtractionResult
): DiscrepancyFlag[] {
  const flags: DiscrepancyFlag[] = []

  if (rules.detectedNoticeType !== 'OTHER_GST_NOTICE' && model.noticeType !== rules.detectedNoticeType) {
    flags.push({
      field: 'noticeType',
      ruleValue: rules.detectedNoticeType,
      modelValue: model.noticeType,
      message: `Notice type discrepancy: Rule-based analysis detected ${rules.detectedNoticeType}, but AI identified ${model.noticeType}.`,
    })
  }

  if (rules.detectedGstin && model.taxpayerGstin && rules.detectedGstin !== model.taxpayerGstin.toUpperCase()) {
    flags.push({
      field: 'taxpayerGstin',
      ruleValue: rules.detectedGstin,
      modelValue: model.taxpayerGstin,
      message: `GSTIN mismatch: Rule extractor found ${rules.detectedGstin}, model extracted ${model.taxpayerGstin}.`,
    })
  }

  if (rules.replyDaysAllowed !== null && model.replyDaysAllowed !== null && rules.replyDaysAllowed !== model.replyDaysAllowed) {
    flags.push({
      field: 'replyDaysAllowed',
      ruleValue: rules.replyDaysAllowed,
      modelValue: model.replyDaysAllowed,
      message: `Reply days mismatch: Notice text mentions "${rules.replyDaysAllowed} days", model extracted ${model.replyDaysAllowed} days.`,
    })
  }

  if (rules.detectedTaxAmount !== null && model.taxDemand > 0 && Math.abs(rules.detectedTaxAmount - model.taxDemand) > 10) {
    flags.push({
      field: 'taxDemand',
      ruleValue: rules.detectedTaxAmount,
      modelValue: model.taxDemand,
      message: `Tax demand mismatch: Extracted ₹${model.taxDemand}, but pattern match found ₹${rules.detectedTaxAmount}.`,
    })
  }

  return flags
}
