/**
 * Notice Fingerprinting and Hashing Engine.
 * Generates deterministic hashes for caching and request coalescing.
 * Parity maintained between client and server environments.
 */

export interface FingerprintOptions {
  language?: string
  promptVersion?: string
  rulesVersion?: string
}

/**
 * Normalizes notice text by stripping excessive whitespace, control characters,
 * and normalizing casing for stable fingerprinting.
 */
export function normalizeNoticeText(rawText: string): string {
  if (!rawText) return ''
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
    .toLowerCase()
}

/**
 * Pure 32-bit FNV-1a hash implementation for fast, portable deterministic hashing.
 */
export function fnv1a32(str: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

/**
 * Computes deterministic cache key:
 * hash(notice fingerprint, language, promptVersion, rulesVersion)
 */
export function computeNoticeHash(
  rawText: string,
  options: FingerprintOptions = {}
): { fingerprint: string; cacheKey: string } {
  const { language = 'en', promptVersion = 'v1', rulesVersion = '2026.11' } = options
  const normalized = normalizeNoticeText(rawText)
  const fingerprint = fnv1a32(normalized)
  const cacheKey = fnv1a32(`${fingerprint}:${language}:${promptVersion}:${rulesVersion}`)

  return { fingerprint, cacheKey }
}
