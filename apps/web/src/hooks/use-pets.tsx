'use client'

import { useCallback, useEffect, useState } from 'react'
import { petsApi, clearApiCache, type Pet } from '@/lib/api'
import { getSocket } from '@/lib/socket'
import type { Socket } from 'socket.io-client'

/** Cleanup handles per socket, so an async subscribe can still be torn down. */
const petCleanups = new Map<Socket, () => void>()

interface UsePetsResult {
  pets: Pet[]
  loading: boolean
  /** Replace one pet in place — for optimistic updates after a local edit. */
  patchPet: (pet: Pet) => void
  /** Force a fresh read, bypassing the response cache. */
  refresh: () => Promise<void>
}

/**
 * Loads the member's pets and keeps them current.
 *
 * The assistant can change a pet from the chat thread, which happens entirely
 * server-side — an open Pet Diary or Health Passport tab would otherwise show
 * stale details until a manual reload. The API emits `pet:updated` to the
 * member's own room after any assistant write, and this refetches on it.
 *
 * `petsApi.mine` is cached for 15s (stale-while-revalidate for longer), so the
 * cache has to be cleared first or the refetch just returns the old array.
 */
export function usePets(): UsePetsResult {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (fresh: boolean): Promise<void> => {
    if (fresh) clearApiCache()
    try {
      const data = await petsApi.mine()
      setPets(data)
    } catch {
      // Leave whatever is on screen rather than blanking it on a transient failure.
    }
  }, [])

  const refresh = useCallback(() => load(true), [load])

  const patchPet = useCallback((pet: Pet) => {
    setPets((prev) => (prev.some((p) => p.id === pet.id) ? prev.map((p) => (p.id === pet.id ? pet : p)) : [pet, ...prev]))
  }, [])

  useEffect(() => {
    let cancelled = false

    // Deferred by a tick — avoids setState synchronously inside the effect body,
    // matching how the other providers here kick off their first load.
    const first = setTimeout(() => {
      void load(false).finally(() => { if (!cancelled) setLoading(false) })
    }, 0)

    void getSocket().then((socket) => {
      if (!socket || cancelled) return
      const onPetUpdated = (): void => { void load(true) }
      socket.on('pet:updated', onPetUpdated)
      petCleanups.set(socket, () => { socket.off('pet:updated', onPetUpdated) })
    })

    return () => {
      cancelled = true
      clearTimeout(first)
      void getSocket().then((s) => {
        if (!s) return
        petCleanups.get(s)?.()
        petCleanups.delete(s)
      })
    }
  }, [load])

  return { pets, loading, patchPet, refresh }
}
