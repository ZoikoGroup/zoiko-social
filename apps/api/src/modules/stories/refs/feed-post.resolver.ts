import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import type { StoryRefResolver, StoryRefResult } from './ref-resolver.interface'

/**
 * Resolves a feed_post reference for share-to-story.
 * Calls PostsService's privacy gate through the Prisma layer — if the post
 * is deleted, the author is blocked, or the viewer can't see it, returns
 * UnavailableCard.
 */
@Injectable()
export class FeedPostResolver implements StoryRefResolver {
  readonly type = 'feed_post'

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
        mediaUrls: true,
        authorId: true,
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            isPrivate: true,
            state: true,
            verificationTier: true,
          },
        },
      },
    })

    if (!post || post.isDeleted || post.author.state !== 'active') {
      return { available: false, type: 'feed_post' }
    }

    // Privacy gate — viewer must be able to see the post
    if (viewerId && viewerId !== post.authorId) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: post.authorId, blockedId: viewerId },
            { blockerId: viewerId, blockedId: post.authorId },
          ],
        },
      })
      if (blocked) return { available: false, type: 'feed_post' }

      if (post.author.isPrivate) {
        const follow = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: post.authorId } },
        })
        if (follow?.status !== 'active') return { available: false, type: 'feed_post' }
      }
    }

    const caption = post.body
    return {
      available: true,
      type: 'feed_post',
      title: post.author.displayName,
      subtitle: caption ? caption.slice(0, 100) : 'View post',
      thumbnailUrl: post.mediaUrls[0] ?? null,
      avatarUrl: post.author.avatarUrl,
      deepLink: `/p/${post.id}`,
    }
  }
}
