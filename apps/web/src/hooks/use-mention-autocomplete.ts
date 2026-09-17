'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { profileApi, type MentionSuggestion } from '@/lib/api'

/**
 * The "@" picker, as an Instagram-style autocomplete over a plain textarea.
 *
 * Tagging has always worked on this platform — type a handle exactly and the
 * person is tagged, notified, and linked. What never existed was any way to
 * find the handle, so you had to already know it and spell it correctly; a typo
 * silently tags nobody, because unmatched handles are dropped rather than
 * refused. That is why it kept being reported as "cannot tag any user".
 *
 * The token is read from the text before the caret rather than from the whole
 * value, so editing a sentence in the middle opens the picker for the handle
 * being edited and not for one further along.
 */

/** Matches the handle being typed, anchored at the caret. */
const TOKEN = /(?:^|[\s(])@([a-zA-Z0-9._]{0,30})$/

/** Long enough to be a search, short enough to feel instant. */
const DEBOUNCE_MS = 180

export interface MentionAutocomplete {
  /** Rows to show, empty when the picker is closed. */
  suggestions: MentionSuggestion[]
  open: boolean
  loading: boolean
  /** Index of the highlighted row, for arrow-key navigation. */
  activeIndex: number
  setActiveIndex: (i: number) => void
  /** Call on every change of the textarea's value or caret. */
  onValueChange: (value: string, caret: number) => void
  /** Accepts a row: returns the new text and where to put the caret. */
  select: (s: MentionSuggestion) => { value: string; caret: number } | null
  close: () => void
  /** Keyboard handling; returns true when it consumed the event. */
  handleKeyDown: (e: React.KeyboardEvent) => boolean
}

export function useMentionAutocomplete(
  value: string,
  onChange: (next: string) => void,
): MentionAutocomplete {
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [open, setOpen] = useState(false)

  /** Where the current "@" token sits, so selecting can replace exactly it. */
  const tokenRef = useRef<{ start: number; end: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /*
    Replies can arrive out of order: a slow request for "ra" must not overwrite
    the list already shown for "radh". Only the newest query may render.
  */
  const queryIdRef = useRef(0)

  const close = useCallback(() => {
    setOpen(false)
    setSuggestions([])
    setActiveIndex(0)
    tokenRef.current = null
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const onValueChange = useCallback((next: string, caret: number) => {
    const before = next.slice(0, caret)
    const match = TOKEN.exec(before)

    if (!match) {
      close()
      return
    }

    const term = match[1] ?? ''
    tokenRef.current = { start: caret - term.length - 1, end: caret }
    setOpen(true)
    setActiveIndex(0)

    if (timerRef.current) clearTimeout(timerRef.current)

    // "@" on its own opens the picker but searches for nothing — there is no
    // useful answer to "everyone", and it would be a list of strangers.
    if (term.length === 0) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    const id = ++queryIdRef.current
    timerRef.current = setTimeout(() => {
      void profileApi
        .mentionable(term)
        .then((rows) => {
          if (id !== queryIdRef.current) return
          setSuggestions(rows)
          setActiveIndex(0)
        })
        .catch(() => {
          // A failed lookup closes the list rather than freezing a stale one.
          if (id === queryIdRef.current) setSuggestions([])
        })
        .finally(() => {
          if (id === queryIdRef.current) setLoading(false)
        })
    }, DEBOUNCE_MS)
  }, [close])

  const select = useCallback((s: MentionSuggestion) => {
    const token = tokenRef.current
    if (!token) return null
    // A trailing space so the next word is not swallowed into the handle, and
    // so the caption parser sees the mention as finished.
    const inserted = `@${s.username} `
    const next = value.slice(0, token.start) + inserted + value.slice(token.end)
    const caret = token.start + inserted.length
    onChange(next)
    close()
    return { value: next, caret }
  }, [value, onChange, close])

  const handleKeyDown = useCallback((e: React.KeyboardEvent): boolean => {
    if (!open || suggestions.length === 0) {
      // Escape still closes a picker that is open but empty.
      if (open && e.key === 'Escape') { close(); return true }
      return false
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
      return true
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
      return true
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      const chosen = suggestions[activeIndex]
      if (!chosen) return false
      // Enter picks the highlighted name instead of submitting the post — the
      // same as every other autocomplete, and the reason the list is open.
      e.preventDefault()
      select(chosen)
      return true
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return true
    }
    return false
  }, [open, suggestions, activeIndex, select, close])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return {
    suggestions,
    open: open && (suggestions.length > 0 || loading),
    loading,
    activeIndex,
    setActiveIndex,
    onValueChange,
    select,
    close,
    handleKeyDown,
  }
}
