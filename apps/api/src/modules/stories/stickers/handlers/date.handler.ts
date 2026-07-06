import { Injectable } from '@nestjs/common'
import type { StickerHandler, StickerPayload, RenderData } from '../sticker-handler.interface'

@Injectable()
export class DateHandler implements StickerHandler {
  readonly kind = 'date' as const

  validate(payload: StickerPayload): StickerPayload {
    return {
      format: payload.format ?? 'MMM D, YYYY',
      tz: payload.tz ?? 'UTC',
    }
  }

  async hydrate(payload: StickerPayload, _viewerId?: string): Promise<RenderData> {
    const tz = (payload.tz as string) ?? 'UTC'
    const format = (payload.format as string) ?? 'MMM D, YYYY'
    const now = new Date()
    const formatted = formatDate(now, format, tz)
    return { formatted, tz, timestamp: now.toISOString() }
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDate(date: Date, format: string, _tz: string): string {
  const d = date.getUTCDate()
  const m = date.getUTCMonth()
  const y = date.getUTCFullYear()
  const day = DAYS[date.getUTCDay()] ?? ''

  return format
    .replace('YYYY', String(y))
    .replace('YY', String(y).slice(-2))
    .replace('MMMM', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m] ?? '')
    .replace('MMM', MONTHS[m] ?? '')
    .replace('MM', String(m + 1).padStart(2, '0'))
    .replace('M', String(m + 1))
    .replace('DD', String(d).padStart(2, '0'))
    .replace('D', String(d))
    .replace('ddd', day)
    .replace('dd', day.slice(0, 2))
}
