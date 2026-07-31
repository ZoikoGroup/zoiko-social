/**
 * Ranks search results by textual relevance against the query: an exact field
 * match outranks a prefix match, which outranks a plain substring match. Ties
 * keep the caller's original order (e.g. popularity/recency from the DB query)
 * as a stable secondary sort — this only reorders across relevance tiers.
 */
export function rankByRelevance<T>(
  query: string,
  items: T[],
  getFields: (item: T) => Array<string | null | undefined>,
): T[] {
  const q = query.trim().toLowerCase()
  if (!q || items.length <= 1) return items

  const scored = items.map((item, index) => {
    const fields = getFields(item)
      .filter((f): f is string => !!f)
      .map((f) => f.toLowerCase())

    let score = 0
    for (const field of fields) {
      if (field === q) score = Math.max(score, 3)
      else if (field.startsWith(q)) score = Math.max(score, 2)
      else if (field.includes(q)) score = Math.max(score, 1)
    }
    return { item, score, index }
  })

  scored.sort((a, b) => (b.score - a.score) || (a.index - b.index))
  return scored.map((s) => s.item)
}
