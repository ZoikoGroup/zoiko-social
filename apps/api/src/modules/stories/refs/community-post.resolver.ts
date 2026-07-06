import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import type { StoryRefResolver, StoryRefResult } from './ref-resolver.interface'

/**
 * Resolves a community post reference for share-to-story.
 * The viewer must be able to see the community post (community membership +
 * privacy gate). Returns UnavailableCard for deleted, blocked, or
 * private-community posts the viewer isn't a member of.
 */
@Injectable()
export class CommunityPostResolver implements StoryRefResolver {
  readonly type = 'community_post'

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async resolve(refId: string, viewerId?: string): Promise<StoryRefResult> {
    const post = await this.prisma.post.findUnique({
      where: { id: refId },
      select: {
        id: true,
        body: true,
        isDeleted: true,
        communityId: true,
        authorId: true,
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, state: true },
        },
        community: {
          select: { id: true, slug: true, name: true, privacy: true },
        },
      },
    })

    if (!post || post.isDeleted || post.author.state !== 'active' || !post.community) {
      return { available: false, type: 'community_post' }
    }

    // Privacy gate — blocked users can't see anything
    if (viewerId && viewerId !== post.authorId) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: post.authorId, blockedId: viewerId },
            { blockerId: viewerId, blockedId: post.authorId },
          ],
        },
      })
      if (blocked) return { available: false, type: 'community_post' }
    }

    // Private or invite-only community — viewer must be an active member
    if (post.community.privacy !== 'public' && viewerId) {
      const membership = await this.prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId: post.community.id, userId: viewerId } },
        select: { status: true },
      })
      if (membership?.status !== 'active') return { available: false, type: 'community_post' }
    } else if (post.community.privacy !== 'public' && !viewerId) {
      return { available: false, type: 'community_post' }
    }

    const caption = post.body
    return {
      available: true,
      type: 'community_post',
      title: post.community.name,
      subtitle: caption ? caption.slice(0, 100) : `by ${post.author.displayName}`,
      thumbnailUrl: null,
      avatarUrl: post.author.avatarUrl,
      deepLink: `/c/${post.community.slug}/p/${post.id}`,
    }
  }
}
