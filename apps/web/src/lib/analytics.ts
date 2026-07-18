import { createClient } from '@/lib/supabase/client'

/**
 * Post analytics client — batches impression/interaction events and flushes them
 * to the API. Best-effort by design: failures are swallowed, and only posts by
 * professional accounts are ever tracked (callers gate on that).
 *
 *  - events queue in memory and flush on a short interval or when the batch fills
 *  - a final flush fires on tab-hide / pagehide via `keepalive` so in-flight
 *    events survive navigation
 *  - impressions/views are de-duplicated per session so one render counts once
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Free-form, with common values kept for autocomplete. Any string is accepted —
// new event kinds need no code change (the backend schema is extensible).
export type PostEventType = 'impression' | 'view' | 'profile_tap' | 'link_tap' | 'video_watch' | (string & {})
export type PostEventSurface = 'feed' | 'explore' | 'hashtag' | 'profile' | 'dm_share' | 'detail' | (string & {})

type PropValue = string | number | boolean | null

interface QueuedEvent {
  postId: string
  type: PostEventType
  surface?: PostEventSurface
  dwellMs?: number
  /** Arbitrary event metadata (video %, cta id, variant, referrer, …). */
  props?: Record<string, PropValue>
}

const FLUSH_INTERVAL_MS = 5000
const FLUSH_AT = 20
const MAX_BATCH = 50

let queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null
let cachedToken: string | null = null
let lifecycleBound = false
const seen = new Set<string>()

export function trackPostEvent(event: QueuedEvent): void {
  if (typeof window === 'undefined' || !API_URL) return

  // De-dupe passive events so a single render isn't counted repeatedly.
  if (event.type === 'impression' || event.type === 'view') {
    const key = `${event.type}:${event.postId}`
    if (seen.has(key)) return
    seen.add(key)
  }

  bindLifecycle()
  queue.push(event)
  if (queue.length >= FLUSH_AT) void flush()
  else scheduleFlush()
}

function scheduleFlush(): void {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    void flush()
  }, FLUSH_INTERVAL_MS)
}

async function refreshToken(): Promise<string | null> {
  try {
    const { data: { session } } = await createClient().auth.getSession()
    cachedToken = session?.access_token ?? null
  } catch {
    cachedToken = null
  }
  return cachedToken
}

async function flush(useKeepalive = false): Promise<void> {
  if (queue.length === 0) return

  const batch = queue.slice(0, MAX_BATCH)
  queue = queue.slice(MAX_BATCH)

  // On unload we can't await — use the cached token synchronously.
  const token = useKeepalive ? cachedToken : (cachedToken ?? await refreshToken())
  if (!token) return

  try {
    await fetch(`${API_URL}/api/v1/events/ingest`, {
      method: 'POST',
      keepalive: useKeepalive,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ events: batch }),
    })
  } catch {
    /* best-effort — drop the batch on network error */
  }

  if (queue.length > 0) scheduleFlush()
}

function bindLifecycle(): void {
  if (lifecycleBound || typeof window === 'undefined') return
  lifecycleBound = true
  void refreshToken()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush(true)
  })
  window.addEventListener('pagehide', () => void flush(true))
}
