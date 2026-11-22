/**
 * @jest-environment node
 */
import { POST } from './route'
import { NextRequest } from 'next/server'

jest.mock('pdf-parse', () => {
  return jest.fn((buffer: Buffer) => {
    if (buffer.toString().includes('CORRUPTED')) {
      return Promise.reject(new Error('Corrupted PDF'))
    }
    if (buffer.toString().includes('EMPTY')) {
      return Promise.resolve({ text: '', numpages: 1 })
    }
    return Promise.resolve({
      text: 'FORM GST ASMT-10 Notice for Scrutiny of Returns',
      numpages: 2,
    })
  })
})

function createMockFormDataRequest(file: File | null) {
  const formData = new FormData()
  if (file) {
    formData.append('file', file)
  }
  return {
    formData: () => Promise.resolve(formData),
  } as unknown as NextRequest
}

describe('POST /api/parse-pdf', () => {
  it('returns 400 if no file is provided', async () => {
    const req = createMockFormDataRequest(null)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toContain('No file provided')
  })

  it('returns 400 if file exceeds 10MB', async () => {
    const bigFile = new File(['a'], 'huge.pdf', { type: 'application/pdf' })
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })
    const req = createMockFormDataRequest(bigFile)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toContain('exceeds maximum size')
  })

  it('extracts plain text from a .txt file directly', async () => {
    const textContent = 'FORM GST DRC-01 Summary of Show Cause Notice under Section 74'
    const textFile = new File([textContent], 'notice.txt', { type: 'text/plain' })
    const req = createMockFormDataRequest(textFile)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.text).toBe(textContent)
    expect(json.charCount).toBe(textContent.length)
  })

  it('parses a valid PDF file and returns extracted text', async () => {
    const pdfFile = new File(['%PDF-1.4 sample content'], 'notice.pdf', { type: 'application/pdf' })
    const req = createMockFormDataRequest(pdfFile)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.text).toContain('FORM GST ASMT-10')
    expect(json.numPages).toBe(2)
  })

  it('returns 422 if extracted text is empty or too short', async () => {
    const emptyPdf = new File(['EMPTY'], 'empty.pdf', { type: 'application/pdf' })
    const req = createMockFormDataRequest(emptyPdf)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(422)
    expect(json.error).toContain('Could not extract text')
  })

  it('returns 500 if PDF parsing throws an exception', async () => {
    const badPdf = new File(['CORRUPTED'], 'corrupt.pdf', { type: 'application/pdf' })
    const req = createMockFormDataRequest(badPdf)
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.error).toContain('Corrupted PDF')
  })
})
