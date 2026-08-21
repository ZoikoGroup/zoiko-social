'use client'

import { useCallback, useEffect, useState } from 'react'
import { mutate, request } from '@/lib/api'

/**
 * Web Push, from the browser's side.
 *
 * Three separate pieces of state get confused with each other constantly, so
 * they are kept distinct here:
 *
 *   available  — the server has VAPID keys. Without them there is nothing to
 *                subscribe to, and offering the control would be a dead end.
 *   permission — what the browser has been told. Only the member can change it,
 *                and once denied a site cannot ask again.
 *   subscribed — whether this browser currently has a subscription we hold.
 *
 * A member can have granted permission and still not be subscribed: they may
 * have turned it off in the app, or the push service may have rotated the
 * subscription out from under us.
 */

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported'

interface PushState {
  supported: boolean
  available: boolean
  permission: PushPermission
  subscribed: boolean
  busy: boolean
}

interface PushKeyResponse {
  publicKey: string | null
  available: boolean
}

/**
 * Starts as "nothing is possible" and is corrected once the browser has been
 * asked. Deliberately the pessimistic case: it renders identically on the server
 * and on a first client paint, so there is nothing to mismatch during hydration.
 */
const INITIAL: PushState = {
  supported: false,
  available: false,
  permission: 'unsupported',
  subscribed: false,
  busy: false,
}

function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

/**
 * The VAPID public key arrives as base64url text and `applicationServerKey`
 * wants bytes. Browsers are strict about this: a key passed as a string fails
 * with an unhelpful error.
 */
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const normalised = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(normalised)
  // Backed by an explicit ArrayBuffer: applicationServerKey will not accept a
  // Uint8Array whose buffer type is merely ArrayBufferLike, which is what the
  // length-only constructor produces.
  const bytes = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return bytes
}

export function usePushNotifications(): PushState & {
  enable: () => Promise<{ ok: boolean; reason?: string }>
  disable: () => Promise<void>
} {
  const [state, setState] = useState<PushState>(INITIAL)

  /**
   * Subscribes this browser and registers it server-side. Assumes permission has
   * already been granted, so it is safe to call without a user gesture — which is
   * what makes it usable for the re-subscribe path below.
   */
  const subscribeNow = useCallback(async (): Promise<{ ok: boolean; reason?: string }> => {
    const keyRes = await request<PushKeyResponse>('/push/public-key')
    if (!keyRes.available || !keyRes.publicKey) return { ok: false, reason: 'unavailable' }

    // `ready` never settles when no service worker has been registered, so
    // without this the button spun forever and said nothing. That is exactly the
    // state a local environment is in unless NEXT_PUBLIC_ENABLE_SW is set, and it
    // would also be the state in production if registration had failed.
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5_000)),
    ])
    if (!reg) return { ok: false, reason: 'no-service-worker' }

    // Reuse an existing subscription rather than creating a second one. Calling
    // subscribe() when one exists with a different key throws, and the endpoint
    // we already hold is the one the push service knows about.
    const existing = await reg.pushManager.getSubscription()
    const subscription =
      existing ??
      (await reg.pushManager.subscribe({
        // Required by every browser: a push must result in something the member
        // can see. Silent pushes are not permitted on the web.
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyRes.publicKey),
      }))

    // toJSON gives exactly the shape the API validates — endpoint plus the two keys.
    await mutate('/push/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscription.toJSON()),
    })

    setState((s) => ({ ...s, subscribed: true, permission: 'granted' }))
    return { ok: true }
  }, [])

  /**
   * Reads the truth from the browser and the server rather than assuming it.
   * Every write happens after an await, so this never sets state synchronously
   * inside the effect that calls it.
   */
  const refresh = useCallback(async () => {
    let available = false
    try {
      const res = await request<PushKeyResponse>('/push/public-key')
      available = res.available
    } catch {
      // Treated as unavailable rather than surfaced: a member cannot act on the
      // key endpoint being unreachable, and the control simply stays hidden.
      available = false
    }

    let subscribed = false
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      subscribed = !!(await reg?.pushManager.getSubscription())
    } catch {
      subscribed = false
    }

    setState((s) => ({
      ...s,
      supported: true,
      available,
      permission: Notification.permission as PushPermission,
      subscribed,
    }))
  }, [])

  useEffect(() => {
    // Unsupported needs no write: INITIAL already says so.
    if (!pushSupported()) return
    // Deferred by a tick, matching the pattern used elsewhere in settings: it
    // keeps the state write out of the effect body, which is what the cascading
    // render rule is guarding against.
    const timer = setTimeout(() => void refresh(), 0)
    return () => clearTimeout(timer)
  }, [refresh])

  /**
   * The push service can rotate a subscription without the member doing
   * anything. The service worker forwards that as a message, because it has no
   * credentials of its own to re-register with — only the page can call the API.
   */
  useEffect(() => {
    if (!pushSupported()) return

    const onMessage = (event: MessageEvent) => {
      if ((event.data as { type?: string } | null)?.type === 'push-resubscribe') {
        void subscribeNow()
      }
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => navigator.serviceWorker.removeEventListener('message', onMessage)
  }, [subscribeNow])

  const enable = useCallback(async (): Promise<{ ok: boolean; reason?: string }> => {
    if (!pushSupported()) return { ok: false, reason: 'unsupported' }

    setState((s) => ({ ...s, busy: true }))
    try {
      // Must be called from a user gesture, which is why this is only ever
      // reached from a click and never from an effect.
      const permission = await Notification.requestPermission()
      setState((s) => ({ ...s, permission: permission as PushPermission }))

      if (permission !== 'granted') {
        // Denied is permanent from the page's side — only browser settings can
        // undo it, so the caller needs to say so rather than offer a retry.
        return { ok: false, reason: permission === 'denied' ? 'denied' : 'dismissed' }
      }

      return await subscribeNow()
    } catch (err) {
      const error = err as Error

      /*
       * Brave, and Chromium with push messaging switched off, reject subscribe()
       * with an AbortError naming the push service. Worth separating from a
       * generic failure because the member can fix it and nothing in the app can:
       * the browser is refusing to talk to a push service at all.
       */
      const message = `${error.name ?? ''} ${error.message ?? ''}`
      if (/push service|AbortError|not available|unsupported/i.test(message)) {
        return { ok: false, reason: 'push-service-unavailable' }
      }

      // Logged as well as returned: the toast has to stay short, and whoever is
      // debugging this needs the original error rather than a paraphrase.
      console.error('[push] subscribe failed', error)
      return { ok: false, reason: error.message || 'unknown' }
    } finally {
      setState((s) => ({ ...s, busy: false }))
    }
  }, [subscribeNow])

  const disable = useCallback(async (): Promise<void> => {
    if (!pushSupported()) return

    setState((s) => ({ ...s, busy: true }))
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const subscription = await reg?.pushManager.getSubscription()
      if (!subscription) {
        setState((s) => ({ ...s, subscribed: false }))
        return
      }

      const { endpoint } = subscription

      // Server first. If the local unsubscribe succeeded and this failed, the
      // server would keep sending to an endpoint the browser has discarded —
      // invisible to the member and a wasted request on every notification.
      await mutate('/push/subscriptions', {
        method: 'DELETE',
        body: JSON.stringify({ endpoint }),
      }).catch(() => undefined)

      await subscription.unsubscribe()
      setState((s) => ({ ...s, subscribed: false }))
    } finally {
      setState((s) => ({ ...s, busy: false }))
    }
  }, [])

  return { ...state, enable, disable }
}
