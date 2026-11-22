import { getCachedAnalysis, setCachedAnalysis } from './cache'

// Mock Upstash
const mockStorage = new Map<string, unknown>()

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation((key: string) => Promise.resolve(mockStorage.get(key) || null)),
    set: jest.fn().mockImplementation((key: string, val: unknown) => {
      mockStorage.set(key, val)
      return Promise.resolve('OK')
    }),
    ping: jest.fn().mockResolvedValue('PONG'),
  })),
}))

describe('Fingerprint Cache Service', () => {
  beforeAll(() => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://fake-redis.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'
  })

  it('handles get and set operations safely without crashing', async () => {
    const testText = 'FORM GST ASMT-10 Notice under Section 61 Date 20/11/2024'
    const testData = { noticeType: 'ASMT_10_SCRUTINY', taxDemand: 45000 }

    await expect(setCachedAnalysis(testText, testData)).resolves.not.toThrow()
    const result = await getCachedAnalysis<typeof testData>(testText)
    expect(result).toBeDefined()
    expect(result?.taxDemand).toBe(45000)
  })

  it('handles cache misses gracefully', async () => {
    const res = await getCachedAnalysis('completely-unique-non-existent-text-' + Date.now())
    expect(res).toBeNull()
  })
})
