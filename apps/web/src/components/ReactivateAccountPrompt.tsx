'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, RotateCcw } from 'lucide-react'
import { useDateFormat } from '@/hooks/use-date-format'

export type HiddenAccountState = 'deactivated' | 'pending_deletion'

/**
 * Asks before undoing a deactivation.
 *
 * Signing in used to restore a hidden account silently: the audit log showed
 * deactivate and reactivate seconds apart with no decision in between, so someone
 * who deactivated on purpose was handed an active account back without being told.
 * The API now reports the state and waits for this confirmation.
 *
 * Declining signs out rather than proceeding, because there is nothing to proceed
 * to — the account is still hidden and every route stays refused until it is not.
 */
export function ReactivateAccountPrompt({
  state,
  since,
  onReactivate,
  onDecline,
}: {
  state: HiddenAccountState
  /** ISO timestamp of the deactivation or deletion request. */
  since: string | null
  onReactivate: () => Promise<string | null>
  onDecline: () => void
}): React.JSX.Element {
  const t = useTranslations('reactivate')
  const { ago } = useDateFormat()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // "3 days ago" in the reader's language, via Intl.RelativeTimeFormat.
  const when = since ? ago(since) : ''

  async function confirm(): Promise<void> {
    if (busy) return
    setBusy(true)
    setError(null)
    const message = await onReactivate()
    if (message) {
      setError(message)
      setBusy(false)
    }
    // On success the caller navigates; leaving busy set avoids a flash of the
    // buttons coming back before the route changes.
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <RotateCcw className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{t('title')}</p>
          <p className="mt-1 text-sm text-gray-600">
            {state === 'pending_deletion' ? t('deletionAgo', { ago: when }) : t('deactivatedAgo', { ago: when })}
          </p>

          {error && (
            <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">{error}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void confirm()}
              disabled={busy}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              <span>{busy ? t('working') : t('confirm')}</span>
            </button>
            <button
              type="button"
              onClick={onDecline}
              disabled={busy}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              {t('decline')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
