import { Injectable, OnModuleInit } from '@nestjs/common'
import type { StoryRefResolver, StoryRefResult, UnavailableCard } from './ref-resolver.interface'
import { FeedPostResolver } from './feed-post.resolver'
import { ProfileResolver } from './profile.resolver'
import { CommunityPostResolver } from './community-post.resolver'

/**
 * RefResolverService — resolves polymorphic story references.
 *
 * Each resolver is registered by `type` and handles one ref kind
 * (feed_post, profile, community_post, product). At view time the
 * registry calls the matching resolver, which runs the source module's
 * privacy gate and returns either a StoryRefCard or UnavailableCard.
 *
 * This implements the "always-live privacy" requirement: a post that
 * goes private or a profile that blocks the viewer instantly resolves
 * to "This content is no longer available."
 */
@Injectable()
export class RefResolverService implements OnModuleInit {
  private readonly resolvers = new Map<string, StoryRefResolver>()

  constructor(
    private readonly feedPost: FeedPostResolver,
    private readonly profile: ProfileResolver,
    private readonly communityPost: CommunityPostResolver,
  ) {}

  onModuleInit(): void {
    this.register(this.feedPost)
    this.register(this.profile)
    this.register(this.communityPost)
  }

  private register(resolver: StoryRefResolver): void {
    this.resolvers.set(resolver.type, resolver)
  }

  /**
   * Resolve a reference by type. If no resolver is registered for the type
   * (e.g. a future marketplace product), returns UnavailableCard.
   */
  async resolve(refType: string, refId: string, viewerId?: string): Promise<StoryRefResult> {
    const resolver = this.resolvers.get(refType)
    if (!resolver) {
      return { available: false, type: refType as UnavailableCard['type'] }
    }
    try {
      return await resolver.resolve(refId, viewerId)
    } catch {
      // Any error during resolution is treated as unavailable — the story
      // itself is not affected, only the embedded reference degrades.
      return { available: false, type: refType as UnavailableCard['type'] }
    }
  }
}
