/**
 * Comprehensive emoji data powered by emojibase-data (Unicode Consortium).
 * Contains all 1,900+ standard Unicode emojis organized by category.
 */

import emojiData from 'emojibase-data/en/data.json'

// ── Types ──────────────────────────────────────────────────────────────────

interface EmojiEntry {
  label: string
  hexcode: string
  emoji: string
  text: string
  type: number
  version: number
  group?: number
  subgroup?: number
  order?: number
  tags?: string[]
}

export interface EmojiCategory {
  id: string
  label: string
  emojis: string[]
}

// ── Data processing ─────────────────────────────────────────────────────────

const GROUP_LABELS: Record<number, string> = {
  0: 'Smileys & Emotion',
  1: 'People & Body',
  2: 'Components',
  3: 'Animals & Nature',
  4: 'Food & Drink',
  5: 'Travel & Places',
  6: 'Activities',
  7: 'Objects',
  8: 'Symbols',
  9: 'Flags',
}

const GROUP_IDS: Record<number, string> = {
  0: 'smileys',
  1: 'people',
  2: 'components',
  3: 'nature',
  4: 'food',
  5: 'travel',
  6: 'activities',
  7: 'objects',
  8: 'symbols',
  9: 'flags',
}

// Filter to valid emoji characters. Require a real Unicode group so that
// group-less entries (e.g. regional indicator symbols, which render as plain
// A–Z letters) don't fall through to group 0 and pollute the Smileys tab.
const ALL_EMOJI_DATA = (emojiData as EmojiEntry[]).filter(
  (e) => e.emoji && e.emoji.length > 0 && e.type !== 2 && typeof e.group === 'number',
)

// Group emojis by their Unicode group (0-9), skipping components (group 2)
const grouped = new Map<number, string[]>()
for (const e of ALL_EMOJI_DATA) {
  const g = e.group as number
  if (g === 2) continue // Skin tone components — shown inline on emojis
  if (!grouped.has(g)) grouped.set(g, [])
  grouped.get(g)!.push(e.emoji)
}

// ── Exports ─────────────────────────────────────────────────────────────────

export const EMOJI_CATEGORIES: EmojiCategory[] = Array.from(grouped.entries())
  .sort(([a], [b]) => a - b)
  .map(([group, emojis]) => ({
    id: GROUP_IDS[group] ?? 'other',
    label: GROUP_LABELS[group] ?? 'Other',
    emojis,
  }))

/** Flat list of all emoji characters for quick lookup */
export const ALL_EMOJIS = ALL_EMOJI_DATA.map((e) => e.emoji)

/**
 * Search emojis by label or tags.
 * Uses the Unicode CLDR data for comprehensive name-based search.
 */
export function searchEmojis(query: string): string[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const results = ALL_EMOJI_DATA.filter((e) => {
    if (e.label.toLowerCase().includes(q)) return true
    if (e.tags?.some((t) => t.toLowerCase().includes(q))) return true
    return false
  })

  return results.map((e) => e.emoji)
}
