'use client'

import { useCallback, useEffect, useState } from 'react'
import { MailQuestion, Check, X, Loader2, ChevronRight } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { messagingApi, type IncomingMessageRequest } from '@/lib/messaging-api'
import { useMessaging } from '@/hooks/use-messaging'

/**
 * Incoming message requests — DMs from people whose messages the recipient's
 * privacy settings hold back.
 *
 * The whole request flow existed on the API (send, list, accept, reject) with no
 * caller, which meant these messages went nowhere a member could ever see them:
 * the sender believed they had sent a message and the recipient was never told
 * one was waiting. Accepting promotes the request into a normal conversation.
 *
 * Renders nothing when there is nothing pending, so the inbox stays quiet.
 */
export function MessageRequestsPanel(): React.JSX.Element | null {
  const { retryFetchConversations } = useMessaging()
  const [requests, setRequests] = useState<IncomingMessageRequest[]>([])
  const [expanded, setExpanded] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(() => {
    messagingApi.requests()
      .then((r) => setRequests(r.incoming))
      .catch(() => { /* absence of requests is the common case */ })
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function act(id: string, accept: boolean): Promise<void> {
    setBusyId(id)
    try {
      if (accept) {
        await messagingApi.acceptRequest(id)
        // Accepting creates the conversation, so the list must come back fresh.
        await retryFetchConversations()
      } else {
        await messagingApi.rejectRequest(id)
      }
      setRequests((prev) => prev.filter((r) => r.id !== id))
    } catch {
      // Leave the row in place — a failed accept should not look like success.
    } finally {
      setBusyId(null)
    }
  }

  if (requests.length === 0) return null

  return (
    <div className="mx-2 my-1.5 rounded-2xl bg-secondary/5 border border-secondary/20 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-secondary/5 transition-colors cursor-pointer"
      >
        <MailQuestion className="w-4 h-4 text-secondary flex-shrink-0" />
        <span className="flex-1 text-left text-[13px] font-semibold text-on-surface">
          {requests.length} message request{requests.length === 1 ? '' : 's'}
        </span>
        <ChevronRight className={`w-4 h-4 text-outline transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-2 pb-2 space-y-1">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container-lowest">
              <UserAvatar
                name={r.sender.displayName}
                image={r.sender.avatarUrl ?? undefined}
                size="sm"
                verified={r.sender.isVerified}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-on-surface truncate">{r.sender.displayName}</p>
                <p className="text-[11px] text-outline truncate">{r.message ?? `@${r.sender.username}`}</p>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {busyId === r.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-outline" />
                ) : (
                  <>
                    <button
                      onClick={() => void act(r.id, true)}
                      aria-label={`Accept message request from ${r.sender.displayName}`}
                      title="Accept"
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => void act(r.id, false)}
                      aria-label={`Decline message request from ${r.sender.displayName}`}
                      title="Decline"
                      className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
