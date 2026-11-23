import { z } from 'zod'
import { NoticeTypeSchema } from './notice'

export const SyntheticNoticeItemSchema = z.object({
  id: z.string(), // e.g. "syn-asmt10-001"
  title: z.string(),
  noticeType: NoticeTypeSchema,
  isFictional: z.literal(true), // MUST be true
  rawText: z.string().min(50),
  goldLabels: z.object({
    noticeType: NoticeTypeSchema,
    issuingAuthority: z.string(),
    sectionsCited: z.array(z.string()),
    taxPeriod: z.string(),
    taxDemand: z.number().nonnegative(),
    interestDemand: z.number().nonnegative(),
    penaltyDemand: z.number().nonnegative(),
    totalDemand: z.number().nonnegative(),
    replyDaysAllowed: z.number().int().positive().nullable(),
    documentsRequested: z.array(z.string()),
    shouldEscalateToCA: z.boolean(),
    escalationReasons: z.array(z.string()),
  }),
})

export type SyntheticNoticeItem = z.infer<typeof SyntheticNoticeItemSchema>

export const EvalDatasetSchema = z.object({
  schemaVersion: z.string(),
  notices: z.array(SyntheticNoticeItemSchema),
})

export type EvalDataset = z.infer<typeof EvalDatasetSchema>
