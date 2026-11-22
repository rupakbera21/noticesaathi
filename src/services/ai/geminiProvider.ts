import { GoogleGenerativeAI } from '@google/generative-ai'
import { AiProvider, ModelProviderName, ProviderCallOptions } from './types'
import { ExtractedNotice, ExtractedNoticeSchema, DraftReply, DraftReplySchema } from '@/schemas/notice'
import { EXTRACTION_SYSTEM_PROMPT, buildExplanationPrompt, buildReplyDraftPrompt } from './prompts'
import { cleanAndParseJson } from './responseCleaner'

export class GeminiProvider implements AiProvider {
  public readonly name: ModelProviderName = 'GEMINI'
  public readonly modelId: string
  private client: GoogleGenerativeAI

  constructor(apiKey: string, modelId: string = 'gemini-3.5-flash-lite') {
    this.modelId = modelId
    this.client = new GoogleGenerativeAI(apiKey)
  }

  public async extractNotice(noticeText: string, options?: ProviderCallOptions): Promise<ExtractedNotice> {
    const model = this.client.getGenerativeModel({
      model: this.modelId,
      generationConfig: {
        temperature: options?.temperature ?? 0.1,
        responseMimeType: 'application/json',
      },
      systemInstruction: EXTRACTION_SYSTEM_PROMPT,
    })

    const result = await model.generateContent(`Analyze this Indian GST Notice:\n\n${noticeText}`)
    const text = result.response.text()

    const parseResult = cleanAndParseJson(text, ExtractedNoticeSchema)
    if (!parseResult.success || !parseResult.data) {
      throw new Error(`Gemini notice extraction failed: ${parseResult.error}`)
    }

    return parseResult.data
  }

  public async generateExplanation(
    notice: ExtractedNotice,
    citationsSummary: string,
    language: 'en' | 'hi' | 'bn',
    options?: ProviderCallOptions
  ): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: this.modelId,
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
      },
    })

    const prompt = buildExplanationPrompt(notice, citationsSummary, language)
    const result = await model.generateContent(prompt)
    return result.response.text()
  }

  public async draftReply(
    notice: ExtractedNotice,
    citationsSummary: string,
    userNotes?: string,
    options?: ProviderCallOptions
  ): Promise<DraftReply> {
    const model = this.client.getGenerativeModel({
      model: this.modelId,
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        responseMimeType: 'application/json',
      },
    })

    const prompt = buildReplyDraftPrompt(notice, citationsSummary, userNotes)
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const parseResult = cleanAndParseJson(text, DraftReplySchema)
    if (!parseResult.success || !parseResult.data) {
      throw new Error(`Gemini reply draft parsing failed: ${parseResult.error}`)
    }

    return parseResult.data
  }
}
