import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NoticeAnalyzer } from '@/components/NoticeAnalyzer'

// Mock fetch globally
const mockAnalysisData = {
  success: true,
  notice: {
    noticeType: 'ASMT_10_SCRUTINY',
    noticeTypeDescription: 'Scrutiny of Returns (ASMT-10)',
    issuingAuthority: 'Office of the Assistant Commissioner, Central GST',
    taxpayerGstin: '07TESTU9999R1Z9',
    taxpayerTradeName: 'Apex Synthetic Supplies',
    noticeReferenceNumber: 'ASMT10/DL/2024/0912',
    noticeDate: '2024-08-10',
    taxPeriod: 'FY 2023-24',
    sectionsCited: ['Section 61', 'Section 50'],
    rulesCited: ['Rule 99'],
    formsCited: ['ASMT-10'],
    taxDemand: 42000,
    interestDemand: 3500,
    penaltyDemand: 0,
    otherDemand: 0,
    totalStatedDemand: 45500,
    replyDeadlineDate: '2024-09-09',
    replyDaysAllowed: 30,
    documentsRequested: ['GSTR-2B reconciliation statement'],
    statedGrounds: ['Input tax credit mismatch'],
    allegationsOfFraudOrWilfulSuppression: false,
    extractionConfidence: 0.95,
  },
  totals: {
    isConsistent: true,
    hasDiscrepancy: false,
    itemizedTotal: 45500,
    statedTotal: 45500,
    discrepancyMessage: null,
  },
  escalation: {
    shouldEscalate: false,
    riskLevel: 'LOW',
    reasons: [],
    suggestedActions: [],
  },
  citations: [
    {
      id: 'sec-61',
      identifier: 'Section 61',
      title: 'Scrutiny of Returns',
      contentSnippet: 'The proper officer may scrutinize the return...',
      sourceUrl: 'https://cbic.gov.in',
      authority: 'CBIC',
    },
  ],
  explanation: 'This notice relates to return scrutiny for discrepancies in input tax credit.',
  deadline: {
    formattedDate: '09/09/2024',
    remainingDays: 20,
    isExpired: false,
  },
}

