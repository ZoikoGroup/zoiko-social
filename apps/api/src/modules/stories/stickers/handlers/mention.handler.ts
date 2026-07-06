import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

@Injectable()
export class MentionHandler implements StickerHandler {
  readonly kind = 'mention' as const

  constructor(private readonly prisma: PrismaService) {}

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.userId || typeof payload.userId !== 'string') {
      throw new Error('Mention sticker requires a string "userId" field')
    }
    if (!payload.username || typeof payload.username !== 'string') {
      throw new Error('Mention sticker requires a string "username" field')
    }
    return {
      userId: payload.userId,
      username: payload.username,
    }
  }

  async hydrate(payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    // Resolve displayName + avatarUrl at view time in case they changed
    if (payload.userId && typeof payload.userId === 'string') {
      const profile = await this.prisma.profile.findUnique({
        where: { id: payload.userId as string },
        select: { displayName: true, avatarUrl: true },
      })
      if (profile) {
        return {
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
        }
      }
    }
    return {}
  }
}
