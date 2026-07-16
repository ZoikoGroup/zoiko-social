'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Lightweight stale-while-revalidate cache hooks (no external dependency).
 *
 * Behaviour (Instagram-style):
 *  - First ever load for a key → isLoading (show a skeleton).
 *  - Key change (filter/tab) with no cache → KEEP the previously shown data on
 *    screen and refresh silently (isRefreshing), then swap to fresh data.
 *  - Revisit a key that's cached → show it INSTANTLY, revalidate in background.
 *
 * The cache lives at module scope, so it survives client-side navigation within
 * the session (back-navigation is instant) and is cleared on full page reload.
 */

// ── Paged lists (browse endpoints with cursor pagination) ────────────────────

interface Snapshot<T> {
  items: T[]
  cursor: string | null
  hasMore: boolean
}

interface PageResult<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

const listStore = new Map<string, Snapshot<unknown>>()

export interface PagedList<T> {
  items: T[]
  hasMore: boolean
  /** True only when there is nothing to show yet (first load for this key). */
  isLoading: boolean
  /** True while a background revalidation / filter change is in flight. */
  isRefreshing: boolean
  loadingMore: boolean
  loadMore: () => void
  /** Optimistic local mutation that also writes through to the cache. */
  patch: (updater: (items: T[]) => T[]) => void
}

export function usePagedList<T extends { id: string }>(
  key: string,
  fetchPage: (cursor: string | null) => Promise<PageResult<T>>,
  debounceMs = 200,
): PagedList<T> {
  const [snap, setSnap] = useState<Snapshot<T>>(
    () => (listStore.get(key) as Snapshot<T> | undefined) ?? { items: [], cursor: null, hasMore: false },
  )
  const [hasData, setHasData] = useState<boolean>(() => listStore.has(key))
  const [prevKey, setPrevKey] = useState(key)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const fetchRef = useRef(fetchPage)
  useEffect(() => { fetchRef.current = fetchPage })

  // Reset/seed on key change — render-time pattern (not an effect), so the
  // previous filter's data stays visible until the new key resolves.
  if (prevKey !== key) {
    setPrevKey(key)
    const cached = listStore.get(key) as Snapshot<T> | undefined
    if (cached) {
      setSnap(cached)
      setHasData(true)
    } else {
      // keep-previous: leave `snap` (old data) on screen; mark "no fresh data yet"
      setHasData(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const t = setTimeout(() => {
      if (cancelled) return
      setIsRefreshing(true)
      fetchRef.current(null)
        .then((page) => {
          if (cancelled) return
          const s: Snapshot<T> = { items: page.data, cursor: page.nextCursor, hasMore: page.hasMore }
          listStore.set(key, s)
          setSnap(s)
          setHasData(true)
        })
        .catch(() => {})
        .finally(() => { if (!cancelled) setIsRefreshing(false) })
    }, debounceMs)
    return () => { cancelled = true; clearTimeout(t) }
  }, [key, debounceMs])

  const loadMore = useCallback(() => {
    if (loadingMore) return
    const cursor = (listStore.get(key) as Snapshot<T> | undefined)?.cursor ?? snap.cursor
    if (!cursor) return
    setLoadingMore(true)
    fetchRef.current(cursor)
      .then((page) => {
        setSnap((prev) => {
          const seen = new Set(prev.items.map((p) => p.id))
          const items = [...prev.items, ...page.data.filter((p) => !seen.has(p.id))]
          const s: Snapshot<T> = { items, cursor: page.nextCursor, hasMore: page.hasMore }
          listStore.set(key, s)
          return s
        })
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false))
  }, [key, loadingMore, snap.cursor])

  const patch = useCallback((updater: (items: T[]) => T[]) => {
    setSnap((prev) => {
      const s: Snapshot<T> = { ...prev, items: updater(prev.items) }
      listStore.set(key, s)
      return s
    })
  }, [key])

  return {
    items: snap.items,
    hasMore: snap.hasMore,
    isLoading: !hasData && snap.items.length === 0,
    isRefreshing,
    loadingMore,
    loadMore,
    patch,
  }
}

// ── Single values (widgets, non-paged fetches) ───────────────────────────────

const valueStore = new Map<string, unknown>()

export interface CachedValue<T> {
  data: T | undefined
  isLoading: boolean
  setData: (updater: T | ((prev: T | undefined) => T)) => void
}

export function useCachedValue<T>(key: string, fetcher: () => Promise<T>): CachedValue<T> {
  const [data, setDataState] = useState<T | undefined>(() => valueStore.get(key) as T | undefined)
  const [prevKey, setPrevKey] = useState(key)
  const fetcherRef = useRef(fetcher)
  useEffect(() => { fetcherRef.current = fetcher })

  if (prevKey !== key) {
    setPrevKey(key)
    setDataState(valueStore.get(key) as T | undefined)
  }

  const setData = useCallback((updater: T | ((prev: T | undefined) => T)) => {
    setDataState((prev) => {
      const next = typeof updater === 'function' ? (updater as (p: T | undefined) => T)(prev) : updater
      valueStore.set(key, next)
      return next
    })
  }, [key])

  useEffect(() => {
    let cancelled = false
    fetcherRef.current()
      .then((d) => { if (!cancelled) { valueStore.set(key, d); setDataState(d) } })
      .catch(() => {})
    return () => { cancelled = true }
  }, [key])

  return { data, isLoading: data === undefined, setData }
}
