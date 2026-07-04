'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Lock, Users } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import { FollowButton, initialFollowState } from './FollowButton'
import { SkeletonRowList } from './Skeletons'
import { networkApi, ApiError, type FollowerItem } from '@/lib/api'

type ListTab = 'followers' | 'following'

interface FollowListModalProps {
  open: boolean
  userId: string
  /** Owner view enables "Remove" on followers (Instagram parity). */
  isOwnProfile: boolean
  initialTab: ListTab
  followersCount: number
  followingCount: number
  onClose: () => void
}


export function FollowListModal({
  open, userId, isOwnProfile, initialTab, followersCount, followingCount, onClose,
}: FollowListModalProps): React.JSX.Element | null {
  if (!open) return null
  return (
    <FollowList
      userId={userId}
      isOwnProfile={isOwnProfile}
      initialTab={initialTab}
      followersCount={followersCount}
      followingCount={followingCount}
      onClose={onClose}
    />
  )
}

function FollowList({
  userId, isOwnProfile, initialTab, followersCount, followingCount, onClose,
}: Omit<FollowListModalProps, 'open'>): React.JSX.Element {
  const [tab, setTab] = useState<ListTab>(initialTab)
  const [items, setItems] = useState<FollowerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [privateBlocked, setPrivateBlocked] = useState(false)
  const [removed, setRemoved] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    // Deferred so state resets don't run synchronously inside the effect body
    const timer = setTimeout(() => {
      if (cancelled) return
      setLoading(true)
      setPrivateBlocked(false)
      const fetcher = tab === 'followers' ? networkApi.getFollowers : networkApi.getFollowing
      fetcher(userId, 1, 50)
        .then((result) => {
          if (cancelled) return
          setItems(result.data)
        })
        .catch((e) => {
          if (cancelled) return
          if (e instanceof ApiError && e.code === 'PRIVATE_ACCOUNT') setPrivateBlocked(true)
        })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [tab, userId])

  async function removeFollower(item: FollowerItem): Promise<void> {
    try {
      await networkApi.removeFollower(item.id)
      setRemoved((prev) => new Set(prev).add(item.id))
    } catch {
      // keep row on failure
    }
  }

  const visible = items.filter((i) => !removed.has(i.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden">
        {/* Header + tabs */}
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="w-8" />
          <div className="flex gap-1 bg-surface-container rounded-lg p-1">
            {(['followers', 'following'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-label-sm font-semibold capitalize transition-colors cursor-pointer ${
                  tab === t ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-outline hover:text-on-surface'
                }`}
              >
                {t === 'followers' ? `${followersCount} followers` : `${followingCount} following`}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-3 mt-2">
          {loading ? (
            <SkeletonRowList count={5} />
          ) : privateBlocked ? (
            <div className="py-10 text-center">
              <Lock className="w-8 h-8 text-outline mx-auto mb-3" />
              <p className="text-label-md font-semibold text-on-surface">This account is private</p>
              <p className="text-label-sm text-outline mt-1">Follow this account to see their connections.</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="w-8 h-8 text-outline mx-auto mb-3" />
              <p className="text-label-sm text-outline">
                {tab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {visible.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-container transition-colors">
                  <Link href={`/profile/${item.username}`} onClick={onClose} className="flex items-center gap-3 flex-1 min-w-0">
                    <UserAvatar name={item.displayName} image={item.avatarUrl ?? undefined} size="md" verified={item.isVerified} />
                    <div className="min-w-0">
                      <p className="font-semibold text-label-md text-on-surface truncate">{item.username}</p>
                      <p className="text-[11px] text-outline truncate">{item.displayName}</p>
                    </div>
                  </Link>

                  {!item.isMe && (
                    isOwnProfile && tab === 'followers' ? (
                      <button
                        onClick={() => removeFollower(item)}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm hover:bg-surface-container-low transition-colors cursor-pointer flex-shrink-0"
                      >
                        Remove
                      </button>
                    ) : (
                      <FollowButton
                        userId={item.id}
                        initialState={initialFollowState(item)}
                        followsViewer={item.followsViewer}
                        className="px-3 py-1.5 flex-shrink-0"
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
