'use client'

import { useState } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  body: React.ReactNode
  confirmLabel: string
  onConfirm: () => Promise<void>
  onClose: () => void
  danger?: boolean
}

// Generic "are you sure" gate for actions with real consequences (blocking,
// leaving a community, etc.) — reversible, low-stakes actions like muting
// don't need this and should just fire directly.
export function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose, danger = true }: ConfirmDialogProps): React.JSX.Element {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm(): Promise<void> {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await onConfirm()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[130] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-2">
          {danger && (
            <div className="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
              <TriangleAlert className="w-5 h-5 text-error" />
            </div>
          )}
          <div>
            <h2 className="font-headline text-headline-sm font-bold text-on-surface">{title}</h2>
            <div className="text-label-sm text-outline mt-1">{body}</div>
          </div>
        </div>
        {error && <p className="text-label-sm text-error mt-2">{error}</p>}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={busy}
            className="flex-1 py-2.5 rounded-xl border border-outline-variant/40 text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleConfirm()}
            disabled={busy}
            className={`flex-1 py-2.5 rounded-xl text-label-md font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
              danger ? 'bg-error text-on-error hover:bg-error/90' : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
