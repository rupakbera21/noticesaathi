import { ExtractedNotice } from '@/schemas/notice'

export const EXTRACTION_SYSTEM_PROMPT = `You are NoticeSaathi's expert Indian GST statutory notice extractor.
Extract all relevant facts from the provided official GST notice into strict JSON.

CRITICAL RULES:
1. All monetary values MUST be in Indian Rupees (₹). Strip out currency symbols and return pure non-negative numbers.
2. If tax demand is not broken down, set taxDemand to total and interest/penalty to 0.
3. Identify the exact Notice Type from:
   - ASMT_10_SCRUTINY (Section 61, Rule 99)
   - DRC_01_DEMAND_NON_FRAUD (Section 73)
   - DRC_01_DEMAND_FRAUD (Section 74 - fraud, wilful misstatement, suppression)
   - GSTR_3A_NON_FILER (Section 46, Rule 68)
   - REG_17_REGISTRATION_CANCEL (Section 29)
   - RFD_08_REFUND_SCN (Section 54)
   - OTHER_GST_NOTICE
4. Extract only citations explicitly present in the text (Sections, Rules, Forms).
5. Output ONLY valid JSON matching this structure:
{
  "noticeType": "ASMT_10_SCRUTINY",
  "noticeTypeDescription": "Brief description in English",
  "issuingAuthority": "e.g. Proper Officer, Ward 42, Delhi GST",
  "taxpayerGstin": "15-digit GSTIN or null",
  "taxpayerTradeName": "Business trade name or null",
  "noticeReferenceNumber": "DIN or Notice Ref Number",
  "noticeDate": "YYYY-MM-DD or as written",
  "taxPeriod": "e.g. April 2023 to March 2024",
  "sectionsCited": ["Section 61"],
  "rulesCited": ["Rule 99"],
  "formsCited": ["ASMT-10"],
  "taxDemand": 48500,
  "interestDemand": 4210,
  "penaltyDemand": 0,
  "otherDemand": 0,
  "totalStatedDemand": 52710,
  "replyDeadlineDate": "YYYY-MM-DD or null",
  "replyDaysAllowed": 30,
  "documentsRequested": ["Invoices", "Bank statement"],
  "statedGrounds": ["Discrepancy between GSTR-1 and GSTR-3B"],
  "allegationsOfFraudOrWilfulSuppression": false,
  "extractionConfidence": 0.95
}`

export function buildExplanationPrompt(
  notice: ExtractedNotice,
  citationsSummary: string,
  lang: 'en' | 'hi' | 'bn'
): string {
  const langInstructions = {
    en: 'Explain in simple, encouraging English for an Indian small business owner. Do not use intimidating legal jargon. Use the full word "Section", never the symbol "§".',
    hi: 'भारतीय छोटे व्यापारी के लिए सरल, स्पष्ट हिंदी में समझाएं। पूरे विवरण को हिंदी में समझाएं, बिना किसी अधूरे अंग्रेजी कानूनी पाठ के। धारा के लिए "धारा" या "Section" लिखें, कभी भी "§" चिह्न का उपयोग न करें।',
    bn: 'ভারতের সাধারণ ছোট ব্যবসায়ীদের জন্য সহজ ও বোধগম্য বাংলায় ব্যাখ্যা করুন। ধারার জন্য "ধারা" বা "Section" লিখুন, কখনোই "§" চিহ্ন ব্যবহার করবেন না।',
  }

  const deadlineContext = notice.replyDeadlineDate
    ? `Explicit reply deadline: ${notice.replyDeadlineDate}`
    : notice.serviceDate && notice.replyDaysAllowed
      ? `Reply deadline is derived from date of service (${notice.serviceDate}) plus ${notice.replyDaysAllowed} days.`
      : notice.isReceiptBased
        ? `Reply period is ${notice.replyDaysAllowed ?? 30} days from the date of receipt of the notice. The date of receipt is unrecorded on the notice. DO NOT calculate or state a fixed deadline based on the notice issue date (${notice.noticeDate}). State that the deadline runs from when the taxpayer received the notice and advise checking the actual date of receipt.`
        : `Reply deadline is uncertain. Advise taxpayer to verify the specific reply deadline directly on their notice.`

  return `Explain this GST notice to the taxpayer in 3 clear paragraphs:
1. What this notice is about and why the department issued it (in plain everyday language).
2. The exact amounts due (in ₹) and the statutory deadline to reply (${deadlineContext}).
3. Plain action items (documents to prepare and whether to consult a CA).

Language: ${langInstructions[lang]}
Formatting Rule: Write the word "Section" or "धारा" / "ধারা" — never use the "§" symbol. Translate all concepts into genuine plain language.
Statutory Deadline Rule: If the reply window is from receipt, do NOT convert it into a deadline from the notice issue date. Explain the uncertainty clearly.

Notice Summary:
- Type: ${notice.noticeTypeDescription} (${notice.noticeType})
- Total Demand: ₹${notice.totalStatedDemand.toLocaleString('en-IN')} (Tax: ₹${notice.taxDemand.toLocaleString('en-IN')})
- Reply Window: ${deadlineContext}
- Cited Provisions: ${[...notice.sectionsCited, ...notice.rulesCited].join(', ')}
- Official CBIC Authority References: ${citationsSummary}
- Fraud Allegations: ${notice.allegationsOfFraudOrWilfulSuppression ? 'YES' : 'NO'}
`
}

export function buildReplyDraftPrompt(
  notice: ExtractedNotice,
  citationsSummary: string,
  userNotes?: string
): string {
  return `Draft a formal, polite, legally sound reply to this GST notice for submission on the GST Portal.
Address to: ${notice.issuingAuthority ?? 'The Proper Officer, Goods and Services Tax'}.
Notice Ref: ${notice.noticeReferenceNumber ?? 'As cited in notice'}.
Taxpayer GSTIN: ${notice.taxpayerGstin ?? 'Registered Taxpayer'}.
Tax Period: ${notice.taxPeriod ?? 'Relevant Tax Period'}.

Official Context & Statutory Citations:
${citationsSummary}

Taxpayer Notes: ${userNotes ?? 'The taxpayer maintains all purchase records, valid tax invoices, and bank proof of tax payment.'}

Return JSON with this schema:
{
  "noticeReference": "${notice.noticeReferenceNumber ?? ''}",
  "taxpayerGstin": "${notice.taxpayerGstin ?? ''}",
  "taxpayerName": "${notice.taxpayerTradeName ?? ''}",
  "issuingAuthority": "${notice.issuingAuthority ?? ''}",
  "dateOfReply": "Current IST Date",
  "subject": "Formal Subject Line",
  "openingStatement": "Polite respectful acknowledgement",
  "factualSubmissions": ["Numbered factual points explaining compliance"],
  "statutoryGrounds": [{"provision": "e.g. Section 16(2) / Circular 183", "explanation": "Legal justification"}],
  "enclosedDocuments": ["Annexure 1: Invoice copies", "Annexure 2: GSTR-2B reconciliation"],
  "prayerOrReliefSought": "Respectful prayer requesting dropping of demand or personal hearing",
  "caEscalationWarning": ${notice.allegationsOfFraudOrWilfulSuppression || notice.totalStatedDemand > 500000 ? '"Recommended to be reviewed by a Chartered Accountant due to substantial value/allegations."' : 'null'},
  "fullReplyText": "Complete ready-to-print or paste reply letter"
}`
}
