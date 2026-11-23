import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AiOrchestrator } from '@/services/ai/orchestrator'
import { RetrievalEngine } from '@/services/retrieval/retrievalEngine'
import { evaluateEscalation } from '@/domain/escalation'
import { checkTotalsConsistency } from '@/domain/totals'
import { resolveNoticeDeadline } from '@/domain/dates'
import { calculateInterest } from '@/domain/interest'
import { InterestRule } from '@/schemas/rule'
import { KbChunk } from '@/schemas/kb'
import chunksData from '../../../../data/kb/chunks.json'
import interestRuleData from '../../../../data/rules/interest-sec50.json'

const requestSchema = z.object({
  noticeText: z
    .string()
    .min(20, 'Notice text is too short')
    .max(25000, 'Notice text exceeds 25,000 characters'),
  language: z.enum(['en', 'hi', 'bn']).default('en'),
})

const kbChunks = chunksData as unknown as KbChunk[]
const retrievalEngine = new RetrievalEngine(kbChunks)
const interestRule = interestRuleData as unknown as InterestRule

const orchestrator = new AiOrchestrator({
  geminiApiKey: process.env.GEMINI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  kbChunks,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { noticeText, language } = parsed.data
    const orchResult = await orchestrator.extractNoticeFacts(noticeText)
    const deadline = resolveNoticeDeadline(orchResult.notice)

    const escalation = evaluateEscalation(orchResult.notice)
    const totals = checkTotalsConsistency({
      taxDemand: orchResult.notice.taxDemand,
      interestDemand: orchResult.notice.interestDemand,
      penaltyDemand: orchResult.notice.penaltyDemand,
      statedTotal: orchResult.notice.totalStatedDemand,
    })

    // Calculate an independent interest estimate only if the delay period is established from notice facts; otherwise unavailable
    const delayDays =
      (orchResult.notice as { delayDaysEstablished?: number }).delayDaysEstablished ?? null
    const interestCalc =
      orchResult.notice.taxDemand > 0 && delayDays !== null && delayDays > 0
        ? calculateInterest({
            taxAmount: orchResult.notice.taxDemand,
            daysDelayed: delayDays,
            rule: interestRule,
          })
        : null

    const query = [
      ...orchResult.notice.sectionsCited,
      ...orchResult.notice.formsCited,
      orchResult.notice.noticeTypeDescription,
    ].join(' ')
    const citations = retrievalEngine.search(query, 3).map(r => ({
      id: r.chunk.id,
      identifier: r.chunk.identifier,
      title: r.chunk.title,
      contentSnippet: r.chunk.content.slice(0, 180) + '...',
      sourceUrl: r.chunk.sourceUrl,
      authority: r.chunk.authority,
    }))

    const citationsSummary = citations.map(c => `[${c.identifier}] ${c.title}`).join('; ')
    const explanation = await orchestrator.generateExplanation(
      orchResult.notice,
      citationsSummary,
      language
    )

    return NextResponse.json({
      success: true,
      notice: orchResult.notice,
      orchestration: {
        providerUsed: orchResult.providerUsed,
        modelName: orchResult.modelName,
        latencyMs: orchResult.latencyMs,
        discrepancyFlags: orchResult.discrepancyFlags,
        grounding: orchResult.grounding,
      },
      deadline: {
        status: deadline.status,
        formattedDate: deadline.formattedDate,
        remainingDays: deadline.remainingDays,
        isExpired: deadline.isExpired,
        message: deadline.message,
      },
      totals,
      interestCalc,
      escalation,
      citations,
      explanation,
    })
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to analyze notice', details }, { status: 500 })
  }
}
