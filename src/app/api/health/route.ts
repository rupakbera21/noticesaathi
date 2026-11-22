import { NextResponse } from 'next/server'
import { z } from 'zod'

/** Health check response schema */
const healthSchema = z.object({
  ok: z.boolean(),
  timestamp: z.string(),
  providers: z.object({
    gemini: z.boolean(),
    groq: z.boolean(),
    upstash: z.boolean(),
  }),
})

export type HealthResponse = z.infer<typeof healthSchema>

/** GET /api/health
 * Returns connectivity booleans only — never echoes key values.
 * Rate limiting is applied in middleware for the full /api/* prefix.
 */
export async function GET(): Promise<NextResponse<HealthResponse>> {
  const raw = {
    ok: true,
    timestamp: new Date().toISOString(),
    providers: {
      gemini: Boolean(process.env['GEMINI_API_KEY']),
      groq: Boolean(process.env['GROQ_API_KEY']),
      upstash: Boolean(
        process.env['UPSTASH_REDIS_REST_URL'] &&
        process.env['UPSTASH_REDIS_REST_TOKEN']
      ),
    },
  }

  const response = healthSchema.parse(raw)

  return NextResponse.json(response, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  })
}
