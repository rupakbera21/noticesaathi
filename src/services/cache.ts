import { Redis } from '@upstash/redis'
import { computeNoticeHash } from '@/domain/fingerprint'

let redisClient: Redis | null = null

function getRedis(): Redis | null {
  if (redisClient) return redisClient

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  try {
    redisClient = new Redis({ url, token })
    return redisClient
  } catch {
    return null
  }
}

const CACHE_TTL_SECONDS = 86400 * 7 // 7 days

/**
 * Gets cached analysis response by deterministic notice text hash.
 */
export async function getCachedAnalysis<T>(rawNoticeText: string, language: string = 'en'): Promise<T | null> {
  const redis = getRedis()
  if (!redis) return null

  try {
    const { cacheKey } = computeNoticeHash(rawNoticeText, { language })
    const cached = await redis.get<T>(`noticesaathi:cache:${cacheKey}`)
    return cached || null
  } catch {
    return null
  }
}

/**
 * Stores analysis response in Redis cache.
 */
export async function setCachedAnalysis<T>(rawNoticeText: string, data: T, language: string = 'en'): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    const { cacheKey } = computeNoticeHash(rawNoticeText, { language })
    await redis.set(`noticesaathi:cache:${cacheKey}`, data, { ex: CACHE_TTL_SECONDS })
  } catch {
    // Non-blocking cache write failure
  }
}
