import { ExtractedNotice, DraftReply } from '@/schemas/notice'

export type ModelProviderName = 'GEMINI' | 'GROQ' | 'RULE_BASED_FALLBACK'

export interface ProviderCallOptions {
  temperature?: number
  maxTokens?: number
  timeoutMs?: number
}

export interface ExtractionResult {
  notice: ExtractedNotice
  providerUsed: ModelProviderName
  modelName: string
  latencyMs: number
  rawResponse?: string
  confidenceScore: number
}

export interface ExplanationResult {
  explanation: string
  providerUsed: ModelProviderName
  modelName: string
  latencyMs: number
}

export interface DraftReplyResult {
  draft: DraftReply
  providerUsed: ModelProviderName
  modelName: string
  latencyMs: number
}

export interface AiProvider {
  name: ModelProviderName
  modelId: string
  extractNotice(noticeText: string, options?: ProviderCallOptions): Promise<ExtractedNotice>
  generateExplanation(
    notice: ExtractedNotice,
    citationsSummary: string,
    language: 'en' | 'hi' | 'bn',
    options?: ProviderCallOptions
  ): Promise<string>
  draftReply(
    notice: ExtractedNotice,
    citationsSummary: string,
    userNotes?: string,
    options?: ProviderCallOptions
  ): Promise<DraftReply>
}
