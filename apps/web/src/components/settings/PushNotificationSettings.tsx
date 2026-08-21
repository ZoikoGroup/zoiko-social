'use client'

import { useCallback, useEffect, useState } from 'react'
import { BellRing, Loader2, ShieldAlert } from 'lucide-react'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { mutate, request } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

/**
 * Device push notifications.
 *
 * Two layers, and conflating them is what makes push settings confusing
 * elsewhere. The browser's permission and this browser's subscription decide
 * whether anything can arrive at all; the category switches decide what is worth
 * arriving. So the categories stay hidden until the first layer is in place —
 * offering "which notifications do you want on your phone" to someone who has not
 * allowed any is a choice with no effect.
 *
 * These categories are separate from the In-App list above on purpose. Silencing
 * your phone and erasing the record of what happened are different requests, and
 * the old single switch could only do both at once.
 */

/** Keys come from the API, which takes them from the comms registry. */
const CATEGORY_LABELS: Record<string, string> = {
  'messages.activity': 'Messages & Calls',
  'social.reactions': 'Likes & Reactions',
  'social.comments_replies': 'Comments & Replies',
  'social.mentions': 'Mentions & Tags',
  'social.follow_requests': 'Followers & Requests',
  'social.shares': 'Shares & Reposts',
  'groups.activity': 'Community Activity',
  'groups.invitations': 'Community Invitations',
  'events.activity': 'Events',
  'adoption.activity': 'Adoption Enquiries',
  'breeding.activity': 'Breeding Requests',
  'shop.activity': 'Orders & Shop',
  'pet_care.activity': 'Pet Care & Vet Visits',
  'lost_found.alerts': 'Lost & Found Alerts',
  'news.activity': 'News & Updates',
}

export function PushNotificationSettings(): React.JSX.Element | null {
  const { supported, available, permission, subscribed, busy, enable, disable } =
    usePushNotifications()
  const toast = useToast()

  const [categories, setCategories] = useState<Record<string, boolean> | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await request<Record<string, boolean>>('/push/preferences'))
    } catch {
      // Leaving them unrendered is better than rendering switches whose state is
      // a guess — a member would toggle one and not know what they had changed.
      setCategories(null)
    }
  }, [])

  useEffect(() => {
    if (!subscribed) return
    // Deferred by a tick so the state write lands outside the effect body, the
    // same pattern the other settings sections use for their initial load.
    const timer = setTimeout(() => void loadCategories(), 0)
    return () => clearTimeout(timer)
  }, [subscribed, loadCategories])

  const toggleCategory = async (key: string, next: boolean) => {
    setSaving(key)
    // Optimistic: a switch that waits for a round-trip before moving feels broken.
    setCategories((c) => (c ? { ...c, [key]: next } : c))
    try {
      await mutate('/push/preferences', {
        method: 'PATCH',
        body: JSON.stringify({ preferenceKey: key, enabled: next }),
      })
    } catch {
      setCategories((c) => (c ? { ...c, [key]: !next } : c))
      toast.error('Not saved', 'Could not change that notification. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  // Nothing to offer: either the browser cannot do push, or this deployment has
  // no keys to subscribe against. Showing a dead control is worse than showing none.
  if (!supported || !available) return null

  const handleEnable = async () => {
    const result = await enable()
    if (result.ok) {
      toast.success('Notifications on', 'This device will now receive notifications.')
      void loadCategories()
      return
    }
    if (result.reason === 'denied') {
      toast.error(
        'Blocked by your browser',
        'Notifications are blocked for this site. Allow them in your browser settings to turn this on.',
      )
      return
    }
    if (result.reason === 'dismissed') return
    if (result.reason === 'no-service-worker') {
      // Distinct from a generic failure because the cause and the fix are
      // specific: the browser granted permission but there is no worker to
      // deliver to, which is what a local environment looks like by default.
      toast.error(
        'Notifications not ready',
        'The background service worker is not running, so nothing can be delivered yet.',
      )
      return
    }
    if (result.reason === 'push-service-unavailable') {
      toast.error(
        'Your browser is blocking push',
        'Brave and some Chromium builds disable push messaging by default. Enable it in your browser privacy settings, then try again.',
      )
      return
    }
    if (result.reason === 'unavailable') {
      toast.error('Not configured', 'Push notifications are not set up on this server yet.')
      return
    }
    // The real reason rather than "please try again": this branch only happens on
    // something unexpected, and hiding it makes it unreportable.
    toast.error('Could not turn on notifications', result.reason ?? 'Please try again.')
  }

  return (
    <div>
      <h4 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
        <BellRing className="w-4 h-4 text-primary" />
        This Device
      </h4>

      {permission === 'denied' && !subscribed ? (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-on-surface leading-relaxed">
            Notifications are blocked for this site in your browser. Once a site is blocked, only
            your browser settings can allow it again.
          </p>
        </div>
      ) : !subscribed ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-[12.5px] text-outline leading-relaxed">
            Get notified on this device when you are not using ZoikoSocial.
          </p>
          <button
            onClick={() => void handleEnable()}
            disabled={busy}
            className="flex-shrink-0 px-3.5 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Turn on'}
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4 pb-2">
            <p className="text-[12.5px] text-outline">
              This device is receiving notifications.
            </p>
            <button
              onClick={() => void disable()}
              disabled={busy}
              className="flex-shrink-0 text-label-sm font-semibold text-destructive hover:text-destructive/80 disabled:opacity-60 transition-colors cursor-pointer"
            >
              Turn off
            </button>
          </div>

          {categories &&
            Object.entries(CATEGORY_LABELS)
              // Driven by what the API returned, so a category added server-side
              // does not need this file changed to appear.
              .filter(([key]) => key in categories)
              .map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <span className="text-label-sm text-on-surface">{label}</span>
                  <button
                    role="switch"
                    aria-checked={categories[key]}
                    aria-label={label}
                    disabled={saving === key}
                    onClick={() => void toggleCategory(key, !categories[key])}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${categories[key] ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${categories[key] ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </label>
              ))}
        </div>
      )}
    </div>
  )
}
