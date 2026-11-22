import MiniSearch from 'minisearch'
import { KbChunk } from '../../schemas/kb'

export interface RetrievalResult {
  chunk: KbChunk
  score: number
  matchType: 'EXACT_IDENTIFIER' | 'LEXICAL_SEARCH'
}

/**
 * Knowledge Base Retrieval Engine.
 * 1. Exact lookup by normalized identifier (e.g. "sec-61", "rule-99")
 * 2. Lexical search using MiniSearch over chunks
 */
export class RetrievalEngine {
  private chunksById = new Map<string, KbChunk>()
  private chunksByNormalizedId = new Map<string, KbChunk>()
  private searchIndex: MiniSearch<KbChunk>

  constructor(chunks: KbChunk[]) {
    this.searchIndex = new MiniSearch<KbChunk>({
      fields: ['identifier', 'title', 'content'],
      storeFields: ['id', 'identifier', 'title'],
      searchOptions: {
        boost: { identifier: 3, title: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    })

    this.indexChunks(chunks)
  }

  private indexChunks(chunks: KbChunk[]): void {
    for (const chunk of chunks) {
      this.chunksById.set(chunk.id, chunk)
      this.chunksByNormalizedId.set(chunk.normalizedId.toLowerCase(), chunk)
    }
    this.searchIndex.addAll(chunks)
  }

  /**
   * Exact lookup by normalized identifier (e.g., "sec-61", "rule-99", "asmt-10").
   */
  public getByIdentifier(identifier: string): KbChunk | null {
    const normalized = identifier.toLowerCase().replace(/[^a-z0-9]/g, '-')
    return this.chunksByNormalizedId.get(normalized) || null
  }

  /**
   * Retrieves chunk by unique chunk ID (e.g. "cgst-act-sec-61").
   */
  public getById(id: string): KbChunk | null {
    return this.chunksById.get(id) || null
  }

  /**
   * Hybrid retrieval: exact matches prioritized, then lexical search up to limit.
   */
  public search(query: string, limit: number = 5): RetrievalResult[] {
    const results: RetrievalResult[] = []
    const seenIds = new Set<string>()

    // 1. Try exact identifier matches for sections/rules cited in query
    const sectionMatches = query.match(/\b(?:Section|Sec\.?)\s*(\d{1,3})/gi) || []
    for (const s of sectionMatches) {
      const num = s.replace(/[^0-9]/g, '')
      const exact = this.getByIdentifier(`sec-${num}`)
      if (exact && !seenIds.has(exact.id)) {
        seenIds.add(exact.id)
        results.push({
          chunk: exact,
          score: 100,
          matchType: 'EXACT_IDENTIFIER',
        })
      }
    }

    // 2. Lexical search for remaining slots
    if (results.length < limit) {
      const searchHits = this.searchIndex.search(query)
      for (const hit of searchHits) {
        if (results.length >= limit) break
        if (!seenIds.has(hit.id)) {
          seenIds.add(hit.id)
          const chunk = this.chunksById.get(hit.id)
          if (chunk) {
            results.push({
              chunk,
              score: hit.score,
              matchType: 'LEXICAL_SEARCH',
            })
          }
        }
      }
    }

    return results.slice(0, limit)
  }
}
