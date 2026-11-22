import { checkRateLimit } from './rateLimit'

// Mock Upstash
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
  })),
}))

jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    jest.fn().mockImplementation(() => ({
      limit: jest.fn().mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 60000,
      }),
    })),
    {
      slidingWindow: jest.fn(),
    }
  ),
}))

describe('Rate Limiter Service', () => {
  it('returns successful check when Upstash is configured or falls open gracefully', async () => {
    const res = await checkRateLimit('test-client-ip-127-0-0-1')
    expect(res.success).toBe(true)
    expect(res.limit).toBeGreaterThan(0)
    expect(res.remaining).toBeDefined()
  })

  it('handles multiple requests without throwing errors', async () => {
    const promises = Array.from({ length: 3 }, () => checkRateLimit('bulk-client-ip'))
    const results = await Promise.all(promises)
    results.forEach(r => {
      expect(typeof r.success).toBe('boolean')
    })
  })
})
