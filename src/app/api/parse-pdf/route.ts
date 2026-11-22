import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

export const dynamic = 'force-dynamic'

interface ParsePdfResult {
  text: string
  numPages: number
  charCount: number
  filename: string
}

async function extractTextFromBuffer(buffer: Buffer, filename: string): Promise<ParsePdfResult> {
  const isTxt = filename.toLowerCase().endsWith('.txt')
  if (isTxt) {
    const text = buffer.toString('utf-8')
    return {
      text,
      numPages: 1,
      charCount: text.length,
      filename,
    }
  }

  const parsed = await pdfParse(buffer)
  const cleanedText = parsed.text.trim()
  return {
    text: cleanedText,
    numPages: parsed.numpages || 1,
    charCount: cleanedText.length,
    filename,
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form-data' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds maximum size of 10MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const result = await extractTextFromBuffer(buffer, file.name)

    if (!result.text || result.text.length < 10) {
      return NextResponse.json(
        {
          error:
            'Could not extract text from this PDF. Please ensure the PDF contains digital text rather than scanned images without OCR.',
        },
        { status: 422 }
      )
    }

    return NextResponse.json({
      success: true,
      text: result.text,
      numPages: result.numPages,
      charCount: result.charCount,
      filename: result.filename,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse file'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
