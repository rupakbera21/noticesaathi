/**
 * smoke.mjs
 * Makes a lightweight smoke call to Gemini, Groq, and Upstash.
 * Prints PASS or FAIL with redacted error messages (no secret leaks).
 */

async function testGemini() {
  const key = process.env.GEMINI_API_KEY
  if (!key) return { name: 'Gemini', ok: false, error: 'GEMINI_API_KEY not set' }
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(key)
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
    const model = genAI.getGenerativeModel({ model: modelName })
    const res = await model.generateContent('ping')
    if (res?.response?.text()) {
      return { name: `Gemini (${modelName})`, ok: true }
    }
    return { name: 'Gemini', ok: false, error: 'Empty response' }
  } catch (err) {
    const msg = (err.message || 'Unknown error').replace(/key=[^&]+/g, 'key=REDACTED')
    return { name: 'Gemini', ok: false, error: msg }
  }
}

async function testGroq() {
  const key = process.env.GROQ_API_KEY
  if (!key) return { name: 'Groq', ok: false, error: 'GROQ_API_KEY not set' }
  try {
    const { Groq } = await import('groq-sdk')
    const groq = new Groq({ apiKey: key })
    const modelName = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'
    const res = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'ping' }],
      model: modelName,
      max_completion_tokens: 150,
    })
    if (res?.choices?.[0]?.message?.content) {
      return { name: `Groq (${modelName})`, ok: true }
    }
    return { name: 'Groq', ok: false, error: 'Empty response' }
  } catch (err) {
    const msg = (err.message || 'Unknown error').replace(/key=[^&]+/g, 'key=REDACTED')
    return { name: 'Groq', ok: false, error: msg }
  }
}

async function testUpstash() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return { name: 'Upstash Redis', ok: false, error: 'UPSTASH env vars not set' }
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({ url, token })
    const key = `noticesaathi:smoke:${Date.now()}`
    await redis.set(key, 'ok', { ex: 10 })
    const val = await redis.get(key)
    if (val === 'ok') {
      return { name: 'Upstash Redis', ok: true }
    }
    return { name: 'Upstash Redis', ok: false, error: 'Value mismatch' }
  } catch (err) {
    const msg = (err.message || 'Unknown error').replace(/token=[^&]+/g, 'token=REDACTED')
    return { name: 'Upstash Redis', ok: false, error: msg }
  }
}

console.log('Running provider smoke test...')
const results = await Promise.all([testGemini(), testGroq(), testUpstash()])

let allPassed = true
console.log('--------------------------------------------------')
for (const r of results) {
  if (r.ok) {
    console.log(`[PASS] ${r.name}`)
  } else {
    console.log(`[FAIL] ${r.name} - ${r.error}`)
    allPassed = false
  }
}
console.log('--------------------------------------------------')

if (!allPassed) {
  console.warn('Some smoke checks failed (expected if local API keys are unconfigured).')
} else {
  console.log('All smoke checks passed!')
}
