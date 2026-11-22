/**
 * @jest-environment node
 */
import { GET } from './route'

describe('GET /api/health', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns ok: true with provider status flags', async () => {
    process.env['GEMINI_API_KEY'] = 'fake-gemini'
    process.env['GROQ_API_KEY'] = 'fake-groq'
    process.env['UPSTASH_REDIS_REST_URL'] = 'https://fake.upstash.io'
    process.env['UPSTASH_REDIS_REST_TOKEN'] = 'fake-token'

    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(typeof data.timestamp).toBe('string')
    expect(data.providers).toEqual({
      gemini: true,
      groq: true,
      upstash: true,
    })
  })

  it('correctly marks missing providers as false', async () => {
    delete process.env['GEMINI_API_KEY']
    delete process.env['GROQ_API_KEY']
    delete process.env['UPSTASH_REDIS_REST_URL']
    delete process.env['UPSTASH_REDIS_REST_TOKEN']

    const response = await GET()
    const data = await response.json()
    expect(data.providers).toEqual({
      gemini: false,
      groq: false,
      upstash: false,
    })
  })
})
