import { Injectable } from '@nestjs/common'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

/**
 * Weather sticker — placeholder until weather API integration is built.
 * Schema-ready: stores { location } at publish, will hydrate current conditions.
 */
@Injectable()
export class WeatherStubHandler implements StickerHandler {
  readonly kind = 'weather' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.location || typeof payload.location !== 'string') {
      throw new Error('Weather sticker requires a string "location" field')
    }
    return { location: payload.location }
  }

  async hydrate(_payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    // Future: fetch current conditions from a weather API
    return { available: false, message: 'Weather fetch not yet available' }
  }
}

/**
 * Poll sticker — placeholder until interactive stickers are implemented.
 * Schema-ready: stores { question, options[] }.
 */
@Injectable()
export class PollStubHandler implements StickerHandler {
  readonly kind = 'poll' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.question || typeof payload.question !== 'string') {
      throw new Error('Poll sticker requires a string "question" field')
    }
    if (!Array.isArray(payload.options) || payload.options.length < 2 || payload.options.length > 10) {
      throw new Error('Poll sticker requires 2–10 options')
    }
    return {
      question: payload.question,
      options: payload.options.map((o: unknown) => String(o)),
    }
  }

  async hydrate(_payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    // Future: return tallies for each option
    return { available: false, message: 'Poll voting not yet available' }
  }

  async onInteract(_storyId: string, _viewerId: string, _action: string, _payload?: Record<string, unknown>): Promise<void> {
    // Future: record vote, recompute tallies
    throw new Error('Poll interaction not yet available')
  }
}

/**
 * Question sticker — placeholder until interactive stickers are implemented.
 * Schema-ready: stores { prompt }.
 */
@Injectable()
export class QuestionStubHandler implements StickerHandler {
  readonly kind = 'question' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.prompt || typeof payload.prompt !== 'string') {
      throw new Error('Question sticker requires a string "prompt" field')
    }
    return { prompt: payload.prompt }
  }

  async hydrate(_payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    // Future: return answer count for author, answer prompt for viewers
    return { available: false, message: 'Question replies not yet available' }
  }

  async onInteract(_storyId: string, _viewerId: string, _action: string, payload?: Record<string, unknown>): Promise<void> {
    if (!payload?.answer || typeof payload.answer !== 'string') {
      throw new Error('Question interaction requires a string "answer" field')
    }
    // Future: insert answer into sticker_answers table
    throw new Error('Question replies not yet available')
  }
}

/**
 * Countdown sticker — placeholder until interactive stickers are implemented.
 * Schema-ready: stores { title, endsAt }.
 */
@Injectable()
export class CountdownStubHandler implements StickerHandler {
  readonly kind = 'countdown' as const

  validate(payload: StickerPayload): StickerPayload {
    if (!payload.title || typeof payload.title !== 'string') {
      throw new Error('Countdown sticker requires a string "title" field')
    }
    if (!payload.endsAt || typeof payload.endsAt !== 'string') {
      throw new Error('Countdown sticker requires a string "endsAt" field (ISO 8601)')
    }
    return { title: payload.title, endsAt: payload.endsAt }
  }

  async hydrate(payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    const endsAt = payload.endsAt as string
    const remaining = calculateRemaining(endsAt)
    return {
      endsAt,
      remaining,
      expired: remaining <= 0,
    }
  }

  async onInteract(_storyId: string, _viewerId: string, _action: string, _payload?: Record<string, unknown>): Promise<void> {
    // Future: subscribe to countdown notifications
    throw new Error('Countdown interaction not yet available')
  }
}

function calculateRemaining(endsAt: string): number {
  const end = new Date(endsAt).getTime()
  const now = Date.now()
  return Math.max(0, end - now)
}
