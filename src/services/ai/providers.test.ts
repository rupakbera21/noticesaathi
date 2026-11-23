import { GeminiProvider } from './geminiProvider'
import { GroqProvider } from './groqProvider'
import { AiOrchestrator } from './orchestrator'
import { ExtractedNotice } from '@/schemas/notice'
import { KbChunk } from '@/schemas/kb'

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockImplementation((prompt: string) => {
          if (typeof prompt === 'string' && prompt.includes('Analyze this Indian GST Notice')) {
            return Promise.resolve({
              response: {
                text: () =>
                  JSON.stringify({
                    noticeType: 'ASMT_10_SCRUTINY',
                    noticeTypeDescription: 'Scrutiny of Returns (ASMT-10)',
                    issuingAuthority: 'Proper Officer',
                    taxpayerGstin: '27AABCU9603R1ZN',
                    taxpayerTradeName: 'Bharat Traders',
                    noticeReferenceNumber: 'ASMT10/2024/01',
                    noticeDate: '2024-11-20',
                    taxPeriod: '2023-24',
                    sectionsCited: ['Section 61'],
                    rulesCited: ['Rule 99'],
                    formsCited: ['ASMT-10'],
                    taxDemand: 50000,
                    interestDemand: 4500,
                    penaltyDemand: 0,
                    otherDemand: 0,
                    totalStatedDemand: 54500,
                    replyDeadlineDate: '2024-12-20',
                    replyDaysAllowed: 30,
                    documentsRequested: ['Invoices'],
                    statedGrounds: ['ITC mismatch'],
                    allegationsOfFraudOrWilfulSuppression: false,
                    extractionConfidence: 0.95,
                  }),
              },
            })
          }
          if (
            typeof prompt === 'string' &&
            prompt.includes('Draft a formal, polite, legally sound reply')
          ) {
            return Promise.resolve({
              response: {
                text: () =>
                  JSON.stringify({
                    noticeReference: 'ASMT10/2024/01',
                    taxpayerGstin: '27AABCU9603R1ZN',
                    taxpayerName: 'Bharat Traders',
                    issuingAuthority: 'Proper Officer',
                    dateOfReply: '2024-11-21',
                    subject: 'Reply to ASMT-10',
                    openingStatement: 'With reference to the notice...',
                    factualSubmissions: ['Submission 1'],
                    statutoryGrounds: [{ provision: 'Section 16', explanation: 'Complied' }],
                    enclosedDocuments: ['Invoices'],
                    prayerOrReliefSought: 'Drop demand',
                    caEscalationWarning: null,
                    fullReplyText: 'To Proper Officer...',
                  }),
              },
            })
          }
          return Promise.resolve({
            response: {
              text: () => 'Plain language explanation text from Gemini',
            },
          })
        }),
      }),
    })),
  }
})

// Mock Groq
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockImplementation((req: { messages: Array<{ content: string }> }) => {
          const userContent = req.messages[1]?.content || req.messages[0]?.content || ''
          if (userContent.includes('Analyze this Indian GST Notice')) {
            return Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      noticeType: 'DRC_01_DEMAND_NON_FRAUD',
                      noticeTypeDescription: 'Demand Show Cause Notice (Section 73)',
                      issuingAuthority: 'Proper Officer',
                      taxpayerGstin: '27AABCU9603R1ZN',
                      taxpayerTradeName: 'Bharat Traders',
                      noticeReferenceNumber: 'DRC01/2024/02',
                      noticeDate: '2024-11-20',
                      taxPeriod: '2023-24',
                      sectionsCited: ['Section 73'],
                      rulesCited: [],
                      formsCited: ['DRC-01'],
                      taxDemand: 25000,
                      interestDemand: 2000,
                      penaltyDemand: 2500,
                      otherDemand: 0,
                      totalStatedDemand: 29500,
                      replyDeadlineDate: '2024-12-20',
                      replyDaysAllowed: 30,
                      documentsRequested: ['Challan receipts'],
                      statedGrounds: ['Underdeclared outward tax'],
                      allegationsOfFraudOrWilfulSuppression: false,
                      extractionConfidence: 0.92,
                    }),
                  },
                },
              ],
            })
          }
          if (userContent.includes('Draft a formal, polite, legally sound reply')) {
            return Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      noticeReference: 'DRC01/2024/02',
                      taxpayerGstin: '27AABCU9603R1ZN',
                      taxpayerName: 'Bharat Traders',
                      issuingAuthority: 'Proper Officer',
                      dateOfReply: '2024-11-21',
                      subject: 'Reply to DRC-01',
                      openingStatement: 'With reference to the notice...',
                      factualSubmissions: ['Tax paid in cash'],
                      statutoryGrounds: [
                        { provision: 'Section 73(5)', explanation: 'Voluntary tax paid' },
                      ],
                      enclosedDocuments: ['Challan copy'],
                      prayerOrReliefSought: 'Drop demand and penalty',
                      caEscalationWarning: null,
                      fullReplyText: 'To Proper Officer...',
                    }),
                  },
                },
              ],
            })
          }
          return Promise.resolve({
            choices: [
              {
                message: {
                  content: 'Plain language explanation text from Groq',
                },
              },
            ],
          })
        }),
      },
    },
  }))
})

