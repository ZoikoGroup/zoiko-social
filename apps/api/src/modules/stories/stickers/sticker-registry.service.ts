import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import type { StickerHandler, StickerKind, StickerPayload, StickerRenderItem, StickerTransform } from './sticker-handler.interface'
import { EmojiHandler } from './handlers/emoji.handler'
import { TextHandler } from './handlers/text.handler'
import { GifHandler } from './handlers/gif.handler'
import { MentionHandler } from './handlers/mention.handler'
import { HashtagHandler } from './handlers/hashtag.handler'
import { TimeHandler } from './handlers/time.handler'
import { DateHandler } from './handlers/date.handler'
import { WeatherStubHandler, PollStubHandler, QuestionStubHandler, CountdownStubHandler } from './handlers/future-stubs'

export interface StickerInput {
  kind: StickerKind
  payload: StickerPayload
  transform: StickerTransform
}

/**
 * StickerRegistryService — registry of StickerHandlers keyed by kind.
 *
 * On module init, all known handlers (active + future-ready stubs) are
 * registered. The registry dispatches:
 *   - `validate(kind, payload)` → validated payload or throw
 *   - `hydrate(kind, payload, viewerId)` → render-ready data
 *   - `onInteract(kind, storyId, viewerId, action, payload)` → interaction
 *
 * Adding a new sticker type = one new handler class + registering it here.
 * No changes to stories.service.ts, the controller, or the module are needed
 * beyond the registration line.
 */
@Injectable()
export class StickerRegistryService implements OnModuleInit {
  private readonly logger = new Logger(StickerRegistryService.name)
  private readonly handlers = new Map<StickerKind, StickerHandler>()

  constructor(
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.register(this.moduleRef.get(EmojiHandler, { strict: false }))
    this.register(this.moduleRef.get(TextHandler, { strict: false }))
    this.register(this.moduleRef.get(GifHandler, { strict: false }))
    this.register(this.moduleRef.get(MentionHandler, { strict: false }))
    this.register(this.moduleRef.get(HashtagHandler, { strict: false }))
    this.register(this.moduleRef.get(TimeHandler, { strict: false }))
    this.register(this.moduleRef.get(DateHandler, { strict: false }))
    this.register(this.moduleRef.get(WeatherStubHandler, { strict: false }))
    this.register(this.moduleRef.get(PollStubHandler, { strict: false }))
    this.register(this.moduleRef.get(QuestionStubHandler, { strict: false }))
    this.register(this.moduleRef.get(CountdownStubHandler, { strict: false }))
    this.logger.log(`Sticker registry initialized with ${this.handlers.size} handlers`)
  }

  /** Register a sticker handler. */
  register(handler: StickerHandler): void {
    if (this.handlers.has(handler.kind)) {
      this.logger.warn(`Overwriting existing handler for sticker kind "${handler.kind}"`)
    }
    this.handlers.set(handler.kind, handler)
  }

  /** Get a handler by kind. Returns undefined for unknown types. */
  get(kind: StickerKind): StickerHandler | undefined {
    return this.handlers.get(kind)
  }

  /** Validate a sticker's payload against its handler. Throws on invalid data. */
  validate(kind: StickerKind, payload: StickerPayload): StickerPayload {
    const handler = this.handlers.get(kind)
    if (!handler) {
      throw new Error(`Unknown sticker kind: "${kind}"`)
    }
    return handler.validate(payload)
  }

  /** Hydrate render-time data for a sticker. */
  async hydrate(kind: StickerKind, payload: StickerPayload, viewerId?: string): Promise<Record<string, unknown>> {
    const handler = this.handlers.get(kind)
    if (!handler) return {}
    try {
      return await handler.hydrate(payload, viewerId)
    } catch (err) {
      this.logger.warn(`Sticker hydrate failed for "${kind}": ${(err as Error).message}`)
      return {}
    }
  }

  /** Handle user interaction with a sticker. No-op for handlers that don't support it. */
  async onInteract(kind: StickerKind, storyId: string, viewerId: string, action: string, payload?: Record<string, unknown>): Promise<void> {
    const handler = this.handlers.get(kind)
    if (!handler?.onInteract) return
    await handler.onInteract(storyId, viewerId, action, payload)
  }

  /**
   * Batch-validate an array of sticker inputs.
   * Used during story creation to validate all stickers before the TX.
   */
  validateBatch(inputs: StickerInput[]): StickerInput[] {
    return inputs.map((input) => ({
      ...input,
      payload: this.validate(input.kind, input.payload),
    }))
  }

  /**
   * Batch-hydrate stickers for a story (called at view time).
   */
  async hydrateBatch(
    items: { id: string; kind: StickerKind; payload: StickerPayload; transform: StickerTransform }[],
    viewerId?: string,
  ): Promise<StickerRenderItem[]> {
    return Promise.all(
      items.map(async (item) => ({
        id: item.id,
        kind: item.kind,
        payload: item.payload,
        renderData: await this.hydrate(item.kind, item.payload, viewerId),
        transform: item.transform,
      })),
    )
  }
}
