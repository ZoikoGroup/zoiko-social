import * as Sentry from '@sentry/node'

/**
 * Error reporting, off by default.
 *
 * The API had none. Unhandled exceptions logged a stack to stdout and that was
 * the whole story: on a hosted instance nobody sees stdout until they go
 * looking, and there is no way to know an incident is happening, how often, or
 * who it touched. The exception filter already assembles everything worth
 * sending — request id, method, route, caller — so this only needs to forward it.
 *
 * Enabled solely by SENTRY_DSN being set. With no DSN nothing initialises,
 * `isSentryEnabled()` stays false and every capture call is a no-op, so the
 * default path costs one boolean and the app behaves exactly as before. That
 * matters because the DSN is not available in this environment: the wiring is
 * verified, the delivery is not.
 */

let enabled = false

export function initSentry(options: {
  dsn?: string
  environment: string
  release?: string
}): void {
  if (!options.dsn) return

  Sentry.init({
    dsn: options.dsn,
    environment: options.environment,
    release: options.release,
    // Errors only. Tracing samples every request and is the usual way a free
    // quota disappears in an afternoon; turn it on deliberately, not by default.
    tracesSampleRate: 0,
    // Bodies and headers can carry tokens, DMs and health records. The filter
    // sends the few fields that aid triage and nothing else.
    sendDefaultPii: false,
  })
  enabled = true
}

export function isSentryEnabled(): boolean {
  return enabled
}

/** Report a server fault. No-op unless a DSN was configured. */
export function captureServerError(
  error: unknown,
  context: {
    requestId: string
    method: string
    url: string
    userId?: string
  },
): void {
  if (!enabled) return

  Sentry.withScope((scope) => {
    // The request id is also on the access-log line and in the response body,
    // so an event, a log line and a user's bug report all join up on one value.
    scope.setTag('request_id', context.requestId)
    scope.setTag('http_method', context.method)
    scope.setTransactionName(`${context.method} ${context.url}`)
    scope.setContext('request', { requestId: context.requestId, method: context.method, url: context.url })
    // Id only — never email or display name.
    if (context.userId) scope.setUser({ id: context.userId })
    Sentry.captureException(error)
  })
}

/** Flush pending events on shutdown so a crash does not lose the event that explains it. */
export async function closeSentry(timeoutMs = 2000): Promise<void> {
  if (!enabled) return
  await Sentry.close(timeoutMs)
}
