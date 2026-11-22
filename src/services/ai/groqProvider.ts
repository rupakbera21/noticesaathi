import 'groq-sdk/shims/node'
import Groq from 'groq-sdk'
import { AiProvider, ModelProviderName, ProviderCallOptions } from './types'
import { ExtractedNotice, ExtractedNoticeSchema, DraftReply, DraftReplySchema } from '@/schemas/notice'
import { EXTRACTION_SYSTEM_PROMPT, buildExplanationPrompt, buildReplyDraftPrompt } from './prompts'
import { cleanAndParseJson } from './responseCleaner'

export class GroqProvider implements AiProvider {
  public readonly name: ModelProviderName = 'GROQ'
  public readonly modelId: string
  private client: Groq

  constructor(apiKey: string, modelId: string = 'llama-3.3-70b-versatile') {
    this.modelId = modelId
    this.client = new Groq({ apiKey })
  }

  public async extractNotice(noticeText: string, options?: ProviderCallOptions): Promise<ExtractedNotice> {
    const completion = await this.client.chat.completions.create({
      model: this.modelId,
      messages: [
        { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this Indian GST Notice:\n\n${noticeText}` },
      ],
      temperature: options?.temperature ?? 0.1,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content ?? ''
    const parseResult = cleanAndParseJson(content, ExtractedNoticeSchema)
    if (!parseResult.success || !parseResult.data) {
      throw new Error(`Groq notice extraction failed: ${parseResult.error}`)
    }

    return parseResult.data
  }

  public async generateExplanation(
    notice: ExtractedNotice,
    citationsSummary: string,
    language: 'en' | 'hi' | 'bn',
    options?: ProviderCallOptions
  ): Promise<string> {
    const prompt = buildExplanationPrompt(notice, citationsSummary, language)
    const completion = await this.client.chat.completions.create({
      model: this.modelId,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.2,
    })

    return completion.choices[0]?.message?.content ?? ''
  }

  public async draftReply(
    notice: ExtractedNotice,
    citationsSummary: string,
    userNotes?: string,
    options?: ProviderCallOptions
  ): Promise<DraftReply> {
    const prompt = buildReplyDraftPrompt(notice, citationsSummary, userNotes)
    const completion = await this.client.chat.completions.create({
      model: this.modelId,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.2,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content ?? ''
    const parseResult = cleanAndParseJson(content, DraftReplySchema)
    if (!parseResult.success || !parseResult.data) {
      throw new Error(`Groq reply draft parsing failed: ${parseResult.error}`)
    }

    return parseResult.data
  }
}
