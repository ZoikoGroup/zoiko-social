/**
 * Tag normalisation, shared by every entity that carries a `tags` array.
 *
 * Tags are only useful if `#Beagle`, `beagle` and ` #BEAGLE ` all land on the
 * same tag page, so normalisation has to happen on write — the GIN index does
 * exact containment matching and cannot fold case for us.
 *
 * Deliberately narrow: letters, digits and underscore. Allowing spaces or
 * punctuation would let two visually identical tags exist as different strings,
 * which is the failure this function exists to prevent.
 */

/** Matches the hashtag grammar used for post bodies elsewhere in the API. */
const ALLOWED = /[^a-z0-9_]/g

/** Long enough for real words, short enough to stay a tag rather than a caption. */
export const MAX_TAG_LENGTH = 40

/** How many tags one entity may carry. */
export const MAX_TAGS = 10

/**
 * Clean one tag, or return null if nothing usable survives.
 *
 * Returning null rather than an empty string means callers can `.filter(Boolean)`
 * and never end up storing a tag nobody can search for.
 */
export function normalizeTag(raw: string): string | null {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^#+/, '')
    .replace(ALLOWED, '')
    .slice(0, MAX_TAG_LENGTH)
  return cleaned.length > 0 ? cleaned : null
}

/**
 * Clean a list of tags: normalised, de-duplicated, order preserved, capped.
 *
 * Order is preserved because the first tags someone types are the ones they
 * consider most descriptive, and that is the order they will be displayed in.
 */
export function normalizeTags(raw: string[] | undefined | null): string[] {
  if (!raw || raw.length === 0) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const tag of raw) {
    const clean = normalizeTag(tag)
    if (!clean || seen.has(clean)) continue
    seen.add(clean)
    out.push(clean)
    if (out.length >= MAX_TAGS) break
  }
  return out
}
