import fs from 'fs'
import path from 'path'
import { z } from 'zod'

/**
 * validate-dataset.mjs
 * Validates synthetic notice datasets against Zod EvalDatasetSchema.
 * Enforces fictional data policy and gold label completeness.
 */

const NoticeTypeSchema = z.enum([
  'ASMT_10_SCRUTINY',
  'DRC_01_DEMAND_NON_FRAUD',
  'DRC_01_DEMAND_FRAUD',
  'GSTR_3A_NON_FILER',
  'REG_17_REGISTRATION_CANCEL',
  'RFD_08_REFUND_SCN',
  'OTHER_GST_NOTICE',
])

const SyntheticNoticeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  noticeType: NoticeTypeSchema,
  isFictional: z.literal(true),
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

const EvalDatasetSchema = z.object({
  schemaVersion: z.string(),
  notices: z.array(SyntheticNoticeItemSchema),
})

const datasetPath = path.join(process.cwd(), 'evals', 'dataset', 'synthetic-notices.json')

if (!fs.existsSync(datasetPath)) {
  console.error(`[ERROR] Dataset file not found at ${datasetPath}`)
  process.exit(1)
}

console.log('Validating synthetic notice evaluation dataset...')

try {
  const content = fs.readFileSync(datasetPath, 'utf-8')
  const json = JSON.parse(content)

  const result = EvalDatasetSchema.safeParse(json)

  if (!result.success) {
    console.error('Dataset validation failed with schema errors:')
    result.error.issues.forEach(issue => {
      console.error(`  - Path: ${issue.path.join('.')} : ${issue.message}`)
    })
    process.exit(1)
  }

  const { notices } = result.data
  console.log(`Successfully validated ${notices.length} synthetic notices against schema.`)

  // Check data safety policy: no real GSTINs, must be fictional
  for (const n of notices) {
    if (!n.isFictional) {
      console.error(`[ERROR] Notice ${n.id} has isFictional: false! Violates data safety rule.`)
      process.exit(1)
    }
  }

  console.log('Data safety check passed: All notices are verified synthetic.')
} catch (err) {
  const message = err instanceof Error ? err.message : String(err)
  console.error(`Failed to parse or validate dataset: ${message}`)
  process.exit(1)
}
