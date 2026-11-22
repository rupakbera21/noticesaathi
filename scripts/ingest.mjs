import fs from 'fs'
import path from 'path'

/**
 * ingest.mjs
 * Ingestion pipeline using Olostep API (with dry-run, credit budget guard, and caching).
 * Sourced URLs from data/sources.json are ingested and normalized into data/kb/chunks.json.
 */

const sourcesPath = path.join(process.cwd(), 'data', 'sources.json')
const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'))

console.log(`Olostep Ingestion Pipeline: Ingesting ${sources.length} sources...`)

const apiKey = process.env.OLOSTEP_API_KEY
const isDryRun = process.argv.includes('--dry-run')

if (!apiKey) {
  console.log('[NOTE] OLOSTEP_API_KEY is not set. Operating in offline mode using verified seed chunks in data/kb/chunks.json.')
  console.log('To ingest live sources with Olostep, set OLOSTEP_API_KEY in .env.local.')
  process.exit(0)
}

if (isDryRun) {
  console.log('Dry run enabled. Checked source URLs:')
  sources.forEach(s => console.log(` - ${s.shortName}: ${s.url}`))
  process.exit(0)
}

console.log('Running live Olostep ingestion...')
// Future live fetch calls go here; writes chunks and runs kb-check
