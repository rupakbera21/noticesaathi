import { ZodSchema, ZodError } from 'zod'

export interface CleanJsonResult<T> {
  success: boolean
  data?: T
  rawText: string
  cleanedText: string
  error?: string
}

/**
 * Extracts and cleans JSON strings from LLM text responses:
 * - Removes markdown code fences (\`\`\`json ... \`\`\`)
 * - Trims preamble or closing commentary
 * - Validates schema against a Zod schema
 */
export function cleanAndParseJson<T>(rawText: string, schema: ZodSchema<T>): CleanJsonResult<T> {
  if (!rawText || typeof rawText !== 'string') {
    return {
      success: false,
      rawText: rawText ?? '',
      cleanedText: '',
      error: 'Empty or non-string response received from model',
    }
  }

  // 1. Strip markdown fences
  let cleaned = rawText.trim()
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i
  const match = fenceRegex.exec(cleaned)
  if (match && match[1]) {
    cleaned = match[1].trim()
  }

  // 2. Locate innermost or first JSON object/array
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
  }

  // 3. Parse JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch (jsonErr) {
    const msg = jsonErr instanceof Error ? jsonErr.message : String(jsonErr)
    return {
      success: false,
      rawText,
      cleanedText: cleaned,
      error: `JSON parsing failed: ${msg}`,
    }
  }

  // 4. Validate with Zod
  const validation = schema.safeParse(parsed)
  if (!validation.success) {
    const errorDetails = formatZodIssues(validation.error)
    return {
      success: false,
      rawText,
      cleanedText: cleaned,
      error: `Schema validation failed: ${errorDetails}`,
    }
  }

  return {
    success: true,
    data: validation.data,
    rawText,
    cleanedText: cleaned,
  }
}

function formatZodIssues(err: ZodError): string {
  return err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
}
