import { Injectable } from '@nestjs/common'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

@Injectable()
export class EmojiHandler implements StickerHandler {
  readonly kind = 'emoji' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.emoji || typeof payload.emoji !== 'string') {
      throw new Error('Emoji sticker requires a string "emoji" field')
    }
    return { emoji: payload.emoji }
  }

  async hydrate(_payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    return {}
  }
}
