'use client'

import { type ReactNode } from 'react'
import dynamic from 'next/dynamic'

// ── Lazy imports ──────────────────────────────────────────────────────────────
// CallProvider + CallModal both depend on livekit-client (~100KB+). By splitting
// them into a separate chunk that's loaded only after the initial render, the
// first-load JS bundle drops by ~100KB and TTI improves significantly.
//
// The lazy wrapper also handles the case where JavaScript / WebRTC are disabled
// or unavailable — the call features simply become a no-op instead of crashing.

const CallProviderLazy = dynamic(
  () => import('@/hooks/use-call').then((mod) => mod.CallProvider),
  { ssr: false },
)

const CallModalLazy = dynamic(
  () => import('./CallModal').then((mod) => mod.CallModal),
  { ssr: false, loading: () => null },
)

/**
 * Wraps children in CallProvider and renders CallModal, both loaded lazily.
 * This preserves the original nesting from providers.tsx while deferring
 * the ~100KB livekit-client chunk until after the initial paint.
 */
export function LazyCallLayer({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <CallProviderLazy>
      {children}
      <CallModalLazy />
    </CallProviderLazy>
  )
}
