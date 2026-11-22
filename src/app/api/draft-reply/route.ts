import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ExtractedNoticeSchema } from '@/schemas/notice'
import { ReplyDrafter } from '@/services/ai/replyDrafter'
import { RetrievalEngine } from '@/services/retrieval/retrievalEngine'
import { KbChunk } from '@/schemas/kb'
import chunksData from '../../../../data/kb/chunks.json'

const requestSchema = z.object({
  notice: ExtractedNoticeSchema,
  userNotes: z.string().max(2000).optional(),
})

const retrievalEngine = new RetrievalEngine(chunksData as unknown as KbChunk[])
const drafter = new ReplyDrafter()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid draft request', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { notice, userNotes } = parsed.data

    // Retrieve relevant citations for grounding reply
    const query = [
      ...notice.sectionsCited,
      ...notice.formsCited,
      notice.noticeTypeDescription,
    ].join(' ')
    const citations = retrievalEngine.search(query, 2)
    const citationsSummary = citations
      .map(c => `• ${c.chunk.identifier} (${c.chunk.title}): ${c.chunk.content.slice(0, 150)}...`)
      .join('\n')

    const draft = await drafter.generateReply(notice, citationsSummary, userNotes)

    return NextResponse.json({
      success: true,
      draft,
      citationsCount: citations.length,
    })
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to draft reply', details }, { status: 500 })
  }
}
