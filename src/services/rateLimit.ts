import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimitInstance: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (ratelimitInstance) return ratelimitInstance

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  try {
    const redis = new Redis({ url, token })
    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: 'noticesaathi:ratelimit',
    })
    return ratelimitInstance
  } catch {
    return null
  }
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Checks rate limits per client identifier (IP or taxpayer GSTIN).
 * Gracefully permits request if Upstash is unconfigured or unreachable.
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getRatelimit()
  if (!limiter) {
    return { success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 }
  }

  try {
    const res = await limiter.limit(identifier)
    return {
      success: res.success,
      limit: res.limit,
      remaining: res.remaining,
      reset: res.reset,
    }
  } catch {
    // Fail-open for high availability if Redis connection times out
    return { success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 }
  }
}
