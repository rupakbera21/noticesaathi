import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('Running NoticeSaathi Automated Benchmark Evaluation...')
try {
  execSync('npx jest __tests__/integration/evalBenchmark.test.ts', { stdio: 'inherit' })
  const reportPath = path.join(process.cwd(), 'evals', 'results', 'baseline-eval.json')
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    console.log('\n--- EVALUATION BENCHMARK SCORECARD ---')
    console.log(`Evaluated Notices : ${report.totalEvaluated}`)
    console.log(`Notice Type Acc   : ${report.metrics.noticeTypeAccuracyPct}%`)
    console.log(`Demand Amount Acc : ${report.metrics.totalDemandAccuracyPct}%`)
    console.log(`Escalation Acc    : ${report.metrics.escalationDecisionAccuracyPct}%`)
    console.log(`Citation Recall   : ${report.metrics.citationRecallPct}%`)
    console.log(`Grounding Rate    : ${report.metrics.averageGroundingScorePct}%`)
    console.log(`Detailed report   : ${reportPath}\n`)
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err)
  console.error('Eval failed:', msg)
  process.exit(1)
}
