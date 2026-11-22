import { cleanAndParseJson } from './responseCleaner'
import { z } from 'zod'

describe('Response Cleaner and JSON Guard', () => {
  const TestSchema = z.object({
    id: z.string(),
    amount: z.number(),
    isValid: z.boolean(),
  })

  it('parses pristine JSON without markdown fences', () => {
    const raw = '{"id": "test-1", "amount": 500, "isValid": true}'
    const res = cleanAndParseJson(raw, TestSchema)
    expect(res.success).toBe(true)
    expect(res.data?.id).toBe('test-1')
    expect(res.data?.amount).toBe(500)
  })

  it('extracts JSON encased in markdown fences (```json ... ```)', () => {
    const raw = `
Here is the extracted information from the GST notice:
\`\`\`json
{
  "id": "asmt10-01",
  "amount": 48500,
  "isValid": true
}
\`\`\`
I hope this helps.
`
    const res = cleanAndParseJson(raw, TestSchema)
    expect(res.success).toBe(true)
    expect(res.data?.id).toBe('asmt10-01')
    expect(res.data?.amount).toBe(48500)
  })

  it('locates innermost JSON brackets if preamble exists without fences', () => {
    const raw = 'Notice details: {"id": "sec61", "amount": 12000, "isValid": false} End of record.'
    const res = cleanAndParseJson(raw, TestSchema)
    expect(res.success).toBe(true)
    expect(res.data?.id).toBe('sec61')
    expect(res.data?.isValid).toBe(false)
  })

  it('returns failure when JSON syntax is invalid', () => {
    const raw = '{"id": "broken", "amount": }'
    const res = cleanAndParseJson(raw, TestSchema)
    expect(res.success).toBe(false)
    expect(res.error).toContain('JSON parsing failed')
  })

  it('returns failure when schema validation fails', () => {
    const raw = '{"id": "test", "amount": "five hundred", "isValid": true}'
    const res = cleanAndParseJson(raw, TestSchema)
    expect(res.success).toBe(false)
    expect(res.error).toContain('Schema validation failed')
  })

  it('handles empty or non-string input safely', () => {
    const res = cleanAndParseJson('', TestSchema)
    expect(res.success).toBe(false)
    expect(res.error).toContain('Empty or non-string response')
  })
})
