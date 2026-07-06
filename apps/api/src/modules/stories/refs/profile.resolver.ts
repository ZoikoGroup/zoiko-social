import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import type { StoryRefResolver, StoryRefResult } from './ref-resolver.interface'

/**
 * Resolves a profile reference for share-to-story.
 * Returns available for active accounts the viewer can see; UnavailableCard
 * for deleted, blocked, or private accounts the viewer doesn't follow.
 */
@Injectable()
export class ProfileResolver implements StoryRefResolver {
  readonly type = 'profile'

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async resolve(refId: string, viewerId?: string): Promise<StoryRefResult> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: refId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        isPrivate: true,
        state: true,
        professionalProfile: { select: { isVerified: true } },
      },
    })

    if (!profile || profile.state !== 'active') {
      return { available: false, type: 'profile' }
    }

    // Privacy gate — blocked users can't see the profile
    if (viewerId && viewerId !== profile.id) {
      const blocked = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: profile.id, blockedId: viewerId },
            { blockerId: viewerId, blockedId: profile.id },
          ],
        },
      })
      if (blocked) return { available: false, type: 'profile' }

      // Private accounts — only visible to accepted followers
      if (profile.isPrivate) {
        const follow = await this.prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: profile.id } },
        })
        if (follow?.status !== 'active') return { available: false, type: 'profile' }
      }
    }

    const isProfessional = !!profile.professionalProfile
    return {
      available: true,
      type: 'profile',
      title: profile.displayName,
      subtitle: isProfessional
        ? (profile.professionalProfile?.isVerified ? 'Verified Professional' : 'Professional')
        : `@${profile.username}`,
      thumbnailUrl: null,
      avatarUrl: profile.avatarUrl,
      deepLink: `/profile/${profile.username}`,
    }
  }
}
