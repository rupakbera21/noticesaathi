import { ExtractedNotice } from '@/schemas/notice'
import { KbChunk } from '@/schemas/kb'

export interface GroundingValidationResult {
  isFullyGrounded: boolean
  groundedCitations: string[]
  unverifiedCitations: string[]
  groundingScore: number // 0.0 to 1.0
  notes: string[]
}

/**
 * Validates extracted statutory citations against official Knowledge Base chunks.
 * Catches model hallucinations of non-existent sections, rules, or circulars.
 */
export class GroundingValidator {
  private validIdentifiers = new Set<string>()

  constructor(chunks: KbChunk[]) {
    for (const chunk of chunks) {
      this.validIdentifiers.add(this.normalize(chunk.identifier))
      this.validIdentifiers.add(this.normalize(chunk.normalizedId))
    }
  }

  private normalize(identifier: string): string {
    return identifier.toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  public validateNoticeGrounding(notice: ExtractedNotice): GroundingValidationResult {
    const allCitations = [
      ...notice.sectionsCited,
      ...notice.rulesCited,
      ...notice.formsCited,
    ]

    if (allCitations.length === 0) {
      return {
        isFullyGrounded: true,
        groundedCitations: [],
        unverifiedCitations: [],
        groundingScore: 1.0,
        notes: ['No statutory provisions cited in notice'],
      }
    }

    const groundedCitations: string[] = []
    const unverifiedCitations: string[] = []

    for (const cite of allCitations) {
      const norm = this.normalize(cite)
      const hasMatch = Array.from(this.validIdentifiers).some(valid => valid.includes(norm) || norm.includes(valid))
      if (hasMatch) {
        groundedCitations.push(cite)
      } else {
        unverifiedCitations.push(cite)
      }
    }

    const groundingScore = groundedCitations.length / allCitations.length
    const isFullyGrounded = unverifiedCitations.length === 0

    const notes: string[] = []
    if (!isFullyGrounded) {
      notes.push(`Unverified provisions detected: ${unverifiedCitations.join(', ')}`)
    }

    return {
      isFullyGrounded,
      groundedCitations,
      unverifiedCitations,
      groundingScore: Math.round(groundingScore * 100) / 100,
      notes,
    }
  }
}
