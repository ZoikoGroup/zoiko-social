/**
 * StoryRefCard — a resolved share-to-story reference that the viewer can see.
 */
export interface StoryRefCard {
  available: true
  type: 'feed_post' | 'profile' | 'community_post' | 'product'
  title: string
  subtitle: string
  /** Primary thumbnail — post media, profile avatar, or product image */
  thumbnailUrl: string | null
  /** Author / owner avatar */
  avatarUrl: string | null
  /** Deep link — opens the source entity */
  deepLink: string
}

/**
 * UnavailableCard — the source entity is deleted, private, or blocked.
 * The viewer sees "This content is no longer available."
 */
export interface UnavailableCard {
  available: false
  type: 'feed_post' | 'profile' | 'community_post' | 'product'
}

export type StoryRefResult = StoryRefCard | UnavailableCard

/**
 * StoryRefResolver — polymorphic reference resolution for shared stories.
 *
 * Each resolver handles one ref type (feed_post, profile, community_post, etc.)
 * and calls the source module's existing privacy gate so a deleted or
 * newly-private source entity resolves to UnavailableCard automatically.
 */
export interface StoryRefResolver {
  type: string
  resolve(refId: string, viewerId?: string): Promise<StoryRefResult>
}
