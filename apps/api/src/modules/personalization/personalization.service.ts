import { Injectable } from '@nestjs/common'
import type { AffinityProfile } from './affinity.service'
import { AffinityService } from './affinity.service'

/**
 * PersonalizationService — the ranking half of the engine.
 *
 * Scores posts for a viewer using their affinity profile blended with
 * popularity and recency — the "WeightedRanking" strategy the feed
 * architecture doc reserves (docs/feed-posts-architecture.md).
 *
 * Scoring model (Instagram-flavoured):
 *
 *   score = interestBoost × engagement × recencyDecay × authorTrust
 *
 *   interestBoost = 1 + log₁₀(1 + affinityScore)        — sublinear so a
 *     passionate user can't drown everyone out; affinityScore is the sum of
 *     author + community + kind + tag affinities for this post, each scaled.
 *   engagement    = 1 + likes + 3·comments + 5·saves + 6·shares (weighted
 *     intent; matches the Explore v1 formula so cold start ≈ today's output).
 *   recencyDecay  = (ageHours + 2)^-1.5                  — gravity decay,
 *     same shape as the existing Explore ranker.
 *   authorTrust   = 1.3 for professional/verified authors (existing boost).
 *
 * Cold start: when a user has no affinity profile (`known === false`) the
 * interestBoost collapses to 1.0 and ranking is byte-for-byte the previous
 * Explore formula — personalization only appears as the model fills in.
 *
 * Home vs Explore:
 *   - Explore ranks a fixed candidate pool with the full formula above.
 *   - Home also personalises: followed + own + community posts are pulled into
 *     a bounded recent pool, scored with the same formula (recency matters
 *     more on Home — freshness is the top signal on the home feed), then
 *     offset-paginated exactly like Explore's ranked pool.
 *
 * The scoring function is pure — easily unit-tested and swappable for a real
 * ML model later (same inputs, same seam).
 */

/** Weight applied to each affinity dimension when computing interestBoost. */
const DIMENSION_WEIGHTS = {
  author: 1.0,
  community: 0.8,
  tag: 0.4,
  kind: 0.3,
} as const


export interface ScoreablePost {
  id: string
  authorId: string
  communityId: string | null
  kind: string
  likesCount: number
  commentsCount: number
  savesCount: number
  sharesCount: number
  createdAt: Date
  author: { verificationTier: string }
  hashtags: { hashtag: { tag: string } }[]
}

export type RankMode = 'home' | 'explore'

export interface RankedPost<T> {
  post: T
  score: number
}

export function affinityScoreForPost(profile: AffinityProfile, post: ScoreablePost): number {
  let score = (profile.authors.get(post.authorId) ?? 0) * DIMENSION_WEIGHTS.author

  if (post.communityId) {
    score += (profile.communities.get(post.communityId) ?? 0) * DIMENSION_WEIGHTS.community
  }

  score += (profile.kinds.get(post.kind) ?? 0) * DIMENSION_WEIGHTS.kind

  // Sum the strongest tag affinities (all tags, capped for safety)
  for (const { hashtag } of post.hashtags ?? []) {
    score += (profile.tags.get(hashtag.tag) ?? 0) * DIMENSION_WEIGHTS.tag
  }

  return score
}

export function interestBoost(profile: AffinityProfile, post: ScoreablePost): number {
  const raw = affinityScoreForPost(profile, post)
  if (raw <= 0) return 1
  return 1 + Math.log10(1 + raw)
}

export function engagementScore(post: ScoreablePost): number {
  return 1 + post.likesCount + 3 * post.commentsCount + 5 * post.savesCount + 6 * post.sharesCount
}

export function recencyDecay(ageHours: number): number {
  return Math.pow(ageHours + 2, 1.5)
}

export function authorTrust(post: ScoreablePost): number {
  return post.author?.verificationTier === 'professional' ? 1.3 : 1
}

export function scorePost(
  profile: AffinityProfile,
  post: ScoreablePost,
  now: number,
  mode: RankMode,
): number {
  const ageHours = (now - post.createdAt.getTime()) / 3_600_000
  const boost = interestBoost(profile, post)
  const trust = authorTrust(post)

  if (mode === 'home') {
    // Home: freshness dominates — engagement is log-scaled so a fresh post
    // from anyone ranks well, while affinity tilts toward the authors/tags/
    // communities/kinds you actually engage with.
    const engagement = 1 + Math.log1p(engagementScore(post))
    return (boost * engagement * trust) / recencyDecay(ageHours)
  }

  // Explore: linear engagement — genuinely viral posts reach non-followers on
  // merit, with the personalization boost on top (cold start = 1.0, identical
  // to the previous popularity-only Explore formula).
  return (boost * engagementScore(post) * trust) / recencyDecay(ageHours)
}

/** Sort a pool of posts by the personalized score, highest first. */
export function rankPosts<T extends ScoreablePost>(
  profile: AffinityProfile,
  posts: T[],
  now: number,
  mode: RankMode,
): RankedPost<T>[] {
  return posts
    .map((post) => ({ post, score: scorePost(profile, post, now, mode) }))
    .sort((a, b) => b.score - a.score)
}

@Injectable()
export class PersonalizationService {
  constructor(private readonly affinity: AffinityService) {}

  /**
   * Load the viewer's profile (pool-scoped reads) and rank a candidate pool.
   * Returns the pool ordered by predicted interest (no diversification — the
   * caller applies per-author caps after ranking, matching the existing
   * Explore pattern).
   */
  async rank<T extends ScoreablePost>(
    viewerId: string,
    pool: T[],
    mode: RankMode,
    now = Date.now(),
  ): Promise<RankedPost<T>[]> {
    if (pool.length === 0) return []
    const profile = await this.affinity.getProfileForPool(viewerId, pool)
    return rankPosts(profile, pool, now, mode)
  }
}

