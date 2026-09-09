'use client'

/**
 * People, as a section of the single admin panel.
 *
 * Still reads the viewer's role: the shell decides who may open the panel at
 * all, while this decides who may appoint staff — a moderator sees the list and
 * not the controls that would 403.
 */

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Search, Loader2, AlertTriangle, ShieldCheck, Ban, Undo2, ShieldAlert } from 'lucide-react'
import { adminApi, moderationApi, type AdminUserItem } from '@/lib/api'
import { UserAvatar } from '@/components/UserAvatar'
import { useAuth } from '@/hooks/use-auth'

/**
 * People.
 *
 * The screen that did not exist, and whose absence meant the platform had no
 * staff at all: every other admin page was gated behind a role nobody could be
 * given without hand-written SQL.
 *
 * Role changes are separated from suspension deliberately. They read similarly
 * — both are dropdowns next to a name — but one is a moderation action against
 * someone and the other hands out power, and confusing the two is how a
 * misclick becomes an incident.
 */

const ROLES = ['user', 'moderator', 'admin', 'super_admin'] as const

const ROLE_STYLE: Record<string, string> = {
  super_admin: 'bg-primary/15 text-primary',
  admin: 'bg-primary/15 text-primary',
  moderator: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
}

const STATE_STYLE: Record<string, string> = {
  suspended: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  banned: 'bg-red-500/15 text-red-600',
  deleted: 'bg-surface-container text-outline',
}

/** Highest first — the same order the server ranks by. */
function rank(role: string): number {
  const i = ['super_admin', 'admin', 'moderator', 'user'].indexOf(role)
  return i === -1 ? 99 : i
}

export function PeopleSection(): React.JSX.Element {
  const { profile } = useAuth()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const canAppoint = !!profile && ['admin', 'super_admin'].includes(profile.role)
  const myRank = profile ? rank(profile.role) : 99
  const myId = profile?.id

  const load = useCallback((q: string) => {
    setLoading(true)
    setError(null)
    adminApi
      .users(q.trim() ? { q: q.trim() } : {})
      .then(setUsers)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Deferred so state updates never run synchronously inside the effect body
    const timer = setTimeout(() => load(''), 0)
    return () => clearTimeout(timer)
  }, [load])

  const changeRole = async (user: AdminUserItem, role: string) => {
    if (role === user.role) return
    if (!window.confirm(`Make ${user.displayName} a ${role.replace('_', ' ')}?`)) return
    setBusyId(user.id)
    setError(null)
    setNotice(null)
    try {
      await adminApi.setRole(user.id, role)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)))
      setNotice(`${user.displayName} is now ${role.replace('_', ' ')}.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change role')
    } finally {
      setBusyId(null)
    }
  }

  const act = async (user: AdminUserItem, action: 'suspend' | 'ban' | 'reinstate') => {
    let reason = ''
    if (action !== 'reinstate') {
      const entered = window.prompt(`Reason for ${action}ning ${user.displayName}?`)
      if (entered === null) return
      reason = entered.trim()
      if (!reason) {
        setError('A reason is required — it is what the audit log records.')
        return
      }
    }
    setBusyId(user.id)
    setError(null)
    try {
      if (action === 'suspend') await moderationApi.suspendUser(user.id, reason)
      else if (action === 'ban') await moderationApi.banUser(user.id, reason)
      else await moderationApi.reinstateUser(user.id)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, state: action === 'reinstate' ? 'active' : action === 'ban' ? 'banned' : 'suspended' }
            : u,
        ),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : `Could not ${action}`)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h2 className="text-title-md font-bold flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" /> People
      </h2>

          <form
            onSubmit={(e) => { e.preventDefault(); load(query) }}
            className="flex items-center gap-2 px-3 py-2 mb-4 rounded-xl bg-surface-container"
          >
            <Search className="w-4 h-4 text-outline flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by username or name"
              className="flex-1 bg-transparent text-label-md focus:outline-none placeholder:text-outline"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-primary text-white text-label-sm font-semibold cursor-pointer"
            >
              Search
            </button>
          </form>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-500/10 text-red-600 text-label-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {notice && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-label-sm">
              {notice}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-outline" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-label-md text-outline text-center py-10">No accounts match that.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => {
                const isSelf = u.id === myId
                // Mirrors the server's ladder so the UI never offers an action
                // that would come back a 403.
                const outranksMe = rank(u.role) <= myRank
                const canEdit = canAppoint && !isSelf && !outranksMe

                return (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/25"
                  >
                    <UserAvatar name={u.displayName} image={u.avatarUrl ?? undefined} size="sm" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                          href={`/profile/${u.username}`}
                          className="font-semibold text-on-surface hover:text-primary truncate"
                        >
                          {u.displayName}
                        </Link>
                        {ROLE_STYLE[u.role] && (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${ROLE_STYLE[u.role]}`}>
                            <ShieldCheck className="w-3 h-3" />
                            {u.role.replace('_', ' ')}
                          </span>
                        )}
                        {STATE_STYLE[u.state] && (
                          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${STATE_STYLE[u.state]}`}>
                            {u.state}
                          </span>
                        )}
                        {isSelf && <span className="text-[11px] text-outline">you</span>}
                      </div>
                      <p className="text-label-sm text-outline truncate">@{u.username}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {canEdit ? (
                        <select
                          value={u.role}
                          onChange={(e) => void changeRole(u, e.target.value)}
                          disabled={busyId !== null}
                          aria-label={`Role for ${u.displayName}`}
                          className="px-2 py-1 rounded-lg bg-surface-container text-label-sm cursor-pointer disabled:opacity-50"
                        >
                          {ROLES.map((r) => (
                            // Only roles strictly below the operator's own —
                            // the server refuses the rest anyway.
                            <option key={r} value={r} disabled={rank(r) <= myRank && r !== u.role}>
                              {r.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[11px] text-outline px-1">
                          {isSelf ? 'own role' : outranksMe ? 'outranks you' : ''}
                        </span>
                      )}

                      {busyId === u.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-outline" />
                      ) : u.state === 'active' ? (
                        <>
                          <button
                            onClick={() => void act(u, 'suspend')}
                            disabled={isSelf}
                            title="Suspend"
                            aria-label={`Suspend ${u.displayName}`}
                            className="p-1.5 rounded-lg text-outline hover:text-amber-600 hover:bg-surface-container disabled:opacity-30 cursor-pointer"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => void act(u, 'ban')}
                            disabled={isSelf}
                            title="Ban"
                            aria-label={`Ban ${u.displayName}`}
                            className="p-1.5 rounded-lg text-outline hover:text-red-600 hover:bg-surface-container disabled:opacity-30 cursor-pointer"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => void act(u, 'reinstate')}
                          title="Reinstate"
                          aria-label={`Reinstate ${u.displayName}`}
                          className="p-1.5 rounded-lg text-outline hover:text-emerald-600 hover:bg-surface-container cursor-pointer"
                        >
                          <Undo2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!canAppoint && (
            <p className="text-label-sm text-outline mt-4">
              Appointing staff requires an admin account.
            </p>
          )}
    </div>
  )
}
