/**
 * Cursor pagination utility.
 *
 * Cursor format: base64(JSON.stringify({ createdAt: <ISO string>, tiebreaker: <unique field value> }))
 *
 * The `tiebreaker` is a model-specific unique field used to break ties when
 * multiple items share the same `createdAt` timestamp. For Notification it is `id`,
 * for Follow it is the unique part of the composite key (followerId or followingId).
 *
 * Cursor WHERE clause pattern:
 *   OR: [
 *     { createdAt: { lt: decoded.createdAt } },
 *     { createdAt: decoded.createdAt, <tiebreakerField>: { lt: decoded.tiebreaker } },
 *   ]
 *
 * Encode nextCursor from the last item of the current page:
 *   encodeCursor(lastItem.createdAt, lastItem.<tiebreakerField>)
 */

export interface CursorParams {
  createdAt: string
  tiebreaker: string
}

/**
 * Encode a cursor from the last item's createdAt and a tiebreaker field value.
 */
export function encodeCursor(createdAt: Date | string, tiebreaker: string): string {
  const dateStr = typeof createdAt === 'string' ? createdAt : createdAt.toISOString()
  const payload: CursorParams = { createdAt: dateStr, tiebreaker }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

/**
 * Decode a cursor string back to CursorParams.
 * Returns null if the cursor is invalid or malformed.
 */
export function decodeCursor(cursor: string | undefined | null): CursorParams | null {
  if (!cursor) return null
  try {
    const raw = Buffer.from(cursor, 'base64').toString('utf8')
    const parsed = JSON.parse(raw) as CursorParams
    if (!parsed.createdAt || !parsed.tiebreaker) return null
    return parsed
  } catch {
    return null
  }
}