describe('NoticeAnalyzer Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/analyze')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAnalysisData),
        })
      }
      if (url.includes('/api/parse-pdf')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              text: 'FORM GST ASMT-10 Discrepancy Notice extracted from file',
              filename: 'test_notice.pdf',
              charCount: 56,
            }),
        })
      }
      if (url.includes('/api/draft-reply')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              draft: {
                noticeReference: 'ASMT10/DL/2024/0912',
                taxpayerGstin: '07TESTU9999R1Z9',
                taxpayerName: 'Apex Synthetic Supplies',
                issuingAuthority: 'Office of the Assistant Commissioner',
                dateOfReply: '2024-11-20',
                subject: 'Reply to Notice ASMT10/DL/2024/0912',
                openingStatement: 'Acknowledgement of notice',
                factualSubmissions: ['Fact 1'],
                statutoryGrounds: [{ provision: 'Section 16', explanation: 'Complied' }],
                enclosedDocuments: ['Invoices'],
                prayerOrReliefSought: 'Drop demand',
                caEscalationWarning: null,
                fullReplyText: 'To the Proper Officer...',
              },
            }),
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    }) as unknown as typeof fetch
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders intake area, sample buttons, and character count', () => {
    render(<NoticeAnalyzer />)
    expect(screen.getByTestId('notice-analyzer')).toBeInTheDocument()
    expect(screen.getByTestId('sample-asmt10-btn')).toBeInTheDocument()
    expect(screen.getByTestId('sample-drc01-btn')).toBeInTheDocument()
    expect(screen.getByTestId('notice-input-textarea')).toBeInTheDocument()
    expect(screen.getByTestId('analyze-notice-btn')).toBeDisabled()
  })

  it('loads sample notice text when sample button is clicked', () => {
    render(<NoticeAnalyzer />)
    const asmt10Btn = screen.getByTestId('sample-asmt10-btn')
    expect(asmt10Btn).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(asmt10Btn)

    expect(asmt10Btn).toHaveAttribute('aria-pressed', 'true')
    expect(asmt10Btn.className).toContain('border-indigo-600')

    const textarea = screen.getByTestId('notice-input-textarea') as HTMLTextAreaElement
    expect(textarea.value).toContain('FORM GST ASMT-10')
    expect(screen.getByTestId('analyze-notice-btn')).not.toBeDisabled()
  })

  it('uploads a PDF/TXT notice file and populates notice text and success pill', async () => {
    render(<NoticeAnalyzer />)
    const fileInput = screen.getByTestId('pdf-file-input')
    const sampleFile = new File(['sample content'], 'test_notice.pdf', { type: 'application/pdf' })

    fireEvent.change(fileInput, { target: { files: [sampleFile] } })

    await waitFor(() => {
      expect(screen.getByTestId('upload-success-pill')).toBeInTheDocument()
    })

    const textarea = screen.getByTestId('notice-input-textarea') as HTMLTextAreaElement
    expect(textarea.value).toContain('FORM GST ASMT-10 Discrepancy Notice extracted from file')
    expect(screen.getByTestId('upload-success-pill')).toHaveTextContent('test_notice.pdf')
  })

  it('highlights selected sample button border and toggles selection between samples', () => {
    render(<NoticeAnalyzer />)
    const asmt10Btn = screen.getByTestId('sample-asmt10-btn')
    const drc01Btn = screen.getByTestId('sample-drc01-btn')
    const gstr3aBtn = screen.getByTestId('sample-gstr3a-btn')

    fireEvent.click(drc01Btn)
    expect(drc01Btn).toHaveAttribute('aria-pressed', 'true')
    expect(drc01Btn.className).toContain('border-red-400')
    expect(asmt10Btn).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(gstr3aBtn)
    expect(gstr3aBtn).toHaveAttribute('aria-pressed', 'true')
    expect(gstr3aBtn.className).toContain('border-amber-400')
    expect(drc01Btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('submits notice and renders receipt summary, demand in ₹, and citations', async () => {
    render(<NoticeAnalyzer />)
    const asmt10Btn = screen.getByTestId('sample-asmt10-btn')
    fireEvent.click(asmt10Btn)

    const analyzeBtn = screen.getByTestId('analyze-notice-btn')
    fireEvent.click(analyzeBtn)

    await waitFor(() => {
      expect(screen.getByTestId('receipt-summary')).toBeInTheDocument()
    })

    expect(screen.getByTestId('taxpayer-gstin')).toHaveTextContent('07TESTU9999R1Z9')
    expect(screen.getByTestId('amount-total')).toHaveTextContent('₹45,500')
    expect(screen.getByTestId('consistent-badge')).toBeInTheDocument()
    expect(screen.getByTestId('statutory-citations')).toBeInTheDocument()
  })

  it('opens reply drafter modal and triggers draft generation', async () => {
    render(<NoticeAnalyzer />)
    fireEvent.click(screen.getByTestId('sample-asmt10-btn'))
    fireEvent.click(screen.getByTestId('analyze-notice-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('open-draft-modal-btn')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('open-draft-modal-btn'))
    expect(screen.getByTestId('draft-reply-modal')).toBeInTheDocument()

    const generateBtn = screen.getByTestId('generate-draft-btn')
    fireEvent.click(generateBtn)

    await waitFor(() => {
      expect(screen.getByTestId('draft-reply-text')).toBeInTheDocument()
    })

    expect(screen.getByTestId('draft-reply-text')).toHaveTextContent('To the Proper Officer')
  })

  it('renders uncertain deadline badge when deadline info is missing or uncertain', async () => {
    const uncertainMock = {
      ...mockAnalysisData,
      deadline: {
        status: 'uncertain',
        formattedDate: null,
        remainingDays: null,
        isExpired: false,
        message: 'Check the deadline on your notice',
      },
    }
    const originalFetch = global.fetch
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/analyze')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(uncertainMock),
        })
      }
      return originalFetch(url)
    })

    render(<NoticeAnalyzer />)
    fireEvent.click(screen.getByTestId('sample-asmt10-btn'))
    fireEvent.click(screen.getByTestId('analyze-notice-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('deadline-badge-uncertain')).toBeInTheDocument()
    })
    expect(screen.getByTestId('deadline-badge-uncertain')).toHaveTextContent(
      'Check the deadline on your notice'
    )
    expect(screen.queryByTestId('deadline-badge')).toBeNull()

    global.fetch = originalFetch
  })
})
