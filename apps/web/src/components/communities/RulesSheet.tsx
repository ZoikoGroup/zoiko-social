'use client'

import { useState } from 'react'
import { X, ScrollText } from 'lucide-react'
import type { Community } from '@/lib/api'

interface RulesSheetProps {
  open: boolean
  community: Community
  onClose: () => void
  onAccept: () => void
}

export function RulesSheet({ open, community, onClose, onAccept }: RulesSheetProps): React.JSX.Element | null {
  const [agreed, setAgreed] = useState(false)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h2 className="flex items-center gap-2 font-headline text-headline-md text-on-surface">
            <ScrollText className="w-5 h-5 text-primary" />
            {community.name} · Rules
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-label-sm text-outline">Please review and accept before joining.</p>
          {community.rules.map((rule, i) => (
            <div key={rule.id} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-label-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-label-md text-on-surface">{rule.title}</p>
                {rule.body && <p className="text-label-sm text-on-surface-variant mt-0.5">{rule.body}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-outline-variant/20 p-5 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-label-sm text-on-surface">I agree to follow these rules</span>
          </label>
          <button
            onClick={onAccept}
            disabled={!agreed}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors cursor-pointer"
          >
            Agree &amp; Join
          </button>
        </div>
      </div>
    </div>
  )
}
