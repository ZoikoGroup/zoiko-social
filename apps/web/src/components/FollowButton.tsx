'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { networkApi } from '@/lib/api'

/**
 * Instagram-parity follow button state machine.
 *
 *   Follow        → you don't follow them
 *   Follow Back   → they follow you, you don't follow them
 *   Following     → you follow them (click = unfollow)
 *   Requested     → pending request to a private account (click = cancel)
 *
 * Transitions:
 *   Follow / Follow Back  --click--> Following (public) | Requested (private)
 *   Following             --click--> Follow Back (if they follow you) | Follow
 *   Requested             --click--> Follow Back (if they follow you) | Follow
 */

export type FollowButtonState = 'none' | 'follow_back' | 'following' | 'requested'

export function initialFollowState(input: {
  viewerFollows?: boolean | undefined
  viewerRequested?: boolean | undefined
  followsViewer?: boolean | undefined
}): FollowButtonState {
  if (input.viewerFollows) return 'following'
  if (input.viewerRequested) return 'requested'
  if (input.followsViewer) return 'follow_back'
  return 'none'
}

interface FollowButtonProps {
  userId: string
  initialState: FollowButtonState
  /** They follow the viewer — the state to fall back to after unfollow/cancel */
  followsViewer?: boolean
  className?: string
  onStateChange?: (state: FollowButtonState) => void
}

const LABELS: Record<FollowButtonState, string> = {
  none: 'Follow',
  follow_back: 'Follow Back',
  following: 'Following',
  requested: 'Requested',
}

export function FollowButton({
  userId, initialState, followsViewer = initialState === 'follow_back', className = '', onStateChange,
}: FollowButtonProps): React.JSX.Element {
  const [state, setState] = useState<FollowButtonState>(initialState)
  const [busy, setBusy] = useState(false)

  const restingState: FollowButtonState = followsViewer ? 'follow_back' : 'none'

  function transition(next: FollowButtonState): void {
    setState(next)
    onStateChange?.(next)
  }

  async function handleClick(): Promise<void> {
    if (busy) return
    setBusy(true)
    try {
      if (state === 'none' || state === 'follow_back') {
        const result = await networkApi.follow(userId)
        if (result.status === 'request_sent' || result.status === 'request_pending') {
          transition('requested')
        } else {
          transition('following')
        }
      } else if (state === 'following') {
        await networkApi.unfollow(userId)
        transition(restingState)
      } else if (state === 'requested') {
        await networkApi.cancelRequest(userId)
        transition(restingState)
      }
    } catch {
      // Keep the current state on failure
    } finally {
      setBusy(false)
    }
  }

  const isOutlined = state === 'following' || state === 'requested'

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`rounded-lg text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5 ${
        isOutlined
          ? 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          : 'bg-primary text-white hover:bg-primary/90'
      } ${className}`}
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : LABELS[state]}
    </button>
  )
}
