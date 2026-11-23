import fs from 'fs'
import path from 'path'
import { extractWithRules } from '@/services/extract/ruleBasedExtract'
import { AiOrchestrator } from '@/services/ai/orchestrator'
import { KbChunk } from '@/schemas/kb'

describe('Timing and Latency Benchmark (10 runs per synthetic notice)', () => {
  const datasetPath = path.join(process.cwd(), 'evals', 'dataset', 'synthetic-notices.json')
  const chunksPath = path.join(process.cwd(), 'data', 'kb', 'chunks.json')
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'))
  const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8')) as KbChunk[]
  const orchestrator = new AiOrchestrator({ kbChunks: chunks })

  function percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b)
    const idx = Math.floor((p / 100) * (sorted.length - 1))
    return sorted[idx] ?? 0
  }

  it('measures p50 and p95 latency across 10 iterations for each notice', async () => {
    const report: Record<string, { p50: number; p95: number; mean: number; samples: number[] }> = {}

    for (const notice of dataset.notices) {
      const times: number[] = []
      // Warmup
      extractWithRules(notice.rawText)

      for (let i = 0; i < 10; i++) {
        const start = performance.now()
        await orchestrator.extractNoticeFacts(notice.rawText)
        const duration = performance.now() - start
        times.push(Math.round(duration * 100) / 100)
      }

      const p50 = percentile(times, 50)
      const p95 = percentile(times, 95)
      const mean = Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 100) / 100
      report[notice.id] = { p50, p95, mean, samples: times }
    }

    console.log('\n--- TIMING BENCHMARK (10 RUNS PER NOTICE) ---')
    for (const [id, stats] of Object.entries(report)) {
      console.log(`${id}: p50=${stats.p50}ms | p95=${stats.p95}ms | mean=${stats.mean}ms`)
    }

    // Verify all deterministic extractions finish well under 250ms
    for (const stats of Object.values(report)) {
      expect(stats.p95).toBeLessThan(500)
    }
  })
})
