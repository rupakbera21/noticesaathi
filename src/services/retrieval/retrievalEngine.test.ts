import { RetrievalEngine } from './retrievalEngine'
import { KbChunk } from '../../schemas/kb'

describe('RetrievalEngine', () => {
  const mockChunks: KbChunk[] = [
    {
      id: 'cgst-act-sec-61',
      actOrRules: 'CGST_ACT_2017',
      identifier: 'Section 61',
      normalizedId: 'sec-61',
      title: 'Scrutiny of Returns',
      content: 'The proper officer may scrutinize the return and related particulars to verify the correctness of the return.',
      effectiveDate: '2017-07-01',
      sourceUrl: 'https://taxinformation.cbic.gov.in',
      authority: 'CBIC',
      fetchedAt: '2026-11-21T10:00:00Z',
      checksum: 'abc123sha256',
    },
    {
      id: 'cgst-act-sec-50',
      actOrRules: 'CGST_ACT_2017',
      identifier: 'Section 50',
      normalizedId: 'sec-50',
      title: 'Interest on delayed payment of tax',
      content: 'Every person who is liable to pay tax fails to pay shall pay interest at eighteen percent per annum.',
      effectiveDate: '2017-07-01',
      sourceUrl: 'https://taxinformation.cbic.gov.in',
      authority: 'CBIC',
      fetchedAt: '2026-11-21T10:00:00Z',
      checksum: 'def456sha256',
    },
    {
      id: 'cgst-act-sec-73',
      actOrRules: 'CGST_ACT_2017',
      identifier: 'Section 73',
      normalizedId: 'sec-73',
      title: 'Determination of tax not paid for reasons other than fraud',
      content: 'Where it appears that tax has not been paid for reasons other than fraud, a notice shall be served.',
      effectiveDate: '2017-07-01',
      sourceUrl: 'https://taxinformation.cbic.gov.in',
      authority: 'CBIC',
      fetchedAt: '2026-11-21T10:00:00Z',
      checksum: 'ghi789sha256',
    },
  ]

  const engine = new RetrievalEngine(mockChunks)

  it('performs exact lookup by normalized identifier', () => {
    const chunk = engine.getByIdentifier('sec-61')
    expect(chunk).not.toBeNull()
    expect(chunk?.identifier).toBe('Section 61')
    expect(chunk?.title).toBe('Scrutiny of Returns')
  })

  it('retrieves by unique chunk ID', () => {
    const chunk = engine.getById('cgst-act-sec-50')
    expect(chunk).not.toBeNull()
    expect(chunk?.identifier).toBe('Section 50')
  })

  it('prioritizes exact section identifier matches in search queries', () => {
    const results = engine.search('Notice intimating discrepancy under Section 61 with tax demand', 3)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]?.chunk.identifier).toBe('Section 61')
    expect(results[0]?.matchType).toBe('EXACT_IDENTIFIER')
  })

  it('falls back to lexical keyword search when no exact section is cited', () => {
    const results = engine.search('proper officer verify correctness of return', 2)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]?.chunk.id).toBe('cgst-act-sec-61')
    expect(results[0]?.matchType).toBe('LEXICAL_SEARCH')
  })
})
