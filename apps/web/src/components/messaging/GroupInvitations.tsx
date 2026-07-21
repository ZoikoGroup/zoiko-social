'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Check, X } from 'lucide-react'
import { useMessaging } from '@/hooks/use-messaging'

interface GroupInvitationsProps {
  /** 'full' = card for the alerts page; 'compact' = slim banner for the Messages sidebar */
  variant?: 'full' | 'compact'
}

export function GroupInvitations({ variant = 'full' }: GroupInvitationsProps): React.JSX.Element | null {
  const router = useRouter()
  const { groupInvites, acceptGroupInvite, rejectGroupInvite } = useMessaging()
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  async function respond(groupId: string, action: 'accept' | 'reject'): Promise<void> {
    if (busyIds.has(groupId)) return
    setBusyIds((prev) => new Set(prev).add(groupId))
    try {
      if (action === 'accept') {
        const conversationId = await acceptGroupInvite(groupId)
        if (conversationId) router.push(`/messages?conversation=${conversationId}`)
      } else {
        await rejectGroupInvite(groupId)
      }
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(groupId)
        return next
      })
    }
  }

  if (groupInvites.length === 0) return null

  const compact = variant === 'compact'

  return (
    <section
      className={
        compact
          ? 'mx-2 mb-2 rounded-xl border border-outline-variant/30 bg-surface-container/50 p-3'
          : 'bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4'
      }
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className={compact ? 'w-4 h-4 text-primary' : 'w-5 h-5 text-primary'} />
        <h2 className={compact ? 'text-label-md font-semibold text-on-surface' : 'font-headline text-headline-md text-on-surface'}>
          Group invitations
        </h2>
        <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded-full">
          {groupInvites.length}
        </span>
      </div>

      <div className="space-y-2">
        {groupInvites.map((invite) => {
          const busy = busyIds.has(invite.groupId)
          const inviter = invite.invitedBy
          return (
            <div
              key={invite.groupId}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-container/60 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-md font-semibold text-on-surface truncate">
                  {invite.name ?? 'Group chat'}
                </p>
                <p className="text-[11.5px] text-outline truncate">
                  {inviter ? `${inviter.displayName} invited you` : 'You were invited'}
                  {invite.memberCount > 0 ? ` · ${invite.memberCount} member${invite.memberCount === 1 ? '' : 's'}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => void respond(invite.groupId, 'reject')}
                  disabled={busy}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-outline hover:text-error hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Decline"
                  aria-label="Decline invitation"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => void respond(invite.groupId, 'accept')}
                  disabled={busy}
                  className="flex items-center justify-center gap-1 px-3 h-8 rounded-full bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  title="Accept"
                >
                  <Check className="w-3.5 h-3.5" />
                  Join
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
