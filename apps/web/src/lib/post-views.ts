import { postViewsApi } from './api'

/**
 * Client-side batcher for the feed's seen-filter.
 *
 * Cards report a post id the moment it becomes meaningfully visible
 * (IntersectionObserver in PostCard). This module coalesces those reports
 * into a single debounced `POST /me/views` batch, so scrolling never turns
 * into a request per post. The API is idempotent (composite PK), so
 * re-viewing a post is a no-op — re-reports are cheap.
 */

const BATCH_WINDOW_MS = 1_500
const MAX_BATCH = 50

const pending = new Set<string>()
let timer: ReturnType<typeof setTimeout> | null = null
let inFlight = false

function schedule(): void {
  if (timer) return
  timer = setTimeout(() => {
    timer = null
    void flush()
  }, BATCH_WINDOW_MS)
}

async function flush(): Promise<void> {
  if (inFlight || pending.size === 0) return
  const ids = [...pending].slice(0, MAX_BATCH)
  // Keep the overflow for the next flush
  for (const id of ids) pending.delete(id)
  if (ids.length === 0) return

  inFlight = true
  try {
    await postViewsApi.report(ids)
  } catch {
    // Fire-and-forget: a failed report just means those posts may reappear.
    // Do not retry in a loop — the next scroll/report will cover them.
  } finally {
    inFlight = false
    if (pending.size > 0) schedule()
  }
}

/** Report a post as seen. Safe to call repeatedly for the same post. */
export function reportPostView(postId: string): void {
  if (!postId) return
  pending.add(postId)
  schedule()
}

/** Flush any buffered reports when the page is going away. */
export function flushPostViews(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  void flush()
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushPostViews)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPostViews()
  })
}
