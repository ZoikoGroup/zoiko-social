import { newsSlots } from './feed.service'

/**
 * Where news cards land inside a page of posts.
 *
 * The client looks cards up by their index, so a duplicate index does not
 * render two cards in one place — it drops one silently. That makes uniqueness
 * the property worth testing hardest, across the full range of shapes this
 * deployment actually produces: 262 articles against 15 posts, and every
 * degenerate case around the edges.
 */

describe('newsSlots', () => {
  it('gives one index per article', () => {
    expect(newsSlots(30, 15)).toHaveLength(30)
  })

  it('never repeats an index, across every combination that matters', () => {
    for (let articles = 0; articles <= 40; articles++) {
      for (let posts = 0; posts <= 40; posts++) {
        const slots = newsSlots(articles, posts)
        expect(new Set(slots).size).toBe(slots.length)
      }
    }
  })

  it('returns indices in ascending order so the feed reads top to bottom', () => {
    for (const [articles, posts] of [[30, 15], [7, 30], [30, 1], [5, 5], [1, 12]]) {
      const slots = newsSlots(articles!, posts!)
      const sorted = [...slots].sort((a, b) => a - b)
      expect(slots).toEqual(sorted)
    }
  })

  it('spreads a few cards through a longer page rather than bunching them', () => {
    // 3 cards among 30 posts should be spaced out, not stacked at one end.
    const slots = newsSlots(3, 30)
    expect(slots).toEqual([9, 19, 29])
  })

  it('keeps inline cards within the posts', () => {
    const posts = 15
    for (const slot of newsSlots(10, posts)) {
      expect(slot).toBeLessThan(posts)
      expect(slot).toBeGreaterThanOrEqual(0)
    }
  })

  it('positions the overflow past the last post, where the client appends it', () => {
    // The real shape here: far more articles than posts.
    const posts = 4
    const slots = newsSlots(30, posts)
    const inline = slots.filter((s) => s < posts)
    const appended = slots.filter((s) => s >= posts)
    expect(inline).toHaveLength(4)
    expect(appended).toHaveLength(26)
    // Contiguous from the end of the posts, so nothing is skipped over.
    expect(appended).toEqual(Array.from({ length: 26 }, (_, i) => posts + i))
  })

  it('puts every card after the end when there are no posts at all', () => {
    // A brand-new member follows nobody; the page is entirely articles.
    expect(newsSlots(5, 0)).toEqual([0, 1, 2, 3, 4])
  })

  it('handles a single post', () => {
    const slots = newsSlots(3, 1)
    expect(slots[0]).toBe(0)
    expect(new Set(slots).size).toBe(3)
  })

  it('returns nothing for no articles', () => {
    expect(newsSlots(0, 15)).toEqual([])
    expect(newsSlots(0, 0)).toEqual([])
  })

  it('treats a negative post count as none rather than producing junk', () => {
    expect(() => newsSlots(3, -5)).not.toThrow()
    expect(new Set(newsSlots(3, -5)).size).toBe(3)
  })

  it('produces a whole integer for every index', () => {
    for (const slot of newsSlots(30, 7)) {
      expect(Number.isInteger(slot)).toBe(true)
    }
  })
})
