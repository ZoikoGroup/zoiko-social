import { Injectable } from '@nestjs/common'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

@Injectable()
export class GifHandler implements StickerHandler {
  readonly kind = 'gif' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.gifUrl || typeof payload.gifUrl !== 'string') {
      throw new Error('GIF sticker requires a string "gifUrl" field')
    }
    if (!payload.provider || typeof payload.provider !== 'string') {
      throw new Error('GIF sticker requires a string "provider" field')
    }
    return {
      gifUrl: payload.gifUrl,
      provider: payload.provider,
      width: typeof payload.width === 'number' ? payload.width : undefined,
      height: typeof payload.height === 'number' ? payload.height : undefined,
    }
  }

  async hydrate(_payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    return {}
  }
}
