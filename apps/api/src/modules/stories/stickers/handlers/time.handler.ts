import { Injectable } from '@nestjs/common'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

@Injectable()
export class TimeHandler implements StickerHandler {
  readonly kind = 'time' as const

  validate(payload: StickerPayload): StickerPayload {
    return {
      format: payload.format ?? 'HH:mm',
      tz: payload.tz ?? 'UTC',
    }
  }

  async hydrate(payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    const tz = (payload.tz as string) ?? 'UTC'
    const format = (payload.format as string) ?? 'HH:mm'
    const now = new Date()
    const formatted = formatTime(now, format, tz)
    return { formatted, tz, timestamp: now.toISOString() }
  }
}

function formatTime(date: Date, format: string, _tz: string): string {
  // Lightweight formatter — no external dep needed for the common cases
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  const ss = String(date.getUTCSeconds()).padStart(2, '0')
  const h12 = String(date.getUTCHours() % 12 || 12).padStart(2, '0')
  const ampm = date.getUTCHours() >= 12 ? 'PM' : 'AM'

  return format
    .replace('HH', hh)
    .replace('mm', mm)
    .replace('ss', ss)
    .replace('h', h12)
    .replace('A', ampm)
    .replace('a', ampm.toLowerCase())
}
