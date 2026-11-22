import { z } from 'zod'

export const NoticeTypeSchema = z.enum([
  'ASMT_10_SCRUTINY',             // Scrutiny of Returns (Section 61, Rule 99)
  'DRC_01_DEMAND_NON_FRAUD',      // SCN for demand (Section 73)
  'DRC_01_DEMAND_FRAUD',          // SCN for demand - fraud/wilful misstatement (Section 74)
  'GSTR_3A_NON_FILER',            // Notice to return defaulters (Section 46, Rule 68)
  'REG_17_REGISTRATION_CANCEL',   // Show cause notice for cancellation of registration (Section 29)
  'RFD_08_REFUND_SCN',            // Show cause notice for rejection of refund claim (Section 54)
  'OTHER_GST_NOTICE',             // Other official GST communications
])

export type NoticeType = z.infer<typeof NoticeTypeSchema>

export const ExtractedNoticeSchema = z.object({
  noticeType: NoticeTypeSchema,
  noticeTypeDescription: z.string(),
  issuingAuthority: z.string().nullable().default(null),
  taxpayerGstin: z.string().nullable().default(null),
  taxpayerTradeName: z.string().nullable().default(null),
  noticeReferenceNumber: z.string().nullable().default(null),
  noticeDate: z.string().nullable().default(null),       // ISO YYYY-MM-DD or raw
  taxPeriod: z.string().nullable().default(null),        // e.g. "April 2024 to June 2024"
  sectionsCited: z.array(z.string()).default([]),        // e.g. ["Section 61", "Section 50"]
  rulesCited: z.array(z.string()).default([]),           // e.g. ["Rule 99"]
  formsCited: z.array(z.string()).default([]),           // e.g. ["ASMT-10", "GSTR-3B"]
  
  // Financial amounts in INR
  taxDemand: z.number().nonnegative().default(0),
  interestDemand: z.number().nonnegative().default(0),
  penaltyDemand: z.number().nonnegative().default(0),
  otherDemand: z.number().nonnegative().default(0),
  totalStatedDemand: z.number().nonnegative().default(0),

  // Deadline information
  replyDeadlineDate: z.string().nullable().default(null),// ISO YYYY-MM-DD
  replyDaysAllowed: z.number().int().positive().nullable().default(null),

  // Requirements & Allegations
  documentsRequested: z.array(z.string()).default([]),
  statedGrounds: z.array(z.string()).default([]),
  allegationsOfFraudOrWilfulSuppression: z.boolean().default(false),
  extractionConfidence: z.number().min(0).max(1).default(1.0),
  rawNoticeSnippet: z.string().max(20000).optional(),
})

export type ExtractedNotice = z.infer<typeof ExtractedNoticeSchema>

export const StatutoryGroundSchema = z.object({
  provision: z.string(),
  explanation: z.string(),
})

export const DraftReplySchema = z.object({
  noticeReference: z.string().nullable(),
  taxpayerGstin: z.string().nullable(),
  taxpayerName: z.string().nullable(),
  issuingAuthority: z.string().nullable(),
  dateOfReply: z.string(),
  subject: z.string(),
  openingStatement: z.string(),
  factualSubmissions: z.array(z.string()),
  statutoryGrounds: z.array(StatutoryGroundSchema),
  enclosedDocuments: z.array(z.string()),
  prayerOrReliefSought: z.string(),
  caEscalationWarning: z.string().nullable(),
  fullReplyText: z.string(),
})

export type DraftReply = z.infer<typeof DraftReplySchema>
