import { z } from 'zod'

export const RuleStatusSchema = z.enum(['draft', 'verified'])
export type RuleStatus = z.infer<typeof RuleStatusSchema>

export const BaseRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  sectionOrRule: z.string(),
  description: z.string(),
  sourceUrl: z.string().url(),
  effectiveFrom: z.string(), // ISO YYYY-MM-DD
  effectiveTo: z.string().nullable().default(null),
  status: RuleStatusSchema.default('draft'),
  verifiedBy: z.string().nullable().default(null),
  verifiedOn: z.string().nullable().default(null),
  parameters: z.record(z.string(), z.any()),
})

export type BaseRule = z.infer<typeof BaseRuleSchema>

export const InterestRuleSchema = BaseRuleSchema.extend({
  parameters: z.object({
    ratePerAnnumPercent: z.number().positive(),
    calculationBasis: z.enum(['NET_CASH_LIABILITY', 'GROSS_LIABILITY']),
    undueItcRatePercent: z.number().positive().optional(),
  }),
})

export type InterestRule = z.infer<typeof InterestRuleSchema>

export const LateFeeRuleSchema = BaseRuleSchema.extend({
  parameters: z.object({
    feePerDayCgst: z.number().nonnegative(),
    feePerDaySgst: z.number().nonnegative(),
    feePerDayTotal: z.number().nonnegative(),
    nilReturnFeePerDayTotal: z.number().nonnegative(),
    maximumCapPerReturn: z.number().positive(),
    nilReturnMaximumCap: z.number().positive(),
  }),
})

export type LateFeeRule = z.infer<typeof LateFeeRuleSchema>
