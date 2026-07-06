'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { communitiesApi, type Community } from '@/lib/api'
import { RulesSheet } from './RulesSheet'

type JoinState = 'none' | 'joined' | 'requested'

function initialState(viewerStatus: string | null): JoinState {
  if (viewerStatus === 'active') return 'joined'
  if (viewerStatus === 'pending') return 'requested'
  return 'none'
}

interface JoinButtonProps {
  community: Community
  className?: string
  onChange?: (status: JoinState) => void
}

export function JoinButton({ community, className = '', onChange }: JoinButtonProps): React.JSX.Element {
  const [state, setState] = useState<JoinState>(initialState(community.viewerStatus))
  const [busy, setBusy] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)

  async function doJoin(acceptRules?: boolean): Promise<void> {
    setBusy(true)
    try {
      const result = await communitiesApi.join(community.id, acceptRules)
      const next: JoinState = result.status === 'joined' ? 'joined' : result.status === 'requested' ? 'requested' : state
      setState(next)
      onChange?.(next)
    } catch {
      /* invite-only / banned surface via disabled paths */
    } finally {
      setBusy(false)
    }
  }

  async function handleClick(): Promise<void> {
    if (busy) return
    if (state === 'joined') {
      setBusy(true)
      try {
        await communitiesApi.leave(community.id)
        setState('none')
        onChange?.('none')
      } catch { /* owner-must-transfer */ } finally {
        setBusy(false)
      }
      return
    }
    if (state === 'requested') {
      setBusy(true)
      try {
        await communitiesApi.leave(community.id) // cancels the pending request
        setState('none')
        onChange?.('none')
      } catch { /* ignore */ } finally {
        setBusy(false)
      }
      return
    }
    // Joining — gate on rules if the community has any
    if (community.rules.length > 0) {
      setRulesOpen(true)
      return
    }
    await doJoin()
  }

  const label = state === 'joined' ? 'Joined' : state === 'requested' ? 'Requested' : 'Join'
  const outlined = state === 'joined' || state === 'requested'

  return (
    <>
      <RulesSheet
        open={rulesOpen}
        community={community}
        onClose={() => setRulesOpen(false)}
        onAccept={() => { setRulesOpen(false); void doJoin(true) }}
      />
      <button
        onClick={handleClick}
        disabled={busy}
        className={`rounded-lg text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5 ${
          outlined
            ? 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
            : 'bg-primary text-white hover:bg-primary/90'
        } ${className}`}
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : state === 'joined' ? <><Check className="w-3.5 h-3.5" />{label}</> : label}
      </button>
    </>
  )
}
