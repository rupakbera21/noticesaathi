import { getEnv, hasRequiredEnv, _resetEnvForTesting } from './env'

describe('env service', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    _resetEnvForTesting()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('validates and returns env when all required variables are set', () => {
    process.env['GEMINI_API_KEY'] = 'test-gemini-key'
    process.env['GROQ_API_KEY'] = 'test-groq-key'
    process.env['OLOSTEP_API_KEY'] = 'test-olostep-key'
    process.env['UPSTASH_REDIS_REST_URL'] = 'https://example.upstash.io'
    process.env['UPSTASH_REDIS_REST_TOKEN'] = 'test-token'
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', configurable: true })

    const env = getEnv()
    expect(env.GEMINI_API_KEY).toBe('test-gemini-key')
    expect(env.GROQ_API_KEY).toBe('test-groq-key')
    expect(hasRequiredEnv()).toBe(true)
  })

  it('throws an error when required variables are missing', () => {
    delete process.env['GEMINI_API_KEY']
    expect(() => getEnv()).toThrow('Missing or invalid environment variables')
  })

  it('hasRequiredEnv returns false when variables are invalid or missing', () => {
    delete process.env['UPSTASH_REDIS_REST_URL']
    expect(hasRequiredEnv()).toBe(false)
  })
})
