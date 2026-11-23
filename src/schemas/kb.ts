import { z } from 'zod'

export const KbChunkSchema = z.object({
  id: z.string(), // e.g. "cgst-act-sec-61"
  actOrRules: z.enum([
    'CGST_ACT_2017',
    'CGST_RULES_2017',
    'CIRCULAR',
    'NOTIFICATION',
    'OFFICIAL_FAQ',
  ]),
  identifier: z.string(), // e.g. "Section 61", "Rule 99", "Circular 183/15/2022-GST"
  normalizedId: z.string(), // e.g. "sec-61", "rule-99"
  title: z.string(),
  content: z.string(),
  effectiveDate: z.string(), // ISO YYYY-MM-DD
  sourceUrl: z.string().url(),
  authority: z.string(), // e.g. "CBIC / Ministry of Finance, Govt of India"
  fetchedAt: z.string(), // ISO timestamp
  checksum: z.string(), // SHA-256
})

export type KbChunk = z.infer<typeof KbChunkSchema>

export const KbManifestSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  totalChunks: z.number().int().nonnegative(),
  sourcesCount: z.number().int().nonnegative(),
  chunks: z.array(
    z.object({
      id: z.string(),
      identifier: z.string(),
      checksum: z.string(),
      charCount: z.number().int().positive(),
    })
  ),
})

export type KbManifest = z.infer<typeof KbManifestSchema>
