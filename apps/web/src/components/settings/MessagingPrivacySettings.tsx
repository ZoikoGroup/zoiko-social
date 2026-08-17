'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { messagingApi, type MessagingPrivacy, type PrivacyAudience } from '@/lib/messaging-api'
import { useToast } from '@/hooks/use-toast'

/**
 * Who can message you, and what they can see.
 *
 * These settings were fully enforced on the server — MessagingPrivacyService
 * checks them on every send — but there was no way to read or change them, so
 * every account was stuck on whatever the defaults happened to be.
 */

const AUDIENCES: { value: PrivacyAudience; label: string }[] = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'my_followers', label: 'People who follow me' },
  { value: 'my_connections', label: 'People I follow back' },
  { value: 'nobody', label: 'Nobody' },
]

const CHOICES: { key: keyof MessagingPrivacy; label: string; hint: string }[] = [
  {
    key: 'whoCanMessage',
    label: 'Who can message you directly',
    hint: 'Anyone outside this can still send a request you choose to accept.',
  },
  {
    key: 'whoCanSendMessageRequest',
    label: 'Who can send you a message request',
    hint: 'Requests wait in your inbox until you accept or decline them.',
  },
  { key: 'whoCanSeeOnlineStatus', label: 'Who can see when you are online', hint: '' },
  { key: 'whoCanSeeLastSeen', label: 'Who can see when you were last active', hint: '' },
]

// labelKey/hintKey index the `messaging` namespace — resolved at render, since
// this array lives at module scope where no hook can run.
const TOGGLES: {
  key: 'showReadReceipts' | 'showTypingIndicator'
  labelKey: string
  hintKey: string
}[] = [
  { key: 'showReadReceipts', labelKey: 'readReceipts', hintKey: 'readReceiptsDesc' },
  { key: 'showTypingIndicator', labelKey: 'typingIndicator', hintKey: 'typingIndicatorDesc' },
]

export function MessagingPrivacySettings(): React.JSX.Element {
  const tm = useTranslations('messaging')
  const toast = useToast()
  const [privacy, setPrivacy] = useState<MessagingPrivacy | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(() => {
    messagingApi.privacy()
      .then(setPrivacy)
      .catch(() => toast.error('Could not load', 'Message privacy settings are unavailable right now.'))
    // toast is stable for the lifetime of the provider
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function save(patch: Partial<MessagingPrivacy>, key: string): Promise<void> {
    if (!privacy) return
    // Optimistic: these are preference toggles, and a revert on failure reads
    // more clearly than a spinner on every row.
    const previous = privacy
    setPrivacy({ ...privacy, ...patch })
    setSaving(key)
    try {
      const updated = await messagingApi.updatePrivacy(patch)
      setPrivacy(updated)
    } catch (e) {
      setPrivacy(previous)
      toast.error('Could not save', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setSaving(null)
    }
  }

  if (!privacy) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {CHOICES.map((c) => (
        <div key={c.key} className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
          <label htmlFor={`privacy-${c.key}`} className="block text-label-sm font-semibold text-on-surface">
            {c.label}
          </label>
          {c.hint && <p className="text-[11px] text-outline mt-0.5">{c.hint}</p>}
          <div className="flex items-center gap-2 mt-2">
            <select
              id={`privacy-${c.key}`}
              value={privacy[c.key] as PrivacyAudience}
              onChange={(e) => void save({ [c.key]: e.target.value as PrivacyAudience }, c.key)}
              className="flex-1 px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/40 text-label-sm text-on-surface cursor-pointer"
            >
              {AUDIENCES.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            {saving === c.key && <Loader2 className="w-4 h-4 animate-spin text-outline flex-shrink-0" />}
          </div>
        </div>
      ))}

      {TOGGLES.map((toggle) => (
        <div
          key={toggle.key}
          className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4"
        >
          <div className="flex-1">
            <p className="text-label-sm font-semibold text-on-surface">{tm(toggle.labelKey)}</p>
            <p className="text-[11px] text-outline mt-0.5">{tm(toggle.hintKey)}</p>
          </div>
          <button
            role="switch"
            aria-checked={privacy[toggle.key]}
            aria-label={tm(toggle.labelKey)}
            onClick={() => void save({ [toggle.key]: !privacy[toggle.key] }, toggle.key)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
              privacy[toggle.key] ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            {/* left-0.5 pins the knob to the track. Without a left, the span is
                absolute with left:auto, so it sits at its static position —
                horizontally centred, because a button centres its content — and
                the translate then pushed it out past the right edge.
                Travel is 20px: 44 track − 20 knob − 2 padding each side. */}
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                privacy[toggle.key] ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  )
}
