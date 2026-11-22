import { z } from 'zod'

/**
 * Server-side environment validation.
 * Call `getEnv()` from server components and route handlers only.
 * Never import this in client-side code.
 */
const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required'),
  OLOSTEP_API_KEY: z.string().min(1, 'OLOSTEP_API_KEY is required'),
  UPSTASH_REDIS_REST_URL: z.string().url('UPSTASH_REDIS_REST_URL must be a URL'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),
  GEMINI_MODEL: z.string().optional(),
  GROQ_MODEL: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type Env = z.infer<typeof envSchema>

let _env: Env | null = null

/** Resets cached env in test environments */
export function _resetEnvForTesting(): void {
  _env = null
}

/** Returns validated env vars. Throws on first call if any required var is missing. */
export function getEnv(): Env {
  if (_env !== null) return _env

  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const missing = parsed.error.issues
      .map(i => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`Missing or invalid environment variables:\n${missing}`)
  }

  _env = parsed.data
  return _env
}

/** Returns true if all required env vars are present (for /api/health). */
export function hasRequiredEnv(): boolean {
  try {
    getEnv()
    return true
  } catch {
    return false
  }
}
