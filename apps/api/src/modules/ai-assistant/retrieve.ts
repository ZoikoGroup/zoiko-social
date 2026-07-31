import { KNOWLEDGE_BASE, type KnowledgeEntry } from './knowledge-base'

/**
 * Picks the knowledge-base entries most relevant to a question, so only the
 * useful slice of platform documentation is spent on the model's context window.
 *
 * Scoring: a keyword phrase found in the question scores by its word count, so a
 * specific multi-word hit ("health passport") outweighs a generic single word
 * ("pet"); a topic-title hit adds a smaller bonus. Entries scoring zero are
 * dropped entirely rather than padded in, which keeps off-topic questions from
 * dragging in irrelevant docs.
 */

const MAX_ENTRIES = 3
/** Single words too common in pet questions to signal anything on their own. */
const WEAK_KEYWORDS = new Set(['pet', 'pets', 'post', 'tag', 'listing', 'private'])

export function retrieveKnowledge(question: string, limit = MAX_ENTRIES): KnowledgeEntry[] {
  const haystack = question.toLowerCase()
  if (haystack.trim().length === 0) return []

  const scored = KNOWLEDGE_BASE.map((entry, index) => {
    let score = 0

    for (const keyword of entry.keywords) {
      if (!haystack.includes(keyword)) continue
      const words = keyword.split(' ').length
      score += words === 1 && WEAK_KEYWORDS.has(keyword) ? 0.5 : words
    }

    if (haystack.includes(entry.topic.toLowerCase())) score += 1

    return { entry, score, index }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((s) => s.entry)
}

/** Formats retrieved entries as the reference block appended to the system prompt. */
export function formatKnowledgeContext(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) return ''
  const sections = entries.map((e) => `## ${e.topic}\n${e.content}\nDocs: ${e.docsPath}`)
  return `Reference material from the ZoikoSocial documentation. Prefer these facts over your own assumptions, and mention the relevant docs page when it would help the member read more:\n\n${sections.join('\n\n')}`
}
