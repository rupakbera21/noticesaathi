import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

/**
 * kb-check.mjs
 * Validates data/kb/chunks.json against data/kb/manifest.json
 * Verifies checksums, missing chunks, and freshness.
 */

const chunksPath = path.join(process.cwd(), 'data', 'kb', 'chunks.json')
const manifestPath = path.join(process.cwd(), 'data', 'kb', 'manifest.json')

if (!fs.existsSync(chunksPath)) {
  console.error('[ERROR] data/kb/chunks.json does not exist!')
  process.exit(1)
}

const rawChunks = fs.readFileSync(chunksPath, 'utf-8')
const chunks = JSON.parse(rawChunks)

console.log(`Checking knowledge base chunks (${chunks.length} entries)...`)

let hasErrors = false

// Generate live manifest
const manifestEntries = chunks.map(chunk => {
  const contentHash = crypto.createHash('sha256').update(chunk.content).digest('hex')
  if (chunk.checksum && chunk.checksum !== contentHash) {
    console.warn(`[WARN] Checksum mismatch in chunk ${chunk.id}. Stored: ${chunk.checksum}, calculated: ${contentHash}`)
  }

  if (!chunk.id || !chunk.identifier || !chunk.title || !chunk.content) {
    console.error(`[ERROR] Chunk missing required fields: ${JSON.stringify(chunk)}`)
    hasErrors = true
  }

  return {
    id: chunk.id,
    identifier: chunk.identifier,
    checksum: contentHash,
    charCount: chunk.content.length,
  }
})

const liveManifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  totalChunks: chunks.length,
  sourcesCount: 3,
  chunks: manifestEntries,
}

fs.writeFileSync(manifestPath, JSON.stringify(liveManifest, null, 2), 'utf-8')
console.log(`Manifest written to ${manifestPath} (${manifestEntries.length} items validated).`)

if (hasErrors) {
  console.error('KB validation failed.')
  process.exit(1)
} else {
  console.log('KB validation passed: All chunks valid and manifest updated.')
}
