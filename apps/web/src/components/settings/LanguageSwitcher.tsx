'use client'

import { useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/actions'

/**
 * Replaces the picker that stored a choice nothing read. Selecting a language
 * calls a server action, which writes the cookie the server reads on the next
 * render, so the whole tree comes back translated.
 *
 * useTransition keeps the select responsive while that round trip happens, and
 * shows the pending state instead of leaving it looking stuck.
 */
export function LanguageSwitcher(): React.JSX.Element {
  const current = useLocale() as Locale
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useState<Locale>(current)

  function handleChange(next: Locale): void {
    setValue(next)
    startTransition(async () => {
      await setLocale(next)
    })
  }

  return (
    <div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => handleChange(e.target.value as Locale)}
          disabled={pending}
          aria-label="Language"
          className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all appearance-none cursor-pointer disabled:opacity-60"
        >
          {LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              {LOCALE_LABELS[locale]}
            </option>
          ))}
        </select>
        {pending && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-outline pointer-events-none" />
        )}
      </div>
    </div>
  )
}