describe('AI Providers: Gemini & Groq implementations', () => {
  const dummyNotice: ExtractedNotice = {
    noticeType: 'ASMT_10_SCRUTINY',
    noticeTypeDescription: 'Scrutiny of returns',
    issuingAuthority: 'Proper Officer',
    taxpayerGstin: '27AABCU9603R1ZN',
    taxpayerTradeName: 'Bharat Traders',
    noticeReferenceNumber: 'ASMT10/2024/01',
    noticeDate: '2024-11-20',
    taxPeriod: '2023-24',
    sectionsCited: ['Section 61'],
    rulesCited: ['Rule 99'],
    formsCited: ['ASMT-10'],
    taxDemand: 50000,
    interestDemand: 4500,
    penaltyDemand: 0,
    otherDemand: 0,
    totalStatedDemand: 54500,
    replyDeadlineDate: '2024-12-20',
    replyDaysAllowed: 30,
    documentsRequested: ['Invoices'],
    statedGrounds: ['Mismatch'],
    allegationsOfFraudOrWilfulSuppression: false,
    extractionConfidence: 0.95,
  }

  const sampleChunks: KbChunk[] = [
    {
      id: 'cgst-act-sec-61',
      actOrRules: 'CGST_ACT_2017',
      identifier: 'Section 61',
      normalizedId: 'sec-61',
      title: 'Scrutiny of Returns',
      content: 'Proper officer may scrutinize...',
      effectiveDate: '2017-07-01',
      sourceUrl: 'https://cbic-gst.gov.in',
      authority: 'CBIC',
      fetchedAt: '2026-11-21T00:00:00Z',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  ]

  it('GeminiProvider extracts notice, generates explanations, and drafts replies', async () => {
    const provider = new GeminiProvider('fake-gemini-key')
    const extracted = await provider.extractNotice(
      'Sample notice text for scrutiny under Section 61'
    )
    expect(extracted.noticeType).toBe('ASMT_10_SCRUTINY')
    expect(extracted.totalStatedDemand).toBe(54500)

    const exp = await provider.generateExplanation(dummyNotice, 'Section 61 summary', 'en')
    expect(exp).toContain('Gemini')

    const draft = await provider.draftReply(
      dummyNotice,
      'Section 61 summary',
      'Supplier invoice proof'
    )
    expect(draft.subject).toBe('Reply to ASMT-10')
  })

  it('GroqProvider extracts notice, generates explanations, and drafts replies', async () => {
    const provider = new GroqProvider('fake-groq-key')
    const extracted = await provider.extractNotice('Sample DRC-01 demand notice text')
    expect(extracted.noticeType).toBe('DRC_01_DEMAND_NON_FRAUD')
    expect(extracted.taxDemand).toBe(25000)

    const exp = await provider.generateExplanation(dummyNotice, 'Section 73 summary', 'hi')
    expect(exp).toContain('Groq')

    const draft = await provider.draftReply(dummyNotice, 'Section 73 summary', 'Paid via challan')
    expect(draft.subject).toBe('Reply to DRC-01')
  })

  it('AiOrchestrator successfully calls Gemini provider when key is provided', async () => {
    const orchestrator = new AiOrchestrator({
      geminiApiKey: 'fake-gemini-key',
      kbChunks: sampleChunks,
    })

    const res = await orchestrator.extractNoticeFacts('Sample notice text')
    expect(res.providerUsed).toBe('GEMINI')
    expect(res.notice.noticeType).toBe('ASMT_10_SCRUTINY')

    const exp = await orchestrator.generateExplanation(res.notice, 'Context', 'en')
    expect(exp).toContain('Gemini')
  })

  it('AiOrchestrator falls back to Groq when Gemini fails', async () => {
    const orchestrator = new AiOrchestrator({
      geminiApiKey: 'fake-gemini-key',
      groqApiKey: 'fake-groq-key',
      kbChunks: sampleChunks,
    })

    // Force gemini failure
    const gemini = (orchestrator as unknown as { gemini: { extractNotice: () => Promise<never> } })
      .gemini
    gemini.extractNotice = jest.fn().mockRejectedValue(new Error('Gemini Quota Exceeded'))

    const res = await orchestrator.extractNoticeFacts('Sample notice text')
    expect(res.providerUsed).toBe('GROQ')
    expect(res.notice.noticeType).toBe('DRC_01_DEMAND_NON_FRAUD')
  })
})
