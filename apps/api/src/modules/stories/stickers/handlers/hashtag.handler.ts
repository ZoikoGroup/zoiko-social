import { Injectable } from '@nestjs/common'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

@Injectable()
export class HashtagHandler implements StickerHandler {
  readonly kind = 'hashtag' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.tag || typeof payload.tag !== 'string') {
      throw new Error('Hashtag sticker requires a string "tag" field')
    }
    if (payload.tag.length > 50) {
      throw new Error('Hashtag tag must be at most 50 characters')
    }
    return { tag: payload.tag.toLowerCase() }
  }

  async hydrate(_payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    return {}
  }
}
