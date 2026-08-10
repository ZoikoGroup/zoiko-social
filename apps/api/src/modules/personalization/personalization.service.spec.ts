import { interestBoost, scorePost, rankPosts, type ScoreablePost } from './personalization.service'
import { EMPTY_AFFINITY, type AffinityProfile } from './affinity.service'

const NOW = Date.parse('2026-08-01T12:00:00Z')

function makePost(overrides: Partial<ScoreablePost> = {}): ScoreablePost {
  return {
    id: 'p1',
    authorId: 'author-1',
    communityId: null,
    kind: 'standard',
    likesCount: 10,
    commentsCount: 2,
    savesCount: 1,
    sharesCount: 0,
    createdAt: new Date(NOW - 3_600_000), // 1 hour old
    author: { verificationTier: 'regular' },
    hashtags: [{ hashtag: { tag: 'dogs' } }],
    ...overrides,
  }
}

describe('personalization scoring', () => {
  describe('interestBoost', () => {
    it('is 1.0 (no boost) for an empty profile — cold start falls back to popularity', () => {
      expect(interestBoost(EMPTY_AFFINITY, makePost())).toBe(1)
    })

    it('is 1.0 when the profile has no affinity for this post', () => {
      const profile: AffinityProfile = {
        ...EMPTY_AFFINITY,
        authors: new Map([['someone-else', 100]]),
        known: true,
      }
      expect(interestBoost(profile, makePost())).toBe(1)
    })

    it('grows sublinearly with author affinity (boost = 1 + log₁₀(1 + aff))', () => {
      const boostAt = (aff: number) =>
        interestBoost({ ...EMPTY_AFFINITY, authors: new Map([['author-1', aff]]), known: true }, makePost())
      // Exact log₁₀ identities: 1+9=10 → 2, 1+99=100 → 3, 1+999=1000 → 4
      expect(boostAt(9)).toBeCloseTo(2, 5)
      expect(boostAt(99)).toBeCloseTo(3, 5)
      expect(boostAt(999)).toBeCloseTo(4, 5)
      // Sublinear: 111× affinity yields only ~3× boost, never linear
      expect(boostAt(999)).toBeLessThan(4.01)
    })

    it('sums author + community + tag + kind affinities', () => {
      const authorOnly = interestBoost(
        { ...EMPTY_AFFINITY, authors: new Map([['author-1', 3]]), known: true },
        makePost(),
      )
      const all = interestBoost(
        {
          ...EMPTY_AFFINITY,
          authors: new Map([['author-1', 3]]),
          tags: new Map([['dogs', 10]]),
          communities: new Map([['comm-1', 5]]),
          kinds: new Map([['standard', 7]]),
          known: true,
        },
        makePost({ communityId: 'comm-1' }),
      )
      expect(all).toBeGreaterThan(authorOnly)
    })
  })

  describe('scorePost', () => {
    it('scores a fresh post above an identical older post', () => {
      const fresh = makePost({ id: 'fresh', createdAt: new Date(NOW - 3_600_000) })
      const old = makePost({ id: 'old', createdAt: new Date(NOW - 72 * 3_600_000) })
      expect(scorePost(EMPTY_AFFINITY, fresh, NOW, 'explore')).toBeGreaterThan(
        scorePost(EMPTY_AFFINITY, old, NOW, 'explore'),
      )
    })

    it('scores an engaging post above a quiet post', () => {
      const quiet = makePost({ id: 'quiet', likesCount: 0, commentsCount: 0, savesCount: 0 })
      const engaging = makePost({ id: 'engaging', likesCount: 100, commentsCount: 20, savesCount: 10 })
      expect(scorePost(EMPTY_AFFINITY, engaging, NOW, 'explore')).toBeGreaterThan(
        scorePost(EMPTY_AFFINITY, quiet, NOW, 'explore'),
      )
    })

    it('prefers a moderately-engaging high-affinity author over a slightly more popular stranger', () => {
      const profile: AffinityProfile = {
        ...EMPTY_AFFINITY,
        authors: new Map([['loved-author', 200]]),
        known: true,
      }
      const loved = makePost({ id: 'loved', authorId: 'loved-author', likesCount: 12 })
      const popular = makePost({ id: 'popular', authorId: 'stranger', likesCount: 30 })
      expect(scorePost(profile, loved, NOW, 'explore')).toBeGreaterThan(
        scorePost(profile, popular, NOW, 'explore'),
      )
      // …but a genuinely viral stranger post still wins (popularity floor)
      const viral = makePost({ id: 'viral', authorId: 'stranger', likesCount: 2_000 })
      expect(scorePost(profile, viral, NOW, 'explore')).toBeGreaterThan(
        scorePost(profile, loved, NOW, 'explore'),
      )
    })

    it('gives professional authors the existing 1.3× trust boost', () => {
      const pro = makePost({ author: { verificationTier: 'professional' } })
      const regular = makePost({ author: { verificationTier: 'regular' } })
      const ratio = scorePost(EMPTY_AFFINITY, pro, NOW, 'explore') / scorePost(EMPTY_AFFINITY, regular, NOW, 'explore')
      expect(ratio).toBeCloseTo(1.3, 5)
    })
  })

  describe('rankPosts', () => {
    it('orders the pool best-first (affinity lifts the loved author above an older viral post)', () => {
      const profile: AffinityProfile = {
        ...EMPTY_AFFINITY,
        authors: new Map([['loved', 150]]),
        known: true,
      }
      const posts = [
        // 24h-old viral stranger post — recency decay brings it below the fresh loved post
        makePost({ id: 'stranger-viral', authorId: 'stranger', likesCount: 200, createdAt: new Date(NOW - 24 * 3_600_000) }),
        makePost({ id: 'loved-fresh', authorId: 'loved', likesCount: 5 }),
        makePost({ id: 'stranger-quiet', authorId: 'stranger', likesCount: 1, createdAt: new Date(NOW - 48 * 3_600_000) }),
      ]
      const ranked = rankPosts(profile, posts, NOW, 'explore')
      expect(ranked.map((r) => r.post.id)).toEqual(['loved-fresh', 'stranger-viral', 'stranger-quiet'])
    })

    it('orders deterministically (descending score) on an empty profile', () => {
      const posts = [
        makePost({ id: 'a', likesCount: 5, createdAt: new Date(NOW - 2 * 3_600_000) }),
        makePost({ id: 'b', likesCount: 50, createdAt: new Date(NOW - 5 * 3_600_000) }),
        makePost({ id: 'c', likesCount: 500, createdAt: new Date(NOW - 20 * 3_600_000) }),
      ]
      const ranked = rankPosts(EMPTY_AFFINITY, posts, NOW, 'explore')
      const scores = ranked.map((r) => r.score)
      const sorted = [...scores].sort((a, b) => b - a)
      expect(scores).toEqual(sorted) // deterministic best-first order
      expect(ranked).toHaveLength(3)
    })
  })
})
