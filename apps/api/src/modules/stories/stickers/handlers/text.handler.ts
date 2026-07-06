import { Injectable } from '@nestjs/common'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

@Injectable()
export class TextHandler implements StickerHandler {
  readonly kind = 'text' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.text || typeof payload.text !== 'string') {
      throw new Error('Text sticker requires a string "text" field')
    }
    if (payload.text.length > 200) {
      throw new Error('Text sticker text must be at most 200 characters')
    }
    return {
      text: payload.text,
      font: payload.font ?? undefined,
      color: payload.color ?? undefined,
      size: payload.size ?? undefined,
    }
  }

  async hydrate(_payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    return {}
  }
}
